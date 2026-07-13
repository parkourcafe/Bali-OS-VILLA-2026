/**
 * POST /api/feedback — Guest Feedback & Reviews module (Villa Ops OS add-on).
 *
 * Compliant "review funnel", by design:
 *  - EVERY rating is stored and acknowledged (nothing is hidden).
 *  - Low ratings (<= threshold) are flagged for SERVICE RECOVERY — the server
 *    tells the client to route the guest to a private "we'll fix it now" path
 *    and the webhook raises an urgent staff alert (fix before checkout).
 *  - High ratings are invited to leave a PUBLIC review (Google) — but the
 *    public review link is ALSO returned for low ratings, so unhappy guests
 *    are never blocked from reviewing. This is service recovery, not review
 *    gating. See docs/sales-assets/gravity-bali/08_REVIEW_SYSTEM.md.
 *
 * Env: APPS_SCRIPT_WEBHOOK_URL, APPS_SCRIPT_SHARED_SECRET, ALLOWED_ORIGIN,
 *      IP_HASH_SALT (shared), GOOGLE_REVIEW_URL (public review link).
 */
import { createHash, randomUUID } from 'node:crypto';

const MAX_BODY_BYTES = 20_000;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const RECOVERY_THRESHOLD = 3; // ratings 1..3 -> service recovery, 4..5 -> promote

export const STAGES = ['mid_stay', 'checkout', 'post_stay'];

function json(statusCode, body) {
  return { statusCode, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }, body: JSON.stringify(body) };
}
function fail(statusCode, code, message, fields) {
  return json(statusCode, { ok: false, code, message, ...(fields ? { fields } : {}) });
}
export function normalizeWhatsapp(raw) {
  if (raw == null || raw === '') return '';
  if (typeof raw !== 'string') return null;
  let v = raw.replace(/[\s().\-]/g, '');
  if (v.startsWith('00')) v = '+' + v.slice(2);
  return /^\+\d{8,15}$/.test(v) ? v : null;
}
function str(v, max) {
  if (v == null) return '';
  if (typeof v !== 'string') return null;
  const t = v.trim();
  return t.length <= max ? t : null;
}

export function validateFeedback(body) {
  const errors = [];
  const m = body.clientMeta || {};

  if (!UUID_RE.test(body.idempotencyKey || '')) errors.push('idempotencyKey');
  if (typeof body.honeypot !== 'string') errors.push('honeypot');

  const rating = Number(body.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) errors.push('rating');

  const brand = str(body.brand, 120);
  if (brand === null) errors.push('brand');
  const villa = str(body.villa, 120);
  if (villa === null) errors.push('villa');
  const guestName = str(body.guestName, 100);
  if (guestName === null) errors.push('guestName');
  if (body.stage != null && !STAGES.includes(body.stage)) errors.push('stage');
  const comment = str(body.comment, 1500);
  if (comment === null) errors.push('comment');

  const whatsapp = normalizeWhatsapp(body.whatsapp);
  if (whatsapp === null) errors.push('whatsapp');
  // Consent required only when the guest leaves a contact for follow-up.
  if (whatsapp && body.consent !== true) errors.push('consent');

  const source = str(body.source, 100);
  if (source === null) errors.push('source');

  if (errors.length) return { errors };
  return {
    errors: null,
    clean: {
      rating, brand: brand || '', villa: villa || '', guestName: guestName || '',
      stage: body.stage || 'checkout', comment: comment || '',
      whatsapp: whatsapp || '', consent: body.consent === true,
      source: source || '',
      clientMeta: {
        landingPath: str(m.landingPath, 200) || '', referrer: str(m.referrer, 200) || '',
        utm: {
          source: str(m.utm?.source, 100) || '', medium: str(m.utm?.medium, 100) || '',
          campaign: str(m.utm?.campaign, 100) || '', content: str(m.utm?.content, 100) || '',
          term: str(m.utm?.term, 100) || '',
        },
      },
    },
  };
}

async function forwardToWebhook(payload) {
  const url = process.env.APPS_SCRIPT_WEBHOOK_URL;
  const secret = process.env.APPS_SCRIPT_SHARED_SECRET;
  if (!url || !secret) return { ok: false, code: 'WEBHOOK_UNAVAILABLE' };
  try {
    const res = await fetch(url, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, payload }), redirect: 'follow',
    });
    const text = await res.text();
    let data = null; try { data = JSON.parse(text); } catch { /* non-JSON */ }
    if (!res.ok || !data || data.ok !== true) return { ok: false, code: (data && data.code) || 'WEBHOOK_UNAVAILABLE' };
    return { ok: true, data };
  } catch { return { ok: false, code: 'WEBHOOK_UNAVAILABLE' }; }
}

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') return { statusCode: 204, headers: { 'Cache-Control': 'no-store' }, body: '' };
  if (event.httpMethod !== 'POST') return fail(405, 'METHOD_NOT_ALLOWED', 'Use POST.');

  const allowedOrigins = (process.env.ALLOWED_ORIGIN || '').split(',').map((o) => o.trim().replace(/\/$/, '')).filter(Boolean);
  const origin = (event.headers?.origin || event.headers?.Origin || '').replace(/\/$/, '');
  if (allowedOrigins.length && origin && !allowedOrigins.includes(origin)) return fail(403, 'VALIDATION_ERROR', 'Request origin not allowed.');

  const contentType = (event.headers?.['content-type'] || event.headers?.['Content-Type'] || '');
  if (!contentType.includes('application/json')) return fail(400, 'VALIDATION_ERROR', 'Expected application/json.');
  if ((event.body || '').length > MAX_BODY_BYTES) return fail(413, 'VALIDATION_ERROR', 'Request too large.');

  let body; try { body = JSON.parse(event.body || '{}'); } catch { return fail(400, 'VALIDATION_ERROR', 'Invalid JSON.'); }

  if (typeof body.honeypot === 'string' && body.honeypot.trim() !== '') return fail(400, 'SPAM_REJECTED', 'Request rejected.');

  const { errors, clean } = validateFeedback(body);
  if (errors) return fail(400, 'VALIDATION_ERROR', 'Please check the highlighted fields.', errors);

  const ip = event.headers?.['x-nf-client-connection-ip'] || event.headers?.['x-forwarded-for']?.split(',')[0]?.trim() || '';
  const ipHash = ip ? createHash('sha256').update((process.env.IP_HASH_SALT || 'dev-salt') + ip).digest('hex').slice(0, 24) : '';

  const route = clean.rating <= RECOVERY_THRESHOLD ? 'recovery' : 'promote';
  const requestId = randomUUID();

  const webhook = await forwardToWebhook({
    event: 'guest_feedback', idempotencyKey: body.idempotencyKey, requestId, ipHash, route, ...clean,
  });
  if (!webhook.ok) {
    const code = webhook.code === 'RATE_LIMITED' ? 'RATE_LIMITED' : 'WEBHOOK_UNAVAILABLE';
    const status = code === 'RATE_LIMITED' ? 429 : 503;
    return fail(status, code, code === 'RATE_LIMITED'
      ? 'Too many submissions from this connection. Please try again shortly.'
      : "We couldn't save your feedback yet. Nothing was lost — please try again.");
  }

  // Public review link is offered on both routes (never gated by sentiment).
  const reviewUrl = process.env.GOOGLE_REVIEW_URL || '';
  const finalId = webhook.data.requestId && UUID_RE.test(webhook.data.requestId) ? webhook.data.requestId : requestId;
  return json(200, { ok: true, requestId: finalId, route, reviewUrl });
}
