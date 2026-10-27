// Extends the established NodeIO/Draco/KTX workflow; never writes the driver input.
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS, KHRDracoMeshCompression, KHRTextureBasisu } from '@gltf-transform/extensions';
import draco3d from 'draco3dgltf';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';
import { mergeGlbs, unpackGlb } from './lib/merge-glbs.mjs';

const root=process.cwd(),out=resolve(root,'blender/out/lexus-l2b'),dest=resolve(root,'public/assets/3d/lexus-rx350');
await mkdir(out,{recursive:true});
const hash=b=>createHash('sha256').update(b).digest('hex');
const baseline='b3dc6a11a2387ceb0b97d01b15e6519f410aeebc5c1662b0a26c8f6b7090ec52';
const driver=await readFile(resolve(dest,'driver-seat-l2a.glb'));assert.equal(hash(driver),baseline,'Driver baseline changed');
const io=new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
  'draco3d.decoder':await draco3d.createDecoderModule(),'draco3d.encoder':await draco3d.createEncoderModule()});
const donor=await io.readBinary(driver),stage=process.argv[2],start=performance.now();
const ktxBin=process.env.KTX_BIN??'C:/Program Files/KTX-Software/bin';
const ktx=(args)=>execFileSync(resolve(ktxBin,'ktx.exe'),args,{timeout:180000,encoding:'utf8'});
function compression(doc){doc.createExtension(KHRDracoMeshCompression).setRequired(true).setEncoderOptions({
  method:KHRDracoMeshCompression.EncoderMethod.EDGEBREAKER,encodeSpeed:5,decodeSpeed:5,
  quantizationBits:{POSITION:16,NORMAL:10,TEXCOORD:14,COLOR:10,GENERIC:12}});}
async function proxy(bytes,name){
  const doc=await io.readBinary(bytes),records=[];
  for(const t of doc.getRoot().listTextures()){
    const image=t.getImage(),sha=hash(image),path=resolve(out,sha+'.ktx2'),png=resolve(out,sha+'.png');
    assert.equal(t.getMimeType(),'image/ktx2');await writeFile(path,image);ktx(['validate',path]);
    ktx(['extract','--transcode','rgba8','--level','0',path,png]);
    records.push({name:t.getName(),sha256:sha,bytes:image.length,size:t.getSize(),ktxValidateExitCode:0});
    t.setImage(await readFile(png)).setMimeType('image/png');
  }
  for(const e of [...doc.getRoot().listExtensionsUsed()])if(['KHR_texture_basisu','KHR_draco_mesh_compression'].includes(e.extensionName))e.dispose();
  const path=resolve(out,name+'-render.glb');await io.write(path,doc);
  return {proxySha256:hash(await readFile(path)),textures:records};
}
let bytes,name,extra={};
if(stage==='passenger'){
  const doc=await io.readBinary(driver);
  for(const node of doc.getRoot().listNodes()){
    assert.deepEqual(node.getTranslation(),[0,0,0]);assert.deepEqual(node.getScale(),[1,1,1]);
    assert.deepEqual(node.getRotation(),[0,0,0,1]);
    node.setName(node.getName()==='GEO_Seat_Front_Driver'?'GEO_Seat_Front_Passenger':'GEO_Seat_Stitching_Front_Passenger');
    node.getMesh().setName(node.getName());
    for(const p of node.getMesh().listPrimitives()){
      for(const semantic of ['POSITION','NORMAL','TANGENT']){
        const a=p.getAttribute(semantic);if(!a)continue;const v=[];
        for(let i=0;i<a.getCount();i++){a.getElement(i,v);v[0]=-v[0];if(semantic==='TANGENT')v[3]=-v[3];a.setElement(i,v);}
      }
      const idx=p.getIndices(),data=idx.getArray();for(let i=0;i<data.length;i+=3){const b=data[i+1];data[i+1]=data[i+2];data[i+2]=b;}
    }
  }
  compression(doc);bytes=await io.writeBinary(doc);name='passenger-seat-l2b';
  extra.derivation='Delivered R1 reflected across X=0; winding and tangent handedness reversed. Outward power controls supported by photo 29.';
  // Prepare the one existing non-perforated normal map used by cockpit materials.
  const texture=donor.getRoot().listMaterials().find(m=>m.getName()==='MAT_Seat_Secondary').getNormalTexture();
  const texPath=resolve(out,'cockpit-normal.ktx2');await writeFile(texPath,texture.getImage());
  ktx(['validate',texPath]);ktx(['extract','--transcode','rgba8','--level','0',texPath,resolve(out,'cockpit-normal.png')]);
}else if(['wheel','dashboard'].includes(stage)){
  const doc=await io.read(resolve(out,stage+'-raw.glb'));
  const texture=donor.getRoot().listMaterials().find(m=>m.getName()==='MAT_Seat_Secondary').getNormalTexture();
  for(const t of doc.getRoot().listTextures())t.setName(texture.getName()).setImage(texture.getImage()).setMimeType('image/ktx2');
  doc.createExtension(KHRTextureBasisu).setRequired(true);compression(doc);
  bytes=await io.writeBinary(doc);name=stage+'-l2b';
}else if(stage==='assemble'){
  const passenger=await readFile(resolve(dest,'passenger-seat-l2b.glb'));
  const wheel=await readFile(resolve(dest,'wheel-l2b.glb')),dash=await readFile(resolve(dest,'dashboard-l2b.glb'));
  bytes=mergeGlbs([driver,passenger,wheel,dash]);name='interior-l2b';
  // Prove original driver's compressed geometry remains byte-identical in assembly.
  const a=unpackGlb(driver),b=unpackGlb(bytes);
  const payload=(g,p)=>{const v=g.json.bufferViews[p.extensions.KHR_draco_mesh_compression.bufferView];return g.bin.subarray(v.byteOffset??0,(v.byteOffset??0)+v.byteLength);};
  const checks=[];
  for(const node of a.json.nodes){const assembled=b.json.nodes.find(n=>n.name===node.name);
    a.json.meshes[node.mesh].primitives.forEach((p,i)=>{const before=hash(payload(a,p)),after=hash(payload(b,b.json.meshes[assembled.mesh].primitives[i]));assert.equal(after,before);checks.push({node:node.name,primitive:i,sha256:before});});}
  extra.driverCompressedPayloadsUnchanged=checks;
}else throw new Error('Use passenger, wheel, dashboard or assemble');
await writeFile(resolve(dest,name+'.glb'),bytes);
const render=await proxy(bytes,name);
const report={stage,asset:'public/assets/3d/lexus-rx350/'+name+'.glb',sha256:hash(bytes),fileSizeBytes:bytes.length,
  driverInputSha256:baseline,...extra,...render,seconds:(performance.now()-start)/1000,
  scriptSha256:hash(await readFile(new URL(import.meta.url))),
  textureMethod:'Unmodified existing R1 KTX2 payloads; no new texture encoding, downloaded pixels or WebP waiver.'};
await writeFile(resolve(out,name+'-finalize.json'),JSON.stringify(report,null,2)+'\n');
assert.equal(hash(await readFile(resolve(dest,'driver-seat-l2a.glb'))),baseline);
console.log(JSON.stringify(report,null,2));
