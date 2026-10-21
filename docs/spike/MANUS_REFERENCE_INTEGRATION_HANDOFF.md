# Manus Authentic Reference Pack Integration & Modeling Handoff
**Project:** AutoLab Digital Showroom — Mercedes-Benz S-Class (V223 LWB)  
**Document Designation:** `docs/spike/MANUS_REFERENCE_INTEGRATION_HANDOFF.md`  
**Author:** Antigravity (Integration Agent)  
**Target Consumer:** Astra (3D Asset Engineering Agent) & Project Owner  
**Status:** CODIFIED • REFERENCE PACK INTEGRATED • DECISIONS PENDING OWNER APPROVAL  

---

## 1. Executive Summary & Verification

An authentic, high-resolution photographic reference pack (`AUTOLAB_V223_REFERENCE_PACK`) has been placed in the repository root and verified. To safeguard repository hygiene and prevent inadvertent public redistribution of copyrighted publisher media, the directory has been excluded from git tracking via [`.gitignore`](../../.gitignore).

### 1.1. Reference Inventory Verification
All 29 photographic assets listed in `REFERENCE_MANIFEST.csv`, `MASTER_REFERENCE_SELECTION.md`, and `SOURCE_REGISTER.md` were inspected directly on disk:
- **Total Files:** 29 photographic images + 1 compiled master PDF catalogue (`AUTOLAB_V223_REFERENCE_CATALOGUE.pdf`, 38.5 MB).
- **Format Integrity:** 25 JPEGs (up to $7543 \times 5131$ px, 7.1 MB) and 4 WebP thumbnails ($640 \times 480$ px). All images parse cleanly as standard 8-bit RGB color.
- **Authenticity Confirmation:** **100% authentic real-world photography.** Zero synthetic AI-generated images, zero CAD extractions, and zero marketing concept renders.
- **Licensing & Usage Boundary:** Images originate from Mercedes-Benz Media, Car and Driver, AUTO BILD, auto motor und sport, and Alejandro Financial. Public redistribution rights are not cleared; all photographs are restricted strictly to internal modeling reference.

---

## 2. Master Reference Set Selection (Pre-Facelift V223 LWB)

To eliminate visual inconsistencies caused by mixing different model years, trim levels, or wheelbase variants, Astra must adhere to the following hierarchical master reference sets:

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                    COHERENT REFERENCE HIERARCHY FOR ASTRA                       │
├─────────────────────────────────────────────────────────────────────────────────┤
│ 1. PRIMARY ARCHITECTURE SET: CAB_004 through CAB_014 (Car and Driver 2021)     │
│    • Unified photoshoot under consistent atelier studio lighting.               │
│    • Complete spatial alignment across OLED, dash cowl, console, doors & seats. │
├─────────────────────────────────────────────────────────────────────────────────┤
│ 2. LWB CHASSIS & SEAT ANCHOR: MASTER_001 & MASTER_002 (AUTO BILD S 580 e lang)  │
│    • Verified V223 Long Wheelbase (3,216 mm) European test car.                 │
│    • Anchors real seat bolsters, legroom clearance, and natural daylight tones. │
├─────────────────────────────────────────────────────────────────────────────────┤
│ 3. CRAFTSMANSHIP & TEXTURE MACROS: MAT_001 & MAT_002 (Car and Driver 7500px)   │
│    • Extreme high-res macro captures of leather grain, French seams & pores.   │
│    • Reference for Burmester acoustic grilles, wood pores, and satin metal.    │
└─────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Upholstery Variant Reconciliation & Fluting Rules

### 3.1. The Conflict
The preliminary Phase 3 spike adopted an unverified assumption of "8 uniform vertical flutes" across the seat insert (`FLUTE_COUNT = 8`, `INSERT_WIDTH = 0.320 m`). Inspection of the authentic reference pack reveals that Mercedes-Benz produces three distinct seat upholstery specifications for the V223 generation:
1. **Standard Fluted Nappa (Variant B):** Observed in `MASTER_002` and `CAB_002`. Features longitudinal flutes that follow ergonomic contours, tapering near the cushion base, bound by double French seams.
2. **Exclusive Nappa Diamond-Quilted (Variant A):** Observed in `MAT_001`, `CAB_010`, `CAB_013`, and `DLR_003`. Features continuous diamond-quilted centers with precision perforations and outer flute borders.
3. **Sport Duotone / AMG-Line (Variant C):** Observed in `DLR_001`–`DLR_005` with high-contrast accent bolsters.

