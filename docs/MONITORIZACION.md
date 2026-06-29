# Guía de monitorización y operaciones — ConcertRide

> Qué mirar, qué ejecutar y dónde, para vigilar usuarios, actividad, carnets, correo y salud del sitio.
> Última actualización: 2026-06-18.

---

## 0. Acceso rápido (TL;DR)

| Quiero… | Dónde / qué |
|---|---|
| Ver todo el dashboard (stats + usuarios + moderación) | Web: **`/admin/reports`** (logueado como admin) |
| Resumen de datos por terminal | `cd apps/api && npm run db:monitor` |
| Revisar carnets pendientes | `/admin/reports` → pestaña **Moderación** → "Carnets pendientes" |
| Desglose de una estadística | `/admin/reports` → pestaña **Resumen** → clic en cualquier tarjeta (`↗`) |
| Saber si el sitio responde | `curl -s -o /dev/null -w "%{http_code}" https://concertride.me/api/health` → `200` |
| Desplegar cambios | `npm run deploy` (build + wrangler) · el `git push` lo haces tú |

---

## 1. Panel de administración — `/admin/reports`

**Acceso:** inicia sesión con una cuenta cuyo `id` esté en `ADMIN_USER_IDS` (en `wrangler.jsonc`):
actualmente `u_2a5956aa` (alejandrolalaguna@gmail.com) y `u_ba0612cd` (admin.backup).
Si no eres admin, la página redirige a `/`.

⚠️ **Cookie por host**: la sesión es válida tanto en `concertride.me` (apex) como en `www.concertride.me`
(la cookie se setea con `domain=.concertride.me`). Aun así, abre el panel en el **mismo host** donde
iniciaste sesión para evitar líos. No abras los enlaces desde el email en una pestaña sin sesión.

### Tres pestañas (cada una carga sus datos al abrirse)

- **Resumen** — todas las estadísticas de la BD en tarjetas + gráficas (altas/viajes por día, top ciudades/conciertos, distribuciones).
  - **Cada tarjeta es clicable** (`↗`): abre un modal con el desglose detallado de esa métrica.
    Ej.: clic en *Favoritos* → qué usuario, a qué (concierto/artista/ciudad) y cuándo.
- **Usuarios** — tabla con buscador + verificaciones + contadores (viajes/reservas/favs/mensajes/reseñas).
  Clic en una fila → desglose por usuario (sus viajes, reservas, favoritos, mensajes, reseñas, asistencias).
- **Moderación** — reportes de abuso + carnets pendientes + baneo + (stats clásicas).

### Carnets de conducir (verificación de conductores)

Ruta: **Moderación → "Carnets pendientes"**.
- **Ver documento**: descarga/abre el carné vía fetch autenticado (no es un enlace directo — evita el 401 por host).
- **Aprobar** → el usuario queda `license_verified` y recibe email de confirmación.
- **Rechazar** (con motivo) → email al usuario con el motivo.
- Cuando un usuario sube carné, llega un email de aviso a `help@concertride.me` (ver §4).

---

## 2. Monitorización por terminal (Turso)

Script de solo lectura que resume la BD **excluyendo usuarios seed (`@example`)**.

```bash
cd apps/api
npm run db:monitor
```

- Lee las credenciales de `../../.env` (`TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`) automáticamente — no hay que pasar nada.
- Fichero: [`apps/api/scripts/monitor.mjs`](../apps/api/scripts/monitor.mjs).
- Muestra: nº usuarios (reales/verificados), usuarios recientes, viajes, reservas, favoritos,
  señales de interés, alertas de festival, **waitlist (`festival_demand`)**, **carnets pendientes**, mensajes.

**Otras herramientas de BD** (desde `apps/api/`):
| Comando | Para qué |
|---|---|
| `npm run db:studio` | Drizzle Studio (UI web para explorar/editar la BD) |
| `npm run db:push` | Aplicar cambios de schema a Turso |
| `npm run db:generate` | Generar migración desde el diff del schema |

> El esquema vive en [`apps/api/src/db/schema.ts`](../apps/api/src/db/schema.ts). Migraciones en `apps/api/drizzle/`.

### Resumen semanal a medida

