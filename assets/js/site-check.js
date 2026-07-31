/* Instant Website Check — frontend. Calls /api/site-audit and renders the report.
   No PII; all output escaped via textContent. */

const $ = (id) => document.getElementById(id);
const form = $('wc-form');
const urlInput = $('wc-url');
const statusEl = $('wc-status');
const results = $('wc-results');

const AREA_TITLES = {
  speed: 'Loading speed',
  mobile: 'Mobile-friendly',
  google: 'Findable by Google',
  ai: 'AI search readiness (ChatGPT · Perplexity · Google AI)',
  contact: 'Can guests reach you',
};
const AREA_INTRO = {
  speed: 'How quickly your page reaches a guest on a phone.',
  mobile: 'Most guests look at your site on a phone.',
  google: 'Whether guests find you in normal Google search.',
  ai: 'Whether AI assistants (ChatGPT, Perplexity, Google AI) can find and recommend you.',
  contact: 'Whether an interested guest can actually reach you.',
};
const AREA_ORDER = ['speed', 'mobile', 'google', 'ai', 'contact'];
const BADGE = { pass: '✓', warn: '!', fail: '✕', info: 'i' };

function setStatus(msg, isErr) {
  statusEl.textContent = msg || '';
  statusEl.classList.toggle('wc-hidden', !msg);
  statusEl.classList.toggle('err', !!isErr);
}

function el(tag, className, text) {
  const n = document.createElement(tag);
  if (className) n.className = className;
  if (text != null) n.textContent = text;
  return n;
}

function bandClass(score) {
  return score >= 80 ? 'low' : score >= 60 ? 'med' : score >= 40 ? 'medhigh' : 'high';
}

function setMetric(numId, bandId, score, bandText) {
  $(numId).textContent = score == null ? '–' : score;
  const b = $(bandId);
  b.textContent = bandText || '–';
  b.className = 'wc-band ' + (score == null ? 'med' : bandClass(score));
}

/* ---------------------------------------------------------- priority fixes */

function renderFixes(report) {
  const box = $('wc-fixes');
  box.textContent = '';
  const fixes = (report.summary && report.summary.topFixes) || [];
  if (!fixes.length) {
    box.appendChild(el('div', 'wc-clean',
      'Nothing urgent came up. Every check either passed or is optional — see the full list below.'));
    return;
  }
  fixes.forEach((f, i) => {
    const row = el('div', 'wc-fix');
    row.appendChild(el('div', 'rank', String(i + 1)));
    const body = el('div');
    body.appendChild(el('h4', null, f.title));
    body.appendChild(el('p', null, f.detail));
    if (f.why) body.appendChild(el('p', 'why', f.why));
    row.appendChild(body);
    box.appendChild(row);
  });
}

/* ------------------------------------------------------- measured numbers */

function renderNumbers(report) {
  const box = $('wc-nums');
  box.textContent = '';
  const rows = [];
  const lh = report.speed && report.speed.mobile && report.speed.mobile.scores ? report.speed.mobile : null;
  const m = report.measuredSpeed;

  if (m && m.metrics) {
    if (m.metrics.ttfb) rows.push(['Server response', m.metrics.ttfb]);
    if (m.metrics.htmlSize) rows.push(['Page code size', m.metrics.htmlSize]);
    if (m.metrics.compressed) rows.push(['Compressed', m.metrics.compressed]);
  }
  if (m && m.hints) {
    rows.push(['Photos on the page', String(m.hints.images)]);
    rows.push(['Scripts loaded', String(m.hints.scripts)]);
    if (m.hints.blockingScripts) rows.push(['Scripts that delay it', String(m.hints.blockingScripts)]);
  }
  if (lh && lh.metrics) {
    if (lh.metrics.lcp) rows.push(['Time to main content', lh.metrics.lcp]);
    if (lh.metrics.cls) rows.push(['Content jumping', lh.metrics.cls]);
    if (lh.totalBytes) rows.push(['Total page weight', String(lh.totalBytes).replace(/^Total size was\s*/i, '')]);
  }

  for (const [k, v] of rows) {
    const cell = el('div', 'wc-num');
    cell.appendChild(el('span', 'k', k));
    cell.appendChild(el('b', null, v));
    box.appendChild(cell);
  }

  $('wc-speed-source').textContent = lh
    ? 'Speed scored by Google PageSpeed Insights (mobile), plus our own direct measurements.'
    : 'Measured directly by us just now. Google PageSpeed scoring was not available for this run, so the speed score above is ours.';
}

