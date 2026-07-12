# Brief for the next Claude Code session — Higgsfield assets

Read this first. Everything else you need is in this repo on `main`.

## Context (one paragraph)

This repo is the live site for **Villa Ops Response System** by **Selena
Systems** (deployed via Vercel; production domain
`https://villaops.selenasystems.com`). The premium "tropical editorial luxe"
redesign, the two-speed reading pass, and three full-bleed photo-pause
sections are already merged and live. The pauses currently render as dusk
color fields — intentional placeholders waiting for photos.

## Your task

Generate the visual assets with the **Higgsfield MCP connector** (standing
directive: ALL new photo/video for this project is generated via Higgsfield,
no other image tools) and install them:

1. Read `docs/HIGGSFIELD_PROMPTS.md` — it has the exact prompt for each
   asset, palette rules, hard rules (no people/logos/text in frame, 16:9),
   target filenames, and drop-in instructions.
2. Generate the three pause photos → save as `assets/pause-1.jpg`,
   `assets/pause-2.jpg`, `assets/pause-3.jpg` (compress to a sensible web
   size, roughly 200–450KB each).
3. Add each into its matching `.pause` div in `index.html` (the slots are
   marked with `PHOTO PAUSE N (Higgsfield slot: ...)` comments):
   `<img src="assets/pause-N.jpg" alt="" loading="lazy" decoding="async">`
   before the `<p>`. Overlay gradients and scroll parallax activate
   automatically.
4. Optionally: generate the ≤4MB hero loop (prompt in the same file) and
   replace `assets/hero.mp4`.
5. Verify with Playwright (`/opt/pw-browsers/chromium` — see note below):
   pauses render desktop + 390px mobile, text stays readable over the
   images, no console errors. `npm test` must stay 51/51.
6. Commit on a `claude/...` branch, push, open a PR to `main`, merge it
   (Vercel auto-deploys `main`).

## House rules (do not break)

- Never invent copy, testimonials, case studies, contact details, or legal
  info. Existing page text is frozen — verify with a text-extraction diff
  if you touch `index.html`.
- Locked naming: "Villa Ops Response System" by "Selena Systems". Never
  "Guest & Lead Engine", "Villa Ops OS", or other old names.
- No claims of results or verified pipeline anywhere.
- Funnel spec source of truth: `FINAL_TZ_VILLA_RESPONSE_READINESS_V1.md`.

## Environment notes (save yourself an hour)

- Sandbox proxy blocks many external hosts (fonts, cloudfront, vercel.app):
  live-site checks fail from inside the sandbox — that's the environment,
  not the site. Lighthouse font requests can hang ~13s for the same reason.
- Playwright: launch chromium via
  `executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'`;
  it has no H.264 decoder, so videos never play in sandbox tests (checking
  the network request for the .mp4 is enough).
- Local dev: `node scripts/dev-server.mjs` → http://127.0.0.1:8788
  (serves the site + mock funnel API).
