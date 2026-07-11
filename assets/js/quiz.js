/**
 * Assessment flow engine (FINAL TZ §8, §5.3, §5.4, §24).
 * Renders 12 screens, persists to sessionStorage, submits raw answers,
 * stores the canonical server result, then navigates to /score/result/.
 */
import { STEPS, TOTAL_STEPS, normalizeWhatsapp, isValidEmail } from './quiz-schema.js';
import { storage, captureUtm } from './storage.js';
import { initAnalytics, track } from './analytics.js';
import { postLead, uuid } from './api.js';

initAnalytics();
captureUtm();

const root = document.getElementById('step-root');
const progressEl = document.getElementById('progress');
const progressFill = document.getElementById('progress-fill');
const btnBack = document.getElementById('btn-back');
const btnNext = document.getElementById('btn-next');
const btnSubmit = document.getElementById('btn-submit');
const microcopy = document.getElementById('microcopy');
const submitAlert = document.getElementById('submit-alert');
const liveStatus = document.getElementById('live-status');

const AUTO_ADVANCE_MS = 300;
let state = storage.getQuizState() || { step: 0, data: {} };
let failedAttempts = 0;
let submitting = false;

if (!storage.getStartedAt()) storage.setStartedAt(new Date().toISOString());
track('quiz_started', { step: state.step + 1 });

function save() {
  storage.setQuizState(state);
}

function esc(s) {
  const d = document.createElement('div');
  d.textContent = String(s ?? '');
  return d.innerHTML;
}

function setNav({ back, next, submit }) {
  btnBack.classList.toggle('hidden', !back);
  btnNext.classList.toggle('hidden', !next);
  btnSubmit.classList.toggle('hidden', !submit);
  microcopy.classList.toggle('hidden', !submit);
}

function render() {
  const step = STEPS[state.step];
  const n = state.step + 1;
  progressEl.textContent = `Step ${n} of ${TOTAL_STEPS}`;
  progressFill.style.width = `${Math.round((n / TOTAL_STEPS) * 100)}%`;
  submitAlert.classList.add('hidden');

  let html = `<h1 class="q-title" id="q-title" tabindex="-1">${esc(step.title)}</h1>`;
  if (step.helper) html += `<p class="q-helper">${esc(step.helper)}</p>`;

  if (step.type === 'fields' || step.type === 'contact') {
    html += step.fields.map((f) => `
      <label class="fld" for="f-${f.name}">${esc(f.label)}${f.required ? '' : ''}</label>
      <input id="f-${f.name}" name="${f.name}" type="${f.type}" ${f.maxLength ? `maxlength="${f.maxLength}"` : ''}
        ${f.placeholder ? `placeholder="${esc(f.placeholder)}"` : ''} ${f.autocomplete ? `autocomplete="${f.autocomplete}"` : ''}
        value="${esc(state.data[f.name] || '')}" ${f.required ? 'aria-required="true"' : ''}>
      <p class="field-error hidden" id="err-${f.name}" aria-live="polite"></p>`).join('');
    if (step.headache) {
      html += `<label class="fld" for="f-headache">${esc(step.headache.label)}</label>
        <select id="f-headache" name="headache">${step.headache.options.map((o) =>
          `<option value="${o.value}" ${state.data.headache === o.value ? 'selected' : ''}>${esc(o.label)}</option>`).join('')}</select>
        <div id="other-headache-wrap" class="${state.data.headache === 'other' ? '' : 'hidden'}">
          <label class="fld" for="f-otherHeadache">Tell us in a few words</label>
          <input id="f-otherHeadache" name="otherHeadache" type="text" maxlength="120" value="${esc(state.data.otherHeadache || '')}">
        </div>`;
    }
  } else if (step.type === 'radio') {
    html += `<fieldset><legend>${esc(step.title)}</legend>` + step.options.map((o, i) => `
      <label class="opt ${state.data[step.id] === o.value ? 'selected' : ''}">
        <input type="radio" name="${step.id}" value="${o.value}" ${state.data[step.id] === o.value ? 'checked' : ''}>
        <span>${esc(o.label)}</span>
      </label>`).join('') + '</fieldset>';
  } else if (step.type === 'multi') {
    const chosen = new Set(state.data[step.id] || []);
    html += `<fieldset><legend>${esc(step.title)}</legend>` + step.options.map((o) => `
      <label class="opt ${chosen.has(o.value) ? 'selected' : ''}">
        <input type="checkbox" name="${step.id}" value="${o.value}" ${chosen.has(o.value) ? 'checked' : ''}>
        <span>${esc(o.label)}</span>
      </label>`).join('') + '</fieldset>';
    const otherOpt = step.options.find((o) => o.otherField);
    if (otherOpt) {
      html += `<div id="other-channel-wrap" class="${chosen.has('other') ? '' : 'hidden'}">
        <label class="fld" for="f-otherChannel">${esc(otherOpt.otherField.label)}</label>
        <input id="f-otherChannel" type="text" maxlength="${otherOpt.otherField.maxLength}" value="${esc(state.data.otherChannel || '')}">
      </div>`;
    }
    html += `<p class="field-error hidden" id="err-multi" aria-live="polite"></p>`;
  }

  root.innerHTML = html;
  setNav({
    back: state.step > 0,
    next: step.type !== 'contact',
    submit: step.type === 'contact',
  });
  if (step.type === 'contact') microcopy.textContent = step.microcopy;

  wireStep(step);
  track('step_viewed', { step: n });
  document.getElementById('q-title').focus({ preventScroll: false });
}

