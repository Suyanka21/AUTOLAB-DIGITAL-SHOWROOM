# Typography, materials and motion

## Visual benchmark — observations and application

Reviewed [Carlex Dubai](https://carlexdesign.com/pages/carlex-dubai/) directly in the browser on 4 November 2026. Large material photographs, short captions and substantial space give its surfaces prominence. A hand-held swatch conveys scale; cabin and accessory photographs place material in context. Serif headings establish a quieter editorial hierarchy above compact supporting copy.

**AutoLab application (design inference):** enlarge our own material close-up, pair it with the existing cabin stage, keep three treatment names explicit, and offer the existing stitch-detail view beside the selection. Use concise descriptions of visible surface character. The carousel remains within AutoLab's ivory selection rail; it does not reproduce Carlex's page layout. No Carlex photographs, code, logos, text or brand assets were downloaded or copied. Its exotic materials and services are not additions to AutoLab's catalogue. Our existing rendered detail views are not substitutes for authentic workshop photography or human material acceptance.

## Identity and colour

| Token | Value / use |
|---|---|
| Warm ivory | `#F3F0E9` page and selection surface |
| Paper | `#FAF8F3` dialog and light details |
| Ink | `#252425` text and primary actions |
| Graphite | `#101114` model stage |
| Logo ground | `#231F20`, preserved from PDF rendering |
| Logo cyan | `#72C4E1`, preserved from PDF rendering; details on graphite |
| Accessible cyan ink | `#17596D`, focus/active text on ivory |
| Muted text | `#65615B` on ivory |
| Rules | `#D2CEC5`, decorative separation |

The prototype's chrome follows the authentic PDF cyan. Existing material colour values, including the scene's AutoLab Electric Cyan illumination, remain unchanged. No decorative gold is introduced; the named Champagne Gold thread is an existing captured customer selection.

## Typography and availability

The rendered local proposal uses **Baskerville Old Face** for display and **Bahnschrift** for labels/body. Both font files were found in the installed Windows font directory (`BASKVILL.TTF`, `bahnschrift.ttf`). Baskerville provides a sharper editorial serif; Bahnschrift's DIN-related forms give the controls a precise automotive character. CSS uses installed fonts by name; no font files are copied into the repository or downloaded. Fallbacks are Palatino/Georgia and Segoe UI. Other computers may therefore render differently.

Microsoft's [Baskerville listing](https://learn.microsoft.com/en-us/typography/font-list/baskerville-old-face), [Bahnschrift documentation](https://learn.microsoft.com/en-us/typography/font-list/bahnschrift) and [font redistribution FAQ](https://learn.microsoft.com/en-us/typography/fonts/font-faq) distinguish use of installed fonts to render output from permission to redistribute font files. This proposal makes no webfont redistribution claim.

**Recommended cross-platform production pairing, pending permission to obtain and proof it:** Cormorant Garamond 600 display with DM Sans 400/500 body. The official Google Fonts repositories provide [Cormorant Garamond OFL](https://raw.githubusercontent.com/google/fonts/main/ofl/cormorantgaramond/OFL.txt) and [DM Sans OFL](https://raw.githubusercontent.com/google/fonts/main/ofl/dmsans/OFL.txt), both SIL OFL 1.1. Retain licences and relevant notices when packaging; respect reserved names and other terms. These fonts have NOT been downloaded, installed or used in these screenshots. Final line breaks must be checked with approved packaged fonts before a presentation slice is accepted.

Display: 62–100px welcome/summary desktop, 46–70px mobile; sentence case. Core body 16–17px, secondary copy 14px. Camera and treatment labels are at least 12px; camera controls use two columns on mobile to keep names readable. Carousel and camera buttons meet the proposed 44px minimum height. Tiny editorial indices are supplemental, hidden from control names where decorative. Never use thin serif text for controls. Native form/control semantics and visible focus take priority over visual purity.

## Space and layout

8px spacing base, 20px phone gutters, approximately 48px at 1440px desktop. Desktop configurator: approximately two-thirds stage, one-third selection rail, 38px gap. Material images use a consistent 1.68 ratio, with captions outside the image. Images are our own unchanged viewer captures; no new material textures. Phone: stage then selection in document flow, no sticky overlay obscuring either. Four step buttons stay in the same top position; switching a panel does not reset camera or material.

Surface grammar: square stage and imagery, 2px buttons, circular carousel arrows only. Limited translucent graphite may be used for future camera controls **only if** contrast and renderer performance remain sound; prototype uses an opaque graphite bar, so no backdrop-filter expense is claimed or required.

## Motion contract

| Moment | Visible prototype | Approved-scope implementation constraint |
|---|---|---|
| Welcome | 600ms fade/12px text rise; 1.012→1 image settle; ≤160ms stagger | Immediate CTA, no forced wait, loop, fake progress or duplicate 3D scene |
| Material | 300ms detail/cabin image reveal; selected radio, counter and description change | Three existing treatments only; keep previous valid frame until next is ready; preserve decoder ownership and loading feedback |
| Camera | Active cyan rule and 300ms recorded-view reveal | Reuse existing four presets; no coordinate/orbit-limit changes. Screenshot crossfade is not proof of live camera interpolation |
| Configuration | 240ms panel entrance, 300ms rule extension, heading focus and announced step | Retain selection state, no route/remount of the viewer |
| Specification | 400ms details entrance; fixed reference and complete field grouping | Preserve real reference generation, copy and Spec Sheet semantics |
| Press / focus | 160ms button shade, 1px press; high-contrast focus outline | Never convey selection by colour alone |

Use `cubic-bezier(.22,.7,.24,1)`; animate transform and opacity only, apart from brief button background feedback. No perpetual RAF. `prefers-reduced-motion: reduce` removes animation and transition; content and selection feedback remain immediate. No autoplay carousel. Keyboard arrows/Home/End select, endpoints clamp; arrows have explicit names and disable at boundaries. Horizontal pointer movement over 45px selects only when it dominates vertical movement; `touch-action: pan-y` preserves scroll. Real-phone swipe remains unverified. Native dialog handles Escape/focus trapping, with explicit Close.

## Four repositories — placements and exclusions

The existing [source/licence assessment](../REPOSITORIES.md) remains the authority for pinned revisions and dependencies. No repository code or new dependency is added here.

| Resource | Exact placement decision |
|---|---|
| Shader Gradient | No installed effect. Welcome movement comes from existing image + CSS; unresolved standalone/core licence prevents copying its code. No persistent gradient canvas. |
| Paper Design liquid-logo | No copied shader, effect or code; PolyForm Shield is not MIT. The authentic AutoLab logo receives a simple opacity entrance. |
| React Three Fiber | Retain the existing single stage architecture during future presentation work. This review prototype uses screenshots, not another R3F scene. |
| liquid-glass-js | No installed effect or code. A restrained opaque camera strip provides clear controls; avoid its capture/render loops and per-container rendering overhead. |

## Measurement boundary

The interactive prototype has no canvas, downloaded fonts or remote runtime assets. Browser checks are local Chromium evidence, not real-phone, GPU-memory, Core Web Vitals or production-renderer benchmarks. Prior L4 metrics remain historical and are not re-labelled as R1 measurements. Do not assume final R3F frame cost from this image-based prototype.
