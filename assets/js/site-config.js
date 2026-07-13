/**
 * Public site configuration — the ONLY file marketing may edit freely.
 * Production values are placeholders on purpose (FINAL TZ §31): do not invent.
 * Scoring rules live in scoring.js and must not be moved here.
 */

export const SITE_CONFIG = Object.freeze({
  WORDMARK: 'Selena Systems',

  // Public WhatsApp link for audit/contact fallback.
  WHATSAPP_PUBLIC_URL: 'https://wa.me/6282339630988',

  // TODO(Selena): 15-minute call booking link (Cal.com/Calendly)
  CALENDAR_URL: '',

  // TODO(Selena): public contact email shown in the footer and privacy page
  CONTACT_EMAIL: '',

  // TODO(Selena): privacy/deletion request contact (may equal CONTACT_EMAIL)
  PRIVACY_CONTACT_EMAIL: '',

  // TODO(Selena): legal entity name for the privacy page (do not invent)
  LEGAL_ENTITY_NAME: '',

  // Analytics: set exactly one. Leave both empty to disable analytics.
  // TODO(Selena): e.g. "villaresponse.selenasystems.com"
  PLAUSIBLE_DOMAIN: '',
  // TODO(Selena): e.g. "G-XXXXXXXXXX"
  GA4_MEASUREMENT_ID: '',

  // V1 playbook delivery is manual (spec §15.4). Do not change without automation.
  PLAYBOOK_DELIVERY_MODE: 'manual_whatsapp',

  // Guest Feedback & Reviews module — public review link (Google Maps "write a
  // review" URL). Leave empty until the client provides their real place link:
  // Google Maps -> find the business -> Share -> "write a review" link
  // (looks like https://g.page/r/XXXXXXXX/review or
  //  https://search.google.com/local/writereview?placeid=XXXX). Do not invent.
  GOOGLE_REVIEW_URL: '',
  // Default brand shown on the guest feedback page when ?brand= is absent.
  FEEDBACK_BRAND: 'Villa Ops OS',
});

/** True when a value is configured (non-empty). */
export function has(value) {
  return typeof value === 'string' && value.trim().length > 0;
}
