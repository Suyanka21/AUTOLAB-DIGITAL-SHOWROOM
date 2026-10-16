---
name: gltf-asset-gate
description: Automated gate proving a GLB matches the scene manifest, material contract and budgets before anyone looks at it. Use whenever a GLB is exported, changed, or claimed complete. Invoke explicitly with $gltf-asset-gate.
---

# glTF Asset Gate

## Overview
A 3D asset is "done" only when this gate exits 0 on that exact file. The gate exists because agents (and people) report completion on assets that contain stray objects, mis-bound materials or the wrong scale. The gate is built and proven BEFORE the asset it judges.

## When to Use
- Building or extending `scripts/validate-glb.mjs`.
- After any export, post-process or optimisation step.
- Before any statement that an asset "works".

## Process
1. **Source of truth.** `src/config/scene-manifest.s-class-v223.json`, validated against `docs/schemas/scene-manifest.schema.json`. First assert the manifest itself: every `materialSlot` used by a node must exist in `materialSlots` (JSON Schema cannot check this, so the gate must).
2. **Tooling.** `@gltf-transform/core` plus the Khronos `gltf-validator`. Verify the package names and pin exact versions. Output `reports/glb-report.json` and a short human summary. Exit non-zero on any failure.
3. **Assertions.**
   - Validator reports 0 errors (list warnings).
   - Node set equals the manifest nodes in scope: none missing, none extra. No `Cube`, `Camera`, `Light`, `Plane`.
   - Material names equal slot ids, no duplicates, no `.001`. Each node uses the slot the manifest names.
   - Slot properties match the manifest (metal-rough, clearcoat or normal map present as declared, texture size within budget).
   - Bounding box per node within its tolerance. Overall scale is metres.
   - Triangles per node and in total within budget. Primitive count (draw calls) within the manifest limit.
   - UVs present on textured meshes. Normal-mapped meshes have tangents or a documented reason.
   - Texture count, size and format as specified (KTX2 when required).
   - File size as transferred within the target and hard maximum; decoded texture memory estimated separately.
   - Extensions used are a subset of the allowed list. FAIL on `KHR_materials_pbrSpecularGlossiness`.
   - Animations only if declared in scope.
4. **Mutation tests (mandatory).** Programmatically corrupt a known-good GLB and prove the gate fails each time: rename a node, duplicate a material, scale by 100, strip UVs, add an extra node, add a disallowed extension. An unproven gate is not a gate.
5. **Fail loud.** Never downgrade a failure to a warning. A waiver needs an owner-approved entry in `docs/spike/waivers.md`.
6. **Record.** The report includes tool versions, the GLB sha256 and all counts.

## Common Rationalizations
| Excuse | Reality |
| :--- | :--- |
| "The validator passed, so it's fine" | The validator checks glTF syntax, not your contract. |
| "One warning is harmless" | Warnings are where mis-bindings hide. List every one. |
| "I tested it by loading it" | Loading proves nothing about names, scale or budgets. |

## Red Flags
- No mutation tests.
- A passing run with no pasted output.
- Budgets hard-coded in the script instead of read from the manifest.

## Verification
- [ ] The gate fails on an empty folder and on every mutation.
- [ ] The gate passes on the real asset with the report pasted.
- [ ] The report names the GLB sha256 it judged.
