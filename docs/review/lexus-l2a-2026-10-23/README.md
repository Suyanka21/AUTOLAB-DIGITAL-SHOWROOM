# Lexus RX 350 — L2A driver-seat candidate

**Technical gate: PASS. Visual acceptance: PENDING. Stop before L2B.**

One driver seat and its separate stitching mesh were authored from the supplied vehicle photographs. No passenger/cockpit/full-cabin work or application integration is included. This package does not award visual quality approval.

## Review and deliverables

- [Driver Hero](01-driver-hero.png), [Open-Door Profile](02-open-door-profile.png), [Seam Macro](03-seam-macro.png).
- [Browser loader evidence](evidence/browser-asset.png), [browser measurements](evidence/browser-report.json).
- Internal side-by-side comparison: `AUTOLAB_LEXUS_SEAT_REFERENCE_PACK/L2A_REVIEW/contact-sheet.png` (local only; [composition manifest](contact-sheet-manifest.json)). Rebuild with `python tools/make-lexus-l2a-review.py` after regenerating/copying the three renders and render report.
- [Actual standalone GLB](../../../public/assets/3d/lexus-rx350/driver-seat-l2a.glb).
- [Blender authoring script](../../../tools/build-lexus-asset.py), [dimension constants](../../../blender/lexus_constants.py), [KTX finalizer](../../../scripts/finalize-lexus-l2a.mjs), [render script](../../../blender/render_lexus_l2a.py).
- [Actual asset gate report](../../../reports/lexus-l2a-report.json), [provenance](../../3d-assets/provenance.lexus-l2a.json), [approximation notes](geometry-notes.md), [owner review form](review.md).

## Actual technical evidence

Asset SHA-256: `1a00561068f4845e9b7206a813a2e024ce13d879d898a41b05a7fc723220e8b3`.

| Check | Actual result |
| --- | --- |
| Scoped actual-asset gate | Exit 0; `synthetic: false`, no errors, no format waiver |
| Semantic nodes/materials | 2 nodes; exactly primary, secondary and stitching slots |
| Triangles | 34,560: seat 20,400; stitching 14,160; below 35,000 L2A maximum |
| Draw calls | 3 asset primitives; browser measured 3 calls |
| Transfer size | 3,244,632 bytes; over 2,500,000-byte target, under 3,500,000-byte maximum |
| Texture payloads | Six 1024×1024 KTX2 UASTC/Zstd textures, each with 11 mip levels: base, tangent normal and ORM for each leather slot; no stitch texture |
| GPU texture estimate | Gate estimates 8,388,612 bytes; **not measured GPU memory** |
| Browser | Chromium 156.0.8078.4 / Three r186 / SwiftShader; Draco and compressed KTX2 textures load; no JS errors or failed requests |
| Material independence | All three changes alter rendered pixels while the other materials' colour values remain unchanged |
| Browser counters | 34,560 triangles, 3 calls, 3 geometries, 7 renderer texture allocations (not byte measurements) |
| Local loader timing | One measured run: 867.7 ms; local headless smoke only, not phone/network performance |
| Scale/integrity | Y-up metres; decoded bounds approximately 0.564846 W × 1.100000 H × 0.794397 D; finite attributes and positive triangle areas |
| Rebuild | Same node/vertex/triangle counts and dimensions; raw GLB bytes differed between repeated builds; [report](evidence/repeatability.json) |
| Existing tests | 66/66 pass in 5 suites; [output](evidence/tests.txt) |
| Typecheck / lint | Both exit 0; lint retains 41 existing warnings, zero errors; [typecheck](evidence/typecheck.txt), [lint](evidence/lint.txt) |
| Production build | Exit 0; Next 16.4.2 static generation succeeds; [output](evidence/production-build.txt) |

The browser probe uses the same installed Three.js loader family as R3F, with explicit `DRACOLoader` and `KTX2Loader`. It is an isolated asset test. The existing application still uses its previous asset/bindings; connecting this Lexus GLB and KTX2 loader is L3 work. No application dependency was changed.

