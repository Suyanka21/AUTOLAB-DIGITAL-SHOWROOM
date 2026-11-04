# L5 production UI integration — local owner review

Owner instruction: approved L5-R1 for the initial commercial mock-up; integrate into the working app. Baseline `8fd1693`, working branch `codex/l5-r1-design-refinement` retained as requested. This supersedes R1's implementation hold, not any unrelated human gate.

## Scope and existing plan

Follow [R1's incremental plan](../l5-design-direction/r1/IMPLEMENTATION-PLAN.md): (1) brand/welcome, (2) live stage/shell, (3) treatment slider and four-step controls, (4) camera/responsive checks, (5) summary/concierge, (6) final regression evidence. Revert presentation commits in reverse order for rollback. No new design exploration, dependency, font download, deployment or geometry work.

Source compositions: [R1 board](../l5-design-direction/r1/index.html), [configurator](../l5-design-direction/r1/html/configurator.html), [welcome](../l5-design-direction/r1/html/welcome.html), [summary](../l5-design-direction/r1/html/summary.html), [validation](../l5-design-direction/r1/VALIDATION.md).

Preserve the three treatment GLBs, seven bindings, KTX2/Draco lifecycle, diamond thread shader, four camera coordinates/orbit limits, configuration defaults/reference generator, existing WhatsApp payload, Spec Sheet/copy, fallback and Retry. Sienna Brown stays the default. No seat/cockpit/console/lighting/texture refinement. The existing geometric wheel mark remains untouched.

**Scope clarification:** the newest instruction explicitly preserves the WhatsApp payload. Its existing manufacturer line therefore remains byte-for-byte in handoff construction, superseding R1's proposed future copy replacement there. Customer chrome/metadata use AutoLab. The Windows system-font stack from R1 is retained with its documented cross-platform fallbacks; proposed OFL fonts are not downloaded.

## Incremental evidence

- Welcome test RED: old `/splash` returned “Suyanka App” instead of approved editorial heading. Test then covers immediate `/` entry, no extra canvas, authentic logo and reduced motion.
- Typecheck found an ES2018 regex flag in the new test; replaced with an ES5-compatible expression. Typecheck then exited 0.
- Local test orchestration encountered a managed-server port cleanup delay, followed by connection-refused checks when the process was stopped/interrupted. Switched to an explicit Next dev server with `NEXT_PUBLIC_E2E=1` and external-server Playwright runs. These are environment/test-startup failures, not passes.

Final results, screenshots, recording, hashes and limitations will be appended after actual application verification.
