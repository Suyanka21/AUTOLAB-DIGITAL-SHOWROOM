# Astra: Start Here
**The Single Entry Point for AutoLab Digital Showroom Implementation**

---

## 1. Exact First Action to Perform

1. Create and switch to the Phase 0 branch:
   ```bash
   git checkout -b phase-0-setup
   ```
2. Open [`docs/ASTRA_EXECUTION_PROMPTS.md`](ASTRA_EXECUTION_PROMPTS.md).
3. Copy the **SESSION HEADER** (Section 2) followed by **Phase 0** prompt into your agent prompt window.
4. Execute Phase 0: verify installed skills, capture real tool outputs to `docs/spike/env-report.md`, re-verify findings F1/F2/F5/F7/F13, and stop. Do not modify application code.

---

## 2. Starting Phase & Execution Sequence

Your execution sequence is strictly defined in [`docs/ASTRA_EXECUTION_PROMPTS.md`](ASTRA_EXECUTION_PROMPTS.md):

* **Starting Phase:** **Phase 0 (Verify Setup & Review Plan)**  
  *(Note: Antigravity has already applied `changes.patch` and installed all upgrade pack files. Do not reapply the patch.)*
* **Phase 1A & 1B:** Framework & quality gates (Next 16, React 19, Supabase only, type fixes, contract tests).
* **Phase 2:** glTF asset gate script (`scripts/validate-glb.mjs`) & mutation tests.
* **Phase 3:** 3D spike asset in Blender (driver seat flutes + central OLED screen).
* **Phase 4 & 5:** WebGL viewer spike (R3F) & human review pack.
* **Phase 6:** Zone authoring (Z1 through Z9 cumulative build).
* **Phase 7 to 9B:** Configuration flow, leads/persistence, performance QA, and readiness audit.

---

## 3. How to Use Claude's Prompts

1. **One phase per sitting:** Never run multiple phases in a single window.
2. **Session Header first:** Always paste the Session Header from `docs/ASTRA_EXECUTION_PROMPTS.md` before the phase prompt. `AGENTS.md` loads automatically.
3. **Model selection:** Use Astra (high effort) for Phase 0, Phase 3, and Zone phases. Use Sol or Astra (medium effort) for engineering/quality phases.
4. **Respect the STOP:** Every phase concludes with a STOP. Review the Change Summary and evidence before proceeding to the next branch.
5. **Usage tracking:** Record Plus allowance usage in `docs/spike/plan.md` Section 9.

---

## 4. Canonical Sources of Truth

Always trace implementation decisions to these paths:

| Domain | Source of Truth |
| :--- | :--- |
| **Execution Prompts** | [`docs/ASTRA_EXECUTION_PROMPTS.md`](ASTRA_EXECUTION_PROMPTS.md) |
| **Master Handoff Directive** | [`docs/ASTRA_HANDOFF.md`](ASTRA_HANDOFF.md) |
| **3D Scene Graph & Slots** | [`src/config/scene-manifest.s-class-v223.json`](../src/config/scene-manifest.s-class-v223.json) |
| **3D Specifications** | [`docs/3d-assets/s-class-3d-specification.md`](3d-assets/s-class-3d-specification.md) & [`docs/3d-assets/interior-component-map.md`](3d-assets/interior-component-map.md) |
| **Decisions & Spike Plan** | [`docs/spike/conflicts.md`](spike/conflicts.md) & [`docs/spike/plan.md`](spike/plan.md) |
| **Performance Budgets** | [`docs/quality/performance-requirements.md`](quality/performance-requirements.md) (< 15MB, < 350k tris, < 65 draw calls) |
| **Governing Skills** | [`.agents/skills/`](../.agents/skills/) (including `blender-asset-pipeline`, `gltf-asset-gate`, `webgl-viewer-engineering`, `visual-fidelity-review`) |
| **Human Sign-off Gates** | [`docs/human-approval-gates.md`](human-approval-gates.md) (GATE-01 to GATE-11) |

---

## 5. Confirmed Owner Decisions

* **Approved V1 Vehicle:** Mercedes-Benz S-Class is formally confirmed for V1.
* **Working 3D Baseline:** Series 223 Long Wheelbase (V223 LWB) in AMG-Line trim is the working baseline. Detailed internal packaging (sub-seat rail mechanics, HVAC routing) remains provisional.
* **Confirmed V1 Configuration Journey:** Strictly `Material → Colour → Accent Thread → Interior Composition`.
* **Kinematics Excluded:** Rigged moving parts are excluded from V1 scope.
* **Single Backend:** Supabase / Drizzle only (Firebase is deprecated per decision D5).
* **Reference Code:** Deterministic 6-character format `AL-SC-2026-XXXXXX` per decision D3.
* **Reference Vehicles Policy:** Additional vehicles (Range Rover, Land Cruiser) mentioned in research are showcase references only, not V1 deliverables.
* **Commercial Fee Status:** The KES 750,000 fee is a proposed baseline awaiting formal commercial acceptance; technical implementation is not blocked on contract execution.
* **Strict Scope Lock:** No exterior car modeling, no shopping cart, no online checkout, and no customer account logins.

---

## 6. Deferred Material Catalogue

* **Pending Physical Catalogue:** The exact leather hides, bespoke colours, and stitching catalogue are awaiting physical injection from AutoLab.
* **Showcase Swatch Guard:** Existing swatches in `src/config/materials/` are proposed research candidates to operate the interaction scaffold. They must **never** be presented as confirmed AutoLab workshop stock.

---

**You are ready. Run `git checkout -b phase-0-setup` and begin Phase 0.**
