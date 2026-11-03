# Lexus L4 Stage B runtime recovery

Investigation started 2026-10-31; resumed 2026-11-02 and 2026-11-03 after interruptions. This is technical runtime evidence, **not visual acceptance**. All human gates remain open. No geometry or texture regeneration, dependency upgrades, L5 work or deployment.

## Diagnosis

- **Historical missing-KTX2 exception: NOT REPRODUCED on the clean incoming app.** The earlier Antigravity report records it at 2026-10-31 13:18 UTC. The inspected production build was produced later (13:26 UTC); its bundle attaches KTX2 in the `useGLTF` extension callback. Fresh production and localhost development both rendered the incoming Classic asset. This does not establish what code ran in the historical failed session. A stale build/cache is a hypothesis, not a confirmed cause.
- `incoming-production.json/png` records the visible production model and HTTP 200 decoder responses. Its instrumentation wait timed out because that production build has no E2E hook; the timeout is retained, not presented as a passing assertion. `incoming-development-localhost.json/png` has actual successful renderer/material instrumentation.
- **Confirmed Diamond integration defect:** the parent selected the Diamond URL but omitted the model's treatment prop; its default `classic` prevented the thread hook. The browser regression failed with `quiltThread: false` before the correction.
- **Confirmed Retry defect:** remounting Canvas reused the rejected `useGLTF` URL promise. An injected first-request 503 remained an error after Retry. Both pre-fix failures are in `regression-red.txt`.
- **Confirmed decoder lifecycle defect:** each uncached treatment created a new KTX2 loader without disposal. Browser warnings reported multiple active loaders. The correction gives each mounted renderer one decoder owner outside Suspense, with deferred cleanup for effect replay, outstanding callback accounting and cache retirement.
- **Confirmed development-origin issue:** `127.0.0.1` HMR was blocked by the incoming explicit `allowedDevOrigins` list. `localhost` worked. Added loopback while preserving existing allowed hosts. This is distinct from KTX2 parsing.
- Installed stdlib GLTFLoader can resolve a material with a null texture after a decoder failure. The viewer now rejects missing required Lexus maps rather than reporting an untextured model as success.
- **Confirmed statistics timing defect:** the first integrated run observed successful model parsing but zero triangles from the one-shot 120 ms timer. Slow shader compilation can finish later. Statistics now sample once after a real render via R3F `addAfterEffect`; no per-frame allocation is introduced. This corrects measurement timing rather than inventing a renderer count.
- **Confirmed error-preservation defect:** an injected missing-KTX2 error reached GLTFLoader correctly, then Canvas teardown's intentional context loss overwrote the displayed cause. Removing canvas listeners before reporting failure preserves the original error. The first injected probe exposed this (`hot-reload-attempt1.json/txt`); the corrected probe passes and restores source in `finally`.

## Loading contract

Installed: Three 0.186.1, Drei 10.7.9, R3F 9.8.2, three-stdlib 2.36.1. The app's GLTFLoader comes from Drei's stdlib import; its callback runs before load/parse. R3F caches by loader constructor and URL, not renderer or callback. No additional app preload/loading path was found. The L3 callback was the same as the incoming L4 callback; no API incompatibility was demonstrated. The nested stats-gl Three version was not shown to cause this issue.

The fix retains `useGLTF(url, "/draco/", false, callback)`. It attaches the renderer-configured stdlib KTX2 loader before loading, uses local `/basis/` and `/draco/`, clears rejected cache entries on Retry, forwards the Diamond treatment, and restores its shader hook on cleanup. Rollback assets do not receive the Diamond mask. Required seat maps are checked after parsing. No CDN or dependency changes.

