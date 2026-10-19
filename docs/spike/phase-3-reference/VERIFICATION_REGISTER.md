# VERIFICATION REGISTER: AUTOLAB V223 PHASE 3 REFERENCE PACK
**Project:** AutoLab Digital Showroom — Mercedes-Benz S-Class V223 Phase 3 Feasibility Spike  
**Asset Scope:** `GEO_Seat_Front_Driver_Flutes` & `GEO_Dashboard_Screen_Central_OLED`  
**Audit Date:** October 19, 2026  

---

## 1. Classification & Verification Summary

Every technical measurement extracted from `AUTOLAB_V223_PHASE3_REFERENCE_PACK.txt` has been audited against official manufacturer literature, press releases, technical manuals, and basic physical/mathematical laws. Claims are classified into four strict disposition tiers:
- **VERIFIED:** Directly supported by official Mercedes-Benz primary documentation or high-confidence technical releases.
- **DERIVED:** Mathematically or geometrically calculated from verified primary dimensions (noting any internal formula errors).
- **ESTIMATED:** Based on visual photogrammetry, proportional scaling, or assumed tolerances without direct CAD/physical proof.
- **UNVERIFIED:** Lacks supporting evidence, contains fatal mathematical errors, or is concealed/unknown.

---

## 2. Complete Technical Verification Register Table

