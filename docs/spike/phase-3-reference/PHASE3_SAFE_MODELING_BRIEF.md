# PHASE 3 SAFE MODELING BRIEF: DEFENSIBLE INSTRUCTIONS
**Target Assets:** `GEO_Seat_Front_Driver_Flutes` & `GEO_Dashboard_Screen_Central_OLED`  
**Target Software:** Blender 5.2.2 (Cycles Render Engine)  
**Project Guidelines:** Strictly grounded geometry, explicit estimate labeling, preserving naming conventions and platform scope.  

---

## 1. Project Scope & Naming Conventions

### 1.1. Modeling Scope
Modeling operations for the Phase 3 feasibility spike are strictly restricted to two interior components of the 2021–2025 Mercedes-Benz S-Class Long Wheelbase (V223 platform, pre-facelift interior layout):
1. **`GEO_Seat_Front_Driver_Flutes`**: Driver's front seat assembly featuring longitudinal vertical fluting across central cushion and backrest panels (Standard Nappa specification).
2. **`GEO_Dashboard_Screen_Central_OLED`**: Cascading portrait 12.8-inch OLED multimedia display, outer bezel framing, and lower physical switch strip.

Do not model surrounding dashboard structures, passenger trim, rear cabin, or Maybach/Facelift elements.

### 1.2. Material & Asset Naming Conventions
All geometry and material slots must strictly adhere to project naming standards:
- **Geometry Objects:** `GEO_Seat_Front_Driver_Flutes`, `GEO_Dashboard_Screen_Central_OLED`
- **Material Slots:**
  - `MAT_V223_Leather_Fluted` (Central backrest and cushion fluted channels)
  - `MAT_V223_Leather_Smooth` (Side bolsters, headrest core, rear shell cladding)
  - `MAT_V223_Pillow_Microfiber` (Luxury neck pillow insert)
  - `MAT_V223_Screen_Glass` (Cold-formed cover glass faceplate)
  - `MAT_V223_OLED_Canvas` (Self-emissive active OLED display canvas)
  - `MAT_V223_Satin_Chrome` (Anodized silver protective bezel framing)

---

## 2. Component 1: `GEO_Dashboard_Screen_Central_OLED`

### 2.1. Defensible & Verified Geometry
- **Active Canvas Diagonal:** $12.8\text{ inches}$ ($325.12\text{ mm}$) [VERIFIED].
- **Active Pixel Grid:** $1888 \text{ pixels (vertical)} \times 1728 \text{ pixels (horizontal)}$ [VERIFIED].
- **Active Canvas Width ($W_{active}$):** $219.51\text{ mm}$ [DERIVED from Pythagorean ratio].
- **Active Canvas Height ($H_{active}$):** $239.83\text{ mm}$ [DERIVED from Pythagorean ratio].
- **Canvas Aspect Ratio:** $1.0926 : 1$ vertical-to-horizontal ($1888 / 1728$).

### 2.2. Explicitly Labeled Estimates & Provisional Parameters
- `[PROVISIONAL ESTIMATE]` **Outer Glass Width:** $235.5\text{ mm}$ ($219.5\text{ mm}$ active + $2 \times 8.0\text{ mm}$ side bezels).
- `[PROVISIONAL ESTIMATE]` **Outer Glass Height:** $275.8\text{ mm}$ ($239.8\text{ mm}$ active + top border and lower switch strip).
- `[PROVISIONAL ESTIMATE]` **Glass Corner Radius:** $12.0\text{ mm}$ 2D bevel radius.
- `[PROVISIONAL ESTIMATE]` **Console Inclination Angle:** $38.0^\circ$ swept back from vertical ($52.0^\circ$ relative to horizontal floorpan).
- `[PROVISIONAL ESTIMATE]` **Floating Rear Air Gap:** $12.0\text{ mm}$ clearance between screen back shell and console veneer.
- `[PROVISIONAL ESTIMATE]` **Protective Bezel:** $4.5\text{ mm}$ chrome border inset, $8.0\text{ mm}$ backward rim extrusion.
- `[PROVISIONAL ESTIMATE]` **Lower Switch Bar:** Bottom $22.0\text{ mm}$ strip extruded forward by $2.0\text{ mm}$; cylindrical volume roller thumbwheel diameter $14.0\text{ mm}$.

### 2.3. Construction Procedure for Blender 5.2.2
1. **Base Screen Plane:** Draft a flat rectangular plane measuring $219.51 \times 239.83\text{ mm}$ for the active canvas.
2. **Glass & Bezel Extrusion:** Extrude perimeter to $235.5 \times 275.8\text{ mm}$ `[PROVISIONAL]`. Apply a 2D corner bevel radius of $12.0\text{ mm}$ `[PROVISIONAL]`.
3. **World Alignment:** Rotate screen assembly around local X-axis by $38.0^\circ$ `[PROVISIONAL]`. Position mesh centered on vehicle centerline, $12.0\text{ mm}$ forward of dashboard veneer backing plane `[PROVISIONAL]`.
4. **UV Mapping & Canvas Assignment:** Map active canvas face ($219.51 \times 239.83\text{ mm}$) to dedicated UV map space matching $1888 \times 1728$ pixels. Allocate bottom 18% of UV vertical space for MBUX climate bar texture.

