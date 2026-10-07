# Functional & 3D Acceptance Criteria
**Document:** `docs/quality/acceptance-criteria.md`  
**Authority:** TODO Section 16 & Product Blueprint Section 31  
**Target Consumer:** QA Engineers, Production Agent (Astra) & Project Lead  

---

## 1. Functional Acceptance Criteria (Client Journey)

Every completed build must pass the following verifiable assertions:

| Test ID | Acceptance Statement | Verification Method | Pass Criteria |
| :--- | :--- | :--- | :--- |
| **FAC-01** | Client can enter the Digital Showroom without authentication barriers. | Navigation to `/` | Atelier shell renders instantly with active branding. |
| **FAC-02** | Client can access the S-Class V223 interior environment. | Vehicle selection | 3D interior canvas loads within initial bandwidth budget. |
| **FAC-03** | Client can orbit, pan, and zoom inside the 3D cabin. | Mouse / Touch input | Smooth camera movement bounded by polar and azimuth limits. |
| **FAC-04** | Client can activate all six calibrated camera presets. | Viewpoint preset buttons | Camera smoothly interpolates to target position and FOV. |
| **FAC-05** | Client can swap primary upholstery material and color. | Swatch selection | Target mesh normal/albedo updates in real time (< 16ms). |
| **FAC-06** | Client can select secondary bolster accent materials. | Bolster selector | Outer bolsters, armrests, and knee pads reflect chosen hide. |
| **FAC-07** | Client can configure dashboard and door veneer trim decks. | Trim selector | Veneer meshes swap between Poplar, Walnut, and Carbon. |
| **FAC-08** | Client can select accent thread color and stitch pattern. | Stitch selector | Normal map fluting and stitch color update accurately. |
| **FAC-09** | Client can adjust active ambient lighting color mood. | Ambient palette | Emissive fiber strip shifts color and reflects on glass. |
| **FAC-10** | Configuration state remains synchronized with 3D representation. | State audit | Selections in UI match active 3D shader uniforms exactly. |
| **FAC-11** | Configuration Summary generates a valid Reference Code. | Summary generation | Outputs format `AL-SC-2026-[HASH4]` with full choice breakdown. |
| **FAC-12** | WhatsApp consultation button generates pre-formatted text. | External deep-link test | Opens WhatsApp with complete configuration summary attached. |
| **FAC-13** | Consultation form persists inquiry and reference code to DB. | Form submission | Row created in `enquiries` table with status `new`. |
| **FAC-14** | Zero unsupported AutoLab capabilities are presented as options. | Content audit | All exposed options trace to approved catalog items. |

---

## 2. 3D Asset Acceptance Criteria

| Test ID | Asset Acceptance Statement | Verification Standard |
| :--- | :--- | :--- |
| **3AC-01** | Asset geometry adheres strictly to the confirmed V223 Long Wheelbase dimensions. | Blender metric measurement audit (Wheelbase: 3,216 mm). |
| **3AC-02** | Scene graph follows the standardized prefix hierarchy (`GEO_`, `MAT_`, `RIG_`). | glTF node tree inspection against scene-manifest schema. |
| **3AC-03** | Display screen bezels (12.8" & 12.3") maintain exact millimeter dimensions. | Screen diagonal and corner radii verification. |
| **3AC-04** | Seam gaps between dashboard wings and front door cards maintain 3.5–4.5 mm shut lines. | Orthographic camera inspection across door joints. |
| **3AC-05** | Master WebGL asset is Draco-compressed and weighs under 15MB total. | Production bundle file size check. |
| **3AC-06** | Texture sets utilize composite ORM channels and do not exceed resolution budgets. | Texture inspection (Hero: 2048px, Secondary: 1024px, Peripheral: 512px). |
| **3AC-07** | All proprietary brand emblems are isolated or replaced with neutral AutoLab placeholders. | Trademark review; no unlicensed badging hard-baked into uneditable geometry. |
