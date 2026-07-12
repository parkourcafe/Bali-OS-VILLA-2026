# Anjuna — Full Listing Census & Guest-View Scorecard Protocol

Goal: (1) an error-free list of WHERE the villas are listed and HOW MANY units; (2) score every
listing the way a guest sees it (price, photos, positioning) against direct competitors.

## Part A — The census: three layers to "no errors"

### Layer 1 — Inside sources (100% accurate; the only way to be error-free)
| Source | What it gives | How |
|---|---|---|
| **Airbnb host profile** | ALL listings of the host in one page | Open any Anjuna listing in a normal browser → click host name ("hosted by …") → "View profile" → full listing list. 10 minutes, free, near-100% for Airbnb |
| **Guesty dashboard** | The definitive unit list: every property, every channel connection, statuses | Request in due diligence (owner can demand a portfolio report from Balinest) |
| **OTA extranets** (Booking/Agoda/Expedia) | Exact live properties + room counts per channel | DD access request |
| **Owner's own records** | Completed vs handed-over vs held-back units | Ask the owner — he knows what he delivered |

### Layer 2 — Paid market-intelligence tools (95%+, no cooperation needed)
- **AirDNA / Airbtics / AirROI / KeyData**: enter the host or map area → per-listing table with ADR,
  occupancy, revenue estimates, photo counts, amenities, review velocity. Airbtics already shows the
  Balinest host profile (~207 listings). Cost: ~$20–100/mo for one market — worth it for this deal.
- These also solve the competitor benchmark: same-area, same-bedroom comps with real occupancy/ADR.

### Layer 3 — Manual browser sweep (free, 2–3 h, assistant task; ~90%)
1. **Airbnb**: map-search Uluwatu/Pecatu, filters 1/2/3BR → open host profile (Layer 1 shortcut) → screenshot every "Anjuna" listing; record URL, unit code, BR, price for a fixed test date pair.
2. **Booking.com**: search "Anjuna" + Uluwatu dates; also open the known property pages and click the "chain/brand" if shown. Record each property + room types inside (aggregates hide units!).
3. **Agoda / Trip.com / Traveloka / Expedia / Vrbo / TripAdvisor**: same search per site.
4. **Marriott Homes & Villas**: search Uluwatu.
5. **Direct**: balinestvillas.guestybookings.com — browse the full property list.
6. **Google**: "Anjuna" + Uluwatu on Google Travel/Maps/Vacation Rentals.
Record everything in the census sheet (below). Same test dates everywhere so prices are comparable.

**Rule:** a unit only counts as "live" if you can reach checkout with real dates. Aggregate listings
("2BR Villas") must be opened to count room inventory inside.

## Part B — Guest-View Scorecard (100 points per listing)
Score each Anjuna listing AND 6–8 competitors identically. Competitor set: same map zone
(Uluwatu/Bingin/Pecatu), same bedroom class, 4.8★+/50+ reviews, price band $150–400 —
i.e. what a guest actually compares in the same search results.

| Block | Pts | What to check (guest's eyes) |
|---|---|---|
| **1. Search-result impression** | 15 | Thumbnail quality (5) · title says something desirable, not a unit code (5) · badge/rating visible + price looks credible in the grid (5) |
| **2. Photos** | 20 | Count ≥30 (4) · hero shot sells the dream (5) · coverage: every room+pool+view+bathroom (5) · light/professional quality (4) · captions (2) |
| **3. Copy & positioning** | 15 | First 2 lines hook (4) · concrete USPs — cliff, Thomas Beach access (4) · honest expectation-setting: construction/nightlife/access (4) · localization/tone (3) |
| **4. Price & value display** | 15 | Rate vs comps for same dates (5) · fees/taxes not a checkout surprise (4) · cancellation flexibility (3) · discounts (weekly/early-bird) (3) |
| **5. Social proof** | 15 | Rating ≥4.85 (4) · review count ≥50 (4) · recent reviews (3) · host status/badges (2) · management replies to reviews (2) |
| **6. Booking friction** | 10 | Instant book (4) · min-nights reasonable (3) · deposit/rules not scary (3) |
| **7. Cross-channel consistency** | 10 | Same name/photos everywhere (4) · rate parity, direct is best (3) · all key channels present (3) |

**Interpretation:** 85+ market-leading · 70–84 competitive · 55–69 leaking bookings · <55 actively repelling guests.

## Part C — "How guests see it" test (30 min)
Do 3 real guest searches in incognito: (1) Airbnb "Uluwatu, 2 adults, [dates]", (2) Booking same,
(3) Google "villa Uluwatu beach access". Record: on which page/position does an Anjuna unit first
appear? What appears BEFORE it (those are the true competitors)? Screenshot the comparison grid the
guest sees — that grid IS the market context for pricing and photos.

## Outputs
1. `listing_census.csv` — one row per unit×channel, live-verified.
2. `listing_scorecard.csv` — one row per listing (Anjuna + competitors), 7 block scores + total.
3. Verdict memo: what's done well / badly vs competitors, per block, with screenshots.

## Who does what
- Assistant (browser, 3–4 h total): Layer 3 sweep + Part C searches + scoring photos/copy/prices.
- Me: pre-filled both sheets with everything already known; I aggregate scores, build the comparison
  and the verdict memo once the sheets come back.
- Owner/DD (for the final 100%): Guesty portfolio report + extranet unit counts (Layer 1).
