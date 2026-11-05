import { expect, test, type Page } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";

const base = process.env.RUNTIME_URL ?? "http://localhost:3100";
const evidence = process.env.L5_EVIDENCE_DIR ?? "docs/review/l5-integration/evidence";
test.beforeAll(async () => { await mkdir(evidence, { recursive: true }); });
const snapshot = (page: Page) => page.evaluate(() => window.__autolab?.snapshot());
async function ready(page: Page, kind = "classic") {
  await expect.poll(async () => (await snapshot(page))?.status, { timeout: 60_000 }).toBe("success");
  await expect.poll(async () => (await snapshot(page))?.assetUrl).toContain(`interior-l4-${kind}.glb`);
  await expect.poll(async () => (await snapshot(page))?.renderer?.triangles, { timeout: 30_000 }).toBe(76548);
  const current = await snapshot(page);
  expect(Object.keys(current!.materialState!.colors)).toHaveLength(7);
  expect(current!.renderer!.calls).toBe(12);
  for (const texture of Object.values(current!.materialState!.textures!)) {
    expect(texture?.compressed).toBe(true);
    expect(texture?.mips).toBe(11);
  }
  await expect(page.getByTestId("svg-fallback")).toBeHidden();
}

test("Diamond enables its actual primary-material thread hook", async ({ page }) => {
  await page.goto(base);
  await ready(page);
  await page.getByTestId("treatment-diamond").click();
  await ready(page, "diamond");
  await expect.poll(async () => (await snapshot(page))?.materialState?.quiltThread).toBe(true);
});

test("Retry recovers a rejected GLB request without reloading the page", async ({ page }) => {
  let failed = false;
  let requests = 0;
  await page.route("**/interior-l4-classic.glb", route => {
    requests++;
    if (!failed) { failed = true; return route.fulfill({ status: 503, body: "Injected temporary failure" }); }
    return route.continue();
  });
  await page.goto(base);
  await expect.poll(async () => (await snapshot(page))?.status, { timeout: 60_000 }).toBe("error");
  await expect(page.getByTestId("spike-viewer").locator("canvas")).toHaveCount(0);
  await page.waitForTimeout(250); // Include the intentional renderer-disposal context-loss event.
  expect((await snapshot(page))?.error).toContain("503");
  await page.getByRole("button", { name: "Retry 3D", exact: true }).click();
  await ready(page);
  expect(requests).toBe(2);
  await writeFile(`${evidence}/retry-request-count.json`, JSON.stringify({ requests, snapshot: await snapshot(page) }, null, 2));
});

test("cold KTX2 and Draco load retains decoded maps and local decoder resources", async ({ page }) => {
  const errors: string[] = [], requests: string[] = [];
  page.on("pageerror", e => errors.push(e.stack ?? e.message));
  page.on("console", m => { if (m.type() === "error") errors.push(m.text()); });
  page.on("response", r => { if (/\/basis\/|\/draco\/|\.glb/.test(r.url())) requests.push(`${r.status()} ${r.url()}`); });
  await page.goto(base);
  await ready(page);
  expect(errors).toEqual([]);
  for (const path of ["/basis/basis_transcoder.js", "/basis/basis_transcoder.wasm", "/draco/draco_decoder.wasm"]) {
    expect(requests.some(r => r.startsWith("200 ") && r.includes(path))).toBe(true);
  }
  await mkdir(evidence, { recursive: true });
  await writeFile(`${evidence}/cold-load.json`, JSON.stringify({ snapshot: await snapshot(page), errors, requests }, null, 2));
});

