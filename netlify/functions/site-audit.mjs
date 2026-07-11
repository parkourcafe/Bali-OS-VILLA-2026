/**
 * Netlify parity wrapper for the Instant Website Check.
 * Reuses the same core as the Vercel handler (lib/site-audit.mjs).
 * Endpoint: /.netlify/functions/site-audit?url=...  (aliased to /api/site-audit)
 */
import { auditSite, AuditError } from '../../lib/site-audit.mjs';

export async function handler(event) {
  const json = (statusCode, obj) => ({ statusCode, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' }, body: JSON.stringify(obj) });
  if (event.httpMethod !== 'GET' && event.httpMethod !== 'POST') return json(405, { ok: false, code: 'METHOD_NOT_ALLOWED', message: 'Use GET or POST.' });

  let url = '';
  try {
    if (event.httpMethod === 'GET') url = (event.queryStringParameters && event.queryStringParameters.url) || '';
    else url = (JSON.parse(event.body || '{}').url) || '';
  } catch { /* empty-url error below */ }

  try {
    const report = await auditSite(url, { pagespeedKey: process.env.PAGESPEED_API_KEY || '' });
    report.checkedAt = new Date().toISOString();
    return json(200, { ok: true, report });
  } catch (e) {
    if (e instanceof AuditError) return json(e.code === 'UNREACHABLE' ? 502 : 400, { ok: false, code: e.code, message: e.message });
    return json(500, { ok: false, code: 'INTERNAL_ERROR', message: 'Something went wrong running the check.' });
  }
}
