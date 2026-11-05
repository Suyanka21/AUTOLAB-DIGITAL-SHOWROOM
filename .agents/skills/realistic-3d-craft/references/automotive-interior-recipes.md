# Automotive Interior Recipes (using craft_kit)

All values are starting points. Verify against reference.

- **Leather (Nappa style):** `leather_material(name, rgb)`. Use the same material on piping and welts. Keep tone variation on. Add sheen about 0.3.
- **Fluting or diamond quilting:** model the pillowed surface, bake fine detail to a normal map if real-time. `flute_panel` shows a procedural fluted surface with a flat border band and groove. Diamond quilting: replace the ridge function with a product of two sine terms and add a button or stitch point at each node.
- **Stitching:** `stitch_polyline` along an inset path with a groove just outside it. Always geometry for hero views; for real-time, bake to normal map plus a thread slot if colour must change.
- **Piping and welts:** `piping(...)` as a bevelled curve, material equal to the adjoining leather.
- **Perforation:** a repeating hole pattern as a normal and alpha map (render) or normal only (real time). Pitch about 3 to 4 mm. Do not model each hole.
- **Wood or carbon trim:** noise or wave texture for grain, a clearcoat layer, roughness 0.05 to 0.2 under the coat. Check that grain direction follows the part.
- **Screens:** glass layer (clearcoat) over an emissive panel, a thin bezel with a small radius, a slight tilt. A screen with no reflections looks like a sticker.
- **Speaker grilles:** array of holes via a normal map or a boolean-free instance; keep brand marks off (trademark).
- **Ambient light strips:** emissive material with bloom off in the viewer; verify vertex-colour plus Draco behaviour in the export test.
- **Carpet and headliner:** fine fibre bump, high roughness, a touch of sheen on suede-like headliner.

Known gap in the tested kit: leather currently reads as fine suede at macro scale. Increase sheen and lower roughness slightly for glossier Nappa, then re-check in the material lab.