### 3.2. Mandatory Rules for Astra
- **Zero Configuration Mixing:** Astra must **NEVER** mix incompatible design languages (e.g. do not combine a diamond-quilted backrest with plain fluted cushion inserts, or join AMG-Line racing bolsters with a luxury comfort neck pillow).
- **Spike vs. Production:** The 8-flute parametric mesh from Phase 3 was an isolated feasibility test. When authoring the full seat, Astra must model the seat as an integrated ergonomic assembly (cushion base, thigh extension, lateral bolsters, backrest, and headrest) docking seamlessly into the center console envelope.

---

## 4. Phase 3/4 Asset Review vs. Phase 5 Visual Defects

The Phase 5 visual review (`docs/review/spike-2026-10-20/review.md`) and decision register (`docs/spike/decision.md`) documented specific visual failures on the two-node spike asset. The authentic reference pack provides exact guidance for remediation:

| Component | Existing Phase 3/4 State | Phase 5 Visual Defect | Remediation Action using Reference Pack |
| :--- | :--- | :--- | :--- |
| **Central OLED Display** | $219.51 \times 239.83$ mm active canvas verified; blank faceplate. | Blank non-emissive screen; broad flat reflections; missing thumbwheel and buttons. | **REUSE & ENHANCE:** Keep verified active canvas coordinates. Remodel outer stepped bezel using `CAB_006` and `DASH_001`. Add lower switch strip with physical volume roller ($14$ mm dia.) and MBUX Zero-Layer emissive graphic. |
| **Front Driver Seat** | $320$ mm wide flat insert with 8 rectangular columns; baked normal map. | Sharp groove ends, synthetic grain, disconnected silhouette floating in space without bolsters or frame. | **REMODEL AS ASSEMBLY:** The isolated flat insert cannot dock with curved bolsters. Remodel seat cushion, side bolsters, thigh extension, and headrest as an integrated assembly matching `MASTER_002` and `CAB_010`. |
| **Dashboard Deck** | Non-existent in spike. | Missing context; screen appears floating in a void. | **NEW MODELING:** Model `GEO_Trim_Dashboard_WoodDeck` from `CAB_004`, `CAB_011`, and `DASH_002`. Include the 4 horizontal oblong center vents and cluster hood. |
| **Center Console** | Non-existent in spike. | Missing foundation; screen has no physical mounting surface. | **NEW MODELING:** Model `GEO_Console_Center_Front` from `CAB_008`, `MASTER_001`, and `DLR_002`. Features cascading veneer waterfall, tambour door, and butterfly armrest. |
| **Steering Wheel** | Non-existent in spike. | Incomplete driver station. | **NEW MODELING:** Model `GEO_SteeringWheel_AMG_DoubleSpoke` from `CAB_005`, `CAB_007`, and `COMP_002`. Twin capacitive horizontal spokes with flat-bottom rim. |
| **Front Door Cards** | Non-existent in spike. | Cabin boundary missing; shut gaps undefined. | **NEW MODELING:** Model `GEO_Door_Panels_FL_FR_RL_RR` and `GEO_Door_Speaker_Burmester_4D` from `CAB_009`, `CAB_012`, and `MAT_002`. Maintain 3.5–4.5 mm shut gaps to dashboard cowl. |

---

## 5. Reference-to-Geometry Mapping

The table below maps each scene graph node in the official manifest to authentic reference imagery, verified dimensions, and unresolved gaps:

