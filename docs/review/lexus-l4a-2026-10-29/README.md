# L4 Stage A — three upholstery prototypes

**Technical feasibility PASS; visual acceptance PENDING. STOP before Stage B.** The owner authorized material experiments after verifying L3 at `eee8f80`. The working showroom, its GLB, seven live bindings and four-step journey remain unchanged. These are not verified AutoLab workshop offerings or calibrated physical-hide matches.

## Downloads and comparisons

- [Six-view contact sheet](contact-sheet.png).
- [Normal-distance comparison](normal-comparison.png) and [macro comparison](macro-comparison.png).
- [Classic Leather](classic-comparison.png), [Diamond Quilted Leather](diamond-comparison.png), [Perforated Leather](perforated-comparison.png).
- Experimental GLBs: [Classic](../../../experiments/lexus-l4a/classic.glb), [Diamond](../../../experiments/lexus-l4a/diamond.glb), [Perforated](../../../experiments/lexus-l4a/perforated.glb).
- [Delivery index](delivery-index.json), [actual UV layout](uv-layout.png), [UV measurements](evidence/uv-audit.json), [integration contract](../../3d-assets/LEXUS_L4A_INTEGRATION_HANDOFF.md), [owner form](review.md), [code review](code-review.md).

Each sample uses the actual unchanged driver-seat geometry, including its insert boundary, bolsters and existing thread geometry. Full-seat context is included to expose transitions; the production candidate is not replaced. Display-only brown upholstery, dark bolsters and contrasting pale thread are identical across samples and do not change catalogue colours.

## What the samples demonstrate

| Treatment | Demonstration | Remaining limitation |
| --- | --- | --- |
| Classic | Fine irregular procedural grain, restrained roughness variation and independently recolourable perimeter stitching | Grain is subtle at showroom distance; broad highlights may still read as smooth synthetic leather. No physical-hide calibration. |
| Diamond | Coordinated normal-only padding, seam grooves and dashed quilt-thread mask; smooth bolsters | Diamond grid crosses existing curved/transverse seams, clips at panel edges and differs in apparent height between cushion/backrest. It cannot change silhouette or seam construction. |
| Perforated | Fine staggered insert depressions with variation in hole placement/radius; smooth bolsters | Repeating structure is still visible; pores are normal/colour effects, not physical holes. Distant detail is filtered by mipmaps. |

The underlying seat still has simplified shoulders/headrest and provisional seam endpoints. Classic/perforated use normal, neutral base and ORM maps directly. Diamond uses the same maps plus a small isolated WebGL colour hook reading ORM alpha. Bare glTF shows the relief and neutral seams, but separately coloured quilt thread requires that hook. See the integration contract; no application or customer-interface implementation was added.

## UV findings and continuity

Primary cushion and backrest have no zero-area UV triangles. However, median metres per UV unit are U=.1604/V=.1339 on cushion versus U=.1609/V=.1735 on backrest. A symmetric tile is feasible, while its longitudinal physical scale differs about 30%. Primary UV areas overlap, so this is not a unique baking atlas. Secondary bolsters/headrest/trim contain **153 zero-area UV triangles per seat** and severe stretching; directional quilting is kept off them.

Source fields are periodic, but tileability does not prove panel alignment. Quilt lines meet/cross pre-existing seams without upholstery cutting/sewing logic. [Mirrored passenger browser evidence](evidence/diamond-mirrored-passenger.png) uses unchanged reflected passenger geometry with the sample maps; it supplies visual evidence, not an automatic pattern-alignment pass. Directional lettering or asymmetrical motifs remain untested. No geometry or UV edit was made.

## Actual technical results

| Sample | Bytes | Triangles | Draw calls | Local loader ms |
| --- | ---: | ---: | ---: | ---: |
| Classic | 2,584,928 | 32,412 | 3 | 1428.6 |
| Diamond | 2,904,532 | 32,412 | 3 | 335.8 |
| Perforated | 2,925,708 | 32,412 | 3 | 419.9 |

