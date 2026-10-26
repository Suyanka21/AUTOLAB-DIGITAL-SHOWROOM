import { Document, NodeIO } from "@gltf-transform/core";
import { KHRDracoMeshCompression, KHRMaterialsClearcoat } from "@gltf-transform/extensions";
import draco3d from "draco3dgltf";
import { deflateSync } from "node:zlib";
import { createHash } from "node:crypto";
import { mkdir, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

// A generated 2x2 flat tangent-space normal map; no third-party texture is used.
function crc32(data) {
  let crc = 0xffffffff;
  for (const byte of data) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function pngChunk(type, data) {
  const tag = Buffer.from(type);
  const chunk = Buffer.alloc(12 + data.length);
  chunk.writeUInt32BE(data.length, 0);
  tag.copy(chunk, 4);
  data.copy(chunk, 8);
  chunk.writeUInt32BE(crc32(chunk.subarray(4, 8 + data.length)), 8 + data.length);
  return chunk;
}

function makeNormalPng() {
  const header = Buffer.alloc(13);
  header.writeUInt32BE(2, 0);
  header.writeUInt32BE(2, 4);
  header[8] = 8;
  header[9] = 6;
  const row = Buffer.from([0, 128, 128, 255, 255, 128, 128, 255, 255]);
  return Buffer.concat([
    Buffer.from("89504e470d0a1a0a", "hex"),
    pngChunk("IHDR", header),
    pngChunk("IDAT", deflateSync(Buffer.concat([row, row]), { level: 9 })),
    pngChunk("IEND", Buffer.alloc(0)),
  ]);
}

function addQuad(doc, buffer, scene, name, material, width, height, translation) {
  const positions = new Float32Array([
    -width / 2, -height / 2, 0, width / 2, -height / 2, 0,
    width / 2, height / 2, 0, -width / 2, height / 2, 0,
  ]);
  const normals = new Float32Array([0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1]);
  const tangents = new Float32Array([1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1, 1, 0, 0, 1]);
  const uvs = new Float32Array([0, 0, 1, 0, 1, 1, 0, 1]);
  const primitive = doc.createPrimitive()
    .setAttribute("POSITION", doc.createAccessor(`${name}_positions`, buffer).setType("VEC3").setArray(positions))
    .setAttribute("NORMAL", doc.createAccessor(`${name}_normals`, buffer).setType("VEC3").setArray(normals))
    .setIndices(doc.createAccessor(`${name}_indices`, buffer).setType("SCALAR").setArray(new Uint16Array([0, 1, 2, 0, 2, 3])))
    .setMaterial(material);
  if (material.getNormalTexture()) {
    primitive
      .setAttribute("TANGENT", doc.createAccessor(`${name}_tangents`, buffer).setType("VEC4").setArray(tangents))
      .setAttribute("TEXCOORD_0", doc.createAccessor(`${name}_uvs`, buffer).setType("VEC2").setArray(uvs));
  }
  scene.addChild(doc.createNode(name).setMesh(doc.createMesh(`${name}_mesh`).addPrimitive(primitive)).setTranslation(translation));
}

/**
 * Phase L2A Driver Seat Prototype Fixture
 * Requires ONLY:
 * - GEO_Seat_Front_Driver and permitted sub-meshes (GEO_Seat_Front_Driver_Bolsters)
 * - GEO_Seat_Stitching_Front
 * - MAT_Seat_Primary, MAT_Seat_Secondary, MAT_Seat_Stitching
 */
export async function createLexusPrototypeFixture({ draco = false } = {}) {
  const doc = new Document();
  const buffer = doc.createBuffer();
  const scene = doc.createScene("SyntheticLexusDriverSeatPrototype");
  doc.getRoot().setDefaultScene(scene);
  const clearcoat = doc.createExtension(KHRMaterialsClearcoat);
  const normal = doc.createTexture("GeneratedFlatNormal")
    .setImage(makeNormalPng())
    .setMimeType("image/png");

  const matPrimary = doc.createMaterial("MAT_Seat_Primary")
    .setRoughnessFactor(0.48)
    .setMetallicFactor(0)
    .setNormalTexture(normal)
    .setExtension("KHR_materials_clearcoat", clearcoat.createClearcoat().setClearcoatFactor(0.05));

  const matSecondary = doc.createMaterial("MAT_Seat_Secondary")
    .setRoughnessFactor(0.48)
    .setMetallicFactor(0)
    .setNormalTexture(normal)
    .setExtension("KHR_materials_clearcoat", clearcoat.createClearcoat().setClearcoatFactor(0.05));

  const matStitching = doc.createMaterial("MAT_Seat_Stitching")
    .setRoughnessFactor(0.35)
    .setMetallicFactor(0);

  // 1. Driver seat main insert
  addQuad(doc, buffer, scene, "GEO_Seat_Front_Driver", matPrimary, 0.45, 0.55, [-0.4, 0.5, 0.1]);
  // 2. Driver seat bolsters sub-mesh
  addQuad(doc, buffer, scene, "GEO_Seat_Front_Driver_Bolsters", matSecondary, 0.2, 0.55, [-0.65, 0.5, 0.1]);
  // 3. Driver seat contrast stitching
  addQuad(doc, buffer, scene, "GEO_Seat_Stitching_Front", matStitching, 0.05, 0.55, [-0.4, 0.5, 0.11]);

  const io = new NodeIO().registerExtensions([KHRMaterialsClearcoat, KHRDracoMeshCompression]);
  if (draco) {
    doc.createExtension(KHRDracoMeshCompression).setRequired(true);
    io.registerDependencies({ "draco3d.encoder": await draco3d.createEncoderModule() });
  }
  return io.writeBinary(doc);
}

/**
 * Full Lexus Scope Fixture (All 5 component groups)
 */
export async function createLexusFullSyntheticFixture({ draco = false } = {}) {
  const doc = new Document();
  const buffer = doc.createBuffer();
  const scene = doc.createScene("SyntheticLexusCockpit");
  doc.getRoot().setDefaultScene(scene);
  const clearcoat = doc.createExtension(KHRMaterialsClearcoat);
  const normal = doc.createTexture("GeneratedFlatNormal")
    .setImage(makeNormalPng())
    .setMimeType("image/png");

  const matPrimary = doc.createMaterial("MAT_Seat_Primary")
    .setRoughnessFactor(0.48)
    .setMetallicFactor(0)
    .setNormalTexture(normal)
    .setExtension("KHR_materials_clearcoat", clearcoat.createClearcoat().setClearcoatFactor(0.05));

  const matSecondary = doc.createMaterial("MAT_Seat_Secondary")
    .setRoughnessFactor(0.48)
    .setMetallicFactor(0)
    .setNormalTexture(normal)
    .setExtension("KHR_materials_clearcoat", clearcoat.createClearcoat().setClearcoatFactor(0.05));

  const matStitching = doc.createMaterial("MAT_Seat_Stitching")
    .setRoughnessFactor(0.35)
    .setMetallicFactor(0);

  const matSteering = doc.createMaterial("MAT_Steering_Leather")
    .setRoughnessFactor(0.45)
    .setMetallicFactor(0)
    .setNormalTexture(normal);

  const matDashboard = doc.createMaterial("MAT_Dashboard_Trim")
    .setRoughnessFactor(0.65)
    .setMetallicFactor(0)
    .setNormalTexture(normal);

  // 1. Driver seat main insert
  addQuad(doc, buffer, scene, "GEO_Seat_Front_Driver", matPrimary, 0.45, 0.55, [-0.4, 0.5, 0.1]);
  // 2. Driver seat bolsters sub-mesh
  addQuad(doc, buffer, scene, "GEO_Seat_Front_Driver_Bolsters", matSecondary, 0.2, 0.55, [-0.65, 0.5, 0.1]);
  // 3. Passenger seat
  addQuad(doc, buffer, scene, "GEO_Seat_Front_Passenger", matPrimary, 0.45, 0.55, [0.4, 0.5, 0.1]);
  // 4. Stitching geometry
  addQuad(doc, buffer, scene, "GEO_Seat_Stitching_Front", matStitching, 0.05, 0.55, [-0.4, 0.5, 0.11]);
  // 5. Steering wheel
  addQuad(doc, buffer, scene, "GEO_SteeringWheel_Lexus", matSteering, 0.38, 0.38, [-0.38, 0.8, -0.4]);
  // 6. Dashboard cowl & bezel
  addQuad(doc, buffer, scene, "GEO_Dashboard_Lexus", matDashboard, 1.4, 0.35, [0, 0.85, -0.6]);

  // L2B keeps existing nodes/material indexes and adds actual finish bindings.
  const accent = doc.createMaterial("MAT_Cockpit_Accent").setRoughnessFactor(.30).setMetallicFactor(.70);
  const black = doc.createMaterial("MAT_Cockpit_Black").setRoughnessFactor(.30).setMetallicFactor(0);
  const passenger = doc.getRoot().listNodes().find(n => n.getName() === "GEO_Seat_Front_Passenger").getMesh();
  passenger.addPrimitive(passenger.listPrimitives()[0].clone().setMaterial(matSecondary));
  for (const name of ["GEO_SteeringWheel_Lexus", "GEO_Dashboard_Lexus"]) {
    const mesh = doc.getRoot().listNodes().find(n => n.getName() === name).getMesh();
    for (const material of [accent, black]) mesh.addPrimitive(mesh.listPrimitives()[0].clone().setMaterial(material));
  }

  const io = new NodeIO().registerExtensions([KHRMaterialsClearcoat, KHRDracoMeshCompression]);
  if (draco) {
    doc.createExtension(KHRDracoMeshCompression).setRequired(true);
    io.registerDependencies({ "draco3d.encoder": await draco3d.createEncoderModule() });
  }
  return io.writeBinary(doc);
}

export const createLexusSyntheticFixture = createLexusFullSyntheticFixture;

export async function createSyntheticFixture({ scope = "spike", draco = false } = {}) {
  if (scope === "lexus-l2a" || scope === "l2a") {
    return createLexusPrototypeFixture({ draco });
  }
  if (scope === "lexus") {
    return createLexusFullSyntheticFixture({ draco });
  }

  const doc = new Document();
  const buffer = doc.createBuffer();
  const scene = doc.createScene("SyntheticSpike");
  doc.getRoot().setDefaultScene(scene);
  const clearcoat = doc.createExtension(KHRMaterialsClearcoat);
  const normal = doc.createTexture("GeneratedFlatNormal")
    .setImage(makeNormalPng())
    .setMimeType("image/png");
  const seat = doc.createMaterial("MAT_Upholstery_Primary")
    .setRoughnessFactor(0.48)
    .setMetallicFactor(0)
    .setNormalTexture(normal)
    .setExtension("KHR_materials_clearcoat", clearcoat.createClearcoat().setClearcoatFactor(0.05));
  const oled = doc.createMaterial("MAT_Screen_Central_OLED")
    .setRoughnessFactor(0.02)
    .setMetallicFactor(0)
    .setExtension("KHR_materials_clearcoat", clearcoat.createClearcoat().setClearcoatFactor(0.05));
  addQuad(doc, buffer, scene, "GEO_Seat_Front_Driver_Flutes", seat, 0.5, 0.5, [0, 0, 0]);
  addQuad(doc, buffer, scene, "GEO_Dashboard_Screen_Central_OLED", oled, 0.286, 0.155, [0.6, 0.5, 0]);
  const io = new NodeIO().registerExtensions([KHRMaterialsClearcoat, KHRDracoMeshCompression]);
  if (draco) {
    doc.createExtension(KHRDracoMeshCompression).setRequired(true);
    io.registerDependencies({ "draco3d.encoder": await draco3d.createEncoderModule() });
  }
  return io.writeBinary(doc);
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const scopeIdx = process.argv.indexOf("--scope");
  const scope = scopeIdx !== -1 ? process.argv[scopeIdx + 1] : "spike";
  const defaultOutput = scope === "lexus-l2a" || scope === "l2a"
    ? "tests/fixtures/lexus-prototype-synthetic.glb"
    : scope === "lexus"
    ? "tests/fixtures/lexus-synthetic.glb"
    : "tests/fixtures/spike-synthetic.glb";
  const output = resolve(process.argv.find((arg) => arg.endsWith(".glb")) ?? defaultOutput);
  const draco = process.argv.includes("--draco");
  const bytes = scope === "lexus-l2a" || scope === "l2a"
    ? await createLexusPrototypeFixture({ draco })
    : scope === "lexus"
    ? await createLexusFullSyntheticFixture({ draco })
    : await createSyntheticFixture({ draco });
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, bytes);
  console.log(`Synthetic GLB (${scope}): ${output} (${bytes.length} bytes, sha256 ${createHash("sha256").update(bytes).digest("hex")})`);
}
