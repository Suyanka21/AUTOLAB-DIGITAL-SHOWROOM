---
name: webgl-viewer-engineering
description: Build and verify the Three.js / React Three Fiber viewer, covering loading, material swapping by slot, colour management, mobile performance and failure fallbacks. Use for any viewer, camera, loader or runtime 3D performance work. Invoke explicitly with $webgl-viewer-engineering.
---

# WebGL Viewer Engineering

## Overview
The viewer turns a validated GLB into an interactive configurator that must survive mid-range phones, slow networks and WebGL failure. Correct colour, correct material binding and a graceful fallback matter more than visual flourishes.

## When to Use
- Any change to the R3F canvas, loaders, camera, lighting or material logic.
- NOT for asset authoring (use `blender-asset-pipeline`).

## Process
1. **Version matrix (verify with `npm ls`).** React 19: `@react-three/fiber` 9.x and `@react-three/drei` 10.x. React 18: fiber 8.x and drei 9.x. Current fiber/drei do not install on React 18. Pin exact versions and use `source-driven-development` for every API you touch.
2. **Colour management.** Output is sRGB through `renderer.outputColorSpace` (the default). `sRGBEncoding` no longer exists. Colour textures are sRGB; normal and ORM maps are linear. Catalogue hex values are sRGB; apply them with `material.color.set(hex)` and never convert twice.
3. **Loading.** Self-host the Draco decoder (`/public/draco/`) and the KTX2 transcoder (`/public/basis/`); no CDN dependence. Load `interior_low.glb` first, then the full file. Wrap loading in Suspense with an error boundary whose fallback is the existing 2D SVG stage.
4. **Material swapping.** On load, traverse once and build a map from material name to the shared material instance. Mutate that instance (`color`, `roughness`, texture sets). Never clone materials per mesh, never create materials in render, dispose replaced textures, and set `needsUpdate` only when a texture changes.
5. **Composition and thread.** Implement as a pure function (selection to slot assignments) with unit tests, following decisions D1 and D2 in `docs/spike/conflicts.md`.
6. **Performance.** `frameloop="demand"` with invalidation on interaction; cap DPR (lower on mobile); no per-frame allocations; log `renderer.info` (draw calls, triangles, textures, geometries) and compare with the manifest budgets.
7. **Failure handling.** Handle `webglcontextlost` and `webglcontextrestored`, GLB 404 and decode errors. All four UI states exist for the viewer: loading, empty, error, success.
8. **Accessibility.** Keyboard camera presets, `prefers-reduced-motion` disables animated camera easing, text alternative for the viewer.
9. **Test hook.** Expose `window.__autolab` only when `NEXT_PUBLIC_E2E=1`.
10. **Verification.** Playwright (headless Chromium): load the GLB, click a swatch, assert only the bound slot's material changed; test GLB 404, WebGL unavailable, and forced context loss (`WEBGL_lose_context`). Headless cannot measure real frame rate, so real-device checks go to `visual-fidelity-review`.

## Common Rationalizations
| Excuse | Reality |
| :--- | :--- |
| "Latest versions are best" | Latest fiber/drei need React 19. Check peers first. |
| "The default CDN decoder works" | It fails offline and adds a third-party dependency. |
| "Clone the material, it's easier" | It breaks slot-wide swaps and leaks memory. |
| "It runs at 60 FPS on my laptop" | Your customers use mid-range phones. |

## Red Flags
- `sRGBEncoding`, spec-gloss assumptions, or per-frame `new` calls in render code.
- No fallback path, or a fallback never tested.
- Test hooks active in production.

## Verification
- [ ] The swap test passes and fails when the binding is deliberately broken.
- [ ] Fallback tests pass (404, no WebGL, context loss).
- [ ] `renderer.info` values are reported against budgets.
- [ ] Peer-dependency check shows no conflicts.
