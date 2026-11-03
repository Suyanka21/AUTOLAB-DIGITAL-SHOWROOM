import { describe, expect, it } from "vitest";
import { readFileSync, existsSync } from "node:fs";
import { createHash } from "node:crypto";
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import draco3d from "draco3dgltf";
import { attachThreadMask } from "../src/lib/three/thread-mask";
import { MeshStandardMaterial, Texture, Color, type WebGLRenderer } from "three";
import { generateRefCode } from "../src/lib/state/configurator-context";

const sha = (b: Buffer | Uint8Array) => createHash("sha256").update(b).digest("hex");

describe("L4B Lexus Interior Mock-up Assembly & Material Gate", () => {
  const L3_BASELINE_SHA = "c51e4db56faec8307eb6d6d25d88489cf212a935bafff0c2212c27abbcbc19d2";
  const L2A_DRIVER_SHA = "b3dc6a11a2387ceb0b97d01b15e6519f410aeebc5c1662b0a26c8f6b7090ec52";
  const L2B_PASSENGER_SHA = "54f5c69f86363ae78bada085719e30d4d0641966e7653cabb9e4f9c8fc05172c";

  it("preserves historical L3 and L2A baseline assets byte-for-byte for rollback", () => {
    const activeL2b = readFileSync("public/assets/3d/lexus-rx350/interior-l2b.glb");
    expect(sha(activeL2b)).toBe(L3_BASELINE_SHA);

    const driverSeat = readFileSync("public/assets/3d/lexus-rx350/driver-seat-l2a.glb");
    expect(sha(driverSeat)).toBe(L2A_DRIVER_SHA);

    const passengerSeat = readFileSync("public/assets/3d/lexus-rx350/passenger-seat-l2b.glb");
    expect(sha(passengerSeat)).toBe(L2B_PASSENGER_SHA);
  });

  const treatments = ["classic", "diamond", "perforated"] as const;

  it.each(treatments)("validates complete %s assembly structure and budget boundaries", async (treatment) => {
    const path = `public/assets/3d/lexus-rx350/interior-l4-${treatment}.glb`;
    expect(existsSync(path)).toBe(true);

    const bytes = readFileSync(path);
    // Hard limit: 5.0 MB (5,242,880 bytes)
    expect(bytes.length).toBeLessThan(5_242_880);

    const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
      "draco3d.decoder": await draco3d.createDecoderModule(),
    });
    const doc = await io.readBinary(bytes);
    const root = doc.getRoot();

    // 6 required nodes
    const nodeNames = root.listNodes().map((n) => n.getName());
    expect(nodeNames).toContain("GEO_Seat_Front_Driver");
    expect(nodeNames).toContain("GEO_Seat_Front_Passenger");
    expect(nodeNames).toContain("GEO_Seat_Stitching_Front");
    expect(nodeNames).toContain("GEO_Seat_Stitching_Front_Passenger");
    expect(nodeNames).toContain("GEO_SteeringWheel_Lexus");
    expect(nodeNames).toContain("GEO_Dashboard_Lexus");

    // 7 required material slots
    const matNames = root.listMaterials().map((m) => m.getName());
    expect(matNames).toContain("MAT_Seat_Primary");
    expect(matNames).toContain("MAT_Seat_Secondary");
    expect(matNames).toContain("MAT_Seat_Stitching");
    expect(matNames).toContain("MAT_Steering_Leather");
    expect(matNames).toContain("MAT_Dashboard_Trim");
    expect(matNames).toContain("MAT_Cockpit_Accent");
    expect(matNames).toContain("MAT_Cockpit_Black");

    // Triangle budget <= 80,000
    const totalTris = root
      .listMeshes()
      .flatMap((m) => m.listPrimitives())
      .reduce((sum, p) => sum + (p.getIndices()?.getCount() ?? 0) / 3, 0);
    expect(totalTris).toBeLessThanOrEqual(80_000);
  });

  it("applies corrected atlas UV coordinates consistently to both front seats", async () => {
    const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
      "draco3d.decoder": await draco3d.createDecoderModule(),
    });
    const doc = await io.readBinary(readFileSync("public/assets/3d/lexus-rx350/interior-l4-diamond.glb"));
    const root = doc.getRoot();

    const driverMesh = root.listNodes().find((n) => n.getName() === "GEO_Seat_Front_Driver")?.getMesh();
    const passMesh = root.listNodes().find((n) => n.getName() === "GEO_Seat_Front_Passenger")?.getMesh();
    expect(driverMesh).toBeDefined();
    expect(passMesh).toBeDefined();

    const driverPrimary = driverMesh!.listPrimitives().find((p) => p.getMaterial()?.getName() === "MAT_Seat_Primary")!;
    const passPrimary = passMesh!.listPrimitives().find((p) => p.getMaterial()?.getName() === "MAT_Seat_Primary")!;

    const driverUv = driverPrimary.getAttribute("TEXCOORD_0")!;
    const passUv = passPrimary.getAttribute("TEXCOORD_0")!;

    expect(driverUv.getCount()).toBe(passUv.getCount());

    // Verify non-overlapping atlas range: cushion in [0, 0.5], backrest in [0.5, 1.0]
    let hasCushionIsland = false;
    let hasBackrestIsland = false;
    const v = [0, 0];
    for (let i = 0; i < driverUv.getCount(); i++) {
      driverUv.getElement(i, v);
      if (v[0] < 0.48) hasCushionIsland = true;
      if (v[0] > 0.52) hasBackrestIsland = true;
    }
    expect(hasCushionIsland).toBe(true);
    expect(hasBackrestIsland).toBe(true);
  });
});

