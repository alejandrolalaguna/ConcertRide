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

# Deploy
npm run deploy          # wrangler publish (requires CLOUDFLARE_API_TOKEN)

# Maintenance scripts (Node/tsx, run from root)
npx tsx apps/api/scripts/smoke-ingest.ts    # test ingestion end-to-end
npx tsx apps/api/scripts/backfill-2026.ts   # backfill historical concert data
```

## Environment variables

Required in `.dev.vars` (wrangler dev) and Cloudflare secrets (production):

| Var | Required | Notes |
|---|---|---|
| `JWT_SECRET` | Yes | 32-byte hex; signs `cr_session` cookies |
| `INGEST_SECRET` | Yes | Checked in `x-ingest-secret` header on `POST /api/ingest/run` |
| `TURSO_DATABASE_URL` | No | Omit to use in-memory store |
| `TURSO_AUTH_TOKEN` | No | Required when `TURSO_DATABASE_URL` is set |
| `TICKETMASTER_API_KEY` | No | Only needed for live ingestion; stubs work without it |
| `RESEND_API_KEY` | No | Email delivery; omit to print magic-link URL to stdout |
| `VAPID_PUBLIC_KEY` | No | Base64url-encoded P-256 public key for Web Push; omit to disable push notifications |
| `VAPID_PRIVATE_KEY` | No | Base64url-encoded P-256 private key for Web Push |

`ENVIRONMENT=production` is hardcoded in `wrangler.jsonc` for production deployments.

## CI

GitHub Actions (`.github/workflows/ci.yml`) runs on push/PR to `main`:
1. `npm ci`
2. `npm run type-check`
3. `npm test`
4. `npm run build` (with a `JWT_SECRET` placeholder injected)

No automated deploy — deployments are manual via `npm run deploy`.

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

**Messaging**
`POST /api/messages` (auth required) posts to either a ride thread (`ride_id`) or concert chat (`concert_id`) — mutually exclusive. Message kinds: `text`, `location`, `photo`. Photos are uploaded via `POST /api/messages/upload` (multipart, 4 MB limit, JPEG/PNG/WebP/GIF) → stored as base64 data-URL in KV with 30-day TTL → returned URL used as `attachment_url`. Media served via `GET /api/messages/media/:id` with immutable cache headers. Store methods: `listMessages(scope)`, `createMessage(userId, scope, body, opts?)`.

**Web Push notifications**
`apps/api/src/lib/webpush.ts` implements RFC 8291 Web Push using `crypto.subtle` only (no external deps) — ECDH key exchange, AES-GCM encryption, ES256 VAPID JWT. `notifyUser(store, env, userId, payload)` in `apps/api/src/lib/notify.ts` fans out to all user subscriptions via `Promise.allSettled`. Subscriptions stored in the `push_subscriptions` table; routes: `POST /api/push/subscribe`, `POST /api/push/unsubscribe`, `GET /api/push/vapid-public-key`. Frontend `usePush` hook in `apps/web/src/lib/usePush.ts` manages browser permission and subscription state. Push is disabled when `VAPID_PUBLIC_KEY`/`VAPID_PRIVATE_KEY` are absent.

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

**PWA** — `vite-plugin-pwa` in `apps/web/vite.config.ts` generates a service worker with auto-update and a StaleWhileRevalidate cache for `/api/(concerts|rides)` (5-minute TTL). Register/prompt logic lives in `apps/web/src/main.tsx`.

**Security headers** — `apps/web/public/_headers` sets HSTS, strict CSP, `X-Frame-Options: DENY`, and Permissions-Policy (camera/mic/geolocation/payment off). Any new external script or font domain must be added to the CSP `script-src`/`font-src` directives there.

**Wrangler KV** — a `CACHE` KV namespace is bound in `wrangler.jsonc` and available as `c.env.CACHE` in route handlers. Used for photo/media storage (`POST /api/messages/upload` → `GET /api/messages/media/:id`).

**Message scoping** — messages are ride-scoped (`ride_id` set, `concert_id` null) or concert-scoped (`concert_id` set, `ride_id` null). Never both. Photo uploads bypass the database entirely; only the KV key is stored as `attachment_url`.

## Recent Features (2026-04-25)

**Instant Booking** — `POST /api/rides/:id/book` auto-confirms passengers without driver approval. Toggle `instant_booking` in PublishRidePage. Badge "Instante" shows in TicketCard. Frontend uses `api.rides.bookInstant()` vs `api.rides.requestSeat()` based on `ride.instant_booking` flag.

**Vibe Matching** — `GET /api/rides/:id/confirmed-passengers` returns public list of confirmed passengers (first name + initial only, privacy-safe). Endpoint filters `status="confirmed"`. Frontend displays overlapped avatars + dynamic text ("Laura, Dani y 2 más van"). Link to `/drivers/:id` for clickable profiles.

**Pre-Ride Checklist** — New `ride_checklist` table (migration 0013) with items: `pickup_location`, `pickup_time`, `driver_phone`, `luggage_confirmation`. Endpoints: GET/POST/PATCH `/api/rides/:id/checklist*`. Driver creates items; passengers confirm via checkboxes. Status: `pending` → `confirmed` (immutable). Auth: driver-only for POST, driver + passengers for GET/PATCH. Frontend: `api.rides.listChecklist()`, `api.rides.createChecklistItem()`, `api.rides.confirmChecklistItem()`.

**Payment Reminder** — Cron job `runPaymentReminders()` fires every hour at :15 (PAYMENT_REMINDERS_CRON = "15 * * * *"). Finds rides departing in 55-65 min window with `payment_reminder_sent_at IS NULL`. Sends email + push to driver + all confirmed passengers. Migration 0014 adds `rides.payment_reminder_sent_at` column. Idempotent: marks ride as reminded to prevent duplicates. Email: `sendPaymentReminderEmail()` with role-specific content (driver gets passenger count).

**Driver Profile Mini** — New component `DriverProfileMini.tsx` displays avatar + name + verification badges (email ✓, license ✓) + rating + ride count + car details. Replaces TrustBadge in RideDetailPage. Entire card is clickable link to `/drivers/:id`. Styling: border hover effect, rounded, padding consistent with other cards.

**Social Proof Badges** — Components `HotRidesBadge` (shows "🔥 Popular" if occupancy >= 75%) and `SocialProofText` (shows "X confirmados · Y% lleno"). Integrated into TicketCard badges row. Client-side only: calculates `seatsTaken = seats_total - seats_left`. No backend changes. Purely presentational components.

See `INSTANT_BOOKING_FEATURE.md`, `VIBE_MATCHING_FEATURE.md`, `PRE_RIDE_CHECKLIST_FEATURE.md`, `PAYMENT_REMINDER_FEATURE.md`, `DRIVER_PROFILE_MINI_FEATURE.md`, `SOCIAL_PROOF_BADGES_FEATURE.md` for full documentation.
