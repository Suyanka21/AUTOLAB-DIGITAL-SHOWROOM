# AutoLab 3D production baseline

Recorded 2026-10-24 during Lexus L2A-R1. **Technical procedures have evidence; visual techniques remain candidates awaiting owner approval.** Owner update 2026-10-26: R1 is accepted as a provisional mock-up baseline and L2B is authorized; this does not grant visual or production acceptance.

## Procedures demonstrated on the driver seat

- Author through `tools/build-lexus-asset.py` and `blender/lexus_constants.py`, using Blender 5.2.2 LTS / embedded Python 3.13.13. Seed analytic textures; keep source hashes and a build report. Generated `.blend` files and intermediates live under ignored `blender/out/lexus-l2a-r1/`.
- Work in metres, Blender Z-up, front along -Y. Export glTF Y-up with transforms applied. The retained driver-seat lateral origin is X=-0.38 m; this is a scene placement convention, not an OEM measurement.
- Use shared perimeter vertices for closed cushion/backrest shells. Check finite coordinates, zero boundary edges and zero-area faces on the upholstery solids before triangulation. Independent thread tubes have deliberately open ends; do not apply the closed-solid rule to them.
- Preserve `GEO_Seat_Front_Driver` with `MAT_Seat_Primary` (perforated inserts) and `MAT_Seat_Secondary` (bolsters/headrest/visible trim), and `GEO_Seat_Stitching_Front` with `MAT_Seat_Stitching`. Exactly three asset primitives support independent tinting. Visible trim also uses vertex tint, so its colour follows the secondary slot at reduced brightness.
- Export selected meshes only: no camera, studio floor, lights, animation, skeleton or hidden mechanisms. Include UVs, tangent normals, vertex colours and Draco compression. Position/normal/UV quantization remains 16/10/14 bits. Check the installed exporter's RNA before invoking options.
- `scripts/finalize-lexus-l2a.mjs` uses installed KTX-Software 4.4.2 and glTF Transform 4.5.1. Encode six 1024px UASTC/Zstd textures with 11 mip levels; colour maps sRGB, normals/ORM linear. Run `ktx validate` on each payload. Current RDO lambda 1.1 is an explicit compression tradeoff subject to macro review.
- Keep base maps neutral so browser colour controls remain independent. Manifest roughness factors remain 0.48 leather / 0.35 thread. R1 reduces clearcoat/specular strength and differentiates per-panel roughness maps; it does not change the manifest's factors or material names.
- Validate the **actual** GLB with `node scripts/validate-glb.mjs --scope lexus-l2a --asset public/assets/3d/lexus-rx350/driver-seat-l2a.glb --report reports/lexus-l2a-report.json`. Keep JSON, exit status and SHA together. Negative fixture tests complement this; they never substitute for it.
- Browser verification must decode Draco and KTX2, check finite decoded attributes/positive triangle areas, exercise all three material tints, and record actual renderer counters. `tools/verify-lexus-l2a.mjs` supplies isolated pixel-change checks; `e2e/lexus-refinement.spec.ts` exercises the actual Next/R3F application and preserved camera presets.
- Render from the finalized GLB round-trip with decoded delivered KTX pixels because Blender cannot import KTX2 natively. Verify the GLB, proxy and PNG hashes; compare with the unchanged studio rig. The proxy differs in texture encoding, not geometry or material values.

## Visual techniques: still awaiting owner approval

Parametric foam contours, rounded headrest profiles, small seam-compression fields, analytic leather grain/perforations and projected thread dashes are editable techniques, **not approved Lexus fidelity**. Dimensions, thread radius/pitch, grain scale, exact panel topology and trim identity remain estimates. The supplied photographs are perspective references, not calibrated measurements or colour targets. Photo 31 supplies rear/shoulder context; it is not a front-seat macro.

R1 uses three-sided thread sections instead of four, retaining the nominal radius/pitch while allocating more triangles to continuous seam routes. This changes the section's silhouette and shading; do not treat its nominal diameter as a round-thread measurement or reuse it without a macro review. Coarse grain on return/trim surfaces and a hard rear shoulder transition remain visible limitations.

Review hero, profile and macro against photos 08/23/31. Check shoulder width, waist taper, headrest crown/post gap, cushion front roll, control profile, pore scale, grazing highlights, seam convergence and termination. Compare before/after under the same rig; a passing validator cannot answer these visual questions. Keep an owner review record with blank decisions until signed.

## Recurring failure modes and evidence limits

