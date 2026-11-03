import { createServer } from "node:http";
import { readFile, writeFile } from "node:fs/promises";
import { resolve, sep, extname } from "node:path";
import { createHash } from "node:crypto";
import { chromium } from "@playwright/test";
import assert from "node:assert/strict";

const root = process.cwd();
const ev = resolve(root, "docs/review/lexus-l4b-2026-10-31");

const html = `<!doctype html>
<meta charset="utf-8">
<title>L4B Complete Interior Showroom Test</title>
<script type="importmap">{
  "imports": {
    "three": "/three/build/three.module.js",
    "three/addons/": "/three/examples/jsm/"
  }
}</script>
<body style="margin:0; background:#0F1014;">
<script type="module">
import * as T from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js';
import { KTX2Loader } from 'three/addons/loaders/KTX2Loader.js';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import { attachThreadMask } from '/src/lib/three/thread-mask.ts';

const renderer = new T.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true });
renderer.setSize(1280, 800);
renderer.toneMapping = T.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.0;
document.body.appendChild(renderer.domElement);

const scene = new T.Scene();
const camera = new T.PerspectiveCamera(38, 1280 / 800, 0.05, 10);
const pmrem = new T.PMREMGenerator(renderer);
const room = new RoomEnvironment();
scene.environment = pmrem.fromScene(room).texture;

scene.add(new T.AmbientLight(0xffffff, 0.35));
const dirLight = new T.DirectionalLight(0xffffff, 1.6);
dirLight.position.set(-1.5, 2.2, 1.5);
scene.add(dirLight);

const draco = new DRACOLoader().setDecoderPath('/draco/');
const ktx = new KTX2Loader().setTranscoderPath('/basis/').detectSupport(renderer);
const loader = new GLTFLoader().setDRACOLoader(draco).setKTX2Loader(ktx);

let currentModel = null;
let currentRestore = null;

function setCamera(preset) {
  if (preset === 'cabin_pair') {
    camera.position.set(-0.05, 1.45, 1.35);
    camera.lookAt(-0.02, 0.62, 0.12);
    camera.fov = 42;
  } else if (preset === 'hero_driver') {
    camera.position.set(-1.25, 1.25, 1.45);
    camera.lookAt(-0.35, 0.75, 0.10);
    camera.fov = 36;
  } else if (preset === 'seam_macro') {
    camera.position.set(-0.72, 0.76, 0.52);
    camera.lookAt(-0.38, 0.52, 0.08);
    camera.fov = 28;
  }
  camera.updateProjectionMatrix();
  renderer.render(scene, camera);
}

window.loadTreatment = async (treatment) => {
  if (currentRestore) { currentRestore(); currentRestore = null; }
  if (currentModel) { scene.remove(currentModel); }

  const url = '/assets/3d/lexus-rx350/interior-l4-' + treatment + '.glb';
  const gltf = await loader.loadAsync(url);
  currentModel = gltf.scene;
  scene.add(currentModel);

  const materials = new Map();
  currentModel.traverse((o) => {
    if (o.isMesh) {
      const mats = Array.isArray(o.material) ? o.material : [o.material];
      for (const m of mats) materials.set(m.name, m);
    }
  });

  // Apply Lexus baseline colors
  materials.get('MAT_Seat_Primary')?.color.set('#75452B');
  materials.get('MAT_Seat_Secondary')?.color.set('#151618');
  materials.get('MAT_Seat_Stitching')?.color.set('#D4AF37');
  materials.get('MAT_Steering_Leather')?.color.set('#151618');
  materials.get('MAT_Dashboard_Trim')?.color.set('#2A2B2E');
  materials.get('MAT_Cockpit_Accent')?.color.set('#787D82');
  materials.get('MAT_Cockpit_Black')?.color.set('#121316');

  if (treatment === 'diamond') {
    currentRestore = attachThreadMask(materials.get('MAT_Seat_Primary'), materials.get('MAT_Seat_Stitching'));
  }

  setCamera('hero_driver');
  return {
    treatment,
    nodes: currentModel.children.map(c => c.name),
    materials: [...materials.keys()],
    drawCalls: renderer.info.render.calls,
    triangles: renderer.info.render.triangles,
    textures: renderer.info.memory.textures
  };
};

window.setCameraView = (view) => {
  setCamera(view);
};

window.setThreadColor = (hex) => {
  if (currentModel) {
    currentModel.traverse((o) => {
      if (o.isMesh && o.material?.name === 'MAT_Seat_Stitching') {
        o.material.color.set(hex);
      }
    });
    renderer.render(scene, camera);
  }
};

window.ready = true;
</script>`;

const mime = {
  ".js": "text/javascript",
  ".mjs": "text/javascript",
  ".ts": "text/javascript",
  ".wasm": "application/wasm",
  ".glb": "model/gltf-binary",
  ".ktx2": "image/ktx2",
};