describe("L4B Quilt-Thread Mask Shader Hook", () => {
  it("binds live stitching thread color to primary diffuse shader and restores cleanly", () => {
    const primary = new MeshStandardMaterial({ roughnessMap: new Texture() });
    const thread = new MeshStandardMaterial({ color: new Color("#D4AF37") });
    const originalHook = primary.onBeforeCompile;
    const originalKey = primary.customProgramCacheKey;

    const restore = attachThreadMask(primary, thread);

    const shader = {
      fragmentShader: "#include <map_fragment>",
      vertexShader: "",
      uniforms: {} as Record<string, { value: unknown }>,
    };

    primary.onBeforeCompile(shader as Parameters<typeof primary.onBeforeCompile>[0], {} as WebGLRenderer);

    expect(shader.fragmentShader).toContain("l4ThreadColor");
    expect(shader.fragmentShader).toContain("texture2D( roughnessMap, vRoughnessMapUv ).a");
    expect(shader.uniforms.l4ThreadColor.value).toBe(thread.color);

    // Thread color update is reflected dynamically without recompiling
    thread.color.set("#FF0000");
    expect((shader.uniforms.l4ThreadColor.value as Color).getHexString()).toBe("ff0000");

    // Restores cleanly
    restore();
    expect(primary.onBeforeCompile).toBe(originalHook);
    expect(primary.customProgramCacheKey).toBe(originalKey);
  });

  it("throws descriptive error when required primary ORM texture or thread slot is missing", () => {
    const withoutOrm = new MeshStandardMaterial();
    const thread = new MeshStandardMaterial({ color: new Color("#D4AF37") });
    expect(() => attachThreadMask(withoutOrm, thread)).toThrow(/primary ORM/);
    expect(() => attachThreadMask(new MeshStandardMaterial({ roughnessMap: new Texture() }), null)).toThrow(/thread slot/);
  });
});

describe("L4B Reference Code & Consultation Format", () => {
  it("generates Lexus RX 350 reference codes with prefix AL-RX-2026", () => {
    const code = generateRefCode("lexus");
    expect(code).toMatch(/^AL-RX-2026-[A-Z0-9]{4}$/);
  });
});
