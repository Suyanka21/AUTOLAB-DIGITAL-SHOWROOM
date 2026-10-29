# L4A bounded code review

An independent read-only GPT Sol review was used under the code-review skill. It did not score or approve material appearance.

## Required correction resolved

Blender saves its pixel buffer bottom-first, whereas the glTF image coordinate convention uses the top row at V=0. Procedural arrays were initially saved in the opposite row order, leaving normal gradients inconsistent with the saved height/mask pattern. Actual PNG samples reproduced the reversal. A saved-image test failed before the fix; reversing storage rows fixes the source PNG regression. All nine KTX2 maps and three experimental GLBs were regenerated, then gates/browser checks rerun. Final renders use the corrected assets. Old evidence is retained explicitly as superseded.

## Verification strengthened / limits retained

- Browser tint checks now assert texture-object identity, not merely compressed texture type.
- Decoded KTX ORM alpha is tested for localized diamond coverage and absence on plain treatments. The browser also demonstrates a thread-colour pixel change with the separate stitching mesh hidden. These tests do not approve seam placement.
- Mirrored passenger screenshot and counts are visual evidence only; pattern alignment is left to owner review.
- Renders share configured cameras/lights/sample caps, but the time limit means achieved sample counts are unknown and may vary. Documentation explicitly avoids claiming identical achieved samples.
- Experimental image replacement retains exact original compressed geometry, UV/accessor metadata, material definitions and transforms; no active asset or application source is overwritten.
- The optional shader hook is isolated and reversible. It is pinned to the existing WebGL shader structure and requires Stage B lifecycle/error-state/device testing before application use.

No remaining critical code issue identified in the bounded review. Existing visual/UV defects and unmeasured device performance remain open, and no human gate closes.
