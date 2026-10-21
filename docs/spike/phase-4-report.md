# Phase 4 viewer report — 2026-10-21

Branch `phase-4-viewer` from `2c00e95`. The interactive viewer loads the existing two-node GLB, offers five bounded camera presets and upholstery color swapping through the existing slot, and retains the 2D SVG for WebGL, asset, and context failures. It uses procedural `RoomEnvironment`, demand rendering, reduced-motion-aware controls, a loading/error overlay, retry, and renderer statistics. D1 remains undecided, so no stitching or thread material was added.

Evidence: [browser review](../review/spike-2026-10-20/viewer/README.md), [actual renderer/HTTP JSON](../review/spike-2026-10-20/viewer/browser-measurement.json), [asset gate JSON](../../reports/glb-report.json). The GLB hash and mesh/material counts match Phase 3. The 3 MB/4-call/seat 30k/OLED 5k spike budgets pass; the WebP waiver remains feasibility-only. Real GPU memory and real-phone FPS are not measured; the plan's owner phone check remains pending.

Validation commands and outcomes:

| Command | Result |
| --- | --- |
| `npm ls @react-three/fiber @react-three/drei three @types/three --depth=0` | Exit 0, exact pinned versions, no peer conflict |
| `npm run validate:asset` | Exit 0; SHA-256 `36a107f152039a464d4a4dd7786794f66ea40628b5c97ad2d8083964ad1b458e`; 2 nodes, 5,426 triangles, 2 draw calls, WebP waiver warning |
| `npm run test:e2e -- --workers=1` with `PLAYWRIGHT_EXTERNAL_SERVER=1` | Exit 0; 8/8 passed in 3.5m, saved log in viewer folder |
| Deliberate broken binding | Exit 1 as expected; swatch assertion expected `#d8cab8`, received `#ffffff`; normal binding restored and passed |
| Final-code focused browser load and 10 captures | Exit 0; 2/2 passed after lighting lifetime fix |
| `npm test -- --run` outside sandbox | Exit 0; 4 files, 31 tests passed. Sandbox attempt could not read ancestor directory while loading `vitest.config.ts` |
| `npm run typecheck` | Exit 0 after final viewer change |
| `npm run lint` | Exit 0; 0 errors, 43 existing warnings. Copied vendor decoder scripts excluded from ESLint |
| `npm run build` | Exit 0 on final code; Next 16.4.2 compiled in 9.0s, TypeScript in 16.7s, and generated 6/6 static pages |

The first full E2E attempt with two workers stalled when its external dev server stopped; the completed serial run is the acceptance evidence. Playwright-owned `webServer` teardown also hung in an earlier focused run, so the passing serial run used an explicit server. No browser DevTools MCP was available; Playwright supplied browser automation. The pre-existing `THREE.Clock` deprecation warning remains; no unrelated dependency upgrade was made. The 13 prior development-dependency audit findings remain unresolved. Human visual gates GATE-01, GATE-08 and GATE-11 remain open, along with GAP-01 through GAP-04 and exact AutoLab material injection.
