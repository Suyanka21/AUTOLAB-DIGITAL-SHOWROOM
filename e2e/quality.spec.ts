import { expect, test } from "@playwright/test";

test("unconfigured WhatsApp booking is disabled with a clear message", async ({ page }) => {
  await page.goto("/");
  const booking = page.getByRole("button", { name: /Book Bespoke Consultation/ });
  await expect(booking).toBeDisabled();
  await expect(page.getByText("WhatsApp booking is unavailable until AutoLab configures its number.")).toBeVisible();
});

test("3D asset responses carry the immutable cache header", async ({ request }) => {
  const response = await request.get("/assets/3d/s-class-v223/README.md");
  expect(response.ok()).toBe(true);
  expect(response.headers()["cache-control"]).toBe("public, max-age=31536000, immutable");
});
