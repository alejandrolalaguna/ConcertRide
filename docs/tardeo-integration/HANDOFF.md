# ConcertRide × Tardeo.app — Handoff / Reanudar mañana

**Estado:** investigación previa COMPLETA y verificada. Workflow de diseño LANZADO y DETENIDO a petición del usuario el 2026-08-19 durante la Fase 1.
**Nada del workflow llegó a completarse** — los 5 agentes de recon estaban `started`, ninguno `completed`. No hay resultados cacheados que recuperar.
**Lo que sí está guardado y es reutilizable:** todos los hechos verificados por recon en vivo, la evidencia cruda, y el script del workflow hecho self-contained.

---

## 1. Cómo reanudar mañana (1 comando)

`resumeFromRunId` **NO sirve** — es same-session only, y mañana será sesión nueva. Por eso el script se ha horneado con los datos dentro.

Basta con decir en la sesión nueva:

> Reanuda el diseño de la integración con Tardeo: lanza el workflow de `docs/tardeo-integration/workflow.js`.

Lo que ejecutará:

```
Workflow({ scriptPath: "c:/Users/admin/Documents/GitHub/ConcertRide/docs/tardeo-integration/workflow.js" })
```

No hace falta pasar `args`: los hechos verificados están **inlineados** en el propio script (`BAKED_ARGS`), con fallback a `args` por si se quieren sobreescribir. Corre igual desde cero, en cualquier sesión.

Datos del run abortado, solo por si sirven de referencia (caducan con la sesión):
- Run ID: `wf_af7a4a7b-781`
- Transcript: `C:\Users\admin\.claude\projects\c--Users-admin-Documents-GitHub-ConcertRide\2e05ecd2-9db9-4426-ad7b-85d33b649002\subagents\workflows\wf_af7a4a7b-781`

---

## 2. Ficheros de este directorio

| Fichero | Qué es |
|---|---|
| `HANDOFF.md` | Este documento. Punto de entrada. |
| `workflow.js` | Workflow de 16 agentes / 6 fases, **self-contained**. Sintaxis validada. |
| `verified-facts.json` | Los hechos verificados en vivo el 2026-08-19 (misma copia que va inlineada en `workflow.js`). |
| `evidence/tardeo-sitemap.xml` | Sitemap crudo de tardeo.app, descargado 2026-08-19. 61 URLs. |
| `evidence/tardeo-act.html` | HTML crudo de una página de actividad servida a Googlebot. Prueba del SSR parcial y del JSON-LD. |

---

## 3. Qué hace el workflow (6 fases, 16 agentes)

1. **Recon** (5 en paralelo, sobre el repo real)
   - `data-model` — qué hace falta para representar un evento NO-concierto (tardeo/sesión DJ/afterwork) en el modelo actual.
   - `ingest` — anatomía completa del pipeline de ingest para especificar un `SourceAdapter` de Tardeo.
   - `seo-surface` — el triple invariante App.tsx ⇄ entry-server.tsx ⇄ seoPrerender, sitemaps, y **presupuesto de ficheros en `dist/`** por tipología.
   - `widget-tracking` — widget embebible + atribución de clics; detecta bloqueadores (CSP `frame-ancestors`, CORS).
   - `legal` — páginas legales a enmendar, RGPD del tracking cross-domain, derechos de imagen, checklist de acuerdo.
2. **Market** — ¿existe demanda real de carpooling a tardeos? Clasificación HIGH/MEDIUM/LOW por tipo de actividad, keywords, canibalización del moat festivalero, estacionalidad, y veredicto GO / GO-NARROW / NO-GO.
3. **Design** (3 arquitecturas independientes)
   - **A — Link-first, cero backend:** en producción en 7 días.
   - **B — Vertical "fiesta/tardeo" dentro de ConcertRide:** activo SEO duradero.
   - **C — Plataforma bidireccional / API-first:** ConcertRide como capa de movilidad para cualquier plataforma de eventos.
