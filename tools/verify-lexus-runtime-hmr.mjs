// Actual app HMR and deliberately broken-loader regression probe; source restored in finally.
import { chromium } from '@playwright/test';
import { readFile, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';

const source = 'src/components/configurator/SpikeViewer.tsx';
const dir = 'docs/review/lexus-l4b-recovery-2026-10-31';
const original = await readFile(source, 'utf8');
const browser = await chromium.launch({ headless: true, args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const report = { browser: browser.version(), console: [], errors: [], mutation: 'Explicitly injected missing KTX2 attachment, not a reproduction of the historical cause' };
const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
page.on('console', m => report.console.push({ type: m.type(), text: m.text() }));
page.on('pageerror', e => report.errors.push(e.stack ?? e.message));
const ready = () => page.waitForFunction(() => window.__autolab?.snapshot().status === 'success' && window.__autolab?.snapshot().renderer?.triangles === 76548, null, { timeout: 60000 });
try {
  await page.goto('http://127.0.0.1:3100');
  await ready();
  const before = report.console.length;
  await writeFile(source, original + '\n// Temporary runtime recovery HMR verification.\n');
  await page.waitForFunction(() => document.querySelector('canvas') !== null);
  const deadline = Date.now() + 30000;
  while (!report.console.slice(before).some(m => m.text.includes('[Fast Refresh] done'))) {
    if (Date.now() > deadline) throw new Error('Fast Refresh completion not observed');
    await new Promise(resolve => setTimeout(resolve, 250));
  }
  await ready();
  report.hmr = await page.evaluate(() => window.__autolab.snapshot());
  assert.equal(report.errors.length, 0);
  await page.screenshot({ path: `${dir}/hot-reload.png` });
  assert.ok(original.includes('loader.setKTX2Loader(ktxRuntime.loader);'));
  await writeFile(source, original.replace('loader.setKTX2Loader(ktxRuntime.loader);', 'loader.setKTX2Loader(null as unknown as typeof ktxRuntime.loader);'));
  await page.waitForTimeout(2000);
  await page.reload();
  await page.waitForFunction(() => window.__autolab?.snapshot().status === 'error', null, { timeout: 60000 });
  report.injectedFailure = await page.evaluate(() => window.__autolab.snapshot());
  assert.match(report.injectedFailure.error, /setKTX2Loader must be called/);
  await page.screenshot({ path: `${dir}/injected-missing-ktx2.png` });
} finally {
  await writeFile(source, original);
  try {
    await page.waitForTimeout(2000);
    await page.reload();
    await ready();
    report.restored = await page.evaluate(() => window.__autolab.snapshot());
  } finally {
    await browser.close();
    await writeFile(`${dir}/hot-reload-and-regression.json`, JSON.stringify(report, null, 2) + '\n');
  }
}
console.log('PASS: actual Fast Refresh, missing-KTX2 injected failure, and restored cold load.');
