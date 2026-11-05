# Realism Layers: Starting Values (tune against reference, never trust blindly)

These are starting points from the tested kit and common practice. Verify every number against the target's reference images and measurements.

| Layer | Starting values | Check |
| :--- | :--- | :--- |
| Edge bevel (interior parts) | width 0.5 to 2 mm, 3 segments, angle limit 30 to 40 degrees, weighted normals on | Edges catch a thin highlight in the render |
| Leather grain | cells about 1 to 1.5 mm (700 per metre in the kit), bump strength high (around 1.2 in the kit), distance about 0.6 to 1 mm | Visible in the material lab at the final macro distance |
| Roughness | leather 0.3 to 0.5; satin plastic 0.35 to 0.55; piano black 0.05 to 0.12; brushed metal 0.25 to 0.4; glass 0 to 0.05; carpet or fabric 0.8 to 0.95 | Vary by a noise map, not a constant |
| Stitching | thread radius about 0.75 mm, dash length about 4.5 mm, pitch about 6 mm, lifted 0.4 mm | Thread colour reads against the leather |
| Panel gaps | match the project spec (this project: 3.5 to 4.5 mm shut gaps) | Gap shows a dark line, not a flat crease |
| Lights | large soft key, very large low fill, thin rim strip; gradient environment | Soft gradients on curved surfaces; no clay look |
| Camera | 50 to 85 mm for products and interiors; shallow depth of field only in close-ups | No wide-angle distortion on hero parts |
| Exposure | adjust until the darkest and brightest materials both keep detail | Histogram, not guessing |

Note: light wattage depends on distance (inverse square). Calibrate each setup with a quick low-resolution render.
