/**
 * Evidence screenshot capture — run LOCALLY by the asset owner before sending
 * the audit (the remote build environment cannot reach external websites).
 *
 * Passive capture only: loads public pages, takes screenshots, never submits
 * forms, never sends messages, never creates bookings.
 *
 * Usage:
 *   npm i -D playwright && npx playwright install chromium   (once)
 *   node scripts/capture-evidence.mjs audit/<company-slug>/evidence-plan.json
 *
 * The plan file lists { id, url, device, waitFor?, note } entries; screenshots
 * are written to audit/<company-slug>/assets/shots/<id>-<device>.png so the
 * microsite and deck pick them up without editing any HTML.
 */
import { readFile, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';

const planPath = process.argv[2];
if (!planPath) {
  console.error('Usage: node scripts/capture-evidence.mjs audit/<company-slug>/evidence-plan.json');
  process.exit(1);
}

const { chromium } = await import('playwright').catch(() => {
  console.error('Playwright is not installed. Run: npm i -D playwright && npx playwright install chromium');
  process.exit(1);
});

const plan = JSON.parse(await readFile(planPath, 'utf8'));
const outDir = join(dirname(planPath), 'assets', 'shots');
await mkdir(outDir, { recursive: true });

const DEVICES = {
  desktop: { viewport: { width: 1366, height: 850 } },
  mobile: {
    viewport: { width: 390, height: 844 },
    userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
    isMobile: true, hasTouch: true,
  },
};

const browser = await chromium.launch();
let failures = 0;

for (const shot of plan.shots) {
  const device = DEVICES[shot.device || 'desktop'];
  const ctx = await browser.newContext(device);
  const page = await ctx.newPage();
  const file = join(outDir, `${shot.id}-${shot.device || 'desktop'}.png`);
  try {
    await page.goto(shot.url, { waitUntil: 'networkidle', timeout: 45000 });
    if (shot.waitFor) await page.waitForSelector(shot.waitFor, { timeout: 15000 }).catch(() => {});
    await page.waitForTimeout(1500); // settle animations/lazy images
    await page.screenshot({ path: file, fullPage: !!shot.fullPage });
    console.log(`OK   ${shot.id} (${shot.device || 'desktop'}) ← ${shot.url}`);
    if (shot.note) console.log(`     note: ${shot.note}`);
  } catch (err) {
    failures++;
    console.error(`FAIL ${shot.id}: ${err.message.split('\n')[0]}`);
  }
  await ctx.close();
}

await browser.close();
console.log(failures ? `\n${failures} capture(s) failed — retry or capture manually.` : '\nAll captures done.');
process.exit(failures ? 1 : 0);
