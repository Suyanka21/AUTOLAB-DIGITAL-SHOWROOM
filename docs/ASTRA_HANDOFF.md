# ASTRA PRODUCTION HANDOFF DIRECTIVE
**Master Production Specification for Downstream AI Implementation Agent**  
**Designation:** `docs/ASTRA_HANDOFF.md`  
**Author:** Antigravity (Integration & Preparation Agent)  
**Target:** Astra (Production & 3D Engineering Agent)  
**Status:** CODIFIED & CONFIRMED OWNER DECISIONS ALIGNED  

---

```
========================================================================================
                          AUTOLAB DIGITAL SHOWROOM
                  CANONICAL PRODUCTION HANDOFF DIRECTIVE
========================================================================================
```

## GOVERNANCE MANDATE FOR ASTRA
> **Astra builds only what has been approved.**
> Astra must strictly observe:
> 1. **CONFIRMED OWNER DECISIONS & V1 REQUIREMENTS** (Derived from Product Blueprint, Decision Freeze & Owner Sign-offs);
> 2. **PROVISIONAL BASELINE VS UNVERIFIED DETAILS** (S-Class V223 LWB approved as baseline; unverified sub-mesh details remain provisional);
> 3. **PROPOSED / SHOWCASE CATALOGUE CHOICES** (Demonstration items awaiting AutoLab stock injection; never misrepresented as approved stock);
> 4. **STRICT SCOPE LOCK** (No new product features, exterior modeling, e-commerce, or expansion beyond V1).

---

## 1. CONFIRMED OWNER DECISIONS (CANONICAL)

The following decisions are confirmed by the project owner and govern all downstream engineering:

* **Approved V1 Vehicle:** The **Mercedes-Benz S-Class** is formally approved as the single V1 vehicle.
* **Working 3D Baseline:** The **Series 223 Long Wheelbase (V223 LWB)** in AMG-Line trim is the working 3D baseline. Unverified detailed internal geometry (sub-cushion motor rails, deep HVAC ducting) remains **provisional**.
* **Deferred Catalogue Injection:** The exact AutoLab workshop materials, leather hide colors, and stitching catalogue are pending physical injection from AutoLab.
* **Showcase Swatch Guard:** Proposed catalogue choices present in `src/config/materials/` may be used to operate a clearly labelled local showcase / interaction scaffold. They must **never** be misrepresented as AutoLab-approved physical stock.
* **Confirmed V1 Configuration Journey:** The sequential flow remains strictly:  
  **`Material → Colour → Accent Thread → Interior Composition`**
* **Reference Vehicles Policy:** Any other vehicles (e.g. Range Rover, Land Cruiser) or interior photographs mentioned in research documents are **showcase references only**, not additional configurable vehicles for V1.
* **Commercial Fee Status:** The KES 750,000 project fee is a proposed commercial baseline and is **not yet accepted or signed** by AutoLab. Do not present it as a signed commercial agreement, and do not block technical development on it.
* **Strict Scope Lock:** No new product features, no dynamic pricing engines, no checkout carts, no customer login gates, and no scope expansion.

---

## 2. CONFIRMED V1 CONFIGURATION FLOW

The confirmed V1 configuration workflow from the Product Blueprint is strictly:

```
[ 1. MATERIAL ] ──▶ [ 2. COLOUR ] ──▶ [ 3. ACCENT THREAD ] ──▶ [ 4. INTERIOR COMPOSITION ]
```

| Dimension | Confirmed Status | Implementation Boundary |
| :--- | :--- | :--- |
| **1. Material** | **CONFIRMED V1** | **Leather** is the confirmed primary category. Fabric/wood are secondary slots where backed by catalogue. |
| **2. Colour** | **CONFIRMED V1 DIMENSION** | The *dimension* is confirmed; specific color swatches are **PROPOSED CANDIDATES** awaiting AutoLab physical injection. |
| **3. Accent Thread** | **CONFIRMED V1 DIMENSION** | The *dimension* is confirmed; specific thread hues and stitch patterns are **PROPOSED CANDIDATES** awaiting workshop confirmation. |
| **4. Interior Composition** | **CONFIRMED V1 DIMENSION** | Visual representation of customer selections as a coherent interior composition (Bespoke Monotone, Bespoke Duotone, or Executive Fluted). |

---

## 3. PROPOSED / SHOWCASE SWATCHES (AWAITING PHYSICAL AUTOLAB CATALOGUE)

The research-derived items in `src/config/materials/` are **PROPOSED SHOWCASE CANDIDATES ONLY**:

* **Proposed Leather Colors:** OEM codes (Black 501A, Sienna Brown 502A, Macchiato Beige 505A, Carmine Red) and bespoke shades (Cognac Tan, Royal Oxblood, Nairobi Emerald) are proposed candidates. AutoLab will confirm which hides are in workshop stock.
* **Proposed Trim Veneers:** Open-Pore Poplar, Walnut, Piano Lacquer, and Forged Carbon are proposed materials.
* **Proposed Accent Stitching:** Champagne Gold, Silver Shadow, Burnt Amber, Crimson Red, diamond quilting, and french seam are proposed machine patterns pending workshop confirmation.
* **Active Ambient Lighting:** The 253-LED ambient fiber loop is a **feature of the 3D vehicle asset**. Allowing customers to dynamically toggle 64 ambient color channels is an unconfirmed commercial feature.
* **Additional Interior Zones:** Separate customer customization of steering wheel rim, door cards, and console knee pads requires Gate 5 confirmation.
* **AutoLab Brand Assets & Contact:** Official vector logo and official WhatsApp Business telephone number require client delivery (GATE-06 & GATE-07).

