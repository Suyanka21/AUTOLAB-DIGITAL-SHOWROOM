# AutoLab Digital Showroom: Phased Prompts for Codex / GPT-6 Astra (v2)

Written for a $20 ChatGPT Plus plan and a fixed-fee project. Planning is cheap; agent time is not. These prompts front-load every decision and verification so Astra spends its limited allowance on work, not on rediscovery.

> **INTEGRATION NOTE (ANTIGRAVITY):**  
> The upgrade pack (four 3D skills, `docs/spike/`, `docs/ops/`, `.env.example`, `tools/`, and `changes.patch`) has already been installed and applied to the canonical repository locations by Antigravity. Phase 0 has been adjusted accordingly so Astra verifies the existing installation rather than attempting to reapply the patch.

---

## 0. How to use this file

1. **One phase per sitting.** Never run two phases in one five-hour window. Plus allows roughly 5 to 45 Astra messages per window, and an agentic turn uses far more than a chat message.
2. **Paste the SESSION HEADER, then one phase prompt.** `AGENTS.md` (updated by the upgrade pack) loads automatically and carries the standing rules, so prompts stay short.
3. **Models.** Astra (high effort) for Phases 0 and 3 only, plus Zone phases. GPT-6.1 Sol for everything else if your model picker offers it; otherwise Astra at medium effort. Check the picker before you start.
4. **Every phase ends with a STOP.** Do not paste the next phase until you have read the Change Summary and checked the evidence.
5. **Log your usage.** Note your Plus usage meter before and after each phase in `docs/spike/plan.md` section 9. That is your real cost data.
6. **Useful reply lines** when Astra drifts:
   - "Evidence please: paste the exact commands and their output, not a summary."
   - "Stop. List every file you changed and why."
   - "That is outside this phase. Add it to a parked list and continue."
   - "Revert to the last commit and explain what went wrong."

## 1. Pre-flight (you, no AI)

