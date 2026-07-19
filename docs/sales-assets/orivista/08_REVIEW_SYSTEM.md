# OriVista — Guest Feedback & Reviews add-on (compliant)

Optional add-on to the 14-day core. Reuses the shipped, tested feedback module
(`/feedback/`, `netlify/functions/feedback.mjs`, Apps Script `guest_feedback`
handler) — no new engineering for OriVista beyond tone/branding config.

## The OriVista-specific angle: consolidate reputation under one brand

OriVista's review equity is currently **scattered** (Finding F5): no
consolidated Google Business profile under "OriVista" surfaced (only a
Waze/Places pin "OriVista (Azure Bali)"), and guest ratings live per-villa on
OTA pages — many still "by Azure." So the add-on does double duty here: it
improves service *and* rebuilds reputation under **one OriVista Google
profile** as the rebrand completes.

## What it does (same compliant design as the core module)

1. **Mid-stay check-in** (WhatsApp, day 2): "How is your stay at Villa Kenza so
   far? Tap 1–5 ⭐." Catches problems *while the guest is still in the villa*.
2. **Low rating (≤3) → instant service-recovery alert** to the team; fix before
   checkout.
3. **Good or recovered stay (≥4) → public review invite** to the **one OriVista
   Google profile**.
4. **Feedback dashboard:** ratings, recovery rate, review conversion.

## The compliance line (non-negotiable)

We do **not** build "review gating" (sending only happy guests to Google,
hiding unhappy ones). That violates Google's policy and risks the rating. Our
version invites **everyone** after a good or recovered stay and never blocks a
low-rating guest from posting publicly — it just makes sure the team gets to
*fix* the problem first. Same commercial result, penalty-proof. This is
enforced in code: `netlify/functions/feedback.mjs` returns the public review
link on **both** the recovery and promote routes (covered by the feedback
tests — no gating path exists).

## What it is NOT

- Not a promise of a star rating or a review count.
- Not a way to suppress negative reviews.
- Not a replacement for OTA review systems — it consolidates *your own*
  first-party reputation under OriVista.

## Price

**+$1,500** with the 14-day project (or $2,500 standalone later). Improves how
fast issues are caught and how many happy guests are asked — never a promised
rating.

## Setup for OriVista (delivery)

- Point the review invite at the (new or claimed) **OriVista** Google Business
  profile — creating/claiming it is a prerequisite; flag on Days 1–2.
- Tone/branding config only; reuse the tested module. Shadow-mode the mid-stay
  message before it reaches a real guest.
- Demo: scenario 4 in `/audit/orivista/demo/` plays the recovery → 5★ flow,
  explicitly landing the review on the OriVista profile.
