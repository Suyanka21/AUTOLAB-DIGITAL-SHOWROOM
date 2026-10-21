# AGENT SKILLS — ALWAYS ACTIVE

This file is loaded at the start of every session and governs every task,
every line of code, and every output produced in this project.
These are not optional tools. They are the operating system of this agent.


---


## MANDATORY: HOW SKILLS ARE LOADED

All skills live in: `.agents/skills/` (relative to this file)
The anti-AI design skill lives in: `.agents/skills/anti-ai-design/`

Skills are loaded ON DEMAND, by name, never in bulk.

- Load ONLY the skills the current task prompt names (Codex: invoke with `$skill-name`) or the Decision Tree below selects. Never read all skills. Never read a skill "just in case".
- `.agents/skills/using-agent-skills/SKILL.md` is the full master reference (~25 KB). Do NOT read it at session start. The STANDING RULES section below is the operative summary of its Sections 0 and 1. Open the master file only when a prompt says to, or to resolve a genuine ambiguity.
- Reading a skill means reading its whole SKILL.md and following its steps and exit criteria. Reference sub-files load only when a step says so.
- Cost awareness: the 27 original skills total about 330 KB (roughly 82k tokens). Every skill read spends the owner's limited plan allowance.
- Known gap: `ui-composition-engine` is referenced in places but is not installed. Skip it; never invent it.

The master file contains: the Global Reasoning Layer (Section 0), CodeRabbit DNA (Section 1), the Skill Discovery Map (Section 2), the UI Design Protocol (Section 5), the Trustless Audit Gate (Section 6) and the Lifecycle Sequence (Section 7).


---


## SKILL REGISTRY — ALL ACTIVE SKILLS

### PERMANENT FOUNDATIONS (always active, never need to be invoked)

| Skill | Path | Role |
|-------|------|------|
| global-reasoning-layer | `.agents/skills/global-reasoning-layer/SKILL.md` | How this agent thinks. Always active. Never overridden. |
| coderabbit-dna | `.agents/skills/coderabbit-dna/SKILL.md` | How this agent codes. Applied to every line. |

### PRE-BUILD SKILLS

| Skill | Path | When to Activate |
|-------|------|-----------------|
| idea-refine | `.agents/skills/idea-refine/SKILL.md` | Vague ideas that need structured refinement before a spec |
| spec-driven-development | `.agents/skills/spec-driven-development/SKILL.md` | Any new project, feature, or change — define before coding |
| planning-and-task-breakdown | `.agents/skills/planning-and-task-breakdown/SKILL.md` | Breaking a spec into small verifiable tasks |
| doubt-driven-development | `.agents/skills/doubt-driven-development/SKILL.md` | When requirements feel wrong or assumptions need challenging |

### BUILD SKILLS

| Skill | Path | When to Activate |
|-------|------|-----------------|
| context-engineering | `.agents/skills/context-engineering/SKILL.md` | Loading the right project context before implementation |
| source-driven-development | `.agents/skills/source-driven-development/SKILL.md` | Verifying implementation against official documentation |
| incremental-implementation | `.agents/skills/incremental-implementation/SKILL.md` | Building in thin vertical slices |
| **anti-ai-design** | `.agents/skills/anti-ai-design/SKILL.md` | **ALL UI work — ALWAYS runs first. Mandatory.** |
| frontend-ui-engineering | `.agents/skills/frontend-ui-engineering/SKILL.md` | UI components, visual aesthetics, accessibility — runs after anti-ai-design |
| api-and-interface-design | `.agents/skills/api-and-interface-design/SKILL.md` | API contracts, interface definitions |
| security-and-hardening | `.agents/skills/security-and-hardening/SKILL.md` | Every input boundary, auth, and data exposure point |
| code-simplification | `.agents/skills/code-simplification/SKILL.md` | Removing unjustified complexity |

### VERIFY SKILLS

