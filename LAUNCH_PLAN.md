# ConcertRide — Plan de Lanzamiento

> Documento vivo. Actualizar estado de cada tarea conforme se complete.
> Última revisión: 2026-04-24
>
> **Script de setup rápido:** `scripts/setup-production-secrets.sh` contiene todos los comandos `wrangler secret put` en orden con instrucciones inline.

---

## Veredicto actual

| Dimensión | Estado | Bloqueante |
|---|---|---|
| Backend (seguridad/correctitud) | 6/10 | Sí — license verification stub |
| Frontend (flujos/UX) | 7.5/10 | No |
| Datos (catálogo real) | 4/10 | Sí — vacío en día 1 sin backfill |
| SEO / GEO | 8.5/10 | No |
| Operaciones (visibilidad fundador) | 3/10 | Sí — sin analytics ni dashboard |

**Objetivo:** Lanzamiento de beta privada en ~3 semanas. Lanzamiento público cuando el catálogo esté validado y las operaciones sean observables.

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

## FASE 2 — Datos reales en catálogo (semana 1–2)
*Sin esta fase, los usuarios ven una app vacía.*

---

> La `TICKETMASTER_API_KEY` ya se configura en la Fase 1.1. Esta fase asume que el secret ya está subido a Wrangler.

### 2.1 Ejecutar backfill completo en local primero

**Por qué:** El backfill puede tardar varios minutos y hace muchas llamadas a Ticketmaster. Validar en staging antes de ejecutar en producción.

**Pasos:**
1. Configurar staging con las mismas variables que producción pero con una DB Turso diferente
2. Ejecutar:
   ```bash
   npx tsx apps/api/scripts/backfill-2026.ts
   ```
3. Revisar output — verifica qué conciertos se ingestan y qué errores aparecen
4. Comprobar en la DB de staging cuántos conciertos y venues se crearon:
   ```sql
   SELECT COUNT(*) FROM concerts;
   SELECT COUNT(*) FROM venues;
   SELECT city, COUNT(*) FROM venues GROUP BY city ORDER BY COUNT(*) DESC;
   ```
5. Navegar a `staging.concertride.es/concerts` y verificar que aparecen conciertos reales

**Validación:** Al menos 50 conciertos futuros en 2026 visibles en el catálogo de staging.

---

### 2.3 Seed manual de festivales no cubiertos por Ticketmaster

**Por qué:** Ticketmaster España NO cubre los festivales independientes más importantes: Resurrection Fest, Sonorama Ribera, Arenal Sound, Viña Rock, BBK Live, O Son do Camiño. Estos son exactamente los festivales con landing pages y para los que el carpooling tiene más valor (ubicaciones remotas, sin transporte público). Sin este seed, las landing pages tienen FAQs pero no muestran ningún viaje.

**Qué hacer:**
Crear `apps/api/scripts/seed-festivals-2026.ts` con los 16 festivales de `festivalLandings.ts`. Para cada festival:
- Verificar la fecha oficial en la web del festival antes de añadirla
- Crear el venue si no existe
- Crear el concierto con `ticketmaster_id = null` y `sources_json = '["manual"]'`

**Festivales a verificar y sus webs oficiales:**
| Festival | Web oficial | Fechas en landing page (verificar) |
|---|---|---|
| Mad Cool | madcoolfestival.es | 9–11 jul 2026 |
| Primavera Sound | primaverasound.com | 28 may–1 jun 2026 |
| Sónar | sonar.es | 18–20 jun 2026 |
| FIB Benicàssim | fiberfib.com | 16–19 jul 2026 |
| BBK Live | bbklive.com | 9–11 jul 2026 |
| Resurrection Fest | resurrectionfest.es | 25–28 jun 2026 |
| Arenal Sound | arenalsound.com | 29 jul–2 ago 2026 |
| Medusa Festival | medusafestival.es | 12–16 ago 2026 |
| Viña Rock | vinarock.com | 30 abr–3 may 2026 |
| O Son do Camiño | osondocamino.gal | 18–20 jun 2026 |
| Cala Mijas | calamijas.com | 2–4 oct 2026 |
| Sonorama Ribera | sonoramaribera.com | 6–9 ago 2026 |
| Low Festival | lowfestival.es | 24–26 jul 2026 |
| Tomavistas | tomavistas.com | 15–17 may 2026 |
| Cruïlla | cruillabcn.com | 9–12 jul 2026 |
| Zevra Festival | zevrafestival.com | Verano 2026 — confirmar |

**Pasos:**
1. Para cada festival, entrar en su web oficial y confirmar las fechas 2026
2. Si una fecha no está anunciada aún, NO añadir el concierto (mejor sin datos que con datos incorrectos)
3. Si hay fecha confirmada, añadirla al script con `official_url` correcto
4. Ejecutar en staging, verificar en `/concerts` que aparecen
5. Ejecutar en producción:
   ```bash
   TURSO_DATABASE_URL=... TURSO_AUTH_TOKEN=... npx tsx apps/api/scripts/seed-festivals-2026.ts
   ```