4. **Synthesize** — un único roadmap por fases, cada fase con condición de arranque medible, horas de fundador y criterio de kill.
5. **Spec** (4 en paralelo) — `web-implementation`, `api-implementation`, `partner-contract` (incluye el **email de respuesta a Xavi ya redactado** y la spec de enlazado en español), `risk-register`.
6. **Verify** (3 adversariales) — contra las restricciones duras de CLAUDE.md, contra la realidad del código, y crítico de completitud.

---

## 4. Hechos verificados el 2026-08-19 (no hace falta volver a comprobarlos)

### Tardeo.app

- **Stack:** SPA React (Vite, `/assets/index.BI5XdXfH.js`) con backend **Supabase** (`kzcowengsnnuglyrjuto.supabase.co`). Las imágenes las sirven ellos mismos desde su propio origen: `/media/activities/{uuid}/{uuid}.jpg`.
- **SSR:** inyectan meta en el `<head>` por evento — `<title>`, `description`, OG (imagen 1200×630), Twitter card, `canonical` y **un bloque JSON-LD `Event`**. El `<body>` es un esqueleto vacío hasta que monta el JS.
- **Escala:** el sitemap tiene **61 URLs** — 10 páginas core + **51 actividades**. Fase muy temprana.
- **`lastmod`** idéntico en todas (2026-08-18T22:10:02Z) → el sitemap se regenera dinámicamente.
- **Patrón de URL:** `/actividades/{slug-kebab}-{id8}`. Sin ciudad ni fecha en la ruta, sin taxonomía de categorías.
- **Secciones:** `/actividades`, `/communities`, `/explorar-perfiles`, `/sobre-tardeo`, `/soporte`, `/privacidad`, `/terminos`, `/cookies`, `/eliminar-cuenta`.
- **robots.txt:** todo permitido, sitemap declarado.
- **Apps nativas:** iOS `app-id=6758532375` + Android + Web.

**Huecos de su JSON-LD `Event`** (esto es la palanca de negociación — ConcertRide sabe hacer esto mucho mejor):
- Sin `offers`, sin `geo` (lat/lng), sin campo `url`, sin `performer`.
- `startDate` **sin offset de zona horaria** (`2026-08-22T19:30`).
- `location.name` contiene una **dirección de calle** en vez del nombre del recinto.
- `addressRegion` duplica `addressLocality`.

**Tipos de actividad vistos:** tardeos, sesiones DJ, afterworks, remember/retro 70s-80s-90s, beach clubs, rooftops, open airs, aniversarios de sala, festivales pequeños.

**Ciudades vistas:** Palma, Madrid, Barcelona, Málaga, Valencia, Gandía, Jávea, Noja, Ibiza, Maspalomas, Puerto Sherry, Segurilla.

**El corte estratégico clave:** una parte real de su catálogo son desplazamientos de verdad — Segurilla Remember Festival, Pompa Open Air Málaga, Maspalomas Vive Fest, Jávea Montgó, Noja, Gandía, Puerto Sherry, UNVRS Ibiza. Un rooftop en el centro de Madrid **no** lo es. La fase Market del workflow está para trazar esa línea con datos, no a ojo.

### ConcertRide

- `apps/web/dist/`: **9.188 ficheros** (tope Workers Free 20.000 → margen ~10.8K).
- 90 rutas en `App.tsx`.
- **Ya existe** `/widget/concert/:id` (`ConcertWidgetPage.tsx`), un widget iframe embebible con parámetros `?color=` y `?max=`. Es una oferta de apertura para Xavi mucho más fuerte que un enlace pelado.
- Adaptadores de ingest: `ticketmaster` (vivo), `dice` / `eventbrite` / `bandsintown` (stubs vía `_stub.ts`).
- Columnas de `concerts`: `id, name, artist, venue_id, date, image_url, ticketmaster_id, ticketmaster_url, official_url, lineup, genre, price_min, price_max, fingerprint, sources_json, created_at`.
- Helpers de tracking ya disponibles: `lib/utm.ts`, `lib/analytics-events.ts`, `lib/observability.ts` (PostHog con consent gating).

