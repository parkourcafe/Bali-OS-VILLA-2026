# Villa Ops OS — scored pipeline & next-audit queue

Built 2026-07-19 from `docs/sales-assets/research/candidate-research-2026-07-12.json`
(8 deep profiles + 12 discovery) scored against the 80-point desktop rubric in
`ICP_AND_SCORING.md`. This is the "who do we audit next" order for the
`GTM_30DAY_PLAN.md` Week-2 pipeline build.

**Honesty rule (from the rubric):** these are **desktop scores only**, estimated
from public evidence — no company can exceed 90 without real audit evidence, and
only Gravity Bali has an audit. Treat every number as an estimate to confirm,
not a fact. Discovery candidates without a deep profile are marked "profile
first" — they need a passive research pass (network) before scoring.

## Desktop scores (max 80)

Dims: Portfolio /15 · Premium /10 · Direct channels /10 · Ops complexity /10 ·
Reservations team /10 · Active signals /5 · Decision-maker access /10 · Tech gap /10.

| Rank | Company | Villas | Port | Prem | Chan | Ops | Team | Sig | DM | Gap | **Total** | Tier |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| — | **Gravity Bali** (in flight) | ~40 | 15 | 10 | 9 | 8 | 8 | 5 | 10 | 8 | **73** + audit | Active |
| 1 | **OriVista** (ex-Azure) | 52 | 15 | 8 | 9 | 8 | 7 | 5 | 8 | 7 | **67** | 1 |
| 2 | **Nagisa Bali** | 50+ | 15 | 8 | 8 | 9 | 8 | 5 | 10 | 8 | **71*** | 1 |
| 3 | **Hideaway Villas / Kanaan** | ~70 | 13 | 8 | 7 | 9 | 8 | 4 | 9 | 8 | **66** | 1 |
| 4 | **The Bali Agent** | 90+ | 13 | 8 | 8 | 9 | 7 | 4 | 4 | 9 | **62** | 2 |
| 5 | **Cabo Bali** | 6–20+ | 11 | 9 | 9 | 6 | 8 | 5 | 9 | 5 | **62** | 2 |
| 6 | **Bali Management Villas** | 150–200 | 12 | 7 | 6 | 9 | 8 | 4 | 8 | 6 | **60** | 3 |
| — | **Bukit Vista** | 180 | 12 | 6 | 6 | 9 | 8 | 5 | 9 | 1 | **56** | Park (DQ) |

*Nagisa scores high on the rubric, but ~half its visible pain (reseller
interception, satellite-domain SEO) is **outside** Villa Ops OS's 14-day scope —
see the watch-out below. Adjusted priority puts OriVista slightly ahead as a
cleaner scope match.

## Next-audit queue (Tier 1 — do these first)

**1. OriVista** (orivista.com) — 52 private-pool villas.
- DM: Manish A., Founder (public LinkedIn; confirm surname before outreach).
- Pain hook: published "reply within 30 minutes" WhatsApp SLA + office hours
  Mon–Fri 9–5 / weekends 9–2 → after-hours gap for international enquirers;
  post-rebrand dual-brand leak (legacy Azure emails/booking domains still live).
- Watch-out: data-savvy, hypergrowth founder (0→52 in 2 yrs) may lean DIY; they
  already run a booking-engine subdomain, so pitch the **pre-booking WhatsApp
  enquiry + follow-up layer**, not the engine.

**2. Nagisa Bali** (nagisa-bali.com) — 50+ villas, est. 2006.
- DM: Lina Goh (Shimizu), Founder & CEO — very public (press ×3).
- Pain hook: reseller `guestreservations.com` intercepts brand-name booking
  searches; no visible wa.me entry; enquiries scattered across 5+ domains / 4+
  IG / 4+ phone numbers; "fast respon reservation team" promise with nothing
  visible behind it.
- Watch-out: reseller/SEO fixes are **out of scope** — sell the enquiry
  capture/pipeline/follow-up layer; 20-year corporate structure = slower close.

**3. Hideaway Villas Bali** (hideawayvillasbali.com) — ~70 units / 3 properties.
- DM: Kristian Kuntadi Tjahjosarwono, COO (Kanaan Holding) + a second named exec.
- Pain hook: a guest review reports the listed number "wasn't WhatsApp-compatible";
  contacts fragmented across ≥3 pages (per-property emails/numbers); audience
  split across 4 IG accounts; OTA-heavy (~2,000 Agoda reviews) vs a "book direct
  best rate" claim. Highest research confidence of the set (8/10).
- Watch-out: hotel-style multi-property brand with a corporate parent — expect a
  slightly more formal buying process than a founder-led boutique.

## Tier 2 — strong, but resolve a caveat first

**4. The Bali Agent** — 90+ villas, great pain (phone support only 09:00–17:00;
2-day booking-hold expiry). **Blocker: decision maker not publicly confirmed**
(only a 2015 forum mention of "Benjamin Moureau"). Confirm a real, reachable DM
before spending an audit on it.

**5. Cabo Bali** — excellent fit and a named founder (Keanu Fischell), but they
already run **Guesty** (PMS + hosted booking engines) and the ex-Google-growth
founder is DIY-inclined. Approach only as the enquiry-capture/follow-up layer
Guesty doesn't cover; lower priority than Tier 1.

## Tier 3 / pilot & profile-first

- **Solar Property Bali** — only ~16 villas → **Pilot economics** ($1.5–2.5k),
  but the founder (Yuriy Solar) is publicly named. Good low-friction target to
  land the **first proof/case study** fast.
- **Profile-first (need a passive research pass before scoring):** Short Stay
  Bali (70+ villas, ~90 staff, aggressive anti-OTA book-direct — looks Tier 1
  once confirmed), House of Reservations (200+; "the brand is reservations"),
  Villa Bali Management (150–160; 24/7 concierge), Ini Vie (premium, award-
  winning), BaliSuperHost (569 villas + a **live reservation-agent job ad** =
  manual-pain signal, but enterprise scale).

## Parked / excluded

- **Bukit Vista** — builds its own AI stack (GAIA/RAIA); "already has a mature
  AI system" is an explicit disqualifier. Park.
- **Bali Management Villas** — 150–200 villas, in-house web dev (build-vs-buy),
  OTA-centric, inconsistent public claims → corporate/slow. Low priority.
- **Bali Villa Escapes** — 925 villas, Australian entity → enterprise/out-of-profile.
- **Aesthetic clinics & Dubai brokerages** (in `lead_list.csv`) — backup
  segments O2/O3/O4 in `candidate_offers.md`, not this sprint.

## Immediate next actions (Week 2)

1. Build the 3 Tier-1 audits (OriVista → Nagisa → Hideaway) from the Gravity
   `audit/<slug>/` template + `capture-evidence.mjs`.
2. Confirm The Bali Agent's decision maker; if found, promote to Tier 1.
3. Do the profile-first passive research pass (Short Stay Bali first — likely
   Tier 1).
4. Keep Solar Property Bali as the fast-pilot fallback for first proof.

All scores here are pre-audit desktop estimates — the audit adds the 20-point
audit score and only then can a prospect legitimately clear 90.
