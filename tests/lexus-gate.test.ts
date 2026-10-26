import { describe, expect, it } from "vitest";
import { spawnSync } from "node:child_process";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve, sep } from "node:path";
import { createLexusPrototypeFixture, createLexusSyntheticFixture } from "../scripts/make-fixture.mjs";
import { inspectManifest, validateGlbBytes } from "../scripts/validate-glb.mjs";

type GlbJson = {
  nodes: Array<{ name: string; scale?: number[] }>;
  materials: Array<{ name: string; pbrMetallicRoughness: { baseColorTexture?: { index: number } } }>;
  meshes: Array<{ primitives: Array<{ attributes: Record<string, number>; material?: number }> }>;
  scenes: Array<{ nodes: number[] }>;
  extensionsUsed: string[];
};

function mutateGlb(source: Uint8Array, change: (json: GlbJson) => void): Uint8Array {
  const input = Buffer.from(source);
  const jsonLength = input.readUInt32LE(12);
  const json = JSON.parse(input.subarray(20, 20 + jsonLength).toString("utf8")) as GlbJson;
  change(json);
  const encoded = Buffer.from(JSON.stringify(json));
  const paddedLength = Math.ceil(encoded.length / 4) * 4;
  const binaryChunk = input.subarray(20 + jsonLength);
  const output = Buffer.alloc(20 + paddedLength + binaryChunk.length, 0x20);
  input.copy(output, 0, 0, 12);
  output.writeUInt32LE(output.length, 8);
  output.writeUInt32LE(paddedLength, 12);
  output.writeUInt32LE(0x4e4f534a, 16);
  encoded.copy(output, 20);
  binaryChunk.copy(output, 20 + paddedLength);
  return output;
}

const lexusManifestPath = resolve("src/config/scene-manifest.lexus-rx350.json");

