# ConcertRide — Plan SEO Técnico Completo
**Dominio objetivo:** `concertride.me` | **Fecha:** 2026-04-25

---

## 🔬 DIAGNÓSTICO: Por qué aparece "Priority 0 — Fix JavaScript Rendering"

### Qué verificación se hace

Se hace un `fetch_page_content` (petición HTTP GET estándar, sin ejecución de JavaScript — igual que lo haría Googlebot en su primera pasada o cualquier crawler básico).

### Qué petición se envía

```
GET https://concertride.alejandrolalaguna.workers.dev/concierto/coldplay-madrid-2026
GET https://concertride.alejandrolalaguna.workers.dev/artista/coldplay
GET https://concertride.alejandrolalaguna.workers.dev/ciudad/madrid
```
Headers estándar: `User-Agent: Mozilla/5.0 ...`, sin ejecución de JS.

### Qué se recibe (respuesta real del servidor)

**HTTP 200** — pero el `<body>` contiene esto:

```html
<div id="root">
  <!-- Spinner de carga -->
  <div class="flex flex-col items-center justify-center gap-3 py-12">
    <svg class="lucide lucide-loader-circle animate-spin">...</svg>
    <p class="animate-pulse">Cargando…</p>
  </div>
  <!-- Footer estático -->
  <footer>...</footer>
</div>
```

**Además**, todos los campos críticos son **idénticos** en TODAS las páginas:

| Campo | Valor recibido |
|---|---|
| `<title>` | `ConcertRide ES — Carpooling para conciertos en España \| Viajes compartidos` |
| `<meta description>` | `Carpooling para conciertos en España. Comparte coche...` |
| `<canonical>` | `https://concertride.me/` ← **apunta al home en TODAS las páginas** |
| Contenido del body | Solo spinner + footer |

### Qué se debería recibir

Para `/concierto/coldplay-madrid-2026`, el servidor debería devolver **sin ejecutar JS**:

```html
<title>Carpooling Coldplay Madrid 2026 — Viajes compartidos | ConcertRide</title>
<meta name="description" content="Encuentra o publica un viaje compartido al concierto de Coldplay en Madrid el 15 de junio de 2026. Sin comisiones.">
<link rel="canonical" href="https://concertride.me/concierto/coldplay-madrid-2026">

<body>
  <h1>Viajes compartidos al concierto de Coldplay — Madrid, 15 jun 2026</h1>
  <p>X plazas disponibles desde Barcelona, Valencia, Sevilla...</p>
  <ul>
    <li>Juan M. — Barcelona → Madrid — 2 plazas — 18€</li>
    ...
  </ul>
</body>
```

### Conclusión del diagnóstico

Tu sitio es una **SPA pura (React + Vite)** desplegada en Cloudflare Workers. El servidor devuelve un shell HTML vacío y delega todo el renderizado al navegador. Google puede renderizar JS, pero:

1. **Lo hace en diferido** (puede tardar días/semanas en crawlear y renderizar).
2. **El canonical apunta al home** en todas las páginas internas → Google las trata como duplicados del home y no las indexa individualmente.
3. **Title y description son genéricos** en todas las páginas → sin señal de relevancia por keyword.
4. **El contenido dinámico** (viajes, artistas, ciudades) nunca llega al crawler en la primera pasada.

---

## 📋 INVENTARIO DE PÁGINAS DETECTADAS

### Páginas estáticas (confirmadas en robots.txt y footer)

| Ruta | Tipo | Estado actual |
|---|---|---|
| `/` | Home | ✅ Existe — SPA shell |
| `/como-funciona` | Informacional | ⚠️ SPA shell |
| `/publicar-viaje` | Transaccional | ⚠️ SPA shell |
| `/buscar-viaje` | Transaccional | ⚠️ SPA shell |
| `/conciertos` | Listado | ⚠️ SPA shell |
| `/festivales` | Listado | ⚠️ SPA shell |
| `/artistas` | Listado | ⚠️ SPA shell |
| `/login` | Auth | 🚫 Disallow en robots.txt |
| `/register` | Auth | 🚫 Disallow en robots.txt |
| `/profile` | Auth | 🚫 Disallow en robots.txt |
| `/mis-viajes` | Auth | 🚫 Disallow en robots.txt |
| `/favoritos` | Auth | 🚫 Disallow en robots.txt |
| `/forgot-password` | Auth | 🚫 Disallow en robots.txt |
| `/reset-password` | Auth | 🚫 Disallow en robots.txt |
| `/admin` | Admin | 🚫 Disallow en robots.txt |

