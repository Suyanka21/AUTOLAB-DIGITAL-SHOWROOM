import { describe, expect, it } from "vitest";
import { NodeIO } from "@gltf-transform/core";
import { KHRMaterialsClearcoat, EXTTextureWebP } from "@gltf-transform/extensions";
import sharp from "sharp";
import { createSyntheticFixture } from "../scripts/make-fixture.mjs";
import { validateGlbBytes } from "../scripts/validate-glb.mjs";

async function panelFixture(scale = 1) {
  const io = new NodeIO().registerExtensions([KHRMaterialsClearcoat, EXTTextureWebP]);
  const doc = await io.readBinary(await createSyntheticFixture());
  const node = doc.getRoot().listNodes().find(n => n.getName().includes("OLED"))!;
  const prim = node.getMesh()!.listPrimitives()[0];
  prim.setAttribute("_ACTIVE_DISPLAY", doc.createAccessor().setBuffer(doc.getRoot().listBuffers()[0])
    .setType("SCALAR").setArray(new Float32Array([1, 1, 1, 1])));
  node.setRotation([Math.sin(0.4), 0, 0, Math.cos(0.4)]).setScale([scale, scale, scale]);
  return { io, doc };
}

describe("real spike gate boundaries", () => {
  it("measures the active OLED geometry independently of its inclination", async () => {
    const { io, doc } = await panelFixture();
    const report = await validateGlbBytes(await io.writeBinary(doc), { scope: "spike", synthetic: true });
    expect(report.passed, report.errors.join("; ")).toBe(true);
    expect(report.activeDisplayDiagonalMm).toBeGreaterThan(324);
  });

  it("rejects distorted active OLED geometry even with its marker present", async () => {
    const { io, doc } = await panelFixture(1.1);
    const report = await validateGlbBytes(await io.writeBinary(doc), { scope: "spike", synthetic: true });
    expect(report.errors.join("; ")).toContain("OLED diagonal tolerance exceeded");
  });

  it("requires a geometric OLED marker for a real asset", async () => {
    const report = await validateGlbBytes(await createSyntheticFixture(), { scope: "spike", feasibilityWebp: true });
    expect(report.errors.join("; ")).toContain("missing active-display geometry marker");
  });

  it("permits WebP only through the explicit spike waiver, while retaining Draco failures", async () => {
    const { io, doc } = await panelFixture();
    for (const texture of doc.getRoot().listTextures()) {
      texture.setImage(await sharp(texture.getImage()!).webp({ lossless: true }).toBuffer()).setMimeType("image/webp");
    }
    doc.createExtension(EXTTextureWebP).setRequired(true);
    const bytes = await io.writeBinary(doc);
    const strict = await validateGlbBytes(bytes, { scope: "spike" });
    expect(strict.errors.join("; ")).toContain("missing KTX2 textures");
    const waived = await validateGlbBytes(bytes, { scope: "spike", feasibilityWebp: true });
    expect(waived.errors.join("; ")).not.toContain("missing KTX2 textures");
    expect(waived.errors.join("; ")).not.toContain("banned extension: EXT_texture_webp");
    expect(waived.errors.join("; ")).toContain("missing Draco compression");
    expect(waived.waivers).toContain("P3-WEBP-2026-10-20");
  });

  it("does not waive PNG textures", async () => {
    const report = await validateGlbBytes(await createSyntheticFixture(), { scope: "spike", feasibilityWebp: true });
    expect(report.errors.join("; ")).toContain("WebP waiver requires every texture to be image/webp");
  });
});
