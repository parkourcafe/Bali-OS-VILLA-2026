/**
 * Villa Ops OS — visual dashboard generator.
 *
 * Renders the phone-friendly project dashboard from the single canonical
 * status source `docs/project-status.json`, so the dashboard and START_HERE.md
 * can't drift: change status in ONE place, regenerate, re-publish.
 *
 * Zero dependencies (Node builtins only). Usage:
 *   node scripts/build-dashboard.mjs              -> writes build/dashboard.html
 *                                                    (Artifact-ready: style + body content, no <html>/<head>)
 *   node scripts/build-dashboard.mjs --standalone -> also writes build/dashboard.standalone.html
 *                                                    (a full <!doctype> document you can open in a browser)
 *   node scripts/build-dashboard.mjs --stdout     -> prints the Artifact-ready HTML to stdout
 *
 * Refresh flow (keeps the dashboard in sync with the status):
 *   1. Edit docs/project-status.json (and mirror the change in START_HERE.md).
 *   2. Run this script.
 *   3. Re-publish the Artifact so it keeps the SAME URL (build/dashboard.html):
 *        - the session that first published it: republish that same file path;
 *        - any other session: publish it with url=<artifactUrl>
 *          (artifactUrl is stored in docs/project-status.json).
 *
 * build/dashboard.html is body-level content (a <style> block + the markup),
 * which is exactly what the Artifact host expects — it supplies the surrounding
 * <html>/<head>/<body> skeleton itself.
 */
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '..');
const dataPath = join(root, 'docs', 'project-status.json');

