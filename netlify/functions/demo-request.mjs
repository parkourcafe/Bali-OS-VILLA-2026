/**
 * POST /api/demo-request — demo walkthrough booking endpoint for the
 * private audit microsites (/audit/<company-slug>/).
 *
 * Same contract philosophy as /api/lead: server-side validation,
 * honeypot spam rejection, forward to the Google Apps Script webhook,
 * and NEVER report success unless the webhook stored the request.
 *
 * Env: APPS_SCRIPT_WEBHOOK_URL, APPS_SCRIPT_SHARED_SECRET,
 *      ALLOWED_ORIGIN, IP_HASH_SALT   (shared with /api/lead)
 */
import { createHash, randomUUID } from 'node:crypto';

const MAX_BODY_BYTES = 30_000;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export const VILLA_COUNT_OPTIONS = ['1-4', '5-9', '10-19', '20-49', '50+'];

/* ---------------- helpers ---------------- */

function json(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    body: JSON.stringify(body),
  };
}

function fail(statusCode, code, message, fields) {
  return json(statusCode, { ok: false, code, message, ...(fields ? { fields } : {}) });
}

export function normalizeWhatsapp(raw) {
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

function isIsoDate(v) {
  return typeof v === 'string' && v.length <= 40 && !Number.isNaN(Date.parse(v));
}

/* ---------------- validation ---------------- */

export function validateDemoRequest(body) {
  const errors = [];
  const m = body.clientMeta || {};

  if (!UUID_RE.test(body.idempotencyKey || '')) errors.push('idempotencyKey');
  if (typeof body.honeypot !== 'string') errors.push('honeypot');

  const name = str(body.name, 100);
  if (!name) errors.push('name');
  const company = str(body.company, 120);
  if (!company) errors.push('company');
  const role = str(body.role, 80);
  if (!role) errors.push('role');

  const whatsapp = normalizeWhatsapp(body.whatsapp);
  if (!whatsapp) errors.push('whatsapp');
  const email = str(body.email, 254);
  if (email === null || (email && !EMAIL_RE.test(email))) errors.push('email');

  if (!VILLA_COUNT_OPTIONS.includes(body.villaCount)) errors.push('villaCount');
  const currentSystem = str(body.currentSystem, 120);
  if (currentSystem === null) errors.push('currentSystem');
  const mainSource = str(body.mainSource, 120);
  if (mainSource === null) errors.push('mainSource');

  const preferredDate = str(body.preferredDate, 40);
  if (preferredDate === null || (preferredDate && !isIsoDate(preferredDate))) errors.push('preferredDate');
  const timezone = str(body.timezone, 60);
  if (timezone === null) errors.push('timezone');
  const comment = str(body.comment, 1000);
  if (comment === null) errors.push('comment');

  if (body.consent !== true) errors.push('consent');

  const source = str(body.source, 100);
  if (source === null) errors.push('source');

  if (m.startedAt && !isIsoDate(m.startedAt)) errors.push('startedAt');
  if (m.submittedAt && !isIsoDate(m.submittedAt)) errors.push('submittedAt');

  if (errors.length) return { errors };
  return {
    errors: null,
    clean: {
      name, company, role, whatsapp, email: email || '',
      villaCount: body.villaCount,
      currentSystem: currentSystem || '',
      mainSource: mainSource || '',
      preferredDate: preferredDate || '',
      timezone: timezone || '',
      comment: comment || '',
      source: source || '',
      clientMeta: {
        startedAt: m.startedAt || '', submittedAt: m.submittedAt || '',
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

/* ---------------- webhook ---------------- */

async function forwardToWebhook(payload) {
  const url = process.env.APPS_SCRIPT_WEBHOOK_URL;
  const secret = process.env.APPS_SCRIPT_SHARED_SECRET;
  if (!url || !secret) {
    return { ok: false, code: 'WEBHOOK_UNAVAILABLE' };
  }
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ secret, payload }),
      redirect: 'follow',
    });
    const text = await res.text();
    let data = null;
    try { data = JSON.parse(text); } catch { /* non-JSON provider response */ }
    if (!res.ok || !data || data.ok !== true) {
      return { ok: false, code: (data && data.code) || 'WEBHOOK_UNAVAILABLE' };
    }
    return { ok: true, data };
  } catch {
    return { ok: false, code: 'WEBHOOK_UNAVAILABLE' };
  }
}

/* ---------------- handler ---------------- */

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: { 'Cache-Control': 'no-store' }, body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return fail(405, 'METHOD_NOT_ALLOWED', 'Use POST.');
  }

  const allowedOrigins = (process.env.ALLOWED_ORIGIN || '')
    .split(',').map((o) => o.trim().replace(/\/$/, '')).filter(Boolean);
  const origin = (event.headers?.origin || event.headers?.Origin || '').replace(/\/$/, '');
  if (allowedOrigins.length && origin && !allowedOrigins.includes(origin)) {
    return fail(403, 'VALIDATION_ERROR', 'Request origin not allowed.');
  }

  const contentType = (event.headers?.['content-type'] || event.headers?.['Content-Type'] || '');
  if (!contentType.includes('application/json')) {
    return fail(400, 'VALIDATION_ERROR', 'Expected application/json.');
  }
  if ((event.body || '').length > MAX_BODY_BYTES) {
    return fail(413, 'VALIDATION_ERROR', 'Request too large.');
  }

  let body;
  try {
    body = JSON.parse(event.body || '{}');
  } catch {
    return fail(400, 'VALIDATION_ERROR', 'Invalid JSON.');
  }

  if (typeof body.honeypot === 'string' && body.honeypot.trim() !== '') {
    return fail(400, 'SPAM_REJECTED', 'Request rejected.');
  }

  const { errors, clean } = validateDemoRequest(body);
  if (errors) {
    return fail(400, 'VALIDATION_ERROR', 'Please check the highlighted fields.', errors);
  }

  const ip = event.headers?.['x-nf-client-connection-ip'] || event.headers?.['x-forwarded-for']?.split(',')[0]?.trim() || '';
  const ipHash = ip ? createHash('sha256').update((process.env.IP_HASH_SALT || 'dev-salt') + ip).digest('hex').slice(0, 24) : '';

  const requestId = randomUUID();
  const webhook = await forwardToWebhook({
    event: 'demo_requested',
    idempotencyKey: body.idempotencyKey,
    requestId,
    ipHash,
    ...clean,
  });
  if (!webhook.ok) {
    const code = webhook.code === 'RATE_LIMITED' ? 'RATE_LIMITED' : 'WEBHOOK_UNAVAILABLE';
    const status = code === 'RATE_LIMITED' ? 429 : 503;
    return fail(status, code, code === 'RATE_LIMITED'
      ? 'Too many requests from this connection. Please try again later.'
      : "We couldn't save your request yet. Nothing was lost on your side — please try again, or message us on WhatsApp.");
  }
  const finalId = webhook.data.requestId && UUID_RE.test(webhook.data.requestId) ? webhook.data.requestId : requestId;
  return json(200, { ok: true, requestId: finalId });
}
