# State — 2026-10-31

- L4A-R1 isolated refinement on `codex/l4a-r1-material-refinement`, base `6ab8525`; source/assets/tests commit `6633551`, review evidence committed separately.
- STOP for owner review. No production integration, Stage B, L5, push, PR or deployment.
- Review: `docs/review/lexus-l4ar1-2026-10-29/README.md`; six reference/render comparisons, contact sheet, unsigned `review.md`, actual evidence and hashes.
- Owner photos guide procedural maps only; no photo pixels baked. Photo source/trim/physical scale/lighting unknown; all microdimensions provisional.
- Experimental primary UV/tangents corrected: separate cushion/backrest islands, median V-scale ratio 1.2802 -> 0.999815; patterns excluded at existing seams and edges.
- Positions/topology unchanged before encoding; final Draco drift <0.05 mm, counts/winding/transforms/material factors checked. Secondary UV defects remain.
- Diamond 2,785,492 B; Perforated 2,508,036 B; each 32,412 triangles / 3 calls; both below 3.5 MB hard limit, above 2.5 MB target.
- Actual KTX2/Draco gates and Chromium156/SwiftShader tint/thread probes PASS; six matched Cycles CPU renders tied to final hashes.
- 13/13 new Python tests and 87/87 Vitest PASS; typecheck PASS; lint 0 errors / 41 existing warnings. No new production build: app/dependencies unchanged.
- Requested photographic appearance remains unmet: angular quilt highlights, broad seam bands, soft pore rims/weak grain, inherited abrupt stitch endpoints.
- Smallest proposed follow-up: local insert relief fading to seams plus separately tiled microdetail, tested within current budgets. Proposed only; needs owner direction.
- Production assembly SHA `c51e4db56faec8307eb6d6d25d88489cf212a935bafff0c2212c27abbcbc19d2`; all seven bindings and customization unchanged.
- Two visual rounds per treatment; failures/actual timing recorded in `docs/spike/cost-log.md`. Interrupted Oct29, final checks resumed Oct31.
- No phone FPS/GPU-byte measurements. Prior 13 development audit findings unresolved. Existing human gates and reference gaps remain open.
