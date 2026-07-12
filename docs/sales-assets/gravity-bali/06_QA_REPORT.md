# Gravity Bali sales asset — QA report

Build date: 2026-07-12 · Branch: `claude/villa-ops-bali-sales-vwmqdj`

## Automated tests

- `npm test`: **64/64 pass** — includes 12 new tests for
  `/api/demo-request` (validation matrix, honeypot spam rejection, consent
  requirement, whatsapp normalization, origin allowlist, 405, RATE_LIMITED →
  429, webhook-garbage and webhook-down → 503 with `ok:false` — **no fake
  success path exists**).

## Server E2E (dev server = real function + mock Apps Script webhook)

| Check | Result |
|---|---|
| `/audit/gravity-bali/` + `/deck/` + assets serve 200 | ✅ |
| Happy-path form POST → `{ok:true, requestId}` + row in Demo Requests sheet with UTM/source | ✅ |
| Duplicate submit (same idempotencyKey) → same requestId, still 1 row | ✅ |
| Honeypot filled → 400 `SPAM_REJECTED`, webhook untouched | ✅ |
| Bad fields → 400 with per-field list (`name, role, whatsapp, villaCount, consent`) | ✅ |
| Webhook outage (`FAIL_WEBHOOK=1`) → 503 `WEBHOOK_UNAVAILABLE`, `ok:false` — user sees retry + WhatsApp fallback, **never** a success state | ✅ |

## Browser E2E (Chromium 1366×850 & 390×844)

| Check | Result |
|---|---|
| Microsite renders desktop + mobile, all 11 sections | ✅ (screenshots reviewed) |
| Deck renders; print stylesheet present (`Save as PDF` button) | ✅ |
| Form: fill → submit → success box shown only after server 200; row saved | ✅ |
| Console errors | Only sandbox-expected: Google Fonts blocked (`ERR_CONNECTION_RESET`) and by-design 404 probes for not-yet-captured screenshot slots |
| `noindex` | `<meta name="robots" content="noindex, nofollow">` on page + deck ✅; `X-Robots-Tag` for `/audit/*` in `netlify.toml` + `vercel.json` ✅; `Disallow: /audit/` in robots.txt ✅; no links from public site ✅ |
| Analytics | `audit_page_view`, `audit_section_view`, `audit_cta_click`, `demo_form_started/submitted` wired through the PII-allowlist tracker; loads only when Plausible/GA4 configured | 

## Known limitations (environment-imposed, disclosed)

1. **No live page loads of gravitybali.com were possible** — the build
   environment's egress policy returned 403 for all external hosts. All site
   facts are OBSERVED via search-index snippets (each confirmed with ≥2
   independent query phrasings for the load-bearing claims). Nothing is
   presented as VERIFIED.
2. **Screenshots are placeholder slots** until the operator runs
   `node scripts/capture-evidence.mjs audit/gravity-bali/evidence-plan.json`
   locally (8 shots, ~15 min incl. Playwright install). Slots auto-fill.
3. **Apps Script `demo_requested` handler is emulated** in tests (same
   contract as the shipped `Code.gs`); run one real submit against the
   deployed webhook during launch checklist step 3.
4. Actual Gravity reply times, wa.me link behavior, page speed, and mobile
   rendering of THEIR site: NOT TESTED — listed in the audit as such.

## Pre-send verification checklist (operator, ~10 min in any browser)

Confirm each item is still live before sending M1; screenshot as you go
(doubles as evidence capture):

1. https://gravitybali.com/en/reserve-your-stay/ — form wording “sent directly
   to our marketing team … personalized quote”.
2. https://gravitybali.com/en/gravity-bali-guest-experience-secrets/ —
   “average response time under five minutes” + “under 1 hour”.
3. https://gravitybali.com/en/faqs-for-guests/ — “concierge service is closed
   on weekends”; and /en/gravity-conciergerie/ — “7 days a week”.
4. https://gravitybali.com/en/about-us/ — villa count wording (40+ / 35).
5. https://gravitybali.com/en/contact-us/ — +62 813-5370-4430 still listed.
6. A villa page (e.g. /en/property/villa-kelanah/) — record the WhatsApp
   link `href` if present (settles audit item E11; adjust Finding 04 from
   “Inferred” to Observed/Refuted accordingly).
7. @bali.gravity follower count.

If any quote changed: update `audit/gravity-bali/index.html` (Findings 1–3),
the deck slide 3, and `02_AUDIT.md` before sending. Accuracy is the asset.

## Deliverables index

| # | Deliverable | Location |
|---|---|---|
| 1–2 | 3 candidates + selection rationale | `00_CANDIDATE_SHORTLIST.md` |
| 3 | Public source register | `00_…` §sources + `01_EVIDENCE_REGISTER.md` + `../research/candidate-research-2026-07-12.json` |
| 4–7 | Site / WhatsApp / booking-flow audit + loss map | `02_AUDIT.md` |
| 8 | Before/after visualization (+ concept mockups) | microsite §§4–6, deck slides 4–5 |
| 9 | Personal microsite (noindex, analytics, form) | `audit/gravity-bali/index.html` |
| 10 | Audit deck 8 slides, editable, PDF-ready | `audit/gravity-bali/deck/index.html` |
| 11 | Personal proposal | `03_PROPOSAL.md` |
| 12–13 | 5-message sequence, WA/email/IG versions | `04_OUTREACH_MESSAGES.md` |
| 14 | 14-day plan (day-by-day, owners, acceptance) | `../IMPLEMENTATION_PLAN_14D.md` |
| 15 | KPI (tech/ops/commercial + non-promises) | `../KPI_FRAMEWORK.md` |
| 16 | Working demo form (saves via webhook, no fake success) | `/api/demo-request` + microsite |
| 17 | Microsite analytics | `assets/js/audit-page.js` events |
| 18 | Deal card | `05_FIRST_CONTACT_PLAYBOOK.md` |
| 19 | First-contact instructions | `05_FIRST_CONTACT_PLAYBOOK.md` |
| 20 | QA report | this file |
