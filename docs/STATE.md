# State — 2026-10-27

- L2B COMPLETE; stop at owner review. Branch `pre-phase-6-reconciliation`; L3 not started.
- Owner accepted R1 provisionally and authorized L2B plus push on 2026-10-26; no photographic/production acceptance.
- R1 `d7a9ee4`/`b5a7adf` fast-forwarded and pushed before modeling; rollback history preserved.
- L2B commits: `8317af9` gate contracts; `5ecda81` source/assets/tests. Review/evidence commit follows.
- Four delivered GLBs: passenger, wheel, dashboard, combined under `public/assets/3d/lexus-rx350/`.
- Driver SHA unchanged: `b3dc6a11a2387ceb0b97d01b15e6519f410aeebc5c1662b0a26c8f6b7090ec52`.
- Combined SHA: `aec0e7cc46de950609de3a1595879175b48e30629eb8465dd9583b1a23a0f09f`; driver Draco payloads unchanged.
- Combined 77,962 triangles / 12 calls / 3,820,024 bytes / six shared KTX2 textures; four actual gates PASS.
- Four actual browser decode/tint probes PASS; six hash-matched Blender renders and contact sheet packaged.
- Full suite 80/80; final assembly 3/3; typecheck/lint/build PASS. 41 old lint warnings; 13 prior dev audit findings unresolved.
- Over-target transfer/triangles disclosed; unchanged hard limits pass. No real-phone FPS/GPU-byte measurement.
- Known visual limits: inherited seat edge/grain/seams, simplified wheel controls/hub, blank display and blocky upper dash.
- Existing cockpit camera misses wheel; calibration/integrated checks belong to separately authorized Antigravity L3.
- Handoff: `docs/3d-assets/LEXUS_L2B_HANDOFF.md`; review: `docs/review/lexus-l2b-2026-10-26/README.md`.
- All unverified reference gaps and unsigned human gates remain open; Mercedes WebP waiver not reused for Lexus.
- No full cabin, new patterns/UI, dependencies, deployment or L3 work. Push authorized; remote status confirmed at delivery.
- Cost/failed attempts recorded in `docs/spike/cost-log.md`; exact model-credit usage unavailable.
