import { chromium, expect } from '@playwright/test';
import { writeFile } from 'node:fs/promises';

const dir = 'docs/review/lexus-l4b-recovery-2026-10-31';
const browser = await chromium.launch({ headless: true, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const report = { browser: browser.version(), errors: [], warnings: [], requests: [], treatments: [] };
try {
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  page.on('pageerror', e => report.errors.push(e.stack ?? e.message));
  page.on('console', m => { if (m.type() === 'error') report.errors.push(m.text()); if (m.type() === 'warning') report.warnings.push(m.text()); });
  page.on('response', r => { if (/\/basis\/|\/draco\/|\.glb/.test(r.url())) report.requests.push(`${r.status()} ${r.url()}`); });
  await page.goto('http://127.0.0.1:3101');
  await expect(page.getByTestId('viewer-status')).toHaveCount(0, { timeout: 60000 });
  await expect(page.getByTestId('spike-viewer').locator('canvas')).toBeVisible();
  expect(await page.evaluate(() => typeof window.__autolab)).toBe('undefined');
  await expect(page.getByRole('button', { name: /Book Bespoke Consultation/ })).toBeDisabled();
  for (const kind of ['classic', 'diamond', 'perforated']) {
    if (kind !== 'classic') {
      await Promise.all([
        page.waitForResponse(r => r.url().includes(`interior-l4-${kind}.glb`) && r.status() === 200),
        page.getByTestId(`treatment-${kind}`).click(),
      ]);
    }
    await expect(page.getByTestId('viewer-status')).toHaveCount(0, { timeout: 60000 });
    await expect(page.getByTestId('svg-fallback')).toBeHidden();
    await page.getByRole('button', { name: 'Cabin Pair', exact: true }).click();
    await page.waitForTimeout(300);
    await page.screenshot({ path: `${dir}/production-${kind}.png` });
    report.treatments.push(kind);
  }
  expect(report.errors).toEqual([]);
  for (const resource of ['/basis/basis_transcoder.wasm', '/draco/draco_decoder.wasm']) {
    expect(report.requests.some(r => r.startsWith('200 ') && r.includes(resource))).toBe(true);
  }
  report.testHooks = 'Absent in normal production build';
  report.consultation = 'Disabled without configured number; no messages sent';
} finally {
  await browser.close();
  await writeFile(`${dir}/production-browser.json`, JSON.stringify(report, null, 2) + '\n');
}
console.log('PASS: normal production build renders all three treatments; local decoders 200; no JS errors; test hooks absent.');
