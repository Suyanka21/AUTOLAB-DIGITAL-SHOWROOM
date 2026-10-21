# State — 2026-10-21

- Done: Phase 3 actual two-node Blender asset, gate evidence, repeatability, provenance and five labelled CPU renders; stopped at review checkpoint.
- Branch: `phase-3-spike-asset`, based on approved `9089f25`; asset/tooling source commit `964db795ee09299cc16d9ba32cce0f153019220c`.
- Deliverable: `public/assets/3d/s-class-v223/spike.glb`; SHA-256 `36a107f152039a464d4a4dd7786794f66ea40628b5c97ad2d8083964ad1b458e`.
- Scope: only `GEO_Seat_Front_Driver_Flutes` / `MAT_Upholstery_Primary` and `GEO_Dashboard_Screen_Central_OLED` / `MAT_Screen_Central_OLED`; D1 undecided, stitching absent.
- Gate: real spike exit 0; 5,426 triangles, 2 primitives, 900,088 bytes; active display diagonal 325.1063mm. Two clean builds yielded identical counts and GLB hashes.
- Validation: 31 tests passed; typecheck/build exit 0; lint exit 0 with 43 existing warnings. Initial export failure, test timeouts and fixes logged.
- Tooling: Blender 5.2.2 LTS/headless Python 3.13.13; `toktx` missing. Owner-approved lossless WebP waiver `P3-WEBP-2026-10-20`; no KTX2 production compliance.
- Evidence: `docs/spike/phase-3-report.md`, `docs/review/spike-2026-10-20/README.md`, `docs/3d-assets/provenance.json`, `docs/spike/cost-log.md`.
- Limits: provisional seat dimensions/flute depth, screen inclination/bezel; sharp grooves, shading artifacts and simplified controls documented. Exact AutoLab materials pending injection.
- Owner approvals: two-node plan/D10 approved 2026-10-20; manufacturer/published-reference research allowed. D4 approved; no scope expansion.
- Open: GAP-01 through GAP-04 and all human gates including GATE-01/08/11. No visual score or production acceptance; 13 development audit findings unresolved; four undefined manifest slots preserved.
- Performance: CPU render times recorded; GPU/FPS/phone/browser-viewer metrics NOT TESTED. Overnight pause excluded from active compute claims; usage percentage unavailable.
- Next: wait for owner review/checkpoint direction; Phase 4 viewer and full-cabin modelling have NOT begun. Local commits only; no push, PR or deployment.
