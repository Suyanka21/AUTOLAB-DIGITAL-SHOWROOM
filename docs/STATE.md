# State — 2026-10-23

- Phase L2A candidate delivered on `phase-l2a-driver-seat`, based on `26b8c4b`; asset/source commit `da489f2`.
- Actual asset: `public/assets/3d/lexus-rx350/driver-seat-l2a.glb`; one driver seat, separate stitching, three approved slots.
- SHA-256: `1a00561068f4845e9b7206a813a2e024ce13d879d898a41b05a7fc723220e8b3`.
- Actual gate PASS: 34,560 triangles, 3 calls, 3,244,632 bytes; transfer target exceeded, hard L2A limits pass.
- Owner permitted KTX-Software installation; 4.4.2 installed. Six embedded KTX2 textures + Draco; no Lexus WebP waiver.
- Chromium/SwiftShader decoded the actual asset; all three recolours changed pixels independently; no JS/request errors. ReadPixels warnings retained.
- Tests 66/66; typecheck, lint and production build exit 0; 41 existing lint warnings; 13 development audit findings unresolved.
- Three review rounds used; final renders, source/provenance, approximation notes and blank owner form: `docs/review/lexus-l2a-2026-10-23/README.md`.
- Internal photo sheet: `AUTOLAB_LEXUS_SEAT_REFERENCE_PACK/L2A_REVIEW/contact-sheet.png` (local only, not bundled or committed).
- Remaining visual issues: broad moulded-looking highlights, angular shoulders/crown, blocky base/controls, crowded seam junctions and regular pore pattern.
- All dimensions/microdetail are estimates. No physical-hide colour verification, real-phone metrics or measured GPU memory.
- Repeat build counts/dimensions match; compressed raw bytes differ. Generated `.blend` and intermediates remain in `blender/out/lexus-l2a/`.
- Application/viewer/dependencies and Mercedes geometry/history/gates/gaps/WebP waiver are unchanged; L3 integration is not done.
- STOP: owner must review/approve or request revisions. L2B and later phases have NOT begun; technical PASS is not visual acceptance.
