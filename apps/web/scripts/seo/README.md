# SEO Automation Scripts

Scripts de automatización SEO para ConcertRide. **Ninguno modifica el código existente ni se ejecuta automáticamente.**

Todos los scripts generan output en `scripts/seo/output/` (ignorado por git).

---

## Estructura

```
scripts/seo/
├── README.md                    ← este archivo
├── generate-city-year-pages.mjs ← Script 1: páginas /conciertos/{city}-{year}
├── generate-routes.mjs          ← Script 2: análisis y gap-detection de /rutas/
├── generate-como-llegar.mjs     ← Script 3: dataset /como-llegar/{festival}
├── generate-sitemaps.mjs        ← Script 4: sitemaps divididos por tipo
├── audit-interlinking.mjs       ← Script 5: huérfanas, links rotos, sugerencias
├── audit-seo.mjs                ← Script 6: noindex, canonicals, 404, score
└── output/                      ← generado, ignorado por git
    ├── city-year-pages.json
    ├── city-year-sitemap.xml
    ├── CityYearPage.template.tsx
    ├── routes-full.json
    ├── routes-missing-seo.json
    ├── routes-sitemap.xml
    ├── seoOverrides-routes-patch.ts
    ├── como-llegar-pages.json
    ├── como-llegar-sitemap.xml
    ├── HOW_TO_GET_THERE_SEO-patch.ts
    ├── sitemap-festivales.xml
    ├── sitemap-conciertos.xml
    ├── sitemap-rutas.xml
    ├── sitemap-como-llegar.xml
    ├── sitemap-blog.xml
    ├── sitemap-index-split.xml
    ├── interlinking-audit.json
    ├── orphan-pages.json
    ├── interlinking-suggestions.json
    ├── seo-audit-report.json
    └── seo-issues-critical.json
```

---

## Script 1 — generate-city-year-pages.mjs

**Propósito:** Genera el dataset para páginas `/conciertos/{city}-{year}` (p.ej. `/conciertos/madrid-2026`).

**Queries objetivo:** "conciertos madrid 2026", "conciertos barcelona 2027"

**Ejecutar:**
```bash
node apps/web/scripts/seo/generate-city-year-pages.mjs
```

**Genera:**
- `output/city-year-pages.json` — 51 páginas (17 ciudades × 3 años: 2025, 2026, 2027)
- `output/city-year-sitemap.xml` — sitemap listo para copiar
- `output/CityYearPage.template.tsx` — componente React reutilizable

**Integrar (cuando se decida activar):**
1. Copiar `CityYearPage.template.tsx` → `src/pages/CityYearPage.tsx`
2. Crear `src/lib/cityYearPages.ts` importando el JSON
3. Añadir ruta en `App.tsx`: `<Route path="/conciertos/:slug" element={<CityYearPage />} />`
4. Exportar slugs en `entry-server.tsx` para que `prerender.mjs` los recoja

---

## Script 2 — generate-routes.mjs

**Propósito:** Analiza las 96+ páginas `/rutas/` existentes, detecta las que no tienen override SEO en `seoOverrides.ts` y genera el código listo para pegar.

**Queries objetivo:** "carpooling madrid viña rock", "viaje compartido donostia bbk live"

**Ejecutar:**
```bash
node apps/web/scripts/seo/generate-routes.mjs
```

**Genera:**
- `output/routes-full.json` — dataset completo de rutas con títulos/keywords optimizados
- `output/routes-missing-seo.json` — rutas sin override (gap de CTR)
- `output/routes-sitemap.xml` — sitemap completo de /rutas/
- `output/seoOverrides-routes-patch.ts` — código listo para pegar en `seoOverrides.ts`

**Integrar:**
- No requiere modificar código existente: las rutas ya están en `RouteLandingPage.tsx`
- Solo copiar el contenido de `seoOverrides-routes-patch.ts` en `ROUTE_SEO_IMPROVEMENTS`

---

## Script 3 — generate-como-llegar.mjs

**Propósito:** Analiza las páginas `/como-llegar/{festival}`, detecta festivales sin página activa, genera overrides SEO para los que faltan y datos estructurados de transporte.

**Queries objetivo:** "como llegar arenal sound", "bus viña rock", "lanzadera bbk live"

**Ejecutar:**
```bash
node apps/web/scripts/seo/generate-como-llegar.mjs
```

**Genera:**
- `output/como-llegar-pages.json` — dataset completo con datos de transporte
- `output/como-llegar-sitemap.xml` — sitemap de páginas activas
- `output/como-llegar-missing.json` — festivales sin página (pasos para activar)
- `output/HOW_TO_GET_THERE_SEO-patch.ts` — overrides para `seoOverrides.ts`