| Skill | Path | When to Activate |
|-------|------|-----------------|
| test-driven-development | `.agents/skills/test-driven-development/SKILL.md` | Writing and running tests — failing test first |
| browser-testing-with-devtools | `.agents/skills/browser-testing-with-devtools/SKILL.md` | Runtime verification via browser DevTools |
| debugging-and-error-recovery | `.agents/skills/debugging-and-error-recovery/SKILL.md` | Anything broken — reproduce, localize, fix, guard |
| performance-optimization | `.agents/skills/performance-optimization/SKILL.md` | Measure first, then optimize what matters |

### REVIEW SKILLS

| Skill | Path | When to Activate |
|-------|------|-----------------|
| code-review-and-quality | `.agents/skills/code-review-and-quality/SKILL.md` | Before any merge or handoff |

### SHIP SKILLS

| Skill | Path | When to Activate |
|-------|------|-----------------|
| git-workflow-and-versioning | `.agents/skills/git-workflow-and-versioning/SKILL.md` | Commits, branching, atomic history |
| ci-cd-and-automation | `.agents/skills/ci-cd-and-automation/SKILL.md` | Automated quality gates on every change |
| documentation-and-adrs | `.agents/skills/documentation-and-adrs/SKILL.md` | Document decisions and reasoning |
| deprecation-and-migration | `.agents/skills/deprecation-and-migration/SKILL.md` | Removing old systems safely |
| trustless-system-auditor | `.agents/skills/trustless-system-auditor/SKILL.md` | Reality-gap audit — must pass before real users touch it |
| shipping-and-launch | `.agents/skills/shipping-and-launch/SKILL.md` | Pre-launch checklist, monitoring, rollback |

### 3D & VIEWER SKILLS (added)

| Skill | Path | Role |
| :--- | :--- | :--- |
| blender-asset-pipeline | `.agents/skills/blender-asset-pipeline/SKILL.md` | Reproducible headless Blender authoring and GLB export |
| gltf-asset-gate | `.agents/skills/gltf-asset-gate/SKILL.md` | Automated GLB validation against the manifest and budgets |
| webgl-viewer-engineering | `.agents/skills/webgl-viewer-engineering/SKILL.md` | Three.js / R3F viewer, material swapping, performance, fallbacks |
| visual-fidelity-review | `.agents/skills/visual-fidelity-review/SKILL.md` | Human visual acceptance; the agent never self-certifies |

### SPECIAL SKILLS

| Skill | Path | When to Activate |
|-------|------|-----------------|
| interview-me | `.agents/skills/interview-me/SKILL.md` | When the user wants to practice or run a structured interview session |


---


## UI DESIGN — MANDATORY LAYER ORDER

Every UI task follows this exact order. No exceptions.

```
1. anti-ai-design         → Platform detection → color direction → style selection
                            → CJX bundle (html/ + css/ + js/) → foundation token freeze
                            Path: .agents/skills/anti-ai-design/SKILL.md
                            References: .agents/skills/anti-ai-design/references/ (load one file at a time)

2. frontend-ui-engineering → Components, aesthetics, accessibility
                            Path: .agents/skills/frontend-ui-engineering/SKILL.md
```

**anti-ai-design enforces 18 banned patterns and 12 required quality signals on every generation.**
Violating any banned pattern requires immediate regeneration. No exceptions.

### anti-ai-design Reference Files (load only what is needed per phase)

