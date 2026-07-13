# Deploy guide — Villa Ops OS sales asset (Gravity Bali)

Goal: make the private audit, demo, gift, booking form and feedback module
live at real URLs on a domain, so they can be shared with Gravity Bali.
Everything is static + serverless — no build step, no framework.

Two hosts work identically (same 4–5 env vars, same `/api/*` handlers). Pick
one. **Do not connect the production domain until you've done the pre-send
checklist in `sales-assets/gravity-bali/06_QA_REPORT.md`.**

## 0. One-time backend (Google Sheet + Apps Script) — ~15 min

Follow README §"Google Sheet + Apps Script setup". It creates the webhook that
receives leads, demo requests **and** guest feedback. The three tabs
(`Inbound Audit Leads`, `Demo Requests`, `Guest Feedback`) are created
automatically on first write. Re-deploy the Apps Script after pasting the
updated `Code.gs` (it now handles `demo_requested` and `guest_feedback`).

## 1. Environment variables (both hosts)

| Var | Value |
|---|---|
| `APPS_SCRIPT_WEBHOOK_URL` | the Apps Script `/exec` URL |
| `APPS_SCRIPT_SHARED_SECRET` | same string as the Apps Script `SHARED_SECRET` |
| `ALLOWED_ORIGIN` | your production origin, e.g. `https://villaops.example.com` (comma-add the deploy-preview origin if you QA on previews) |
| `IP_HASH_SALT` | any long random string |
| `GOOGLE_REVIEW_URL` | *(optional, for the reviews add-on)* the client's Google "write a review" link; leave empty until they provide it |

Also set the public config in `assets/js/site-config.js` (committed, not env):
`WHATSAPP_PUBLIC_URL`, `CONTACT_EMAIL`, and one of `PLAUSIBLE_DOMAIN` /
`GA4_MEASUREMENT_ID` to turn on analytics. `GOOGLE_REVIEW_URL` is read
server-side from env; the client falls back gracefully if unset.

## 2a. Vercel

1. Import the repo (or `vercel` CLI). `vercel.json` already sets clean URLs,
   trailing slashes, security headers and `noindex` for `/audit/*`,
   `/feedback/*`, `/score/result/*`. `/api/*.mjs` auto-route.
2. Project Settings → Environment Variables → add the vars from §1 → redeploy.
3. Deploy the branch `claude/villa-ops-bali-sales-vwmqdj` (or merge to main).

## 2b. Netlify

1. Connect the repo → Netlify reads `netlify.toml` (publish root, functions
   dir, `/api/lead`, `/api/demo-request`, `/api/feedback` rewrites, headers,
   noindex).
2. Site settings → Environment variables → add the vars from §1.
3. Every branch push builds a **deploy preview** — use previews for QA before
   connecting the production domain.

## 3. Smoke test on a preview URL (before going live)

```bash
BASE=<your-preview-url>
# demo booking (expect ok:true + requestId; check Demo Requests tab)
curl -s -X POST $BASE/api/demo-request -H 'Content-Type: application/json' -d @docs/sample-demo-request.json
# guest feedback promote (expect route:"promote" + reviewUrl; check Guest Feedback tab)
curl -s -X POST $BASE/api/feedback -H 'Content-Type: application/json' -d @docs/sample-feedback.json
```

Then in a browser:
- `/audit/gravity-bali/` renders; response headers include `X-Robots-Tag: noindex`.
- `/audit/gravity-bali/demo/` plays scenario 1 (and 4) end-to-end.
- `/audit/gravity-bali/gift/` copy buttons work.
- `/feedback/?brand=Gravity%20Bali&villa=Villa%20Kelanah&stage=mid_stay` —
  2★ shows the recovery screen, 5★ shows the review CTA (only if
  `GOOGLE_REVIEW_URL` is set).
- Submit one real test on each form, confirm the Sheet rows, then delete/mark
  them TEST.

## 4. URLs to share (after QA is green)

| What | URL |
|---|---|
| Private audit microsite | `/audit/gravity-bali/` |
| Interactive demo | `/audit/gravity-bali/demo/` |
| Free gift (Weekend Rescue Kit) | `/audit/gravity-bali/gift/` |
| Audit deck (open, "Save as PDF") | `/audit/gravity-bali/deck/` |
| Guest feedback (product component) | `/feedback/?brand=…&villa=…&stage=…` |

Add UTM params when sharing, e.g.
`/audit/gravity-bali/?utm_source=whatsapp&utm_medium=outreach&utm_campaign=gravity-audit`.

## Notes

- Nothing here is indexed (`noindex` meta + `X-Robots-Tag` + `robots.txt`
  Disallow + no public links). Share links privately.
- Local dev / full QA without deploying: `npm run dev` →
  `http://127.0.0.1:8788` (real functions + in-memory mock webhook;
  `/mock-demo-sheet`, `/mock-feedback-sheet` expose captured rows;
  `FAIL_WEBHOOK=1 npm run dev` simulates an outage to prove no fake success).
- Screenshots for the audit/deck are captured locally with
  `node scripts/capture-evidence.mjs audit/gravity-bali/evidence-plan.json`
  (needs network to gravitybali.com — run on your own machine).
