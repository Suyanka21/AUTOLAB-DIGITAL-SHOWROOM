# L4A-R1 — reference-guided material refinement

Owner request authorizes isolated Diamond and Perforated refinement, not Stage B. Base `6ab8525`; branch `codex/l4a-r1-material-refinement`. Preserve `src/`, `public/`, dependencies, seven live bindings, all vertex positions and existing seam geometry. New UVs and texture maps belong only to experimental copies.

## Reference observations before implementation

Owner files: `C:/Users/user/Downloads/Diamond Quilting.jfif` and `Perforated Leather.jfif`. Photographs are visual evidence, never texture inputs. Attribution, hide type, physical dimensions and lighting calibration are unknown; do not claim Lexus/OEM identity or physical measurements.

- Diamond photograph: vertically elongated, rounded pillows; broad convex highlights, deep narrow channels with restrained thread; fine perforations and irregular grain within each pillow. Quilt is contained by a separate smooth stitched side strip. Tiny creases gather toward channels. Existing prototype has nearly flat cells, bright hairline grid, generic broad highlights and grid lines crossing actual transverse/arched seams.
- Perforated photograph: orderly small rounded-square apertures with dark interiors and subtly lit lips; hole diameter appreciably smaller than pitch; irregular fine grain between holes; a smooth folded border with raised thread. Existing prototype uses low-contrast circular dots, almost invisible grain, stretched rows and no intentional seam exclusion zone.
- Both photos are close-ups, not full-seat reference photographs. Full-seat renders are context only. Render lighting can match between candidates; original photographic lighting cannot be reconstructed or certified as matched.

## Smallest practical correction

Reparameterize only primary insert UVs in experimental GLBs. Separate actual cushion/backrest connected surfaces into nonoverlapping atlas islands; use physical lateral position and measured centre-line arc distance for consistent longitudinal scale. Keep secondary UVs unchanged. Author smooth exclusion bands at material boundaries and existing cushion transverse/backrest arched seams. Padding fades into those bands. No vertex displacement or upholstery reconstruction.

1024px hard texture limit remains. Two unique islands reduce microdetail texel density versus the old overlapping tile. Use antialiased procedural fields; do not enlarge holes to hide aliasing. Record any unresolved close-up detail limits. Normal relief cannot produce actual pillow silhouette or pore undercuts; if inadequate, propose a separately approved local insert displacement/detail-map extension rather than silently remodeling.

## Implementation and verification

1. Test atlas scale/seam suppression and neutral recolourable fields before implementation; retain existing gate mutation tests.
2. `node tools/prepare-lexus-l4ar1.mjs`: decode original seat, record measured panel mapping and UV-only experimental geometry.
3. Blender 5.2.2 headless `--python blender/lexus_l4ar1_materials.py`: deterministic atlas fields and maps to ignored `blender/out/lexus-l4ar1/`.
4. `node scripts/finalize-lexus-l4ar1.mjs`: KTX2/Draco samples in `experiments/lexus-l4ar1/`; compare original vertex positions/counts/material bindings and run unchanged `lexus-l2a` gate.
5. Render full seat, macro and panel boundary for both treatments with the same cameras/lights/settings. Decode actual KTX maps for Blender. Browser-check tint/texture preservation with existing optional quilt-thread hook.
6. Package original-reference-versus-render comparisons, defect list, hashes, costs, estimates and unsigned owner form. No human scores. At most three render-review rounds per treatment.

Use existing Python/NumPy, NodeIO and test conventions (`assert`, finite arrays, explicit unknown-kind rejection). No new dependencies, downloads, generated photo textures, new UI, production integration or catalogue changes. Run focused Python tests, existing gate tests, full Vitest/typecheck/lint once after final changes; production build only if application-relevant files change. Commit bounded slices locally, update STATE <=20 lines, stop for owner review.