| Metric / Claim Description | Claimed Value in Pack | Cited Source | Actual Source Support / Audit Evidence | Confidence Level | Audit Disposition | Key Notes & Audit Findings |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **V223 Chassis Wheelbase** | 3,216 mm (126.6 in) | `SRC-MB-PR-2021`, `SRC-AUTO-W223` | Supported by official Mercedes-Benz V223 technical specifications and press kit. | High | **VERIFIED** | Long-wheelbase (V223) spec. Distinguishes from standard W223 (3,106 mm) and Maybach Z223 (3,396 mm). |
| **V223 Overall Vehicle Length** | 5,289 mm (208.2 in) | `SRC-MB-PR-2021`, `SRC-AUTO-W223` | Supported by official Mercedes-Benz media specifications. | High | **VERIFIED** | Long-wheelbase (V223) overall length. |
| **Vehicle Width (Excl. Mirrors)** | 1,954 mm (76.9 in) | `SRC-MB-PR-2021` | Supported by official technical data sheets. | High | **VERIFIED** | Standard body width across W223/V223 series. |
| **Vehicle Overall Height** | 1,503 mm (59.2 in) | `SRC-MB-PR-2021` | Supported by official technical data sheets. | High | **VERIFIED** | Standard unladen vehicle height. |
| **Front Cabin Shoulder Room** | 1,496 mm (58.9 in) | `SRC-AUTO-W223` | Supported by Mercedes-Benz volumetric interior specification sheet. | High | **VERIFIED** | Door-to-door interior shoulder span. |
| **Front Cabin Maximum Headroom** | 1,070 mm (42.1 in) | `SRC-AUTO-W223` | Supported by Mercedes-Benz volumetric interior specification sheet. | High | **VERIFIED** | Uncompressed floorpan-to-headliner dimension. |
| **Central Display Diagonal** | 12.8 in (325.12 mm) | `SRC-MB-PR-2021`, `SRC-MB-OM-V223`, `SRC-MBLOG-MBUX` | Supported by official press releases and MBUX 2nd gen hardware release. | High | **VERIFIED** | Active emissive area diagonal measurement. |
| **Central Display Resolution** | 1888 × 1728 px | `SRC-MBLOG-MBUX`, `SRC-MB-PR-2021` | Supported by MBUX hardware technical teardowns. | High | **VERIFIED** | Native pixel grid (1888 vertical × 1728 horizontal). |
| **Active Screen Width ($W_{active}$)** | 219.51 mm (8.64 in) | Derived from 12.8" & 1888×1728 ratio | Derived via Pythagorean theorem ($W^2 + H^2 = 325.12^2$). | High | **DERIVED** | Calculated active canvas width. *Note: Pack formula contains fraction inversion typo ($1728/1888 = 1.0926$), but final calculation is mathematically accurate.* |
| **Active Screen Height ($H_{active}$)** | 239.83 mm (9.44 in) | Derived from 12.8" & 1888×1728 ratio | Derived via Pythagorean theorem. | High | **DERIVED** | Calculated active canvas height ($1.0926 \times W_{active}$). |
| **OLED Glass Assembly Outer Width** | 235.5 mm ± 2.0 mm | Estimated in Pack Table 3 | Unverified estimate. Pack text incorrectly states $219.5 + 8 = 235.5$ mm ($219.5 + 2 \times 8 = 235.5$ mm). | Medium | **ESTIMATED** | Outer glass frame bounds depend on unverified 8.0 mm side bezels. |
| **OLED Glass Assembly Outer Height** | 275.8 mm ± 3.0 mm | Estimated in Pack Table 3 | Unverified estimate based on photogrammetry. | Medium | **ESTIMATED** | Outer glass height includes top border and lower switch strip. |
| **Screen Inclination Sweep Angle** | 38.0° ± 1.0° (from vertical) / 52.0° (from floorpan) | Vector photogrammetry on side press shots | Derived from photo analysis, not manufacturer engineering drawings. | Medium | **ESTIMATED** | Swept-back console angle. Trigonometrically consistent ($90° - 38° = 52°$), but photogrammetrically unverified. |
| **Floating Screen Rear Air Gap** | 12.0 mm | Descriptive assertion in Pack | Unverified assertion. Concealed behind screen assembly; GAP-03 open. | Low | **UNVERIFIED** | Rear clearance gap between glass casing and dashboard veneer. |
| **Lower Switch Strip Dimensions** | 22 mm height, 14 mm roller dia., 2 mm extrusion | Visual photogrammetry in Pack | Photogrammetrically estimated against USB-C port scale. | Low | **ESTIMATED** | Control bar geometry and thumbwheel diameter. GAP-04 open. |
| **Cover Glass Bezel Details** | 4.5 mm chrome frame, 8.0 mm rim, 12.0 mm corner radius | Visual estimation in Pack | No manufacturer documentation or CAD backing. | Low | **ESTIMATED** | Aesthetic framing dimensions. |
| **Seat Central Flute Count** | 8 vertical flutes | `SRC-REV-GW2021`, press imagery | Supported by high-resolution interior photography of standard/Nappa leather V223 seats. | High | **VERIFIED** | Exactly 8 longitudinal vertical flutes across central backrest and cushion panels. |
| **Seat Cushion Assembly Width** | Claimed: 530.0 mm | Derived in Pack | **FATAL MATHEMATICAL ERROR.** $1,496 - 280 - (2 \times 150) = 916$ mm for **TWO** seats $\implies 458$ mm max width. | Zero | **UNVERIFIED (FLAWED)** | Claimed 530 mm width violates vehicle interior dimensions by 72 mm and overlaps console/door card. |
| **Seat Backrest Height** | Claimed: 840.0 mm | Derived in Pack | Indirectly derived from 1,070 mm headroom minus estimated H-point seating height. | Medium | **DERIVED** | Unextended backrest frame height (excluding headrest stalks). |
| **Nominal Flute Width** | 42.0 mm ± 1.5 mm (center), 38.0 mm (base taper) | Estimated in Pack Table 3 | Derived from flawed 530 mm cushion width scaling ($530 / 8 \approx 66$ mm total zone). | Low | **ESTIMATED** | Flute width scaling must be recalculated against corrected cushion width (~36–38 mm). |
| **Flute Recessed Channel Depth** | 6.0 mm ± 1.0 mm | Shadow depth profile analysis | Purely visual estimate under studio lighting. No physical measurement; GAP-01 open. | Low | **ESTIMATED** | Depth of blind tuck-in seam channels. |
| **Flute Crown Radius & Stitch Pitch** | Crown: 25 mm; Stitch: 3.5 mm | Visual estimation in Pack | Unverified visual estimation. | Low | **ESTIMATED** | Surface parabolic curvature and French seam stitch frequency. |
| **Seat Bolster Projection Angle** | 30.0° forward project | Descriptive press text | Visual approximation from interior press shots. | Medium | **ESTIMATED** | Lateral bolster wing projection angle. |
| **Floorpan Rail Attachment & Bolt Pitch** | Unknown / Unstated | None | Concealed beneath carpet and plastic cladding; GAP-01 open. | None | **UNVERIFIED** | Lower mounting rail infrastructure. |
| **PBR Material Parameters** | Roughness: 0.02–0.85; Metallic: 0.00–0.95 | Shader setup suggestions | Artist/rendering approximations. Mercedes-Benz does not publish PBR shader values. | N/A | **ESTIMATED** | Operational shader tuning values for Blender Cycles, not physical specs. |

