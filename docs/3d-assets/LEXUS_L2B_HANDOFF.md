# Lexus L2B — bounded mock-up delivery

## Authorization and baseline — 2026-10-26

The owner's L2B instruction accepts the R1 driver seat as a **provisional mock-up baseline** and authorizes passenger seat, wheel, visible dashboard, combined asset, validation and push to `pre-phase-6-reconciliation`. This supersedes older L2B-lock statements. It does not certify photographic fidelity or sign legacy human gates. L3 integration remains excluded.

Before modeling, `git fetch origin pre-phase-6-reconciliation` found remote `16a5362` to be an ancestor of `b5a7adf` (0 remote-only, 2 local-only commits). The existing branch was fast-forwarded and pushed normally: `16a5362..b5a7adf`. No remote work was overwritten. R1 source `d7a9ee4` and evidence `b5a7adf` are preserved.

Immutable driver input: `public/assets/3d/lexus-rx350/driver-seat-l2a.glb`, SHA-256 `b3dc6a11a2387ceb0b97d01b15e6519f410aeebc5c1662b0a26c8f6b7090ec52`. Original rollback remains at `16a5362`. No new driver authoring or refinement round is authorized.

## Implementation contract

Build passenger, wheel, dashboard in that order, then assemble. Use the existing headless Blender entrypoint with an explicit L2B mode and existing NodeIO/Draco/KTX pipeline. Blender dimensions are metres, X lateral / -Y forward / Z up; GLB is Y up. All new dimensions and placement are visual estimates.

Passenger reflection across X=0 puts its controls on the outward side, matching photo 29. It shares the original six seat textures, material factors and stitch layout. Hidden side mechanisms are excluded. Wheel/photo 33 supplies the three spokes, broad hub, silver lower accent and lateral control pods. Photo 16 is **display evidence**, not a wheel close-up. Photo 35 guides the raised widescreen, asymmetric cowl, central vents/clock and passenger trim. Photo 34 shows the lower console/stack, outside this bounded upper-dashboard slice; photo 07 supplies wider cockpit context. No dealer pixels are embedded in the asset.

The manifest adds `MAT_Cockpit_Accent` (satin metal, roughness .30 / metallic .70) and `MAT_Cockpit_Black` (fixed dark controls/display, roughness .30 / metallic 0). Both are allowed only on wheel/dashboard. This implements the owner's independent leather/trim requirement; the five component groups and three seat slots remain unchanged. Existing `MAT_Dashboard_Trim` controls the soft deck/cowl. Black controls and metallic accents remain separately addressable. No new UI is implemented.

Component provisional budgets are in `lexus-l2b-budgets.json`; full manifest enforcement remains 80,000 triangles, 24 calls, 5,242,880 bytes and 48 MB estimated texture memory. The older prose target of 12 calls remains a stricter presentation target, not a silently changed manifest cap. Six calls is aspirational. Seat pair alone is 64,824 triangles, above the original 45–60k full-scene target before cockpit geometry. This is disclosed, not hidden by reducing the approved seat.

Tests first: new scoped gates must accept only their components, reject missing UVs, 100x scale and extra nodes, and never let a component pass full-scene validation. Existing mutation tests remain. Final delivery requires actual per-component/full gates, hash-linked browser decoding and independent tints, representative renders and source/provenance records. No phone FPS or GPU-byte claim without hardware measurement.

## Delivered files and evidence — 2026-10-27

Four GLBs under `public/assets/3d/lexus-rx350/`: `passenger-seat-l2b.glb`, `wheel-l2b.glb`, `dashboard-l2b.glb`, `interior-l2b.glb`. [Review pack](../review/lexus-l2b-2026-10-26/README.md) lists actual counts, gates, browser tests, renders and limitations. [Delivery index](../review/lexus-l2b-2026-10-26/delivery-index.json) pins all hashes; [provenance](provenance.lexus-l2b.json) maps all six nodes to source records and estimates.

Combined: 77,962 triangles, 12 calls, 3,820,024 bytes, six shared KTX2 textures. Four actual gates and browser decode/tint probes PASS. Full suite 80/80, final assembly 3/3, typecheck/lint/build PASS; 41 existing lint warnings and 13 prior development audit findings remain. This is technical evidence only.

## Exact Antigravity integration requirements — future L3 only