- Separate edge strips can crack; shared topology removes that seam. Bevels clamped to half-thickness can create zero-area faces; stay below that limit.
- Analytic stitch paths can sink beneath the tessellated mesh. Project to the actual mesh, then inspect macro images. Separate cross-seam endpoints from double rows; taper ends into the seam instead of exposing cut tube ends. Numerical projection alone cannot certify craftsmanship.
- Narrow high-amplitude surface fields produce inflated, moulded-looking highlights. A material tweak cannot repair a wrong silhouette. Confirm geometry first.
- Noisy roughness data can inflate UASTC size with little visible benefit. Preserve visible grain/pores in normal maps and measure the actual final file. Do not silently raise budgets or remove important detail.
- The pinned Khronos validator cannot validate Draco/BasisU internals and emits KTX/unused-data warnings. Retain them and pair with decoder/texture/browser checks.
- CPU rendering alongside tests can cause timeouts. Retain failed logs and rerun under lower load; do not weaken assertions or report interrupted runs as passes.
- Renderer texture counts are allocations, not GPU byte measurements. Local SwiftShader load timing and mobile viewport screenshots are not real-phone performance. Configured Cycles sample limits are not measured achieved samples.

## Reuse boundary

Reuse export/finalization, provenance, material-slot validation, hash checks, review packaging and browser decoding procedures for future components. A passenger seat may reuse the upholstery methods only after checking its photographed asymmetries and its own bindings; do not mirror driver controls blindly. Steering wheels and dashboards require component-specific topology, UV layouts, scale references and material slots. Do not copy seat foam contours, perforation fields, seam routes or driver-seat camera framing onto them.

The reference candidate and review evidence are indexed in [L2A-R1 review](../review/lexus-l2a-r1-2026-10-24/README.md). The historical Mercedes gaps/gates and WebP waiver remain separate. Lexus uses KTX2 without borrowing that waiver. **L2B was authorized on 2026-10-26; stop at its review checkpoint before L3.**

## L2B demonstrated extensions — 2026-10-27

These historical commands refer to `dfa77e2`; current cockpit refinement commands are in the L2B-R1 section below.

- Use the same entrypoint with `-- --l2b passenger|wheel|dashboard`; do not invoke the default driver rebuild for this slice. See [L2B handoff](LEXUS_L2B_HANDOFF.md) for the ordered commands.
- Reflection requires position/normal X reversal, triangle winding reversal and tangent handedness reversal. Photo 29 supports outward passenger controls; hidden side differences remain unknown.
- Assemble compressed buffers without recompressing the approved driver. Tests compare decoded attributes, transforms, material factors and texture hashes; finalization also checks original Draco payload hashes. Deduplicate shared seat textures across all components.
- Triangulate authored cockpit meshes explicitly. Check finite positions, degenerate faces, closed source solids, decoded triangle areas and normals. Imported seat vertex splits and intentionally open thread ends are not evidence of a watertight mesh; keep that distinction in reports.
- Scope component budgets before authoring. Require each declared material binding, aggregate scene bounds and Draco/KTX payloads individually. Full-scene limits remain unchanged.
- New wheel/dashboard UVs use smart-projected islands and a reused non-perforated seat normal map. Coarse grain and island seams remain limitations for future directional or quilted patterns. Reprojection/UV refinement may be needed; no new pattern system was built.
- [L2B review](../review/lexus-l2b-2026-10-26/README.md) documents technical PASS separately from unscored visual fidelity, blank display and approximate cockpit placement. No hardware performance or OEM measurement claim follows from these results.

## L2B-R1 correction candidate — 2026-10-28

- [Current handoff](LEXUS_L2B_R1_HANDOFF.md) and [review pack](../review/lexus-l2b-r1-2026-10-27/README.md) supersede cockpit reproduction commands only. Both standalone seat GLBs and their assembly contents remain unchanged. R1 rejects passenger finalization.
- Closed cross-section lofts and curved profile plates replace the dashboard slab and rectangular wheel pods. Thin bevel depth is capped; profile scaling is about its centroid. Source checks and decoded gate results pass, but sharp/crumpled trim corners and simplified hub/control surfaces remain visible. Technical mesh checks do not establish surface fidelity.
- Cockpit UV repeat 4x and reduced normal strengths reuse existing KTX2; no new material slots, patterns or texture assets. Seats and review lighting remain unchanged. Finer grain may still read too smooth/plastic; no calibrated material claim.
- Missing ignored rollback copies restore from pinned `dfa77e2` Git blobs with SHA checks. Retain that commit in reproduction checkouts. Original five-asset hashes remain indexed.
- Matched before/after rendering asserts camera/lighting settings and asset/proxy/image hashes. Three dashboard review rounds are exhausted; 9.5/10 aspiration remains unestablished. Owner visual review is required before L3; no human gates close.
