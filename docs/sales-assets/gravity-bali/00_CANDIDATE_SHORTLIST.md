# Villa Ops OS — candidate shortlist & selection

Prepared: 2026-07-12 · Method: passive public research only. This build
environment's egress policy blocked direct page loads, so official-site facts
were captured via search-index snippets of the pages — classified
**OBSERVED-via-search** (the strongest class available this session; the
10-minute pre-send checklist in `06_QA_REPORT.md` upgrades key items to
VERIFIED on a normal browser). Nobody was contacted; no forms submitted.
Full raw research: `../research/candidate-research-2026-07-12.json`
(8 deep profiles + 12 discovery candidates, 681k research tokens).

## The three finalists

### 1. Gravity Bali — SELECTED · fit 9/10 · confidence 7/10

| Field | Value | Class / source |
|---|---|---|
| Website | gravitybali.com (EN/…; parallel legacy domain gravitybali.net) | OBSERVED [G-S1, G-S18] |
| Instagram | @bali.gravity ~958 followers, 572 posts | OBSERVED [G-S11] |
| Area | Seminyak, Canggu, Kerobokan, Balangan, Uluwatu; office Jl. Mertanadi No. 39, Kerobokan Kelod | OBSERVED [G-S6] |
| Portfolio | "more than 40 exclusive villas" (own about page; one snippet says 35; April-2026 press says 40+) | OBSERVED [G-S2, G-S4] |
| Price segment | Premium: Villa Simprana 4BR ~US$343/night; Villa Kelanah 5BR from ~US$486/night | OBSERVED [G-S9, G-S10] |
| Management model | Full-service boutique management + marketing, founded 2017, owner-operated; investment arm (Gravity Bali Invest) | OBSERVED [G-S2, G-S17] |
| Direct booking | Actively promoted with perks (best price + free breakfast + welcome tray); mechanics = enquiry form → "sent directly to our marketing team" → "personalized quote" | OBSERVED [G-S7, G-S8, G-S13] |
| WhatsApp | Advertised booking + concierge channel; +62 813-5370-4430 on contact page; dedicated per-guest concierge WhatsApp | OBSERVED [G-S6, G-S14] — wa.me hrefs NOT TESTED |
| Booking engine | None visible guest-side (manual quote flow); internal "hotel-grade revenue management software" claimed, unnamed | INFERRED [G-S8, G-S13] |
| Public contact | contact@gravitybali.com · +62 813-5370-4430 · contact form · office Kerobokan | OBSERVED [G-S6] |
| Decision makers | **Olivier Cancé — Founder; Celine Cancé — Co-Director** (own founders page + April-2026 Indonesia Design interview + public LinkedIn) | OBSERVED [G-S3, G-S4, G-S5] |
| Team | Marketing team issues quotes; per-guest concierges; hiring sales/marketing/office via Glints (hr@gravitybali.com) | OBSERVED [G-S16] |
| Intl. guests | EN site, French founders, OTA distribution (Airbnb/Booking.com per own FAQ), premium international clientele | OBSERVED [G-S7] |
| Key public promises | Concierge "average response time under five minutes"; booking requests answered "under 1 hour"; concierge "7 days a week" — while the FAQ/conciergerie copy also says the concierge "is closed on weekends" | OBSERVED, independently re-confirmed ×2 [G-S12, G-S14, G-S15] |
| Deal potential | 40 premium villas × $343–486/night → est. $500k–1M+ annual management revenue; $5–9.5k ≈ 1–2 villa-nights of portfolio gross | INFERRED |

### 2. OriVista (formerly Azure Bali) — runner-up · fit 8.5/10 · confidence 7/10

| Field | Value | Class |
|---|---|---|
| Website / IG | orivista.com + book.orivista.com; legacy book.azurebali.com still live | OBSERVED |
| Portfolio | "52 Private Pool Villas" in own page title; founder LinkedIn "0 to 52+ managed villas in 2 years" | VERIFIED-in-index / OBSERVED |
| Decision maker | Manish A. — Founder (public LinkedIn headline) | OBSERVED |
| Direct booking | Separate booking engine subdomain; marketing site and engine are different systems | OBSERVED |
| Pain evidence | Published "within 30 minutes" WhatsApp SLA; office hours Mon–Fri 9–5, weekends 9–14 → after-hours gap; post-rebrand dual-brand leaks (support@azurebali.com, dual booking domains, OTA listings under old brand) | OBSERVED |
| Why not #1 | Hypergrowth data-savvy founder (likely DIY inclination); rebrand chaos means our system lands mid-migration; booking engine already exists (part of the plumbing owned) | INFERRED |

### 3. Nagisa Bali (PT. Nagisa Bali) — #3 · fit 8/10 · confidence 6.5/10

| Field | Value | Class |
|---|---|---|
| Website / IG | nagisa-bali.com + 4 satellite domains; IG estate 83K + 23K + 2 more accounts | OBSERVED |
| Portfolio | "over 50 villas", est. 2006, premium mixed (Villa Casis ~$360–460/night) | OBSERVED |
| Decision maker | Lina Goh (Shimizu) — Founder & CEO (press interviews ×3); co-founder Yosuke Shimizu | OBSERVED |
| Direct booking | Per-villa Book Now / Inquire; "book direct = lowest rates"; no engine visible | OBSERVED / INFERRED |
| Pain evidence | Reseller guestreservations.com intercepts brand-demand searches; no wa.me entry visible; 6 phone numbers, 5+ domains (one with default WordPress title), 4+ IG accounts; "fast respon reservation team" promise with nothing visible behind it | OBSERVED / INFERRED |
| Why not #1 | Half the visible pain (reseller interception, satellite-domain rot, SEO defense) is OUTSIDE Villa Ops OS's 14-day scope; enquiry-flow evidence rests more on absence-of-evidence (lower confidence); 20-year corporate structure slower to close than founder-led boutique | INFERRED |

