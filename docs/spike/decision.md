# Two-node feasibility decision — PENDING HUMAN SCORES

**No GO, HYBRID or NO-GO decision has been recorded.** The technical gate passed for the scoped feasibility asset; this does not approve visual fidelity, production geometry, exact AutoLab materials or KTX2 compliance. GATE-01, GATE-08, GATE-11 and GAP-01 through GAP-04 remain open. The owner-approved WebP deviation `P3-WEBP-2026-10-20` remains feasibility-only.

## Measured and recorded facts

| Item | Evidence / measured result | Limit or status |
| --- | --- | --- |
| Real GLB asset gate | [JSON report](../../reports/glb-report.json) `passed: true`, `scope: spike`, 0 validator errors; command exited 0 | Technical PASS only; WebP waiver reported |
| SHA-256 | `36a107f152039a464d4a4dd7786794f66ea40628b5c97ad2d8083964ad1b458e` | Same in Phase 3 and Phase 4 evidence |
| Geometry | Seat 4,860 triangles; OLED 566; total 5,426; two nodes and two material slots | Seat ≤30,000; OLED ≤5,000 |
| Transfer size | 900,088 bytes (about 0.90 MB decimal) | ≤3 MB spike maximum |
| Draw calls | 2 in GLB gate and 2 in headless browser `renderer.info` | ≤4 spike maximum |
| Browser renderer totals | [Headless Chromium/SwiftShader JSON](../review/spike-2026-10-20/viewer/browser-measurement.json): 5,426 triangles, 6 textures, 14 geometries; GLB/Draco HTTP 200 | Includes procedural environment resources; no measured GPU bytes |
| Automated checks | Phase 4 [full E2E log](../review/spike-2026-10-20/viewer/e2e-full.txt): 8/8 passed; deliberate binding fault failed as expected; final-code load/capture 2/2 passed. Unit: 31/31; typecheck, lint and production build exited 0 | Technical PASS only; lint had 43 existing warnings |
| Blender renders | [Render report](../review/spike-2026-10-20/render-report.json): 5 CPU renders, 252.921 seconds combined, each under 61 seconds; consistent 24-sample AgX setup | Not a browser or phone GPU benchmark |
| Recorded work time | [Cost log](cost-log.md): Phase 3 measured windows 14m15s and about 17m; Phase 4 approximate windows 59m and 18m. Those recorded windows total about 108 minutes, excluding unmetered documentation, interruptions and idle time | Owner plan-credit usage and “comfortably in allowance” judgment unavailable |
| Real mid-range phone | No model, load time, FPS, interaction smoothness or GPU memory measurement supplied | **NOT TESTED**; owner check pending |
| Visual review | [Blank human scoring form](../review/spike-2026-10-20/review.md); known defects and [contact sheet](../review/spike-2026-10-20/contact-sheet.png) provided | **PENDING HUMAN SCORES**; no agent pass |
| Remaining scope limits | Four undefined out-of-scope material slots remain in the gate report; 13 development-dependency audit findings carried forward | Unresolved; no unrelated dependency changes in Phase 5 |

The plan's seven-criterion pass threshold (no zero from any reviewer; mean total ≥14/21) is marked **PROPOSED** in [plan section 6](plan.md). The owner must confirm it before applying it. At least two people score the seat and OLED, including the owner and an AutoLab person; an independent 3D artist is preferred. No physical owner reference photos or exact hide sample are stored in the pack.

## Decision rule copied from the existing spike plan

- **GO:** WP2 to WP5 pass for both the seat and the OLED, and the cost log shows the spike fitted comfortably in the owner's plan allowance.
- **HYBRID:** the OLED passes but the seat fails the rubric, or the seat hits its iteration cap. The next step is a human artist or a licensed asset for seats only (licence text read first).
- **NO-GO:** the environment gate fails, both components fail, or tool failures persist after the iteration caps. The next step is a human artist for the whole asset.

Decision (owner, after human scores): ______________________________

Owner name/date/signature: ______________________________________________________

Second reviewer name/date/signature: _____________________________________________

Unresolved defects and missing evidence: [review.md](../review/spike-2026-10-20/review.md). Phase 6 must not start until the owner records the human decision and required gate/decision outcomes.
