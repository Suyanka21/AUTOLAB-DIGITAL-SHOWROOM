import { expect, test } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const evidence = "docs/review/spike-2026-10-20/viewer";
const presetNames = ["Overview", "Seat Front", "Seat Detail", "OLED Front", "OLED Profile"];
const snapshot = (page: import("@playwright/test").Page) => page.evaluate(() => window.__autolab?.snapshot());
async function waitForViewer(page: import("@playwright/test").Page) {
  await expect.poll(async () => (await snapshot(page))?.status, { timeout: 90_000 }).toBe("success");
}

test("real GLB decodes Draco and embedded WebP, with live renderer statistics", async ({ page }) => {
  const responses: string[] = [];
  const consoleWarnings: string[] = [];
  page.on("response", response => { if (/spike\.glb|draco_decoder|draco_wasm_wrapper/.test(response.url())) responses.push(response.url() + " " + response.status()); });
  page.on("console", message => { if (message.type() === "warning" || message.type() === "error") consoleWarnings.push(message.type() + ": " + message.text()); });
  await page.goto("/");
  await waitForViewer(page);
  await expect(page.getByTestId("svg-fallback")).toBeHidden();
  const state = await snapshot(page);
  expect(state?.assetUrl).toBe("/assets/3d/s-class-v223/spike.glb");
  expect(state?.materialState?.bindings).toEqual({
    GEO_Seat_Front_Driver_Flutes: "MAT_Upholstery_Primary",
    GEO_Dashboard_Screen_Central_OLED: "MAT_Screen_Central_OLED",
  });
  await expect.poll(async () => (await snapshot(page))?.renderer?.calls ?? 0).toBeGreaterThanOrEqual(2);
  expect(state?.materialState?.colors.MAT_Screen_Central_OLED).toBeTruthy();
  expect(responses.some(url => url.includes("spike.glb 200"))).toBe(true);
  expect(responses.some(url => url.includes("/draco/") && url.endsWith(" 200"))).toBe(true);
  const measured = await snapshot(page);
  expect(measured?.renderer?.triangles).toBeGreaterThanOrEqual(5426);
  expect(measured?.renderer?.textures).toBeGreaterThanOrEqual(3);
  await mkdir(evidence, { recursive: true });
  await writeFile(join(evidence, "browser-measurement.json"), JSON.stringify({
    status: measured?.status, assetUrl: measured?.assetUrl, materialState: measured?.materialState,
    rendererInfo: measured?.renderer, requests: responses, consoleWarnings,
    gpuMemoryBytes: "NOT MEASURED", frameRate: "NOT MEASURED", context: "Playwright headless Chromium with SwiftShader",
  }, null, 2) + "\n");
});

test("swatch changes only the bound upholstery material", async ({ page }) => {
  await page.goto(process.env.E2E_BREAK_BINDING === "1" ? "/?break-seat-binding" : "/");
  await waitForViewer(page);
  const before = (await snapshot(page))?.materialState?.colors;
  await page.getByRole("button", { name: "2. Colour" }).click();
  await page.getByRole("button", { name: /Macchiato Beige/ }).click();
  await expect.poll(async () => (await snapshot(page))?.materialState?.colors.MAT_Upholstery_Primary).toBe("#d8cab8");
  const after = (await snapshot(page))?.materialState?.colors;
  expect(after?.MAT_Screen_Central_OLED).toBe(before?.MAT_Screen_Central_OLED);
});

test("GLB 404 retains the SVG fallback", async ({ page }) => {
  await page.goto("/?missing-spike");
  await expect.poll(async () => (await snapshot(page))?.status, { timeout: 90_000 }).toBe("error");
  await expect(page.getByTestId("svg-fallback")).toBeVisible();
  await expect(page.getByTestId("viewer-status")).toContainText("3D preview unavailable");
});

test("WebGL unavailable retains the SVG fallback", async ({ page }) => {
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function(this: HTMLCanvasElement, type, ...args) {
      if (type === "webgl2") return null;
      return original.call(this, type, ...args);
    } as typeof original;
  });
  await page.goto("/");
  await expect.poll(async () => (await snapshot(page))?.status).toBe("error");
  await expect(page.getByTestId("svg-fallback")).toBeVisible();
  await expect(page.getByTestId("viewer-status")).toContainText("WebGL2 is unavailable");
});

test("forced context loss returns to SVG fallback", async ({ page }) => {
  await page.goto("/");
  await waitForViewer(page);
  expect(await page.evaluate(() => window.__autolab?.loseContext())).toBe(true);
  await expect.poll(async () => (await snapshot(page))?.status).toBe("error");
  await expect(page.getByTestId("svg-fallback")).toBeVisible();
});

test("captures all five camera presets at desktop and mobile sizes", async ({ page }) => {
  test.setTimeout(180_000);
  await mkdir(evidence, { recursive: true });
  for (const viewport of [
    { label: "desktop", width: 1280, height: 800 },
    { label: "mobile", width: 390, height: 844 },
  ]) {
    await page.setViewportSize({ width: viewport.width, height: viewport.height });
    await page.goto("/");
    await waitForViewer(page);
    for (const name of presetNames) {
      await page.getByRole("button", { name, exact: true }).click();
      await page.waitForTimeout(120);
      await page.screenshot({ path: join(evidence, viewport.label + "-" + name.toLowerCase().replaceAll(" ", "-") + ".png") });
    }
  }
});
