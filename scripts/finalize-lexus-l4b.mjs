// AutoLab Phase L4 Stage B - Lexus RX 350 Complete Assembly Material Treatments
// Generates full 6-node, 7-slot assemblies for Classic, Diamond Quilted, and Perforated.
// Preserves original L3 interior-l2b.glb, driver-seat-l2a.glb, and passenger-seat-l2b.glb intact for rollback.

import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS, KHRDracoMeshCompression } from "@gltf-transform/extensions";
import draco3d from "draco3dgltf";
import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { existsSync } from "node:fs";
import { readFile, writeFile, mkdir } from "node:fs/promises";
import { resolve } from "node:path";
import assert from "node:assert/strict";
import { mergeGlbs } from "./lib/merge-glbs.mjs";
import { replaceImages } from "./lib/lexus-material-images.mjs";

const root = process.cwd();
const out = resolve(root, "blender/out/lexus-l4ar1");
const dest = resolve(root, "public/assets/3d/lexus-rx350");
const texDest = resolve(dest, "textures");
await mkdir(dest, { recursive: true });
await mkdir(texDest, { recursive: true });
await mkdir(resolve(root, "reports"), { recursive: true });

const sha = (b) => createHash("sha256").update(b).digest("hex");

// 1. Verify that baseline L3 assets remain intact
const l3BaselineSha = "c51e4db56faec8307eb6d6d25d88489cf212a935bafff0c2212c27abbcbc19d2";
const activeInterior = await readFile(resolve(dest, "interior-l2b.glb"));
assert.equal(sha(activeInterior), l3BaselineSha, "L3 interior-l2b.glb baseline modified");

const driverBaselineSha = "b3dc6a11a2387ceb0b97d01b15e6519f410aeebc5c1662b0a26c8f6b7090ec52";
const driverSeat = await readFile(resolve(dest, "driver-seat-l2a.glb"));
assert.equal(sha(driverSeat), driverBaselineSha, "L2A driver-seat-l2a.glb baseline modified");

const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
  "draco3d.decoder": await draco3d.createDecoderModule(),
  "draco3d.encoder": await draco3d.createEncoderModule(),
});

// 2. Ensure uv-seat.glb is available with R1 corrected UVs
const uvSeatPath = resolve(out, "uv-seat.glb");
if (!existsSync(uvSeatPath)) {
  console.log("Preparing L4A-R1 UV seat...");
  execFileSync("node", ["tools/prepare-lexus-l4ar1.mjs"], { stdio: "inherit" });
}
const uvSeatBytes = await readFile(uvSeatPath);

// 3. Derive passenger seat from uv-seat.glb with symmetric UVs and transforms
const passDoc = await io.readBinary(uvSeatBytes);
for (const node of passDoc.getRoot().listNodes()) {
  node.setName(
    node.getName() === "GEO_Seat_Front_Driver"
      ? "GEO_Seat_Front_Passenger"
      : "GEO_Seat_Stitching_Front_Passenger"
  );
  node.getMesh().setName(node.getName());
  for (const p of node.getMesh().listPrimitives()) {
    for (const semantic of ["POSITION", "NORMAL", "TANGENT"]) {
      const a = p.getAttribute(semantic);
      if (!a) continue;
      const v = [];
      for (let i = 0; i < a.getCount(); i++) {
        a.getElement(i, v);
        v[0] = -v[0];
        if (semantic === "TANGENT") v[3] = -v[3];
        a.setElement(i, v);
      }
    }
    const idx = p.getIndices();
    const data = idx.getArray();
    for (let i = 0; i < data.length; i += 3) {
      const b = data[i + 1];
      data[i + 1] = data[i + 2];
      data[i + 2] = b;
    }
  }
}
passDoc.createExtension(KHRDracoMeshCompression).setRequired(true).setEncoderOptions({
  method: KHRDracoMeshCompression.EncoderMethod.EDGEBREAKER,
  encodeSpeed: 5,
  decodeSpeed: 5,
  quantizationBits: { POSITION: 16, NORMAL: 10, TEXCOORD: 14, COLOR: 10, GENERIC: 12 },
});
const passBytes = await io.writeBinary(passDoc);

// 4. Load cockpit components (Wheel and Dashboard)
const wheelBytes = await readFile(resolve(dest, "wheel-l2b.glb"));
const dashBytes = await readFile(resolve(dest, "dashboard-l2b.glb"));

