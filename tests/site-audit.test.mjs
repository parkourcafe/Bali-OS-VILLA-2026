import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeUrl, isPublicHost, findabilityChecks, mobileChecks, aiChecks,
  contactChecks, techFingerprint, parsePagespeed, summarize, areaScore, auditSite, AuditError,
  pageWeightHints, speedBand, measuredSpeed, speedChecks, priorityFixes,
} from '../lib/site-audit.mjs';

const status = (checks, id) => checks.find((c) => c.id === id).status;

test('normalizeUrl adds https and validates', () => {
  assert.equal(normalizeUrl('theanjunabay.com'), 'https://theanjunabay.com/');
  assert.equal(normalizeUrl('http://x.com/a?b=1'), 'http://x.com/a?b=1');
  assert.throws(() => normalizeUrl(''), (e) => e instanceof AuditError && e.code === 'EMPTY_URL');
  assert.throws(() => normalizeUrl('ftp://x.com'), (e) => e.code === 'BAD_URL');
});

test('isPublicHost blocks internal/private targets (SSRF guard)', () => {
  assert.equal(isPublicHost('theanjunabay.com'), true);
  assert.equal(isPublicHost('localhost'), false);
  assert.equal(isPublicHost('127.0.0.1'), false);
  assert.equal(isPublicHost('10.0.0.5'), false);
  assert.equal(isPublicHost('192.168.1.1'), false);
  assert.equal(isPublicHost('169.254.169.254'), false); // cloud metadata
  assert.equal(isPublicHost('172.16.0.1'), false);
  assert.equal(isPublicHost('router.local'), false);
});

test('findability: full-featured page passes; bare page warns/fails', () => {
  const good = '<title>Anjuna Bay Villas</title><meta name="description" content="Luxury villas in Uluwatu"><link rel="canonical" href="https://x.com/">';
  const gc = findabilityChecks(good, 'sitemap: https://x.com/sitemap.xml', '<urlset><loc>a</loc><loc>b</loc></urlset>', true, true);
  assert.equal(status(gc, 'title'), 'pass');
  assert.equal(status(gc, 'meta-desc'), 'pass');
  assert.equal(status(gc, 'sitemap'), 'pass');
  assert.equal(status(gc, 'noindex'), 'pass');

  const bad = '<html><body>hi</body></html>';
  const bc = findabilityChecks(bad, '', '', false, false);
  assert.equal(status(bc, 'title'), 'fail');
  assert.equal(status(bc, 'meta-desc'), 'warn');
  assert.equal(status(bc, 'robots'), 'warn');
  assert.equal(status(bc, 'sitemap'), 'warn');
});

test('noindex on home page fails', () => {
  const c = findabilityChecks('<meta name="robots" content="noindex, follow">', '', '', false, false);
  assert.equal(status(c, 'noindex'), 'fail');
});

test('mobile viewport check', () => {
  assert.equal(status(mobileChecks('<meta name="viewport" content="width=device-width">'), 'viewport'), 'pass');
  assert.equal(status(mobileChecks('<html></html>'), 'viewport'), 'fail');
});

test('AI search readiness checks: crawlers, structured data, SSR, FAQ, llms.txt', () => {
  const rich = '<script type="application/ld+json">{"@type":"FAQPage"}</script><h1>Villas</h1>' + 'Real readable content about our villas in Uluwatu. '.repeat(20);
  const rc = aiChecks(rich, '', true);
  assert.equal(status(rc, 'structured'), 'pass');
  assert.equal(status(rc, 'ssr'), 'pass');
  assert.equal(status(rc, 'faq'), 'pass');
  assert.equal(status(rc, 'llms'), 'pass');
  assert.equal(status(rc, 'ai-block'), 'pass');

  // Blocking an AI crawler is a FAIL (they can't cite you)
  const blockedRobots = 'User-agent: GPTBot\nDisallow: /\n';
  assert.equal(status(aiChecks('<div></div>', blockedRobots, false), 'ai-block'), 'fail');

  const jsOnly = '<div id="root"></div>';
  assert.equal(status(aiChecks(jsOnly, '', false), 'ssr'), 'warn');
  assert.equal(status(aiChecks(jsOnly, '', false), 'structured'), 'warn');
  assert.equal(status(aiChecks(jsOnly, '', false), 'llms'), 'info');
});

