# Phase 2 asset gate — 2026-10-19

Branch `phase-2-gate` starts at `a027d16`. D4 was approved as proposed by the owner on 2026-10-19 and recorded in `conflicts.md`. D1 remains undecided, so the spike scope contains only `GEO_Seat_Front_Driver_Flutes` and `GEO_Dashboard_Screen_Central_OLED`. The proposed stitching node was excluded. No S-Class geometry, Blender script, viewer, or visual acceptance was produced.

## Gate and fixture

`scripts/make-fixture.mjs` deterministically creates a two-quad GLB using glTF Transform. Its flat 2×2 normal PNG is generated in code; no third-party asset was used. The gate validates the real manifest with Ajv and a material-slot cross-reference, then checks GLB structure with Khronos glTF Validator and decoded scene data with glTF Transform. It checks scoped nodes and bindings, material parameters, UVs and tangents, extensions, bounds, OLED diagonal, and the budgets in the manifest and spike plan. The full-scope transfer target and maximum are read from the performance requirements. The JSON report records SHA-256, counts, errors, and warnings. Production mode requires Draco and KTX2 where textures exist; synthetic mode explicitly reports its PNG exception.

Exact dev dependency versions, checked against the live npm registry before installation: `@gltf-transform/core@4.5.1`, `@gltf-transform/extensions@4.5.1`, `gltf-validator@2.0.0-dev.3.10`, and `draco3dgltf@1.5.9`. [glTF Transform NodeIO](https://gltf-transform.dev/modules/core/classes/NodeIO) documents binary IO and decoder registration; [Khronos Validator's Node API](https://github.com/KhronosGroup/glTF-Validator/blob/main/node/README.md) documents `validateBytes`.

## Actual validation outputs

| Command | Result |
| --- | --- |
| `npm run validate:asset` | Exit 0. Synthetic GLB 3,080 bytes, SHA-256 `ca0e467df4861582aec34c9ddc44913702c900d039703564a5d068463889ea79`. `Asset gate PASS: 2 nodes, 4 triangles, 2 draw calls`; Khronos 0 errors and 0 warnings. Full output is in `reports/glb-report.json`. |
| `node scripts/validate-glb.mjs --manifest-only` | Exit 1. `ERROR: undefined material slots: MAT_Carpet_Floor, MAT_Console_Veneer_And_Leather, MAT_Door_Card_Substrate, MAT_Screen_Driver_Cluster`. Saved in `reports/manifest-contract-report.json`. No definitions were invented. |
| `npm run test -- --reporter=verbose` | Exit 0 outside the filesystem sandbox: 3 files and 26 tests passed. The six mutation tests each caused the validator API and CLI to fail with the expected specific message: renamed node, duplicate material, 100× scale, stripped UVs, extra node, banned extension. Eight other gate checks include deterministic fixture, Draco decode, empty GLB, OLED tolerance, textured-mesh UVs, and real-manifest failures. |
| `npm run typecheck` | Exit 0; `tsc --noEmit` printed no diagnostics. |
| `npm run lint` | Exit 0; 0 errors, 43 existing warnings. |
| `npm run build` | Exit 0; Next 16.4.2 compiled in 5.5 s, TypeScript finished in 9.6 s, 6 pages generated. Application source did not change afterward. |
| `npm run test:e2e` | Exit 0 outside the filesystem sandbox; Chromium 2 passed in 14.1 s. |

Test-first evidence: the initial targeted Vitest run failed because `scripts/make-fixture.mjs` did not exist. Later red runs exposed missing OLED tolerance, CLI report argument handling, UV enforcement, and Draco decoder support before those checks passed. A final ordinary sandboxed Vitest invocation failed before tests with esbuild `Cannot read directory "../../..": Access is denied`; the same full suite passed outside the sandbox. No dependency reinstall was used to address that environment limit.

The passing synthetic report warns that Khronos Validator reports `KHR_draco_mesh_compression` as an unsupported extension at informational severity and two unused buffer views, while recording zero errors and zero warnings. glTF Transform did decode the compressed mesh and the gate inspected its geometry. This does not prove production KTX2 transcoding, mobile texture tier, low-LOD loading, actual S-Class geometry, seat reference bounds, or visual fidelity. The spike plan's OLED tolerance and node budgets remain proposed until the plan is approved; D4 budget semantics alone are approved. The GPU number is a conservative texture estimate, not a renderer measurement. File-size limits use decimal MB for D4/spike transfer budgets.

Live audits after dependency installation: production `npm audit --omit=dev --json` reported **0** vulnerabilities; full `npm audit --json` reported **13** (6 moderate, 7 high). The 13 development-dependency findings are unresolved; no unrelated upgrades or audit fixes were made.

## Phase 3 handoff

The Phase 2 validator is proven on synthetic input and deliberately rejects the current full manifest. Phase 3 remains gated by D1, D10, and spike-plan approval, in addition to missing Blender and `toktx` noted in Phase 0. No human gate was signed.
