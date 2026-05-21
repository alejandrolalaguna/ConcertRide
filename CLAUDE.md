# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Brand Restrictions — NEVER violate

**PROHIBIDO mencionar a "BlaBlaCar" en cualquier contenido visible del producto.**

- No introducir el nombre "BlaBlaCar" (ni variantes: `BlaBla Car`, `bla bla car`, `blablacar`) en JSX visible, copy de páginas, textos de blog posts nuevos, FAQ, schemas JSON-LD, OpenGraph, meta keywords/description, ni en ARIA labels.
- No crear nuevas comparativas directas con BlaBlaCar (páginas, secciones, tablas, blog posts).
- No reactivar la ruta `/comparativa/concertride-vs-blablacar` ni su componente `ComparativaBlaBlaCar.tsx` — están deshabilitados a propósito.
- No reactivar la entrada de blog `blablacar-vs-concertride` en links visibles, navegación, listados, ni `relatedBlogs`.
- Cuando haga falta referirse a la competencia genérica de carpooling, usar siempre **"otras plataformas de carpooling"** o **"plataformas de carpooling generalistas"**.
- Si el usuario pide explícitamente una comparativa con BlaBlaCar, recordarle esta restricción y proponer una redacción genérica antes de proceder.

## Contact & Identity Rules — NEVER violate

**Correo de contacto oficial: `help@concertride.me`. Es el ÚNICO email que puede aparecer en cualquier contenido visible del producto.**

- Cualquier `mailto:`, copy de FAQ, página legal (Aviso Legal, Privacidad, Cookies), Footer, página de contacto, schema JSON-LD (`Organization.email`, `ContactPoint.email`), OpenGraph, sitemap, blog post, o respuesta automática debe usar **`help@concertride.me`**.
- No introducir ningún otro dominio de correo (`@concertride.com`, `@concertride.es`, `@gmail.com`, `@libelium.com`, etc.) en contenido visible o en schemas públicos.
- Si encuentras un email distinto al actualizar contenido existente, reemplázalo por `help@concertride.me` en el mismo cambio.

**PROHIBIDO mencionar a "Alejandro Lalaguna" (ni variantes: `Alejandro`, `Lalaguna`, `A. Lalaguna`, `@alejandrolalaguna`, etc.) en cualquier contenido visible del producto.**

- No introducir el nombre en JSX visible, copy de páginas, blog posts, FAQ, schemas JSON-LD (`author.name`, `Person.name`, `editor.name`, `reviewedBy.name`), OpenGraph, meta tags, ARIA labels, autoría de posts, ni firmas.
- No reactivar la ruta `/autor/alejandro-lalaguna` ni su componente `AutorPage.tsx` con ese nombre — si la página debe existir, usar autoría colectiva.
- Cuando haga falta atribuir contenido editorial, usar siempre **"Equipo ConcertRide"**, **"Equipo Editorial ConcertRide"** o **"Redacción ConcertRide"**.
- Esto aplica también a `Person` schemas, `creator`/`author`/`editor`/`reviewedBy` fields, y a cualquier mención en `BLOG_POSTS`, `seoOverrides`, o data files.
- Si el usuario pide explícitamente añadir esa autoría personal, recordarle esta restricción y proponer la atribución colectiva antes de proceder.

## Cloudflare Workers — Deploy Limits — PELIGRO

**El plan Workers Free de Cloudflare impone dos límites duros sobre los assets prerenderizados en `apps/web/dist/`. Romper cualquiera bloquea el `wrangler deploy`.**