---

## 4. 3D PRODUCTION REQUIREMENTS (ASTRA SCOPE)

Astra owns 3D asset authoring. The asset must be built so that it is geometrically complete and capable of programmatic configuration:

* **Platform Baseline:** Mercedes-Benz S-Class (Seventh Generation — Series 223).
* **Selected Chassis:** **V223 (Long Wheelbase)** in AMG-Line specification (MY 2021–2025 portrait OLED baseline).
* **Metric Scale (Exact):** Wheelbase: 3,216 mm | Overall Length: 5,289 mm | Width: 1,954 mm | Height: 1,503 mm | Central Screen: 12.8 in diagonal (60° inclination) | Driver Cluster: 12.3 in diagonal.
* **Interior Scope:** Full cabin cockpit, steering wheel, front multicontour seats, rear executive suite (43.5° recline kinematics), center console tunnel, door panels, and 253-LED ambient fiber strip. Cabin context (pillars/headliner) per decision D13.
* **Scene Graph Standard:** Exact node naming matching `src/config/scene-manifest.s-class-v223.json` (`GEO_*`, `MAT_*`).
* **Material Slot Decoupling:** Mesh primitives must bind to generic slots (`MAT_Upholstery_Primary`, `MAT_Upholstery_Secondary`, `MAT_Trim_Deck_Main`, `MAT_Stitching_Thread`, `EMISSIVE_Ambient_Lighting`) so colors and textures swap programmatically without mesh rebuilds.
* **Format & Performance Budgets:** Single Draco-compressed binary glTF (`interior.glb`) < 15MB with composite ORM textures; < 350,000 triangles; < 65 draw calls. Low-LOD variant (`interior_low.glb`) for mobile first-load.
* **Zero-Purchase Mandate:** Astra models in Blender headlessly via reproducible scripts. Royalty-free verification required before any third-party asset is introduced.
* **Trademark Anonymization:** Mercedes three-pointed star, Maybach logo, and Burmester badging must reside on detachable sub-nodes with neutral AutoLab insignia fallbacks.

---

## 5. APPLICATION & SALES HANDOFF ARCHITECTURE

* **Stack:** Next.js App Router, TypeScript (Strict), Tailwind CSS, Three.js / React Three Fiber.
* **Design Aesthetic:** Anti-AI compliant luxury dark mode (Obsidian `#0B0B0B`, Electric Cyan `#38B6FF`, Champagne Gold `#D4AF37`, editorial typography).
* **Summary & Reference Code:** Generates unique deterministic Reference Code (`AL-SC-2026-XXXXXX`) carrying the client's choices.
* **Sales Handoff:**
  1. WhatsApp direct link (`https://wa.me/{NUMBER}?text={ENCODED_MESSAGE}`) pre-populated with configuration details.
  2. Showroom consultation booking form.
  3. Protected advisor reference lookup (`/admin`).
* **Lean Backend:** Supabase PostgreSQL / Drizzle ORM (Firebase deprecated per D5) persisting `configurations`, `enquiries`, and `analytics_events`.

---

## 6. FUTURE EXPANSION IDEAS (STRICTLY EXCLUDED FROM V1)

Astra and downstream developers must **NOT** implement:
* Exterior vehicle modeling, wheels, suspension, or car bodies.
* Additional vehicles (Range Rover, Toyota Land Cruiser) — these are showcase references only.
* Before/after interactive transformation slider.
* Automated quotation engines or dynamic price calculators.
* E-commerce checkout, shopping carts, or online payment gateways.
* Generic automotive platform features: VIN decoders, vehicle databases, marketplace grids.
* Mandatory customer accounts or login walls.

---

## 7. EXECUTION ROADMAP FOR ASTRA

Astra must follow the canonical execution prompts codified in [`docs/ASTRA_EXECUTION_PROMPTS.md`](ASTRA_EXECUTION_PROMPTS.md):

1. **Orientation:** Read [`docs/ASTRA_START_HERE.md`](ASTRA_START_HERE.md) first.
2. **Phase 0:** Verify setup and review the plan (upgrade pack already installed by Antigravity).
3. **Phase 1A & 1B:** Foundations upgrade (Next 16, React 19, Supabase only, type fixes, contract tests).
4. **Phase 2:** Build and prove the glTF asset gate (`scripts/validate-glb.mjs`).
5. **Phase 3:** Spike asset (organic driver seat flutes + OLED screen).
6. **Phase 4 & 5:** Viewer spike (R3F) and human review pack.
7. **Phase 6:** Incremental Zone authoring (Z1 through Z9).
8. **Phase 7 to 9B:** Configuration flow, leads/persistence, performance QA, and readiness audit.
