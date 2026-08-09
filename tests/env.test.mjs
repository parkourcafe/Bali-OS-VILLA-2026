import { test } from 'node:test';
import assert from 'node:assert/strict';
import { cleanEnv } from '../lib/env.mjs';
import { authorized } from '../lib/selftest.mjs';
import { telegramConfigured, sendTelegram } from '../lib/notify.mjs';

test('cleanEnv strips the clipboard baggage pastes actually carry', () => {
  assert.equal(cleanEnv('X', { X: '  value  ' }), 'value');
  assert.equal(cleanEnv('X', { X: 'value\n' }), 'value');
  assert.equal(cleanEnv('X', { X: '"value"' }), 'value');
  assert.equal(cleanEnv('X', { X: "'value'" }), 'value');
  assert.equal(cleanEnv('X', { X: '" value "\n' }), 'value');
  assert.equal(cleanEnv('X', {}), '');
  assert.equal(cleanEnv('X', { X: 42 }), '', 'non-strings never leak through');
});

test('a salt pasted with a trailing newline still authorizes', () => {
  const env = { IP_HASH_SALT: 'bc6c20494d3051d178d9458581f47dd2\n' };
  assert.equal(authorized('bc6c20494d3051d178d9458581f47dd2', env), true);
  assert.equal(authorized(' bc6c20494d3051d178d9458581f47dd2 ', env), true, 'provided secret is trimmed too');
  assert.equal(authorized('wrong', env), false);
});

test('a Telegram token with a trailing newline still builds a valid API URL', async () => {
  let url = null;
  const env = { TELEGRAM_BOT_TOKEN: '8656:AAH\n', TELEGRAM_CHAT_ID: ' 5326034125 ' };
  assert.equal(telegramConfigured(env), true);
  await sendTelegram({ event: 'score_completed' }, env, async (u, o) => {
    url = u;
    return { ok: true, json: async () => ({ ok: true }) };
  });
  assert.equal(url, 'https://api.telegram.org/bot8656:AAH/sendMessage');
});
