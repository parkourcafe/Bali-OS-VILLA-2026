# Content editing guide

## Safe to edit (marketing)

- **`assets/js/site-config.js`** — wordmark, WhatsApp link, calendar link, emails, analytics ID, legal entity name. This is the only config marketing should ever touch.
- **`index.html`** — landing copy (keep the locked naming and the honesty rules below).
- **`privacy/index.html`** — after legal review only.
- **`assets/css/styles.css`** — theme tokens in `:root` (keep WCAG AA contrast).
- **`assets/js/quiz-schema.js`** — question wording and helper text ONLY. Do not change `value` enums, step order, required flags or add/remove options: enums are validated server-side and mapped to scoring points; a renamed value will be rejected by the API.

## LOCKED — do not edit without a new approved spec

- **`assets/js/scoring.js`** — points, category maxima, risk bands, tie-breakers, gate rule, result copy. A "small" edit here silently changes every score; the server and browser must stay identical, and `npm test` enforces the spec's numbers.
- **`netlify/functions/lead.mjs`** — validation and API contract.
- **`google-apps-script/Code.gs`** — configuration lives in Script Properties, not in code.

## Naming rules (spec §2.1 — enforced in copy reviews)

Use only: **Villa Response Readiness Score**, **Live Guest Inquiry Audit**, **Villa Response Playbook**, **Villa Ops Response System**.
Never: Villa Inquiry Leak Score, Secret Guest Audit, Guest & Lead Engine, AI Audit, Website scan, Instagram scan.

## Honesty rules (spec §3.3)

Forbidden: "We scanned your website", "We analysed your Instagram", "We measured your actual response time", "Your business is losing $X", "Top Bali operators reply in under five minutes".
Allowed: "Based on your answers", "Diagnostic estimate", "Our implementation target is a first response within five minutes on covered channels", "A live test can measure actual response performance after approval".

After ANY content change: run `npm test`, click through the quiz once locally (`npm run dev`), and check mobile 390px width.
