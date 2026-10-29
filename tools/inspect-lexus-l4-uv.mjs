// Read-only audit of delivered Draco UVs; no asset writes.
import { NodeIO } from '@gltf-transform/core';
import { ALL_EXTENSIONS } from '@gltf-transform/extensions';
import draco from 'draco3dgltf';
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
const out='blender/out/lexus-l4a';await mkdir(out,{recursive:true});
const io=new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({'draco3d.decoder':await draco.createDecoderModule()});
const asset='public/assets/3d/lexus-rx350/interior-l2b.glb',bytes=await readFile(asset),doc=await io.readBinary(bytes);
const records=[],wire=[];
const sub=(a,b)=>a.map((v,i)=>v-b[i]),dot=(a,b)=>a.reduce((s,v,i)=>s+v*b[i],0);
const percentiles=a=>{a.sort((a,b)=>a-b);return [0,.05,.5,.95,1].map(q=>a[Math.floor(q*(a.length-1))]);};
for(const node of doc.getRoot().listNodes().filter(n=>/^GEO_Seat_Front_/.test(n.getName()))){
 for(const prim of node.getMesh().listPrimitives()){
  const name=prim.getMaterial().getName(),pos=prim.getAttribute('POSITION'),uv=prim.getAttribute('TEXCOORD_0'),idx=prim.getIndices().getArray();
  const groups={};
  for(let i=0;i<idx.length;i+=3){
   const p=[0,1,2].map(k=>pos.getElement(idx[i+k],[])),t=[0,1,2].map(k=>uv.getElement(idx[i+k],[]));
   const zone=name==='MAT_Seat_Primary'?(p.reduce((s,v)=>s+v[1],0)/3<.6?'cushion-insert':'backrest-insert'):'bolsters-headrest-trim';
   const g=groups[zone]??={triangles:0,degenerateUv:0,u:[],v:[],anisotropy:[],metresPerU:[],metresPerV:[]};g.triangles++;
   for(const v of t){g.u.push(v[0]);g.v.push(v[1]);}
   const e1=sub(p[1],p[0]),e2=sub(p[2],p[0]),a=sub(t[1],t[0]),b=sub(t[2],t[0]),d=a[0]*b[1]-b[0]*a[1];
   if(Math.abs(d)<1e-10){g.degenerateUv++;continue;}
   const u=e1.map((v,k)=>(v*b[1]-e2[k]*a[1])/d),v=e1.map((s,k)=>(e2[k]*a[0]-s*b[0])/d);
   const aa=dot(u,u),bb=dot(u,v),cc=dot(v,v),disc=Math.sqrt((aa-cc)**2+4*bb*bb);
   const hi=(aa+cc+disc)/2,lo=(aa+cc-disc)/2;
   g.metresPerU.push(Math.sqrt(aa));g.metresPerV.push(Math.sqrt(cc));g.anisotropy.push(Math.sqrt(hi/Math.max(lo,1e-20)));
   if(name==='MAT_Seat_Primary')wire.push({node:node.getName(),zone,p,t});
  }
  for(const [zone,g]of Object.entries(groups))records.push({node:node.getName(),material:name,zone,triangles:g.triangles,degenerateUv:g.degenerateUv,
   uvRange:[Math.min(...g.u),Math.max(...g.u),Math.min(...g.v),Math.max(...g.v)],
   percentileOrder:['min','p05','median','p95','max'],metresPerU:percentiles(g.metresPerU),metresPerV:percentiles(g.metresPerV),anisotropy:percentiles(g.anisotropy)});
 }
}
const report={asset,sha256:createHash('sha256').update(bytes).digest('hex'),records,
 note:'Decoded delivered UV derivatives, metres per UV unit. Repeated/overlapping UVs are intentional tile coordinates, not a unique bake atlas. Source maps cushion and backrest longitudinal ranges to 0.60/0.16 UV units; physical lengths differ. Reflected passenger retains driver UV direction. No geometry or UV changed.'};
await writeFile('docs/review/lexus-l4a-2026-10-29/evidence/uv-audit.json',JSON.stringify(report,null,2)+'\n');
await writeFile(out+'/uv-wire.json',JSON.stringify(wire));console.log(JSON.stringify(report,null,2));