---

## 3. Component 2: `GEO_Seat_Front_Driver_Flutes`

### 3.1. Defensible & Verified Geometry
- **Central Panel Flute Count:** Exactly 8 vertical longitudinal flutes across central backrest and seat cushion panels [VERIFIED].
- **Upholstery Specification:** Standard Leather or Standard Nappa Leather (longitudinal piping). **Do not model Exclusive Nappa diamond quilting.**
- **Corrected Cushion Envelope Width:** $450.0\text{ mm} - 480.0\text{ mm}$ provisional range [CORRECTED DERIVED]. *(Note: Replaces invalid 530.0 mm calculation from reference pack).*
- **Backrest Height:** $840.0\text{ mm}$ unextended frame height [DERIVED].

### 3.2. Explicitly Labeled Estimates & Provisional Parameters
- `[PROVISIONAL ESTIMATE]` **Center Flute Nominal Width:** $36.0\text{ mm} - 38.0\text{ mm}$ across primary contact zones (recalculated against corrected $458\text{ mm}$ cushion envelope).
- `[PROVISIONAL ESTIMATE]` **Flute Recessed Channel Depth:** $6.0\text{ mm}$ depth for blind tuck-in seam channels.
- `[PROVISIONAL ESTIMATE]` **Flute Crown Radius:** $25.0\text{ mm}$ parabolic convex crown curve.
- `[PROVISIONAL ESTIMATE]` **Seam Stitch Pitch:** $3.5\text{ mm}$ uniform pitch along double French seams.
- `[PROVISIONAL ESTIMATE]` **Side Bolster Angle:** Projection outward and forward at $30.0^\circ$.
- `[PROVISIONAL ESTIMATE]` **Thigh Extension Mechanism:** Sliding sub-mesh extending forward up to $50.0\text{ mm}$ with a gap-free $1.0\text{ mm}$ shadow channel.

### 3.3. Construction Procedure for Blender 5.2.2
1. **Bounding Envelope Setup:** Establish bounding box at $458 \times 560 \times 840\text{ mm}$ `[CORRECTED PROVISIONAL]`. Set backrest recline angle to $22.0^\circ$ relative to vertical.
2. **Topology Layout:** Block out central seat cushion and backrest using quad-dominant topology. Divide central insert into exactly 8 vertical column loops.
3. **Flute Channel Inset:** Inset edge loop pairs defining the 8 columns by $3.0\text{ mm}$ on each side. Extrude central seam edges inward along local normals by $6.0\text{ mm}$ `[PROVISIONAL]`. Apply bevel weights ($1.0$) along channel troughs.
4. **Subdivision Modifier:** Apply Subdivision Surface modifier (Level 2 viewport, Level 3 render).
5. **Headrest & Neck Cushion:** Model primary headrest block mounted on twin $12.0\text{ mm}$ stainless steel stalks. Model "Luxury Neck Cushion" pillow as an overlapping cloth-simulated mesh resting against headrest face.

---

## 4. Blender 4.x to Blender 5.2.2 Migration & Compatibility Directives

Modeling agents must adhere to the following updates when executing instructions in Blender 5.2.2:

### 4.1. Auto Smooth Attribute Migration (Critical Blender 4.1+ / 5.x Change)
- **Legacy Instruction (Blender 4.0):** Reference pack specifies checking the "Auto Smooth" checkbox under `Mesh Properties > Normals`.
- **Blender 5.2.2 Incompatibility:** The legacy `Auto Smooth` checkbox was completely removed in Blender 4.1+ and does not exist in Blender 5.2.2.
- **Mandatory Action:** In Blender 5.2.2, agents must apply the **`Smooth by Angle`** modifier (or geometry node modifier) before the `Weighted Normal` modifier to achieve correct hard-edge split shading along glass bezels and metal trim.

### 4.2. Principled BSDF v2 Shader Socket Updates
- **Legacy Instruction:** Single Emissive input socket setup.
- **Blender 5.2.2 Incompatibility:** Principled BSDF v2 splits emission controls into separate `Emission Color` and `Emission Strength` inputs.
- **Mandatory Action:** For `MAT_V223_OLED_Canvas`, connect the MBUX Zero-Layer texture map to `Emission Color` and set `Emission Strength = 1.0`. For glass materials (`MAT_V223_Screen_Glass`), set `Transmission Weight = 0.95` and `IOR = 1.52`.

### 4.3. Color Management Calibration (AgX View Transform)
- **Blender 5.2.2 Default:** Uses `AgX` view transform instead of legacy `Filmic`.
- **Mandatory Action:** Emissive display screen captures ($1.8\text{ cd/m}^2$) must be calibrated in AgX to prevent highlight saturation or UI color shift.

### 4.4. High-Resolution Normal Map Baking
- **Workflow:** Sculpt micro-wrinkles on a Multiresolution modifier layer and bake tangent-space normal maps at $4096 \times 4096$ pixels.
- **Color Space:** Ensure normal map texture node color space is set to `Non-Color`.
