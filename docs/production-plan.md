# Astra Production Plan & Implementation Roadmap
**Document:** `docs/production-plan.md`  
**Authority:** TODO Section 6  
**Target Consumer:** Downstream Production Agent (Astra)  

---

## 1. Executive Clarity for Astra

When Astra enters this repository, it must not experience ambiguity. The project's ten fundamental questions are answered below:

### 1.1 What are we building?
**AutoLab Digital Showroom** — A bespoke, real-time 3D automotive interior visualization and configuration experience built for AutoLab's luxury vehicle customisation atelier in Nairobi, Kenya.

### 1.2 Why are we building it?
To allow AutoLab's clients to visualize and actively participate in the bespoke transformation of their vehicle interior before physical craftsmanship begins, turning visual interest into qualified showroom consultations.

### 1.3 What must be built first?
1. The **3D S-Class interior asset in Blender** using confirmed metric dimensions and standardized scene graph names.
2. The **Three.js / React Three Fiber WebGL viewer** with calibrated camera presets.
3. The **Configuration state engine** executing real-time material uniform updates.

### 1.4 What must NOT be built?
No generic automotive marketplace, no exterior car body modeling, no e-commerce carts, no online payment gateways, no automated quotation algorithms, no heavy CRM, and no customer account logins.

### 1.5 What is known?
* Target chassis: Mercedes-Benz S-Class Seventh Generation (V223 Long Wheelbase).
* Exact metric cabin dimensions: Wheelbase (3,216 mm), Front Headroom (1,069 mm), Rear Legroom (1,115 mm), Screens (12.8" and 12.3").
* Scene graph hierarchy: Standardized node identifiers (`GEO_Dashboard_Screen_Central_OLED`, etc.).
* Configuration flow: **Material ➔ Colour ➔ Accent Thread ➔ Interior Composition** (Confirmed V1 sequence). Swatches and patterns are proposed candidates pending AutoLab signoff.

### 1.6 What is unknown?
* Precise internal mechanical rail profiles and motor housings beneath seat cushions (simplified planar geometry permitted).
* Internal HVAC packaging behind dashboard firewall (simplified low-poly bounding mesh).
* Exact micro-clearance between sliding front console cover and lower display bezel (controlled approximation permitted).

### 1.7 What requires human approval?
The eight approval gates in `docs/human-approval-gates.md` (chassis baseline confirmation, AutoLab hide catalogue, bespoke color palette, stitch patterns, WhatsApp lead number, final 3D asset signoff).

### 1.8 What does the 3D asset need to contain?
The complete interior cabin: dashboard wing deck, 12.8" OLED screen, 12.3" cluster, AMG steering wheel, front multicontour seats, rear executive suite (43.5° recline), center console waterfall, door panels with Burmester grilles, and 253-LED ambient lighting fiber strip.

### 1.9 How does the 3D asset connect to the application?
Exported as a Draco-compressed `.glb` loaded via Three.js. Application UI dispatches zone events that mutate material properties (`color`, `roughness`, textures) on tagged material slots (`MAT_Upholstery_Primary`, etc.) in real-time (< 16ms).

### 1.10 How will we know the implementation is correct?
By running automated verification against `docs/schemas/`, auditing against `docs/quality/acceptance-criteria.md`, and profiling WebGL performance (60fps desktop, 30–60fps mobile, < 15MB file size).

---

## 2. Four-Stage Production Phasing for Astra

```
Stage 1: 3D Asset Production (Blender)
         ├── Bounding cage & primary display scale anchors
         ├── Cockpit sweep, seating flutes, and kinematic pivots
         └── UV unwrapping, material slot tagging, Draco WebGL export
         │
Stage 2: Viewer & Integration (React Three Fiber)
         ├── Viewport canvas setup, lighting, and bounded orbit controls
         ├── Calibrated camera presets interpolation
         └── Live material slot uniform updater
         │
Stage 3: Configuration UI & Experience (Next.js 14)
         ├── Luxury design system (obsidian dark mode, gold accents)
         ├── Confirmed 4-step selector: Material ➔ Colour ➔ Accent Thread ➔ Composition
         └── Deterministic Reference Code generator (AL-SC-2026-XXXX)
         │
Stage 4: Lead Flow & Persistence (Supabase / WhatsApp)
         ├── WhatsApp deep-link generation
         ├── Consultation booking form & DB persistence
         └── QA audit against acceptance criteria and production readiness checklist
```
