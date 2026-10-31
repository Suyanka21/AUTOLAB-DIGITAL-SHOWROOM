// R1 experimental UV asset plus reference-guided maps. Public files are read-only.
import {NodeIO} from '@gltf-transform/core';
import {ALL_EXTENSIONS} from '@gltf-transform/extensions';
import draco from 'draco3dgltf';
import {execFileSync} from 'node:child_process';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {resolve} from 'node:path';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {replaceImages} from './lib/lexus-material-images.mjs';
const out=resolve('blender/out/lexus-l4ar1'),ev=resolve('docs/review/lexus-l4ar1-2026-10-29/evidence'),dest=resolve('experiments/lexus-l4ar1');await mkdir(dest,{recursive:true});
const sha=b=>createHash('sha256').update(b).digest('hex'),started=performance.now();
const source=await readFile(resolve(out,'uv-seat.glb')),activePath='public/assets/3d/lexus-rx350/interior-l2b.glb';
const activeSha=sha(await readFile(activePath));assert.equal(activeSha,'c51e4db56faec8307eb6d6d25d88489cf212a935bafff0c2212c27abbcbc19d2');
assert.equal(sha(source),JSON.parse(await readFile(resolve(ev,'uv-correction.json'),'utf8')).uvAssetSha256);
const ktxBin=process.env.KTX_BIN??'C:/Program Files/KTX-Software/bin';
const run=(exe,args)=>execFileSync(resolve(ktxBin,exe),args,{encoding:'utf8',timeout:180000});
const io=new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({'draco3d.decoder':await draco.createDecoderModule(),'draco3d.encoder':await draco.createEncoderModule()});
const textures=[];
for(const kind of ['diamond','perforated'])for(const role of ['base','normal','orm']){
 const stem=kind+'-'+role,ktx=resolve(out,stem+'.ktx2');
 const args=['--t2','--encode','uastc','--uastc_quality','2','--uastc_rdo_l','1.1','--zcmp','9','--genmipmap','--assign_oetf',role==='base'?'srgb':'linear','--threads','4',ktx,resolve(out,stem+'.png')];
 run('toktx.exe',args);run('ktx.exe',['validate',ktx]);run('ktx.exe',['extract','--transcode','rgba8','--level','0',ktx,resolve(out,stem+'-decoded.png')]);
 const bytes=await readFile(ktx);textures.push({name:stem,bytes:bytes.length,sha256:sha(bytes),args});console.log('KTX_VALID '+stem+' '+bytes.length);
}
// Reuse the already-delivered smooth Classic bolster maps, without ignored-file dependency.
const classic=await io.read('experiments/lexus-l4a/classic.glb'),bolster=new Map();
for(const texture of classic.getRoot().listTextures().filter(t=>t.getName().startsWith('lexus-bolster-'))){
 const role=texture.getName().split('-').at(-1),file=resolve(out,'smooth-'+role+'.ktx2');
 await writeFile(file,texture.getImage());run('ktx.exe',['extract','--transcode','rgba8','--level','0',file,resolve(out,'smooth-'+role+'-decoded.png')]);bolster.set(texture.getName(),texture.getImage());
}
const reports=[];
for(const kind of ['diamond','perforated']){
 const replacements=new Map(bolster);for(const role of ['base','normal','orm'])replacements.set('lexus-insert-'+role,await readFile(resolve(out,kind+'-'+role+'.ktx2')));
 const bytes=replaceImages(source,replacements);assert(bytes.length<=3500000,'Unchanged seat hard transfer limit exceeded');
 const file=resolve(dest,kind+'.glb');await writeFile(file,bytes);
 const proxy=await io.readBinary(bytes);
 for(const t of proxy.getRoot().listTextures()){
  const role=t.getName().split('-').at(-1),prefix=t.getName().includes('insert')?kind:'smooth';
  t.setImage(await readFile(resolve(out,prefix+'-'+role+'-decoded.png'))).setMimeType('image/png');
 }
 proxy.getRoot().listExtensionsUsed().find(e=>e.extensionName==='KHR_texture_basisu')?.dispose();
 const proxyPath=resolve(out,kind+'-render.glb');await io.write(proxyPath,proxy);
 const report={kind,asset:'experiments/lexus-l4ar1/'+kind+'.glb',sha256:sha(bytes),bytes:bytes.length,uvAssetSha256:sha(source),proxySha256:sha(await readFile(proxyPath)),note:'Experimental primary UV/tangents changed; unchanged source positions/topology before recompression. Final decoding preservation report required.'};
 await writeFile(resolve(ev,kind+'-finalize.json'),JSON.stringify(report,null,2)+'\n');reports.push(report);console.log('R1_ASSET '+JSON.stringify(report));
}
assert.equal(sha(await readFile(activePath)),activeSha);
await writeFile(resolve(ev,'finalize.json'),JSON.stringify({seconds:(performance.now()-started)/1000,textures,assets:reports},null,2)+'\n');
