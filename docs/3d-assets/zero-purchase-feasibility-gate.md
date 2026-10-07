# Zero-Purchase 3D Feasibility Gate & Evaluation Rubric
**Document:** `docs/3d-assets/zero-purchase-feasibility-gate.md`  
**Authority:** TODO Section 20 & Product Blueprint Section 28  
**Target Consumer:** Downstream Production Agent (Astra) & Project Lead  

---

## 1. The Zero-Purchase Mandate

The AutoLab Digital Showroom initiates production under an explicit **Zero-Purchase Assumption**:
* Astra must first attempt to construct the Mercedes-Benz S-Class V223 interior asset using:
  1. The verified metric bounding dimensions in `docs/3d-assets/s-class-reference-specification.md`;
  2. The photographic and video references from the official Global Media Portal and Autogefühl;
  3. Blender subdivision modeling, procedural texture authoring, and AI-assisted mesh reconstruction.
* **No AI agent has authority to unilaterally purchase 3D models or spend external project budget.**

---

## 2. Evaluation Gate & Feasibility Rubric

Before any recommendation to purchase an external asset is submitted, Astra's in-house Blender build will be audited against this 5-point rubric:

| Rubric Dimension | Passing Standard (Zero-Purchase Maintained) | Failing Trigger (Contingency Considered) |
| :--- | :--- | :--- |
| **1. Proportional Fidelity** | Display screens (12.8" & 12.3") and dash wings match confirmed metric scale within ±2mm. | Severe topological distortion that distorts perceived cabin proportions. |
| **2. Seam Alignment** | Dash-to-door shut gaps maintain uniform 3.5–4.5 mm spacing without intersecting geometry. | Irreconcilable mesh overlap or erratic gaping that breaks visual immersion. |
| **3. Seating Flutes & Texture** | Tangent normal maps accurately convey diamond-quilted leather fluting without artifacting. | Inability to produce convincing leather flutes or micro-perforations. |
| **4. Kinematic Articulation** | Rear executive seat reclines smoothly (43.5°) and center tambour door slides predictably. | Mechanical linkage deformation that collapses mesh topology. |
| **5. WebGL Budget** | Draco-compressed GLB asset is < 15MB and executes at 60fps on desktop, 30–60fps mobile. | Asset requires un-optimizable polygon density (> 500k triangles) to achieve basic shape. |

---

## 3. Contingency Trigger & Commercial Asset Purchase Protocol

If Astra's in-house reconstruction fails the feasibility gate and human review confirms that manual modeling cannot achieve production quality within scheduled labor milestones, the following protocol applies:

### 3.1 Strict Licensing Constraint
* **Prohibited Assets:** Assets on TurboSquid, CGTrader, or Sketchfab labeled **"Editorial Use Only"** are strictly prohibited. These licenses explicitly forbid deployment inside commercial configurator applications.
* **Approved Commercial Candidate:** The **Hum3D Mercedes-Benz S-Class LWB HQ Interior (Model ID: h3dA227378)** is the sole verified candidate carrying a **Commercial Royalty-Free License**:
  * Standard Commercial License: **$295 USD** (~KES 38,000)
  * AI Training / Extended Redistribution License: **$885 USD** (~KES 115,000)
  * Format: Clean separated mesh nodes with optional STEP / CAD NURBS surfaces.

### 3.2 Formal Escalation Required
If external acquisition becomes necessary, Astra must generate a formal **Commercial Asset Request** specifying:
1. Exactly which geometric requirement could not be met procedurally;
2. Side-by-side renders demonstrating the feasibility gap;
3. Confirmation of the exact licensing terms;
4. Required commercial budget allocation within the project's KES 35,000 tooling/infrastructure allowance or KES 180,000 3D allocation.
5. **Human client sign-off must be obtained before purchase.**
