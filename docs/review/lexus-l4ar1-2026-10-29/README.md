# L4A-R1 — reference-guided material review

**Technical checks are separate from appearance. These samples are not visually accepted.** Scale and seam containment have been corrected in isolated experimental UVs; the macro result still falls short of the supplied photographs. Production, all seven bindings and customer controls remain unchanged. STOP before Stage B.

## Open the comparisons

- [Six-view contact sheet](contact-sheet.png).
- Diamond: [full-seat context](diamond-normal-comparison.png), [macro](diamond-macro-comparison.png), [panel boundary](diamond-boundary-comparison.png).
- Perforated: [full-seat context](perforated-normal-comparison.png), [macro](perforated-macro-comparison.png), [panel boundary](perforated-boundary-comparison.png).
- Experimental GLBs: [Diamond](../../../experiments/lexus-l4ar1/diamond.glb), [Perforated](../../../experiments/lexus-l4ar1/perforated.glb).
- [Unsigned owner checklist](review.md), [validation](validation.md), [source/reference/render hashes](delivery-index.json), [implementation specification](../../3d-assets/LEXUS_L4A_R1_SPEC.md).

The left-hand photos are the exact owner-supplied files or explicitly recorded crops. No photo pixels enter a texture. Both supplied images are close-ups; there is no supplied full-seat photograph for this material comparison. Full-seat renders show how the prototype sits on the existing Lexus shape. Original photographic lighting, white balance and physical scale are unknown. All new renders share one rig and display palette; they are not calibrated colour matches to the photographs.

## Reference observations and visual assessment

| Feature | Photograph | R1 change | Still inaccurate / unresolved |
| --- | --- | --- | --- |
| Diamond proportions | Elongated rounded cells with broad convex highlights | 55 x 82 mm nominal procedural grid in physical model coordinates; same median scale across cushion/backrest | Dimensions are estimates; normal-only relief still looks embossed/graphical from some angles |
| Padding and channels | Actual raised pillows, narrow recessed stitches and shadowed creases | Stronger rounded height-derived normals, darker channels, restrained thread contrast | No real silhouette, self-shadow, compression or pore undercuts; some cells read as angular highlight patches |
| Panel termination | Quilting ends under a distinct smooth sewn border | Patterns are excluded from existing material edges, two cushion seams and arched back seam | Broad smooth bands and soft bright transitions do not reproduce the reference's folded flange; existing seam topology remains simplified |
| Grain / wrinkles | Fine irregular grain and small tension wrinkles remain visible between holes | Irregular grain, slight roughness variation and seam-adjacent wrinkle normals | Primary unique-atlas resolution blurs grain and makes the surface appear too uniform; secondary grain remains the previous smooth Classic maps |
| Perforations | Small orderly apertures, dark interiors and subtly lit edges | Rounded-square, slightly varied apertures; nominal 3.2 mm pitch, approximately .8 mm width; pattern follows revised scale | About one atlas pixel across each aperture; some holes look like filtered dots and show moire under oblique sampling |
| Pattern to bolster | Same hide family with a physical folded/stiched border | Smooth exclusion bands and untouched smooth bolster slot | Bright/soft border transitions and inherited seam endpoints are not a faithful sewn construction |

These are observations and remaining defects, not human scores or approval. In particular, the arched band in `diamond-macro.png` is visibly broad and the pore edges are soft. Round 2 reduced the regular ripple marks and tightened the pattern fade, but the quilt still reads as angular facets rather than padded leather. The boundary view also shows abrupt inherited stitch endpoints. Passing the gate does not resolve these issues; the requested photographic appearance remains unmet.

## What changed and what is preserved

Only the experimental primary insert UVs/tangents and map pixels changed. Two connected primary surfaces now occupy separate atlas islands. Physical lateral position and actual measured centre-line arc length replace the previous shared V scale. Median backrest/cushion longitudinal scale ratio changed from about **1.2802** to **0.999815**; local curvature still causes residual distortion. See [derivative measurements](evidence/uv-scale.json). The atlas has no primary degenerate UV triangles. Secondary UVs and their previously documented distortions were not redesigned.

Surface positions and topology are unchanged before encoding. Final Draco decoding introduces numerical differences up to **0.04981 mm**; vertex/triangle counts, topology/winding, node transforms and material factors match the original. See [final preservation comparison](evidence/preservation.json). This is a tolerance-based preservation claim, not binary-identical compressed geometry. The active production file remains byte-identical.

Diamond retains the existing optional `thread-mask.mjs` convention: ORM alpha supplies quilt-thread coverage and the existing thread colour controls it. Bare glTF shows relief and neutral grooves; independently coloured quilt thread needs the isolated WebGL hook. No new material slot or customer interface was introduced. A later passenger integration would need the corresponding UV correction; simply applying these atlas textures to the old passenger UVs is invalid.

## Technical and performance evidence

| Sample | Transfer bytes | Triangles | Draw calls |
| --- | ---: | ---: | ---: |
| Diamond | 2,785,492 | 32,412 | 3 |
| Perforated | 2,508,036 | 32,412 | 3 |

Both pass the existing 3.5 MB / 35k-triangle seat hard limits, and both remain above the 2.5 MB transfer target. All six images per sample are 1024px KTX2 with mipmaps and geometry is Draco-compressed. Gate warnings remain in the reports; no waiver or limit increase was introduced.

[Browser evidence](evidence/browser.json) confirms actual KTX2/Draco decoding, all three isolated seat tints remaining independent, texture identity retained, and quilt-thread-only recolouring. The application and its seven live bindings are unchanged. Browser renderer counts are measurements; texture-byte figures in the gates are estimates. No real-phone FPS, GPU-memory measurement or full-scene performance claim is made.

## Smallest proposed next correction — requires owner direction

The material experiment has reached a visible limitation of a single 1024px unique atlas plus normal-only padding. Do not increase hole size to disguise that limit or stretch another tile across the seams.

The smallest practical follow-up is **shallow displacement confined to the existing primary inserts**, fading to zero at the existing seams, together with **a separately tiled microdetail layer** for grain and pore edges. Keep the body/bolsters/stitch routes and seven slot names; first test within existing triangle, texture and transfer limits. That would change experimental insert positions and require a small material-layer extension, so neither is silently implemented here. It is a proposed additional review experiment, not Stage B authorization or a promise that the current budgets will suffice.

Owner decision: whether to authorize that bounded correction, or return specific visual adjustments within the current texture-only constraint. No human gate, catalogue offering or OEM authenticity claim is approved by this report.
