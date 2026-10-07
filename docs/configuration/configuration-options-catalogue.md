# AutoLab Configuration Options & Proposed Material Catalogue
**Document:** `docs/configuration/configuration-options-catalogue.md`  
**Authority:** Product Blueprint (Section 11) & S-Class 3D Asset Brief (Section 5)  
**Status:** PROPOSED RESEARCH CANDIDATES — PENDING AUTOLAB APPROVAL  

---

## Governance Notice
> **CONFIRMED V1 CORE:** Leather is the confirmed primary material category.
> **PROPOSED / UNCONFIRMED:** The specific hides, colors, veneers, threads, and ambient profiles below represent **research-derived candidate options**. None of these options are confirmed commercial AutoLab offerings until explicitly approved under the respective Human Approval Gate.
> **Astra builds the 3D asset to support these slots, but only exposes approved options in the customer UI.**

---

## 1. Material Options

| Option ID | Name | Category | Roughness | Metallic | Clearcoat | Classification | Status & Human Approval Gate |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `nappa-exclusive` | Exclusive Nappa Leather | `leather` | 0.48 | 0.00 | 0.05 | OEM Reference | **PROPOSED (Pending GATE-02 Approval)** |
| `autolab-heritage-hide` | AutoLab Heritage Semi-Aniline | `leather` | 0.42 | 0.00 | 0.08 | AutoLab Bespoke | **PROPOSED (Pending GATE-02 Approval)** |
| `open-pore-poplar` | Anthracite Open-Pore Poplar | `wood` | 0.68 | 0.00 | 0.00 | OEM Reference | **PROPOSED (Pending GATE-02/05 Approval)** |
| `open-pore-walnut` | Warm Brown Open-Pore Walnut | `wood` | 0.65 | 0.00 | 0.00 | OEM Reference | **PROPOSED (Pending GATE-02/05 Approval)** |
| `piano-lacquer-flowing-lines` | Piano Lacquer Flowing Lines | `wood` | 0.06 | 0.00 | 1.00 | OEM Reference | **PROPOSED (Pending GATE-02/05 Approval)** |
| `autolab-forged-carbon` | Forged Aerospace Carbon Fiber | `carbon` | 0.12 | 0.15 | 0.95 | AutoLab Bespoke | **PROPOSED (Pending GATE-02/05 Approval)** |
| `active-ambient-led` | Active Optical Fiber Core | `emissive`| 0.15 | 0.00 | N/A | OEM 3D Feature | **3D ASSET FEATURE (Customer UI Pending GATE-05)** |

---

## 2. Leather & Upholstery Color Palette (Proposed Candidates)

| Color ID | Display Name | Hex Code | OEM Code | Classification | Compatible Materials | Status & Approval Gate |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `black-nappa-501a` | Exclusive Black | `#151618` | 501A | OEM Reference | `nappa-exclusive` | **PROPOSED (Pending GATE-03 Approval)** |
| `sienna-brown-502a` | Sienna Brown | `#75452B` | 502A | OEM Reference | `nappa-exclusive` | **PROPOSED (Pending GATE-03 Approval)** |
| `macchiato-beige-505a`| Macchiato Beige / Magma Grey | `#D8CAB8` | 505A | OEM Reference | `nappa-exclusive` | **PROPOSED (Pending GATE-03 Approval)** |
| `carmine-red-oem` | Carmine Red Sport | `#8A1822` | CARMINE | OEM Reference | `nappa-exclusive` | **PROPOSED (Pending GATE-03 Approval)** |
| `autolab-cognac-tan` | AutoLab Heritage Cognac Tan | `#9A5B2D` | N/A | AutoLab Bespoke | `nappa-exclusive`, `autolab-heritage-hide` | **PROPOSED (Pending GATE-03 Approval)** |
| `autolab-royal-oxblood`| AutoLab Royal Oxblood | `#5C1D24` | N/A | AutoLab Bespoke | `nappa-exclusive`, `autolab-heritage-hide` | **PROPOSED (Pending GATE-03 Approval)** |
| `autolab-nairobi-emerald`| AutoLab Nairobi Forest Emerald| `#1A382B` | N/A | AutoLab Bespoke | `nappa-exclusive`, `autolab-heritage-hide` | **PROPOSED (Pending GATE-03 Approval)** |

---

## 3. Accent Thread & Stitching Options (Proposed Candidates)

| Option ID | Thread Name | Hex Code | Stitching Pattern | Intended Application | Status & Approval Gate |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `contrast-champagne-gold`| Champagne Gold Luxury Contrast | `#D4AF37` | Diamond Quilted | Seat center flutes, headrests | **PROPOSED (Pending GATE-04 Approval)** |
| `contrast-silver-shadow` | Silver Shadow Tech Stitch | `#C0C4CC` | French Seam | Upper dash cowl, door waistline | **PROPOSED (Pending GATE-04 Approval)** |
| `contrast-burnt-amber` | Burnt Amber Heritage Stitch | `#C26829` | Double-Lap | Heavy-wear bolsters, armrests | **PROPOSED (Pending GATE-04 Approval)** |
| `contrast-crimson-red` | Crimson Red Sport Stitch | `#B3131F` | Perimeter Single | Steering wheel rim, sport seats | **PROPOSED (Pending GATE-04 Approval)** |
| `tone-on-tone-black` | Stealth Black Tone-on-Tone | `#1A1A1A` | French Seam | Understated stealth packages | **PROPOSED (Pending GATE-04 Approval)** |

---

## 4. Active Ambient Lighting Spectrum (3D Asset Visual Channels)

*Note: The 253-LED ambient fiber strip is a physical feature of the S-Class 3D asset. Dynamic customer switching between ambient color channels in V1 is an unconfirmed feature subject to Gate 5.*

| Channel ID | Preset Name | Hex Code | Color Mode | Primary Evidentiary Reference | Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `sunset-orange` | Sunset Orange | `#FF5722` | Warm Dynamic | MercBenzKing 4K Night Walkthrough (08:45) | 3D Visual Preset |
| `miami-rose` | Miami Rose | `#E91E63` | Vibrant Modern | OEM Global Media Portal Interior Night Shoot | 3D Visual Preset |
| `ocean-blue` | Ocean Blue | `#00BCD4` | Crisp Technical | Dealer Press Kit Night Ambient Display | 3D Visual Preset |
| `monaco-ice` | Monaco Cool White | `#E0F7FA` | Minimalist Pure | Autogefühl Premiere Night Sequence | 3D Visual Preset |
