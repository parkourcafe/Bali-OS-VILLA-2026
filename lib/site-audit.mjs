/**
 * Instant Website Check — core analysis (pure + fetch orchestration).
 *
 * What it does (all from PUBLIC data only):
 *  - Speed: Google PageSpeed Insights API (Lighthouse) for mobile + desktop.
 *  - Findable by Google: robots.txt, sitemap.xml, <title>/meta description,
 *    canonical, noindex, viewport.
 *  - AI-readable: structured data (JSON-LD), semantic signals, AI-crawler
 *    blocks in robots.txt, JS-only content heuristic.
 *  - Guest-contact ready: WhatsApp / phone / email / booking link presence.
 *
 * It does NOT log in, submit forms, read private data, or claim Google index
 * coverage (impossible without the owner's Search Console). Every check is a
 * signal, labelled honestly.
 *
 * Parsers are pure (take strings) so they unit-test without network. auditSite()
 * accepts an injectable `fetchImpl` for the same reason.
 */

const MAX_BYTES = 2_000_000;
const FETCH_TIMEOUT_MS = 9000;

// ---------------------------------------------------------------- URL safety

/** Normalize user input to a safe absolute http(s) URL, or throw. */
export function normalizeUrl(raw) {
  let s = String(raw || '').trim();
  if (!s) throw new AuditError('EMPTY_URL', 'Please enter a website address.');
  if (s.length > 300) throw new AuditError('BAD_URL', 'That address is too long.');
  const scheme = s.match(/^([a-z][a-z0-9+.-]*):\/\//i);
  if (scheme) {
    if (!/^https?$/i.test(scheme[1])) throw new AuditError('BAD_URL', 'Only http and https sites can be checked.');
  } else {
    s = 'https://' + s;
  }
  let u;
  try { u = new URL(s); } catch { throw new AuditError('BAD_URL', 'That does not look like a valid website address.'); }
  if (u.protocol !== 'http:' && u.protocol !== 'https:') throw new AuditError('BAD_URL', 'Only http and https sites can be checked.');
  if (!isPublicHost(u.hostname)) throw new AuditError('BLOCKED_HOST', 'That address cannot be checked.');
  u.hash = '';
  return u.toString();
}

/** Reject localhost, internal TLDs, and private/loopback/link-local IP literals (best-effort SSRF guard). */
export function isPublicHost(hostname) {
  const h = String(hostname || '').toLowerCase().replace(/\.$/, '');
  if (!h || h === 'localhost' || h.endsWith('.localhost') || h.endsWith('.local') || h.endsWith('.internal')) return false;
  if (!h.includes('.') && !h.includes(':')) return false; // bare hostname, no TLD
  // IPv4 literal
  const m = h.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (m) {
    const [a, b] = [Number(m[1]), Number(m[2])];
    if (a === 10 || a === 127 || a === 0 || a === 169 && b === 254) return false;
    if (a === 172 && b >= 16 && b <= 31) return false;
    if (a === 192 && b === 168) return false;
    if (a === 100 && b >= 64 && b <= 127) return false;
    if (a >= 224) return false; // multicast / reserved
  }
  // IPv6 loopback / link-local / unique-local
  if (h === '::1' || h.startsWith('fe80:') || h.startsWith('fc') || h.startsWith('fd') || h.startsWith('[::1]') || h.startsWith('[fe80') || h.startsWith('[fc') || h.startsWith('[fd')) return false;
  return true;
}

export class AuditError extends Error {
  constructor(code, message) { super(message); this.code = code; }
}

// ------------------------------------------------------------------- fetch

async function safeFetch(fetchImpl, url) {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
  const started = typeof performance !== 'undefined' ? performance.now() : null;
  try {
    const res = await fetchImpl(url, {
      redirect: 'follow',
      signal: ctrl.signal,
      headers: { 'user-agent': 'SelenaSystems-WebsiteCheck/1.0 (+https://selena.systems)' },
    });
    const ttfbMs = started == null ? null : (typeof performance !== 'undefined' ? performance.now() : started) - started;
    const header = (n) => {
      const h = res.headers;
      if (!h) return null;
      return typeof h.get === 'function' ? h.get(n) : (h[n] != null ? h[n] : null);
    };
    const encoding = header('content-encoding');
    const finalUrl = res.url || url;
    if (!isPublicHost(new URL(finalUrl).hostname)) throw new AuditError('BLOCKED_HOST', 'Redirected to a blocked host.');
    let body = '';
    if (res.body && res.body.getReader) {
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let total = 0;
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        total += value.length;
        if (total > MAX_BYTES) { try { await reader.cancel(); } catch {} break; }
        body += dec.decode(value, { stream: true });
      }
    } else {
      body = (await res.text()).slice(0, MAX_BYTES);
    }
    return {
      ok: res.ok, status: res.status, body, finalUrl, ttfbMs,
      htmlBytes: body.length,
      compressed: encoding == null ? null : /gzip|br|deflate|zstd/i.test(encoding),
    };
  } finally {
    clearTimeout(timer);
  }
}

