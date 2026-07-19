# Villa Ops OS — go-to-market: work list + 30-day plan

Operating doc for Selena Systems. The strategy corpus (positioning, offer,
ICP, scripts, delivery playbook, red-team) is essentially complete — this is
the **execution layer** that turns it into activity and a first signed client.
Companion: `SEO_STRATEGY.md` (the inbound channel). Naming: everything here
uses **"Villa Ops OS"**; the root v1 docs still say "Villa Ops Response
System" — treat them as the same product (rename is a low-priority cleanup).

Focus for these 30 days: **close Gravity Bali AND stand up a repeatable
pipeline** — one real close funds and proves the machine.

---

## Part A — Work list (the backlog)

P0 = blocks revenue · P1 = this month · P2 = compounding.

### 1. Unblock-to-sell (P0)
- **Build the "Villa Demo Selena" live responder** — the fictional 3-villa demo
  agent named as the #1 prerequisite in `next_24_hours_plan.md` /
  `EXECUTION_DASHBOARD.md`. Spec it from the Gravity interactive demo flows
  (`audit/gravity-bali/demo/`), which are *simulations* — this is the real,
  chattable agent prospects try. Validate against a 10-scenario subset of the
  40-scenario acceptance suite in `delivery_process.md`.
- **Clear legal/local contracting** — entity, invoicing, payment receipt,
  data-processing, IP ownership (red_team_report.md #6, assumptions.md A4).
  Gates signing any Bali client. Interim: a written path from a local advisor.
- **Pick ONE production domain** and wire it everywhere (see `SEO_STRATEGY.md`
  Phase 0 — already consolidated in-repo to `villaops.selenasystems.com`;
  confirm ownership).
- **Turn on analytics** — `assets/js/site-config.js` `PLAUSIBLE_DOMAIN` /
  `GA4_MEASUREMENT_ID` are empty, so the funnel is currently unmeasured.

### 2. Ship Gravity Bali (P0)
- Run the `gravity-bali/05_FIRST_CONTACT_PLAYBOOK.md` launch checklist + the
  `09_SITE_AUDIT_CHECKLIST.md` §6 pre-send verification (10-min live-browser
  check of the load-bearing quotes).
- Capture real screenshots: `node scripts/capture-evidence.mjs
  audit/gravity-bali/evidence-plan.json` (local, needs network).
- Deploy per `docs/DEPLOY.md`; set `GOOGLE_REVIEW_URL` if using the reviews
  add-on. Then send **M1** from `gravity-bali/04_OUTREACH_MESSAGES.md`.

### 3. Build the pipeline (P1)
- **Score the 68-name `lead_list.csv`** with the `ICP_AND_SCORING.md` rubric →
  ranked top-15. Seed the top with the 8 deep + 12 discovery profiles already
  in `docs/sales-assets/research/candidate-research-2026-07-12.json`.
- **Audit factory** — reuse the Gravity `audit/<slug>/` template (microsite +
  demo + gift + evidence-plan) as a repeatable per-client unit. Target 2–4
  audits/week.

### 4. Proof (P1)
- Convert the first pilot into a written case study + testimonial
  (`winning_offer.md` proof strategy depends on it). Interim proof = the live
  demo agent + the pilot's shadow-mode before/after baseline.

### 5. Inbound / SEO (P1–P2)
- Execute `SEO_STRATEGY.md` (foundation already shipped; content cadence next).

---

## Part B — 30-day calendar (4 gated weeks)

One operator assumed. A week doesn't advance until its **gate** is green;
if a gate slips, the calendar shifts, the scope doesn't.

### Week 1 — Unblock + send Gravity
- Build the Villa Demo Selena responder; run the 10-scenario subset.
- Clear the legal gate (or a written interim path).
- Deploy the site + Gravity asset on the chosen domain; do SEO Phase 0
  (already applied in-repo — verify live). Turn on analytics.
- Run the Gravity pre-send checklist; capture screenshots; **send M1**.
- **Gate:** demo passes 10/10 scenarios · Gravity asset live at a real URL ·
  M1 sent and logged in the deal card.

### Week 2 — Pipeline build
- Score the 68-list → top-15; mystery-shop the top 8 (ethical caveats from
  `outreach_scripts.md`; never fabricate an enquiry beyond what the scripts
  permit).
- Ship **3 new per-client audits** from the template.
- Run Gravity M2/M3 + gift on schedule; open outreach to 5 new scored targets.
- **Gate:** ≥3 audits shipped · ≥6 targets "contacted" · ≥1 reply.

### Week 3 — Sales motion + SEO foundation live
- 15-min qualification → 45-min discovery calls (`sales_call_script.md`) for
  anyone engaged; same-day proposals (`proposal_template.md`).
- Publish the first 2 blog articles (already drafted in `/blog/`), confirm
  JSON-LD + `llms.txt` live, submit sitemap to Search Console.
- **Gate:** ≥1 discovery call held · ≥1 proposal out · `/` + blog indexed.

### Week 4 — Close + systematize
- Push the warmest deal to 50% deposit; if Gravity stalls, advance the next
  best. Kick off delivery Days 1–2 (`IMPLEMENTATION_PLAN_14D.md`) for whoever
  signs.
- Publish 2 more articles; ship the client-facing AI-readiness add-on one-pager
  (`SEO_STRATEGY.md` §client-facing).
- Retro: update `EXECUTION_DASHBOARD.md` with real numbers; set month-2 targets.
- **30-day definition of done:** 1 signed pilot (or a proposal in active
  negotiation) **and** an inbound engine live with ≥4 indexed content pages.

---

## Tracking

- **Per prospect:** the deal card in `gravity-bali/05_FIRST_CONTACT_PLAYBOOK.md`
  (clone per client). Status ladder: Ready → Contacted → Audit sent → Audit
  viewed → Call booked → Proposal → Won / Lost(reason) / Nurture.
- **Weekly funnel line:** audits shipped → contacted → replied → call →
  proposal → won. One row per week.
- **Measured, not guessed:** analytics on (Plausible/GA4) so microsite views,
  CTA clicks, demo opens and form submits are real numbers, not vibes.

## Guardrails (from the red team)

- No outreach before the demo agent works and the legal path is written.
- Mystery-shop only within the ethical wording in `outreach_scripts.md`.
- Never invent case studies or promise revenue; all figures are TARGET/ESTIMATE.
- Founder bandwidth is the scarce resource — the audit factory and templates
  exist so throughput doesn't depend on re-doing strategy.
