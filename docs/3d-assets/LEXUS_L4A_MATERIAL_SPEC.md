# L4 Stage A — isolated material feasibility

Owner's 2026-10-29 attachment is the approved scope. Start `eee8f80`, existing `pre-phase-6-reconciliation` branch. Commit locally; no push/deployment. STOP for owner review before Stage B.

## Objective and boundaries

Three procedural prototypes: Classic Leather, Diamond Quilted Leather, Perforated Leather. Render actual unchanged driver-seat inserts at normal and macro distances with smooth bolsters and independently coloured perimeter thread. These are not verified workshop products. No UI/catalogue/application edit, seat rebuild, mesh/UV alteration, cockpit geometry change or production-candidate replacement. No generated images or third-party assets. Texture dimensions <=1024, existing 3.5 MB seat / 5,242,880-byte assembly hard limits unchanged.

## Actual UV findings before texture authoring

Decoded from the active combined GLB; see `docs/review/lexus-l4a-2026-10-29/evidence/uv-audit.json` and `uv-layout.png`.

- Primary cushion: 3,058 triangles, no degenerate UVs; median metres/UV U=.1604, V=.1339; p95 anisotropy 1.242.
- Primary backrest: 2,054 triangles, no degenerate UVs; median U=.1609, V=.1735; p95 anisotropy 1.269.
- Secondary bolsters/headrest/trim: 15,084 triangles, 153 UV-degenerate triangles; p95 anisotropy 83.19. Repeated/overlapping coordinates are not a unique bake atlas. Directional patterns must stay off this group.
- Passenger values match driver: reflected geometry keeps original UV coordinates. A symmetric diamond tile can reflect coherently, but directional lettering cannot be assumed correct. Cushion/backrest tile height differs about 30%; seam continuity is not established by tileability.

## Implementation / contract

Use existing decoded UVs and retain compressed geometry byte-for-byte. Write three experimental GLBs under `experiments/lexus-l4a/`, never the active public URL. Texture source/intermediates stay in ignored `blender/out/lexus-l4a/`. Source in `blender/lexus_l4_materials.py`, finalization in `scripts/finalize-lexus-l4a.mjs`; tests in `tests/`; evidence in `docs/review/lexus-l4a-2026-10-29/`.

Generate neutral base RGB, tangent normal (+Y convention), linear ORM (R=AO/G=roughness/B=metallic). Treat heights as texture relief only; no displacement or geometry changes. Approximate grain/perforation/padding scale is a prototype choice, not OEM/workshop measurement. Seed all randomness and preserve periodic boundaries.

The seven live bindings remain untouched. Classic/perforated need only maps on existing primary/secondary materials. Diamond thread cannot be recoloured independently by multiplying one baked RGB map: prototype an isolated WebGL hook mixing the existing stitching colour through a mask in the otherwise-unused ORM alpha channel. It adds no slot, texture fetch resource or geometry. Bare glTF still shows neutral grooves; independent quilt-thread colour requires this documented optional hook. The hook must restore cleanly and use a stable program key; no customer UI is introduced.

## Verification / ordered slices

1. Read-only UV/scale audit and atlas inspection; tests first for periodic fields, neutral recolourability and material replacement preservation.
2. Generate three 1024px sets plus common smooth bolster maps through headless Blender 5.2.2; encode KTX2 via installed 4.4.2; preserve Draco buffers. Reject invalid names/maps; gate each sample with existing `lexus-l2a` scope. Reuse existing negative gate tests; do not relax the manifest.
3. Isolated real-browser decode/tint/mask tests with local Draco/Basis loaders; inspect mirrored passenger using preserved source data in the harness. Record calls, triangles, texture allocations, loader time and transfer bytes; GPU bytes remain estimates and phone performance unmeasured.
4. Render six matched normal/macro images from delivered geometry and decoded KTX pixels; Blender uses the same mask mix for diamond thread. Fixed neutral lighting, maximum three review rounds. Record defects and an unsigned owner form.
5. Run targeted then full tests, typecheck/lint and one build if needed by changed runtime sources. Hash-check active asset and seven-slot application sources unchanged. Commit experiments and evidence, STATE <=20 lines. Stop before Stage B.

Commands are recorded in the final handoff alongside actual results. Style follows existing Node ESM/Python build scripts: deterministic inputs, explicit paths, finite values, subprocess timeouts and source/output hashes. New dependencies, larger budgets and Stage B require owner approval.

## Source basis

Installed `three/src/renderers/shaders/ShaderChunk/{map_fragment,roughnessmap_fragment,opaque_fragment}.glsl.js` and `three/src/materials/Material.js` inspected. [Three Material API](https://threejs.org/docs/pages/Material.html) documents WebGL shader hooks and program caching. [glTF 2.0 specification](https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html) defines colour multiplication, linear data maps and ORM channels. The extra mask is an application convention, not a standard glTF thread feature.