Para un resumen "última semana" (usuarios nuevos, me gusta, carnets, etc.), crea un script puntual
con `@libsql/client` filtrando por `created_at >= 'YYYY-MM-DD'`. Patrón:

```js
import { createClient } from "@libsql/client";
const db = createClient({ url: process.env.TURSO_DATABASE_URL, authToken: process.env.TURSO_AUTH_TOKEN });
const SINCE = "2026-06-11"; // hace 7 días
// usuarios nuevos:
await db.execute(`SELECT email,name,created_at FROM users
  WHERE email NOT LIKE '%@example.%' AND created_at >= '${SINCE}' ORDER BY created_at DESC`);
// favoritos: tabla favorites · interés: demand_signals · carnets: license_reviews (submitted_at)
// alertas: festival_alerts · viajes: rides · reservas: ride_requests · conciertos: concerts (created_at)
```
Ejecútalo con el token en el entorno y bórralo al terminar (no dejar scripts con credenciales en el repo).

**Qué vigilar cada semana:**
- 👤 Usuarios nuevos y **% verificado de email** (los no verificados no publican/reservan).
- 🪪 **Carnets pendientes** (acción requerida — aprobar/rechazar).
- ❤️ Favoritos / 👀 señales de interés / 🚗 viajes publicados → si están a 0, los usuarios se registran pero **no actúan**: palanca de activación.
- 🔔 Alertas de festival (demanda por festival).

---

## 3. Salud del sitio y verificación post-deploy

```bash
B=https://concertride.me

# 1) API viva
curl -s -o /dev/null -w "health %{http_code}\n" $B/api/health            # → 200

# 2) Rutas SPA privadas NO deben dar 5xx (regresión histórica del 500 "immutable headers")
for p in /login /profile /admin/reports /favoritos /mis-viajes; do
  curl -s -o /dev/null -w "$p %{http_code}\n" "$B$p"                      # → 200 cada una
done

# 3) /login lleva noindex
curl -sI $B/login | grep -i x-robots-tag                                 # → noindex, nofollow

# 4) Endpoints admin protegidos (sin sesión → 401 JSON, no SPA)
for p in /api/admin/dashboard /api/admin/users-list /api/admin/breakdown/favorites_total; do
  curl -s -o /dev/null -w "$p %{http_code}\n" "$B$p"                      # → 401
done

# 5) Páginas SEO prerenderizadas para bots (deben traer contenido real)
curl -sA "Googlebot/2.1" $B/festivales/mad-cool | grep -c "application/ld+json"   # ≥ 1
```

> Auditoría SEO/indexación completa: usar la skill **`gsc-indexing`** (`.claude/skills/gsc-indexing/SKILL.md`).
> Cualquier cambio que toque rutas/redirects/canonical/schema/sitemap debe pasar por esa skill antes de cerrar.

---

## 4. Correo — entrante y saliente

### Saliente (la app envía)
- Proveedor: **Resend** (`RESEND_API_KEY`, secret del Worker). Código: [`apps/api/src/lib/email.ts`](../apps/api/src/lib/email.ts).
- Remitente: `ConcertRide <no-reply@concertride.me>` · **Reply-To: `help@concertride.me`**.
- Tipos: verificación de email, reset de contraseña, magic link, reserva pedida/aceptada/rechazada,
  recordatorios de viaje, reseña, demanda, **avisos de carné a admin**, ban.
- Si `RESEND_API_KEY` falta → los envíos son no-op (solo log). Confirmar que está como secret en producción:
  `wrangler secret list` (debe aparecer `RESEND_API_KEY`).

### Entrante (recibir en `@concertride.me`)
- Gestionado por **Cloudflare Email Routing** (los MX del dominio apuntan a `route1/2/3.mx.cloudflare.net`).
- Verificar configuración:
  ```bash
  # PowerShell:
  Resolve-DnsName concertride.me -Type MX        # → route1/2/3.mx.cloudflare.net
  Resolve-DnsName concertride.me -Type TXT       # → v=spf1 include:_spf.mx.cloudflare.net ~all
  ```
