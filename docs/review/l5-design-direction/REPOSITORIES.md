# L5 repository feasibility — 3 November 2026

## Recommendation

Keep AutoLab's installed React Three Fiber. Add **zero new rendering dependencies** for this direction. Use the other repositories to inform restraint, light and surface hierarchy. No third-party implementation was copied into this proposal, no licence was accepted on the owner's behalf, and no example assets were downloaded.

This is a source-based engineering assessment, not a legal opinion or proof of performance. MIT reuse remains subject to notices and any separately licensed dependencies/assets. Obtain appropriate licence review before adopting restricted or ambiguous code.

## Inspected revisions

GitHub's default-branch commit API confirmed these revisions on the review date; the inspected recursive trees were not truncated. These are source commits, not claims about the latest npm release. [Recorded commit/tree evidence](evidence/repository-revisions.json); [locally installed versions](evidence/installed-versions.json).

| Repository | Revision | Disposition |
|---|---|---|
| ruucm/shadergradient | `68bdd740037a11c639f8b91fd775949c71d718d0` | Inspiration only; core licence clarification required before reuse |
| paper-design/liquid-logo | `689bb38a1e0d5a6a8baf2d34847635eefde19994` | Inspiration only; PolyForm Shield restrictions |
| pmndrs/react-three-fiber | `d74622ea8ed717f7212d7e19d65ff3e325508389` | Retain installed runtime; no upgrade |
| dashersw/liquid-glass-js | `78cb6ccb0b9987bb60a88b14ccbd13a9e6e8ab2a` | MIT code potentially reusable with notices; runtime unsuitable here |

### 1. Shader Gradient

