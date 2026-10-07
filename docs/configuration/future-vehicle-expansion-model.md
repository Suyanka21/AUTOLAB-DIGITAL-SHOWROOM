# Future Vehicle Expansion Model & Pipeline
**Document:** `docs/configuration/future-vehicle-expansion-model.md`  
**Authority:** Product Blueprint & Decision Freeze (Section 10 & 11)  
**Target Consumer:** Systems Architects, Astra, and Future Engineers  

---

## 1. Architectural Philosophy: The Vehicle-Asset Abstraction

The Mercedes-Benz S-Class V223 is the **initial vehicle platform**, not a hard-coded application monolith. The entire configurator engine is designed around a **Vehicle-Asset Abstraction**:

```
[ Vehicle Definition ] (JSON Contract)
          │
          ├──▶ [ 3D Interior Asset ] (Glb file + Draco compression)
          │
          ├──▶ [ Interior Component Map ] (Standardized scene graph identifiers)
          │
          ├──▶ [ Material Zones ] (Slots: Primary Upholstery, Bolster, Trim, Stitch)
          │
          ├──▶ [ Configuration Options ] (Curated materials, colors, threads)
          │
          ├──▶ [ Visual State Manager ] (Uniform property mutations)
          │
          └──▶ [ Configuration Summary ] (Deterministic reference code)
```

No code in the 3D viewer or configuration state machine assumes Mercedes-Benz geometry or hard-codes S-Class specific properties.

---

## 2. Standardized Ingestion Pipeline for Future Vehicles

When AutoLab expands the Digital Showroom to include subsequent models—such as the **Range Rover (L460)** or **Toyota Hilux (Bespoke Overlanding Cabin)**—the new vehicle enters through this exact six-step pipeline:

### Step 1: Create Vehicle Definition JSON
Create `src/config/vehicles/<vehicle-id>.json` conforming to `docs/schemas/vehicle.schema.json`. Define verified wheelbase, cabin bounding box dimensions, and interior zone slots.

### Step 2: Author 3D Interior Asset in Blender
Follow the standardized Blender production guidelines:
* Construct metric bounding cage matching vehicle technical specs.
* Model interior cabin using standardized prefix naming (`GEO_Seat_Front_Driver`, `GEO_Trim_Dashboard`, etc.).
* Tag material slots (`MAT_Upholstery_Primary`, `MAT_Trim_Deck_Main`).

### Step 3: Export WebGL Asset
Export Draco-compressed `.glb` into `public/assets/3d/<vehicle-id>/interior.glb`. Validate against `docs/schemas/scene-manifest.schema.json`.

### Step 4: Calibrate Camera Presets
Define vehicle-specific perspective camera coordinates in the vehicle JSON (e.g. higher command driving position for Range Rover or truck cabin framing for Hilux).

### Step 5: Assign Supported Material Zones
Bind AutoLab's approved materials and stitch patterns to the vehicle's unique component slots.

### Step 6: Register in Showroom Vehicle Registry
Add the new vehicle ID to the active vehicle catalog. The UI automatically displays the vehicle selector card without changing any application or viewer logic.

---

## 3. Strict Architectural Guardrail: No Generic Platform Bloat

Future vehicle expansion must **never** be used as an excuse to build a generic automotive platform. The following remain strictly prohibited:
* NO global VIN decoders or license plate query APIs.
* NO third-party vehicle databases or Kelley Blue Book / Edmunds style scrapers.
* NO generic marketplace listings or dealer inventory grids.
* The application remains strictly: **AutoLab's premium digital interior showroom.**
