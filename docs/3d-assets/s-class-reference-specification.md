# Mercedes-Benz S-Class Reference Specification
**Document:** `docs/3d-assets/s-class-reference-specification.md`  
**Authority:** S-Class 3D Asset Brief (Authority 2) & Mercedes S-Class Report (Authority 3)  
**Target Consumer:** 3D Production Agent (Astra) / Blender Technical Artists  

---

## 1. Platform Baseline & Chassis Identification

### 1.1 Generation & Architecture
* **Manufacturer:** Mercedes-Benz AG
* **Vehicle Line:** S-Class Flagship Luxury Sedan
* **Generation:** Seventh Generation (Series 223)
* **Platform Architecture:** MRA2 (Modular Rear Architecture)
* **Production Horizon:** Series production commenced late 2020 for Model Year 2021 through present day. A mid-cycle facelift applies to Model Year 2026.
* **Cockpit Architecture Baseline:** The **2021–2025 portrait OLED screen architecture (12.8-inch display)** represents the validated production baseline supported across all dealer order guides and technical documentation. While post-2025/2026 previews highlight the glass MBUX Superscreen, the portrait OLED layout is the confirmed geometric anchor.

### 1.2 Chassis Dimensions & Wheelbase Tiers

| Chassis Code | Platform Designation | Wheelbase | Overall Length | Overall Width (excl. mirrors) | Overall Height | Evidentiary Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **W223** | Standard Wheelbase (SWB) | 3,106 mm (122.3 in) | 5,179 mm (203.9 in) | 1,954 mm (76.9 in) | 1,503 mm (59.2 in) | CONFIRMED (OEM) |
| **V223** | **Long Wheelbase (LWB)** — *Selected Target* | **3,216 mm (126.6 in)** | **5,289 mm (208.2 in)** | **1,954 mm (76.9 in)** | **1,503 mm (59.2 in)** | **CONFIRMED (OEM)** |
| **Z223** | Mercedes-Maybach Extended | 3,396 mm (133.7 in) | 5,469 mm (215.3 in) | 1,921–1,954 mm | 1,510 mm (59.4 in) | CONFIRMED (OEM) |

### 1.3 Selected Target Justification: V223 (Long Wheelbase)
The **V223 chassis in AMG-Line specification** is strictly selected for digital reconstruction based on two empirical facts:
1. **Commercial Dominance & Data Density:** Long-wheelbase models represent >85% of total commercial deliveries in primary global luxury markets (North America, China, Middle East), yielding the greatest volume of official press imagery, CAD datasets, and dealer option guides.
2. **Functional Superspace:** The V223 interior contains the complete superset of interior architectural features—including executive rear seating, extended legroom (+110 mm over SWB), footrest kinematics, and continuous business console packaging. Reconstructing the V223 ensures any potential standard-wheelbase layout is captured as a natural geometric subset.

---

## 2. Definitive Metric Cabin Dimensions

All physical scale values extracted from official manufacturer press kits (Mercedes-Maybach Press Kit June 2021, Asset ID: 46931) and technical dealer brochures:

| Interior Measurement / Geometric Anchor | Metric Value (V223 LWB) | Imperial Equivalent | Evidentiary Status | Primary Source |
| :--- | :--- | :--- | :--- | :--- |
| **Front Headroom** | 1,069 mm | 42.1 in | **CONFIRMED** | Dealer Order Specs |
| **Effective Rear Headroom** | 974 mm | 38.3 in | **CONFIRMED** | Maybach Technical Kit |
| **Front Legroom** | 1,041–1,051 mm | 41.0 in | **CONFIRMED** | Dealer Order Specs |
| **Effective Rear Legroom** | 1,115 mm | 43.8 in | **CONFIRMED** | Maybach Press Kit |
| **Rear 2nd Row Kneeroom** | 197–218 mm | 7.8–8.6 in | **CONFIRMED** | Maybach Press Kit |
| **Rear Elbow Room** | 1,572 mm | 61.9 in | **CONFIRMED** | Maybach Press Kit |
| **MBUX Central Touchscreen** | 12.8 in diagonal | 12.8 in | **CONFIRMED** | Official OEM Specs |
| **Driver 3D Instrument Cluster** | 12.3 in diagonal | 12.3 in | **CONFIRMED** | Official OEM Specs |
| **Executive Seat Maximum Recline** | 43.5° (19° upright) | 43.5° | **CONFIRMED** | Maybach Technical Kit |
| **Chauffeur Passenger Seat Forward Tilt** | 23° past 90° upright | 23° | **CONFIRMED** | Chauffeur Spec |
| **Active Ambient Light LED Count** | 253 optical LEDs | 253 LEDs | **CONFIRMED** | Technical Press Kit |
| **Upper Dashboard Deck Depth** | ~480–520 mm | ~19.5 in | **ESTIMATED** | Proportional to 12.8" OLED |
| **Steering Wheel Outer Diameter** | ~375 mm | ~14.8 in | **ESTIMATED** | Proportional to 12.3" IC |
| **Front Center Console Width** | ~280 mm | ~11.0 in | **ESTIMATED** | Proportional to Seat Gap |

---

## 3. High-Value Source Corpus & Traceability Matrix

| Rank | Source Description | Primary Contribution | Access URI / Identifier | Legal / License Status |
| :--- | :--- | :--- | :--- | :--- |
| **1** | Mercedes-Maybach Press Kit (June 2021) | Metric dimensional matrix, seating kinematics (43.5° recline, 23° tilt), optical lighting specs. | Asset ID: 46931 | Official OEM Media |
| **2** | Mercedes-Benz Global Media Portal | 90+ studio photographs, orthographic dashboard views, official color/material assets. | `media.mercedes-benz.com` | Official OEM Media |
| **3** | US/UK Dealer Order Guides (MY 2023–2024) | Factory option codes (501A, 502A), interior equipment dependencies, trim finishes. | MBWorld Tech Archive | Internal Dealer Reference |
| **4** | Autogefühl Premiere & S580 Reviews | High-resolution 4K mechanical inspection: console tambour door, seat kinematics, stitch close-ups. | YouTube `@autogefuehl` | Automotive Media Reference |
| **5** | MercBenzKing S-Class Night Drive | Master reference for 253-LED ambient fiber bloom, 64-color channels, windshield reflections. | YouTube `@MercBenzKing` | Automotive Media Reference |
| **6** | GommeBlog Official Tech Reveal | Burmester 4D rotating tweeter startup deployment and headrest acoustic integration. | YouTube (GommeBlog) | Automotive Media Reference |