describe("Lexus RX 350 Asset Gate & Synthetic Fixture (Phase L1)", () => {
  it("accepts the synthetic Lexus fixture with 6 nodes and 5 semantic materials", async () => {
    const fixture = await createLexusSyntheticFixture();
    const report = await validateGlbBytes(fixture, { scope: "lexus", synthetic: true });
    expect(report.passed, report.errors.join("; ")).toBe(true);
    expect(report.sha256).toMatch(/^[a-f0-9]{64}$/);
    expect(report.nodeCount).toBe(6); // 5 component groups + sub-mesh GEO_Seat_Front_Driver_Bolsters
    expect(report.materialCount).toBe(5); // MAT_Seat_Primary, MAT_Seat_Secondary, MAT_Seat_Stitching, MAT_Steering_Leather, MAT_Dashboard_Trim
    expect(report.drawCalls).toBe(6);
    expect(report.missingMaterialSlots).toEqual([]);
  });

  it("generates byte-identical synthetic Lexus fixtures", async () => {
    expect(await createLexusSyntheticFixture()).toEqual(await createLexusSyntheticFixture());
  });

  it("reads a Draco-compressed synthetic Lexus fixture", async () => {
    const compressed = await createLexusSyntheticFixture({ draco: true });
    expect(compressed).toEqual(await createLexusSyntheticFixture({ draco: true }));
    const jsonLength = Buffer.from(compressed).readUInt32LE(12);
    const json = JSON.parse(Buffer.from(compressed).subarray(20, 20 + jsonLength).toString("utf8")) as GlbJson;
    expect(json.extensionsUsed).toContain("KHR_draco_mesh_compression");
    const report = await validateGlbBytes(compressed, { scope: "lexus", synthetic: true });
    expect(report.passed, report.errors.join("; ")).toBe(true);
  });

  it("validates that Lexus scene manifest has zero missing material slots and valid schema", () => {
    const inspect = inspectManifest(lexusManifestPath);
    expect(inspect.schemaErrors).toEqual([]);
    expect(inspect.missingMaterialSlots).toEqual([]);
  });

  it("passes CLI manifest-only gate for Lexus with exit code 0", () => {
    const temp = mkdtempSync(join(tmpdir(), "autolab-lexus-manifest-"));
    try {
      const result = spawnSync(process.execPath, [
        "scripts/validate-glb.mjs",
        "--manifest-only",
        "--scope",
        "lexus",
        "--report",
        join(temp, "report.json"),
      ], {
        cwd: resolve("."),
        encoding: "utf8",
        timeout: 15_000,
      });
      expect(result.status).toBe(0);
      expect(result.stdout).toContain("Asset gate PASS");
    } finally {
      if (resolve(temp).startsWith(resolve(tmpdir()) + sep)) rmSync(temp, { recursive: true, force: true });
    }
  });

  it("passes CLI validation on the synthetic Lexus GLB with exit code 0", () => {
    const temp = mkdtempSync(join(tmpdir(), "autolab-lexus-cli-"));
    try {
      const result = spawnSync(process.execPath, [
        "scripts/validate-glb.mjs",
        "--scope",
        "lexus",
        "--synthetic",
        "--asset",
        "tests/fixtures/lexus-synthetic.glb",
        "--report",
        join(temp, "report.json"),
      ], {
        cwd: resolve("."),
        encoding: "utf8",
        timeout: 15_000,
      });
      expect(result.status).toBe(0);
      expect(result.stdout).toContain("Asset gate PASS");
    } finally {
      if (resolve(temp).startsWith(resolve(tmpdir()) + sep)) rmSync(temp, { recursive: true, force: true });
    }
  });

  it("rejects an empty asset with a format error in Lexus scope", async () => {
    const report = await validateGlbBytes(new Uint8Array(), { scope: "lexus", synthetic: true });
    expect(report.passed).toBe(false);
    expect(report.errors).toContain("Invalid GLB header or version");
  });
  it.each([
    ["renamed component node", (json: GlbJson) => { json.nodes[4].name = "GEO_Unknown"; }, "missing node: GEO_SteeringWheel_Lexus"],
    ["missing component group when all sub-meshes renamed", (json: GlbJson) => {
      json.nodes[0].name = "GEO_Unknown1";
      json.nodes[1].name = "GEO_Unknown2";
    }, "missing node: GEO_Seat_Front_Driver"],
    ["duplicate material", (json: GlbJson) => { json.materials.push({ ...json.materials[0] }); }, "duplicate material"],
    ["100x scale", (json: GlbJson) => { json.nodes[0].scale = [100, 100, 100]; }, "vehicle bounds exceeded"],
    ["stripped UVs", (json: GlbJson) => { delete json.meshes[0].primitives[0].attributes.TEXCOORD_0; }, "missing UV"],
    ["extra unrecognized node", (json: GlbJson) => { json.scenes[0].nodes.push(json.nodes.length); json.nodes.push({ name: "Cube" }); }, "extra node: Cube"],
    ["banned extension", (json: GlbJson) => { json.extensionsUsed.push("KHR_materials_pbrSpecularGlossiness"); }, "banned extension"],
    ["material binding mismatch on driver seat", (json: GlbJson) => {
      // Point driver seat primitive to dashboard material (material index 4)
      json.meshes[0].primitives[0].material = 4;
    }, "material binding mismatch: GEO_Seat_Front_Driver"],
    ["material binding mismatch on stitching", (json: GlbJson) => {
      // Point stitching primitive to primary upholstery (material index 0)
      json.meshes[3].primitives[0].material = 0;
    }, "material binding mismatch: GEO_Seat_Stitching_Front"],
  ])("rejects %s with a specific error in Lexus scope", async (_label, change, message) => {
    const fixture = await createLexusSyntheticFixture();
    const mutated = mutateGlb(fixture, change);
    const report = await validateGlbBytes(mutated, { scope: "lexus", synthetic: true });
    expect(report.passed).toBe(false);
    expect(report.errors.join("; ")).toContain(message);

    const temp = mkdtempSync(join(tmpdir(), "autolab-lexus-mut-"));
    try {
      const asset = join(temp, "mutated.glb");
      writeFileSync(asset, mutated);
      const result = spawnSync(process.execPath, [
        "scripts/validate-glb.mjs",
        "--scope",
        "lexus",
        "--asset",
        asset,
        "--synthetic",
        "--report",
        join(temp, "report.json"),
      ], {
        cwd: resolve("."),
        encoding: "utf8",
        timeout: 15_000,
      });
      expect(result.status).toBe(1);
      expect(`${result.stdout}\n${result.stderr}`).toContain(message);
    } finally {
      if (resolve(temp).startsWith(resolve(tmpdir()) + sep)) rmSync(temp, { recursive: true, force: true });
    }
  });
});

