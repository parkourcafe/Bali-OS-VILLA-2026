# START HERE — Villa Ops OS project hub

**The single source of truth for this project.** Open this first. It answers, in
one place: what the task is, our base (offer & knowledge), what we've built,
where we are now, who's next, what to do next, and where every other document
lives.

> Last updated: 2026-07-19 · Branch: `claude/villa-ops-bali-sales-vwmqdj`
> This file supersedes the partial status/plan in `EXECUTION_DASHBOARD.md`,
> `next_24_hours_plan.md`, and `final_recap.html` (kept as history). Keep this
> file current when the project state changes.

---

## 1. The task / mission

**Selena Systems** sells and delivers **Villa Ops OS** — an AI-assisted guest-
enquiry response, qualification and follow-up system for **Bali villa
management companies**. The build in this repo is two things at once:

1. **A live marketing + lead funnel** (the public site, assessment, free tools,
   blog) that generates and qualifies inbound interest.
2. **A one-client sales-asset engine** — for a chosen real prospect, a passive
   public audit → a personalized private microsite + interactive demo + free
   gift + proposal + outreach sequence, all reusable as a per-client template.

> The original client brief (Russian) is **not stored in this repo**; a cited
> `FINAL_TZ_VILLA_RESPONSE_READINESS_V1.md` is referenced by several files but
> does not exist. The closest on-disk sources of truth are `winning_offer.md`
> (the offer) and `ICP_AND_SCORING.md` (targeting). This section reconstructs
> the mission from them.

### The honesty contract (non-negotiable — applies to every asset)
- **Passive public audit only.** No forms submitted, nobody messaged, no
  bookings, no access to internal systems. Nothing is sent or published without
  explicit permission.
- **Classify every finding:** `VERIFIED` / `OBSERVED` / `INFERRED` / `NOT
  TESTED`, each with a source.
- **Never overpromise.** All projections are `TARGET` / `ESTIMATE` /
  `ASSUMPTION` / `REQUIRES VALIDATION` — never guarantees. Never claim a
  response-time delay as fact without an authorised test.
- **Never name a person as owner** without public confirmation (e.g. OriVista's
  founder surname is flagged unconfirmed).
- **No fake success** anywhere in code: a save/API is reported successful only
  after the backend confirms it.

---

## 2. The base (offer & knowledge)

**Villa Ops OS** = a **14-day** implementation of a first-response + qualification
+ follow-up layer that **augments** the client's existing stack (WhatsApp,
website, PMS/booking engine) — it never replaces the PMS.

- **Commercial promise (SLA):** 95% of eligible new enquiries on covered
  channels get a first automated response **within two minutes**. (See exclusions
  in `winning_offer.md`.)
- **Primary ICP:** Bali villa management company, ~20–60 managed villas, ≥2
  reservations staff, 150–300+ direct enquiries/month, international/premium, a
  reachable decision-maker, and no advanced in-house AI already in place.
- **Pricing ladder** (`winning_offer.md`): **Pilot $1,500–2,500 · Core $5,000 ·
  Growth $7,500–9,500 · Enterprise $12,000+**. 50% to start / 50% at go-live.
  Optional care plan $400–700/mo. Client-specific quotes so far: **Gravity Bali
  $7,500**, **OriVista $8,500** (both Growth-tier for larger portfolios), each
  with a **+$1,500 compliant reviews add-on**.
- **Positioning nuance:** for prospects who already run automation/a booking
  engine (e.g. OriVista), pitch the **pre-booking capture + follow-up + brand-
  unification** layer *around* their stack — never "you have no system."

Sources of truth: `winning_offer.md` · `ICP_AND_SCORING.md` ·
`delivery_process.md` · `docs/sales-assets/KPI_FRAMEWORK.md` · `llms.txt`
(AI-facing product summary).

> **Naming note (cleanup pending):** root/v1 docs say **"Villa Ops Response
> System"**; the `docs/sales-assets/` layer and the site say **"Villa Ops OS."**
> Same product — a low-priority rename, flagged in `GTM_30DAY_PLAN.md`.

---

## 3. What we have (built)

Static HTML/CSS/vanilla-ES-module site + serverless functions, **zero runtime
dependencies**, dual-host (Netlify + Vercel), Google Sheets lead backend.

**Public site & funnel**
- `index.html` — main marketing landing page.
- `score/` + `score/result/` — 12-step Villa Response Readiness assessment + gated result (noindex).
- `website-check/` — free Instant Website Check tool (PageSpeed + AI Search Readiness).
- `blog/` — SEO content: index + 2 articles. `privacy/` — privacy notice.

**Sales assets (per-client, noindex)**
- `audit/gravity-bali/` — full asset: microsite `index.html`, `demo/`, `gift/`, **`deck/`**, `evidence-plan.json`.
- `audit/orivista/` — microsite `index.html`, `demo/`, `gift/`, `evidence-plan.json` (no deck).
- `demo-agent/` — **live** "Villa Demo Selena" AI responder (mock offline / real Claude when `ANTHROPIC_API_KEY` set).
- `feedback/` — compliant guest feedback + review funnel (never gates reviews).

