// L4 Stage A only. Does not overwrite any public asset; reuses exact Draco buffers.
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import draco from 'draco3dgltf';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import { readFile,writeFile,mkdir } from 'node:fs/promises';
import { resolve } from 'node:path';
import assert from 'node:assert/strict';
import { replaceImages } from './lib/lexus-material-images.mjs';
import { unpackGlb } from './lib/merge-glbs.mjs';
const root=process.cwd(),out=resolve(root,'blender/out/lexus-l4a'),dest=resolve(root,'experiments/lexus-l4a');
const ev=resolve(root,'docs/review/lexus-l4a-2026-10-29/evidence');await mkdir(dest,{recursive:true});
const hash=b=>createHash('sha256').update(b).digest('hex'),start=performance.now();
const source=await readFile('public/assets/3d/lexus-rx350/driver-seat-l2a.glb');
assert.equal(hash(source),'b3dc6a11a2387ceb0b97d01b15e6519f410aeebc5c1662b0a26c8f6b7090ec52');
const active=await readFile('public/assets/3d/lexus-rx350/interior-l2b.glb');
assert.equal(hash(active),'c51e4db56faec8307eb6d6d25d88489cf212a935bafff0c2212c27abbcbc19d2');
const ktxBin=process.env.KTX_BIN??'C:/Program Files/KTX-Software/bin';
const run=(exe,args)=>execFileSync(resolve(ktxBin,exe),args,{encoding:'utf8',timeout:180000});
const io=new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({'draco3d.decoder':await draco.createDecoderModule(),'draco3d.encoder':await draco.createEncoderModule()});
const textures=[];
for(const kind of ['classic','diamond','perforated'])for(const role of ['base','normal','orm']){
 const stem=kind+'-'+role,png=resolve(out,stem+'.png'),ktx=resolve(out,stem+'.ktx2');
 const args=['--t2','--encode','uastc','--uastc_quality','2','--uastc_rdo_l','1.1','--zcmp','9','--genmipmap','--assign_oetf',role==='base'?'srgb':'linear','--threads','4',ktx,png];
 run('toktx.exe',args);run('ktx.exe',['validate',ktx]);
 run('ktx.exe',['extract','--transcode','rgba8','--level','0',ktx,resolve(out,stem+'-decoded.png')]);
 const bytes=await readFile(ktx);textures.push({name:stem,bytes:bytes.length,sha256:hash(bytes),args});
 console.log('KTX_VALID '+stem+' '+bytes.length);
}
const reports=[];
for(const kind of ['classic','diamond','perforated']){
 const replacements=new Map();
 for(const [slot,treatment]of [['insert',kind],['bolster','classic']])for(const role of ['base','normal','orm'])
  replacements.set('lexus-'+slot+'-'+role,await readFile(resolve(out,treatment+'-'+role+'.ktx2')));
 const bytes=replaceImages(source,replacements),file=resolve(dest,kind+'.glb');
 assert(bytes.length<=3500000,'Seat hard transfer budget exceeded');
 // Direct compressed-payload checks complement the existing decoded gate.
 const before=unpackGlb(source),after=unpackGlb(bytes);
 const payload=(g,i)=>{const v=g.json.bufferViews[i];return g.bin.subarray(v.byteOffset??0,(v.byteOffset??0)+v.byteLength);};
 for(const m of before.json.meshes)for(const p of m.primitives){const i=p.extensions.KHR_draco_mesh_compression.bufferView;assert.deepEqual(payload(before,i),payload(after,i));}
 await writeFile(file,bytes);
 const proxy=await io.readBinary(bytes);
 for(const t of proxy.getRoot().listTextures()){
  const role=t.getName().split('-').at(-1),treatment=t.getName().includes('insert')?kind:'classic';
  t.setImage(await readFile(resolve(out,treatment+'-'+role+'-decoded.png'))).setMimeType('image/png');
 }
 proxy.getRoot().listExtensionsUsed().find(e=>e.extensionName==='KHR_texture_basisu')?.dispose();
 const proxyPath=resolve(out,kind+'-render.glb');await io.write(proxyPath,proxy);
 const report={treatment:kind,asset:'experiments/lexus-l4a/'+kind+'.glb',sha256:hash(bytes),bytes:bytes.length,sourceSha256:hash(source),geometryAndUvCompressedPayloadsUnchanged:true,
  proxySha256:hash(await readFile(proxyPath)),note:'Same delivered geometry; KTX2 pixels decoded for Blender. Diamond ORM alpha needs isolated thread-colour hook.'};
 reports.push(report);await writeFile(resolve(ev,kind+'-finalize.json'),JSON.stringify(report,null,2)+'\n');
 console.log('MATERIAL_ASSET '+JSON.stringify(report));
}
assert.equal(hash(await readFile('public/assets/3d/lexus-rx350/interior-l2b.glb')),hash(active));
await writeFile(resolve(ev,'finalize.json'),JSON.stringify({seconds:(performance.now()-start)/1000,textures,assets:reports},null,2)+'\n');
