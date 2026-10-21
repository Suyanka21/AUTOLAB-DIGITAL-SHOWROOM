# Phase 3 asset evidence — 2026-10-20/21

**PROVISIONAL: Mercedes-Benz S-Class V223 LWB. GATE-01, GATE-08 and GATE-11 OPEN. Unscored; no visual or production acceptance.**

Branch `phase-3-spike-asset` starts at the latest locally approved commit `9089f25`. Only the four Phase 3 skills were loaded: blender-asset-pipeline, gltf-asset-gate, source-driven-development and debugging-and-error-recovery. Owner D10 and WebP approval dated 2026-10-20 govern the reference and format deviations. D1 is undecided; stitching is absent.

## Deliverable and measurements

`public/assets/3d/s-class-v223/spike.glb` is an actual Blender-authored asset with Draco geometry and embedded lossless WebP textures. It is not the Phase 2 synthetic fixture.

| Check | Actual result | Limit / qualification |
| :--- | :--- | :--- |
| Nodes / materials | 2 / 2 | Exact approved names and bindings |
| Seat triangles | 4,860 | <=30,000 |
| OLED triangles | 566 | <=5,000 |
| Total triangles | 5,426 | <=35,000 |
| Mesh primitives | 2 | Static estimate of base-pass draw calls; <=4 |
| File bytes | 900,088 | <=3,000,000 |
| Decoded active display diagonal | 325.1063 mm | 325.1 +/-1 mm |
| Seat textures | Albedo, tangent normal, ORM; each 2048x2048 WebP | <=2048; format waiver only |
| GPU texture estimate | 67,108,866 bytes | RGBA8 plus full mip chains; arithmetic estimate, NOT measured GPU allocation |
| Runtime GPU, FPS, renderer.info, phone performance | NOT TESTED | Phase 4 viewer is out of scope |

GLB SHA-256: `36a107f152039a464d4a4dd7786794f66ea40628b5c97ad2d8083964ad1b458e`.

The seat comprises only the central base/back contact inserts, with a dense temporary source mesh baked into tangent normals and removed before export. It is not a complete seat. The OLED combines its housing, stepped face, active canvas and simplified lower strip into one mesh and one manifest material. Vertex colors distinguish its surfaces; no invented slots were added. All transforms are applied. The four known undefined out-of-scope manifest slots remain undefined.

## Reproduction commands

Run from the repository root in PowerShell. Nothing is downloaded or installed.

```powershell
& 'C:\Program Files\Blender Foundation\Blender 5.2\blender.exe' -b --factory-startup --python-exit-code 1 --python blender/inspect_environment.py
& 'C:\Program Files\Blender Foundation\Blender 5.2\blender.exe' -b --factory-startup --python-exit-code 1 --python blender/build_spike.py
node scripts/finalize-spike.mjs
npm run validate:asset -- --scope spike
& 'C:\Program Files\Blender Foundation\Blender 5.2\blender.exe' -b --factory-startup --python-exit-code 1 --python blender/render_spike.py
```

The single geometry script writes only to ignored `blender/out/`: `.blend`, raw GLB, generated PNG maps and measurements. The Node postprocessor attaches the shared ORM map, converts all maps to lossless WebP, encodes Draco and copies the final GLB to the public path. It uses already locked glTF Transform 4.5.1, Draco 1.5.9 and Sharp 0.35.5 (present through Next); no dependency versions changed. The `.blend` is reproducible scratch output, not the source of truth. Review renders reimport the **final public GLB** with Blender's Draco decoder.

Blender reported **5.2.2 LTS**, build `d13f752e3b9c`, embedded Python **3.13.13**. Live exporter/image-format introspection is in `../review/spike-2026-10-20/evidence/environment.json`. `toktx` was not found. Smooth by Angle is applied to the beveled OLED; AgX is explicit for rendering. Weighted Normal was not used; remaining bevel shading is disclosed below.

## References and uncertainty

