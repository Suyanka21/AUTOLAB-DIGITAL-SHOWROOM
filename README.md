# AutoLab Digital Showroom
> **Interactive 3D Automotive Interior Configurator & Sales Atelier**  
> Prepared and codified for downstream production by **Astra**. Governed by 27 active agent skills, Next.js 14 App Router, Three.js WebGL, and Anti-AI Design standards.

---

<!-- AI_AGENT_DIRECTIVE_START -->
> ### 🤖 SYSTEM DIRECTIVE FOR ALL AI CODING AGENTS (ASTRA & DOWNSTREAM AGENTS)
> **Applies to**: Astra, Claude Code, Cursor, Antigravity, Kilo Code, Windsurf, VS Code (Cline / Roo / Copilot), Bolt.new, v0.dev.
>
> 1. **Primary Operational Specification**:
>    - Your master entry document is **[`docs/ASTRA_HANDOFF.md`](docs/ASTRA_HANDOFF.md)**.
>    - You are building the **AutoLab Digital Showroom** for the Mercedes-Benz S-Class (V223 LWB).
>    - All development decisions, 3D asset specifications, and configuration logic must derive strictly from the **`/docs` directory**:
>      - [`docs/ASTRA_HANDOFF.md`](docs/ASTRA_HANDOFF.md) — Master implementation handoff directive.
>      - [`docs/PRD.md`](docs/PRD.md) — Product requirements and customer journey.
>      - [`docs/production-plan.md`](docs/production-plan.md) — 4-stage machine-readable implementation roadmap.
>      - [`docs/3d-assets/`](docs/3d-assets/) — S-Class 3D specification, scene graph map, and Blender pipeline.
>      - [`docs/configuration/`](docs/configuration/) — Configuration engine, options catalogue, and vehicle expansion.
>      - [`docs/human-approval-gates.md`](docs/human-approval-gates.md) — 8 explicit human approval gates.
>    - Your master orchestration contracts are [AGENTS.md](AGENTS.md) and [.agents/rules/skill-orchestration.md](.agents/rules/skill-orchestration.md).
> 2. **Permanent Cognitive Foundations** (Always Active):
>    - `.agents/skills/global-reasoning-layer/SKILL.md`: Defensive reasoning engineer, not an unverified generator.
>    - `.agents/skills/coderabbit-dna/SKILL.md`: Defensive engineering applied to every boundary, edge case, and render loop.
> 3. **Mandatory UI Order**:
>    - For ANY UI screen or component, you MUST execute `.agents/skills/anti-ai-design/SKILL.md` FIRST before `.agents/skills/frontend-ui-engineering/SKILL.md`.
> 4. **Change Summary**:
>    - Conclude every completed task with the formal `CHANGE SUMMARY` required by `AGENTS.md`.
<!-- AI_AGENT_DIRECTIVE_END -->

---

## 🏛️ Project Architecture & Truth Layer Index

The `/docs` directory is the immutable source of truth for the AutoLab Digital Showroom:

```
docs/
├── ASTRA_HANDOFF.md                       # ★ Master production directive for Astra
├── PRD.md                                 # Master Product Requirements Document
├── architecture.md                        # Full-stack technical topology & data model
├── design-system.md                       # Luxury Anti-AI design tokens & palette
├── human-approval-gates.md                # 8 explicit human sign-off gates
├── production-plan.md                     # Machine-readable 4-stage implementation plan
│
├── product/                               # PRODUCT DEFINITION
│   ├── product-constitution.md            # Foundational principles & non-negotiable boundaries
│   ├── decision-freeze-and-scope.md       # Frozen V1 scope (included vs excluded)
│   ├── customer-journey.md                # 6-step customer journey & "WOW" transformation
│   └── success-definition.md              # Commercial KPIs & conversion definition
│
├── 3d-assets/                             # 3D ASSET SPECIFICATION
│   ├── s-class-reference-specification.md # Confirmed V223 metric cabin dimensions
│   ├── s-class-3d-specification.md        # 3D interior scope, priority map, tolerances
│   ├── interior-component-map.md          # Scene graph naming hierarchy (GEO_*, MAT_*)
│   ├── material-and-texture-specification.md # PBR metallic-roughness shader parameters
│   ├── blender-production-pipeline.md     # Step-by-step Blender authoring guide
│   ├── viewer-and-integration-requirements.md # Three.js WebGL rendering & camera presets
│   ├── zero-purchase-feasibility-gate.md  # Feasibility rubric & commercial purchase rules
│   └── licensing-and-evidence.md          # IP protection, trademarks & evidence matrix
│
├── configuration/                         # CONFIGURATION ENGINE
│   ├── configuration-model-and-state.md   # State machine & reference code algorithm
│   ├── configuration-options-catalogue.md # Leather hides, trim veneers, accent threads
│   └── future-vehicle-expansion-model.md  # Vehicle-asset abstraction (Range Rover, Hilux)
│
├── application/                           # APPLICATION MODULES
│   ├── frontend-architecture.md           # Next.js 14 component tree & 4 UX pillars
│   ├── backend-and-data-architecture.md   # Lean persistence (Supabase / Firebase)
│   ├── lead-and-enquiry-flow.md           # WhatsApp launch & showroom booking workflow
│   └── lightweight-admin-requirements.md  # Advisor lookup & inventory status
│
├── quality/                               # VERIFICATION & PERFORMANCE
│   ├── acceptance-criteria.md             # Functional & 3D verifiable assertions
│   ├── performance-requirements.md        # 60 FPS, < 15MB asset, < 350k triangle budget
│   ├── qa-strategy.md                     # 5-tier testing pyramid & device matrix
│   └── production-readiness-checklist.md  # Pre-launch deployment checklist
│
└── schemas/                               # MACHINE-READABLE CONTRACTS
    ├── vehicle.schema.json                # JSON Schema for vehicle definitions
    ├── configuration.schema.json          # JSON Schema for configuration states
    ├── enquiry.schema.json                # JSON Schema for enquiry payloads
    └── scene-manifest.schema.json         # JSON Schema for 3D glTF scene graph validation
```

