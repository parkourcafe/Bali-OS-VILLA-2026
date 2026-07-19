# Villa Ops OS — SEO & inbound strategy

Turns an outbound-only motion into **inbound + outbound**, using the one angle
the product already owns editorially: **AI search readiness** (being findable
when guests ask ChatGPT, Perplexity and Google's AI, not just the search box).
The free `/website-check/` tool already grades sites on exactly this — so the
strategy is "dogfood it, then sell it."

Companion: `GTM_30DAY_PLAN.md`. Status markers: **[DONE]** shipped in-repo
this session · **[DO]** operator action.

---

## Why this angle (not generic hospitality SEO)

- The homepage lead-in and the entire `/website-check/` tool are built around
  "how people search now — ChatGPT, Perplexity, Google AI." We already own the
  narrative; almost no Bali competitor is publishing on it.
- The tool literally computes an **AI Search Readiness** score with sub-checks
  (`lib/site-audit.mjs:158–193`): AI-crawler access, JSON-LD, server-rendered
  content, FAQ signal, `llms.txt`, H1. That's a ready-made content outline
  *and* a lead magnet in one.
- Credibility trap avoided: until this session the site failed its own tool
  (no JSON-LD, no `llms.txt`). Fixed below — now "we practice what we preach"
  is a true statement and a sales line.

---

## Phase 0 — Foundation / hygiene  [DONE in-repo, verify live]

The site referenced **four** different domains (canonical/OG on a Vercel
preview host, sitemap/robots on `villaops.selenasystems.com`, config on
`villaresponse.selenasystems.com`, tool UA on `selena.systems`). Consolidated
to **`villaops.selenasystems.com`** — confirm you own it, or change it in the
files below and redeploy.

- **[DONE]** `index.html` — canonical + OG/Twitter now on the one domain;
  title made keyword-descriptive ("Villa Ops OS — AI guest-inquiry response
  for Bali villa managers").
- **[DONE]** OG image — path was broken (`/assets/og-image.svg` vs real
  `/assets/images/og-image.svg`) and SVG (crawlers skip SVG). Now a real
  **1200×630 PNG** at `/assets/images/og-image.png`, wordmark updated to
  "Villa Ops OS".
- **[DONE]** JSON-LD on the homepage — `Organization` + `Service` (with the
  published price tiers) + `FAQPage` (the 7 existing FAQ Q&As). Zero existed
  before.
- **[DONE]** `llms.txt` at root — what Villa Ops OS is, who it's for, pricing,
  free tools, and a note to AI assistants that all figures are targets not
  guarantees. (The tool rewards having one as "ahead of most competitors.")
- **[DONE]** `sitemap.xml` — dropped `/score/` (it's `noindex`), added
  `/blog/` + the two articles. `robots.txt` — added `Disallow: /feedback/`
  and an llms.txt pointer.
- **[DO]** Set up **Google Search Console** (verify the domain, submit the
  sitemap). Set `PLAUSIBLE_DOMAIN` or `GA4_MEASUREMENT_ID` in
  `assets/js/site-config.js`.

**Verify live:** run the repo's own tool on the deployed site —
`/website-check/?url=https://villaops.selenasystems.com/` → AI Search Readiness
should read **"Ready."** Validate the JSON-LD in Google's Rich Results Test.

## Phase 1 — Dogfood the hook  [DONE, keep true]

The Selena site should pass 100% of its own AI-readiness checks: AI-crawler
access (robots allows them), JSON-LD present, content server-rendered (the
funnel is static HTML — good), FAQ signal (FAQPage + `?` H2s), `llms.txt`
present, H1 present. Keep this true as the site evolves — it's both a ranking
signal and the proof line in sales calls and the client add-on.

## Phase 2 — Content engine  [DO, 2 seed posts DONE]

Only 2 pages were indexable before (`/`, `/privacy/`). A `/blog/` now exists
with two seed articles; grow it into a small authority hub. Source material is
already written internally — this is repurposing, not research:
`market_research.md`, `pain_signals.csv` (52 sourced signals),
`ICP_AND_SCORING.md`, `winning_offer.md`.

**Two clusters, each post ending in a CTA to `/score/` or `/website-check/`:**

*Cluster A — operator pain (bottom-of-funnel, high intent):*
- [DONE] "Why Bali villas lose direct bookings — and where the money leaks"
- "Villa WhatsApp response time: the number that decides direct vs OTA"
- "Book-direct vs OTA: what actually moves guests to your website"
- "After-hours villa enquiries: the weekend booking gap"
- "Following up on villa enquiries without being annoying"

*Cluster B — AI search readiness (top-of-funnel, differentiated, feeds the tool):*
- [DONE] "Is your villa findable by ChatGPT, Perplexity and Google's AI?"
- "llms.txt for villas and hotels: the file most Bali sites don't have"
- "Structured data (JSON-LD) for villa websites, explained simply"
- "Why your villa site might be invisible to AI assistants (and how to check)"

**Post recipe (reuse the 2 seed posts as templates):** descriptive title +
meta; canonical; `Article` + `FAQPage` JSON-LD; question-style H2s (AI
assistants quote these); internal links to the tool + assessment + homepage;
indexable (no `noindex`); add the URL to `sitemap.xml`.

**Cadence:** 2 posts/week from Week 3 of the 30-day plan; drafts are fast
because the substance already exists in the research docs.

## Phase 3 — Distribution & local  [DO, ongoing]

- The free `/website-check/` tool is the **lead magnet** — link it in outreach
  (the Gravity gift already nods to it), socials, and as every article's CTA.
  It computes AI-readiness and captures nothing until the user opts in.
- **Google Business Profile** for local "villa management Bali" intent.
- **Reviews** — once a client is live, the Guest Feedback & Reviews module
  (`gravity-bali/08_REVIEW_SYSTEM.md`) feeds genuine Google reviews (compliant,
  no gating), which is itself a local-SEO signal.

## Measurement

- **Search Console:** impressions/clicks for the two clusters; indexed page
  count (target ≥4 by day 30, ≥12 by day 60).
- **Plausible/GA4:** `/website-check/` runs started, `/score/` starts from
  organic referrers, blog → tool → assessment path.
- **Leading indicator:** the site's own AI Search Readiness score = "Ready."

## Client-facing secondary — productize the audit

The tool already produces an AI Search Readiness score + sub-checks per site.
Package it as a **paid AI-search-readiness audit / entry offer** sold alongside
Villa Ops OS (same "dogfood then sell" logic as the reviews add-on): run the
tool on the prospect's site, hand them a short branded report of what to fix,
and use it as a low-friction first sale that warms them for the full system.
Draft this one-pager in Week 4.

---

## Files touched this session (foundation)

`index.html` (meta + JSON-LD), `sitemap.xml`, `robots.txt`, new `llms.txt`,
`assets/images/og-image.svg` + new `assets/images/og-image.png`, new `/blog/`
(index + 2 articles). No change to the noindex on `/audit/*`, `/feedback/*`,
`/score/result/*`. `npm test` stays green (76/76).
