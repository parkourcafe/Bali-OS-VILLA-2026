# Implementation notes — Villa Response Readiness Funnel V1

Built from `FINAL_TZ_VILLA_RESPONSE_READINESS_V1.md` as the sole source of truth.

## Conflicts found in the existing repository and how they were resolved (spec §2.4)

1. **Old marketing landing (`index.html`)** used banned naming ("Book a free AI Audit"), a full-screen hero video (banned by §23.4) and a mailto/WhatsApp form. Per spec priority it was **replaced** by the funnel landing and preserved untouched at `legacy/villa-ops-landing-v0.html` (with its README/fix notes) — nothing was deleted.
2. **Hosting**: production `main` currently deploys to Vercel. The spec requires a Netlify Function + `netlify.toml` (both present). To avoid forcing a host switch, `api/lead.mjs` was added as a thin Vercel adapter that reuses the exact same handler, and `vercel.json` now carries clean URLs, trailing-slash routes, security headers and the result-page noindex. **The funnel therefore deploys and works on Vercel OR Netlify** with the same four env vars; no code is duplicated between hosts.
3. **`assets/` layout** was reorganized to the spec structure (`assets/css`, `assets/js`, `assets/images`); the existing `og-image.svg` was moved to `assets/images/`.
4. Legacy GTM documents in the repo root (winning_offer.md, etc.) were left as-is: they are strategy documents, not site content, and the spec's naming rules were applied to the site only.

## Key implementation decisions

- **Shared scoring module** (`assets/js/scoring.js`) is imported by both the browser (result rendering metadata) and the Netlify function (canonical calculation, bundled via esbuild). The API never accepts a client-computed score.
- **Unknown fields** in API payloads are **ignored** (allowlist extraction), documented per §19.1.
- **Idempotency** is honored at two levels: the function returns the webhook's stored `leadId` for a retried `score_completed`, and Apps Script caches responses by `idempotencyKey` for 6h (no duplicate rows/emails).
- **Rate limiting** lives in Apps Script `CacheService` (5 `score_completed`/hour per IP hash) as specified; the function only computes the salted hash — the raw IP never leaves it.
- **Status update rule**: automated events only move `Status` forward from `Instant score completed`; any manually set stage is never overwritten.
- **Auto-advance** on radio steps fires only for pointer input (a `pointerdown` on the option card marks the interaction); keyboard users get the explicit Continue path (§8.1).
- **Analytics** are optional and allow-listed: events carry only step/gate/scoreBand/device/referrerCategory/utmCampaign. With no analytics ID configured, no third-party script loads at all.
- **CSP** allows self + Google Fonts + the two optional analytics origins; `unsafe-inline` is currently required for the two small inline module scripts on landing/privacy pages — an acceptable V1 trade-off documented here (hash-based CSP is a cheap follow-up).

## Test results (this build)

- `npm test`: **38/38 pass** (scoring incl. §10.3 worked example and band boundaries 39/40/59/60/79/80; channel-control 1-centralized/5-centralized/5-unmanaged; unknown answers; both tie-breaks; gate matrix; validation incl. honeypot, oversize, origin, UUIDs, formula prefixes; handler error contract incl. WEBHOOK_UNAVAILABLE with no fake success).
- Server E2E (real function + mock webhook emulating the Apps Script contract): Flow A with idempotent double-submit → one row; audit update by leadId incl. WhatsApp edit; Flow B playbook update; unknown leadId → NOT_FOUND; sub-15s completion → accepted + suspicious flag. **Passed.**
- Browser E2E (Chromium, 390×844): full 12-step completion, Back preservation, mid-quiz refresh restore, WhatsApp validation error path, canonical result 48/100 rendered from server response, authority checkbox enforcement, audit + playbook confirmations, Sheet assertions, no-session redirect from `/score/result/`. **Passed.** (Console shows only blocked-font network errors specific to the sandbox.)
- Flow D (webhook outage): retry state with preserved answers, no false success, submit re-enabled. **Passed.**
- Lighthouse: not executed in the sandbox (external domains blocked → invalid scores); instructions + expected-pass rationale in `docs/MANUAL_QA.md`.

## Known limitations

1. **Apps Script E2E is emulated.** `Code.gs` is untested against a real Google deployment (no Google account in the build environment). The mock reproduces the documented contract (secret, idempotency, upsert, NOT_FOUND), and README step 6 covers the real smoke test.
2. **CSP `unsafe-inline` for scripts** (see decisions above).
3. **Rate limiting is best-effort**: Apps Script CacheService is per-deployment and resets on redeploy; acceptable for V1 volumes.
4. **`sitemap.xml` uses relative URLs** until the production domain exists (launch checklist item).
5. **Fonts load from Google Fonts** with `display=swap` and system fallbacks; self-hosting was avoided because the spec forbids font file delivery in the handoff.
6. Real-device Safari/Android passes and Lighthouse numbers must be recorded on a deploy preview (checklist in `docs/MANUAL_QA.md`).
