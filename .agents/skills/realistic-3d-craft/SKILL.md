---
name: realistic-3d-craft
description: Method for building 3D models that read as real, not as CG, using Blender (bpy) and an agent feedback loop. Use for any modelling, material, lighting or look-dev task where realism matters, on any project. Invoke explicitly with $realistic-3d-craft.
---

# Realistic 3D Craft

## Overview
Realism is not "more reference photos". It is a stack of small, specific layers that agents skip by default. In a controlled test (same panel, camera and resolution), the same fluted leather panel went from hard-edged boxes with flat colour to a pillowed, stitched, piped, grained surface by applying the layers below. Photoreal output also needs the look-dev and review loop in this skill, and a human eye at the end.

Load `references/` files only when a step names them. Helper code is in `scripts/craft_kit.py` (tested on Blender 5.0.1). Worked examples are in `examples/`.

## When to Use
- Any model where a viewer will judge "does this look real?" (interiors, products, props, furniture).
- NOT for pure UI work, or as a substitute for project rules (use the project's own asset-pipeline skill for naming and export contracts).

## The Six Realism Layers (check each, in this order)
1. **Silhouette and proportion.** Build a coarse massing first from measured constants. Never detail wrong proportions.
2. **Edges.** Nothing real has a perfect edge. Bevel every visible edge (`bevel_and_smooth`), use weighted normals, smooth shading.
3. **Surface micro-detail at true scale.** Grain, weave, brush marks, seams. Size them in metres from reference. If a detail is under about 2 pixels at the final camera distance it will not show; either bring it forward in a macro view or exaggerate it slightly.
4. **Material response.** Never a flat colour. Vary roughness, add tone variation, sheen where fabrics and leather need it. Use the SAME material on piping, welts and neighbouring leather parts.
5. **Light and environment.** Big soft sources, a gradient environment so surfaces have something to reflect, exposure set by the image not by guessing, filmic tone mapping. A flat black world makes everything look like clay.
6. **Human imperfection, sparingly.** Slight asymmetry, tolerance gaps, soft creases, a hint of wear. Too much looks dirty; none looks sterile.

## Process
1. **State the target.** List what must be ACCURATE (measured, from evidence) and what only needs to be PLAUSIBLE. Record both. Never invent accurate-looking details you have no evidence for.
2. **Massing pass.** Blockout all parts at 20% detail with correct proportions and layout. Review coherence before adding detail.
3. **Material lab first.** Render each hero material on a small plane with `material_lab` (seconds) until its grain, sheen and roughness breakup are visible. Only then use it in a scene. Build materials after any scene reset; resetting deletes them.
4. **Build with the layers** using `references/automotive-interior-recipes.md` for parameters.
5. **Review loop (max 3 rounds per zone).** Render fixed cameras; run `scripts/compare_to_reference.py` against the matching reference; write a defect list; fix the top 3 defects only; re-render. Read `references/agent-feedback-loop.md`.
6. **Translate for delivery.** If the target is real time or web, read `references/web-glb-translation.md` before finishing: procedural shaders do not export.
7. **Human gate.** Agents list defects; people judge realism. Never write "photorealistic" yourself.

## Common Rationalizations
| Excuse | Reality |
| :--- | :--- |
| "I need more reference photos" | Photos fix proportions, not missing bevels, grain, light or material response. |
| "The colour matches the photo" | Colour is the cheapest layer. Realism lives in edges, micro-detail and light. |
| "It renders fine at low samples" | Denoising and low resolution hide or erase fine detail. Check at the final size. |
| "I will add the detail later" | Detail added late often means rebuilding. Settle massing first. |

## Red Flags
- Any hard 90 degree edge on a visible part.
- A single flat colour or default roughness on a hero surface.
- A world with no reflections, or one light for the whole scene.
- Details modelled to guessed sizes with no evidence.
- More than 3 review rounds without a clear improvement.

## Verified Lessons (from testing this kit)
- The 3D Voronoi node has no `W` input; setting it throws.
- `reset_scene()` deletes materials created before it.
- Lab and scene lights are not interchangeable: intensity falls with distance squared, so close-ups need far lower wattage.
- Grain only appeared once cells were about 1.4 mm and bump strength was high; the first defaults produced a flat surface.
- A single CPU core renders about a minute per small frame; plan iteration counts accordingly.

## Verification
- [ ] Each of the six layers was checked and noted.
- [ ] Hero materials were proven in the material lab.
- [ ] Review rounds, defect lists and comparison reports are saved.
- [ ] No realism claim was made without human review.
