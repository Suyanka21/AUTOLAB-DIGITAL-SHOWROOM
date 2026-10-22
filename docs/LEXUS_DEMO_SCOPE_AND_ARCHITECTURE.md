# Lexus RX 350 Demonstration Scope & Technical Architecture

**Document:** `docs/LEXUS_DEMO_SCOPE_AND_ARCHITECTURE.md`  
**Date:** 2026-10-22  
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
│  │   │   [ GEO_Seat_Front_Driver ]   [ GEO_Seat_Front_Pass ]    │   │  │
│  │   │   • MAT_Seat_Primary          • Synced/Independent      │   │  │
│  │   │   • MAT_Seat_Secondary        • Symmetrical Pair         │   │  │
│  │   │   • MAT_Seat_Stitching                                   │   │  │
│  │   │                                                          │   │  │
│  │   │   [ GEO_SteeringWheel_Lexus ] [ GEO_Dashboard_Lexus ]    │   │  │
│  │   │   • Tactile scale anchor      • Bounded cockpit framing  │   │  │
│  │   │                                                          │   │  │
│  │   │   [ Studio Floor Backdrop & Soft Vignette Enclosure ]    │   │  │
│  │   └──────────────────────────────────────────────────────────┘   │  │
│  │                                                                  │  │
│  │   ┌──────────────────────────────────────────────────────────┐   │  │
│  │   │  Camera Presets: Hero (LRX-08) | Seam Macro (LRX-31)    │   │  │
│  │   │                  Pair View (LRX-30) | Ingress (LRX-23)   │   │  │
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
1. **Interactive 3D Seating (Hero Touchpoint)**: Full 3D interactive customisation for the two front seats where material, texture, grain, and contrast stitching are manipulated live.
2. **Cockpit Touchpoints (Scale & Context)**: Lightweight, calibrated 3D representations of the steering wheel and dashboard upper deck to ground the seats in an authentic Lexus interior without recreating unseen mechanics.
3. **Calibrated Reference Photography**: High-resolution gallery photographs from `AUTOLAB_LEXUS_SEAT_REFERENCE_PACK/` integrated into the UI for vehicle authentication and material reference.

### Why This Maximizes Commercial Value
- **Zero Distraction**: The customer's gaze is anchored on the craftsmanship of the upholstery, stitching, and bolster contrast.
- **Flawless Mobile Performance**: With ~35,000–50,000 triangles instead of 350,000, 60 FPS is guaranteed even on mid-range smartphones in Kenya (e.g. Tecno, Infinix, Samsung A-series).
- **Zero Speculative Modeling**: Eliminates the 4 unresolved S-Class material slots, complex waterfall console kinematics, and unverified door-panel geometry.

---

## 3. Scene Graph & Manifest Geometry Nodes

The new Lexus RX 350 scene manifest defines only visible, purposeful nodes:

| Node Identifier | Module | Description | Material Slot | Reference Image |
| :--- | :--- | :--- | :--- | :--- |
| `GEO_Seat_Front_Driver` | Seating | Driver bucket seat: center fluted insert, side bolsters, headrest cushion, power switch side trim. | `MAT_Seat_Primary`, `MAT_Seat_Secondary` | `LRX-08`, `LRX-23`, `LRX-29` |
| `GEO_Seat_Front_Passenger` | Seating | Passenger bucket seat: symmetrical counterpart forming the front cabin pair. | `MAT_Seat_Primary`, `MAT_Seat_Secondary` | `LRX-07`, `LRX-30` |
| `GEO_Seat_Stitching_Front` | Seating | Dedicated perimeter and seam geometry for real-time thread recolouring (per Decision D1). | `MAT_Seat_Stitching` | `LRX-31` |
| `GEO_SteeringWheel_Lexus` | Cockpit | 3-spoke Lexus steering wheel with airbag boss, thumb rests, and perforated grips. | `MAT_Steering_Leather` | `LRX-16`, `LRX-33` |
| `GEO_Dashboard_Lexus` | Cockpit | Upper dashboard deck, instrument binnacle cowl, and central display screen bezel. | `MAT_Dashboard_Trim` | `LRX-34`, `LRX-35` |
| `GEO_Studio_Enclosure` | Environment | Dark neutral floor and soft radial shadow plane terminating the cockpit base. | `MAT_Studio_Shadow` | Studio Baseline |

---

## 4. Material Zoning & Customisation Rules

AutoLab's 4-step configuration sequence binds directly to these discrete material slots:

```
Step 1: MATERIAL  ──▶ Sets physical shader properties (Roughness, IOR, Micro-perforation normal)
Step 2: COLOUR    ──▶ Sets base color of MAT_Seat_Primary (Center inserts & main cushion)
Step 3: THREAD    ──▶ Sets base color of MAT_Seat_Stitching (Perimeter & bolster seams)
Step 4: COMP      ──▶ Monotone: MAT_Seat_Secondary matches Primary
                      Duotone:  MAT_Seat_Secondary receives contrasting bolster hue
                      Executive: Piping highlights with contrast stitch accent
```

---

## 5. Bounded Camera Presets & Calibration

Unrestricted camera orbit is strictly prevented to avoid exposing unmodeled rear/underside geometry. Four calibrated viewpoints are defined based directly on Herb Chambers Lexus reference photographs:

| Preset ID | Label | View Description | Reference Datum | Target Focal Point |
| :--- | :--- | :--- | :--- | :--- |
| `hero_driver` | **Driver Hero** | Front three-quarter view showing full driver seat, headrest, outer bolster, and door ingress profile. | `LRX-08`, `LRX-29` | Seat center cushion $(X: -0.38, Y: 0.65, Z: 0.10)$ |
| `seam_macro` | **Stitch Detail** | Close-up macro view focusing on cushion bolster transition, perforations, and double-stitched seam. | `LRX-31` | Bolster junction $(X: -0.28, Y: 0.55, Z: 0.20)$ |
| `cabin_pair` | **Cabin Pair** | Wide cockpit view from center rear showing both driver and passenger seats, console spacing, and steering wheel. | `LRX-07`, `LRX-30` | Console centerline $(X: 0.00, Y: 0.70, Z: 0.00)$ |
| `driver_cockpit`| **Driver Ingress**| Eye-level perspective through open driver door showing steering wheel relationship and seat cushion base. | `LRX-23`, `LRX-33` | Driver headrest / wheel $(X: -0.35, Y: 0.85, Z: -0.15)$ |

---

## 6. Rigorous Technical Budgets

| Metric | Target Budget | Hard Maximum Ceiling | Expected Lexus Asset Metric |
| :--- | :--- | :--- | :--- |
| **Total Triangles** | $\le 45,000$ | $80,000$ | $\approx 36,000$ (Seating 26k, Steering 6k, Dash 4k) |
| **Draw Calls** | $\le 6$ | $12$ | $5$ draw calls |
| **GLB File Size (Draco)** | $\le 2.5\text{ MB}$ | $5.0\text{ MB}$ | $\approx 1.8\text{ MB}$ |
| **Texture Tier (Mobile)** | $1024 \times 1024$ | $2048 \times 2048$ | $1024\text{ px}$ (Nappa normal, roughness, ORM) |
| **GPU Texture Memory** | $\le 24\text{ MB}$ | $48\text{ MB}$ | $\approx 18\text{ MB}$ |
| **Frame Rate** | $60\text{ FPS}$ | $60\text{ FPS}$ | Rock-solid on mid-tier mobile |