**Backend (5 endpoints — canonical in `netlify/functions/`, thin Vercel adapters in `api/`)**
- `lead.mjs` → `POST /api/lead` — assessment scoring + lead capture.
- `demo-request.mjs` → `POST /api/demo-request` — walkthrough bookings from audit pages.
- `feedback.mjs` → `POST /api/feedback` — compliant review funnel.
- `demo-agent.mjs` → `POST /api/demo-agent` — the live demo responder.
- `site-audit.mjs` → `GET/POST /api/site-audit` — Instant Website Check (engine in `lib/site-audit.mjs`).
- `google-apps-script/Code.gs` — Sheets webhook (upsert + email; Demo Requests + Guest Feedback tabs).

**Quality:** `node --test` → **103 tests pass** across 8 files (validation,
scoring, gate, demo-request, feedback, demo-agent, site-audit, vercel-adapter).
Zero test framework — native `node:test`.

Detail: `README.md` · `IMPLEMENTATION_NOTES.md`.

---

## 4. Current status

Honest snapshot (supersedes the stale phase board in `EXECUTION_DASHBOARD.md`,
which still lists the demo/research/audits as "not started" — they are done):

| Area | Status |
|---|---|
| Strategy corpus (offer, ICP, delivery, scripts, red-team) | ✅ Complete |
| Public site + assessment funnel + free tools | ✅ Built (not yet on production domain) |
| Live demo agent (Villa Demo Selena) | ✅ Built — mock + live; needs `ANTHROPIC_API_KEY` for live |
| Gravity Bali asset (audit + demo + gift + deck) | ✅ Built |
| OriVista asset (audit + demo + gift) | ✅ Built |
| Scored pipeline / next-audit queue | ✅ Built (`PIPELINE_SHORTLIST.md`) |
| SEO foundation (llms.txt, sitemap, JSON-LD, blog) | ✅ Shipped in-repo |
| Analytics live (Plausible/GA4) | ⏳ Not configured (`site-config.js` empty) |
| Local screenshot capture (both assets) | ⏳ Operator step (`capture-evidence.mjs`, needs network) |
| Pre-send live verification | ⏳ Pending — **OriVista F1 (E3/E4) is load-bearing**; confirm before send |
| Production domain + deploy | ⏳ Not deployed (`villaops.selenasystems.com` chosen; confirm ownership) |
| Legal/local contracting path | ⏳ Open (gates signing a Bali client) |
| **Outreach** | 🔴 **Nothing sent.** Both assets are "Ready — not contacted." |

---

## 5. Pipeline (who's next)

From `docs/sales-assets/PIPELINE_SHORTLIST.md` (desktop scores; audit points are
added only after a real audit):

| # | Prospect | Villas | Decision-maker | Fit | Asset |
|---|---|---|---|---|---|
| 1 | **Gravity Bali** | ~40 | Olivier & Celine Cancé | — | ✅ Built |
| 2 | **OriVista** (ex-Azure) | 52 | Manish A. (surname unconfirmed) | 8.5 | ✅ Built |
| 3 | **Nagisa Bali** | 50+ | Lina Goh (Shimizu) | 8.5 | ⏳ Queued |
| 4 | **Hideaway Villas / Kanaan** | ~70 | K. Tjahjosarwono (COO) | — | ⏳ Queued |

Full profiles + Tier-2/3 + parked list in `PIPELINE_SHORTLIST.md`; raw research
in `docs/sales-assets/research/candidate-research-2026-07-12.json`.

---

## 6. The plan & next actions

Merged from `GTM_30DAY_PLAN.md`, `next_24_hours_plan.md`, and the per-client
`05_FIRST_CONTACT_PLAYBOOK.md` launch checklists. **P0 = blocks revenue.**