test("all treatments, four cameras, independent colours and repeated switching retain the assembly", async ({ page }) => {
  test.setTimeout(360_000);
  const errors: string[] = [], warnings: string[] = [], states: unknown[] = [];
  page.on("pageerror", e => errors.push(e.message));
  page.on("console", m => { if (m.type() === "error") errors.push(m.text()); if (m.type() === "warning") warnings.push(m.text()); });
  await page.setViewportSize({ width: 1440, height: 1000 });
  await mkdir(evidence, { recursive: true });
  await page.goto(base);
  await ready(page);
  for (const kind of ["classic", "diamond", "perforated", "classic", "diamond", "perforated"]) {
    await page.getByRole("button", { name: "1. Material", exact: true }).click();
    await page.getByTestId(`treatment-${kind}`).click();
    await ready(page, kind);
    await expect.poll(async () => (await snapshot(page))?.materialState?.quiltThread).toBe(kind === "diamond");
    states.push(await snapshot(page));
    await page.getByRole("button", { name: "Cabin Pair", exact: true }).click();
    await page.waitForTimeout(250);
    await page.screenshot({ path: `${evidence}/${kind}-cabin.png` });
  }
  await page.getByTestId("treatment-diamond").click();
  await ready(page, "diamond");
  const initial = (await snapshot(page))!.materialState!;
  await page.getByRole("button", { name: "2. Colour", exact: true }).click();
  await page.getByRole("button", { name: /Macchiato Beige/ }).click();
  await expect.poll(async () => (await snapshot(page))?.materialState?.colors.MAT_Seat_Primary).toBe("#d8cab8");
  const primary = (await snapshot(page))!.materialState!;
  expect(primary.colors.MAT_Seat_Secondary).toBe(initial.colors.MAT_Seat_Secondary);
  expect(primary.textures).toEqual(initial.textures);
  await page.getByRole("button", { name: "4. Composition", exact: true }).click();
  await page.getByRole("button", { name: /Macchiato Beige/ }).click();
  await expect.poll(async () => (await snapshot(page))?.materialState?.colors.MAT_Seat_Secondary).toBe("#d8cab8");
  await page.getByRole("button", { name: "Stitch Detail", exact: true }).click();
  await page.waitForTimeout(250);
  await page.screenshot({ path: `${evidence}/diamond-thread-gold.png` });
  await page.getByRole("button", { name: "3. Accent Thread", exact: true }).click();
  await page.getByRole("button", { name: /Silver Shadow Tech Stitch/ }).click();
  await expect.poll(async () => (await snapshot(page))?.materialState?.colors.MAT_Seat_Stitching).toBe("#c0c4cc");
  const thread = (await snapshot(page))!.materialState!;
  expect(thread.colors.MAT_Seat_Primary).toBe("#d8cab8");
  expect(thread.colors.MAT_Seat_Secondary).toBe("#d8cab8");
  expect(thread.textures).toEqual(initial.textures);
  for (const name of ["MAT_Dashboard_Trim", "MAT_Cockpit_Accent", "MAT_Cockpit_Black"]) expect(thread.colors[name]).toBe(initial.colors[name]);
  await page.screenshot({ path: `${evidence}/diamond-thread-silver.png` });
  for (const [label, fov] of [["Driver Hero", 38], ["Stitch Detail", 28], ["Cabin Pair", 45], ["Cockpit & Dash", 42]] as const) {
    await page.getByRole("button", { name: label, exact: true }).click();
    await expect.poll(async () => (await snapshot(page))?.cameraFov).toBe(fov);
    await page.waitForTimeout(250);
    await page.screenshot({ path: `${evidence}/camera-${label.replaceAll(/[^a-zA-Z]+/g, "-")}.png` });
  }
  for (const kind of ["classic", "perforated", "diamond"]) {
    await page.getByRole("button", { name: "1. Material", exact: true }).click();
    await page.getByTestId(`treatment-${kind}`).click();
    await ready(page, kind);
    expect((await snapshot(page))?.materialState?.colors.MAT_Seat_Primary).toBe("#d8cab8");
    expect((await snapshot(page))?.materialState?.colors.MAT_Seat_Stitching).toBe("#c0c4cc");
    await page.getByRole("button", { name: "Stitch Detail", exact: true }).click();
    await page.waitForTimeout(250);
    await page.screenshot({ path: `${evidence}/${kind}-detail.png` });
  }
  await page.reload();
  await ready(page);
  expect(errors).toEqual([]);
  expect(warnings.filter(w => /Multiple active KTX2/.test(w))).toEqual([]);
  await writeFile(`${evidence}/treatments-browser.json`, JSON.stringify({ states, initial, primary, thread, errors, warnings, context: "Chromium SwiftShader; no physical-phone or GPU-byte measurement" }, null, 2));
});

