# Feasibility Spike Plan (Phase 3 two-node scope approved by owner, 2026-10-20)

Approval is for a feasibility spike only, limited to the two nodes in section 3. Working dimensions and estimates are not manufacturer-verified geometry. GAP-01 through GAP-04, GATE-01, GATE-08, and GATE-11 remain open; this is not visual or production acceptance. Later-phase rubric and decision thresholds marked **PROPOSED** still require review before use.

## 1. Purpose and non-goals
Prove, cheaply, that the planned toolchain can take two representative components from Blender to a validated GLB, into a real browser viewer, with one material swap, and that people judge the result acceptable. Non-goals: the full cabin, rigging, LOD, HDRI, UI redesign, persistence, deployment.

## 2. Target label
Everything produced is labelled **PROVISIONAL: Mercedes-Benz S-Class V223 LWB (GATE-01 open)**.

## 3. Slice
| Node | Slot | Why |
| :--- | :--- | :--- |
| `GEO_Seat_Front_Driver_Flutes` | `MAT_Upholstery_Primary` | The organic, high-risk case (quilting baked to a normal map). |
| `GEO_Dashboard_Screen_Central_OLED` | `MAT_Screen_Central_OLED` | The exact-dimension case (12.8 in, 1.5 mm corner radius, 0.8 mm stepped bezel). |

D1 remains undecided. `GEO_Stitching_Seat_Front_Driver` and `MAT_Stitching_Thread` are excluded; do not add them to the spike.

## 4. Budgets (approved feasibility limits; the full-cabin limits in the manifest are 350,000 triangles, 65 draw calls, 15 MB, 128 MB GPU)
- Triangles: seat flutes at most 30,000; OLED at most 5,000.
- Draw calls: at most 4. Textures: Primary 2048 px (albedo, normal, ORM); OLED 1024 px.
- File size as transferred (Draco, KTX2 or the documented feasibility-only WebP deviation): at most 3 MB. Missing `toktx` permits WebP for this spike only; it does not establish KTX2 production compliance.
- Lighting: three.js procedural `RoomEnvironment` (no downloaded assets).

For D10, use available manufacturer and reputable published visual references. Astra may conduct targeted web research for missing visual views during the spike. Record each source URL and distinguish verified information from estimates in the provenance and review evidence. Keep GAP-01 through GAP-04 open until physical reference capture resolves them.

## 5. Work packages and pass criteria
| WP | Phase | Pass only if (all with pasted output) |
| :--- | :--- | :--- |
| WP0 Environment | 0 | Env report shows model and harness, Blender version, headless bpy run, `npm ci` and build, headless browser run. Gaps are listed, not hidden. |
| WP1 Foundations | 1A, 1B | Next 16 and React 19 build; Firebase removed; `typecheck`, `lint`, `test`, `build` pass; `npm audit --omit=dev` shows no critical or high issues (or each remaining one is explained). |
| WP2 Gate tool | 2 | On a synthetic fixture GLB the gate exits 0. All 6 mutations (rename node, duplicate material, scale x100, strip UVs, extra node, banned extension) exit non-zero with a specific message. Run against the REAL manifest, the gate must report the 4 undefined slots (F1). |
| WP3 Asset | 3 | Build script reruns with identical node, material and triangle counts. Gate exits 0 for the spike scope. OLED active-area diagonal is 325.1 mm plus or minus 1.0 mm (feasibility tolerance; the spec says EXACT without a number). Seat bounding box within 10 mm of a verified reference measurement, if available; otherwise label its dimensions provisional and do not claim a measured fit. Draco present; KTX2 present, or a documented feasibility-only WebP deviation. 5 renders saved. Cost log written. |
| WP4 Viewer | 4 | Playwright: swatch click changes only the bound slot's material; the test FAILS when the binding is deliberately broken; GLB 404, WebGL-unavailable and forced context-loss fallbacks pass. `renderer.info` reported against the spike budgets. The owner records a real mid-range phone check. |
| WP5 Review | 5 | At least 2 humans score the rubric (owner plus an AutoLab person; ideally one independent 3D artist). |

## 6. Rubric thresholds (PROPOSED: fix these BEFORE anyone sees the renders)
7 criteria scored 0 to 3 (recognisability, proportion, surface quality, shading artifacts, material plausibility, detail legibility, luxury impression). Pass: no criterion scored 0 by any reviewer, and the mean total is at least 14 of 21.

## 7. Decision rule (recorded in `docs/spike/decision.md`)
- **GO:** WP2 to WP5 pass for both the seat and the OLED, and the cost log shows the spike fitted comfortably in the owner's plan allowance.
- **HYBRID:** the OLED passes but the seat fails the rubric, or the seat hits its iteration cap. The next step is a human artist or a licensed asset for seats only (licence text read first).
- **NO-GO:** the environment gate fails, both components fail, or tool failures persist after the iteration caps. The next step is a human artist for the whole asset.

## 8. Not in the spike
Secondary slot and composition tiers (the bolster node is not in the manifest), rigs and kinematics (D8), LOD, HDRI, persistence, UI redesign.

## 9. Owner usage log
| Phase | Plus usage % at start | at end | Notes |
| :--- | :--- | :--- | :--- |