describe("Lexus RX 350 L2A Prototype Asset Gate (Driver Seat Prototype)", () => {
  it("accepts the synthetic Lexus L2A prototype fixture with driver seat, bolsters, stitching, and 3 seat materials", async () => {
    const fixture = await createLexusPrototypeFixture();
    const report = await validateGlbBytes(fixture, { scope: "lexus-l2a", synthetic: true });
    expect(report.passed, report.errors.join("; ")).toBe(true);
    expect(report.sha256).toMatch(/^[a-f0-9]{64}$/);
    expect(report.nodeCount).toBe(3); // GEO_Seat_Front_Driver, GEO_Seat_Front_Driver_Bolsters, GEO_Seat_Stitching_Front
    expect(report.materialCount).toBe(3); // MAT_Seat_Primary, MAT_Seat_Secondary, MAT_Seat_Stitching
    expect(report.drawCalls).toBe(3);
    expect(report.missingMaterialSlots).toEqual([]);
  });

  it("generates byte-identical synthetic Lexus L2A prototype fixtures", async () => {
    expect(await createLexusPrototypeFixture()).toEqual(await createLexusPrototypeFixture());
  });

  it("passes CLI validation on the synthetic Lexus L2A prototype GLB with exit code 0", () => {
    const temp = mkdtempSync(join(tmpdir(), "autolab-lexus-l2a-cli-"));
    try {
      const result = spawnSync(process.execPath, [
        "scripts/validate-glb.mjs",
        "--scope",
        "lexus-l2a",
        "--synthetic",
        "--asset",
        "tests/fixtures/lexus-prototype-synthetic.glb",
        "--report",
        join(temp, "report.json"),
      ], {
        cwd: resolve("."),
        encoding: "utf8",
        timeout: 15_000,
      });
      expect(result.status).toBe(0);
      expect(result.stdout).toContain("Asset gate PASS");
    } finally {
      if (resolve(temp).startsWith(resolve(tmpdir()) + sep)) rmSync(temp, { recursive: true, force: true });
    }
  });

  it.each([
    ["renamed driver seat group", (json: GlbJson) => {
      json.nodes[0].name = "GEO_Seat_Front_Other";
      json.nodes[1].name = "GEO_Seat_Front_Other_Bolsters";
    }, "missing node: GEO_Seat_Front_Driver"],
    ["renamed stitching node", (json: GlbJson) => {
      json.nodes[2].name = "GEO_Seat_Stitching_Rear";
    }, "missing node: GEO_Seat_Stitching_Front"],
    ["extra node (steering wheel)", (json: GlbJson) => {
      json.scenes[0].nodes.push(json.nodes.length);
      json.nodes.push({ name: "GEO_SteeringWheel_Lexus" });
    }, "extra node: GEO_SteeringWheel_Lexus"],
    ["extra node (passenger seat)", (json: GlbJson) => {
      json.scenes[0].nodes.push(json.nodes.length);
      json.nodes.push({ name: "GEO_Seat_Front_Passenger" });
    }, "extra node: GEO_Seat_Front_Passenger"],
    ["extra material (dashboard trim)", (json: GlbJson) => {
      json.materials.push({ name: "MAT_Dashboard_Trim", pbrMetallicRoughness: {} });
    }, "extra material: MAT_Dashboard_Trim"],
    ["missing required material (secondary bolsters)", (json: GlbJson) => {
      json.materials[1].name = "MAT_Seat_Alternative";
    }, "missing material: MAT_Seat_Secondary"],
    ["material binding mismatch on driver seat", (json: GlbJson) => {
      json.meshes[0].primitives[0].material = 2; // Point driver seat to stitching
    }, "material binding mismatch: GEO_Seat_Front_Driver"],
  ])("rejects %s with a specific error in Lexus L2A scope", async (_label, change, message) => {
    const fixture = await createLexusPrototypeFixture();
    const mutated = mutateGlb(fixture, change);
    const report = await validateGlbBytes(mutated, { scope: "lexus-l2a", synthetic: true });
    expect(report.passed).toBe(false);
    expect(report.errors.join("; ")).toContain(message);
  });

  it("rejects L2A prototype asset when validated against full Lexus scope due to missing components", async () => {
    const fixture = await createLexusPrototypeFixture();
    const report = await validateGlbBytes(fixture, { scope: "lexus", synthetic: true });
    expect(report.passed).toBe(false);
    expect(report.errors.join("; ")).toContain("missing node: GEO_Seat_Front_Passenger");
    expect(report.errors.join("; ")).toContain("missing node: GEO_SteeringWheel_Lexus");
    expect(report.errors.join("; ")).toContain("missing node: GEO_Dashboard_Lexus");
  });

  it("validates the real Lexus L2A driver-seat GLB asset with zero errors", async () => {
    const assetPath = resolve("public/assets/3d/lexus-rx350/driver-seat-l2a.glb");
    const bytes = readFileSync(assetPath);
    const report = await validateGlbBytes(bytes, { scope: "lexus-l2a", synthetic: false });
    expect(report.passed, report.errors.join("; ")).toBe(true);
    expect(report.sha256).toBe("b3dc6a11a2387ceb0b97d01b15e6519f410aeebc5c1662b0a26c8f6b7090ec52");
    expect(report.nodeCount).toBe(2);
    expect(report.materialCount).toBe(3);
    expect(report.drawCalls).toBe(3);
    expect(report.triangleCount).toBe(32412);
    expect(report.errors).toEqual([]);
  });

  it("passes CLI validation on the real Lexus L2A driver-seat GLB with exit code 0", () => {
    const temp = mkdtempSync(join(tmpdir(), "autolab-lexus-real-cli-"));
    try {
      const result = spawnSync(process.execPath, [
        "scripts/validate-glb.mjs",
        "--scope",
        "lexus-l2a",
        "--asset",
        "public/assets/3d/lexus-rx350/driver-seat-l2a.glb",
        "--report",
        join(temp, "report.json"),
      ], {
        cwd: resolve("."),
        encoding: "utf8",
        timeout: 15_000,
      });
      expect(result.status).toBe(0);
      expect(result.stdout).toContain("Asset gate PASS");
    } finally {
      if (resolve(temp).startsWith(resolve(tmpdir()) + sep)) rmSync(temp, { recursive: true, force: true });
    }
  });
});

