import { describe, expect, it } from "vitest";
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import { createLexusSyntheticFixture } from "../scripts/make-fixture.mjs";
import { validateGlbBytes } from "../scripts/validate-glb.mjs";
import { unpackGlb, packGlb } from "../scripts/lib/merge-glbs.mjs";

async function component(scope: string, corrupt?: string) {
  const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
  const doc = await io.readBinary(await createLexusSyntheticFixture());
  const names: Record<string, string[]> = {
    "lexus-passenger": ["GEO_Seat_Front_Passenger", "GEO_Seat_Stitching_Front"],
    "lexus-wheel": ["GEO_SteeringWheel_Lexus"],
    "lexus-dashboard": ["GEO_Dashboard_Lexus"],
  };
  for (const node of doc.getRoot().listNodes()) {
    if (!names[scope].includes(node.getName())) { node.getMesh()?.dispose(); node.dispose(); }
  }
  const used = new Set(doc.getRoot().listMeshes().flatMap(m => m.listPrimitives().map(p => p.getMaterial())));
  for (const m of doc.getRoot().listMaterials()) if (!used.has(m)) m.dispose();
  const first = doc.getRoot().listMeshes()[0].listPrimitives()[0];
  if (corrupt === "UV") first.setAttribute("TEXCOORD_0", null);
  if (corrupt === "scale") doc.getRoot().listNodes()[0].setScale([100, 100, 100]);
  if (corrupt === "extra") doc.getRoot().listScenes()[0].addChild(doc.createNode("Cube"));
  if (corrupt === "trim") for (const m of doc.getRoot().listMeshes()) for (const p of [...m.listPrimitives()]) {
    if (p.getMaterial()?.getName() === "MAT_Cockpit_Accent") { m.removePrimitive(p); p.dispose(); }
  }
  return io.writeBinary(doc);
}

describe("L2B component gates preserve full-scene restrictions", () => {
  it.each(["lexus-passenger", "lexus-wheel", "lexus-dashboard"])("accepts a scoped fixture for %s", async scope => {
    const report = await validateGlbBytes(await component(scope), { scope, synthetic: true });
    expect(report.passed, report.errors.join("; ")).toBe(true);
  });
  it.each(["UV", "scale", "extra"])("rejects malformed wheel: %s", async corrupt => {
    const report = await validateGlbBytes(await component("lexus-wheel", corrupt), { scope: "lexus-wheel", synthetic: true });
    expect(report.passed).toBe(false);
  });
  it("does not accept a wheel as the full scene", async () => {
    const report = await validateGlbBytes(await component("lexus-wheel"), { scope: "lexus", synthetic: true });
    expect(report.passed).toBe(false);
    expect(report.errors.join("; ")).toContain("missing node: GEO_Seat_Front_Passenger");
  });
  it("requires independently bound cockpit trim", async () => {
    const report = await validateGlbBytes(await component("lexus-wheel", "trim"), { scope: "lexus-wheel", synthetic: true });
    expect(report.errors.join("; ")).toContain("missing required binding: GEO_SteeringWheel_Lexus / MAT_Cockpit_Accent");
  });
  it("rejects a full scene whose individually valid nodes span beyond vehicle bounds", async () => {
    const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
    const doc = await io.readBinary(await createLexusSyntheticFixture());
    doc.getRoot().listNodes()[0].setTranslation([-1.3,.5,.1]);
    doc.getRoot().listNodes()[2].setTranslation([1.3,.5,.1]);
    const report = await validateGlbBytes(await io.writeBinary(doc), { scope: "lexus", synthetic: true });
    expect(report.errors.join("; ")).toContain("combined vehicle bounds exceeded");
  });
  it("rejects advertised compression that is not present on every payload", async () => {
    const {json,bin}=unpackGlb(await createLexusSyntheticFixture());
    json.extensionsUsed.push("KHR_draco_mesh_compression","KHR_texture_basisu");
    const report=await validateGlbBytes(packGlb(json,bin),{scope:"lexus",synthetic:false});
    expect(report.errors.join("; ")).toContain("uncompressed primitive");
    expect(report.errors.join("; ")).toContain("non-KTX2 texture");
  });
});