// 5. Assemble baseline Classic 6-node scene
const fullClassic = mergeGlbs([uvSeatBytes, passBytes, wheelBytes, dashBytes]);
const classicPath = resolve(dest, "interior-l4-classic.glb");
await writeFile(classicPath, fullClassic);
console.log(`[L4B] Built Classic assembly: ${fullClassic.length} bytes -> ${classicPath}`);

// 6. Extract / prepare KTX2 texture maps for Diamond and Perforated
async function getTextureMap(kind) {
  const map = new Map();
  for (const role of ["base", "normal", "orm"]) {
    const ktxPath = resolve(out, `${kind}-${role}.ktx2`);
    let bytes;
    if (existsSync(ktxPath)) {
      bytes = await readFile(ktxPath);
    } else {
      // Extract from the verified experiment GLB
      const expGlb = await readFile(resolve(root, "experiments/lexus-l4ar1", `${kind}.glb`));
      const expDoc = await io.readBinary(expGlb);
      const tex = expDoc.getRoot().listTextures().find((t) => t.getName() === `lexus-insert-${role}`);
      assert(tex, `Missing texture lexus-insert-${role} in ${kind}.glb`);
      bytes = Buffer.from(tex.getImage());
    }
    map.set(`lexus-insert-${role}`, bytes);
    // Write standalone texture for direct texture-swapping
    await writeFile(resolve(texDest, `${kind}-insert-${role}.ktx2`), bytes);
  }
  return map;
}

// Write classic insert textures for standalone access
const classicDoc = await io.readBinary(fullClassic);
for (const role of ["base", "normal", "orm"]) {
  const tex = classicDoc.getRoot().listTextures().find((t) => t.getName() === `lexus-insert-${role}`);
  if (tex) {
    await writeFile(resolve(texDest, `classic-insert-${role}.ktx2`), Buffer.from(tex.getImage()));
  }
}

// 7. Assemble Diamond scene
const diamondTextures = await getTextureMap("diamond");
const fullDiamond = replaceImages(fullClassic, diamondTextures);
const diamondPath = resolve(dest, "interior-l4-diamond.glb");
await writeFile(diamondPath, fullDiamond);
console.log(`[L4B] Built Diamond assembly: ${fullDiamond.length} bytes -> ${diamondPath}`);

// 8. Assemble Perforated scene
const perfTextures = await getTextureMap("perforated");
const fullPerf = replaceImages(fullClassic, perfTextures);
const perfPath = resolve(dest, "interior-l4-perforated.glb");
await writeFile(perfPath, fullPerf);
console.log(`[L4B] Built Perforated assembly: ${fullPerf.length} bytes -> ${perfPath}`);

// 9. Validate all three assemblies against validate-glb.mjs
const results = [];
for (const [name, path] of [
  ["classic", classicPath],
  ["diamond", diamondPath],
  ["perforated", perfPath],
]) {
  const reportPath = resolve(root, `reports/lexus-l4b-${name}-report.json`);
  console.log(`[L4B] Validating ${name} with validate-glb.mjs...`);
  try {
    execFileSync("node", ["scripts/validate-glb.mjs", "--scope", "lexus", "--asset", path, "--report", reportPath], {
      stdio: "pipe",
      encoding: "utf8",
    });
    const rep = JSON.parse(await readFile(reportPath, "utf8"));
    results.push({ name, passed: true, sha256: rep.sha256, bytes: (await readFile(path)).length, report: reportPath });
    console.log(`[L4B] ${name}: PASS (sha256: ${rep.sha256.slice(0, 16)}...)`);
  } catch (err) {
    console.error(`[L4B] ${name} validation FAILED:`, err.message);
    throw err;
  }
}

// Ensure original L3 asset is still byte-identical
assert.equal(sha(await readFile(resolve(dest, "interior-l2b.glb"))), l3BaselineSha);

const summary = {
  timestamp: new Date().toISOString(),
  assemblies: results,
  baselineL3Sha256: l3BaselineSha,
  baselineL2ADriverSha256: driverBaselineSha,
};
await writeFile(resolve(root, "reports/lexus-l4b-summary.json"), JSON.stringify(summary, null, 2) + "\n");
console.log("[L4B] All three Lexus interior assemblies successfully built and validated!");