---

## 5. Estado del hilo de email

- **12 ago** — Xavi propone colaboración: Tardeo como capa de descubrimiento, ConcertRide resolviendo el "cómo llegar y volver".
- **16 ago** — Alejandro responde OK a empezar con enlaces simples.
- **17 ago** — Xavi pide dos cosas concretas: **(1)** cuál es la mejor forma de enlazar cada evento hacia ConcertRide, **(2)** algún tracking sencillo para medir clics.
- **18 ago** — Alejandro da el OK; sugiere banners tipo *"¿Buscas cómo llegar?"* / *"¿Te sobran plazas en tu coche?"*; propone una sección "fiesta"/"tardeos" en ConcertRide o ingesta vía API. Avisa de poca disponibilidad esta semana, más a partir del **24 de agosto**.

**Pelota en el tejado de ConcertRide.** El entregable que desbloquea la colaboración es la spec de enlazado + el email de respuesta — los produce el agente `spec:partner-contract` de la Fase 5.

---

## 6. Problemas centrales sin resolver (lo que el workflow debe atacar)

1. **Cold start.** Tardeo manda 100 clics, ConcertRide tiene ~0 viajes publicados para esos eventos. Hay que diseñar *alrededor* de eso, no taparlo.
2. **A qué URL enlazan.** Tardeo tiene nombre + fecha + ciudad + dirección de una actividad, pero **ningún `concert_id` de ConcertRide**. No existe hoy una landing que acepte esos parámetros.
3. **Efimeridad.** Una actividad de Tardeo muere en 7 días. Prerenderizar páginas para eventos que caducan genera oleadas de 404 en GSC (ver patrones §T de la skill `gsc-indexing`).
4. **Presupuesto de `dist/`.** Cualquier tipología programática nueva hay que presupuestarla ANTES contra el tope de 20.000 (9.188 usados).
5. **Canibalización.** El moat de ConcertRide es festival-first. Contenido de fiesta urbana puede diluir la autoridad temática.
6. **Bloqueadores del embed.** Hay que confirmar CSP `frame-ancestors` y CORS antes de prometerle a Xavi un iframe.

---

## 7. Restricciones duras que cualquier plan debe respetar

Están en `CLAUDE.md`; resumidas aquí para que no se pierdan en el handoff:

- **Nunca `git push`.** Commits solo si se piden explícitamente.
- **Nunca mencionar competidores de carpooling por nombre** en contenido visible.
- Único email visible permitido: **`help@concertride.me`**.
- **Nunca "Alejandro Lalaguna"** en contenido de producto → usar *"Equipo ConcertRide"*. (En el email privado a Xavi su nombre sí va, es correspondencia personal.)
- **Cloudflare Workers Free:** máx. 20.000 ficheros en `dist/`, máx. 25 MiB por asset.
- **Ticketmaster ToS:** no alojar imágenes TM, no exportar datos en bloque, mantener el link-back a `ticketmaster_url`.
- **Triple invariante GSC:** toda ruta nueva en `App.tsx` **y** `entry-server.tsx` **y** (si aplica) `seoPrerender.ts` / `prerender.mjs` / sitemap. Si falta una, Googlebot recibe un shell 404 con noindex.

---

## 8. Comandos de verificación tras cualquier cambio

```bash
npm run type-check
npm run build:web
find apps/web/dist -type f | wc -l          # debe quedar muy por debajo de 20000
find apps/web/dist -name "*.html" -size +5M # cualquier resultado es alarma
```

Y al cerrar cualquier cambio que toque SEO/indexabilidad, invocar la skill `gsc-indexing`.
