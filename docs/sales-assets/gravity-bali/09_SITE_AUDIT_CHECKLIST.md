# Gravity Bali — consolidated site audit + all checklists (re-run)

Re-run: 2026-07-13 · supersedes the checklist scattering in `02_AUDIT.md`
(which stays as the narrative version). Independent public audit prepared for
discussion. Not affiliated with or endorsed by Gravity Bali.

**Method & limits (unchanged).** Passive public audit only. This environment
blocks live page loads (proxy returns 403 for every external host — re-tested
2026-07-13), so all site facts are **OBSERVED via search index** of the public
pages, most confirmed with 2+ query phrasings. Items needing a live page load
(exact wa.me href, form fields, load speed, mobile rendering) are **NOT
TESTED** and sit in the pre-send checklist below. No forms submitted, nobody
contacted, no bookings attempted. Reply speed:
`NOT TESTED — actual response time requires an authorised mystery enquiry or internal data.`

Classes: **VERIFIED** (live page load — none possible this session) ·
**OBSERVED** (public source via search index) · **INFERRED** · **NOT TESTED**.

---

## 0. What the re-run CHANGED vs the first audit (honesty log)

New public evidence surfaced on re-run. Where it softens a prior finding, that
is stated plainly:

| # | New fact | Effect on the audit |
|---|---|---|
| N1 | Site + chat offered in **12 languages** ("seamless multilingual journey") [OBSERVED] | Prior "languages" item was unchecked → now **covered/strength**. Strengthens the "multilingual instant response" fit; do NOT pitch languages as a gap. |
| N2 | **Xendit** payment provider + a **channel manager** (rental agreements signed online through it) [OBSERVED] | Softens Finding 1: they CAN take direct payment and sign contracts online — the gap is specifically the **manual quote/first-response step**, not payment capability. Finding 1 re-worded accordingly. |
| N3 | They **already run a review method**: post-stay structured feedback form, concerns flagged & followed up by the team; plus proactive pre-arrival engagement [OBSERVED] | Repositions the Reviews add-on: our value is **mid-stay (before checkout) + real-time recovery alerts + WhatsApp automation + compliance safety**, NOT "you have nothing." Also raises a **compliance question to verify**: does their current "flag concerns / follow up directly" route unhappy guests away from public review? If so, that is review gating — worth checking. |
| N4 | Homepage value proposition is **owner-facing** ("premium villa management… maximize your property's return"); the guest-facing UVP is thinner on the home page [OBSERVED] | Minor new finding F7 (below). |
| N5 | Trust signals: **4.9/5 Airbnb** case-study villa, loyalty-building content, "any issue handled with professionalism" [OBSERVED] | Reinforces: frame everything as protecting an already-good brand, never as fixing failure. |

---

## 1. Site audit checklist (TZ §5) — full guest path

Guest path audited: visitor → villa page → dates → availability → price
request → WhatsApp/form → staff reply → follow-up → booking.

