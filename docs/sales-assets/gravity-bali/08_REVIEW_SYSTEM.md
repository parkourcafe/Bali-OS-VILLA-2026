# Guest Feedback & Reviews — module + compliance note

An optional Villa Ops OS add-on that turns guest sentiment into (a) faster
service recovery and (b) more genuine public reviews — built the compliant way.

## The idea you asked for — and the one legal change

You described: happy reviews go straight to Google, unhappy ones come to you
privately so you can fix them before checkout.

The "fix before checkout" half is exactly right and is the powerful part.
The "only send happy ones to Google / divert unhappy ones away" half — known
as **review gating** — is **against Google's review policy** and the FTC's
rules on review suppression. Google can remove your reviews or your star
rating if it detects gating, which would hurt the very asset you're trying to
grow. Marketing tools that sell "1–3 stars go to a private form, 4–5 stars go
to Google" are selling a policy violation.

So we build the version that gets you the same outcome legitimately:

1. **Catch problems during the stay, not after.** A quiet mid-stay check-in
   ("how is everything, 1–5?") surfaces issues while the guest is still in the
   villa and you can still fix them. This is genuine service — not review
   manipulation.
2. **Low rating → instant private service-recovery alert.** Your team is
   notified immediately with the villa, the issue and the guest's WhatsApp, and
   resolves it before checkout. A fixed problem usually becomes a happy guest.
3. **Happy guest → public review invite.** After a good (or recovered) stay,
   the guest is invited to post publicly on Google.
4. **Nobody is blocked from posting publicly.** Even an unhappy guest is shown
   a "you can still leave a public review" link. We never suppress a review —
   we earn a better one by fixing the problem. This is the line that keeps you
   compliant.

Net effect: fewer bad experiences reach checkout, more real 5★ reviews, and
zero policy risk. It is a stronger funnel than gating — and it can't be
penalised.

## They already do this post-stay — here's our differentiation

Re-audit (2026-07-13) found Gravity already runs a review method: a **post-stay
structured feedback form**, concerns "flagged and followed up directly by the
team," plus proactive **pre-arrival** engagement (page:
`/improving-guest-reviews-the-gravity-bali-method/`). So this add-on is **not
net-new** — it's four upgrades to what they already believe in:

1. **Mid-stay, not just post-stay** — catch issues *before checkout*, when they
   can still be fixed, instead of learning about them after the guest has left.
2. **Real-time recovery alerts** — a low rating pings the team instantly with
   villa + issue + contact, versus a form reviewed later.
3. **WhatsApp-native + automated** — sent through the same responder, in their
   tone, at the right moment; no manual form-chasing.
4. **Compliance-safe by construction** — and worth a direct conversation:
   **verify whether their current "flag concerns / follow up directly" flow
   steers unhappy guests away from public review.** If it does, that is review
   gating (a Google-policy risk), and this module fixes it while keeping the
   recovery benefit.

Pitch line: "You already treat reviews as a growth engine — we make that engine
real-time, automatic on WhatsApp, and safe from Google's gating penalties."

## What's built (in this repo)

- **Endpoint:** `POST /api/feedback` (`netlify/functions/feedback.mjs` +
  `api/feedback.mjs` Vercel adapter). Every rating stored; rating ≤ 3 →
  `route: "recovery"`, rating ≥ 4 → `route: "promote"`. The public review URL
  is returned on **both** routes. No success is reported unless the webhook
  saved the row (same contract as the other forms). 9 tests.
- **Storage + alerts:** Apps Script `handleGuestFeedback_` → new **Guest
  Feedback** sheet tab + email; low ratings get a `🚨 SERVICE RECOVERY` alert.
- **Guest page:** `/feedback/` — star rating, adaptive prompt, contact field
  only on low ratings, loading/error/success states, `noindex`. Personalise
  with query params: `/feedback/?brand=Gravity%20Bali&villa=Villa%20Kelanah&guest=Sofia&stage=mid_stay`.
- **In the demo:** scenario 4 at `/audit/gravity-bali/demo/` plays the whole
  mid-stay-recovery → 5★ story.

## How Gravity would use it

- Send the mid-stay link on day 2 via the WhatsApp responder (built in the
  core 14 days), and the checkout link on departure day.
- `stage=mid_stay` reframes the question to "how is your stay so far?" so it
  reads as care, not a review ask.
- Configure the public review link once: `GOOGLE_REVIEW_URL` env var — get it
  from Google Maps → your business → Share → "write a review" (looks like
  `https://g.page/r/XXXX/review`). Until it's set, the promote path simply
  thanks the guest (no broken link).

## Positioning & price

Offered as an **add-on**, so the core enquiry system stays one clean $7,500
decision:

> **Guest Feedback & Reviews add-on — +$1,500** (with the 14-day project) or
> **$2,500** as a standalone later. Includes the mid-stay + checkout flows,
> recovery alerts, the review invite, the feedback dashboard, and staff
> training on service recovery.

TARGET, not a promise: this improves *how fast issues are caught and how many
happy guests are asked* — the number and quality of reviews still depend on
the actual stay. Never promise a star-rating outcome.
