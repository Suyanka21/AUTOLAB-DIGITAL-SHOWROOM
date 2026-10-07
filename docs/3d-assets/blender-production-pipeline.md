# Blender Production Pipeline & Asset Authoring Guide
**Document:** `docs/3d-assets/blender-production-pipeline.md`  
**Authority:** S-Class 3D Asset Brief (Sections 9 & 11)  
**Target Consumer:** Downstream Production Agent (Astra) / 3D Modeler  

---

## 1. Operating Directives for Astra

### Core Production Objective
Author an optimized, photorealistic, real-time WebGL asset representing the Mercedes-Benz S-Class V223 (Long Wheelbase) interior cabin in Blender (versions 3.6 LTS through 4.2+).

---

## 2. Six-Phase Authoring Sequence

```
[ Phase 1: Metric Bounding Cage ]
                │
                ▼
[ Phase 2: Dimensional Display Anchors ] (12.8" OLED & 12.3" Cluster)
                │
                ▼
[ Phase 3: Dashboard Wing & Door Card Sweep ] (3.5–4.5mm shut lines)
                │
                ▼
[ Phase 4: Seating Volumes & Kinematic Rigging ]
                │
                ▼
[ Phase 5: UV Unwrapping & Material Slot Assignments ]
                │
                ▼
[ Phase 6: glTF 2.0 WebGL Export & Draco Compression ]
```

### PHASE 1: METRIC BOUNDING CAGE
1. Set Blender scene units to **Metric** with length units set to **Meters** (Unit Scale: `1.0`).
2. Construct the reference bounding cage matching verified V223 dimensions:
   * **Overall Length:** 5.289 m (5,289 mm)
   * **Overall Width (excl. mirrors):** 1.954 m (1,954 mm)
   * **Overall Height:** 1.503 m (1,503 mm)
   * **Wheelbase:** 3.216 m (3,216 mm)
3. Set front seat H-point and driver eye-point anchors based on headroom (1,069 mm) and legroom (1,045 mm).

### PHASE 2: PRIMARY DISPLAY CALIBRATION ANCHORS
1. Model the **MBUX Central 12.8-inch OLED Display**:
   * Rectangular plane with 1.5–2.0 mm corner radius and 0.8 mm stepped perimeter bezel.
   * Angle: Mount inclined at ~60° from horizontal, cascading from mid-dash into center tunnel.
2. Model the **Driver 12.3-inch Instrument Cluster**:
   * Visorless landscape screen resting on a low pedestal forward of the steering column.
3. *Rule:* These two display panels establish known dimensional ground truth. Proportions of all adjacent dash surfaces must reference these screens.

### PHASE 3: COCKPIT WING SWEEP & SEAM ALIGNMENT
1. Sweep the wing-shaped upper dashboard deck from driver A-pillar to passenger A-pillar.
2. Cut openings for the four rectangular upper HVAC vents and central display cradle.
3. Model the front door card waistlines, ensuring the continuous horizontal shut gap between dashboard wings and front door cards maintains a uniform **3.5 mm – 4.5 mm spacing**.
4. Extrude the continuous 253-LED ambient lighting optical spline channel along the interface between upper soft-touch trim and lower wood/carbon veneer.

### PHASE 4: SEATING VOLUMES & KINEMATICS
1. Block out front multicontour seats:
   * Model low-poly base geometry for center cushions and outer bolsters.
   * Sculpt diamond flutes on a separate multires level; bake high-detail fluting to tangent-space normal maps.
2. Block out rear Executive suite (RH):
   * Establish kinematic pivot empty for backrest recline (0° to 43.5°).
   * Rig child bone for powered calf rest deployment.
3. Model front center console sliding tambour door along curved path spline.

### PHASE 5: UV UNWRAPPING & MATERIAL SLOTS
1. Ensure non-overlapping UV layout on **UV Channel 0** for all primary surfaces.
2. Maintain uniform texel density across hero surfaces (~1024 px/meter).
3. Assign standardized material slot names matching `docs/3d-assets/interior-component-map.md`:
   * `MAT_Upholstery_Primary`
   * `MAT_Upholstery_Secondary`
   * `MAT_Trim_Deck_Main`
   * `MAT_Steering_Leather`
   * `EMISSIVE_Ambient_Lighting`

### PHASE 6: glTF 2.0 WEBGL EXPORT CONFIGURATION
Export master `.glb` file using the following official Blender glTF exporter settings:
* **Format:** glTF Binary (`.glb`)
* **Include:** Selected Objects, Custom Properties, Punctual Lights (if calibrated).
* **Transform:** `+Y Up` (glTF standard).
* **Geometry:**
  * Apply Modifiers: Checked.
  * Tangents: Checked (essential for normal map fidelity).
  * Materials: Export standard PBR materials.
  * Compression: **Draco Mesh Compression enabled** (Quantization bits: Position 14, Normal 10, TexCoord 12).
* **Animation:** Include rigged kinematic actions (`Recline_Executive_Seat`, `Deploy_Calf_Rest`, `Slide_Console_Tambour`).