| # | Item | Result | Class | Evidence / note |
|---|---|---|---|---|
| 1 | First screen (hero) | Present; premium imagery | OBSERVED | homepage; exact above-the-fold NOT TESTED (no live load) |
| 2 | Value proposition | Strong but **owner-facing** ("maximize your property's return"); guest UVP thinner on home | OBSERVED | → Finding F7 |
| 3 | Mobile quality | Unknown | NOT TESTED | needs live device check (pre-send) |
| 4 | Navigation | Rich (villas, services, concierge, blog, FAQ, contact) | OBSERVED | many indexed pages |
| 5 | Direct-booking prominence | Actively promoted (perks: best price, breakfast, welcome tray) | OBSERVED | /faqs-for-guests/ |
| 6 | CTA | "Check availability" / enquiry + WhatsApp + email | OBSERVED | /reserve-your-stay/ |
| 7 | Price availability | Rates shown on villa pages/OTAs; on-site price to a booking is via **quote** | OBSERVED | ~$343–486/night |
| 8 | Calendar / live availability | No live guest-side calendar detected on own domain | INFERRED | quote is manual |
| 9 | Booking engine | No instant guest-side engine; **but Xendit payments + channel manager exist** behind the scenes | OBSERVED/INFERRED | N2 — rails exist, quote step is manual |
| 10 | Errors / dead ends | Unknown | NOT TESTED | live click-through needed |
| 11 | Load speed | Unknown | NOT TESTED | run /website-check/ or Lighthouse live |
| 12 | Trust elements | Strong: founders named, press, 4.9/5 case study, loyalty content | OBSERVED | N5 |
| 13 | Reviews on site | Case studies + review-method content; per-villa reviews on OTAs | OBSERVED | |
| 14 | Terms & conditions | Present; no refund for no-show/early departure; agreements via channel manager | OBSERVED | /terms-services/ |
| 15 | FAQ | Guest FAQ + owner FAQ present | OBSERVED | /faqs-for-guests/ |
| 16 | Contacts | contact@gravitybali.com · +62 813-5370-4430 · office Kerobokan · form | OBSERVED | /contact-us/ |
| 17 | WhatsApp | Advertised booking + concierge channel; number on contact page | OBSERVED | wa.me href NOT TESTED |
| 18 | Forms | Enquiry form → "sent directly to our marketing team" → personalized quote | OBSERVED | exact fields NOT TESTED |
| 19 | Languages | **12 languages** (site + chat) | OBSERVED | N1 — strength |
| 20 | Payment methods | **Xendit** + OTA providers; direct payment possible | OBSERVED | N2 |
| 21 | Source tracking | No visible per-channel enquiry attribution | INFERRED | |
| 22 | Abandoned-enquiry recovery | No visible mechanism | INFERRED | |
| 23 | Re-contact / follow-up | Post-stay feedback exists; pre-booking enquiry follow-up not visible | OBSERVED/INFERRED | N3 |
| 24 | Analytics (if public) | Not determinable without live load | NOT TESTED | |

## 2. WhatsApp funnel checklist (TZ §6) — publicly visible part

| Check | Result | Class |
|---|---|---|
| Ease of finding WhatsApp | Advertised; number on contact page | OBSERVED |
| Destination number | +62 813-5370-4430 (+ per-guest concierge post-booking) | OBSERVED |
| Prefilled message | Unknown — no mechanism visible | NOT TESTED |
| Villa name carried into chat | Likely lost (form-first flow) | NOT TESTED / INFERRED |
| Dates carried | Likely lost | NOT TESTED / INFERRED |
| Source carried | No mechanism visible | INFERRED |
| Guest knows what to write | No prompt/template visible | INFERRED |
| Context of chosen villa kept | At risk at channel switch | INFERRED |
| Alternative contact | Form, email, office, online call | OBSERVED |
| Reply-time expectation set | Very high by their own pages (<5 min concierge; <1 h booking) | OBSERVED |
| Continue-to-booking convenience | Manual quote → payment link (Xendit) | OBSERVED |
| Actual response time | `NOT TESTED — requires an authorised mystery enquiry or internal data.` | NOT TESTED |

## 3. Booking-flow analysis

Villa page → "Check availability" enquiry form → marketing-team mailbox →
personalized quote (manual, business-hours-fastest) → payment link (Xendit) /
agreement via channel manager → confirmed. The rails to *complete* a booking
exist; the **first response / quote** is the manual, human-speed, weekend-gapped
step — and that is the point of leverage.

## 4. Loss map (TZ §7) — where direct enquiries can leak

Visitor
→ **L1** direct = "wait for a quote" while OTAs confirm instantly (F1)
→ **L2** weekend/after-hours enquiry meets a concierge described as closed (F3)
→ **L3** channel switch to WhatsApp loses villa/dates/source (F4)
→ **L4** enquiry lands in one of several inboxes (form-mail, WA, IG, OTA, email) (F5)
→ **L5** staff re-qualify manually; the written <1 h clock is already running (F2)
→ **L6** no visible pre-booking pipeline → no owner, no follow-up, no reminder (F5)
→ **L7** guest goes quiet; nobody re-engages (F5)
→ **L8** outcome + source never reach the founders (F5)

Volumes unknown without internal data — the map shows *where* leaks are
structurally possible, not *how many* occur.

## 5. Findings (refreshed)

- **F1 — Best-perks channel is the slowest (HIGH).** Direct booking earns the
  best perks but runs on a manual quote. *Refresh:* payment/contract rails
  (Xendit + channel manager) exist — so the fixable gap is the **manual
  first-response/quote step**, not payment. [OBSERVED]
- **F2 — Written speed promise with no visible meter (HIGH).** "<5 min" / "<1 h"
  published; no sign response times are measured. Actual speed NOT TESTED. [OBSERVED]
