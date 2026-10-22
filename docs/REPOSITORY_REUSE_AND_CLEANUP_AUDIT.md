# Repository Reuse and Cleanup Audit: Pivot to Lexus RX 350

**Document:** `docs/REPOSITORY_REUSE_AND_CLEANUP_AUDIT.md`  
**Date:** 2026-10-22  
**Purpose:** Comprehensive audit classifying all codebase, 3D, and documentation assets for the Lexus RX 350 transition.  

---

## 1. Categorization Matrix

| Asset Category | Retain (Keep Unchanged) | Adapt (Reconfigure for Lexus) | Archive / Supersede (Isolate from Active Scope) |
| :--- | :--- | :--- | :--- |
| **Application & Shell UI** | • Atelier dark UI theme (`#08090C`)<br>• `ConfigurationDrawer.tsx`<br>• `SummaryBar.tsx`<br>• `AtelierHeader.tsx`<br>• Lucide icons & Tailwind layout | • Header vehicle title: "Mercedes-Benz S-Class" ➔ "2020 Lexus RX 350"<br>• Configurator breadcrumbs | • Mercedes-specific trim options and marketing copy |
| **Viewer & WebGL Engine** | • Three.js 0.186 / R3F 9.8 / Drei 10.7<br>• `RoomEnvironment` procedural PMREM lighting<br>• WebGL context loss recovery<br>• E2E diagnostic hooks (`window.__autolab`) | • `SpikeViewer.tsx` asset loader path (`/assets/3d/lexus-rx350/`)<br>• Node identifier bindings<br>• Camera presets (tailored to Lexus seating) | • Hardcoded S-Class node names (`GEO_Seat_Front_Driver_Flutes`, `GEO_Dashboard_Screen_Central_OLED`) |
| **Material & Configuration Engine** | • 4-step sequence (`Material → Colour → Thread → Composition`)<br>• Reference code generator (`AL-SC-2026-XXXXXX`)<br>• Material catalogue schema<br>• Swatch selection architecture | • `catalogue.json`, `colors.json`, `accent-threads.json` (aligned with Lexus black interior base & AutoLab hides) | • Mercedes S-Class specific trim combinations (e.g. Executive Fluted Duotone) |
| **3D Asset Pipeline & Gates** | • `scripts/validate-glb.mjs` glTF validator<br>• Draco compression & bounds validation<br>• `scripts/make-fixture.mjs`<br>• Python Blender export pipeline | • Scene manifest schema verification rules<br>• Asset gate node scope (Lexus front seats + touchpoints) | • Phase 1–5 S-Class GLB gate scripts and fixture scopes |
| **Test Suite** | • `tests/whatsapp.test.ts`<br>• `tests/glb-gate.test.ts` (6 synthetic mutations)<br>• Playwright browser test harness | • `tests/contracts.test.ts` (manifest and vehicle schema validators updated for Lexus) | • S-Class contract expectations (F1 4-slot allowlist) |
| **3D Model Binaries** | • None (Lexus models to be authored) | • `public/assets/3d/` folder structure | • `public/assets/3d/s-class-v223/spike.glb` (retained in historical archive, removed from active bundle once Lexus asset ready) |
| **Reference Materials** | • `AUTOLAB_LEXUS_SEAT_REFERENCE_PACK/` (active 35-photo set + research) | • Provenance and reference registers | • `AUTOLAB_V223_REFERENCE_PACK/` (archived in local storage; untracked in git) |

---

## 2. Detailed Component Audit

### 2.1 Reusable Application Infrastructure (RETAIN 100%)
1. **Next.js 16 + React 19 App Router Structure**:
   - `src/app/layout.tsx`, `src/app/page.tsx`, `src/app/globals.css`.
   - Complete zero-runtime-cost CSS, high-performance font loading, responsive layout.
2. **State Management**:
   - `src/lib/state/configurator-context.tsx`: Manages active tab, selected primary/secondary swatches, accent thread, composition mode, and camera preset. 100% agnostic to vehicle model.
3. **Atelier Header & Brand Aesthetics**:
   - `src/components/layout/AtelierHeader.tsx`: Anti-AI luxury aesthetic, Obsidian Dark (`#0B0B0B`), Dark Graphite (`#141416`), Electric Cyan / Champagne accents.
4. **Configuration Controls**:
   - `src/components/configurator/ConfigurationDrawer.tsx` and `SummaryBar.tsx`: Pure data-driven component rendering from JSON configuration files.
5. **Procedural Lighting Rig**:
   - `RoomLighting` inside `SpikeViewer.tsx`: Procedural PMREM generation with zero external HDRI asset downloads, fully licensed and reproducible.

### 2.2 Vehicle-Specific Configuration (ADAPT)
1. **Vehicle Configuration File**:
   - Current: `src/config/vehicles/mercedes-s-class-v223.json`
   - Target: `src/config/vehicles/lexus-rx350-2020.json` conforming to `docs/schemas/vehicle.schema.json`.
2. **Scene Manifest**:
   - Current: `src/config/scene-manifest.s-class-v223.json` (14 nodes, 7 defined slots, 4 unresolved F1 slots).
   - Target: `src/config/scene-manifest.lexus-rx350.json` specifying bounded front seats (`GEO_Seat_Front_Driver`, `GEO_Seat_Front_Passenger`), steering wheel (`GEO_SteeringWheel_Lexus`), and dashboard deck/display.
3. **Camera Presets**:
   - Current: `src/config/spike-camera-presets.ts` targeting S-Class coordinates.
   - Target: Recalibrated camera presets targeting Lexus front bucket seats, seam macro, and cockpit context (`LRX-08`, `LRX-23`, `LRX-30`, `LRX-31`).

### 2.3 Obsolete Assets (ARCHIVE & ISOLATE)
1. **S-Class V223 Spike GLB**:
   - Current location: `public/assets/3d/s-class-v223/spike.glb` (900 KB).
   - Action: Retain temporarily so the current application continues rendering without 404s until the Lexus asset is delivered by Astra. Once Lexus GLB passes gate, archive the S-Class folder.
2. **Phase 1A–5 Spike Documentation**:
   - Locations: `docs/spike/` and `docs/review/spike-2026-10-20/`.
   - Action: Preserve intact as historical audit trail for tooling feasibility and benchmark metrics. Add clear deprecation notices linking to `AUTOLAB_PIVOT_DECISION_RECORD.md`.

---

## 3. Runtime Dependency Evaluation

A review of `package.json` confirms:
- **No obsolete or heavy runtime dependencies exist**:
  - `@react-three/fiber` (9.8.2) and `@react-three/drei` (10.7.9) are modern, performant, and directly required for the 3D seat viewport.
  - `@gltf-transform/core` (4.5.1) is used strictly in dev/CI scripts for automated asset gating.
  - Zero unused UI or 3D libraries exist (Firebase and legacy packages were already cleared in Phase 1A).
- **Safety Verdict**: No dependencies need removal or uninstallation. The runtime bundle remains lean (~85 KB gzipped JS).