---

## 3. Detailed Audit Findings & Discrepancy Analysis

### 3.1. Fatal Mathematical Derivation Error: Seat Cushion Width
- **Pack Calculation:** The pack attempts to derive the seat cushion width from total shoulder room ($1,496$ mm), center tunnel width ($280$ mm), and door card clearance ($150$ mm per side):
  $$\text{Claimed Cushion Width} = 1,496 - 280 - 300 = 916\text{ mm total space available for BOTH front seats.}$$
  Dividing total remaining span ($916$ mm) by two yields **$458.0$ mm per seat maximum**.
- **Error:** The pack incorrectly claims a seat cushion assembly width of **$530.0$ mm**. Modeling a $530$ mm seat in a $458$ mm envelope would cause severe mesh intersection with the center console ($280$ mm) and door cards ($150$ mm per side) by a massive $72$ mm per side.

### 3.2. Formula Inversion and Aspect Ratio Notation
- **Pack Formula:** In `CENTRAL_OLED_GEOMETRY.md` and `MEASUREMENT_REGISTER.md`, the pack writes:
  $$R = \frac{1728}{1888} \approx 1.0925926$$
  Mathematically, $\frac{1728}{1888} = 0.915254$, whereas $\frac{1888}{1728} = 1.0925926$.
- **Correction:** The ratio $1.0925926$ represents Height-to-Width ($\frac{H}{W} = \frac{1888}{1728}$). When solved via Pythagorean theorem ($W^2 + (1.0925926 W)^2 = 325.12^2$), the resulting physical active screen dimensions of **$219.51$ mm (width) × $239.83$ mm (height)** are mathematically accurate for a portrait $1728 \times 1888$ display.

### 3.3. Outer Glass Bezel Text Discrepancy
- **Pack Text:** "Derived active width ($219.5$ mm) + $8$ mm side bezels = $235.5$ mm."
- **Discrepancy:** $219.5 + 8.0 = 227.5$ mm. To reach $235.5$ mm outer width, the calculation requires $8.0$ mm bezels on **both** sides ($219.5 + 2 \times 8.0 = 235.5$ mm). The text omitted the $2\times$ factor in its written explanation.

### 3.4. Over-Precision and Unverified Estimates Stated as Hard Specs
- Dimensions such as screen inclination ($38.0^\circ$), flute depth ($6.0$ mm), volume roller diameter ($14.0$ mm), and glass outer bounds ($235.5 \times 275.8$ mm) are presented as firm parameters in modeling guidelines, but are explicitly listed as photogrammetric estimates in the document's own measurement tables.

### 3.5. Platform & Variant Confusion Risks
- **W223 vs V223:** Standard Wheelbase ($3,106$ mm) vs Long Wheelbase ($3,216$ mm). Cabin front row dimensions are identical, but overall chassis envelope differs ($5,179$ mm vs $5,289$ mm).
- **Maybach (Z223):** $3,396$ mm wheelbase. Features unique rear seat backs, bespoke wood trim inserts, and distinct front seat backrest shells. **Do not use Maybach backrest geometry for V223.**
- **2026+ Facelift Horizon:** Replaces the standalone floating 12.8" portrait display with the full-width MBUX Superscreen (pillar-to-pillar glass). **Any reference imagery showing a continuous passenger glass dashboard MUST be rejected.**
- **Upholstery Tier Trap:** Standard Leather and Nappa Leather feature 8 parallel vertical flutes (**target**). Exclusive Nappa Leather features diamond-quilted stitching (**must be rejected**).