| Manifest Identifier | Primary Image References | Source Confidence | Confirmed Metric Baseline | Provisional Estimates & Tolerances | Unresolved Gaps |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **`GEO_Dashboard_Screen_Central_OLED`** | `CAB_006`, `MASTER_001`, `DASH_001`, `DLR_002` | **High** (Official & Verified Press) | Diagonal $12.8\text{ in}$ ($325.12\text{ mm}$); Active $219.51 \times 239.83\text{ mm}$; Res $1888 \times 1728$ | Swept rake: $38.0^\circ$ from vertical; Bezel: $8.0\text{ mm}$; Outer: $235.5 \times 275.8\text{ mm}$ | **GAP-03** (Rear cavity concealed) |
| **`GEO_Seat_Front_Driver_Flutes`** | `MASTER_002`, `CAB_010`, `CAB_013`, `MAT_001` | **High** (Verified LWB & Macro) | Longitudinal ergonomic fluting; Backrest height $\approx 840\text{ mm}$ | Cushion width: $458\text{--}480\text{ mm}$ provisional range; Flute depth: $6\text{ mm}$ | **GAP-01** (Under-seat rails concealed) |
| **`GEO_Seat_Front_Passenger_Flutes`** | `CAB_010`, `CAB_012`, `DLR_005` | **High** (Official Studio) | Mirrored driver envelope ($458\text{--}480\text{ mm}$ width) | Passenger seat base alignment | Symmetrical to driver |
| **`GEO_Trim_Dashboard_WoodDeck`** | `CAB_004`, `CAB_011`, `DASH_002` | **High** (Official Studio) | Horizontal wing sweep A-pillar to A-pillar; 4 central oblong vents | Wing curvature radius; Vent louvre pitch | None (Visual coverage complete) |
| **`GEO_Console_Center_Front`** | `CAB_008`, `MASTER_001`, `DLR_002` | **High** (Verified LWB & Dealer) | Tunnel width $\approx 280\text{ mm}$; Butterfly split armrest | Tambour door curvature; Wireless charging pad depth | **CON_003** (Internal bin interior closed) |
| **`GEO_SteeringWheel_AMG_DoubleSpoke`** | `CAB_005`, `CAB_007`, `COMP_002` | **High** (Official Macro) | Outer diameter $\approx 375\text{ mm}$; Twin capacitive spokes | Airbag boss taper; Paddle shifter offset | None (Coverage complete) |
| **`GEO_Dashboard_Screen_Driver_Cluster`** | `CAB_005`, `CAB_007`, `COMP_003` | **High** (Official Studio) | Diagonal $12.3\text{ in}$; Floating landscape pedestal | Pedestal mounting neck height | None (Coverage complete) |
| **`GEO_Door_Panels_FL_FR_RL_RR`** | `CAB_009`, `CAB_012`, `DLR_004` | **High** (Official Macro & Dealer) | Shut gaps to dash: $3.5\text{--}4.5\text{ mm}$; Floating armrest | Lower door pocket bottom curvature | None (Exterior facing closed) |
| **`GEO_Door_Speaker_Burmester_4D`** | `CAB_009`, `MAT_002` | **High** (Ultra-High Macro) | Perforated metal acoustic grille at sail panel | Rotational deployment mechanism ($10\text{ mm}$) | Simplified static state for V1 |
| **`GEO_Interior_AmbientLight_FiberStrip`** | `CAB_001`, `DASH_002`, `CAB_004` | **High** (Official Media) | Continuous 253-LED waistline spline | Fiber cross-section diameter $\approx 3.0\text{ mm}$ | Emissive spline |

---

## 6. Owner's Deliverable Scope Assessment: Coherent Front Cabin

### 6.1. Strategic Rationale
The owner proposes advancing the next 3D deliverable from two isolated floating meshes to a **recognisable, coherent pre-facelift V223 front cabin cockpit**. This directly addresses the core finding of the Phase 5 review: automotive luxury cannot be judged on disembodied fragments.

### 6.2. Architectural & Governance Impact
1. **Manifest Stability:** Does **NOT** require adding unapproved nodes. All 10 necessary components are already defined in [`src/config/scene-manifest.s-class-v223.json`](../../src/config/scene-manifest.s-class-v223.json).
2. **Budget & WebGL Limits:**
   - Manifest overall ceiling: $\le 350,000$ triangles, $\le 65$ draw calls, $\le 15$ MB Draco GLB.
   - Front cabin budget allocation:
     - Driver & Passenger Seats: $\le 60,000$ tris combined
     - Dashboard Deck & Central Vents: $\le 20,000$ tris
     - Displays (OLED + Cluster): $\le 9,000$ tris combined
     - Center Console Waterfall & Tunnel: $\le 18,000$ tris
     - Steering Wheel & Column: $\le 25,000$ tris
     - Front Door Cards (L+R): $\le 35,000$ tris
     - Ambient Lighting Spline: $\le 5,000$ tris
     - **Total Front Cabin Polygon Count:** $\approx 172,000$ triangles (comfortably under the $350,000$ budget).
     - **Estimated Draco GLB Size:** $\approx 6.5\text{--}8.5$ MB (well within 15 MB limit).
     - **Estimated Draw Calls:** $\approx 14\text{--}18$ (well within 65 limit).
3. **Material Slot Governance (Finding F1 & Decisions D2 / D12):**
   - The front cabin incorporates components referencing slots previously flagged in `docs/spike/conflicts.md` (`MAT_Screen_Driver_Cluster`, `MAT_Console_Veneer_And_Leather`, `MAT_Door_Card_Substrate`).
   - Before Astra builds the full cabin GLB, the owner must formally approve Decision **D2** (splitting console veneer and leather) and Decision **D12** (defining these slots in the manifest).

