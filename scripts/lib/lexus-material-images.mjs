// Only replace named image bufferViews. Geometry, UVs, materials and bindings stay exact.
import assert from 'node:assert/strict';
import { unpackGlb,packGlb } from './merge-glbs.mjs';
export function replaceImages(input,replacements){
 const {json,bin}=unpackGlb(input),views=new Map();
 for(const [name,bytes]of replacements){
  const image=json.images.find(i=>i.name===name);assert(image,'Unknown image: '+name);
  assert(bytes.length>0,'Empty image: '+name);assert.equal(image.mimeType,'image/ktx2');
  assert(!views.has(image.bufferView),'Shared image buffer cannot be replaced twice');views.set(image.bufferView,Buffer.from(bytes));
 }
 const chunks=[];let size=0;
 for(const [i,view]of json.bufferViews.entries()){
  const data=views.get(i)??bin.subarray(view.byteOffset??0,(view.byteOffset??0)+view.byteLength);
  const pad=(4-data.length%4)%4;view.byteOffset=size;view.byteLength=data.length;
  chunks.push(data,Buffer.alloc(pad));size+=data.length+pad;
 }
 json.buffers[0].byteLength=size;
 return packGlb(json,Buffer.concat(chunks));
}