The supplied `PHASE3_REFERENCE_HANDOFF.md`, `phase-3-reference/VERIFICATION_REGISTER.md`, `PHASE3_SAFE_MODELING_BRIEF.md`, `REFERENCE_ACQUISITION_GAPS.md` and raw pack were treated as reference inputs, with the handoff's two-node/material reconciliation taking precedence. Their proposed extra materials, bolsters, neck pillow and stitching were excluded.

- [Mercedes-Benz 2021 S-Class release](https://media.mbusa.com/news/the-new-mercedes-benz-s-class-2021): confirms the 12.8-inch OLED and 1888x1728 resolution. Active width 219.507 mm and height 239.832 mm are **derived**, assuming square pixels, not independently measured factory dimensions.
- [Mercedes-Benz interior release and photographs](https://media.mbusa.com/news/meet-the-s-class-digital-luxury-well-being): visually inspected the floating central screen, bezel and lower strip. [Direct official photograph](https://media.mbusa.com/storage/media/thumbnails/cwAppkWu4lKtQz39OkF9pNi6eIljJxoi28eogyHf_thumb.jpg). Perspective imagery does not establish millimetre dimensions. No third-party images, models, textures, fonts or HDRIs were downloaded into the repository; no AI-generated image was used.
- The supplied pack calls eight flutes verified. The newly inspected official material shows other upholstery variants and does **not independently confirm that claim for all Standard Nappa vehicles**. Eight flutes are retained as the approved pack's provisional layout. Flute depth 6 mm, insert width 320 mm, base length 440 mm, back length 570 mm, crown/recline and all mounting coordinates are estimates. The 320 mm figure describes the central insert, not the disputed 458/530 mm full-seat width. No measured seat-fit claim is made.
- Screen inclination 38 degrees from vertical, 8 mm side borders, 22 mm strip and 8 mm housing depth are provisional. The 1.5 mm edge radius and 0.8 mm step follow the project plan, without manufacturer metrology. The constructed outside height is 277.832 mm (239.832 +16 +22); the pack's 275.8 mm alternative is not enforced. Rear mounting/air-gap geometry is omitted because the console is outside scope.
- [Blender Cycles baking manual](https://docs.blender.org/manual/en/latest/render/cycles/baking.html): selected-to-active tangent-space baking, UV target, cage and margins. [Blender glTF exporter manual](https://docs.blender.org/manual/en/5.3/addons/scene_gltf2.html): format/export guidance. The indexed exporter page is for 5.3; **installed 5.2.2 RNA introspection**, not a version assumption, determined the actual arguments. Legacy `/addons/import_export/scene_gltf2.html` fetches failed; an official brochure browser route hit a security check and was abandoned.

GAP-01 through GAP-04 remain open. Exact AutoLab materials are pending injection. The generated brown leather swatch is a feasibility placeholder, not a catalogue proposal.

## Repeatability and failures

Two fresh `--factory-startup` builds of the corrected script produced identical node/material names, vertex counts, triangle counts and raw GLB SHA-256. Their packaged GLBs are also byte-identical. Evidence: `build-a.json`, `build-b.json`, `finalize-a.json`, `finalize-b.json` under the review evidence folder. Render-camera refinements afterward do not change mesh construction or the packaged asset.

| Build | Seat vertices / triangles | OLED vertices / triangles | Bake seconds | Build seconds | Packaging seconds |
| :--- | :--- | :--- | :--- | :--- | :--- |
| A | 2,434 / 4,860 | 292 / 566 | 5.134 | 13.527 | 5.359 |
| B | 2,434 / 4,860 | 292 / 566 | 10.195 | 21.747 | 9.951 |

The first raw export failed: 6,454,636 bytes exceeded 3 MB; required ORM and seat tangents were missing; KTX2 was absent. `raw-gate-failure.json` preserves the result. Applied triangulation restored tangents; a tiled authored albedo removed unnecessary random-pixel entropy; the postprocessor bound ORM and applied the explicit WebP waiver. Corrected gate attempt 2 passed. No budget was relaxed.

The Phase 2 OLED measurement used projected world-axis bounds, which mismeasures an inclined screen and includes the bezel. The gate now measures the four actual active-face corner vertices, marked `_ACTIVE_DISPLAY`, in decoded world space. This marker is a gate convention, not a manufacturer certification. The real-asset gate rejects its absence; malformed screen scale still fails. WebP is permitted only with the explicit real-spike flag; PNG and missing Draco remain errors. `validate:asset` now checks the real deliverable; `validate:fixture` retains a separately labelled synthetic path.

Five new regression tests cover inclination-independent dimensions, wrong scale, absent markers, explicit WebP/Draco boundaries and rejected PNG. Against a temporary copy of the original gate they produced **4 failures /1 pass**, then **5 passes** against the corrected gate. The initial asynchronous test overlapped editing; the isolated original-gate run supplies the honest red evidence. Temporary baseline files were removed. The six original malformed-asset cases remain in the suite.

## Deviations and review boundary

1. WebP instead of KTX2 is owner-approved by `waivers.md`, ID `P3-WEBP-2026-10-20`. It proves no production KTX2 compliance.
2. Blender CPU area lights and a constant world were used for all five asset renders. The plan's three.js RoomEnvironment is reserved for the unstarted Phase 4 viewer. No downloaded HDRI.
3. The plan requests five views but supplies no camera coordinates. Operational presets are explicit in `blender/constants.py`, with cameras/lighting recorded per render. Detail views hide the other component to avoid occlusion, without modifying the GLB.
4. A blank, non-emissive OLED face replaces interface graphics; the lower strip lacks buttons/roller recesses. The one-slot contract is preserved. The screen uses vertex color and no screen texture, within its maximum texture budget.
5. ORM is neutral AO=1, roughness multiplier=1 (material factor=0.48), metallic=0. It is not baked cavity occlusion. No hidden acquired texture is substituted. Texel density is anisotropic because two long contact surfaces share the 2048 atlas; no physical texel-density target was established in the scoped spec.
6. Existing manifest diamond quilting / legacy screen-angle descriptions are superseded for this spike by the approved eight-flute / provisional-inclination handoff. No authoritative specification file was rewritten.
7. No general prune/dedup dependency was installed. The output has exactly one material per slot and one ORM image shared by two bindings. Informational unused-object/tangent messages are preserved in the gate output.

Known visual defects, per final render: sharp grooves and polygonal shading on the seat (`02-seat-front.png`, `03-seat-detail.png`); simplified straight insert edges and separation at the base/back junction (`01-overview.png`, `02-seat-front.png`); broad display reflections and hard bevel highlights (`01-overview.png`, `04-oled-front.png`, `05-oled-profile.png`); absent control details and unverified housing profile (`04-oled-front.png`, `05-oled-profile.png`). These observations are not a score or acceptance.

**STOP at Phase 3 review checkpoint.** Phase 4 viewer/material swapping, full-cabin modelling, production compression, measured fit and human fidelity review have not begun. All human gates remain open; 13 previously recorded development-dependency audit findings remain unresolved. No dependencies were reinstalled or upgraded.

## Validation evidence

Full gate stdout and JSON follow. Supporting command logs, rendering measurements and hashes are in `../review/spike-2026-10-20/evidence/`; final review images and `render-report.json` are in its parent directory. Application validation results are recorded there and in the cost log.

### Final scoped gate — exit 0

```text
> autolab-digital-showroom@1.0.0 validate:asset
> node scripts/validate-glb.mjs --scope spike --feasibility-webp --scope spike

Asset gate PASS: 2 nodes, 5426 triangles, 2 draw calls; sha256 36a107f152039a464d4a4dd7786794f66ea40628b5c97ad2d8083964ad1b458e
WARN: Owner-approved WebP feasibility deviation; not KTX2 production compliance (docs/spike/waivers.md).
WARN: Out-of-scope undefined material slots: MAT_Carpet_Floor, MAT_Console_Veneer_And_Leather, MAT_Door_Card_Substrate, MAT_Screen_Driver_Cluster
WARN: Khronos UNSUPPORTED_EXTENSION: Cannot validate an extension as it is not supported by the validator: 'KHR_draco_mesh_compression'.
WARN: Khronos UNUSED_MESH_TANGENT: Tangents are not used because the material has no normal texture.
WARN: Khronos UNUSED_OBJECT: This object may be unused.
WARN: Khronos UNUSED_OBJECT: This object may be unused.
WARN: Khronos UNUSED_OBJECT: This object may be unused.
Report: C:\Users\user\OneDrive\Desktop\AUTOLAB-DIGITAL-SHOWROOM\reports\glb-report.json
```

```json
{
  "passed": true,
  "scope": "spike",
  "synthetic": false,
  "sha256": "36a107f152039a464d4a4dd7786794f66ea40628b5c97ad2d8083964ad1b458e",
  "toolVersions": {
    "gltfTransformCore": "4.5.1",
    "gltfValidator": "2.0.0-dev.3.10"
  },
  "missingMaterialSlots": [
    "MAT_Carpet_Floor",
    "MAT_Console_Veneer_And_Leather",
    "MAT_Door_Card_Substrate",
    "MAT_Screen_Driver_Cluster"
  ],
  "errors": [],
  "warnings": [
    "Owner-approved WebP feasibility deviation; not KTX2 production compliance (docs/spike/waivers.md).",
    "Out-of-scope undefined material slots: MAT_Carpet_Floor, MAT_Console_Veneer_And_Leather, MAT_Door_Card_Substrate, MAT_Screen_Driver_Cluster",
    "Khronos UNSUPPORTED_EXTENSION: Cannot validate an extension as it is not supported by the validator: 'KHR_draco_mesh_compression'.",
    "Khronos UNUSED_MESH_TANGENT: Tangents are not used because the material has no normal texture.",
    "Khronos UNUSED_OBJECT: This object may be unused.",
    "Khronos UNUSED_OBJECT: This object may be unused.",
    "Khronos UNUSED_OBJECT: This object may be unused."
  ],
  "waivers": [
    "P3-WEBP-2026-10-20"
  ],
  "trianglesByNode": {
    "GEO_Dashboard_Screen_Central_OLED": 566,
    "GEO_Seat_Front_Driver_Flutes": 4860
  },
  "textures": [
    {
      "name": "seat-normal",
      "mimeType": "image/webp",
      "size": [
        2048,
        2048
      ]
    },
    {
      "name": "seat-albedo",
      "mimeType": "image/webp",
      "size": [
        2048,
        2048
      ]
    },
    {
      "name": "seat-orm",
      "mimeType": "image/webp",
      "size": [
        2048,
        2048
      ]
    }
  ],
  "nodeCount": 2,
  "materialCount": 2,
  "triangleCount": 5426,
  "drawCalls": 2,
  "fileSizeBytes": 900088,
  "gpuTextureBytesEstimated": 67108866,
  "activeDisplayDiagonalMm": 325.1062795353803,
  "validator": {
    "numErrors": 0,
    "numWarnings": 0
  },
  "asset": "public\\assets\\3d\\s-class-v223\\spike.glb"
}
```

### Final application and render checks — 2026-10-21

- `npm test`: exit 0; 4 files, 31 tests passed (13.04s on the quiet rerun).
- `npm run typecheck`: exit 0 after the nullable gate-report field fix.
- `npm run lint`: exit 0, 0 errors, 43 existing warnings.
- `npm run build`: exit 0; Next 16.4.2 compiled, typechecked and generated all six static pages.
- Final Blender render command: exit 0; five PNGs, all below 61 seconds each. See review render-report.json for exact CPU timings and hashes. GPU/runtime metrics NOT TESTED.
- Source/tooling committed locally as `964db795ee09299cc16d9ba32cce0f153019220c`; provenance points to that exact commit. No application source or dependency versions changed.
