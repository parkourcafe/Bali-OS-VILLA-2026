import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  handler, normalizeWhatsapp, sheetSafe, isSameOrigin,
  validateScoreCompleted, validateAuditRequested, validatePlaybookRequested,
} from '../netlify/functions/lead.mjs';

const UUID = '3f2c1a10-1234-4abc-9def-0123456789ab';

function validScoreBody(overrides = {}) {
  return {
    event: 'score_completed',
    idempotencyKey: UUID,
    profile: {
      company: 'Example Villas', publicUrl: 'example.com',
      villaCount: 'ten_to_twenty_four', whoAnswers: 'reservation_staff',
      channels: ['whatsapp', 'website', 'instagram'], otherChannel: '',
      headache: 'no_follow_up', otherHeadache: '',
    },
    answers: {
      channelManagement: 'mixed_inboxes', afterHours: 'whoever_sees', responseTime: 'thirty_m_to_2h',
      qualification: 'usually_informal', followUp: 'manual', escalation: 'informal', visibility: 'asking_staff',
    },
    contact: { name: 'Test Person', whatsapp: '+62 812 3456 7890', email: 'name@example.com' },
    clientMeta: {
      startedAt: '2026-07-11T00:00:00Z', submittedAt: '2026-07-11T00:02:00Z',
      landingPath: '/', referrer: '', utm: { source: '', medium: '', campaign: '', content: '', term: '' },
    },
    honeypot: '',
    ...overrides,
  };
}

function post(body) {
  return handler({
    httpMethod: 'POST',
    headers: { 'content-type': 'application/json', origin: '' },
    body: JSON.stringify(body),
  });
}

test('whatsapp normalization: valid formats', () => {
  assert.equal(normalizeWhatsapp('+62 812 3456 7890'), '+6281234567890');
  assert.equal(normalizeWhatsapp('+62 (812) 345-67890'), '+6281234567890');
  assert.equal(normalizeWhatsapp('0062 812 3456 7890'), '+6281234567890');
});

test('whatsapp normalization: invalid formats rejected', () => {
  assert.equal(normalizeWhatsapp('0812345678'), null);      // no leading +/00
  assert.equal(normalizeWhatsapp('+62 812'), null);          // too short
  assert.equal(normalizeWhatsapp('+1234567890123456'), null);// 16 digits
  assert.equal(normalizeWhatsapp('call me maybe'), null);
  assert.equal(normalizeWhatsapp(''), null);
});

test('sheetSafe prefixes formula-leading values', () => {
  assert.equal(sheetSafe('=SUM(A1:A9)'), "'=SUM(A1:A9)");
  assert.equal(sheetSafe('+62'), "'+62");
  assert.equal(sheetSafe('-x'), "'-x");
  assert.equal(sheetSafe('@import'), "'@import");
  assert.equal(sheetSafe('normal'), 'normal');
});

test('valid score payload passes validation', () => {
  const { errors, clean } = validateScoreCompleted(validScoreBody());
  assert.equal(errors, null);
  assert.equal(clean.contact.whatsapp, '+6281234567890');
});

test('invalid enum rejected', () => {
  const body = validScoreBody();
  body.answers.followUp = 'definitely';
  const { errors } = validateScoreCompleted(body);
  assert.ok(errors.includes('followUp'));
});

test('no channels rejected', () => {
  const body = validScoreBody();
  body.profile.channels = [];
  assert.ok(validateScoreCompleted(body).errors.includes('channels'));
});

test('duplicate channels rejected', () => {
  const body = validScoreBody();
  body.profile.channels = ['whatsapp', 'whatsapp'];
  assert.ok(validateScoreCompleted(body).errors.includes('channels'));
});

test('overlong fields rejected', () => {
  const body = validScoreBody();
  body.profile.company = 'x'.repeat(121);
  assert.ok(validateScoreCompleted(body).errors.includes('company'));
  const b2 = validScoreBody();
  b2.contact.name = 'x'.repeat(101);
  assert.ok(validateScoreCompleted(b2).errors.includes('name'));
});

test('invalid email rejected, empty email allowed', () => {
  const bad = validScoreBody();
  bad.contact.email = 'not-an-email';
  assert.ok(validateScoreCompleted(bad).errors.includes('email'));
  const ok = validScoreBody();
  ok.contact.email = '';
  assert.equal(validateScoreCompleted(ok).errors, null);
});

test('invalid idempotency UUID rejected', () => {
  const body = validScoreBody({ idempotencyKey: 'not-a-uuid' });
  assert.ok(validateScoreCompleted(body).errors.includes('idempotencyKey'));
});

test('audit_requested: missing authority rejected', () => {
  const { errors } = validateAuditRequested({ idempotencyKey: UUID, leadId: UUID, authorityConfirmed: false, whatsapp: '+6281234567890' });
  assert.ok(errors.includes('authorityConfirmed'));
});

test('audit_requested: invalid leadId rejected', () => {
  const { errors } = validateAuditRequested({ idempotencyKey: UUID, leadId: 'abc', authorityConfirmed: true, whatsapp: '+6281234567890' });
  assert.ok(errors.includes('leadId'));
});

test('playbook_requested: valid passes', () => {
  assert.equal(validatePlaybookRequested({ idempotencyKey: UUID, leadId: UUID }).errors, null);
});

/* ---- handler-level behaviour (no webhook env → controlled failure paths) ---- */

test('handler: GET → METHOD_NOT_ALLOWED', async () => {
  const res = await handler({ httpMethod: 'GET', headers: {} });
  assert.equal(res.statusCode, 405);
  assert.equal(JSON.parse(res.body).code, 'METHOD_NOT_ALLOWED');
});

