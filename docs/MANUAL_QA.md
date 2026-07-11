# Manual QA — Villa Response Readiness Funnel V1

Run on a Netlify deploy preview (real function + real Apps Script test deployment) before launch. Local equivalent: `npm run dev` (mock webhook; `GET /mock-sheet` shows rows).

## Automated coverage already in place

- `npm test` — 36 unit tests: scoring model (incl. the spec's worked example §10.3 and every band boundary 39/40/59/60/79/80), channel-control combinations, tie-breaks, gate logic, WhatsApp normalization, enum/size/UUID/honeypot validation, formula-prefix protection, handler error contract.
- Scripted browser E2E (Playwright, mobile 390×844): Flow A (audit journey incl. authority checkbox enforcement + Sheet upsert), Flow B (playbook journey), Flow C elements (Back preserves answers, refresh restores step), Flow D (webhook outage → retry state, answers preserved, no false success), no-session access to `/score/result/` redirects to `/score/`.

## Manual checklist per release

### Flow A — audit journey (desktop + one phone)
1. Complete assessment as 25+ villas / reservation staff / 5 channels.
2. Result shows score + risk label + 6 bars + disclaimer before CTA.
3. "Test my actual inquiry flow" → modal → submit without checkbox blocked → with checkbox + WhatsApp → "Request received."
4. Sheet: one row, `Audit requested=YES`, `Authority confirmed=YES`, status `Audit requested`.
5. Email received: `ACTION: Live audit requested · [Company]`.
6. Double-click every CTA once — no duplicate rows, no duplicate emails.

### Flow B — playbook journey
1. 2–4 villas / owner → playbook branch (no "not qualified" language anywhere).
2. Request playbook → "within one business day" confirmation; same row updated; playbook email received.

### Flow C — mobile resilience (360×800, 390×844, 430×932)
1. Back through every step — answers preserved.
2. Refresh mid-quiz — current step restored.
3. Complete successfully; no horizontal overflow on any step; 48px tap targets.

### Flow D — API failure
1. Temporarily break `APPS_SCRIPT_WEBHOOK_URL` on a preview (or use `FAIL_WEBHOOK=1` locally).
2. Submit → inline retry copy, answers intact, no result shown; second failure offers WhatsApp fallback (when configured).

### Accessibility
- Keyboard-only full pass (radio via arrows + Continue; modal traps focus; Escape closes).
- Screen reader spot check: step announcements, error `aria-live`, result reads sensibly.
- Reduced motion (OS setting): no animations, final states immediate.
- Contrast: theme tokens pass WCAG AA (verify after any palette change).

### Browsers
Latest stable Chrome, Safari, mobile Safari, Android Chrome — zero console errors.

### Security spot checks
- `curl -X GET /api/lead` → 405; non-JSON POST → 400; >50KB body → 413; filled honeypot → SPAM_REJECTED.
- Company name `=HYPERLINK("x")` renders as text in the Sheet (leading apostrophe).
- View-source: no webhook URL, no secret anywhere in served assets.
- `/score/result/` response carries `X-Robots-Tag: noindex, nofollow`.

## Lighthouse

Run against a **deploy preview** (mobile preset):

```bash
npx lighthouse <preview-url> --preset=perf --form-factor=mobile --screenEmulation.mobile
```

Targets: Performance 90+, Accessibility 95+, LCP ≤ 2.5s, CLS ≤ 0.1.
Status: **not executed in the build sandbox** (external font/analytics domains are blocked there, which invalidates scores). Expected pass rationale: no framework, no images on quiz path, single CSS file, fonts with `display=swap`, analytics deferred/optional. Record real numbers here after the first preview run: ☐ Perf ___ ☐ A11y ___ ☐ LCP ___ ☐ CLS ___
