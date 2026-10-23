// Isolated asset compatibility probe, not the L3 application/viewer integration.
import { chromium } from '@playwright/test';
import { createServer } from 'node:http';
import { readFile, mkdir, writeFile } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';

const root = process.cwd();
const out = resolve(root, 'blender/out/lexus-l2a/browser');
await mkdir(out, { recursive: true });
const assetPath = '/assets/3d/lexus-rx350/driver-seat-l2a.glb';
const html = `<!doctype html><html><head><meta charset="utf-8"><title>L2A asset compatibility probe</title>
<script type="importmap">{"imports":{"three":"/three/build/three.module.js","three/webgpu":"/three/build/three.webgpu.js","three/tsl":"/three/build/three.tsl.js","three/addons/":"/three/examples/jsm/"}}</script></head>
<body style="margin:0"><script type="module">
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { KTX2Loader } from 'three/addons/loaders/KTX2Loader.js';
try {
 const renderer = new THREE.WebGLRenderer({antialias:true}); renderer.setSize(1000,900);
 renderer.setClearColor(0x353b40); document.body.appendChild(renderer.domElement);
 const draco = new DRACOLoader().setDecoderPath('/draco/');
 const ktx = new KTX2Loader().setTranscoderPath('/basis/').detectSupport(renderer);
 const loader = new GLTFLoader().setDRACOLoader(draco).setKTX2Loader(ktx);
 const start = performance.now(); const gltf = await loader.loadAsync('${assetPath}');
 const loadMs = performance.now()-start;
 const scene = new THREE.Scene(); scene.add(gltf.scene);
 scene.add(new THREE.HemisphereLight(0xffffff,0x505060,2));
 const light = new THREE.DirectionalLight(0xffffff,3); light.position.set(-2,3,3);scene.add(light);
 const camera = new THREE.PerspectiveCamera(36,1000/900,.01,20);
 camera.position.set(-1.7,1.5,2.1); camera.lookAt(-.38,.85,-.05);
 const materials = new Map(); const meshes=[]; const textures=new Set(); const geometryAudit=[];
 gltf.scene.traverse(o=>{if(o.isMesh){meshes.push(o.name);for(const m of(Array.isArray(o.material)?o.material:[o.material])){
 materials.set(m.name,m);for(const key of ['map','normalMap','roughnessMap','metalnessMap','aoMap'])if(m[key])textures.add(m[key]);}}});
 gltf.scene.traverse(o=>{if(!o.isMesh)return;
 const g=o.geometry,p=g.attributes.position,indices=g.index.array;
 for(const [name,attribute] of Object.entries(g.attributes))if(!attribute.array.every(Number.isFinite))throw new Error('Non-finite '+name);
 let minimumArea=Infinity;const a=new THREE.Vector3(),b=new THREE.Vector3(),c=new THREE.Vector3();
 for(let i=0;i<indices.length;i+=3){a.fromBufferAttribute(p,indices[i]);b.fromBufferAttribute(p,indices[i+1]);c.fromBufferAttribute(p,indices[i+2]);
 b.sub(a);c.sub(a);minimumArea=Math.min(minimumArea,b.cross(c).length()/2);}
 if(minimumArea<=1e-14)throw new Error('Degenerate delivered triangle in '+o.name);
 geometryAudit.push({mesh:o.name,triangles:indices.length/3,minimumTriangleAreaSquareMetres:minimumArea});});
 const box=new THREE.Box3().setFromObject(gltf.scene);const dimensions=box.getSize(new THREE.Vector3()).toArray();
 renderer.render(scene,camera);
 const baselinePixels=renderer.domElement.toDataURL();
 const baseline = Object.fromEntries([...materials].map(([n,m])=>[n,m.color.getHex()]));
 const swaps=[];
 for(const [name,material] of materials){ material.color.setHex(0xd43221);renderer.render(scene,camera);
 swaps.push({name,changed:material.color.getHex()===0xd43221,pixelsChanged:renderer.domElement.toDataURL()!==baselinePixels,
 othersUnchanged:[...materials].every(([n,m])=>n===name||m.color.getHex()===baseline[n])});material.color.setHex(baseline[name]); }
 renderer.render(scene,camera);
 const gl=renderer.getContext(),debug=gl.getExtension('WEBGL_debug_renderer_info');
 window.result={ok:true,loadMs,threeRevision:THREE.REVISION,meshes,materials:[...materials.keys()],swaps,geometryAudit,dimensionsMetres:dimensions,
 compressedTextures:[...textures].map(t=>({name:t.name,compressed:t.isCompressedTexture===true,width:t.image.width,height:t.image.height,mips:t.mipmaps.length,format:t.format})),
 renderer:{calls:renderer.info.render.calls,triangles:renderer.info.render.triangles,textures:renderer.info.memory.textures,geometries:renderer.info.memory.geometries},
 gpu:debug?gl.getParameter(debug.UNMASKED_RENDERER_WEBGL):gl.getParameter(gl.RENDERER),
 note:'Local headless Chromium compatibility smoke only; not real-phone FPS or GPU memory measurement. Main application integration belongs to L3.'};
 window.cleanup=()=>{ktx.dispose();draco.dispose();renderer.dispose();};
} catch(e){window.result={ok:false,error:String(e),stack:e.stack};}
</script></body></html>`;
const mime = {'.js':'text/javascript','.wasm':'application/wasm','.glb':'model/gltf-binary'};
const server = createServer(async (req,res)=>{
 try {
  const url=new URL(req.url,'http://localhost');
  if(url.pathname==='/'){res.writeHead(200,{'Content-Type':'text/html'});res.end(html);return;}
  if(url.pathname==='/favicon.ico'){res.writeHead(204);res.end();return;}
  let base,relative;
  if(url.pathname.startsWith('/three/')){base=resolve(root,'node_modules/three');relative=url.pathname.slice(7);}
  else if(url.pathname===assetPath||/^\/(basis|draco)\/[a-zA-Z0-9_.-]+$/.test(url.pathname)){base=resolve(root,'public');relative=url.pathname.slice(1);}
  else {res.writeHead(404);res.end();return;}
  const file=resolve(base,relative);
  if(!file.startsWith(base+sep)){res.writeHead(403);res.end();return;}
  const bytes=await readFile(file);res.writeHead(200,{'Content-Type':mime[extname(file)]??'application/octet-stream'});res.end(bytes);
 } catch(e){res.writeHead(500);res.end(String(e));}
});
let browser;
try {
 await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(0,'127.0.0.1',resolve);});
 browser=await chromium.launch({headless:true,args:['--enable-unsafe-swiftshader']});
 const page=await browser.newPage({viewport:{width:1000,height:900}});
 const errors=[],warnings=[],failures=[];
 page.on('pageerror',e=>errors.push(String(e)));
 page.on('console',m=>{if(m.type()==='error')errors.push(m.text());if(m.type()==='warning')warnings.push(m.text());});
 page.on('requestfailed',r=>failures.push({url:r.url(),error:r.failure()}));
 await page.goto(`http://127.0.0.1:${server.address().port}`,{timeout:30000});
 await page.waitForFunction(()=>window.result!==undefined,{},{timeout:90000});
 const result=await page.evaluate(()=>window.result);
 Object.assign(result,{errors,warnings,failures,assetSha256:createHash('sha256').update(await readFile(resolve(root,'public'+assetPath))).digest('hex'),browser:await browser.version()});
 await writeFile(resolve(out,'browser-report.json'),JSON.stringify(result,null,2)+'\n');
 assert.equal(result.ok,true,JSON.stringify(result));assert.deepEqual(errors,[]);assert.deepEqual(failures,[]);
 assert.deepEqual([...result.materials].sort(),['MAT_Seat_Primary','MAT_Seat_Secondary','MAT_Seat_Stitching'].sort());
 assert.equal(result.compressedTextures.length,6);assert.ok(result.compressedTextures.every(t=>t.compressed&&t.mips===11));
 assert.ok(result.swaps.every(s=>s.changed&&s.pixelsChanged&&s.othersUnchanged));assert.equal(result.renderer.calls,3);
 await page.screenshot({path:resolve(out,'browser-asset.png')});
 await page.evaluate(()=>window.cleanup());console.log(JSON.stringify(result,null,2));
} finally {if(browser)await browser.close();server.closeAllConnections();await new Promise(resolve=>server.close(resolve));}
