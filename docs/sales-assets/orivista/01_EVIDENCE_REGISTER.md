# OriVista — evidence register (per claim)

Every claim used anywhere in the OriVista sales asset, its class, sources, and
verification status. Classes: **VERIFIED** (would require a live page load —
none possible this session), **OBSERVED** (public source via search index),
**INFERRED** (reasoned from observed facts), **NOT TESTED**.
"Recheck" = item in the operator's pre-send browser checklist
(`06_QA_REPORT.md` §Pre-send). Full raw profile:
`../research/candidate-research-2026-07-12.json`.

| # | Claim | Class | Source (indexed 2026-07-12) | Recheck before send |
|---|---|---|---|---|
| E1 | OriVista manages **52 private-pool villas** across Canggu/Seminyak/Ubud/Uluwatu/Pererenan | OBSERVED | page title "All Villas — 52 Private Pool Villas in Bali \| OriVista Bali" (orivista.com/villas) | ✔ number still on villas page |
| E2 | Rebranded from **Azure Bali → OriVista** (~2025); rebrand page live on legacy domain | OBSERVED | azurebali.com/orivista/ ("ORIVISTA - Azure Bali", info@orivista.com, "60+ high-end villas") | ✔ page still live |
| **E3** | **support@azurebali.com still shown as a public contact alongside OriVista details** — HEADLINE leak | OBSERVED | indexed orivista.com contact content | ✔✔ REQUIRED: open contact page, confirm the email is still azurebali.com (if changed, revise Finding 01) |
| **E4** | **book.azurebali.com listing pages live in parallel with book.orivista.com — identical listing IDs** (e.g. 97447 Villa Kenza on both) | OBSERVED | book.azurebali.com/listings/97447 + book.orivista.com/listings/97447 | ✔✔ confirm both resolve; screenshot side-by-side |
| E5 | OTA listings still carry the **"by Azure"** name | OBSERVED | booking.com/hotel/id/villa-kenza-canggu-by-azure.html; Expedia "Villa-Casa-Gypsy-By-Azure" | ✔ at least one OTA still "by Azure" |
| E6 | Site promises WhatsApp responses **"within 30 minutes"**; guest's preferred channel confirmed on arrival | OBSERVED | indexed orivista.com content | ✔✔ exact quote + screenshot + record the URL |
| E7 | Published **office hours Mon–Fri 9:00–17:00, Sat–Sun 9:00–14:00** (WITA) | OBSERVED | indexed orivista.com content; matches Waze/Places pin | ✔ still published; record URL |
| E8 | Listed on **8+ international OTAs** (Booking.com, Expedia, Hotels.com, Travelocity, Klook, Traveloka, tiket.com, MakeMyTrip, Airbnb, Marriott Homes & Villas) | OBSERVED | OTA listing pages / search index | ✔ spot-check 2–3 |
| E9 | Direct booking engine **book.orivista.com** with /search + /listings/{6-digit-id} | OBSERVED (engine exists); vendor **INFERRED** (Hostaway) | book.orivista.com indexed pages; ID pattern matches Hostaway | ✔ confirm vendor via page source on walkthrough |
| E10 | Public contact: **+62 8113 8036 00**, info@orivista.com, Jl Raya Padonan, Tibubeneng, Kuta Utara, Badung 80361 | OBSERVED | indexed orivista.com contact; Waze/Places | ✔ number before any wa.me use |
| E11 | wa.me link presence, prefilled text, villa/date context transfer into WhatsApp | **NOT TESTED** | — (HTML 403 to all fetchers) | ✔✔ REQUIRED: open a villa page, tap WhatsApp CTA if present, record href |
| E12 | No unified **pre-booking** enquiry pipeline / source tracking visible (enquiries arrive via WhatsApp, form, IG, OTA threads, two brand domains) | INFERRED | from E3–E9 | — (internal; validate Days 1–2) |
| E13 | Founder **Manish A.** ("Founder at Orivista (formerly Azure Bali)"); 0→52 villas in 2 yrs | OBSERVED | in.linkedin.com/in/manish-a-7774ab111 | — |
| E13b | Surname expands to **"Agarwal"** in search summaries — **NOT confirmed on-page** | OBSERVED (weak) | Google result summaries | ✔✔ REQUIRED: confirm surname before addressing him by it |
| E14 | Price point: 4BR Villa Kenza Canggu ≈ **US$344/night**; guest ratings 4.85–5.00 claimed | OBSERVED | thebaliguideline.com Villa Kenza; own-site snippet | ✔ |
| E15 | IG **@orivistaofficial ~6,216 followers / 431 posts**; YouTube @orivistaofficial; legacy FB **azureintbali** | OBSERVED | Google snippets | ✔ current IG count |
| E16 | Back-office in **Bhubaneswar, India**; Revenue Manager hire (Patia) | OBSERVED | id.linkedin.com/company/orivista snippets | — |
| E17 | Actual reply speed on any channel | **NOT TESTED** | — | `NOT TESTED — needs an authorised mystery enquiry or internal data.` Do NOT claim delays as fact. |
| E18 | Direct-booking incentives (best rate, beach-club access, personal concierge) exclusive to direct bookers; **"30%+ direct booking rate"** claim | OBSERVED | orivista.com homepage / property-management snippets | ✔ |
| E19 | OriVista's own materials mention **"AI automation"** | OBSERVED | azurebali.com/orivista/ snippet | ✔ note the exact wording (shapes objection-handling) |
| E20 | **No consolidated Google Business profile under "OriVista"** surfaced; only a Waze/Places pin "OriVista (Azure Bali)" | OBSERVED (absence) | search sweep | ✔ search Google Maps for "OriVista" from a clean session |
| E21 | Operating in **2026** (2026-dated blog posts; Bali Villa Connect May 26–27 2026; 2026 OTA pages) | OBSERVED | orivista.com blog; founder LinkedIn | — |
| E22 | Villas: **Alba** (148160), **Kenza** (97447), **Amara** (364528), **Anaya** (415813), **Casa Gypsy** (OTA) | OBSERVED | indexed book.orivista.com/listings pages; OTA | ✔ names still current |
| E23 | Page load speed, mobile rendering, form validation, chat widgets, analytics tags | **NOT TESTED** | — | ✔ optional: /website-check/ tool + Lighthouse on a normal network |

## Environment limitation (disclosed)

This session's egress policy blocked all direct page loads — orivista.com,
book.orivista.com, azurebali.com, book.azurebali.com and every OTA page
returned **HTTP 403** to every fetcher available (WebFetch and direct curl
CONNECT both denied). Consequences:

1. Nothing here is VERIFIED in the strict live-page sense; the pre-send
   checklist upgrades E1–E10 to VERIFIED in ~10 minutes on any browser.
2. **No real screenshots could be captured.** The microsite ships with
   clearly-labelled placeholder slots + `audit/orivista/evidence-plan.json`
   for `scripts/capture-evidence.mjs` (run locally), which fills every slot
   without editing HTML.
3. wa.me behaviour, booking-engine vendor, and load-speed/mobile are honestly
   listed as NOT TESTED / INFERRED rather than invented.
4. **Two items are load-bearing and REQUIRED before outreach:** E3 (is
   support@azurebali.com still the visible contact?) and E4 (are both booking
   domains still live with matching IDs?). If either has been fixed since
   2026-07-12, Finding 01 must be softened or removed before send — accuracy is
   the asset.
