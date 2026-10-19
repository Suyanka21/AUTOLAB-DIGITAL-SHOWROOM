# Phase 3 Reference Handoff & Modeling Reconciliation
**Project:** AutoLab Digital Showroom — Mercedes-Benz S-Class V223 Feasibility Spike  
**Asset Scope:** `GEO_Seat_Front_Driver_Flutes` & `GEO_Dashboard_Screen_Central_OLED`  
**Governing Documents:** [`AGENTS.md`](../../AGENTS.md), [`docs/STATE.md`](../STATE.md), [`docs/spike/plan.md`](plan.md), [`docs/spike/conflicts.md`](conflicts.md), [`docs/ASTRA_EXECUTION_PROMPTS.md`](../ASTRA_EXECUTION_PROMPTS.md)  
**Status:** REFERENCE INTEGRATION COMPLETE • TWO-NODE FEASIBILITY SPIKE APPROVED BY OWNER 2026-10-20 • HUMAN GATES OPEN

---

## 1. Executive Summary & Purpose

This handoff reconciles the research deliverables generated from NotebookLM and Gemini with the authoritative AutoLab Digital Showroom engineering contracts, preparing the repository for the first Astra High 3D feasibility spike (Phase 3).

Following the successful completion of Phase 2 (commit `6e9c680`, exit code 0 on the two-node synthetic Draco fixture and verified 6-mutation negative testing), the Phase 3 objective is to author and validate the real geometric spike asset in Blender headlessly, outputting:
`public/assets/3d/s-class-v223/spike.glb`

---

## 2. Target Geometry Identifiers (Strictly Two Nodes)

The Phase 3 feasibility spike is restricted exclusively to two geometry identifiers defined in the scene manifest ([`src/config/scene-manifest.s-class-v223.json`](../../src/config/scene-manifest.s-class-v223.json)):

| Geometry Identifier | Material Slot | Module | Target Polygon Budget | Tolerance |
| :--- | :--- | :--- | :--- | :--- |
| **`GEO_Seat_Front_Driver_Flutes`** | `MAT_Upholstery_Primary` | Seating | $\le 30,000$ triangles | `CONTROLLED_APPROX` |
| **`GEO_Dashboard_Screen_Central_OLED`** | `MAT_Screen_Central_OLED` | Dashboard | $\le 5,000$ triangles | `EXACT` |

### 2.1. Component 1: `GEO_Seat_Front_Driver_Flutes`
- **Scope:** Central insert fluted cushions of the front driver seat (cushion base and backrest contact surfaces).
- **Verified Ground Truth:** Exactly 8 parallel longitudinal vertical flutes across central panels (Standard Nappa specification).
- **Strict Exclusions:** Do NOT model side bolsters, rear plastic shells, adjustment switches, luxury neck pillows, or mounting rails as separate unapproved nodes. Do NOT model diamond quilting (Exclusive Nappa specification is explicitly rejected for V1).
- **Material Slot:** Must bind strictly to `MAT_Upholstery_Primary`.

### 2.2. Component 2: `GEO_Dashboard_Screen_Central_OLED`
- **Scope:** Standalone floating 12.8-inch portrait OLED display, protective outer bezel framing, and lower physical control strip.
- **Verified Ground Truth:** Active display canvas diagonal is exactly $12.8\text{ in}$ ($325.12\text{ mm}$), native resolution $1888 \times 1728\text{ px}$, resulting in active canvas dimensions of **$219.51\text{ mm}$ (width) $\times$ $239.83\text{ mm}$ (height)**.
- **Strict Exclusions:** Do NOT model passenger dashboard structures, A-pillar trim, instrument cluster pedestal, or the 2026+ full-width MBUX Superscreen.
- **Material Slot:** Must bind strictly to `MAT_Screen_Central_OLED`.

### 2.3. Stitching Node Dropped (Decision D1 Undecided)
- In [`docs/spike/conflicts.md`](conflicts.md), decision **D1** ("How does thread colour change in 3D?") remains undecided.
- Per [`docs/spike/plan.md`](plan.md) Section 3, `GEO_Stitching_Seat_Front_Driver` and `MAT_Stitching_Thread` are **DROPPED** from the Phase 3 spike until the owner explicitly records a decision on D1.
- No thread geometry or new material slot shall be added to the spike GLB.

---

## 3. Reconciliation with Project Contracts

