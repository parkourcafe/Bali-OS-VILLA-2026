/**
 * Result page (FINAL TZ §15): canonical server result from sessionStorage,
 * category bars, strongest/risk areas, disclaimer, audit/playbook gate.
 * No PII in URLs; direct access without session data redirects to /score/.
 */
import { CATEGORY_ORDER, CATEGORY_META } from './scoring.js';
import { storage } from './storage.js';
import { initAnalytics, track } from './analytics.js';
import { postLead, uuid } from './api.js';
import { normalizeWhatsapp } from './quiz-schema.js';
import { SITE_CONFIG, has } from './site-config.js';

initAnalytics();

const result = storage.getResult();
const leadId = storage.getLeadId();
const quiz = storage.getQuizState();

if (!result || !leadId) {
  window.location.replace('/score/');
  throw new Error('no session result');
}

const company = (quiz && quiz.data && quiz.data.company) || 'your company';
const savedWhatsapp = (quiz && quiz.data && quiz.data.whatsapp) || '';
const root = document.getElementById('result-root');
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const riskCopy = {
  low: 'Strong foundation. The main opportunity is to make the response process repeatable before volume increases.',
  medium: 'Good foundation, but some inquiry leakage is likely when several guests message at once or when follow-up is delayed.',
  medium_high: 'Several operational gaps are likely. The fastest improvement is usually response speed, qualification and follow-up discipline.',
  high: 'High risk of losing qualified villa inquiries before they are properly qualified or followed up.',
};

function el(tag, attrs = {}, children = []) {
  const node = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) {
    if (k === 'text') node.textContent = v;
    else if (k === 'class') node.className = v;
    else node.setAttribute(k, v);
  }
  for (const c of [].concat(children)) node.appendChild(c);
  return node;
}

/* ---------- Above the fold ---------- */
const hero = el('div', { class: 'score-hero' });
hero.appendChild(el('p', { class: 'eyebrow', text: 'Your Villa Response Readiness Score' }));
const num = el('div', { class: 'score-num', 'aria-label': `${result.score} out of 100` });
const numSpan = el('span', { text: reducedMotion ? String(result.score) : '0' });
num.appendChild(numSpan);
num.appendChild(el('small', { text: ' / 100' }));
hero.appendChild(num);
hero.appendChild(el('div', { class: `risk-label risk-${result.riskLevel}`, text: result.riskLabel }));
hero.appendChild(el('p', {
  class: 'score-explainer',
  text: `${result.score}/100 is a diagnostic estimate based only on your answers. It is not a measured audit of your inboxes or team performance.`,
}));
root.appendChild(hero);

