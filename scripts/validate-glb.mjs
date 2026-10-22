import { NodeIO } from "@gltf-transform/core";
import {
  KHRDracoMeshCompression, KHRMaterialsAnisotropy, KHRMaterialsClearcoat,
  KHRMaterialsEmissiveStrength, KHRMaterialsIOR, KHRMaterialsSheen,
  KHRMaterialsSpecular, KHRTextureBasisu, EXTTextureWebP,
} from "@gltf-transform/extensions";
import draco3d from "draco3dgltf";
import validator from "gltf-validator";
import Ajv from "ajv";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sClassManifestPath = resolve(root, "src/config/scene-manifest.s-class-v223.json");
const lexusManifestPath = resolve(root, "src/config/scene-manifest.lexus-rx350.json");
const schemaPath = resolve(root, "docs/schemas/scene-manifest.schema.json");
const planPath = resolve(root, "docs/spike/plan.md");
const performancePath = resolve(root, "docs/quality/performance-requirements.md");
const sClassVehiclePath = resolve(root, "src/config/vehicles/mercedes-s-class-v223.json");
const lexusVehiclePath = resolve(root, "src/config/vehicles/lexus-rx350-2020.json");
const packagePath = resolve(root, "package.json");
const spikeNodes = ["GEO_Seat_Front_Driver_Flutes", "GEO_Dashboard_Screen_Central_OLED"];
// Sources: docs/3d-assets/material-and-texture-specification.md and docs/quality/performance-requirements.md.
const allowedExtensions = new Set([
  "KHR_materials_clearcoat", "KHR_materials_sheen", "KHR_materials_specular",
  "KHR_materials_ior", "KHR_materials_anisotropy", "KHR_materials_emissive_strength",
  "KHR_texture_basisu", "KHR_draco_mesh_compression",
]);

function readJson(path) { return JSON.parse(readFileSync(path, "utf8")); }
function withTimeout(promise, label) {
  let timer;
  return Promise.race([
    promise,
    new Promise((_, reject) => { timer = setTimeout(() => reject(new Error(`${label} timed out`)), 30_000); }),
  ]).finally(() => clearTimeout(timer));
}
function numberFrom(text, pattern, label) {
  const match = text.match(pattern);
  if (!match) throw new Error(`Spike plan is missing ${label}`);
  return Number(match[1].replaceAll(",", ""));
}

function loadBudgets(scope, manifest) {
  if (scope === "lexus") {
    return {
      triangles: manifest.budgets.maxTriangles,
      drawCalls: manifest.budgets.maxDrawCalls,
      fileSizeBytes: manifest.budgets.maxFileSizeBytes,
      targetFileSizeBytes: 3_500_000,
      perNodeTriangles: {},
    };
  }
  if (scope !== "spike") {
    const performance = readFileSync(performancePath, "utf8");
    const targetMb = numberFrom(performance, /(5\.0) MB is the TARGET/i, "5 MB transfer target");
    const hardMb = numberFrom(performance, /and (15\.0) MB the HARD MAXIMUM/i, "15 MB transfer maximum");
    return {
      triangles: manifest.budgets.maxTriangles,
      drawCalls: manifest.budgets.maxDrawCalls,
      fileSizeBytes: Math.min(manifest.budgets.maxFileSizeBytes, hardMb * 1_000_000),
      targetFileSizeBytes: targetMb * 1_000_000,
      perNodeTriangles: {},
    };
  }
  const plan = readFileSync(planPath, "utf8");
  return {
    triangles: numberFrom(plan, /seat flutes at most ([\d,]+)/i, "seat triangle budget")
      + numberFrom(plan, /OLED at most ([\d,]+)/i, "OLED triangle budget"),
    drawCalls: numberFrom(plan, /Draw calls: at most ([\d,]+)/i, "draw-call budget"),
    fileSizeBytes: numberFrom(plan, /File size as transferred[^\n]*at most ([\d.]+) MB/i, "file-size budget") * 1_000_000,
    perNodeTriangles: {
      GEO_Seat_Front_Driver_Flutes: numberFrom(plan, /seat flutes at most ([\d,]+)/i, "seat triangle budget"),
      GEO_Dashboard_Screen_Central_OLED: numberFrom(plan, /OLED at most ([\d,]+)/i, "OLED triangle budget"),
    },
    oledDiagonalMm: numberFrom(plan, /OLED active-area diagonal is ([\d.]+) mm/i, "OLED diagonal"),
    oledToleranceMm: numberFrom(plan, /OLED active-area diagonal is [\d.]+ mm plus or minus ([\d.]+) mm/i, "OLED diagonal tolerance"),
  };
}

