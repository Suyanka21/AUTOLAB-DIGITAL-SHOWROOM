# Material & Texture Specification (PBR Standards)
**Document:** `docs/3d-assets/material-and-texture-specification.md`  
**Authority:** S-Class 3D Asset Brief (Section 5) & Mercedes Report (Section F)  
**Target Consumer:** Downstream 3D Agent (Astra) / Technical Shader Artists  

---

## 1. PBR Shader Architecture

All materials must be authored using the standardized **Physically Based Rendering (PBR) Metallic-Roughness** workflow. Specular-Glossiness is not used: `KHR_materials_pbrSpecularGlossiness` is deprecated and no longer loaded by current three.js. Use these glTF 2.0 extensions as needed (verify support in the pinned three.js version): `KHR_materials_clearcoat`, `KHR_materials_sheen`, `KHR_materials_specular`, `KHR_materials_ior`, `KHR_materials_anisotropy`, `KHR_materials_emissive_strength`.

### Required Channel Packing (ORM Texture Standard)
To minimize draw calls and GPU memory overhead, textures must be packed into composite channel maps:
* **RGB Channel (Albedo / BaseColor):** sRGB Color Space.
* **RGB Channel (Normal Map):** Linear Color Space, tangent-space OpenGL format (Y+ green channel).
* **Composite ORM Map (Linear Color Space):**
  * **Red Channel (R):** Ambient Occlusion (AO).
  * **Green Channel (G):** Roughness.
  * **Blue Channel (B):** Metallic.

---

## 2. Definitive Material Parameter Matrix

| Material Name | Shader Workflow | Base Color / Albedo | Roughness | Metallic | Clearcoat | Clearcoat Roughness | Anisotropic | Normal Map Type |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Exclusive Nappa Leather** | PBR Metal-Rough | Swatch Albedo (sRGB) | 0.45 – 0.52 | 0.00 | 0.05 | 0.40 | N/A | Sub-mm natural porous hide |
| **AutoLab Semi-Aniline Hide** | PBR Metal-Rough | Swatch Albedo (sRGB) | 0.40 – 0.46 | 0.00 | 0.08 | 0.35 | N/A | Full-grain organic texture |
| **Open-Pore Poplar Wood** | PBR Metal-Rough | Anthracite Timber Scan | 0.65 – 0.75 | 0.00 | 0.00 | N/A | 0.45 | Directional fibrous grain valleys |
| **Open-Pore Walnut Wood** | PBR Metal-Rough | Warm Brown Timber Scan | 0.62 – 0.70 | 0.00 | 0.00 | N/A | 0.40 | Directional wood grain pores |
| **Piano Lacquer "Flowing Lines"** | PBR Clearcoat | `#080808` + Pinstripes | 0.04 – 0.08 | 0.00 | 1.00 | 0.02 | N/A | Optically flat mirror |
| **AutoLab Forged Carbon** | PBR Clearcoat | Marbled Carbon Matrix | 0.10 – 0.14 | 0.15 | 0.95 | 0.03 | N/A | Forged filament flakes |
| **Satin Galvanized Metal** | PBR Metal-Rough | `#C8C8C8` (Silver Shadow)| 0.24 – 0.30 | 1.00 | 0.00 | N/A | 0.35 | Ultra-fine brushed radial grain |
| **Active Ambient Light Core** | Emissive Unlit | Target Hex Color | 0.15 | 0.00 | N/A | N/A | N/A | Translucent silicone light guide |
| **Display Cover Glass** | Specular Glass | `#0A0A0A` (unlit) | 0.02 | 0.00 | 1.00 | 0.01 | N/A | Optically flat oleophobic glass |
| **Perforated Acoustic Metal** | PBR Alpha Test | `#D0D0D0` (Spun Silver) | 0.25 | 1.00 | 0.00 | N/A | 0.50 | Concentric acoustic hole cutout |

---

## 3. Separation of Factory OEM vs. AutoLab Bespoke Materials

### 3.1 Factory OEM Boundary (Baseline Catalog)
* **Leather Tones:**
  * Exclusive Black (Code 501A, `#151618`)
  * Sienna Brown (Code 502A, `#75452B`)
  * Macchiato Beige / Magma Grey (Code 505A, `#D8CAB8`)
  * Carmine Red Sport (`#8A1822`)
* **Factory Trim:** Anthracite Open-Pore Poplar, Brown Open-Pore Walnut, Piano Lacquer Flowing Lines.

### 3.2 AutoLab Bespoke Program (Custom Upholstery Atelier)
* **Custom Bespoke Leather Hides:**
  * AutoLab Cognac Tan (`#9A5B2D`)
  * AutoLab Royal Oxblood (`#5C1D24`)
  * AutoLab Nairobi Forest Emerald (`#1A382B`)
* **Custom Bespoke Trim Elements:** Marbled Forged Aerospace Carbon Fiber, exposed 3K twill carbon weave.
* **Bespoke Accent Stitching:** Champagne Gold Luxury Contrast (`#D4AF37`), Silver Shadow (`#C0C4CC`), Burnt Amber (`#C26829`).

---

## 4. Texture Resolution Budgets & Format Standards

To balance maximum luxury fidelity against web loading speed:

| Texture Set / Target Node | Resolution Budget | Compression Format | Web Fallback | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **Primary Seat Leather (Center & Bolster)** | 2048 x 2048 px | KTX2 / Basis Universal | WebP (Lossless) | Tiling diamond quilt normal + ORM |
| **Upper Dashboard Wood/Carbon Veneer** | 2048 x 2048 px | KTX2 / Basis Universal | WebP | High camera proximity in cockpit views |
| **Steering Wheel Leather & Controls** | 1024 x 1024 px | KTX2 / Basis Universal | WebP | Perforated side grips normal map |
| **Door Card Substrates & Armrests** | 1024 x 1024 px | KTX2 / Basis Universal | WebP | Multi-layer door trim panels |
| **Central OLED & Driver Cluster Screens**| 1024 x 1024 px | KTX2 / Basis Universal | WebP / PNG | High-contrast interface graphics |
| **Active Ambient Lighting Core** | 512 x 512 px | Emissive Vertex / KTX2 | Vertex Color | Diffuse optical bloom texture |
| **Floor Carpeting & Shadow Occlusion** | 512 x 512 px | KTX2 / Basis Universal | WebP | Low-visibility footwell areas |

## Export Reality & Thread Slot (added: PROPOSED, pending decision D1)

1. Blender's built-in glTF exporter writes PNG, JPEG or WebP textures, not KTX2. KTX2 (Basis Universal) is produced by a post-export step (gltf-transform with KTX-Software `toktx`). If that tooling is unavailable the pipeline must STOP and report. Falling back to WebP is allowed only as a recorded, owner-approved deviation.
2. Procedural Blender shader nodes do not export. Every material must be baked to images or reduced to Principled BSDF inputs.
3. **Accent thread colour needs its own material slot.** A normal map encodes shape, not colour, so thread colour cannot be changed through the seat normal map. PROPOSED: slot `MAT_Stitching_Thread` (metal-rough, no normal map, roughness set during the spike) carried by dedicated thin stitch meshes on seats, bolsters and wheel. Stitch pattern (Diamond Quilt vs French Seam) is a separate choice: swap the seat's baked normal-map set, or toggle two stitch-mesh variants by visibility.
4. Four slots used by nodes in the scene manifest are not defined in its `materialSlots` list: `MAT_Screen_Driver_Cluster`, `MAT_Console_Veneer_And_Leather`, `MAT_Door_Card_Substrate`, `MAT_Carpet_Floor`. Define them, or remap the nodes, before asset production.
