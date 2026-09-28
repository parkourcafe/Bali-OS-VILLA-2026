# SEO Daily Control

Version: v1.0
Date: 2026-07-18
Domain: https://villaops.selenasystems.com/

## Purpose

This is the daily operating loop for the top-5 SEO system. It keeps search growth tied to measurable funnel outcomes instead of turning SEO into a disconnected task list.

## Daily 15-Minute Check

Record the check in `EXECUTION_DASHBOARD.md` or the active operator log.

1. Confirm the site is live: `/`, `/score/`, `/website-check/`, `/privacy/`.
2. Check the lead API and score flow if there was a deploy in the last 24 hours.
3. Review analytics for score starts, score completions, website-check completions, WhatsApp clicks, and audit requests.
4. Review GSC only after data is available: coverage errors, non-branded impressions, clicks, and new queries.
5. Write one action for the next 24 hours.

## Weekly SEO Review

Run once per week after Search Console has enough data.

| Area | Question | Action if weak |
| --- | --- | --- |
| Indexing | Are priority URLs indexed? | Inspect URL, sitemap, canonical, robots, internal links. |
| Queries | Are impressions coming from response/audit/direct-booking intent? | Adjust titles, headings, and page copy. |
| CTR | Are people clicking from search? | Rewrite title/meta around the strongest query. |
| Conversion | Do organic visitors start the score or website check? | Align CTA and first screen with query intent. |
| Lead quality | Are audit requests qualified? | Tighten gate copy and qualification questions. |

## Production Checks Already Confirmed

- `https://villaops.selenasystems.com/` returns `HTTP 200` on Vercel.
- `https://villaops.selenasystems.com/sitemap.xml` returns `HTTP 200`.
- `robots.txt` allows the site and disallows `/score/result/`.
- `sitemap.xml` uses absolute production URLs for `/`, `/score/`, and `/privacy/`.

## Open Technical Actions

1. Add `/website-check/` to `sitemap.xml`.
2. Verify `google701d47690a232c57.html` in Google Search Console. Current live `HEAD` request redirects to `/google701d47690a232c57/` because of clean URL behavior; if Google rejects verification, add a host config exception so the exact `.html` file returns `200`.
3. Confirm analytics provider and set either Plausible or GA4.
4. Track these events:
   - `score_start`
   - `score_complete`
   - `audit_request_submit`
   - `website_check_submit`
   - `website_check_complete`
   - `whatsapp_click`
5. Submit sitemap in Google Search Console after verification succeeds.

## 30-Day Shipping Rhythm

Week 1:

- Finish technical gate.
- Index `/website-check/`.
- Build one focused page: `/guest-inquiry-audit-bali/`.

Week 2:

- Build `/whatsapp-response-system-bali-villas/`.
- Add internal links from `/`, `/score/`, and `/website-check/`.
- Review first GSC query data.

Week 3:

- Build `/direct-booking-response-audit/`.
- Publish one proof-led resource from real audit observations.
- Tune titles/meta based on GSC impressions.

Week 4:

- Build `/ai-guest-response-system-bali-villas/`.
- Review top-20 query movement.
- Decide whether to expand into Indonesian-language or partner-led local pages.

## Handoff Notes for Another Agent

Do not restart market research from zero. Use the repo as the source of truth.

Read these first:

- `README.md`
- `docs/SEO_TOP5_SYSTEM.md`
- `docs/SEO_DAILY_CONTROL.md`
- `docs/AUDIT_OPERATIONS.md`
- `docs/CONTENT_EDITING.md`
- `EXECUTION_DASHBOARD.md`

Do not use unrelated 18+ or other brand SEO skills for this project. The strategic object is `villaops.selenasystems.com`, a B2B lead-generation funnel for Bali villa operators.
