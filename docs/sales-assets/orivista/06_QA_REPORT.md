# OriVista sales asset — QA report

Build date: 2026-07-19 · Branch: `claude/villa-ops-bali-sales-vwmqdj`

## Automated tests

- `npm test` (`node --test`): **103/103 pass** — the full suite, unchanged by
  the OriVista asset (it reuses the already-tested shared endpoints
  `/api/demo-request` and `/api/feedback`, and the shared `audit-page.js`). No
  OriVista-specific server code was added; the microsite, demo and gift are
  static and wire into existing, tested functions.

## Browser E2E (Chromium 1366×850 & 390×844, headless)

Script: `scratchpad/e2e-orivista.mjs` — **28/28 checks pass**.

| Area | Checks | Result |
|---|---|---|
| Microsite `/audit/orivista/` (desktop) | h1, noindex meta, **5 finding cards**, "already use AI" objection box, headline = rebrand (F1), price **$8,500**, company prefilled "OriVista", villaCount default "50+", demo form present, 0 real JS errors | ✅ |
| Microsite (mobile 390px) | no horizontal overflow (scrollWidth = 390) | ✅ |
| Demo `/audit/orivista/demo/` | noindex, 4 scenario tabs, S1 brand-unify reply + lead card villa = Kenza, S1 progresses on chip tap, S3 escalation notification, S4 service-recovery alert, 0 real JS errors | ✅ |
| Gift `/audit/orivista/gift/` | noindex, 3 kit steps, dual-brand redirect snippet, OTA rename template, 5 copy buttons, 0 real JS errors | ✅ |
| `/demo-agent/` regression (Part D) | noindex, opening bubble renders, 0 real JS errors | ✅ |

"0 real JS errors" excludes sandbox-expected noise: blocked Google Fonts and
the **by-design 404 probes** for not-yet-captured screenshot slots
(`audit-page.js` tries `assets/shots/<id>-{desktop,mobile}.png` for each of the
4 slots — 8 probes + favicon — until the operator captures them locally).

## Server E2E (dev server = real functions + mock Apps Script webhook)

| Check | Result |
|---|---|
| `/audit/orivista/` + `/demo/` + `/gift/` serve 200 | ✅ |
| Demo-request POST with `source: audit-microsite:orivista` → `{ok:true, requestId}` | ✅ (row saved via the shared, tested endpoint) |
| noindex meta on all 3 OriVista pages | ✅ |

## noindex enforcement

| Layer | Coverage |
|---|---|
| `<meta name="robots" content="noindex, nofollow">` | ✅ on microsite, demo, gift |
| `X-Robots-Tag` header | ✅ `/audit/*` rule already in `netlify.toml` + `vercel.json` — covers `/audit/orivista/*` with no new config |
| `robots.txt` | ✅ `Disallow: /audit/` already present |
| No public links | ✅ nothing links to `/audit/orivista/` from the public site |

## Known limitations (environment-imposed, disclosed)

1. **No live page loads of orivista.com / azurebali.com / OTAs were possible** —
   the build environment's egress policy returned 403 for all external hosts.
   All site facts are OBSERVED via search-index snippets (load-bearing claims
   confirmed with ≥2 query phrasings). Nothing is presented as VERIFIED.
2. **Screenshots are placeholder slots** until the operator runs
   `node scripts/capture-evidence.mjs audit/orivista/evidence-plan.json` locally
   (9 shots). Slots auto-fill; the 404 probes above disappear.
3. **Two findings are load-bearing and time-sensitive:** F1 depends on E3
   (support@azurebali.com still shown) and E4 (both booking domains live with
   matching IDs). If OriVista has completed the rebrand since 2026-07-12, F1 must
   be softened/removed before send — see the pre-send checklist.
4. Actual OriVista reply times, wa.me link behaviour, booking-engine vendor,
   page speed and mobile rendering of THEIR site: NOT TESTED — listed as such.
5. Founder surname ("Agarwal") is NOT confirmed on-page (E13b) — must be verified
   before addressing him by it.

## Pre-send verification checklist

Consolidated in `09_SITE_AUDIT_CHECKLIST.md` §6 (operator, ~12 min, live
browser). The two REQUIRED items are E3 and E4 (the rebrand-leak findings). If
either changed, update `audit/orivista/index.html` (Finding 01), the demo
scenario 1 framing, and `02_AUDIT.md` before sending. Accuracy is the asset.

## Positioning QA (OriVista-specific)

- [x] Nowhere does the asset claim OriVista "has no booking system" — the engine
      is acknowledged as existing (Hostaway inferred) throughout.
- [x] The "we already use AI automation" objection is pre-empted on the microsite
      and in `05_FIRST_CONTACT_PLAYBOOK.md`.
- [x] Villa Ops OS is framed as **augmenting** the stack (sits in front of the
      PMS), with an explicit "not a PMS replacement / not SEO / not a rebrand
      agency" honesty box.
- [x] Founder named only as "Manish A." (public LinkedIn headline); surname
      flagged unconfirmed.

## Deliverables index

| # | Deliverable | Location |
|---|---|---|
| 0 | Candidate profile + selection + positioning nuance | `00_CANDIDATE_PROFILE.md` |
| 1 | Public source register (per-claim, classified) | `01_EVIDENCE_REGISTER.md` (+ `../research/candidate-research-2026-07-12.json`) |
| 2 | Site / WhatsApp / booking-flow audit + loss map + scenarios | `02_AUDIT.md` |
| 3 | Personalized microsite (noindex, analytics, working form) | `audit/orivista/index.html` |
| 3a | Interactive demo (4 scenarios; S1 = rebrand+SLA+off-hours) | `audit/orivista/demo/index.html` |
| 3b | Free lead-magnet gift (Rebrand Rescue Kit) | `audit/orivista/gift/index.html` + `07_GIFT_KIT.md` |
| 4 | Personal proposal | `03_PROPOSAL.md` |
| 5 | 5-message sequence (LinkedIn/email/IG) | `04_OUTREACH_MESSAGES.md` |
| 6 | First-contact playbook + deal card + objections | `05_FIRST_CONTACT_PLAYBOOK.md` |
| 7 | Guest Feedback & Reviews add-on (compliant, brand-consolidating) | `08_REVIEW_SYSTEM.md` (+ shared `/feedback/` module) |
| 8 | Consolidated site-audit + all checklists | `09_SITE_AUDIT_CHECKLIST.md` |
| 9 | Evidence-capture plan (9 shots) | `audit/orivista/evidence-plan.json` |
| 10 | 14-day plan · KPI framework (shared) | `../IMPLEMENTATION_PLAN_14D.md` · `../KPI_FRAMEWORK.md` |
| 11 | QA report | this file |
