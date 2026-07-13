/**
 * Tests for POST /api/feedback (netlify/functions/feedback.mjs).
 * Covers rating bounds, compliant routing (recovery vs promote), the
 * non-gating rule (review link returned on both routes), honeypot, consent,
 * and the no-fake-success contract on webhook failure.
 */
import { test, describe, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { handler, validateFeedback, normalizeWhatsapp } from '../netlify/functions/feedback.mjs';

const IDEM = '7a1b2c3d-4e5f-4a6b-8c7d-9e0f1a2b3c4d';
function valid(over = {}) {
  return {
    idempotencyKey: IDEM, honeypot: '', brand: 'Gravity Bali', villa: 'Villa Kelanah',
    guestName: 'Alex', stage: 'checkout', rating: 5, comment: 'Loved it',
    whatsapp: '', consent: false, source: 'feedback:checkout',
    clientMeta: { landingPath: '/feedback/', referrer: '', utm: {} },
    ...over,
  };
}
function post(body, headers = {}) {
  return { httpMethod: 'POST', headers: { 'content-type': 'application/json', ...headers }, body: JSON.stringify(body) };
}

describe('validateFeedback', () => {
  test('accepts a valid promoter with no contact', () => {
    const { errors, clean } = validateFeedback(valid());
    assert.equal(errors, null);
    assert.equal(clean.rating, 5);
    assert.equal(clean.whatsapp, '');
  });
  test('rating must be an integer 1..5', () => {
    for (const r of [0, 6, 3.5, 'five', null]) {
      assert.ok(validateFeedback(valid({ rating: r })).errors.includes('rating'), `rating ${r}`);
    }
    for (const r of [1, 2, 3, 4, 5]) assert.equal(validateFeedback(valid({ rating: r })).errors, null);
  });
  test('whatsapp optional but validated; consent required only with a number', () => {
    assert.equal(validateFeedback(valid({ whatsapp: '', consent: false })).errors, null);
    assert.ok(validateFeedback(valid({ whatsapp: '+62 812 3', consent: true })).errors.includes('whatsapp'));
    assert.ok(validateFeedback(valid({ whatsapp: '+62 812 3456 7890', consent: false })).errors.includes('consent'));
    assert.equal(validateFeedback(valid({ whatsapp: '+62 812 3456 7890', consent: true })).errors, null);
  });
  test('normalizeWhatsapp: empty -> "", junk -> null', () => {
    assert.equal(normalizeWhatsapp(''), '');
    assert.equal(normalizeWhatsapp('0062 812-3456-7890'), '+6281234567890');
    assert.equal(normalizeWhatsapp('abc'), null);
  });
});

describe('handler routing + contract', () => {
  let server, received, mode;
  beforeEach(async () => {
    received = []; mode = 'ok';
    server = createServer(async (req, res) => {
      let d = ''; for await (const c of req) d += c; received.push(JSON.parse(d));
      res.writeHead(200, { 'Content-Type': 'application/json' });
      if (mode === 'ok') res.end(JSON.stringify({ ok: true, requestId: JSON.parse(d).payload.requestId }));
      else res.end('nope');
    });
    await new Promise((r) => server.listen(0, '127.0.0.1', r));
    process.env.APPS_SCRIPT_WEBHOOK_URL = `http://127.0.0.1:${server.address().port}/`;
    process.env.APPS_SCRIPT_SHARED_SECRET = 'test-secret';
    process.env.GOOGLE_REVIEW_URL = 'https://search.google.com/local/writereview?placeid=TEST';
    delete process.env.ALLOWED_ORIGIN;
  });
  afterEach(async () => {
    await new Promise((r) => server.close(r));
    delete process.env.APPS_SCRIPT_WEBHOOK_URL; delete process.env.APPS_SCRIPT_SHARED_SECRET; delete process.env.GOOGLE_REVIEW_URL;
  });

  test('rating 5 -> route promote, review link returned', async () => {
    const res = await handler(post(valid({ rating: 5 })));
    const b = JSON.parse(res.body);
    assert.equal(res.statusCode, 200);
    assert.equal(b.route, 'promote');
    assert.match(b.reviewUrl, /writereview/);
    assert.equal(received[0].payload.event, 'guest_feedback');
    assert.equal(received[0].payload.route, 'promote');
  });
  test('rating 2 -> route recovery, but review link STILL returned (non-gating)', async () => {
    const res = await handler(post(valid({ rating: 2, comment: 'AC broken' })));
    const b = JSON.parse(res.body);
    assert.equal(b.route, 'recovery');
    assert.match(b.reviewUrl, /writereview/, 'unhappy guests are not blocked from public review');
  });
  test('rating 3 is recovery; rating 4 is promote (threshold)', async () => {
    assert.equal(JSON.parse((await handler(post(valid({ rating: 3 })))).body).route, 'recovery');
    assert.equal(JSON.parse((await handler(post(valid({ idempotencyKey: '11111111-1111-4111-8111-111111111111', rating: 4 })))).body).route, 'promote');
  });
  test('honeypot -> spam rejected, webhook untouched', async () => {
    const res = await handler(post(valid({ honeypot: 'bot' })));
    assert.equal(JSON.parse(res.body).code, 'SPAM_REJECTED');
    assert.equal(received.length, 0);
  });
  test('bad rating -> 400 with field list, no webhook call', async () => {
    const res = await handler(post(valid({ rating: 9 })));
    assert.equal(res.statusCode, 400);
    assert.ok(JSON.parse(res.body).fields.includes('rating'));
    assert.equal(received.length, 0);
  });
  test('webhook failure -> 503, no fake success', async () => {
    mode = 'garbage';
    const res = await handler(post(valid()));
    assert.equal(res.statusCode, 503);
    assert.equal(JSON.parse(res.body).ok, false);
  });
  test('no GOOGLE_REVIEW_URL configured -> reviewUrl empty (client falls back gracefully)', async () => {
    delete process.env.GOOGLE_REVIEW_URL;
    const res = await handler(post(valid({ rating: 5 })));
    assert.equal(JSON.parse(res.body).reviewUrl, '');
  });
  test('GET -> 405', async () => {
    assert.equal((await handler({ httpMethod: 'GET', headers: {} })).statusCode, 405);
  });
});
