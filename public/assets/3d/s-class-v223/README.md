# AutoLab 3D Asset Dropzone: Mercedes-Benz S-Class (V223)

This directory is designated for real-time 3D models produced by Astra.

## Required Assets
- `interior.glb`: Master production asset (Draco compressed, KTX2 textures, quad-dominant optimized mesh).
- `interior_low.glb`: Optional low-LOD asset for low-end mobile devices and fast initial render.
- `scene-manifest.json`: Exported node mapping and material slot validation report.

## Target Hierarchy
See `docs/3d-assets/s-class-3d-specification.md` and `docs/schemas/scene-manifest.schema.json` for exact naming, node hierarchy, and polygon/texture budgets.