---

## 7. Recommended Modeling Sequence (Smallest Practical Slices)

To maintain strict control over geometry, budgets, and validation gates, Astra should build the coherent front cabin in four focused, verifiable stages:

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                     RECOMMENDED ASTRA MODELING SEQUENCE                         │
├─────────────────────────────────────────────────────────────────────────────────┤
│ STAGE 1: CONSOLE & DASHBOARD ANCHOR (Datum Establishment)                       │
│ • Model center console tunnel (GEO_Console_Center_Front).                       │
│ • Dock the verified OLED display (GEO_Dashboard_Screen_Central_OLED) at 38° rake.│
│ • Sweep the dashboard wood deck wing (GEO_Trim_Dashboard_WoodDeck).             │
├─────────────────────────────────────────────────────────────────────────────────┤
│ STAGE 2: DRIVER COCKPIT ENCLOSURE                                               │
│ • Add driver instrument cluster (GEO_Dashboard_Screen_Driver_Cluster).          │
│ • Author twin-spoke steering wheel (GEO_SteeringWheel_AMG_DoubleSpoke).         │
│ • Model left front door card (GEO_Door_Panels_FL_FR_RL_RR) with 3.5mm shut gap. │
├─────────────────────────────────────────────────────────────────────────────────┤
│ STAGE 3: ERGONOMIC FRONT SEATING SHELLS                                         │
│ • Remodel driver seat cushion, lateral bolsters, backrest, and headrest.       │
│ • Integrate central fluted insert seamlessly into bolster recesses.             │
│ • Mirror driver assembly to passenger side (GEO_Seat_Front_Passenger_Flutes).   │
├─────────────────────────────────────────────────────────────────────────────────┤
│ STAGE 4: ATELIER CRAFTSMANSHIP & ILLUMINATION                                   │
│ • Model central 4 oblong air vents and Burmester speaker acoustic grilles.     │
│ • Route 253-LED ambient lighting fiber strip (GEO_Interior_AmbientLight...).    │
│ • Run automated gltf-asset-gate validation on cumulative GLB.                  │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### 7.1. Missing Photography Blocker Assessment
The 15 missing views in `MISSING_REFERENCE_VIEWS.md` are **NOT fatal blockers** for front-cabin visual authoring:
- Center console internal storage (`CON_003`) is hidden when butterfly doors are shut.
- Seat underside mechanical rails (`GAP-01`) are concealed beneath floor carpet.
- Rear OLED housing cavity (`GAP-03`) is concealed against the console veneer.
- The existing pack contains world-class, high-resolution coverage of all primary visual surfaces. **No synthetic image generation is required or permitted.**

---

## 8. Explicit Owner Decisions Requiring Formal Approval

Before Astra is dispatched to implement the coherent front cabin, the owner must formally confirm the following decisions:

1. **[DECISION O-REF-01] Coherent Front Cabin Deliverable Approval:**  
   Confirm that Astra's next 3D deliverable is a unified front cabin cockpit (dashboard, console, steering, front seats, displays, front doors) rather than iterative isolated parts.
2. **[DECISION O-REF-02] Primary Front Seat Upholstery Pattern:**  
   Select the canonical seat upholstery design for V1:
   - *Option A:* Standard Fluted Nappa (per `MASTER_002` / `CAB_002`) — continuous ergonomic fluting.
   - *Option B:* Exclusive Nappa Diamond-Quilted (per `MAT_001` / `CAB_010`) — luxury quilted pattern.
   - *Option C:* AutoLab Bespoke Duotone (per workshop tailoring catalogue).
3. **[DECISION D2] Console Material Slot Decoupling:**  
   Approve splitting `MAT_Console_Veneer_And_Leather` into `MAT_Trim_Deck_Main` (tambour/deck) and `MAT_Upholstery_Secondary` (armrest lids).
4. **[DECISION D12] Manifest Slot Harmonisation:**  
   Authorize adding `MAT_Screen_Driver_Cluster` and `MAT_Door_Card_Substrate` to the official manifest `materialSlots` array prior to full-cabin gate validation.
5. **[DECISION D1] Accent Stitching recolouring Mechanism:**  
   Confirm whether accent thread recoloring is modeled as dedicated geometry or baked normal textures.
6. **[DECISION D10] Reference Capture Closure:**  
   Confirm that the authentic Manus reference pack fulfills the reference requirements for Phase 3/Phase 6 front cabin authoring, allowing open gaps GAP-01 to GAP-04 to be closed as controlled approximations.