### Páginas dinámicas (confirmadas en sitemap)

| Patrón de ruta | Tipo | Estado actual |
|---|---|---|
| `/concierto/[slug]` | Página de concierto | ❌ SPA shell + canonical → home |
| `/artista/[slug]` | Página de artista | ❌ SPA shell + canonical → home |
| `/ciudad/[slug]` | Página de ciudad | ❌ SPA shell + canonical → home |

---

## 🗺️ PLAN COMPLETO POR PÁGINA

---

### 1. `/` — Home

**Objetivo SEO:** `carpooling conciertos España`, `viajes compartidos festivales`, `coche compartido conciertos`

**Estado actual:**
- ✅ Title y description correctos
- ✅ Canonical apunta a `concertride.me/`
- ✅ JSON-LD presente (Organization, WebSite, SoftwareApplication)
- ⚠️ Body solo tiene spinner + footer (sin H1, sin contenido visible sin JS)
- ⚠️ AggregateRating en JSON-LD con datos inventados (127 ratings, 4.8★) — **riesgo de penalización**

**Qué hacer:**

| # | Acción | Prioridad |
|---|---|---|
| 1 | Implementar SSR/SSG para el home (ver sección técnica) | 🔴 Crítico |
| 2 | Asegurar que H1 esté en el HTML inicial: `Carpooling para conciertos en España` | 🔴 Crítico |
| 3 | Renderizar en el HTML inicial: propuesta de valor, CTA, sección "Cómo funciona", 3-4 conciertos destacados | 🔴 Crítico |
| 4 | Eliminar el `AggregateRating` falso del JSON-LD hasta tener reseñas reales | 🟠 Importante |
| 5 | Añadir `FAQPage` JSON-LD con preguntas reales del negocio | 🟡 Recomendado |

---

### 2. `/como-funciona`

**Objetivo SEO:** `cómo funciona carpooling conciertos`, `compartir coche concierto`, `cómo publicar viaje concierto`

**Estado actual:**
- ❌ No hay title/description específico (hereda el genérico del home)
- ❌ SPA shell sin contenido

**Qué hacer:**

| # | Acción | Prioridad |
|---|---|---|
| 1 | SSR/SSG con title específico: `Cómo funciona ConcertRide — Carpooling para conciertos en España` | 🔴 Crítico |
| 2 | Meta description única enfocada al proceso | 🔴 Crítico |
| 3 | Canonical: `https://concertride.me/como-funciona` | 🔴 Crítico |
| 4 | H1: `Cómo funciona el carpooling para conciertos` | 🔴 Crítico |
| 5 | Añadir `HowTo` JSON-LD con los pasos del proceso | 🟠 Importante |
| 6 | Añadir `FAQPage` JSON-LD con dudas frecuentes | 🟡 Recomendado |

---

### 3. `/conciertos`

**Objetivo SEO:** `conciertos España 2026`, `agenda conciertos España`, `conciertos próximos España`

**Estado actual:**
- ❌ Title/description genérico
- ❌ SPA shell — listado de conciertos no visible sin JS
- ❌ Canonical → home

**Qué hacer:**

| # | Acción | Prioridad |
|---|---|---|
| 1 | SSR/SSG con title: `Conciertos en España 2026 — Carpooling disponible \| ConcertRide` | 🔴 Crítico |
| 2 | Canonical: `https://concertride.me/conciertos` | 🔴 Crítico |
| 3 | Renderizar el listado de conciertos en HTML inicial (al menos los primeros 20) | 🔴 Crítico |
| 4 | H1: `Conciertos en España con carpooling disponible` | 🔴 Crítico |
| 5 | Añadir `ItemList` JSON-LD con los conciertos del listado | 🟠 Importante |
| 6 | Paginación con `rel="next"` / `rel="prev"` si hay múltiples páginas | 🟡 Recomendado |