### 1. Manifest máximo: **20.000 archivos** en `dist/`
- Plan Free = 20.000 / Plan Paid ($5/mes) = 100.000.
- Hoy el deploy se publica con ~19.888 archivos → **margen ≈ 112 archivos**.
- El bulk (~18.120) son páginas `/rutas/[slug]/index.html` generadas en `apps/web/src/lib/routeLandings.ts` desde el producto `FESTIVAL_LANDINGS × CITY_LANDINGS` filtrado por `MAX_ROUTE_STRAIGHT_KM = 700 km`.
- **Antes de añadir festivales, ciudades o tipologías de páginas programáticas nuevas**, estimar el delta:
  - Cada festival nuevo añade ~115 rutas (cuántas cities en CITY_LANDINGS pasen el distance gate).
  - Cada ciudad nueva añade ~190 rutas (cuántos festivales <=700 km).
  - Cualquier otra tipología programática que prerenderice (artistas, recintos, regiones, géneros) cuenta 1×1 hacia el manifest.
- **Cómo medir antes de un commit grande**: `npm run build` y `find apps/web/dist -type f | wc -l`. Si pasa de 19.500, bajar `MAX_ROUTE_STRAIGHT_KM` o paginar otra tipología.
- **Cuándo proponer subir a Workers Paid**: si el conteo supera 19.700 y no hay rutas seguras que cortar (todas las cortables son curadas o tienen tráfico orgánico real).

### 2. Tamaño máximo por asset: **25 MiB**
- Cualquier `dist/**/*.html` o `dist/assets/*.js|css` >25 MiB bloquea el deploy.
- El caso histórico (2026-05-21) fue `dist/rutas/index.html` a 29 MiB por SSR de los 20K+ ROUTE_LANDINGS en `RutasIndexPage.tsx`. Fix aplicado: cap SSR a `TOP_ROUTE_LANDINGS` (500 rutas).
- **Reglas para evitar que vuelva a pasar:**
  - Cualquier página índice (`/rutas`, `/festivales`, `/artistas`, `/recintos`, `/blog`, etc.) que itere sobre catálogos >1.000 items **debe paginar el SSR**. Patrón: usar un cap `TOP_*` (≤500) priorizando curated/popular, y dejar el resto accesible vía filtros client-side + sitemap.
  - El `itemListElement` de cualquier `<script type="application/ld+json">` debe limitarse al subset visible. `numberOfItems` SÍ puede reflejar el total real.
  - Antes de mergear, comprobar tamaños con `find apps/web/dist -name "*.html" -size +5M`. Cualquier resultado es señal de alarma.

### Quién mantiene esto
- `apps/web/src/lib/routeLandings.ts` — `MAX_ROUTE_STRAIGHT_KM` controla el manifest size.
- `apps/web/src/pages/RutasIndexPage.tsx` — `ROUTES_INDEX_CAP = 500` controla el HTML size.
- Si se añade una nueva tipología programática (artistas-festival, recinto-ciudad, etc.), aplicar **AMBOS** patrones desde el día 1: distance gate o filtro de relevancia + cap SSR.

## Commands

### Development
```bash
npm run dev          # API (wrangler :8787) + web (vite :5173) concurrently
npm run dev:api      # API only
npm run dev:web      # Web only
```

### Build & Deploy
```bash
npm run build        # Build web + type-check API
npm run deploy       # Build web then wrangler deploy
npm run type-check   # tsc --noEmit in all workspaces
```

### Database (run from apps/api/)
```bash
npm run db:push      # Apply schema changes to Turso
npm run db:generate  # Generate migration files from schema diff
npm run db:studio    # Open Drizzle Studio in browser
npm run db:seed      # Seed fixtures (tsx scripts/seed.ts)
```

### Testing
```bash
npm run test         # vitest run (all workspaces)
npm run e2e          # Playwright end-to-end
# Single test file:
cd apps/api && npx vitest run src/routes/auth.test.ts
cd apps/web && npx vitest run src/components/RideCard.test.tsx
```

### Secrets (production)
```bash
wrangler secret put JWT_SECRET
wrangler secret put TURSO_AUTH_TOKEN
# etc. — see .env.example for full list
```

## Architecture