1. After separate L3 authorization, load `/assets/3d/lexus-rx350/interior-l2b.glb` with existing local Draco and KTX2 loaders; retain renderer-dependent `KTX2Loader.detectSupport`. Cache/version against the delivery SHA. Do not run the old default driver build or replace `driver-seat-l2a.glb`.
2. Keep authored coordinates and identity semantic-node transforms. GLB metres/Y-up; Blender (x,y,z) converts to (x,z,-y). Driver X=-.38, passenger X=+.38, estimated seat spacing .76m. Wheel centre [-.38,.90,.43], approximate 20-degree tilt; display centre [.08,1.020,.78]. These are visual placement conventions, not OEM dimensions/fitment. Do not auto-centre components independently.
3. Traverse meshes by semantic name/prefix: two seat groups, original driver stitching, passenger stitching suffix, wheel and dashboard. GLTFLoader expands multi-material nodes into suffixed primitive meshes. Bind by material name, not array index. Clone shared materials only if a future requirement asks for separate per-seat colours.
4. Preserve seven slots: `MAT_Seat_Primary`, `MAT_Seat_Secondary`, `MAT_Seat_Stitching`, `MAT_Steering_Leather`, `MAT_Dashboard_Trim`, `MAT_Cockpit_Accent`, `MAT_Cockpit_Black`. Primary/secondary/stitch are shared across seats; accent and black are shared across wheel/dashboard. A tint of a shared slot intentionally affects both components. Upholstery stays independent from stitch, wheel leather and dashboard trim. Preserve textures, vertex tints, PBR factors and colour spaces; do not replace materials with untextured defaults.
5. Recalibrate cockpit framing: existing `driver_cockpit` points into the seats and misses the wheel. Its actual screenshot is in the review pack. Existing `cabin_pair`, hero and macro were captured as diagnostics, not accepted framing. The isolated overview uses position [-2,1.8,-1.7], target [0,.83,.15], FOV36 as an unapproved starting point; check desktop and mobile visibility and controls under the real app lighting.
6. Re-run app loading/error/retry, orbit/zoom, all material controls and renderer counters on the combined asset. Then measure a named real phone/browser. The L2B isolated harness cannot certify L3 integration or device performance. Human visual review must cover simplified wheel controls, blank display, dashboard ends, inherited seat defects and estimated placement.
7. Keep rollback driver URL/history available. No schema-driven full-cabin additions, kinematics, AI upholstery pattern system, dependency upgrades or visual acceptance are part of this handoff. Legacy Mercedes gates/gaps/D1/WebP waiver stay untouched; Lexus uses KTX2.

## Reproduce the bounded assets

Run from repository root with installed dependencies, Blender 5.2.2 and KTX-Software 4.4.2. No installation/download is part of these commands. Execute sequentially:

```powershell
node scripts/finalize-lexus-l2b.mjs passenger
& 'C:\Program Files\Blender Foundation\Blender 5.2\blender.exe' -b --factory-startup --python-exit-code 1 --python tools/build-lexus-asset.py -- --l2b passenger
& 'C:\Program Files\Blender Foundation\Blender 5.2\blender.exe' -b --factory-startup --python-exit-code 1 --python tools/build-lexus-asset.py -- --l2b wheel
node scripts/finalize-lexus-l2b.mjs wheel
& 'C:\Program Files\Blender Foundation\Blender 5.2\blender.exe' -b --factory-startup --python-exit-code 1 --python tools/build-lexus-asset.py -- --l2b dashboard
node scripts/finalize-lexus-l2b.mjs dashboard
node scripts/finalize-lexus-l2b.mjs assemble
node scripts/validate-glb.mjs --scope lexus-passenger --asset public/assets/3d/lexus-rx350/passenger-seat-l2b.glb --report reports/lexus-passenger-report.json
node scripts/validate-glb.mjs --scope lexus-wheel --asset public/assets/3d/lexus-rx350/wheel-l2b.glb --report reports/lexus-wheel-report.json
node scripts/validate-glb.mjs --scope lexus-dashboard --asset public/assets/3d/lexus-rx350/dashboard-l2b.glb --report reports/lexus-dashboard-report.json
node scripts/validate-glb.mjs --scope lexus --asset public/assets/3d/lexus-rx350/interior-l2b.glb --report reports/lexus-report.json
node tools/verify-lexus-l2a.mjs passenger
node tools/verify-lexus-l2a.mjs wheel
node tools/verify-lexus-l2a.mjs dashboard
node tools/verify-lexus-l2a.mjs combined
```

Render each stage sequentially with `blender -b --factory-startup --python-exit-code 1 --python blender/render_lexus_l2b.py -- <stage>` (passenger/wheel/dashboard/combined). Then `C:\Python312\python.exe tools/package-lexus-l2b-review.py`. It needs the ignored local reference pack, checks matching hashes and generates the contact sheets. Intermediate `.blend`/raw/proxy/texture files remain in ignored `blender/out/lexus-l2b/`; source scripts, final GLBs and evidence are committed. Reproducible construction/settings are provided; byte-identical cross-machine output is not established.

Before tests on a clean checkout, generate existing ignored fixtures with `npm run validate:fixture`, `npm run validate:lexus:fixture` and `npm run validate:lexus:l2a`, then run `npm test -- --maxWorkers=1`, `npm run typecheck`, `npm run lint`, `npm run build`. Do not run tests/build concurrently with CPU rendering. No fresh dependency audit was performed.

**STOP after L2B delivery; Antigravity owns separately authorized L3.**
