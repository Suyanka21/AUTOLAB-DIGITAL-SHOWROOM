// Experimental UV-only correction. Never writes public assets or vertex positions.
import {NodeIO} from '@gltf-transform/core';
import {ALL_EXTENSIONS} from '@gltf-transform/extensions';
import draco from 'draco3dgltf';
import {readFile,writeFile,mkdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const out='blender/out/lexus-l4ar1',ev='docs/review/lexus-l4ar1-2026-10-29/evidence';
await mkdir(out,{recursive:true});await mkdir(ev,{recursive:true});
const source=await readFile('public/assets/3d/lexus-rx350/driver-seat-l2a.glb');
const sha=b=>createHash('sha256').update(b).digest('hex');
assert.equal(sha(source),'b3dc6a11a2387ceb0b97d01b15e6519f410aeebc5c1662b0a26c8f6b7090ec52');
const io=new NodeIO().registerExtensions(ALL_EXTENSIONS).registerDependencies({'draco3d.decoder':await draco.createDecoderModule(),'draco3d.encoder':await draco.createEncoderModule()});
const doc=await io.readBinary(source),primary=doc.getRoot().listMeshes().flatMap(m=>m.listPrimitives()).find(p=>p.getMaterial().getName()==='MAT_Seat_Primary');
const pos=primary.getAttribute('POSITION'),uv=primary.getAttribute('TEXCOORD_0'),idx=primary.getIndices().getArray();
const originalPositions=pos.getArray().slice(),originalIndices=idx.slice(),originalUv=uv.getArray().slice();
const parents=Array.from({length:pos.getCount()},(_,i)=>i);
function root(i){while(parents[i]!==i){parents[i]=parents[parents[i]];i=parents[i];}return i;}
for(let i=0;i<idx.length;i+=3){parents[root(idx[i+1])]=root(idx[i]);parents[root(idx[i+2])]=root(idx[i]);}
const components=new Map();for(const i of new Set(idx)){const r=root(i);if(!components.has(r))components.set(r,[]);components.get(r).push(i);}
assert.equal(components.size,2,'Expected separate cushion and backrest primary surfaces');
const panels=[...components.values()].sort((a,b)=>a.reduce((s,i)=>s+pos.getElement(i,[])[1],0)/a.length-b.reduce((s,i)=>s+pos.getElement(i,[])[1],0)/b.length);
const report=[];
function interpolate(x,xs,ys){let i=1;while(i<xs.length-1&&xs[i]<x)i++;const t=(x-xs[i-1])/(xs[i]-xs[i-1]);return ys[i-1]+t*(ys[i]-ys[i-1]);}
for(const [panel,vertices]of panels.entries()){
 const rows=new Map();for(const i of vertices){const t=Math.round((1-uv.getElement(i,[])[1])*.16/.60*100000)/100000;if(!rows.has(t))rows.set(t,[]);rows.get(t).push(i);}
 const ts=[...rows.keys()].sort((a,b)=>a-b),centres=ts.map(t=>{
  const ids=rows.get(t).sort((a,b)=>pos.getElement(a,[])[0]-pos.getElement(b,[])[0]);
  const left=ids.filter(i=>pos.getElement(i,[])[0]<=-.38).at(-1),right=ids.find(i=>pos.getElement(i,[])[0]>=-.38);
  assert(left!==undefined&&right!==undefined,'Centreline must be bracketed');
  const a=pos.getElement(left,[]),b=pos.getElement(right,[]),w=b[0]-a[0]<1e-8?0:(-.38-a[0])/(b[0]-a[0]);
  return a.map((v,k)=>v+w*(b[k]-v));
 });
 const arc=[.02];for(let i=1;i<ts.length;i++)arc.push(arc.at(-1)+Math.hypot(...centres[i].map((v,k)=>v-centres[i-1][k])));
 assert(arc.at(-1)<.65,'Panel does not fit metric atlas: '+arc.at(-1));
 const ids=new Set(vertices),triangles=[];
 for(let i=0;i<idx.length;i+=3)if(ids.has(idx[i]))triangles.push([idx[i],idx[i+1],idx[i+2]]);
 for(const i of vertices){const x=pos.getElement(i,[])[0]+.38,t=(1-uv.getElement(i,[])[1])*.16/.60,s=interpolate(t,ts,arc);uv.setElement(i,[(panel+.5)*.5+x/.8,.96-s/.72]);}
 const edges=new Map();for(const tri of triangles)for(let k=0;k<3;k++){const a=tri[k],b=tri[(k+1)%3],key=[a,b].sort((a,b)=>a-b).join(',');edges.set(key,(edges.get(key)??0)+1);}
 const boundary=[...edges].filter(([,n])=>n===1).map(([key])=>key.split(',').map(Number));
 report.push({name:panel===0?'cushion':'backrest',index:panel,vertices,triangles,boundary,parameter:ts,arcMetres:arc,spanMetres:arc.at(-1)-arc[0],centreline:centres});
}
// Recompute the tangent basis for the changed UV derivative; normals/positions unchanged.
const normals=primary.getAttribute('NORMAL'),tangents=primary.getAttribute('TANGENT'),t=new Float64Array(pos.getCount()*3),bt=new Float64Array(t.length);
for(let i=0;i<idx.length;i+=3){
 const [a,b,c]=[idx[i],idx[i+1],idx[i+2]],p=[a,b,c].map(j=>pos.getElement(j,[])),q=[a,b,c].map(j=>uv.getElement(j,[]));
 const d1=q[1].map((v,k)=>v-q[0][k]),d2=q[2].map((v,k)=>v-q[0][k]),det=d1[0]*d2[1]-d1[1]*d2[0];assert(Math.abs(det)>1e-12);
 for(let k=0;k<3;k++){const e1=p[1][k]-p[0][k],e2=p[2][k]-p[0][k];for(const j of[a,b,c]){t[j*3+k]+=(e1*d2[1]-e2*d1[1])/det;bt[j*3+k]+=(e2*d1[0]-e1*d2[0])/det;}}
}
for(let i=0;i<pos.getCount();i++){
 const n=normals.getElement(i,[]),v=Array.from(t.slice(i*3,i*3+3)),dot=v.reduce((s,x,k)=>s+x*n[k],0);let a=v.map((x,k)=>x-n[k]*dot),len=Math.hypot(...a);assert(len>0);a=a.map(x=>x/len);
 const cross=[n[1]*a[2]-n[2]*a[1],n[2]*a[0]-n[0]*a[2],n[0]*a[1]-n[1]*a[0]];
 tangents.setElement(i,[...a,cross.reduce((s,x,k)=>s+x*bt[i*3+k],0)<0?-1:1]);
}
assert.deepEqual(pos.getArray(),originalPositions);assert.deepEqual(idx,originalIndices);
const audit={sourceSha256:sha(source),atlasMetresPerU:.8,atlasMetresPerV:.72,panels:report,positions:Array.from(pos.getArray()),uv:Array.from(uv.getArray()),originalUv:Array.from(originalUv),note:'Experimental primary UV/tangent correction only; zero vertex/normal/index changes before Draco encoding. Arc length sampled on actual panel centreline; lateral curvature retains residual distortion.'};
await writeFile(out+'/atlas.json',JSON.stringify(audit));await io.write(out+'/uv-seat.glb',doc);
const summary={sourceSha256:audit.sourceSha256,uvAssetSha256:sha(await readFile(out+'/uv-seat.glb')),positionsAndIndicesUnchangedBeforeEncoding:true,panels:report.map(({name,spanMetres,vertices,triangles,boundary})=>({name,spanMetres,vertices:vertices.length,triangles:triangles.length,boundaryEdges:boundary.length})),atlasMetresPerU:.8,atlasMetresPerV:.72};
await writeFile(ev+'/uv-correction.json',JSON.stringify(summary,null,2)+'\n');console.log(JSON.stringify(summary,null,2));
