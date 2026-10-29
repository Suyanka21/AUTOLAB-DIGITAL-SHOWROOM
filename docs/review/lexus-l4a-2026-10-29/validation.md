# L4A actual validation â€” 2026-10-29

Technical checks pass for the isolated prototypes. Visual acceptance remains unsigned. The unchanged application was tested and built, but no Stage B runtime integration is claimed.

## Commands and observed results

Captured logs retain command content; trailing spaces and surplus final blank lines are normalized for Git. Run from the repository root. Full reproduction commands, including installed executable paths, are in the [handoff](../../3d-assets/LEXUS_L4A_INTEGRATION_HANDOFF.md).

| Command / operation | Actual result | Evidence |
| --- | --- | --- |
| `node tools/inspect-lexus-l4-uv.mjs` | Decoded both actual seats; primary UV nonuniformity and 153 secondary zero-area UV triangles per seat recorded | [UV report](evidence/uv-audit.json) |
| Blender headless `--python tests/test_lexus_l4_materials.py` | Exit 0; 3/3 tests, .285s in final run | [Output](evidence/materials-final.txt) |
| Blender headless `--python blender/lexus_l4_materials.py` | Nine coordinated procedural maps generated; corrected image storage orientation | [Output](evidence/texture-build.txt) |
| `node scripts/finalize-lexus-l4a.mjs` | Three experimental KTX2/Draco GLBs; all nine texture encodes, KTX validations and extracts successful | [Output](evidence/finalize.txt), [report](evidence/finalize.json) |
| `C:\Python312\python.exe tests/test_lexus_l4_saved_images.py` | Exit 0; 2/2 tests, 19.543s: saved PNG gradient/mask orientation and decoded KTX mask coverage | [Output](evidence/saved-images-final.txt) |
| `node scripts/validate-glb.mjs --scope lexus-l2a --asset experiments/lexus-l4a/<kind>.glb --report docs/review/lexus-l4a-2026-10-29/evidence/<kind>-gate.json` for all three kinds | All exits 0; hard limits and slot checks pass, exact SHA-256 pinned | [Exit codes](evidence/gate-browser-exits.txt), [Classic](evidence/classic-gate.json), [Diamond](evidence/diamond-gate.json), [Perforated](evidence/perforated-gate.json) |
| `node tools/verify-lexus-l4a.mjs` | Exit 0; real Chromium/SwiftShader decoding and tint checks; no JS/request errors | [Browser report](evidence/browser.json), [output](evidence/browser-run.txt) |
| Blender headless `--python blender/render_lexus_l4a.py -- <kind>` for all three kinds | All exits 0; six final normal/macro PNGs, current GLB/proxy hashes recorded | [Exit codes](evidence/render-exits.txt), per-sample render JSON/text logs |
| `C:\Python312\python.exe tools/package-lexus-l4a-review.py` | Exit 0; asserts asset/gate/browser/render hashes and configured render settings, builds comparisons | [Delivery index](delivery-index.json) |
| `npm test` | Exit 0; **87/87 tests, 8/8 files**, 32.04s | [Full output](evidence/full-tests.txt) |
| `npm run typecheck` | Exit 0 | [Output](evidence/typecheck-final.txt) |
| `npm run lint` | Exit 0; **0 errors / 41 existing warnings** | [Output](evidence/lint-final.txt) |
| `npm run build` | Exit 0; Next16.4.2 compile26.5s, TypeScript21.6s, six static pages generated | [Output](evidence/build-final.txt) |
| Final read-only GLB/hash/Git comparison | Exact original Draco payloads and geometry/material metadata preserved; protected application/public/dependency paths unchanged from `eee8f80`; seven active slots retained | [Consistency report](evidence/consistency.json) |

[Final test/build exit codes](evidence/final-check-exits.txt). Full tests/build used the permitted unrestricted shell because the workspace has a known sandbox/esbuild ancestor-directory access limitation. No dependencies were installed or changed. Build-generated `next-env.d.ts` routes were restored to their exact baseline bytes after the successful build.

## Test-first failures and corrections

- Mathematical map tests started RED on the missing builder module: [RED](evidence/materials-red.txt), [first GREEN](evidence/materials-green.txt).
- Image-replacement/hook tests started RED on the missing module: [RED](evidence/images-red.txt). First GREEN attempt had one timeout from recursive comparison of megabyte Buffers while encoding; switched to native byte equality with the same assertion. [Failed run](evidence/images-green.txt), [4/4 corrected](evidence/images-green-final.txt).
- Independent review found inconsistent saved-image row orientation. Actual PNG regression was RED with .272 maximum channel error: [RED](evidence/saved-image-red.txt). Reversing Blender storage rows fixed it: [GREEN](evidence/saved-image-green.txt); final run also includes decoded KTX mask localization. All final maps/assets/evidence were regenerated.
- Initial decoded-mask inspection assumed RGBA but extraction produced an indexed PNG; inspection now explicitly converts to RGBA. This did not require an asset change.
- Obsolete first-round render was interrupted. Its incomplete/superseded reports are under `evidence/round1/`; they are not current acceptance evidence. Final renders all complete with exit 0.

## Retained warnings and untested boundaries

- All samples exceed the 2.5 MB seat target but remain below the unchanged 3.5 MB hard cap. Gate warnings include pinned Khronos validator limitations for Draco/KTX2, unused data/tangents and unrecognized KTX image format. Dedicated decoding and KTX validation supply complementary checks; no gate waivers were added.
- Blender `use_nodes` deprecations and browser ReadPixels warnings remain recorded.
- Local load timing is measured; first load is cold and later loads are warm. Phone FPS, GPU bytes and shader frame-time delta are **NOT MEASURED**. Reported texture-memory and future complete-scene transfer figures are estimates.
- Actual app treatment selection, asynchronous switch failure/restore, WebGPU and full-scene material integration are **NOT TESTED / Stage B**. No selector was added. Existing application tests/build remain green.
- Seam alignment, UV stretching, pattern scale, premium appearance and physical-hide/OEM authenticity remain unaccepted. Human review fields remain blank. Existing gates/reference gaps remain open.
- Thirteen prior development dependency audit findings remain unresolved; no new audit or dependency migration performed.

The [owner form](review.md) is the next checkpoint. No Stage B or L5 work is authorized by technical PASS.