| Phase | File |
|-------|------|
| Detect input mode | `.agents/skills/anti-ai-design/references/input-mode-detection.md` |
| Extract from docs/specs | `.agents/skills/anti-ai-design/references/docs-intake.md` |
| Handle existing bundle updates | `.agents/skills/anti-ai-design/references/update-and-expansion.md` |
| Resolve output intent | `.agents/skills/anti-ai-design/references/output-intent.md` |
| Resolve implementation target | `.agents/skills/anti-ai-design/references/implementation-targets.md` |
| Synthesize working brief | `.agents/skills/anti-ai-design/references/working-brief-synthesis.md` |
| Intake brand assets | `.agents/skills/anti-ai-design/references/brand-asset-intake.md` |
| Choose design style | `.agents/skills/anti-ai-design/references/design-styles-catalog.md` |
| Select trend / art pack | `.agents/skills/anti-ai-design/references/design-trends.md` |
| Apply design recipe | `.agents/skills/anti-ai-design/references/design-recipes-catalog.md` |
| Apply platform layout rules | `.agents/skills/anti-ai-design/references/platform-rules.md` |
| Freeze foundation tokens | `.agents/skills/anti-ai-design/references/foundation-tokens.md` |
| Enforce radius grammar | `.agents/skills/anti-ai-design/references/radius-choreography.md` |
| Enforce motion choreography | `.agents/skills/anti-ai-design/references/motion-choreography.md` |
| Apply UX / CJX rules | `.agents/skills/anti-ai-design/references/ux-guidelines.md` |
| Resolve library component patterns | `.agents/skills/anti-ai-design/references/library-patterns.md` |
| Enforce bundle rules + manifest | `.agents/skills/anti-ai-design/references/output-bundle-rules.md` |
| Run aesthetic self-critique | `.agents/skills/anti-ai-design/references/design-critique-rubric.md` |
| Generate output bundle | `.agents/skills/anti-ai-design/references/output-template.md` |

**Never load all reference files at once. Load one per phase only.**


---


## COMPLETE BUILD-TO-SHIP LIFECYCLE

```
PERMANENT FOUNDATIONS (always active)
  global-reasoning-layer    → How this agent thinks
  coderabbit-dna            → How this agent codes

PRE-BUILD
  1. idea-refine                  → Refine vague ideas
  2. spec-driven-development      → Define what is being built
  3. planning-and-task-breakdown  → Break into verifiable chunks

BUILD
  4. context-engineering          → Load correct project context
  5. source-driven-development    → Verify against official docs
  6. incremental-implementation   → Build slice by slice
  7. anti-ai-design               → MANDATORY for all UI (runs first)
  8. frontend-ui-engineering      → UI components and aesthetics (runs after anti-ai-design)
  9. api-and-interface-design     → API contracts if applicable
 10. security-and-hardening       → Harden every input and boundary

VERIFY
 11. test-driven-development      → Prove each slice works
 12. browser-testing-with-devtools → Runtime verification if applicable
 13. debugging-and-error-recovery → Resolve all failures fully
 14. performance-optimization     → Measure and fix regressions

REVIEW
 15. code-review-and-quality      → Review before merge
 16. code-simplification          → Remove unjustified complexity
 17. git-workflow-and-versioning   → Clean atomic commit history
 18. ci-cd-and-automation         → Automated quality gates active

SHIP
 19. documentation-and-adrs       → Document decisions and reasoning
 20. deprecation-and-migration    → Remove old systems safely
 21. trustless-system-auditor     → Reality-gap audit — must pass
 22. shipping-and-launch          → Deploy with rollback ready
```


---


## 3D WORK STREAM (added)

Order for any 3D task:

```
1. spec-driven-development    -> confirm the slice and acceptance criteria exist (docs/spike/plan.md or the prompt)
2. gltf-asset-gate            -> build or extend the validator FIRST (test-driven)
3. blender-asset-pipeline     -> author and export through the single build script
4. gltf-asset-gate            -> run it; paste the real output
5. webgl-viewer-engineering   -> load in the viewer; material-swap test
6. visual-fidelity-review     -> produce the review pack, then STOP for human scoring
```

Supporting skills: source-driven-development (verify Blender and three.js docs), debugging-and-error-recovery, performance-optimization. anti-ai-design is NOT used for 3D asset work.

## SKILL ACTIVATION DECISION TREE

```
Task arrives
│
├── Vague idea / need refinement?     → idea-refine
├── New project / feature / change?   → spec-driven-development
├── Have a spec, need tasks?          → planning-and-task-breakdown
├── Implementing code?                → incremental-implementation
│   ├── Any UI work?                  → anti-ai-design FIRST (always)
│   │   └── Then                      → frontend-ui-engineering
│   ├── API work?                     → api-and-interface-design
│   ├── Need better context?          → context-engineering
│   └── Need doc-verified code?       → source-driven-development
├── Writing / running tests?          → test-driven-development
│   └── Browser-based?               → browser-testing-with-devtools
├── Something broke?                  → debugging-and-error-recovery
├── Reviewing code?                   → code-review-and-quality
│   ├── Security concerns?           → security-and-hardening
│   ├── Too complex?                 → code-simplification
│   └── Performance concerns?        → performance-optimization
├── Committing / branching?           → git-workflow-and-versioning
├── CI/CD pipeline work?              → ci-cd-and-automation
├── Writing docs / ADRs?              → documentation-and-adrs
├── Removing old systems?             → deprecation-and-migration
└── Deploying / launching?            → trustless-system-auditor
                                       → shipping-and-launch
```