const server = createServer(async (req, res) => {
  try {
    const url = new URL(req.url, "http://localhost");
    if (url.pathname === "/") {
      res.writeHead(200, { "Content-Type": "text/html" });
      res.end(html);
      return;
    }
    let base, rel;
    if (url.pathname.startsWith("/three/")) {
      base = resolve(root, "node_modules/three");
      rel = url.pathname.slice(7);
    } else if (url.pathname === "/src/lib/three/thread-mask.ts") {
      // Return transpiled JS for thread-mask
      const content = await readFile(resolve(root, "src/lib/three/thread-mask.ts"), "utf8");
      // Strip TS types
      const js = content
        .replace(/import type [^;]+;/g, "")
        .replace(/export type [^;]+;/g, "")
        .replace(/: [A-Za-z0-9_<>[\]| ?]+/g, "")
        .replace(/as unknown as Parameters<typeof previous>\[0\]/g, "shader");
      res.writeHead(200, { "Content-Type": "text/javascript" });
      res.end(js);
      return;
    } else if (
      url.pathname.startsWith("/assets/3d/lexus-rx350/") ||
      url.pathname.startsWith("/basis/") ||
      url.pathname.startsWith("/draco/")
    ) {
      base = resolve(root, "public");
      rel = url.pathname.slice(1);
    } else {
      res.writeHead(404);
      res.end();
      return;
    }
    const file = resolve(base, rel);
    if (!file.startsWith(base + sep)) {
      res.writeHead(403);
      res.end();
      return;
    }
    res.writeHead(200, { "Content-Type": mime[extname(file)] ?? "application/octet-stream" });
    res.end(await readFile(file));
  } catch (err) {
    res.writeHead(500);
    res.end(String(err));
  }
});

let browser;
try {
  await new Promise((yes, no) => {
    server.once("error", no);
    server.listen(0, "127.0.0.1", yes);
  });
  const port = server.address().port;
  console.log(`[Test Browser Load] Server listening on http://127.0.0.1:${port}`);

  browser = await chromium.launch({
    headless: true,
    args: ["--enable-unsafe-swiftshader"],
  });
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });

  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(m.text());
  });

  await page.goto(`http://127.0.0.1:${port}`);
  await page.waitForFunction(() => window.ready, {}, { timeout: 30000 });

  // 1. Classic Smooth
  console.log("[Test Browser Load] Loading Classic treatment...");
  const classicInfo = await page.evaluate(() => window.loadTreatment("classic"));
  console.log("[Test Browser Load] Classic loaded successfully:", classicInfo);
  await page.screenshot({ path: resolve(ev, "01-standalone-classic-hero.png") });

  await page.evaluate(() => window.setCameraView("cabin_pair"));
  await page.waitForTimeout(500);
  await page.screenshot({ path: resolve(ev, "02-standalone-classic-cabin-pair.png") });

  // 2. Diamond Quilted
  console.log("[Test Browser Load] Loading Diamond treatment...");
  const diamondInfo = await page.evaluate(() => window.loadTreatment("diamond"));
  console.log("[Test Browser Load] Diamond loaded successfully:", diamondInfo);
  await page.screenshot({ path: resolve(ev, "03-standalone-diamond-hero.png") });

  await page.evaluate(() => window.setCameraView("cabin_pair"));
  await page.waitForTimeout(500);
  await page.screenshot({ path: resolve(ev, "04-standalone-diamond-cabin-pair.png") });

  await page.evaluate(() => window.setCameraView("seam_macro"));
  await page.waitForTimeout(500);
  await page.screenshot({ path: resolve(ev, "05-standalone-diamond-seam-macro.png") });

  // Test live quilt recolouring
  console.log("[Test Browser Load] Testing live quilt-thread recolouring to cyan...");
  await page.evaluate(() => window.setThreadColor("#38B6FF"));
  await page.waitForTimeout(500);
  await page.screenshot({ path: resolve(ev, "06-standalone-diamond-cyan-thread.png") });

  // 3. Perforated Leather
  console.log("[Test Browser Load] Loading Perforated treatment...");
  const perfInfo = await page.evaluate(() => window.loadTreatment("perforated"));
  console.log("[Test Browser Load] Perforated loaded successfully:", perfInfo);
  await page.screenshot({ path: resolve(ev, "07-standalone-perforated-hero.png") });

  await page.evaluate(() => window.setCameraView("cabin_pair"));
  await page.waitForTimeout(500);
  await page.screenshot({ path: resolve(ev, "08-standalone-perforated-cabin-pair.png") });

  await page.evaluate(() => window.setCameraView("seam_macro"));
  await page.waitForTimeout(500);
  await page.screenshot({ path: resolve(ev, "09-standalone-perforated-seam-macro.png") });

  assert.equal(errors.length, 0, "Browser encountered errors: " + errors.join(", "));
  console.log("[Test Browser Load] ALL THREE TREATMENTS LOADED AND RENDERED PERFECTLY WITH 0 ERRORS!");
} finally {
  if (browser) await browser.close();
  server.closeAllConnections();
  await new Promise((r) => server.close(r));
}
