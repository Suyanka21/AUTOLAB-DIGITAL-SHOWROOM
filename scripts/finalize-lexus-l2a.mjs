// L2A: installed KTX-Software 4.4.2 + existing glTF Transform/Draco dependencies.
// toktx options verified against local --help; glTF uses upper-left image orientation.
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS, KHRTextureBasisu, KHRDracoMeshCompression } from "@gltf-transform/extensions";
import draco3d from "draco3dgltf";
import { execFileSync, spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const out = resolve(root, "blender/out/lexus-l2a-r1");
const destination = resolve(root, "public/assets/3d/lexus-rx350/driver-seat-l2a.glb");
const ktxBin = process.env.KTX_BIN ?? "C:/Program Files/KTX-Software/bin";
const run = (exe, args) => execFileSync(resolve(ktxBin, exe), args, { encoding: "utf8", timeout: 180_000 });
const sha = bytes => createHash("sha256").update(bytes).digest("hex");
const started = performance.now();
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
  "draco3d.decoder": await draco3d.createDecoderModule(),
  "draco3d.encoder": await draco3d.createEncoderModule(),
});
const doc = await io.read(resolve(out, "driver-seat-raw.glb"));
for (const [name, prefix] of [["MAT_Seat_Primary", "lexus-insert"], ["MAT_Seat_Secondary", "lexus-bolster"]]) {
  const material = doc.getRoot().listMaterials().find(m => m.getName() === name);
  if (!material) throw new Error("Missing material " + name);
  material.setBaseColorFactor([.022, .026, .032, 1]);
  const orm = doc.createTexture(prefix + "-orm").setImage(await readFile(resolve(out, prefix + "-orm.png"))).setMimeType("image/png");
  material.setMetallicRoughnessTexture(orm).setOcclusionTexture(orm);
}
const textureRecords = [];
for (const [index, texture] of doc.getRoot().listTextures().entries()) {
  const stem = "texture-" + index;
  const png = resolve(out, stem + ".png");
  const ktx = resolve(out, stem + ".ktx2");
  await writeFile(png, texture.getImage());
  const isColor = doc.getRoot().listMaterials().some(m => m.getBaseColorTexture() === texture);
  const args = ["--t2", "--encode", "uastc", "--uastc_quality", "2", "--uastc_rdo_l", "1.1",
    "--zcmp", "9", "--genmipmap", "--assign_oetf", isColor ? "srgb" : "linear", "--threads", "4", ktx, png];
  run("toktx.exe", args);
  run("ktx.exe", ["validate", ktx]);
  const bytes = await readFile(ktx);
  texture.setImage(bytes).setMimeType("image/ktx2");
  // Decode the delivered KTX payload for Blender, which cannot import KTX2 directly.
  const decoded = resolve(out, stem + "-decoded.png");
  run("ktx.exe", ["extract", "--transcode", "rgba8", "--level", "0", ktx, decoded]);
  textureRecords.push({ name: texture.getName(), index, bytes: bytes.length, sha256: sha(bytes),
    sourceSha256: sha(await readFile(png)), decodedPng: stem + "-decoded.png", arguments: args });
}
doc.createExtension(KHRTextureBasisu).setRequired(true);
doc.createExtension(KHRDracoMeshCompression).setRequired(true).setEncoderOptions({
  method: KHRDracoMeshCompression.EncoderMethod.EDGEBREAKER, encodeSpeed: 5, decodeSpeed: 5,
  quantizationBits: { POSITION: 16, NORMAL: 10, TEXCOORD: 14, COLOR: 10, GENERIC: 12 },
});
const bytes = await io.writeBinary(doc);
await mkdir(dirname(destination), { recursive: true });
await writeFile(destination, bytes);
await writeFile(resolve(out, "driver-seat-l2a.glb"), bytes);
// Round-trip the FINAL delivery, replacing only texture encoding with decoded level-0 PNG.
const renderDoc = await io.readBinary(bytes);
for (const texture of renderDoc.getRoot().listTextures()) {
  const record = textureRecords.find(item => item.name === texture.getName());
  if (!record || sha(texture.getImage()) !== record.sha256) throw new Error("Delivered texture does not match decoded render pixels");
  texture.setImage(await readFile(resolve(out, record.decodedPng))).setMimeType("image/png");
}
renderDoc.getRoot().listExtensionsUsed().find(e => e.extensionName === "KHR_texture_basisu")?.dispose();
await io.write(resolve(out, "driver-seat-render-decoded.glb"), renderDoc);
const version = spawnSync(resolve(ktxBin, "toktx.exe"), ["--version"], { encoding: "utf8", timeout: 10_000 });
if (version.error || version.status !== 0) throw version.error ?? new Error("toktx version probe failed");
const report = { asset: destination, sha256: sha(bytes), fileSizeBytes: bytes.length,
  seconds: (performance.now() - started) / 1000, toktx: (version.stdout + version.stderr).trim(),
  textures: textureRecords, renderInput: "driver-seat-render-decoded.glb",
  renderNote: "Final GLB round-trip; only KTX2 level-0 pixels decoded to PNG for Blender. Not original source textures.",
  renderInputSha256: sha(await readFile(resolve(out, "driver-seat-render-decoded.glb"))),
  scriptSha256: sha(await readFile(fileURLToPath(import.meta.url))) };
await writeFile(resolve(out, "finalize-report.json"), JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify({ sha256: report.sha256, fileSizeBytes: bytes.length, textures: textureRecords.length, seconds: report.seconds }));
