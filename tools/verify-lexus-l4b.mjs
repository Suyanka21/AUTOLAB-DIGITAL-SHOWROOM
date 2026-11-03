import { chromium } from "@playwright/test";
import { spawn } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = process.cwd();
const ev = resolve(root, "docs/review/lexus-l4b-2026-10-31");
await mkdir(ev, { recursive: true });

const PORT = 3001;
const APP_URL = `http://127.0.0.1:${PORT}`;

console.log(`[L4B Verification] Starting temporary Next.js server on ${APP_URL}...`);

// Use the precompiled production build via next start for instant startup and exact production fidelity
const serverProcess = spawn("npx", ["next", "start", "-p", String(PORT)], {
  cwd: root,
  stdio: ["ignore", "pipe", "pipe"],
  shell: true,
});

serverProcess.stdout.on("data", (d) => console.log(`[Next.js Server]: ${d.toString().trim()}`));
serverProcess.stderr.on("data", (d) => console.error(`[Next.js Error]: ${d.toString().trim()}`));

// Wait for server to become responsive
async function waitForServer(url, timeoutMs = 30000) {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    try {
      const res = await fetch(url);
      if (res.status === 200) return true;
    } catch {
      // wait
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  throw new Error(`Server at ${url} failed to start within ${timeoutMs}ms`);
}

await waitForServer(APP_URL);
console.log(`[L4B Verification] Server is ready on ${APP_URL}`);

const errors = [];
const warnings = [];

const browser = await chromium.launch({
  headless: true,
  args: ["--enable-unsafe-swiftshader", "--use-gl=angle"],
});

try {
  const page = await browser.newPage({
    viewport: { width: 1440, height: 900 },
  });

  page.on("pageerror", (e) => {
    console.error("[Browser pageerror]:", e.message);
    errors.push(e.message);
  });

  page.on("console", (msg) => {
    if (msg.type() === "error") {
      console.error("[Browser console error]:", msg.text());
      errors.push(msg.text());
    } else if (msg.type() === "warning") {
      warnings.push(msg.text());
    }
  });

  console.log(`[L4B Verification] Navigating to ${APP_URL}?e2e=1 ...`);
  await page.goto(`${APP_URL}?e2e=1`, { timeout: 45000, waitUntil: "networkidle" });
  await page.waitForTimeout(4000);

  // Screenshot 1: Default Classic Smooth treatment
  console.log("[L4B Verification] 1. Capturing Classic treatment (Hero Driver camera)...");
  await page.screenshot({ path: resolve(ev, "01-showroom-classic-hero.png") });

  // Screenshot 2: Classic Smooth - Cabin Pair camera (showing both front seats)
  console.log("[L4B Verification] 2. Switching to Cabin Pair camera view (both front seats)...");
  await page.getByRole("button", { name: "Cabin Pair" }).click();
  await page.waitForTimeout(2000);
  await page.screenshot({ path: resolve(ev, "02-showroom-classic-pair.png") });

  // Screenshot 3: Switch to Diamond Quilted treatment
  console.log("[L4B Verification] 3. Switching treatment to Diamond Quilted...");
  await page.getByTestId("treatment-diamond").click();
  await page.waitForTimeout(3000);
  await page.screenshot({ path: resolve(ev, "03-showroom-diamond-pair.png") });

  // Screenshot 4: Diamond Quilted - Seam Macro close-up
  console.log("[L4B Verification] 4. Switching to Stitch Detail (Seam Macro) camera view...");
  await page.getByRole("button", { name: "Stitch Detail" }).click();
  await page.waitForTimeout(2000);
  await page.screenshot({ path: resolve(ev, "04-showroom-diamond-seam-macro.png") });

  // Screenshot 5: Live Accent Thread Recolouring on Diamond Quilted
  console.log("[L4B Verification] 5. Switching to Step 3 (Thread) and updating thread color live...");
  await page.getByRole("button", { name: /3\. Thread/i }).click();
  await page.waitForTimeout(1000);
  // Select a contrast thread (Crimson or Champagne)
  const threadButtons = page.locator("button:has-text('Stitch')");
  if ((await threadButtons.count()) > 1) {
    await threadButtons.nth(1).click();
    await page.waitForTimeout(2000);
  }
  await page.screenshot({ path: resolve(ev, "05-showroom-diamond-recoloured-thread.png") });

  // Screenshot 6: Switch to Perforated Leather treatment
  console.log("[L4B Verification] 6. Switching to Step 1 and selecting Perforated Leather...");
  await page.getByRole("button", { name: /1\. Material/i }).click();
  await page.waitForTimeout(1000);
  await page.getByTestId("treatment-perforated").click();
  await page.waitForTimeout(3000);

  // Switch back to Cabin Pair to inspect Perforated on both seats
  await page.getByRole("button", { name: "Cabin Pair" }).click();
  await page.waitForTimeout(2000);
  await page.screenshot({ path: resolve(ev, "06-showroom-perforated-pair.png") });

  // Screenshot 7: Perforated Leather - Driver Hero view
  console.log("[L4B Verification] 7. Switching to Driver Hero camera view for Perforated...");
  await page.getByRole("button", { name: "Driver Hero" }).click();
  await page.waitForTimeout(2000);
  await page.screenshot({ path: resolve(ev, "07-showroom-perforated-hero.png") });

  // Screenshot 8: Specification Sheet Modal
  console.log("[L4B Verification] 8. Opening Specification Sheet modal...");
  await page.getByRole("button", { name: "Spec Sheet" }).click();
  await page.waitForTimeout(1000);
  await page.screenshot({ path: resolve(ev, "08-showroom-spec-sheet.png") });

  // Inspect window.__autolab snapshot
  const snapshot = await page.evaluate(() => window.__autolab?.snapshot?.());
  console.log("[L4B Verification] Final runtime snapshot:", snapshot);

  const report = {
    timestamp: new Date().toISOString(),
    browser: await browser.version(),
    url: APP_URL,
    runtimeSnapshot: snapshot,
    errors,
    warnings: warnings.slice(0, 10),
    screenshots: [
      "01-showroom-classic-hero.png",
      "02-showroom-classic-pair.png",
      "03-showroom-diamond-pair.png",
      "04-showroom-diamond-seam-macro.png",
      "05-showroom-diamond-recoloured-thread.png",
      "06-showroom-perforated-pair.png",
      "07-showroom-perforated-hero.png",
      "08-showroom-spec-sheet.png",
    ],
    passed: errors.length === 0,
  };

  await writeFile(resolve(ev, "browser-verification-report.json"), JSON.stringify(report, null, 2) + "\n");
  console.log("[L4B Verification] Verification report saved to docs/review/lexus-l4b-2026-10-31/browser-verification-report.json");
} finally {
  await browser.close();
  serverProcess.kill();
}
