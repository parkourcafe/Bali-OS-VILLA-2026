/**
 * Private audit microsite behavior (/audit/<slug>/):
 *  - anonymous engagement analytics (sections viewed, CTA clicks, deck opened)
 *  - demo walkthrough form: validation → loading → error/success states,
 *    success ONLY after the API confirms the request was stored.
 *
 * Reuses the funnel's analytics allowlist (asset/section/cta props — no PII).
 */
import { initAnalytics, track } from './analytics.js';
import { SITE_CONFIG, has } from './site-config.js';

const page = document.querySelector('[data-audit-asset]');
const ASSET = page ? page.getAttribute('data-audit-asset') : 'unknown';

/* ---------------- analytics ---------------- */

initAnalytics();
track('audit_page_view', { asset: ASSET });

// Section-view tracking: each <section data-track-section="..."> fires once.
const seen = new Set();
if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      const name = e.target.getAttribute('data-track-section');
      if (e.isIntersecting && name && !seen.has(name)) {
        seen.add(name);
        track('audit_section_view', { asset: ASSET, section: name });
        io.unobserve(e.target);
      }
    }
  }, { threshold: 0.4 });
  document.querySelectorAll('[data-track-section]').forEach((el) => io.observe(el));
}

// CTA tracking: any element with data-track-cta="name".
document.addEventListener('click', (ev) => {
  const el = ev.target.closest('[data-track-cta]');
  if (el) track('audit_cta_click', { asset: ASSET, cta: el.getAttribute('data-track-cta') });
});

/* ---------------- evidence screenshots ----------------
   Slots stay as labelled placeholders until the operator captures real
   screenshots locally (scripts/capture-evidence.mjs) into assets/shots/.
   Each slot then upgrades itself automatically — no HTML edits needed. */

document.querySelectorAll('.shot-slot[data-shot]').forEach((slot) => {
  const id = slot.getAttribute('data-shot');
  const tryLoad = (device) => new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = `assets/shots/${id}-${device}.png`;
  });
  (async () => {
    const img = (await tryLoad('desktop')) || (await tryLoad('mobile'));
    if (img) {
      img.alt = `Screenshot evidence: ${id}`;
      img.loading = 'lazy';
      slot.textContent = '';
      slot.style.borderStyle = 'solid';
      slot.appendChild(img);
    }
  })();
});

/* ---------------- demo form ---------------- */

const form = document.getElementById('demo-form');

function fieldError(name, show) {
  const wrap = form.querySelector(`[data-field="${name}"]`);
  if (wrap) wrap.classList.toggle('field-error', !!show);
}

function readUtm() {
  const q = new URLSearchParams(window.location.search);
  return {
    source: q.get('utm_source') || '',
    medium: q.get('utm_medium') || '',
    campaign: q.get('utm_campaign') || '',
    content: q.get('utm_content') || '',
    term: q.get('utm_term') || '',
  };
}

function normalizeWhatsappClient(raw) {
  let v = String(raw || '').replace(/[\s().\-]/g, '');
  if (v.startsWith('00')) v = '+' + v.slice(2);
  return /^\+\d{8,15}$/.test(v) ? v : null;
}

if (form) {
  const startedAt = new Date().toISOString();
  let formStartTracked = false;
  form.addEventListener('input', () => {
    if (!formStartTracked) {
      formStartTracked = true;
      track('demo_form_started', { asset: ASSET });
    }
  }, { once: false });

  const statusBox = document.getElementById('demo-form-status');
  const submitBtn = form.querySelector('button[type="submit"]');
  const successBox = document.getElementById('demo-form-success');

  function setStatus(kind, html) {
    statusBox.hidden = !html;
    statusBox.className = 'form-status' + (kind ? ' form-status-' + kind : '');
    statusBox.innerHTML = html || '';
  }

  form.addEventListener('submit', async (ev) => {
    ev.preventDefault();
    const data = new FormData(form);

    const errors = [];
    const name = String(data.get('name') || '').trim();
    const company = String(data.get('company') || '').trim();
    const role = String(data.get('role') || '').trim();
    const whatsapp = normalizeWhatsappClient(data.get('whatsapp'));
    const email = String(data.get('email') || '').trim();
    const villaCount = String(data.get('villaCount') || '');
    const preferredDate = String(data.get('preferredDate') || '').trim();
    const consent = data.get('consent') === 'on';

    if (!name) errors.push('name');
    if (!company) errors.push('company');
    if (!role) errors.push('role');
    if (!whatsapp) errors.push('whatsapp');
    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email)) errors.push('email');
    if (!villaCount) errors.push('villaCount');
    if (preferredDate && Number.isNaN(Date.parse(preferredDate))) errors.push('preferredDate');
    if (!consent) errors.push('consent');

    ['name', 'company', 'role', 'whatsapp', 'email', 'villaCount', 'preferredDate', 'consent']
      .forEach((f) => fieldError(f, errors.includes(f)));
    if (errors.length) {
      setStatus('error', 'Please check the highlighted fields.');
      return;
    }

    setStatus('', '');
    submitBtn.disabled = true;
    submitBtn.dataset.label = submitBtn.textContent;
    submitBtn.textContent = 'Sending…';

    const payload = {
      idempotencyKey: form.dataset.idem || (form.dataset.idem = crypto.randomUUID()),
      honeypot: String(data.get('website') || ''),
      name, company, role,
      whatsapp: String(data.get('whatsapp') || ''),
      email,
      villaCount,
      currentSystem: String(data.get('currentSystem') || '').trim(),
      mainSource: String(data.get('mainSource') || '').trim(),
      preferredDate,
      timezone: String(data.get('timezone') || '').trim(),
      comment: String(data.get('comment') || '').trim(),
      consent: true,
      source: 'audit-microsite:' + ASSET,
      clientMeta: {
        startedAt,
        submittedAt: new Date().toISOString(),
        landingPath: window.location.pathname,
        referrer: document.referrer || '',
        utm: readUtm(),
      },
    };

    try {
      const res = await fetch('/api/demo-request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const out = await res.json().catch(() => null);

      if (res.ok && out && out.ok === true && out.requestId) {
        // Success is shown ONLY here — after the server confirmed the save.
        track('demo_form_submitted', { asset: ASSET });
        form.hidden = true;
        successBox.hidden = false;
        successBox.focus?.();
      } else if (out && out.code === 'VALIDATION_ERROR' && Array.isArray(out.fields)) {
        out.fields.forEach((f) => fieldError(f, true));
        setStatus('error', 'Please check the highlighted fields.');
      } else if (out && out.code === 'RATE_LIMITED') {
        setStatus('error', 'Too many requests from this connection. Please try again in an hour, or message us on WhatsApp.');
      } else {
        setStatus('error', buildRetryMessage());
      }
    } catch {
      setStatus('error', buildRetryMessage());
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = submitBtn.dataset.label;
    }
  });

  function buildRetryMessage() {
    const wa = has(SITE_CONFIG.WHATSAPP_PUBLIC_URL)
      ? ` or <a href="${SITE_CONFIG.WHATSAPP_PUBLIC_URL}" target="_blank" rel="noopener">message us on WhatsApp</a>`
      : '';
    return `We couldn't save your request yet — nothing was lost on your side. Please try again${wa}.`;
  }
}
