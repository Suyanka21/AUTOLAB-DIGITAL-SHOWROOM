# Configuration Model, State & Summary Architecture
**Document:** `docs/configuration/configuration-model-and-state.md`  
**Authority:** Product Blueprint (Sections 12 & 13)  
**Target Consumer:** Frontend Engineers & Astra  

---

## 1. Frozen V1 Configuration Flow

The configuration flow is strictly sequenced to ensure intuitive progression:

```
[ 1. Select Vehicle Platform ] (Mercedes-Benz S-Class V223 Baseline)
                │
                ▼
[ 2. Select Primary Upholstery ] (Exclusive Nappa / AutoLab Bespoke Hide + Base Color)
                │
                ▼
[ 3. Select Secondary Bolster Accent ] (Monotone match or two-tone split)
                │
                ▼
[ 4. Select Dashboard & Door Veneer ] (Poplar, Walnut, Piano Lacquer, or Forged Carbon)
                │
                ▼
[ 5. Select Accent Stitching & Thread ] (Stitch pattern + thread hue)
                │
                ▼
[ 6. Set Active Ambient Lighting Mood ] (253-LED continuous fiber optical hue)
                │
                ▼
[ 7. Generate Configuration Summary ] ──▶ Reference Code: AL-SC-2026-XXXX
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
    primaryUpholstery: {
      zoneId: "zone_primary_upholstery";
      materialId: string;         // e.g. "nappa-exclusive"
      colorId: string;            // e.g. "sienna-brown-502a"
      accentThreadId?: string;    // e.g. "contrast-champagne-gold"
    };
    secondaryAccent?: {
      zoneId: "zone_secondary_accent";
      materialId: string;
      colorId: string;
      accentThreadId?: string;
    };
    trimDeck: {
      zoneId: "zone_trim_deck";
      materialId: string;         // e.g. "open-pore-poplar"
      colorId: string;            // e.g. "anthracite-poplar"
    };
    steeringWheel: {
      zoneId: "zone_steering_wheel";
      materialId: string;
      colorId: string;
    };
    ambientLighting?: {
      optionId: string;
      colorHex: string;           // e.g. "#FF5722"
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
