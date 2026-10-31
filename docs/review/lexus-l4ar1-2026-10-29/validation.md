# L4A-R1 validation and reproduction

Technical checks do not grant visual acceptance. This report covers the isolated R1 driver-seat samples, not production integration or Stage B.

## Environment and reproduction

Windows, Node 22.23.2, Python 3.12 with existing NumPy/Pillow, Blender 5.2.2 LTS (`d13f752e3b9c`), KTX-Software 4.4.2. No software or dependencies installed. Commands run from repository root; PowerShell captures stdout/stderr in `evidence/`. Derived maps/proxies in ignored `blender/out/` are regenerated, not hand-edited inputs.

Only trailing blank lines in the lint/typecheck logs were trimmed for Git whitespace checks; diagnostic content is unchanged. Historical `fields-*`, `atlas-tests-01` and `diamond-render-remaining` logs remain as earlier-attempt evidence; final results use `python-tests.txt` and current `*-render.json`.

```powershell
node tools/prepare-lexus-l4ar1.mjs
& 'C:\Program Files\Blender Foundation\Blender 5.2\blender.exe' --background --python blender/lexus_l4ar1_materials.py
node scripts/finalize-lexus-l4ar1.mjs
node scripts/validate-glb.mjs --scope lexus-l2a --asset experiments/lexus-l4ar1/diamond.glb --report docs/review/lexus-l4ar1-2026-10-29/evidence/diamond-gate.json
node scripts/validate-glb.mjs --scope lexus-l2a --asset experiments/lexus-l4ar1/perforated.glb --report docs/review/lexus-l4ar1-2026-10-29/evidence/perforated-gate.json
node tools/audit-lexus-l4ar1.mjs
node tools/verify-lexus-l4ar1.mjs
& 'C:\Program Files\Blender Foundation\Blender 5.2\blender.exe' --background --python blender/render_lexus_l4ar1.py -- diamond
& 'C:\Program Files\Blender Foundation\Blender 5.2\blender.exe' --background --python blender/render_lexus_l4ar1.py -- perforated
& 'C:\Python312\python.exe' -m unittest discover -s tests -p 'test_lexus_l4ar1_*.py'
npm test
npm run typecheck
npm run lint
& 'C:\Python312\python.exe' tools/package-lexus-l4ar1-review.py
```

The finalizer reuses the committed Classic bolster maps, avoiding a dependency on an ignored previous build. It validates and decodes each new KTX2 payload. Render proxies substitute those decoded pixels for Blender compatibility; proxy and final asset hashes are asserted before rendering. The isolated browser loads the actual delivered KTX2/Draco GLBs and existing thread hook.

## Evidence and boundaries

- Final asset gates: both exit 0; exact SHA-256 and detailed warnings in `evidence/*-gate.json` and text logs. Existing 3.5 MB, 35k triangle and 1024px limits retained. Both exceed the 2.5 MB target. No waiver added.
- Final decoded preservation: exit 0. Positions within 0.1 mm tolerance (observed maximum under 0.05 mm), counts, topology/winding, transforms and material factors checked independently. No intentional vertex displacement. Primary UVs/tangents intentionally differ; compressed bytes are not claimed identical.
- UV derivative measurements use the actual connected cushion/backrest surfaces. Median longitudinal scale ratio is 0.999815 after correction versus 1.2802 before; local curvature still produces distortion. Existing secondary degenerate UVs are not fixed.
- Python regression coverage checks deterministic neutral fields, recessed pores, convex padding, unknown-kind rejection, actual boundary/seam samples, area-derived atlas scale, decoded thread coverage and map orientation. It does not certify leather appearance.
- Browser verification asserts independent primary/secondary/thread colours, unchanged texture references, quilt-only pixel changes, compressed maps with 11 mip levels, 32,412 triangles and three calls. Software-renderer load timing is a local observation, not phone or GPU performance.
- Raw warnings are retained: pinned Khronos validator support limitations around Draco/Basis images, existing unused attributes, Blender deprecation notices and SwiftShader readback warnings. Dedicated KTX validation and actual decoding supplement the generic validator; they do not remove its limitations.
- The source photos have unknown physical scale, trim identity and lighting. No photo pixels are used in map generation. Procedural dimensions are estimates. No phone FPS, GPU bytes, workshop validation or human score is claimed.

