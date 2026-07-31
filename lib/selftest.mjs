/**
 * Setup self-test.
 *
 * Reports which lead sinks are configured and — on request — actually delivers
 * a test message, returning the provider's own explanation when it refuses
 * ("chat not found", "bot was blocked by the user"). Without this, a failed
 * setup is a guessing game: the visitor-facing error must stay generic, and
 * hosting logs are not always reachable.
 *
 * Guarded by IP_HASH_SALT, a secret the operator already has, so the endpoint
 * cannot be used by strangers to probe configuration or spam the owner's chat.
 * Secrets are never echoed — only booleans and provider messages.
 */
import { sendTelegram, telegramConfigured } from './notify.mjs';

export const SELFTEST_HINTS = {
  'chat not found':
    'Open your bot in Telegram and press Start — Telegram will not let a bot message you first. Also check TELEGRAM_CHAT_ID is your personal numeric id, not the bot id and not a @username.',
  'bot was blocked by the user':
    'You blocked this bot in Telegram. Unblock it, then press Start again.',
  unauthorized:
    'TELEGRAM_BOT_TOKEN is wrong or was revoked. Get a fresh one from @BotFather and update the variable, then redeploy.',
};

export function hintFor(detail) {
  const d = String(detail || '').toLowerCase();
  for (const [needle, hint] of Object.entries(SELFTEST_HINTS)) {
    if (d.includes(needle)) return hint;
  }
  return null;
}

export function authorized(providedSecret, env = process.env) {
  const expected = env.IP_HASH_SALT || '';
  return !!expected && providedSecret === expected;
}

export async function runSelftest({ send = false, env = process.env, fetchImpl = fetch } = {}) {
  const telegram = {
    configured: telegramConfigured(env),
    chatIdLooksNumeric: /^-?\d+$/.test(String(env.TELEGRAM_CHAT_ID || '')),
  };
  const sheet = {
    configured: !!(env.APPS_SCRIPT_WEBHOOK_URL && env.APPS_SCRIPT_SHARED_SECRET),
    urlEndsWithExec: /\/exec$/.test(env.APPS_SCRIPT_WEBHOOK_URL || ''),
  };

  if (send && telegram.configured) {
    const res = await sendTelegram(
      { event: 'score_completed', profile: { company: 'Setup self-test' }, leadId: 'selftest' },
      env, fetchImpl,
    );
    telegram.delivered = res.ok;
    if (!res.ok) {
      telegram.error = res.detail || res.code;
      telegram.hint = hintFor(res.detail);
    }
  }

  const anyConfigured = telegram.configured || sheet.configured;
  return {
    ok: anyConfigured,
    message: anyConfigured
      ? 'At least one lead sink is configured.'
      : 'No lead sink is configured — set TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID, or the Apps Script pair.',
    telegram,
    sheet,
    originCheck: {
      allowedOriginSet: !!(env.ALLOWED_ORIGIN || ''),
      note: 'Requests from the site\'s own domain are always allowed; ALLOWED_ORIGIN only matters for other origins.',
    },
  };
}

/**
 * Minimal report for a server that has no IP_HASH_SALT yet. Without this the
 * endpoint locks out the exact operator who needs it most: if the variables
 * never reached the deployment, the guard secret did not either, and every
 * answer is "Not authorized". Booleans only, and no test message is sent.
 * Setting IP_HASH_SALT — step one of setup — closes it again.
 */
export function unconfiguredReport(env = process.env) {
  return {
    ok: false,
    message: 'This deployment has no IP_HASH_SALT, so it is very likely that no environment variables reached it at all. Set them for the Production environment, then redeploy.',
    sees: {
      IP_HASH_SALT: !!env.IP_HASH_SALT,
      TELEGRAM_BOT_TOKEN: !!env.TELEGRAM_BOT_TOKEN,
      TELEGRAM_CHAT_ID: !!env.TELEGRAM_CHAT_ID,
      ALLOWED_ORIGIN: !!env.ALLOWED_ORIGIN,
      APPS_SCRIPT_WEBHOOK_URL: !!env.APPS_SCRIPT_WEBHOOK_URL,
    },
    next: 'Once IP_HASH_SALT is set, open this page again with ?secret=<that value>&send=1 for full diagnostics and a test message.',
  };
}

export async function selftestHandler(event) {
  const q = event.query || {};
  const env = event.env || {};
  const headers = { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' };

  if (!env.IP_HASH_SALT) {
    return { statusCode: 200, headers, body: JSON.stringify(unconfiguredReport(env), null, 2) };
  }
  if (!authorized(q.secret, env)) {
    return { statusCode: 403, headers, body: JSON.stringify({ ok: false, message: 'Not authorized.' }) };
  }
  const report = await runSelftest({ send: q.send === '1', env });
  return { statusCode: 200, headers, body: JSON.stringify(report, null, 2) };
}
