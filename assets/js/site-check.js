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
  ai: 'Readable by AI assistants',
  contact: 'Can guests reach you',
};
const AREA_ORDER = ['mobile', 'google', 'ai', 'contact'];
const BADGE = { pass: '✓', warn: '!', fail: '✕', info: 'i' };

function setStatus(msg, isErr) {
  statusEl.textContent = msg || '';
  statusEl.classList.toggle('wc-hidden', !msg);
  statusEl.classList.toggle('err', !!isErr);
}

function ring(label, score) {
  const card = document.createElement('div');
  card.className = 'card';
  const h = document.createElement('h4'); h.textContent = label; card.appendChild(h);
  const wrap = document.createElement('div'); wrap.className = 'wc-ring';
  const b = document.createElement('b'); b.textContent = (score == null ? '–' : score);
  const small = document.createElement('span'); small.textContent = '/100';
  small.style.color = '#8a99a0'; small.style.fontSize = '.9rem';
  wrap.appendChild(b); wrap.appendChild(small); card.appendChild(wrap);
  return card;
}

function renderSpeed(speed) {
  const box = $('wc-speed'); box.textContent = '';
  for (const strat of ['mobile', 'desktop']) {
    const s = speed && speed[strat];
    const card = document.createElement('div'); card.className = 'card';
    const h = document.createElement('h4'); h.textContent = strat === 'mobile' ? 'Speed — mobile' : 'Speed — desktop';
    card.appendChild(h);
    if (!s || s.error || !s.scores) {
      const p = document.createElement('p'); p.className = 'wc-note';
      p.textContent = 'Speed data unavailable right now.'; card.appendChild(p);
      box.appendChild(card); continue;
    }
    const rings = document.createElement('div'); rings.style.display = 'flex'; rings.style.gap = '18px'; rings.style.flexWrap = 'wrap';
    rings.appendChild(ring('Performance', s.scores.performance));
    rings.appendChild(ring('SEO', s.scores.seo));
    card.appendChild(rings);
    if (s.metrics) {
      const ul = document.createElement('ul'); ul.className = 'wc-metrics';
      const rows = [['Largest content paint', s.metrics.lcp], ['Total blocking time', s.metrics.tbt], ['Layout shift', s.metrics.cls]];
      if (s.totalBytes) rows.push(['Total page size', s.totalBytes.replace(/^Total size was\s*/i, '')]);
      for (const [k, v] of rows) { if (!v) continue; const li = document.createElement('li'); const a = document.createElement('span'); a.textContent = k; const bb = document.createElement('span'); bb.textContent = v; li.appendChild(a); li.appendChild(bb); ul.appendChild(li); }
      card.appendChild(ul);
    }
    box.appendChild(card);
  }
}

function checkRow(c) {
  const row = document.createElement('div'); row.className = 'wc-check';
  const badge = document.createElement('div'); badge.className = 'wc-badge ' + c.status; badge.textContent = BADGE[c.status] || '?';
  const body = document.createElement('div');
  const b = document.createElement('b'); b.textContent = c.title;
  const span = document.createElement('span'); span.textContent = c.detail;
  body.appendChild(b); body.appendChild(span);
  row.appendChild(badge); row.appendChild(body);
  return row;
}

function render(report) {
  $('wc-overall').textContent = report.summary.overall;
  const band = $('wc-band'); band.textContent = report.summary.band;
  const cls = report.summary.overall >= 80 ? 'low' : report.summary.overall >= 60 ? 'med' : report.summary.overall >= 40 ? 'medhigh' : 'high';
  band.className = 'wc-band ' + cls;
  $('wc-url-label').textContent = 'Checked: ' + report.url;

  const tech = $('wc-tech'); tech.textContent = '';
  if (report.tech && report.tech.length) {
    tech.appendChild(document.createTextNode('Built with: '));
    for (const t of report.tech) { const s = document.createElement('span'); s.className = 'tag'; s.textContent = t; tech.appendChild(s); }
  }

  renderSpeed(report.speed);

  const groups = $('wc-groups'); groups.textContent = '';
  for (const area of AREA_ORDER) {
    const items = report.checks.filter((c) => c.area === area);
    if (!items.length) continue;
    const g = document.createElement('div'); g.className = 'wc-group';
    const h = document.createElement('h3'); h.textContent = AREA_TITLES[area]; g.appendChild(h);
    items.forEach((c) => g.appendChild(checkRow(c)));
    groups.appendChild(g);
  }
  $('wc-disclaim').textContent = report.disclaimer;
  results.classList.remove('wc-hidden');
}

form.addEventListener('submit', async (ev) => {
  ev.preventDefault();
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
});