**Validación:** Los 16 festivales con fecha confirmada aparecen en `/concerts`. Las landing pages de festival muestran el concierto correspondiente en la sección "Próximos conciertos".

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

### 3.2 Añadir índice faltante en rides.driver_id

**Por qué:** `GET /api/rides?driver_id=X` (usado en "Mis viajes" y en el perfil del conductor) hace un table scan completo. Con 10k rides es lento.

**Pasos:**
1. Editar `apps/api/src/db/schema.ts`, en la tabla `rides`, cambiar el bloque de índices:
   ```typescript
   (t) => ({
     concertIdx: index("rides_concert_idx").on(t.concert_id),
     originIdx: index("rides_origin_idx").on(t.origin_city),
     driverIdx: index("rides_driver_idx").on(t.driver_id),  // añadir esta línea
   }),
   ```
2. Generar migración:
   ```bash
   npm run db:generate --workspace=@concertride/api
   ```
3. Verificar que el fichero SQL generado contiene `CREATE INDEX rides_driver_idx`
4. Push a producción:
   ```bash
   npm run db:push --workspace=@concertride/api
   ```

**Validación:** `EXPLAIN QUERY PLAN SELECT * FROM rides WHERE driver_id = 'x'` en Turso shell devuelve `SEARCH rides USING INDEX rides_driver_idx`.

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

## FASE 5 — Calidad antes de abrir al público (semana 3)

---

### 5.1 Hard-gate de email verification en middleware

**Por qué:** Actualmente la verificación de email se comprueba en cada ruta individualmente. Si se añade una nueva ruta y se olvida el check, cualquier usuario sin email verificado puede usarla. Más importante: es un código duplicado y difícil de auditar.

**Qué hacer:**
Crear un middleware `requireVerifiedEmail` en `apps/api/src/lib/identity.ts`:
```typescript
export async function requireVerifiedEmail(c: Context<HonoEnv>): Promise<User | Response> {
  const user = await requireUser(c);
  if (user instanceof Response) return user;
  if (!user.email_verified_at) {
    return c.json({ error: "email_not_verified", message: "Verifica tu email antes de continuar." }, 403);
  }
  return user;
}
```

Sustituir en `rides.ts` (publicar viaje, reservar plaza) y `concerts.ts` (crear concierto adhoc) los checks manuales dispersos por llamadas a este middleware.

**Validación:** Tests unitarios pasan. Intentar publicar un ride con un usuario sin email verificado devuelve 403 con `"email_not_verified"`.

---

### 5.2 Fix estados de error silenciosos en frontend

**Por qué:** Cuando una llamada API falla, varias páginas hacen `.catch(() => [])` y muestran "Sin resultados". El usuario no sabe si la app está rota o si simplemente no hay datos. En beta, cuando hay bugs, esto hace imposible el diagnóstico.

**Archivos a corregir:**
- `apps/web/src/pages/ConcertsPage.tsx` — el `.catch(() => { setConcerts([]); setTotal(0); })` debe cambiar a `catch(() => { setError("No se pudieron cargar los conciertos. Inténtalo de nuevo."); })`
- `apps/web/src/pages/RideDetailPage.tsx` — el `.catch(() => setConfirmedPassengers([]))` en la carga de pasajeros confirmados debe mostrar un mensaje sutil de error
- `apps/web/src/pages/MyRidesPage.tsx` — similar

**Validación:** Simular una caída de la API (apagando el dev server de la API) → el usuario ve un mensaje de error, no una página vacía.

---

### 5.3 Validación de fecha pasada en PublishRidePage

**Por qué:** En el modo de entrada manual de conciertos, el wizard acepta fechas pasadas. Un usuario distraído puede publicar un viaje a un concierto de ayer.

**Dónde:** `apps/web/src/pages/PublishRidePage.tsx`, en la función `submit()`, antes de llamar a `api.concerts.create()`:
```typescript
if (new Date(form.manual_date) < new Date()) {
  setError("La fecha del concierto no puede ser en el pasado.");
  return;
}
```

**Validación:** Intentar publicar un viaje con fecha manual en el pasado → aparece mensaje de error, el formulario no avanza.

---

### 5.4 Fix UX del upload de carnet en ProfilePage

**Por qué:** El input de fichero tiene clase `sr-only` (invisible). El usuario no sabe si hizo click en el lugar correcto ni si el fichero se seleccionó.

**Dónde:** `apps/web/src/pages/ProfilePage.tsx`

**Cambios:**
- Mostrar nombre del fichero seleccionado debajo del botón de upload una vez seleccionado
- Aumentar el área clickable (el label que activa el input)
- Mostrar estado "Subiendo..." mientras se hace la petición

**Validación:** Seleccionar un fichero → ver el nombre del fichero. Hacer click en "Subir" → ver "Subiendo...". Recibir respuesta → ver estado actualizado.

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