function wireStep(step) {
  if (step.type === 'radio') {
    root.querySelectorAll('.opt').forEach((labelEl) => {
      const input = labelEl.querySelector(`input[name="${step.id}"]`);
      if (!input) return;
      // Pointer taps anywhere on the option card auto-advance; keyboard users continue explicitly.
      labelEl.addEventListener('pointerdown', () => { input.dataset.pointer = '1'; });
      input.addEventListener('keydown', () => { input.dataset.pointer = ''; });
      input.addEventListener('change', (e) => {
        state.data[step.id] = e.target.value;
        save();
        root.querySelectorAll('.opt').forEach((l) => l.classList.toggle('selected', l.contains(e.target)));
        if (e.target.dataset.pointer === '1') {
          const scheduledStep = state.step;
          setTimeout(() => { if (state.step === scheduledStep) goNext(); }, AUTO_ADVANCE_MS);
        }
      });
    });
  } else if (step.type === 'multi') {
    root.querySelectorAll(`input[name="${step.id}"]`).forEach((input) => {
      input.addEventListener('change', () => {
        const chosen = [...root.querySelectorAll(`input[name="${step.id}"]:checked`)].map((c) => c.value);
        state.data[step.id] = chosen;
        save();
        root.querySelectorAll('.opt').forEach((l) => {
          const inp = l.querySelector('input');
          l.classList.toggle('selected', inp.checked);
        });
        const wrap = document.getElementById('other-channel-wrap');
        if (wrap) wrap.classList.toggle('hidden', !chosen.includes('other'));
      });
    });
    const otherInput = document.getElementById('f-otherChannel');
    if (otherInput) otherInput.addEventListener('input', (e) => { state.data.otherChannel = e.target.value; save(); });
  } else {
    root.querySelectorAll('input, select').forEach((el) => {
      el.addEventListener('input', () => { state.data[el.name || el.id.replace(/^f-/, '')] = el.value; save(); });
      el.addEventListener('change', () => {
        state.data[el.name || el.id.replace(/^f-/, '')] = el.value; save();
        if (el.id === 'f-headache') {
          const wrap = document.getElementById('other-headache-wrap');
          if (wrap) wrap.classList.toggle('hidden', el.value !== 'other');
        }
      });
    });
  }
}

function showError(id, msg) {
  const el = document.getElementById(id);
  if (el) { el.textContent = msg; el.classList.remove('hidden'); }
}

function validateStep(step) {
  root.querySelectorAll('.field-error').forEach((e) => e.classList.add('hidden'));
  root.querySelectorAll('.invalid').forEach((e) => e.classList.remove('invalid'));

  if (step.type === 'radio') {
    if (!state.data[step.id]) {
      liveStatus.textContent = 'Please choose an option to continue.';
      root.querySelector('fieldset').insertAdjacentHTML('beforeend',
        '<p class="field-error">Please choose an option to continue.</p>');
      return false;
    }
    return true;
  }
  if (step.type === 'multi') {
    const chosen = state.data[step.id] || [];
    if (chosen.length < (step.minSelected || 1)) {
      showError('err-multi', 'Please select at least one channel.');
      liveStatus.textContent = 'Please select at least one channel.';
      return false;
    }
    return true;
  }
  let ok = true;
  const errors = [];
  for (const f of (step.fields || [])) {
    const el = document.getElementById(`f-${f.name}`);
    const val = (el.value || '').trim();
    let msg = '';
    if (f.required && !val) msg = 'This field is required.';
    else if (f.maxLength && val.length > f.maxLength) msg = `Maximum ${f.maxLength} characters.`;
    else if (f.name === 'whatsapp' && val && !normalizeWhatsapp(val)) msg = 'Please enter a full number, e.g. +62 812 3456 7890.';
    else if (f.type === 'email' && val && !isValidEmail(val)) msg = 'Please check the email address.';
    if (msg) {
      ok = false;
      el.classList.add('invalid');
      showError(`err-${f.name}`, msg);
      errors.push(f.label + ': ' + msg);
    }
  }
  if (!ok) liveStatus.textContent = 'Please fix: ' + errors.join(' ');
  return ok;
}

