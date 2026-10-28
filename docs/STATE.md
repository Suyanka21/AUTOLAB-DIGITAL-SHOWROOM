# State — 2026-10-28

- Phase L3 Complete Lexus Showroom Integration delivered on `pre-phase-6-reconciliation`.
- Active asset: `public/assets/3d/lexus-rx350/interior-l2b.glb` (SHA-256: `c51e4db56faec8307eb6d6d25d88489cf212a935bafff0c2212c27abbcbc19d2`).
- Renders all 4 components: Driver Seat, Passenger Seat, Dashboard, and Steering Wheel (6 nodes, 12 draw calls, 76,548 tris).
- All 7 material slots bound with live reactive updates: seat primary/secondary/stitching, steering leather, dashboard trim, cockpit accent/black.
- Rollback available: previous `driver-seat-l2a.glb` and historical Mercedes spike preserved and functional.
- Camera calibration complete: all 4 presets active (`cabin_pair`, `hero_driver`, `driver_cockpit`, `seam_macro`), cockpit framing fixed.
- Customer-facing UI updated: Mercedes references replaced with 2020 Lexus RX 350 AWD, developer jargon cleaned.
- Verification: 83/83 tests PASS, TypeScript typecheck PASS, ESLint 0 errors (41 warnings), production build PASS.
- Mobile real-device test marked pending; responsive layout verified via responsive styles.
- STOP: Ready for owner review. Phase L4 and Phase L5 are NOT authorized.

