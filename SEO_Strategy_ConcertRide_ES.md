# SEO Strategy — ConcertRide ES (Plan Completo)

*concertride.alejandrolalaguna.workers.dev | Actualizado: 25 abril 2026*

---
## 🔍 Situación de partida

ConcertRide es una plataforma de carpooling gratuita y sin comisiones para asistentes a conciertos y festivales en España. El sitio ya tiene:

- Páginas de festival individuales: Mad Cool, Primavera Sound, Sónar, FIB, BBK Live, Resurrection Fest, Viña Rock, Arenal Sound (16 festivales en total)

- Una guía de transporte para festivales (`/guia-transporte-festivales`)

- Schema.org implementado: SoftwareApplication, Organization, Service, LocalBusiness, ItemList

- Título y meta description bien optimizados en homepage

- Canonical apuntando a `https://concertride.es/` (dominio de producción)

---
## 🚨 Diagnóstico técnico post-migración Astro

> **La migración a Astro NO está funcionando.** El análisis del HTML confirma que el sitio sigue siendo una SPA Vite + Vue/React. No hay ningún atributo `data-astro-*` ni `astro-island` en el código. El contenido sigue siendo 100% JavaScript-rendered.

### Evidencias técnicas

### ¿Por qué sigue siendo SPA si migraste a Astro?

Hay varias causas posibles:

1. **El build de Astro no está siendo desplegado** — el Workers.dev sigue sirviendo el build antiguo de Vite/Vue.

2. **Astro está configurado en modo **`output: 'server'`** sin adaptador** — sin el adaptador de Cloudflare Workers, Astro no genera SSR.

3. **El componente principal sigue siendo un "island" de Vue/React** sin contenido estático en la shell de Astro.

4. **El deploy no apunta al directorio **`dist/`** de Astro** — sigue sirviendo el build anterior.

### Cómo arreglarlo (paso a paso)

#### Opción A — Astro SSG (recomendada para páginas de festival)

Para páginas estáticas como `/festivales/mad-cool`, usa Astro en modo SSG (Static Site Generation):

```
```
# `astro.config.mjs`

`
export default defineConfig({
  output: 'static',   // genera HTML estático en build
  // NO necesitas adaptador para SSG puro
})
`

Cada página de festival debe ser un archivo `.astro` con contenido en el template (no dentro de un componente Vue/React que se hidrata en cliente):

```
---
// src/pages/festivales/mad-cool.astro
const festival = { name: 'Mad Cool', ciudad: 'Madrid', ... }
```
---
# `Carpooling para Mad Cool 2026 — Comparte coche desde Madrid`

`Encuentra o publica un viaje compartido para el Mad Cool Festival...`

#### Opción B — Astro con adaptador Cloudflare (SSR)

Si necesitas contenido dinámico (viajes en tiempo real), usa SSR con el adaptador oficial:

```
npx astro add cloudflare
```
```
// astro.config.mjs
import cloudflare from '@astrojs/cloudflare';
export default defineConfig({
  output: 'server',
  adapter: cloudflare(),
})
```
#### Verificación post-deploy

Tras el deploy, verifica que funciona con:

```
curl -s https://concertride.es/festivales/mad-cool | grep "Debe devolver el H1 sin ejecutar JavaScript
```

Si devuelve el H1 → ✅ SSR/SSG funcionando. Si devuelve vacío → ❌ sigue siendo SPA.

#### El problema del PWA Service Worker

El Vite PWA plugin está registrando un Service Worker que puede estar sirviendo la versión cacheada antigua del sitio. Tras el deploy de Astro, fuerza la invalidación:

```
// Añade esto temporalmente para limpiar caches
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(regs => {
    regs.forEach(reg => reg.unregister());
  });
}
```
---
## 🏆 Panorama competitivo

**Conclusión**: El nicho de carpooling para festivales en España está **poco competido**. Los competidores directos (amicoche, vibescarpool) tienen autoridad SEO modesta. BlaBlaCar domina el carpooling general pero no está especializado en festivales. **ConcertRide tiene una oportunidad real de posicionarse como el referente de transporte compartido para festivales en España.**

### Análisis de competidores (actualizado)

**Ventaja de ConcertRide**: especialización 100% en festivales + sin comisiones. Ningún competidor tiene esto.

---
## 📂 Categorías de keywords a trabajar

### Categoría 1 — Carpooling general (transversal)

*Keywords de marca de categoría que posicionan la plataforma***Potencial**: Medio-alto. Amicoche ya rankea aquí (posición 2-6). ConcertRide puede competir con su diferencial (especialización en eventos). **Prioridad**: Medio plazo

---
### Categoría 2 — Transporte a festivales específicos

*Keywords de alta intención transaccional, estacionales pero de alto valor*