KTX-Software 4.4.2 was installed after the owner's explicit permission. Official [Khronos release](https://github.com/KhronosGroup/KTX-Software/releases/tag/v4.4.2); installer SHA-256 `1f323b0fec19794f5e6c0425a61d4b1da396872a10be862d105f4f4b2d2957fe`, valid Authenticode signature and version are recorded in the [installation evidence](evidence/ktx-installation.json). Each encoded payload passed `ktx validate`. This Lexus asset uses KTX2; the historical Mercedes WebP feasibility waiver is unchanged and is not reused here.

## Warnings and limits

- The pinned Khronos validator does not validate Draco or BasisU internals and emits KTX2 format/unused accessor/tangent warnings. The unchanged custom gate, actual Draco decoding, `ktx validate`, Blender import and browser transcode checks supply the complementary evidence; warnings remain in the report.
- SwiftShader emits `GPU stall due to ReadPixels` warnings while testing rendered-pixel changes. These are preserved in the browser report, not hidden or treated as phone performance results.
- Cycles has a configured maximum of 32 samples and a 160-second tracing limit. Actual achieved sample count is not measured; total wall-clock times and exact source hashes are in the [render report](render-report.json). Studio renders use decoded delivered KTX pixels; see [encoding bridge explanation](geometry-notes.md#evidence-rendering).
- No physical-phone FPS, GPU memory, physical-hide colour match, exact upholstery trim or OEM dimensions have been verified. The existing 13 development-dependency audit findings remain unresolved; no fresh audit or unrelated upgrade was performed.
- Two ORM payloads are identical but retained as separately named textures for this candidate. No claim of minimum file size or completed deduplication is made.

## Reproduce locally

From repository root, with Blender 5.2.2 LTS, the existing npm dependencies and KTX-Software installed:

```powershell
& 'C:\Program Files\Blender Foundation\Blender 5.2\blender.exe' -b --factory-startup --python-exit-code 1 --python tools/build-lexus-asset.py
node scripts/finalize-lexus-l2a.mjs
node scripts/validate-glb.mjs --scope lexus-l2a --asset public/assets/3d/lexus-rx350/driver-seat-l2a.glb --report reports/lexus-l2a-report.json
node tools/verify-lexus-l2a.mjs
& 'C:\Program Files\Blender Foundation\Blender 5.2\blender.exe' -b --factory-startup --python-exit-code 1 --python blender/render_lexus_l2a.py -- review
```

The authoring `.blend`, intermediates and new renders are generated under `blender/out/lexus-l2a/` (ignored). `KTX_BIN` can override the Windows KTX binary directory. The script and constants are the source of truth; the generated `.blend` is not a hand-edited source. No downloaded dealership photograph is embedded in the asset.

## Visible issues remaining after the third review round

| View | Agent observations for the owner |
| --- | --- |
| Driver Hero | Broad smooth highlights still make the upholstery read more uniformly moulded than the photographed seat. Shoulder transitions and headrest crown have angular spots. Perforation detail is less legible at this distance than in the reference. |
| Open-Door Profile | Base skirt/control surround remain blocky; control shapes and cushion/backrest proportions are approximations. Shoulder outline and rear shell are simpler than the photo. The studio floor horizon is visible behind the seat; it is not a geometry feature. |
| Seam Macro | Stitch rows are continuous after projection, but close parallel rows crowd at junctions and end abruptly near the front corner. Perforations are highly regular and may show sampling patterns. Grain is visible, but exact grain, seam compression and thread scale lack macro evidence. |

Round 1 exposed open corner strips and a cushion/backrest gap. Round 2 closed the shells and fixed zero-area control bevels; its macro exposed partially buried stitches. Round 3 projected stitches onto the tessellated surface and increased provisional pore contrast. The final light rig is consistent across all three final views; it was reduced after round 1. Three review rounds are exhausted. This is a candidate for owner review, not a claim that visual craftsmanship is accepted or that the remaining issues are minor.

## Owner decision

Review the final images and complete [review.md](review.md). Approval of L2A must be explicit before L2B begins. Geometry delivery and a technical PASS do not close any human gate.
