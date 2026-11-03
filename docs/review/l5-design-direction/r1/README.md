# L5-R1 — AutoLab Interior Studio

**4 November 2026 · revised visual proposal · STOP for owner review**

The owner provisionally approved the editorial direction, not implementation. This revision keeps warm ivory, graphite, restrained cyan and the existing cabin at the centre. All new interface code is an isolated documentation prototype. Production files, dependencies, GLBs and configuration behaviour are unchanged.

## Review the experience

- [Visual board and motion storyboard](index.html).
- [Welcome](html/welcome.html), [interactive material selector](html/configurator.html), [specification reveal](html/summary.html). Open locally in a browser; layouts adapt to desktop and phone widths.
- [Typography, motion and benchmark findings](DESIGN-SPEC.md).
- [Branding audit and authentic logo provenance](BRANDING-AUDIT.md).
- [Incremental implementation and rollback](IMPLEMENTATION-PLAN.md).
- [Actual validation evidence](evidence/prototype-checks.json), [original capture record](evidence/asset-captures.json).

Optional local browser preview: run `node docs/review/l5-design-direction/r1/preview.mjs`, then open `http://127.0.0.1:3105/r1/index.html`. The read-only server exposes only this review directory tree, binds to localhost and never starts the application.

The welcome has a finite entrance, with its action available immediately. Three larger material studies replace the static list. Use arrows, keyboard arrows/Home/End or horizontal swipe to choose Classic, Diamond Quilted or Perforated. The detail photograph and recorded cabin view change together. Four camera buttons select the existing captured views. A thin progress rule and short panel entrance connect the four steps; the final reveal brings the reference and specification together.

### Prototype boundaries

These are actual browser captures of the existing model, not a second live viewer or new photography of finished upholstery. They preserve its visible dotted highlights, geometry and shading defects. Material/camera changes switch recorded images. They do not demonstrate orbit, GPU performance, live colour/thread changes or decoder recovery. Colour, thread and composition are layout studies of the captured configuration, not a reduced replacement catalogue. Production will retain every existing option.

The example reference `AL-RX-2026-PAXJ` was captured from the working app. Its internal prefix is preserved. The prototype passes the selected treatment between pages, but reuses this fixed example code; it is not a customer save system. Copy provides success or a selectable-text fallback. Spec Sheet opens an accessible native dialog with print action. WhatsApp is disabled because this prototype has no configured concierge number; it cannot send messages. Later implementation preserves the existing code generator, copy action, specification fields and validated WhatsApp URL construction, while replacing customer-facing manufacturer copy.

The original PDF logo is retained, with a faithful cropped PNG derivative. It is not a reconstructed emblem. The wheel's raised manufacturer mark remains visible and is separately identified in the audit; removal requires owner authorization for geometry work.

## Owner checklist

- [ ] Authentic AutoLab identity, welcome and Studio/Showroom naming feel right.
- [ ] Large material studies and three-treatment carousel make comparison easier.
- [ ] Desktop stage and mobile vertical rhythm give the cabin enough prominence.
- [ ] Welcome, selection and final reveal motion feel considered; reduced motion is equally usable.
- [ ] Approve the typography direction; any new webfont download requires separate authorization.
- [ ] Approve the presentation slices and branding replacements before implementation.
- [ ] Decide separately whether the embedded steering-wheel emblem should be removed in a future geometry task.

No model fidelity, human gate, catalogue approval or real-phone performance acceptance is implied. Existing human gates/reference gaps and 13 development-dependency audit findings remain open. No L5 presentation slice has begun.