test('areaScore: AI readiness reflects scored checks, ignores info-only', () => {
  const ready = aiChecks('<script type="application/ld+json">{"@type":"FAQPage"}</script><h1>x</h1>' + 'text '.repeat(200), '', true);
  const notReady = aiChecks('<div></div>', 'User-agent: GPTBot\nDisallow: /\n', false);
  const rs = areaScore(ready, 'ai');
  const ns = areaScore(notReady, 'ai');
  assert.ok(rs >= 90, 'a well-prepared site scores high: ' + rs);
  assert.ok(ns <= 25, 'a blocked JS-only site scores low: ' + ns);
});

test('contact checks: whatsapp / phone / booking', () => {
  const html = '<a href="https://api.whatsapp.com/send/?phone=628">wa</a><a href="tel:+628">call</a><a href="https://calendly.com/x">Book a tour</a>';
  const c = contactChecks(html);
  assert.equal(status(c, 'whatsapp'), 'pass');
  assert.equal(status(c, 'phone'), 'pass');
  assert.equal(status(c, 'booking'), 'pass');
  assert.equal(status(contactChecks('<div>nothing</div>'), 'whatsapp'), 'warn');
});

test('tech fingerprint detects WordPress + jQuery + FB pixel (as in the real report)', () => {
  const t = techFingerprint('<link href="/wp-content/x.css"><script src="jquery.min.js"></script><script src="https://connect.facebook.net/en_US/fbevents.js"></script>');
  assert.ok(t.includes('WordPress'));
  assert.ok(t.includes('jQuery'));
  assert.ok(t.includes('Facebook Pixel'));
});

test('parsePagespeed maps Lighthouse categories + Core Web Vitals', () => {
  const data = { lighthouseResult: {
    categories: { performance: { score: 0.45 }, accessibility: { score: 0.96 }, 'best-practices': { score: 0.73 }, seo: { score: 1 } },
    audits: {
      'largest-contentful-paint': { displayValue: '8.1 s' },
      'cumulative-layout-shift': { displayValue: '0' },
      'total-blocking-time': { displayValue: '940 ms' },
      'first-contentful-paint': { displayValue: '1.4 s' },
      'speed-index': { displayValue: '11.4 s' },
      'total-byte-weight': { displayValue: 'Total size was 5,962 KiB' },
    },
  } };
  const r = parsePagespeed(data, 'mobile');
  assert.equal(r.scores.performance, 45);
  assert.equal(r.scores.seo, 100);
  assert.equal(r.metrics.lcp, '8.1 s');
  assert.equal(r.metrics.tbt, '940 ms');
});

test('summarize blends check pass-ratio with mobile performance', () => {
  const checks = [
    { id: 'a', status: 'pass' }, { id: 'b', status: 'pass' }, { id: 'c', status: 'fail' }, { id: 'd', status: 'info' },
  ];
  const s = summarize(checks, { scores: { performance: 45 } });
  assert.ok(s.overall > 0 && s.overall <= 100);
  assert.ok(['Low risk', 'Medium risk', 'Medium-high risk', 'High risk'].includes(s.band));
  assert.equal(s.counts.fail, 1);
});

test('auditSite: unreachable page throws UNREACHABLE (injected fetch)', async () => {
  const fakeFetch = async () => ({ ok: false, status: 500, url: 'https://x.com/', body: null, text: async () => '' });
  await assert.rejects(auditSite('https://x.com', { fetch: fakeFetch }), (e) => e.code === 'UNREACHABLE');
});

test('auditSite: end-to-end with injected fetch returns report + summary', async () => {
  const page = '<title>Anjuna Bay</title><meta name="viewport" content="width=device-width"><meta name="description" content="Villas"><h1>Villas</h1><a href="https://wa.me/628">wa</a>' + 'content '.repeat(200);
  const fakeFetch = async (u) => {
    const url = String(u);
    if (url.includes('pagespeedonline')) return { ok: true, status: 200, json: async () => ({ lighthouseResult: { categories: { performance: { score: 0.45 } }, audits: {} } }) };
    if (url.endsWith('/robots.txt')) return { ok: true, status: 200, url, body: 'User-agent: *\nAllow: /', text: async () => 'User-agent: *\nAllow: /' };
    if (url.endsWith('/sitemap.xml')) return { ok: true, status: 200, url, body: '<urlset><loc>a</loc></urlset>', text: async () => '<urlset><loc>a</loc></urlset>' };
    if (url.endsWith('/llms.txt')) return { ok: false, status: 404, url, body: '', text: async () => '' };
    return { ok: true, status: 200, url, body: page, text: async () => page };
  };
  const r = await auditSite('anjunabay.test', { fetch: fakeFetch });
  assert.equal(r.url, 'https://anjunabay.test/');
  assert.ok(r.checks.length >= 10);
  assert.equal(r.speed.mobile.scores.performance, 45);
  assert.ok(r.summary.overall > 0);
  assert.ok(typeof r.aiReadiness.score === 'number' && ['Ready', 'Partly ready', 'Not ready'].includes(r.aiReadiness.band));
  assert.match(r.disclaimer, /does not access private data/);
});

