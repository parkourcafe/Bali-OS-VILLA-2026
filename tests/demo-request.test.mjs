/**
 * Tests for POST /api/demo-request (netlify/functions/demo-request.mjs):
 * validation, honeypot, consent, webhook contract — including the hard rule
 * that a webhook failure must NEVER produce a fake success.
 */
import { test, describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { handler, validateDemoRequest, normalizeWhatsapp } from '../netlify/functions/demo-request.mjs';

const IDEM = '3f2f1a10-4b5c-4d6e-8f90-a1b2c3d4e5f6';

function validBody(overrides = {}) {
  return {
    idempotencyKey: IDEM,
    honeypot: '',
    name: 'Made Tester',
    company: 'Example Villa Co',
    role: 'Reservations Manager',
    whatsapp: '+62 812 3456 7890',
    email: 'reservations@example.com',
    villaCount: '10-19',
    currentSystem: 'WhatsApp + spreadsheet',
    mainSource: 'Website + Instagram',
    preferredDate: '2026-07-20',
    timezone: 'Asia/Makassar (WITA)',
    comment: 'Prefer afternoon.',
    consent: true,
    source: 'audit-microsite',
    clientMeta: {
      startedAt: '2026-07-12T10:00:00.000Z',
      submittedAt: '2026-07-12T10:02:00.000Z',
      landingPath: '/audit/example/',
      referrer: '',
      utm: { source: 'whatsapp', medium: 'outreach', campaign: 'audit-example', content: '', term: '' },
    },
    ...overrides,
  };
}

function postEvent(body, headers = {}) {
  return {
    httpMethod: 'POST',
    headers: { 'content-type': 'application/json', ...headers },
    body: JSON.stringify(body),
  };
}

describe('validateDemoRequest', () => {
  test('accepts a fully valid payload and normalizes whatsapp', () => {
    const { errors, clean } = validateDemoRequest(validBody());
    assert.equal(errors, null);
    assert.equal(clean.whatsapp, '+6281234567890');
    assert.equal(clean.company, 'Example Villa Co');
    assert.equal(clean.clientMeta.utm.campaign, 'audit-example');
  });

  test('requires name, company, role, whatsapp, villaCount, consent', () => {
    const { errors } = validateDemoRequest(validBody({
      name: '', company: '', role: '', whatsapp: 'nope', villaCount: 'lots', consent: false,
    }));
    for (const f of ['name', 'company', 'role', 'whatsapp', 'villaCount', 'consent']) {
      assert.ok(errors.includes(f), `expected error for ${f}`);
    }
  });

  test('email is optional but must be valid when present', () => {
    assert.equal(validateDemoRequest(validBody({ email: '' })).errors, null);
    assert.ok(validateDemoRequest(validBody({ email: 'not-an-email' })).errors.includes('email'));
  });

  test('rejects bad preferredDate and oversized comment', () => {
    assert.ok(validateDemoRequest(validBody({ preferredDate: 'whenever' })).errors.includes('preferredDate'));
    assert.ok(validateDemoRequest(validBody({ comment: 'x'.repeat(1001) })).errors.includes('comment'));
  });

  test('normalizeWhatsapp handles 00-prefix and separators', () => {
    assert.equal(normalizeWhatsapp('0062 812-3456-7890'), '+6281234567890');
    assert.equal(normalizeWhatsapp('081234'), null);
  });
});

describe('handler contract', () => {
  let server;
  let webhookMode = 'ok';
  let received = [];

  beforeEach(async () => {
    received = [];
    webhookMode = 'ok';
    server = createServer(async (req, res) => {
      let data = '';
      for await (const c of req) data += c;
      received.push(JSON.parse(data));
      res.writeHead(200, { 'Content-Type': 'application/json' });
      if (webhookMode === 'ok') {
        res.end(JSON.stringify({ ok: true, requestId: JSON.parse(data).payload.requestId }));
      } else if (webhookMode === 'rate') {
        res.end(JSON.stringify({ ok: false, code: 'RATE_LIMITED' }));
      } else {
        res.end('garbage');
      }
    });
    await new Promise((r) => server.listen(0, '127.0.0.1', r));
    process.env.APPS_SCRIPT_WEBHOOK_URL = `http://127.0.0.1:${server.address().port}/`;
    process.env.APPS_SCRIPT_SHARED_SECRET = 'test-secret';
    delete process.env.ALLOWED_ORIGIN;
  });

  afterEach(async () => {
    await new Promise((r) => server.close(r));
    delete process.env.APPS_SCRIPT_WEBHOOK_URL;
    delete process.env.APPS_SCRIPT_SHARED_SECRET;
  });

  test('happy path forwards demo_requested and returns ok with requestId', async () => {
    const res = await handler(postEvent(validBody()));
    assert.equal(res.statusCode, 200);
    const body = JSON.parse(res.body);
    assert.equal(body.ok, true);
    assert.match(body.requestId, /^[0-9a-f-]{36}$/i);
    assert.equal(received.length, 1);
    assert.equal(received[0].payload.event, 'demo_requested');
    assert.equal(received[0].payload.whatsapp, '+6281234567890');
    assert.equal(received[0].secret, 'test-secret');
  });

  test('honeypot content is rejected as spam without touching the webhook', async () => {
    const res = await handler(postEvent(validBody({ honeypot: 'i am a bot' })));
    assert.equal(res.statusCode, 400);
    assert.equal(JSON.parse(res.body).code, 'SPAM_REJECTED');
    assert.equal(received.length, 0);
  });

  test('validation failure lists fields and never reaches the webhook', async () => {
    const res = await handler(postEvent(validBody({ consent: false, whatsapp: 'abc' })));
    assert.equal(res.statusCode, 400);
    const body = JSON.parse(res.body);
    assert.equal(body.code, 'VALIDATION_ERROR');
    assert.ok(body.fields.includes('consent'));
    assert.ok(body.fields.includes('whatsapp'));
    assert.equal(received.length, 0);
  });

  test('webhook garbage response → 503 WEBHOOK_UNAVAILABLE, no fake success', async () => {
    webhookMode = 'garbage';
    const res = await handler(postEvent(validBody()));
    assert.equal(res.statusCode, 503);
    const body = JSON.parse(res.body);
    assert.equal(body.ok, false);
    assert.equal(body.code, 'WEBHOOK_UNAVAILABLE');
  });

  test('webhook down (no env) → 503, no fake success', async () => {
    delete process.env.APPS_SCRIPT_WEBHOOK_URL;
    const res = await handler(postEvent(validBody()));
    assert.equal(res.statusCode, 503);
    assert.equal(JSON.parse(res.body).ok, false);
  });

  test('RATE_LIMITED from webhook maps to 429', async () => {
    webhookMode = 'rate';
    const res = await handler(postEvent(validBody()));
    assert.equal(res.statusCode, 429);
    assert.equal(JSON.parse(res.body).code, 'RATE_LIMITED');
  });

  test('disallowed origin is rejected when ALLOWED_ORIGIN is set', async () => {
    process.env.ALLOWED_ORIGIN = 'https://allowed.example';
    const res = await handler(postEvent(validBody(), { origin: 'https://evil.example' }));
    assert.equal(res.statusCode, 403);
    assert.equal(received.length, 0);
  });

  test('GET is not allowed', async () => {
    const res = await handler({ httpMethod: 'GET', headers: {} });
    assert.equal(res.statusCode, 405);
  });
});
