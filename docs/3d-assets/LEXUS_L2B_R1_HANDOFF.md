# Lexus L2B-R1 asset handoff

Owner-authorized correction slice, started 2026-10-27 and resumed 2026-10-28. Stop for owner visual review before L3. The 9.5/10 aspiration is **not established**; no agent score or production acceptance is assigned.

## Changes and limits

- Dashboard: cross-section loft wraps the deck into a rolled fascia; tapered instrument hood, recessed twin gauges, shallow display tray, paired vents/clock bridge, continuous satin ribbon and tapered ends replace the L2B slab and disconnected rectangles.
- Wheel: round non-F-SPORT rim, curved wedge control pods, tapered crowned shield, flared lower spoke and authored raised emblem. Exact switch legends, wheel stitching, detailed instrument graphics and active display graphics remain absent.
- Composition: wheel centre moved from Blender `[-.38,-.43,.90]` to `[-.38,-.395,.91]` (35 mm toward the seats, 10 mm higher), with estimated tilt 20 to 23 degrees. Both seats and dashboard global placement remain. The changes are visual estimates, not measured reach/fitment.
- Materials: same seven slots and roughness/metallic factors. Cockpit UV repeat is 4x; normal strength .35 to .14 on wheel and .09 on dashboard. Existing non-perforated KTX2 normal payload reused, no new texture/pattern, catalogue colour or seat-material change. Metallic facets and smooth-looking cockpit leather remain review concerns.
- Final dashboard render retains overly sharp bezel/metallic corner highlights, a still-inactive display, simplified gauge graphics and abrupt cowl/deck transitions. Wheel control faces and hub transitions remain simplified. These prevent any claim that premium presentation or 9.5/10 has been achieved. Dashboard reached its three-round review cap; no further dashboard work in this slice.

## Files and contracts

Current replacements: `public/assets/3d/lexus-rx350/dashboard-l2b.glb`, `wheel-l2b.glb`, `interior-l2b.glb`. The existing URL names are retained. [Review pack](../review/lexus-l2b-r1-2026-10-27/README.md) and [delivery index](../review/lexus-l2b-r1-2026-10-27/delivery-index.json) pin current hashes and actual results. [Correction contract](LEXUS_L2B_R1_PLAN.md) records the pre-modeling ranking and reference limitations.

Driver SHA remains `b3dc6a11a2387ceb0b97d01b15e6519f410aeebc5c1662b0a26c8f6b7090ec52`; passenger SHA remains `54f5c69f86363ae78bada085719e30d4d0641966e7653cabb9e4f9c8fc05172c`. Both compressed primitive streams and decoded attributes/transforms/material factors/textures are checked inside assembly. No seat geometry or seat-material adjustment was needed.

Seven existing bindings remain: seat primary, secondary and stitching; steering leather; dashboard trim; cockpit accent and black. Seats share their three materials; wheel/dashboard share accent and black. Preserve name-based traversal, local Draco/KTX2 support detection, colour spaces and map factors. The six semantic nodes and 12 primitive calls remain; no manifest/budget relaxation.

Antigravity L3 remains separately authorized work. Its tasks are unchanged: load the combined asset, calibrate cockpit framing (current preset still misses the wheel), test the actual application interaction/error states and measure a named phone. This slice tests the isolated browser harness only. No viewer/app camera, lighting implementation or dependency was edited. Review lighting is unchanged for honest before/after comparisons.

## Rollback and reproduction

Original L2B: commit `dfa77e2`. [Rollback index](../review/lexus-l2b-r1-2026-10-27/rollback.json) records five original GLB hashes; local copies are under ignored `blender/out/lexus-l2b-r1/baseline/`. The finalizer restores missing wheel/dashboard/combined rollback copies directly from this pinned local Git commit and validates their hashes before writing any replacement. An existing mismatched rollback is rejected. No network source is used. A shallow checkout must contain `dfa77e2` to reproduce this safety check.

Run in repository root with installed Blender 5.2.2, Python 3.13.13 embedded, Node 22.23.2 and KTX-Software 4.4.2. For review-sheet composition the local Python 3.12/Pillow environment and ignored owner reference pack are also required. No installation or download is part of these steps:

```powershell
node scripts/finalize-lexus-l2b.mjs prepare
& 'C:\Program Files\Blender Foundation\Blender 5.2\blender.exe' -b --factory-startup --python-exit-code 1 --python tools/build-lexus-asset.py -- --l2b dashboard
node scripts/finalize-lexus-l2b.mjs dashboard
& 'C:\Program Files\Blender Foundation\Blender 5.2\blender.exe' -b --factory-startup --python-exit-code 1 --python tools/build-lexus-asset.py -- --l2b wheel
node scripts/finalize-lexus-l2b.mjs wheel
node scripts/finalize-lexus-l2b.mjs assemble
node scripts/validate-glb.mjs --scope lexus-dashboard --asset public/assets/3d/lexus-rx350/dashboard-l2b.glb --report reports/lexus-dashboard-report.json
node scripts/validate-glb.mjs --scope lexus-wheel --asset public/assets/3d/lexus-rx350/wheel-l2b.glb --report reports/lexus-wheel-report.json
node scripts/validate-glb.mjs --scope lexus --asset public/assets/3d/lexus-rx350/interior-l2b.glb --report reports/lexus-report.json
node tools/verify-lexus-l2a.mjs dashboard
node tools/verify-lexus-l2a.mjs wheel
node tools/verify-lexus-l2a.mjs combined
& 'C:\Program Files\Blender Foundation\Blender 5.2\blender.exe' -b --factory-startup --python-exit-code 1 --python blender/render_lexus_l2b.py -- dashboard
& 'C:\Program Files\Blender Foundation\Blender 5.2\blender.exe' -b --factory-startup --python-exit-code 1 --python blender/render_lexus_l2b.py -- wheel
& 'C:\Program Files\Blender Foundation\Blender 5.2\blender.exe' -b --factory-startup --python-exit-code 1 --python blender/render_lexus_l2b.py -- combined
C:\Python312\python.exe tools/package-lexus-l2b-r1-review.py
```

Do not invoke the old default driver build or `finalize ... passenger` during R1. Historical L2B passenger-authoring commands require the `dfa77e2` source version; current R1 explicitly rejects passenger finalization.

Run geometry helper tests with `C:\Python312\python.exe tests/test_cockpit_surfaces.py`. Existing ignored fixtures must exist before Vitest: generate them using `npm run validate:fixture`, `npm run validate:lexus:fixture`, `npm run validate:lexus:l2a` on a clean checkout. Then run `npm test -- --maxWorkers=1`, `npm run typecheck`, `npm run lint`, `npm run build` sequentially after CPU renders finish. No dependency audit repair or full-cabin/L3 work is included.

**Owner review is the next checkpoint.** All unsigned human gates and unverified reference gaps remain open. Legacy Mercedes WebP waiver stays separate; Lexus uses actual KTX2.
