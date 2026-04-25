# ConcertRide — Plan de Lanzamiento

> Documento vivo. Actualizar estado de cada tarea conforme se complete.
> Última revisión: 2026-04-24
>
> **Script de setup rápido:** `scripts/setup-production-secrets.sh` contiene todos los comandos `wrangler secret put` en orden con instrucciones inline.

---

## Estado de tareas

| Tarea | Estado |
|---|---|
| 1.1 Secrets en Wrangler (JWT, INGEST, TURSO, TM, VAPID x2) | ✅ Completado |
| 1.2 DB schema + 3 índices nuevos aplicados a producción | ✅ Completado |
| 1.2b Migración 0011 (license_reviews) | ✅ Schema en código — necesita `npm run db:push` en producción si falta |
| 1.2c Migración 0012 (trust/safety: banned_emails, audit_log, user fields) | ✅ Schema en código + SQL generado |
| 1.3 Resend + RESEND_API_KEY | ⏳ Pendiente (espera dominio concertride.es activo) |
| 1.4 ADMIN_USER_IDS: u_2a5956aa + u_ba0612cd (backup) | ✅ Completado |
| 1.5 Deploy en producción | ✅ Completado — https://concertride.alejandrolalaguna.workers.dev |
| 2.1 Backfill Ticketmaster + festivales | ✅ 870 conciertos, 179 venues en producción |
| 2.4 Verificar sitemap post-backfill | 🔜 Pendiente |
| 3.1 License verification manual (flujo admin) | ✅ Completado |
| 3.2 Índice rides.driver_id | ✅ Aplicado (migración 0010) |
| 4.1 Dashboard admin — métricas de plataforma | ✅ Completado |
| 4.2 Dashboard usuario — "Tu impacto" | ✅ Completado |
| 5.1 Middleware requireVerifiedEmail centralizado | ✅ Completado |
| 5.2 Errores silenciosos en frontend | ✅ Completado |
| 5.3 Validación fecha pasada en PublishRidePage | ✅ Completado |
| 5.4 Fix UX upload de carnet | ✅ Completado |

---

## Veredicto actual (2026-04-24)

| Dimensión | Estado | Bloqueante | Notas |
|---|---|---|---|
| Backend (seguridad/correctitud) | 8/10 | No | Trust/safety completo (ban system, audit log, license reviews) |
| Frontend (flujos/UX) | 8/10 | No | Error handling, validaciones, UX del carnet mejorado |
| Datos (catálogo real) | 9/10 | No | 870 conciertos + 179 venues en DB (Ticketmaster backfill) |
| SEO / GEO | 9/10 | No | Sitemap dinámico, robots.txt, /llms.txt, AI crawler allowlist |
| Operaciones (visibilidad fundador) | 8/10 | No | Admin dashboard + audit log + error tracking (Sentry listo) |
| Trust & Safety | 8.5/10 | No | Email verification, license review, ban system, abuse reports |

**Objetivo:** Beta privada lista. **Bloqueo para lanzamiento público:** Dominio concertride.es activo + RESEND_API_KEY configurado para emails transaccionales.

---

## FASE 1 — Infraestructura de producción (semana 1)
*Estas tareas deben completarse antes de hacer el primer deploy a producción. Sin ellas, el día 1 es un desastre silencioso.*

> **Atajo:** ejecuta `bash scripts/setup-production-secrets.sh` — guía interactiva para todos los `wrangler secret put` en orden.

---

### 1.1 Configurar secrets de Wrangler (JWT, Turso, Ticketmaster, VAPID)

**Por qué:** El fichero `wrangler.jsonc` ya tiene la URL de Turso y el entorno configurados. Lo que falta son los secrets que no se pueden commitear: JWT_SECRET (firma de sesiones), TURSO_AUTH_TOKEN (acceso a la DB), TICKETMASTER_API_KEY (ingestión), VAPID keys (push). Sin JWT_SECRET el Worker no arranca. Sin TURSO_AUTH_TOKEN va a MemoryStore y se borra en cada cold start.

