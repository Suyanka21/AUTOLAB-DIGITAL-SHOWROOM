import { expect, test } from "@playwright/test";

test("approved welcome provides immediate direct studio entry without a second renderer", async ({ page }) => {
  await page.goto('/splash');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText(/An interior.[\s\S]*A signature.[\s\S]*Yours/);
  await expect(page.getByRole('link', { name: 'Create your interior' })).toHaveAttribute('href', '/');
  await expect(page.locator('canvas')).toHaveCount(0);
  await expect(page.getByAltText('AutoLab').first()).toBeVisible();
  await expect(page.locator('body')).not.toContainText(/Suyanka|Loading agent|\d+%/);
  await page.emulateMedia({ reducedMotion: 'reduce' });
  expect(await page.evaluate(() => document.getAnimations().filter(a => a.playState === 'running').length)).toBe(0);
});

test("editorial workbench retains one live viewer and all four camera presets", async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { level: 1 })).toHaveText('Make it personal.');
  await expect.poll(() => page.evaluate(() => window.__autolab?.snapshot().status), { timeout: 60000 }).toBe('success');
  await expect(page.locator('canvas')).toHaveCount(1);
  const canvas=await page.locator('canvas').elementHandle();
  for (const name of ['Driver Hero','Cabin Pair','Cockpit & Dash','Stitch Detail']) {
    await page.getByRole('button', {name, exact:true}).click();
    await expect(page.getByRole('button', {name, exact:true})).toHaveAttribute('aria-pressed','true');
    expect(await canvas!.evaluate(el=>el.isConnected)).toBe(true);
  }
  expect(await page.evaluate(()=>Object.keys(window.__autolab!.snapshot().materialState!.colors).length)).toBe(7);
});
