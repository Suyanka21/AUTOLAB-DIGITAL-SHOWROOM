# ASTRA PRODUCTION HANDOFF DIRECTIVE
**Master Production Specification for Downstream AI Implementation Agent**  
**Designation:** `docs/ASTRA_HANDOFF.md`  
**Author:** Antigravity (Preparation Agent)  
**Target:** Astra (Production & 3D Engineering Agent)  
**Date:** October 2026  
**Status:** CODIFIED & GOVERNANCE-CLEANSED  

---

```
========================================================================================
                          AUTOLAB DIGITAL SHOWROOM
                  CANONICAL PRODUCTION HANDOFF DIRECTIVE
========================================================================================
```

## GOVERNANCE MANDATE FOR ASTRA
> **Astra builds only what has been approved.**
> Astra must strictly separate:
> 1. **CONFIRMED V1 REQUIREMENTS** (Derived from Product Blueprint & Decision Freeze);
> 2. **PROPOSED / UNCONFIRMED OPTIONS** (Research options awaiting AutoLab sign-off);
> 3. **3D PRODUCTION REQUIREMENTS** (Asset geometry, scene graph & shaders Astra must model);
> 4. **FUTURE EXPANSION IDEAS** (Strictly excluded from V1).

---

## 1. PROJECT & MISSION (CONFIRMED)
* **What it is:** The **AutoLab Digital Showroom** is a bespoke, real-time 3D interactive interior visualization and configuration experience created for **AutoLab**, a premier luxury automotive reupholstery and interior transformation atelier in Nairobi, Kenya.
* **Why it exists:** To allow prospective clients to experience, configure, and visualize their vehicle interior transformation before physical work begins in the workshop, converting visual interest into qualified showroom visits and consultative sales conversations.
* **North Star:** *"Visualise the transformation before you commit to it."*

---

## 2. CONFIRMED V1 CONFIGURATION FLOW
The confirmed V1 configuration workflow from the Product Blueprint is strictly:

```
[ 1. MATERIAL ] ──▶ [ 2. COLOUR ] ──▶ [ 3. ACCENT THREAD ] ──▶ [ 4. INTERIOR COMPOSITION ]
```

| Dimension | Confirmed Status | Implementation Boundary |
| :--- | :--- | :--- |
| **1. Material** | **CONFIRMED V1** | **Leather** is the confirmed primary category. Fabric is supported where backed by catalogue. |
| **2. Colour** | **CONFIRMED V1 DIMENSION** | The *dimension* is confirmed; specific color swatches are **PROPOSED CANDIDATES** awaiting AutoLab sign-off (Gate 3). |
| **3. Accent Thread** | **CONFIRMED V1 DIMENSION** | The *dimension* is confirmed; specific thread hues and stitch patterns are **PROPOSED CANDIDATES** awaiting AutoLab sign-off (Gate 4). |
| **4. Interior Composition** | **CONFIRMED V1 DIMENSION** | Visual representation of the customer's design as a coherent interior composition (e.g., monotone hide, duotone split, or fluted package). |

---

## 3. PROPOSED / UNCONFIRMED OPTIONS (AWAITING AUTOLAB APPROVAL)
The following research-derived items are **PROPOSED CANDIDATES ONLY**. Astra must not treat them as frozen AutoLab catalog offerings until signed off under the specified Human Approval Gate:

* **Proposed Leather Colors (GATE-03):** OEM codes (Black 501A, Sienna Brown 502A, Macchiato Beige 505A, Carmine Red) and bespoke shades (Cognac Tan, Royal Oxblood, Nairobi Emerald) are proposed candidates. AutoLab must confirm which specific hides are in workshop stock.
* **Proposed Trim Veneers (GATE-02 & GATE-05):** Open-Pore Poplar, Walnut, Piano Lacquer, and Forged Carbon are proposed materials. Customer veneer swappability in V1 is unconfirmed.
* **Proposed Accent Stitching & Patterns (GATE-04):** Champagne Gold, Silver Shadow, Burnt Amber, Crimson Red, diamond quilting, and french seam are proposed machine patterns pending workshop confirmation.
* **Active Ambient Lighting (GATE-05):** The 253-LED ambient fiber loop is a **feature of the 3D vehicle asset**. Allowing customers to dynamically toggle 64 ambient color channels is an **UNCONFIRMED V1 feature**.
* **Additional Interior Zones (GATE-05):** Separate customer customization of steering wheel rim, door cards, and console knee pads requires Gate 5 confirmation.
* **AutoLab Brand Assets & Contact (GATE-06 & GATE-07):** Official vector logo and official WhatsApp Business telephone number require client delivery.

