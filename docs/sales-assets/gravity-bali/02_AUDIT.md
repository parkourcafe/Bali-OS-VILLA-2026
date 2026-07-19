# Gravity Bali — passive public audit

Prepared: 2026-07-12 · **Re-run: 2026-07-13** · Auditor: Selena Systems ·
Independent public audit prepared for discussion. Not affiliated with or
endorsed by Gravity Bali.

> **Refresh note (2026-07-13).** The audit was re-run. All checklists are now
> consolidated in `09_SITE_AUDIT_CHECKLIST.md`. New public evidence softened or
> repositioned some findings — read `09` §0 first. Headlines: (1) the site/chat
> is in **12 languages** (a strength, not a gap); (2) **Xendit** payments + a
> **channel manager** exist, so Finding F1's real gap is the *manual quote
> step*, not payment capability; (3) they **already run a post-stay review
> method**, so the Reviews add-on repositions to *mid-stay + real-time +
> compliant + automated* — and their current process should be checked for
> review gating. The narrative below is preserved; `09` is the authoritative
> checklist.

**Method & limits.** Passive public audit only: official pages (via search
index — this environment blocked live page loads, see `01_EVIDENCE_REGISTER.md`),
OTA listings, social profiles, press, job boards. No forms submitted, nobody
contacted, no bookings attempted. Reply speed:
`NOT TESTED — actual response time requires an authorised mystery enquiry or
internal data.` Evidence classes per claim: E-numbers reference the register.

## A. The guest journey audited

Visitor → villa page → dates → availability check → price request → WhatsApp
or form → staff reply → follow-up → booking.

What the public artifacts show, step by step:

| Journey step | What Gravity offers today | Class |
|---|---|---|
| Villa page | Rich premium pages per villa (e.g. Villa Kelanah 5BR, Villa Simprana 4BR ~$343/night) | OBSERVED E14 |
| Dates / availability | "Check availability" → enquiry form | OBSERVED E7 |
| Price request | Form "sent directly to our marketing team", reply is a "personalized quote" | OBSERVED E7 |
| WhatsApp | Advertised booking channel + per-guest concierge; +62 813-5370-4430 on contact page | OBSERVED E5, E10 |
| Staff reply | Manual; promised "under 1 hour" for booking requests, concierge "<5 min average" | OBSERVED E3, E4 |
| Weekend coverage | "Concierge service is closed on weekends — contact your villa manager for urgent requests" vs "7 days a week" elsewhere | OBSERVED E5, E6 |
| Follow-up / recovery | No visible mechanism (no reminder, no abandoned-enquiry recovery evidence) | INFERRED E12 |
| Booking | Manual confirmation; the same villas book instantly on Airbnb/Booking.com | OBSERVED E9 |

## B. Findings (ranked)

### F1 — The best-perks channel is the slowest channel · HIGH

- **Evidence:** direct booking is promoted with the best perks (best price +
  free breakfast + welcome tray — E8), but its mechanics are a manual form
  routed to the marketing team for a personalized quote (E7), while identical
  villas confirm instantly on OTAs (E9).
- **Where:** gravitybali.com/en/reserve-your-stay/, /en/property/villa-kelanah/,
  villa-bali.com Kelanah listing. Screenshot slots: `shot-reserve-form`,
  `shot-villa-page`, `shot-ota-listing`.
- **Guest impact:** a guest comparing tabs gets instant certainty from
  Booking.com and a waiting period from the official site — the channel
  Gravity wants guests to use asks them to be the most patient.
- **Business impact:** direct share of revenue is capped by reply speed;
  every hour of quote latency is margin handed to OTA commissions.
  (Impact stated as risk, not measured — reply speed NOT TESTED, E17.)
- **Confidence:** High (three own-page sources, re-confirmed ×2).
- **Fix in 14 days:** instant acknowledgement + qualification on every direct
  enquiry, 24/7; quotes still human-crafted, but the guest is engaged within
  seconds and the enquiry is tracked to outcome.

### F2 — Published speed promises with no visible system guarding them · HIGH

- **Evidence:** "average response time under five minutes" (concierge) and
  booking requests answered "under 1 hour" published on their own pages
  (E3, E4 — two separate pages carry the <5-min claim).
- **Where:** /en/gravity-bali-guest-experience-secrets/,
  /en/bali-customer-service-key-to-rental-success/. Slots: `shot-promise-5min`,
  `shot-promise-1hour`.
- **Guest impact:** expectations are set high; any slow moment (peak season,
  staff sickness, night-time European enquiries) breaks a written promise.
- **Business impact:** the promise is a brand asset carrying unmeasured
  operational risk — nothing public suggests reply times are measured, and a
  premium brand breaking its own SLA erodes exactly the trust it sells.
