# Owner visual review — PROVISIONAL V223 two-node spike

**Status: PENDING HUMAN SCORES. This form contains no visual score, approval or signature.** GATE-01, GATE-08 and GATE-11 remain open. GAP-01 through GAP-04 remain open. The WebP waiver `P3-WEBP-2026-10-20` covers feasibility only; KTX2 production compliance has not been shown.

Review [the comparison sheet](contact-sheet.png) at full size, then inspect the [original Blender renders](README.md) and [browser screenshots](viewer/README.md). Blender and browser cameras/lighting differ, so compare the same component rather than assuming pixel alignment. No owner physical vehicle or hide photographs are stored in this repository. Existing approved published context: [Mercedes-Benz S-Class interior release](https://media.mbusa.com/news/meet-the-s-class-digital-luxury-well-being), [official OLED photograph](https://media.mbusa.com/storage/media/thumbnails/cwAppkWu4lKtQz39OkF9pNi6eIljJxoi28eogyHf_thumb.jpg); these are perspective references, not physical measurements or exact AutoLab material samples. [Provenance](../../3d-assets/provenance.json) distinguishes published facts from estimates.

The visual-review skill suggests stitching and steering-wheel close-ups in a full asset review. Those nodes are outside this approved two-node spike, so this pack includes the available seat-detail close-up and no invented stitching or steering view.

## Scoring protocol for human reviewers

The seven criteria below come from [plan section 6](../../spike/plan.md). Score each component **0 to 3** per criterion, independently. The plan's threshold remains **PROPOSED and unconfirmed**: no criterion scored 0 by any reviewer, and mean total at least 14/21. The owner must confirm the threshold before applying it. At least two people review: the owner and an AutoLab person; an independent 3D artist is preferred. Leave any item unscored if evidence is insufficient, noting what is missing. A technical asset-gate PASS does not count as a visual score.

| Criterion (0–3) | Reviewer 1: seat | Reviewer 1: OLED | Reviewer 2: seat | Reviewer 2: OLED |
| --- | --- | --- | --- | --- |
| Recognisability as the target S-Class |  |  |  |  |
| Proportion |  |  |  |  |
| Surface quality: leather reads as leather; curves avoid faceting |  |  |  |  |
| Shading artifacts: seams, z-fighting, normal errors |  |  |  |  |
| Material plausibility against the physical hide photo |  |  |  |  |
| Detail legibility at preset distance |  |  |  |  |
| Overall luxury impression |  |  |  |  |
| **Total /21** |  |  |  |  |

Reviewer 1 name/role: ______________________________  Date: ______________

Reviewer 1 signature: ______________________________

Reviewer 2 name/role: ______________________________  Date: ______________

Reviewer 2 signature: ______________________________

Optional independent artist name/role: ______________________________  Date: ______________

Optional independent artist signature: ______________________________

Threshold confirmed by owner (name/date): ______________________________

## Known defects to inspect (agent observations; no ratings)

- **Seat shading and flute depth:** sharp groove ends, baked shading patches, polygonal highlights and a smooth synthetic grain in [Blender seat front](02-seat-front.png), [Blender detail](03-seat-detail.png), [browser seat front](viewer/desktop-seat-front.png) and [browser detail](viewer/desktop-seat-detail.png). Flute depth is provisional; GAP-01 remains open.
- **Seat junction and silhouette:** straight central-insert edges and visible separation between back and base in [Blender overview](01-overview.png), [Blender seat front](02-seat-front.png) and [browser overview](viewer/desktop-overview.png). This is not a complete seat with bolsters, rails or stitching; D1 remains undecided. No verified seat-fit measurement exists.
- **OLED appearance:** broad face reflections, hard bezel highlights, a mostly blank non-emissive face, bright simplified lower strip, and absent button/roller/recess detail in [Blender OLED front](04-oled-front.png), [Blender profile](05-oled-profile.png), [browser OLED front](viewer/desktop-oled-front.png) and [browser profile](viewer/desktop-oled-profile.png). Housing thickness and inclination are provisional; GAP-03 and GAP-04 remain open.
- **Reference limits:** exact AutoLab hide color/grain and physical sample photo are pending. The approved pack's eight-flute layout was retained for the spike but was not independently confirmed as universal for Standard Nappa. GAP-02 concerns a later neck-pillow interface outside this two-node slice and remains open.

## Owner review checklist (record observations; no preset answer)

- [ ] **Visual fidelity:** confirm target V223 LWB reference vehicle and obtain physical seat, OLED and hide photos/measurements needed for GATE-01 and GATE-11; inspect each defect above and score the two components separately.
- [ ] **Desktop interaction:** on a named desktop browser, try all five presets, bounded orbit controls, seat color swatch and the visible loading/error fallback; record browser/version and any interaction issue: ______________________________
- [ ] **Real phone performance:** on a named mid-range phone, record model/browser, network condition, GLB load time and whether orbit/swatch interaction stays smooth; note heat or context loss if observed. Model/browser/network: __________________  Load time: __________  Smoothness/issue: __________________
- [ ] **Decision:** confirm or revise the proposed scoring threshold in writing, obtain at least two human reviews, then record GO/HYBRID/NO-GO in [decision.md](../../spike/decision.md). Leave GATE-08 open until human sign-off.

Review notes / missing evidence: ______________________________________________________________________________

____________________________________________________________________________________________________________
