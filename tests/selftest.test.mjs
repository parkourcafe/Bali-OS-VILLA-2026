import { test } from 'node:test';
import assert from 'node:assert/strict';
import { authorized, hintFor, runSelftest, selftestHandler, unconfiguredReport } from '../lib/selftest.mjs';

const ENV = { IP_HASH_SALT: 'salt123', TELEGRAM_BOT_TOKEN: 'tok', TELEGRAM_CHAT_ID: '5326034125' };

test('authorized requires an exact match with a configured salt', () => {
  assert.equal(authorized('salt123', ENV), true);
  assert.equal(authorized('wrong', ENV), false);
  assert.equal(authorized('', ENV), false);
  assert.equal(authorized(undefined, ENV), false);
  assert.equal(authorized('', { IP_HASH_SALT: '' }), false, 'an unset salt must never authorize');
  assert.equal(authorized(undefined, {}), false);
});

test('hintFor turns Telegram wording into an instruction', () => {
  assert.match(hintFor('Bad Request: chat not found'), /press Start/);
  assert.match(hintFor('Forbidden: bot was blocked by the user'), /Unblock/);
  assert.match(hintFor('Unauthorized'), /BotFather/);
  assert.equal(hintFor('some novel error'), null);
  assert.equal(hintFor(undefined), null);
});

test('runSelftest reports configuration without echoing secrets', async () => {
  const r = await runSelftest({ env: ENV });
  assert.equal(r.ok, true);
  assert.equal(r.telegram.configured, true);
  assert.equal(r.telegram.chatIdLooksNumeric, true);
  assert.equal(r.sheet.configured, false);
  const dump = JSON.stringify(r);
  assert.doesNotMatch(dump, /tok|salt123/, 'no secret value may appear in the report');
});

test('runSelftest flags a chat id that is not numeric', async () => {
  const r = await runSelftest({ env: { ...ENV, TELEGRAM_CHAT_ID: '@selena_kora' } });
  assert.equal(r.telegram.chatIdLooksNumeric, false);
});

test('runSelftest says plainly when nothing is configured', async () => {
  const r = await runSelftest({ env: { IP_HASH_SALT: 's' } });
  assert.equal(r.ok, false);
  assert.match(r.message, /No lead sink is configured/);
});

test('runSelftest surfaces the provider reason and a fix', async () => {
  const r = await runSelftest({
    env: ENV, send: true,
    fetchImpl: async () => ({ ok: true, status: 200, json: async () => ({ ok: false, description: 'Bad Request: chat not found' }) }),
  });
  assert.equal(r.telegram.delivered, false);
  assert.match(r.telegram.error, /chat not found/);
  assert.match(r.telegram.hint, /press Start/);
});

test('runSelftest confirms a successful delivery', async () => {
  const r = await runSelftest({
    env: ENV, send: true,
    fetchImpl: async () => ({ ok: true, status: 200, json: async () => ({ ok: true }) }),
  });
  assert.equal(r.telegram.delivered, true);
  assert.equal(r.telegram.error, undefined);
});

test('runSelftest does not send unless asked', async () => {
  let called = false;
  await runSelftest({ env: ENV, fetchImpl: async () => { called = true; return { ok: true, status: 200, json: async () => ({ ok: true }) }; } });
  assert.equal(called, false);
});

test('selftestHandler refuses without the secret', async () => {
  const res = await selftestHandler({ query: {}, env: ENV });
  assert.equal(res.statusCode, 403);
  const body = JSON.parse(res.body);
  assert.equal(body.ok, false);
  assert.doesNotMatch(res.body, /tok|salt123/);
});

test('selftestHandler returns the report with the secret', async () => {
  const res = await selftestHandler({ query: { secret: 'salt123' }, env: ENV });
  assert.equal(res.statusCode, 200);
  assert.equal(JSON.parse(res.body).telegram.configured, true);
});

test('with no salt configured the endpoint answers instead of locking out', async () => {
  const res = await selftestHandler({ query: {}, env: { TELEGRAM_BOT_TOKEN: 'tok' } });
  assert.equal(res.statusCode, 200);
  const body = JSON.parse(res.body);
  assert.equal(body.sees.IP_HASH_SALT, false);
  assert.equal(body.sees.TELEGRAM_BOT_TOKEN, true);
  assert.equal(body.sees.TELEGRAM_CHAT_ID, false);
  assert.match(body.message, /no environment variables reached it/);
});

test('the unconfigured report exposes presence only, never values', () => {
  const dump = JSON.stringify(unconfiguredReport({
    TELEGRAM_BOT_TOKEN: 'secret-token', ALLOWED_ORIGIN: 'https://x.com',
  }));
  assert.doesNotMatch(dump, /secret-token|https:\/\/x\.com/);
  assert.match(dump, /"TELEGRAM_BOT_TOKEN": ?true/);
});

test('the unconfigured path never sends a test message', async () => {
  let called = false;
  globalThis.__probe = () => { called = true; };
  const res = await selftestHandler({ query: { send: '1' }, env: { TELEGRAM_BOT_TOKEN: 't', TELEGRAM_CHAT_ID: '1' } });
  assert.equal(res.statusCode, 200);
  assert.equal(called, false);
  assert.equal(JSON.parse(res.body).telegram, undefined);
});

test('once the salt is set the endpoint locks down again', async () => {
  const res = await selftestHandler({ query: {}, env: { IP_HASH_SALT: 'salt123' } });
  assert.equal(res.statusCode, 403);
});
