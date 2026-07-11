/**
 * Vercel function: GET/POST /api/site-audit?url=...
 * Returns the Instant Website Check report as JSON.
 *
 * Env: PAGESPEED_API_KEY (optional but recommended — without it Google may
 * rate-limit; the fetch-based checks still run either way).
 */
import { auditSite, AuditError } from '../lib/site-audit.mjs';

export default async function handler(req, res) {
  const send = (code, obj) => { res.status(code); res.setHeader('content-type', 'application/json'); res.setHeader('cache-control', 'no-store'); res.send(JSON.stringify(obj)); };
  if (req.method !== 'GET' && req.method !== 'POST') return send(405, { ok: false, code: 'METHOD_NOT_ALLOWED', message: 'Use GET or POST.' });

  let url = '';
  try {
    if (req.method === 'GET') {
      url = (req.query && req.query.url) || new URL(req.url, 'http://x').searchParams.get('url') || '';
    } else {
      const body = typeof req.body === 'object' && req.body ? req.body : JSON.parse(await readRaw(req) || '{}');
      url = body.url || '';
    }
  } catch { /* fall through to empty-url error */ }

  try {
    const report = await auditSite(url, { pagespeedKey: process.env.PAGESPEED_API_KEY || '' });
    report.checkedAt = new Date().toISOString();
    return send(200, { ok: true, report });
  } catch (e) {
    if (e instanceof AuditError) return send(e.code === 'UNREACHABLE' ? 502 : 400, { ok: false, code: e.code, message: e.message });
    return send(500, { ok: false, code: 'INTERNAL_ERROR', message: 'Something went wrong running the check.' });
  }
}

function readRaw(req) {
  if (typeof req.body === 'string') return Promise.resolve(req.body);
  return new Promise((resolve) => { let d = ''; req.on('data', (c) => (d += c)); req.on('end', () => resolve(d)); req.on('error', () => resolve('')); });
}