---

### 4. `/festivales`

**Objetivo SEO:** `festivales España 2026`, `carpooling festivales música`, `viaje compartido festival`

**Estado actual:**
- ❌ Title/description genérico
- ❌ SPA shell
- ❌ Canonical → home

**Qué hacer:**

| # | Acción | Prioridad |
|---|---|---|
| 1 | SSR/SSG con title: `Festivales de Música en España 2026 — Carpooling \| ConcertRide` | 🔴 Crítico |
| 2 | Canonical: `https://concertride.me/festivales` | 🔴 Crítico |
| 3 | Renderizar listado de festivales en HTML inicial | 🔴 Crítico |
| 4 | H1: `Festivales de música en España con viaje compartido` | 🔴 Crítico |
| 5 | `ItemList` JSON-LD con los festivales | 🟠 Importante |

---

### 5. `/artistas`

**Objetivo SEO:** `artistas conciertos España`, `tours España 2026`

**Estado actual:**
- ❌ Title/description genérico
- ❌ SPA shell
- ❌ Canonical → home

**Qué hacer:**

| # | Acción | Prioridad |
|---|---|---|
| 1 | SSR/SSG con title: `Artistas en Gira por España 2026 — ConcertRide` | 🔴 Crítico |
| 2 | Canonical: `https://concertride.me/artistas` | 🔴 Crítico |
| 3 | Renderizar listado de artistas en HTML inicial | 🔴 Crítico |
| 4 | H1: `Artistas de gira por España — Encuentra tu viaje compartido` | 🔴 Crítico |

---

### 6. `/publicar-viaje`

**Objetivo SEO:** `publicar viaje compartido concierto`, `ofrecer plazas concierto`

**Estado actual:**
- ❌ Title/description genérico
- ❌ SPA shell

**Qué hacer:**

| # | Acción | Prioridad |
|---|---|---|
| 1 | SSR/SSG con title: `Publica un Viaje a un Concierto — Gratis \| ConcertRide` | 🔴 Crítico |
| 2 | Canonical: `https://concertride.me/publicar-viaje` | 🔴 Crítico |
| 3 | H1 + descripción del proceso visible sin JS | 🔴 Crítico |
| 4 | El formulario puede seguir siendo client-side | ✅ OK |

---

### 7. `/buscar-viaje`

**Objetivo SEO:** `buscar viaje compartido concierto`, `encontrar coche concierto`

**Estado actual:**
- ❌ Title/description genérico
- ❌ SPA shell

**Qué hacer:**

| # | Acción | Prioridad |
|---|---|---|
| 1 | SSR/SSG con title: `Busca un Viaje Compartido a tu Concierto \| ConcertRide` | 🔴 Crítico |
| 2 | Canonical: `https://concertride.me/buscar-viaje` | 🔴 Crítico |
| 3 | H1 + descripción visible sin JS | 🔴 Crítico |
| 4 | El buscador/filtros pueden ser client-side | ✅ OK |

---

### 8. `/concierto/[slug]` — Páginas de concierto individual ⭐ MÁS IMPORTANTE

**Ejemplo:** `/concierto/coldplay-madrid-2026`

**Objetivo SEO:** `carpooling coldplay madrid 2026`, `viaje compartido coldplay madrid`, `coche compartido concierto coldplay`

**Estado actual:**
- ❌ Title genérico (igual que home)
- ❌ Description genérica
- ❌ **Canonical apunta a `concertride.me/`** → Google las ignora como duplicados del home
- ❌ SPA shell — ningún dato del concierto visible sin JS
- ❌ JSON-LD idéntico al home (no específico del concierto)

**Qué hacer:**

| # | Acción | Prioridad |
|---|---|---|
| 1 | SSR con datos del concierto en el HTML inicial | 🔴 URGENTE |
| 2 | Title dinámico: `Carpooling [Artista] [Ciudad] [Fecha] — Viajes compartidos \| ConcertRide` | 🔴 URGENTE |
| 3 | Description dinámica con artista, ciudad, fecha y plazas disponibles | 🔴 URGENTE |
| 4 | **Canonical correcto**: `https://concertride.me/concierto/[slug]` | 