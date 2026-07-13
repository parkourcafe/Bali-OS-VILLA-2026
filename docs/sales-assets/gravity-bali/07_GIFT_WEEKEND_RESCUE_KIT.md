# Gift — Weekend Rescue Kit for Gravity Bali

A free lead-magnet: three copy-and-paste fixes, done for them, no strings.
Two purposes — (1) solve a real problem the same day to earn trust before any
sales call, (2) prove by preview that the deep layer needs the paid system.

- **Interactive web version (send the link):** `/audit/gravity-bali/gift/`
  (noindex; copy buttons; bridges to the demo + walkthrough).
- **This file** is the sendable text version (paste into email/WhatsApp or
  attach as PDF).

Send it in outreach message **M2 or M3** ("Even if we never talk — here are
three fixes your team can do today, free"). Each fix maps to an audit finding,
so the gift reinforces the story instead of scattering it.

---

## Fix 1 — WhatsApp Business greeting/away message (≈2 min, free)

Maps to Finding 03 (weekend/after-hours silence). Set once in the WhatsApp
Business app → Settings → Business tools → Away message + Greeting message.

> Hello, and thank you for reaching out to Gravity Bali 🌴
>
> We’ve received your message and your enquiry matters to us. Our reservations
> team personally prepares every quote, and they’re currently offline — you’ll
> have a reply by 9:00 AM Bali time.
>
> To help us come back to you faster, feel free to share:
> • Which villa you’re interested in
> • Your dates
> • Number of guests
>
> Talk very soon,
> The Gravity Bali team

Honest limit (say this): a fixed auto-reply can’t read the villa/dates, can’t
answer questions, and doesn’t wake anyone. It stops the silence; it doesn’t
handle the conversation.

## Fix 2 — Resolve the weekend contradiction (≈5 min, free)

Maps to Finding 03. Use the SAME paragraph on the Conciergerie page and the
guest FAQ.

**Option A — someone does watch WhatsApp on weekends:**
> Our guest concierge is available every day, including weekends. Messages sent
> outside office hours are acknowledged straight away and answered by our
> on-duty team as quickly as possible — with urgent matters always prioritised.

**Option B — weekends are genuinely quieter (honest, still reassuring):**
> Our concierge team is in the office Monday to Friday. On weekends we still
> watch WhatsApp for anything urgent — you’ll always receive an acknowledgement,
> and your dedicated villa manager is reachable for time-sensitive needs during
> your stay.

## Fix 3 — WhatsApp button that carries villa + dates (≈15 min, their dev, free)

Maps to Finding 04 (context lost between website and WhatsApp). One `<a>` per
villa page; change the villa name and confirm the number.

```html
<a class="wa-enquire"
   href="https://wa.me/6281353704430?text=Hi%20Gravity%20Bali!%20I%27m%20interested%20in%20Villa%20Kelanah.%20My%20dates%3A%20___%20to%20___%2C%20for%20___%20guests.%20(via%20website)"
   target="_blank" rel="noopener">
  Enquire about Villa Kelanah on WhatsApp
</a>
```

Notes: replace `6281353704430` with the reservations WhatsApp (international
format, no +); change `Villa%20Kelanah` per page (`%20` = space); optionally
inject picked dates into `text=` if the page has a date picker.

Honest limit: this carries context into the first message, but nobody records
it, assigns an owner or follows up — that stays manual across inboxes.

---

## Why give it away (the bridge)

These three are pastable because they are the *simple* layer. Enquiries still
leak afterwards because of the layer underneath — no instant context-aware
answer 24/7, no single pipeline, no automatic follow-up, no visibility for the
founders. That is Villa Ops OS, and a snippet can’t do it. Fix 3 is literally
the first brick of the paid build (Days 5–7): if they paste it, they’re already
halfway into the system.

**Bonus, honest note for the pre-send checklist:** confirm `+62 813-5370-4430`
is really the reservations WhatsApp line on their contact page before shipping
the snippet with that number.