> ⚠️ Nota: Las herramientas de keyword no muestran volumen medible para estas keywords. Esto es normal para queries estacionales y de nicho — el volumen real existe (los SERPs lo confirman con resultados de medios como eldiario.es, elconfidencial.com, Ticketmaster blog). Son keywords de **alta intención y conversión directa** aunque el volumen anual sea bajo.

**Prioridad**: Alta (quick win potencial) — las páginas ya existen, hay que optimizarlas.

---
### Categoría 3 — Guías informacionales de transporte a festivales

*Contenido de blog que atrae tráfico orgánico y construye autoridad temática***Oportunidad**: Los medios (eldiario.es, elconfidencial.com, lasexta.com) rankean para estas queries con artículos informativos. ConcertRide puede competir con páginas de festival enriquecidas que incluyan guías de transporte completas. **Prioridad**: Medio plazo

---
### Categoría 4 — Comparativas y alternativas de transporte

*Keywords comerciales de usuarios decidiendo cómo ir***Prioridad**: Largo plazo

---
## 🗺️ Hoja de ruta por fases

### ⚡ Fase 1 — Fundación técnica (URGENTE, semanas 1-4)

> **Problema crítico**: El sitio es una SPA con JavaScript rendering. El contenido no existe en el HTML estático. Esto puede impedir que Google indexe correctamente las páginas.

**Acciones prioritarias:**

1. **Implementar SSR (Server-Side Rendering) o SSG (Static Site Generation)** — El contenido de cada página debe estar en el HTML inicial, sin depender de JavaScript para renderizarse. Opciones: Next.js, Nuxt.js, Astro, o pre-rendering.

1. **Verificar indexación** en Google Search Console: comprobar qué páginas están indexadas y cuáles aparecen como "Descubierta, no indexada" o "Rastreada, no indexada".

1. **Añadir H1 a cada página** — Actualmente no hay ningún H1 en el HTML estático. Cada página de festival debe tener un H1 claro con la keyword objetivo.

1. **Sitemap XML** — Asegurarse de que todas las páginas de festival están en el sitemap y enviado a GSC.

---
### 🎯 Fase 2 — Optimización de páginas de festival (semanas 4-12)

Las páginas `/festivales/[festival]` son el activo SEO más valioso. Cada una puede posicionarse para keywords de alta intención como "carpooling [festival]", "transporte [festival]", "cómo llegar a [festival]".

**Para cada página de festival:**

- H1 optimizado: "Carpooling para [Festival] — Comparte coche y divide gastos"

- Contenido textual rico: guía de transporte al festival, opciones (metro, bus, coche compartido), consejos prácticos

- FAQ estructurada (con schema FAQPage) sobre cómo llegar, dónde aparcar, etc.

- Internal linking entre páginas de festival y la guía general `/guia-transporte-festivales`

**Festivales prioritarios** (mayor volumen de búsqueda y competencia):

1. Mad Cool (Madrid) — mayor volumen de búsqueda

1. Primavera Sound (Barcelona)

1. Sónar (Barcelona)

1. BBK Live (Bilbao)

1. Arenal Sound (Burriana)

---
### 📝 Fase 3 — Contenido de autoridad temática (meses 3-6)

Publicar artículos de blog que posicionen a ConcertRide como el referente de transporte para festivales:

- "Cómo llegar al Mad Cool Festival: todas las opciones de transporte" (compite con eldiario.es, Ticketmaster blog)

- "Guía de transporte para los festivales de verano en España 2026"

- "Carpooling para festivales: cómo funciona y por qué es la mejor opción"

- "Los mejores festivales de música en España 2026: guía completa"

 Estos artículos deben enlazar internamente a las páginas de festival correspondientes.

---
### 🔗 Fase 4 — Autoridad y netlinking (meses 3-12, paralelo)

ConcertRide tiene **0 backlinks conocidos** actualmente. Los competidores tienen 35-62 dominios referentes. Para competir en keywords con algo de dificultad, es necesario construir autoridad.

**Estrategia de netlinking:**

- **PR y medios**: Contactar con medios de música y festivales (Mondosonoro, Rockdelux, festivales oficiales) para aparecer como solución de transporte recomendada.

- **Colaboraciones con festivales**: Intentar aparecer en las páginas "Cómo llegar" de los festivales oficiales (como Zmove aparece en Primavera Sound).

- **Directorios y apps**: Aparecer en directorios de apps, comparativas de carpooling, blogs de festivales.

- **Guest posts**: Artículos en blogs de viajes, música y festivales en España.

---
## 📊 Resumen de prioridades

---
## 💡 Diferencial competitivo a explotar en SEO

ConcertRide tiene un posicionamiento único que ningún competidor tiene:

- **Especialización 100% en conciertos y festivales** (vs. amicoche que es general)

- **Sin comisiones** (vs. BlaBlaCar)

- **Verificación de conductores** (confianza)

- **Chat de evento + vibe matching** (experiencia social)

 Este diferencial debe aparecer en los títulos, meta descriptions y contenido de todas las páginas estratégicas.