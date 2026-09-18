# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

ClimbNow is a Next.js app that scrapes and displays live climbing competition results from the Russian Climbing Federation site (c-f-r.ru). It has no database of its own — it fetches and parses HTML from an external site server-side, then renders live-updating results tables per discipline/group, highlighting climbers from a chosen team/city.

Live: https://climbnow.ru and https://climbnow-skondor.amvera.io/

## Commands

```bash
npm run dev              # start dev server (localhost:3000)
npm run build            # production build
npm run start             # run production build
npm run lint              # next lint
npm run test               # run vitest once
npm run test:watch         # vitest watch mode
npm run test:coverage      # vitest with v8 coverage
npm run analyze             # production build with bundle analyzer
npm run generate:api        # regenerate src/shared/types/api.ts from the OpenAPI spec at https://cfr-search.vercel.app/openapi.json
```

Run a single test file or case with vitest directly, e.g.:
```bash
npx vitest run src/shared/parser/parsers.test.ts
npx vitest run -t "parses lead qualification"
```

## Architecture

### Data flow: scrape → parse → render

The external site (c-f-r.ru) is a legacy HTML site with no JSON API. All data comes from parsing its raw HTML server-side:

- `src/app/api/groups/route.ts` fetches `http://c-f-r.ru/live/{code}/index.html` and runs `parseResults()` to extract the list of disciplines → groups → subgroups (with online/passed/pending status) for a competition code (e.g. `2602vrn`).
- `src/app/api/results/route.ts` fetches `http://c-f-r.ru/live/{code}/{subgroup}.html` and runs `parseResultsTable()` to extract one results table (qualification, qualification round 2, combined qualification, or final — for either lead or boulder discipline).
- Both routes exist purely as a same-origin proxy/parser so the browser never talks to c-f-r.ru directly (also avoids CORS/mixed-content issues, since c-f-r.ru is HTTP-only).
- All HTML parsing lives in `src/shared/parser/parsers.ts`, built on `parse5` with hand-rolled DOM helpers (`findElementsByTag`, `getTextContent`, `hasClass`) since there's no DOM in the Node runtime. Table column layout per result type is declared in `src/shared/tables.configs.ts` and driven through the generic `parseTable<T>()`. Boulder route cells (`r_0`/`r_1`/`r_2` classes) get special-cased parsing in `parseRouteCell`.
- Parser behavior is pinned down with fixture-based tests in `src/shared/parser/parsers.test.ts` against mock HTML in `src/shared/parser/mocks/mockHtml.ts` — when the external site's markup changes, update the mocks and configs here rather than guessing.
- A second, unrelated backend (`https://cfr-search.vercel.app`, aliased as `BACKEND_API_URL`) serves competition **events** and **teams** lists (not scraped results) — see `src/shared/services.ts`. Its response types are generated into `src/shared/types/api.ts` via `npm run generate:api` and re-exported through `src/shared/types/api.types.ts` (`EventResponse` is the raw API shape, `Event` is the local UI shape).

### State management: MobX stores + React Query

- `src/store/root.store.ts` instantiates a single `RootStore` (exported as the `rootStore` singleton) holding one shared `QueryClient` plus four MobX stores: `formStore` (URL code/team form state), `disciplinesStore` (groups data, fetched via `fetchResults`), `eventsStore`, `teamsStore`.
- `src/store/RootStoreProvider.tsx` provides `rootStore` through context (`useRootStore`) and loads the code/team from the URL query string on mount.
- Individual result tables use a separate pattern: `src/components/tables/useFetchResults.ts` wraps `useQuery` directly (not going through the MobX stores) with `refetchInterval` gated on whether the subgroup is currently live (`isOnline`) — 30s polling while live, a single fetch otherwise. Top-level groups poll less frequently (`UPDATE_INTERVAL` = 2 min) via the MobX `disciplinesStore`.
- `disciplinesStore.fetchGroups` has fallback logic: if a raw code lookup 404s, it retries with known competition-name suffixes (`_vs`, `_ch`, `_perv`) derived from the event name, and if a different suffixed code succeeds it patches the stored event's code via `patchEvent` on the events backend.

### Import aliases

`tsconfig.json` defines several overlapping path aliases that all resolve into `src/`: `@/*` and `@/src/*` are equivalent (both map to `./src/*`), and `@/lib/*` / `@/types/*` map into `src/shared/*` and `src/shared/types/*`. The codebase is not consistent about which alias it uses (e.g. `@/shared/...` and `@/src/shared/...` both appear) — match the surrounding file's existing style rather than "fixing" imports project-wide.

### Security headers

`src/proxy.ts` (Next.js middleware, matched against all non-API/static routes) sets CSP, HSTS, and other security headers, including a per-request nonce for script-src. When adding a new external script or connect-src target, it needs to be added to the CSP directives here.

## Notes

- Payload CMS (admin, Postgres-backed footer/users) has been removed from this project — there is no `payload.config.ts`, no `Footer` global, no Postgres dependency. The footer (`src/components/layout/Footer.tsx`) is a plain static component.
- A `climb-now-mobile` sibling project (in `../climb-now-mobile`) is an in-progress React Native/Expo port; see its `plans/migration-plan.md` for what's shared vs. reimplemented. This web app's `/api/groups` and `/api/results` endpoints are the data source the mobile app calls — don't change their response shapes without checking that plan.
