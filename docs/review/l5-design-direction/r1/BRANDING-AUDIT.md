# Authentic identity and customer-facing branding audit

## Authentic logo

Original: `public/AUTOLAB LOGO .pdf`, retained unchanged. SHA256: `859a9be18dc3cac79f5311791b9db008478871d854c639806f2bb13da728dd76`.

One A4 PDF page contains vector paths/text, a white/cyan A emblem and AUTO LAB wordmark with TM on charcoal. `pdfinfo` identifies Illustrator-origin PDF 1.6; that metadata is provenance, not a new trademark/legal clearance claim. No invented emblem is used.

Commands actually used:

```powershell
pdftoppm -f 1 -singlefile -scale-to 1800 -png 'public/AUTOLAB LOGO .pdf' docs/review/l5-design-direction/r1/evidence/logo-original
pdftoppm -f 1 -singlefile -r 144 -x 120 -y 280 -W 1000 -H 810 -png 'public/AUTOLAB LOGO .pdf' docs/review/l5-design-direction/r1/assets/autolab-logo
```

Both exited 0. The derivative is a crop at uniform resolution, not a redraw: unchanged white/cyan/charcoal, complete emblem/wordmark/TM, natural 1000:810 ratio. Dominant raster colours are `#FFFFFF`, `#72C4E1`, `#231F20`; these are Poppler-rendered values, not an invented brand manual. CSS scales the entire image proportionally. [Original full-page rendering](evidence/logo-original.png), [faithful derivative](assets/autolab-logo.png).

## Proposed replacement register — production NOT edited

The explicit prohibition on modifying the live application controls this phase. All new proposal headings, navigation, titles and specification copy use AutoLab. The following read-only audit identifies the later presentation changes; it does not claim they are already removed from production.

| Existing location | Current exposure | Required later replacement |
|---|---|---|
| `src/app/layout.tsx` | Manufacturer/model in metadata title/description | AutoLab Interior Studio; AutoLab Digital Showroom description |
| `src/app/page.tsx` | Model in main heading/demo copy | Customer-oriented AutoLab interior wording |
| `src/components/layout/AtelierHeader.tsx` | Conditional manufacturer title | AutoLab Interior Studio |
| `src/components/configurator/ConfigurationDrawer.tsx` | Vehicle scope warning | Retain truthful availability limitation with neutral customer copy |
| `VisualizationStage.tsx` | Vehicle/wheelbase labels, DOM overlay and `LEXUS ATELIER` SVG fallback | AutoLab fallback/title; keep diagnostics internal |
| `SpikeViewer.tsx` | Vehicle loading and accessible canvas labels; possible surfaced internal error text | AutoLab preview labels; actionable neutral error message and retained diagnostic detail |
| `SummaryBar.tsx` | Manufacturer in Spec Sheet | AutoLab specification header |
| `src/lib/state/configurator-context.tsx` | WhatsApp vehicle line | AutoLab consultation wording; same reference and specification fields |
| `src/app/splash/page.tsx` | Suyanka heading; artificial agent-loading copy | Authentic welcome, immediate entry, no fake progress |
| `src/app/auth/page.tsx` | Suyanka title and email placeholders | AutoLab labels and neutral example; no auth redesign |
| `src/app/dashboard/page.tsx` | Suyanka title | AutoLab title |
| `src/components/layout/navbar.tsx`, `footer.tsx` | Starter brand and starter repository link | AutoLab customer labels/footer; no invented business claims |
| `src/lib/auth/auth-context.tsx` | Demo display identity/email | Neutral AutoLab demo identity; preserve internal storage key |

Search terms: `Lexus|Mercedes|Suyanka|RX 350|S-Class`. Source references in material catalogue notes, technical manifests/IDs, assets, tests and internal errors are not customer marketing and must not be globally renamed. In particular preserve `suyanka_auth_user` unless a separately authorized storage migration is needed. Keep GLB filenames, model IDs, camera IDs, seven `MAT_*` bindings and the `AL-RX-2026-…` generated reference format unchanged. Historical review evidence retains its original text for traceability.

### WhatsApp wording intent

Heading: **AutoLab Interior Studio — Consultation Request**. Keep reference, primary leather, upholstery treatment, interior composition, conditional secondary accent, trim deck, accent thread and ambient illumination, plus a request for an AutoLab consultation. Remove the manufacturer/model vehicle line. Preserve encoded message construction, recipient-number validation, disabled/unconfigured behaviour and user-initiated handoff. No contact details are invented. This intentionally changes brand wording later; it does not change the customer choices or claim byte-identical message text.

## Embedded asset mark — separate owner decision

The raised oval and L on the steering-wheel hub are visible in [the unchanged cockpit capture](assets/classic-driver_cockpit.png). `blender/lexus_l2b_cockpit.py` lines 161–164 explicitly author `Lexus oval emblem` and `Raised Lexus L`. This confirms an identifying geometric mark, not just a text overlay. It remains in all relevant proposal captures. No geometry, material or texture was removed, masked or regenerated. Removal is outside this task and requires explicit owner authorization. The inspection does not certify the absence of every mark on all hidden surfaces.
