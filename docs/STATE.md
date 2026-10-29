# State — 2026-10-29

- L4 Stage A material feasibility delivered on existing `pre-phase-6-reconciliation`; experiments commit `30b16db`, review evidence committed separately.
- Owner verified L3 `eee8f80` and authorized L4 Stage A only; STOP for approval of Classic, Diamond and Perforated samples before Stage B.
- Review/downloads: `docs/review/lexus-l4a-2026-10-29/README.md`; unsigned owner form `review.md`; integration contract `docs/3d-assets/LEXUS_L4A_INTEGRATION_HANDOFF.md`.
- Three isolated GLBs in `experiments/lexus-l4a/`; 32,412 triangles / 3 calls each; 2,584,928 / 2,904,532 / 2,925,708 bytes, below 3.5 MB hard cap but above 2.5 MB target.
- Original compressed geometry, UVs, transforms and material definitions preserved; no application, dependency, cockpit or production asset changes.
- Active assembly SHA-256 `c51e4db56faec8307eb6d6d25d88489cf212a935bafff0c2212c27abbcbc19d2`: 6 nodes / 7 bindings / 76,548 triangles / 12 calls, L3 cameras retained.
- Actual KTX2/Draco gates and Chromium/SwiftShader tint probes PASS; final six Cycles previews and normal/macro comparison sheet linked to exact hashes.
- Validation: 87/87 Vitest + 5/5 Python tests PASS; typecheck PASS; lint 0 errors / 41 existing warnings; one production build PASS.
- Quilt thread uses an isolated optional WebGL ORM-alpha hook; application treatment selector/lifecycle integration remains Stage B work.
- Open defects: nonuniform primary UV scale, 153 secondary zero-area UV triangles/seat, quilt grid crossing/clipping existing seams, subtle grain and provisional silhouette/physical parameters.
- Real-phone FPS/GPU bytes unmeasured; complete-scene material transfer/memory figures are estimates. Prior 13 development audit findings unresolved.
- Human gates/reference gaps remain open; no workshop/OEM material authenticity or visual approval claimed; no Nano Banana, external textures or new software used.
- Two texture/render rounds; corrected saved-image orientation regression; cost/attempt records in `docs/spike/cost-log.md`.
- Next: owner reviews three prototypes and signs any Stage B selection. No Stage B, L5, push, PR or deployment performed.

