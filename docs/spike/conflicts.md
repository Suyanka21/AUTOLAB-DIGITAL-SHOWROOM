# Conflict & Decision Register (pre-filled; verified against commit 0ede810)

**Status of this file:** findings below were verified by command output during the pre-production review. Agents must RE-VERIFY any finding they rely on, and must not apply a recommendation until the owner has recorded the decision (bottom table).

## Part 1: Verified findings

| # | Finding | Evidence | Consequence |
| :--- | :--- | :--- | :--- |
| F1 | 4 slots used by manifest nodes are not defined in `materialSlots` (`MAT_Screen_Driver_Cluster`, `MAT_Console_Veneer_And_Leather`, `MAT_Door_Card_Substrate`, `MAT_Carpet_Floor`). The manifest passes its JSON schema anyway. | python check: 11 slots used, 7 defined | The schema cannot check cross-references; `gltf-asset-gate` must. |
| F2 | The manifest and vehicle config PASS their schemas. The TypeScript types (`src/types/asset3d.ts`) are the outlier (`sceneGraphIdentifier`, `moduleName`, `materialSlotId` vs schema `identifier`, `module`, `materialSlot`). | jsonschema run | Fix the types, not the manifest. |
| F3 | Console node is named 3 ways: `MAT_Console_Veneer` (component map table), `MAT_Trim_Deck_Main` (mapping diagram), `MAT_Console_Veneer_And_Leather` (manifest). | grep | One slot cannot hold two physical materials (D2). |
| F4 | No material slot exists for accent thread colour; the spec puts stitching in a normal map, which cannot recolour thread. | manifest and docs grep | FAC-07 cannot pass as written (D1). |
| F5 | Reference code: docs say "deterministic" and "unique" with a 4-character hash; code uses `Math.random()` (`configurator-context.tsx:48-55`); a 4-character code is about 1.05M values. | code read | Needs a decision (D3). |
| F6 | `sRGBEncoding` (viewer doc) was removed after three.js r152. `KHR_materials_pbrSpecularGlossiness` was dropped from three.js r147. | three.js release notes | Both patched in the docs. |
| F7 | Latest `@react-three/fiber` 9.x / `drei` 10.x require React 19. The repo is Next 14 / React 18. | `npm view` peer deps | Plain install would conflict (D6). |
| F8 | Next 14.2.35 (latest 14.x) still has 1 critical advisory. Removing Firebase and updating `drizzle-orm` clears 12 of 14. Next 16.4.1 with React 19 gave 0 advisories (lockfile-only audit; NOT built). | scratch-copy audits | Upgrade to Next 16 (D6). |
| F9 | Blender's built-in exporter supports Draco and `KHR_materials_variants` but writes WebP, not KTX2. | Blender 4.5 / 5.2 manual | KTX2 needs a post-export step. |
| F10 | Three.js does not load `KHR_materials_variants` without a separate plugin. | three.js docs | Prefer app-side slot mapping; variants optional. |
| F11 | At manifest resolutions and 3 maps per slot, texture memory is about 49 MB (7 slots) + 17 MB (4 undefined) = about 66 MB, over the under-64 MB mobile target (estimate). | calculation | Mobile texture tier required (D4). |
| F12 | `ui-composition-engine` is referenced but not installed. `AGENTS.md` said 22 banned patterns / 14 signals; the skill says 18 / 12. | file checks | Fixed in this pack. |
| F13 | All 26 catalogue entries are `proposed_*`. FAC-14 (zero unapproved options shown) cannot pass until GATE-02 to 05 are signed. | JSON check | Needs AutoLab sign-off. |
| F14 | The decision freeze includes LOD, shareable summary card, vehicle abstraction and source traceability. It never mentions rigged kinematics. | decision-freeze lines 33-57 | Kinematics are unpaid scope (D8). |

## Part 2: Decisions (owner records the choice in the last column)

| ID | Question | Recommendation | Blocks | Decision |
| :--- | :--- | :--- | :--- | :--- |
| D1 | How does thread colour change in 3D? | Dedicated thin stitch meshes with their own slot `MAT_Stitching_Thread` (a real colour change, one extra material). Alternatives: per-colour texture sets (memory heavy) or a custom shader (breaks standard glTF materials). | Phase 3 | |
| D2 | Console: one slot for veneer and leather? | Split. `GEO_Console_Center_Front` uses `MAT_Console_Veneer` (define it); armrest lids become a new node using `MAT_Upholstery_Secondary`. | Stage 1 console zone | |
| D3 | Reference code design | Random 6-character code from the 32-symbol alphabet (about 1.07 billion values), stored, unique constraint and retry. Format `AL-SC-2026-XXXXXX`; update FAC-11 and the configuration model. The public read endpoint returns the configuration only, never personal data. | Phase 7 | Format AL-SC-2026-XXXXXX approved |
| D4 | Budget semantics | Accept the clarifications in `docs/quality/performance-requirements.md` (5 MB target / 15 MB hard max as transferred; separate GPU estimate; mobile texture tier; low-LOD first). | Phase 2 | |
| D5 | Backend | Supabase / Drizzle only; remove Firebase. | Phase 1A | Supabase / Drizzle only |
| D6 | Framework | Upgrade to Next 16 with React 19 now, while the app is tiny. | Phase 1A | Next 16 + React 19 |
| D7 | Hosting and ownership | A plan that permits commercial use, with AutoLab-owned accounts (see `docs/ops/hosting-and-handover.md`). | Stage 4 | |
| D8 | Kinematics (rigged moving parts) | STRETCH only. Not in the decision freeze; add by change order if wanted. LOD and the share card are in scope. | Stage 1 | Excluded from V1 (strict scope lock) |
| D9 | Vehicle (GATE-01) | Confirm which S-Class generation AutoLab's customers actually own. The spike proceeds with a PROVISIONAL V223 label. | Full asset | Mercedes-Benz S-Class approved for V1; V223 LWB is working 3D baseline (unverified detailed geometry provisional) |
| D10 | Reference capture | Owner captures photos and measurements per `docs/spike/reference-capture-checklist.md` before Phase 3 for a meaningful fidelity score. | Phase 3 | |
| D11 | Third-party assets | None for the spike (procedural environment lighting only). Any HDRI or font needs the licence text read and written approval. | Stage 1 | |
| D12 | Undefined slots (F1) | Define the 4 slots in the manifest with a schema-plus-test check; needed before the full asset, not for the spike. | Stage 1 | |

## Part 3: Additional finding

| # | Finding | Evidence | Consequence |
| :--- | :--- | :--- | :--- |
| F15 | The README documents a `DATABASE_PROVIDER` toggle that no code reads, and its example WhatsApp number is the same placeholder as the code. | `grep process.env` over `src`; README lines 128-146 | Fixed in the README patch. |
| F16 | The 3D specification lists the overhead console, panoramic sunroof surround and A/B/C pillar trim as IN scope (`s-class-3d-specification.md` lines 19 and 48), but the manifest has no node for them (14 nodes in total). Exterior glass is OUT of scope (line 23), and nothing defines what the viewer shows through the windows. | grep of the specification and manifest | Without a cabin context the interior reads as a floating set in a void (D13). |

## Part 4: Additional decision

| ID | Question | Recommendation | Blocks | Decision |
| :--- | :--- | :--- | :--- | :--- |
| D13 | What frames the cabin (headliner, pillars, door frames, window treatment)? | Add a low-detail `GEO_Cabin_Context` node group (headliner, overhead console, pillars, door frames) with a simple slot, plus a fixed dark gradient or soft studio backdrop behind the windows. Budget it inside the 350,000-triangle limit. | Zone Z8 | |