The research deliverables have been rigorously reconciled against the existing repository rules:

### 3.1. Material Slot Naming Integrity
- **Research Proposal:** The research brief proposed names such as `MAT_V223_Leather_Fluted`, `MAT_V223_Leather_Smooth`, `MAT_V223_Pillow_Microfiber`, `MAT_V223_Screen_Glass`, and `MAT_V223_OLED_Canvas`.
- **Contract Enforcement:** **REJECTED.** The Phase 2 asset gate ([`scripts/validate-glb.mjs`](../../scripts/validate-glb.mjs)) verifies that all materials match the canonical manifest. Any invented material slot causes the gate to fail immediately.
- **Mandatory Binding:**
  - `GEO_Seat_Front_Driver_Flutes` $\implies$ `MAT_Upholstery_Primary`
  - `GEO_Dashboard_Screen_Central_OLED` $\implies$ `MAT_Screen_Central_OLED`

### 3.2. Seat Width Alternatives ($530\text{ mm}$ vs $458\text{ mm}$)
- **Research Discrepancy:** The research pack claimed a seat cushion width of $530\text{ mm}$, while NotebookLM noted that $(1,496\text{ mm shoulder room} - 280\text{ mm tunnel} - 300\text{ mm door clearance}) / 2 = 458\text{ mm}$.
- **Contract Enforcement:** **BOTH ARE UNVERIFIED ALTERNATIVES.** The $280\text{ mm}$ tunnel and $150\text{ mm}$ door clearances are themselves estimates. Astra must treat the cushion width as a provisional working range ($\approx 458\text{--}480\text{ mm}$) rather than a mandatory spec until physical measurements are captured on an actual car (GATE-11).

### 3.3. Provisional Estimates Labeled
All non-verified measurements are designated `[PROVISIONAL ESTIMATE]` and subject to revision:
- Screen swept-back inclination angle: $38.0^\circ$ from vertical ($52.0^\circ$ from floorpan).
- Outer screen glass envelope: $235.5\text{ mm} \times 275.8\text{ mm}$ (active area $+ 2 \times 8.0\text{ mm}$ side bezels).
- Floating rear air gap: $12.0\text{ mm}$ between screen shell and console plane.
- Lower switch strip: $22.0\text{ mm}$ height, $14.0\text{ mm}$ volume roller diameter.
- Flute recess channel depth: $6.0\text{ mm} \pm 1.0\text{ mm}$.

### 3.4. Blender 5.2.2 LTS Technical Directives
- **Discovery:** Verified at `C:\Program Files\Blender Foundation\Blender 5.2\blender.exe`.
- **Headless Execution:** Verified via `bpy.app.version_string` returning `5.2.2 LTS`.
- **Auto Smooth Attribute Migration:** The legacy `Auto Smooth` checkbox does not exist in Blender 5.2.2. Apply the **`Smooth by Angle`** modifier prior to `Weighted Normal` for hard-surface bezels.
- **Principled BSDF v2:** Use separate `Emission Color` and `Emission Strength` sockets (legacy single Emissive socket is deprecated).
- **View Transform:** Blender 5.2.2 defaults to `AgX` view transform (replaces legacy `Filmic`).

---

## 4. Local Reference Directory & Provenance

The four external research files are stored in the dedicated local directory:
`docs/spike/phase-3-reference/`

| File | Description | Source Provenance |
| :--- | :--- | :--- |
| [`VERIFICATION_REGISTER.md`](phase-3-reference/VERIFICATION_REGISTER.md) | Technical verification table auditing all metric claims against manufacturer documentation. | NotebookLM audit of primary MB press kits, rescue sheets, and owner manuals. |
| [`PHASE3_SAFE_MODELING_BRIEF.md`](phase-3-reference/PHASE3_SAFE_MODELING_BRIEF.md) | Defensible modeling instructions and Blender 5.2.2 feature compatibility guidelines. | NotebookLM synthesis of safe modeling boundaries and migration directives. |
| [`REFERENCE_ACQUISITION_GAPS.md`](phase-3-reference/REFERENCE_ACQUISITION_GAPS.md) | Categorized deficiency register (GAP-01 to GAP-04), distortion mitigations, and photo requests. | NotebookLM analysis of visual coverage and photographic ambiguity. |
| [`AUTOLAB_V223_PHASE3_REFERENCE_PACK.txt`](phase-3-reference/AUTOLAB_V223_PHASE3_REFERENCE_PACK.txt) | Original master research data pack, URL register, and geometric annotations. | Gemini research compilation. |

