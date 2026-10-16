# Feasibility Spike Plan (DRAFT: owner approves before Phase 3)

Items marked **PROPOSED** are the reviewer's suggestions, not repo facts. Change them before approving.

## 1. Purpose and non-goals
Prove, cheaply, that the planned toolchain can take two representative components from Blender to a validated GLB, into a real browser viewer, with one material swap, and that people judge the result acceptable. Non-goals: the full cabin, rigging, LOD, HDRI, UI redesign, persistence, deployment.

## 2. Target label
Everything produced is labelled **PROVISIONAL: Mercedes-Benz S-Class V223 LWB (GATE-01 open)**.

## 3. Slice
| Node | Slot | Why |
| :--- | :--- | :--- |
| `GEO_Seat_Front_Driver_Flutes` | `MAT_Upholstery_Primary` | The organic, high-risk case (quilting baked to a normal map). |
| `GEO_Stitching_Seat_Front_Driver` (PROPOSED new node) | `MAT_Stitching_Thread` (PROPOSED new slot) | Tests the thread-colour mechanism (D1). Drop from the spike if D1 is not approved, and say so. |
| `GEO_Dashboard_Screen_Central_OLED` | `MAT_Screen_Central_OLED` | The exact-dimension case (12.8 in, 1.5 mm corner radius, 0.8 mm stepped bezel). |

## 4. Budgets (PROPOSED for the spike; the full-cabin limits in the manifest are 350,000 triangles, 65 draw calls, 15 MB, 128 MB GPU)
- Triangles: seat flutes at most 30,000; stitching at most 8,000; OLED at most 5,000.
- Draw calls: at most 4. Textures: Primary 2048 px (albedo, normal, ORM); OLED 1024 px.
- File size as transferred (Draco, KTX2): at most 3 MB.
- Lighting: three.js procedural `RoomEnvironment` (no downloaded assets).

## 5. Work packages and pass criteria
| WP | Phase | Pass only if (all with pasted output) |
| :--- | :--- | :--- |
| WP0 Environment | 0 | Env report shows model and harness, Blender version, headless bpy run, `npm ci` and build, headless browser run. Gaps are listed, not hidden. |
| WP1 Foundations | 1A, 1B | Next 16 and React 19 build; Firebase removed; `typecheck`, `lint`, `test`, `build` pass; `npm audit --omit=dev` shows no critical or high issues (or each remaining one is explained). |
| WP2 Gate tool | 2 | On a synthetic fixture GLB the gate exits 0. All 6 mutations (rename node, duplicate material, scale x100, strip UVs, extra node, banned extension) exit non-zero with a specific message. Run against the REAL manifest, the gate must report the 4 undefined slots (F1). |
| WP3 Asset | 3 | Build script reruns with identical node, material and triangle counts. Gate exits 0 for the spike scope. OLED active-area diagonal is 325.1 mm plus or minus 1.0 mm (PROPOSED tolerance; the spec says EXACT without a number). Seat bounding box within 10 mm of the reference measurement, or of the spec dimension if no reference exists (PROPOSED). Draco present; KTX2 present, or a documented WebP deviation. 5 renders saved. Cost log written. |
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
