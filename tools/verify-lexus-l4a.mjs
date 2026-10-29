// Isolated Stage A canvas. No application route, catalogue or UI integration.
import { createServer } from 'node:http';
import { readFile,writeFile } from 'node:fs/promises';
import { resolve,sep,extname } from 'node:path';
import { createHash } from 'node:crypto';
import { chromium } from '@playwright/test';
import assert from 'node:assert/strict';
const root=process.cwd(),ev=resolve(root,'docs/review/lexus-l4a-2026-10-29/evidence');
const html=`<!doctype html><meta charset="utf-8"><title>L4A isolated material probe</title>
<script type="importmap">{"imports":{"three":"/three/build/three.module.js","three/addons/":"/three/examples/jsm/"}}</script>
<body style="margin:0"><script type="module">
import * as T from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {DRACOLoader} from 'three/addons/loaders/DRACOLoader.js';
import {KTX2Loader} from 'three/addons/loaders/KTX2Loader.js';
import {RoomEnvironment} from 'three/addons/environments/RoomEnvironment.js';
import {attachThreadMask} from '/experiment/thread-mask.mjs';
const renderer=new T.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});renderer.setSize(1000,900);
renderer.toneMapping=T.ACESFilmicToneMapping;renderer.setClearColor(0x252b31);document.body.appendChild(renderer.domElement);
const scene=new T.Scene(),camera=new T.PerspectiveCamera(36,1000/900,.01,20);
const pmrem=new T.PMREMGenerator(renderer),room=new RoomEnvironment(),environment=pmrem.fromScene(room);scene.environment=environment.texture;
scene.add(new T.HemisphereLight(0xffffff,0x505060,.7));const light=new T.DirectionalLight(0xffffff,2);light.position.set(-2,3,3);scene.add(light);
const draco=new DRACOLoader().setDecoderPath('/draco/'),ktx=new KTX2Loader().setTranscoderPath('/basis/').detectSupport(renderer);
const loader=new GLTFLoader().setDRACOLoader(draco).setKTX2Loader(ktx);
let model,mats,restore,passenger;
function render(){renderer.render(scene,camera);return renderer.domElement.toDataURL();}
function view(macro=false){camera.position.fromArray(macro?[-.79,.78,.60]:[-1.5,1.45,2]);camera.lookAt(...(macro?[-.40,.51,.10]:[-.38,.82,-.05]));camera.fov=macro?30:36;camera.updateProjectionMatrix();return render();}
window.capture=view;
window.run=async(kind)=>{
 if(model){scene.remove(model);model.traverse(o=>{if(o.isMesh)o.geometry.dispose();});for(const m of mats.values()){for(const k of ['map','normalMap','roughnessMap'])m[k]?.dispose();m.dispose();}restore?.();}
 const begin=performance.now(),gltf=await loader.loadAsync('/experiment/'+kind+'.glb');const loadMs=performance.now()-begin;model=gltf.scene;scene.add(model);mats=new Map();
 model.traverse(o=>{if(o.isMesh){for(const m of(Array.isArray(o.material)?o.material:[o.material]))mats.set(m.name,m);}});
 mats.get('MAT_Seat_Primary').color.set('#513b2e');mats.get('MAT_Seat_Secondary').color.set('#292b2d');mats.get('MAT_Seat_Stitching').color.set('#d3bf94');
 restore=kind==='diamond'?attachThreadMask(mats.get('MAT_Seat_Primary'),mats.get('MAT_Seat_Stitching')):null;
 const baseline=view(true),snap=Object.fromEntries([...mats].map(([n,m])=>[n,m.color.getHex()])),maps=[...mats.values()].flatMap(m=>[m.map,m.normalMap,m.roughnessMap]).filter(Boolean);
 const mapRefs=[...mats.values()].map(m=>[m,m.map,m.normalMap,m.roughnessMap]);
 const swaps=[];for(const [name,m]of mats){m.color.set('#b12e25');swaps.push({name,pixelsChanged:render()!==baseline,othersUnchanged:[...mats].every(([n,t])=>n===name||t.color.getHex()===snap[n]),mapsRetained:mapRefs.every(([m,a,b,c])=>m.map===a&&m.normalMap===b&&m.roughnessMap===c)});m.color.setHex(snap[name]);}
 let quiltThreadOnly=null;
 if(kind==='diamond'){
  const stitchObjects=[];model.traverse(o=>{if(o.isMesh&&o.material.name==='MAT_Seat_Stitching'){o.visible=false;stitchObjects.push(o);}});
  const before=render();mats.get('MAT_Seat_Stitching').color.set('#bd2424');quiltThreadOnly=render()!==before;
  mats.get('MAT_Seat_Stitching').color.setHex(snap.MAT_Seat_Stitching);stitchObjects.forEach(o=>o.visible=true);
 }
 view(false);const gl=renderer.getContext(),debug=gl.getExtension('WEBGL_debug_renderer_info');
 return {kind,loadMs,swaps,quiltThreadOnly,materials:[...mats.keys()],renderer:{calls:renderer.info.render.calls,triangles:renderer.info.render.triangles,textures:renderer.info.memory.textures,geometries:renderer.info.memory.geometries},textures:maps.map(t=>({name:t.name,compressed:t.isCompressedTexture,width:t.image.width,height:t.image.height,mips:t.mipmaps.length})),gpu:debug?gl.getParameter(debug.UNMASKED_RENDERER_WEBGL):null};
};
window.mirror=async()=>{
 passenger=(await loader.loadAsync('/passenger.glb')).scene;
 passenger.traverse(o=>{if(o.isMesh)o.material=mats.get(o.material.name);});scene.add(passenger);
 camera.position.set(0,1.7,2.2);camera.lookAt(0,.78,-.05);render();
 return {calls:renderer.info.render.calls,triangles:renderer.info.render.triangles};
};
window.cleanup=()=>{restore?.();draco.dispose();ktx.dispose();environment.dispose();room.dispose();pmrem.dispose();renderer.dispose();};
window.ready=true;
</script>`;
const mime={'.js':'text/javascript','.mjs':'text/javascript','.wasm':'application/wasm','.glb':'model/gltf-binary'};
const server=createServer(async(req,res)=>{
 try{const url=new URL(req.url,'http://localhost');if(url.pathname==='/'){res.writeHead(200,{'Content-Type':'text/html'});res.end(html);return;}
 if(url.pathname==='/favicon.ico'){res.writeHead(204);res.end();return;}
 let base,rel;if(url.pathname.startsWith('/three/')){base=resolve(root,'node_modules/three');rel=url.pathname.slice(7);}
 else if(/^\/experiment\/[a-z0-9.-]+$/.test(url.pathname)){base=resolve(root,'experiments/lexus-l4a');rel=url.pathname.slice(12);}
 else if(url.pathname==='/passenger.glb'){base=resolve(root,'public/assets/3d/lexus-rx350');rel='passenger-seat-l2b.glb';}
 else if(/^\/(basis|draco)\/[a-zA-Z0-9_.-]+$/.test(url.pathname)){base=resolve(root,'public');rel=url.pathname.slice(1);}
 else{res.writeHead(404);res.end();return;}
 const file=resolve(base,rel);if(!file.startsWith(base+sep)){res.writeHead(403);res.end();return;}
 res.writeHead(200,{'Content-Type':mime[extname(file)]??'application/octet-stream'});res.end(await readFile(file));
 }catch(e){res.writeHead(500);res.end(String(e));}
});
let browser;const report={verificationPassed:false,assets:[],errors:[],warnings:[],requestFailures:[]};
try{
 await new Promise((yes,no)=>{server.once('error',no);server.listen(0,'127.0.0.1',yes);});
 browser=await chromium.launch({headless:true,args:['--enable-unsafe-swiftshader']});report.browser=await browser.version();
 const page=await browser.newPage({viewport:{width:1000,height:900}});
 page.on('pageerror',e=>report.errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')report.errors.push(m.text());if(m.type()==='warning')report.warnings.push(m.text());});page.on('requestfailed',r=>report.requestFailures.push(r.url()));
 await page.goto('http://127.0.0.1:'+server.address().port,{timeout:30000});await page.waitForFunction(()=>window.ready,{},{timeout:30000});
 for(const kind of ['classic','perforated','diamond']){
  const gate=JSON.parse(await readFile(resolve(ev,kind+'-gate.json'),'utf8')),bytes=await readFile(resolve(root,'experiments/lexus-l4a',kind+'.glb'));
  const sha=createHash('sha256').update(bytes).digest('hex');assert(gate.passed&&gate.sha256===sha);
  const item=await page.evaluate(kind=>window.run(kind),kind);item.sha256=sha;report.assets.push(item);
  assert(item.swaps.every(s=>s.pixelsChanged&&s.othersUnchanged&&s.mapsRetained));assert.equal(item.renderer.calls,3);assert.equal(item.renderer.triangles,32412);
  assert(item.textures.every(t=>t.compressed&&t.mips===11));if(kind==='diamond')assert.equal(item.quiltThreadOnly,true);
  await page.screenshot({path:resolve(ev,kind+'-browser-normal.png')});await page.evaluate(()=>window.capture(true));await page.screenshot({path:resolve(ev,kind+'-browser-macro.png')});
 }
 report.mirror=await page.evaluate(()=>window.mirror());await page.screenshot({path:resolve(ev,'diamond-mirrored-passenger.png')});
 assert.deepEqual(report.errors,[]);assert.deepEqual(report.requestFailures,[]);report.verificationPassed=true;
 await page.evaluate(()=>window.cleanup());
}catch(error){report.error=String(error);throw error;}
finally{await writeFile(resolve(ev,'browser.json'),JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));if(browser)await browser.close();server.closeAllConnections();await new Promise(r=>server.close(r));}
