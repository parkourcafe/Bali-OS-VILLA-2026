# OriVista (formerly Azure Bali) — passive public audit

Prepared: 2026-07-12 · Auditor: Selena Systems · Independent public audit
prepared for discussion. Not affiliated with or endorsed by OriVista or Azure
Bali.

**Method & limits.** Passive public audit only: official pages (via search
index — this environment blocked live page loads, see `01_EVIDENCE_REGISTER.md`),
the legacy azurebali.com domain, OTA listings, social profiles, the rebrand
announcement, press, job boards. No forms submitted, nobody contacted, no
bookings attempted. Reply speed:
`NOT TESTED — actual response time requires an authorised mystery enquiry or
internal data.` Evidence classes per claim: E-numbers reference the register.

**Positioning note (critical).** OriVista already runs a hosted booking engine
and their own copy references "AI automation" (E18, E19). This audit therefore
does **not** claim they lack a system. It identifies the *pre-booking* enquiry
and *brand-unification* gaps that sit around their existing stack — all
publicly visible, all in scope for a 14-day engagement.

## A. The guest journey audited

Visitor (often via an OTA still named "by Azure") → villa page → dates →
enquiry (WhatsApp / form / old email / old domain) → staff reply → handoff into
the booking engine → booking.

| Journey step | What OriVista offers today | Class |
|---|---|---|
| Discovery | 52 villas across 8+ OTAs — many listings still "…by Azure" | OBSERVED E5, E8 |
| Villa page | Rich pages on orivista.com + book.orivista.com booking engine | OBSERVED E9 |
| Brand at contact | support@azurebali.com still shown; book.azurebali.com still live (same IDs) | OBSERVED E3, E4 |
| Enquiry / WhatsApp | "ask on WhatsApp, response within 30 minutes"; preferred channel confirmed on arrival | OBSERVED E6 |
| Coverage | Office hours Mon–Fri 9–5 / Sat–Sun 9–2 for an international OTA base | OBSERVED E7, E8 |
| Context transfer | No visible mechanism carrying villa/dates into WhatsApp | INFERRED / NOT TESTED E11 |
| Follow-up / recovery | No visible pre-booking follow-up mechanism | INFERRED E12 |
| Booking | Hosted engine (Hostaway inferred); direct perks vs OTA | OBSERVED E9, E18 |

## B. Findings (ranked)

### F1 — The Azure → OriVista rebrand still splits the funnel across two brands · HIGH (headline)

- **Evidence:** support@azurebali.com still appears as a public contact
  alongside OriVista details (E3); book.azurebali.com listing pages are live
  and indexed in parallel with book.orivista.com, **with identical listing
  IDs** (Villa Kenza 97447 on both — E4); OTA listings still carry the old name
  ("Villa Kenza Canggu by Azure"; "Villa Casa Gypsy By Azure" — E5); legacy
  Facebook `azureintbali` (E15).
- **Where:** book.azurebali.com/listings/97447 vs book.orivista.com/listings/97447;
  booking.com/hotel/id/villa-kenza-canggu-by-azure.html; azurebali.com/orivista/.
  Screenshot slots: `shot-azure-booking`, `shot-orivista-booking`,
  `shot-ota-by-azure`, `shot-support-email`, `shot-rebrand-page`.
- **Guest impact:** a guest arriving via an "Azure" OTA page, emailing the old
  address, or booking on the old domain isn't sure they're dealing with
  OriVista — trust wobbles at the point of purchase.
- **Business impact:** direct-booking traffic, SEO authority and review equity
  are split across two brand domains instead of compounding under one.
  (INFERRED — magnitude needs their analytics.)
- **Confidence:** High for the artifacts (parallel domains, matching IDs, old
  email — each indexed); split-traffic magnitude INFERRED.
- **Fix in 14 days:** one unified enquiry front door capturing every legacy
  path (Azure email, old domain, "by Azure" OTA click) under OriVista, plus a
  301-redirect map and OTA-name cleanup list. The PMS is untouched.
- **Load-bearing caveat:** E3 and E4 MUST be re-verified before send — if the
  rebrand has since been finished, this finding softens or drops.

### F2 — Published "within 30 minutes" WhatsApp SLA with no visible meter · HIGH

- **Evidence:** site copy tells guests they can ask on WhatsApp and get a reply
  "within 30 minutes" (E6). A concrete public promise dependent on human
  staffing.
