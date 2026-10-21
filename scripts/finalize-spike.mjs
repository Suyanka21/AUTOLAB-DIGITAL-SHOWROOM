// PROVISIONAL V223 LWB spike. Owner waiver P3-WEBP-2026-10-20 only.
// Uses existing locked dependencies; no downloaded textures or external services.
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS, EXTTextureWebP, KHRDracoMeshCompression } from "@gltf-transform/extensions";
import draco3d from "draco3dgltf";
import sharp from "sharp";
import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile, copyFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const out = resolve(root, "blender/out");
const destination = resolve(root, "public/assets/3d/s-class-v223/spike.glb");
const started = performance.now();
const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
  "draco3d.decoder": await draco3d.createDecoderModule(),
  "draco3d.encoder": await draco3d.createEncoderModule(),
});
const doc = await io.read(resolve(out, "spike-raw.glb"));
const seat = doc.getRoot().listMaterials().find(m => m.getName() === "MAT_Upholstery_Primary");
if (!seat) throw new Error("Missing approved seat material");
const orm = doc.createTexture("seat-orm").setImage(await readFile(resolve(out, "seat-orm.png"))).setMimeType("image/png");
seat.setMetallicRoughnessTexture(orm).setOcclusionTexture(orm);
for (const texture of doc.getRoot().listTextures()) {
  const bytes = await sharp(Buffer.from(texture.getImage())).webp({ lossless: true, effort: 6 }).toBuffer();
  texture.setImage(bytes).setMimeType("image/webp");
}
doc.createExtension(EXTTextureWebP).setRequired(true);
doc.createExtension(KHRDracoMeshCompression).setRequired(true).setEncoderOptions({
  method: KHRDracoMeshCompression.EncoderMethod.EDGEBREAKER,
  encodeSpeed: 5, decodeSpeed: 5,
  quantizationBits: { POSITION: 14, NORMAL: 10, TEXCOORD: 12, COLOR: 10, GENERIC: 12 },
});
const bytes = await io.writeBinary(doc);
await writeFile(resolve(out, "spike.glb"), bytes);
await mkdir(dirname(destination), { recursive: true });
await copyFile(resolve(out, "spike.glb"), destination);
const report = {
  status: "PROVISIONAL: S-Class V223 LWB; GATE-01/08/11 open",
  waiver: "P3-WEBP-2026-10-20", fileSizeBytes: bytes.length,
  sha256: createHash("sha256").update(bytes).digest("hex"),
  finalizeSeconds: (performance.now() - started) / 1000,
  sharpVersion: sharp.versions.sharp,
  scriptSha256: createHash("sha256").update(await readFile(fileURLToPath(import.meta.url))).digest("hex"),
};
await writeFile(resolve(out, "finalize-report.json"), JSON.stringify(report, null, 2) + "\n");
console.log(JSON.stringify(report, null, 2));
