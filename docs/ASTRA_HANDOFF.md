# ASTRA PRODUCTION HANDOFF DIRECTIVE
**Master Production Specification for Downstream AI Implementation Agent**  
**Designation:** `docs/ASTRA_HANDOFF.md`  
**Author:** Antigravity (Preparation Agent)  
**Target:** Astra (Production & 3D Engineering Agent)  
**Date:** October 2026  
**Status:** CODIFIED & PRODUCTION-READY  

---

```
========================================================================================
                          AUTOLAB DIGITAL SHOWROOM
                  CANONICAL PRODUCTION HANDOFF DIRECTIVE
========================================================================================
```

## 1. PROJECT: What is AutoLab Digital Showroom?
The **AutoLab Digital Showroom** is a bespoke, real-time 3D interactive interior visualization and configuration experience created for **AutoLab**, a premier luxury automotive reupholstery and interior transformation atelier in Nairobi, Kenya. It replaces traditional static web forms with an immersive digital design atelier.

---

## 2. MISSION: Why does it exist?
To give prospective AutoLab clients a way to experience, configure, and visualize their proposed interior transformation before committing to physical craftsmanship in the workshop. The product exists to turn visual inspiration into qualified, high-context showroom visits and consultative sales conversations.
> **North Star:** *"Visualise the transformation before you commit to it."*

---

## 3. V1: What exactly is being built?
An interactive web application centered around a photorealistic 3D interior of a Mercedes-Benz S-Class:
1. **Interactive 3D Viewer:** Orbit, pan, zoom, and six calibrated camera presets (Cockpit, Driver, Console, Front Seats, Rear Executive, Night Ambient).
2. **Configuration Atelier:** Live swapping of Primary Upholstery, Secondary Bolsters, Trim Deck Veneers, Accent Stitching, and 253-LED Ambient Lighting.
3. **Configuration Summary:** Client-side synthesis of choices with a deterministic Reference Code (`AL-SC-2026-XXXX`).
4. **Sales Consultation Handoff:** One-tap WhatsApp deep link with pre-formatted configuration details and an in-person showroom booking form.
5. **Lean Data Persistence:** Supabase PostgreSQL (or Firebase) storing configurations, enquiries, and operational telemetry.

---

## 4. VEHICLE: What S-Class is being represented?
* **Vehicle Generation:** Seventh Generation Mercedes-Benz S-Class (Series 223).
* **Selected Chassis:** **V223 (Long Wheelbase)** in AMG-Line specification.
* **Production Baseline:** Model Years 2021–2025 featuring the confirmed 12.8-inch portrait OLED central screen and 12.3-inch floating instrument cluster.
* **Metric Scale:** Wheelbase: 3,216 mm | Length: 5,289 mm | Width: 1,954 mm | Height: 1,503 mm.

---

## 5. 3D: What must the asset contain?
* **Complete Interior Cabin:** Dashboard wing sweep, display screens, AMG-Line steering wheel, center console tunnel, front multicontour seats, rear executive suite (with 43.5° recline kinematics), door cards with Burmester grilles, and continuous 253-LED ambient lighting fiber strip.
* **Scene Graph Standard:** Exact node naming matching `docs/3d-assets/interior-component-map.md` (`GEO_Dashboard_Screen_Central_OLED`, etc.).
* **Format:** Single Draco-compressed binary glTF (`interior.glb`) < 15MB with composite ORM textures.
* **Trademark Protection:** Brand emblems isolated on detachable sub-nodes or replaced with neutral AutoLab insignia placeholders.

---

