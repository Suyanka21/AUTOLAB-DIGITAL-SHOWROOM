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

test("specification reveal preserves the live canvas, reference, copy and accessible Spec Sheet", async ({page})=>{
  await page.goto('/');
  await expect.poll(()=>page.evaluate(()=>window.__autolab?.snapshot().status),{timeout:60000}).toBe('success');
  const canvas=await page.locator('canvas').elementHandle();
  await page.getByRole('button',{name:'Your specification',exact:true}).click();
  await expect(page.getByRole('heading',{level:1})).toHaveText('A signature, considered in detail.');
  const code=await page.getByTestId('reference-code').innerText();
  expect(code).toMatch(/^AL-RX-2026-[A-Z2-9]{4}$/);
  await page.getByRole('button',{name:'Copy Code',exact:true}).click();
  await expect(page.getByTestId('copy-status')).toContainText(/Copied|Select/);
  await page.getByRole('button',{name:'Spec Sheet',exact:true}).click();
  await expect(page.getByRole('dialog')).toContainText(code);
  await page.keyboard.press('Escape');
  await expect(page.getByRole('dialog')).not.toBeVisible();
  await page.getByRole('button',{name:'Return to your selections',exact:true}).click();
  await page.getByRole('button',{name:'Your specification',exact:true}).click();
  await expect(page.getByTestId('reference-code')).toHaveText(code);
  expect(await canvas!.evaluate(el=>el.isConnected)).toBe(true);
});

test("treatment carousel and four steps control live materials without replacing the canvas", async ({ page }) => {
  await page.goto('/');
  await expect.poll(()=>page.evaluate(()=>window.__autolab?.snapshot().status),{timeout:60000}).toBe('success');
  const canvas=await page.locator('canvas').elementHandle();
  await page.getByRole('radio',{name:'Classic',exact:true}).focus();
  await page.keyboard.press('ArrowRight');
  await expect(page.getByRole('radio',{name:'Diamond Quilted',exact:true})).toHaveAttribute('aria-checked','true');
  await expect.poll(()=>page.evaluate(()=>window.__autolab?.snapshot().materialState?.quiltThread),{timeout:60000}).toBe(true);
  await page.getByTestId('step-2').click();
  await page.getByRole('button',{name:/Macchiato Beige/}).click();
  await expect.poll(()=>page.evaluate(()=>window.__autolab?.snapshot().materialState?.colors.MAT_Seat_Primary)).toBe('#d8cab8');
  await page.getByTestId('step-3').click();
  await page.getByRole('button',{name:/Silver Shadow Tech Stitch/}).click();
  await expect.poll(()=>page.evaluate(()=>window.__autolab?.snapshot().materialState?.colors.MAT_Seat_Stitching)).toBe('#c0c4cc');
  await page.getByTestId('step-4').click();
  await page.getByRole('button',{name:'Bespoke Monotone',exact:true}).click();
  await expect.poll(()=>page.evaluate(()=>window.__autolab?.snapshot().materialState?.colors.MAT_Seat_Secondary)).toBe('#d8cab8');
  expect(await canvas!.evaluate(el=>el.isConnected)).toBe(true);
  await expect(page.locator('canvas')).toHaveCount(1);
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