- [ ] Repository set to **private** (it holds your client's fee breakdown).
- [ ] Confirm upgrade pack files exist in repo root (`.agents/skills/`, `docs/spike/`, `docs/ops/`, `.env.example`, `tools/`).
- [ ] Install the current **Blender LTS**, a **current Node LTS** (Phase 1A verifies the exact version Next 16 needs), and, if you can, **KTX-Software** (`toktx`).
- [ ] Check your Codex model picker for Astra and Sol. Note whether the Computer Use plugin is available for your account and region (it is optional; the plan is script-first).
- [ ] Record decisions in `docs/spike/conflicts.md`:
  - Before Phase 1A: **D5** (Supabase only), **D6** (Next 16 + React 19).
  - Before Phase 3: **D1** (thread colour), **D4** (budget semantics), **D10** (reference capture), and approve `docs/spike/plan.md`.
  - Before Zone phases: **D2, D8, D9, D11, D12, D13**.
  - Before Phase 7: **D3** (reference code).
  - Before launch: **D7**, GATE-09, GATE-10.
- [ ] Complete the reference capture in `docs/spike/reference-capture-checklist.md` (strongly advised before Phase 3). Keep the files out of the repo.

## 2. SESSION HEADER (paste at the top of every phase)

```
SESSION HEADER
Phase: <id and name>. Model: <name>.
Read docs/STATE.md first if it exists; update it before stopping (max 20 lines).
AGENTS.md governs. Load only the skills named below, by $name.
Work on the phase branch. Commit atomically. No pushes, PRs or deploys.
Stop at the STOP line and wait.
```

---

## Phase 0: Verify setup and review the plan
*Model: Sol or Astra at low effort. Branch: `phase-0-setup`.*  
*Note: The upgrade pack has already been applied and installed to canonical repository locations by Antigravity. Do NOT reapply changes.patch.*

```
PHASE 0: VERIFY SETUP AND REVIEW PLAN
Skills: $context-engineering $spec-driven-development $planning-and-task-breakdown
Scope: verify the installed setup and write reports under docs/spike/. No application code changes.

1. Verify the installed upgrade pack. The upgrade pack (four new skills: blender-asset-pipeline,
   gltf-asset-gate, webgl-viewer-engineering, visual-fidelity-review; docs/spike/*; docs/ops/*;
   .env.example; tools/; and changes.patch) has already been applied and integrated by Antigravity.
   Do NOT reapply changes.patch. Verify that all upgrade pack files exist in their canonical
   locations. Show `git status --short`.

2. Prove the instructions loaded. Summarise the project instructions you are
   running under in 10 lines or fewer. List the skills you can see (use the
   skills command if your harness has one) and confirm the four new 3D skills
   appear. If you cannot list skills, say so plainly.

3. Environment report to docs/spike/env-report.md with REAL output of:
   your model and harness version; `blender --version`; a headless Blender run
   that prints the bpy version; `toktx --version`; `node -v` and `npm -v`;
   `npm ci`; a headless browser opening a local page. State whether computer
   use is available. Install nothing. Report gaps, do not hide them.

4. Review the register and plan. Read docs/spike/conflicts.md and docs/spike/plan.md.
   Re-verify findings F1, F2, F5, F7 and F13 with the cheapest command for each
   (a python or jq one-liner, `npm view`, grep) and paste the output. List any
   finding that does not reproduce, and anything wrong or missing in plan.md.
   Propose edits as a list. Do not edit the plan.

Acceptance: upgrade pack installation verified; env report contains real output;
review notes list each finding as REPRODUCED or NOT REPRODUCED with evidence.
STOP after the Change Summary.
```

## Phase 1A: Framework and dependency upgrade
*Model: Sol. Branch: `phase-1a-foundation`. Requires D5 and D6 recorded.*

```
PHASE 1A: FRAMEWORK AND DEPENDENCY UPGRADE
Skills: $incremental-implementation $source-driven-development $deprecation-and-migration
Scope: dependencies, config and the minimum code changes the upgrade forces.
No visual or UI changes. Decisions: Supabase only (D5); Next 16 + React 19 (D6).

0. Baseline. Before changing anything, run the app and save a full-page headless
   screenshot to docs/spike/baseline-ui.png.
1. Verify against official docs and cite them: the Next 16 requirements (Node
   version, React version) and every breaking change that applies to this repo
   (async request APIs, middleware/proxy rename, bundler default). List the
   changes relevant to this repo BEFORE editing.
2. Upgrade next, react, react-dom and their types to current supported
   versions, and drizzle-orm to the current version.
3. Remove firebase and src/lib/db/firebase. First find every reference
   (deprecation-and-migration), then remove them. Delete the Firebase env names.
4. Fix build and type errors with the smallest possible changes.
5. Set engines.node (and .nvmrc) to the verified requirement.
6. Take an after screenshot to docs/spike/after-1a-ui.png.

Acceptance (paste real output): `npm ci && npm run build` pass; the production
server returns 200 for `/` and the page contains the existing main heading;
`npm audit --omit=dev` result (target: no critical or high; explain any remainder);
the list of files changed; baseline and after screenshots exist for the owner to compare.
STOP after the Change Summary.
```

## Phase 1B: Quality gates and configuration
*Model: Sol. Branch: `phase-1b-quality`.*

```
PHASE 1B: QUALITY GATES AND CONFIGURATION
Skills: $test-driven-development $ci-cd-and-automation
You may run `npx playwright install chromium`. No other installs beyond devDependencies you justify.

1. Scripts: add `typecheck`, `lint` (add ESLint configured for the installed Next
   version; verify the setup against docs), `test` (Vitest), `test:e2e` (Playwright,
   Chromium only). Add .github/workflows/ci.yml running typecheck, lint, test and
   build. No secrets in the workflow.
2. Types follow the schema (F2). Update src/types/asset3d.ts so its field names
   match docs/schemas/scene-manifest.schema.json (identifier, module, materialSlot).
   Update every usage and keep the build green.
3. Contract tests (write each test first and show it failing where relevant):
   a. Every node's materialSlot exists in materialSlots. Four slots are KNOWN to be
      undefined (F1). Use an allowlist of exactly those four with a comment. The
      test must fail if a NEW undefined slot appears OR if an allowlisted slot
      becomes defined (forcing cleanup).
   b. Every catalogue colour's compatibleMaterialIds exists in the materials catalogue.
   c. The manifest and the vehicle config validate against their schemas (add ajv or
      equivalent as a devDependency).
4. WhatsApp link: read NEXT_PUBLIC_AUTOLAB_WHATSAPP_NUMBER; remove the hardcoded
   placeholder in configurator-context.tsx. If unset or malformed, disable the
   button with a clear message. Unit-test the builder for set, unset and malformed.
5. next.config: long-lived immutable cache headers for /assets/3d/*, /draco/* and
   /basis/*. Verify the syntax against docs; test with a request.

Acceptance (paste output): typecheck, lint, test, test:e2e and build all pass;
renaming a manifest node makes contract test (a) fail, shown and then reverted;
unsetting the WhatsApp variable shows the disabled state.
STOP after the Change Summary.
```

## Phase 2: Build and prove the asset gate (no Blender)
*Model: Sol. Branch: `phase-2-gate`. Requires D4 recorded.*

```
PHASE 2: BUILD AND PROVE THE ASSET GATE
Skills: $gltf-asset-gate $test-driven-development $source-driven-development
Scope: the validator and its tests only. No Blender, no modelling.

1. Follow $gltf-asset-gate. Verify package names and versions on npm before
   installing; pin exact versions (@gltf-transform/core and gltf-validator).
2. Build scripts/validate-glb.mjs with a `--scope spike` option that restricts the
   node list to GEO_Seat_Front_Driver_Flutes and GEO_Dashboard_Screen_Central_OLED
   (plus the proposed stitching node if D1 was approved). Read all budgets from
   the manifest and the plan, never hard-code them. Output reports/glb-report.json
   and a short summary. Exit non-zero on any failure.
3. Create a deterministic synthetic fixture GLB with @gltf-transform/core that
   satisfies the spike scope, with a script (scripts/make-fixture.mjs).
4. Mutation tests: from the good fixture, generate and test all six mutations
   (rename node, duplicate material, scale x100, strip UVs, extra node, banned
   extension). Each must fail with a specific message.
5. Run the gate against the REAL manifest. It must report the four undefined
   slots (F1). Paste that output: it proves the gate catches what the schema cannot.
6. Add the mutation tests to Vitest so CI covers them. Add `npm run validate:asset`.

Acceptance (paste output): fixture passes; all six mutations fail as expected;
the real-manifest run reports the four undefined slots; all CI scripts pass.
STOP after the Change Summary.
```

## Phase 3: The spike asset (the go / no-go)
*Model: Astra, high effort. Branch: `phase-3-spike-asset`. Requires D4 approved, D10 recorded, and plan.md approved by you (D1 undecided: stitching node is dropped).*

```
PHASE 3: SPIKE ASSET
Skills: $blender-asset-pipeline $gltf-asset-gate $source-driven-development $debugging-and-error-recovery
Scope: the two approved nodes in docs/spike/plan.md section 3 (GEO_Seat_Front_Driver_Flutes
and GEO_Dashboard_Screen_Central_OLED; stitching is dropped per undecided D1). Label every output
PROVISIONAL (S-Class V223 LWB, GATE-01 open). Reference material: docs/spike/phase-3-reference/
and docs/spike/PHASE3_REFERENCE_HANDOFF.md (or owner's private photo folder). Read read-only.

1. Read the approved plan and ONLY the manifest, specification and component-map rows
   for the two spike nodes. Do not read other documents.
2. Verify the Blender glTF export arguments for the installed version (Blender 5.2.2 LTS) by
   introspection (bpy.ops.export_scene.gltf.get_rna_type().properties.keys()) and
   cite the Blender manual pages you used. Record the version. Note Blender 5.2.2 uses
   'Smooth by Angle' modifier (legacy Auto Smooth removed) and AgX view transform.
3. Write blender/constants.py and blender/build_spike.py following $blender-asset-pipeline.
   Run headless using verified Blender executable:
   & "C:\Program Files\Blender Foundation\Blender 5.2\blender.exe" -b --factory-startup --python blender/build_spike.py
   Output: public/assets/3d/s-class-v223/spike.glb.
4. Run the gate: npm run validate:asset -- --scope spike. Paste the full output.
   Fix failures within the iteration cap (3 attempts per failing step).
5. Run the build script twice from a clean state and show identical node, material
   and triangle counts.
6. Render the 5 viewpoints from the plan, using the same lighting each time, to
   docs/review/spike-<date>/. Use low sample counts; cap each render at 5 minutes.
7. Append provenance entries to docs/3d-assets/provenance.json. Write
   docs/spike/cost-log.md: wall-clock time, attempts, failures, tool errors.
8. List every deviation from the spec (for example WebP instead of KTX2 if toktx is
   missing) and every defect you can see, with the render file name. Do NOT rate
   or approve the result.

Hard limits: no downloaded models, textures or HDRIs; maximum 3 review-and-fix
rounds; if blocked, report instead of improvising.
Acceptance (paste output): gate exit 0 with its report; identical counts across two
builds; 5 renders; cost log; provenance; honest defect and deviation list.
STOP. Do not start the full cabin. Wait for the viewer spike and human review.
```

## Phase 4: Viewer spike
*Model: Sol. Branch: `phase-4-viewer`.*

```
PHASE 4: VIEWER SPIKE
Skills: $webgl-viewer-engineering $source-driven-development $browser-testing-with-devtools
anti-ai-design: not used here. Do not redesign any UI.
Scope: load spike.glb in a real viewer and swap one material.

1. Version check first. Install @react-three/fiber and @react-three/drei at exact
   pinned versions that match the installed React (React 19 needs fiber 9.x and
   drei 10.x). Show `npm ls` with no peer conflicts.
2. Copy (do not download) the Draco decoder and the Basis/KTX2 transcoder from the
   installed three package into public/draco and public/basis.
3. Add an R3F canvas with the three.js procedural RoomEnvironment (no downloaded
   HDRI), bounded orbit controls and the plan's camera presets. Load spike.glb
   through Suspense with an error boundary. Keep the existing 2D SVG as the
   fallback for WebGL failure, GLB failure and context loss.
4. Map slots on load by material name. Wire the existing upholstery colour
   selection to MAT_Upholstery_Primary using the shared material instance.
   Implement the thread colour mechanism only if D1 was approved.
5. Provide the window.__autolab hook only when NEXT_PUBLIC_E2E=1.
6. Playwright tests: (a) a swatch click changes only the bound slot's material;
   (b) that test FAILS when the binding is deliberately broken (show, then revert);
   (c) GLB 404 shows the fallback; (d) WebGL unavailable shows the fallback;
   (e) forced context loss recovers or falls back (WEBGL_lose_context).
7. Report renderer.info (draw calls, triangles, textures, geometries) against the
   spike budgets. State what headless measurement cannot tell us.
8. Save screenshots of every camera preset at desktop (1280x800) and mobile
   (390x844) sizes to docs/review/spike-<date>/viewer/.

Acceptance (paste output): all tests pass including the deliberate-break proof;
`npm run build`, typecheck, lint, test and test:e2e pass; renderer.info reported.
STOP after the Change Summary.
```

## Phase 5: Review pack and decision form
*Model: Sol. Branch: `phase-5-review`.*

```
PHASE 5: REVIEW PACK AND DECISION FORM
Skills: $visual-fidelity-review
Scope: assemble evidence for humans. You must not score or approve anything.

1. Build a contact sheet per $visual-fidelity-review: each Blender render beside the
   matching viewer screenshot, and beside owner reference photos where they exist.
2. Create docs/review/spike-<date>/review.md containing the rubric from
   docs/spike/plan.md section 6 as a BLANK scoring sheet with reviewer name and
   signature lines.
3. Write docs/spike/decision.md with a table of the measured facts (gate result and
   sha256, triangle counts, file size, draw calls, tests passed, cost-log totals)
   and the GO / HYBRID / NO-GO rule copied from the plan. Mark the decision
   PENDING HUMAN SCORES.
4. Add your honest defect list (no ratings).

Acceptance: contact sheet exists; review.md is blank and unscored; decision.md has
facts only. STOP. The owner scores the rubric with at least one other person.
```

**Owner checkpoint (no AI).** Score the rubric (you plus an AutoLab person, ideally an independent 3D artist). Record GO, HYBRID or NO-GO in `decision.md`. Then record D2, D8, D9, D11, D12 and D13. If the decision is HYBRID or NO-GO, bring the results here before pasting any Zone prompt.

---

## Phase 6: Zone template (Astra), one zone per sitting
*Model: Astra, high effort. Branch: `zone-<name>`. Requires a GO or HYBRID decision.*

```
PHASE 6: ZONE <Z#: NAME>
Skills: $blender-asset-pipeline $gltf-asset-gate $visual-fidelity-review $source-driven-development
Route recorded by owner in decision.md: <Astra builds / hybrid: seats excluded>
Nodes in scope (from the manifest and recorded decisions only): <LIST>
Reference folder: <path>. Label everything PROVISIONAL until GATE-01 is signed.

1. Extend scripts/validate-glb.mjs scope to this zone's nodes and slots FIRST. Show it
   failing before the nodes exist. Define any slot the zone needs in the manifest
   (D12) and extend the contract test allowlist accordingly.
2. Extend the single Blender build script with this zone. Follow
   $blender-asset-pipeline. Re-run the whole build from clean.
3. Run the gate on the CUMULATIVE GLB. Report cumulative triangles, draw calls, file
   size and estimated texture memory against docs/spike/plan.md budgets and the
   manifest limits. If any budget would be breached, STOP and ask.
4. Extend the viewer test to cover this zone's slots.
5. Render this zone's viewpoints (same lighting as before) to docs/review/<zone>-<date>/.
6. Update provenance and the cost log. List deviations and defects. Do NOT score.

Acceptance (paste output): gate exit 0 on the cumulative GLB with sha256; viewer tests
pass; renders exist; budgets reported; provenance updated.
STOP for human visual review. Do not start the next zone.
```

**Zone table (reorder if you wish).** Nodes marked *(spike)* already exist.

| Zone | Nodes (from the manifest) | Slots | Notes |
| :--- | :--- | :--- | :--- |
| Z1 Dashboard | `GEO_Dashboard_Screen_Central_OLED` *(spike)*, `GEO_Dashboard_Screen_Driver_Cluster`, `GEO_Trim_Dashboard_WoodDeck` | `MAT_Screen_Central_OLED`, `MAT_Screen_Driver_Cluster` (undefined, F1), `MAT_Trim_Deck_Main` | Exact tolerances; the primary scale anchor |
| Z2 Steering wheel | `GEO_SteeringWheel_AMG_DoubleSpoke` | `MAT_Steering_Leather` | Faceting breaks immersion; check silhouettes |
| Z3 Front seats | `GEO_Seat_Front_Driver_Flutes` *(spike)*, `GEO_Seat_Front_Passenger_Flutes`, plus stitching and bolster nodes if D1/D2 add them | `MAT_Upholstery_Primary`, `MAT_Upholstery_Secondary`, `MAT_Stitching_Thread` (D1) | Highest visual risk |
| Z4 Console | `GEO_Console_Center_Front`, `GEO_Console_Center_Rear_FirstClass` | per D2 (split veneer and leather) | Kinematics only if D8 allows |
| Z5 Doors | `GEO_Door_Panels_FL_FR_RL_RR`, `GEO_Door_Speaker_Burmester_4D` | `MAT_Door_Card_Substrate` (undefined, F1), `MAT_Metal_Acoustic_Burmester` | Shut gaps 3.5 to 4.5 mm; trademark-free grilles |
| Z6 Rear suite | `GEO_Seat_Rear_Executive_RH`, `GEO_Seat_Front_Passenger_Chauffeur` | `MAT_Upholstery_Primary`, `MAT_Upholstery_Secondary` | Rear LH suite and calf rest are in the map but not the manifest |
| Z7 Ambient lighting | `GEO_Interior_AmbientLight_FiberStrip` | `EMISSIVE_Ambient_Lighting` | Test vertex-colour plus Draco carefully |
| Z8 Floor and context | `GEO_Footwell_And_Carpeting`, plus cabin context per D13 | `MAT_Carpet_Floor` (undefined, F1) | Gives the viewer a believable enclosure |
| Z9 Mobile tier and LOD | `interior_low.glb`, 1024 px texture variants | all | Contractual (LOD is in the decision freeze); estimated texture memory is about 66 MB at full size |

## Phase 7: Configuration flow, reference code, share card
*Model: Sol. Branch: `phase-7-config`. Requires D3 recorded.*

```
PHASE 7: CONFIGURATION FLOW, REFERENCE CODE, SHARE CARD
Skills: $spec-driven-development $api-and-interface-design $frontend-ui-engineering $anti-ai-design
anti-ai-design: constraint check on what you touch only. Do not regenerate the design
and do not produce a CJX bundle. The existing UI is the approved baseline.

1. Write a one-page spec to docs/spike/config-spec.md covering: the flow (Material,
   Colour, Accent Thread, Interior Composition), the composition rule as a table
   (selection to slot assignments), the reference-code format per decision D3, and
   the shareable summary card (Web Share API with copy-link and PNG download
   fallbacks). Stop and ask me if any of these are ambiguous.
2. Implement the reference code per D3 with a pure, unit-tested generator. Update
   FAC-11 and the configuration model docs to match.
3. Implement composition and thread assignment as a pure function with unit tests.
4. Show only options approved in the signed gates. Options without a signed gate
   appear as "proposed" or are hidden: ask me which.
5. Implement the shareable summary card.
6. Tests for every screen's four states (loading, empty, error, success).

Acceptance (paste output): spec exists; tests, typecheck, lint, build and e2e pass.
STOP after the Change Summary.
```

## Phase 8: Lead flow, persistence, admin, privacy
*Model: Sol. Branch: `phase-8-leads`. Local or dev Supabase only.*

```
PHASE 8: LEAD FLOW, PERSISTENCE, ADMIN, PRIVACY
Skills: $api-and-interface-design $security-and-hardening $deprecation-and-migration
Rules: local or dev Supabase only. If I have not given you a dev instance, write SQL
and migrations, test with mocks, and STOP. Never use production keys or real
customer data. Tests are mandatory even though the TDD skill is not loaded.

1. Server-side route handler for enquiries and bookings with schema validation, size
   limits and rate limiting. No browser-side writes of personal data. No personal
   data in logs.
2. Row-level security policies and a migration for configurations and enquiries. The
   public read endpoint returns the configuration only, never personal data.
3. WhatsApp deep link built from the stored reference code.
4. Lightweight admin lookup per docs/application/lightweight-admin-requirements.md,
   protected. No customer accounts.
5. Remove /auth, /dashboard, /splash and the mock localStorage auth safely: find all
   dependents first and prove nothing else broke.
6. Add a privacy notice page and consent wording using docs/ops/privacy-and-data-protection.md.
   Where AutoLab's wording is missing, insert clearly marked placeholders.
7. Negative tests: invalid phone, oversized payload, injection strings, rate limit
   exceeded, missing environment variables, unauthorised admin access.

Acceptance (paste output): all tests pass; grep shows no secrets in the repo.
STOP after the Change Summary.
```

## Phase 9A: Performance and device QA
*Model: Sol. Branch: `phase-9a-perf`.*

```
PHASE 9A: PERFORMANCE AND DEVICE QA
Skills: $performance-optimization $browser-testing-with-devtools $webgl-viewer-engineering

1. Implement and unit-test a texture-tier selection rule (full or mobile 1024 px set)
   and document its inputs. I will confirm it on real devices.
2. Measure renderer.info and load times for the final GLBs (low LOD first, then full)
   and report them against docs/quality/performance-requirements.md.
3. Write docs/quality/device-test-sheet.md for me: the devices to test (include a
   mid-range Android), the exact steps, and a results table with fields for FPS feel,
   load time on mobile data, heat, and crashes.
4. Fix only regressions you can attribute to your own changes.

Acceptance: measured numbers pasted; the device sheet exists.
STOP. I run the sheet on real devices.
```

## Phase 9B: Readiness audit (no deploy)
*Model: Sol. Branch: `phase-9b-audit`.*

```
PHASE 9B: READINESS AUDIT
Skills: $trustless-system-auditor $code-review-and-quality $documentation-and-adrs
Scope: audit and report. Fix only defects in code you wrote.

1. Audit against docs/quality/acceptance-criteria.md and the Trustless Audit Gate:
   PASS, FAIL or NOT TESTED per item, with evidence for each.
2. List every human gate (GATE-01 to GATE-11) still unsigned, and every unverified claim.
3. Run the full CI suite and the asset gate on the final GLBs; paste output and sha256.
4. Write ADRs only for decisions actually made.

Acceptance: audit file with evidence; unresolved CRITICAL items named.
STOP. Do NOT deploy. Deployment needs my explicit written authorisation.
```

---

## Appendix: what each phase costs to read (skill files)

Sizes are the real SKILL.md sizes in the repo (about 4 characters per token).

| Phase | Skills loaded | Approx. KB | Approx. tokens |
| :--- | :--- | :--- | :--- |
| 0 | context-engineering, spec-driven, planning | 26 | 6.5k |
| 1A | incremental, source-driven, deprecation | 26 | 6.5k |
| 1B | test-driven, ci-cd | 26 | 6.6k |
| 2 | gltf-asset-gate, test-driven, source-driven | 27 | 6.7k |
| 3 | blender-asset-pipeline, gltf-asset-gate, source-driven, debugging | 27 | 6.7k |
| 4 | webgl-viewer, source-driven, browser-testing | 25 | 6.2k |
| 5 | visual-fidelity-review | 3 | 0.8k |
| 6 | blender, gate, visual-review, source-driven | 19 | 4.8k |
| 7 | spec-driven, api-design, frontend-ui, anti-ai-design | 53 | 13k |
| 8 | api-design, security, deprecation | 31 | 7.7k |
| 9A | performance, browser-testing, webgl-viewer | 28 | 7k |
| 9B | trustless-auditor, code-review, documentation | 39 | 9.7k |

Loading all 31 skills would cost about 345 KB (roughly 86k tokens) every session. Naming only what each phase needs is the single biggest saving available on a $20 plan.
