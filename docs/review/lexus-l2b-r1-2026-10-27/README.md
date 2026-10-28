# Lexus L2B-R1 visual refinement review

2026-10-27/28. **Technical checks PASS; owner visual acceptance PENDING. The 9.5/10 aspiration is NOT established.** This is a bounded dashboard/wheel correction candidate. Both provisional seats are unchanged. Stop here before L3.

## Review the delivered candidate

- [Download contact sheet](contact-sheet.png): four actual Blender renders.
- Matched before/after: [dashboard](dashboard-before-after.png), [wheel](wheel-before-after.png), [combined cockpit](combined-before-after.png).
- Individual renders: [dashboard](04-dashboard.png), [wheel](03-wheel.png), [assembly](05-combined.png), [cockpit overview](06-cockpit-overview.png).
- Actual GLBs: [dashboard](../../../public/assets/3d/lexus-rx350/dashboard-l2b.glb), [wheel](../../../public/assets/3d/lexus-rx350/wheel-l2b.glb), [combined](../../../public/assets/3d/lexus-rx350/interior-l2b.glb).
- [Delivery hashes](delivery-index.json), [provenance](../../3d-assets/provenance.lexus-l2b-r1.json), [reproduction handoff](../../3d-assets/LEXUS_L2B_R1_HANDOFF.md), [pre-modeling ranked plan](../../3d-assets/LEXUS_L2B_R1_PLAN.md), [code review](code-review.md), [owner review form](review.md).
- Local reference sheet: `AUTOLAB_LEXUS_SEAT_REFERENCE_PACK/L2B_R1_REVIEW/reference-contact-sheet.png`. Dealer photos 35/33/29 remain local-only and are not embedded in the assets. Perspective is uncalibrated; image authenticity, exact trim and physical measurements remain unverified.

The dashboard has a rolled fascia, reshaped cowl, paired vent/clock bridge and lower display tray. The wheel has a thinner round rim, curved control pods, tapered hub and lower spoke. Wheel placement changes by 35 mm toward the seats and 10 mm upward, with estimated tilt 20 to 23 degrees. These are visual estimates, not ergonomic measurements. Cockpit grain uses the existing KTX2 normal with 4x UV repeat and reduced normal strength; material roughness/metallic factors and all seat materials remain unchanged. Lighting remains fixed for comparison.

## Unresolved visual defects — no agent score

| Area | Remaining issue visible in the evidence |
| --- | --- |
| Dashboard trim | Display bezel and vent surround have sharp, flared/crumpled corner highlights and faceting. Some corners look worse than the previous rounded blocks. This candidate is not an unqualified visual improvement. |
| Dashboard silhouette | Cowl/deck transitions remain abrupt; end caps are flat and simplified. Gauges lack authentic graphics; display remains inactive. Lower console is intentionally absent. |
| Wheel | Hub corners/joins still show creases; control faces and chevrons are generic and oversized relative to detailed reference switches. Exact legends, rim stitching and column hardware are missing; emblem is approximate. |
| Materials | Reduced grain can look too smooth/plastic. Colour, roughness and metallic response are not calibrated to physical material samples. Directional-pattern UV continuity remains unverified. |
| Seats | Existing hard shoulder edge, simplified headrest, coarse/stretched grain and provisional seam junctions are inherited without remodeling. |
| Composition | Reach, spacing and tilt remain estimates. Bounded components float without surrounding cabin structures. Existing driver-cockpit preset still misses the wheel. |

Dashboard reached the three-round review cap; wheel used two rounds; combined used one final two-view round. No additional correction cycle is claimed. Owner review must decide whether to retain this candidate, request another bounded correction, or use the original rollback.

## Actual technical measurements

| Asset | Triangles | Calls | Bytes | KTX2 images | Local loader ms |
| --- | ---: | ---: | ---: | ---: | ---: |
| Dashboard | 6,700 | 3 | 1,118,168 | 1 | 641.6 |
| Wheel | 5,024 | 3 | 1,089,844 | 1 | 988.5 |
| Combined | 76,548 | 12 | 3,829,276 | 6 | 1167.0 |

Combined versus L2B: **1,414 fewer triangles, 9,252 more bytes, same 12 calls**. Six semantic nodes, seven independent material slots, six shared 1024px KTX2 images with 11 mip levels. Unchanged hard caps: 80k triangles, 24 calls, 5,242,880 bytes. The combined asset still exceeds the 3.5 MB transfer target and earlier 45–60k triangle aspiration; the preserved seats alone total 64,824 triangles. No budget was raised.

