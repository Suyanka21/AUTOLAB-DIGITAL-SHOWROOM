# Final L2B-R1 validation — 2026-10-28

All exit codes below were observed from completed processes. No visual score follows from these results.

| Command / check | Actual result | Evidence |
| --- | --- | --- |
| `C:\Python312\python.exe tests/test_cockpit_surfaces.py` | Exit 0; 3 tests pass after missing-module red run | [green](evidence/surfaces-green.txt), [red](evidence/surfaces-red.txt) |
| `npm test -- --maxWorkers=1` | Exit 0; 81 tests / 7 files; 49.00s | [full suite](evidence/tests-full.txt) |
| `npm run typecheck` | Exit 0 | [typecheck](evidence/typecheck.txt) |
| `npm run lint` | Exit 0; zero errors, 41 existing warnings | [lint](evidence/lint.txt) |
| `npm run build` | Exit 0; one production build; compile 20.0s, TypeScript 25.7s, six static pages | [build](evidence/build.txt) |
| Dashboard gate / browser | Exit 0; real Draco/KTX2 and three independent materials pass | [gate CLI](evidence/dashboard-gate-final.txt), [browser](evidence/dashboard-browser-final.txt) |
| Wheel gate / browser | Exit 0; real Draco/KTX2 and three independent materials pass | [gate CLI](evidence/wheel-gate-final.txt), [browser](evidence/wheel-browser-final.txt) |
| Combined gate / browser | Exit 0; real Draco/KTX2 and seven independent materials pass | [gate CLI](evidence/combined-gate-final.txt), [browser](evidence/combined-browser-final.txt) |
| Fresh-process Blender rebuilds | Exit 0 each; same nodes, triangle counts, dimensions, zero boundary/degenerate checks and source hashes | [comparison](evidence/repeat-consistency.json), [dashboard](evidence/dashboard-build-repeat.txt), [wheel](evidence/wheel-build-repeat.txt) |
| Missing rollback reproduction | Exit 0; restored pinned Git blob matches held original; combined hash unchanged | [assembly](evidence/rollback-restore-assembly.txt) |

Fresh Blender commands were the handoff's `-b --factory-startup --python-exit-code 1 --python tools/build-lexus-asset.py -- --l2b dashboard` and `... wheel`. Repeat reports are separate from original artifact build reports. No repeat finalization or render was needed; delivered assets remain pinned to the original final execution. Repeat topology/counts are proven; repeat raw GLB byte identity was not tested.

Final packaging: `C:\Python312\python.exe tools/package-lexus-l2b-r1-review.py`, exit 0. It asserts matching before/after camera/light/settings and delivered GLB/gate/browser/proxy/render SHA-256s. [Output](evidence/package.txt). Reference and comparison-sheet layouts were visually inspected; this checks evidence legibility, not model acceptance.

The production build generated its usual `next-env.d.ts` route-type paths; restored the tracked development paths afterward. No app implementation, dependency or lockfile change is included.

Final consistency: 95 local links, delivered/source/render/comparison/reference hashes, original Git rollback bytes, baseline gate snapshots, preserved seats and 17-line STATE pass ([log](evidence/consistency.txt)). Initial staged whitespace check flagged only blank endings/trailing spaces emitted by CLI tools in raw `.txt` evidence; logs are retained verbatim. Source/documentation whitespace check excludes those raw logs and passes. No validation failure was hidden or reformatted into success.

Environmental failures retained: initial sandbox esbuild ancestor-directory denial; final GLB writes `UNKNOWN -4094` followed by one successful unrestricted retry each. No reinstall or audit repair. Thirteen prior development audit findings remain unresolved; no fresh audit is claimed. Blender deprecation and validator/browser warnings remain in raw reports.

NOT TESTED: real-phone performance, hardware GPU memory, actual L3 application integration, human visual acceptance, physical/OEM dimensions, calibrated upholstery appearance. No gate closure or 9.5/10 claim.