- **Where:** indexed orivista.com content (record exact URL on capture). Slot:
  `shot-30min-sla`.
- **Guest impact:** expectations set at 30 minutes; any slow moment (peak
  season, 2am enquiry from Europe/US) breaks a written promise.
- **Business impact:** a premium brand carrying an unmeasured SLA; nothing
  public suggests the 30-minute time is tracked. Actual times NOT TESTED (E17)
  — we make no claim they are slow.
- **Confidence:** High for the promise; risk INFERRED.
- **Fix in 14 days:** always-on first responder acknowledges every enquiry in
  seconds and logs first-response time — the promise becomes a measured,
  advertisable dashboard number, 24/7.

### F3 — Office-hours coverage gap for an international guest base · MEDIUM

- **Evidence:** published office hours Mon–Fri 9–5 / Sat–Sun 9–2 WITA (E7) vs
  an 8+-OTA international guest base spanning many time zones (E8).
- **Where:** indexed orivista.com content; OTA listings. Slot: `shot-office-hours`.
- **Guest impact:** a Sunday-evening or weekday-midnight enquirer meets the gap
  between "reply within 30 minutes" and "open at 9am tomorrow."
- **Business impact:** off-hours direct enquiries may wait (INFERRED — not
  measured) while the OTAs that referred them confirm instantly and take
  commission.
- **Confidence:** High for the hours; queueing INFERRED.
- **Fix in 14 days:** 24/7 responder covers nights/weekends by design;
  escalation rules wake a human only for true urgencies.

### F4 — Marketing site and booking engine are separate systems · MEDIUM

- **Evidence:** orivista.com (marketing) and book.orivista.com (hosted engine,
  Hostaway inferred from /search + /listings/{id} — E9) appear separate; no
  visible mechanism carries villa/dates/source into a WhatsApp chat (E11,
  NOT TESTED — HTML unreachable).
- **Guest impact:** a guest switching to WhatsApp starts from "Hi, is the villa
  available?", repeating villa, dates, party.
- **Business impact:** staff re-qualify every chat; the enquiry's source and
  villa interest aren't captured before the engine sees it.
- **Confidence:** Medium — mechanism absence must be confirmed in the pre-send
  check (E11 is a top checklist item).
- **Fix in 14 days:** wa.me deep links on every villa page (both domains during
  transition) pre-filling villa + dates + source; the pipeline captures the
  lead before handoff into the existing engine.

### F5 — Review equity scattered across the old brand and OTAs · LOW

- **Evidence:** no consolidated Google Business profile under "OriVista"
  surfaced — only a Waze/Places pin "OriVista (Azure Bali)" (E20); guest
  ratings live per-villa on OTA pages, many still "by Azure" (E5).
- **Guest impact:** a searching guest sees fragments (old brand + a dozen
  listings) instead of one confident, high-rated OriVista.
- **Business impact:** new reviews keep landing on the old name; social proof
  doesn't compound under the new brand.
- **Confidence:** Medium (absence of a consolidated profile inferred from
  search; per-villa OTA reviews observed).
- **Fix in 14 days:** a compliant mid-stay + post-stay review flow (see
  `08_REVIEW_SYSTEM.md`) that catches issues during the stay and routes happy
  guests to one OriVista Google profile — consolidating reputation as the
  rebrand completes.

## C. WhatsApp funnel audit (publicly visible part)

| Check | Result | Class |
|---|---|---|
| Ease of finding WhatsApp | Advertised as a guest channel; number in public contact | OBSERVED E6, E10 |
| Destination | +62 8113 8036 00 (public contact) | OBSERVED E10 |
| Prefilled message | Unknown — no mechanism visible | NOT TESTED (E11) |
| Villa/dates carried into chat | Unknown; likely lost (separate systems) | NOT TESTED / INFERRED |
| Source/brand carried | No mechanism visible; brand ambiguous (Azure vs OriVista) | INFERRED |
| Reply-time expectation | Set at "within 30 minutes" by their own copy | OBSERVED E6 |
| Coverage | Office hours only (Mon–Fri 9–5 / Sat–Sun 9–2) | OBSERVED E7 |
| Actual response time | `NOT TESTED — requires an authorised mystery enquiry or internal data.` | NOT TESTED |

## D. Loss map — where direct enquiries can leak

