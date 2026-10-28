# Lexus L2B review pack

> Frozen L2B evidence from `dfa77e2`. Since 2026-10-28 the live dashboard/wheel/combined GLB URLs point to the L2B-R1 candidate; they are not the original bytes described below. See [current review](../lexus-l2b-r1-2026-10-27/README.md) and its rollback index. Original renders, browser evidence and this pack's hashes remain historical.

Authored 2026-10-26; resumed and packaged 2026-10-27. **Technical checks PASS. Human visual acceptance PENDING.** Owner accepted only the R1 driver as a provisional baseline and authorized this bounded L2B slice. No L3 implementation, deployment or human gate closure.

## Deliverables and evidence

- [Download contact sheet](contact-sheet.png): six actual final Blender renders.
- [Passenger](01-passenger.png), [seat seam](02-passenger-seam.png), [wheel](03-wheel.png), [dashboard](04-dashboard.png), [combined](05-combined.png), [cockpit overview](06-cockpit-overview.png).
- [Combined GLB](../../../public/assets/3d/lexus-rx350/interior-l2b.glb), [passenger GLB](../../../public/assets/3d/lexus-rx350/passenger-seat-l2b.glb), [wheel GLB](../../../public/assets/3d/lexus-rx350/wheel-l2b.glb), [dashboard GLB](../../../public/assets/3d/lexus-rx350/dashboard-l2b.glb).
- [Delivery index](delivery-index.json): complete SHA-256s, source hashes, measured counts and render timings. [Provenance](../../3d-assets/provenance.lexus-l2b.json), [integration handoff](../../3d-assets/LEXUS_L2B_HANDOFF.md), [code review](code-review.md), [owner form](review.md).
- Local-only reference comparison: `AUTOLAB_LEXUS_SEAT_REFERENCE_PACK/L2B_REVIEW/reference-contact-sheet.png`. Photos 29/33/35 remain ignored; no dealer photographs are committed or embedded in the GLB. Photo perspectives are not calibrated.

## Actual results

| Asset | Triangles | Calls | Bytes | KTX textures | Local loader ms |
| --- | ---: | ---: | ---: | ---: | ---: |
| passenger | 32,412 | 3 | 3,461,200 | 6 | 1250.6 |
| wheel | 6,972 | 3 | 1,101,416 | 1 | 688.0 |
| dashboard | 6,166 | 3 | 1,097,348 | 1 | 635.1 |
| combined | 77,962 | 12 | 3,820,024 | 6 | 850.5 |

All four historical gates exit 0: [passenger](../../../reports/lexus-passenger-report.json), [wheel](../lexus-l2b-r1-2026-10-27/evidence/baseline-lexus-wheel-report.json), [dashboard](../lexus-l2b-r1-2026-10-27/evidence/baseline-lexus-dashboard-report.json), [combined](../lexus-l2b-r1-2026-10-27/evidence/baseline-lexus-report.json). CLI output is retained in `evidence/*gate*.txt`; final delivery reports and index identify the historical hashes. Six semantic nodes, seven material slots and six shared 1024px KTX2 textures (11 levels each) are present in that combined asset. Its SHA is `aec0e7cc46de950609de3a1595879175b48e30629eb8465dd9583b1a23a0f09f`.

Combined browser renderer records 12 calls / 77,962 triangles / 12 geometries / 7 texture allocations. Each component records 3 calls / 3 geometries; seat allocates 7 textures, cockpit components 2 each. Allocation counters include the browser harness environment and are not GPU byte measurements. Gate estimate: 8,388,612 texture bytes for the combined asset; **not measured GPU memory**.

Actual Chromium 156 / Three r186 / SwiftShader decoded Draco and KTX2; all seven combined material tints changed pixels while other material colour values stayed unchanged. Zero JS errors or failed requests. [Combined browser report](evidence/combined-browser-report.json), [passenger](evidence/passenger-browser-report.json), [wheel](evidence/wheel-browser-report.json), [dashboard](evidence/dashboard-browser-report.json). The loader figures above are single localhost software-renderer observations, not phone FPS or network benchmarks. Real-phone performance: **NOT TESTED**. L3 app integration: **NOT TESTED / out of scope**.

The combined file exceeds the 3.5 MB transfer target but passes the unchanged 5,242,880-byte hard limit. Passenger exceeds its 2.5 MB target but passes 3.5 MB hard limit. Combined 77,962 triangles exceed the earlier 45–60k aspiration; the unchanged seat pair already costs 64,824. It passes the unchanged 80k cap. Twelve calls meet the prose target, exceed the six-call aspiration and pass the unchanged 24-call cap. These are disclosed exceptions, not raised full-scene limits.

## Validation commands and failures

