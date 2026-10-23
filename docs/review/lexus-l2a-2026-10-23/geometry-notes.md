# L2A geometry and reference limits

Status: provisional driver-seat candidate. No visual acceptance or manufacturer-dimensional claim.

## What the photographs support

| Evidence | Visible information used | Limits |
| --- | --- | --- |
| Supplied LRX-08 | Driver seat silhouette, tapered headrest, raised bolsters, perforated insert, transverse cushion sections and arched backrest junction | Perspective, occlusion and lighting prevent physical measurement |
| Supplied LRX-23 | Driver-side cushion depth, backrest slope, outside trim and power-control placement | Not an orthographic side view |
| Supplied LRX-29 | Supporting passenger-seat silhouette and upholstery context | Passenger-side view; not evidence for driver control placement |
| Supplied LRX-31 | Rear-cabin view with front-seat shoulder/headrest context | Not a front-seat stitch or leather-grain macro |

The owner-supplied pack is the reference authority for this candidate. Its vehicle attribution is inherited from the pack and dealership listing, not independently authenticated. Source listing: [Herb Chambers 2020 Lexus RX 350](https://www.herbchambers.com/certified/Lexus/2020-Lexus-RX-350--5d87d62cac1844a957f07faa15dad1f8.htm). No third-party model, texture, HDRI or AI-generated reference image was used.

## Visually approximated

- Every physical dimension, backrest inclination, bolster cross-section, cushion dish, headrest volume, recess depth and control size. The model has metric units, but these are modelling estimates, not OEM specifications. Named principal dimensions are in `blender/lexus_constants.py`; profile ratios are in the authoring script.
- Seam paths, double-row spacing, thread thickness (0.76 mm diameter), nominal stitch pitch (3.8 mm), pore pitch (about 1.9 mm) and grain scale. There is no supplied calibrated macro or physical hide sample to validate them.
- The broad insert/bolster material boundary and upper backrest panel shape. Reference features guide the model; exact upholstery panel topology and trim identity remain unverified.
- Charcoal colour, coat response and leather grain. Neutral procedural albedo/normal/ORM maps are authored from a fixed seed, not sampled from dealership photographs. This is not an approved AutoLab material catalogue.
- Outer plastic trim and headrest posts use the approved secondary material with vertex tint. They therefore follow secondary recolouring. Separate plastic/chrome material slots were not invented.

## Construction and disclosed tradeoffs

The cushion and backrest are closed, continuous parametric shells. Headrest and visible controls are separate solid components consolidated into the seat mesh. There is no claim that the entire assembly is a single watertight solid or free of intentional component intersections. A Blender assertion checks the seat components for open boundary edges and zero-area faces before export; the browser probe checks decoded triangles and finite vertex attributes.

Stitches are separate geometry as explicitly required by the Lexus scope. They are projected onto the tessellated upholstery. Their open tube ends are deliberately omitted; the thread mesh is not watertight. Broad seam relief is geometry; micrograin and perforations are analytic tangent-space maps, not a high-poly sculpt bake. UVs repeat for these tileable maps; this is not a unique non-overlapping bake atlas. AO is neutral white, not an occlusion bake.

The first candidate exceeded the triangle budget. Surface grids were reduced from 50×54/50×64 to 44×48/44×56, and hidden stitch caps were removed. The later continuous shells replaced the visibly cracked edge strips. Headrest-post bevels use three segments; other bevels retain five. No automatic whole-seat decimation was used. The transfer target remains exceeded; the hard L2A limits are evaluated in the actual asset report.

## Excluded

Passenger seat, dashboard, steering wheel, full cabin, rails, motors, seat belt/buckle assembly, airbags, rear pockets, hidden mechanisms, motion/kinematics and trim badges. The plain rear/base shell is closure geometry, not an assertion about hidden Lexus construction. Main R3F application integration and camera calibration belong to L3.

## Evidence rendering

Blender cannot import the embedded KTX2 payload directly. The finalizer reads the delivered GLB back, validates each texture against its recorded SHA-256 and decodes that texture's level-zero pixels to PNG. A render-only GLB preserves the geometry/material bindings and substitutes these decoded pixels. Its hash is checked by the render script. This is a texture-encoding bridge, not a different authored model. Cycles and WebGL lighting/tone mapping differ, so the images do not establish cross-renderer colour matching.

Review renders use one consistent light setup across all three final views, Cycles CPU, AgX, 32 maximum samples and a 160-second tracing limit per image. Setup/denoising can make total elapsed time longer. The studio floor is presentation-only and is absent from the delivered GLB. Original dealership photos and the comparison sheet stay in the ignored reference pack, outside `public/` and git.
