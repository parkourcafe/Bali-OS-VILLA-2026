import { test } from 'node:test';
import assert from 'node:assert/strict';
import { formatLeadMessage, sendTelegram, telegramConfigured, deliver } from '../lib/notify.mjs';

const TG_ENV = { TELEGRAM_BOT_TOKEN: 'tok', TELEGRAM_CHAT_ID: '42' };
const SHEET_ENV = { APPS_SCRIPT_WEBHOOK_URL: 'https://x/exec', APPS_SCRIPT_SHARED_SECRET: 's' };
const okFetch = async () => ({ ok: true, json: async () => ({ ok: true }) });

test('telegramConfigured needs both token and chat id', () => {
  assert.equal(telegramConfigured(TG_ENV), true);
  assert.equal(telegramConfigured({ TELEGRAM_BOT_TOKEN: 'tok' }), false);
  assert.equal(telegramConfigured({}), false);
});

test('formatLeadMessage puts the actionable facts in the message', () => {
  const msg = formatLeadMessage({
    event: 'score_completed',
    leadId: 'abc',
    profile: { company: 'Bali Villas Co', publicUrl: 'https://x.com', villaCount: '20-60' },
    contact: { name: 'Ana', whatsapp: '+62811', email: 'a@b.c' },
    result: { score: 44, riskLevel: 'High risk', gate: 'audit', riskAreas: ['Follow-up', 'Escalation'], strongestArea: 'Response' },
  });
  assert.match(msg, /New readiness assessment/);
  assert.match(msg, /Company: Bali Villas Co/);
  assert.match(msg, /WhatsApp: \+62811/);
  assert.match(msg, /Score: 44\/100 — High risk/);
  assert.match(msg, /Offer: Live Guest Inquiry Audit/);
  assert.match(msg, /Weakest: Follow-up, Escalation/);
});

test('formatLeadMessage omits rows that have no value', () => {
  const msg = formatLeadMessage({ event: 'playbook_requested', leadId: 'z' });
  assert.doesNotMatch(msg, /Company/);
  assert.doesNotMatch(msg, /undefined|null/);
  assert.match(msg, /Playbook requested/);
});

test('formatLeadMessage flags suspicious submissions', () => {
  const msg = formatLeadMessage({ event: 'score_completed', suspicious: true });
  assert.match(msg, /suspicious/i);
});

test('sendTelegram posts to the bot API and reports success', async () => {
  let seen = null;
  const res = await sendTelegram({ event: 'score_completed' }, TG_ENV, async (url, opts) => {
    seen = { url, body: JSON.parse(opts.body) };
    return { ok: true, json: async () => ({ ok: true }) };
  });
  assert.equal(res.ok, true);
  assert.match(seen.url, /api\.telegram\.org\/bottok\/sendMessage/);
  assert.equal(seen.body.chat_id, '42');
  assert.ok(seen.body.text.length > 0);
  assert.equal(seen.body.parse_mode, undefined, 'plain text: guest input can never inject markup');
});

test('sendTelegram treats an ok:false body as failure', async () => {
  const res = await sendTelegram({}, TG_ENV, async () => ({ ok: true, json: async () => ({ ok: false }) }));
  assert.equal(res.ok, false);
  assert.equal(res.code, 'TELEGRAM_FAILED');
});

test('sendTelegram survives a network error', async () => {
  const res = await sendTelegram({}, TG_ENV, async () => { throw new Error('boom'); });
  assert.equal(res.ok, false);
});

test('deliver fails when no sink is configured', async () => {
  const r = await deliver({}, { env: {}, sheetSink: async () => ({ ok: true }) });
  assert.equal(r.ok, false);
  assert.equal(r.code, 'WEBHOOK_UNAVAILABLE');
});

test('deliver succeeds on Telegram alone — no Google needed', async () => {
  const r = await deliver({ event: 'score_completed' }, { env: TG_ENV, fetchImpl: okFetch });
  assert.equal(r.ok, true);
  assert.equal(r.data, null, 'no stored leadId when the Sheet is not in use');
});

test('deliver does not call the sheet sink when the Sheet is not configured', async () => {
  let called = false;
  await deliver({}, { env: TG_ENV, fetchImpl: okFetch, sheetSink: async () => { called = true; return { ok: true }; } });
  assert.equal(called, false);
});

test('deliver succeeds if the Sheet accepts it even when Telegram is down', async () => {
  const r = await deliver({}, {
    env: { ...SHEET_ENV, ...TG_ENV },
    fetchImpl: async () => { throw new Error('tg down'); },
    sheetSink: async () => ({ ok: true, data: { leadId: 'stored' } }),
  });
  assert.equal(r.ok, true);
  assert.equal(r.data.leadId, 'stored');
});

test('deliver surfaces the sheet code when every sink refuses', async () => {
  const r = await deliver({}, {
    env: { ...SHEET_ENV, ...TG_ENV },
    fetchImpl: async () => ({ ok: false }),
    sheetSink: async () => ({ ok: false, code: 'NOT_FOUND' }),
  });
  assert.equal(r.ok, false);
  assert.equal(r.code, 'NOT_FOUND', 'visitor-meaningful codes must not be masked by a Telegram outage');
});

test('formatLeadMessage never leaks raw enum keys to the owner', () => {
  const msg = formatLeadMessage({
    event: 'score_completed',
    profile: { villaCount: 'ten_to_twenty_four' },
    result: {
      score: 48, riskLevel: 'medium_high', riskLabel: 'Medium-high leakage risk',
      gate: 'audit', riskAreas: ['channelControl', 'followUp'], strongestArea: 'qualification',
    },
  });
  assert.match(msg, /Villas: 10–24/);
  assert.match(msg, /Medium-high leakage risk/);
  assert.match(msg, /Offer: Live Guest Inquiry Audit/);
  assert.match(msg, /Weakest: Channel control, Follow-up/);
  assert.match(msg, /Strongest: Qualification/);
  assert.doesNotMatch(msg, /_/, 'no snake_case keys anywhere in the message');
});

test('formatLeadMessage passes through values it has no label for', () => {
  const msg = formatLeadMessage({ event: 'score_completed', profile: { villaCount: 'brand_new_option' } });
  assert.match(msg, /Villas: brand_new_option/, 'unknown values stay visible rather than vanishing');
});