/* ------------------------------------------------------------ check groups */

function checkRow(c) {
  const row = el('div', 'wc-check');
  const badge = el('div', 'wc-badge ' + c.status, BADGE[c.status] || '?');
  const body = el('div');
  body.appendChild(el('b', null, c.title));
  body.appendChild(el('span', null, c.detail));
  row.appendChild(badge);
  row.appendChild(body);
  return row;
}

function renderGroups(report) {
  const groups = $('wc-groups');
  groups.textContent = '';
  for (const area of AREA_ORDER) {
    const items = report.checks.filter((c) => c.area === area);
    if (!items.length) continue;
    const g = el('div', 'wc-group');
    const h = el('h4');
    h.appendChild(document.createTextNode(AREA_TITLES[area]));
    const ok = items.filter((c) => c.status === 'pass').length;
    h.appendChild(el('span', 'wc-tally', ok + ' of ' + items.length + ' passing'));
    g.appendChild(h);
    if (AREA_INTRO[area]) g.appendChild(el('p', 'wc-note', AREA_INTRO[area]));
    items.forEach((c) => g.appendChild(checkRow(c)));
    groups.appendChild(g);
  }
}

/* ------------------------------------------------------------------ render */

function render(report) {
  $('wc-url-label').textContent = report.url;
  $('wc-meta').textContent = 'Prepared by Selena Systems · automated check of the public home page';
  $('wc-verdict').textContent = (report.summary && report.summary.verdict) || '';

  setMetric('wc-overall', 'wc-band', report.summary.overall, report.summary.band);

  const ai = report.aiReadiness || {};
  setMetric('wc-ai', 'wc-ai-band', ai.score, ai.band);
  const aiBlocked = report.checks.some((c) => c.id === 'ai-block' && c.status === 'fail');
  $('wc-ai-note').textContent = aiBlocked
    ? 'This site blocks AI search engines — they cannot cite it at all.'
    : 'Can ChatGPT, Perplexity & Google AI read and cite this site?';

  const lh = report.speed && report.speed.mobile && report.speed.mobile.scores ? report.speed.mobile : null;
  const m = report.measuredSpeed || {};
  const speedScore = lh ? lh.scores.performance : (typeof m.score === 'number' ? m.score : null);
  const speedBandText = speedScore == null
    ? '–'
    : (speedScore >= 80 ? 'Fast' : speedScore >= 55 ? 'Average' : 'Slow');
  setMetric('wc-speed-score', 'wc-speed-band', speedScore, speedBandText);
  $('wc-speed-note').textContent = 'How long a guest on a phone waits before your page is usable.';

  renderFixes(report);
  renderNumbers(report);
  renderGroups(report);

  const tech = $('wc-tech');
  tech.textContent = '';
  if (report.tech && report.tech.length) {
    tech.appendChild(document.createTextNode('Built with: '));
    for (const t of report.tech) tech.appendChild(el('span', 'tag', t));
  }

  $('wc-disclaim').textContent = report.disclaimer;
  results.classList.remove('wc-hidden');
  results.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

async function runCheck() {
  const url = (urlInput.value || '').trim();
  if (!url) { setStatus('Enter a website address first.', true); urlInput.focus(); return; }
  results.classList.add('wc-hidden');
  setStatus('Checking ' + url + ' — this takes a few seconds…');
  $('wc-run').disabled = true;
  try {
    const res = await fetch('/api/site-audit', {
      method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ url }),
    });
    const data = await res.json();
    if (!data.ok) { setStatus(data.message || 'That check could not be completed.', true); return; }
    setStatus('');
    render(data.report);
  } catch (e) {
    setStatus('The check service is unavailable right now. Please try again in a moment.', true);
  } finally {
    $('wc-run').disabled = false;
  }
}

form.addEventListener('submit', (ev) => { ev.preventDefault(); runCheck(); });

// Arrived from the homepage form (/website-check/?url=…) → prefill and run automatically.
const preset = new URLSearchParams(location.search).get('url');
if (preset) { urlInput.value = preset; runCheck(); }
