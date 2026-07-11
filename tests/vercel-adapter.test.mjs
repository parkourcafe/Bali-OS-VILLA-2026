import { test } from 'node:test';
import assert from 'node:assert/strict';
import vercelLead from '../api/lead.mjs';

function mockReq({ method, headers, body }) {
  // Emulates a Vercel request. When body is preset, the stream branch is unused;
  // otherwise 'end' fires immediately so readRawBody resolves (empty stream).
  return {
    method, headers, body,
    on(evt, cb) { if (evt === 'end') cb(); return this; },
  };
}

function mockRes() {
  return {
    statusCode: 0, headers: {}, body: '',
    status(c) { this.statusCode = c; return this; },
    setHeader(k, v) { this.headers[k] = v; },
    send(b) { this.body = b; return this; },
  };
}

test('vercel adapter rejects GET like the shared handler', async () => {
  const res = mockRes();
  await vercelLead(mockReq({ method: 'GET', headers: {} }), res);
  assert.equal(res.statusCode, 405);
  assert.equal(JSON.parse(res.body).code, 'METHOD_NOT_ALLOWED');
});

test('vercel adapter handles a pre-parsed JSON body (Vercel default)', async () => {
  delete process.env.APPS_SCRIPT_WEBHOOK_URL; // no webhook → controlled WEBHOOK_UNAVAILABLE, never a fake success
  const res = mockRes();
  const body = {
    event: 'score_completed',
    idempotencyKey: '11111111-2222-4333-8444-555555555555',
    profile: { company: 'Adapter Co', publicUrl: '', villaCount: 'five_to_nine', whoAnswers: 'manager',
      channels: ['whatsapp'], otherChannel: '', headache: '', otherHeadache: '' },
    answers: { channelManagement: 'centralized', afterHours: 'rotation', responseTime: 'under_5m',
      qualification: 'structured', followUp: 'scheduled', escalation: 'documented', visibility: 'live_dashboard' },
    contact: { name: 'A', whatsapp: '+6281234567890', email: '' },
    clientMeta: { startedAt: '2026-01-01T00:00:00Z', submittedAt: '2026-01-01T00:02:00Z', landingPath: '/', referrer: '', utm: {} },
    honeypot: '',
  };
  await vercelLead(mockReq({ method: 'POST', headers: { 'content-type': 'application/json' }, body }), res);
  // Passed validation & scoring; failed only at the (unconfigured) webhook → proves the adapter reaches the real handler.
  assert.equal(res.statusCode, 503);
  assert.equal(JSON.parse(res.body).code, 'WEBHOOK_UNAVAILABLE');
});
