# OriVista — consolidated site audit + all checklists

Prepared: 2026-07-12 · consolidates the checklist detail behind the narrative in
`02_AUDIT.md`. Independent public audit prepared for discussion. Not affiliated
with or endorsed by OriVista or Azure Bali.

**Method & limits.** Passive public audit only. This environment blocked live
page loads — orivista.com, book.orivista.com, azurebali.com, book.azurebali.com
and every OTA page returned **HTTP 403** to every fetcher. All site facts are
**OBSERVED via search index** of the public pages/titles and third-party
sources, most confirmed with 2+ query phrasings. Items needing a live page load
(exact wa.me href, booking-engine vendor, load speed, mobile rendering) are
**NOT TESTED** and sit in the pre-send checklist. No forms submitted, nobody
contacted, no bookings attempted. Reply speed:
`NOT TESTED — actual response time requires an authorised mystery enquiry or internal data.`

Classes: **VERIFIED** (live page load — none possible this session) ·
**OBSERVED** (public source via search index) · **INFERRED** · **NOT TESTED**.

---

## 0. Positioning guardrail (read first)

OriVista **already runs a hosted booking engine** and their own copy touts **"AI
automation"** (E18, E19). Every checklist item below is framed accordingly:
we identify *pre-booking enquiry* and *brand-unification* gaps that sit **around**
their stack. Do **not** record or pitch "no booking system" — it's false here.

---

## 1. Site audit checklist — full guest path

Guest path audited: OTA/villa page (often "by Azure") → villa page → dates →
enquiry (WhatsApp/form/old email/old domain) → staff reply → handoff to engine →
booking.

| # | Item | Result | Class | Evidence / note |
|---|---|---|---|---|
| 1 | First screen (hero) | Present; "luxury private-pool villas" positioning | OBSERVED | homepage; above-the-fold NOT TESTED |
| 2 | Value proposition | Direct-booking perks (best rate, beach-club, concierge); "30%+ direct" claim | OBSERVED | E18 |
| 3 | Mobile quality | Unknown | NOT TESTED | live device check (pre-send) |
| 4 | Navigation | Rich (villas, property management, blog, contact) | OBSERVED | indexed pages |
| 5 | Direct-booking prominence | Actively promoted vs OTA | OBSERVED | E18 |
| 6 | CTA / enquiry | WhatsApp ("within 30 min") + contact; villa-page mechanism unknown | OBSERVED / NOT TESTED | E6, E11 |
| 7 | Price availability | Rates on villa/OTA pages (~$344 4BR Kenza); booking via engine | OBSERVED | E14 |
| 8 | Live availability / engine | **Hosted booking engine present** (book.orivista.com /search + /listings/{id}) | OBSERVED | E9 — they HAVE an engine |
| 9 | Booking-engine vendor | Most consistent with **Hostaway** (ID pattern; same ID on both domains) | INFERRED | E9 — confirm via page source |
| 10 | **Brand consistency at contact** | **support@azurebali.com still shown; book.azurebali.com live; "by Azure" OTAs** | OBSERVED | **E3, E4, E5 — Finding F1 (headline)** |
| 11 | Load speed | Unknown | NOT TESTED | /website-check/ or Lighthouse live |
| 12 | Trust elements | 52 villas; owner dashboard; guest ratings 4.85–5.00 claimed; trade-show presence | OBSERVED | E1, E14, E21 |
| 13 | Reviews on site | Per-villa OTA reviews; **no consolidated OriVista Google profile** | OBSERVED (absence) | E20 — Finding F5 |
| 14 | Coverage / hours | **Office hours Mon–Fri 9–5 / Sat–Sun 9–2** for an 8+-OTA base | OBSERVED | E7, E8 — Finding F3 |
| 15 | Published SLA | **WhatsApp "within 30 minutes"** | OBSERVED | E6 — Finding F2 |
| 16 | Contacts | +62 8113 8036 00 · info@orivista.com · **support@azurebali.com** · Jl Raya Padonan | OBSERVED | E10, E3 |
| 17 | WhatsApp mechanism | Advertised guest channel; wa.me href / prefill unknown | OBSERVED / NOT TESTED | E11 — Finding F4 |
| 18 | Forms | Enquiry mechanism on villa pages unknown (HTML 403) | NOT TESTED | E11 |
| 19 | Languages | Not determinable from index | NOT TESTED | check live |
| 20 | Payment methods | Via booking engine; provider not confirmed | INFERRED | confirm on walkthrough |
| 21 | Source tracking | No visible per-channel/brand enquiry attribution | INFERRED | E12 — Finding F4/F1 |
| 22 | Abandoned-enquiry recovery | No visible pre-booking follow-up mechanism | INFERRED | E12 |
| 23 | Re-contact / follow-up | Not visible pre-booking | INFERRED | E12 |
| 24 | Own "AI automation" claim | Referenced in own materials | OBSERVED | E19 — shapes objection-handling |

## 2. WhatsApp funnel checklist — publicly visible part

