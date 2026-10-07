# AutoLab Configuration Options & Material Catalogue
**Document:** `docs/configuration/configuration-options-catalogue.md`  
**Authority:** Product Blueprint (Section 11) & S-Class 3D Asset Brief (Section 5)  
**Status:** Canonical Option Catalogue  

---

## 1. Material Options

| Option ID | Name | Category | Roughness | Metallic | Clearcoat | Factory OEM? | AutoLab Bespoke? | Approval Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `nappa-exclusive` | Exclusive Nappa Leather | `leather` | 0.48 | 0.00 | 0.05 | YES | YES | **APPROVED** |
| `autolab-heritage-hide` | AutoLab Heritage Semi-Aniline | `leather` | 0.42 | 0.00 | 0.08 | NO | YES | *PENDING APPROVAL* |
| `open-pore-poplar` | Anthracite Open-Pore Poplar | `wood` | 0.68 | 0.00 | 0.00 | YES | NO | **APPROVED** |
| `open-pore-walnut` | Warm Brown Open-Pore Walnut | `wood` | 0.65 | 0.00 | 0.00 | YES | NO | **APPROVED** |
| `piano-lacquer-flowing-lines` | Piano Lacquer Flowing Lines | `wood` | 0.06 | 0.00 | 1.00 | YES | NO | **APPROVED** |
| `autolab-forged-carbon` | Forged Aerospace Carbon Fiber | `carbon` | 0.12 | 0.15 | 0.95 | NO | YES | *PENDING APPROVAL* |
| `active-ambient-led` | Active Optical Fiber Core | `emissive`| 0.15 | 0.00 | N/A | YES | NO | **APPROVED** |

---

## 2. Leather & Upholstery Color Palette

| Color ID | Display Name | Hex Code | OEM Code | Category | Compatible Materials | Approval Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `black-nappa-501a` | Exclusive Black | `#151618` | 501A | Factory OEM | `nappa-exclusive` | **APPROVED** |
| `sienna-brown-502a` | Sienna Brown | `#75452B` | 502A | Factory OEM | `nappa-exclusive` | **APPROVED** |
| `macchiato-beige-505a`| Macchiato Beige / Magma Grey | `#D8CAB8` | 505A | Factory OEM | `nappa-exclusive` | **APPROVED** |
| `carmine-red-oem` | Carmine Red Sport | `#8A1822` | CARMINE | Factory OEM | `nappa-exclusive` | **APPROVED** |
| `autolab-cognac-tan` | AutoLab Heritage Cognac Tan | `#9A5B2D` | N/A | AutoLab Bespoke | `nappa-exclusive`, `autolab-heritage-hide` | *PENDING APPROVAL* |
| `autolab-royal-oxblood`| AutoLab Royal Oxblood | `#5C1D24` | N/A | AutoLab Bespoke | `nappa-exclusive`, `autolab-heritage-hide` | *PENDING APPROVAL* |
| `autolab-nairobi-emerald`| AutoLab Nairobi Forest Emerald| `#1A382B` | N/A | AutoLab Bespoke | `nappa-exclusive`, `autolab-heritage-hide` | *PENDING APPROVAL* |

---

## 3. Accent Thread & Stitching Options

| Option ID | Thread Name | Hex Code | Stitching Pattern | Intended Application | Approval Status |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `contrast-champagne-gold`| Champagne Gold Luxury Contrast | `#D4AF37` | Diamond Quilted | Seat center flutes, headrests | **APPROVED** |
| `contrast-silver-shadow` | Silver Shadow Tech Stitch | `#C0C4CC` | French Seam | Upper dash cowl, door waistline | **APPROVED** |
| `contrast-burnt-amber` | Burnt Amber Heritage Stitch | `#C26829` | Double-Lap | Heavy-wear bolsters, armrests | *PENDING APPROVAL* |
| `contrast-crimson-red` | Crimson Red Sport Stitch | `#B3131F` | Perimeter Single | Steering wheel rim, sport seats | **APPROVED** |
| `tone-on-tone-black` | Stealth Black Tone-on-Tone | `#1A1A1A` | French Seam | Understated stealth packages | **APPROVED** |

---

## 4. Active Ambient Lighting Spectrum

| Channel ID | Preset Name | Hex Code | Color Mode | Primary Evidentiary Reference |
| :--- | :--- | :--- | :--- | :--- |
| `sunset-orange` | Sunset Orange | `#FF5722` | Warm Dynamic | MercBenzKing 4K Night Walkthrough (08:45) |
| `miami-rose` | Miami Rose | `#E91E63` | Vibrant Modern | OEM Global Media Portal Interior Night Shoot |
| `ocean-blue` | Ocean Blue | `#00BCD4` | Crisp Technical | Dealer Press Kit Night Ambient Display |
| `monaco-ice` | Monaco Cool White | `#E0F7FA` | Minimalist Pure | Autogefühl Premiere Night Sequence |
