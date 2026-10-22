# Product Requirements Document (PRD)
## Project Name: AutoLab Digital Showroom
### Version: 2.0.0 (Lexus RX 350 Rebaseline)
### Status: APPROVED & CODIFIED
### Target Vehicle: 2020 Lexus RX 350 AWD (Superseding Mercedes-Benz S-Class V223)

---

## 1. Executive Summary & Product Vision

**AutoLab Digital Showroom** is a bespoke, real-time 3D automotive interior visualization and configuration experience built for **AutoLab**, a premier luxury automotive customisation and interior reupholstery atelier in Nairobi, Kenya.

AutoLab clients frequently desire to transform tired or factory interiors into personalized luxury sanctuaries, but struggle to imagine the finished composition before physical craftsmanship begins. The Digital Showroom enables clients to **participate in the design process and visualize their interior transformation in real-time 3D**, turning visual curiosity into qualified showroom visits and consultative sales conversations.

> **North Star:** *"Visualise the transformation before you commit to it."*

### Strategic Pivot (2026-10-22)
- **Flagship Vehicle**: **2020 Lexus RX 350 AWD** (Certified Pre-Owned, Stock `HLSPLC239309`).
- **Benchmark Inspiration**: Inspired by the product-focused customisation experience at **[carseatcover.eu](https://carseatcover.eu/)**.
- **Demonstration Objective**: Demonstrate AutoLab's upholstery craftsmanship, leather finishes, and contrast stitching on a focused set of primary touchpoints, rather than attempting a complete manufacturer-grade digital twin of an entire cabin.
- **Historical Record**: The previous Mercedes-Benz S-Class V223 full-cabin reconstruction is superseded due to excessive modeling overhead, persistent reference capture gaps, and divergence from core buyer customisation touchpoints. Details: [`docs/AUTOLAB_PIVOT_DECISION_RECORD.md`](AUTOLAB_PIVOT_DECISION_RECORD.md).

---

## 2. Core Personas

- **The Luxury SUV Owner (Primary Client):** Owns a premium luxury SUV (Lexus RX, Land Cruiser, Range Rover) in East Africa. Desires bespoke personalisation (Nappa leather, contrast bolsters, custom accent stitching) and wants visual certainty before committing vehicle to the workshop.
- **AutoLab Sales Advisor (Internal User):** Consults with clients, inspects vehicles physically, and prepares leather hide swatches matching client reference codes (`AL-SC-2026-XXXXXX`).
- **Production AI Agent (Astra):** Ingests this PRD and technical specs to produce the 3D assets in Blender and build the application shell.

---

## 3. Product User Journey & Navigation Flow

```
[ Prospective Client ]
          │
          ▼
   / (Digital Showroom Atelier Shell)
          │
          ├──▶ Hybrid Interior Viewport (Real-time WebGL, Bounded Orbit, 4 Calibrated Presets)
          │
          ├──▶ Configuration Dock (Material ➔ Colour ➔ Accent Thread ➔ Interior Composition)
          │
          ├──▶ Real-time Summary Sheet (Reference Code: AL-SC-2026-XXXXXX)
          │
          └──▶ Sales Handoff
                    │
                    ├──▶ WhatsApp Direct Atelier Link (Pre-populated context)
                    │
                    └──▶ Showroom Consultation Booking Form
```

---

## 4. Key Functional Modules

### 4.1 Module 01: Experience Shell
- Full-screen luxury atelier environment designed under Anti-AI Design standards.
- Deep obsidian dark mode (`#0B0B0B`) with dark graphite cards (`#141416`) and subtle electric cyan / champagne gold accents.
- Viewport toggle between 3D canvas, configuration dock, and preset controls.

### 4.2 Module 02: Interactive 3D Interior Viewer (Hybrid Approach)
- Three.js / React Three Fiber WebGL canvas loading Draco-compressed `lexus-interior.glb`.
- Bounded orbit controls preventing disorientation, floor clipping, or unmodeled void exposure.
- Four calibrated viewpoint presets derived from authentic Herb Chambers Lexus photography:
  1. **Driver 3/4 Hero** (`hero_driver`, derived from `LRX-08` / `LRX-29`).
  2. **Stitch & Seam Macro** (`seam_macro`, derived from `LRX-31`).
  3. **Cabin Dual-Seat Pair** (`cabin_pair`, derived from `LRX-07` / `LRX-30`).
  4. **Driver Ingress View** (`driver_cockpit`, derived from `LRX-23` / `LRX-33`).

### 4.3 Module 03: Configuration Engine (Confirmed 4-Step Flow)
- Confirmed sequence: **Material ➔ Colour ➔ Accent Thread ➔ Interior Composition**.
- Real-time material uniform updates in < 16ms without model reloads on tagged material slots:
  - `MAT_Seat_Primary`: Center cushion flutes and main backrest panel.
  - `MAT_Seat_Secondary`: Outer side bolsters and headrest cushion.
  - `MAT_Seat_Stitching`: Dedicated perimeter seam geometry for contrast thread recolouring.
  - `MAT_Steering_Leather`: Lexus 3-spoke steering wheel touchpoint.
  - `MAT_Dashboard_Trim`: Dashboard cowl and display bezel framing.

### 4.4 Module 04: Material & Color Catalogue
- Primary Category: Confirmed as **Leather** (Nappa, Classic Pebble, Semi-Aniline).
- Specific leather hide colors and accent threads are candidates awaiting AutoLab workshop signoff.
- Zero unapproved AutoLab offerings are presented as available options.

### 4.5 Module 05: Configuration Summary & Reference Code
- Client-side summary generation with deterministic reference code `AL-SC-2026-XXXXXX`.
- Exportable/shareable configuration summary card.

### 4.6 Module 06: Sales Consultation Handoff
- Direct WhatsApp launch pre-filled with configuration details.
- Showroom consultation appointment request persisting voluntary contact info to database.

---

## 5. Non-Functional & Quality Standards

1. **Defensive Engineering (CodeRabbit DNA):** Every async data call renders Loading, Empty, and Error states with retry capabilities.
2. **WebGL Performance:** Steady 60 FPS on desktop and mobile; master asset < 2.5 MB Draco compressed (< 45,000 triangles, $\le 6$ draw calls, $\le 24$ MB texture memory).
3. **Accessibility:** WCAG AA contrast standards, keyboard focus rings (`focus-visible:ring-2`), ARIA labels on all swatches and controls.
4. **Mobile Responsiveness:** Touch-optimized orbit gestures, swipeable preset bar, zero horizontal scroll overflow.

---

## 6. Document Cross-References

* **Pivot Decision Record:** [`docs/AUTOLAB_PIVOT_DECISION_RECORD.md`](AUTOLAB_PIVOT_DECISION_RECORD.md)
* **Reuse & Cleanup Audit:** [`docs/REPOSITORY_REUSE_AND_CLEANUP_AUDIT.md`](REPOSITORY_REUSE_AND_CLEANUP_AUDIT.md)
* **Lexus Scope & Architecture:** [`docs/LEXUS_DEMO_SCOPE_AND_ARCHITECTURE.md`](LEXUS_DEMO_SCOPE_AND_ARCHITECTURE.md)
* **Lexus Implementation Plan:** [`docs/LEXUS_IMPLEMENTATION_PLAN.md`](LEXUS_IMPLEMENTATION_PLAN.md)
* **Astra Lexus Directive:** [`docs/ASTRA_LEXUS_HANDOFF.md`](ASTRA_LEXUS_HANDOFF.md)
* **Reference Pack Atlas:** [`AUTOLAB_LEXUS_SEAT_REFERENCE_PACK/SEAT_REFERENCE_ATLAS.md`](file:///c:/Users/user/OneDrive/Desktop/AUTOLAB-DIGITAL-SHOWROOM/AUTOLAB_LEXUS_SEAT_REFERENCE_PACK/SEAT_REFERENCE_ATLAS.md)