### Monorepo Layout
```
apps/api/    — Cloudflare Worker (Hono.js) + Drizzle ORM
apps/web/    — React 18 + Vite + Tailwind v4 SPA with SSR prerendering
packages/types/ — Shared TypeScript interfaces (no build step)
wrangler.jsonc  — Single Worker serves both API and static assets
```

The Worker serves API routes under `/api/*` and falls back to the SPA (`apps/web/dist`) for everything else via `not_found_handling: single-page-application`.

### API (apps/api/)

**Entry:** `src/index.ts` — registers all route modules, CORS, write-rate-limit middleware, and Cloudflare cron handlers.

**Route modules** under `src/routes/`:
- `auth.ts` — register/login/logout, password reset, email verification, license upload, phone OTP
- `rides.ts` — CRUD, filtering, seat booking, checklist, matching
- `concerts.ts`, `venues.ts`, `users.ts`, `messages.ts`, `favorites.ts`, `reports.ts`, `alerts.ts`, `admin.ts`, `ingest.ts`, `push.ts`, `fuel.ts`

**Store layer** (`src/store/`): `StoreAdapter` interface in `adapter.ts`, two implementations:
- `drizzle.ts` — production Turso/libSQL implementation
- `memory.ts` — in-memory fallback (auto-used when `TURSO_DATABASE_URL` is absent)

Without `TURSO_DATABASE_URL` the API boots with the in-memory store — useful for local dev without Turso.

**Auth flow:** Password hashed with scrypt → `jose` HS256 JWT (30-day) stored in HTTP-only `cr_session` cookie. Magic-link auth exists in the store layer but email delivery must be wired. `src/lib/identity.ts` provides the `requireAuth` middleware.

**KV namespace `CACHE`** backs: rate limiting (fixed-window), JWT revocation, OTP codes, password reset tokens, license file uploads (90-day TTL).

**Database schema** (`src/db/schema.ts`): 14+ Drizzle tables. Key relationships:
- `concerts` → `venues` (venue_id FK)
- `rides` → `concerts` + `users` (driver)
- `ride_requests` → `rides` + `users` (passenger)
- `reviews`, `messages`, `favorites`, `reports` all pivot off `users`

Migrations live in `drizzle/` (auto-generated by drizzle-kit, 0000–0009).

### Frontend (apps/web/)

**Entry:** `src/main.tsx` → wraps app in `SessionProvider` + `FavoritesProvider` + React Router `BrowserRouter`.

**Routes** defined in `src/App.tsx` (~43 routes, all lazy-loaded). Key pages:
- `/concerts` — searchable concert list
- `/concerts/:id` — detail + available rides
- `/publish` — create a ride (drivers)
- `/rides/:id` — ride detail + booking flow
- `/festivales/:slug`, `/conciertos/:city`, `/rutas/:route` — SEO landing pages (prerendered at build)

**Global state:**
- `SessionContext` (`lib/session.tsx`) — current user, `refresh()`, `logout()`
- `FavoritesContext` (`lib/favorites.tsx`) — saved concerts/artists/cities, API-synced

**API client:** `lib/api.ts` — typed wrappers for every endpoint. In dev, `VITE_API_BASE_URL=http://127.0.0.1:8787`; in prod it's empty (same origin).

**Styling:** Tailwind v4 (Vite plugin, no config file). Theme tokens in `src/index.css`:
- Primary: `#dbff00` (lime), Secondary: `#ff4f00` (orange), Background: `#080808`
- Display font: Archivo Black; Body: Inter; Code: JetBrains Mono

**SSR/Prerendering:** `scripts/prerender.mjs` renders static HTML at build time for festival, blog, and route landing pages. Bot requests to `/concerts/:id` and `/festivales/:slug` get prerendered HTML from the Worker (`src/lib/seoPrerender.ts`).

**PWA:** Service worker at `src/sw.ts`, configured in `vite.config.ts` via `vite-plugin-pwa`.

### Shared Types

