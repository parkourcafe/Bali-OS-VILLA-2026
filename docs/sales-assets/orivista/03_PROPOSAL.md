# Proposal — Villa Ops OS for OriVista

To: Manish A., Founder, OriVista (confirm surname before addressing — E13b)
From: Selena Systems · 2026-07-12 · Valid 30 days
Private. Independent of and not endorsed by OriVista or Azure Bali.

## Why we studied OriVista

We audit direct-booking journeys of Bali's best villa operators. OriVista stood
out as one of the most *modern* — a hosted booking engine, dynamic pricing, an
owner dashboard, 8+ OTA channels, and your own materials describe using AI
automation. So this isn't a "you're behind" proposal. Going 0→52 villas in two
years means the funnel had to move fast — and from the outside, the Azure →
OriVista rebrand hasn't fully caught up in the places guests actually touch.
That gap is concrete, publicly visible, and closable in 14 days — **around**
your existing stack, not by replacing it.

## What we found (summary — full audit on your private page)

1. **The rebrand still splits your funnel across two brands.**
   support@azurebali.com is still a public contact; book.azurebali.com listing
   pages are live in parallel with book.orivista.com (identical listing IDs);
   OTA listings still say "by Azure." Direct traffic, SEO and reviews are split
   across two domains. *(Observed on public/indexed pages — the headline
   finding.)*
2. **Your "within 30 minutes" WhatsApp promise has no visible meter.** A great,
   concrete SLA — currently dependent on human staffing. We did NOT test actual
   speed; that needs your data, and we make no claim it is slow.
3. **Office hours end; international enquiries don't.** Mon–Fri 9–5 / Sat–Sun
   9–2 for an 8+-OTA global guest base means an off-hours coverage gap.
4. **Marketing site and booking engine are separate rooms.** No visible
   mechanism carries villa/dates/source from a villa page into WhatsApp.
   *(Inferred; 2-minute joint check on the walkthrough.)*
5. **Review equity is scattered** across the old Azure name and per-villa OTA
   pages — no single OriVista Google profile surfaced. *(Inferred.)*

None of this criticises your team or your automation — internal automation is
invisible from outside; what's visible is the rebrand leak, the unmeasured SLA,
and the off-hours gap. Those are exactly what this layer closes.

## "We already use AI automation" — the honest distinction

Very likely you do, and we're not pitching to replace it. This is a *pre-booking
enquiry-capture and brand-unification layer* that sits in front of your PMS:
it catches every legacy and off-hours path, answers as OriVista in seconds,
qualifies the enquiry, and hands your team (and then your engine) a clean,
source-stamped lead. The proof it's needed is public: two brand domains, an old
email, and "by Azure" OTA names your internal tools haven't reconciled.

## What this may be costing (transparent scenarios, not your numbers)

Anchored only to public facts (52 villas, ~$344/night 4BR): if 200 direct
enquiries/month arrive and 15% go unworked (brand confusion, off-hours silence,
context loss, missed follow-up), recovering a third at 15% conversion ≈ 1.5
extra premium bookings ≈ **~$2,550/month** (ASSUMPTION/SCENARIO — Days 1–2
replace this with your actual PMS/inbox data; conservative case ~$680/month).

## What we propose

**Villa Ops OS** — a 14-day implementation of enquiry capture, response,
follow-up and brand unification *around* your existing team, website and
booking engine:

- AI-assisted WhatsApp first responder in OriVista's tone — instant
  acknowledgement + FAQ answers, 24/7 incl. nights & weekends;
- structured qualification (dates, party, budget band, villa, requests) before
  handoff to your booking engine;
- human handoff — complex, VIP, negotiation, urgent → your team, instantly
  notified; the system never closes deals, people do;
- **brand unification:** capture every legacy path (support@azurebali.com,
  book.azurebali.com, "by Azure" OTA clicks) into one OriVista enquiry front
  door; a 301-redirect map + OTA-name cleanup checklist;
- villa-page → WhatsApp deep links carrying villa + dates + source (both
  domains during the transition);
- one lead pipeline across form / WhatsApp / Instagram / email — statuses,
  named owners, notes — feeding, not replacing, your PMS;
- first-response-time measurement on every enquiry (turns the 30-minute promise
  into a tracked number);
- follow-up reminders + abandoned-enquiry recovery cadence;
- response templates + FAQ base from your real conversations;
- analytics: median first-response time, capture rate, follow-up completion,
  conversion by source/brand — a weekly view;
- shadow mode before launch (your team approves every draft);
- 2 training sessions (Bali & Bhubaneswar), runbook, recorded walkthrough,
  30-day support.

Full day-by-day plan with acceptance gates: `../IMPLEMENTATION_PLAN_14D.md`
(attached when sent). KPI definitions and the controllable/non-controllable
split: `../KPI_FRAMEWORK.md`.

## Delivery highlights

- Days 1–2 validate every integration against your actual booking-engine
  vendor, WhatsApp number type, website stack and both brand domains — nothing
  is promised blind (REQUIRES VALIDATION until then).
- Days 11–12 shadow mode: nothing reaches a guest unreviewed.
- Any failed acceptance gate pauses the calendar, never shrinks scope.
- Rollback at any time: responder pauses in one click; the pipeline still works
  as a manual tool; your PMS is never modified.

## Optional add-on — Guest Feedback & Reviews

A compliant review funnel that also **consolidates your reputation under
OriVista**: a mid-stay check-in catches issues while the guest is still in the
villa (instant service-recovery alert), and happy guests are invited to review
on one OriVista Google profile. We deliberately avoid "review gating" (routing
only happy guests to Google) — it violates Google's policy and risks your
rating; our version gets the same result legitimately and can't be penalised.
**+$1,500** with the 14-day project (or $2,500 standalone later). Details:
`08_REVIEW_SYSTEM.md`.

## A free head-start (yours to keep either way)

Regardless of whether we work together, we've prepared three fixes your team
can apply today at no cost — a WhatsApp away-message that covers off-hours, the
**dual-brand consolidation fix** (301 redirects using your matching listing IDs
+ an old-email auto-reply + an OTA rename template), and a context-carrying
WhatsApp button. See the gift page (`/audit/orivista/gift/`) or
`07_GIFT_KIT.md`.

## Price

**USD 8,500 one-off** for the core 14-day implementation, including the
brand-unification workstream, for your full 52-villa portfolio (add the reviews
module for +$1,500 if you'd like it from the start). 50% to start, 50% at
handover. 30 days of post-launch support included; optional ongoing support
priced separately. No lock-in — the same way you work with your villa owners.

## What is explicitly out of scope

PMS/booking-engine replacement · SEO or ad campaigns · rebrand/visual-identity
design · revenue management / dynamic pricing (you already have it) · a 24/7
human call centre · any revenue guarantee · integrations not yet validated on
your systems · rebuilding your website.

## Next step

A 20-minute walkthrough on your real enquiry flow: we verify the inferred items
together (wa.me behaviour, booking-engine vendor, whether support@azurebali.com
is still live) and show the pipeline working on a live example. Book on your
private audit page (/audit/orivista/) or WhatsApp +62 823-3963-0988.
