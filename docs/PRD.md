# Product Requirements Document (PRD)
## Project Name: AutoLab Digital Showroom
### Version: 1.0.0 (Astra Production Baseline)
### Status: FROZEN & CODIFIED
### Target Vehicle: Mercedes-Benz S-Class (Seventh Generation — V223 LWB)

---

## 1. Executive Summary & Product Vision

**AutoLab Digital Showroom** is a bespoke, real-time 3D automotive interior visualization and configuration experience built for **AutoLab**, a premier luxury automotive customisation and interior reupholstery atelier in Nairobi, Kenya.

AutoLab clients frequently desire to transform tired or factory interiors into personalized luxury sanctuaries, but struggle to imagine the finished composition before physical craftsmanship begins. The Digital Showroom enables clients to **participate in the design process and visualize their interior transformation in real-time 3D**, turning visual curiosity into qualified showroom visits and consultative sales conversations.

> **North Star:** *"Visualise the transformation before you commit to it."*

---

## 2. Core Personas

- **The Luxury Vehicle Owner (Primary Client):** Owns a premium luxury vehicle (Mercedes S-Class, Range Rover, Land Cruiser) in East Africa. Desires bespoke personalisation (Nappa leather, diamond quilting, exotic wood/carbon veneers) and wants visual certainty before committing vehicle to the workshop.
- **AutoLab Sales Advisor (Internal User):** Consults with clients, inspects vehicles physically, and prepares leather hide swatches matching client reference codes (`AL-SC-2026-XXXX`).
- **Production AI Agent (Astra):** Ingests this PRD and technical specs to produce the 3D assets in Blender and build the application shell.

---

## 3. Product User Journey & Navigation Flow

```
[ Prospective Client ]
          │
          ▼
   / (Digital Showroom Atelier Shell)
          │
          ├──▶ 3D Interior Viewport (Real-time WebGL, 360° Orbit, 6 Camera Presets)
          │
          ├──▶ Configuration Dock (Material ➔ Colour ➔ Accent Thread ➔ Interior Composition)
          │
          ├──▶ Real-time Summary Sheet (Reference Code: AL-SC-2026-XXXX)
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
- Deep obsidian dark mode (`#08090C`) with subtle warm champagne gold accents (`#D4AF37`).
- Viewport toggle between 3D canvas, configuration dock, and preset controls.

### 4.2 Module 02: Interactive 3D Interior Viewer
- Three.js / React Three Fiber WebGL canvas loading Draco-compressed `interior.glb`.
- Bounded orbit controls preventing disorientation or floor clipping.
- Six calibrated viewpoint presets: Cockpit Master, Driver Cockpit, Center Console, Front Seating, Rear Executive Suite, and Night Ambient Mode.

### 4.3 Module 03: Configuration Engine (Confirmed V1 Flow)
- Confirmed 4-step sequence: **Material ➔ Colour ➔ Accent Thread ➔ Interior Composition**.
- Real-time material uniform updates in < 16ms without model reloads on tagged material slots (`MAT_Upholstery_Primary`, etc.).
- Extended zones (veneers, steering wheel, secondary bolsters) and ambient color switching are supported by 3D asset architecture but remain conditionally disabled until Gate 5 confirmation.

### 4.4 Module 04: Material & Color Catalogue (Proposed Candidates)
- Primary Category: Confirmed as **Leather** (Fabric secondary where supported).
- Specific leather colors, wood veneers, and accent threads are **PROPOSED candidates** pending AutoLab signoff (Gates 2, 3, 4).
- Zero unapproved AutoLab offerings are presented as available options.

### 4.5 Module 05: Configuration Summary & Reference Code
- Client-side summary generation with deterministic reference code `AL-SC-2026-[HASH4]`.
- Exportable/shareable configuration card.

### 4.6 Module 06: Sales Consultation Handoff
- Direct WhatsApp launch pre-filled with configuration details.
- Showroom consultation appointment request persisting voluntary contact info to database.

### 4.7 Module 07: Lean Backend & Admin
- Supabase PostgreSQL / Firebase Firestore storing `configurations`, `enquiries`, and `analytics_events`.
- Internal advisor lookup tool (`/admin`) for retrieving saved configurations by reference code.

---

## 5. Non-Functional & Quality Standards

1. **Defensive Engineering (CodeRabbit DNA):** Every async data call renders a Loading state, Empty state, and Error state with retry capabilities.
2. **WebGL Performance:** Steady 60 FPS desktop, 30–60 FPS mobile; master asset < 15MB uncompressed (< 5MB Draco compressed); < 350,000 triangles.
3. **Accessibility:** WCAG AA contrast standards, keyboard focus rings (`focus-visible:ring-2`), ARIA labels on all swatches and controls.
4. **Mobile Responsiveness:** Touch-optimized orbit gestures, swipeable preset bar, zero horizontal scroll overflow.

---

## 6. Document Cross-References

* **System Architecture:** [`docs/architecture.md`](architecture.md)
* **Design System Tokens:** [`docs/design-system.md`](design-system.md)
* **Astra Master Directive:** [`docs/ASTRA_HANDOFF.md`](ASTRA_HANDOFF.md)
* **Decision Freeze & Scope:** [`docs/product/decision-freeze-and-scope.md`](product/decision-freeze-and-scope.md)
* **3D Specification:** [`docs/3d-assets/s-class-3d-specification.md`](3d-assets/s-class-3d-specification.md)
* **Human Approval Gates:** [`docs/human-approval-gates.md`](human-approval-gates.md)
