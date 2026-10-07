# AutoLab Production Readiness Checklist
**Document:** `docs/quality/production-readiness-checklist.md`  
**Authority:** TODO Section 5 & Starter Template Shipping Standard  
**Target Consumer:** Production Agent (Astra), Lead Architect & Launch Engineers  

---

## Pre-Flight Launch Verification Gates

Before deploying the AutoLab Digital Showroom to public production, every item in this checklist must be confirmed and signed off:

### 1. Product & Commercial Governance
- [ ] V1 scope strictly adheres to the frozen boundaries (No e-commerce checkout, no vehicle marketplace).
- [ ] Mercedes-Benz S-Class V223 interior confirmed as primary launch vehicle.
- [ ] AutoLab catalog options (leathers, colors, veneers, threads) verified against physical workshop availability.
- [ ] Commercial project fee (KES 750,000) and milestone deliverables agreed.

### 2. 3D Asset & Scene Graph Quality
- [ ] Blender model authored to confirmed metric dimensions (Wheelbase 3,216 mm, Screen 12.8" diagonal).
- [ ] Scene graph nodes strictly follow standard naming (`GEO_Dashboard_Screen_Central_OLED`, etc.).
- [ ] Shut lines between dashboard wings and front door cards measure 3.5–4.5 mm with zero clipping.
- [ ] PBR shader networks utilize composite ORM textures and verified roughness values.
- [ ] Master `.glb` asset Draco-compressed and weighs under 15MB.
- [ ] Proprietary brand emblems either formally cleared or replaced with neutral AutoLab insignia placeholders.

### 3. Viewer & Configuration Engine
- [ ] 3D viewer renders at steady 60 FPS on desktop and 30–60 FPS on supported mobile devices.
- [ ] All six camera presets transition smoothly without disorienting cuts or clipping.
- [ ] Real-time material and color swaps execute in < 16ms without dropping frames.
- [ ] Deterministic Reference Code generator generates unique, consistent strings (`AL-SC-2026-XXXX`).
- [ ] WebGL context loss recovery verified on mobile memory exhaustion tests.

### 4. Application & Sales Consultation Handoff
- [ ] WhatsApp deep link launches correctly with full configuration summary text pre-populated.
- [ ] Showroom consultation form validates phone/WhatsApp numbers and persists leads to database.
- [ ] Mobile responsive layout tested on small screens (iPhone SE / iPhone 13 mini) with zero viewport overflow.
- [ ] All 4 UX states (Loading, Empty, Error, Success) verified across all dynamic views.
- [ ] Accessibility contrast ratios pass WCAG AA standards; keyboard focus rings visible.

### 5. Backend, Security & Infrastructure
- [ ] Database migrations deployed (Supabase PostgreSQL / Firebase Firestore).
- [ ] Row-Level Security (RLS) policies configured and active on `configurations` and `enquiries`.
- [ ] Anti-spam rate limiting enabled on public enquiry submission endpoints.
- [ ] Environment variables and secrets securely configured in production hosting platform.
- [ ] SSL certificate active; HTTP requests automatically redirect to HTTPS.
