import { test } from 'node:test';
import assert from 'node:assert/strict';
import {
  normalizeUrl, isPublicHost, findabilityChecks, mobileChecks, aiChecks,
  contactChecks, techFingerprint, parsePagespeed, summarize, auditSite, AuditError,
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

test('AI checks: structured data, crawler block, JS-only heuristic', () => {
  const rich = '<script type="application/ld+json">{}</script><h1>Villas</h1>' + 'Real readable content about our villas in Uluwatu. '.repeat(20);
  const rc = aiChecks(rich, '');
  assert.equal(status(rc, 'structured'), 'pass');
  assert.equal(status(rc, 'ssr'), 'pass');
  assert.equal(status(rc, 'h1'), 'pass');

  const blockedRobots = 'User-agent: GPTBot\nDisallow: /\n';
  assert.equal(status(aiChecks('<div></div>', blockedRobots), 'ai-block'), 'warn');

  const jsOnly = '<div id="root"></div>';
  assert.equal(status(aiChecks(jsOnly, ''), 'ssr'), 'warn');
  assert.equal(status(aiChecks(jsOnly, ''), 'structured'), 'warn');
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
    return { ok: true, status: 200, url, body: page, text: async () => page };
  };
  const r = await auditSite('anjunabay.test', { fetch: fakeFetch });
  assert.equal(r.url, 'https://anjunabay.test/');
  assert.ok(r.checks.length >= 10);
  assert.equal(r.speed.mobile.scores.performance, 45);
  assert.ok(r.summary.overall > 0);
  assert.match(r.disclaimer, /does not access private data/);
});
