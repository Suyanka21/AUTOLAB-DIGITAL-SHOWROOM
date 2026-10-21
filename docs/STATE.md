# State — 2026-10-21

- Done: Phase 4 viewer on `phase-4-viewer` from `2c00e95`; actual Phase 3 two-node GLB loads in R3F with local Draco, embedded WebP, procedural lighting, five cameras and bounded orbit controls.
- Asset unchanged: `public/assets/3d/s-class-v223/spike.glb` SHA-256 `36a107f152039a464d4a4dd7786794f66ea40628b5c97ad2d8083964ad1b458e`; gate exit 0, 2 nodes, 5,426 triangles, 2 draw calls.
- Binding: existing `MAT_Upholstery_Primary` swatch changes only the seat; OLED slot unchanged. D1 undecided, stitching absent.
- Fallbacks: loading/error/retry, GLB 404, WebGL unavailable and context-loss paths retain the SVG. Test hook exists only under `NEXT_PUBLIC_E2E=1`.
- Browser: 8/8 full Playwright tests passed; broken-binding test intentionally failed at the seat assertion, then normal binding passed. Final-code load/capture checks passed 2/2.
- Measurements: headless Chromium/SwiftShader `renderer.info` 2 calls, 5,426 triangles, 6 textures, 14 geometries; GLB 900,088 bytes. Real-phone FPS and GPU bytes NOT MEASURED; owner phone check pending.
- Captures: 5 desktop and 5 mobile viewport PNGs, actual requests/measurements and logs in `docs/review/spike-2026-10-20/viewer/`; report `docs/spike/phase-4-report.md`.
- Validation: 31 unit tests passed outside sandbox; typecheck, lint (0 errors, 43 existing warnings), asset gate and final Next 16.4.2 production build exited 0. Sandbox Vitest ancestor-directory access failure recorded.
- Limits: sharp flute grooves/shading patches, simplified seat junction, broad OLED highlights/blank face and provisional bezel remain. No asset remodelling or human visual score.
- Decisions: S-Class V223 LWB scope; D4/D10 approved; D1 pending; exact AutoLab materials pending. WebP waiver `P3-WEBP-2026-10-20` is feasibility only, no KTX2 production compliance.
- Open: GAP-01 to GAP-04; GATE-01/08/11 and all other human gates; 13 development-dependency audit findings. No production acceptance.
- Next: stop at Phase 4 Change Summary. Phase 5 and full-cabin modelling have not begun. Local commit only; no push, PR or deployment.
