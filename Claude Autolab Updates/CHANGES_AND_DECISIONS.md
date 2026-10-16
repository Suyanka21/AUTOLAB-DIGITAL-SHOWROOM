# Upgrade Pack: What Changed, How to Apply, What Is Unverified

## 1. What is in the pack (`autolab-upgrade-pack.zip`)
| Item | Purpose |
| :--- | :--- |
| `changes.patch` | Edits 12 existing files: README, AGENTS.md and GEMINI.md (on-demand skill loading, standing rules, session protocol, hard prohibitions, 3D stream, counts fixed), the master skill (22 to 18 patterns, missing-skill note, 3D map entries, description fix), 3 gates added, stale Three.js and glTF APIs fixed, budget clarifications, Stage 0 added, open items listed |
| `.agents/skills/` (4 new) | `blender-asset-pipeline`, `gltf-asset-gate`, `webgl-viewer-engineering`, `visual-fidelity-review` (14.8 KB in total) |
| `docs/spike/` | Pre-filled conflict and decision register (16 findings, 13 decisions), draft spike plan with pass criteria, reference-capture checklist |
| `docs/ops/` | Hosting and handover draft (GATE-09), privacy and data protection draft (GATE-10) |
| `.env.example`, `tools/` | Environment template with no real values; optional script making all skills explicit-only |

## 2. How to apply
1. Unzip and copy the contents into your repo root (so `changes.patch` sits beside `package.json`).
2. Do NOT apply it yourself. Phase 0 of `PROMPTS.md` has Codex apply and check it.
3. Optional: run `tools/make-skills-explicit.sh` to stop all skills triggering implicitly.

## 3. What I verified (with commands)
- The patch applies cleanly to a fresh clone of commit `0ede810` (`git apply --check`).
- All 31 skills parse as valid YAML with names matching their folders. (This caught an invalid description in one of MY new skills, now fixed.)
- `AGENTS.md` is 17,145 bytes against Codex's 32 KiB cap; `GEMINI.md` is kept identical.
- The manifest and vehicle config still pass their schemas (no JSON files were changed).
- Upgrade paths tested in a scratch lockfile copy: Next 14.2.35 alone still has 1 critical; Next 14 + no Firebase + new Drizzle leaves Next critical and PostCSS high; Next 16.4.1 + React 19 + no Firebase + new Drizzle gives zero advisories.
- R3F 9.8.2 and drei 10.7.9 require React 19; React 18 needs fiber 8.18 and drei 9.122.

## 4. What I could NOT verify
- Skills have not been run against Astra. I have no access to it; Phase 0 checks that they load.
- Next 16 build: not run (the audit was lockfile-only).
- The `agents/openai.yaml` policy format comes from documentation snippets; Phase 0 confirms the skill list behaves.
- Blender export parameter names vary by version; Phase 3 introspects them at runtime.
- Hum3D's licence text: not retrievable. No purchase is recommended.
- Whether Astra and Computer Use are available on your account in Kenya, and which models your Plus plan includes.
- ODPC exemption thresholds and the breach-notification deadline: reported, to be confirmed with the regulator or a lawyer.
- The texture-memory figures (about 49 MB plus about 17 MB) are estimates; spike budgets and rubric thresholds are proposals.
- That mid-range Android phones dominate in the Nairobi market is an inference.

## 5. The decisions that matter most (full list in `docs/spike/conflicts.md`)
D6 Next 16 + React 19 now. D1 how thread colour changes. D8 cut kinematics (not in your decision freeze). D13 what frames the cabin. D9 which S-Class AutoLab's customers actually own. D3 reference code design.
