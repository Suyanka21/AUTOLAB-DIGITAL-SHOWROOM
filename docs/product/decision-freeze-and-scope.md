# AutoLab Decision Freeze, Scope & Boundaries
**Document:** `docs/product/decision-freeze-and-scope.md`  
**Authority:** Product Blueprint & Decision Freeze (Authority 1)  
**Status:** FROZEN — Changes require human confirmation and commercial change order.  

---

## 1. Decision Freeze (V1 Baseline)

The following decisions define the immutable operational boundaries of Version 1.0:

| Decision Dimension | Frozen Decision | Implementation Rule |
| :--- | :--- | :--- |
| **Product Purpose** | Interactive interior visualisation and configuration atelier. | Do not add e-commerce checkout, payment gateways, or cart logic. |
| **Lead Vehicle Platform** | Mercedes-Benz S-Class (Seventh Generation — V223 Long Wheelbase). | Focus 100% of 3D asset budget on the V223 interior cabin. |
| **Asset Domain** | Vehicle interior cabin (Cockpit + Seating + Console + Doors + Lighting). | Exclude exterior bodywork, engine bay, suspension, or underbody. |
| **Configuration Flow** | Vehicle ➔ Material ➔ Colour ➔ Accent Thread ➔ Visual Composition. | Keep flow visual, intuitive, and focused on high-impact transformation. |
| **Primary Material** | Leather (Exclusive Nappa & AutoLab Bespoke Hides). Fabric as secondary. | Factory OEM tones + approved AutoLab bespoke shades only. |
| **Commercial Purpose** | Lead generation and high-context sales consultation handoff. | Carry structured configuration reference code into AutoLab engagement. |
| **Pricing Policy** | No automated or fixed pricing in V1. Bespoke physical quotes only. | Display consultation prompt: *"Custom quotations tailored upon inspection"*. |
| **Backend Footprint** | Lean serverless persistence (Configurations + Leads + Events). | No complex ERP, no multi-tenant CRM, no vehicle specification DB. |

---

## 2. What Is Included in V1 (Scope Commitments)

The agreed **KES 750,000** production fee includes the following deliverables:

### 2.1 Product & Architecture Strategy
- Definitive technical codification, schemas, and production roadmap.
- Vehicle-asset abstraction supporting future platform expansion.
- Source traceability linking 3D geometry to official OEM and media research.

### 2.2 Visual Design & UX/UI
- Bespoke luxury digital showroom interface adhering to Anti-AI Design standards.
- Fully responsive mobile, tablet, and desktop layout.
- Visual configuration selector panels (Material, Color swatches, Accent Thread).
- Real-time configuration summary card with reference code generation.

### 2.3 3D S-Class Interior Asset
- Agreed Mercedes-Benz S-Class V223 Long Wheelbase interior environment.
- Standardized scene graph hierarchy with separated mesh nodes.
- PBR material networks (Nappa leather, open-pore wood, piano lacquer, ambient optical fiber, satin metal).
- Real-time WebGL optimization (Draco geometry compression, KTX2/Basis textures, LOD support).

### 2.4 Interactive 3D Viewer Experience
- WebGL rendering engine (Three.js / React Three Fiber / WebGL canvas).
- Six calibrated camera presets (Cockpit Master, Steering/Cluster, Center Console, Front Seats, Rear Executive, Night Ambient).
- Smooth orbit, pan, zoom controls with bounded camera limits.
- Instant material/color swapping on 3D meshes without scene reload.

### 2.5 Configuration Engine & Summary
- State management linking customer UI selections to 3D material parameters.
- Structured Configuration Object and deterministic Reference Code generator (`AL-SC-2026-XXXX`).
- Exportable/shareable configuration summary card.

### 2.6 Lead & Sales Consultation Handoff
- Direct engagement flow connecting the configured reference code to AutoLab.
- WhatsApp direct message generator pre-filled with configuration details.
- Showroom consultation request form capturing voluntary client contact data.

### 2.7 Testing, Quality Assurance & Deployment
- Comprehensive device, responsive, and cross-browser testing.
- WebGL performance audit meeting target frame rates (60fps desktop, 30–60fps mobile).
- Production deployment on secure modern web infrastructure with documentation handoff.

---

## 3. What Is NOT Included in V1 (Explicit Non-Goals)

To prevent uncontrolled scope creep and budget exhaustion, the following are strictly excluded:

1. **Multiple Vehicle Models in V1:** Only the S-Class V223 is built for V1. Future models enter in Phase 2+.
2. **Exterior Vehicle Modeling:** No car bodies, wheels, headlights, or road environments.
3. **Automated Quotations / Instant Pricing:** No algorithmic price estimates or financial calculators.
4. **E-Commerce Checkout / Online Payments:** No Stripe, M-Pesa automated billing, or checkout funnels.
5. **Customer Account Ecosystem:** No mandatory user registration, passwords, or persistent login walls.
6. **Heavy Enterprise Systems:** No workshop scheduling, inventory tracking, ERP, or custom CRM.
7. **Photorealistic Real-Time Raytracing:** Standard PBR WebGL rasterization; no server-side cloud streaming GPUs.
8. **Physical 3D Scanning Services:** No on-site LiDAR scanning rigs included in standard budget.
9. **Unlimited Material Combinations:** Only AutoLab-approved materials and curated color palettes.
10. **Native Mobile App (iOS / Android):** Mobile-first responsive web only; no App Store binaries.

---

## 4. Expansion Boundary (Future Roadmaps)

The architecture must support future extensions through the vehicle-asset pipeline without rewriting core code:

| Phase | Expansion Capability | Architectural Enabler |
| :--- | :--- | :--- |
| **Phase 2** | Additional Vehicles (Range Rover, Toyota Hilux, Porsche Cayenne) | `VehicleDefinition` schema and modular 3D asset bundles. |
| **Phase 3** | Deeper Interior Personalisation (Seat piping, custom embossing, starlight headliner) | Extensible `MaterialZoneSlot` definitions. |
| **Phase 4** | Before / After Transformation Slider | Dual-state material binding (`state.before` vs `state.after`). |
| **Phase 5** | Customer Account Portal & Saved Showroom Garage | Optional Supabase Auth integration leveraging existing tables. |
| **Phase 6** | Rule-Based Quotation Matrix | Admin pricing logic once AutoLab formalizes standard labor rate matrices. |
| **Phase 7** | Multi-Showroom Atelier Network | Multi-tenant branch routing for international or multi-city locations. |

*Note: Phases 2–7 are future possibilities, not commitments contained in the KES 750,000 V1 project.*

---

## 5. Commercial Cost Breakdown (KES 750,000)

| Project Component | Allocation |
| :--- | ---: |
| Product strategy, architecture & technical planning | KES 55,000 |
| UX/UI and Digital Showroom visual design | KES 75,000 |
| 3D S-Class interior asset production | KES 180,000 |
| Material, texture & configuration system | KES 70,000 |
| Interactive 3D viewer & configuration experience | KES 100,000 |
| Web application/frontend development | KES 75,000 |
| Configuration summary & AutoLab enquiry flow | KES 35,000 |
| Testing, optimisation & deployment | KES 55,000 |
| AI/software/tooling, infrastructure & production allowance | KES 35,000 |
| Project management, integration, revisions & professional labour | KES 70,000 |
| **TOTAL BESPOKE DEVELOPMENT FEE** | **KES 750,000** |
