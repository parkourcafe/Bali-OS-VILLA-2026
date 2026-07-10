# Site Pre-Launch Fixes — Selena Systems GTM v1.0

Use this document as the exact implementation brief before sending the landing page to villa operators.

Do not do new market research.
Do not discover new companies.
Do not change the offer, ICP, SLA, pricing, or legal assumptions.
Use the existing Selena Systems GTM v1.0 package as source of truth.

## Source of truth

- Offer name: **Villa Ops Response System**
- Brand: **Selena Systems**
- Subtitle: **AI guest inquiry, qualification and follow-up system for Bali villa management companies**
- Primary source files:
  - `landing_page_copy.md`
  - `winning_offer.md`
  - `ICP_AND_SCORING.md`
  - `proposal_template.md`
  - `delivery_process.md`
  - `EXECUTION_DASHBOARD.md`

## Critical blocker

Do not send the site in outreach until the lead form sends data to a real destination and shows a confirmation state.

Current suspected issue: the form may be a plain HTML form with `method="get"` and `action="/"`, which can reload the page or append data to the URL without sending the lead anywhere.

## P0 — Connect the lead form

The form must submit to a real lead destination.

Acceptable options:

1. Tally, Typeform, or Google Form embed/button.
2. Formspree, Basin, Getform, or equivalent email-backed endpoint.
3. Vercel API route or server action that sends the lead to email, Google Sheet, Airtable, Telegram, Notion, or CRM.

Minimum captured fields:

- Name
- Company
- Role
- WhatsApp number
- Email, if provided
- Website/listing link
- Number of villas or properties
- Main inquiry-response problem

Required thank-you state:

> Thank you — we will review one real inquiry scenario and send your audit within 24–48 hours.

Acceptance criteria:

- Submitting the form creates a real lead record or email.
- User sees the thank-you state without confusion.
- Empty required fields are validated.
- No form data is exposed in the URL.

## P0 — Add metadata for link previews

Add proper metadata for WhatsApp, Telegram, LinkedIn, and X/Twitter previews.

Required tags:

```html
<link rel="canonical" href="https://bali-os-villa-2026.vercel.app/" />

<meta property="og:title" content="Villa Ops Response System — Selena Systems" />
<meta property="og:description" content="AI guest inquiry, qualification and follow-up system for Bali villa management companies." />
<meta property="og:image" content="https://bali-os-villa-2026.vercel.app/og-image.jpg" />
<meta property="og:type" content="website" />

<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Villa Ops Response System — Selena Systems" />
<meta name="twitter:description" content="AI guest inquiry, qualification and follow-up system for Bali villa management companies." />
<meta name="twitter:image" content="https://bali-os-villa-2026.vercel.app/og-image.jpg" />
```

If a custom domain is connected, replace the canonical and image host with the custom domain.

## P1 — Custom domain

Recommended domain or subdomain:

- `villaops.selenasystems.com`
- `audit.selenasystems.com`

The Vercel preview URL is acceptable for internal testing, but outreach should use a branded domain where possible.

## P1 — Add demo WhatsApp CTA

The page mentions a demo the prospect can message. Add an explicit button:

> Message the demo on WhatsApp

The button should open WhatsApp with a prefilled message:

```text
Hi, do you have a 3-bedroom villa in Canggu for July 12–15?
```

Important: use a safe demo number or sandbox, not a production client number.

Add 2–3 example prompts near the button:

- Do you have a 3-bedroom villa in Canggu for July 12–15?
- Is airport pickup included?
- Can I check in late at night?

## P1 — Add Privacy and Contact

If the site collects WhatsApp, email, or company details, add footer links:

- Privacy
- Contact

Minimum privacy content:

- who collects the data: Selena Systems;
- why it is collected: to review inquiry-response fit and send the free audit;
- response timeframe: 24–48 hours where feasible;
- data is not sold;
- how to request deletion or contact removal.

## P1 — Explain the free AI Audit deliverable

Add a block titled:

## What you receive

Recommended copy:

In your free AI Audit, you receive:

1. A 3-minute video reviewing one real inquiry scenario.
2. The first response we would automate.
3. The qualification questions your team should collect.
4. The follow-up sequence we would install.
5. A clear yes/no recommendation on whether the system fits your operation.

Keep the audit language careful: one inquiry scenario is a signal, not proof of systemic failure.

## P2 — Simplify hero

Recommended hero:

**Headline:**

Stop losing villa inquiries after hours.

**Subhead:**

An AI response and follow-up system for Bali villa operators — WhatsApp, website, Instagram, email and OTA inboxes — installed in 14 days.

**Proof line:**

95% of eligible new inquiries answered within 2 minutes, tested against 40 scenarios before final payment.

**CTA:**

Book a free AI Audit

## Required constraints

- Do not use old names: Guest & Lead Engine, Villa Ops OS, Guest & Booking Response System, Selena Guest & Lead Engine.
- Do not claim completed case studies.
- Do not claim verified pipeline.
- Do not claim the 40-scenario suite has already been executed.
- Do not claim revenue, occupancy, or booking guarantees.
- Do not say one mystery-shop result proves systemic failure.
- Use the SLA exactly: 95% of eligible new inquiries on covered channels receive a first automated response within two minutes.
- Include exclusions where the SLA appears: Meta/BSP/PMS/hosting/internet/third-party outages, spam/duplicates, unsupported channels, out-of-scope messages, mandatory human-review cases, client-side access/configuration failures.

## Done definition

The site is ready for outreach only when:

- form submission reaches a real destination;
- thank-you state works;
- Open Graph preview works with title, description, and image;
- demo WhatsApp CTA is either working or explicitly hidden until ready;
- Privacy and Contact are present;
- free AI Audit deliverable is clear;
- hero is clear and consistent with Selena Systems GTM v1.0.
