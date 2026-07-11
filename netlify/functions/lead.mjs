/**
 * POST /api/lead — canonical lead endpoint (FINAL TZ §10, §11, §19, §20).
 * Validates raw answers, calculates the canonical score server-side,
 * forwards a provider-safe payload to the Google Apps Script webhook.
 *
 * Env (Netlify): APPS_SCRIPT_WEBHOOK_URL, APPS_SCRIPT_SHARED_SECRET,
 *                ALLOWED_ORIGIN, IP_HASH_SALT
 */
import { createHash, randomUUID } from 'node:crypto';
import { calculateResult, ENUMS } from '../../assets/js/scoring.js';

const MAX_BODY_BYTES = 50_000;
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const SUSPICIOUS_ELAPSED_MS = 15_000;

/* ---------------- helpers ---------------- */

function json(statusCode, body) {
  return {
    statusCode,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' },
    body: JSON.stringify(body),
  };
}

function fail(statusCode, code, message) {
  return json(statusCode, { ok: false, code, message });
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

/** Neutralize spreadsheet formula injection before the value ever leaves us. */
export function sheetSafe(v) {
  const s = String(v ?? '');
  return /^[=+\-@]/.test(s) ? "'" + s : s;
}

/* ---------------- validation ---------------- */

export function validateScoreCompleted(body) {
  const errors = [];
  const p = body.profile || {};
  const a = body.answers || {};
  const c = body.contact || {};
  const m = body.clientMeta || {};

  if (!UUID_RE.test(body.idempotencyKey || '')) errors.push('idempotencyKey');
  if (typeof body.honeypot !== 'string') errors.push('honeypot');

  const company = str(p.company, 120);
  if (!company) errors.push('company');
  const publicUrl = str(p.publicUrl, 300);
  if (publicUrl === null) errors.push('publicUrl');
  if (!ENUMS.villaCount.includes(p.villaCount)) errors.push('villaCount');
  if (!ENUMS.whoAnswers.includes(p.whoAnswers)) errors.push('whoAnswers');
  if (!Array.isArray(p.channels) || p.channels.length < 1 || p.channels.length > ENUMS.channels.length
    || !p.channels.every((ch) => ENUMS.channels.includes(ch))
    || new Set(p.channels).size !== p.channels.length) errors.push('channels');
  const otherChannel = str(p.otherChannel, 80);
  if (otherChannel === null) errors.push('otherChannel');
  if (!ENUMS.headache.includes(p.headache ?? '')) errors.push('headache');
  const otherHeadache = str(p.otherHeadache, 120);
  if (otherHeadache === null) errors.push('otherHeadache');

  for (const [key, allowed] of [
    ['channelManagement', ENUMS.channelManagement],
    ['afterHours', ENUMS.afterHours],
    ['responseTime', ENUMS.responseTime],
    ['qualification', ENUMS.qualification],
    ['followUp', ENUMS.followUp],
    ['escalation', ENUMS.escalation],
    ['visibility', ENUMS.visibility],
  ]) {
    if (!allowed.includes(a[key])) errors.push(key);
  }

  const name = str(c.name, 100);
  if (!name) errors.push('name');
  const whatsapp = normalizeWhatsapp(c.whatsapp);
  if (!whatsapp) errors.push('whatsapp');
  const email = str(c.email, 254);
  if (email === null || (email && !EMAIL_RE.test(email))) errors.push('email');

  if (m.startedAt && !isIsoDate(m.startedAt)) errors.push('startedAt');
  if (m.submittedAt && !isIsoDate(m.submittedAt)) errors.push('submittedAt');

  if (errors.length) return { errors };
  return {
    errors: null,
    clean: {
      profile: {
        company, publicUrl: publicUrl || '', villaCount: p.villaCount, whoAnswers: p.whoAnswers,
        channels: p.channels, otherChannel: otherChannel || '', headache: p.headache ?? '', otherHeadache: otherHeadache || '',
      },
      answers: {
        channelManagement: a.channelManagement, afterHours: a.afterHours, responseTime: a.responseTime,
        qualification: a.qualification, followUp: a.followUp, escalation: a.escalation, visibility: a.visibility,
      },
      contact: { name, whatsapp, email: email || '' },
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

export function validateAuditRequested(body) {
  const errors = [];
  if (!UUID_RE.test(body.idempotencyKey || '')) errors.push('idempotencyKey');
  if (!UUID_RE.test(body.leadId || '')) errors.push('leadId');
  if (body.authorityConfirmed !== true) errors.push('authorityConfirmed');
  const whatsapp = normalizeWhatsapp(body.whatsapp);
  if (!whatsapp) errors.push('whatsapp');
  return errors.length ? { errors } : { errors: null, clean: { leadId: body.leadId.toLowerCase(), whatsapp } };
}

export function validatePlaybookRequested(body) {
  const errors = [];
  if (!UUID_RE.test(body.idempotencyKey || '')) errors.push('idempotencyKey');
  if (!UUID_RE.test(body.leadId || '')) errors.push('leadId');
  return errors.length ? { errors } : { errors: null, clean: { leadId: body.leadId.toLowerCase() } };
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
      redirect: 'follow', // Apps Script replies via 302 to googleusercontent
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
    return { statusCode: 204, headers: corsHeaders(), body: '' };
  }
  if (event.httpMethod !== 'POST') {
    return fail(405, 'METHOD_NOT_ALLOWED', 'Use POST.');
  }

  // Origin allowlist (same-origin posts may omit Origin; reject only a mismatch).
  const allowedOrigin = process.env.ALLOWED_ORIGIN || '';
  const origin = event.headers?.origin || event.headers?.Origin || '';
  if (allowedOrigin && origin && origin !== allowedOrigin) {
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

  // Salted IP hash for abuse control — raw IP never leaves this function.
  const ip = event.headers?.['x-nf-client-connection-ip'] || event.headers?.['x-forwarded-for']?.split(',')[0]?.trim() || '';
  const ipHash = ip ? createHash('sha256').update((process.env.IP_HASH_SALT || 'dev-salt') + ip).digest('hex').slice(0, 24) : '';

  if (body.event === 'score_completed') {
    if (typeof body.honeypot === 'string' && body.honeypot.trim() !== '') {
      return fail(400, 'SPAM_REJECTED', 'Request rejected.');
    }
    const { errors, clean } = validateScoreCompleted(body);
    if (errors) {
      return fail(400, 'VALIDATION_ERROR', 'Please check the highlighted fields.');
    }

    let suspicious = false;
    const t0 = Date.parse(clean.clientMeta.startedAt);
    const t1 = Date.parse(clean.clientMeta.submittedAt);
    if (Number.isFinite(t0) && Number.isFinite(t1) && t1 - t0 < SUSPICIOUS_ELAPSED_MS) suspicious = true;

    let result;
    try {
      result = calculateResult({
        villaCount: clean.profile.villaCount,
        whoAnswers: clean.profile.whoAnswers,
        channels: clean.profile.channels,
        ...clean.answers,
      });
    } catch {
      return fail(400, 'VALIDATION_ERROR', 'Please check the highlighted fields.');
    }

    const leadId = randomUUID();
    const webhook = await forwardToWebhook({
      event: 'score_completed',
      idempotencyKey: body.idempotencyKey,
      leadId,
      ipHash,
      suspicious,
      profile: clean.profile,
      answers: clean.answers,
      contact: clean.contact,
      clientMeta: clean.clientMeta,
      result,
    });
    if (!webhook.ok) {
      const code = webhook.code === 'RATE_LIMITED' ? 'RATE_LIMITED' : 'WEBHOOK_UNAVAILABLE';
      const status = code === 'RATE_LIMITED' ? 429 : 503;
      return fail(status, code, code === 'RATE_LIMITED'
        ? 'Too many assessments from this connection. Please try again later.'
        : "We couldn't save your assessment yet. Please try again.");
    }
    // Idempotent retries return the webhook's stored leadId so the browser and Sheet agree.
    const finalLeadId = webhook.data.leadId && UUID_RE.test(webhook.data.leadId) ? webhook.data.leadId : leadId;
    return json(200, { ok: true, leadId: finalLeadId, result });
  }

  if (body.event === 'audit_requested') {
    const { errors, clean } = validateAuditRequested(body);
    if (errors) {
      return errors.includes('authorityConfirmed')
        ? fail(400, 'VALIDATION_ERROR', 'Authority confirmation is required.')
        : fail(400, 'VALIDATION_ERROR', 'Please check the highlighted fields.');
    }
    const webhook = await forwardToWebhook({
      event: 'audit_requested',
      idempotencyKey: body.idempotencyKey,
      leadId: clean.leadId,
      authorityConfirmed: true,
      whatsapp: clean.whatsapp,
      ipHash,
    });
    if (!webhook.ok) {
      if (webhook.code === 'NOT_FOUND') return fail(404, 'NOT_FOUND', 'We could not find your assessment. Please retake it.');
      return fail(503, 'WEBHOOK_UNAVAILABLE', "We couldn't save your request yet. Please try again.");
    }
    return json(200, { ok: true, leadId: clean.leadId });
  }

  if (body.event === 'playbook_requested') {
    const { errors, clean } = validatePlaybookRequested(body);
    if (errors) return fail(400, 'VALIDATION_ERROR', 'Please check the highlighted fields.');
    const webhook = await forwardToWebhook({
      event: 'playbook_requested',
      idempotencyKey: body.idempotencyKey,
      leadId: clean.leadId,
      ipHash,
    });
    if (!webhook.ok) {
      if (webhook.code === 'NOT_FOUND') return fail(404, 'NOT_FOUND', 'We could not find your assessment. Please retake it.');
      return fail(503, 'WEBHOOK_UNAVAILABLE', "We couldn't save your request yet. Please try again.");
    }
    return json(200, { ok: true, leadId: clean.leadId });
  }

  return fail(400, 'VALIDATION_ERROR', 'Unknown event.');
}

function corsHeaders() {
  // Same-origin API — CORS is intentionally not opened to other origins.
  return { 'Cache-Control': 'no-store' };
}