---

## 🏎️ Lead Vehicle: Mercedes-Benz S-Class (V223 LWB)

* **Platform:** Seventh-Generation S-Class Sedan (Series 223)
* **Chassis:** **V223 Long Wheelbase** in AMG-Line specification
* **Model Horizon:** MY 2021–2025 portrait OLED baseline
* **Key Dimensions:** Wheelbase: 3,216 mm | Length: 5,289 mm | Width: 1,954 mm | Height: 1,503 mm
* **Displays:** 12.8" MBUX Central OLED Display + 12.3" Floating Instrument Cluster

---

## 🎨 Configuration Dimensions (V1 Frozen Flow)

```
[ Vehicle ] ──▶ [ Primary Leather ] ──▶ [ Secondary Bolster ] ──▶ [ Trim Veneer ] ──▶ [ Accent Thread ] ──▶ [ Ambient LED ] ──▶ [ Reference Code: AL-SC-2026-XXXX ]
```

1. **Primary Leather:** Exclusive Nappa in Black (501A), Sienna Brown (502A), Macchiato Beige (505A), Carmine Red, or AutoLab Bespoke Hides (Cognac Tan, Royal Oxblood, Nairobi Emerald).
2. **Secondary Bolsters:** Monotone or contrasting leather split across outer bolsters, armrests, and knee pads.
3. **Trim Decks:** Anthracite Open-Pore Poplar, Warm Walnut, Piano Lacquer Flowing Lines, or Forged Aerospace Carbon Fiber.
4. **Accent Stitching:** Champagne Gold Contrast (Diamond Quilt), Silver Shadow (French Seam), Burnt Amber, or Crimson Red.
5. **Active Ambient Lighting:** Continuous 253-LED optical fiber loop across 64 calibrated RGB tones.

---

## ⚡ Quickstart for Production

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the application shell.

### 3. Database Setup (Supabase / Firebase)
Configure `.env.local`:
```bash
DATABASE_PROVIDER=supabase # or "firebase"

# Supabase
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="your-anon-key"
DATABASE_URL="postgres://postgres:password@db.your-project.supabase.co:5432/postgres"

# AutoLab WhatsApp Destination
NEXT_PUBLIC_AUTOLAB_WHATSAPP_NUMBER="254700000000"
```

---

## 🛠️ Machine-Readable Contracts in `src/`

- **TypeScript Types:**
  - `src/types/vehicle.ts`: Vehicle abstraction and camera presets.
  - `src/types/configuration.ts`: Selection states, material categories, and summaries.
  - `src/types/enquiry.ts`: Sales consultation leads and customer contact payloads.
  - `src/types/asset3d.ts`: Scene graph nodes, priority tiers, tolerances, and budgets.
- **Seed Configuration Data:**
  - `src/config/vehicles/mercedes-s-class-v223.json`: Authoritative S-Class V223 specification.
  - `src/config/materials/`: Curated materials, colors, and accent-threads catalogs.
  - `src/config/scene-manifest.s-class-v223.json`: 3D node manifest and material slot bindings.
- **3D Asset Dropzone:**
  - `public/assets/3d/s-class-v223/`: Destination for Astra's Draco-compressed `interior.glb`.

---

## 📋 Commercial Governance & Human Approval

The project is governed by the **KES 750,000** fixed bespoke production fee. Before public launch, the eight human approval gates in [`docs/human-approval-gates.md`](docs/human-approval-gates.md) must be formally confirmed by AutoLab leadership.

---

## 📄 License
Commercial Proprietary © AutoLab Kenya / Suyanka
All rights reserved.