| Check | Result | Class |
|---|---|---|
| Ease of finding WhatsApp | Advertised as guest channel | OBSERVED E6 |
| Destination number | +62 8113 8036 00 | OBSERVED E10 |
| Prefilled message | Unknown — no mechanism visible | NOT TESTED E11 |
| Villa/dates carried into chat | Likely lost (separate systems) | NOT TESTED / INFERRED |
| Source/brand carried | No mechanism; brand ambiguous (Azure vs OriVista) | INFERRED |
| Reply-time expectation set | "within 30 minutes" | OBSERVED E6 |
| Coverage | Office hours only (Mon–Fri 9–5 / Sat–Sun 9–2) | OBSERVED E7 |
| Continue-to-booking | Hosted engine (Hostaway inferred) | OBSERVED/INFERRED E9 |
| Actual response time | `NOT TESTED — requires an authorised mystery enquiry or internal data.` | NOT TESTED E17 |

## 3. Booking-flow analysis

OTA/villa page (often "by Azure") → enquiry (WhatsApp / old email / old domain)
→ office-hours manual reply → WhatsApp thread without villa context → handoff
into the hosted booking engine → confirmed. The engine to *complete* a booking
**exists**; the leverage points are (a) the **rebrand leak** before the guest
ever reaches it, (b) the **unmeasured, office-hours-bound first response**, and
(c) the **uncaptured pre-booking enquiry**.

## 4. Loss map — where direct enquiries can leak

OTA/website visitor (often on a "by Azure" listing)
→ **L1** unsure "Azure" and "OriVista" are the same business (F1)
→ **L2** emails support@azurebali.com / books on book.azurebali.com — old brand keeps it (F1)
→ **L3** night/weekend enquiry meets the office-hours gap; 30-min promise at risk (F2, F3)
→ **L4** switches to WhatsApp, loses villa/date context (F4)
→ **L5** enquiry not captured/qualified before the engine (F4)
→ **L6** no pre-booking follow-up on quiet threads (F4/F5)
→ **L7** review lands on the old Azure name / a single OTA (F5)

Volumes unknown without internal data — the map shows *where* leaks are
structurally possible, not *how many* occur.

## 5. Findings (summary — full narrative in `02_AUDIT.md`)

- **F1 — Rebrand splits the funnel across two brands (HIGH, headline).**
  support@azurebali.com shown; book.azurebali.com live with matching IDs;
  "by Azure" OTAs. [OBSERVED] — **re-verify E3/E4 before send.**
- **F2 — "Within 30 minutes" WhatsApp SLA, no visible meter (HIGH).** [OBSERVED;
  actual speed NOT TESTED]
- **F3 — Office-hours coverage gap for an international base (MEDIUM).** [OBSERVED]
- **F4 — Marketing site and booking engine are separate systems (MEDIUM).**
  wa.me behaviour NOT TESTED. [INFERRED/NOT TESTED]
- **F5 — Review equity scattered across old brand + OTAs (LOW).** [INFERRED/OBSERVED]

Financial scenarios: see `02_AUDIT.md` §E (assumptions only; payback on $8,500).

## 6. PRE-SEND verification checklist (operator, ~12 min, live browser)

Do this before sending anything. Screenshot as you go (doubles as evidence
capture for the slots). If a load-bearing fact changed, update the microsite,
demo scenario 1 and `02_AUDIT.md` first — accuracy is the asset.

- [ ] **E3 (load-bearing):** orivista.com contact — is **support@azurebali.com**
      still shown? If replaced, soften/remove Finding F1.
- [ ] **E4 (load-bearing):** do **book.azurebali.com/listings/97447** AND
      **book.orivista.com/listings/97447** both resolve to Villa Kenza? Same ID?
- [ ] `orivista.com` — capture the **"within 30 minutes"** WhatsApp copy; record
      the exact URL (F2).
- [ ] `orivista.com` — capture **office hours** Mon–Fri 9–5 / Sat–Sun 9–2 (F3).
- [ ] An OTA listing (e.g. Booking.com Villa Kenza) — still **"by Azure"**? (F1/E5)
- [ ] A villa page (e.g. book.orivista.com/listings/148160 Villa Alba) — **record
      the WhatsApp link `href`** and whether villa/dates prefill (settles F4/E11).
- [ ] Booking-engine **vendor** via page source (confirm/deny Hostaway, E9).
- [ ] Search Google Maps for **"OriVista"** from a clean session — is there a
      consolidated Business profile yet? (F5/E20)
- [ ] **Confirm the founder's surname** before addressing him by it (E13b).
- [ ] Confirm the **+62 8113 8036 00** line is WhatsApp-capable before the gift
      button ships (E10/E11).
- [ ] Run `/website-check/` (or Lighthouse) for **load speed + mobile** (items 3, 11).
- [ ] Capture the 9 screenshots: `node scripts/capture-evidence.mjs audit/orivista/evidence-plan.json`

## 7. Evidence / QA checklist (asset itself)

- [x] Every audit claim classified OBSERVED / INFERRED / NOT TESTED with a source
- [x] Load-bearing facts (rebrand leak) double-confirmed via independent queries
- [x] **No person named as owner without public confirmation** — founder shown as
      "Manish A." (LinkedIn headline); surname flagged UNCONFIRMED (E13b)
- [x] Positioning guardrail applied: augments the existing engine, never "you have none"
- [x] Actual reply speed marked NOT TESTED, never claimed as delay
- [x] noindex on microsite/demo/gift (meta + X-Robots-Tag + robots.txt); no public links
- [x] Demo form + feedback form: no success shown unless the webhook saved
- [ ] Real screenshots captured locally (operator step)
- [ ] Live-only items verified (pre-send checklist §6) — esp. E3/E4 before send

## 8. Full deliverables index

See `06_QA_REPORT.md` §"Deliverables index".
