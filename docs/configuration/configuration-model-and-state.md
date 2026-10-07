# Configuration Model, State & Summary Architecture
**Document:** `docs/configuration/configuration-model-and-state.md`  
**Authority:** Product Blueprint (Sections 12 & 13)  
**Target Consumer:** Frontend Engineers & Astra  

---

## 1. Confirmed V1 Configuration Flow

The configuration flow is strictly sequenced around the four confirmed dimensions from the Product Blueprint:

```
[ 1. Select Vehicle Platform ] (Mercedes-Benz S-Class V223 Baseline)
                │
                ▼
[ 2. Select Material ] (Confirmed primary: Leather)
                │
                ▼
[ 3. Select Colour ] (Proposed candidates pending AutoLab Gate 3 approval)
                │
                ▼
[ 4. Select Accent Thread ] (Proposed candidates pending AutoLab Gate 4 approval)
                │
                ▼
[ 5. Select Interior Composition ] (Monotone Hide, Duotone Split, Executive Fluted)
                │
                ▼
[ 6. Generate Configuration Summary ] ──▶ Reference Code: AL-SC-2026-XXXX
```

---

## 2. Configuration State Representation

The configurator state is managed as an immutable, validated object conforming to `src/types/configuration.ts` and `docs/schemas/configuration.schema.json`:

```typescript
export interface ConfigurationState {
  referenceCode: string;          // Deterministic unique ID: "AL-SC-2026-A8F2"
  vehicleId: string;              // Target vehicle: "mercedes-s-class-v223"
  createdAt: string;              // ISO 8601 timestamp
  updatedAt: string;              // ISO 8601 timestamp
  selections: {
    // 1. CONFIRMED V1 CORE: Material -> Colour -> Accent Thread -> Interior Composition
    primaryMaterialId: string;     // Confirmed: Leather (or fabric where supported)
    primaryColorId: string;        // Proposed candidate, requires AutoLab approval
    accentThreadId: string;        // Proposed candidate, requires AutoLab approval
    interiorComposition: {
      tier: "bespoke_monotone" | "bespoke_duotone" | "executive_fluted";
      appliedZones: string[];      // Zones modified in this composition
    };
    // 2. PROPOSED / EXTENDED SELECTIONS (Pending AutoLab Gate 5 confirmation)
    extendedZones?: {
      secondaryAccentBolsters?: ZoneSelection;
      trimDeckVeneer?: ZoneSelection;
      steeringWheel?: ZoneSelection;
    };
    // 3. 3D VISUAL SETTINGS (Asset feature, unconfirmed customer dimension in V1)
    ambientLightingPreset?: {
      optionId: string;
      colorHex: string;
    };
  };
  notes?: string;
}
```

---

## 3. Deterministic Reference Code Algorithm

To bridge digital configurations into AutoLab's physical showroom workflow, every unique combination generates a deterministic, human-readable reference code:

### Format Specification
`AL-[CHASSIS_ABBR]-[YEAR]-[HASH4]`
* `AL`: AutoLab Brand Prefix.
* `SC`: Vehicle Abbreviation (`SC` = S-Class, `RR` = Range Rover, `HX` = Hilux).
* `2026`: Production Year.
* `HASH4`: 4-character uppercase alphanumeric CRC16/Murmur hash derived from the sorted selection payload.

### Example Reference Codes
* `AL-SC-2026-8A3F` (S-Class, Sienna Brown Nappa, Open-Pore Poplar, Champagne Stitch)
* `AL-SC-2026-1C9D` (S-Class, Black Nappa, Forged Carbon, Crimson Stitch)

---

## 4. Configuration Summary Sheet

When the client completes their design, the application synthesizes a human-readable **Configuration Summary**:
* **Vehicle Platform:** Mercedes-Benz S-Class (Seventh Gen — V223 LWB)
* **Configuration Code:** `AL-SC-2026-8A3F`
* **Primary Upholstery:** Exclusive Nappa Leather in Sienna Brown (Code 502A)
* **Secondary Bolsters:** Exclusive Nappa Leather in Obsidian Black (Code 501A)
* **Veneer Finish:** Anthracite Open-Pore Poplar Timber Deck
* **Accent Stitching:** Champagne Gold Luxury Contrast (Diamond-Quilted)
* **Ambient Profile:** Sunset Orange 253-LED Active Bloom
* **Customization Tier:** AutoLab Bespoke Transformation Atelier
* **Next Action:** Consult AutoLab Advisor for physical hide inspection & vehicle condition quote.
