/**
 * Villa Demo Selena chat UI (/demo-agent/).
 * Sends the running conversation to /api/demo-agent and renders replies.
 * Never fabricates a reply on error — shows an error line instead.
 */
import { initAnalytics, track } from './analytics.js';
initAnalytics();
track('demo_agent_view', { asset: 'demo-agent' });

const msgsEl = document.getElementById('chat-msgs');
const form = document.getElementById('chat-form');
const input = document.getElementById('chat-input');
const sendBtn = form.querySelector('button[type="submit"]');
const errEl = document.getElementById('da-err');
const modeEl = document.getElementById('da-mode');
const chips = document.getElementById('chips');

const history = []; // {role, content}
let busy = false;

function bubble(role, text, handoff) {
  const div = document.createElement('div');
  div.className = 'msg ' + (role === 'user' ? 'msg-guest' : 'msg-ai');
  div.textContent = text;
  if (handoff) {
    const s = document.createElement('span');
    s.className = 'ho';
    s.textContent = '↪ handed to a human on the client side';
    div.appendChild(s);
  }
  msgsEl.appendChild(div);
  msgsEl.scrollTop = msgsEl.scrollHeight;
}
function sys(text) {
  const d = document.createElement('div');
  d.className = 'msg-sys'; d.textContent = text;
  msgsEl.appendChild(d); msgsEl.scrollTop = msgsEl.scrollHeight;
}
function typing(on) {
  let t = document.getElementById('da-typing');
  if (on && !t) {
    t = document.createElement('div'); t.id = 'da-typing'; t.className = 'typing';
    t.innerHTML = '<i></i><i></i><i></i>';
    msgsEl.appendChild(t); msgsEl.scrollTop = msgsEl.scrollHeight;
  } else if (!on && t) { t.remove(); }
}
function setMode(mode) {
  if (!mode) return;
  modeEl.textContent = mode === 'live' ? 'live · Claude' : 'demo mode';
  modeEl.className = 'da-mode ' + (mode === 'live' ? 'da-mode-live' : 'da-mode-mock');
}

async function send(text) {
  if (busy || !text.trim()) return;
  busy = true; sendBtn.disabled = true; errEl.hidden = true;
  bubble('user', text.trim());
  history.push({ role: 'user', content: text.trim() });
  track('demo_agent_message', { asset: 'demo-agent' });
  typing(true);
  try {
    const res = await fetch('/api/demo-agent', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ messages: history, honeypot: form.website?.value || '' }),
    });
    const out = await res.json().catch(() => null);
    typing(false);
    if (res.ok && out && out.ok && out.reply) {
      setMode(out.mode);
      bubble('assistant', out.reply, out.handoff);
      history.push({ role: 'assistant', content: out.reply });
    } else if (out && out.code === 'RATE_LIMITED') {
      errEl.hidden = false; errEl.textContent = out.message || 'Busy right now — please try again in a moment.';
      history.pop(); // allow retry of the same turn
    } else {
      errEl.hidden = false; errEl.textContent = (out && out.message) || 'The assistant is briefly unavailable — please try again.';
      history.pop();
    }
  } catch {
    typing(false);
    errEl.hidden = false; errEl.textContent = "Couldn't reach the assistant — please try again.";
    history.pop();
  } finally {
    busy = false; sendBtn.disabled = false; input.focus();
  }
}

form.addEventListener('submit', (e) => { e.preventDefault(); const v = input.value; input.value = ''; send(v); });
chips.addEventListener('click', (e) => {
  const b = e.target.closest('.chip'); if (!b) return;
  send(b.dataset.msg);
});

// Opening line from the assistant (not counted as a conversation turn).
sys('Selena Demo Villas · fictional demo');
bubble('assistant', 'Hello, and welcome to Selena Demo Villas! 🌴 I can help you find the right villa — Villa Surya (Uluwatu), Villa Ombak (Canggu) or Villa Rimba (Ubud). Which area appeals, and what dates are you thinking?');