OTA / website visitor (often on a "by Azure" listing)
→ **[L1]** unsure whether "Azure" and "OriVista" are the same business (F1)
→ **[L2]** emails support@azurebali.com or books on book.azurebali.com — old brand keeps the traffic (F1)
→ **[L3]** night/weekend enquiry meets the office-hours gap; 30-min promise at risk (F2, F3)
→ **[L4]** switches to WhatsApp, loses villa/date context, must retype (F4)
→ **[L5]** enquiry not captured/qualified before the booking engine sees it (F4)
→ **[L6]** no pre-booking follow-up on quiet threads (F4/F5)
→ **[L7]** review lands on the old Azure name / a single OTA, not one OriVista profile (F5)

Volumes at each L-point are unknown without internal data — the map shows
*where* leaks are structurally possible, not *how many* occur.

## E. Business case — three transparent scenarios

Every input is ASSUMPTION or SCENARIO; none are OriVista's real numbers. The
model sizes the question; Days 1–2 replace it with actuals from the PMS/inboxes.

Anchors: 52 villas (OBSERVED E1), 4BR Villa Kenza ≈ $344/night (E14).

- Average booking value (ABV): **$1,700** (≈4–5 nights × blended rate) — ASSUMPTION
- Direct enquiries/month (WhatsApp + form + IG DM, both brand domains):
  **100 / 200 / 350** — ASSUMPTION (≈2–7 per villa/month; no public data)
- Enquiries lost or never worked (brand confusion, off-hours silence, context
  loss, no follow-up): **10% / 15% / 20%** — SCENARIO
- Recovered by unification + instant ack + tracked follow-up: **⅓ of lost** — SCENARIO
- Direct enquiry→booking conversion: **12% / 15% / 18%** — ASSUMPTION

| | Conservative | Base | Upper |
|---|---|---|---|
| Enquiries / month | 100 | 200 | 350 |
| Lost / unworked | 10 (10%) | 30 (15%) | 70 (20%) |
| Recovered (⅓) | 3.3 | 10 | 23.3 |
| Extra bookings | 0.4 (12%) | 1.5 (15%) | 4.2 (18%) |
| Extra revenue / month | ~$680 | ~$2,550 | ~$7,140 |
| Payback on $8,500 | ~12–13 mo | ~3.5 mo | ~5–6 wk |

TARGET framing, not a guarantee: results depend on availability, pricing,
season, property quality and staff — see `../KPI_FRAMEWORK.md`. Honest
headline: **at the base scenario, ~1.5 recovered premium bookings per month
pays the project back inside a season** (SCENARIO). Unquantified extras:
direct bookings currently leaking to the old Azure domain/OTAs, keeping the
30-minute promise true 24/7, and finally seeing the pre-booking funnel next to
the PMS numbers.

## F. Before / after

**Now (observed + inferred):**
OTA/villa page (often "by Azure") → enquiry via old email / old domain /
WhatsApp → office-hours-only manual reply → WhatsApp thread without villa
context → uncaptured handoff into the booking engine → review lands on the old
brand.

**With Villa Ops OS (proposed, around the existing PMS):**
Any entry (both brands) → tracked enquiry unified under OriVista with
villa/dates/source → immediate acknowledgement (24/7) → qualification →
human handoff to the team → qualified, source-stamped lead into their existing
engine → follow-up on quiet threads → outcome + first-response-time analytics →
reviews consolidated under one OriVista profile.

| Dimension | Today (observed/inferred) | With Villa Ops OS (TARGET) |
|---|---|---|
| Brand at first contact | Azure email/domain/OTAs still live | Every path answered as OriVista |
| First acknowledgement | Manual; promised <30 min; office hours only | < 60 s, 24/7 incl. nights & weekends |
| Context (villa/dates/source) | Re-asked in chat | Carried automatically |
| Qualification | Manual, unstructured | Structured before handoff & before the engine |
| Booking engine | Fed raw, uncaptured enquiries | Unchanged — fed qualified, source-stamped leads |
| SLA visibility | 30-min promise unmeasured | Median first-response time on a dashboard |
| Reviews | Scattered (old brand + OTAs) | Consolidated under one OriVista profile |

Concept mockups of the "after" state (WhatsApp dialog, lead card, staff
notification, dashboard) are labelled CONCEPT in the microsite — they
illustrate the design, they are not screenshots of a live system.