test("L3 rollback still decodes and context-loss Retry restores rendering", async ({ page }) => {
  test.setTimeout(240_000);
  await page.goto(`${base}/?l3`);
  await expect.poll(async () => (await snapshot(page))?.status, { timeout: 60_000 }).toBe("success");
  expect((await snapshot(page))?.assetUrl).toContain("interior-l2b.glb");
  expect(Object.keys((await snapshot(page))!.materialState!.colors)).toHaveLength(7);
  await page.screenshot({ path: `${evidence}/l3-rollback.png` });
  await page.goto(base);
  await ready(page);
  expect(await page.evaluate(() => window.__autolab?.loseContext())).toBe(true);
  await expect.poll(async () => (await snapshot(page))?.status).toBe("error");
  await expect(page.getByTestId("svg-fallback")).toBeVisible();
  await page.getByRole("button", { name: "Retry 3D", exact: true }).click();
  await ready(page);
});

test("failed Basis decode is an error, and Retry reloads textures", async ({ page }) => {
  let failed = false;
  await page.route("**/basis/basis_transcoder.wasm", route => {
    if (!failed) { failed = true; return route.fulfill({ status: 503, body: "Injected decoder failure" }); }
    return route.continue();
  });
  await page.goto(base);
  await expect.poll(async () => (await snapshot(page))?.status, { timeout: 60_000 }).toBe("error");
  await expect(page.getByTestId("svg-fallback")).toBeVisible();
  await page.getByRole("button", { name: "Retry 3D", exact: true }).click();
  await ready(page);
});

test("WebGL unavailable and missing asset retain the fallback", async ({ page }) => {
  await page.goto(`${base}/?missing-asset`);
  await expect.poll(async () => (await snapshot(page))?.status, { timeout: 60_000 }).toBe("error");
  await expect(page.getByTestId("svg-fallback")).toBeVisible();
  await page.addInitScript(() => {
    const original = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function(this: HTMLCanvasElement, type, ...args) {
      return type === "webgl2" ? null : original.call(this, type, ...args);
    } as typeof original;
  });
  await page.goto(base);
  await expect(page.getByTestId("viewer-status")).toContainText("WebGL2 is unavailable");
  await expect(page.getByTestId("svg-fallback")).toBeVisible();
});

test("consultation handoff reflects the selected treatment without sending a message", async ({ page }) => {
  await page.goto(base);
  await ready(page);
  const booking = page.getByRole("link", { name: /Continue on WhatsApp/ });
  for (const [kind, label] of [["classic", "Classic Smooth"], ["diamond", "Diamond Quilted Mock-up"], ["perforated", "Perforated Leather Mock-up"]]) {
    await page.getByTestId(`treatment-${kind}`).click();
    await ready(page, kind);
    await page.getByRole("button", { name: "Your specification", exact: true }).click();
    const href = new URL((await booking.getAttribute("href"))!);
    expect(href.origin).toBe("https://wa.me");
    expect(href.pathname).toBe("/254700000000"); // Local test fixture; never navigated or sent.
    expect(href.searchParams.get("text")).toContain(`Upholstery Treatment: ${label}`);
    expect(href.searchParams.get("text")).toContain("2020 Lexus RX 350");
    await page.getByRole("button", { name: "Return to your selections", exact: true }).click();
  }
});