if (!reducedMotion) {
  const t0 = performance.now();
  const dur = 900;
  const tick = (t) => {
    const p = Math.min(1, (t - t0) / dur);
    numSpan.textContent = String(Math.round(result.score * (1 - Math.pow(1 - p, 3))));
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
}

/* ---------- Summary + category bars ---------- */
const summary = el('div', { class: 'result-summary' });
const summaryCard = el('section', { class: 'summary-card', 'aria-labelledby': 'score-meaning-title' });
summaryCard.appendChild(el('h2', { id: 'score-meaning-title', text: 'What this score means' }));
summaryCard.appendChild(el('p', { text: riskCopy[result.riskLevel] || riskCopy.medium }));
const summaryList = el('ul', { class: 'summary-list' });
[
  ['Score', `${result.score}/100 readiness estimate`],
  ['Status', result.riskLabel],
  ['Focus', 'Fix the highest-risk areas first'],
].forEach(([label, value]) => {
  const item = el('li');
  item.appendChild(el('i', { text: label }));
  item.appendChild(el('span', { text: value }));
  summaryList.appendChild(item);
});
summaryCard.appendChild(summaryList);
summary.appendChild(summaryCard);

const bars = el('div', { class: 'catbars' });
for (const cat of CATEGORY_ORDER) {
  const c = result.categoryScores[cat];
  const isWeak = result.riskAreas.includes(cat);
  const bar = el('div', { class: `catbar ${isWeak ? 'weak' : ''}` });
  const row = el('div', { class: 'row' });
  row.appendChild(el('b', { text: CATEGORY_META[cat].title }));
  row.appendChild(el('span', { text: `${c.score} / ${c.max}` }));
  bar.appendChild(row);
  const track_ = el('div', { class: 'track', role: 'img', 'aria-label': `${CATEGORY_META[cat].title}: ${c.score} of ${c.max}` });
  const fill = el('i', { class: 'fill', style: `width:${reducedMotion ? Math.round(c.percentage * 100) : 0}%` });
  track_.appendChild(fill);
  bar.appendChild(track_);
  bars.appendChild(bar);
  if (!reducedMotion) setTimeout(() => { fill.style.width = `${Math.round(c.percentage * 100)}%`; }, 150);
}
summary.appendChild(bars);
root.appendChild(summary);

/* ---------- Strongest + risk areas ---------- */
const areas = el('div', { class: 'areas-grid' });
const strongestStack = el('section', { class: 'area-stack', 'aria-labelledby': 'strongest-title' });
const strong = el('div', { class: 'area-card strong' });
strong.appendChild(el('h3', { id: 'strongest-title', text: `Strongest area: ${CATEGORY_META[result.strongestArea].title}` }));
strong.appendChild(el('p', { text: CATEGORY_META[result.strongestArea].strong }));
strongestStack.appendChild(strong);
areas.appendChild(strongestStack);

const risksStack = el('section', { class: 'area-stack', 'aria-labelledby': 'risk-title' });
risksStack.appendChild(el('h2', { id: 'risk-title', style: 'font-size:1.25rem;margin:0 0 12px', text: 'Top risk areas to fix first' }));
result.riskAreas.forEach((cat, i) => {
  const card = el('div', { class: 'area-card risk' });
  card.appendChild(el('h3', { text: `${i + 1}. ${CATEGORY_META[cat].title}` }));
  card.appendChild(el('p', { text: CATEGORY_META[cat].risk }));
  risksStack.appendChild(card);
});
areas.appendChild(risksStack);
root.appendChild(areas);

/* ---------- Disclaimer (§15.2 — before main CTA) ---------- */
const disc = el('div', { class: 'disclaimer' });
disc.appendChild(el('p', { text: "This score is a diagnostic estimate based on the answers you provided. It does not measure your team's actual response performance." }));
disc.appendChild(el('p', { style: 'margin-top:8px', text: 'A live inquiry test is conducted only after an authorised company representative requests it and approves the channel, scenario and test window.' }));
root.appendChild(disc);

track('score_shown', { gate: result.gate, scoreBand: result.riskLevel });

/* ---------- Gate branches ---------- */
const panel = el('div', { class: 'gate-panel' });
const statusLive = el('p', { role: 'status', 'aria-live': 'polite', class: 'small', style: 'margin-top:12px' });

function requestButton(label, id) {
  const b = el('button', { class: 'btn btn-primary', type: 'button', id, text: label });
  return b;
}

if (result.gate === 'audit') {
  panel.appendChild(el('h2', { text: 'Business profile: ready for a live inquiry check' }));
  panel.appendChild(el('div', { class: 'profile-tabs' }, [
    el('span', { class: 'profile-tab', text: 'Overview' }),
    el('span', { class: 'profile-tab', text: 'Inquiry channels' }),
    el('span', { class: 'profile-tab', text: 'Response risks' }),
    el('span', { class: 'profile-tab', text: 'Next step' }),
  ]));
  panel.appendChild(el('p', { class: 'body', text: "We'll send one realistic guest inquiry to one public channel you approve. The first report is delivered within 48 hours after the test is sent. Follow-up is tracked for seven days." }));
  const openBtn = requestButton('Test my actual inquiry flow', 'audit-open');
  panel.appendChild(openBtn);
  panel.appendChild(statusLive);
  root.appendChild(panel);

  openBtn.addEventListener('click', () => {
    track('audit_cta_clicked', { gate: 'audit' });
    openAuditModal();
  });
} else {
  panel.appendChild(el('h2', { text: 'Business profile: owner-operated response system' }));
  panel.appendChild(el('div', { class: 'profile-tabs' }, [
    el('span', { class: 'profile-tab', text: 'Overview' }),
    el('span', { class: 'profile-tab', text: 'Inquiry channels' }),
    el('span', { class: 'profile-tab', text: 'Response risks' }),
    el('span', { class: 'profile-tab', text: 'Next step' }),
  ]));
  panel.appendChild(el('p', { class: 'body', text: 'Because you answer inquiries personally, a live mystery test would mostly measure your own phone habits. The Villa Response Playbook is more useful at this stage: approved first-reply, qualification and day 1 / 3 / 7 follow-up templates.' }));
  const row = el('div', { class: 'result-actions', style: 'margin:0' });
  const pbBtn = requestButton('Send me the Playbook on WhatsApp', 'playbook-request');
  row.appendChild(pbBtn);
  if (has(SITE_CONFIG.CALENDAR_URL)) {
    const cal = el('a', { class: 'btn btn-secondary', href: SITE_CONFIG.CALENDAR_URL, rel: 'noopener', text: 'Book a 15-minute call' });
    cal.addEventListener('click', () => track('calendar_clicked', { gate: 'playbook' }));
    row.appendChild(cal);
  }
  panel.appendChild(row);
  panel.appendChild(statusLive);
  root.appendChild(panel);

  pbBtn.addEventListener('click', async () => {
    pbBtn.disabled = true;
    statusLive.textContent = 'Sending your request…';
    try {
      await postLead({ event: 'playbook_requested', idempotencyKey: uuid(), leadId });
      track('playbook_requested', { gate: 'playbook' });
      panel.replaceChildren(
        el('h2', { text: 'Request received.' }),
        el('p', { class: 'body', text: "We'll send the playbook on WhatsApp within one business day." }),
      );
    } catch (err) {
      pbBtn.disabled = false;
      statusLive.textContent = (err && err.message) || 'Something went wrong. Please try again.';
    }
  });
}

/* ---------- Audit consent modal (§15.3) ---------- */
let lastFocused = null;
function openAuditModal() {
  lastFocused = document.activeElement;
  const backdrop = el('div', { class: 'modal-backdrop', role: 'presentation' });
  const modal = el('div', { class: 'modal', role: 'dialog', 'aria-modal': 'true', 'aria-labelledby': 'audit-modal-title' });

  modal.appendChild(el('h2', { id: 'audit-modal-title', text: 'Request your Live Guest Inquiry Audit' }));

  const checkRow = el('label', { class: 'check-row' });
  const checkbox = el('input', { type: 'checkbox', id: 'authority-check' });
  checkRow.appendChild(checkbox);
  checkRow.appendChild(el('span', { text: `I confirm that I represent ${company} and approve testing one of our public inquiry channels.` }));
  modal.appendChild(checkRow);

  modal.appendChild(el('label', { class: 'fld', for: 'audit-whatsapp', text: 'WhatsApp number' }));
  const waInput = el('input', { type: 'tel', id: 'audit-whatsapp', value: savedWhatsapp, autocomplete: 'tel', placeholder: '+62 812 3456 7890' });
  modal.appendChild(waInput);
  const waErr = el('p', { class: 'field-error hidden', id: 'audit-wa-err', 'aria-live': 'polite' });
  modal.appendChild(waErr);

  const actions = el('div', { class: 'result-actions', style: 'margin:22px 0 0' });
  const sendBtn = el('button', { class: 'btn btn-primary', type: 'button', text: 'Request my audit' });
  const cancelBtn = el('button', { class: 'btn btn-secondary', type: 'button', text: 'Cancel' });
  actions.appendChild(sendBtn);
  actions.appendChild(cancelBtn);
  modal.appendChild(actions);
  const modalStatus = el('p', { role: 'status', 'aria-live': 'polite', class: 'small', style: 'margin-top:10px' });
  modal.appendChild(modalStatus);

  backdrop.appendChild(modal);
  document.body.appendChild(backdrop);
  checkbox.focus();

  function close() {
    backdrop.remove();
    if (lastFocused) lastFocused.focus();
    document.removeEventListener('keydown', onKey);
  }
  function onKey(e) {
    if (e.key === 'Escape') close();
    if (e.key === 'Tab') {
      const focusables = modal.querySelectorAll('input, button');
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  }
  document.addEventListener('keydown', onKey);
  cancelBtn.addEventListener('click', close);
  backdrop.addEventListener('click', (e) => { if (e.target === backdrop) close(); });

  sendBtn.addEventListener('click', async () => {
    waErr.classList.add('hidden');
    if (!checkbox.checked) {
      modalStatus.textContent = 'Please confirm you are authorised to approve this test.';
      checkbox.focus();
      return;
    }
    const wa = normalizeWhatsapp(waInput.value);
    if (!wa) {
      waErr.textContent = 'Please enter a full number, e.g. +62 812 3456 7890.';
      waErr.classList.remove('hidden');
      waInput.focus();
      return;
    }
    sendBtn.disabled = true;
    modalStatus.textContent = 'Sending your request…';
    try {
      await postLead({
        event: 'audit_requested',
        idempotencyKey: uuid(),
        leadId,
        authorityConfirmed: true,
        whatsapp: wa,
      });
      track('audit_requested', { gate: 'audit' });
      close();
      panel.replaceChildren(
        el('h2', { text: 'Request received.' }),
        el('p', { class: 'body', text: "We'll message you on WhatsApp to confirm the channel, scenario and test window. Nothing will be sent before those details are approved." }),
      );
    } catch (err) {
      sendBtn.disabled = false;
      modalStatus.textContent = (err && err.message) || 'Something went wrong. Please try again.';
    }
  });
}

/* ---------- Shared actions (§15.5) ---------- */
const actions = el('div', { class: 'result-actions' });
const retake = el('button', { class: 'btn btn-secondary', type: 'button', text: 'Retake assessment' });
retake.addEventListener('click', () => {
  storage.clearAll();
  window.location.href = '/score/';
});
const copyBtn = el('button', { class: 'btn btn-secondary', type: 'button', text: 'Copy result summary' });
const copyStatus = el('span', { role: 'status', 'aria-live': 'polite', class: 'small' });
copyBtn.addEventListener('click', async () => {
  // Summary contains no PII: no company, name or contact details.
  const lines = [
    `Villa Response Readiness Score: ${result.score}/100 (${result.riskLabel})`,
    `Strongest area: ${CATEGORY_META[result.strongestArea].title}`,
    `Top risk areas: ${result.riskAreas.map((c) => CATEGORY_META[c].title).join(', ')}`,
    'Assessed at selenasystems — diagnostic estimate based on self-reported answers.',
  ];
  try {
    await navigator.clipboard.writeText(lines.join('\n'));
    copyStatus.textContent = 'Copied.';
  } catch {
    copyStatus.textContent = 'Copy failed — select and copy manually.';
  }
});
actions.appendChild(retake);
actions.appendChild(copyBtn);
actions.appendChild(copyStatus);
root.appendChild(actions);