// ------------------------------------------------------------ pure parsers

const pass = (id, area, title, detail) => ({ id, area, status: 'pass', title, detail });
const warn = (id, area, title, detail) => ({ id, area, status: 'warn', title, detail });
const fail = (id, area, title, detail) => ({ id, area, status: 'fail', title, detail });
const info = (id, area, title, detail) => ({ id, area, status: 'info', title, detail });

export function findabilityChecks(html, robots, sitemap, robotsFound, sitemapFound) {
  const out = [];
  const title = (html.match(/<title[^>]*>([\s\S]*?)<\/title>/i) || [, ''])[1].trim();
  out.push(title
    ? pass('title', 'google', 'Your Google headline is set', `“${title.slice(0, 70)}” — this is the clickable blue line guests see in Google.`)
    : fail('title', 'google', 'No Google headline', 'Guests see a blank or messy title where your name should be in Google results.'));

  const desc = (html.match(/<meta[^>]+name=["']description["'][^>]*content=["']([^"']*)["']/i) || [, ''])[1].trim()
    || (html.match(/<meta[^>]+content=["']([^"']*)["'][^>]*name=["']description["']/i) || [, ''])[1].trim();
  out.push(desc
    ? pass('meta-desc', 'google', 'Google summary line is set', 'The short description under your Google result is written by you, not guessed.')
    : warn('meta-desc', 'google', 'No Google summary line', 'Google will invent the grey text under your result — often awkwardly.'));

  const noindex = /<meta[^>]+name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html)
    || /^\s*x-robots-tag:\s*[^\n]*noindex/im.test(html);
  out.push(noindex
    ? fail('noindex', 'google', 'Your home page is hidden from Google', 'A setting is telling Google to leave your home page out of search completely.')
    : pass('noindex', 'google', 'Google is allowed to list you', 'Nothing is blocking your home page from appearing in Google search.'));

  const canonical = /<link[^>]+rel=["']canonical["']/i.test(html);
  out.push(canonical
    ? pass('canonical', 'google', 'Duplicate pages handled', 'Google knows which version of a page is the main one.')
    : info('canonical', 'google', 'No duplicate-page setting', 'Optional — it helps Google pick the main version of a page.'));

  out.push(robotsFound
    ? pass('robots', 'google', 'Search-engine guide found', 'Search engines get clear instructions for your site.')
    : warn('robots', 'google', 'No search-engine guide file', 'Search engines get no instructions and can’t find your page list this way.'));

  if (sitemapFound) {
    const count = (sitemap.match(/<loc>/gi) || []).length;
    out.push(count
      ? pass('sitemap', 'google', `Page list for Google found (${count} pages)`, 'A list of your pages that helps Google find them all.')
      : warn('sitemap', 'google', 'Your page list is empty', 'The page list for Google contains no pages.'));
  } else {
    const inRobots = /sitemap:\s*http/i.test(robots);
    out.push(inRobots
      ? info('sitemap', 'google', 'Page list is linked elsewhere', 'Your page list is declared for Google, just not at the usual address.')
      : warn('sitemap', 'google', 'No page list for Google', 'Google has no list of your pages to follow, so it may miss some.'));
  }
  return out;
}

export function mobileChecks(html) {
  const viewport = /<meta[^>]+name=["']viewport["']/i.test(html);
  return [viewport
    ? pass('viewport', 'mobile', 'Works on phones', 'The site adjusts to phone screens — where most guests browse.')
    : fail('viewport', 'mobile', 'Not phone-friendly', 'The site likely looks broken on phones — where most of your guests are.')];
}

export function aiChecks(html, robots, llmsFound) {
  const out = [];
  const AI_BOTS = ['gptbot', 'oai-searchbot', 'chatgpt-user', 'claudebot', 'anthropic-ai', 'perplexitybot', 'google-extended', 'bingbot'];
  const blocked = AI_BOTS.filter((b) => {
    const re = new RegExp('user-agent:\\s*' + b + '[\\s\\S]*?disallow:\\s*/\\s*(\\n|$)', 'i');
    return re.test(robots);
  });
  out.push(blocked.length
    ? fail('ai-block', 'ai', 'AI assistants are blocked from your site', `When a guest asks ChatGPT, Perplexity or Google’s AI, your site can’t be suggested — it’s blocked (${blocked.join(', ')}).`)
    : pass('ai-block', 'ai', 'AI assistants can read your site', 'ChatGPT, Perplexity and Google’s AI are allowed to read and suggest your site.'));

  const jsonld = /<script[^>]+type=["']application\/ld\+json["']/i.test(html);
  out.push(jsonld
    ? pass('structured', 'ai', 'Your details are AI-readable', 'Your location, rooms and prices are labelled so AI and Google quote them correctly.')
    : warn('structured', 'ai', 'Your details aren’t labelled for AI', 'AI and Google have to guess your location, rooms and prices — and often get it wrong.'));

  // JS-only heuristic: very little text in raw HTML → content is rendered client-side (AI crawlers rarely run JS).
  const text = html.replace(/<script[\s\S]*?<\/script>/gi, ' ').replace(/<style[\s\S]*?<\/style>/gi, ' ').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  out.push(text.length >= 600
    ? pass('ssr', 'ai', 'Your text is easy for AI to read', 'AI assistants can read your page content directly.')
    : warn('ssr', 'ai', 'Your text is hard for AI to read', 'Most of your page only appears after extra loading, which AI assistants usually skip.'));

  const faq = /"@type"\s*:\s*"FAQPage"/i.test(html) || (html.match(/<h[23][^>]*>[^<]{0,80}\?\s*<\/h[23]>/gi) || []).length >= 2;
  out.push(faq
    ? pass('faq', 'ai', 'You answer common questions', 'Pages that answer guest questions directly are exactly what AI assistants quote.')
    : info('faq', 'ai', 'No guest question-and-answer page', 'Adding a page that answers common guest questions makes AI far more likely to recommend you.'));

  out.push(llmsFound
    ? pass('llms', 'ai', 'You have an AI guide file', 'You publish a special guide for AI assistants — ahead of most competitors.')
    : info('llms', 'ai', 'No AI guide file yet', 'A new, optional file that helps AI assistants use your site. Most sites don’t have one yet.'));

  const h1 = /<h1[\s>]/i.test(html);
  out.push(h1
    ? pass('h1', 'ai', 'Clear page headline', 'A clear main headline helps AI and Google understand what the page is about.')
    : info('h1', 'ai', 'No clear page headline', 'One clear main headline helps AI and Google understand the page.'));
  return out;
}

/** Sub-score (0–100) for one area, excluding informational-only checks. Null if no scored checks. */
export function areaScore(checks, area) {
  const items = checks.filter((c) => c.area === area && c.status !== 'info');
  if (!items.length) return null;
  const pts = { pass: 1, warn: 0.35, fail: 0 };
  const sum = items.reduce((s, c) => s + (pts[c.status] ?? 0), 0);
  return Math.round((sum / items.length) * 100);
}

export function contactChecks(html) {
  const out = [];
  const wa = /(wa\.me\/|api\.whatsapp\.com\/send|whatsapp:\/\/)/i.test(html);
  out.push(wa
    ? pass('whatsapp', 'contact', 'WhatsApp button present', 'Guests can message you on WhatsApp in one tap.')
    : warn('whatsapp', 'contact', 'No WhatsApp button', 'Most Bali guests expect WhatsApp — none was found on your home page.'));

  const tel = /href=["']tel:/i.test(html);
  out.push(tel
    ? pass('phone', 'contact', 'Tap-to-call number', 'Guests can call you in one tap from their phone.')
    : info('phone', 'contact', 'No tap-to-call number', 'A tappable phone number makes calling from a phone one tap.'));

  const email = /href=["']mailto:/i.test(html) || /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(html.replace(/<script[\s\S]*?<\/script>/gi, ''));
  out.push(email
    ? pass('email', 'contact', 'Email shown', 'Guests can find an email to reach you.')
    : info('email', 'contact', 'No email shown', 'Optional — some guests prefer email.'));

  const booking = /(calendly\.com|cal\.com|booking|book-now|book a tour|reserve|inquir|enquir|form)/i.test(html);
  out.push(booking
    ? pass('booking', 'contact', 'Guests can book or ask', 'There’s a clear way for guests to book or send an inquiry.')
    : warn('booking', 'contact', 'No clear way to book', 'No booking link or inquiry form was found on your home page.'));
  return out;
}

export function techFingerprint(html) {
  const t = [];
  if (/wp-content|wp-includes|generator["'][^>]*wordpress/i.test(html)) t.push('WordPress');
  if (/jquery/i.test(html)) t.push('jQuery');
  if (/connect\.facebook\.net|fbevents\.js/i.test(html)) t.push('Facebook Pixel');
  if (/gtag\(|googletagmanager\.com/i.test(html)) t.push('Google Tag Manager');
  if (/cdn\.shopify\.com|Shopify\./i.test(html)) t.push('Shopify');
  if (/wix\.com|wixstatic/i.test(html)) t.push('Wix');
  return t;
}

// --------------------------------------------------------------- PageSpeed

export async function pagespeed(fetchImpl, url, key, strategy) {
  const api = new URL('https://www.googleapis.com/pagespeedonline/v5/runPagespeed');
  api.searchParams.set('url', url);
  api.searchParams.set('strategy', strategy);
  for (const c of ['performance', 'accessibility', 'best-practices', 'seo']) api.searchParams.append('category', c);
  if (key) api.searchParams.set('key', key);
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 25000);
  try {
    const res = await fetchImpl(api.toString(), { signal: ctrl.signal });
    if (!res.ok) return { strategy, error: `PageSpeed HTTP ${res.status}` };
    const data = await res.json();
    return parsePagespeed(data, strategy);
  } catch (e) {
    return { strategy, error: 'PageSpeed unavailable' };
  } finally {
    clearTimeout(timer);
  }
}

export function parsePagespeed(data, strategy) {
  const lr = data && data.lighthouseResult;
  if (!lr) return { strategy, error: 'No Lighthouse result' };
  const cat = lr.categories || {};
  const a = lr.audits || {};
  const pct = (c) => (c && typeof c.score === 'number' ? Math.round(c.score * 100) : null);
  const dv = (id) => (a[id] && a[id].displayValue) || null;
  return {
    strategy,
    scores: {
      performance: pct(cat.performance),
      accessibility: pct(cat.accessibility),
      bestPractices: pct(cat['best-practices']),
      seo: pct(cat.seo),
    },
    metrics: {
      lcp: dv('largest-contentful-paint'),
      cls: dv('cumulative-layout-shift'),
      tbt: dv('total-blocking-time'),
      fcp: dv('first-contentful-paint'),
      speedIndex: dv('speed-index'),
    },
    totalBytes: a['total-byte-weight'] && a['total-byte-weight'].displayValue || null,
  };
}

// ------------------------------------------------- own speed measurement
// Google's API needs a key and rate-limits hard without one. These are our
// own direct measurements — smaller in scope than Lighthouse, but always
// available and honestly labelled as ours.

const BLOCKING_RE = /<script\b(?![^>]*\b(?:async|defer|type=["']module["'])\b)[^>]*\bsrc=/gi;

export function pageWeightHints(html) {
  const count = (re) => (html.match(re) || []).length;
  const imgs = html.match(/<img\b[^>]*>/gi) || [];
  const sized = imgs.filter((t) => /\bwidth=/i.test(t) && /\bheight=/i.test(t)).length;
  const lazy = imgs.filter((t) => /\bloading=["']lazy["']/i.test(t)).length;
  const modern = (html.match(/\.(?:webp|avif)\b/gi) || []).length;
  return {
    scripts: count(/<script\b[^>]*\bsrc=/gi),
    blockingScripts: count(BLOCKING_RE),
    stylesheets: count(/<link\b[^>]*rel=["']stylesheet["'][^>]*>/gi),
    images: imgs.length,
    imagesWithoutSize: imgs.length - sized,
    imagesLazy: lazy,
    modernImageRefs: modern,
    fonts: count(/<link\b[^>]*(?:fonts\.googleapis|fonts\.gstatic|\.woff2?)[^>]*>/gi),
  };
}

// Bands are deliberately coarse: we report what we measured, not a fake score.
export function speedBand({ ttfbMs, htmlBytes, hints }) {
  let points = 100;
  if (ttfbMs != null) {
    if (ttfbMs > 1800) points -= 35;
    else if (ttfbMs > 900) points -= 20;
    else if (ttfbMs > 500) points -= 8;
  }
  if (htmlBytes != null) {
    if (htmlBytes > 400_000) points -= 20;
    else if (htmlBytes > 150_000) points -= 10;
  }
  if (hints) {
    if (hints.blockingScripts > 6) points -= 20;
    else if (hints.blockingScripts > 2) points -= 10;
    if (hints.images > 0 && hints.imagesLazy === 0 && hints.images > 8) points -= 8;
    if (hints.imagesWithoutSize > 4) points -= 7;
  }
  const score = Math.max(0, Math.min(100, points));
  const band = score >= 80 ? 'Fast' : score >= 55 ? 'Average' : 'Slow';
  return { score, band };
}

export function measuredSpeed({ ttfbMs, htmlBytes, compressed, html }) {
  const hints = pageWeightHints(html || '');
  const { score, band } = speedBand({ ttfbMs, htmlBytes, hints });
  const kb = (n) => (n == null ? null : `${Math.round(n / 1024)} KB`);
  return {
    source: 'measured',
    score,
    band,
    metrics: {
      ttfb: ttfbMs == null ? null : `${Math.round(ttfbMs)} ms`,
      htmlSize: kb(htmlBytes),
      compressed: compressed == null ? null : compressed ? 'Yes' : 'No',
    },
    hints,
  };
}

// Plain-language rows an owner can act on, derived from what we measured.
export function speedChecks(m) {
  if (!m) return [];
  const h = m.hints || {};
  const out = [];
  const ttfb = m.metrics && m.metrics.ttfb ? parseInt(m.metrics.ttfb, 10) : null;
  if (ttfb != null) {
    out.push({
      area: 'speed', id: 'speed-server',
      status: ttfb > 1800 ? 'fail' : ttfb > 900 ? 'warn' : 'pass',
      title: 'Server response time',
      detail: ttfb > 900
        ? `Your server took ${m.metrics.ttfb} to answer. Guests on mobile data feel this before anything appears.`
        : `Your server answered in ${m.metrics.ttfb} — a good starting point.`,
    });
  }
  if (m.metrics && m.metrics.compressed != null) {
    out.push({
      area: 'speed', id: 'speed-compression',
      status: m.metrics.compressed === 'Yes' ? 'pass' : 'warn',
      title: 'Page compression',
      detail: m.metrics.compressed === 'Yes'
        ? 'Your pages are compressed before being sent — they arrive faster.'
        : 'Your pages are sent uncompressed. Turning compression on is usually a one-setting fix.',
    });
  }
  out.push({
    area: 'speed', id: 'speed-blocking',
    status: h.blockingScripts > 6 ? 'fail' : h.blockingScripts > 2 ? 'warn' : 'pass',
    title: 'Scripts that delay the page',
    detail: h.blockingScripts > 2
      ? `${h.blockingScripts} scripts must finish loading before guests see anything.`
      : 'Nothing significant is blocking your page from appearing.',
  });
  if (h.images > 0) {
    out.push({
      area: 'speed', id: 'speed-images',
      status: h.imagesLazy === 0 && h.images > 8 ? 'warn' : 'pass',
      title: 'Photo loading',
      detail: h.imagesLazy === 0 && h.images > 8
        ? `All ${h.images} photos load at once, including ones far down the page.`
        : `${h.images} photos found; loading is staged sensibly.`,
    });
    out.push({
      area: 'speed', id: 'speed-jump',
      status: h.imagesWithoutSize > 4 ? 'warn' : 'pass',
      title: 'Content jumping while it loads',
      detail: h.imagesWithoutSize > 4
        ? `${h.imagesWithoutSize} photos have no reserved space, so the page jumps as they arrive.`
        : 'Your layout stays steady while photos load.',
    });
  }
  return out;
}

// --------------------------------------------------------------- summarize

// Owner-facing consequence for each finding — why it costs bookings.
const WHY_IT_MATTERS = {
  'speed-server': 'Guests on Bali mobile data leave before the first photo appears.',
  'speed-compression': 'Every page costs guests more data and more waiting than it needs to.',
  'speed-blocking': 'The page looks blank for longer, and blank pages get closed.',
  'speed-images': 'Photos far down the page compete with the ones the guest is actually looking at.',
  'speed-jump': 'Buttons move while guests are tapping them — a common reason enquiries never get sent.',
  'ai-block': 'ChatGPT and Perplexity cannot recommend a villa they are not allowed to read.',
  'ai-structured': 'AI has to guess your location, rooms and prices — and guesses wrong.',
  'ai-js': 'AI assistants read the page before your content loads, so they see almost nothing.',
  'ai-faq': 'Guest questions are exactly what AI assistants quote when recommending a place.',
  'ai-llms': 'A short guide file makes AI far more likely to describe you accurately.',
  'find-sitemap': 'Google may never discover some of your villa pages.',
  'find-title': 'This is the blue line guests click in Google — leaving it unset costs clicks.',
  'find-desc': 'Google writes its own summary of you if you do not.',
  'find-robots-block': 'Your page is asking Google not to list it at all.',
  'contact-whatsapp': 'WhatsApp is how Bali guests expect to enquire — without it they move on.',
  'contact-booking': 'An interested guest reaches the bottom of the page with nowhere to go.',
  'contact-phone': 'Calling from a phone should be one tap, not copy-and-paste.',
  'contact-email': 'Some guests, especially corporate and long-stay, still start by email.',
  'mobile-viewport': 'Most guests look at your site on a phone; a desktop-only layout loses them.',
};

const SEVERITY = { fail: 0, warn: 1, info: 2, pass: 3 };

export function priorityFixes(checks, limit = 3) {
  return checks
    .filter((c) => c.status === 'fail' || c.status === 'warn')
    .sort((a, b) => SEVERITY[a.status] - SEVERITY[b.status])
    .slice(0, limit)
    .map((c) => ({ ...c, why: WHY_IT_MATTERS[c.id] || '' }));
}

// One honest sentence the owner reads first.
export function verdictLine(overall, counts) {
  const broken = counts.fail || 0;
  if (overall >= 80) return 'Your website is in good shape. A few refinements would make it stronger, but nothing here is losing you guests today.';
  if (overall >= 60) return `Your website works, but ${broken > 0 ? `${broken} thing${broken === 1 ? '' : 's'} on it are` : 'several things are'} quietly costing you enquiries.`;
  if (overall >= 40) return 'Your website has real gaps that guests and AI assistants run into before they ever message you.';
  return 'Your website is losing enquiries it has already earned. The items below are the fastest way to stop that.';
}

export function summarize(checks, speedMobile) {
  const counts = { pass: 0, warn: 0, fail: 0, info: 0 };
  for (const c of checks) counts[c.status] = (counts[c.status] || 0) + 1;
  // Prefer Google's Lighthouse score when we have it; fall back to our own
  // measurement so the report is never empty just because a key is missing.
  const perf = speedMobile && speedMobile.scores
    ? speedMobile.scores.performance
    : (speedMobile && typeof speedMobile.score === 'number' ? speedMobile.score : null);
  const graded = checks.filter((c) => c.status !== 'info');
  const passRatio = graded.length ? counts.pass / graded.length : 0;
  const checkScore = Math.round(passRatio * 100);
  const overall = perf == null ? checkScore : Math.round(checkScore * 0.6 + perf * 0.4);
  let band = 'High risk';
  if (overall >= 80) band = 'Low risk';
  else if (overall >= 60) band = 'Medium risk';
  else if (overall >= 40) band = 'Medium-high risk';
  return {
    overall, band, counts,
    verdict: verdictLine(overall, counts),
    topFixes: priorityFixes(checks, 3),
  };
}

// --------------------------------------------------------------- orchestrate

export async function auditSite(rawUrl, opts = {}) {
  const fetchImpl = opts.fetch || fetch;
  const key = opts.pagespeedKey || '';
  const url = normalizeUrl(rawUrl);
  const origin = new URL(url).origin;

  const [pageR, robotsR, sitemapR, llmsR] = await Promise.allSettled([
    safeFetch(fetchImpl, url),
    safeFetch(fetchImpl, origin + '/robots.txt'),
    safeFetch(fetchImpl, origin + '/sitemap.xml'),
    safeFetch(fetchImpl, origin + '/llms.txt'),
  ]);
  const llmsFound = llmsR.status === 'fulfilled' && llmsR.value.ok && /\S/.test(llmsR.value.body || '');
  const page = pageR.status === 'fulfilled' ? pageR.value : null;
  if (!page || !page.ok || !page.body) {
    throw new AuditError('UNREACHABLE', 'We could not load that website. Check the address and try again.');
  }
  const html = page.body;
  const robots = robotsR.status === 'fulfilled' && robotsR.value.ok ? robotsR.value.body : '';
  const robotsFound = robotsR.status === 'fulfilled' && robotsR.value.ok && !!robotsR.value.body;
  const sitemap = sitemapR.status === 'fulfilled' && sitemapR.value.ok ? sitemapR.value.body : '';
  const sitemapFound = sitemapR.status === 'fulfilled' && sitemapR.value.ok && /<(urlset|sitemapindex)/i.test(sitemap);

  const measured = measuredSpeed({
    ttfbMs: page.ttfbMs, htmlBytes: page.htmlBytes, compressed: page.compressed, html,
  });

  const checks = [
    ...speedChecks(measured),
    ...mobileChecks(html),
    ...findabilityChecks(html, robots, sitemap, robotsFound, sitemapFound),
    ...aiChecks(html, robots, llmsFound),
    ...contactChecks(html),
  ];
  const aiScore = areaScore(checks, 'ai');
  const aiReadiness = {
    score: aiScore,
    band: aiScore == null ? null : aiScore >= 80 ? 'Ready' : aiScore >= 50 ? 'Partly ready' : 'Not ready',
  };

  const [speedMobile, speedDesktop] = await Promise.all([
    pagespeed(fetchImpl, url, key, 'mobile').catch(() => ({ strategy: 'mobile', error: 'PageSpeed unavailable' })),
    pagespeed(fetchImpl, url, key, 'desktop').catch(() => ({ strategy: 'desktop', error: 'PageSpeed unavailable' })),
  ]);

  const lighthouseOk = !!(speedMobile && speedMobile.scores);

  return {
    url,
    checkedAt: opts.now || null, // caller stamps the time (scripts can't use Date.now())
    tech: techFingerprint(html),
    speed: { mobile: speedMobile, desktop: speedDesktop },
    measuredSpeed: measured,
    speedSource: lighthouseOk ? 'lighthouse' : 'measured',
    aiReadiness,
    checks,
    summary: summarize(checks, lighthouseOk ? speedMobile : measured),
    disclaimer: 'Automated technical check of your public website only. It does not access private data, does not measure how fast your team replies to guests, and is not a guarantee of Google ranking or index coverage.',
  };
}