*Confidentiality & Provenance Guard:* Zero restricted workshop photos, customer identities, or commercial fee terms are contained in these files. All images remain external to the git repository.

---

## 5. Outstanding Reference Gaps (Deficiency Register)

Prior to full cabin modeling and final visual sign-off (GATE-08), the following physical gaps must be resolved by AutoLab's workshop team per [`docs/spike/reference-capture-checklist.md`](reference-capture-checklist.md):

1. **GAP-01 (Seat Rail Attachment & Flute Depth):** Floorpan mounting rail brackets are concealed beneath carpets. Physical depth of flutes under uncompressed and compressed load must be verified (Shot ID 1).
2. **GAP-02 (Neck Pillow Rear Interface):** Rear strap attachment mechanism and snap button interface behind the headrest are concealed in press photos (Shot ID 2).
3. **GAP-03 (Central OLED Rear Air Gap):** Rear mounting neck geometry and clearance gap ($12.0\text{ mm}$) behind the floating display are concealed (Shot ID 3).
4. **GAP-04 (Lower Switch Strip Profile):** Digital caliper measurements of volume thumbwheel recess profile and button bevels are required (Shot ID 4).

---

## 6. Phase 3 Prerequisites & Blocker Status

The owner approved the two-node feasibility spike and D10 on 2026-10-20. The remaining items below limit the claims that may be made from its output.

| Item | Requirement | Current Status | Blocker? |
| :--- | :--- | :--- | :--- |
| **Blender 5.2.2 LTS** | Executable and headless `bpy` verified | **VERIFIED** at `C:\Program Files\Blender Foundation\Blender 5.2\blender.exe` | No |
| **`toktx` (KTX-Software)** | CLI tool for KTX2 texture transcoding | **MISSING** on system PATH and Program Files | **FEASIBILITY DEVIATION APPROVED**: document WebP fallback; do not claim KTX2 production compliance. |
| **Decision D1** | Thread colour mechanism | **UNDECIDED** | **RESOLVED FOR SPIKE** by dropping stitching node from scope |
| **Decision D4** | Performance budgets | **APPROVED** by owner 2026-10-19 | No |
| **Decision D10** | Reference basis for feasibility | **APPROVED** by owner 2026-10-20: available manufacturer and reputable published visual references; targeted web research permitted with source URLs and verified-versus-estimated labels. GAP-01 through GAP-04 remain open. | No for feasibility; physical capture remains needed for final fidelity claims. |
| **Feasibility Spike Plan** | [`docs/spike/plan.md`](plan.md) approval | **APPROVED** by owner 2026-10-20 for the two-node Phase 3 feasibility spike only. | No |
| **Human Gates** | GATE-01 (Chassis), GATE-08 (Visual), GATE-11 (Reference Capture) | **OPEN** | No visual or production acceptance implied. |

*Governance Notice:* The owner supplied the D10 and plan approvals directly on 2026-10-20. No agent has signed or may infer passage of GATE-01, GATE-08, or GATE-11.

---

## 7. Recommended Astra Phase 3 Prompt Factual Corrections

Review of the Phase 3 prompt in [`docs/ASTRA_EXECUTION_PROMPTS.md`](../ASTRA_EXECUTION_PROMPTS.md) (lines 181–216) reveals two factual corrections needed for smooth execution:

1. **Blender Binary Path on Windows:**  
   The prompt instructs: `Run headless: blender -b --factory-startup --python blender/build_spike.py`.  
   *Correction:* On Windows, `blender` is not added to the system `PATH` by default. The prompt should specify `"C:\Program Files\Blender Foundation\Blender 5.2\blender.exe"` or require adding Blender to PATH, preventing command-not-found failures.
2. **Stitching Scope Clarification:**  
   The prompt references "the nodes in the approved docs/spike/plan.md section 3".  
   *Correction:* Clarify that with D1 undecided, the target scope is strictly the **two approved nodes** (`GEO_Seat_Front_Driver_Flutes` and `GEO_Dashboard_Screen_Central_OLED`), and the stitching node is excluded.
3. **Documented Texture Deviation (`toktx`):**  
   Since `toktx` is unavailable, the prompt should explicitly remind Astra that WebP texture output is the authorized fallback deviation.
