# Phase 0 environment report — 2026-10-19

Scope: local verification only. No application code, software installation, or owner decision changed.

## Repository and upgrade pack

```text
git log -1 --format="%H %s"
ba2eecf1a07903aec4148febb7fc1941e43ba5c6 Integrate Claude upgrade pack, establish Astra entry point, and align owner decisions
git status --short --branch (before branch creation)
## main...origin/main
git checkout -b phase-0-setup
Switched to a new branch 'phase-0-setup'
git status --short --branch (after branch creation)
## phase-0-setup
```

`docs/spike/`, `docs/ops/`, `tools/`, and `.env.example` exist. `changes.patch` exists under `Claude Autolab Updates/` and `Claude Autolab Updates/autolab-upgrade-pack/`; it is not at repository root. It was not reapplied. `git ls-files .agents/skills docs/spike docs/ops .env.example tools | Measure-Object -Line` returned 83 tracked paths.

## Model, harness, and skill discovery

The session header identifies **GPT Sol, low reasoning**. The runtime does not expose a more precise model build identifier. `codex --version` returned `codex-cli 0.156.1`; this CLI version does not identify the desktop app version.

`Get-ChildItem .agents/skills -Directory` returned 31 directories, and `Test-Path <directory>/SKILL.md` returned `True` for all 31. The four 3D skills are `blender-asset-pipeline`, `gltf-asset-gate`, `webgl-viewer-engineering`, and `visual-fidelity-review`. Only the three requested Phase 0 skills were loaded. The harness advertises these skills but no dedicated skill-list command was available; discovery was verified through the filesystem. Blender and KTX skill execution was not tested.

Project instructions in effect: one phase per session; use the phase branch and atomic commit; record real outputs; change no application code in Phase 0; do not install system software, push, open a PR, deploy, or sign human gates; keep owner-approved decisions closed; update `docs/STATE.md` within 20 lines.

## Local tools and checks

| Check | Actual command and result |
| :--- | :--- |
| Node.js | `node -v` → `v22.23.2` (exit 0) |
| npm | `npm -v` → `11.6.0` (exit 0) |
| Blender | `blender --version` → `The term 'blender' is not recognized` (exit 1). `Get-Command blender` and `C:\Program Files\Blender Foundation` also found no executable. Headless `bpy` execution cannot run without Blender. |
| KTX-Software | `toktx --version` → `The term 'toktx' is not recognized` (exit 1). `Get-Command toktx` and `C:\Program Files\KTX-Software` found no executable. |
| Browser | `Get-Command chrome` → `C:\Users\user\AppData\Local\Google\Chrome\Application\chrome.exe`. Two sandboxed `chrome --headless --disable-gpu --no-first-run --dump-dom "data:text/html,..."` probes failed with `GPU process exited unexpectedly: exit_code=-1073741790` and `FATAL: GPU process isn't usable`. The second also disabled software rasterization and Vulkan. An allowed outside-sandbox retry exited 0 but printed no DOM. A Codex in-app browser was listed by Computer Use, but creating a data-URL tab timed out at 30 seconds. A successful automated page open is **not** established. |
| Computer Use | Available as a tool; inventory showed the Codex in-app browser. Its data-URL probe timed out. |
| Dependency install | `npm ci --no-audit --no-fund` was attempted in the sandbox, then retried with registry access after access errors. Exit 0: `added 268 packages in 5m`. npm warned that `next@14.2.13` is deprecated for a security vulnerability; Phase 1A already calls for upgrading it. |
| Production build | `npm run build` exited 0: `Compiled successfully`, `Generating static pages (7/7)`, and route `/` prerendered at 14.5 kB / 108 kB first-load JS. |

## Findings reproduced from the checkout

| Finding | Status and direct evidence |
| :--- | :--- |
| F1 | **REPRODUCED.** Python JSON check: `used 11 defined 7 undefined ['MAT_Carpet_Floor', 'MAT_Console_Veneer_And_Leather', 'MAT_Door_Card_Substrate', 'MAT_Screen_Driver_Cluster']`. The schema's `materialSlot` property is only a string; it has no cross-reference constraint. |
| F2 | **REPRODUCED for the type mismatch.** `rg` found schema `identifier`, `module`, `materialSlot` and `src/types/asset3d.ts` `sceneGraphIdentifier`, `moduleName`, `materialSlotId`. Both JSON documents had all root required keys (`requiredMissing []`), but a complete JSON-schema validation is separately noted below. |
| F5 | **REPRODUCED.** `src/lib/state/configurator-context.tsx` uses `Math.random()` in a four-iteration loop and returns `AL-SC-2026-${hash}`. |
| F7 | **REPRODUCED.** Escalated `npm view @react-three/fiber@9 peerDependencies --json` returned React and React DOM `^19.0.0` for the series; `npm view @react-three/drei@10 peerDependencies --json` returned React and React DOM `^19` and Fiber `^9.0.0`. `package.json` declares Next `14.2.13` and React `^18.3.1`. Initial sandboxed registry queries failed `EACCES`; the allowed retry succeeded. |
| F13 | **REPRODUCED.** Python JSON check across `catalogue.json`, `colors.json`, and `accent-threads.json`: `total 26 proposed 26 other []`. These are proposed research options, not confirmed AutoLab stock. |

The first F1 Python check failed with `TypeError: unhashable type: 'dict'` because `materialSlots` is an array of objects. It was corrected to compare each `slotIdentifier` and produced the result above. Python `jsonschema` is absent (`ModuleNotFoundError`); complete schema validation was not run. This does not negate the reproduced F2 field mismatch.

## Decision and plan review

Recorded: S-Class approved; V223 LWB working baseline with GATE-01 detail still open; D3 reference format `AL-SC-2026-XXXXXX`; D5 Supabase/Drizzle only; D6 Next 16 plus React 19; D8 kinematics excluded. Additional configurable vehicles are outside V1. Exact AutoLab materials remain pending physical catalogue and gates.

Pending: D1 and D4 before the 3D gate/spike, D10 and owner approval of draft `plan.md` before Phase 3; D2, D11, D12, D13 before their relevant zones; D7 before hosting. These do **not** block Phase 1A. D5 and D6 are already recorded, so do not reopen them.

Plan review notes (proposed edits, not applied): record actual Plus usage in Section 9 when the owner has the meter; retain the draft label and proposed thresholds until owner approval before Phase 3; update WP0's browser pass status from the failed probe; leave the F1 slot fix and F2 type fix to their assigned later phases. No additional stage or feature is proposed.

## Phase 1A readiness

**BLOCKED** on a demonstrated working headless browser for the required before/after screenshots. `npm ci` and the baseline production build pass. Blender and `toktx` are missing but do not block Phase 1A; they matter for later 3D phases. The exact AutoLab catalogue is also not a Phase 1A blocker.