function goNext() {
  const step = STEPS[state.step];
  if (!validateStep(step)) return;
  track('step_completed', { step: state.step + 1 });
  if (state.step < TOTAL_STEPS - 1) {
    state.step += 1;
    save();
    render();
  }
}

function goBack() {
  if (state.step === 0) return;
  track('quiz_back_clicked', { step: state.step + 1 });
  state.step -= 1;
  save();
  render();
}

async function submit() {
  const step = STEPS[state.step];
  track('contact_submit_started', { step: TOTAL_STEPS });
  if (!validateStep(step)) { track('form_error', { step: TOTAL_STEPS }); return; }
  if (submitting) return;
  submitting = true;
  btnSubmit.disabled = true;
  btnSubmit.textContent = 'Calculating…';

  const d = state.data;
  const body = {
    event: 'score_completed',
    idempotencyKey: state.idempotencyKey || (state.idempotencyKey = uuid(), save(), state.idempotencyKey),
    profile: {
      company: (d.company || '').trim(),
      publicUrl: (d.publicUrl || '').trim(),
      villaCount: d.villaCount,
      whoAnswers: d.whoAnswers,
      channels: d.channels || [],
      otherChannel: (d.otherChannel || '').trim(),
      headache: d.headache || '',
      otherHeadache: (d.otherHeadache || '').trim(),
    },
    answers: {
      channelManagement: d.channelManagement,
      afterHours: d.afterHours,
      responseTime: d.responseTime,
      qualification: d.qualification,
      followUp: d.followUp,
      escalation: d.escalation,
      visibility: d.visibility,
    },
    contact: {
      name: (d.name || '').trim(),
      whatsapp: normalizeWhatsapp(d.whatsapp || ''),
      email: (d.email || '').trim(),
    },
    clientMeta: {
      startedAt: storage.getStartedAt(),
      submittedAt: new Date().toISOString(),
      landingPath: '/',
      referrer: document.referrer ? new URL(document.referrer).hostname : '',
      utm: storage.getUtm() || { source: '', medium: '', campaign: '', content: '', term: '' },
    },
    honeypot: document.getElementById('hp-website2').value || '',
  };

  try {
    const res = await postLead(body);
    storage.setResult(res.result);
    storage.setLeadId(res.leadId);
    track('contact_submitted', { gate: res.result.gate, scoreBand: res.result.riskLevel });
    window.location.href = '/score/result/';
  } catch (err) {
    failedAttempts += 1;
    track('form_error', { code: err.code || 'UNKNOWN' });
    let msg = "We couldn't save your assessment yet.\nYour answers are still here. Please try again.";
    if (err.code === 'VALIDATION_ERROR') msg = err.message || msg;
    submitAlert.textContent = '';
    submitAlert.classList.remove('hidden');
    const p = document.createElement('p');
    p.style.whiteSpace = 'pre-line';
    p.textContent = msg;
    submitAlert.appendChild(p);
    if (failedAttempts >= 2) {
      const { SITE_CONFIG, has } = await import('./site-config.js');
      if (has(SITE_CONFIG.WHATSAPP_PUBLIC_URL)) {
        const a = document.createElement('a');
        a.href = SITE_CONFIG.WHATSAPP_PUBLIC_URL;
        a.rel = 'noopener';
        a.textContent = 'Or message us on WhatsApp and we will run it with you.';
        a.addEventListener('click', () => track('whatsapp_clicked'));
        submitAlert.appendChild(a);
      }
    }
    btnSubmit.disabled = false;
    btnSubmit.textContent = 'Show my score';
    submitting = false;
  }
}

btnNext.addEventListener('click', goNext);
btnBack.addEventListener('click', goBack);
document.getElementById('quiz-form').addEventListener('submit', (e) => { e.preventDefault(); submit(); });
document.getElementById('quiz-form').addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && STEPS[state.step].type !== 'contact' && e.target.tagName !== 'TEXTAREA') {
    e.preventDefault();
    goNext();
  }
});

render();
