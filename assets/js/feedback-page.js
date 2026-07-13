/**
 * Guest Feedback & Reviews page behavior (/feedback/).
 * Compliant review funnel:
 *  - every rating is submitted and stored;
 *  - low ratings -> private "we'll fix it now" recovery path (staff alerted);
 *  - high ratings -> invited to a public review;
 *  - the public review link is offered on BOTH paths (never gated by score).
 * Success is shown ONLY after the server confirms the save.
 */
import { initAnalytics, track } from './analytics.js';
import { SITE_CONFIG, has } from './site-config.js';

initAnalytics();

const params = new URLSearchParams(location.search);
const brand = (params.get('brand') || SITE_CONFIG.FEEDBACK_BRAND || 'our villas').slice(0, 120);
const villa = (params.get('villa') || '').slice(0, 120);
const guestName = (params.get('guest') || '').slice(0, 100);
const stageParam = params.get('stage');
const stage = ['mid_stay', 'checkout', 'post_stay'].includes(stageParam) ? stageParam : 'checkout';

// Personalize copy
const brandEls = document.querySelectorAll('[data-brand]');
brandEls.forEach((el) => { el.textContent = brand; });
const ctxEl = document.getElementById('fb-context');
if (ctxEl) {
  const bits = [];
  if (guestName) bits.push(guestName);
  if (villa) bits.push(villa);
  ctxEl.textContent = bits.length ? bits.join(' · ') : '';
  ctxEl.hidden = bits.length === 0;
}
if (stage === 'mid_stay') {
  const h = document.getElementById('fb-question');
  if (h) h.textContent = `How is your stay so far${villa ? ' at ' + villa : ''}?`;
}

track('feedback_view', { asset: 'feedback', section: stage });

const form = document.getElementById('feedback-form');
const stars = Array.from(document.querySelectorAll('.star'));
const ratingInput = document.getElementById('fb-rating');
const commentLabel = document.getElementById('fb-comment-label');
const statusBox = document.getElementById('fb-status');
const submitBtn = form.querySelector('button[type="submit"]');
const contactWrap = document.getElementById('fb-contact-wrap');

let rating = 0;
function paint(n) {
  stars.forEach((s, i) => s.classList.toggle('on', i < n));
}
function setRating(n) {
  rating = n;
  ratingInput.value = String(n);
  paint(n);
  // Adaptive prompt: low ratings ask "what went wrong", high ask "what did you love"
  if (commentLabel) {
    commentLabel.textContent = n <= 3
      ? 'We’d like to put this right. What happened?'
      : 'Lovely! What did you enjoy most? (optional)';
  }
  // Ask for a contact only when we may need to reach them (low ratings).
  if (contactWrap) contactWrap.hidden = n === 0 || n > 3;
  submitBtn.disabled = n === 0;
  track('feedback_rating', { asset: 'feedback', section: 'r' + n });
}
stars.forEach((s) => {
  s.addEventListener('click', () => setRating(Number(s.dataset.v)));
  s.addEventListener('mouseenter', () => paint(Number(s.dataset.v)));
  s.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setRating(Number(s.dataset.v)); } });
});
form.addEventListener('mouseleave', () => paint(rating));

function setStatus(kind, html) {
  statusBox.hidden = !html;
  statusBox.className = 'form-status' + (kind ? ' form-status-' + kind : '');
  statusBox.innerHTML = html || '';
}

function readUtm() {
  return {
    source: params.get('utm_source') || '', medium: params.get('utm_medium') || '',
    campaign: params.get('utm_campaign') || '', content: params.get('utm_content') || '',
    term: params.get('utm_term') || '',
  };
}
function normWa(raw) {
  let v = String(raw || '').replace(/[\s().\-]/g, '');
  if (!v) return '';
  if (v.startsWith('00')) v = '+' + v.slice(2);
  return /^\+\d{8,15}$/.test(v) ? v : null;
}

form.addEventListener('submit', async (ev) => {
  ev.preventDefault();
  if (rating === 0) { setStatus('error', 'Please tap a rating first.'); return; }
  const data = new FormData(form);
  const wa = normWa(data.get('whatsapp'));
  if (wa === null) { setStatus('error', 'That WhatsApp number looks off — please check it, or leave it blank.'); return; }
  const consent = data.get('consent') === 'on';
  if (wa && !consent) { setStatus('error', 'Please tick the consent box so we can reach you about this.'); return; }

  setStatus('', '');
  submitBtn.disabled = true;
  const label = submitBtn.textContent;
  submitBtn.textContent = 'Sending…';

  const payload = {
    idempotencyKey: form.dataset.idem || (form.dataset.idem = crypto.randomUUID()),
    honeypot: String(data.get('website') || ''),
    brand, villa, guestName, stage, rating,
    comment: String(data.get('comment') || '').trim(),
    whatsapp: String(data.get('whatsapp') || '').trim(),
    consent,
    source: 'feedback:' + stage,
    clientMeta: { landingPath: location.pathname, referrer: document.referrer || '', utm: readUtm() },
  };

  try {
    const res = await fetch('/api/feedback', {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
    });
    const out = await res.json().catch(() => null);
    if (res.ok && out && out.ok === true && out.requestId) {
      track('feedback_submitted', { asset: 'feedback', section: out.route });
      showThanks(out.route, out.reviewUrl);
    } else if (out && out.code === 'VALIDATION_ERROR' && Array.isArray(out.fields)) {
      setStatus('error', 'Please check your entries and try again.');
    } else {
      setStatus('error', "We couldn't save your feedback yet — nothing was lost. Please try again in a moment.");
    }
  } catch {
    setStatus('error', "We couldn't reach the server — nothing was lost. Please try again in a moment.");
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = label;
  }
});

function showThanks(route, reviewUrl) {
  form.hidden = true;
  const box = document.getElementById('fb-thanks');
  const title = document.getElementById('fb-thanks-title');
  const body = document.getElementById('fb-thanks-body');
  const primary = document.getElementById('fb-thanks-primary');
  const secondary = document.getElementById('fb-thanks-secondary');

  if (route === 'recovery') {
    title.textContent = 'Thank you — we’re on it.';
    body.innerHTML = `We’re sorry your stay isn’t perfect. Your feedback just reached our team directly, and someone will reach out to put it right${document.getElementById('fb-contact-wrap').hidden ? '' : ' on WhatsApp'} — ideally before you check out.`;
    // Compliant: unhappy guests are NOT blocked from reviewing publicly.
    if (has(reviewUrl)) {
      secondary.hidden = false;
      secondary.href = reviewUrl;
      secondary.textContent = 'Prefer to post publicly? You can still leave a review';
    }
    primary.hidden = true;
  } else {
    title.textContent = 'Thank you — that means a lot! 🌴';
    body.textContent = 'We’re so glad you’re enjoying your stay. If you have a moment, a public review helps other guests find us — it would make our day.';
    if (has(reviewUrl)) {
      primary.hidden = false;
      primary.href = reviewUrl;
      primary.textContent = 'Leave a Google review';
    } else {
      body.textContent = 'We’re so glad you’re enjoying your stay. Thank you for letting us know!';
    }
    secondary.hidden = true;
  }
  box.hidden = false;
  box.focus?.();
}
