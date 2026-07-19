# OriVista — first-contact playbook & deal card

## Launch checklist (do in order, ~45 min total)

1. **Pre-send verification (10 min, REQUIRED)** — run the browser checklist in
   `06_QA_REPORT.md` §Pre-send. The two load-bearing items are **E3** (is
   support@azurebali.com still shown?) and **E4** (are both booking domains
   still live with matching IDs?). If the rebrand has since been completed,
   soften or remove Finding 01 in the microsite (`audit/orivista/index.html`),
   the demo scenario 1 framing, and `02_AUDIT.md` before sending. Accuracy is
   the asset.
2. **Confirm the founder's surname (E13b)** — before any message that uses it.
   "Hi Manish" is safe until confirmed.
3. **Capture screenshots (15 min)** — locally:
   `npm i -D playwright && npx playwright install chromium` (once), then
   `node scripts/capture-evidence.mjs audit/orivista/evidence-plan.json`.
   Commit the PNGs; every slot in the microsite fills automatically. While
   capturing, record the exact URLs of the 30-min-SLA and office-hours copy
   (the evidence plan uses placeholders).
4. **Deploy** — push to the Vercel/Netlify project (env vars per README §5; the
   same 4 vars serve `/api/demo-request`). Verify:
   `https://<domain>/audit/orivista/` renders; the demo at
   `/audit/orivista/demo/` plays scenario 1 end-to-end; `X-Robots-Tag: noindex`
   header present; demo form submits to the Sheet (send one test, mark the row
   TEST).
5. **Analytics** — confirm `audit_page_view` fires (Plausible/GA4 configured in
   `assets/js/site-config.js`).
6. **Send M1** per `04_OUTREACH_MESSAGES.md` (LinkedIn or email — NOT the guest
   WhatsApp line). Log it in the deal card below.

## Objection quick-reference

| They say | You say |
|---|---|
| "We already use AI automation" | "I'm sure you do — and I'm not pitching to replace it. This is the *pre-booking* capture layer in front of it. The proof it's needed is public: support@azurebali.com, book.azurebali.com and 'by Azure' OTA names are still live. Internal automation is invisible from outside; those leaks aren't. That's the gap we close." |
| "The rebrand's basically done" | "Then this is a 30-minute cleanup, not a project — and the gift page does most of it free (the redirect, since your listing IDs already match). But if support@azurebali.com is still on your contact page today, a guest just emailed the old brand this week." |
| "We're a data/tech-led team, we'll build it" | "You could — the gift page hands you the simple fixes free. The 14-day version buys the always-on capture, the unified pipeline across both brands, the follow-up engine and a *measured* 30-min SLA in one step, while your team keeps doing their jobs and your PMS stays untouched." |
| "Our reservations already reply in 30 min" | "Probably true in office hours — and it's unmeasured, which is the real risk. Days 1–2 measure your actual baseline incl. nights/weekends; if you're already at 30 min 24/7, you'll have proof to advertise and we'll have saved you the fee." |
| "Price" | "$8,500 one-off is ~1–2 villa-nights across a 52-villa book, no lock-in. The base scenario pays back in ~3.5 months — and the assumptions are on the page for you to challenge." |
| "Not now / high season" | "That's exactly when enquiries leak most. Shadow mode means zero disruption: your team changes nothing until Day 13. If it's still 'no', the link stays live." |

## Meeting flow (the 20-minute walkthrough)

1. (2 min) Their story: who answers enquiries today, on which numbers, how the
   Bali/Bhubaneswar split works.
2. (5 min) Verify the two INFERRED items live: villa-page WhatsApp link
   behaviour; booking-engine vendor (page source) — and confirm whether
   support@azurebali.com / book.azurebali.com are still live.
3. (8 min) Trace two of THEIR real enquiries from last month through the
   proposed flow, showing it feeding — not replacing — their engine.
4. (3 min) 14-day plan + acceptance gates + price ($8,500; +$1,500 reviews).
5. (2 min) Close: "Days 1–2 are interviews + integration checks only — want to
   pencil a start Monday?" → send proposal PDF same hour.

## Deal card (live copy — update after every touch)

| Field | Value |
|---|---|
| Company | OriVista (orivista.com; formerly Azure Bali) |
| Contact | Manish A., Founder (confirm surname — E13b) |
| Channel | LinkedIn (in/manish-a-7774ab111) · info@orivista.com · IG @orivistaofficial · **NOT the guest WA line** |
| Source | Outbound — personal audit asset |
| First message date | — (pending owner send) |
| Microsite viewed | — (watch `audit_page_view` / section events) |
| Reply received | — |
| Meeting | — |
| Objection | — (expect "we already have AI" — see table) |
| Next step | Owner runs Launch checklist → verify E3/E4 → send M1 |
| Next action date | set on M1 send (+3d M2, +5d M3, +8d M4, +14d M5) |
| Status | `Ready — not contacted` |
| Proposal value | USD 8,500 (+$1,500 reviews add-on) |
| Loss reason | — |

**Status ladder:** Ready — not contacted → Contacted (M1/M2) → Audit sent →
Audit viewed → Walkthrough proposed → Meeting booked → Proposal discussed →
Won / Lost (reason) / Nurture.

## Asset funnel metrics (check weekly)

From analytics (events already wired): microsite visits & uniques
(`audit_page_view`), sections viewed (`audit_section_view`), CTA clicks
(`audit_cta_click`), demo opened (`audit_demo_opened`), scenario runs
(`audit_demo_scenario`), gift copies (`gift_copy`), form started/submitted
(`demo_form_started/submitted`). From the deal card: reply received, meeting
booked, proposal discussed, won/lost. Definition of success for the asset: page
viewed + reply within 7 days of M3; meeting within 14 days.
