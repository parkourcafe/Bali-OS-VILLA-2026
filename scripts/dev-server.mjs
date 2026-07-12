/**
 * Local dev/QA server. NOT used in production (Netlify serves the real site).
 *
 * - Serves static files with the same clean routes as netlify.toml.
 * - Routes POST /api/lead through the REAL Netlify function handler.
 * - Provides POST /mock-webhook that emulates the Apps Script contract
 *   (idempotency, upsert by leadId, NOT_FOUND) with an in-memory "sheet".
 * - GET /mock-sheet returns the in-memory rows for E2E assertions.
 *
 * Usage: node scripts/dev-server.mjs [port]   (default 8788)
 */
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { join, extname, normalize } from 'node:path';
import { handler } from '../netlify/functions/lead.mjs';
import { handler as siteAudit } from '../netlify/functions/site-audit.mjs';
import { handler as demoRequest } from '../netlify/functions/demo-request.mjs';

const PORT = Number(process.argv[2] || 8788);
const ROOT = new URL('..', import.meta.url).pathname;

process.env.APPS_SCRIPT_WEBHOOK_URL = process.env.FAIL_WEBHOOK === '1'
  ? 'http://127.0.0.1:9/unreachable' // Flow D: simulate webhook outage
  : `http://127.0.0.1:${PORT}/mock-webhook`;
process.env.APPS_SCRIPT_SHARED_SECRET = 'dev-secret';
process.env.IP_HASH_SALT = 'dev-salt';
delete process.env.ALLOWED_ORIGIN;

const MIME = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css', '.js': 'text/javascript',
  '.mjs': 'text/javascript', '.svg': 'image/svg+xml', '.png': 'image/png', '.json': 'application/json',
};

/** In-memory Apps Script emulation */
const sheet = new Map(); // leadId -> row object
const demoSheet = new Map(); // requestId -> demo request row
const idem = new Map();  // idempotencyKey -> response

function mockWebhook(body) {
  const { secret, payload } = body;
  if (secret !== 'dev-secret') return { ok: false, code: 'VALIDATION_ERROR' };
  const prior = idem.get(payload.idempotencyKey);
  if (prior) return prior;

  let out;
  if (payload.event === 'score_completed') {
    sheet.set(payload.leadId, {
      leadId: payload.leadId,
      createdAt: new Date().toISOString(),
      company: payload.profile.company,
      whatsapp: payload.contact.whatsapp,
      score: payload.result.score,
      gate: payload.result.gate,
      status: 'Instant score completed',
      auditRequested: '',
      playbookRequested: '',
      suspicious: payload.suspicious ? 'YES' : '',
    });
    out = { ok: true, leadId: payload.leadId };
  } else if (payload.event === 'audit_requested') {
    const row = sheet.get(payload.leadId);
    if (!row) return { ok: false, code: 'NOT_FOUND' };
    row.auditRequested = 'YES';
    row.authorityConfirmed = 'YES';
    row.whatsapp = payload.whatsapp;
    if (row.status === 'Instant score completed') row.status = 'Audit requested';
    out = { ok: true, leadId: payload.leadId };
  } else if (payload.event === 'playbook_requested') {
    const row = sheet.get(payload.leadId);
    if (!row) return { ok: false, code: 'NOT_FOUND' };
    row.playbookRequested = 'YES';
    if (row.status === 'Instant score completed') row.status = 'Playbook requested';
    out = { ok: true, leadId: payload.leadId };
  } else if (payload.event === 'demo_requested') {
    demoSheet.set(payload.requestId, {
      requestId: payload.requestId,
      createdAt: new Date().toISOString(),
      name: payload.name,
      company: payload.company,
      role: payload.role,
      whatsapp: payload.whatsapp,
      email: payload.email,
      villaCount: payload.villaCount,
      currentSystem: payload.currentSystem,
      mainSource: payload.mainSource,
      preferredDate: payload.preferredDate,
      timezone: payload.timezone,
      comment: payload.comment,
      source: payload.source,
      utmCampaign: (payload.clientMeta?.utm || {}).campaign || '',
      status: 'Demo requested',
    });
    out = { ok: true, requestId: payload.requestId };
  } else {
    out = { ok: false, code: 'VALIDATION_ERROR' };
  }
  if (out.ok) idem.set(payload.idempotencyKey, out);
  console.log(`[mock-webhook] ${payload.event} → ${JSON.stringify(out)} (rows: ${sheet.size})`);
  return out;
}

async function readBody(req) {
  const chunks = [];
  for await (const c of req) chunks.push(c);
  return Buffer.concat(chunks).toString('utf8');
}

createServer(async (req, res) => {
  const url = new URL(req.url, `http://127.0.0.1:${PORT}`);
  try {
    if (url.pathname === '/mock-webhook' && req.method === 'POST') {
      const out = mockWebhook(JSON.parse(await readBody(req)));
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify(out));
    }
    if (url.pathname === '/mock-sheet') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify([...sheet.values()]));
    }
    if (url.pathname === '/mock-demo-sheet') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      return res.end(JSON.stringify([...demoSheet.values()]));
    }
    if (url.pathname === '/api/demo-request') {
      const body = await readBody(req);
      const out = await demoRequest({
        httpMethod: req.method,
        headers: Object.fromEntries(Object.entries(req.headers)),
        body,
      });
      res.writeHead(out.statusCode, out.headers);
      return res.end(out.body);
    }
    if (url.pathname === '/api/lead') {
      const body = await readBody(req);
      const out = await handler({
        httpMethod: req.method,
        headers: Object.fromEntries(Object.entries(req.headers)),
        body,
      });
      res.writeHead(out.statusCode, out.headers);
      return res.end(out.body);
    }
    if (url.pathname === '/api/site-audit') {
      const body = await readBody(req);
      const out = await siteAudit({
        httpMethod: req.method,
        headers: Object.fromEntries(Object.entries(req.headers)),
        queryStringParameters: Object.fromEntries(url.searchParams),
        body,
      });
      res.writeHead(out.statusCode, out.headers);
      return res.end(out.body);
    }

    // Static with clean routes
    let path = url.pathname;
    if (path.endsWith('/')) path += 'index.html';
    if (!extname(path)) path += '/index.html';
    const file = normalize(join(ROOT, path));
    if (!file.startsWith(normalize(ROOT))) { res.writeHead(403); return res.end(); }
    try {
      const data = await readFile(file);
      res.writeHead(200, { 'Content-Type': MIME[extname(file)] || 'application/octet-stream' });
      return res.end(data);
    } catch {
      res.writeHead(404, { 'Content-Type': 'text/plain' });
      return res.end('Not found');
    }
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ ok: false, code: 'INTERNAL_ERROR' }));
  }
}).listen(PORT, () => console.log(`Dev server: http://127.0.0.1:${PORT} (mock webhook active)`));
