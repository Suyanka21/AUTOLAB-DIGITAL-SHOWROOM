---
name: blender-asset-pipeline
description: Author and export the AutoLab interior asset with Blender headlessly (bpy) in a reproducible, validated way. Use for Blender modelling, UVs, baking, material slots, rigging or GLB export. Invoke explicitly with $blender-asset-pipeline.
---

# Blender Asset Pipeline

## Overview
One script is the source of truth. A `.blend` file is an output, never the record of work. The asset must match `src/config/scene-manifest.s-class-v223.json` exactly, and every claim about it is proven by `gltf-asset-gate`, not by looking at a Blender viewport.

## When to Use
- Any modelling, UV, bake, material or export work for the S-Class interior.
- NOT for UI work, viewer code, or visual sign-off (use `webgl-viewer-engineering` and `visual-fidelity-review`).

## Process
1. **Preconditions.** Read the env report (`docs/spike/env-report.md`). Record the exact Blender version in the script header and the build log. If Blender cannot run headless, STOP.
2. **Single build script.** `blender/build_<scope>.py`, run as `blender -b --factory-startup --python blender/build_<scope>.py`. It must be deterministic (seed any randomness), idempotent (start by deleting default objects), and write only to `blender/out/`. Dimensions come from named constants in one file (`blender/constants.py`) traced to the spec, never magic numbers.
3. **Naming contract.** Node and material names equal the manifest identifiers exactly. Any `.001` suffix, `Cube`, `Camera`, `Light` or unnamed object is a defect. Apply all transforms (scale 1, rotation applied). Metric units, scale 1.0.
4. **Modelling rules.** Hard surfaces are built from parametric functions. Seats: a clean low-poly body plus a high-poly quilting or flute detail that is BAKED to a tangent-space normal map. Never model stitches as geometry unless the plan says so. Stay inside the per-component triangle budget in `docs/spike/plan.md`.
5. **Materials.** Principled BSDF only, one material per manifest slot, named exactly as the slot. No procedural node graphs in the export: bake to images. Pack ORM as R=AO, G=roughness, B=metallic. Colour textures are sRGB; normal and ORM are non-colour. Thread colour uses its own slot if decision D1 is approved.
6. **UVs.** Channel 0 non-overlapping for anything baked. Match the texel density in the material specification.
7. **Export.** Use `bpy.ops.export_scene.gltf` with explicit arguments: GLB, selected objects only, active scene only, Y-up, modifiers applied, cameras and lights off unless the plan says otherwise, extras on, Draco on with the quantization from the performance document. Parameter names change between Blender versions: before writing the call, list the real ones with `bpy.ops.export_scene.gltf.get_rna_type().properties.keys()` and cite the Blender manual page you used.
8. **Post-process outside Blender.** Blender does not write KTX2. Use gltf-transform with KTX-Software `toktx` for KTX2, then `prune` and `dedup`, then RE-VALIDATE. If `toktx` is missing, STOP and report; WebP fallback is allowed only as a recorded, owner-approved deviation.
9. **Provenance.** Append every node to `docs/3d-assets/provenance.json`: node id, spec rows used, owner-approved reference files used, tool versions, script commit hash. No internet-sourced references.
10. **Hand off.** Run `gltf-asset-gate`, paste real output, then run `visual-fidelity-review`. Never self-certify.

## Common Rationalizations
| Excuse | Reality |
| :--- | :--- |
| "It looks right in Blender" | Procedural shaders and viewport effects do not export. Only the GLB counts. |
| "I'll rename the nodes later" | Mis-named nodes silently break material binding. Name at creation. |
| "A quick manual fix in the GUI" | A fix not in the script vanishes on the next build. |
| "Dimensions are close enough" | The manifest has tolerances. Measure the exported GLB, not the scene. |

## Red Flags
- A `.blend` is committed without the script that makes it.
- Textures or models downloaded from the internet.
- Node graphs or `.001` names in the export.
- Three or more failed attempts on one step with no report.

## Verification
- [ ] Running the script twice from a clean state gives the same node, material and triangle counts.
- [ ] `gltf-asset-gate` exits 0, with its JSON report pasted.
- [ ] Every node has a provenance entry.
- [ ] Deviations from spec are listed, not hidden.
