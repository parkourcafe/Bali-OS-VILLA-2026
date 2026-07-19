# Gravity Bali — evidence register (per claim)

Every claim used anywhere in the sales asset, its class, sources, and
verification status. Classes: **VERIFIED** (would require a live page load —
none possible this session), **OBSERVED** (public source via search index),
**INFERRED** (reasoned from observed facts), **NOT TESTED**.
"Recheck" = item in the operator's 10-minute pre-send browser checklist
(`06_QA_REPORT.md` §Pre-send).

| # | Claim | Class | Sources | Independent re-check this session | Recheck before send |
|---|---|---|---|---|---|
| E1 | Gravity Bali manages "more than 40 exclusive villas" (one snippet says 35) in Seminyak/Canggu/Kerobokan/Balangan/Uluwatu | OBSERVED | G-S2 about page; G-S4 press (Apr 2026) | — | ✔ number on about page |
| E2 | Founded 2017 by Olivier Cancé; Celine Cancé Co-Director; first villa 2013; family-owned boutique | OBSERVED | G-S3 founders page; G-S4 press; G-S5 LinkedIn | — | ✔ |
| E3 | Concierge team markets "average response time under five minutes" | OBSERVED | G-S12 guest-experience page | ✔ second page G-S15 confirms same wording | ✔ exact quote + screenshot |
| E4 | Booking requests promised answered "under 1 hour"; urgent issues "within the hour" | OBSERVED | G-S12 | partially (main page confirmed; second source pending) | ✔ exact quote + screenshot |
| E5 | Concierge advertised "7 days a week" / dedicated WhatsApp concierge per guest | OBSERVED | G-S14 conciergerie page | ✔ | ✔ |
| E6 | Same estate copy says concierge "is closed on weekends — for urgent requests contact your villa manager" | OBSERVED | G-S7 FAQ; also surfaced on G-S14 in re-check | ✔ re-confirmed via separate query | ✔ both quotes + screenshots |
| E7 | Direct availability check = form "sent directly to our marketing team" → "personalized quote" (manual, no engine) | OBSERVED (absence of engine INFERRED) | G-S8 reserve page; G-S13 villa page | ✔ re-confirmed via separate query | ✔ walk the flow, screenshot form |
| E8 | Direct-booking perks promoted: best price + free breakfast + welcome floating tray | OBSERVED | G-S7 FAQ | — | ✔ |
| E9 | Guests can also book via WhatsApp and OTAs (Airbnb, Booking.com) — same villas instantly bookable on OTAs | OBSERVED | G-S7 FAQ; G-S10 villa-bali.com listing | — | ✔ one OTA listing |
| E10 | Public contact: contact@gravitybali.com, +62 813-5370-4430, office Jl. Mertanadi No. 39, Kerobokan Kelod | OBSERVED | G-S6 contact page | — | ✔ number before messaging |
| E11 | wa.me link presence, prefilled text, villa/date context transfer into WhatsApp | **NOT TESTED** | — (HTML not loadable this session) | — | ✔✔ REQUIRED: open villa page, tap WhatsApp CTA if present, record href |
| E12 | No unified pipeline / source tracking visible; enquiries arrive via form, WhatsApp, IG DM, OTAs into separate inboxes | INFERRED | from E7, E9, G-S6, G-S11 | — | — (internal; validate in Days 1–2) |
| E13 | Instagram @bali.gravity ~958 followers, 572 posts | OBSERVED | G-S11 | — | ✔ current count |
| E14 | Premium rates: Simprana 4BR ~$343/night; Kelanah 5BR from ~$486/night | OBSERVED | G-S9, G-S10 | — | ✔ |
| E15 | Active hiring (sales/marketing/office) via Glints; hr@gravitybali.com | OBSERVED | G-S16 | — | — |
| E16 | Parallel legacy domain gravitybali.net with duplicate About content | OBSERVED | G-S18 | — | ✔ still live? |
| E17 | Actual reply speed on any channel | **NOT TESTED** | — | — | `NOT TESTED — actual response time requires an authorised mystery enquiry or internal data.` Do NOT claim delays as fact. |
| E18 | Page load speed, mobile rendering, form validation behavior, chat widgets, analytics tags | **NOT TESTED** | — | — | ✔ optional: run /website-check/ tool + Lighthouse on a normal network |
| E19 | Company operating now (July 2026) | OBSERVED | G-S4 press Apr-2026; 2026-dated blog posts | ✔ | — |
| E20 | "Gravity Bali Hotel" (Pecatu) & "Gravity Eco Boutique Hotel" are unrelated businesses | OBSERVED | separate TripAdvisor/Agoda entities | ✔ (Agoda listing surfaced in re-check, clearly distinct) | — never cite their reviews |
| E21 | Guest reviews of Gravity Bali (villa mgmt): no company-level negative reviews surfaced; per-villa reviews live on OTAs | OBSERVED (thin) | research sweep | — | ✔ check Google Maps rating of the office |
| E22 | Revenue capacity: $500k–1M+ est. annual management revenue | INFERRED | E1 × E14 × typical 15–20% commission | — | — presented only as INFERRED |
| E23 | Site + chat available in **12 languages** ("seamless multilingual journey") | OBSERVED | homepage/marketing snippet (re-run 2026-07-13) | ✔ | ✔ confirm switcher live |
| E24 | **Xendit** payment provider secures bookings; direct payment possible | OBSERVED | /terms-services/ + FAQ snippet | ✔ | ✔ |
| E25 | **Channel manager** — rental agreements signed online through it | OBSERVED | /terms-services/ snippet | ✔ | ✔ |
| E26 | They **already run a review method**: post-stay structured feedback form; concerns flagged & followed up; proactive pre-arrival engagement | OBSERVED (process detail INFERRED) | /improving-guest-reviews-the-gravity-bali-method/ | ✔ | ✔✔ read the page; check for gating |
| E27 | Homepage value proposition is **owner-facing** ("maximize your property's return") | OBSERVED | homepage snippet | — | ✔ note guest UVP above-the-fold |
| E28 | Trust: **4.9/5 Airbnb** case-study villa; loyalty content; "any issue handled with professionalism" | OBSERVED | case-study + loyalty pages | — | — |

## Refresh 2026-07-13

The audit was re-run; E23–E28 are new. See `09_SITE_AUDIT_CHECKLIST.md` §0
for how the new evidence softens/repositions prior findings (notably: payment
rails exist, so Finding 1's gap is the manual quote step; and they already run
a post-stay review method, so the Reviews add-on repositions to mid-stay +
real-time + compliant + automated).

## Environment limitation (disclosed)

This session's egress policy blocked all direct page loads (HTTP 403 at the
proxy for every external host, including example.com and archive.org). Search
engine indexes were the only lens: claims marked OBSERVED were seen in Google-
indexed snippets of the cited pages, most confirmed via 2+ independent query
phrasings. Consequences:

1. Nothing here is VERIFIED in the strict live-page sense; the pre-send
   checklist upgrades E3–E10 to VERIFIED in ~10 minutes on any browser.
2. **No real screenshots could be captured.** The microsite/deck ship with
   clearly-labelled placeholder slots + `audit/gravity-bali/evidence-plan.json`
   for `scripts/capture-evidence.mjs` (run locally) which fills every slot
   without editing HTML.
3. Load-speed/mobile checks are honestly listed as NOT TESTED rather than
   invented.
