# Villa Response Readiness Funnel — V1

Lead-generation funnel for **Selena Systems**: a 90-second self-assessment that produces a **Villa Response Readiness Score**, routes qualified Bali villa operators to a **Live Guest Inquiry Audit**, and owner-operated portfolios to the **Villa Response Playbook** — the bridge to the paid **Villa Ops Response System**.

Source of truth: `FINAL_TZ_VILLA_RESPONSE_READINESS_V1.md` (spec). Implementation notes: `IMPLEMENTATION_NOTES.md`.

## Stack

Static HTML/CSS/vanilla ES modules (no framework) · Netlify Function (`/api/lead`) with canonical server-side scoring · Google Apps Script webhook → Google Sheet + email · Plausible or GA4 (optional, no PII).

```text
/                     landing        /score/            12-step assessment
/score/result/        result + gate  /privacy/          privacy notice
netlify/functions/lead.mjs           canonical API
google-apps-script/Code.gs           Sheet upsert + MailApp
assets/js/scoring.js                 LOCKED scoring rules (shared browser/server)
assets/js/site-config.js             editable public config (placeholders)
docs/                                operations, QA, content editing
tests/                               node --test suite
scripts/dev-server.mjs               local static + real function + mock webhook
```

## Local development

```bash
npm test          # 38 unit tests: scoring, gate, validation, vercel adapter
npm run dev       # http://127.0.0.1:8788 — full funnel with in-memory mock webhook
# GET /mock-sheet shows captured rows; FAIL_WEBHOOK=1 npm run dev simulates outage
```

No dependencies to install: tests use Node's built-in runner (Node 18+).

## Google Sheet + Apps Script setup (one time, ~15 minutes)

1. **Create the Sheet.** Google Drive → new spreadsheet → rename a tab to `Inbound Audit Leads`. Copy the ID from its URL (`docs.google.com/spreadsheets/d/<SHEET_ID>/…`). Headers are created automatically on first write.
2. **Create the Apps Script project.** In the Sheet: Extensions → Apps Script → replace the default file contents with `google-apps-script/Code.gs`.
3. **Add Script Properties.** Project Settings → Script Properties:
   - `SHARED_SECRET` — long random string (e.g. `openssl rand -hex 32`)
   - `SHEET_ID` — from step 1
   - `SHEET_NAME` — `Inbound Audit Leads`
   - `NOTIFICATION_EMAIL` — where lead emails go
4. **Deploy as web app.** Deploy → New deployment → type *Web app* → **Execute as: Me** · **Who has access: Anyone** → Deploy → copy the `/exec` URL. (Authorize the MailApp/Sheets permissions when prompted; run `selfTest` from the editor once to verify.)
5. **Set Netlify environment variables** (Site settings → Environment variables; template in `.env.example`):
   - `APPS_SCRIPT_WEBHOOK_URL` = the `/exec` URL
   - `APPS_SCRIPT_SHARED_SECRET` = the same value as `SHARED_SECRET`
   - `ALLOWED_ORIGIN` = your production origin (e.g. `https://example.com`)
   - `IP_HASH_SALT` = another long random string
6. **Test with a sample request** against a deploy preview:
   ```bash
   curl -X POST <preview-url>/api/lead -H 'Content-Type: application/json' -d @docs/sample-score-request.json
   ```
   Expect `{"ok":true,"leadId":"…","result":{…}}`, one new Sheet row, one email.
7. **Rotate the shared secret** whenever needed: set a new value in Script Properties AND Netlify env, then redeploy the Apps Script (Deploy → Manage deployments → Edit → new version).

## Deploy: Vercel or Netlify

The same `/api/lead` runs on either host — the canonical logic lives once in
`netlify/functions/lead.mjs`; `api/lead.mjs` is a thin Vercel adapter that reuses it.

### Vercel (keeps your existing project)

