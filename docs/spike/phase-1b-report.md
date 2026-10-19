# Phase 1B quality gates and configuration — 2026-10-19

Branch: `phase-1b-quality`, created from `ad55dc5`. Scope: quality gates and configuration only.

## Changes

- Added `typecheck`, ESLint CLI `lint`, Vitest `test`, and Chromium `test:e2e` scripts. Added a CI workflow for typecheck, lint, test, and build.
- Aligned `SceneNodeDefinition` names with the scene schema: `identifier`, `module`, and required `materialSlot`. No other usages of the old names were found.
- Added contracts for manifest material slots and documented node identifiers, catalogue colour material references, and Ajv validation of both JSON schemas. The four known undefined slots are an exact allowlist; defining one or introducing a fifth fails the test.
- Read `NEXT_PUBLIC_AUTOLAB_WHATSAPP_NUMBER` through a validated link builder. Both consultation controls are disabled without a valid number, with a visible explanation.
- Added one-year `public, max-age=31536000, immutable` response headers for `/assets/3d/:path*`, `/draco/:path*`, and `/basis/:path*`.

The ESLint CLI setup follows [Next.js 16 ESLint guidance](https://nextjs.org/docs/app/api-reference/config/eslint), which states `next lint` was removed. The route patterns and `headers()` shape follow [Next.js headers documentation](https://nextjs.org/docs/app/api-reference/config/next-config-js/headers). The Chromium project and web server follow [Playwright configuration](https://playwright.dev/docs/test-configuration).

## Validation outputs

| Command | Actual result |
| --- | --- |
| `npm run typecheck` | Exit 0; `tsc --noEmit`, no diagnostics. |
| `npm run lint` | Exit 0; `eslint .`, 0 errors and 43 pre-existing unused-variable warnings. |
| `npm run test` | Exit 0 outside sandbox; `Test Files 2 passed (2)`, `Tests 12 passed (12)`. |
| `npm run test:e2e` | Exit 0 outside sandbox; Chromium `2 passed (18.2s)`. Unset number rendered a disabled booking button and the exact unavailable message. A GET of `/assets/3d/s-class-v223/README.md` returned `Cache-Control: public, max-age=31536000, immutable`. |
| `npm run build` | Exit 0; Next.js 16.4.2 compiled in 6.1s, TypeScript finished in 12.4s, 6 static pages generated. |
| `git diff --check` | Exit 0; only Windows LF-to-CRLF notices. |

Test-first evidence: the first Vitest run had a failing slot contract showing exactly `MAT_Carpet_Floor`, `MAT_Console_Veneer_And_Leather`, `MAT_Door_Card_Substrate`, and `MAT_Screen_Driver_Cluster`; the new WhatsApp builder module did not exist. After implementation, all 12 tests passed. For the required mutation, changing `GEO_Dashboard_Screen_Driver_Cluster` to `GEO_Dashboard_Screen_Driver_Cluster_Renamed` made contract test (a) fail with `is not in the component map: expected false to be true` (exit 1). The manifest was restored, and the full test suite passed again. A duplicate-ID rename also failed with 13 unique identifiers versus 14 nodes.

## Dependency audit

Both audit queries needed network access outside the sandbox. `npm audit --omit=dev --json` reported **0 production vulnerabilities** (all severities zero). `npm audit --json` reported **13 total, all in the dev-inclusive set**: 6 moderate and 7 high. Affected names: `@esbuild-kit/core-utils`, `@esbuild-kit/esm-loader`, `@next/eslint-plugin-next`, `braces`, `chokidar`, `drizzle-kit`, `esbuild`, `eslint-config-next`, `fast-glob`, `micromatch`, `postcss-nested`, `postcss-selector-parser`, and `tailwindcss`. No automatic audit fix was applied; it could alter dependencies beyond this phase.

## Limits and handoff

- The first devDependency install failed on a Vitest / Node 20 types peer conflict; `@types/node` was aligned with the existing Node 22 runtime. Vite 7 was pinned after Vite 8's optional Rolldown binding was unavailable in this checkout. The final targeted tests ran.
- Vitest config loading hit a sandbox filesystem access denial; the same command passed outside the sandbox. Chromium tests also passed and exited cleanly outside the sandbox. No test remains unrun.
- Immutable caching on stable asset filenames can serve stale content when files are replaced in place; publish future asset revisions under versioned paths or names. No asset or material catalogue content was changed.
- `npm ls --depth=0` showed two extraneous packages in the local `node_modules` from the prior OneDrive restore; they are not declared dependencies and were not reinstalled or removed.
