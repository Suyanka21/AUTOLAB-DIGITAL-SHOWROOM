import { expect, test } from "@playwright/test";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";

const evidence = "docs/review/lexus-l2a-r1-2026-10-24/evidence";
const snapshot = (page: import("@playwright/test").Page) => page.evaluate(() => window.__autolab?.snapshot());

test("revised Lexus asset retains integrated cameras and independent material controls", async ({ page }) => {
  test.setTimeout(180_000);
  await mkdir(evidence, { recursive: true });
  const errors: string[] = [];
  const warnings: string[] = [];
  const requests: string[] = [];
  page.on("pageerror", e => errors.push(String(e)));
  page.on("console", m => {
    if (m.type() === "error") errors.push(m.text());
    if (m.type() === "warning") warnings.push(m.text());
  });
  page.on("response", r => {
    if (/driver-seat-l2a\.glb|\/draco\/|\/basis\//.test(r.url())) requests.push(`${r.status()} ${r.url()}`);
  });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await page.goto("/");
  await expect.poll(async () => (await snapshot(page))?.status, { timeout: 90_000 }).toBe("success");
  await expect(page.getByTestId("svg-fallback")).toBeHidden();
  expect((await snapshot(page))?.assetUrl).toBe("/assets/3d/lexus-rx350/driver-seat-l2a.glb");
  await expect(page.getByRole("button", { name: /^Cabin Pair/ })).toBeDisabled();
  await expect(page.getByRole("button", { name: /^Driver Ingress/ })).toBeDisabled();
  await page.getByRole("button", { name: "4. Compose", exact: true }).click();
  await page.getByRole("button", { name: /Bespoke Duotone/ }).click();
  const initial = await snapshot(page);
  await page.getByRole("button", { name: "2. Colour", exact: true }).click();
  await page.getByRole("button", { name: /Macchiato Beige/ }).click();
  await expect.poll(async () => (await snapshot(page))?.materialState?.colors.MAT_Seat_Primary).toBe("#d8cab8");
  const primary = await snapshot(page);
  expect(primary?.materialState?.colors.MAT_Seat_Secondary).toBe(initial?.materialState?.colors.MAT_Seat_Secondary);
  expect(primary?.materialState?.colors.MAT_Seat_Stitching).toBe(initial?.materialState?.colors.MAT_Seat_Stitching);
  await page.getByRole("button", { name: "4. Compose", exact: true }).click();
  await page.getByRole("button", { name: "Macchiato", exact: true }).click();
  await expect.poll(async () => (await snapshot(page))?.materialState?.colors.MAT_Seat_Secondary).toBe("#d8cab8");
  const secondary = await snapshot(page);
  expect(secondary?.materialState?.colors.MAT_Seat_Primary).toBe(primary?.materialState?.colors.MAT_Seat_Primary);
  expect(secondary?.materialState?.colors.MAT_Seat_Stitching).toBe(primary?.materialState?.colors.MAT_Seat_Stitching);
  await page.getByRole("button", { name: "3. Thread", exact: true }).click();
  await page.getByRole("button", { name: /Silver Shadow Tech Stitch/ }).click();
  await expect.poll(async () => (await snapshot(page))?.materialState?.colors.MAT_Seat_Stitching).not.toBe(secondary?.materialState?.colors.MAT_Seat_Stitching);
  const thread = await snapshot(page);
  expect(thread?.materialState?.colors.MAT_Seat_Primary).toBe(secondary?.materialState?.colors.MAT_Seat_Primary);
  expect(thread?.materialState?.colors.MAT_Seat_Secondary).toBe(secondary?.materialState?.colors.MAT_Seat_Secondary);
  const cameras = [];
  for (const viewport of [{ label: "desktop", width: 1440, height: 1000 }, { label: "mobile-emulation", width: 390, height: 844 }]) {
    await page.setViewportSize(viewport);
    for (const [label, fov] of [["Driver Hero", 38], ["Stitch Detail", 28]] as const) {
      await page.getByRole("button", { name: label, exact: true }).click();
      await expect.poll(async () => (await snapshot(page))?.cameraFov).toBe(fov);
      await page.getByTestId("spike-viewer").scrollIntoViewIfNeeded();
      await page.screenshot({ path: `${evidence}/${viewport.label}-${label.replaceAll(" ", "-")}.png` });
      cameras.push({ viewport, label, snapshot: await snapshot(page) });
    }
  }
  const asset = await readFile("public/assets/3d/lexus-rx350/driver-seat-l2a.glb");
  const report = { assetSha256: createHash("sha256").update(asset).digest("hex"), initial, primary, secondary, thread, cameras, requests, errors, warnings,
    context: "Actual Next/R3F app, Chromium with SwiftShader. Mobile viewport emulation only; physical-phone FPS and GPU memory NOT MEASURED." };
  await writeFile(`${evidence}/integrated-browser.json`, JSON.stringify(report, null, 2) + "\n");
  expect(errors).toEqual([]);
  for (const path of ["driver-seat-l2a.glb", "/draco/", "/basis/"]) expect(requests.some(r => r.startsWith("200 ") && r.includes(path))).toBe(true);
});