test('handler: non-JSON content type rejected', async () => {
  const res = await handler({ httpMethod: 'POST', headers: { 'content-type': 'text/plain' }, body: '{}' });
  assert.equal(JSON.parse(res.body).code, 'VALIDATION_ERROR');
});

test('handler: honeypot hit → SPAM_REJECTED', async () => {
  const res = await post(validScoreBody({ honeypot: 'http://spam.example' }));
  assert.equal(res.statusCode, 400);
  assert.equal(JSON.parse(res.body).code, 'SPAM_REJECTED');
});

test('handler: oversized body rejected', async () => {
  const res = await handler({
    httpMethod: 'POST',
    headers: { 'content-type': 'application/json' },
    body: '{"x":"' + 'a'.repeat(60000) + '"}',
  });
  assert.equal(res.statusCode, 413);
});

test('handler: disallowed origin rejected when ALLOWED_ORIGIN set', async () => {
  process.env.ALLOWED_ORIGIN = 'https://allowed.example';
  const res = await handler({
    httpMethod: 'POST',
    headers: { 'content-type': 'application/json', origin: 'https://evil.example' },
    body: JSON.stringify(validScoreBody()),
  });
  assert.equal(res.statusCode, 403);
  delete process.env.ALLOWED_ORIGIN;
});

test('handler: valid score with no webhook configured → WEBHOOK_UNAVAILABLE (no fake success)', async () => {
  delete process.env.APPS_SCRIPT_WEBHOOK_URL;
  const res = await post(validScoreBody());
  assert.equal(res.statusCode, 503);
  assert.equal(JSON.parse(res.body).code, 'WEBHOOK_UNAVAILABLE');
});

test('handler: unknown event rejected', async () => {
  const res = await post({ event: 'mystery', idempotencyKey: UUID });
  assert.equal(JSON.parse(res.body).code, 'VALIDATION_ERROR');
});

test('origin rejection names the origin so setup is not a guessing game', async () => {
  const prev = process.env.ALLOWED_ORIGIN;
  process.env.ALLOWED_ORIGIN = 'https://villaops.selenasystems.com';
  const res = await handler({
    httpMethod: 'POST',
    headers: { origin: 'https://bali-os-villa-2026.vercel.app', 'content-type': 'application/json' },
    body: '{}',
  });
  const body = JSON.parse(res.body);
  assert.equal(res.statusCode, 403);
  assert.match(body.message, /bali-os-villa-2026\.vercel\.app/);
  assert.match(body.message, /ALLOWED_ORIGIN/);
  process.env.ALLOWED_ORIGIN = prev;
});

test('a comma-separated allowlist accepts every listed origin', async () => {
  const prev = process.env.ALLOWED_ORIGIN;
  process.env.ALLOWED_ORIGIN = 'https://villaops.selenasystems.com,https://bali-os-villa-2026.vercel.app/';
  for (const origin of ['https://villaops.selenasystems.com', 'https://bali-os-villa-2026.vercel.app']) {
    const res = await handler({
      httpMethod: 'POST',
      headers: { origin, 'content-type': 'application/json' },
      body: JSON.stringify({ event: 'nope' }),
    });
    assert.notEqual(res.statusCode, 403, `${origin} must pass the origin check`);
  }
  process.env.ALLOWED_ORIGIN = prev;
});

test('isSameOrigin matches the host the request arrived on', () => {
  assert.equal(isSameOrigin('https://a.vercel.app', { host: 'a.vercel.app' }), true);
  assert.equal(isSameOrigin('https://A.Vercel.App', { host: 'a.vercel.app' }), true, 'host comparison is case-insensitive');
  assert.equal(isSameOrigin('https://a.vercel.app', { 'x-forwarded-host': 'a.vercel.app' }), true);
  assert.equal(isSameOrigin('https://evil.com', { host: 'a.vercel.app' }), false);
  assert.equal(isSameOrigin('https://a.vercel.app.evil.com', { host: 'a.vercel.app' }), false, 'suffix tricks must not pass');
  assert.equal(isSameOrigin('', { host: 'a.vercel.app' }), false);
  assert.equal(isSameOrigin('https://a.vercel.app', {}), false);
  assert.equal(isSameOrigin('not-a-url', { host: 'a.vercel.app' }), false);
});

test('the site own domain is accepted even when ALLOWED_ORIGIN omits it', async () => {
  const prev = process.env.ALLOWED_ORIGIN;
  process.env.ALLOWED_ORIGIN = 'https://villaops.selenasystems.com';
  const res = await handler({
    httpMethod: 'POST',
    headers: {
      origin: 'https://bali-os-villa-2026.vercel.app',
      host: 'bali-os-villa-2026.vercel.app',
      'content-type': 'application/json',
    },
    body: JSON.stringify({ event: 'nope' }),
  });
  assert.notEqual(res.statusCode, 403, 'the form on our own page must never be blocked');
  process.env.ALLOWED_ORIGIN = prev;
});

test('a genuinely cross-site post is still rejected', async () => {
  const prev = process.env.ALLOWED_ORIGIN;
  process.env.ALLOWED_ORIGIN = 'https://villaops.selenasystems.com';
  const res = await handler({
    httpMethod: 'POST',
    headers: {
      origin: 'https://attacker.example',
      host: 'bali-os-villa-2026.vercel.app',
      'content-type': 'application/json',
    },
    body: '{}',
  });
  assert.equal(res.statusCode, 403);
  process.env.ALLOWED_ORIGIN = prev;
});
