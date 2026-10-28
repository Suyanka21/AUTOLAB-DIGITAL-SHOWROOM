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

const root=process.cwd(),out=resolve(root,'blender/out/lexus-l2b-r1'),dest=resolve(root,'public/assets/3d/lexus-rx350');
await mkdir(out,{recursive:true});
const hash=b=>createHash('sha256').update(b).digest('hex');
const baseline='b3dc6a11a2387ceb0b97d01b15e6519f410aeebc5c1662b0a26c8f6b7090ec52';
const driver=await readFile(resolve(dest,'driver-seat-l2a.glb'));assert.equal(hash(driver),baseline,'Driver baseline changed');
const io=new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({
  'draco3d.decoder':await draco3d.createDecoderModule(),'draco3d.encoder':await draco3d.createEncoderModule()});
const donor=await io.readBinary(driver),stage=process.argv[2],start=performance.now();
const passengerSha='54f5c69f86363ae78bada085719e30d4d0641966e7653cabb9e4f9c8fc05172c';
assert.equal(hash(await readFile(resolve(dest,'passenger-seat-l2b.glb'))),passengerSha,'Passenger baseline changed');
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
if(stage==='prepare'){
  const t=donor.getRoot().listMaterials().find(m=>m.getName()==='MAT_Seat_Secondary').getNormalTexture();
  const p=resolve(out,'cockpit-normal.ktx2');await writeFile(p,t.getImage());
  ktx(['validate',p]);ktx(['extract','--transcode','rgba8','--level','0',p,resolve(out,'cockpit-normal.png')]);
  console.log('R1 cockpit normal prepared from unchanged R1 texture payload');process.exit(0);
}
// R1 never rebuilds an approved seat. Its original workflow is preserved at dfa77e2.
assert.notEqual(stage,'passenger','R1 preserves passenger bytes; use prepare for cockpit textures');
const rollback={'wheel-l2b':'8995424464d449ed98c547fa8572ea2f5f089d40c59e778cf78a17cc9fe1a469',
 'dashboard-l2b':'476c3878449322f5ab44158422f9fbe497de60683966fc5d411069d8968316b8',
 'interior-l2b':'aec0e7cc46de950609de3a1595879175b48e30629eb8465dd9583b1a23a0f09f'};
await mkdir(resolve(out,'baseline'),{recursive:true});
for(const [asset,sha] of Object.entries(rollback)){
  const path=resolve(out,'baseline',asset+'.glb');let saved;
  try { saved=await readFile(path); }
  catch(error){
    if(error.code!=='ENOENT')throw error;
    // Restore from the pinned local commit; never from the current replacement GLB.
    saved=execFileSync('git',['show',`dfa77e2:public/assets/3d/lexus-rx350/${asset}.glb`],{timeout:30000,maxBuffer:16*1024*1024});
    assert.equal(hash(saved),sha,'Git rollback payload does not match approved L2B');
    await writeFile(path,saved);
  }
  assert.equal(hash(saved),sha,'Changed L2B rollback');
}
let bytes,name,extra={};
if(['wheel','dashboard'].includes(stage)){
  const doc=await io.read(resolve(out,stage+'-raw.glb'));
  const texture=donor.getRoot().listMaterials().find(m=>m.getName()==='MAT_Seat_Secondary').getNormalTexture();
  for(const t of doc.getRoot().listTextures())t.setName(texture.getName()).setImage(texture.getImage()).setMimeType('image/ktx2');
  doc.createExtension(KHRTextureBasisu).setRequired(true);compression(doc);
  bytes=await io.writeBinary(doc);name=stage+'-l2b';
}else if(stage==='assemble'){
  const passenger=await readFile(resolve(dest,'passenger-seat-l2b.glb'));
  const wheel=await readFile(resolve(dest,'wheel-l2b.glb')),dash=await readFile(resolve(dest,'dashboard-l2b.glb'));
  bytes=mergeGlbs([driver,passenger,wheel,dash]);name='interior-l2b';
  // Both approved seats retain their original compressed payloads.
  const b=unpackGlb(bytes);
  const payload=(g,p)=>{const v=g.json.bufferViews[p.extensions.KHR_draco_mesh_compression.bufferView];return g.bin.subarray(v.byteOffset??0,(v.byteOffset??0)+v.byteLength);};
  const checks=[];
  for(const input of [driver,passenger]){const a=unpackGlb(input);
  for(const node of a.json.nodes){const assembled=b.json.nodes.find(n=>n.name===node.name);
    a.json.meshes[node.mesh].primitives.forEach((p,i)=>{const before=hash(payload(a,p)),after=hash(payload(b,b.json.meshes[assembled.mesh].primitives[i]));assert.equal(after,before);checks.push({node:node.name,primitive:i,sha256:before});});}
  }
  extra.seatCompressedPayloadsUnchanged=checks;
}else throw new Error('Use prepare, wheel, dashboard or assemble');
await writeFile(resolve(dest,name+'.glb'),bytes);
const render=await proxy(bytes,name);
const report={stage,asset:'public/assets/3d/lexus-rx350/'+name+'.glb',sha256:hash(bytes),fileSizeBytes:bytes.length,
  driverInputSha256:baseline,...extra,...render,seconds:(performance.now()-start)/1000,
  scriptSha256:hash(await readFile(new URL(import.meta.url))),
  textureMethod:'Unmodified existing R1 KTX2 payloads; no new texture encoding, downloaded pixels or WebP waiver.'};
await writeFile(resolve(out,name+'-finalize.json'),JSON.stringify(report,null,2)+'\n');
assert.equal(hash(await readFile(resolve(dest,'driver-seat-l2a.glb'))),baseline);
assert.equal(hash(await readFile(resolve(dest,'passenger-seat-l2b.glb'))),passengerSha);
console.log(JSON.stringify(report,null,2));
