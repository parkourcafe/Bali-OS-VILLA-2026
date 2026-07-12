# Gravity Bali — first-contact playbook & deal card

## Launch checklist (do in order, ~45 min total)

1. **Pre-send verification (10 min, REQUIRED)** — run the browser checklist in
   `06_QA_REPORT.md` §Pre-send. If any of the three load-bearing quotes is no
   longer on their site, update the microsite/deck first — accuracy is the
   asset.
2. **Capture screenshots (15 min)** — locally:
   `npm i -D playwright && npx playwright install chromium` (once), then
   `node scripts/capture-evidence.mjs audit/gravity-bali/evidence-plan.json`.
   Commit the PNGs; every slot in the page and deck fills automatically.
3. **Deploy** — push to the Vercel/Netlify project (env vars per README §5;
   the same 4 vars serve `/api/demo-request`). Verify:
   `https://<domain>/audit/gravity-bali/` renders; `X-Robots-Tag: noindex`
   header present; demo form submits to the Sheet (send one test, then mark
   the row TEST).
4. **Analytics** — set `PLAUSIBLE_DOMAIN` or `GA4_MEASUREMENT_ID` in
   `assets/js/site-config.js`; confirm `audit_page_view` fires.
5. **Export the deck** — open `/audit/gravity-bali/deck/`, "Save as PDF"
   (A4-landscape-ish page size is preset). Keep the PDF for email; WhatsApp
   gets the page link, not the file.
6. **Verify the target number** — open gravitybali.com/en/contact-us/ and
   confirm +62 813-5370-4430 is still their line before messaging.
7. **Send M1** per `04_OUTREACH_MESSAGES.md`. Log it in the deal card below.

## Objection quick-reference

| They say | You say |
|---|---|
| "We're boutique — AI will feel cold" | "The AI only acknowledges and asks the two questions your team asks anyway — within seconds, in your tone. Every quote and every relationship stays human. Shadow mode means you approve every draft before launch." |
| "Our team already replies fast" | "Probably true — and it's unmeasured, which is the real risk. Days 1–2 measure your actual baseline; if you're already at <5 min 24/7, you'll have proof to advertise and we'll have saved you $7,500." |
| "Why not build it ourselves?" | "You could — the review documents the two fixes any dev can do, free. The 14-day version buys the pipeline, the follow-up engine, training and a measured SLA in one step, while your team keeps doing their jobs." |
| "Price" | "It's ~1–2 villa-nights of portfolio revenue, one-off, no lock-in. The base scenario pays back in ~3.5 months — and the assumptions are on the page for you to challenge." |
| "Not now / high season" | "That's exactly when enquiries leak most. But fine — shadow mode means zero disruption: your team changes nothing until Day 13. If it's still 'no', the link stays live." |

## Meeting flow (the 20-minute walkthrough)

1. (2 min) Their story: who answers enquiries today, on which numbers.
2. (5 min) Verify the two INFERRED items live: villa-page WhatsApp link
   behavior; where the reserve form lands.
3. (8 min) Trace two of THEIR real enquiries from last month through the
   proposed flow (pipeline demo on sample data).
4. (3 min) 14-day plan + acceptance gates + price.
5. (2 min) Close: "Days 1–2 are interviews only — want to pencil a start
   Monday?" → send proposal PDF same hour.

## Deal card (live copy — update after every touch)

| Field | Value |
|---|---|
| Company | Gravity Bali (gravitybali.com) |
| Contact | Olivier Cancé (Founder) · Celine Cancé (Co-Director) |
| Channel | WhatsApp +62 813-5370-4430 (verify pre-send) · contact@gravitybali.com · IG @bali.gravity |
| Source | Outbound — personal audit asset |
| First message date | — (pending owner send) |
| Microsite viewed | — (watch `audit_page_view` / section events) |
| Reply received | — |
| Meeting | — |
| Objection | — |
| Next step | Owner runs Launch checklist → send M1 |
| Next action date | set on M1 send (+3d M2, +5d M3, +8d M4, +14d M5) |
| Status | `Ready — not contacted` |
| Proposal value | USD 7,500 |
| Loss reason | — |

**Status ladder:** Ready — not contacted → Contacted (M1/M2) → Audit sent →
Audit viewed → Walkthrough proposed → Meeting booked → Proposal discussed →
Won / Lost (reason) / Nurture.

## Asset funnel metrics (check weekly)

From analytics (events already wired): microsite visits & uniques
(`audit_page_view`), sections viewed (`audit_section_view`), deck opened
(page view on /deck/), CTA clicks (`audit_cta_click`: hero-walkthrough,
whatsapp, request-plan), form started (`demo_form_started`), form submitted
(`demo_form_submitted`). From the deal card: reply received, meeting booked,
proposal discussed, won/lost. Definition of success for the asset: page
viewed + reply within 7 days of M3; meeting within 14 days.