## Failed attempts and review corrections

1. UV preparation failed on unsupported Accessor `getX/getY`; corrected to documented `getElement`. Second attempt failed the arc-length assertion because nearest vertices could lie on the same side of the centre line. Bracketing interpolation and sufficient atlas height corrected it; third attempt passed. Both failure logs remain.
2. First Blender map command could not import the neighbouring helper module; explicit local script-directory import path corrected it. No installation was needed.
3. Initial seven field tests failed because the implementation module did not exist; the subsequent implementation passed. Boundary/decoded-map tests were added independently against actual geometry and KTX pixels.
4. Independent code review identified missing final decoded preservation and physical seam/atlas assertions. The added audit and six atlas tests address those gaps. They supply no visual acceptance.
5. Round 1 showed soft pattern borders and regular seam-adjacent ripple marks. Round 2 narrows the pattern fade, reduces/irregularizes wrinkle normals and changes quilt shoulders. Round 1 images/reports are retained under `evidence/round1/` as superseded evidence; only the current GLBs are deliverables. Two visual rounds per treatment, within the three-round cap.

## Scope of application checks

Application source, production assets, dependencies and old L4A artifacts are unchanged. No production build is repeated for these isolated scripts/materials; the prior L4A build result is historical evidence, not a new R1 build. Prior 13 development-dependency audit findings remain unresolved; no dependency audit or upgrade is claimed in this task.

## Technical sources consulted

- [glTF Transform Accessor API](https://gltf-transform.dev/modules/core/classes/Accessor): `getElement` / `setElement` for attribute data.
- [glTF 2.0 specification](https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html): texture coordinate and material conventions.
- Blender normal-map manual fetch returned HTTP 402 and is **not** recorded as a successful documentation check. Saved-map orientation is instead covered by the actual decoded-image regression.

## Final checks — resumed 2026-10-31

- Full application suite: **87/87 PASS across eight files**, 40.20s, exit 0; `evidence/vitest.txt`. Used the permitted unrestricted shell for the previously established sandbox ancestor-directory restriction. No reinstall or dependency change.
- Python: **13/13 PASS**, 82.247s; `evidence/python-tests.txt`. Includes 298 actual boundary midpoints, cushion/backrest seam probes and decoded images. Final Diamond exclusion alpha has a maximum compression residual of 1/255, with a mean rounded to zero; do not claim every decoded exclusion pixel is exactly zero. Thread mask MAE 0.000637 versus 0.010542 when vertically flipped.
- Typecheck: **exit 0**, `evidence/typecheck.txt`.
- Lint: **exit 0, zero errors / 41 existing warnings**, `evidence/lint.txt`.
- Packaging: **exit 0**, `evidence/package.txt`; hashes match across GLBs, gates, browser, decoded preservation, render proxies and PNGs. Both treatments use matching cameras/lenses, lighting, display colours and render settings. Six final Cycles CPU render calls total **688.457 seconds**. Maximum 48 samples / 90s tracing; achieved sample counts unknown.
- Final software-browser load observations: Perforated 2162.1 ms cold, Diamond 480.1 ms warm. Background rendering was active; these are not a controlled comparative benchmark. Three calls / 32,412 triangles each; nine texture and fifteen geometry allocations include harness environment resources. Zero JS/request failures; readback warnings retained.
- Production SHA-256 remains `c51e4db56faec8307eb6d6d25d88489cf212a935bafff0c2212c27abbcbc19d2`. `git diff --exit-code 6ab8525 -- src public package.json package-lock.json experiments/lexus-l4a` exited 0.
- Final consistency check: **exit 0**, `evidence/consistency.txt`; all source/image/asset/provenance hashes, original photo copies, 16 local documentation links and STATE's 20-line cap checked. Source hashes describe this Windows working copy; Git's existing CRLF conversion may change raw text hashes on a different checkout. Binary asset/image hashes are independent of line endings. Source/assets/tests commit: `6633551`; review evidence follows separately.
