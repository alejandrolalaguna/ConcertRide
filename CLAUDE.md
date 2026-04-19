# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Dev — both servers in parallel (API :8787 + web :5173)
npm run dev

# Dev — individual servers
npm run dev:api          # wrangler dev on :8787 (loads .dev.vars)
npm run dev:web          # vite dev on :5173 (proxies /api → :8787)

# Type-check all workspaces
npm run type-check

# Unit tests
npm test                                    # all workspaces
npm test --workspace=@concertride/api       # api only
npm test --workspace=@concertride/web       # web only
npx vitest run apps/api/src/lib/fingerprint.test.ts  # single file

# E2e (starts both servers automatically)
npx playwright test
npx playwright test e2e/landing.spec.ts     # single file

# Build
npm run build           # web + api type-check

# Database (run from root — scripts resolve paths via dotenv)
npm run db:push --workspace=@concertride/api    # push schema to Turso
npm run db:seed --workspace=@concertride/api    # seed fixture data
npm run db:generate --workspace=@concertride/api  # generate migration file
```

## Architecture

**Monorepo layout**
- `apps/web` — React 18 + Vite + Tailwind v4 SPA
- `apps/api` — Hono app deployed as a Cloudflare Worker
- `packages/types` — shared TypeScript types consumed by both workspaces

**Request flow (production)**
Everything is served through a single Cloudflare Worker (`wrangler.jsonc`). `/api/*` routes are handled by Hono; all other paths fall through to `ASSETS` (the built Vite SPA). In dev, Vite runs separately on `:5173` and proxies `/api/*` to wrangler on `:8787`.

**Store abstraction**
`apps/api/src/store/factory.ts` checks `env.TURSO_DATABASE_URL` at request time. If absent → `MemoryStore` (in-process singleton, resets on restart). If present → `DrizzleStore` using `@libsql/client/web` (the edge-compatible variant). This swap is transparent to all route handlers via `c.var.store` (set by `storeMiddleware`).

The `DrizzleStore` must only be imported via a dynamic `import()` inside `factory.ts` — this keeps the `@libsql/client/web` import out of the module graph for Node-side scripts (seed, smoke-ingest), which use `apps/api/src/store/drizzle-internal.ts` to get the class with the regular `@libsql/client`.

**Auth flow**
`POST /api/auth/register` (email + password + name) → hashes password with PBKDF2-SHA256 via `apps/api/src/lib/password.ts` (100k iterations, 16-byte salt, stored as hex in `password_hash`/`password_salt` columns) → creates user → signs HS256 JWT via `jose` → sets `cr_session` HTTP-only cookie.

`POST /api/auth/login` (email + password) → looks up user → verifies hash → same cookie flow. The frontend `useSession` hook (in `apps/web/src/lib/session.tsx`) polls `/api/auth/me` on mount; `refresh()` is called after login/register to hydrate the session context.

`/login` and `/register` are the two auth pages. `VerifyPage.tsx` exists as a stub redirect to `/login` (magic-link was removed).

**Password hashing**
`crypto.subtle` (PBKDF2) is the only KDF available on Cloudflare Workers — no bcrypt/argon2. The `password_hash` and `password_salt` columns are nullable so existing seed rows without passwords are not broken.

**Ad-hoc concerts**
`POST /api/concerts` (auth required) creates a concert record not sourced from ingestion. These are identified by `id` starting with `c_adhoc_`, `ticketmaster_id = null`, and `sources_json = "[]"`. `GET /api/rides?adhoc=true` filters rides tied to these concerts. `AdhocRidesSection` on the landing page fetches and renders them, self-hiding when empty.

**Ingestion pipeline**
`SourceAdapter` interface in `apps/api/src/ingest/types.ts`. Only `ticketmaster` is implemented; the other five sources are stubs that throw `"adapter_not_implemented:<id>"`. `runIngestion` catches per-source errors so one stub failure never aborts the run. Three cron tiers (every 30 min, every 2 h, every 6 h) map to tier 1/2/3 sources via `CRON_TO_TIER` in `scheduled.ts`.

## Key conventions

**Types** — always import from `@concertride/types`. Never redeclare `Concert`, `Ride`, `User`, `CreateRideRequest`, `CreateConcertInput`, etc.

**Design system** — Tailwind v4 CSS-first tokens in `apps/web/src/index.css` under `@theme inline`. Use `cr-*` color/shadow tokens (`cr-primary` = `#dbff00`, `cr-secondary` = `#ff4f00`, `cr-bg` = `#080808`). Hard neo-brutalist shadow: `shadow-[4px_4px_0px_0px_#DBFF00]`. Display font is `font-display` (Archivo Black), data/mono is `font-mono` (JetBrains Mono). Reusable primitives (Badge, DriverCard, SectionTitle, LoadingSpinner, SkeletonCard, EmptyState, SuccessBanner) live in `apps/web/src/components/ui/index.tsx`.

**Hono routes** — all routes use `new Hono<HonoEnv>()` where `HonoEnv` binds `Variables: { store: StoreAdapter }`. Access the store via `c.var.store`, never instantiate it directly in a route.

**Schema snake_case** — Drizzle column names are `snake_case`; the shared TypeScript types in `packages/types` also use `snake_case`. The `drizzle.config.ts` at `apps/api/drizzle.config.ts` explicitly loads both `../../.env` and `../../.dev.vars` because drizzle-kit v0.29 doesn't auto-discover them.

**React hooks guard** — any conditional `return` (e.g. auth redirect via `<Navigate>`) must come *after* all `useMemo`/`useCallback`/`useEffect` calls to avoid "rendered fewer hooks than expected" crashes.

**Playwright** — tests use `waitUntil: "commit"` for `page.waitForURL` after React Router client-side navigations; the default `"load"` never fires for SPA navigation.

**Workers compat** — `wrangler.jsonc` targets `compatibility_date: "2026-04-18"` with `nodejs_compat` flag. Runtime only supports `@libsql/client/web` (not the Node client). Scripts (`seed.ts`, `smoke-ingest.ts`) run under Node with `tsx` and use the regular `@libsql/client`.

**CORS** — hardcoded allowlist in `apps/api/src/index.ts`: `localhost:5173`, `concertride.es`, `www.concertride.es`. Any other origin is blocked.
