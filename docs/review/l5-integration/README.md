# L5 production UI integration — local owner review

Owner instruction: approved L5-R1 for the initial commercial mock-up; integrate into the working app. Baseline `8fd1693`, working branch `codex/l5-r1-design-refinement` retained as requested. This supersedes R1's implementation hold, not any unrelated human gate.

## Scope and existing plan

Follow [R1's incremental plan](../l5-design-direction/r1/IMPLEMENTATION-PLAN.md): (1) brand/welcome, (2) live stage/shell, (3) treatment slider and four-step controls, (4) camera/responsive checks, (5) summary/concierge, (6) final regression evidence. Revert presentation commits in reverse order for rollback. No new design exploration, dependency, font download, deployment or geometry work.

Source compositions: [R1 board](../l5-design-direction/r1/index.html), [configurator](../l5-design-direction/r1/html/configurator.html), [welcome](../l5-design-direction/r1/html/welcome.html), [summary](../l5-design-direction/r1/html/summary.html), [validation](../l5-design-direction/r1/VALIDATION.md).

Preserve the three treatment GLBs, seven bindings, KTX2/Draco lifecycle, diamond thread shader, four camera coordinates/orbit limits, configuration defaults/reference generator, existing WhatsApp payload, Spec Sheet/copy, fallback and Retry. Sienna Brown stays the default. No seat/cockpit/console/lighting/texture refinement. The existing geometric wheel mark remains untouched.

**Scope clarification:** the newest instruction explicitly preserves the WhatsApp payload. Its existing manufacturer line therefore remains byte-for-byte in handoff construction, superseding R1's proposed future copy replacement there. Customer chrome/metadata use AutoLab. The Windows system-font stack from R1 is retained with its documented cross-platform fallbacks; proposed OFL fonts are not downloaded.

## Incremental evidence

- Welcome test RED: old `/splash` returned “Suyanka App” instead of approved editorial heading. Test then covers immediate `/` entry, no extra canvas, authentic logo and reduced motion.
- Typecheck found an ES2018 regex flag in the new test; replaced with an ES5-compatible expression. Typecheck then exited 0.
- Local test orchestration encountered a managed-server port cleanup delay, followed by connection-refused checks when the process was stopped/interrupted. Switched to an explicit Next dev server with `NEXT_PUBLIC_E2E=1` and external-server Playwright runs. These are environment/test-startup failures, not passes.

## Delivered — 2026-11-05

[Open the visual review board](index.html) · [Download the actual 64-second recording](evidence/showroom-interactions.webm).

- Authentic AutoLab identity, immediate `/splash` welcome, direct `/` configurator entry, scoped ivory/graphite/cyan tokens and approved system fonts.
- One existing live viewer stays mounted through four steps and the specification reveal. Three-treatment keyboard/touch carousel, original cameras, live colour/thread/composition controls.
- Finite CSS transitions, reduced motion, visible focus, step-heading focus, native modal Spec Sheet and clipboard-denied fallback. No added effect library or permanent rendering loop.
- Real reference and preserved encoded WhatsApp payload. Unconfigured number is disabled; fixture contact tested without sending.
- Starter names/emblems removed from legacy auth/dashboard chrome and unused legacy navigation/footer. Account behaviour unchanged; those routes remain outside the showroom journey.

### Actual production application screenshots

| Screen | Desktop | Mobile viewport |
|---|---|---|
| Welcome | [PNG](evidence/desktop-welcome.png) | [PNG](evidence/mobile-welcome.png) |
| Configurator | [PNG](evidence/desktop-configurator.png) | [PNG](evidence/mobile-configurator.png) |
| Specification | [PNG](evidence/desktop-summary.png) | [PNG](evidence/mobile-summary.png) |
| Spec Sheet | [PNG](evidence/desktop-spec-sheet.png) | [PNG](evidence/mobile-spec-sheet.png) |

Also: [Diamond detail](evidence/desktop-diamond-detail.png), [loading](evidence/loading-state.png), [error/Retry](evidence/error-state.png), [mobile clipboard denial/reduced motion](evidence/mobile-summary-reduced-motion.png). Table/recording use the optimized Next.js build without `window.__autolab`; recovery screenshots use instrumented development mode. The VP9/WebM recording is 1440×1000, 63.92 seconds. Its 25 fps capture rate is **not measured viewer FPS**.

## Validation

All commands used installed tools from the repository root. No dependency installation.

| Command/check | Actual result | Evidence |
|---|---|---|
| `node node_modules/vitest/vitest.mjs run` | 11 files, **102 tests passed**, 37.19s; exit 0 outside sandbox | [output](evidence/unit-tests-unrestricted.txt) |
| `node node_modules/typescript/bin/tsc --noEmit` | exit 0 | [output](evidence/typecheck.txt) |
| `node node_modules/eslint/bin/eslint.js .` | exit 0; existing unused-symbol warnings, no errors | [final output](evidence/lint-final.txt) |
| `node node_modules/next/dist/bin/next build` | compiled, TypeScript completed, all six static pages generated | [output](evidence/production-build.txt) |
| Active browser checks | **16 distinct tests passed across documented runs**, including corrected selectors/waits | [initial](evidence/browser-regression.txt), [responsive](evidence/responsive-recovery.txt), [loading rerun](evidence/loading-recovery-rerun.txt), [handoff](evidence/whatsapp-fixture.txt) |
| Four GLB gates, scope `lexus` | all four commands exit 0, actual GLBs and SHA-bound reports | [Classic](evidence/gate-classic.json), [Diamond](evidence/gate-diamond.json), [Perforated](evidence/gate-perforated.json), [L3](evidence/gate-l3.json) |
| `node scripts/check-l5-preservation.mjs` | exit 0; protected paths/hash checks unchanged from `8fd1693` | [report](evidence/preservation.json) |
| `node scripts/capture-l5-showroom.mjs` | exit 0; desktop/mobile production captures, no page/console errors, E2E hook absent | [measurements](evidence/production-browser.json) |

Browser commands used an explicit dev server on port 3100, `NEXT_PUBLIC_E2E=1`, and `PLAYWRIGHT_EXTERNAL_SERVER=1`:

```powershell
node node_modules/@playwright/test/cli.js test e2e/l5-showroom.spec.ts e2e/quality.spec.ts e2e/lexus-runtime.spec.ts --grep-invert 'consultation handoff' --project=chromium --workers=1 --reporter=line
node node_modules/@playwright/test/cli.js test e2e/l5-responsive.spec.ts e2e/quality.spec.ts --project=chromium --workers=1 --reporter=line
node node_modules/@playwright/test/cli.js test e2e/l5-responsive.spec.ts -g 'delayed loading' --project=chromium --workers=1 --reporter=line
# Restart dev with NEXT_PUBLIC_AUTOLAB_WHATSAPP_NUMBER=254700000000 (fixture only):
node node_modules/@playwright/test/cli.js test e2e/lexus-runtime.spec.ts -g 'consultation handoff' --project=chromium --workers=1 --reporter=line
```

The first server used an empty number. Fixture run checked three exact treatment payloads and the preserved vehicle line, without navigation or sending. Historical S-Class/L2A browser specs were not run against the current L4 assembly; the relevant L4 runtime suite was run in full. Its seven-binding, local-decoder, compressed-map/11-mip, triangle and draw-call assertions remain intact. Only UI selectors/evidence paths changed; historical evidence was not overwritten.

Six new L5 tests cover immediate welcome/no second renderer, stable canvas/code/Spec Sheet, live colour/thread/composition, four cameras, touch/keyboard boundaries, 320/390/768px width, reduced motion, clipboard denial and loading/Retry. Existing tests cover repeated switching, independent bindings, GLB/Basis failures, context loss, no WebGL, missing asset and L3 rollback.

Each gate used `node scripts/validate-glb.mjs --scope lexus --asset public/assets/3d/lexus-rx350/interior-l4-<treatment>.glb --report docs/review/l5-integration/evidence/gate-<treatment>.json`. L3 used `interior-l2b.glb` and `gate-l3.json`. Matching `.txt` outputs retain warnings. Classic/Diamond/L3 exceed the 3.5 MB transfer target but meet hard caps. Older Khronos KTX2/Draco extension/image-format and unused-object warnings remain; browser decoding supplies runtime evidence.

### Failures retained honestly

- Test-first old welcome, absent carousel radios and old specification navigation failed before implementation. Typecheck also caught missing fallback-extraction props and a malformed JSX handler; fixed before slice commits.
- Initial combined browser run: 12 passed, one ambiguous booking-message selector matched the summary and closed dialog. Scoped to visible status; quality rerun passed.
- Responsive run: three passed, delayed-loading test hit its 5s Retry expectation before the request began. Added request-start synchronization and the existing 60s asset wait; targeted rerun passed in 29.7s. Recovery implementation unchanged.
- First unit run failed before execution due to esbuild sandbox parent-directory access. Authorized unrestricted rerun passed all 102; [original failure](evidence/unit-tests.txt) retained.
- Installed Playwright/CDP supplied browser evidence after an earlier app browser-tab attachment failure. No screenshots were fabricated.

## Measurements and remaining limitations

- Cold Classic: **12 calls, 76,548 triangles, 9 textures, 24 geometries**; local Basis/Draco responses 200, no console errors. [Cold load](evidence/cold-load.json).
- Production after desktop treatment switching: **12 calls, 76,548 triangles, 21 textures, 48 geometries**. Fresh mobile-viewport Classic: **12 / 76,548 / 9 / 24**. Counts include the existing resource cache; they are not GPU bytes.
- Local entry-to-ready wall time: desktop **12,674 ms**, mobile viewport **7,434 ms**. Single samples on local Chromium SwiftShader, no throttling, include software-renderer work; not phone benchmarks or performance-budget acceptance. Resource timings/transfer bytes are separately recorded in [production-browser.json](evidence/production-browser.json).
- Physical Android/iPhone, Safari/Firefox, hardware FPS/GPU memory and full screen-reader/accessibility certification: **NOT TESTED**. Existing `THREE.Clock` deprecation warnings remain. Dev also reported a material-card image loading hint. No renderer upgrade attempted.
- Existing shading, seam/junction, silhouette, cockpit and material-appearance defects remain. Steering-wheel identifying geometry is unchanged. No 3D human gate closed.
- Static approved detail/welcome images remain Sienna Brown studies; only the live cabin reflects colour selections. Local fonts may reflow on other systems. No font/model/texture/HDRI/effect library downloaded.
- Existing context resolves leather family through a colour's first compatible family; shared colours do not create an independent hide selection. Ambient selection is recorded in the specification; no new interior lighting introduced.
- Real WhatsApp number remains a configuration prerequisite; the fixture is not a business contact. Existing 13 development-dependency audit findings, catalogue approvals, reference gaps and human gates remain open; no new dependency audit/upgrade.

## R1 adaptations and reversible commits

Approved composition/tokens retained. Static stage images become the existing live canvas, including summary. The reveal stays in-page to preserve canvas/state; additional existing options use disclosure sections. Camera coordinates/orbit limits/movement remain unchanged. Latest payload-preservation instruction supersedes R1's proposed manufacturer-line removal. No third-party effect installed.

| Commit | Boundary |
|---|---|
| `6f1b024` | Welcome, brand assets, scoped tokens, metadata |
| `aa33b99` | Workbench shell, fallback extraction, camera presentation |
| `241a93d` | Treatment slider and four-step live controls |
| `203332d` | Specification reveal, copy and Spec Sheet |
| `022521f` | Legacy starter identity cleanup |
| Following evidence commit | Tests, capture/preservation scripts, review pack and STATE |

Rollback in reverse order to `8fd1693`; shell/control slices depend on shared presentation components. Assets/state/decoders need no rollback because unchanged. No push/deployment.

## Owner review checkpoint

- [ ] Review actual desktop/mobile welcome, configurator and summary against R1.
- [ ] Judge carousel, camera navigation and transition pacing in the recording/live app.
- [ ] Check a real phone and confirm the eventual studio WhatsApp destination.
- [ ] Keep future 3D improvements and existing human gates separate from UI approval.

**Technical integration complete; owner visual acceptance pending. STOP here.**
