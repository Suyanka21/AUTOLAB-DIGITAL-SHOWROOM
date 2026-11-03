# L5 implementation slices — pending owner approval

No slice below has begun. Each is a separate local commit, reviewed before the next. Baseline is `ff9dabf`; preserve L4's technical behaviour. Rollback means reverting only the relevant L5 presentation commit, never replacing assets or resetting configuration data. No extra planning framework or architecture migration is proposed.

## 1. Approved shell around the existing stage

**Depends on:** owner approval of this visual proposal.

**Scope:** `src/app/page.tsx`, `AtelierHeader.tsx`, new narrowly scoped showroom stylesheet (S/M, ≤3 files). Introduce approved tokens and desktop/mobile framing. Do not change global auth/dashboard styling or `SpikeViewer.tsx`.

**Acceptance:** existing provider and viewer mount remain stable; all route entry paths remain usable; no GLB/decoder/configuration change.

**Verify:** typecheck, targeted layout lint/tests, browser at 320/390/768/1024/1440px, model load/network smoke and before/after renderer counts with identical choices. No duplicate canvas or requests during resize.

**Rollback:** revert this shell commit; old layout and header return, viewer/state remain the accepted L4 version.

## 2. Four-step selection presentation

**Depends on:** slice 1.

**Scope:** `ConfigurationDrawer.tsx`, scoped stylesheet, relevant existing browser test (M, ≤3 files). Restructure controls visually without changing catalogue IDs, filters, context API or option availability. Keep the existing four-step order and all options.

**Acceptance:** keyboard and touch can complete every step; selected values persist between steps; all seven slots and three treatments continue updating correctly, including Diamond thread and secondary hide.

**Verify:** targeted configuration/material tests, browser treatment/colour/thread/composition loop, 200% zoom and focus/selection announcements. Record actual pointer/touch results on real phone when available; otherwise mark NOT TESTED.

**Rollback:** revert this presentation commit; keep approved outer shell. No state migration or data rollback needed.

## 3. Summary and concierge presentation

**Depends on:** slice 2.

**Scope:** `SummaryBar.tsx`, scoped stylesheet, summary/WhatsApp browser tests (M, ≤3 files). Add the approved readable summary, preserve reference generation and the existing message payload. Retain Copy Code and Spec Sheet, even though the static proposal does not simulate them.

**Acceptance:** exact configuration values/code survive editing; unavailable WhatsApp remains disabled; valid handoff URL/payload are unchanged and nothing sends automatically.

**Verify:** code-copy and failure feedback, modal focus/return, spec sheet, disabled-number case and configured URL inspection without sending. Typecheck and targeted lint/tests.

**Rollback:** revert this summary commit; prior persistent summary returns without changing the configuration.

## 4. Welcome presentation and restrained motion

**Depends on:** slice 1; final layout confirmation from slices 2–3.

**Scope:** `src/app/splash/page.tsx`, scoped stylesheet and welcome browser test (M, ≤3 files). Replace starter-facing presentation for showroom entry only. Keep direct `/` access and existing auth/dashboard routes. No forced animation or new authentication gate.

**Acceptance:** clear route into showroom; truthful loading; reduced-motion and no-WebGL still usable. Keep the welcome static unless the owner explicitly selects the proposed subtle wash. No external shader library or copied liquid-logo code.

**Verify:** route links, keyboard, reduced motion and hidden-tab behaviour. Any approved original CSS motion stops before entering the live viewer. No new live 3D thumbnail.

**Rollback:** revert welcome presentation/motion independently; configurator stays intact. Aesthetic motion can be removed without removing entry functionality.

## 5. Cross-device acceptance and final local handoff

**Depends on:** slices 1–4; each preceding gate passed.

**Scope:** browser tests and review evidence only (small source scope). Optional limited CSS translucency on the camera dock is a separate, revertible styling change only if contrast and device checks support it; default opaque fallback is acceptable.

**Acceptance:** unchanged GLB/KTX2 hashes, seven bindings, three treatments, four cameras and handoff semantics; no additional WebGL contexts, changed viewer budgets or new permanent animation loop; owner reviews final visuals.

**Verify:** full relevant suite once at final checkpoint, typecheck, lint, production build and four asset gates; capture errors, decoder requests, rendered counters and treatment switching. Compare like-for-like device/camera/treatment timing samples; report real hardware/browser and measurement method. Do not turn software-renderer results into phone claims. No fixed FPS improvement is promised.

**Rollback:** revert the independent dock/motion styling first if it regresses; revert later presentation commits in reverse order only as needed. Keep L4 assets/runtime intact throughout. No push/deployment without fresh authorization; no human gate signed by the agent.
