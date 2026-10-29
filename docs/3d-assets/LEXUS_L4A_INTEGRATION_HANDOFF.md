# L4 Stage A material handoff — awaiting owner approval

## Current boundary

L3 at `eee8f80` is owner-verified per the L4 attachment. Stage A creates isolated experiments under `experiments/lexus-l4a/`. The working combined GLB and application are unchanged. **No Stage B implementation is authorized until the owner reviews the three samples.** No new catalogue offering, physical-hide match or production acceptance is asserted.

Review: [L4A pack](../review/lexus-l4a-2026-10-29/README.md). Original contracts and audit: [material specification](LEXUS_L4A_MATERIAL_SPEC.md).

## Samples and exact preservation

`classic.glb`, `diamond.glb`, `perforated.glb` contain the same driver-seat nodes, 32,412 triangles, three primitives and material names as the provisional seat. Only named image buffer payloads change. Draco geometry, indices, tangents, UVs, vertex colours, node transforms, slot factors and bindings remain exact. Both active standalone seats and the active six-node/seven-slot assembly are unchanged.

The entire seat is included to reveal insert/bolster boundaries; these files are experimental review samples, not replacements for the configured showroom URL. The isolated browser harness temporarily pairs a passenger with the sample maps for mirrored-pattern inspection only. It does not write a passenger or combined material asset.

## Recommended integration contract — proposal, not Stage B approval

After owner selection, use a small texture-set switch on existing shared `MAT_Seat_Primary` and `MAT_Seat_Secondary` instances. Keep the seven colour controls and four-step journey. Antigravity may add a treatment selector only under separately approved integration work; no new selector is supplied here.

Suggested input is `{ treatment: 'classic' | 'diamond' | 'perforated' }`, initially absent so existing L3 behaviour remains the default. Load one selected treatment, validate its maps, then atomically replace `map`, `normalMap`, `roughnessMap`, `metalnessMap` and `aoMap`; preserve material colour factors and names. Retain the preceding valid set on a loading failure. Dispose only textures owned by the previous treatment when no longer referenced; protect cached/shared materials and late async loads. Invalidate the demand-rendered canvas after changes. Full lifecycle, failure/restore, actual UI interaction and device checks belong to Stage B.

Classic uses the same neutral leather field on insert and bolsters. Diamond and Perforated replace only the primary field; their secondary field stays smooth Classic. Source maps are 1024px; base is neutral sRGB, normal/ORM linear. ORM RGB keeps AO/roughness/metallic semantics. The existing .48 roughness factor remains, multiplied by the map's restrained variation. No fixed upholstery colour is baked into RGB.

### Diamond thread

In the isolated prototype, `experiments/lexus-l4a/thread-mask.mjs` reads linear ORM **alpha** as quilt-thread coverage and mixes the existing `MAT_Seat_Stitching.color` into primary diffuse colour. This is an application convention, not a glTF extension. It adds no material slot, geometry or texture object, but does add one shader sample/mix. It uses Three r186 WebGL `onBeforeCompile`, a custom program key and a restoration callback. It is not automatically compatible with WebGPU/node materials or future shader chunks.

Plain glTF without the hook still shows quilt relief and neutral seam shading; it does **not** display separately coloured quilt thread. Perimeter stitching remains its existing independent geometry. Install the hook only for Diamond, bind it to the existing thread `Color` object, update that colour normally, and restore the hook before selecting another treatment or disposing the model. Do not replace the thread colour object without rebinding. The colour mix is demonstrated; roughness still follows the leather ORM instead of a separately calibrated fibre BRDF.

Important shared-resource constraint: L2B cockpit materials share the old `lexus-bolster-normal` texture. Do not modify that shared texture's pixels in place or dispose it when changing seat treatments. Assign new seat texture objects and retain the cockpit's original image. Estimated complete-scene budgets in the review pack explicitly retain it. Stage B must gate the actual complete artifact/workflow; these estimates do not approve it.

## UV and visual limitations

Actual primary UVs are usable for a tile prototype, but not uniform in physical scale. A nominal 40 mm diamond spans about 40 mm laterally, 33.5 mm longitudinally on the cushion and 43.4 mm on the backrest at median local scale. The 2.5 mm nominal perforation pitch is similarly compressed/stretched. These are calculations on a provisional model, not vehicle measurements.

Existing primary UV areas overlap across cushion/backrest. Tile boundaries wrap periodically, but panel boundaries, the curved existing seam and transverse cushion seams do not align with the diamond grid. The pattern is clipped by the existing material boundary and can meet perimeter stitches awkwardly. No pattern-continuity pass is claimed. Both seats retain the same UVs under geometric reflection; the symmetric diamond is suitable for a mirror demonstration, while lettering/directional textures would need separate review.

Secondary UVs include 153 zero-area triangles and severe stretching on returns/trim. Keep directional patterns off them. Subtle non-directional grain can still smear on those surfaces; no UV fix or seat remodeling was authorized. Padding is normal-only relief; silhouettes remain unchanged. Perforations are shallow normal/colour depressions, not holes through the leather. All prototype scale/depth/roughness choices remain uncalibrated to a physical hide.

## Reproduction

Use installed Blender 5.2.2, embedded Python 3.13.13/NumPy, Node22.23.2, KTX-Software4.4.2 and local Python3.12/Pillow/NumPy. No downloads or installs are required. Run sequentially; avoid full tests during CPU renders.

```powershell
node tools/inspect-lexus-l4-uv.mjs
& 'C:\Program Files\Blender Foundation\Blender 5.2\blender.exe' -b --factory-startup --python-exit-code 1 --python tests/test_lexus_l4_materials.py
& 'C:\Program Files\Blender Foundation\Blender 5.2\blender.exe' -b --factory-startup --python-exit-code 1 --python blender/lexus_l4_materials.py
node scripts/finalize-lexus-l4a.mjs
C:\Python312\python.exe tests/test_lexus_l4_saved_images.py
foreach ($sample in @('classic','diamond','perforated')) {
  node scripts/validate-glb.mjs --scope lexus-l2a --asset "experiments/lexus-l4a/$sample.glb" --report "docs/review/lexus-l4a-2026-10-29/evidence/$sample-gate.json"
  if ($LASTEXITCODE -ne 0) { throw "Asset gate failed: $sample" }
}
node tools/verify-lexus-l4a.mjs
foreach ($sample in @('classic','diamond','perforated')) {
  & 'C:\Program Files\Blender Foundation\Blender 5.2\blender.exe' -b --factory-startup --python-exit-code 1 --python blender/render_lexus_l4a.py -- $sample
  if ($LASTEXITCODE -ne 0) { throw "Render failed: $sample" }
}
C:\Python312\python.exe tools/package-lexus-l4a-review.py
npm test -- --maxWorkers=1
npm run typecheck
npm run lint
```

Blender saves bottom-origin pixels; the material builder explicitly reverses storage rows to match glTF/PNG top-origin UV sampling. The saved-image regression compares actual PNG channels against the mathematical field, and decoded KTX alpha is checked separately. Do not remove this conversion. Regenerate map sets together so normal, roughness, base and mask remain coordinated.

## Nano Banana

No image generation used or requested. Procedural materials demonstrate the three treatments and independent recolouring without external texture assets. Owner review should first assess grain strength, padding and stitch scale. A future physical hide photograph with a scale reference and neutral lighting would support calibration; generated pixels alone cannot establish workshop authenticity or repair the existing UV distortion.

STOP for Stage A owner review. Legacy unsigned human gates/reference gaps remain open; no Mercedes WebP waiver is applied to Lexus.
