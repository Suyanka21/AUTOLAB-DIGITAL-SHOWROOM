# AutoLab Customer Journey & Experience Architecture
**Document:** `docs/product/customer-journey.md`  
**Authority:** Product Blueprint & Decision Freeze (Sections 8 & 9)  
**Status:** Canonical Journey Specification  

---

## 1. Journey Overview & Philosophy

The AutoLab Digital Showroom replaces dry transactional forms with an immersive digital design atelier. The journey guides the prospective customer through six intentional stages:

```
[ Step 1: Atelier Entrance ]
             │
             ▼
[ Step 2: Vehicle Selection ] (Mercedes-Benz S-Class V223 Baseline)
             │
             ▼
[ Step 3: Tactile Configuration ] (Material ➔ Colour ➔ Accent Thread ➔ Trim Finish)
             │
             ▼
[ Step 4: 3D Visualisation ] (360° Orbit, Focal Presets, Ambient Lighting Shift)
             │
             ▼
[ Step 5: Design Review ] (Structured Summary + Reference Code AL-SC-2026-XXXX)
             │
             ▼
[ Step 6: Atelier Engagement ] (WhatsApp Consultation / Showroom Appointment Booking)
```

---

## 2. Detailed Step-by-Step Specification

### STEP 1 — ENTER THE SHOWROOM
* **User Context:** Prospective client arrives via digital marketing, referral, or AutoLab social channels.
* **Atmosphere & Visual Impact:**
  * Dark luxury obsidian aesthetic (`#08090C`) with subtle warm champagne gold accents.
  * Editorial typography and smooth cinematic entrance transition.
  * Clear messaging: *"AutoLab Bespoke Atelier — Visualise your interior transformation before physical craftsmanship begins."*
* **Core Action:** Seamless entrance directly into the active showroom floor without mandatory login hurdles.

### STEP 2 — SELECT THE VEHICLE
* **V1 Presentation:**
  * Mercedes-Benz S-Class (Seventh Generation — V223 Long Wheelbase).
  * High-fidelity hero preview card highlighting cabin space, executive seating, and craft potential.
  * Visual indicators for future garage models (*"Range Rover & Hilux Atelier En Route"*).
* **Core Action:** Enter the S-Class 3D Interior Atelier.

### STEP 3 — CONFIGURE THE INTERIOR
* **Interaction Model:**
  * Clean, floating control palette docked smoothly to the viewport edge.
  * Visual swatches showing genuine material textures, specular sheen, and rich color tone rather than plain text dropdowns.
* **Sequential Customization Zones:**
  1. **Primary Upholstery:** Choose leather type (Exclusive Nappa, AutoLab Heritage Hide) and primary color (e.g., Sienna Brown, Black, Macchiato Beige, Cognac Tan, Royal Oxblood).
  2. **Secondary Accent Upholstery:** Configure outer bolsters, armrests, and knee pads (monotone or bespoke two-tone split).
  3. **Dashboard & Door Trim Deck:** Select luxury veneers (Anthracite Open-Pore Poplar, Warm Walnut, Piano Black Flowing Lines, or Forged Carbon).
  4. **Accent Stitching & Quilting:** Choose thread color (Champagne Gold, Silver Shadow, Burnt Amber, Crimson Red) and stitch pattern (Diamond Quilt, French Seam).
  5. **Active Ambient Lighting:** Toggle 253-LED ambient spectrum (Sunset Orange, Miami Rose, Ocean Blue, or custom warmth).

### STEP 4 — VISUALISE IN REAL-TIME 3D
* **Visual Payoff (The "WOW" Transformation):**
  * Immediate real-time PBR material swap on the 3D model as selections are made (zero latency, no reloading).
  * Customer can orbit 360°, pan across the cabin, and zoom into micro-textures.
* **Calibrated Viewpoint Presets:**
  * **Cockpit Master:** Full dashboard sweep, 12.8" MBUX display, and steering wheel alignment.
  * **Driver Cockpit:** Macro view of 12.3" cluster, AMG-Line double-spoke wheel, and perforated leather grip.
  * **Center Console:** Cascading waterfall console, tambour cover, and dual cup holders.
  * **Front Seating:** Isometric inspection of lateral bolsters and diamond-quilted cushion flutes.
  * **Rear Executive Suite:** Reclining seat (43.5° recline), calf rest extension, and First-Class business console.
  * **Night Ambient Mode:** Dimmed cabin environment highlighting the 253-LED active optical fiber arc.

### STEP 5 — REVIEW CONFIGURATION SUMMARY
* **Output:**
  * Cohesive Design Summary Sheet generated client-side.
  * Deterministic Reference Code generated (e.g., `AL-SC-2026-B4E9`).
  * Structured breakdown of selected hides, finishes, stitch patterns, and ambient modes.
  * Clear classification: *AutoLab Bespoke Transformation Specification*.

### STEP 6 — ENGAGE AUTOLAB
* **Handoff Channels:**
  * **Direct WhatsApp Engagement:** Opens WhatsApp with a pre-formatted message including the configuration summary, reference code, and client vehicle details.
  * **Showroom Consultation Booking:** Simple contact form requesting preferred consultation date, time, and optional existing vehicle condition.
* **Commercial Positioning:**
  * *"Every AutoLab interior is hand-crafted to order. Quotations are tailored upon physical vehicle inspection at our Nairobi showroom."*
  * Moves the customer seamlessly from digital curiosity to a qualified, excited showroom conversation.