export function inspectManifest(manifestFile = sClassManifestPath) {
  const manifest = readJson(manifestFile);
  const schema = readJson(schemaPath);
  const ajv = new Ajv({ allErrors: true });
  const valid = ajv.validate(schema, manifest);
  const defined = new Set(manifest.materialSlots.map((slot) => slot.slotIdentifier));
  return {
    manifest,
    schemaErrors: valid ? [] : (ajv.errors ?? []).map((error) => `${error.instancePath} ${error.message}`),
    missingMaterialSlots: Array.from(new Set(manifest.nodes.map((node) => node.materialSlot).filter((slot) => !defined.has(slot)))).sort(),
  };
}

function readGlbJson(bytes) {
  const data = Buffer.from(bytes);
  if (data.length < 20 || data.toString("ascii", 0, 4) !== "glTF" || data.readUInt32LE(4) !== 2) {
    throw new Error("Invalid GLB header or version");
  }
  if (data.readUInt32LE(8) !== data.length || data.readUInt32LE(16) !== 0x4e4f534a) {
    throw new Error("Invalid GLB length or JSON chunk");
  }
  const length = data.readUInt32LE(12);
  if (20 + length > data.length) throw new Error("Truncated GLB JSON chunk");
  return JSON.parse(data.subarray(20, 20 + length).toString("utf8"));
}

function extentOfNode(node) {
  const min = [Infinity, Infinity, Infinity];
  const max = [-Infinity, -Infinity, -Infinity];
  const matrix = node.getWorldMatrix();
  const point = [0, 0, 0];
  for (const primitive of node.getMesh()?.listPrimitives() ?? []) {
    const positions = primitive.getAttribute("POSITION");
    if (!positions) continue;
    for (let index = 0; index < positions.getCount(); index++) {
      positions.getElement(index, point);
      const world = [
        matrix[0] * point[0] + matrix[4] * point[1] + matrix[8] * point[2] + matrix[12],
        matrix[1] * point[0] + matrix[5] * point[1] + matrix[9] * point[2] + matrix[13],
        matrix[2] * point[0] + matrix[6] * point[1] + matrix[10] * point[2] + matrix[14],
      ];
      for (let axis = 0; axis < 3; axis++) {
        min[axis] = Math.min(min[axis], world[axis]);
        max[axis] = Math.max(max[axis], world[axis]);
      }
    }
  }
  return { min, max };
}

function activeDisplayDiagonal(node) {
  const points = new Map();
  const matrix = node.getWorldMatrix();
  for (const primitive of node.getMesh().listPrimitives()) {
    const marker = primitive.getAttribute("_ACTIVE_DISPLAY");
    const positions = primitive.getAttribute("POSITION");
    if (!marker || !positions) continue;
    for (let i = 0; i < positions.getCount(); i++) {
      if (marker.getScalar(i) < 0.5) continue;
      const p = positions.getElement(i, []);
      const world = [0, 1, 2].map(axis =>
        matrix[axis] * p[0] + matrix[axis + 4] * p[1] + matrix[axis + 8] * p[2] + matrix[axis + 12]);
      points.set(world.map(v => v.toFixed(7)).join(","), world);
    }
  }
  // Four corner vertices on the actual active face, not user-supplied dimensions.
  if (points.size !== 4) return null;
  const corners = [...points.values()];
  return Math.max(...corners.flatMap((a, i) => corners.slice(i + 1).map(b =>
    Math.hypot(...a.map((v, axis) => v - b[axis]))))) * 1000;
}

