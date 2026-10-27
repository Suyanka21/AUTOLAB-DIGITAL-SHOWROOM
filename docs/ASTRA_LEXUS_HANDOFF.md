# ASTRA PRODUCTION DIRECTIVE: 2020 LEXUS RX 350 DEMO

**Owner update, 2026-10-26:** R1 accepted as a provisional mock-up baseline; L2B asset production and push authorized. Fidelity scores and human gates remain open. See [L2B handoff](3d-assets/LEXUS_L2B_HANDOFF.md). L3 integration is not authorized by this update.

**Document:** `docs/ASTRA_LEXUS_HANDOFF.md`  
**Target Agent:** Astra (3D Asset & Blender Engineering Agent)  
**Author:** Antigravity (Integration & Preparation Agent)  
**Date:** 2026-10-22 (Reconciled & Corrected)  
**Status:** BINDING PRODUCTION DIRECTIVE — L2B AUTHORIZED; L3 EXCLUDED
**Supersedes:** `docs/ASTRA_HANDOFF.md` (Mercedes-Benz S-Class V223 Directive)  

---

## 1. MANDATORY GOVERNANCE & SCOPE LOCK

> [!CAUTION]
> **STRICT PROHIBITION: DO NOT ATTEMPT A COMPLETE CABIN RECONSTRUCTION**  
> Astra must **NOT** model rear passenger seats, executive consoles, door panels, floor pans, carpets, A/B/C pillars, headliners, mechanical under-structures, or exterior glass.  
> The objective of AutoLab Digital Showroom is to showcase **bespoke upholstery craftsmanship, leather finishes, and contrast stitching** inspired by the focused product experience at **[carseatcover.eu](https://carseatcover.eu/)**.  
> It is **NOT** to produce an OEM manufacturer digital twin.  
> 
> **Historical L2A scope lock:** The initial task was one driver seat. The owner's 2026-10-26 L2B instruction accepts R1 provisionally and permits the bounded passenger/wheel/upper-dashboard slice. Detailed visual acceptance remains open; L3 still requires separate authorization.

---

## 2. Target Vehicle & Reference Pack

- **Target Vehicle**: **2020 Lexus RX 350 AWD** (Certified Pre-Owned, VIN `2T2HZMDA5LC239309`, Stock `HLSPLC239309`).
- **Primary Photographic Reference**: `AUTOLAB_LEXUS_SEAT_REFERENCE_PACK/` (Local-only design research; excluded from git and application bundling).
- **Photograph Usage Boundary**: All 35 gallery photographs are **internal modeling and design references only**. They must **not** be bundled, served, or presented in the public customer application without explicit commercial licensing approval.
- **Reference Atlas & Guidelines**:
  - `AUTOLAB_LEXUS_SEAT_REFERENCE_PACK/SEAT_REFERENCE_ATLAS.md`
  - `AUTOLAB_LEXUS_SEAT_REFERENCE_PACK/VISIBLE_GEOMETRY_AND_MISSING_VIEWS.md`
  - `AUTOLAB_LEXUS_SEAT_REFERENCE_PACK/IMAGE_MANIFEST.csv`

---

## 3. Early Visual Approval Gate (Mandatory Stop)

Before proceeding to full cockpit touchpoints, Astra must author and present:

### Deliverable: Driver Seat Visual Prototype
- **Geometry**: Single driver bucket seat (`GEO_Seat_Front_Driver`) with separate accent stitch geometry (`GEO_Seat_Stitching_Front`).
- **Required Review Pack Evidence**:
  1. **Front Three-Quarter Render**: Corresponding to viewpoint `hero_driver` (verified against `AUTOLAB_LEXUS_SEAT_REFERENCE_PACK/01_FRONT_SEAT_COMPLETE/LEXUS_RX_2020_GALLERY_08.jpg` and `LEXUS_RX_2020_GALLERY_29.jpg`).
  2. **Side / Open-Door Profile Render**: Corresponding to viewpoint `driver_cockpit` (verified against `AUTOLAB_LEXUS_SEAT_REFERENCE_PACK/01_FRONT_SEAT_COMPLETE/LEXUS_RX_2020_GALLERY_23.jpg`).
  3. **Upholstery & Seam Close-up Render**: Corresponding to viewpoint `seam_macro` (verified against `AUTOLAB_LEXUS_SEAT_REFERENCE_PACK/03_BOLSTERS_HEADREST_AND_STITCHING/LEXUS_RX_2020_GALLERY_31.jpg`).
  4. **Side-by-Side Comparison**: Contact sheet placing the Blender test renders directly beside the corresponding reference photos.
  5. **Explicit Disclosure of Approximations**: Detailed notes listing any approximated radii, stitch spacing, or inferred curves.
- **Approval Gate**: The owner must review and approve visual quality, seam articulation, and material fidelity before Astra begins the passenger seat, steering wheel, or dashboard. **Technical GLB validation alone is not sufficient.**

---

## 4. Component Deliverables & Photographic Evidence Mapping

Every referenced image is verified against `AUTOLAB_LEXUS_SEAT_REFERENCE_PACK/IMAGE_MANIFEST.csv`:

| Component / Module | Authorized Scope | Primary Photographic References | Specific Modeling Directives |
| :--- | :--- | :--- | :--- |
| **Driver Seat** (`GEO_Seat_Front_Driver`) | Seating (Gate 1 Target) | `AUTOLAB_LEXUS_SEAT_REFERENCE_PACK/01_FRONT_SEAT_COMPLETE/LEXUS_RX_2020_GALLERY_08.jpg`<br>`AUTOLAB_LEXUS_SEAT_REFERENCE_PACK/01_FRONT_SEAT_COMPLETE/LEXUS_RX_2020_GALLERY_23.jpg`<br>`AUTOLAB_LEXUS_SEAT_REFERENCE_PACK/01_FRONT_SEAT_COMPLETE/LEXUS_RX_2020_GALLERY_29.jpg`<br>`AUTOLAB_LEXUS_SEAT_REFERENCE_PACK/03_BOLSTERS_HEADREST_AND_STITCHING/LEXUS_RX_2020_GALLERY_31.jpg` | Model authentic Lexus RX 350 front bucket seat. Central insert with longitudinal fluting seams. Ergonomic outer bolsters with smooth curvature. Forward-tilted headrest cushion. Lower plastic side skirt with power adjustment controls. |
| **Passenger Seat** (`GEO_Seat_Front_Passenger`) | Seating (Post-Gate 1) | `AUTOLAB_LEXUS_SEAT_REFERENCE_PACK/04_FRONT_SEAT_PAIR/LEXUS_RX_2020_GALLERY_07.jpg`<br>`AUTOLAB_LEXUS_SEAT_REFERENCE_PACK/04_FRONT_SEAT_PAIR/LEXUS_RX_2020_GALLERY_30.jpg` | Symmetrical counterpart to driver seat. Mirrored geometry with appropriate inboard console clearance. |
| **Accent Stitching** (`GEO_Seat_Stitching_Front`) | Seating (Gate 1 Target) | `AUTOLAB_LEXUS_SEAT_REFERENCE_PACK/03_BOLSTERS_HEADREST_AND_STITCHING/LEXUS_RX_2020_GALLERY_31.jpg` | Dedicated seam geometry for contrast thread recolouring (Decision D1). Traces outer bolster borders, cushion seams, and headrest contour. |
| **Steering Wheel** (`GEO_SteeringWheel_Lexus`) | Cockpit (Post-Gate 1) | `AUTOLAB_LEXUS_SEAT_REFERENCE_PACK/05_DASHBOARD_AND_TRIM/LEXUS_RX_2020_GALLERY_16.jpg`<br>`AUTOLAB_LEXUS_SEAT_REFERENCE_PACK/01_FRONT_SEAT_COMPLETE/LEXUS_RX_2020_GALLERY_33.jpg` | 3-spoke Lexus steering wheel with center airbag boss, lower spoke metallic accent, and perforated side grips. |
| **Dashboard Cowl** (`GEO_Dashboard_Lexus`) | Cockpit (Post-Gate 1) | `AUTOLAB_LEXUS_SEAT_REFERENCE_PACK/05_DASHBOARD_AND_TRIM/LEXUS_RX_2020_GALLERY_34.jpg`<br>`AUTOLAB_LEXUS_SEAT_REFERENCE_PACK/05_DASHBOARD_AND_TRIM/LEXUS_RX_2020_GALLERY_35.jpg` | Bounded upper cowl sweep and central display bezel providing visual scale and cockpit depth behind the seats and steering wheel. |

---

## 5. Geometry Classification & Precision Standards

To eliminate unverified assertions and establish honest modeling boundaries, all geometry is categorized as follows:

| Classification | Covered Elements | Modeling Rule |
| :--- | :--- | :--- |
| **Photographically Verified** | • Outer seat silhouette, headrest rake, bolster sweep<br>• Central fluted insert panel layout<br>• Lower power-switch plastic skirt profile<br>• Steering wheel 3-spoke geometry and airbag boss<br>• Dashboard cowl curve and display bezel presence | Must strictly align with the camera angles and proportional relationships in the Herb Chambers reference photos. |
| **Reasonable Visual Approximation** | • Fluting seam depression depth and groove width<br>• Foam bolster curvature radius and bevel soft-edges<br>• Stitch thread width, pitch, and spacing<br>• Micro-perforation density on leather inserts<br>• Inboard bolster curves hidden by console | Model visually convincing, aesthetically premium representations. Do not claim manufacturer CAD tolerances. Disclose approximations in review notes. |
| **Unverified & Excluded** | • Seat underside, mounting tracks, motor brackets, wiring harnesses<br>• Rear seatback internal plastic backing / release latches<br>• HVAC ducting, steering column shafts, pedals, floor pan<br>• Rear cabin, door panels, pillars, headliner | **STRICTLY EXCLUDED**. Do not model unseen geometry. Camera boundaries will prevent viewing these areas. |

---

## 6. Semantic Material Zones vs. Mesh Nodes

Astra is **not** restricted to an artificially small number of monolithic mesh nodes. Clean geometry, normal baking, and sub-mesh separation are encouraged for craftsmanship quality:
- Astra may structure the seating as multiple sub-meshes or separate objects (e.g. cushion insert, backrest insert, outer bolsters, headrest, power controls, stitch splines) to achieve optimal edge flow and avoid pinching artifacts.
- The requirement is that all sub-meshes bind to their designated **semantic material zones**:

| Semantic Material Zone | Associated Geometry / Surfaces | Customisation Function | Texture Resolution |
| :--- | :--- | :--- | :--- |
| `MAT_Seat_Primary` | Center cushion flutes, center backrest insert | Main customer leather hide selection. | $1024 \times 1024$ (Albedo, Normal, ORM) |
| `MAT_Seat_Secondary` | Outer side bolsters, headrest cushion, cushion side bands | Secondary/contrast bolster leather hue. | $1024 \times 1024$ (Albedo, Normal, ORM) |
| `MAT_Seat_Stitching` | Dedicated perimeter seam and accent thread geometry | Real-time accent thread recolouring. | Base Color Tint |
| `MAT_Steering_Leather` | Steering wheel rim, airbag boss, grip sections | High-touch black automotive leather finish. | $1024 \times 1024$ |
| `MAT_Dashboard_Trim` | Dashboard upper deck, cowl, display bezel | Soft-touch graphite dash and satin accents. | $1024 \times 1024$ |

---

## 7. Permitted Camera Angles & Viewport Calibration

Astra must verify all renders and viewer viewpoints against these four calibrated positions:

1. **`hero_driver` (Driver 3/4 Hero)**:
   - *Reference*: `AUTOLAB_LEXUS_SEAT_REFERENCE_PACK/01_FRONT_SEAT_COMPLETE/LEXUS_RX_2020_GALLERY_08.jpg` & `LEXUS_RX_2020_GALLERY_29.jpg`.
   - *Framing*: Full view of driver seat through open door angle, showing headrest, bolster profile, center insert, and power switch base.
2. **`seam_macro` (Stitch & Perforation Macro)**:
   - *Reference*: `AUTOLAB_LEXUS_SEAT_REFERENCE_PACK/03_BOLSTERS_HEADREST_AND_STITCHING/LEXUS_RX_2020_GALLERY_31.jpg`.
   - *Framing*: Close-up on cushion bolster seam, showing stitch definition, seam recess, and leather micro-grain.
3. **`cabin_pair` (Dual Front Seats Overview)**:
   - *Reference*: `AUTOLAB_LEXUS_SEAT_REFERENCE_PACK/04_FRONT_SEAT_PAIR/LEXUS_RX_2020_GALLERY_07.jpg` & `LEXUS_RX_2020_GALLERY_30.jpg`.
   - *Framing*: Cockpit perspective from center console showing both driver and passenger seats, steering wheel, and dashboard cowl.
4. **`driver_cockpit` (Driver Ingress Perspective)**:
   - *Reference*: `AUTOLAB_LEXUS_SEAT_REFERENCE_PACK/01_FRONT_SEAT_COMPLETE/LEXUS_RX_2020_GALLERY_23.jpg` & `LEXUS_RX_2020_GALLERY_33.jpg`.
   - *Framing*: Steering wheel and driver seat relationship from the door entrance.

---

## 8. Provisional Performance Budgets

Performance budgets are **provisional targets**, not arbitrary caps that compromise visible upholstery quality. Hard limits will be established only after testing representative assets on actual mid-range mobile devices:

| Metric | Provisional Target | Provisional Ceiling | Notes |
| :--- | :--- | :--- | :--- |
| **Driver Seat Prototype** | $\approx 16,000\text{--}24,000$ tris | $35,000$ tris | Prioritize smooth bolster curvature and seam legibility over premature decimation. |
| **Full Locked Scope (Seats + Cockpit)** | $\approx 45,000\text{--}60,000$ tris | $80,000$ tris | Driver seat, passenger seat, stitching, steering wheel, dashboard cowl. |
| **Draw Calls** | $\le 6$ calls | $12$ calls | Consolidated via shared materials. |
| **Transferred Asset Size (Draco)** | $\le 2.5\text{--}3.5\text{ MB}$ | $5.0\text{ MB}$ | Efficient geometry compression. |
| **Decoded Texture Memory** | $\le 24\text{--}32\text{ MB}$ | $48\text{ MB}$ | Based on $1024 \times 1024$ mobile texture tier. |
| **Target Frame Rate** | $60\text{ FPS}$ desktop / fluid mobile | $\ge 30\text{ FPS}$ mobile | Subject to real mobile hardware validation; no unsupported blanket guarantees. |
| **Authoring Methodology** | Headless Python Script | Blender 5.2.2 LTS | Reproducible pipeline via `tools/build-lexus-asset.py`. |