## Also evaluated (deep profiles + discovery, all in the research register)

- **Bukit Vista** (170–180 obj.): builds its own AI stack (GAIA/RAIA) in-house — build-not-buy. Fit 2.
- **Cabo Bali** (20+ premium): already on Guesty PMS + hosted direct-booking engines; co-founder ex-Google growth — DIY risk. Fit 7.5.
- **Bali Management Villas** (150–200+): OTA-centric guest revenue, inconsistent public claims, corporate procurement. Fit 6.5.
- **The Bali Agent** (90+ villas): strong pain (09:00–17:00 phone support; 2-day hold expiry) but decision maker not publicly confirmed. Fit 8, blocked on outreach target.
- **Hideaway Villas Bali / Kanaan** (~70 units): fragmented contacts confirmed, but hotel-style multi-property brand with corporate parent. Fit 7.5.
- Discovery pool (12): House of Reservations, Short Stay Bali, Villa Bali Management, BaliSuperHost, Ini Vie, Optimum Bali, Solar Property, My Villa Management, Bali Villa Escapes — logged for future one-client assets.

## Why Gravity Bali

1. **Their own pages sell the product for us.** They publish "average response
   time under five minutes" and "booking requests answered under 1 hour" —
   and fulfil those promises with a manual form → marketing team → personalized
   quote flow, with the concierge "closed on weekends" per their own FAQ while
   another page says "7 days a week". Every finding is quotable from their own
   site — no third-party dirt, no criticism of people, just promise vs plumbing.
2. **95% scope match.** Unlike Nagisa (reseller/SEO problems outside scope) or
   Cabo/OriVista (engines already owned), Gravity's visible gaps map exactly
   onto Villa Ops OS: instant acknowledgement, context-carrying WhatsApp entry,
   qualification, pipeline, follow-up, weekend/after-hours coverage, response
   analytics.
3. **Founder-led and publicly reachable.** Olivier & Celine Cancé are named on
   their own site, gave an April-2026 press interview, and Celine has a public
   LinkedIn. Boutique, family-owned: one conversation, one decision.
4. **Budget-proportionate.** 40 premium villas ($343–486/night observed):
   a $7,500 one-off ≈ 1–2 villa-nights of portfolio gross. They already pay
   for in-house marketing, revenue software and concierge staffing.
5. **Respectful angle available.** "You promise the best service in Bali —
   we make that promise measurable and protected 24/7, weekends included."
   Their premium positioning makes the speed story a brand-protection story,
   not a criticism.

Known risk: boutique "personal touch" identity may resist AI-assisted first
response → the proposal frames Villa Ops OS as *protecting their concierges'
promise* (instant acknowledgement + context + handoff), never replacing them.

## Gravity source register

| ID | URL | What it evidences |
|---|---|---|
| G-S1 | gravitybali.com/en/ | positioning, services |
| G-S2 | gravitybali.com/en/about-us/ | "more than 40 exclusive villas", boutique model |
| G-S3 | gravitybali.com/en/our-history-founders/ | Olivier founder, Celine co-director, 2013→2017 history |
| G-S4 | indonesiadesign.com/story/from-first-villa-to-a-boutique-vision-in-bali-a-conversation-with-olivier-and-celine-cance + /story/gravity-villa-management-crafting-elevated-villa-living-in-bali | April-2026 press: founders, 40+ villas |
| G-S5 | id.linkedin.com/in/celine-cance-b2828374 | "Co Director - Gravity Bali villa management" |
| G-S6 | gravitybali.com/en/contact-us/ | contact@gravitybali.com, +62 813-5370-4430, Kerobokan office |
| G-S7 | gravitybali.com/en/faqs-for-guests/ | book via website/WhatsApp/OTAs; direct-booking perks; weekend concierge closure |
| G-S8 | gravitybali.com/en/reserve-your-stay/ | form "sent directly to our marketing team… personalized quote" |
| G-S9 | gravitybali.com/en/property/villa-simprana/ | 4BR ~US$343/night |
| G-S10 | villa-bali.com/en/villa/kerobokan/villa-kelanah | 5BR from ~US$486/night; OTA presence |
| G-S11 | instagram.com/bali.gravity/ | ~958 followers, 572 posts |
| G-S12 | gravitybali.com/en/gravity-bali-guest-experience-secrets/ | "<5 min average" concierge, "under 1 hour" booking requests |
| G-S13 | gravitybali.com/en/property/villa-kelanah/ | villa page enquiry flow |
| G-S14 | gravitybali.com/en/gravity-conciergerie/ | dedicated WhatsApp concierge, "7 days a week" claim, weekend-closure note |
| G-S15 | gravitybali.com/en/bali-customer-service-key-to-rental-success/ | independent re-confirmation of "<5 minutes" claim |
| G-S16 | glints.com/id/en/companies/gravity-bali/44246549-… | hiring, roles, hr@gravitybali.com |
| G-S17 | linkedin.com/company/gravity-bali-invest/ | investment arm |
| G-S18 | gravitybali.net/about/ | parallel legacy domain (brand fragmentation) |

All accessed 2026-07-12 via search index. Disambiguation: "Gravity Bali
Hotel" (Pecatu) and "Gravity Eco Boutique Hotel" are **unrelated businesses**
— their reviews/ratings must never be attributed to Gravity Bali (villa
management). Per-claim verification verdicts: `01_EVIDENCE_REGISTER.md`.
