# Mercedes-Benz S-Class 3D Asset Specification
**Document:** `docs/3d-assets/s-class-3d-specification.md`  
**Authority:** S-Class 3D Asset Brief (Authority 2)  
**Target Consumer:** Downstream 3D Agent (Astra) / Blender Pipeline  

---

## 1. 3D Interior Scope Definition

### Confirmed Production Scope
The 3D asset represents the **complete luxury interior cabin environment** of the Mercedes-Benz S-Class V223 (Long Wheelbase):
* **Cockpit & Dashboard Architecture:** Wing sweep, floating 12.8" OLED display, 12.3" instrument cluster, upper climate vents, lower knee bolsters.
* **Steering Assembly:** AMG-Line twin double-spoke steering wheel with touch control pads and ergonomic rim.
* **Center Console Tunnel:** Front sliding tambour cover, cupholder bay, butterfly split armrest, rear First-Class business console.
* **Seating Suite:**
  * Front driver and passenger multicontour dynamic seats with diamond-quilted cushion flutes.
  * Front passenger Chauffeur package forward-tilt mechanism (up to 23° past upright).
  * Rear Executive multicontour seat (RH) with multi-axis articulation (up to 43.5° recline, powered calf rest).
* **Door Cards & Pillars:** Front and rear door cards with floating armrest pulls, seat switch blocks, Burmester 4D speaker grilles, and A/B/C pillar trim.
* **Active Ambient Lighting:** Continuous 253-LED optical fiber perimeter spline loop.

### Explicitly Excluded Geometry
* Full exterior body panels, exterior glass, wheels, brakes, suspension, bumpers, and powertrain.
* Hidden chassis frame rails, engine compartment firewall, and under-dash HVAC packaging.
* Internal mechanical motor teeth and electrical wiring harnesses inside seat base pedestals.

---

## 2. Priority Map & Polygon Allocation

```
+-----------------------------------------------------------------------------------------+
| HIGH PRIORITY (Critical Customer Focal Points & Color/Material Swaps)                   |
| ➔ 12.8" MBUX Central OLED Display, mounting pedestal, and stepped bezel.               |
| ➔ 12.3" Driver Cluster floating display.                                               |
| ➔ Dashboard Wing Architecture & Upper Trim Veneer Deck (A-pillar to A-pillar).          |
| ➔ Front Multicontour Seats (Cushions, lateral bolsters, comfort headrest pillows).     |
| ➔ Rear Executive Multicontour Seating Suite & Powered Calf Rest.                       |
| ➔ AMG-Line Double-Spoke Steering Wheel (rim, hub, capacitive pads).                    |
| ➔ Front Center Console Waterfall Veneer & Armrest Split-Lids.                          |
| ➔ Active Ambient Lighting continuous 253-LED optical fiber spline.                     |
+-----------------------------------------------------------------------------------------+
| MEDIUM PRIORITY (Secondary Inspection Points, Kinematics & Cabin Enclosures)           |
| ➔ Front and rear door card panels, floating armrest pulls, and lower map pockets.       |
| ➔ First-Class rear continuous business console and folding aircraft work tables.       |
| ➔ Chauffeur passenger seat forward-slide and forward-tilt articulation.                |
| ➔ Burmester® 4D rotating tweeter grilles (A-pillar sail panels).                       |
| ➔ Overhead console, panoramic sunroof surround, and A/B/C pillar soft-touch trim.      |
| ➔ Rectangular dashboard HVAC vents with knurled metal directional louvers.             |
+-----------------------------------------------------------------------------------------+
| LOW PRIORITY (Peripheral, Shadowed, or Occluded Structural Hulls)                       |
| ➔ Footwell floor carpeting, heel pads, and pedal box (throttle, brake, footrest).      |
| ➔ Under-seat longitudinal sliding rail tracks and wiring covers.                       |
| ➔ Internal glove compartment cavity and underside of armrest storage bins.             |
| ➔ Trunk partition bulkhead and rear parcel shelf acoustic deck.                         |
+-----------------------------------------------------------------------------------------+
```

---

## 3. Geometric Tolerances & Modeling Standards

| Zone / Component | Requirement Standard | Target Tolerance | Modeling Rationale |
| :--- | :--- | :--- | :--- |
| **MBUX Display (12.8" OLED)** | **EXACT** | Absolute mm scale | 1.5–2.0 mm glass corner radius, stepped 0.8 mm perimeter bezel. Primary scale anchor. |
| **Driver Cluster (12.3" IC)** | **EXACT** | Absolute mm scale | Visorless hood pedestal; unhooded perimeter exposed to ambient light. |
| **Trim Deck & Air Vents** | **EXACT** | ±1.0 mm alignment | Four rectangular central vents and optical fiber channel must sit flush in veneer cutouts. |
| **Steering Wheel Rim & Boss** | **EXACT** | Exact ergonomic profile | High driver camera proximity; facetting instantly breaks visual immersion. |
| **Door Card Shut Gaps** | **EXACT** | 3.5 mm – 4.5 mm gap | Seam alignment between dash wing and door card waistline must remain consistent. |
| **Seat Cushions & Flutes** | **CONTROLLED APPROX** | High-poly baked to normal | Diamond quilting, perforations, and stitching handled via tangent-space normal maps. |
| **Rear Business Console** | **CONTROLLED APPROX** | ±3.0 mm bounding box | Exterior envelope must harmonize with executive seat bolsters. |
| **Under-Seat Rail Hardware** | **APPROXIMATION** | Simplified planar mesh | Occluded by seat skirts and floor shadows; minimal light bounce. |
| **Footwell Floor Hulls** | **APPROXIMATION** | Low-poly convex hull | Occluded by dash cowl and dark carpet materials. |

---

## 4. Kinematic Rigging Points

For interactive camera transitions and showcase animations, Astra should rig the following mechanical pivot points in Blender:
1. **Rear Executive Seat (RH):** Kinematic pivot allowing smooth recline from 19° upright to 43.5° relaxed, linked with outward rotation of the lower calf rest.
2. **Chauffeur Front Passenger Seat:** Forward pivot allowing up to 23° tilt beyond the standard 90° upright position to demonstrate maximum rear legroom.
3. **Center Console Tambour Lid:** Sliding path spline retracting the tambour door beneath the waterfall console to reveal cup holders.
4. **Burmester 4D Tweeters:** Cylindrical deployment transforming 10 mm outward with concurrent 90° axial rotation.

---

## 5. Trademark & Intellectual Property Guidelines

To ensure commercial deployment safety prior to formal brand licensing agreements:
* **Brand Emblems:** The Mercedes-Benz three-pointed star on the steering wheel boss and the Maybach double-M insignia on the C-pillar/rear console must be isolated on dedicated detachable sub-nodes (`GEO_Logo_Steering_Boss`, `GEO_Logo_Rear_Console`).
* **Anonymized Fallback:** The asset must include a clean, unbranded geometric boss cap and an optional **AutoLab Bespoke Atelier** metal badge placeholder that can be toggled via scene configuration.
* **Audio Badging:** Burmester® acoustic grilles must feature geometric acoustic hole perforation arrays without embedded registered trademark wordmarks.