`packages/types/src/index.ts` exports all shared interfaces (no build needed — consumed directly via TypeScript paths). Add new shared types here rather than duplicating across apps.

### Cloudflare-Specific Patterns

- Worker entry receives `Env` typed in `src/env.ts` — always extend there when adding bindings
- KV access via `c.env.CACHE` (Hono context), Drizzle via `c.var.store`
- Cron triggers handled via `app.get("__scheduled", ...)` pattern in `index.ts`
- `nodejs_compat` flag is required (used by `jose`, `bcrypt`, `crypto`)

---

## Ticketmaster Developer ToS — Mandatory Compliance Rules

ConcertRide uses the **Ticketmaster Discovery API v2** as its primary concert data source.
Every change touching concert data, images, or legal pages **must** comply with:
https://developer.ticketmaster.com/support/terms-of-use/

Run `/tm-compliance audit` at any time to verify. The full audit skill is at `.claude/skills/tm-compliance/SKILL.md`.

### Hard Rules — NEVER violate these

**1. IMAGES: Never host Ticketmaster images on ConcertRide servers.**
- Images must be served directly from Ticketmaster CDN (s1.ticketm.net, media.ticketmaster.com).
- `apps/web/src/lib/imageUrl.ts` must return external URLs as-is — no Cloudflare proxy, no re-upload.
- Do NOT save TM image binaries to `apps/web/public/` or any storage bucket.
- The Aviso Legal states explicitly: *"ConcertRide no aloja dichas imágenes en sus propios servidores."*

**2. API KEYS: Never commit Ticketmaster credentials to tracked files.**
- `TICKETMASTER_API_KEY` and `TICKETMASTER_SECRET` live only in `.env` / `.dev.vars` (gitignored) and Cloudflare Worker secrets.
- Never hardcode them in `.ts`, `.mjs`, `wrangler.jsonc`, or any documentation.
- If a key is found exposed: stop, flag as CRITICAL, instruct user to rotate at https://developer-acct.ticketmaster.com/

**3. ATTRIBUTION: Legal pages must always cite Ticketmaster correctly.**
- `AvisoLegalPage.tsx` §3.B must reference "Ticketmaster Discovery API v2" and state images are TM's property.
- `PrivacidadPage.tsx` must link to `https://www.ticketmaster.es/h/privacy.html`.
- `Footer.tsx` must include a link to `https://www.ticketmaster.es`.
- Do NOT remove or weaken these attributions.

**4. TICKET LINK-BACK: Every TM-sourced concert must link to `ticketmaster_url`.**
- `ConcertDetailPage.tsx` must render a "Comprar en Ticketmaster →" CTA when `concert.ticketmaster_url` is not null.
- Do NOT remove `ticketmaster_url` from the `Concert` type in `packages/types/src/index.ts`.
- Do NOT omit `ticketmaster_url` from `GET /api/concerts/:id` responses.

**5. DATA CACHING: No stale archiving of TM raw data.**
- Ingest cron runs weekly (`"0 3 * * 1"` in `scheduled.ts`) — do not reduce frequency.
- `concertSources.raw_json` is an audit log only — do NOT expose it via a public API endpoint.
- Do NOT create bulk-export or data-dump routes that re-distribute TM data wholesale.

**6. RATE LIMITS: Respect 2 req/s, 5000 req/day.**
- `ticketmaster.ts` implements exponential backoff on 429 (2s → 4s → 8s → stop). Keep it.
- Do NOT run multiple parallel ingest threads that bypass the rate limiter.

### What IS allowed in SEO/blog content