export async function validateGlbBytes(bytes, { scope = "full", synthetic = false, feasibilityWebp = false } = {}) {
  if (scope !== "full" && scope !== "spike" && scope !== "lexus") throw new Error(`Unknown scope: ${scope}`);
  const activeManifestPath = scope === "lexus" ? lexusManifestPath : sClassManifestPath;
  const activeVehiclePath = scope === "lexus" ? lexusVehiclePath : sClassVehiclePath;
  const { manifest, schemaErrors, missingMaterialSlots } = inspectManifest(activeManifestPath);
  const packageJson = readJson(packagePath);
  const report = {
    passed: false, scope, synthetic,
    sha256: createHash("sha256").update(bytes).digest("hex"),
    toolVersions: {
      gltfTransformCore: packageJson.devDependencies["@gltf-transform/core"],
      gltfValidator: packageJson.devDependencies["gltf-validator"],
    },
    missingMaterialSlots, errors: [...schemaErrors], warnings: [],
    waivers: [], trianglesByNode: {}, textures: [],
    nodeCount: 0, materialCount: 0, triangleCount: 0, drawCalls: 0,
    fileSizeBytes: bytes.length, gpuTextureBytesEstimated: 0,
    activeDisplayDiagonalMm: /** @type {number | null} */ (null),
  };
  if (feasibilityWebp) {
    if (scope !== "spike" || synthetic) report.errors.push("WebP waiver is only valid for the real spike scope");
    else {
      report.waivers.push("P3-WEBP-2026-10-20");
      report.warnings.push("Owner-approved WebP feasibility deviation; not KTX2 production compliance (docs/spike/waivers.md).");
    }
  }

  const expectedNodes = scope === "spike" ? manifest.nodes.filter((node) => spikeNodes.includes(node.identifier)) : manifest.nodes;
  if (scope === "spike" && expectedNodes.length !== spikeNodes.length) report.errors.push("Spike node list does not match the manifest");
  const scopedMissing = expectedNodes.map((node) => node.materialSlot).filter((slot) => missingMaterialSlots.includes(slot));
  if (scopedMissing.length) report.errors.push(`undefined material slots: ${Array.from(new Set(scopedMissing)).sort().join(", ")}`);
  if (scope === "full" && missingMaterialSlots.length) report.errors.push(`undefined material slots: ${missingMaterialSlots.join(", ")}`);
  if (scope === "spike" && missingMaterialSlots.length) report.warnings.push(`Out-of-scope undefined material slots: ${missingMaterialSlots.join(", ")}`);

  const budgets = loadBudgets(scope, manifest);
  if (bytes.length > budgets.fileSizeBytes) report.errors.push(`file size ${bytes.length} exceeds ${budgets.fileSizeBytes} bytes`);
  if (budgets.targetFileSizeBytes && bytes.length > budgets.targetFileSizeBytes) report.warnings.push(`file size exceeds ${budgets.targetFileSizeBytes}-byte transfer target`);
  let raw;
  try { raw = readGlbJson(bytes); }
  catch (error) { report.errors.push(error.message); return report; }

  for (const extension of raw.extensionsUsed ?? []) {
    if (!allowedExtensions.has(extension) && !(extension === "EXT_texture_webp" && report.waivers.length)) report.errors.push(`banned extension: ${extension}`);
  }
  if ((raw.animations ?? []).length) report.errors.push("undeclared animations");
  const rawNames = (raw.materials ?? []).map((material) => material.name ?? "");
  for (const name of new Set(rawNames)) {
    if (rawNames.filter((candidate) => candidate === name).length > 1) report.errors.push(`duplicate material: ${name}`);
    if (name.endsWith(".001")) report.errors.push(`duplicate-style material name: ${name}`);
  }
  if (!synthetic) {
    if (!(raw.extensionsUsed ?? []).includes("KHR_draco_mesh_compression")) report.errors.push("missing Draco compression");
    if ((raw.textures ?? []).length && !(raw.extensionsUsed ?? []).includes("KHR_texture_basisu") && !report.waivers.length) report.errors.push("missing KTX2 textures");
  } else {
    report.warnings.push(`Synthetic fixture uses generated PNG${(raw.extensionsUsed ?? []).includes("KHR_draco_mesh_compression") ? " with Draco geometry" : " and uncompressed geometry"}; production KTX2 checks are deferred.`);
  }

  try {
    const result = await withTimeout(validator.validateBytes(new Uint8Array(bytes), { uri: "asset.glb", maxIssues: 100 }), "Khronos validation");
    report.validator = { numErrors: result.issues.numErrors, numWarnings: result.issues.numWarnings };
    for (const issue of result.issues.messages) {
      const message = `Khronos ${issue.code}: ${issue.message}`;
      if (issue.severity === 0) report.errors.push(message);
      else report.warnings.push(message);
    }
  } catch (error) { report.errors.push(`Khronos validator could not parse GLB: ${error}`); }

  let doc;
  try {
    const io = new NodeIO().registerExtensions([
      KHRDracoMeshCompression, KHRMaterialsAnisotropy, KHRMaterialsClearcoat,
      KHRMaterialsEmissiveStrength, KHRMaterialsIOR, KHRMaterialsSheen,
      KHRMaterialsSpecular, KHRTextureBasisu, EXTTextureWebP,
    ]);
    if ((raw.extensionsUsed ?? []).includes("KHR_draco_mesh_compression")) {
      io.registerDependencies({ "draco3d.decoder": await withTimeout(draco3d.createDecoderModule(), "Draco decoder") });
    }
    doc = await withTimeout(io.readBinary(new Uint8Array(bytes)), "GLB decoding");
  }
  catch (error) { report.errors.push(`glTF Transform could not read GLB: ${error.message}`); return report; }

  const rootDoc = doc.getRoot();
  const nodes = rootDoc.listNodes();
  const materials = rootDoc.listMaterials();
  for (const texture of rootDoc.listTextures()) {
    const size = texture.getSize();
    report.textures.push({ name: texture.getName(), mimeType: texture.getMimeType(), size });
    if (report.waivers.length && texture.getMimeType() !== "image/webp") report.errors.push("WebP waiver requires every texture to be image/webp");
    if (size) report.gpuTextureBytesEstimated += Math.ceil(size[0] * size[1] * (texture.getMimeType() === "image/ktx2" ? 1 : 4) * 4 / 3);
  }
  report.nodeCount = nodes.length;
  report.materialCount = materials.length;

  const actualNames = nodes.map((node) => node.getName());
  if (scope === "lexus") {
    // Lexus rebaseline: support multiple sub-meshes per component group
    const componentGroups = expectedNodes.map((node) => node.identifier);
    for (const comp of componentGroups) {
      const hasMatch = actualNames.some((name) => name === comp || name.startsWith(`${comp}_`));
      if (!hasMatch) report.errors.push(`missing node: ${comp}`);
    }
    for (const name of actualNames) {
      const matches = componentGroups.some((comp) => name === comp || name.startsWith(`${comp}_`));
      if (!matches) report.errors.push(`extra node: ${name}`);
    }
  } else {
    const expectedNames = new Set(expectedNodes.map((node) => node.identifier));
    for (const name of expectedNames) if (!actualNames.includes(name)) report.errors.push(`missing node: ${name}`);
    for (const name of actualNames) if (!expectedNames.has(name)) report.errors.push(`extra node: ${name}`);
  }
  if (new Set(actualNames).size !== actualNames.length) report.errors.push("duplicate node names");
  if (nodes.some((node) => node.getCamera())) report.errors.push("camera node is not allowed");

  const slots = new Map(manifest.materialSlots.map((slot) => [slot.slotIdentifier, slot]));
  const allowedMaterialNames = new Set(manifest.materialSlots.map((slot) => slot.slotIdentifier));
  const expectedMaterialNames = scope === "lexus"
    ? allowedMaterialNames
    : new Set(expectedNodes.map((node) => node.materialSlot));

  if (scope !== "lexus") {
    for (const name of expectedMaterialNames) if (!materials.some((material) => material.getName() === name)) report.errors.push(`missing material: ${name}`);
  }
  for (const material of materials) {
    const name = material.getName();
    if (!allowedMaterialNames.has(name) || (scope !== "lexus" && !expectedMaterialNames.has(name))) {
      report.errors.push(`extra material: ${name}`);
    }
    const slot = slots.get(name);
    if (!slot) continue;
    if (Math.abs(material.getRoughnessFactor() - slot.defaultRoughness) > 0.0001) report.errors.push(`roughness mismatch: ${name}`);
    if (Math.abs(material.getMetallicFactor() - slot.defaultMetallic) > 0.0001) report.errors.push(`metallic mismatch: ${name}`);
    if (Boolean(material.getExtension("KHR_materials_clearcoat")) !== slot.hasClearcoat) report.errors.push(`clearcoat mismatch: ${name}`);
    if (Boolean(material.getNormalTexture()) !== slot.hasNormalMap) report.errors.push(`normal-map mismatch: ${name}`);
    for (const texture of [material.getBaseColorTexture(), material.getNormalTexture(), material.getMetallicRoughnessTexture(), material.getEmissiveTexture(), material.getOcclusionTexture()].filter(Boolean)) {
      const size = texture.getSize();
      if (!size) report.errors.push(`unknown texture dimensions: ${name}`);
      else {
        if (Math.max(...size) > Number(slot.textureResolutionBudget)) report.errors.push(`texture resolution exceeds budget: ${name}`);
      }
    }
    if (!synthetic && name === "MAT_Upholstery_Primary" && (!material.getBaseColorTexture() || !material.getMetallicRoughnessTexture())) {
      report.errors.push("Primary upholstery is missing required albedo or ORM texture");
    }
  }

  const vehicle = readJson(activeVehiclePath);
  const maxExtent = [vehicle.dimensions.overallWidthMm, vehicle.dimensions.overallHeightMm, vehicle.dimensions.overallLengthMm].map((mm) => mm / 1000);
  for (const node of nodes) {
    const nodeName = node.getName();
    const definition = scope === "lexus"
      ? expectedNodes.find((item) => nodeName === item.identifier || nodeName.startsWith(`${item.identifier}_`))
      : expectedNodes.find((item) => item.identifier === nodeName);
    const mesh = node.getMesh();
    if (!mesh) { report.errors.push(`node has no mesh: ${nodeName}`); continue; }
    let nodeTriangles = 0;
    for (const primitive of mesh.listPrimitives()) {
      report.drawCalls++;
      if (primitive.getMode() !== 4) report.errors.push(`non-triangle primitive: ${nodeName}`);
      const triangles = (primitive.getIndices()?.getCount() ?? primitive.getAttribute("POSITION")?.getCount() ?? 0) / 3;
      nodeTriangles += triangles;
      const material = primitive.getMaterial();
      if (definition) {
        if (scope === "lexus") {
          const allowedSlots = definition.allowedMaterialSlots ?? [definition.materialSlot];
          if (!material || !allowedSlots.includes(material.getName())) {
            report.errors.push(`material binding mismatch: ${nodeName}`);
          }
        } else {
          if (material?.getName() !== definition.materialSlot) {
            report.errors.push(`material binding mismatch: ${nodeName}`);
          }
        }
      }
      const textured = material && [material.getBaseColorTexture(), material.getNormalTexture(), material.getMetallicRoughnessTexture(), material.getEmissiveTexture(), material.getOcclusionTexture()].some(Boolean);
      if (textured && !primitive.getAttribute("TEXCOORD_0")) report.errors.push(`missing UV: ${nodeName}`);
      if (material?.getNormalTexture() && !primitive.getAttribute("TANGENT")) report.errors.push(`missing tangents: ${nodeName}`);
    }
    report.triangleCount += nodeTriangles;
    report.trianglesByNode[nodeName] = nodeTriangles;
    const nodeBudget = budgets.perNodeTriangles[nodeName];
    if (nodeBudget !== undefined && nodeTriangles > nodeBudget) report.errors.push(`node triangle budget exceeded: ${nodeName}`);
    const extent = extentOfNode(node);
    if (extent.min.every(Number.isFinite)) {
      for (let axis = 0; axis < 3; axis++) {
        if (extent.max[axis] - extent.min[axis] > maxExtent[axis]) report.errors.push(`vehicle bounds exceeded: ${nodeName} axis ${axis}`);
        if (Math.max(Math.abs(extent.min[axis]), Math.abs(extent.max[axis])) > maxExtent[axis]) report.errors.push(`vehicle position exceeded: ${nodeName} axis ${axis}`);
      }
      if (nodeName === "GEO_Dashboard_Screen_Central_OLED" && budgets.oledDiagonalMm) {
        const measured = activeDisplayDiagonal(node);
        if (measured === null && !synthetic) report.errors.push("missing active-display geometry marker (four corners required)");
        const diagonalMm = measured ?? Math.hypot(extent.max[0] - extent.min[0], extent.max[1] - extent.min[1]) * 1000;
        report.activeDisplayDiagonalMm = diagonalMm;
        if (Math.abs(diagonalMm - budgets.oledDiagonalMm) > budgets.oledToleranceMm) report.errors.push(`OLED diagonal tolerance exceeded: ${diagonalMm.toFixed(2)} mm`);
      }
    }
  }
  if (report.triangleCount > budgets.triangles) report.errors.push(`triangle budget exceeded: ${report.triangleCount}`);
  if (report.drawCalls > budgets.drawCalls) report.errors.push(`draw-call budget exceeded: ${report.drawCalls}`);
  if (manifest.budgets.maxGpuMemoryMb && report.gpuTextureBytesEstimated > manifest.budgets.maxGpuMemoryMb * 1_000_000) {
    report.errors.push(`estimated GPU texture memory exceeds ${manifest.budgets.maxGpuMemoryMb} MB`);
  }
  report.passed = report.errors.length === 0;
  return report;
}

