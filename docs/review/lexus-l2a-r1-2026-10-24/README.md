# Lexus driver seat — L2A-R1 owner review

Started 2026-10-24; completed evidence packaging 2026-10-26. **Technical gate PASS. Owner accepted R1 as a provisional mock-up baseline on 2026-10-26 and authorized L2B. Detailed fidelity scores remain pending.**

## Deliverables

- [Driver Hero](01-driver-hero.png), [Open-Door Profile](02-open-door-profile.png), [Seam Macro](03-seam-macro.png), [before/after sheet](before-after.png).
- Internal photo comparison: `AUTOLAB_LEXUS_SEAT_REFERENCE_PACK/L2A_R1_REVIEW/contact-sheet.png`; [composition manifest](contact-sheet-manifest.json). Original photographs remain local-only.
- [Revised GLB](../../../public/assets/3d/lexus-rx350/driver-seat-l2a.glb), [actual gate report](../../../reports/lexus-l2a-report.json), [provenance](../../3d-assets/provenance.lexus-l2a-r1.json).
- [Owner checklist](review.md), [production baseline](../../3d-assets/AUTOLAB_3D_PRODUCTION_BASELINE.md), [code review](evidence/code-review.md).
- [Desktop hero](evidence/desktop-Driver-Hero.png), [desktop macro](evidence/desktop-Stitch-Detail.png), [mobile viewport hero](evidence/mobile-emulation-Driver-Hero.png), [mobile viewport macro](evidence/mobile-emulation-Stitch-Detail.png).

## What changed

The existing authoring script and two-node asset were refined; no passenger seat, steering wheel, dashboard or hidden mechanism was authored.

| Area | Change and evidence boundary |
| --- | --- |
| Backrest | Estimated main height reduced from 0.635 to 0.555 m, upper shoulders broadened, upper corners rounded and the arched panel junction lowered. These are modeling parameters inferred from perspective photos, not measured Lexus dimensions. |
| Headrest | Estimated height reduced from 0.255 to 0.220 m; flattened rounded crown, revised taper and lower attachment/posts. Exact foam profile and post spacing remain provisional. |
| Cushion / controls | Front roll, thinner return shell and smoother bolster fields; circular lumbar control, flatter switches and an extruded rounded control surround. No mechanical internals added. |
| Leather | Stronger analytic grain/perforation normal detail, more distinct insert pores, less clearcoat and specular strength, and separate constant ORM roughness values. Manifest roughness factors and material-slot names remain unchanged. No photograph pixels or downloaded texture assets were embedded. |
| Stitching | Cross seams stop short of double rows; projected endpoints taper into the seam. Cushion rows now return around the front instead of ending visibly there. Pitch 3.8 mm, dash length 2.45 mm and radius 0.38 mm remain visual estimates. The section changed from four sides to three to fund longer routes within the same budget; macro acceptance remains a human decision. |

Supplied photos 08 and 23 guide the visible driver seat. Photo 31 supplies rear/shoulder/headrest context, **not a true stitch macro**. Exact upholstery variant, physical-hide colour, leather microstructure and seam construction remain unverified. The agent does not certify photographic fidelity.

## Actual validation evidence

Final GLB SHA-256: `b3dc6a11a2387ceb0b97d01b15e6519f410aeebc5c1662b0a26c8f6b7090ec52`.

| Check | Result |
| --- | --- |
| Actual `lexus-l2a` gate | PASS / exit 0; `synthetic: false`; [output](evidence/gate-final.txt) |
| Geometry | 2 semantic nodes, 3 material primitives, 32,412 triangles: seat 20,196 + thread 12,216 |
| Transfer | 3,463,000 bytes; below unchanged 3,500,000 maximum, above 2,500,000 target |
| Decoded bounds | Approximately 0.572539 W × 0.994996 H × 0.807612 D metres; modeled bounds, not OEM dimensions |
| Source integrity | Closed seat solids: zero boundary edges / degenerate faces. Control surround signed volume positive. [Build report](evidence/build-report.json) |
| Delivered integrity | Finite decoded attributes and positive triangle areas; UVs/tangents present; [browser audit](evidence/browser-report.json) |
| Compression | Draco plus six embedded 1024×1024 KTX2 UASTC/Zstd textures, each with 11 mip levels; each payload passed `ktx validate`; [finalizer report](evidence/finalize-report.json) |
| Independent materials | Primary, secondary and thread recolours each change rendered pixels without altering other tint values in isolated probe; all three actual UI controls also pass |
| Isolated browser counters | 32,412 triangles, 3 calls, 3 geometries, 7 texture allocations |
| Actual R3F app counters | 32,412 triangles, 3 calls, 15 geometries, 9 texture allocations, including environment resources; [integration report](evidence/integrated-browser.json) |
| Browser / timing | Chromium 156.0.8078.4 / Three r186 / SwiftShader; isolated local loader 1,169.7 ms in one run; no JS errors or failed asset requests |
| Existing tests | 67/67 pass with one worker; [output](evidence/tests-final.txt) |
| Typecheck / lint / build | All exit 0; lint has 41 existing warnings, zero errors; [typecheck](evidence/typecheck-final.txt), [lint](evidence/lint-final.txt), [production build](evidence/production-build.txt) |
| Actual showroom test | 1/1 pass; desktop 1440×1000 and mobile viewport 390×844; FOV 38 / 28 and disabled L2B cameras retained; [output](evidence/integrated-test-final.txt) |

Renderer allocation counts are not GPU byte measurements. No physical-phone FPS, sustained GPU performance, GPU memory or network-device benchmark was measured. The gate's GPU-byte figure is an estimate. Mobile screenshots are desktop browser viewport emulation.

