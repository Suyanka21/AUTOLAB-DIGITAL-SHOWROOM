# Frontend Application Architecture
**Document:** `docs/application/frontend-architecture.md`  
**Authority:** Product Blueprint (Sections 18 & 19)  
**Target Consumer:** Frontend Engineers (Astra / Human Engineers)  

---

## 1. Technology Topology

* **Framework:** Next.js 14 (App Router)
* **Language:** TypeScript 5.6 (Strict Type Checking)
* **Styling:** Tailwind CSS 3.4 + PostCSS (Governed strictly by `docs/design-system.md`)
* **3D Engine:** Three.js / React Three Fiber (`@react-three/fiber`, `@react-three/drei`)
* **State Management:** Lightweight React Context / Zustand for reactive configuration state
* **Icons:** Lucide React (Tree-shakeable, luxury stroke weight: 1.5px)

---

## 2. Component Hierarchy

```
[ Root Layout (`src/app/layout.tsx`) ]
            │
            ▼
[ Digital Showroom Page (`src/app/page.tsx`) ]
            │
            ├──▶ [ ShowroomHeader ] (Brand logo, Vehicle model badge, Audio toggle)
            │
            ├──▶ [ 3D Viewport Shell ] (`src/components/showroom/ViewerCanvas.tsx`)
            │         ├── [ OrbitControls ] (Bounded camera angles & damping)
            │         ├── [ StudioLighting ] (Soft warm interior HDRI & ambient rim light)
            │         └── [ VehicleSceneModel ] (glTF loader, live material uniform updater)
            │
            ├──▶ [ ViewpointPresetBar ] (Cockpit, Driver, Console, Front, Rear, Night)
            │
            ├──▶ [ ConfigurationDock ] (`src/components/configurator/ConfigDock.tsx`)
            │         ├── [ ZoneTabSelector ] (Primary, Bolsters, Veneer, Stitch, Ambient)
            │         ├── [ SwatchPalette ] (PBR material & color swatches with active ring)
            │         └── [ LiveConfigSummaryMini ] (Current reference code & badge)
            │
            ├──▶ [ ConfigurationSummaryModal ] (`src/components/configurator/SummaryModal.tsx`)
            │         ├── Full design breakdown sheet
            │         └── Export / Copy Reference Code
            │
            └──▶ [ EngagementDrawer ] (`src/components/enquiry/EnquiryDrawer.tsx`)
                      ├── WhatsApp Instant Atelier Launch
                      └── Showroom Consultation Appointment Form
```

---

## 3. Mandatory 4 UX Pillars (Anti-AI Design Standard)

Every async interaction and surface must explicitly implement the 4 core UX states:
1. **Loading State:** Bespoke shimmering silhouette skeleton with pulsing progress indicator during 3D asset download.
2. **Empty State:** High-contrast informative card with clear call-to-action if an unsupported configuration combination is selected.
3. **Error State:** Dismissible banner with retry action if WebGL context is lost or network fails.
4. **Success State:** Affirmative visual confirmation when configuration reference code is generated or consultation request is sent.
