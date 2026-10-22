# Lexus RX 350 Demonstration Scope & Technical Architecture

**Document:** `docs/LEXUS_DEMO_SCOPE_AND_ARCHITECTURE.md`  
**Date:** 2026-10-22 (Reconciled & Corrected)  
**Status:** ARCHITECTURAL SPECIFICATION — APPROVED BASELINE  
**Inspiration:** [carseatcover.eu](https://carseatcover.eu/) product-focused customisation  

---

## 1. Architectural Overview & System Model

The AutoLab Digital Showroom architecture for the **2020 Lexus RX 350** combines an ultra-fast React 19 / Next.js 16 luxury 2D configurator shell with a bounded, high-performance React Three Fiber (R3F) WebGL canvas.

```
┌────────────────────────────────────────────────────────────────────────┐
│                   AUTOLAB ATELIER APPLICATION SHELL                    │
│                                                                        │
│  ┌───────────────────────┐  ┌───────────────────────────────────────┐  │
│  │   2D ATELIER HEADER   │  │         ACTIVE CONFIGURATION          │  │
│  │   • AutoLab Identity  │  │         • Selected Leather Grade      │  │
│  │   • Lexus RX 350 AWD  │  │         • Primary & Secondary Hues    │  │
│  │   • Reference Code    │  │         • Contrast Accent Thread      │  │
│  └───────────────────────┘  └───────────────────────────────────────┘  │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │                  HYBRID VISUALIZATION STAGE                      │  │
│  │                                                                  │  │
│  │   ┌──────────────────────────────────────────────────────────┐   │  │
│  │   │  R3F WebGL Canvas (Orbit Bounded, RoomEnvironment PMREM) │   │  │
│  │   │                                                          │   │  │
│  │   │   [ Driver Front Seat ]       [ Passenger Front Seat ]   │   │  │
│  │   │   • MAT_Seat_Primary          • Symmetrical Pair         │   │  │
│  │   │   • MAT_Seat_Secondary        • Coordinated or Monotone  │   │  │
│  │   │   • MAT_Seat_Stitching                                   │   │  │
│  │   │                                                          │   │  │
│  │   │   [ Steering Wheel ]          [ Dashboard Cowl ]         │   │  │
│  │   │   • MAT_Steering_Leather      • MAT_Dashboard_Trim       │   │  │
│  │   │                                                          │   │  │
│  │   │   [ Studio Shadow Plane & Non-Distracting Enclosure ]    │   │  │
│  │   └──────────────────────────────────────────────────────────┘   │  │
│  │                                                                  │  │
│  │   ┌──────────────────────────────────────────────────────────┐   │  │
│  │   │  Camera Presets: Hero Driver | Seam Macro                │   │  │
│  │   │                  Cabin Pair  | Driver Ingress            │   │  │
│  │   └──────────────────────────────────────────────────────────┘   │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                                                                        │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │     CONFIGURATION DOCK (Material → Colour → Thread → Comp)       │  │
│  │     SUMMARY BAR (Real-time WhatsApp Atelier Booking Action)      │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Hybrid Implementation Strategy

Per Manus research recommendations and approved owner direction, AutoLab adopts a **focused hybrid strategy**:
1. **Interactive 3D Seating (Primary Touchpoint)**: Full 3D interactive customisation for the two front seats where material, texture, grain, and contrast stitching are manipulated live.
2. **Cockpit Touchpoints (Scale & Context)**: Lightweight, calibrated 3D representations of the steering wheel and dashboard upper deck to ground the seats in an authentic Lexus interior without recreating unseen mechanics.
3. **Internal Photographic Reference Anchors**: Authentic dealership photographs from `AUTOLAB_LEXUS_SEAT_REFERENCE_PACK/` serve exclusively as **internal modeling and design references** to guide proportional accuracy and camera alignment. They are **not** displayed in the public client application.

### Why This Maximizes Commercial Value
- **Zero Distraction**: The customer's gaze is anchored on the craftsmanship of the upholstery, stitching, and bolster contrast.
- **Efficient Performance Overhead**: By focusing geometry on primary touchpoints rather than an entire vehicle cabin, mobile device resource consumption is minimized without compromising surface curvature or seam legibility.
- **Zero Speculative Modeling**: Eliminates the 4 unresolved S-Class material slots, complex waterfall console kinematics, and unverified door-panel geometry.

---

## 3. Semantic Material Zones vs. Mesh Topology

To ensure high visual quality and avoid artificial modeling constraints:
- Astra is **not** restricted to an artificially small number of monolithic mesh nodes.
- Astra may structure the seats and cockpit into multiple sub-meshes or separate objects (e.g. cushion insert, backrest insert, outer bolsters, headrest, power controls, seam splines) to achieve optimal edge flow and clean normal baking.
- All sub-meshes must bind cleanly to the designated **semantic material zones**:

| Semantic Material Zone | Associated Geometry / Surfaces | Customisation Function | Texture Resolution |
| :--- | :--- | :--- | :--- |
| `MAT_Seat_Primary` | Center cushion flutes, center backrest insert | Main customer leather hide selection. | $1024 \times 1024$ (Albedo, Normal, ORM) |
| `MAT_Seat_Secondary` | Outer side bolsters, headrest cushion, cushion side bands | Secondary/contrast bolster leather hue. | $1024 \times 1024$ (Albedo, Normal, ORM) |
| `MAT_Seat_Stitching` | Dedicated perimeter seam and accent thread geometry | Real-time accent thread recolouring. | Base Color Tint |
| `MAT_Steering_Leather` | Steering wheel rim, airbag boss, grip sections | High-touch black automotive leather finish. | $1024 \times 1024$ |
| `MAT_Dashboard_Trim` | Dashboard upper deck, cowl, display bezel | Soft-touch graphite dash and satin accents. | $1024 \times 1024$ |

---

## 4. Scene Manifest Target Nodes & Reference Mappings

The scene manifest specifies five core functional modules, mapped to verified photographic references from `AUTOLAB_LEXUS_SEAT_REFERENCE_PACK/IMAGE_MANIFEST.csv`:

| Node Identifier | Module | Description | Semantic Material Zone(s) | Verified Photographic Reference(s) |
| :--- | :--- | :--- | :--- | :--- |
| `GEO_Seat_Front_Driver` | Seating | Driver bucket seat: center fluted insert, side bolsters, headrest cushion, power switch side trim. | `MAT_Seat_Primary`, `MAT_Seat_Secondary` | `AUTOLAB_LEXUS_SEAT_REFERENCE_PACK/01_FRONT_SEAT_COMPLETE/LEXUS_RX_2020_GALLERY_08.jpg`<br>`AUTOLAB_LEXUS_SEAT_REFERENCE_PACK/01_FRONT_SEAT_COMPLETE/LEXUS_RX_2020_GALLERY_23.jpg`<br>`AUTOLAB_LEXUS_SEAT_REFERENCE_PACK/01_FRONT_SEAT_COMPLETE/LEXUS_RX_2020_GALLERY_29.jpg` |
| `GEO_Seat_Front_Passenger` | Seating | Passenger bucket seat: symmetrical counterpart forming the front cabin pair. | `MAT_Seat_Primary`, `MAT_Seat_Secondary` | `AUTOLAB_LEXUS_SEAT_REFERENCE_PACK/04_FRONT_SEAT_PAIR/LEXUS_RX_2020_GALLERY_07.jpg`<br>`AUTOLAB_LEXUS_SEAT_REFERENCE_PACK/04_FRONT_SEAT_PAIR/LEXUS_RX_2020_GALLERY_30.jpg` |
| `GEO_Seat_Stitching_Front` | Seating | Dedicated perimeter and seam geometry for real-time thread recolouring (Decision D1). | `MAT_Seat_Stitching` | `AUTOLAB_LEXUS_SEAT_REFERENCE_PACK/03_BOLSTERS_HEADREST_AND_STITCHING/LEXUS_RX_2020_GALLERY_31.jpg` |
| `GEO_SteeringWheel_Lexus` | Cockpit | 3-spoke Lexus steering wheel with airbag boss, thumb rests, and perforated grips. | `MAT_Steering_Leather` | `AUTOLAB_LEXUS_SEAT_REFERENCE_PACK/05_DASHBOARD_AND_TRIM/LEXUS_RX_2020_GALLERY_16.jpg`<br>`AUTOLAB_LEXUS_SEAT_REFERENCE_PACK/01_FRONT_SEAT_COMPLETE/LEXUS_RX_2020_GALLERY_33.jpg` |
| `GEO_Dashboard_Lexus` | Cockpit | Upper dashboard deck, instrument binnacle cowl, and central display screen bezel. | `MAT_Dashboard_Trim` | `AUTOLAB_LEXUS_SEAT_REFERENCE_PACK/05_DASHBOARD_AND_TRIM/LEXUS_RX_2020_GALLERY_34.jpg`<br>`AUTOLAB_LEXUS_SEAT_REFERENCE_PACK/05_DASHBOARD_AND_TRIM/LEXUS_RX_2020_GALLERY_35.jpg` |
| `GEO_Studio_Enclosure` | Environment | Dark neutral floor and soft radial shadow plane terminating the cockpit base. | `MAT_Studio_Shadow` | Studio Baseline |

---

## 5. Geometry Classification & Modeling Precision

To maintain absolute transparency and prevent unsupported precision assertions:

1. **Photographically Verified**:
   - Seat silhouette, headrest forward tilt, outer bolster curvature, fluted center insert segmentation.
   - Steering wheel 3-spoke profile, airbag hub, and control placement.
   - Dashboard upper cowl sweep and central display bezel position.
2. **Reasonable Visual Approximation**:
   - Fluting seam depression depth, groove radius, bolster soft-edge bevels.
   - Stitch thread thickness and spacing; micro-perforation density.
   - Inboard seat bolster contour and lower seat track skirt interface.
3. **Unverified & Excluded (Strict Scope Boundary)**:
   - Seat underside, mounting tracks, motor actuators, wiring harnesses.
   - Internal seat frame, rear seatback latches, mechanical steering column.
   - Door panels, floor carpeting, pillars, headliner, and rear seating.

---

## 6. Bounded Camera Presets & Calibration

Unrestricted camera orbit is strictly prevented. Four calibrated viewpoints are defined based directly on Herb Chambers Lexus reference photographs:

| Preset ID | Label | View Description | Primary Reference Datum | Target Focal Area |
| :--- | :--- | :--- | :--- | :--- |
| `hero_driver` | **Driver Hero** | Front three-quarter view showing full driver seat, headrest, outer bolster, and door ingress profile. | `AUTOLAB_LEXUS_SEAT_REFERENCE_PACK/01_FRONT_SEAT_COMPLETE/LEXUS_RX_2020_GALLERY_08.jpg`<br>`AUTOLAB_LEXUS_SEAT_REFERENCE_PACK/01_FRONT_SEAT_COMPLETE/LEXUS_RX_2020_GALLERY_29.jpg` | Driver seat center cushion $(X: -0.38, Y: 0.65, Z: 0.10)$ |
| `seam_macro` | **Stitch Detail** | Close-up macro view focusing on cushion bolster transition, perforations, and double-stitched seam. | `AUTOLAB_LEXUS_SEAT_REFERENCE_PACK/03_BOLSTERS_HEADREST_AND_STITCHING/LEXUS_RX_2020_GALLERY_31.jpg` | Bolster seam junction $(X: -0.28, Y: 0.55, Z: 0.20)$ |
| `cabin_pair` | **Cabin Pair** | Wide cockpit view from center rear showing both driver and passenger seats, console spacing, and steering wheel. | `AUTOLAB_LEXUS_SEAT_REFERENCE_PACK/04_FRONT_SEAT_PAIR/LEXUS_RX_2020_GALLERY_07.jpg`<br>`AUTOLAB_LEXUS_SEAT_REFERENCE_PACK/04_FRONT_SEAT_PAIR/LEXUS_RX_2020_GALLERY_30.jpg` | Console centerline $(X: 0.00, Y: 0.70, Z: 0.00)$ |
| `driver_cockpit`| **Driver Ingress**| Eye-level perspective through open driver door showing steering wheel relationship and seat cushion base. | `AUTOLAB_LEXUS_SEAT_REFERENCE_PACK/01_FRONT_SEAT_COMPLETE/LEXUS_RX_2020_GALLERY_23.jpg`<br>`AUTOLAB_LEXUS_SEAT_REFERENCE_PACK/01_FRONT_SEAT_COMPLETE/LEXUS_RX_2020_GALLERY_33.jpg` | Steering wheel / headrest $(X: -0.35, Y: 0.85, Z: -0.15)$ |

---

## 7. Provisional Performance Targets

Performance metrics are **provisional engineering targets**, not arbitrary caps that force premature decimation. Hard limits will be established only after testing representative prototype assets on actual mid-range mobile devices:

| Metric | Provisional Target | Provisional Ceiling | Notes |
| :--- | :--- | :--- | :--- |
| **Driver Seat Prototype** | $\approx 16,000\text{--}24,000$ tris | $35,000$ tris | Prioritize smooth bolster curvature and seam legibility over aggressive optimization. |
| **Full Locked Scope (Seats + Cockpit)** | $\approx 45,000\text{--}60,000$ tris | $80,000$ tris | Complete front seats, stitching, steering wheel, and dashboard upper deck. |
| **Draw Calls** | $\le 6$ calls | $12$ calls | Consolidated via shared PBR materials. |
| **Transferred Asset Size (Draco)** | $\le 2.5\text{--}3.5\text{ MB}$ | $5.0\text{ MB}$ | Draco geometry compression. |
| **Decoded Texture Memory** | $\le 24\text{--}32\text{ MB}$ | $48\text{ MB}$ | Based on $1024 \times 1024$ mobile texture tier. |
| **Frame Rate** | $60\text{ FPS}$ desktop / fluid mobile | $\ge 30\text{ FPS}$ mobile | To be verified via real mobile hardware testing; no unsupported blanket guarantees. |
