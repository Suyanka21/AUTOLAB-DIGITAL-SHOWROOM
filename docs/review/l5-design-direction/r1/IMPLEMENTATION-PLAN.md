# Incremental presentation plan — not authorized to start

R1 supersedes the earlier L5 typography, logo and static-selector recommendations. It does not replace the accepted L4 runtime. The owner first reviews [the visual board](index.html), including motion and the local-font limitation. No implementation flag, runtime dependency or production route is introduced in this proposal.

| Slice after approval | Narrow change | Required evidence | Rollback boundary |
|---|---|---|---|
| 1. Identity and tokens | Faithful logo derivative in public brand directory, approved font strategy, shared colour/spacing tokens; listed customer text and metadata | Branding audit, logo ratio, accessible labels/contrast, all configuration/handoff tests | Revert identity/copy commit; no state schema or decoder changes |
| 2. Welcome | Immediate entrance, authentic brand, direct entry | Desktop/mobile screenshots, reduced motion, keyboard, direct showroom route remains available | Revert welcome presentation only |
| 3. Workbench shell | Ivory selection rail/graphite stage, camera control presentation | Viewer stays mounted; four original camera coordinates/orbit limits identical; retry/context-loss checks | Revert shell/styles; retain original viewer and loaders |
| 4. Material carousel and journey | Three existing treatment controls, larger detail imagery, four-step transitions | Keyboard/swipe/scroll, rapid selection, texture readiness, all seven bindings, prior choices survive every step; real phone testing | Revert selector/navigation presentation; same state/store and material logic |
| 5. Specification reveal | Editorial field grouping, copy/Spec Sheet/WhatsApp labels | Generated reference unchanged, conditional fields, copy failure, disabled contact state, encoded handoff | Revert summary presentation; no code generation/storage migration |

Use one local commit per slice; no unrelated upgrades. Full relevant test suite, typecheck, lint and production build at the agreed integration gate, with targeted checks within each slice. Capture actual desktop and real-phone behaviour before claiming responsiveness/performance acceptance. Compare measured frame timing and loading/recovery to the accepted L4 baseline on the same device; do not substitute image-prototype timing for renderer measurements. If fonts are approved later, retain OFL notices, review actual text reflow and avoid remote font requests.

## Preserve unchanged

- Existing production GLBs, geometry, textures and KTX2/Draco recovery lifecycle.
- Seven material bindings: `MAT_Seat_Primary`, `MAT_Seat_Secondary`, `MAT_Seat_Stitching`, `MAT_Steering_Leather`, `MAT_Dashboard_Trim`, `MAT_Cockpit_Accent`, `MAT_Cockpit_Black`.
- Classic, Diamond Quilted, Perforated; original material/colour/thread/composition options and selected state.
- Four original cameras, their coordinates, orbit limits and the single existing R3F canvas; demand rendering and current DPR bounds.
- Material → Colour → Accent Thread → Composition, retained selections across steps.
- Real configuration-code generation, copy action, Spec Sheet fields and WhatsApp semantics/number validation.
- Loading/error/fallback/Retry behaviour, cache eviction, worker ownership and context-loss recovery.
- Technical filenames, internal identifiers, routes unless explicitly approved, provenance notes and tests.

The carousel never creates another renderer or loads a second live GLB just to make a card. Prefer already available/approved detail imagery and the existing stage. Welcome uses CSS movement; no third-party shader, liquid-logo or liquid-glass package is recommended. Glass is optional styling, not a dependency requirement.

Human gates and existing visual/model defects remain open. Embedded emblem removal is a separate geometry decision, not part of any presentation slice. No push, deployment, new catalogue features or model rebuild is authorized by this plan.
