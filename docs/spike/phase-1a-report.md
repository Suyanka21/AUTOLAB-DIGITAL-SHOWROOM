# Phase 1A migration evidence — 2026-10-19

Branch: `phase-1a-foundation`; base: `675b7bc`. Decisions D5 and D6 were already recorded. No push, PR, deployment, or UI edit was made.

## Source check before edits

- [Next.js 16 upgrade guide](https://nextjs.org/docs/app/guides/upgrading/version-16): Node 20.9+ and TypeScript 5.1+; Turbopack is the default for dev and build; synchronous request API access is removed; `middleware` becomes `proxy`; React and React DOM types should be upgraded with React.
- [Next.js 15 upgrade guide](https://nextjs.org/docs/app/guides/upgrading/version-15): the 14-to-15 path introduces React 19 and async request APIs; default `fetch` and GET route-handler caching changes.
- [Next.js installation guide](https://nextjs.org/docs/app/getting-started/installation): the App Router uses React 19 features, Node 20.9+ is required, and Next 16 build no longer runs lint automatically.

Repo checks before edits found no `middleware`/`proxy` file, Next config, custom webpack config, server-side `cookies()`, `headers()`, `draftMode()`, page/route `params`, or server `searchParams` use. `src/app/auth/page.tsx` uses the client `useSearchParams()` hook, which is outside that async migration. No fetch or GET route-handler caching behavior needed migration. Existing `next dev` and `next build` scripts already fit Turbopack's default. `next lint` remains in package scripts for Phase 1B's planned ESLint setup; it is not a Phase 1A quality gate.

## Dependency and code changes

Read-only npm registry checks returned: Next `16.4.2`, React and React DOM `19.3.1`, Drizzle ORM `0.45.4`, and React type packages `19.3.0`. These exact versions were installed. `npm ls next react react-dom @types/react @types/react-dom drizzle-orm --depth=0` exited 0 and listed all six at those versions.

`rg` found Firebase package usage only inside `src/lib/db/firebase/client.ts` and `firestore.ts`, with no consumers outside that directory. The `firebase` dependency and those two unused files were removed. `rg -n 'NEXT_PUBLIC_FIREBASE|FIREBASE_|/db/firebase' src .env.example package.json` returned exit 1 with no matches. `.env.example` had no Firebase names. Historical documentation and four static UI-copy mentions of Firebase remain; editing the UI was excluded in this phase.

`package.json` now declares `engines.node >=20.9.0`, matching the official Next 16 minimum, and `.nvmrc` pins the locally verified Node `22.23.2`. Next 16's first build changed `tsconfig.json` to `jsx: react-jsx` and added `.next/dev/types/**/*.ts`; the same changes were applied to the checkout. Next also regenerated the tracked `next-env.d.ts` route type references.

## Validation output

```text
Baseline Next 14 server: GET / -> StatusCode 200, HeadingFound True
Baseline screenshot: docs/spike/baseline-ui.png (1440x3000 headless Chrome capture; inspected)
npx tsc --noEmit -> exit 0
Temporary mirror npm ci --no-audit --no-fund -> exit 0, added 209 packages in 2m
Temporary mirror npm run build -> exit 0, Next.js 16.4.2 (Turbopack), Compiled successfully, Finished TypeScript, Generating static pages (6/6)
Checkout npm run build after dependency restore -> exit 0, Next.js 16.4.2 (Turbopack), Compiled successfully, Finished TypeScript, Generating static pages (6/6)
Checkout Next 16 server: GET / -> StatusCode 200, HeadingFound True
After screenshot: docs/spike/after-1a-ui.png (1440x3000 headless Chrome capture; inspected)
```

Both screenshots show the existing configurator layout. The app's reference code is randomized on mount, so its characters differ between captures. No other visible change was observed; this is a visual inspection, not a pixel-equivalence test.

`npm audit --omit=dev --json` in the clean-installed mirror exited 0: `info 0, low 0, moderate 0, high 0, critical 0, total 0` across 29 production dependencies.

## Checkout clean-install limitation

`npm ci --no-audit --no-fund` was attempted three times in the OneDrive checkout. Every attempt failed before install with `EBUSY: resource busy or locked, unlink node_modules/lucide-react/dist/esm/icons/swatch-book.js.map`. A direct removal also failed because another process was using the file. No project Node/Chrome process remained; OneDrive was active, but the exact lock owner was not proven. The attempt cap was respected.

The identical changed package files, source, and config were copied to `C:\Users\user\AppData\Local\Temp\autolab-phase1a-verify-675b7bc`; clean install and production build passed there. Dependencies were then copied back to the checkout without overwriting the locked source map, and `npm ls` plus the checkout build passed. This proves the lockfile installs cleanly in the mirror and the checkout builds, but **does not** prove `npm ci` can currently complete inside the OneDrive path.

## Files changed

`.nvmrc`, `package.json`, `package-lock.json`, `tsconfig.json`, `next-env.d.ts`, deleted `src/lib/db/firebase/client.ts`, deleted `src/lib/db/firebase/firestore.ts`, `docs/spike/baseline-ui.png`, `docs/spike/after-1a-ui.png`, this report, and `docs/STATE.md`.