- **Confidence:** High for the promises; the risk is INFERRED (process is
  internal; actual times NOT TESTED, E17).
- **Fix in 14 days:** measured first-acknowledgement time on every enquiry +
  a dashboard where the median is a number, not a hope. The promise becomes
  auditable — and safe to keep advertising.

### F3 — Coverage contradiction: "7 days a week" vs "closed on weekends" · HIGH

- **Evidence:** conciergerie page advertises a dedicated WhatsApp concierge
  "7 days a week" (E5) while estate copy also states "the concierge service is
  closed on weekends — for urgent requests, contact your villa manager" (E6).
- **Where:** /en/gravity-conciergerie/, /en/faqs-for-guests/. Slots:
  `shot-concierge-7days`, `shot-faq-weekend`.
- **Guest impact:** a Saturday enquirer doesn't know whether to expect 5
  minutes or Monday; urgent requests are redirected to a villa manager whose
  scope is the villa, not new bookings.
- **Business impact:** weekends ≈ 28% of the week. If weekend direct
  enquiries queue until Monday (INFERRED — not measured), the guests most
  ready to book (browsing on their day off) face the longest silence.
- **Confidence:** High for the contradiction (both quotes public,
  re-confirmed); weekend queueing INFERRED.
- **Fix in 14 days:** 24/7 first responder covers weekends by design;
  escalation rules route true urgencies to the on-duty human; the copy
  contradiction gets flagged for a 5-minute content fix.

### F4 — Context likely dies between website and WhatsApp · MEDIUM

- **Evidence:** villa pages and the reserve form are one path; WhatsApp is
  another (E7, E5). No wa.me deep-link mechanism carrying villa name/dates
  was detectable — though HTML could not be loaded this session (E11,
  NOT TESTED).
- **Guest impact:** a guest who switches from a villa page to WhatsApp starts
  from zero ("Hi, is the villa available?"), repeating villa, dates, party.
- **Business impact:** staff re-qualify every chat manually; enquiry source
  and villa interest go unrecorded; conversations are unsearchable later.
- **Confidence:** Medium — mechanism absence must be confirmed in the
  pre-send check (E11 is the top checklist item).
- **Fix in 14 days:** wa.me deep links on every villa page pre-filling villa +
  dates + source; the pipeline records them automatically.

### F5 — No visible unified pipeline: form, WhatsApp, IG, OTAs land in different inboxes · MEDIUM

- **Evidence:** enquiry channels observed: reserve form (E7), villa-page forms
  (E13), WhatsApp (E5/E10), Instagram DMs (@bali.gravity, E13), OTA message
  threads (E9), email (E10). No public trace of a CRM/pipeline; the form goes
  "directly to our marketing team" (a mailbox pattern). INFERRED E12.
- **Guest impact:** whether a guest gets follow-up depends on which inbox
  their message landed in and who saw it.
- **Business impact:** no follow-up cadence, no owner per lead, no source
  attribution, no funnel visibility for Olivier & Celine; "why didn't they
  book?" is unanswerable today. (All INFERRED — this is exactly what Days 1–2
  validate.)
- **Confidence:** Medium (inferred from public artifacts only).
- **Fix in 14 days:** one pipeline, every channel in, statuses + owners +
  follow-up reminders + source stamps; a weekly funnel view for the founders.

### F6 — Brand fragmentation at the edges · LOW

- **Evidence:** parallel legacy domain gravitybali.net duplicating About
  content (E16); Instagram audience ~958 followers vs a 40-villa premium
  portfolio (E13); duplicate FAQ paths (/faqs vs /en/faqs-for-guests/).
- **Impact:** minor demand leakage and split SEO; small IG limits the owned
  audience that direct-booking perks are meant to convert.
- **Confidence:** High for artifacts, impact INFERRED.
- **Fix:** outside Villa Ops OS scope — courtesy recommendations only
  (redirect .net, consolidate FAQ; IG growth is a marketing matter).

## C. WhatsApp funnel audit (publicly visible part)

| Check | Result | Class |
|---|---|---|
| Ease of finding WhatsApp | Advertised as a booking/concierge channel; number on contact page | OBSERVED |
| Destination | +62 813-5370-4430 (contact page); per-guest concierge numbers exist post-booking | OBSERVED |
| Prefilled message | Unknown — no mechanism visible | NOT TESTED (E11) |
| Villa name carried into chat | Unknown; likely lost (form-first flow) | NOT TESTED / INFERRED |
| Dates carried | Unknown; likely lost | NOT TESTED / INFERRED |
| Source carried | No mechanism visible | INFERRED |
| Guest knows what to write | No prompt/template visible | INFERRED |
| Context of chosen villa kept | At risk at channel switch | INFERRED |
| Alternative contact | Form, email, office, "online call" | OBSERVED |
| Reply-time expectation | Set VERY high by their own pages (<5 min concierge; <1 h booking) | OBSERVED |
| Continue-to-booking convenience | Manual quote → manual confirmation | OBSERVED |
| Actual response time | `NOT TESTED — actual response time requires an authorised mystery enquiry or internal data.` | NOT TESTED |