API sources: [Drei useGLTF](https://drei.docs.pmnd.rs/loaders/gltf-use-gltf), [R3F useLoader/cache](https://r3f.docs.pmnd.rs/api/hooks#useloader), installed `three-stdlib/loaders/{GLTFLoader,KTX2Loader}.cjs`, installed Next `dist/docs/01-app/03-api-reference/05-config/01-next-config-js/allowedDevOrigins.md` and Fast Refresh guide. The separate old loading harness used addon loaders and was not accepted as evidence for the real app.

## Preservation and asset gate

Incoming files were backed up before changes; `incoming-file-hashes.json` and `incoming-status.txt` identify that input. Existing L4 assemblies are used as supplied; authoring/finalizer scripts were not run. The L3 SHA remains `c51e4db56faec8307eb6d6d25d88489cf212a935bafff0c2212c27abbcbc19d2`.

All four gate commands exited 0: `node scripts/validate-glb.mjs --scope lexus --asset <asset> --report <gate-report>`. See `gate-{classic,diamond,perforated,l3}.json` and matching command-output `.txt`. Each has six nodes, 76,548 triangles and 12 draw calls. Seven approved material slots remain present. Classic, Diamond and L3 exceed the 3,500,000-byte transfer target; Perforated is below it. Hard caps are unchanged. Khronos extension/image-format and unused-object warnings are retained. App browser decoding provides the additional KTX2/Draco evidence that the older Khronos validator cannot supply.

## Owner review boundary

The existing Diamond and Perforated mock-ups remain provisional. Prior angular quilt highlights, seam bands, soft pore rims/weak grain and abrupt stitch endpoints are not repaired by this runtime work. Technical success does not certify photographic appearance, factory trim identity or physical dimensions. Mobile viewport emulation is not a real-phone performance measurement. GPU memory bytes and phone FPS are not measured. The prior 13 development dependency audit findings remain unresolved.

Owner review: inspect both seats, steering wheel and dashboard; compare Classic/Diamond/Perforated; review primary/secondary colours and Diamond thread independently; orbit and use the four cameras; check loading and interaction on a real phone. All human visual/production gates and unverified reference gaps remain open.

## Validation and review notes

- Full Vitest: **102/102 PASS**, 11 files, 37.34 s, `node node_modules/vitest/vitest.mjs run --maxWorkers=1` (`vitest-final.txt`). The first concurrent attempt could not start workers; the first single-worker run passed 101/102 and caught extra Set.forEach callback arguments in the new helper. A one-argument wrapper fixed it. Logs retained (`targeted-tests.txt`, `vitest-attempt2.txt`). Lifecycle test-first execution was interrupted before running; no pre-implementation RED claim is made for those six tests. The two real browser RED regressions are separately retained.
- TypeScript: `node node_modules/typescript/bin/tsc --noEmit`, exit 0, no output. Initial failure included the backup .tsx copies in the project's broad TypeScript glob, plus two test fixture typing errors. Backup bytes remain preserved with `.snapshot` suffixes; shader fixtures now use explicit Three shader parameter types. No compiler rules were relaxed.
- ESLint: `node node_modules/eslint/bin/eslint.js .`, exit 0, **0 errors /44 warnings** (`lint.txt`); two warnings are duplicate unused imports in preserved local backup tooling, two in incoming diagnostic tooling, remainder existing application warnings. No suppression added.
- Initial complete browser run: **5 PASS /3 timeouts**, preserved in `browser-attempt1.txt`; the interrupted/resource-heavy session hit screenshot/load budgets and exposed the zero-statistics issue. These failures are not omitted from the evidence.
- Independent code review found no confirmed blocking single-viewer defect. Retry request-count assertion checks the potential delayed-cache-eviction concern. `cameraFov` is a selected-preset value, not a measured camera readback; actual screenshots complement this assertion. A decoder worker that never calls success/error can leave disposal pending indefinitely; no worker-crash recovery is claimed.

### Actual browser evidence

`PLAYWRIGHT_EXTERNAL_SERVER=1 node node_modules/@playwright/test/cli.js test e2e/lexus-runtime.spec.ts --workers=1`: **8/8 PASS**, 10.8 minutes (`browser-green.txt`). Actual Next application in Chromium/SwiftShader, not the isolated addon-loader harness. The local development server uses E2E instrumentation and the fixture consultation number `254700000000`; the test only inspects the link and never navigates to WhatsApp or sends a message.

- Classic, Diamond and Perforated: all load; six primary/secondary maps are actual compressed textures with 11 mip levels. Local Basis and Draco resources return 200. Successful loading/switching flows have zero browser errors. The remaining `THREE.Clock` deprecation warnings are recorded; no multiple-active-KTX2 warning remains.
- Repeated switching preserves seven slots and selected primary/secondary/thread colours. Colour edits preserve the loaded material's texture identities; different treatments have their own maps. Diamond enables its shader hook; other treatments do not. Four camera presets captured. Actual renderer: 12 calls /76,548 triangles; allocations grow from 9 textures /24 geometries cold to 21 textures /48 geometries after retaining three cached assemblies. These are renderer counts, **not GPU-byte measurements or FPS**.
- Failed GLB request recovers with exactly 2 requests (failure plus retry), in `retry-request-count.json`. L3 rollback loads; real context loss falls back and Retry succeeds. Missing assets, missing WebGL2 and failed Basis decoding display the fallback; decoder Retry restores compressed maps. Reload returns the existing default Classic configuration.
- Handoff URL reflects all three treatment labels. In-page configuration selections persist across treatment changes; persistence across browser reload is not claimed.
- `node tools/verify-lexus-runtime-hmr.mjs`: **PASS**, actual Fast Refresh via loopback origin, deliberately removed KTX2 attachment produces the exact missing-loader error, source restored, cold load succeeds. This is an **injected regression proof**, not reproduction of the historical incident. Expected error/stack retained in `hot-reload-and-regression.json`; successful HMR screenshot is `hot-reload.png`.

Review images: [Classic cabin](classic-cabin.png), [Diamond cabin](diamond-cabin.png), [Perforated cabin](perforated-cabin.png), [Diamond gold thread](diamond-thread-gold.png), [Diamond silver thread](diamond-thread-silver.png), [Perforated detail](perforated-detail.png), [driver view](camera-Driver-Hero.png), [cockpit/dashboard](camera-Cockpit-Dash.png). Existing cabin-camera dashboard occlusion and provisional surface appearance remain visible; no remodeling was performed.

All 12 incoming assembly/texture files are byte-identical to the pre-recovery inventory (`asset-preservation.json`). Older Antigravity screenshots/reports remain unchanged under `../lexus-l4b-2026-10-31/`; they are historical failed-session evidence, not the final runtime verification.

### Final correction checks and build

- After preserving original errors during Canvas disposal, the two relevant browser regressions pass again (**2/2**,2.4 minutes): injected 503 Retry with exactly two requests and original error retained, plus L3 rollback/context-loss Retry (`browser-final-recovery.txt`). The independent reviewer found no blocking issue in this listener cleanup or the render-frame statistics change.
- One production build: `NEXT_PUBLIC_E2E='' NEXT_PUBLIC_AUTOLAB_WHATSAPP_NUMBER='' node node_modules/next/dist/bin/next build`, **exit 0**,22.5 s compilation /33.3 s TypeScript; all six static pages generated (`production-build.txt`). Generated next-env type-path changes restored to the branch's existing development paths; no app dependency changes.
- Final touched-file ESLint check: viewer, decoder helper, runtime browser tests and the two final-verification tools, **exit 0 /no output** (`lint-final-touched.txt`).
- `node tools/verify-lexus-production.mjs`: **PASS**, normal production build visibly renders Classic, Diamond and Perforated, local decoders return 200, zero JS/console errors, E2E hook absent. Booking is disabled without a configured number. See `production-browser.json/txt` and [Classic](production-classic.png), [Diamond](production-diamond.png), [Perforated](production-perforated.png) screenshots. No outgoing consultation message was sent.

## Changed files and delivery

Source/assets/tests commit: `55c0046` on `pre-phase-6-reconciliation`; review evidence committed separately. Push is explicitly authorized by the recovery task. Exact phase delta from `0fff05c` is listed in [CHANGED_FILES.txt](CHANGED_FILES.txt). Core recovery code is `src/components/configurator/SpikeViewer.tsx`, `src/lib/three/ktx2-runtime.ts` and `next.config.ts`; regression coverage is in `tests/ktx2-runtime.test.ts`, `tests/lexus-thread-lifecycle.test.ts`, `tests/lexus-l4b.test.ts`, `e2e/lexus-runtime.spec.ts` and the diagnostic tools. Existing incoming treatment controls, configuration/summary wiring, thread-mask module, assemblies, textures, finalizer and historical evidence are preserved in the delivery.

No deployment command or service change is performed. Owner review remains the next checkpoint; no human gate is signed.