**Estado actual:**
- `TURSO_DATABASE_URL`: ya en `wrangler.jsonc` → **mover a secret** (hecho en este commit: eliminado de `vars`)
- `TURSO_AUTH_TOKEN`: en `.dev.vars` → subir como secret
- `JWT_SECRET`: en `.dev.vars` con valor de dev inseguro → **generar uno nuevo para producción**
- `INGEST_SECRET`: en `.dev.vars` con valor de dev → **generar uno nuevo para producción**
- `TICKETMASTER_API_KEY`: `TUm1OiCZT8yLM19YIazz7ewDahFOywG5` → subir como secret
- `VAPID_PUBLIC_KEY` / `VAPID_PRIVATE_KEY`: en `.dev.vars` → subir como secrets (NO regenerar)

**Pasos:**

```bash
# 1. Autenticarse en Wrangler (si no está hecho)
wrangler login

# 2. JWT_SECRET — generar uno nuevo y seguro (NO copiar el de .dev.vars)
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
wrangler secret put JWT_SECRET
# → pegar el hex generado

# 3. INGEST_SECRET — generar otro hex distinto
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
wrangler secret put INGEST_SECRET

# 4. TURSO_DATABASE_URL
wrangler secret put TURSO_DATABASE_URL
# → libsql://concertride-alalaguna.aws-eu-west-1.turso.io

# 5. TURSO_AUTH_TOKEN — obtener token fresco en app.turso.tech
#    o via CLI: turso db tokens create concertride
wrangler secret put TURSO_AUTH_TOKEN

# 6. TICKETMASTER_API_KEY
wrangler secret put TICKETMASTER_API_KEY
# → TUm1OiCZT8yLM19YIazz7ewDahFOywG5  (confirmar en developer.ticketmaster.com)

# 7. VAPID keys — copiar EXACTAMENTE los valores de .dev.vars (no regenerar)
wrangler secret put VAPID_PUBLIC_KEY
# → BMVxuaS-Okq2dSixsAzMaepoNttackd-nWdSMUahQIXJZKh3iSgrr4uPEOwVqLsy5RwKBPsXuAa6HdKn8s9bfrc

wrangler secret put VAPID_PRIVATE_KEY
# → yD-1qF1lCy-_sbEKLA-2RkFLXJf8hIyu7gXydaJiPso
```

**Validación:**
```bash
wrangler secret list
# Debe mostrar: JWT_SECRET, INGEST_SECRET, TURSO_DATABASE_URL, TURSO_AUTH_TOKEN,
#               TICKETMASTER_API_KEY, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY
```

---

### 1.2 Aplicar migraciones a la DB de producción

**Por qué:** La DB de Turso tiene el schema vacío. Hay que aplicar las 11 migraciones en orden (`0000_` → `0010_`). La última (`0010_wet_lockjaw.sql`) añade el índice en `rides.driver_id`.

**Pasos:**
```bash
# Con las variables de entorno de producción
TURSO_DATABASE_URL=libsql://concertride-alalaguna.aws-eu-west-1.turso.io \
TURSO_AUTH_TOKEN=<token-de-produccion> \
npm run db:push --workspace=@concertride/api
```

**Verificar en Turso shell:**
```sql
-- Conectar: turso db shell concertride
SELECT name FROM sqlite_master WHERE type='table' ORDER BY name;
-- Debe mostrar: concerts, concert_sources, demand_signals, favorites,
--               messages, push_subscriptions, reports, reviews,
--               ride_requests, rides, users, venues

SELECT name FROM sqlite_master WHERE type='index' AND name IN (
  'ride_requests_unique_idx', 'rides_driver_idx'
);
-- Debe devolver 2 filas (las añadidas en los últimos commits)
```

**Validación:** Las 2 queries anteriores devuelven los resultados esperados.

---

### 1.3 Verificar dominio en Resend y configurar RESEND_API_KEY

