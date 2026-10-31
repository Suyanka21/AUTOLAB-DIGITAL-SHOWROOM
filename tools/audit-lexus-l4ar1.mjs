// Independent final decoded geometry/binding check, after KTX and Draco serialization.
import {NodeIO} from '@gltf-transform/core';
import {ALL_EXTENSIONS} from '@gltf-transform/extensions';
import draco from 'draco3dgltf';
import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const io=new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({'draco3d.decoder':await draco.createDecoderModule()});
const sha=b=>createHash('sha256').update(b).digest('hex');
const source=await io.read('public/assets/3d/lexus-rx350/driver-seat-l2a.glb');
const primitiveMap=doc=>new Map(doc.getRoot().listNodes().flatMap(n=>n.getMesh().listPrimitives().map(p=>[n.getName()+'/'+p.getMaterial().getName(),p])));
const before=primitiveMap(source),reports=[];
for(const kind of ['diamond','perforated']){
 const path='experiments/lexus-l4ar1/'+kind+'.glb',bytes=await readFile(path),doc=await io.readBinary(bytes),after=primitiveMap(doc),items=[];
 assert.deepEqual([...before.keys()],[...after.keys()]);
 for(const [name,a]of before){
  const b=after.get(name),pa=a.getAttribute('POSITION'),pb=b.getAttribute('POSITION'),ia=a.getIndices().getArray(),ib=b.getIndices().getArray();
  assert.equal(ia.length,ib.length);assert.equal(pa.getCount(),pb.getCount());
  const points=Array.from({length:pa.getCount()},(_,i)=>pa.getElement(i,[])),buckets=new Map(),canonical=new Map(),sourceIds=[];
  const bucket=p=>p.map(x=>Math.floor(x/.0001));
  for(const [i,p]of points.entries()){
   const key=p.join(',');if(!canonical.has(key))canonical.set(key,canonical.size);sourceIds[i]=canonical.get(key);
   const cell=bucket(p).join(',');if(!buckets.has(cell))buckets.set(cell,[]);buckets.get(cell).push(i);
  }
  let maxError=0;const targetIds=[];
  for(let i=0;i<pb.getCount();i++){
   const p=pb.getElement(i,[]),cell=bucket(p);let nearest=-1,distance=Infinity;
   for(let x=-1;x<=1;x++)for(let y=-1;y<=1;y++)for(let z=-1;z<=1;z++)for(const j of buckets.get([cell[0]+x,cell[1]+y,cell[2]+z].join(','))??[]){
    const d=Math.hypot(...p.map((v,k)=>v-points[j][k]));if(d<distance){distance=d;nearest=j;}
   }
   assert(nearest>=0&&distance<.0001,'Position drift exceeds 0.1mm: '+name);maxError=Math.max(maxError,distance);targetIds[i]=sourceIds[nearest];
  }
  function triangles(indices,ids){const keys=[];for(let i=0;i<indices.length;i+=3){const v=[ids[indices[i]],ids[indices[i+1]],ids[indices[i+2]]],start=v.indexOf(Math.min(...v));keys.push([v[start],v[(start+1)%3],v[(start+2)%3]].join(','));}return keys.sort();}
  assert.deepEqual(triangles(ia,sourceIds),triangles(ib,targetIds),'Topology/winding changed: '+name);
  const am=a.getMaterial(),bm=b.getMaterial();assert.deepEqual(am.getBaseColorFactor(),bm.getBaseColorFactor());assert.equal(am.getRoughnessFactor(),bm.getRoughnessFactor());assert.equal(am.getMetallicFactor(),bm.getMetallicFactor());
  items.push({primitive:name,vertices:pb.getCount(),triangles:ib.length/3,maxPositionDeltaMetres:maxError,topologyAndWindingMatch:true,materialFactorsMatch:true});
 }
 const sn=source.getRoot().listNodes(),dn=doc.getRoot().listNodes();assert.deepEqual(sn.map(n=>n.getMatrix()),dn.map(n=>n.getMatrix()));
 reports.push({kind,sha256:sha(bytes),primitives:items,nodeTransformsMatch:true});
}
const report={samples:reports,toleranceMetres:.0001,note:'Final decompressed surface positions/topology/winding/transforms/material factors checked. Primary UV/tangents intentionally changed; Draco serialization may alter numerical precision.'};
await writeFile('docs/review/lexus-l4ar1-2026-10-29/evidence/preservation.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