// ---------------------------------------------- own speed measurement layer

test('pageWeightHints counts what actually slows a page down', () => {
  const html = `<script src="a.js"></script><script defer src="b.js"></script>
    <script async src="c.js"></script><link rel="stylesheet" href="s.css">
    <img src="1.jpg" width="10" height="10"><img src="2.jpg" loading="lazy"><img src="3.webp">`;
  const h = pageWeightHints(html);
  assert.equal(h.scripts, 3);
  assert.equal(h.blockingScripts, 1, 'defer/async scripts are not blocking');
  assert.equal(h.stylesheets, 1);
  assert.equal(h.images, 3);
  assert.equal(h.imagesWithoutSize, 2);
  assert.equal(h.imagesLazy, 1);
});

test('speedBand penalises slow servers and blocking scripts', () => {
  const fast = speedBand({ ttfbMs: 180, htmlBytes: 40_000, hints: { blockingScripts: 1, images: 4, imagesLazy: 2, imagesWithoutSize: 0 } });
  assert.equal(fast.band, 'Fast');
  const slow = speedBand({ ttfbMs: 2400, htmlBytes: 500_000, hints: { blockingScripts: 9, images: 20, imagesLazy: 0, imagesWithoutSize: 12 } });
  assert.equal(slow.band, 'Slow');
  assert.ok(slow.score < fast.score);
});

test('speedBand stays within 0-100', () => {
  const s = speedBand({ ttfbMs: 99_000, htmlBytes: 9_000_000, hints: { blockingScripts: 99, images: 99, imagesLazy: 0, imagesWithoutSize: 99 } });
  assert.ok(s.score >= 0 && s.score <= 100);
});

test('speedChecks skips compression row when the header is unknown', () => {
  const m = measuredSpeed({ ttfbMs: 300, htmlBytes: 20_000, compressed: null, html: '<img src="a.jpg">' });
  const ids = speedChecks(m).map((c) => c.id);
  assert.ok(!ids.includes('speed-compression'));
  assert.ok(ids.includes('speed-server'));
});

test('speedChecks reports compression when it is known', () => {
  const m = measuredSpeed({ ttfbMs: 300, htmlBytes: 20_000, compressed: false, html: '' });
  const row = speedChecks(m).find((c) => c.id === 'speed-compression');
  assert.equal(row.status, 'warn');
});

test('summarize falls back to our own score when PageSpeed is unavailable', () => {
  const checks = [{ area: 'speed', id: 'x', status: 'pass' }, { area: 'ai', id: 'y', status: 'fail' }];
  const withOurs = summarize(checks, { source: 'measured', score: 40 });
  const withoutAny = summarize(checks, { strategy: 'mobile', error: 'PageSpeed HTTP 429' });
  assert.ok(withOurs.overall < withoutAny.overall, 'a slow measured score must pull the total down');
});

test('summarize ships a verdict sentence and ranked fixes', () => {
  const checks = [
    { area: 'ai', id: 'ai-block', status: 'fail', title: 'Blocked', detail: 'd' },
    { area: 'contact', id: 'contact-whatsapp', status: 'warn', title: 'No WhatsApp', detail: 'd' },
    { area: 'google', id: 'g', status: 'pass', title: 'ok', detail: 'd' },
  ];
  const s = summarize(checks, null);
  assert.match(s.verdict, /\S/);
  assert.equal(s.topFixes[0].id, 'ai-block', 'failures rank above warnings');
  assert.match(s.topFixes[0].why, /ChatGPT/);
});

test('priorityFixes never returns passing checks', () => {
  const checks = [{ id: 'a', status: 'pass' }, { id: 'b', status: 'info' }, { id: 'c', status: 'warn' }];
  const fixes = priorityFixes(checks, 3);
  assert.deepEqual(fixes.map((f) => f.id), ['c']);
});
