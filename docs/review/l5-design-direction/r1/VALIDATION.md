# R1 validation and limits

Local date 4 November 2026, Africa/Nairobi. JSON timestamps use UTC (3 November late evening for these runs). Browser: Chromium 156.0.8078.4.

| Command | Actual result / evidence |
|---|---|
| `node docs/review/l5-design-direction/r1/capture-assets.mjs` | Exit 0, 12 treatment/camera captures from unchanged existing production build, no page exceptions. [Capture record](evidence/asset-captures.json). SwiftShader software rendering; not GPU/device acceptance. |
| `node docs/review/l5-design-direction/r1/build.mjs` | Exit 0, three responsive HTML screens plus manifest. Documentation only; not a production build. |
| `node docs/review/l5-design-direction/r1/verify.mjs` | Final exit 0, seven check groups, zero errors. [Actual output](evidence/prototype-checks.json). Six desktop/mobile screenshots; keyboard, endpoints, rapid treatment/camera changes, four steps, modal/Escape, copy feedback, unavailable WhatsApp, swipe direction, 320px welcome and reduced motion. |
| `node docs/review/l5-design-direction/r1/capture-motion.mjs` | Exit 0, ten storyboard frames and actual WebM browser recording. Perforated selection reaches summary; no page exceptions. [Capture record](evidence/motion-capture.json). |
| `node docs/review/l5-design-direction/r1/build-board.mjs` | Exit 0, visual review board with ten actual storyboard frames. |
| `node docs/review/l5-design-direction/r1/check-consistency.mjs` | Exit 0: [actual consistency output](evidence/consistency.json), valid documentation links, no out-of-scope changes, original PDF/four GLBs unchanged, text contrasts 13.59 / 5.40 / 6.87 / 9.62, both installed fonts present and STATE 19 lines. |
| `node --check docs/review/l5-design-direction/r1/js/app.js` and `node --check docs/review/l5-design-direction/r1/preview.mjs` | Exit 0 for both syntax checks. |
| `git diff --check` | Final exit 0; a trailing blank line in the historical plan notice was removed after the first whitespace check. |

The localhost review board also opened successfully in the Codex in-app browser. A read-only video-element inspection reported duration **14.6 seconds**, `readyState: 4`, and `error: null` for the generated WebM. This confirms media availability, not rendering performance. The preview server is restricted to GET/HEAD requests in the review directory tree on `127.0.0.1:3105`.

## Failures retained, not hidden

The first test invocation failed because the new configurator file did not yet exist: [red evidence](evidence/prototype-red.json). The first implemented run found decorative camera numbers included in accessible button names; the second found the Spec Sheet arrow included in its name. Both were corrected by hiding decorative glyphs from accessibility names. The third reached all six layout captures but failed the synthetic swipe: the test event omitted `isPrimary:true`, while the implementation correctly ignored non-primary pointers. The test was corrected to model a primary gesture; no multi-touch guard was removed. [Attempt 1](evidence/prototype-attempt-1.json), [attempt 2](evidence/prototype-attempt-2.json), [attempt 3](evidence/prototype-attempt-3.json). These were distinct failures, not repeated blind retries.

Full-page screenshots were inspected. A second visual pass enlarged camera/treatment labels to 12px and arranged phone camera choices in two columns. The summary now uses the clearer driver view rather than a dashboard-dominated cabin crop. Images remain unretouched; no model defect is concealed by geometry changes. Local typography is visibly rendered in the captures; the separate suggested OFL webfonts were not downloaded.

## Not tested / not claimed

- Real-phone touch, GPU cost, live 3D frame timings, decoder recovery, WebGL context loss and full WCAG conformance. The prototype uses images and has no canvas.
- Cross-platform rendering of the installed Windows fonts. CSS fallbacks may change line breaks on other machines.
- Delivery of WhatsApp messages, configured contact availability or creation/saving of a new customer configuration. All are outside this isolated design artifact.
- Production lint, typecheck, test suite and build were not repeated for a documentation-only proposal. Accepted L4 evidence remains historical; it is not a new R1 run.
- The image-retry panel includes a timeout and retains selection, but forced image-network failure was not exercised in this run. Production Retry remains untouched.
- Human aesthetic approval, geometry acceptance and production/catalogue gates remain open.

## Self-review

Authentic identity and proposed customer copy are separated from technical identifiers. All new customer screenshots are AutoLab-branded; the raised wheel emblem is disclosed in the audit. Selection is conveyed with text, radio state and a counter, not cyan alone. Reduced motion and immediate entry avoid a forced cinematic wait. No third-party benchmark material, font file, source effect or dependency entered the repository. The material images are explicitly recorded renderer views, including known surface defects, rather than claims of finished workshop leather.