- **El reenvío a tu correo personal** se define en: **Cloudflare → dominio → Email → Email Routing → Routing rules**.
  Debe existir una regla `help@concertride.me → tu_correo_personal` (o catch-all) y el **destino debe estar verificado**
  (Cloudflare manda un email de confirmación; si no se pulsó, NO reenvía).
- ⚠️ Importante: como los emails de la app llevan `Reply-To: help@concertride.me`, **las respuestas de los usuarios
  van a esa dirección** → solo te llegan si el forwarding está activo.
- **Test de 10 s:** envía un correo a `help@concertride.me` desde tu Gmail; si te llega de vuelta, funciona.

---

## 5. Despliegue y límites de Cloudflare

```bash
npm run build      # build web + type-check API
npm run deploy     # build + wrangler deploy   (el git push lo haces tú, manualmente)
npm run type-check # tsc --noEmit en todos los workspaces
npm run test       # vitest (todos los workspaces)
```

**Límites duros del plan Workers Free** (rompen el `wrangler deploy` si se superan — ver detalle en `CLAUDE.md`):
- **≤ 20.000 archivos** en `apps/web/dist/`. Medir: `find apps/web/dist -type f | wc -l` (actual ~9.200, amplio margen).
- **≤ 25 MiB por asset**. Comprobar: `find apps/web/dist -name "*.html" -size +5M` (no debe salir nada).
- El control del nº de rutas lo hace el *popularity gate* en `apps/web/src/lib/routeLandings.ts`.

**Cron / ingesta de conciertos:** semanal, `"0 3 * * 1"` (lunes 3:00) en `apps/api/src/ingest/scheduled.ts`
(fuente: Ticketmaster Discovery API v2). No reducir la frecuencia (ToS).

---

## 6. Visibilidad de bots IA (GEO)

Endpoint admin: **`GET /api/admin/llm-bots?days=7`** — cuántas veces leyó cada crawler IA
(GPTBot, ClaudeBot, PerplexityBot, Google-Extended, etc.) y qué rutas. Útil para medir citabilidad en
ChatGPT/Perplexity/AI Overviews. Requiere sesión admin.

---

## 7. Tabla de referencia — archivos clave

| Archivo | Qué controla |
|---|---|
| `apps/web/src/pages/AdminReportsPage.tsx` | Panel admin (3 pestañas), revisión de carnets, baneo |
| `apps/web/src/components/AdminDashboardPanel.tsx` | Dashboard (Resumen), tabla Usuarios, modal de desglose |
| `apps/api/src/routes/admin.ts` | Endpoints `/api/admin/*` (dashboard, users-list, breakdown, license, ban) |
| `apps/api/src/store/{drizzle,memory}.ts` | `getAdminDashboard`, `listAdminUsers`, `getAdminBreakdown` |
| `apps/api/scripts/monitor.mjs` | Monitor por terminal (`npm run db:monitor`) |
| `apps/api/src/lib/email.ts` | Plantillas y envío de correo (Resend) |
| `apps/api/src/db/schema.ts` | Esquema de la base de datos |
| `apps/api/src/index.ts` | Middlewares Worker (redirects, noindex, canonical, HTTP→HTTPS) |
| `wrangler.jsonc` | Vars (`ADMIN_USER_IDS`, `SITE_URL`, `SUPPORT_EMAIL`), bindings, rutas |
| `.claude/skills/gsc-indexing/SKILL.md` | Patrones y auditoría de indexación Google |

---

## 8. Checklist rápida (rutina)

**Diario / cuando entres:**
- [ ] `/admin/reports` → Moderación → ¿carnets pendientes? ¿reportes nuevos?
- [ ] ¿Te llegan a tu correo los avisos de carné? (si no → revisar forwarding §4)

**Semanal:**
- [ ] `cd apps/api && npm run db:monitor` → usuarios nuevos, % verificado, actividad.
- [ ] Revisar si hay favoritos/viajes/reservas (>0) o si solo hay registros sin actividad.
- [ ] GSC: cobertura de índice y errores de datos estructurados.

**Tras cada deploy:**
- [ ] Health checks §3 (200 en rutas privadas, 401 en admin, noindex en /login).
- [ ] `find apps/web/dist -type f | wc -l` < 20.000 y sin assets > 25 MiB.
