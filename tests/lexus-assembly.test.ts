import { expect, it } from "vitest";
import { createLexusPrototypeFixture } from "../scripts/make-fixture.mjs";
import { mergeGlbs } from "../scripts/lib/merge-glbs.mjs";
import { NodeIO } from "@gltf-transform/core";
import { ALL_EXTENSIONS } from "@gltf-transform/extensions";
import draco3d from "draco3dgltf";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";

it("assembles assets without duplicating shared textures or losing geometry", async () => {
  const a = await createLexusPrototypeFixture();
  const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
  const b = await io.readBinary(a);
  for (const n of b.getRoot().listNodes()) n.setName(n.getName() + "_Copy");
  const bytes = mergeGlbs([a, await io.writeBinary(b)]);
  const result = await io.readBinary(bytes);
  expect(result.getRoot().listNodes()).toHaveLength(6);
  expect(result.getRoot().listTextures()).toHaveLength(1);
  expect(result.getRoot().listMaterials()).toHaveLength(3);
  expect(result.getRoot().listMeshes().flatMap(m => m.listPrimitives()).reduce((n,p) => n + p.getIndices()!.getCount()/3, 0)).toBe(12);
});

it("refuses incompatible materials sharing a semantic name", async () => {
  const a = await createLexusPrototypeFixture();
  const io = new NodeIO().registerExtensions(ALL_EXTENSIONS);
  const b = await io.readBinary(a);
  b.getRoot().listMaterials()[0].setRoughnessFactor(.9);
  expect(() => mergeGlbs([a, a])).toThrow(/duplicate node/);
  expect(() => mergeGlbs([a, new Uint8Array()])).toThrow();
  expect(() => mergeGlbs([a, Buffer.from([0])])).toThrow();
  const bytes = await io.writeBinary(b);
  expect(() => mergeGlbs([a, bytes])).toThrow(/material conflict/);
});

it("preserves delivered driver attributes, transforms and materials inside the combined asset", async () => {
  const io = new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({"draco3d.decoder":await draco3d.createDecoderModule()});
  const source=await io.readBinary(readFileSync("public/assets/3d/lexus-rx350/driver-seat-l2a.glb"));
  const combined=await io.readBinary(readFileSync("public/assets/3d/lexus-rx350/interior-l2b.glb"));
  const sha=(b: ArrayBufferView)=>createHash("sha256").update(new Uint8Array(b.buffer,b.byteOffset,b.byteLength)).digest("hex");
  expect(combined.getRoot().listTextures()).toHaveLength(6);
  for(const node of source.getRoot().listNodes()){
    const copy=combined.getRoot().listNodes().find(n=>n.getName()===node.getName())!;
    expect(copy.getMatrix()).toEqual(node.getMatrix());
    node.getMesh()!.listPrimitives().forEach((p,i)=>{
      const q=copy.getMesh()!.listPrimitives()[i];
      for(const semantic of p.listSemantics())expect(sha(q.getAttribute(semantic)!.getArray()!)).toBe(sha(p.getAttribute(semantic)!.getArray()!));
      expect(sha(q.getIndices()!.getArray()!)).toBe(sha(p.getIndices()!.getArray()!));
      const a=p.getMaterial()!,b=q.getMaterial()!;
      expect(b.getName()).toBe(a.getName());expect(b.getBaseColorFactor()).toEqual(a.getBaseColorFactor());
      expect(b.getRoughnessFactor()).toBe(a.getRoughnessFactor());expect(b.getMetallicFactor()).toBe(a.getMetallicFactor());
      for(const [x,y]of [[a.getBaseColorTexture(),b.getBaseColorTexture()],[a.getNormalTexture(),b.getNormalTexture()],[a.getMetallicRoughnessTexture(),b.getMetallicRoughnessTexture()]]){
        if(x)expect(sha(y!.getImage()!)).toBe(sha(x.getImage()!));
      }
    });
  }
}, 15000);
