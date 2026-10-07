# AutoLab S-Class Interior Component Map & Scene Graph Hierarchy
**Document:** `docs/3d-assets/interior-component-map.md`  
**Authority:** S-Class 3D Asset Brief (Section 2)  
**Target Consumer:** Downstream 3D Agent (Astra) / Three.js Asset Loader  

---

## 1. Scene Graph Naming Standard

Every 3D mesh node exported into the production glTF/GLB file must follow standardized prefix conventions:
* `GEO_`: Renderable polygonal geometry.
* `RIG_`: Kinematic bones, armatures, or articulation pivot empties.
* `MAT_`: Material slot identifiers bound to mesh primitives.
* `LIGHT_`: Virtual scene light anchors or emissive mesh surfaces.
* `CAM_`: Calibrated perspective camera nodes.

---

## 2. Definitive Component Assembly Matrix

| 3D Scene Graph Identifier | Cabin Subsystem | Parent Transform Node | Bound Material Slot | Geometric Bounds | Confidence |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GEO_Dashboard_Screen_Central_OLED` | Cockpit | `GRP_Dashboard_Main` | `MAT_Screen_Central_OLED` | 12.8 in diagonal, 60° inclination | CONFIRMED |
| `GEO_Dashboard_Screen_Driver_Cluster` | Cockpit | `GRP_Dashboard_Main` | `MAT_Screen_Driver_Cluster` | 12.3 in diagonal floating pedestal | CONFIRMED |
| `GEO_Interior_AmbientLight_FiberStrip` | Lighting | `GRP_Interior_Shell` | `EMISSIVE_Ambient_Lighting` | Continuous spline, 253 micro-LEDs | CONFIRMED |
| `GEO_Trim_Dashboard_WoodDeck` | Trim Deck | `GRP_Dashboard_Main` | `MAT_Trim_Deck_Main` | Compound sweep, A-pillar to A-pillar | CONFIRMED |
| `GEO_SteeringWheel_AMG_DoubleSpoke` | Steering | `GRP_Steering_Column` | `MAT_Steering_Leather` | Flat-bottom torus, twin dual spokes | CONFIRMED |
| `GEO_Console_Center_Front` | Console | `GRP_Console_Tunnel` | `MAT_Console_Veneer` | Sloping waterfall tunnel, tambour lid | CONFIRMED |
| `GEO_Seat_Front_Driver_Flutes` | Seating | `GRP_Seat_Front_Driver` | `MAT_Upholstery_Primary` | Diamond-quilted center flutes | CONFIRMED |
| `GEO_Seat_Front_Driver_Bolsters` | Seating | `GRP_Seat_Front_Driver` | `MAT_Upholstery_Secondary` | Ergonomic lateral support wings | CONFIRMED |
| `GEO_Seat_Front_Passenger_Flutes` | Seating | `GRP_Seat_Front_Passenger` | `MAT_Upholstery_Primary` | Diamond-quilted center flutes | CONFIRMED |
| `GEO_Seat_Front_Passenger_Chauffeur` | Seating | `GRP_Seat_Front_Passenger` | `MAT_Upholstery_Secondary` | Articulating backrest (up to 23° tilt) | CONFIRMED |
| `GEO_Seat_Rear_Executive_RH` | Seating | `GRP_Rear_Cabin_LWB` | `MAT_Upholstery_Primary` | Reclining backrest (up to 43.5° recline) | CONFIRMED |
| `GEO_Seat_Rear_CalfRest_RH` | Seating | `GEO_Seat_Rear_Executive_RH`| `MAT_Upholstery_Primary` | Deployable powered calf cushion | CONFIRMED |
| `GEO_Seat_Rear_LH_Suite` | Seating | `GRP_Rear_Cabin_LWB` | `MAT_Upholstery_Primary` | Luxury contour rear passenger seat | CONFIRMED |
| `GEO_Console_Center_Rear_FirstClass` | Console | `GRP_Rear_Cabin_LWB` | `MAT_Trim_Deck_Main` | Continuous business center tunnel | CONFIRMED |
| `GEO_Door_Panels_FL_FR_RL_RR` | DoorCards | `GRP_DoorCards_All` | `MAT_Door_Card_Substrate` | Multi-layered door card assembly | CONFIRMED |
| `GEO_Door_Armrests_All` | DoorCards | `GRP_DoorCards_All` | `MAT_Upholstery_Secondary` | Floating armrest grab wings | CONFIRMED |
| `GEO_Door_Speaker_Burmester_4D` | Audio | `GRP_DoorCards_All` | `MAT_Metal_Acoustic_Burmester` | Perforated metal grille (sail panel) | CONFIRMED |
| `GEO_Footwell_And_Carpeting` | Floor | `GRP_Interior_Shell` | `MAT_Carpet_Floor` | Convex low-poly floor bounds | CONFIRMED |

---

## 3. Material Slot to Configuration Zone Mapping

The WebGL application logic targets specific material slots to execute live swaps:

```
[ Customer Configurator Selection ]
                │
                ├──▶ MAT_Upholstery_Primary  ──▶ Front/Rear Center Flutes, Headrest Cushions, Calf Rests
                ├──▶ MAT_Upholstery_Secondary ──▶ Lateral Bolsters, Door Armrests, Center Knee Pads
                ├──▶ MAT_Trim_Deck_Main      ──▶ Dash Veneer Deck, Door Trim Inserts, Console Waterfall
                ├──▶ MAT_Steering_Leather    ──▶ Steering Wheel Outer Rim & Airbag Hub
                └──▶ EMISSIVE_Ambient_Lighting ➔ Continuous 253-LED Optical Fiber Perimeter
```