| Content type | Allowed |
|---|---|
| Event names, artist names, festival names (publicly known) | ✅ Yes |
| Venue names, city names, transport info | ✅ Yes |
| Estimated carpooling prices (ConcertRide's own data) | ✅ Yes |
| General dates/months of festivals (publicly announced) | ✅ Yes |
| Exact ticket prices from TM API reproduced verbatim in static content | ⚠️ Caution |
| Hardcoded TM image URLs in blog posts / seoOverrides | ❌ No |
| Reproducing TM API raw JSON in any public-facing page | ❌ No |

## GSC Issue Knowledge Base — Mandatory Rule

**Whenever a GSC (Google Search Console) problem is diagnosed and fixed, add the new case to `.claude/skills/gsc-indexing/SKILL.md`** before closing the task:
- Add to the relevant section (§A "Rastreada sin indexar", §B "Página alternativa con canónica", §P "5xx índices sin route", §Q "Duplicada /:id masivo", §R "Query params faceted", §T "404 slugs renombrados", etc.) or create a new §X section at the end of the file if it's a fundamentally new pattern.
- Include: root cause (with file:line refs), verification command (curl/grep), fix snippet, and the general rule extracted.
- Update the CHECKLIST (§"CHECKLIST RÁPIDA ANTES DE CADA DEPLOY") and the PRIORITIES TABLE (§"MATRIZ DE PRIORIDADES GSC") if applicable.
- Update the `<!-- Last updated -->` HTML comment at the top of `SKILL.md` with a one-line summary of the new pattern.

This keeps the skill as the single source of truth for all GSC patterns seen in production.

**Mandatory final phase (every turn that modifies code related to SEO/indexing/GSC):**

The **last step before closing the response** must be to invoke the `gsc-indexing` skill (via the Skill tool with `skill: "gsc-indexing"`). This applies to any response that introduced a code change which could affect indexability:
- Redirects (`LEGACY_REDIRECTS`, middleware 301), sitemap updates, schema/JSON-LD changes
- New routes in `App.tsx` / `entry-server.tsx` / `seoPrerender.ts`
- robots.txt edits, canonical changes, render path changes
- Any of the patterns listed in `gsc-indexing/SKILL.md` (§A–§V)

Running the skill confirms that none of the documented anti-patterns were reintroduced and that the change still respects: trailing-slash 301, canonical autorreferencial, `Offer.price` numeric (never 0 as stub), MusicEvent inline fields, `isDynamicPattern` coverage, sitemap consistency, and the App.tsx ⇄ entry-server.tsx ⇄ seoPrerender.ts triple invariant.

Skip the skill invocation only when the change is purely:
- Documentation (CLAUDE.md, README, code comments) with no behavior change
- Tests unrelated to SEO render path
- Build tooling / dependencies with no SEO impact

When in doubt, run it.

---

## blogPosts.ts — Type Constraints

When adding entries to `BLOG_POSTS` in `apps/web/src/lib/blogPosts.ts`, enforce these types:

**`relatedLinks` items:** use `to:` (not `url:`).
```ts
// CORRECT
{ label: "Cómo funciona", to: "/como-funciona" }
// WRONG — TS2353
{ label: "Cómo funciona", url: "/como-funciona" }
```

**`category` field:** only these four values are valid:
- `"comparativas"`
- `"guias"`
- `"sostenibilidad"`
- `"novedades"`

`"consejos"` is **not** a valid category — use `"guias"` instead.

---

### Checklist before touching these files

Apply the 6 rules above mentally before saving changes to any of these:

- `apps/api/src/ingest/sources/ticketmaster.ts`
- `apps/api/src/db/schema.ts` (concerts / concertSources tables)
- `apps/api/src/routes/concerts.ts`
- `apps/web/src/pages/ConcertDetailPage.tsx`
- `apps/web/src/pages/AvisoLegalPage.tsx`
- `apps/web/src/pages/PrivacidadPage.tsx`
- `apps/web/src/components/Footer.tsx`
- `apps/web/src/lib/imageUrl.ts`
- `apps/web/public/images/` (new images)
- `apps/web/src/lib/blogPosts.ts` (verify no TM image URLs hardcoded)
- `apps/web/src/lib/seoOverrides.ts` (verify no TM-specific pricing data)
