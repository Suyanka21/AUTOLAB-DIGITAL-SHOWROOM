import { it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { replaceImages } from '../scripts/lib/lexus-material-images.mjs';
import { unpackGlb } from '../scripts/lib/merge-glbs.mjs';
import { attachThreadMask } from '../experiments/lexus-l4a/thread-mask.mjs';
import { MeshStandardMaterial, Texture } from 'three';

const original=readFileSync('public/assets/3d/lexus-rx350/driver-seat-l2a.glb');
it('replaces image buffers without changing compressed geometry, UV accessors or slot definitions',()=>{
  const before=unpackGlb(original),image=before.json.images[0];
  const payload=Buffer.from([1,2,3,4,5,6,7,8]);
  const after=unpackGlb(replaceImages(original,new Map([[image.name,payload]])));
  for(const key of ['meshes','nodes','accessors','materials','textures','samplers'])expect(after.json[key]).toEqual(before.json[key]);
  const view=(g:ReturnType<typeof unpackGlb>,i:number)=>{const v=g.json.bufferViews[i];return g.bin.subarray(v.byteOffset??0,(v.byteOffset??0)+v.byteLength);};
  expect(view(after,image.bufferView)).toEqual(payload);
  for(const mesh of before.json.meshes)for(const p of mesh.primitives){
    const i=p.extensions.KHR_draco_mesh_compression.bufferView;
    expect(view(after,i).equals(view(before,i))).toBe(true);
  }
  expect(original.equals(readFileSync('public/assets/3d/lexus-rx350/driver-seat-l2a.glb'))).toBe(true);
});
it('rejects missing image names and empty replacement bytes',()=>{
  expect(()=>replaceImages(original,new Map([['not-a-slot',Buffer.from([1])]]))).toThrow(/Unknown image/);
  expect(()=>replaceImages(original,new Map([['lexus-insert-normal',Buffer.alloc(0)]]))).toThrow(/Empty image/);
});

it('keeps quilt-thread colour live and restores the original shader hook',()=>{
  const primary=new MeshStandardMaterial({roughnessMap:new Texture()}),thread=new MeshStandardMaterial();
  const previous=primary.onBeforeCompile,key=primary.customProgramCacheKey;
  const restore=attachThreadMask(primary,thread);
  const shader={fragmentShader:'#include <map_fragment>',uniforms:{}};
  primary.onBeforeCompile(shader as Parameters<typeof primary.onBeforeCompile>[0],{} as Parameters<typeof primary.onBeforeCompile>[1]);
  expect((shader.uniforms as {l4ThreadColor:{value:unknown}}).l4ThreadColor.value).toBe(thread.color);
  expect(shader.fragmentShader).toContain('vRoughnessMapUv');
  restore();expect(primary.onBeforeCompile).toBe(previous);expect(primary.customProgramCacheKey).toBe(key);
});
it('rejects a quilt hook without an ORM texture',()=>{
  expect(()=>attachThreadMask(new MeshStandardMaterial(),new MeshStandardMaterial())).toThrow(/requires/);
});
