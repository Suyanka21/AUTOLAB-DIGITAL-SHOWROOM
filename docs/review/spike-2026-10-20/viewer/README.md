# Phase 4 viewer evidence — 2026-10-21

**PROVISIONAL two-node spike. GATE-01, GATE-08 and GATE-11 remain open. No human visual score or production acceptance.** The owner-approved WebP feasibility waiver `P3-WEBP-2026-10-20` still applies; these checks do not establish KTX2 production compliance.

## Asset and browser load

- Real asset: `public/assets/3d/s-class-v223/spike.glb`, SHA-256 `36a107f152039a464d4a4dd7786794f66ea40628b5c97ad2d8083964ad1b458e` (unchanged). `npm run validate:asset` exited 0: 2 nodes, 5,426 triangles, 2 draw calls; full JSON at `reports/glb-report.json`.
- Playwright headless Chromium with SwiftShader requested `spike.glb`, local `draco_wasm_wrapper.js` and `draco_decoder.wasm`; all returned HTTP 200. The gate identifies three 2048px embedded WebP images, and the browser loaded the asset with its two expected mesh/material bindings and visible textures. There was no separate texture network request because the images are embedded. This proves compatibility in this tested browser, not every browser or phone.
- Exact installed versions: React 19.3.1, `@react-three/fiber` 9.8.2, `@react-three/drei` 10.7.9, `three` 0.186.1, `@types/three` 0.186.0. `npm ls ... --depth=0` exited 0 with no peer conflict. Decoder and transcoder files were copied from the installed `three` package into `public/draco` and `public/basis`; Basis is staged for a later KTX2 asset and was not exercised here.
- Browser measurement: [browser-measurement.json](browser-measurement.json). `renderer.info`: 2 draw calls (spike limit 4), 5,426 triangles (seat 4,860/30,000; OLED 566/5,000), 6 textures and 14 geometries (renderer totals include procedural environment resources). GLB transfer size is 900,088 bytes (limit 3 MB). GPU memory bytes, frame rate on a real phone, and real-device responsiveness were **NOT MEASURED**. Headless SwiftShader is not a phone GPU benchmark. The pre-existing `THREE.Clock` deprecation warning was captured; the intentional 404 and context-loss tests also produce expected browser diagnostics.

## Functional evidence

- [e2e-full.txt](e2e-full.txt): 8/8 browser tests passed (3.5 minutes): real GLB/Draco/WebP path, upholstery-only swatch change, GLB 404, WebGL unavailable, forced context loss, immutable asset caching, disabled unconfigured booking, and 10 preset captures. The first concurrent-worker attempt lost its dev server and timed out; the saved passing run used one worker and an external dev server.
- [e2e-intentional-failure.txt](e2e-intentional-failure.txt): with the test-only `break-seat-binding` fault enabled, the swatch test failed as required: expected `#d8cab8`, received `#ffffff`. The fault was removed; the normal test passed in the full run.
- After the final lighting lifetime fix, [e2e-final-load-captures.txt](e2e-final-load-captures.txt) passed both the real-load and all-preset capture tests (2/2). `npm run typecheck` and targeted ESLint passed after that fix. Full lint, unit tests and production build results are in `docs/spike/phase-4-report.md`.
- The `window.__autolab` probe and fault URLs are enabled only when `NEXT_PUBLIC_E2E=1`; normal builds do not expose them.

## Captures and observed defects

| Preset | Desktop 1280×800 | Mobile viewport 390×844 |
| --- | --- | --- |
| Overview | [desktop-overview.png](desktop-overview.png) | [mobile-overview.png](mobile-overview.png) |
| Seat Front | [desktop-seat-front.png](desktop-seat-front.png) | [mobile-seat-front.png](mobile-seat-front.png) |
| Seat Detail | [desktop-seat-detail.png](desktop-seat-detail.png) | [mobile-seat-detail.png](mobile-seat-detail.png) |
| OLED Front | [desktop-oled-front.png](desktop-oled-front.png) | [mobile-oled-front.png](mobile-oled-front.png) |
| OLED Profile | [desktop-oled-profile.png](desktop-oled-profile.png) | [mobile-oled-profile.png](mobile-oled-profile.png) |

The browser views retain the Phase 3 defects: sharp flute grooves and baked shading patches; straight insert edges and a separated base/back junction; broad screen reflections, hard bevel highlights, a largely blank active face and simplified lower controls; provisional housing profile and inclination. The close camera presets crop adjacent parts by design to inspect these details. No geometry or material binding was remodelled. These are agent observations, **not** visual-fidelity acceptance or a human score. Exact AutoLab materials remain pending.

## Implementation references

- [three.js GLTFLoader](https://threejs.org/docs/pages/GLTFLoader.html): Draco and WebP extension support.
- [three.js RoomEnvironment](https://threejs.org/docs/pages/RoomEnvironment.html): procedural environment lighting.
- [React Three Fiber Canvas](https://r3f.docs.pmnd.rs/api/canvas) and [performance guide](https://r3f.docs.pmnd.rs/advanced/scaling-performance): demand rendering and DPR limits.
- [Drei GLTF loader](https://drei.docs.pmnd.rs/loaders/gltf-use-gltf) and [controls](https://drei.docs.pmnd.rs/controls/introduction): local decoder path and bounded OrbitControls.
