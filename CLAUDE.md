# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

ClimbNow is a Next.js app that scrapes and displays live climbing competition results from the Russian Climbing Federation site (c-f-r.ru). It has no database of its own — it fetches and parses HTML from an external site server-side, then renders live-updating results tables per discipline/group, highlighting climbers from a chosen team/city.

Live: https://climbnow.ru and https://climbnow-skondor.amvera.io/

## Commands

```bash
npm run dev              # start dev server (localhost:3000)
npm run build            # production build
npm run start             # run production build (first uploads browser source maps to Hawk, see "Error tracking")
npm run lint              # next lint
npm run test               # run vitest once
npm run test:watch         # vitest watch mode
npm run test:coverage      # vitest with v8 coverage
npm run analyze             # production build with bundle analyzer
```

Run a single test file or case with vitest directly, e.g.:
```bash
npx vitest run src/shared/parser/parsers.test.ts
npx vitest run -t "parses lead qualification"
```

## Architecture

### Data flow: scrape → parse → render

The external site (c-f-r.ru) is a legacy HTML site with no JSON API. All data comes from parsing its raw HTML server-side:

- `src/app/api/groups/route.ts` fetches `https://c-f-r.ru/live/{code}/index.html` and runs `parseResults()` to extract the list of disciplines → groups → subgroups (with online/passed/pending status) for a competition code (e.g. `2602vrn`).
- `src/app/api/results/route.ts` fetches `https://c-f-r.ru/live/{code}/{subgroup}.html` and runs `parseResultsTable()` to extract one results table (qualification, qualification round 2, combined qualification, or final — for either lead or boulder discipline).
- Both routes exist purely as a same-origin proxy/parser so the browser never talks to c-f-r.ru directly (also avoids CORS issues). c-f-r.ru redirects `http://` to `https://`, so `EXTERNAL_API_BASE_URL` uses https directly to skip that extra round trip.
- Both routes wrap the upstream fetch + parse in `cached()` from `src/shared/upstreamCache.ts`: an in-memory 10s TTL cache keyed by upstream URL that also collapses concurrent requests into one, so many viewers polling the same live table cost one c-f-r.ru request per TTL. Failures are not cached. Served data can therefore be up to 10s older than c-f-r.ru.
- All HTML parsing lives in `src/shared/parser/parsers.ts`, built on `parse5` with hand-rolled DOM helpers (`findElementsByTag`, `getTextContent`, `hasClass`) since there's no DOM in the Node runtime. Table column layout per result type is declared in `src/shared/tables.configs.ts` and driven through the generic `parseTable<T>()`. Boulder route cells (`r_0`/`r_1`/`r_2` classes) get special-cased parsing in `parseRouteCell`.
- Parser behavior is pinned down with fixture-based tests in `src/shared/parser/parsers.test.ts` against mock HTML in `src/shared/parser/mocks/mockHtml.ts` — when the external site's markup changes, update the mocks and configs here rather than guessing.
- The competition **events** list comes from a second scraped site, the FSR calendar at `https://www.rusclimbing.ru/competitions/` (`EVENTS_SOURCE_URL`). `src/shared/eventsSource.ts` fetches it, parses it with `parseEvents()` from `src/shared/parser/events.parser.ts`, and caches it via `cachedWithFallback()` (`src/shared/backendCache.ts`: 24 h TTL, serves the last good response when the site is down). There is no database: event `id`s are an FNV-1a hash of the event's original code, so they stay stable across reloads.
- `PATCH /api/events/{id}` stores a corrected code (e.g. `2602vrn` → `2602vrn_vs`, found by the client's suffix retry in `disciplinesStore.fetchGroups`) in an in-memory map on `globalThis`, which `GET /api/events` applies on top of the parsed list. The server accepts only the original code plus `_vs`/`_ch`/`_perv`, and only when c-f-r.ru actually has that competition. The map is lost on restart and refills itself as clients hit 404s again.
- `/api/teams` returns the static `DEFAULT_TEAMS` list from `src/shared/constants.ts`; update it by hand when the season changes.
- Event types live in `src/shared/types/api.ts` (originally generated from the retired `cfr-search` FastAPI backend's OpenAPI spec, now maintained by hand) and are re-exported through `src/shared/types/api.types.ts` (`EventResponse` is the API shape, `Event` is the local UI shape).

### State management: MobX stores + React Query

- `src/store/root.store.ts` instantiates a single `RootStore` (exported as the `rootStore` singleton) holding one shared `QueryClient` plus four MobX stores: `formStore` (URL code/team form state), `disciplinesStore` (groups data, fetched via `fetchResults`), `eventsStore`, `teamsStore`.
- `src/store/RootStoreProvider.tsx` provides `rootStore` through context (`useRootStore`) and loads the code/team from the URL query string on mount.
- Individual result tables use a separate pattern: `src/components/tables/useFetchResults.ts` wraps `useQuery` directly (not going through the MobX stores) with `refetchInterval` gated on whether the subgroup is currently live (`isOnline`) — 30s polling while live, a single fetch otherwise. Top-level groups poll less frequently (`UPDATE_INTERVAL` = 2 min) via the MobX `disciplinesStore`.
- `disciplinesStore.fetchGroups` has fallback logic: if a raw code lookup 404s, it retries with known competition-name suffixes (`_vs`, `_ch`, `_perv`) derived from the event name, and if a different suffixed code succeeds it patches the stored event's code via `patchEvent` on the events backend.

### Import aliases

`tsconfig.json` defines several overlapping path aliases that all resolve into `src/`: `@/*` and `@/src/*` are equivalent (both map to `./src/*`), and `@/lib/*` / `@/types/*` map into `src/shared/*` and `src/shared/types/*`. The codebase is not consistent about which alias it uses (e.g. `@/shared/...` and `@/src/shared/...` both appear) — match the surrounding file's existing style rather than "fixing" imports project-wide.

### Security headers

`src/proxy.ts` (Next.js middleware, matched against all non-API/static routes) sets CSP, HSTS, and other security headers, including a per-request nonce for script-src. When adding a new external script or connect-src target, it needs to be added to the CSP directives here.

### Error tracking (Hawk)

Errors go to [Hawk.so](https://hawk.so) (sentry.io blocks Russia). Everything is off when the `HAWK_TOKEN` env var is unset.

- **Server**: `sendToHawk()` in `src/shared/hawk.server.ts`. Called from `onRequestError` in `src/instrumentation.ts` (unhandled render/route/proxy errors) and from the `catch` in `/api/results` only — `/api/groups` deliberately doesn't report, since 404s there are the normal outcome of the client's code-suffix probing. The SDK is initialised lazily on first send with `disableGlobalErrorsHandling` (its `uncaughtException` listener would keep a crashed process alive).
- **Server stack traces**: Next replaces `Error.prepareStackTrace`, so `error.stack` points at minified `.next/server` chunks even with `--enable-source-maps`. `beforeSend` maps frames itself by reading the chunk's `.map` from disk on demand.
- **Client**: `HawkInit` (rendered by `layout.tsx`, which passes the token read at request time) loads `@hawk.so/browser` lazily and catches `window.onerror`/`unhandledrejection`. Errors caught by error boundaries don't reach `window.onerror`, so `global-error.tsx` and `ErrorBoundary` call `sendToHawk()` from `src/shared/hawk.ts`. CSP allows `wss://*.k1.hawk.so`.
- **Browser source maps**: `productionBrowserSourceMaps` is on; `npm run start` runs `scripts/hawk-sourcemaps.mjs` before `next start` to upload them under release = `.next/BUILD_ID` and delete them so they aren't served. It runs at start, not build, because Amvera env vars aren't available at build time. Starting the server any other way than `npm run start` leaves the maps publicly served.
- `package.json` `overrides` pins `@hawk.so/nodejs`'s axios to the project's axios 1.x (its own `^0.21` has known vulnerabilities).

## Notes

- Payload CMS (admin, Postgres-backed footer/users) has been removed from this project — there is no `payload.config.ts`, no `Footer` global, no Postgres dependency. The footer (`src/components/layout/Footer.tsx`) is a plain static component.
- A `climb-now-mobile` sibling project (in `../climb-now-mobile`) is an in-progress React Native/Expo port; see its `plans/migration-plan.md` for what's shared vs. reimplemented. This web app's `/api/groups` and `/api/results` endpoints are the data source the mobile app calls — don't change their response shapes without checking that plan.
