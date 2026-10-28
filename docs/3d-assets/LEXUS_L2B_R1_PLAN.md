# Lexus L2B-R1 — visual correction contract

Owner attachment received 2026-10-27 authorizes dashboard, wheel, composition and material refinement; commit/push to `pre-phase-6-reconciliation`, then stop before L3. The attachment is the scope and acceptance specification. A 9.5/10 presentation is an aspiration, never an agent-assigned score.

## Five discrepancies ranked before modeling

| Rank | Discrepancy / source evidence | Impact | Expected correction cost | Correction |
| --- | --- | --- | --- | --- |
| 1 | L2B dashboard is a thin flat slab with blunt ends; dealer 29/33 shows a rolled passenger brow and shaped fascia flowing into the centre surround | Very high | High | Continuous cross-section loft with tapered returns and controlled asymmetric fascia, not a smoothing modifier on the old block |
| 2 | Display plinth and vent/clock assembly read as stacked rectangles; dealer 35 shows a shallow recessed screen tray, rounded/tapered housing and a clock divider between recessed vents | Very high | Medium | Integrate tray into deck profile; rounded housing, inset glass, framed paired vents, smaller clock |
| 3 | Wheel has rectangular crossbar pods, oversized circular hub and squared lower spoke; dealer 33 shows curved wedge pods, a tapered shield and flared satin lower spoke | High | Medium-high | Curved control outlines, shield profiles and smoothly widening spoke transitions; retain non-F-SPORT round rim |
| 4 | Cowl is a half-cylinder with a flat exposed back; dealer 33 shows a deep sloped hood, rounded corners and recessed twin instrument faces | High | Medium | Closed lofted hood with shaped lip and recessed instrument enclosure; improve depth/relative wheel alignment |
| 5 | Cockpit grain is visibly coarse and generic; leather, plastic and metal highlights read similarly in L2B | Medium-high | Low-medium | Reduce cockpit normal strength and increase tile density; preserve seven semantic slots and existing roughness contract, inspect under the unchanged comparison rig |

Dealer photos 29/33/35 and wide cockpit 07 are primary. Seat geometry and materials remain byte-preserved in standalone assets and preserved inside assembly. Existing left-hand-drive placement remains; any cockpit translation/tilt changes are estimates and will be listed. No hidden full cabin to fill empty space.

## Supplementary source consultation

- Official brochure URL located: https://www.lexus.com/content/dam/lexus/documents/brochures/models/2020/MY20-Lexus-RX-RXh-Brochure.pdf — fetch returned 403 twice; no dimensional claims derived from it.
- Official photo album: https://pressroom.lexus.com/album/2020-lexus-rx-350/ — page accessible, many listed images explicitly F SPORT. Attempted image fetch returned cache miss. Not a source of alternate wheel/trim details.
- https://www.edmunds.com/lexus/rx-350/2020/pictures/ — accessible listing distinguishes standard and F SPORT images; full-dash image fetches failed. Supplementary listing only, not viewed photographic evidence.
- https://www.thecarconnection.com/news/1127370_review-update-the-2020-lexus-rx-350-awd-still-answers-the-call — page accessible, mixed RX/RXL captions; selected image fetch failed. No trim substitution or physical measurements inferred.
- No supplementary media downloaded or embedded. Original reference pack manifest records direct dealer image URLs and SHA-256s. No reference provides calibrated physical dimensions or a measured upholstery roughness value.

## Ordered work / checks

1. Pin rollback to `dfa77e2`; copy four L2B assets/reports to ignored `blender/out/lexus-l2b-r1/baseline/`, with hashes. Confirm remote ancestry.
2. Keep existing proven gate and unchanged budgets: dashboard 8k, wheel 7k, combined 80k triangles. Re-run targeted contracts before authoring. Extend preservation assertions to the passenger.
3. Correct dashboard first, wheel second through `tools/build-lexus-asset.py -- --l2b <stage>`, its existing Blender implementation and named constants. Export real geometry, finalize Draco/KTX2, gate each component. Existing seats are inputs, not rebuilt.
4. Check assembly spacing and material response in inexpensive browser previews; at most three correction/render rounds per zone. Do not repeatedly render the full scene during geometry work.
5. Final actual gates, browser decoding/tints/renderer counters, one full suite/typecheck/lint/build. Render final components and combined views with the original L2B comparison cameras/lighting; make three before/after sheets and an ignored local dealer-reference sheet.
6. Document approximations, counts, actual timings, failures, source hashes and blank human review; update STATE <=20 lines, atomic commits and normal push. Stop before L3.

## Boundaries / success evidence

Names, seven slots, local Draco/KTX loaders, independent tint behavior and hard budgets remain enforced. No new dependency, app/UI, production, pattern system, seat remodel or gate closure. Existing driver/passenger hash and decoded preservation tests protect approved seats. New cockpit source must report finite geometry, no degenerate source faces and closed solids. Actual delivered GLB gate exit 0 and browser decoding are technical completion requirements. Visual acceptance remains owner-only; no physical-phone/GPU-memory measurements will be invented.
