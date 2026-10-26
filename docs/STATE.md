# State — 2026-10-26

- L2A-R1 completed on `codex/phase-l2a-r1-refinement`; source commit `d7a9ee4`, based on integrated `16a5362`; local commits only.
- Asset: `public/assets/3d/lexus-rx350/driver-seat-l2a.glb`; SHA-256 `b3dc6a11a2387ceb0b97d01b15e6519f410aeebc5c1662b0a26c8f6b7090ec52`.
- Actual gate PASS: 32,412 triangles, 3 calls, 3,463,000 bytes, 2 semantic nodes, 3 unchanged material slots; Draco + six KTX2 textures.
- Broader/shorter backrest, smaller rounded headrest, revised cushion/controls, stronger microdetail and continuous front stitch returns; proportions remain estimates.
- Three-sided thread sections and KTX RDO 1.1 are disclosed tradeoffs; transfer target exceeded but unchanged hard limits pass.
- 67/67 existing tests pass; actual showroom test 1/1; typecheck, lint (41 existing warnings) and one production build pass.
- Actual browser verifies decoding, independent tints and preserved cameras; no JS errors. SwiftShader/viewport emulation only; real-phone FPS/GPU bytes unmeasured.
- Review pack: `docs/review/lexus-l2a-r1-2026-10-24/README.md`; three final renders, before/after, browser screenshots and local photo comparison.
- Production notes: `docs/3d-assets/AUTOLAB_3D_PRODUCTION_BASELINE.md`; provenance: `docs/3d-assets/provenance.lexus-l2a-r1.json`.
- Rollback: commit `16a5362`, old SHA `1a00561068f4845e9b7206a813a2e024ce13d879d898a41b05a7fc723220e8b3`; ignored local GLB copy and gate snapshot preserved.
- Remaining: hard rear shoulder edge, coarse grain on some returns/trim, provisional seam construction and headrest profile; owner visual decision pending.
- Unchanged viewer clips lower base in hero/mobile; pale swatches lose contrast; documented for separately authorized Antigravity work.
- No application code, camera presets, material catalogue or dependencies changed; 13 prior development audit findings unresolved.
- Two render-review rounds; actual timing/failures in `docs/spike/cost-log.md`; credit usage unavailable; interrupted interval excluded.
- STOP for owner visual review. L2B locked. No human gates/reference gaps closed; historical Mercedes WebP waiver unchanged and not used for Lexus.
