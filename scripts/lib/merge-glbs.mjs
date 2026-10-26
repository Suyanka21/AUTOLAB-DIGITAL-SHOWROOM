// Narrow static GLB assembler. Keeps compressed payloads byte-for-byte, including
// the approved driver geometry; deduplicates identical buffer views and textures.
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';

export function unpackGlb(input) {
  const bytes = Buffer.from(input);
  assert(bytes.length >= 28 && bytes.toString('ascii',0,4)==='glTF', 'Invalid GLB');
  assert.equal(bytes.readUInt32LE(4),2);
  assert.equal(bytes.readUInt32LE(8),bytes.length);
  assert.equal(bytes.readUInt32LE(16),0x4e4f534a);
  const length=bytes.readUInt32LE(12), binStart=20+length;
  assert.equal(bytes.readUInt32LE(binStart+4),0x004e4942);
  return {json:JSON.parse(bytes.subarray(20,binStart).toString()),bin:bytes.subarray(binStart+8)};
}
export function packGlb(json, bin) {
  const text=Buffer.from(JSON.stringify(json)), jl=Math.ceil(text.length/4)*4, bl=Math.ceil(bin.length/4)*4;
  const out=Buffer.alloc(28+jl+bl);
  out.write('glTF');out.writeUInt32LE(2,4);out.writeUInt32LE(out.length,8);
  out.writeUInt32LE(jl,12);out.writeUInt32LE(0x4e4f534a,16);
  out.fill(0x20,20,20+jl);text.copy(out,20);
  out.writeUInt32LE(bl,20+jl);out.writeUInt32LE(0x004e4942,24+jl);Buffer.from(bin).copy(out,28+jl);
  return out;
}
const canonical = value => JSON.stringify(value, (_k,v) => v && !Array.isArray(v) && typeof v==='object'
  ? Object.fromEntries(Object.entries(v).sort(([a],[b])=>a.localeCompare(b))) : v);
export function mergeGlbs(inputs) {
  assert(inputs.length>0);
  const dst={asset:{version:'2.0',generator:'AutoLab L2B lossless static assembly'},scene:0,scenes:[{name:'Lexus L2B',nodes:[]}],
    nodes:[],meshes:[],materials:[],textures:[],images:[],samplers:[],accessors:[],bufferViews:[],buffers:[{byteLength:0}],extensionsUsed:[],extensionsRequired:[]};
  const chunks=[],views=new Map();let size=0;
  const dedup=(key,value)=>{const match=dst[key].findIndex(v=>canonical(v)===canonical(value));if(match>=0)return match;return dst[key].push(value)-1;};
  for(const input of inputs){
    const {json:s,bin}=unpackGlb(input);
    for(const key of ['skins','animations','cameras'])assert(!(s[key]?.length),`Unsupported ${key}`);
    assert.equal(s.buffers.length,1);assert(!s.buffers[0].uri,'External buffers unsupported');
    assert.equal(s.scenes.length,1);assert(!s.extensions,'Root extensions unsupported');
    const bv=(s.bufferViews??[]).map(v=>{
      const payload=bin.subarray(v.byteOffset??0,(v.byteOffset??0)+v.byteLength);
      assert.equal(payload.length,v.byteLength);assert.equal(v.buffer,0);assert(!v.extensions);
      const id=createHash('sha256').update(payload).digest('hex')+':'+v.byteStride+':'+v.target;
      if(views.has(id))return views.get(id);
      const offset=size,padding=(4-payload.length%4)%4;chunks.push(payload,Buffer.alloc(padding));size+=payload.length+padding;
      const idx=dst.bufferViews.push({...v,byteOffset:offset,buffer:0})-1;views.set(id,idx);return idx;
    });
    const accessorOffset=dst.accessors.length;
    for(const a of s.accessors??[]){assert(!a.sparse,'Sparse accessors unsupported');dst.accessors.push({...a,...(a.bufferView!==undefined?{bufferView:bv[a.bufferView]}:{})});}
    const images=(s.images??[]).map(v=>{assert(v.bufferView!==undefined&&!v.uri);return dedup('images',{...v,bufferView:bv[v.bufferView]});});
    const samplers=(s.samplers??[]).map(v=>dedup('samplers',v));
    const textures=(s.textures??[]).map(t=>{
      const v=structuredClone(t);if(v.source!==undefined)v.source=images[v.source];if(v.sampler!==undefined)v.sampler=samplers[v.sampler];
      for(const [name,e] of Object.entries(v.extensions??{})){assert.equal(name,'KHR_texture_basisu');e.source=images[e.source];}
      return dedup('textures',v);
    });
    const remapTexture=(obj)=>{for(const [key,v]of Object.entries(obj)){if(v&&typeof v==='object'){if(key.endsWith('Texture')&&v.index!==undefined)v.index=textures[v.index];else remapTexture(v);}}};
    const materials=(s.materials??[]).map(m=>{
      const value=structuredClone(m);remapTexture(value);const existing=dst.materials.findIndex(v=>v.name===value.name);
      if(existing>=0){assert.equal(canonical(dst.materials[existing]),canonical(value),'material conflict: '+value.name);return existing;}
      return dst.materials.push(value)-1;
    });
    const meshOffset=dst.meshes.length,nodeOffset=dst.nodes.length;
    for(const m of s.meshes??[]){const mesh=structuredClone(m);for(const p of mesh.primitives){
      assert(!p.targets,'Morphs unsupported');for(const k of Object.keys(p.attributes))p.attributes[k]+=accessorOffset;
      if(p.indices!==undefined)p.indices+=accessorOffset;if(p.material!==undefined)p.material=materials[p.material];
      for(const [name,e]of Object.entries(p.extensions??{})){assert.equal(name,'KHR_draco_mesh_compression');e.bufferView=bv[e.bufferView];}
    }dst.meshes.push(mesh);}
    for(const n of s.nodes??[]){assert(!dst.nodes.some(v=>v.name===n.name),'duplicate node: '+n.name);assert(!n.extensions);
      dst.nodes.push({...n,...(n.mesh!==undefined?{mesh:n.mesh+meshOffset}:{}),...(n.children?{children:n.children.map(i=>i+nodeOffset)}:{})});}
    dst.scenes[0].nodes.push(...s.scenes[0].nodes.map(i=>i+nodeOffset));
    for(const key of ['extensionsUsed','extensionsRequired'])dst[key]=[...new Set([...dst[key],...(s[key]??[])])];
  }
  dst.buffers[0].byteLength=size;
  return packGlb(dst,Buffer.concat(chunks));
}