All pass the unchanged **3,500,000-byte / 35k-triangle** seat hard limits. They exceed the 2.5 MB seat transfer target; no exception or raised limit was used. Actual gate reports: [Classic](evidence/classic-gate.json), [Diamond](evidence/diamond-gate.json), [Perforated](evidence/perforated-gate.json); [observed process exits](evidence/gate-browser-exits.txt). Each report pins the exact delivered SHA-256 and retains validator warnings.

Final Chromium156/Three r186/SwiftShader probe: actual Draco/KTX2 decoding, three independent material tints with map identity retained, and separate diamond-thread recolouring PASS. Hiding perimeter-stitch geometry still allows the quilt-thread colour to change rendered pixels. Decoded ORM-alpha inspection finds about **1.79% coverage above 0.1**, with zero mask on Classic/Perforated; the saved-image regression checks localization. This does not certify the artistic alignment of every stitch.

[Browser report](evidence/browser.json): zero JavaScript errors/failed requests, retained ReadPixels warnings. Each sample records 3 calls / 32,412 triangles / 9 texture allocations / 15 geometry allocations; those allocation counts include the RoomEnvironment/PMREM harness resources. Passenger comparison records 6 calls / 64,824 triangles. The first sample loads cold and later samples benefit from warmed decoders/cache, so these timings are **not a fair speed ranking**, network benchmark or phone measurement.

## Estimated integration impact — not Stage B evidence

[Calculated estimates](evidence/performance-estimate.json) retain the old normal map shared by the cockpit while replacing seat-only maps, deduplicate identical Classic maps and assume one resident treatment. Expected combined transfer is roughly **2.83 MB Classic / 4.31 MB Diamond / 4.34 MB Perforated**, before recalculating JSON overhead. These are estimates, not delivered combined files or a complete-scene gate. The unchanged 5,242,880-byte hard limit still needs validation during Stage B; Diamond/Perforated are estimated above the 3.5 MB combined target.

Estimated texture residency: four images for deduplicated Classic plus cockpit versus seven for Diamond/Perforated plus cockpit. At 8bpp block compression with full mip chains, approximately 5.59 MB / 9.79 MB; RGBA8 fallback approximately 22.37 MB / 39.15 MB. These exclude geometry, render targets, decoder working memory and environment maps. **GPU memory and real-phone FPS are NOT MEASURED.** Geometry counts do not change; the mask adds one shader texture sample/mix but no draw call or texture object. Actual frame-time impact is unmeasured.

## Verification and corrections

See [validation record](validation.md) for commands, exit codes and tests. New tests cover finite periodic maps, normal direction/unit length, invalid treatment rejection, image-buffer replacement without geometry/slot changes, hook restoration, saved-PNG orientation and decoded mask coverage. Existing gate mutation tests were retained without relaxation.

Independent review caught a real saved-image orientation bug: Blender's bottom-origin pixel storage reversed the procedural field in the PNG and disagreed with its tangent normal gradient. A saved-PNG regression failed with maximum channel error .272. Storage rows were reversed; the regression passes, and all samples/KTX payloads, gates, browser evidence and final renders were regenerated. Superseded first-round evidence stays under `evidence/round1/` and must not be used as final proof.

Initial buffer-preservation test timed out while deep-comparing megabyte Buffer objects. Native byte equality preserves the assertion and completes quickly. The first attempt to inspect decoded mask pixels assumed RGBA, but KTX extraction returned an indexed PNG; explicitly converting to RGBA fixed that inspection. No dependency/software installation or texture download occurred. Thirteen prior development audit findings remain unresolved; no new audit claim.

## Render interpretation and owner checkpoint

Final renders use decoded pixels from the delivered KTX2 GLBs, unchanged mesh/UVs, fixed 1100x1000 framing, neutral studio lights, Cycles CPU, maximum 32 samples and a 75-second tracing limit. Diamond uses the same mask-colour mix as the browser. Achieved sample counts are unavailable and may differ; only configured settings match. Render wall-clock includes setup/denoising and is not GPU performance. Actual timings and asset/proxy/PNG hashes are recorded in per-sample render reports and delivery index.

Two texture/render rounds were used: initial evidence exposed the orientation defect; final corrected set is the review candidate. No image generation/Nano Banana was used. Procedural maps are sufficient to demonstrate feasibility; their physical realism and grain/padding preferences remain for owner review. No human gate was signed, no Stage B/L5 work or production deployment began.