**Licence:** README and `@shadergradient/react` metadata declare MIT, but the inspected tree has no root or core-package standalone licence. A nested Next example has an MIT text naming Scott Chacon and others; an email-preview subproject also has its own `license.md`. Those files do not establish the scope or notices for the core renderer. Do not interpret the README declaration as a resolved permission record. **No code reuse proposed** until the maintainer supplies applicable core terms/notices or an appropriately licensed release is verified. [README](https://github.com/ruucm/shadergradient/blob/68bdd740037a11c639f8b91fd775949c71d718d0/README.md), [package metadata](https://github.com/ruucm/shadergradient/blob/68bdd740037a11c639f8b91fd775949c71d718d0/packages/shadergradient/package.json), [nested example licence](https://github.com/ruucm/shadergradient/blob/68bdd740037a11c639f8b91fd775949c71d718d0/apps/examples/example-nextjs/LICENSE).

**Compatibility:** core package version at this revision is 2.4.24. Peer declarations include React 18/19, R3F ≥8 and Three ≥0.150. These ranges admit our installed stack; they do not prove Next 16 compatibility. Source includes React Spring/camera-control machinery, so the small public API is not evidence of a small delivered bundle. No bundle size or added milliseconds were measured.

**Source finding:** `ShaderGradientCanvas` creates another R3F Canvas, can lazy mount, and writes legacy entries into global `THREE.ShaderChunk`. That global mutation makes sharing its Three instance with the recovered Lexus viewer undesirable without an isolated regression exercise. Renderer composition includes lights, controls and optional grain postprocessing. [Canvas source](https://github.com/ruucm/shadergradient/blob/68bdd740037a11c639f8b91fd775949c71d718d0/packages/shadergradient/src/ShaderGradientCanvas.tsx), [renderer source](https://github.com/ruucm/shadergradient/blob/68bdd740037a11c639f8b91fd775949c71d718d0/packages/shadergradient/src/ShaderGradient/ShaderGradient.tsx).

**Example inspected:** the Vite starter mounts a full-viewport gradient Canvas with three colours. This is a useful mood reference, but an additional continuously animated scene is unnecessary in the configurator. [Vite example](https://github.com/ruucm/shadergradient/blob/68bdd740037a11c639f8b91fd775949c71d718d0/apps/examples/example-vite-react/src/App.tsx).

**Placement:** optional, independently authored ambient colour wash in the welcome's upper-right background, behind the stage container—not on the leather, controls or lettering. Start with a still, barely perceptible wash. If animation is subsequently approved, allow one ≤4-second introductory movement, then stop. None is implemented in this pack. No Shader Gradient package in the proposed implementation baseline.

### 2. Paper Design liquid-logo

**Licence:** PolyForm Shield 1.0.0, **not MIT**. It provides conditional use/change/distribution permissions, excludes competing products, and requires passing along terms and relevant notices. Non-commercial use is not the test: competition is. An automotive showroom appears different from a design tool, but that inference is not legal clearance; the licensor/affiliate product scope and intended reuse need review. Keep it as visual inspiration for this proposal. [Actual licence](https://github.com/paper-design/liquid-logo/blob/689bb38a1e0d5a6a8baf2d34847635eefde19994/LICENSE).

**Dependencies/example:** this is a private Next 15.2.8 / React 19 demo application, with Tailwind 4, Radix/Base UI, Sonner, Vercel services and `@paper-design/shaders-react` 0.0.21 among its dependencies. Do not port its app scaffolding into AutoLab's Next 16/Tailwind 3 stack or infer every dependency shares the repository licence. README links the interactive logo playground; its hero includes image parsing, upload and parameter controls. [Manifest](https://github.com/paper-design/liquid-logo/blob/689bb38a1e0d5a6a8baf2d34847635eefde19994/package.json), [README/demo](https://github.com/paper-design/liquid-logo/blob/689bb38a1e0d5a6a8baf2d34847635eefde19994/README.md), [hero source](https://github.com/paper-design/liquid-logo/blob/689bb38a1e0d5a6a8baf2d34847635eefde19994/src/hero/hero.tsx).

**Runtime:** the inspected Canvas uses WebGL2, an animation-frame loop and device pixel ratio sized backing buffers. It cancels frames and deletes image textures on relevant cleanup paths. This is still another animated surface; no incremental GPU cost was measured. [Canvas source](https://github.com/paper-design/liquid-logo/blob/689bb38a1e0d5a6a8baf2d34847635eefde19994/src/hero/canvas.tsx).

**Placement:** no liquid-logo effect in the recommended direction. Retain a crisp static AutoLab wordmark in the upper-left header. If the owner later requests a metallic welcome signature, confine it to that mark, welcome only, and resolve licence and motion issues first. Do not use Paper's logo, upload service or shader code. No animated logo on configurator or summary.

### 3. React Three Fiber

**Licence:** root MIT terms permit reuse/modification/distribution with the copyright and permission notice retained. Check separately licensed example assets before copying them; none were used here. [Licence](https://github.com/pmndrs/react-three-fiber/blob/d74622ea8ed717f7212d7e19d65ff3e325508389/LICENSE).

**Compatibility:** inspected source package reports 9.8.1; AutoLab is pinned to **9.8.2**. The branch number is not a reason to downgrade. Its peer metadata specifies React/React DOM ≥19 and <19.4 and Three ≥0.156. AutoLab's React 19.3.1 / Three 0.186.1 fit those ranges. Internals include scheduler, Zustand, suspend-react and react-use-measure. Retain the installed dependency graph. [Package manifest](https://github.com/pmndrs/react-three-fiber/blob/d74622ea8ed717f7212d7e19d65ff3e325508389/packages/fiber/package.json).

**Docs/source/examples:** demand rendering schedules frames after invalidation and stops when roots have no remaining work; controls must invalidate when they mutate the camera. The texture-change example uses Drei loading and deferred selection. It is illustrative—not a substitute for AutoLab's KTX2 worker/cache ownership. [Performance guide](https://github.com/pmndrs/react-three-fiber/blob/d74622ea8ed717f7212d7e19d65ff3e325508389/docs/advanced/scaling-performance.mdx), [loop source](https://github.com/pmndrs/react-three-fiber/blob/d74622ea8ed717f7212d7e19d65ff3e325508389/packages/fiber/src/core/loop.ts), [texture example](https://github.com/pmndrs/react-three-fiber/blob/d74622ea8ed717f7212d7e19d65ff3e325508389/example/src/demos/ChangeTexture.tsx).

**Placement:** the single existing Lexus stage. Keep demand rendering, decoder lifecycle and after-render instrumentation. The welcome and summary can use an actual local still or reuse the existing stage sequentially; never mount a second live cabin simply for a background or thumbnail. HTML controls remain outside the 3D scene. This is the only one of the four repositories already needed by the product.

### 4. liquid-glass-js

**Licence:** MIT, copyright 2025 Armagan Amcalar; code reuse is possible subject to retaining the notice/terms. This does not clear external screenshots, marks or dependencies automatically. [Licence](https://github.com/dashersw/liquid-glass-js/blob/78cb6ccb0b9987bb60a88b14ccbd13a9e6e8ab2a/LICENSE).

**Dependencies/docs/example:** no package manifest in the inspected tree. The README's “zero dependencies” description expressly excepts html2canvas; the quick-start loads html2canvas 1.4.1 from a CDN. The demo resamples on resize. It is imperative DOM code, not an existing React adapter. [README](https://github.com/dashersw/liquid-glass-js/blob/78cb6ccb0b9987bb60a88b14ccbd13a9e6e8ab2a/README.md), [demo source](https://github.com/dashersw/liquid-glass-js/blob/78cb6ccb0b9987bb60a88b14ccbd13a9e6e8ab2a/demo.js).

**Source risks:** each container creates a canvas/WebGL context with `preserveDrawingBuffer`; page sampling uses `html2canvas(document.body)`. Containers render on scroll, while nested buttons have their own animation loop. No complete destroy/cleanup API was found in the inspected container/button classes. “Button” is a div with click handling, not a native keyboard button. Adopting it would require accessibility, React lifecycle and context-loss work. A DOM snapshot is also not a reliable live refraction feed for our changing WebGL cabin. [Container source](https://github.com/dashersw/liquid-glass-js/blob/78cb6ccb0b9987bb60a88b14ccbd13a9e6e8ab2a/container.js), [button source](https://github.com/dashersw/liquid-glass-js/blob/78cb6ccb0b9987bb60a88b14ccbd13a9e6e8ab2a/button.js).

**Placement:** exclude its JS runtime. Borrow the idea of a lightly translucent surface for **one camera-control dock**, inside the bottom edge of the stage with reserved room, not over a material inspection area. Proposed later CSS: ≤8px backdrop blur behind an adequately opaque dark fill; opaque fallback for unsupported/forced-colour modes. No refractive displacement, page snapshot, new WebGL context or nested glass panels. This pack depicts the opaque fallback only.

## Performance and accessibility decision

| Question | Evidence / consequence |
|---|---|
| New shader overhead? | Not benchmarked. Source shows additional contexts/passes/loops; reject them from the baseline rather than invent an FPS cost. |
| Existing app measurements? | L4 evidence reports 76,548 triangles / 12 draw calls; cold 9 textures / 24 geometries, all three treatments cached 21 / 48. Counts are not GPU bytes. See linked L4 report. |
| New L5 measurements? | Actual UI and static concepts rendered in Chromium 156 / SwiftShader. No phone, Safari, Firefox, battery or GPU-time measurement. |
| Proposed acceptance limits? | No extra WebGL contexts, GLB requests or geometry from the shell; preserve current DPR 1–1.5 and demand loop. Compare identical camera/treatment on identical hardware before/after. These are implementation gates, not results. |
| Animation? | UI opacity/transform only; no always-running decorative loop alongside the viewer. Reduced motion means immediate changes and a still welcome. No blur/filter animation. |
| Controls? | Native buttons/selects/radio groups; named swatches + selection marks; ≥44px targets; text contrast ≥4.5:1, UI/focus ≥3:1. No hover-only interaction. |
| Fallback? | Preserve Retry, 2D fallback, retained selections and unavailable-WhatsApp explanation. No animated effect is allowed to gate entry or booking. |

The [L4 runtime report](../lexus-l4b-recovery-2026-10-31/README.md) remains the technical baseline. The proposal does not certify geometry, catalogue authenticity or human visual acceptance.

## Retrieval limitations

GitHub root/README/licence/package/source pages and API tree inventories were read directly. Web fetches of some pinned raw files returned cache misses; read-only PowerShell HTTP requests retrieved the actual files. An initial guessed R3F `Basic.tsx` and a guessed top-level ShaderGradient source path returned 404; actual tree paths were then used (`ChangeTexture.tsx`, `ShaderGradient/ShaderGradient.tsx`). No unavailable file was counted as inspected. Hosted demo code/examples were inspected; the external demos were **not** installed, executed or performance-profiled. Conclusions about their runtime costs are source-based risks, not measured regressions.