- `vercel.json` configures clean URLs, trailing-slash routes, security headers and the
  noindex header for `/score/result/`. Vercel auto-routes `/api/lead` to `api/lead.mjs`.
- Set the four environment variables in **Project Settings → Environment Variables**
  (same names as `.env.example`): `APPS_SCRIPT_WEBHOOK_URL`, `APPS_SCRIPT_SHARED_SECRET`,
  `ALLOWED_ORIGIN`, `IP_HASH_SALT`. Redeploy after setting them.
- Note: deploying this branch makes the funnel the site root (`index.html`). The previous
  marketing landing is preserved at `legacy/villa-ops-landing-v0.html`.

## Netlify deployment

- Connect the repo → Netlify auto-reads `netlify.toml` (publish root, functions dir, `/api/lead` rewrite, security headers, noindex for the result page).
- Every branch push creates a **deploy preview** — use previews for QA.
- **Do not connect or publish the production domain until Selena explicitly decides to launch** (spec §26). The launch checklist below must be green first.

## Launch checklist (values only Selena can provide — placeholders live in `assets/js/site-config.js` and `.env.example`)

- [x] `WHATSAPP_PUBLIC_URL` — public WhatsApp link (used in footer + retry fallback): `https://wa.me/6282339630988`
- [ ] `CONTACT_EMAIL` and `PRIVACY_CONTACT_EMAIL`
- [ ] `CALENDAR_URL` — 15-minute call booking link
- [ ] `LEGAL_ENTITY_NAME` — entity named on the privacy page (lawyer-reviewed text)
- [ ] Analytics: `PLAUSIBLE_DOMAIN` **or** `GA4_MEASUREMENT_ID` (leave both empty to disable)
- [ ] Netlify env vars set (step 5 above); Apps Script deployed (step 4)
- [ ] Villa Response Playbook file exists or manual WhatsApp delivery confirmed
- [ ] `sitemap.xml` `<loc>` values replaced with absolute production URLs; OG image reviewed
- [ ] Production domain connected (explicit decision)
- [ ] Manual QA pass per `docs/MANUAL_QA.md` on a deploy preview

## Instant Website Check (`/website-check/`) — bonus tool

A free, standalone auditor: a visitor enters any villa website and gets an instant report on
load speed (Google PageSpeed), mobile-friendliness, how Google & AI assistants read it, and
whether guests can reach them, plus a headline **AI Search Readiness** score (can ChatGPT / Perplexity / Google AI read and cite the site: crawler access, structured data, server-rendered content, FAQ/Q&A, llms.txt). It bridges to the readiness funnel ("fast website ≠ fast replies").

- Core logic: `lib/site-audit.mjs` (pure parsers + PageSpeed call; unit-tested with fixtures).
- API: `api/site-audit.mjs` (Vercel) and `netlify/functions/site-audit.mjs` (parity) — `GET|POST /api/site-audit?url=…`.
- Page: `website-check/index.html` + `assets/js/site-check.js`.
- **Config:** set `PAGESPEED_API_KEY` (free Google key) in the host's env for reliable speed
  scores; without it the speed check may be rate-limited but the other checks still run.
- **Honesty guardrails baked in:** it checks the public home page only, never logs in or reads
  private data, does NOT claim Google index coverage (impossible without the owner's Search
  Console), and states plainly that it does not measure guest-reply speed. Best-effort SSRF
  guard blocks private/internal hosts (`isPublicHost`).
- **Scope note:** this is a V2-style feature the funnel spec deferred; it lives alongside the
  funnel, not inside it, and uses none of the funnel's locked "Readiness" naming.

## Documentation

- `docs/AUDIT_OPERATIONS.md` — manual Live Guest Inquiry Audit protocol (hard gates, scripts, report templates)
- `docs/MANUAL_QA.md` — E2E flows, browser matrix, Lighthouse instructions
- `docs/CONTENT_EDITING.md` — what marketing may edit vs. what is locked