All three actual gates exit 0 and pin the GLB SHA-256: [dashboard](evidence/dashboard-gate-report.json), [wheel](evidence/wheel-gate-report.json), [combined](evidence/combined-gate-report.json). Gate CLI outputs are `evidence/*-gate-final.txt`. Both authored component meshes have zero boundary edges and zero degenerate faces before export. This does not claim every intersecting solid or visible shading transition is correct.

Chromium 156 / Three r186 / SwiftShader decoded actual Draco geometry and embedded KTX2 textures. Each material tint changed rendered pixels while other material colour values stayed unchanged. Zero JavaScript errors or failed requests. [Dashboard](evidence/dashboard-browser-report.json), [wheel](evidence/wheel-browser-report.json), [combined](evidence/combined-browser-report.json). Combined default overview: 12 calls / 76,548 triangles / 12 geometry allocations / 7 texture allocations. Frustum-dependent preset counters may be lower; they are not total asset counts.

Loader times are single localhost software-renderer observations, not evidence of a speed improvement or phone performance. GPU texture bytes **8,388,612 are estimated**, not measured. Real-phone FPS, hardware GPU memory and L3 application integration: **NOT TESTED**. [Existing cockpit framing defect](evidence/combined-driver_cockpit.png) is handed off without changing the application camera.

## Validation and recorded limitations

- `C:\Python312\python.exe tests/test_cockpit_surfaces.py`: 3/3 PASS after the recorded missing-module red run. Closed loft incidence, smooth finite outline and invalid inputs are covered ([red](evidence/surfaces-red.txt), [green](evidence/surfaces-green.txt)).
- `npm test -- --maxWorkers=1`: **81/81 PASS**, seven files, 49.00s ([log](evidence/tests-full.txt)). Preservation regression now compares both seats, including decoded attributes, indices, transforms, material factors and texture hashes; standalone hashes are pinned.
- Remaining CLI checks and clean-process repeat evidence are indexed in [validation results](validation.md).
- Initial sandbox test failed with ancestor-directory access denial; unrestricted retry passed 13 targeted tests. Final GLB writes returned Windows `UNKNOWN -4094`; one unrestricted retry for each component succeeded. Failed outputs remain alongside retries. No dependency reinstall was used.
- Missing local rollback copy was reproduced and fixed: finalizer restores it from pinned `dfa77e2`, checks SHA before replacement, and rejects an existing mismatched backup. Actual restore/assembly output: [log](evidence/rollback-restore-assembly.txt).
- Pinned Khronos validator has unsupported Draco/BasisU, KTX MIME/image-format and unused-data limitations; raw messages are retained. KTX validation and actual decoder/browser checks complement it. SwiftShader ReadPixels stalls and Blender future `use_nodes` deprecations remain in logs.
- Thirteen prior development-dependency audit findings remain unresolved. No fresh audit, install or dependency upgrade is claimed.

## Evidence interpretation and rollback

Four final Cycles CPU renders total **402.581 seconds**. Each is 1200x1000, maximum 32 samples and 90s tracing limit; achieved samples unknown. Setup/denoising can exceed the tracing limit. Blender renders a proxy decoded from the delivered GLB and KTX2 level-0 pixels. Per-stage reports pin original/proxy/PNG hashes. Packaging asserts the original L2B camera, lighting, renderer and sample-limit settings match each comparison. These are actual artifact renders, not generated concept images.

Build/finalizer reports retain the source hashes at their actual execution time; component finalization predates the later rollback-restoration safeguard. The delivery index records final source hashes. These distinct historical hashes are not rewritten to imply a different execution.

Original five L2B assets remain recoverable at `dfa77e2`; [rollback index](rollback.json) pins them. Three frozen original gate snapshots are stored in `evidence/baseline-lexus*-report.json`. Driver SHA remains `b3dc6a11a2387ceb0b97d01b15e6519f410aeebc5c1662b0a26c8f6b7090ec52`; passenger SHA remains `54f5c69f86363ae78bada085719e30d4d0641966e7653cabb9e4f9c8fc05172c`.

All human gates remain unsigned; all unverified reference gaps remain open. Historical Mercedes WebP feasibility waiver remains separate; these Lexus assets use KTX2. No L3, full cabin, UI, dependency or deployment work is included.
