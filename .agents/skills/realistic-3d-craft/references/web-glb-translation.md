# Translating a Realistic Model to the Web (GLB)

Tested in this kit on Blender 5.0.1: exporting a fluted leather panel with explicit arguments worked with no skipped arguments, and Draco reduced a dense 2.8 MB export to about 157 KB. NOT tested here: baking, KTX2, or viewing in a browser.

- **Procedural shaders do not export.** Bake albedo, normal and an ORM map (R=AO, G=roughness, B=metallic), or reduce to Principled BSDF inputs.
- **Surviving material features:** base colour, metallic, roughness, normal, emission, plus glTF extensions for clearcoat, sheen, specular, ior, anisotropy and emissive strength. Verify the viewer's loader supports each one.
- **Detail budget:** high-poly surface detail (flutes, quilting, grain) becomes a tangent-space normal map on a low-poly mesh. Bake selected-to-active with a cage; check seams and UV padding.
- **Export:** use `export_glb` in craft_kit (introspects real argument names). Selected objects only, Y-up, modifiers applied, cameras and lights off.
- **Compression:** Draco for geometry from the exporter. KTX2 textures are a post-export step (gltf-transform with `toktx`); Blender does not write KTX2.
- **Always** run the project's asset gate after export; the viewer must show the same look, not just load.
