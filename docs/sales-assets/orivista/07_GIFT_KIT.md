# OriVista — free gift kit (the "Rebrand Rescue Kit")

Companion notes to the gift page `audit/orivista/gift/index.html`. Three fixes
OriVista's team can apply today, free, whether or not they engage us. The point
is to give away the *simple* layer and earn trust; the paid layer is the
capture + pipeline + measured SLA they haven't built.

## Fix 1 — WhatsApp away/greeting message (≈2 min, free)

Covers the off-hours gap (F3) and reassures about the rebrand (F1). WhatsApp
Business → Settings → Business tools → Away message (schedule outside 09:00–17:00
wk / 09:00–14:00 wknd) + Greeting message. Copy is on the gift page (`g1`).
**Honest limit:** fixed auto-reply — stops silence, doesn't handle the
conversation.

## Fix 2 — Stop the Azure rebrand from leaking bookings (≈15 min, free) — the headline gift

Three concrete moves, all on the gift page:

- **A · 301-redirect the old booking domain** (`rd`). Because
  book.azurebali.com and book.orivista.com share **identical listing IDs**
  (e.g. 97447), the redirect is a one-liner: `/listings/* →
  https://book.orivista.com/listings/:splat 301!`. Netlify `_redirects` and
  Apache `.htaccess` versions both provided.
- **B · Auto-reply + forward on support@azurebali.com** (`em`) until it's
  retired — so nothing to the old address is missed while it redirects.
- **C · OTA rename request template** (`ota`) — a ready message to send via each
  channel's partner support to drop "by Azure" from listing display names.
  Start with the 2–3 highest-volume OTAs.

**Honest limit:** redirects/auto-replies patch the leak but don't *capture*,
unify or follow up the enquiry — that's the paid system's job.

## Fix 3 — Context-carrying WhatsApp button (≈15 min, free)

A wa.me deep link that pre-fills the villa name into the first message (F4).
On the gift page (`wa`), using the published +62 811-3803-600 in wa.me format
(`628113803600`) — with a note to confirm it's the reservations WhatsApp line
before shipping, and to change the villa name per page. **Honest limit:**
carries context into the first message but nobody records/assigns/follows up —
that's the paid system.

## Why give this away

The reason enquiries still leak after these fixes is the layer underneath: no
instant context-aware answer 24/7, no single pipeline unifying both brands, no
automatic follow-up, no first-response-time visibility next to the PMS. That's
Villa Ops OS, built in 14 days around the existing engine. If the three fixes
help, that's the preview.

## Delivery

Send the gift-page link with M3 (it's linked from the microsite hero and CTA
sections). Analytics: `gift_page_view`, `gift_copy` (per snippet), and
`audit_cta_click` on the gift→demo / gift→walkthrough buttons. Nothing on the
page submits data or contacts anyone.

## Honesty guardrails specific to this gift

- The redirect assumes the listing IDs still match on both domains — verified as
  OBSERVED (E4) but tell them to test on staging first (the page says so).
- The WhatsApp number must be confirmed as the reservations line before the
  button ships (the page says so).
- Do not present any of this as having been done *to* their site — it's copy
  for them to apply. Passive audit only; nothing was changed on their systems.