**Por qué:** Todos los emails transaccionales (bienvenida + verificación, reset de contraseña, recordatorio 24h, confirmación de reserva) se envían desde `no-reply@concertride.es` via Resend. Sin el dominio verificado en Resend, los emails o rebotan o van a spam. Sin la API key en producción, se imprimen en stdout del Worker y nadie los recibe.

**Pasos:**
1. Ir a [resend.com](https://resend.com) → crear cuenta si no existe
2. **Domains → Add Domain → `concertride.es`**
3. Resend proporciona registros DNS — añadirlos en el panel DNS de tu registrador:
   - Registro TXT para SPF: `v=spf1 include:amazonses.com ~all`
   - Registro CNAME para DKIM (el nombre/valor específico lo da Resend)
4. Esperar verificación (5–30 min) hasta que Resend muestre estado "Verified"
5. **API Keys → Create API Key** → copiar
6. ```bash
   wrangler secret put RESEND_API_KEY
   ```

**Prueba end-to-end obligatoria antes de abrir al público:**
- Registrar un usuario real en producción → verificar que llega el email de bienvenida en bandeja de entrada (no spam)
- Pedir reset de contraseña → verificar que llega
- El email debe venir de `ConcertRide <no-reply@concertride.es>` (definido en `apps/api/src/lib/email.ts:17`)

**Validación:** Email de bienvenida recibido en bandeja principal desde `no-reply@concertride.es`.

---

### 1.4 Configurar ADMIN_USER_IDS con mínimo dos cuentas

**Por qué:** Solo hay un admin (`u_2a5956aa` del entorno de dev). En producción ese ID no existirá — hay que registrar la cuenta admin en producción, obtener su ID real, y añadir una cuenta de backup. Si la única cuenta admin se borra, no hay acceso al panel sin redesploy.

**Pasos:**
1. Hacer el primer deploy (tarea 1.5) para que la DB esté operativa
2. Registrar la cuenta admin principal en `https://concertride.es/register`
3. Ir a `https://concertride.es/api/auth/me` con esa sesión → copiar el campo `id` (formato `u_xxxxxxxx`)
4. Registrar una segunda cuenta de backup con otro email
5. Copiar también su ID
6. Editar `wrangler.jsonc`:
   ```jsonc
   "vars": {
     "ENVIRONMENT": "production",
     "SUPPORT_EMAIL": "alejandrolalaguna@gmail.com",
     "ADMIN_USER_IDS": "u_id_principal,u_id_backup"
   }
   ```
7. Redesploy: `npm run deploy`

**Validación:**
```bash
# Con sesión del usuario admin:
curl https://concertride.es/api/admin/me
# → {"ok":true,"user":{...}}

# Con sesión de usuario normal:
curl https://concertride.es/api/admin/me
# → 404 (correcto — opaco para no revelar que existe la ruta)
```

---

### 1.5 Primer deploy

**Por qué:** Una vez todos los secrets están configurados y el schema aplicado, el primer deploy pone la plataforma en marcha.

**Checklist previo:**
```
[ ] wrangler secret list muestra los 8 secrets del paso 1.1
[ ] RESEND_API_KEY configurado (paso 1.3)
[ ] DB schema aplicado (paso 1.2)
[ ] npm run type-check → 0 errores
[ ] npm test → todos los tests pasan
```

**Deploy:**
```bash
npm run build && npm run deploy
```

**Verificación post-deploy:**
```bash
# API viva
curl https://concertride.es/api/health
# → {"ok":true}

# DB conectada (no MemoryStore)
curl https://concertride.es/api/concerts
# → {"concerts":[],"total":0}  ← vacío es correcto aquí, lo llenamos en Fase 2
#   Si devuelve fixtures de dev (conciertos de ejemplo), algo va mal

# SPA carga
curl -I https://concertride.es/
# → 200 con content-type: text/html
```

---

## FASE 2 — Datos reales en catálogo ✅ Completado

**Estado:** 870 conciertos y 179 venues en producción (Ticketmaster + festivales independientes). Todos los festivales de `festivalLandings.ts` están presentes en la DB.

---

### 2.4 Verificar sitemap dinámico post-backfill

**Por qué:** Google indexará el sitemap. Si está vacío en el momento del primer crawl, la re-indexación puede tardar semanas.

**Pasos:**
1. Abrir `https://concertride.es/sitemap.xml` — debe listar `sitemap-static.xml` y `sitemap-concerts.xml`
2. Abrir `https://concertride.es/api/sitemap-concerts.xml` — debe listar URLs de conciertos reales
3. Si está vacío, es que el backfill no se ejecutó o la DB no está conectada
4. Enviar el sitemap a Google Search Console: Sitemaps → Add sitemap → `sitemap.xml`

**Validación:** `sitemap-concerts.xml` tiene al menos 50 URLs de conciertos.

---

## FASE 3 — License verification manual (semana 2)
*El trust badge "conductor verificado" es la propuesta de valor principal. Hoy es un stub que aprueba cualquier fichero. Hay que arreglarlo antes de que lleguen usuarios reales.*

---

### 3.1 Implementar flujo de verificación manual por el admin

**Por qué:** Implementar OCR automático es complejo y caro. La solución pragmática para beta es: el usuario sube el carnet, llega un email al admin, el admin revisa manualmente y aprueba o rechaza desde el panel de admin.

**Qué construir:**

**Backend** (`apps/api/src/routes/auth.ts`):
- Cuando llega `POST /auth/verify-license`, guardar el fichero en KV (como ya hace con fotos de mensajes) con TTL de 30 días
- Crear un registro en una nueva tabla `license_reviews` con: `user_id`, `file_kv_key`, `status` (pending/approved/rejected), `submitted_at`
- Enviar email al admin (SUPPORT_EMAIL) con: nombre del usuario, link al fichero en KV, link directo a la ruta de aprobación en el panel admin
- Devolver `{ status: "pending" }` al frontend en lugar de marcar `license_verified = true` inmediatamente

**Backend** (`apps/api/src/routes/admin.ts`):
- `GET /api/admin/license-reviews` — lista pendientes con link al fichero
- `POST /api/admin/license-reviews/:id/approve` — marca `license_verified = true` en el usuario, envía email al conductor notificando aprobación
- `POST /api/admin/license-reviews/:id/reject` — envía email al conductor con motivo, puede volver a intentarlo

**Frontend** (`apps/web/src/pages/ProfilePage.tsx`):
- Cambiar el estado post-upload de "verificando..." a "Solicitud enviada — revisaremos tu carnet en 24–48h"
- Mostrar badge "Pendiente de verificación" en amarillo mientras el admin no ha aprobado
- Mostrar badge "Verificado" en verde cuando `license_verified = true`

**Frontend** (`apps/web/src/pages/AdminReportsPage.tsx` o nueva página):
- Añadir una pestaña "Carnets" en el panel admin
- Mostrar nombre del usuario, fecha de solicitud, link para ver el fichero
- Botones: Aprobar / Rechazar (con campo de texto para motivo en rechazo)

**Validación completa:**
1. Usuario sube foto de carnet → recibe mensaje "Solicitud enviada"
2. Admin recibe email con link al fichero
3. Admin abre panel → pestaña Carnets → ve la solicitud pendiente
4. Admin hace click en el fichero → ve la imagen del carnet
5. Admin aprueba → usuario recibe email "Tu carnet ha sido verificado"
6. Usuario recarga perfil → aparece badge verde "Conductor verificado"
7. Usuario puede ahora publicar viajes

---

### 3.2 Índice en rides.driver_id — ✅ Aplicado (migración 0010)

El índice `rides_driver_idx` ya está en producción. No requiere acción.

---

## FASE 4 — Dashboard del admin y del usuario (semana 2–3)

---

### 4.1 Dashboard del admin — métricas de plataforma

**Por qué:** El fundador actualmente no puede ver nada sobre el estado de la plataforma. No sabe cuántos usuarios se han registrado, cuántos viajes hay publicados ni si el sistema funciona. Esto es inoperable.

**Qué construir:**

**Backend** — nuevo endpoint `GET /api/admin/stats`:
```typescript
{
  users: {
    total: number,
    verified_email: number,       // email_verified_at IS NOT NULL
    license_verified: number,     // license_verified = true
    new_last_7d: number,          // created_at > now - 7 days
  },
  rides: {
    total_active: number,         // status = 'active'
    total_all_time: number,
    published_last_7d: number,
    seats_available: number,      // SUM(seats_left) WHERE status = 'active'
  },
  bookings: {
    confirmed_all_time: number,   // ride_requests WHERE status = 'confirmed'
    confirmed_last_7d: number,
    pending: number,              // ride_requests WHERE status = 'pending'
  },
  concerts: {
    total: number,
    upcoming: number,             // date > now
    with_active_rides: number,    // conciertos que tienen al menos un ride activo
  },
  top_cities: Array<{ city: string; ride_count: number }>,  // top 5
}
```

**Frontend** — nueva sección en `/admin` (o ruta `/admin/dashboard`):
- 4 tarjetas de métricas: Usuarios / Viajes activos / Reservas confirmadas / Conciertos con viajes
- Tabla "Top ciudades de origen" (las 5 con más viajes)
- Tabla "Últimas solicitudes de verificación de carnet" (pendientes primero)
- Tabla "Últimos usuarios registrados" (10 más recientes, con columna email verificado sí/no)
- Acceso directo a la lista de carnets pendientes

**Validación:** Admin abre `/admin` → ve números reales. Si hay 0 de todo (DB vacía), muestra ceros, no spinner infinito.

---

### 4.2 Dashboard del usuario — perfil enriquecido

**Respuesta directa a tu pregunta:** Sí, tiene sentido. Pero no un dashboard de estadísticas generales de la plataforma (eso intimida a usuarios nuevos que ven que hay pocos rides). Lo útil para el usuario es una vista de "mi actividad" en su propio perfil.

**Qué añadir en `/perfil` o nueva ruta `/mi-actividad`:**

**Sección "Tu impacto"** (datos personales del usuario):
- Viajes dados como conductor: `rides_given` (ya existe en DB)
- Viajes compartidos como pasajero: COUNT de ride_requests confirmadas
- CO₂ ahorrado estimado (cálculo simple: viajes × km_promedio × 0.12 kg/km × (1 - 1/ocupantes))
- Valoración media como conductor (ya existe: `rating` + `rating_count`)

**Sección "Próximos viajes"** (mini-versión de Mis viajes, solo los próximos 2):
- Ya existe la lógica en `MyRidesPage.tsx` — reutilizar

**Sección "Conciertos guardados"** (favoritos, ya existe en `/favoritos`):
- Mostrar los 3 más próximos con link al detalle del concierto

**Por qué esto y no estadísticas de plataforma:**
- Las estadísticas globales (total rides, total usuarios) son un arma de doble filo: si son altas generan confianza, si son bajas en beta generan desconfianza. El impacto personal ("has ahorrado 45 kg de CO₂", "has dado 3 viajes") siempre funciona bien independientemente del estado de la plataforma.

**Validación:** Usuario con al menos un viaje publicado ve su sección "Tu impacto" con números reales, no ceros.

---

## FASE 5 — Calidad antes de abrir al público (semana 3) ✅ Completado

---

### 5.1 Hard-gate de email verification en middleware ✅

**Estado:** Implementado en `apps/api/src/lib/identity.ts`. Middleware `requireVerifiedEmail()` en uso en `rides.ts` y otros routes que requieren email verificado.

---

### 5.2 Fix estados de error silenciosos en frontend ✅

**Estado:** Error handling implementado en:
- `ConcertsPage.tsx` — muestra "Error al cargar" cuando la API falla
- `RideDetailPage.tsx` — error UI para caso `load_failed`
- `MyRidesPage.tsx` — error message con retry instructions

---

### 5.3 Validación de fecha pasada en PublishRidePage ✅

**Estado:** Validación implementada en `submit()` function:
- Verifica `new Date(form.manual_date) < new Date()`
- Verifica `new Date(form.departure_time) < new Date()`
- Muestra error si la fecha está en el pasado

---

### 5.4 Fix UX del upload de carnet en ProfilePage ✅

**Estado:** Mejoras implementadas en `ProfilePage.tsx`:
- Muestra nombre del fichero seleccionado (`selectedFileName`)
- Feedback en tiempo real: "Enviando..." durante la carga
- Animación `animate-pulse` mientras se sube

---

## FASE 6 — Operaciones (futuro — cuando esté el dominio concertride.es activo)

*Estas tareas se posponen intencionalmente hasta tener el dominio y tráfico real. Hacerlas antes es optimización prematura.*

---

### 6.1 Sentry — error tracking en producción

**Por qué:** Sin Sentry, los errores en producción son invisibles. El fundador se entera de los bugs cuando los usuarios escriben por email.

**Cuándo:** Cuando el dominio `concertride.es` esté activo y haya tráfico real (≥ 50 usuarios registrados).

**Pasos cuando llegue el momento:**
1. Crear proyecto en [sentry.io](https://sentry.io) (plan free aguanta bien)
2. Para el frontend (Vite/React): `npm install @sentry/react` y añadir DSN a `VITE_SENTRY_DSN`
3. Para el backend (Cloudflare Worker): añadir `SENTRY_DSN` como Wrangler secret
4. Verificar que errores de prueba aparecen en Sentry dashboard

---

### 6.2 PostHog — analytics de producto

**Por qué:** Sin analytics, el fundador no puede iterar basándose en comportamiento real. No sabe en qué paso del wizard de publicación se abandona, qué ciudades buscan más, qué porcentaje de visitas a una landing de festival acaban en registro.

**Cuándo:** Mismo momento que Sentry.

**Pasos cuando llegue el momento:**
1. Crear proyecto en [eu.posthog.com](https://eu.posthog.com) (GDPR compliant, EU hosting)
2. Añadir `VITE_POSTHOG_KEY` al build de producción
3. El banner de cookies ya está implementado y lanza PostHog tras consentimiento — solo falta la key

---

### 6.3 Dashboard de métricas públicas (opcional)

**Consideración:** Mostrar métricas públicas de plataforma ("X viajes compartidos", "Y kg de CO₂ ahorrados") puede aumentar la confianza social. Pero solo cuando los números sean suficientemente grandes para impresionar (>500 viajes). Antes de eso, mejor no mostrarlos o mostrar solo los del usuario individual.

**Cuándo:** Cuando haya ≥ 500 viajes completados en producción.

---

## Checklist de deploy

Antes de cada deploy a producción, verificar:

```
[ ] npm run type-check    → 0 errores
[ ] npm test              → todos los tests pasan
[ ] npm run build         → build exitoso sin warnings graves
[ ] wrangler secret list  → JWT_SECRET, INGEST_SECRET, TURSO_DATABASE_URL, TURSO_AUTH_TOKEN, RESEND_API_KEY, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY presentes
[ ] ADMIN_USER_IDS configurado con ≥ 2 IDs en wrangler.jsonc
[ ] sitemap-static.xml tiene lastmod actualizado
[ ] npm run deploy
[ ] GET /api/health → 200
[ ] Login funciona en producción
[ ] Enviar un email de prueba manualmente (registro de usuario real)
```

---

## Resumen de fases

| Fase | Qué | Cuándo | Bloqueante |
|---|---|---|---|
| 1 | Infraestructura (Turso, Resend, secrets) | Semana 1 | Sí |
| 2 | Datos reales (backfill + seed festivales) | Semana 1–2 | Sí |
| 3 | License verification manual + índice DB | Semana 2 | Sí |
| 4 | Dashboard admin + sección usuario | Semana 2–3 | No (pero necesario para operar) |
| 5 | Calidad frontend (errores, validaciones) | Semana 3 | No |
| 6 | Sentry + PostHog + métricas públicas | Futuro (tras dominio activo) | No |
