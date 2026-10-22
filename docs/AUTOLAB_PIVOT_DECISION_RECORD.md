# AutoLab Pivot Decision Record: 2020 Lexus RX 350 Flagship Rebaseline

**Document:** `docs/AUTOLAB_PIVOT_DECISION_RECORD.md`  
**Authority:** Product Blueprint & Owner Decision Record  
**Date:** 2026-10-22  
**Status:** APPROVED & BINDING  
**Supersedes:** Mercedes-Benz S-Class V223 Full Cabin Reconstruction Directives  

---

## 1. Executive Summary & Strategic Rationale

AutoLab's commercial identity is a premier bespoke automotive reupholstery and interior tailoring atelier in Nairobi, Kenya. Clients commission AutoLab to transform vehicle interiors with handcrafted leather hides, custom stitching, perforated inserts, and personalized color palettes. 

### Why the S-Class V223 Reconstruction Was Superseded
The previous technical direction attempted to reconstruct a complete, manufacturer-grade digital twin of the Mercedes-Benz S-Class (V223 LWB) cabin across 10+ interdependent nodes (`GEO_Trim_Dashboard_WoodDeck`, waterfall `GEO_Console_Center_Front`, `GEO_Door_Panels_FL_FR_RL_RR`, ambient lighting splines, etc.). This introduced severe friction:
1. **Unproductive Modeling Overhead**: Enormous effort was diverted into non-customisable OEM interior geometry (console louvres, air vent housings, Burmester speaker pods, complex door cards) rather than AutoLab’s actual commercial offering.
2. **Persistent Reference Gaps & Speculative Estimates**: Missing under-dash ducting, occluded seat tracks, untraced screen rakes, and dealer lighting artifacts prevented verifiable fidelity without physical vehicle scanning.
3. **Misalignment with Buyer Psychology**: Clients making upholstery decisions do not evaluate a configurator based on whether the door lock buttons or rear HVAC louvres are exact digital twins. They evaluate the tactile realism, color fidelity, stitch precision, and material luxury of the **seating and primary touchpoints**.

### The Benchmark Inspiration
The product direction is now explicitly inspired by the product-focused customisation experience at **[carseatcover.eu](https://carseatcover.eu/)**:
- Focused, tactile presentation of seating geometry.
- Crystal-clear visual articulation of material choices: primary leather, insert contrast, bolsters, and accent thread.
- Immediate, intuitive feedback on upholstery craftsmanship without navigation clutter or disorienting full-cabin camera drift.

---

## 2. Approved New Flagship: 2020 Lexus RX 350 AWD

The approved flagship demonstration vehicle is the **2020 Lexus RX 350 AWD**.

- **Vehicle Provenance**: Certified pre-owned vehicle, VIN `2T2HZMDA5LC239309`, Stock `HLSPLC239309`, Atomic Silver exterior, Black interior, gasoline V6.
- **Reference Anchor**: [`AUTOLAB_LEXUS_SEAT_REFERENCE_PACK/`](file:///c:/Users/user/OneDrive/Desktop/AUTOLAB-DIGITAL-SHOWROOM/AUTOLAB_LEXUS_SEAT_REFERENCE_PACK/) containing 35 authentic dealership listing photographs from Herb Chambers Lexus of Sharon, complete image manifest, and research documents.
- **Market Fit**: The Lexus RX is a ubiquitous, highly aspirational luxury SUV across East Africa and Nairobi, representing AutoLab's core demographic for bespoke interior refreshes and executive leather upgrades.

---

## 3. Locked Demonstration Scope

The product demonstration scope is strictly locked to the following components:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   LOCKED DEMONSTRATION COMPONENTS                      │
├────────────────────────────────────────────────────────────────────────┤
│ 1. Two Front Seats       - Driver & passenger bucket seats             │
│                            (center inserts, bolsters, headrests, seams)│
│ 2. Dashboard             - Primary cockpit visual anchor               │
│ 3. Steering Wheel        - Tactile driver contact touchpoint           │
│ 4. Customisable Finishes - Primary hide, secondary insert/bolster,     │
│                            accent stitching, interior trim finishes    │
│ 5. Visual Enhancements   - Optional only where they improve demo       │
└────────────────────────────────────────────────────────────────────────┘
```

### Scope Boundaries (Strictly Prohibited)
- **NO Complete Cabin Reconstruction**: Do NOT model rear passenger suites, floor pans, door cards, headliners, luggage bays, or pillar trims.
- **NO Kinematic Rigs**: Seats, armrests, and gloveboxes remain static.
- **NO Unrestricted Free Camera Orbit**: Camera must not clip through geometry or orbit into unmodelled rear voids.
- **NO Marketplace Geometry**: No unverified third-party 3D models with ambiguous topology or licensing.

---

## 4. Retained Configuration Journey

The canonical customer configuration journey remains immutable:

```
[ 1. MATERIAL ] ──▶ [ 2. COLOUR ] ──▶ [ 3. ACCENT THREAD ] ──▶ [ 4. INTERIOR COMPOSITION ]
```

1. **Material**: Selection of leather grade (Nappa, Classic Grain, Alcantara/Microfibre).
2. **Colour**: Primary leather hide hue applied to seating main surfaces.
3. **Accent Thread**: Contrast perimeter stitching and seam detailing.
4. **Interior Composition**: Bespoke styling layout (Monotone, Duotone Bolster/Insert, or Executive Piping).

---

## 5. Superseded Historical Decisions Register

The following earlier decisions regarding the S-Class V223 are formally archived and superseded:

| Previous ID | Previous Scope | Status | Reason Superseded |
| :--- | :--- | :--- | :--- |
| **O-REF-01** | Coherent V223 LWB front cabin (10 nodes) | **SUPERSEDED** | S-Class full-cabin deliverable retired in favour of Lexus RX 350 seat-focused demo. |
| **O-REF-02** | V223 longitudinally fluted seat pattern | **SUPERSEDED** | Replaced by authentic 2020 Lexus RX 350 seat seam and bolster geometry (`LRX-08`, `LRX-31`). |
| **D2** | S-Class center console split (veneer vs leather) | **SUPERSEDED** | Complex S-Class waterfall console removed from 3D modeling scope. |
| **D9** | V223 LWB generation baseline | **SUPERSEDED** | Target vehicle transitioned to 2020 Lexus RX 350 AWD. |
| **D12** | S-Class manifest slots reconciliation (F1) | **SUPERSEDED** | Manifest being rebaselined for Lexus component nodes. |
| **D13** | S-Class cabin context (headliner, pillars) | **SUPERSEDED** | Cabin context replaced by bounded camera presets and photographic backdrop. |

### Preserved Foundational Decisions
- **D1 (Accent Thread Direction)**: Dedicated stitch geometry or dedicated material binding for recolourable thread remains the approved technical path.
- **D3 (Reference Code Format)**: `AL-SC-2026-XXXXXX` format remains approved.
- **D4 (Performance Budgets)**: 5 MB transfer target, 15 MB maximum, mobile texture tiers remain binding.
- **D5 & D6 (Tech Stack)**: Next.js 16, React 19, Supabase, Tailwind CSS, Three.js / React Three Fiber remain binding.
- **D10 (Reference Policy)**: Use authentic dealership and manufacturer published photography with source records; preserve physical gaps as provisional until workshop scanning.