## 6. CONFIGURATION: What can the customer change?
1. **Primary Seat Leather:** Exclusive Nappa / AutoLab Bespoke Hides in Black (501A), Sienna Brown (502A), Macchiato Beige (505A), Carmine Red, Cognac Tan, Royal Oxblood, or Nairobi Emerald.
2. **Secondary Bolster Upholstery:** Monotone or contrasting leather split across outer bolsters, armrests, and knee pads.
3. **Dashboard & Door Veneers:** Open-Pore Poplar, Open-Pore Walnut, Piano Lacquer Flowing Lines, or Forged Carbon Fiber.
4. **Accent Stitching:** Champagne Gold Luxury Contrast, Silver Shadow, Burnt Amber, or Crimson Red (Diamond Quilted or French Seam).
5. **Active Ambient Lighting:** 64-color optical LED spectrum (Sunset Orange, Miami Rose, Ocean Blue, Monaco Ice).

---

## 7. APPLICATION: How does the experience work?
* **Stack:** Next.js 14 App Router, TypeScript (Strict), Tailwind CSS, Three.js / React Three Fiber.
* **Design Aesthetic:** Anti-AI compliant luxury dark mode (Deep Obsidian `#08090C`, warm Champagne Gold `#D4AF37`, leather swatches, editorial typography).
* **State Engine:** Reactive client state updating Three.js material uniforms in < 16ms without re-rendering the 3D scene graph or reloading assets.

---

## 8. DATA: What needs to be stored?
* **Configurations:** Unique reference code, vehicle ID, raw selection map, precomputed summary object.
* **Enquiries:** Reference code, client contact info (Name, Phone/WhatsApp, Email), preferred consultation channel, voluntary existing vehicle condition notes.
* **Operational Analytics:** Showroom entrance events, material swaps, and conversion rates.

---

## 9. LEAD: How does the customer reach AutoLab?
1. **WhatsApp Deep Link:** `https://wa.me/{NUMBER}?text={ENCODED_MESSAGE}` pre-filled with the exact vehicle summary and Reference Code.
2. **Showroom Consultation Form:** Web form saving lead directly to the database and alerting showroom advisors.
3. **Showroom Lookup:** Advisors enter the Reference Code in `/admin` to view the client's design and prepare physical leather swatches prior to the consultation.

---

## 10. CONSTRAINTS: What must NOT be built?
* **NO generic automotive platform** (no global VIN decoders, generic car databases, or vehicle marketplaces).
* **NO exterior vehicle modeling** (interior cabin only).
* **NO e-commerce checkout or online payment processing.**
* **NO automated quotation calculators** (quotations require physical vehicle inspection).
* **NO customer accounts or mandatory login walls.**

---

## 11. UNKNOWN: What still requires human confirmation?
Eight human approval gates detailed in `docs/human-approval-gates.md`:
1. S-Class V223 chassis baseline signoff;
2. AutoLab approved material catalog;
3. Approved bespoke leather palette;
4. Approved accent stitching options;
5. Exact configuration depth approval;
6. AutoLab brand assets and vector logo;
7. Official WhatsApp lead telephone number;
8. Final 3D asset visual quality signoff.

---

## 12. ACCEPTANCE: How do we know it works?
Passes all 14 Functional Acceptance Criteria (`FAC-01` through `FAC-14`) and all 7 3D Asset Criteria (`3AC-01` through `3AC-07`) in `docs/quality/acceptance-criteria.md`, achieving 60 FPS on desktop and 30–60 FPS on mobile.

---

## 13. NEXT ACTION: What should Astra do first?
1. **Open Blender:** Construct the interior metric bounding cage for the V223 Long Wheelbase (Wheelbase: 3,216 mm, Length: 5,289 mm) per `docs/3d-assets/blender-production-pipeline.md`.
2. **Model Display Scale Anchors:** Establish the 12.8" central OLED screen and 12.3" cluster.
3. **Execute Zero-Purchase Modeling:** Complete the interior mesh in Blender following the priority map before evaluating commercial fallbacks.
4. **Export Master GLB:** Export Draco-compressed `interior.glb` to `public/assets/3d/s-class-v223/`.
5. **Connect React Three Fiber Viewer:** Bind material slots in `src/app/page.tsx` to active configurator state.
