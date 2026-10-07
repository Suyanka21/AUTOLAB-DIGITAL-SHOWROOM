# Technical Architecture Specification
## Project: AutoLab Digital Showroom
### Version: 1.0.0 (Astra Production Baseline)

---

## 1. System Topology & Technology Stack

| Layer | Technology | Rationale |
| :--- | :--- | :--- |
| **Frontend Framework** | Next.js 14 (App Router) | React Server Components, client boundary isolation, fast hydration, SEO. |
| **Language** | TypeScript (Strict) | End-to-end type safety across schemas, configuration state, and 3D manifests. |
| **Styling** | Tailwind CSS + PostCSS | Token-based luxury dark mode governed by `docs/design-system.md`. |
| **3D Engine** | Three.js / React Three Fiber | Industry standard WebGL rendering with PBR shader networks and Draco support. |
| **Icons** | Lucide React | Clean, minimalist, tree-shakeable iconography. |
| **State Management** | React Context / Zustand | Zero-lag client state dispatching material uniform updates in < 16ms. |
| **Backend Option A** | Supabase + Drizzle ORM | Serverless PostgreSQL with type-safe schema and Row-Level Security (RLS). |
| **Backend Option B** | Firebase Firestore + Drizzle | Google Firestore document database with typed collection helpers. |
| **Agent Foundation** | `.agents/` Architecture | Permanent reasoning foundations (`global-reasoning-layer`, `coderabbit-dna`). |

---

## 2. Directory Layout & Repository Structure

```text
├── docs/                             # Authoritative truth layer & production contracts
│   ├── ASTRA_HANDOFF.md              # Master production directive for Astra
│   ├── PRD.md                        # Master Product Requirements Document
│   ├── architecture.md               # This technical topology document
│   ├── design-system.md              # Luxury design tokens & visual standards
│   ├── human-approval-gates.md       # 8 explicit human sign-off gates
│   ├── production-plan.md            # Machine-readable implementation roadmap
│   ├── product/                      # Product Constitution, Scope, Journey, Success
│   ├── 3d-assets/                    # S-Class 3D spec, Component map, PBR, Blender guide
│   ├── configuration/                # Config model, Options catalog, Future vehicle pipeline
│   ├── application/                  # Frontend, Backend, Lead flow, Admin requirements
│   ├── quality/                      # Acceptance criteria, Performance, QA strategy
│   └── schemas/                      # JSON Schemas: vehicle, config, enquiry, manifest
├── public/
│   └── assets/
│       ├── 3d/s-class-v223/          # Dropzone for Draco GLB assets from Astra
│       └── textures/                 # PBR textures (ORM, normal, albedo)
├── src/
│   ├── app/                          # Next.js 14 App Router routes
│   │   ├── layout.tsx                # Luxury theme wrapper & fonts
│   │   ├── globals.css               # Design tokens, variables, base styles
│   │   ├── page.tsx                  # Public 3D Digital Showroom experience
│   │   ├── admin/                    # Lightweight enquiry & configuration lookup
│   │   └── api/                      # Route handlers: /api/configurations, /api/enquiries
│   ├── components/                   # UI component library
│   │   ├── showroom/                 # 3D Canvas, OrbitControls, CameraPresets, Lighting
│   │   ├── configurator/             # ConfigDock, SwatchPicker, SummaryModal
│   │   ├── enquiry/                  # WhatsAppLink, ShowroomBookingForm
│   │   └── ui/                       # Primitives: Button, Card, Badge, Modal, Tabs
│   ├── config/                       # Machine-readable seed data
│   │   ├── vehicles/                 # mercedes-s-class-v223.json
│   │   ├── materials/                # catalogue.json, colors.json, accent-threads.json
│   │   └── scene-manifest.s-class-v223.json
│   ├── types/                        # TypeScript contracts
│   │   ├── vehicle.ts                # Vehicle definition & zone slots
│   │   ├── configuration.ts          # Selection state & summary interfaces
│   │   ├── enquiry.ts                # Consultation payload interfaces
│   │   └── asset3d.ts                # Scene nodes, tolerances, and budgets
│   └── lib/                          # Services & Database clients
│       ├── db/                       # Supabase / Firebase clients & Drizzle schemas
│       └── utils.ts                  # Classname merging and helpers
├── package.json                      # Project dependencies & scripts
└── tailwind.config.ts                # Token mappings & theme configuration
```

---

## 3. Vehicle-Asset Abstraction & Expansion Pipeline

```
[ Vehicle Definition JSON ] ──▶ [ 3D Interior GLB ] ──▶ [ Material Slots ] ──▶ [ Config Engine ] ──▶ [ Summary & Lead ]
```

The system decouples vehicle identity from application UI. Adding a future vehicle (Range Rover, Toyota Hilux) requires only authoring the vehicle definition JSON and dropping the standardized GLB asset into `public/assets/3d/<vehicle-id>/`, without modifying viewer or configuration logic.

---

## 4. Database Topology & Switching

Set `DATABASE_PROVIDER` in `.env.local`:
```bash
DATABASE_PROVIDER=supabase # or "firebase"
```
The database stores three primary entities:
1. `configurations`: Client interior designs indexed by Reference Code (`AL-SC-2026-XXXX`).
2. `enquiries`: Sales consultation leads carrying client contact info and preferred channel.
3. `analytics_events`: Operational telemetry (showroom entered, material swapped, preset changed).