**P0 — unblock & send (do first)**
1. **Deploy** the site + both assets to the chosen domain (`docs/DEPLOY.md`); set the 4 env vars; turn on analytics in `assets/js/site-config.js`.
2. **Clear the legal/local contracting path** (entity, invoicing, IP) — gates signing any Bali client (`red_team_report.md` #6, `assumptions.md` A4).
3. **Set `ANTHROPIC_API_KEY`** to flip the demo agent from mock → live (`docs/sales-assets/DEMO_AGENT_SPEC.md` §7).
4. **Ship Gravity Bali:** run `gravity-bali/05_FIRST_CONTACT_PLAYBOOK.md` + `09_SITE_AUDIT_CHECKLIST.md` §6 pre-send check → `capture-evidence.mjs` → **send M1** (`gravity-bali/04_OUTREACH_MESSAGES.md`).
5. **Ship OriVista:** same launch checklist. **Re-verify the load-bearing rebrand-leak facts (E3: support@azurebali.com still shown; E4: both booking domains live w/ matching IDs) + Manish's surname** before send.

**P1 — this month**
6. Build the next audits from the template (Nagisa → Hideaway); target 2–4/week.
7. Run the sales motion for any reply: 15-min qualification → discovery (`sales_call_script.md`) → same-day proposal (`proposal_template.md`).
8. Publish blog cadence + submit sitemap to Search Console (`SEO_STRATEGY.md`).

**P2 — compounding**
9. Convert the first pilot into a written case study (`winning_offer.md` proof strategy).

**Tracking:** clone the deal card in `gravity-bali/05_FIRST_CONTACT_PLAYBOOK.md`
per prospect; one weekly funnel row (audits → contacted → replied → call →
proposal → won).

**30-day definition of done:** 1 signed pilot (or a live negotiation) **and** an
inbound engine with ≥4 indexed content pages.

---

## 7. Full document index (the map)

Everything in the project, reachable from here.

### Strategy & GTM (repo root)
- `winning_offer.md` — the offer spec (positioning, ICP, SLA, deliverables, pricing). **Source of truth.**
- `ICP_AND_SCORING.md` — ICP, disqualifiers, 80-pt desktop + 20-pt audit scoring rubric.
- `delivery_process.md` — 14-day delivery playbook (pre-sale → kickoff → day-by-day → acceptance; incl. the 40-scenario suite).
- `candidate_offers.md` · `backup_offers.md` · `idea_tournament.md` — the 12 candidate offers, fallbacks, and the scoring that picked O1 (Villa Ops).
- `market_research.md` · `source_log.md` — research summary + raw sources S1–S49.
- `assumptions.md` · `red_team_report.md` — assumptions log + 12 red-team attacks & fixes.
- `outreach_scripts.md` · `sales_call_script.md` · `proposal_template.md` · `landing_page_copy.md` — reusable sales collateral.
- `lead_list.csv` · `pain_signals.csv` · `market_scores.csv` — 68-company research seed data.

### Execution & status (repo root)
- **`START_HERE.md`** — this hub (the live status/plan).
- `EXECUTION_DASHBOARD.md` — original phase board *(superseded — see §4 here)*.
- `next_24_hours_plan.md` — founder's hour-by-hour launch plan *(superseded — see §6 here)*.
- `CHANGELOG_V1.md` · `IMPLEMENTATION_NOTES.md` — GTM v1.0 normalization log + site build notes.
- `final_recap.html` — one-page GTM v1.0 recap *(superseded snapshot)*.

### Product & spec (`docs/sales-assets/`)
- `GTM_30DAY_PLAN.md` — work list (P0/P1/P2) + 4-week gated calendar.
- `SEO_STRATEGY.md` — inbound "AI search readiness" strategy.
- `IMPLEMENTATION_PLAN_14D.md` — shared day-by-day delivery plan.
- `KPI_FRAMEWORK.md` — KPI definitions/targets (controllable vs not).
- `PIPELINE_SHORTLIST.md` — scored next-audit queue.
- `DEMO_AGENT_SPEC.md` — live "Villa Demo Selena" spec (mock/live, 10-of-40 acceptance).

### Per-client sales assets (`docs/sales-assets/`)
- **Gravity Bali** — `gravity-bali/00…09`: candidate shortlist, evidence register, audit, proposal, outreach, playbook + deal card, QA, gift (Weekend Rescue Kit), reviews, consolidated checklist.
- **OriVista** — `orivista/00…09`: candidate profile, evidence register, audit, proposal, outreach, playbook, QA, gift (Rebrand Rescue Kit), reviews, consolidated checklist.
- Research: `docs/sales-assets/research/candidate-research-2026-07-12.json`.

### Operations & QA (`docs/`)
- `DEPLOY.md` — deploy the private audit/demo/gift/feedback microsites.
- `MANUAL_QA.md` — E2E flows + browser matrix. `AUDIT_OPERATIONS.md` — manual live-audit protocol (hard gates).
- `CONTENT_EDITING.md` — what marketing may edit vs. LOCKED. `NEXT_SESSION_BRIEF.md` · `HIGGSFIELD_PROMPTS.md` — asset-generation briefs.

### Config & AI-facing (repo root)
- `README.md` — code/site index + Google Sheet setup + launch checklist.
- `llms.txt` — AI-assistant product summary. `sitemap.xml` · `robots.txt` · `netlify.toml` · `vercel.json` · `.env.example`.
- `legacy/` — retired v0 landing pages + old READMEs (not linked).

---

## 8. Conventions / house rules

- **Git:** develop/commit/push on `claude/villa-ops-bali-sales-vwmqdj` only.
- **Zero dependencies:** no npm installs; tests are native `node:test` (Node 18+). `npm test` / `npm run dev` (`http://127.0.0.1:8788`).
- **Dual-host:** canonical logic in `netlify/functions/*`; `api/*` are thin Vercel adapters — never duplicate logic.
- **noindex** enforced (meta + `X-Robots-Tag` in `netlify.toml`/`vercel.json` + `robots.txt`) on `/audit/*`, `/feedback/*`, `/demo-agent/*`, `/score/result/*`. No public links to these.
- **No fake success:** never show a success state unless the webhook/API confirmed the save.
- **Marketing edits** touch `assets/js/site-config.js` only (placeholders). Scoring (`assets/js/scoring.js`) is LOCKED. See `docs/CONTENT_EDITING.md`.
- **Screenshots** are captured locally (`scripts/capture-evidence.mjs`) — the build environment can't reach external sites.