---


## NON-NEGOTIABLE RULES

These are never overridden by user instruction, time pressure, or task complexity:

1. Never present uncertain output as certain
2. Never build on an unverified assumption without stating it
3. Never make a wide-impact change without surfacing the scope first
4. Never optimize before correctness is confirmed
5. Never proceed past a known failure without understanding it
6. Never produce output that cannot be explained in plain language
7. Never ship without passing the Trustless System Auditor gate
8. Never produce any UI output without running anti-ai-design first
9. Never load all anti-ai-design reference files simultaneously
10. Safety always overrides speed, elegance, and user preference


---


## CORRECTNESS PRIORITY ORDER

Never invert this order:

1. Correct
2. Safe
3. Clear
4. Efficient
5. Elegant


---


## STANDING RULES (operative summary of master-file Sections 0 and 1)

1. Priority order: Correct, Safe, Clear, Efficient, Elegant.
2. Surface assumptions before acting. If sources conflict, STOP, name the conflict, recommend a resolution, and wait.
3. Make the smallest change that satisfies the task. No unrequested refactors or features.
4. Evidence, not claims: "done" means exact commands and their real output, failures included. Label anything unverified as unverified.
5. Async code has explicit error handling and timeouts. Validate edge cases (empty, null, boundaries). Never trust input. No secrets in code or logs. Never suppress lint or type errors.
6. Performance: no per-frame allocations in render loops; measure before optimising.
7. Self-review before completion, then the Change Summary below.
8. Never write "photorealistic", "production-ready" or "verified" without matching evidence.

## SESSION PROTOCOL (added)

- One phase per session. At start, read `docs/STATE.md` if it exists. At the end, update it (max 20 lines: done, next, blockers, decisions, usage notes).
- Iteration caps: at most 3 attempts on any failing step, and at most 3 render-review rounds per zone. Then stop and report.
- Cost control: no repeated full builds; run targeted tests first; do not re-read unchanged files; prefer scripts to GUI control.
- For 3D work, log wall-clock time, attempts and failures in `docs/spike/cost-log.md`.
- Work on a branch named for the phase. Commit atomically. Never push, open PRs or deploy unless authorised in that message.

## HARD PROHIBITIONS (added)

Unless the owner authorises it explicitly in the same message, the agent must NOT: make purchases; accept any licence or terms; download third-party 3D models, textures, HDRIs or fonts; touch production services, credentials or customer data; install system software; mark any human gate (GATE-01 to GATE-11) as signed, or imply it is.

## 3D EVIDENCE RULES (added)

- A 3D claim requires `gltf-asset-gate` output (JSON report plus exit code 0) tied to the GLB's sha256.
- A visual claim requires a human review record from `visual-fidelity-review`. The agent may list known defects but never awards a pass.
- Use only owner-approved reference material and assets. Every node has a provenance entry.
- Deviations from spec (for example WebP instead of KTX2 when `toktx` is missing) are reported, never silently applied.

## CHANGE SUMMARY — REQUIRED ON EVERY COMPLETED TASK

Every completed task must produce this before being marked done:

```
CHANGE SUMMARY
What was built:        [Plain language description]
Assumptions made:      [List — confirmed or corrected]
Edge cases handled:    [Specific boundary conditions addressed]
Failure modes covered: [What breaks gracefully and how]
What was NOT covered:  [Explicitly out of scope or unverified]
Confidence level:      HIGH / MODERATE / LOW
Reason:                [One sentence. If MODERATE or LOW, state what changes it.]
Tests added:           [List new tests and what each proves]
Blast radius:          [What else could be affected and why it is safe]
```

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