- Test-first scoped gate: six failures before scope support; assembly module absent before implementation. New regression tests initially failed on missing material, aggregate bounds and individual compressed payload enforcement. Actual red/green logs retained in `evidence/`.
- `npm test -- --maxWorkers=1`: **80/80 PASS**, 7 files, 37.01s ([log](evidence/tests-full.txt)). Final array-offset precision correction: assembly **3/3 PASS**, 1.89s ([log](evidence/assembly-tests-final.txt)).
- `npm run typecheck`: **PASS** ([log](evidence/typecheck-final.txt)); initial missing Draco type declaration is retained in [failed log](evidence/typecheck.txt).
- `npm run lint`: **PASS**, 41 pre-existing warnings / zero errors ([log](evidence/lint.txt)).
- `npm run build`: **PASS**, one production build, compilation 26.1s / TypeScript 27.1s ([log](evidence/build.txt)). No repeated build or dependency change. Thirteen prior development-dependency audit findings remain unresolved; no fresh audit claim.
- Initial sandbox test process failed reading an ancestor directory; unrestricted retry supplied the actual results. Wheel tangents initially missing; explicit export tangents fixed this. Dashboard exceeded its triangle cap; reduced sampling/explicit triangulation corrected it without changing the cap. Later wheel-emblem orientation and display/plinth contact were corrected and revalidated.
- A stale combined-render hash assertion correctly rejected an outdated proxy; the subsequent render was interrupted before PNG/report output. [Resumed log](evidence/combined-render-resumed.txt) records both final images. No interrupted output is counted as a pass.
- Pinned Khronos validator cannot inspect Draco/BasisU internals and retains KTX MIME/unused-data warnings. KTX payload validation and actual decoding complement it. SwiftShader ReadPixels warnings and Blender future `use_nodes` deprecations remain in logs.

## Visual limitations observed by the agent — not scores

| Area | Unresolved limitation |
| --- | --- |
| Seats | R1's hard rear shoulder edge, simplified headrest, coarse/stretched grain and provisional seam junctions are inherited. Passenger controls are mirrored outward; hidden side-specific mechanisms remain unverified. |
| Wheel | Rectangular spoke/control pods and broad hub are simplified. Generic bars replace accurate button legends; emblem is a hand-authored approximation. Grain is coarse; rim stitching and detailed column hardware are absent. |
| Dashboard | Broad block/arch surfaces, flat end caps, sparse gauges and inactive blank display remain approximate. Dedicated close view clips the left end; combined views show the bounded assembly. No lower console/doors/floor. |
| Assembly | Seat spacing, reach, wheel tilt and dashboard position are uncalibrated estimates. Components float in the studio because surrounding cabin structures are intentionally excluded. Not an ergonomic or fitment model. |
| Cameras | Existing `driver_cockpit` points into the seats and misses the wheel: [actual screenshot](evidence/combined-driver_cockpit.png). [Cabin pair](evidence/combined-cabin_pair.png) and [overview](evidence/combined-browser-asset.png) are diagnostics. Antigravity must calibrate cockpit framing during separately authorized L3. No app camera changed here. |
| Future patterns | Smart-projected cockpit islands and existing seat seams may distort directional patterns. Mirrored passenger UV direction and coarse normal scale need review before bespoke quilting. No pattern UI or generated decorative texture. |

## Render interpretation / preservation

Cycles CPU, 1200x1000, maximum 32 samples, 90s tracing limit; achieved samples unknown. Setup and denoising can exceed that tracing limit. Same L2B light rig across views; no claim that these new camera views match R1 comparison framing. Final six images total 586.338s. Each stage render report in `evidence/` records actual camera, rig, asset/proxy/PNG hashes. Blender renders the decoded delivered geometry and KTX level-0 pixels through a PNG proxy; Blender does not natively render KTX2.

Driver SHA remains `b3dc6a11a2387ceb0b97d01b15e6519f410aeebc5c1662b0a26c8f6b7090ec52`; original Draco payloads survive assembly byte-for-byte, with decoded equivalence tests. Driver source and rollback remain at R1/original history. Passenger imported split vertices report boundary edges; no new watertight-seat claim is made. New wheel/dashboard source solids report zero boundary and degenerate faces, and delivered decoder checks pass.

**STOP at owner review.** Legacy GATE-01/GATE-08/GATE-11, all other unsigned human gates, GAP-01 through GAP-04 and Mercedes D1 are untouched. The old Mercedes WebP feasibility waiver remains historical and is not reused: these Lexus assets use KTX2. No visual scores, OEM dimensions, device measurements or production approval are inferred.

Text logs preserve actual output; trailing whitespace and line endings were normalized for repository formatting. One documentation helper failed on an encoding-alias typo and succeeded after correction; no asset changed.

## Commit record

R1 synchronization: `16a5362..b5a7adf` pushed before modeling. L2B gate contracts `8317af9`; source/assets/tests `5ecda81`; this review pack is the following documentation commit. Delivery uses a normal push to `pre-phase-6-reconciliation`; final response records the confirmed remote tip.
