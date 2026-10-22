# ASTRA PRODUCTION DIRECTIVE: 2020 LEXUS RX 350 DEMO

**Document:** `docs/ASTRA_LEXUS_HANDOFF.md`  
**Target Agent:** Astra (3D Asset & Blender Engineering Agent)  
**Author:** Antigravity (Integration & Preparation Agent)  
**Date:** 2026-10-22  
**Status:** BINDING PRODUCTION DIRECTIVE — AWAITING OWNER AUTHORIZATION  
**Supersedes:** `docs/ASTRA_HANDOFF.md` (Mercedes-Benz S-Class V223 Directive)  

---

## 1. MANDATORY GOVERNANCE & SCOPE LOCK

> [!CAUTION]
> **STRICT PROHIBITION: DO NOT ATTEMPT A COMPLETE CABIN RECONSTRUCTION**  
> Astra must **NOT** model rear passenger seats, executive consoles, door panels, floor pans, carpets, A/B/C pillars, headliners, or exterior glass.  
> The objective of AutoLab Digital Showroom is to showcase **bespoke upholstery craftsmanship, leather finishes, and contrast stitching** inspired by the focused product experience at **[carseatcover.eu](https://carseatcover.eu/)**.  
> It is **NOT** to produce an OEM manufacturer digital twin. Any work outside the five authorized nodes below is an immediate breach of scope.

---

## 2. Target Vehicle & Reference Pack

- **Target Vehicle**: **2020 Lexus RX 350 AWD** (Certified Pre-Owned, VIN `2T2HZMDA5LC239309`, Stock `HLSPLC239309`).
- **Primary Photographic Reference**: [`AUTOLAB_LEXUS_SEAT_REFERENCE_PACK/`](file:///c:/Users/user/OneDrive/Desktop/AUTOLAB-DIGITAL-SHOWROOM/AUTOLAB_LEXUS_SEAT_REFERENCE_PACK/)
- **Reference Atlas & Guidelines**:
  - [`SEAT_REFERENCE_ATLAS.md`](file:///c:/Users/user/OneDrive/Desktop/AUTOLAB-DIGITAL-SHOWROOM/AUTOLAB_LEXUS_SEAT_REFERENCE_PACK/SEAT_REFERENCE_ATLAS.md)
  - [`VISIBLE_GEOMETRY_AND_MISSING_VIEWS.md`](file:///c:/Users/user/OneDrive/Desktop/AUTOLAB-DIGITAL-SHOWROOM/AUTOLAB_LEXUS_SEAT_REFERENCE_PACK/VISIBLE_GEOMETRY_AND_MISSING_VIEWS.md)
  - [`IMAGE_MANIFEST.csv`](file:///c:/Users/user/OneDrive/Desktop/AUTOLAB-DIGITAL-SHOWROOM/AUTOLAB_LEXUS_SEAT_REFERENCE_PACK/IMAGE_MANIFEST.csv)

---

## 3. Component Deliverables & Photographic Evidence Mapping

Astra is authorized to author exactly **five visible geometry nodes**:

| Node Identifier | Module | Primary Reference Photographs | Specific Modeling Directives |
| :--- | :--- | :--- | :--- |
| `GEO_Seat_Front_Driver` | Seating | `01_FRONT_SEAT_COMPLETE/LRX-08.jpg`<br>`01_FRONT_SEAT_COMPLETE/LRX-23.jpg`<br>`01_FRONT_SEAT_COMPLETE/LRX-29.jpg`<br>`03_BOLSTERS_HEADREST_AND_STITCHING/LRX-31.jpg` | Model authentic Lexus RX 350 front bucket seat. Central insert with longitudinal fluting seams (2.5 mm physical seam depression). Ergonomic outer bolsters with smooth silhouette. Integrated headrest cushion with forward tilt. Lower plastic switch skirt with power adjustment controls. **Do not model seat underside or seat track motors.** |
| `GEO_Seat_Front_Passenger` | Seating | `04_FRONT_SEAT_PAIR/LRX-07.jpg`<br>`04_FRONT_SEAT_PAIR/LRX-30.jpg` | Symmetrical counterpart to driver seat. Mirrored geometry with appropriate inboard console clearance. |
| `GEO_Seat_Stitching_Front` | Seating | `03_BOLSTERS_HEADREST_AND_STITCHING/LRX-31.jpg` | Dedicated thin seam geometry for contrast thread recolouring (per Decision D1). Follows perimeter bolster lines and headrest borders. |
| `GEO_SteeringWheel_Lexus` | Cockpit | `05_DASHBOARD_AND_TRIM/LRX-16.jpg`<br>`05_DASHBOARD_AND_TRIM/LRX-33.jpg` | Authentic 3-spoke Lexus steering wheel with center airbag boss, metallic lower spoke trim, and thumb-grip contours. |
| `GEO_Dashboard_Lexus` | Cockpit | `05_DASHBOARD_AND_TRIM/LRX-34.jpg`<br>`05_DASHBOARD_AND_TRIM/LRX-35.jpg` | Bounded upper cowl sweep and central display bezel. Provides visual context and scale anchoring behind the steering wheel and seats. |

---

## 4. Material Slots & Customisation Assignment

Every node must bind to a strictly defined material slot in the manifest:

| Slot Identifier | Assigned Node(s) | Customisation Function | Texture Resolution |
| :--- | :--- | :--- | :--- |
| `MAT_Seat_Primary` | `GEO_Seat_Front_Driver`, `GEO_Seat_Front_Passenger` (Center) | Customer-selected primary leather hide hue (center flutes & backrest). | $1024 \times 1024$ (Albedo, Normal, ORM) |
| `MAT_Seat_Secondary` | `GEO_Seat_Front_Driver`, `GEO_Seat_Front_Passenger` (Bolsters) | Customer-selected secondary/contrast leather hue (outer bolsters & headrest). | $1024 \times 1024$ (Albedo, Normal, ORM) |
| `MAT_Seat_Stitching` | `GEO_Seat_Stitching_Front` | Customer-selected accent thread colour (contrast perimeter seams). | Base Color Tint |
| `MAT_Steering_Leather`| `GEO_SteeringWheel_Lexus` | Semi-matte black leather with subtle grain. | $1024 \times 1024$ |
| `MAT_Dashboard_Trim` | `GEO_Dashboard_Lexus` | Soft-touch dark graphite dashboard cowl with satin trim accents. | $1024 \times 1024$ |

---

## 5. Permitted Camera Angles & Viewport Constraints

Astra must verify all renders and viewer viewpoints against these four calibrated positions:

1. **`hero_driver` (Driver 3/4 Hero)**:
   - *Reference*: `LRX-08`, `LRX-29`
   - *Framing*: Full view of driver seat through open door angle, showing headrest, bolster profile, center insert, and power switch base.
2. **`seam_macro` (Stitch & Perforation Macro)**:
   - *Reference*: `LRX-31`
   - *Framing*: Extreme close-up on cushion bolster seam, showing stitch definition, seam recess, and leather micro-grain.
3. **`cabin_pair` (Dual Front Seats Overview)**:
   - *Reference*: `LRX-07`, `LRX-30`
   - *Framing*: Cockpit perspective from center console showing both driver and passenger seats, steering wheel, and dashboard cowl.
4. **`driver_cockpit` (Driver Ingress Perspective)**:
   - *Reference*: `LRX-23`, `LRX-33`
   - *Framing*: Steering wheel and driver seat relationship from the door entrance.

---

## 6. Modeling Constraints & Budgets

Astra must respect the following strict performance budgets:

- **Triangle Budget**:
  - Driver Seat: $\le 16,000$ triangles
  - Passenger Seat: $\le 16,000$ triangles
  - Stitching Meshes: $\le 4,000$ triangles
  - Steering Wheel: $\le 5,000$ triangles
  - Dashboard Cowl: $\le 4,000$ triangles
  - **Total Cumulative Triangles**: $\le 45,000$ triangles (Hard maximum: $80,000$).
- **Draw Calls**: At most 6 draw calls cumulative.
- **File Size**: Transferred Draco-compressed GLB $\le 2.5\text{ MB}$ (Hard maximum: $5.0\text{ MB}$).
- **Texture Memory**: Total decoded texture memory $\le 24\text{ MB}$ (using 1024 px mobile tier).
- **Automation Rule**: Author all geometry headlessly using reproducible Python scripts under `tools/` with Blender 5.2.2 LTS. Never rely on manual Blender GUI workflows.
