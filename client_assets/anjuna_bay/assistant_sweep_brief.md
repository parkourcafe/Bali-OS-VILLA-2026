# Task for Assistant — Listing Sweep: Anjuna Census + Competitor Facts (browser work)

**Goal:** (1) an accurate census — where the Anjuna villas are actually listed and how many units;
(2) facts for the guest-view comparison against 14 competitors.
**Time budget:** ~4–5 hours. **Files to fill:** `listing_census.csv` and `listing_scorecard.csv`
(tabs in our Google Sheet). **Screenshots** go into a `screenshots/` folder, named like
`anjuna-b1_airbnb_D1.png`, `coz_booking_grid.png`.

## 0. Setup (10 min)
- Browser in **incognito mode** (so history doesn't skew results), language **English**, currency **USD**.
- No VPN (we look as a "default" guest; if you're physically in Indonesia that's fine — note it).
- Open both sheets + this brief.

## Test dates (SAME for everything — otherwise prices aren't comparable)
- **D1 (shoulder season):** check-in **Mon 17 Aug 2026 → check-out 20 Aug 2026** · 3 nights · **2 adults**
- **D2 (peak):** check-in **21 Dec 2026 → check-out 28 Dec 2026** · 7 nights · **4 adults**
If a unit is unavailable on those dates, shift ±1 week and mark "(shifted)". Always record the
**final checkout price** (incl. fees and taxes), not the "from" price.

## Part 1 — Anjuna census (~90 min) → `listing_census.csv`
Rule: a unit counts as "live" only if you can reach the final checkout step with dates D1.
Aggregate listings ("Anjuna 2BR Villas") must be **opened — count the rooms inside**.

1. **Airbnb — the key trick:** open any Anjuna listing from the sheet (e.g. B1) → click the host
   name → **View profile** → you'll see the host's FULL property list. Find every "Anjuna" in it —
   that's nearly the whole Airbnb census in 10 minutes. Screenshot the entire profile (scroll).
   For each unit record: URL, BR, final D1 price, rating, review count, instant book (lightning
   icon)?, minimum nights, photo count (open the gallery — the "1/NN" counter).
2. **Booking.com:** search "Anjuna" + Pecatu, dates D1. Open each of our properties; in aggregates,
   count in the room table how many separate villas exist and how many are available on D1.
3. **Agoda, Trip.com, Traveloka, Expedia, Vrbo, TripAdvisor:** search "Anjuna" + Uluwatu on each.
   Found → add a census row; not found → write "not found (date, query)" in that channel's row.
4. **Marriott Homes & Villas:** search Uluwatu.
5. **Direct site:** balinestvillas.guestybookings.com — scroll the FULL property list, write down every Anjuna.
6. **Google:** "Anjuna villa Uluwatu" → Maps and Travel tabs. Is there a hotel/villa card? Screenshot.

## Part 2 — "How a guest searches" (~30 min)
Three incognito searches, screenshot everything (the results grid!):
1. Airbnb: "Uluwatu", dates D1, 2 adults → scroll the results. **At what position is the first
   Anjuna?** Who ranks ABOVE it (names of the first 10)?
2. Booking: "Uluwatu", D1, 2 adults, filter "Villas" → same: Anjuna's position, who's above.
3. Google: "villa uluwatu private pool beach access" → what's in the top 10 and the Google Travel
   block? Is Anjuna there?
Write the positions into a note `search_positions.md` (a simple list is fine).

## Part 3 — Facts for the scorecard (~2–2.5 h) → `listing_scorecard.csv`
For **every live Anjuna unit** and **each of the 14 competitors** (already listed in the sheet),
record for dates **D1** (one row each; columns already exist):
- final D1 price (and D2 if time allows — separated by a slash: "$520 / $980")
- cancellation: free until …? / non-refundable
- instant book (Y/N) · minimum nights · deposit/rules if prominent
- **photo count** (gallery "1/NN") · photo captions present (Y/N)
- listing title — copy it verbatim
- first 2 lines of the description — copy verbatim
- rating · review count · badges (Superhost / Guest favorite / Preferred)
- does management reply to reviews (check the 5 most recent) Y/N
- screenshots: hero photo + listing header of every property

**Do NOT assign scores (blocks 1–7) yourself** — facts and screenshots only. We'll score in a second
pass against the anchors (best-in-set = top of scale) so every score is defensible.

## Rules
- Identical conditions everywhere: same dates, same currency, incognito.
- Book nothing, message no one. This is observation only.
- If a page behaves oddly (different price on revisit) — screenshot both variants + a note.
- No "like/dislike" judgments — facts only. Taste gets discussed at scoring.

## Handover checklist
- [ ] `listing_census.csv` — every row closed out (live / not found), newly discovered units added
- [ ] Screenshot of the Airbnb host profile (full property list)
- [ ] `search_positions.md` — Anjuna's positions in the 3 searches + top-10 neighbours
- [ ] `listing_scorecard.csv` — facts for all Anjuna units and all 14 competitors
- [ ] `screenshots/` folder (result grids, hero photos, listing headers)
- [ ] Short note: what surprised you / what looked broken (5–10 lines, free text)

Once submitted, I aggregate everything, we score against the anchors, and I assemble the comparative
verdict — "why guests choose them and not us" — for the owner, with evidence in every cell.
