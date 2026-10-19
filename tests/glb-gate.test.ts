import { describe, expect, it } from "vitest";
import { spawnSync } from "node:child_process";
import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve, sep } from "node:path";
import { createSyntheticFixture } from "../scripts/make-fixture.mjs";
import { inspectManifest, validateGlbBytes } from "../scripts/validate-glb.mjs";

type GlbJson = {
  nodes: Array<{ name: string; scale?: number[] }>;
  materials: Array<{ name: string; pbrMetallicRoughness: { baseColorTexture?: { index: number } } }>;
  meshes: Array<{ primitives: Array<{ attributes: Record<string, number> }> }>;
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

describe("synthetic GLB gate", () => {
  it("accepts the two-node spike fixture with a SHA-256 report", async () => {
    const fixture = await createSyntheticFixture();
    const report = await validateGlbBytes(fixture, { scope: "spike", synthetic: true });
    expect(report.passed, report.errors.join("; ")).toBe(true);
    expect(report.sha256).toMatch(/^[a-f0-9]{64}$/);
    expect(report.nodeCount).toBe(2);
    expect(report.warnings.filter((warning: string) => warning.startsWith("Khronos UNUSED"))).toEqual([]);
  });

  it("generates byte-identical synthetic fixtures", async () => {
    expect(await createSyntheticFixture()).toEqual(await createSyntheticFixture());
  });

  it("reads a Draco-compressed synthetic fixture", async () => {
    const compressed = await createSyntheticFixture({ draco: true });
    expect(compressed).toEqual(await createSyntheticFixture({ draco: true }));
    const jsonLength = Buffer.from(compressed).readUInt32LE(12);
    const json = JSON.parse(Buffer.from(compressed).subarray(20, 20 + jsonLength).toString("utf8")) as GlbJson;
    expect(json.extensionsUsed).toContain("KHR_draco_mesh_compression");
    const report = await validateGlbBytes(compressed, { scope: "spike", synthetic: true });
    expect(report.passed, report.errors.join("; ")).toBe(true);
  });

  it("rejects an empty asset with a format error", async () => {
    const report = await validateGlbBytes(new Uint8Array(), { scope: "spike", synthetic: true });
    expect(report.passed).toBe(false);
    expect(report.errors).toContain("Invalid GLB header or version");
  });

  it("rejects an OLED panel outside the spike's documented diagonal tolerance", async () => {
    const fixture = await createSyntheticFixture();
    const distorted = mutateGlb(fixture, (json) => { json.nodes[1].scale = [1.1, 1.1, 1]; });
    const report = await validateGlbBytes(distorted, { scope: "spike", synthetic: true });
    expect(report.passed).toBe(false);
    expect(report.errors.join("; ")).toContain("OLED diagonal tolerance exceeded");
  });

  it("requires UVs for any textured material", async () => {
    const fixture = await createSyntheticFixture();
    const texturedOled = mutateGlb(fixture, (json) => {
      json.materials[1].pbrMetallicRoughness.baseColorTexture = { index: 0 };
    });
    const report = await validateGlbBytes(texturedOled, { scope: "spike", synthetic: true });
    expect(report.errors.join("; ")).toContain("missing UV: GEO_Dashboard_Screen_Central_OLED");
  });

  it.each([
    ["renamed node", (json: GlbJson) => { json.nodes[0].name = "GEO_Renamed"; }, "missing node"],
    ["duplicate material", (json: GlbJson) => { json.materials.push({ ...json.materials[0] }); }, "duplicate material"],
    ["100x scale", (json: GlbJson) => { json.nodes[0].scale = [100, 100, 100]; }, "vehicle bounds"],
    ["stripped UVs", (json: GlbJson) => { delete json.meshes[0].primitives[0].attributes.TEXCOORD_0; }, "missing UV"],
    ["extra node", (json: GlbJson) => { json.scenes[0].nodes.push(json.nodes.length); json.nodes.push({ name: "Cube" }); }, "extra node"],
    ["banned extension", (json: GlbJson) => { json.extensionsUsed.push("KHR_materials_pbrSpecularGlossiness"); }, "banned extension"],
  ])("rejects %s with a specific error", async (_label, change, message) => {
    const fixture = await createSyntheticFixture();
    const mutated = mutateGlb(fixture, change);
    const report = await validateGlbBytes(mutated, { scope: "spike", synthetic: true });
    expect(report.passed).toBe(false);
    expect(report.errors.join("; ")).toContain(message);
    const temp = mkdtempSync(join(tmpdir(), "autolab-glb-"));
    try {
      const asset = join(temp, "mutated.glb");
      writeFileSync(asset, mutated);
      const result = spawnSync(process.execPath, ["scripts/validate-glb.mjs", "--scope", "spike", "--asset", asset, "--synthetic", "--report", join(temp, "report.json")], {
        cwd: resolve("."), encoding: "utf8", timeout: 15_000,
      });
      expect(result.status).toBe(1);
      expect(`${result.stdout}\n${result.stderr}`).toContain(message);
    } finally {
      if (resolve(temp).startsWith(resolve(tmpdir()) + sep)) rmSync(temp, { recursive: true, force: true });
    }
  });

  it("reports the four unresolved slots in the real manifest", () => {
    expect(inspectManifest().missingMaterialSlots).toEqual([
      "MAT_Carpet_Floor",
      "MAT_Console_Veneer_And_Leather",
      "MAT_Door_Card_Substrate",
      "MAT_Screen_Driver_Cluster",
    ]);
  });

  it("exits nonzero for the real manifest's unresolved slots", () => {
    const temp = mkdtempSync(join(tmpdir(), "autolab-manifest-"));
    try {
      const result = spawnSync(process.execPath, ["scripts/validate-glb.mjs", "--manifest-only", "--report", join(temp, "report.json")], {
        cwd: resolve("."), encoding: "utf8", timeout: 15_000,
      });
      expect(result.status).toBe(1);
      for (const slot of ["MAT_Carpet_Floor", "MAT_Console_Veneer_And_Leather", "MAT_Door_Card_Substrate", "MAT_Screen_Driver_Cluster"]) {
        expect(result.stderr).toContain(slot);
      }
    } finally {
      if (resolve(temp).startsWith(resolve(tmpdir()) + sep)) rmSync(temp, { recursive: true, force: true });
    }
  });
});