## D. Loss map — where direct enquiries can leak

Website / Instagram visitor
→ **[L1]** picks OTA tab because direct = "wait for a quote" (F1)
→ **[L2]** weekend/after-hours enquiry meets closed concierge (F3)
→ **[L3]** switches to WhatsApp, loses villa/date context, must retype (F4)
→ **[L4]** message lands in one of ≥5 inboxes (form-mail, WA, IG, OTA, email) (F5)
→ **[L5]** staff re-qualify manually; promised <1 h clock is already running (F2)
→ **[L6]** no pipeline record → no owner, no follow-up, no reminder (F5)
→ **[L7]** guest goes quiet; nobody re-engages ("abandoned enquiry") (F5)
→ **[L8]** outcome + source never reach the founders — funnel is invisible (F5)

Volumes at each L-point are unknown without internal data — the map shows
*where* leaks are structurally possible, not *how many* occur.

## E. Business case — three transparent scenarios

Every input is ASSUMPTION or SCENARIO; none are Gravity's real numbers. The
model sizes the question; Days 1–2 replace it with actuals from their inboxes.

Anchors: 40 villas (OBSERVED E1), $343–486/night observed rates (E14).

- Average booking value (ABV): **$1,800** (≈4 nights × ~$450 blended) — ASSUMPTION
- Direct enquiries/month (form + WA + IG DM): **80 / 160 / 280** — ASSUMPTION
  (≈2–7 per villa per month; no public data)
- Enquiries currently lost or never worked (weekend silence, context loss,
  no follow-up): **10% / 15% / 20%** — SCENARIO
- Recovered by instant acknowledgement + tracked follow-up: **⅓ of lost** — SCENARIO
- Direct enquiry→booking conversion: **12% / 15% / 18%** — ASSUMPTION
  (high-intent premium enquiries)

| | Conservative | Base | Upper |
|---|---|---|---|
| Enquiries / month | 80 | 160 | 280 |
| Lost / unworked | 8 (10%) | 24 (15%) | 56 (20%) |
| Recovered (⅓) | 2.7 | 8 | 18.7 |
| Extra bookings | 0.3 (12%) | 1.2 (15%) | 3.4 (18%) |
| Extra revenue / month | ~$580 | ~$2,160 | ~$6,050 |
| Payback on $7,500 | ~13 mo | ~3.5 mo | ~1.2 mo |

TARGET framing, not a guarantee: results depend on availability, pricing,
season, property quality and staff — see `../KPI_FRAMEWORK.md` for the
controllable vs non-controllable split. The honest headline: **at the base
scenario, one-plus recovered premium booking per month pays the project back
inside a season** (SCENARIO). Unquantified extras: keeping the published <5-min
promise true 24/7 (brand protection), and founders finally seeing the funnel.

## F. Before / after

**Now (observed + inferred):**
Website villa page → "Check availability" form → marketing-team mailbox →
manual personalized quote (Mon–Fri fastest) → WhatsApp thread without villa
context → untracked conversation → unknown outcome.

**With Villa Ops OS (proposed):**
Website or Instagram → tracked enquiry with villa/dates/source attached →
immediate acknowledgement (24/7, weekends) → qualification (dates, party,
budget, requests) → human handoff to the concierge/marketing team → unified
pipeline with owner + status → automatic follow-up on quiet threads →
booking outcome recorded → weekly funnel analytics for the founders.

| Dimension | Today (observed/inferred) | With Villa Ops OS (TARGET) |
|---|---|---|
| First acknowledgement | Manual; promised <1 h; weekends uncertain | < 60 s, 24/7 incl. weekends |
| Context (villa/dates/source) | Re-asked in chat | Carried automatically |
| Qualification | Manual, unstructured | Structured before handoff |
| Handoff | Whoever sees the inbox | Named owner, instant notify |
| Follow-up | Memory-dependent | Scheduled + reminded |
| Funnel visibility | None visible | Dashboard: volumes, speed, sources, outcomes |
| Reporting to founders | Ad-hoc | Weekly KPI snapshot |

Concept mockups of the "after" state (WhatsApp dialog, lead card, staff
notification, dashboard) are labelled CONCEPT in the microsite and deck —
they illustrate the design, they are not screenshots of a live system.
