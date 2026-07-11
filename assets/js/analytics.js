/**
 * Anonymous funnel analytics (FINAL TZ §22).
 * PII is forbidden: no company, name, phone, email, URLs or free text.
 * Analytics failure must never block the assessment.
 */
import { SITE_CONFIG, has } from './site-config.js';

const ALLOWED_PROPS = new Set(['step', 'gate', 'scoreBand', 'device', 'referrerCategory', 'utmCampaign', 'code']);

function deviceClass() {
  try {
    return window.matchMedia('(max-width: 767px)').matches ? 'mobile' : 'desktop';
  } catch {
    return 'unknown';
  }
}

function referrerCategory() {
  try {
    if (!document.referrer) return 'direct';
    const host = new URL(document.referrer).hostname;
    if (host === window.location.hostname) return 'internal';
    if (/google\.|bing\.|duckduckgo\./.test(host)) return 'search';
    if (/instagram\.|facebook\.|t\.co|linkedin\./.test(host)) return 'social';
    return 'other';
  } catch {
    return 'unknown';
  }
}

let booted = false;
export function initAnalytics() {
  if (booted) return;
  booted = true;
  try {
    if (has(SITE_CONFIG.PLAUSIBLE_DOMAIN)) {
      const s = document.createElement('script');
      s.defer = true;
      s.src = 'https://plausible.io/js/script.manual.js';
      s.setAttribute('data-domain', SITE_CONFIG.PLAUSIBLE_DOMAIN);
      document.head.appendChild(s);
      window.plausible = window.plausible || function () { (window.plausible.q = window.plausible.q || []).push(arguments); };
      window.plausible('pageview');
    } else if (has(SITE_CONFIG.GA4_MEASUREMENT_ID)) {
      const s = document.createElement('script');
      s.async = true;
      s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(SITE_CONFIG.GA4_MEASUREMENT_ID);
      document.head.appendChild(s);
      window.dataLayer = window.dataLayer || [];
      window.gtag = function () { window.dataLayer.push(arguments); };
      window.gtag('js', new Date());
      window.gtag('config', SITE_CONFIG.GA4_MEASUREMENT_ID, { anonymize_ip: true });
    }
  } catch { /* never block */ }
}

/** track('quiz_started', {step: 1}) — only allow-listed anonymous props pass through. */
export function track(eventName, props = {}) {
  try {
    const clean = { device: deviceClass(), referrerCategory: referrerCategory() };
    for (const [k, v] of Object.entries(props)) {
      if (ALLOWED_PROPS.has(k) && (typeof v === 'string' || typeof v === 'number')) clean[k] = v;
    }
    if (typeof window.plausible === 'function') {
      window.plausible(eventName, { props: clean });
    } else if (typeof window.gtag === 'function') {
      window.gtag('event', eventName, clean);
    }
  } catch { /* never block */ }
}
