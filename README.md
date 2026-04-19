# ConcertRide ES

Ride-sharing platform for concert-goers in Spain. Dark editorial × Linear precision.

## Stack
- **Frontend**: Vite + React 18 + TypeScript + Tailwind v4 + Motion + Leaflet
- **API**: Hono on Cloudflare Workers
- **Data**: Turso (libSQL) via Drizzle ORM, with an in-memory dev fallback
- **Auth**: Magic-link email (Resend) + `jose` JWT in an HTTP-only cookie — no vendor
- **Monorepo**: npm workspaces (`apps/web`, `apps/api`, `packages/types`)

## Local development

```bash
# First run only
npm install
cp .env.example .dev.vars   # or edit .dev.vars directly

# Two terminals:
npm run dev:api   # wrangler on :8787, loads .dev.vars
npm run dev:web   # vite on :5173, proxies /api → :8787
```

Open http://localhost:5173/.

Without `TURSO_DATABASE_URL` set, the API uses an in-memory store (resets on restart) so you can try the product without any credentials.

Without `RESEND_API_KEY` set, `/login` prints the magic-link URL directly on the screen — click to sign in.

`/_dev` renders the component showcase.

## Turso bring-up

When you're ready to persist data across restarts:

1. Create a Turso database (via `turso db create` or the hosted dashboard).
2. Fill in `.dev.vars`:
   ```
   TURSO_DATABASE_URL=libsql://<name>-<org>.turso.io
   TURSO_AUTH_TOKEN=<token>
   ```
3. Apply the schema:
   ```bash
   cd apps/api
   npm run db:push      # or db:generate && execute drizzle/0000_*.sql manually
   ```
4. Seed venues + concerts + fixture users:
   ```bash
   npm run db:seed
   ```
5. Restart `npm run dev:api` — the Worker detects `TURSO_DATABASE_URL` and swaps to the `DrizzleStore` automatically.

## Scripts

| Script | What it does |
|---|---|
| `npm run dev:api` | Wrangler dev server (Worker + Hono) |
| `npm run dev:web` | Vite dev server (React) |
| `npm run build:web` | Production web build |
| `npm run build:api` | Worker type-check |
| `npm run type-check` | Type-check both workspaces |
| `npm run deploy` | Build web + `wrangler deploy` |
| `cd apps/api && npm run db:generate` | Generate Drizzle migration from schema |
| `cd apps/api && npm run db:push` | Push schema to Turso (no migration file) |
| `cd apps/api && npm run db:seed` | Populate fixtures into Turso |

## Secrets

See `.env.example` for the full list. At minimum you need:

- `JWT_SECRET` — signs session cookies (generate: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`)
- `INGEST_SECRET` — guards `/api/ingest/run`
- `TURSO_DATABASE_URL` + `TURSO_AUTH_TOKEN` — when you want persistence
- `RESEND_API_KEY` — when you want real magic-link emails
- `TICKETMASTER_API_KEY` — wired up in M5

## Project structure

```
apps/
  web/   React + Vite + Tailwind v4
  api/   Hono + Workers + Drizzle + jose
packages/
  types/  shared TypeScript types
```