---

## 4. 3D PRODUCTION REQUIREMENTS (ASTRA MUST BUILD IN BLENDER)
Astra owns 3D asset authoring. The asset must be built so that it is geometrically complete and capable of configuration:

* **Platform Baseline:** Mercedes-Benz S-Class (Seventh Generation — Series 223).
* **Selected Chassis:** **V223 (Long Wheelbase)** in AMG-Line specification (MY 2021–2025 portrait OLED baseline).
* **Metric Scale (Exact):** Wheelbase: 3,216 mm | Overall Length: 5,289 mm | Width: 1,954 mm | Height: 1,503 mm | Central Screen: 12.8 in diagonal (60° inclination) | Driver Cluster: 12.3 in diagonal.
* **Interior Scope:** Full cabin cockpit, steering wheel, front multicontour seats, rear executive suite (43.5° recline kinematics), center console tunnel, door panels, and 253-LED ambient fiber strip.
* **Scene Graph Standard:** Exact node naming matching `docs/3d-assets/interior-component-map.md` (`GEO_*`, `MAT_*`, `RIG_*`).
* **Material Slot Decoupling:** Mesh primitives must bind to generic slots (`MAT_Upholstery_Primary`, `MAT_Upholstery_Secondary`, `MAT_Trim_Deck_Main`, `MAT_Stitch_Thread`, `EMISSIVE_Ambient_Lighting`) so colors and textures swap programmatically without mesh rebuilds.
* **Format & Performance Budgets:** Single Draco-compressed binary glTF (`interior.glb`) < 15MB with composite ORM textures; < 350,000 triangles; < 65 draw calls.
* **Zero-Purchase Mandate:** Astra must model in Blender first. Only the **Hum3D S-Class LWB Commercial Royalty-Free model ($295–$885)** is evaluated as commercial contingency. Stock models with *Editorial Use Only* licenses are strictly prohibited.
* **Trademark Anonymization:** Mercedes three-pointed star, Maybach logo, and Burmester badging must reside on detachable sub-nodes with neutral AutoLab insignia fallbacks.

---

## 5. APPLICATION & SALES HANDOFF (CONFIRMED V1 ARCHITECTURE)
* **Stack:** Next.js 14 App Router, TypeScript (Strict), Tailwind CSS, Three.js / React Three Fiber.
* **Design Aesthetic:** Anti-AI compliant luxury dark mode (Obsidian `#08090C`, Champagne Gold `#D4AF37`, editorial typography).
* **Summary & Reference Code:** Generates unique deterministic Reference Code (`AL-SC-2026-XXXX`) carrying the client's choices.
* **Sales Handoff:**
  1. WhatsApp direct link (`https://wa.me/{NUMBER}?text={ENCODED_MESSAGE}`) pre-populated with configuration details.
  2. Showroom consultation booking form.
  3. Advisor reference lookup (`/admin`).
* **Lean Backend:** Supabase PostgreSQL / Firebase Firestore persisting `configurations`, `enquiries`, and `analytics_events`.

---

## 6. FUTURE EXPANSION IDEAS (STRICTLY EXCLUDED FROM V1)
Astra and downstream developers must **NOT** implement:
* Exterior vehicle modeling, wheels, suspension, or car bodies.
* Additional vehicles (Range Rover, Toyota Hilux) — these enter in Phase 2 via the vehicle-asset pipeline.
* Before/after interactive transformation slider (Phase 4).
* Automated quotation engines or dynamic price calculators.
* E-commerce checkout, shopping carts, or online payment gateways.
* Generic automotive platform features: VIN decoders, vehicle databases, marketplace grids.
* Mandatory customer accounts or login walls.

---

## 7. IMMEDIATE ACTION FOR ASTRA
1. **Consume:** Read this handoff and [`docs/production-plan.md`](production-plan.md).
2. **Phase 1 (Blender):** Construct the interior metric bounding cage for the V223 LWB (Wheelbase: 3,216 mm) per [`docs/3d-assets/blender-production-pipeline.md`](3d-assets/blender-production-pipeline.md).
3. **Phase 2 (Mesh & Slots):** Model the interior cabin, decouple material slots, and rig kinematic pivots.
4. **Phase 3 (Export):** Export Draco-compressed `interior.glb` to [`public/assets/3d/s-class-v223/`](file:///c:/Users/user/OneDrive/Desktop/AUTOLAB-DIGITAL-SHOWROOM/public/assets/3d/s-class-v223/).
5. **Phase 4 (Viewer):** Bind the 3D asset in React Three Fiber and connect the confirmed V1 configuration flow.