const esc = (s) => String(s).replace(/&(?![a-zA-Z#0-9]+;)/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
// Note fields intentionally allow inline HTML (operator-authored, private page);
// only short structured fields (numbers, pill labels, tier values) are escaped.

const STYLE = `<style>
  :root {
    --paper:#F1EEE4; --surface:#FBF9F3; --surface-2:#F6F2E9;
    --ink:#16221D; --muted:#5E6B64; --line:#E2DCCE;
    --accent:#1F6B5B; --accent-soft:rgba(31,107,91,.10); --accent-ink:#FBF9F3;
    --gold:#9C6E27;
    --good:#2E7D4F; --good-soft:rgba(46,125,79,.12);
    --warn:#9A6E22; --warn-soft:rgba(154,110,34,.14);
    --crit:#A6402C; --crit-soft:rgba(166,64,44,.12);
    --shadow:0 1px 2px rgba(22,34,29,.04), 0 8px 24px rgba(22,34,29,.06);
    --serif:ui-serif,"Iowan Old Style",Georgia,"Times New Roman",serif;
    --sans:ui-sans-serif,system-ui,-apple-system,"Segoe UI",Roboto,sans-serif;
    --mono:ui-monospace,"SF Mono",Menlo,Consolas,monospace;
  }
  @media (prefers-color-scheme: dark) {
    :root {
      --paper:#0F1714; --surface:#17211C; --surface-2:#1C2721;
      --ink:#E9E5D9; --muted:#94A199; --line:#26322B;
      --accent:#43A78E; --accent-soft:rgba(67,167,142,.14); --accent-ink:#0F1714;
      --gold:#C79A4E;
      --good:#54B47E; --good-soft:rgba(84,180,126,.15);
      --warn:#C79A4E; --warn-soft:rgba(199,154,78,.15);
      --crit:#D2745E; --crit-soft:rgba(210,116,94,.15);
      --shadow:0 1px 2px rgba(0,0,0,.3), 0 10px 30px rgba(0,0,0,.35);
    }
  }
  :root[data-theme="light"] {
    --paper:#F1EEE4; --surface:#FBF9F3; --surface-2:#F6F2E9;
    --ink:#16221D; --muted:#5E6B64; --line:#E2DCCE;
    --accent:#1F6B5B; --accent-soft:rgba(31,107,91,.10); --accent-ink:#FBF9F3;
    --gold:#9C6E27;
    --good:#2E7D4F; --good-soft:rgba(46,125,79,.12);
    --warn:#9A6E22; --warn-soft:rgba(154,110,34,.14);
    --crit:#A6402C; --crit-soft:rgba(166,64,44,.12);
    --shadow:0 1px 2px rgba(22,34,29,.04), 0 8px 24px rgba(22,34,29,.06);
  }
  :root[data-theme="dark"] {
    --paper:#0F1714; --surface:#17211C; --surface-2:#1C2721;
    --ink:#E9E5D9; --muted:#94A199; --line:#26322B;
    --accent:#43A78E; --accent-soft:rgba(67,167,142,.14); --accent-ink:#0F1714;
    --gold:#C79A4E;
    --good:#54B47E; --good-soft:rgba(84,180,126,.15);
    --warn:#C79A4E; --warn-soft:rgba(199,154,78,.15);
    --crit:#D2745E; --crit-soft:rgba(210,116,94,.15);
    --shadow:0 1px 2px rgba(0,0,0,.3), 0 10px 30px rgba(0,0,0,.35);
  }

  * { box-sizing:border-box; }
  body { margin:0; background:var(--paper); color:var(--ink);
    font-family:var(--sans); font-size:16px; line-height:1.55;
    -webkit-font-smoothing:antialiased; }
  .wrap { max-width:760px; margin:0 auto; padding:28px 20px 64px; }

  .eyebrow { font-size:.7rem; font-weight:700; letter-spacing:.16em;
    text-transform:uppercase; color:var(--accent); margin:0 0 10px; }
  h1 { font-family:var(--serif); font-weight:500; font-size:clamp(1.95rem,6vw,2.7rem);
    line-height:1.08; letter-spacing:-.01em; margin:0 0 8px; text-wrap:balance; }
  .lede { color:var(--muted); font-size:1.02rem; margin:0 0 18px; max-width:60ch; }
  .metaline { display:flex; flex-wrap:wrap; gap:8px 16px; font-size:.8rem;
    color:var(--muted); border-top:1px solid var(--line); padding-top:14px; }
  .metaline b { color:var(--ink); font-weight:600; }
  .metaline code { font-family:var(--mono); font-size:.76rem; background:var(--surface-2);
    border:1px solid var(--line); border-radius:5px; padding:1px 6px; }

  section { margin-top:34px; }
  .sec-label { font-size:.72rem; font-weight:700; letter-spacing:.14em;
    text-transform:uppercase; color:var(--muted); margin:0 0 14px;
    display:flex; align-items:center; gap:10px; }
  .sec-label::after { content:""; flex:1; height:1px; background:var(--line); }

  .stats { display:grid; grid-template-columns:repeat(2,1fr); gap:12px; }
  @media (min-width:560px){ .stats { grid-template-columns:repeat(4,1fr); } }
  .stat { background:var(--surface); border:1px solid var(--line); border-radius:14px;
    padding:16px 16px 14px; box-shadow:var(--shadow); }
  .stat .n { font-family:var(--serif); font-size:2rem; line-height:1; color:var(--accent);
    font-variant-numeric:tabular-nums; }
  .stat .n.alert { color:var(--crit); }
  .stat .k { font-size:.74rem; color:var(--muted); margin-top:7px; }

  .card { background:var(--surface); border:1px solid var(--line); border-radius:16px;
    box-shadow:var(--shadow); padding:6px 4px; }

  .row { display:flex; align-items:flex-start; gap:12px; padding:12px 16px;
    border-bottom:1px solid var(--line); }
  .row:last-child { border-bottom:none; }
  .row .rl { flex:1; min-width:0; }
  .row .rl b { font-weight:600; }
  .row .rl span { display:block; font-size:.82rem; color:var(--muted); margin-top:2px; }

  .pill { flex:none; display:inline-flex; align-items:center; gap:6px;
    font-size:.68rem; font-weight:700; letter-spacing:.04em; text-transform:uppercase;
    padding:5px 10px; border-radius:999px; white-space:nowrap; }
  .pill::before { content:""; width:7px; height:7px; border-radius:50%; background:currentColor; }
  .pill.good { color:var(--good); background:var(--good-soft); }
  .pill.warn { color:var(--warn); background:var(--warn-soft); }
  .pill.crit { color:var(--crit); background:var(--crit-soft); }
  .pill.flat { color:var(--muted); background:var(--surface-2); }

  .attention { border-color:color-mix(in srgb, var(--crit) 30%, var(--line)); }

  .lane { margin-bottom:14px; }
  .lane h3 { font-size:.78rem; letter-spacing:.06em; text-transform:uppercase;
    margin:0 0 8px; display:flex; align-items:center; gap:8px; }
  .tag { font-size:.62rem; font-weight:800; letter-spacing:.06em; padding:2px 7px;
    border-radius:5px; }
  .tag.p0 { color:var(--crit); background:var(--crit-soft); }
  .tag.p1 { color:var(--warn); background:var(--warn-soft); }
  .tag.p2 { color:var(--accent); background:var(--accent-soft); }
  ul.acts { margin:0; padding:0; list-style:none; }
  ul.acts li { position:relative; padding:7px 0 7px 26px; font-size:.94rem;
    border-bottom:1px dotted var(--line); }
  ul.acts li:last-child { border-bottom:none; }
  ul.acts li::before { content:""; position:absolute; left:3px; top:14px; width:9px; height:9px;
    border:1.5px solid var(--accent); border-radius:3px; }
  .acts .em { color:var(--crit); font-weight:600; }
  .acts code { font-family:var(--mono); font-size:.82em; background:var(--surface-2);
    border:1px solid var(--line); border-radius:4px; padding:0 4px; }

  .pipe { display:grid; grid-template-columns:1fr; gap:12px; }
  @media (min-width:560px){ .pipe { grid-template-columns:1fr 1fr; } }
  .pcard { background:var(--surface); border:1px solid var(--line); border-radius:14px;
    padding:15px 16px; box-shadow:var(--shadow); }
  .pcard .top { display:flex; justify-content:space-between; align-items:baseline; gap:10px; }
  .pcard h4 { margin:0; font-family:var(--serif); font-weight:500; font-size:1.14rem; }
  .pcard .sub { font-size:.8rem; color:var(--muted); margin:3px 0 10px; }
  .pcard .fit { font-family:var(--mono); font-size:.72rem; color:var(--gold); font-weight:700; }

  .ladder { display:grid; grid-template-columns:repeat(2,1fr); gap:10px; }
  @media (min-width:560px){ .ladder { grid-template-columns:repeat(4,1fr); } }
  .tier { border:1px solid var(--line); border-radius:12px; padding:13px 14px; background:var(--surface); }
  .tier.mark { border-color:var(--accent); box-shadow:0 0 0 1px var(--accent) inset; }
  .tier .t { font-size:.72rem; text-transform:uppercase; letter-spacing:.08em; color:var(--muted); }
  .tier .v { font-family:var(--serif); font-size:1.16rem; margin-top:3px; font-variant-numeric:tabular-nums; }
  .tier .note { font-size:.68rem; color:var(--accent); margin-top:5px; font-weight:600; }
  .sla { margin-top:14px; font-size:.9rem; padding:12px 15px; border-radius:12px;
    background:var(--accent-soft); border:1px solid color-mix(in srgb, var(--accent) 25%, var(--line)); }

  .map { display:grid; grid-template-columns:1fr; gap:10px; }
  @media (min-width:560px){ .map { grid-template-columns:1fr 1fr; } }
  .mgrp { border:1px solid var(--line); border-radius:12px; padding:13px 15px; background:var(--surface); }
  .mgrp h5 { margin:0 0 4px; font-size:.82rem; }
  .mgrp p { margin:0; font-size:.8rem; color:var(--muted); }
  .mgrp code { font-family:var(--mono); font-size:.75rem; color:var(--ink); }

  .contract { border:1px solid var(--line); border-radius:14px; padding:16px 18px;
    background:var(--surface-2); font-size:.86rem; }
  .contract b { color:var(--accent); }
  footer { margin-top:34px; padding-top:16px; border-top:1px solid var(--line);
    font-size:.78rem; color:var(--muted); }
  footer code { font-family:var(--mono); }

  .openbar { display:flex; flex-wrap:wrap; gap:10px; margin:18px 0 2px; }
  .openbtn { flex:1 1 220px; display:flex; align-items:center; justify-content:space-between;
    gap:10px; text-decoration:none; background:var(--accent); color:var(--accent-ink);
    border:1px solid transparent; border-radius:12px; padding:14px 16px;
    font-weight:650; font-size:.92rem; box-shadow:var(--shadow); }
  .openbtn:hover { filter:brightness(1.03); }
  .openbtn:focus-visible { outline:2px solid var(--ink); outline-offset:2px; }
  .openbtn.alt { background:var(--surface); color:var(--ink); border-color:var(--line); }
  .openbtn .arrow { font-size:1.05rem; opacity:.85; }
  .openhint { font-size:.76rem; color:var(--muted); margin:8px 2px 0; }

  @media (prefers-reduced-motion: no-preference) {
    .reveal { animation:rise .5s cubic-bezier(.2,.7,.3,1) both; }
    .stats .stat:nth-child(2){ animation-delay:.04s; }
    .stats .stat:nth-child(3){ animation-delay:.08s; }
    .stats .stat:nth-child(4){ animation-delay:.12s; }
    @keyframes rise { from { opacity:0; transform:translateY(10px); } }
  }
</style>`;

function render(d) {
  const stats = d.stats.map((s) =>
    `<div class="stat reveal"><div class="n${s.alert ? ' alert' : ''}">${esc(s.n)}</div><div class="k">${s.k}</div></div>`).join('\n      ');

  const rows = (arr) => arr.map((r) =>
    `<div class="row"><div class="rl"><b>${r.label ?? r.title}</b><span>${r.note}</span></div><span class="pill ${r.pill}">${esc(r.pillText)}</span></div>`).join('\n      ');

  const lane = (key, cls, lane) => `
    <div class="lane">
      <h3><span class="tag ${cls}">${cls.toUpperCase()}</span> ${lane.title}</h3>
      <ul class="acts">
        ${lane.items.map((it) => `<li>${it}</li>`).join('\n        ')}
      </ul>
    </div>`;

  const pcards = d.pipeline.map((p) => `
      <div class="pcard">
        <div class="top"><h4>${esc(p.name)}</h4><span class="pill ${p.pill}">${esc(p.pillText)}</span></div>
        <p class="sub">${p.sub}</p>
        <span class="fit">${p.note}</span>
      </div>`).join('');

  const tiers = d.offer.tiers.map((t) =>
    `<div class="tier${t.mark ? ' mark' : ''}"><div class="t">${esc(t.t)}</div><div class="v">${esc(t.v)}</div>${t.note ? `<div class="note">${t.note}</div>` : ''}</div>`).join('\n      ');

  const map = d.map.map((m) => `<div class="mgrp"><h5>${m.h5}</h5><p>${m.p}</p></div>`).join('\n      ');

  const links = Array.isArray(d.links) ? d.links : [];
  const openbar = links.length ? `
  <div class="openbar">
    ${links.map((l, i) => `<a class="openbtn${i ? ' alt' : ''}" href="${esc(l.url)}" target="_blank" rel="noopener"><span>${esc(l.label)}</span><span class="arrow" aria-hidden="true">&#8599;</span></a>`).join('\n    ')}
  </div>
  <p class="openhint">Opens GitHub — you'll sign in the first time (private repo).</p>
` : '';

  const hubUrl = links[0]?.url || '';
  const footer = hubUrl
    ? d.footer.replace('<code>START_HERE.md</code>', `<a href="${esc(hubUrl)}" target="_blank" rel="noopener"><code>START_HERE.md</code></a>`)
    : d.footer;

  const body = `<div class="wrap">

  <header class="reveal">
    <p class="eyebrow">${d.eyebrow}</p>
    <h1>${d.title}</h1>
    <p class="lede">${d.lede}</p>
    <div class="metaline">
      <span>Updated <b>${esc(d.updated)}</b></span>
      <span>Branch <code>${esc(d.branch)}</code></span>
      <span><b>Tests</b> ${esc(d.tests)} green</span>
    </div>
  </header>
${openbar}
  <section aria-label="At a glance">
    <div class="stats">
      ${stats}
    </div>
  </section>

  <section>
    <p class="sec-label">Needs attention</p>
    <div class="card attention">
      ${rows(d.attention)}
    </div>
  </section>

  <section>
    <p class="sec-label">Status</p>
    <div class="card">
      ${rows(d.status)}
    </div>
  </section>

  <section>
    <p class="sec-label">The plan &amp; next actions</p>
    ${lane('p0', 'p0', d.actions.p0)}
    ${lane('p1', 'p1', d.actions.p1)}
    ${lane('p2', 'p2', d.actions.p2)}
    <p style="font-size:.82rem;color:var(--muted);margin:6px 2px 0">${d.done30}</p>
  </section>

  <section>
    <p class="sec-label">Pipeline</p>
    <div class="pipe">${pcards}
    </div>
  </section>

  <section>
    <p class="sec-label">The offer</p>
    <div class="ladder">
      ${tiers}
    </div>
    <div class="sla">${d.offer.sla}</div>
  </section>

  <section>
    <p class="sec-label">Where everything lives</p>
    <div class="map">
      ${map}
    </div>
  </section>

  <section>
    <p class="sec-label">The honesty contract</p>
    <div class="contract">${d.contract}</div>
  </section>

  <footer>${footer}</footer>

</div>`;

  // Artifact-ready: a <style> block followed by the page markup. The Artifact
  // host wraps this in its own <html>/<head>/<body>.
  return `${STYLE}\n\n${body}\n`;
}

function standalone(inner) {
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <title>Villa Ops OS — Project Hub</title>
</head>
<body>
${inner}</body>
</html>
`;
}

const data = JSON.parse(await readFile(dataPath, 'utf8'));
const inner = render(data);

if (process.argv.includes('--stdout')) {
  process.stdout.write(inner);
} else {
  const outDir = join(root, 'build');
  await mkdir(outDir, { recursive: true });
  const outPath = join(outDir, 'dashboard.html');
  await writeFile(outPath, inner, 'utf8');
  console.log(`Wrote ${outPath} (${inner.length} bytes) — Artifact-ready`);
  if (process.argv.includes('--standalone')) {
    const sPath = join(outDir, 'dashboard.standalone.html');
    await writeFile(sPath, standalone(inner), 'utf8');
    console.log(`Wrote ${sPath} — full standalone document`);
  }
  console.log(`Re-publish the Artifact to keep the same URL: ${data.artifactUrl}`);
}
