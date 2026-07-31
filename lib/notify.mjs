/**
 * Lead delivery sinks.
 *
 * The funnel is not tied to one destination. Configure either sink (or both):
 *   APPS_SCRIPT_WEBHOOK_URL + APPS_SCRIPT_SHARED_SECRET  → Google Sheet row + email
 *   TELEGRAM_BOT_TOKEN + TELEGRAM_CHAT_ID                → message in Telegram
 *
 * A submission succeeds when at least one configured sink accepts it, so an
 * operator who never wants to touch Google can run on Telegram alone.
 *
 * Messages are sent as plain text (no parse_mode) so guest-supplied values can
 * never break formatting or inject markup.
 */

const TELEGRAM_TIMEOUT_MS = 8000;

export function telegramConfigured(env = process.env) {
  return !!(env.TELEGRAM_BOT_TOKEN && env.TELEGRAM_CHAT_ID);
}

const LABELS = {
  score_completed: 'New readiness assessment',
  audit_requested: 'AUDIT REQUESTED',
  playbook_requested: 'Playbook requested',
};

// The message is read on a phone — never show raw enum keys.
const VILLA_COUNT = {
  one: '1',
  two_to_four: '2–4',
  five_to_nine: '5–9',
  ten_to_twenty_four: '10–24',
  twenty_five_plus: '25+',
};
const CATEGORY = {
  response: 'Response coverage',
  qualification: 'Qualification',
  followUp: 'Follow-up',
  channelControl: 'Channel control',
  escalation: 'Escalation',
  visibility: 'Visibility',
};
const GATE = {
  audit: 'Live Guest Inquiry Audit',
  playbook: 'Villa Response Playbook',
};

const human = (map, v) => (v == null || v === '' ? v : map[v] || String(v));

function line(label, value) {
  return value === undefined || value === null || value === '' ? null : `${label}: ${value}`;
}

/** Plain-text message an owner can act on straight from their phone. */
export function formatLeadMessage(payload) {
  const p = payload || {};
  const c = p.contact || {};
  const prof = p.profile || {};
  const r = p.result || {};
  const out = [LABELS[p.event] || String(p.event || 'Lead'), ''];

  const rows = [
    line('Company', prof.company),
    line('Website', prof.publicUrl),
    line('Name', c.name),
    line('WhatsApp', c.whatsapp || p.whatsapp),
    line('Email', c.email),
    line('Villas', human(VILLA_COUNT, prof.villaCount)),
  ].filter(Boolean);
  if (rows.length) out.push(...rows, '');

  if (r.score != null) {
    const risk = r.riskLabel || r.riskLevel;
    out.push(`Score: ${r.score}/100${risk ? ` — ${risk}` : ''}`);
    if (r.gate) out.push(`Offer: ${human(GATE, r.gate)}`);
    if (Array.isArray(r.riskAreas) && r.riskAreas.length) {
      out.push(`Weakest: ${r.riskAreas.slice(0, 3).map((a) => human(CATEGORY, a)).join(', ')}`);
    }
    if (r.strongestArea) out.push(`Strongest: ${human(CATEGORY, r.strongestArea)}`);
    out.push('');
  }

  if (p.suspicious) out.push('⚠ Flagged as suspicious — check before replying.', '');
  if (p.leadId) out.push(`Lead ID: ${p.leadId}`);
  return out.join('\n').trim();
}

export async function sendTelegram(payload, env = process.env, fetchImpl = fetch) {
  if (!telegramConfigured(env)) return { ok: false, code: 'TELEGRAM_NOT_CONFIGURED' };
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), TELEGRAM_TIMEOUT_MS);
  try {
    const res = await fetchImpl(`https://api.telegram.org/bot${env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: env.TELEGRAM_CHAT_ID,
        text: formatLeadMessage(payload),
        disable_web_page_preview: true,
      }),
      signal: ctrl.signal,
    });
    const data = await res.json().catch(() => null);
    if (!res.ok || !data || data.ok !== true) {
      // Telegram explains refusals precisely ("chat not found", "bot was
      // blocked by the user"). Keep it for diagnostics — it never contains
      // the token, only what the operator needs to fix.
      return { ok: false, code: 'TELEGRAM_FAILED', detail: (data && data.description) || `HTTP ${res.status}` };
    }
    return { ok: true };
  } catch (err) {
    return { ok: false, code: 'TELEGRAM_FAILED', detail: err && err.name === 'AbortError' ? 'timed out' : 'network error' };
  } finally {
    clearTimeout(timer);
  }
}

/**
 * Run every configured sink. Succeeds if any of them accepted the lead.
 * `sheet` result is passed through so callers keep the Apps Script leadId and
 * its NOT_FOUND / RATE_LIMITED semantics when that sink is in use.
 */
export async function deliver(payload, { sheetSink, env = process.env, fetchImpl = fetch } = {}) {
  const sheetEnabled = !!(env.APPS_SCRIPT_WEBHOOK_URL && env.APPS_SCRIPT_SHARED_SECRET);
  const tgEnabled = telegramConfigured(env);

  if (!sheetEnabled && !tgEnabled) {
    return { ok: false, code: 'WEBHOOK_UNAVAILABLE', sheet: null, telegram: null };
  }

  const [sheet, telegram] = await Promise.all([
    sheetEnabled && sheetSink ? sheetSink(payload) : Promise.resolve(null),
    tgEnabled ? sendTelegram(payload, env, fetchImpl) : Promise.resolve(null),
  ]);

  if ((sheet && sheet.ok) || (telegram && telegram.ok)) {
    return { ok: true, sheet, telegram, data: sheet && sheet.ok ? sheet.data : null };
  }
  // Nothing accepted it. Surface the sheet's code when it has one — NOT_FOUND and
  // RATE_LIMITED are meaningful to the visitor; a Telegram outage is not.
  return {
    ok: false,
    code: (sheet && sheet.code) || (telegram && telegram.code) || 'WEBHOOK_UNAVAILABLE',
    sheet,
    telegram,
  };
}
