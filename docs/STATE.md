# State — 2026-10-22

- Pivot Approved: Flagship vehicle is now 2020 Lexus RX 350 AWD; inspiration carseatcover.eu; Mercedes-Benz S-Class V223 cabin retired.
- Locked Scope: Two front seats, steering wheel, dashboard cowl; customisable upholstery, colours, contrast stitching; no full cabin.
- Preserved: Next 16 / React 19 app shell, R3F viewer, RoomEnvironment PMREM lighting, 4-step config flow, test suite (31/31 pass).
- Reference: AUTOLAB_LEXUS_SEAT_REFERENCE_PACK/ (35 Herb Chambers photos, atlas, recommendations) integrated; untracked in git.
- Strategy: Hybrid approach (interactive 3D front seats + lightweight cockpit touchpoints + bounded photographic camera presets).
- Deliverables Created: AUTOLAB_PIVOT_DECISION_RECORD.md, REPOSITORY_REUSE_AND_CLEANUP_AUDIT.md, LEXUS_DEMO_SCOPE_AND_ARCHITECTURE.md, LEXUS_IMPLEMENTATION_PLAN.md, ASTRA_LEXUS_HANDOFF.md.
- Budgets: Cumulative triangles <=45,000 (hard ceiling 80,000); draw calls <=6; file size <=2.5 MB; texture memory <=24 MB.
- Gates Open: Human review and gates GATE-01, GATE-08, GATE-11 transition to Lexus RX 350; no 3D modeling started.
- Health: Vitest 31/31 passed, typecheck passed, lint passed with 0 errors. App functional on local dev.
- Next: Owner authorization of Phase L0/L1 and Astra High prompt in ASTRA_LEXUS_HANDOFF.md. Local commit only; no push/deploy.