The pinned Khronos validator retains unsupported Draco/BasisU, KTX image-format and unused-data warnings. Actual decoder checks, KTX validation and browser tests complement it. SwiftShader ReadPixels stalls, Three.Clock deprecation and Blender future `use_nodes` deprecations are retained in logs. The isolated probe's old note saying integration belongs to L3 is historical boilerplate; the separate integration report above tests the already integrated application.

## Budget and failed-attempt record

The first R1 payload was 3,996,160 bytes and failed the unchanged gate. Removing redundant fine roughness noise reduced it to 3,503,752 bytes, still above the maximum. UASTC RDO lambda 1.0 → 1.1 brought the first render candidate below the cap; the final candidate is 3,463,000 bytes. Grain/perforation normal maps and visible surface grids were retained. Failure reports are [first](evidence/gate-overbudget.json) and [second](evidence/gate-overbudget-2.json); no budget was raised. The final payload is larger than L2A by 218,368 bytes and remains close to the hard cap.

The initial suite had four timeouts during concurrent CPU work and the expected stale L2A hash assertion. Exact final hash/count expectations were updated and the full suite then passed with one worker. Browser attempt 1 timed out starting Next; attempt 2 decoded the seat but failed because the new test named buttons incorrectly; attempt 3 used the existing labels and passed. Failed logs remain in `evidence/`. No dependencies were reinstalled or upgraded. The prior 13 development-dependency audit findings remain unresolved; no fresh audit claim is made.

Captured text logs retain actual command messages; trailing whitespace was normalized for repository formatting. The production build's generated `next-env.d.ts` path change was restored to the original tracked content.

## Evidence rendering and rollback

`evidence/gate-baseline-before-finalize.txt` is an early invocation that inspected the rollback asset while finalization was running. Its old hash is explicit; it is not used as R1 validation. Subsequent failed and passing gates identify their actual candidate hashes.

[Render report](render-report.json) records hashes, cameras, lighting and measured wall-clock times. Blender renders the finalized Draco geometry with decoded **delivered** KTX pixels through the hash-checked PNG proxy. It does not natively render KTX2. Cycles CPU uses a maximum of 32 samples and a 160-second tracing limit; achieved sample counts are unknown. Setup/denoising can exceed the tracing limit. Comparison composition asserts matching camera positions/targets/lenses, lights, resolution and recorded render settings; the historical images are unretouched.

Rollback baseline: commit `16a5362` and local `blender/out/lexus-l2a-r1/baseline/driver-seat-l2a.glb`, SHA `1a00561068f4845e9b7206a813a2e024ce13d879d898a41b05a7fc723220e8b3`. Its [gate snapshot](evidence/baseline-gate.json) and [original renders](../lexus-l2a-2026-10-23/README.md) are preserved. Historical documentation is a frozen L2A record; its live asset/report paths now resolve to R1. Restore the GLB from that commit if an asset rollback is requested; source scripts at the same commit reproduce the old workflow. No rollback has been applied.

## Antigravity handoff / remaining presentation issues

Agent observations from the final renders, **not human visual scores**:

| View | Remaining approximation / defect for review |
| --- | --- |
| Hero | The broader shoulder silhouette and smaller headrest differ visibly from L2A, but the upper rear edge still has a hard transition. The headrest remains a simplified rounded form rather than a confirmed Lexus foam profile. |
| Profile | Controls have rounder outlines, but the base skirt is still simplified and the rear shoulder edge catches a sharp highlight. Cushion/backrest contact and shell thickness are estimates. The dark studio horizon is a presentation artifact retained for comparability. |
| Macro | Front rows now continue through the corner instead of stopping there; cross rows are separated from the doubles. Their exact routing, junction construction and three-sided thread appearance still need approval. Pores remain regular, and grain is too coarse/stretched on some trim/return surfaces; broad highlights can still read as moulded material. |

Two render-review rounds were used in this refinement. The comparison sheets show the remaining limitations instead of retouching them away.

No integration code update is required to load this candidate: URL, two semantic nodes, three materials, local decoders and camera contracts are unchanged. Replace the asset bytes through the normal local workflow and invalidate an old cached GLB when reviewing; this task performs no deployment.

Observed in actual browser screenshots: the unchanged hero framing clips the lower base, mobile UI overlaps the lower viewport, and the light beige swatch loses surface/stitch contrast under current app lighting. Existing Mercedes text also remains in the surrounding interface. These are recorded for Antigravity's separately authorized viewer/UI work; no camera, lighting, UI copy or business logic was changed here. Swatch interaction PASS does not mean colour or visual appearance is accepted.

## Reproduce

```powershell
& 'C:\Program Files\Blender Foundation\Blender 5.2\blender.exe' -b --factory-startup --python-exit-code 1 --python tools/build-lexus-asset.py
node scripts/finalize-lexus-l2a.mjs
node scripts/validate-glb.mjs --scope lexus-l2a --asset public/assets/3d/lexus-rx350/driver-seat-l2a.glb --report reports/lexus-l2a-report.json
node tools/verify-lexus-l2a.mjs
npx playwright test e2e/lexus-refinement.spec.ts --project=chromium
& 'C:\Program Files\Blender Foundation\Blender 5.2\blender.exe' -b --factory-startup --python-exit-code 1 --python blender/render_lexus_l2a.py -- review
```

Copy the three generated PNGs and render report from `blender/out/lexus-l2a-r1/review/review/` into this review directory, then run `python tools/make-lexus-l2a-review.py`. The script rejects stale asset/render hashes. A rebuild is expected to reproduce source-controlled topology and settings; byte-identical compressed output has not been established for R1.

**Historical checkpoint superseded by the owner's 2026-10-26 L2B authorization. [Review record](review.md) retains unscored fidelity items. No human gate, reference gap or Mercedes WebP waiver is closed or reused. Lexus uses KTX2.**