- **F3 — "7 days a week" vs "closed on weekends" contradiction (HIGH).** Both
  live on their own pages; re-confirmed. [OBSERVED]
- **F4 — Context likely lost between villa page and WhatsApp (MEDIUM).** No
  mechanism visible; wa.me behavior NOT TESTED. [INFERRED/NOT TESTED]
- **F5 — Fragmented pre-booking intake, no visible unified pipeline (MEDIUM).**
  *Refresh:* the channel manager centralises confirmed bookings/contracts, but
  the *pre-booking enquiry* layer (form/WA/IG/OTA/email) still appears
  fragmented. [INFERRED]
- **F6 — Brand fragmentation at the edges (LOW).** gravitybali.net duplicate;
  small IG (~958). [OBSERVED]
- **F7 — Homepage speaks to owners, not guests (LOW, new).** Guest-facing UVP is
  thin on the home page relative to the owner pitch — a minor conversion note
  for direct-guest traffic. [OBSERVED]
- **F8 — Existing review method is post-stay & possibly gating (MEDIUM, new).**
  They already run a structured post-stay feedback form and "flag concerns /
  follow up directly." Two implications: (a) our Reviews add-on repositions to
  **mid-stay + real-time + compliant + automated**, not net-new; (b) **verify**
  whether their current flow routes unhappy guests away from public review — if
  so, it is review gating (Google-policy risk) and worth fixing. [OBSERVED — process detail INFERRED]

Financial scenarios: unchanged — see `02_AUDIT.md` §E (assumptions only).

## 6. PRE-SEND verification checklist (operator, ~12 min, live browser)

Do this before sending anything. Screenshot as you go (doubles as evidence
capture for the slots). If a load-bearing quote changed, update the microsite
(Findings 1–3), deck slide 3 and `02_AUDIT.md` first — accuracy is the asset.

- [ ] `/en/reserve-your-stay/` — "sent directly to our marketing team … personalized quote" still present
- [ ] `/en/gravity-bali-guest-experience-secrets/` — "average response time under five minutes" + "under 1 hour"
- [ ] `/en/faqs-for-guests/` — "concierge … closed on weekends"; and `/en/gravity-conciergerie/` — "7 days a week"
- [ ] `/en/about-us/` — villa count wording (40+ / 35)
- [ ] `/en/contact-us/` — +62 813-5370-4430 still the listed line
- [ ] A villa page (e.g. `/en/property/villa-kelanah/`) — **record the WhatsApp link `href`** (settles F4: does villa/dates carry into the chat?)
- [ ] Confirm the **12-language** switcher and note the chat widget vendor (F/N1)
- [ ] Confirm **Xendit** / payment path and the channel manager (N2)
- [ ] Read `/en/improving-guest-reviews-the-gravity-bali-method/` — capture their **current review process**; check if unhappy guests are steered away from public review (F8 compliance)
- [ ] Homepage above-the-fold: is there a guest-facing UVP? (F7)
- [ ] @bali.gravity current follower count; gravitybali.net still live? (F6)
- [ ] Run `/website-check/` (or Lighthouse) on a normal network for **load speed + mobile** (fills items 3, 11)
- [ ] Capture the 8 screenshots: `node scripts/capture-evidence.mjs audit/gravity-bali/evidence-plan.json`

## 7. Evidence / QA checklist (asset itself)

- [x] Every audit claim classified OBSERVED / INFERRED / NOT TESTED with a source
- [x] Load-bearing quotes double-confirmed via independent queries
- [x] No person named as owner/GM without public confirmation (Olivier & Celine Cancé — own site + press + LinkedIn)
- [x] Disambiguation: "Gravity Bali Hotel" / "Gravity Eco Boutique Hotel" are unrelated — never cite their reviews
- [x] Actual reply speed marked NOT TESTED, never claimed as delay
- [x] noindex on microsite/demo/gift/deck/feedback (meta + X-Robots-Tag + robots.txt); no public links
- [x] Demo form + feedback form: no success shown unless the webhook saved (tests: 76/76)
- [ ] Real screenshots captured locally (operator step)
- [ ] Live-only items verified (pre-send checklist §6)

## 8. Full deliverables index

See `06_QA_REPORT.md` §"Deliverables index" (kept as the single source of
truth) — 20 TZ outputs + demo, gift, reviews module, deploy guide, this
consolidated checklist.
