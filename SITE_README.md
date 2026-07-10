# Website — Villa Ops Response System (Selena Systems)

Single-file static site: `index.html`. No build step, no dependencies beyond Google Fonts (system-font fallbacks included). Content source of truth: Selena Systems GTM v1.0 (`landing_page_copy.md`, `winning_offer.md`, `ICP_AND_SCORING.md`, `proposal_template.md`, `delivery_process.md`, `EXECUTION_DASHBOARD.md`).

## Launch instructions

0. **Hero video:** the hero currently streams the generated clip from the Higgsfield CDN (fallback chain: `assets/hero.mp4` → CDN URL → static scene). For reliability, download the clip from your Higgsfield library, commit it as `assets/hero.mp4` plus a frame as `assets/hero-poster.jpg` — the local file automatically takes over. Video loads on desktop only (≥900px); phones get the light poster/scene by design.
1. **Set lead delivery** (required before outreach): in `index.html`, find the `CONFIG` block at the top of the `<script>` section and fill in at least one real delivery destination:
   - `FORM_ENDPOINT` — preferred. Use a Formspree/Basin/Getform endpoint or a Vercel API route/server action that sends the lead to email, Google Sheet, Airtable, Telegram, Notion, or CRM.
   - `CONTACT_EMAIL` — the business email that receives audit requests
   - `CONTACT_WHATSAPP` — WhatsApp number, digits only (e.g. `62812xxxxxxx`)
   Until one of these is set, the form prepares copyable text and shows a visible error. It does not use GET and does not expose lead data in the URL.
2. **Set demo WhatsApp** (optional but recommended): fill `DEMO_WHATSAPP` with a safe demo number or sandbox. Until this is set, the demo button is disabled and labeled "Demo WhatsApp coming soon."
3. **Check link previews:** `index.html` includes canonical, Open Graph, Twitter card, and `assets/og-image.svg`. If a custom domain is connected, update the canonical URL and OG image URL.
4. **Preview locally:** open `index.html` in a browser, or `python3 -m http.server` in the repo folder.
5. **Publish (when you decide to):** GitHub Pages (Settings → Pages → deploy from branch, root) or any static host (Netlify/Vercel drag-and-drop). No domain is purchased or configured by this package.
6. Per `EXECUTION_DASHBOARD.md`, sales conversations are blocked until the demo system exists and the local contracting checklist is resolved — publishing the site is a founder decision gated on the same checklist.

## Content rules enforced on this site

- Brand: **Selena Systems**; offer: **Villa Ops Response System** (no legacy offer names anywhere).
- Promise stated exactly: *95% of eligible new inquiries on covered channels receive a first automated response within two minutes* — always shown together with the exclusions (Meta/BSP/PMS/hosting/internet/third-party outages; spam/duplicates; unsupported channels; out-of-scope messages; mandatory human-review; client-side access/configuration failures).
- Pricing: Pilot $1,500–2,500 · Core $5,000 · Growth $7,500–9,500 · Enterprise from $12,000; 50/50 terms; client pays running costs; care plan from $400/mo.
- ICP: Bali villa management companies, ideally 20–60 villas, minimum 15 premium / ~30 standard.
- No case studies, testimonials, results, verified-pipeline claims, or completed-test claims. All chat conversations on the page are labeled **"Demo scenario"**. The 40-scenario suite is described as *required acceptance tests*, not tests already run.
- Local partner mentioned only as: delivery "supported by an established local partner company"; contracting structure "confirmed before signing" (details pending per `assumptions.md`).

## Test checklist

- [ ] Mobile (≤680px): sticky bottom CTA appears; nav collapses to logo + CTA; all grids stack.
- [ ] Reduced motion (OS setting): no animations, content fully visible.
- [ ] Form: submit with empty required fields → red borders, no navigation.
- [ ] Form with `FORM_ENDPOINT` set → endpoint receives a lead and the page shows the 24–48h thank-you state.
- [ ] Form fallback with only `CONTACT_WHATSAPP` or `CONTACT_EMAIL` set → WhatsApp/mail app opens; with no destination set → visible error + copyable text.
- [ ] Link preview: WhatsApp/Telegram/LinkedIn preview shows title, description, and image.
- [ ] Demo CTA: disabled until `DEMO_WHATSAPP` is set; opens prefilled WhatsApp message when configured.
- [ ] All anchor links (`#system`, `#process`, `#fit`, `#pricing`, `#faq`, `#audit`) scroll correctly.
- [ ] No console errors; page renders with fonts blocked (fallback serif/sans).

## Assumptions & hidden backlog

- English-only for v1 (buyers are internationally oriented operators). A Russian/Indonesian version is backlog.
- No analytics installed (nothing to configure yet); add a privacy-respecting counter (e.g. Plausible) at launch — backlog.
- Separate full legal terms page — backlog. The current page includes minimum Privacy / Contact content and footer links.
- No stock or generated photos are used — the visual world is CSS/SVG; real project photography can replace the hero scene later.

## Preserved routes

The repo had no prior site — nothing was broken. `final_recap.html` (internal GTM recap) is untouched and not linked from the public page.