function parseArgs(args) {
  const options = { scope: "full", synthetic: false, manifestOnly: false, feasibilityWebp: false, asset: null, report: resolve(root, "reports/glb-report.json") };
  for (let index = 0; index < args.length; index++) {
    if (args[index] === "--scope") options.scope = args[++index];
    else if (args[index] === "--asset") options.asset = resolve(args[++index]);
    else if (args[index] === "--report") options.report = resolve(args[++index]);
    else if (args[index] === "--synthetic") options.synthetic = true;
    else if (args[index] === "--feasibility-webp") options.feasibilityWebp = true;
    else if (args[index] === "--manifest-only") options.manifestOnly = true;
    else throw new Error(`Unknown argument: ${args[index]}`);
  }
  if (!["full", "spike", "lexus"].includes(options.scope)) throw new Error(`Unknown scope: ${options.scope}`);
  if (!options.asset) {
    if (options.scope === "lexus") {
      options.asset = resolve(root, "tests/fixtures/lexus-synthetic.glb");
    } else {
      options.asset = resolve(root, "public/assets/3d/s-class-v223/spike.glb");
    }
  }
  return options;
}

async function main() {
  let output = resolve(root, "reports/glb-report.json");
  let report;
  try {
    const options = parseArgs(process.argv.slice(2));
    output = options.report;
    if (options.manifestOnly) {
      const activeManifest = options.scope === "lexus" ? lexusManifestPath : sClassManifestPath;
      const { schemaErrors, missingMaterialSlots } = inspectManifest(activeManifest);
      report = { passed: false, scope: options.scope, asset: null, sha256: null, missingMaterialSlots,
        errors: [...schemaErrors, ...(missingMaterialSlots.length ? [`undefined material slots: ${missingMaterialSlots.join(", ")}`] : [])], warnings: [] };
      report.passed = report.errors.length === 0;
    } else {
      report = await validateGlbBytes(await readFile(options.asset), options);
      report.asset = relative(root, options.asset);
    }
  } catch (error) {
    report = { passed: false, errors: [error.message], warnings: [], sha256: null };
  }
  await mkdir(dirname(output), { recursive: true });
  await writeFile(output, `${JSON.stringify(report, null, 2)}\n`);
  console.log(`Asset gate ${report.passed ? "PASS" : "FAIL"}: ${report.nodeCount ?? 0} nodes, ${report.triangleCount ?? 0} triangles, ${report.drawCalls ?? 0} draw calls; sha256 ${report.sha256 ?? "none"}`);
  for (const error of report.errors) console.error(`ERROR: ${error}`);
  for (const warning of report.warnings) console.warn(`WARN: ${warning}`);
  console.log(`Report: ${output}`);
  if (!report.passed) process.exitCode = 1;
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