**Integrar:**
- Añadir slug en `HOW_TO_GET_THERE_SLUGS` en `howToGetThereSlugs.ts`
- Añadir override en `HOW_TO_GET_THERE_SEO` en `seoOverrides.ts`
- Reconstruir para que `prerender.mjs` genere el HTML

---

## Script 4 — generate-sitemaps.mjs

**Propósito:** Genera sitemaps divididos por tipo de contenido (festivales, conciertos, rutas, como-llegar, blog) más un índice maestro. Mejora la granularidad de indexación en GSC.

**Ejecutar:**
```bash
node apps/web/scripts/seo/generate-sitemaps.mjs
```

**Genera:**
- `output/sitemap-festivales.xml` — 16 festivales con image:image
- `output/sitemap-conciertos.xml` — 17 ciudades
- `output/sitemap-como-llegar.xml` — 15 páginas de transporte
- `output/sitemap-rutas.xml` — sample 30 rutas clave
- `output/sitemap-blog.xml` — 14 posts
- `output/sitemap-index-split.xml` — índice maestro

**Integrar (reemplaza el sitemap monolítico):**
1. Copiar XML generados a `apps/web/public/`
2. Reemplazar `sitemap.xml` con `sitemap-index-split.xml`
3. Para el sitemap completo de rutas usar el output de `generate-routes.mjs`

---

## Script 5 — audit-interlinking.mjs

**Propósito:** Audita el grafo de enlaces internos. Detecta páginas huérfanas, links rotos, páginas sin outbound links, y genera sugerencias de enlaces a añadir con anchor text optimizado.

**Ejecutar:**
```bash
node apps/web/scripts/seo/audit-interlinking.mjs
```

**Genera:**
- `output/interlinking-audit.json` — reporte completo con grafo de enlaces
- `output/orphan-pages.json` — páginas sin links entrantes (por severidad)
- `output/broken-internal-links.json` — links que apuntan a slugs inexistentes
- `output/interlinking-suggestions.json` — enlaces sugeridos por página

**Uso recomendado:**
- Ejecutar después de añadir nuevas páginas o posts
- Revisar `orphan-pages.json` — prioridad CRÍTICO y ALTO
- Implementar sugerencias en `relatedLinks` del `blogPosts.ts` o en los bloques de interlinking de las plantillas

---

## Script 6 — audit-seo.mjs

**Propósito:** Auditoría SEO completa del build de producción. Analiza HTML prerenderizado para detectar noindex, canonicals incorrectos, títulos fuera de rango, meta descriptions faltantes, schemas ausentes, y páginas no generadas.

**Prerequisito:** El build debe estar generado (`npm run build`)

**Ejecutar:**
```bash
# Primero construir
npm run build

# Luego auditar
node apps/web/scripts/seo/audit-seo.mjs
```

**Genera:**
- `output/seo-audit-report.json` — reporte completo con score 0–100
- `output/seo-issues-critical.json` — issues críticos (bloquean indexación)
- `output/seo-issues-all.json` — todos los issues ordenados por severidad

**Interpretar el score:**
| Score | Estado | Acción |
|-------|--------|--------|
| 90–100 | Excelente | Mantenimiento preventivo |
| 75–89 | Bueno | Corregir issues altos esta semana |
| 60–74 | Mejorable | Issues altos urgentes |
| < 60 | Crítico | Issues críticos bloquean indexación |

---

## Flujo de trabajo recomendado

### Auditoría semanal
```bash
# 1. Auditar SEO del build actual
npm run build && node apps/web/scripts/seo/audit-seo.mjs

# 2. Auditar interlinking
node apps/web/scripts/seo/audit-interlinking.mjs

# 3. Revisar gaps en rutas
node apps/web/scripts/seo/generate-routes.mjs
```

### Antes de deploy
```bash
# Verificar sitemaps están actualizados
node apps/web/scripts/seo/generate-sitemaps.mjs

# Auditoría completa
node apps/web/scripts/seo/audit-seo.mjs
```

### Al añadir nuevos festivales o posts
```bash
# Regenerar análisis de como-llegar
node apps/web/scripts/seo/generate-como-llegar.mjs

# Regenerar análisis de rutas
node apps/web/scripts/seo/generate-routes.mjs

# Comprobar interlinking
node apps/web/scripts/seo/audit-interlinking.mjs
```

---

## Notas importantes

- **Ningún script modifica el codebase automáticamente** — todo el output va a `output/`
- Los scripts son **idempotentes** — ejecutar múltiples veces produce el mismo resultado
- El directorio `output/` debe añadirse al `.gitignore`
- Los datos de festivales/ciudades están **espejados** en los scripts (no importan de TS directamente) — mantener sincronizados si se añaden nuevos festivales
- Para scripts que leen el SSR bundle (`dist-ssr/entry-server.js`), es necesario ejecutar `npm run build:ssr` previamente
