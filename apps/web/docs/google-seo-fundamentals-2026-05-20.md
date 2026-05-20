# Google SEO Fundamentals — Resumen + Tooling (2026-05-20)

Resumen práctico de las tres guías oficiales de Google y cómo el repo las verifica.

## Fuentes

1. **SEO Starter Guide** — <https://developers.google.com/search/docs/fundamentals/seo-starter-guide?hl=es>
2. **Do I need SEO?** — <https://developers.google.com/search/docs/fundamentals/do-i-need-seo?hl=es>
3. **Get started with SEO** — <https://developers.google.com/search/docs/fundamentals/get-started?hl=es>

## Recomendaciones clave aplicables a ConcertRide

### Title tag

- Único por página, claro y conciso. Describe el contenido específico, no la marca repetida.
- Google no fija un máximo oficial; usamos `30–65` chars como ventana razonable
  (audit `apps/web/scripts/audit-meta.mjs` usa `40–65` como banda CTR-óptima
  y `audit-google-fundamentals.mjs` amplía el mínimo a `30`).
- Patrón ConcertRide: `[Bracket] Tema · Ciudad · 2026 | ConcertRide`.

### Meta description

- Breve, única por página, e incluye los puntos relevantes de la página.
- Ventana operativa: `70–160` chars (Google nunca ha fijado un máximo oficial,
  pero >160 se trunca en SERPs móviles).
- No es factor directo de ranking pero sí de CTR.

### Heading hierarchy

- Google explícitamente dice que la jerarquía H1-H6 no es bloqueante para
  Search ("From Google Search's perspective, it doesn't matter if you're using
  them incorrectly").
- A11y y semantic order sí importan para lectores de pantalla.
- Convención ConcertRide: **un solo `<h1>`** por página; el resto del
  contenido va con `<h2>`/`<h3>` jerarquizados.

### Internal linking — anchor text

- "Appropriate anchor text" tal que usuarios y motores puedan entender el
  destino antes de hacer click.
- Evitar texto genérico: `aquí`, `click aquí`, `leer más`, `ver más`,
  `más info`, `here`, `click here`, `more`, `read more`, `learn more`.
- Si el botón es icon-only o necesariamente corto, añadir `aria-label` con
  contexto.

### Image alt text

- Descriptivo y relacionado con la página. Ayuda a search engines a entender
  la imagen y el contenido.
- Excepciones: imágenes decorativas usan `role="presentation"` o
  `aria-hidden="true"` (no `alt=""` sin más).

### URL structure

- URLs descriptivas con palabras útiles (`/festivales/mad-cool` ✅ vs
  `/event/12345` ❌).
- Agrupar temas similares en directorios (`/festivales/`, `/conciertos/`,
  `/rutas/`, `/artistas/`, `/recintos/`).
- Excepciones permitidas: páginas de detalle internas (`/rides/:id`,
  `/concerts/:id`, `/squads/:id`) que ya van `noindex`.

### Snippet richness (structured data)

- Datos estructurados válidos habilitan rich results.
- ConcertRide ya emite ~116k schemas (Event, TouristTrip, FAQPage,
  BreadcrumbList, Article, Organization, Person, Dataset…).
- Validación CI: `npm run validate:schema`.

## Cómo correr los audits

```bash
# Audit principal — corre tras un build
node apps/web/scripts/audit-google-fundamentals.mjs

# Verbose: muestra hasta 20 samples por bucket
node apps/web/scripts/audit-google-fundamentals.mjs --verbose

# Si no hay dist/, hace fallback a auditoría de src/pages/*.tsx
```

Output:

- Resumen por stdout agrupado por categoría (h1, title, description, img alt,
  anchor text, URLs con IDs numéricos).
- Reporte JSON en `apps/web/scripts/reports/google-fundamentals-YYYY-MM-DD.json`.

**Exit code: siempre `0` (informativo).** No bloquea CI — solo flagea
oportunidades de mejora. Para gating duro seguimos usando `audit-meta.mjs`.

## Cómo usar `<DescriptiveLink>` en enlaces NUEVOS

`<DescriptiveLink>` es un helper opt-in que envuelve `<Link>` de
react-router-dom y avisa en desarrollo si el anchor text es genérico.

```tsx
import { DescriptiveLink } from "@/components/DescriptiveLink";

// OK — anchor descriptivo
<DescriptiveLink to="/festivales/mad-cool">
  Mad Cool Festival 2026 (Madrid)
</DescriptiveLink>

// Genérico pero con ariaLabel — también OK
<DescriptiveLink to="/concerts" ariaLabel="Buscar viajes a conciertos">
  Ver más
</DescriptiveLink>

// Genérico sin ariaLabel — console.warn en dev
<DescriptiveLink to="/concerts">Aquí</DescriptiveLink>
```

**No migrar enlaces existentes en masa.** Usar solo en componentes/páginas
nuevas. El audit estático en `audit-google-fundamentals.mjs` cubre el resto.

## Checklist pre-publish (para páginas nuevas)

- [ ] Un solo `<h1>` por página, descriptivo del tema principal.
- [ ] Jerarquía `<h2>` / `<h3>` ordenada (semántica + a11y).
- [ ] `<title>` entre `30–65` chars, único, incluye keyword principal.
- [ ] `<meta name="description">` entre `70–160` chars, único, incluye
      contexto + CTA implícito.
- [ ] Todas las `<img>` tienen `alt` descriptivo, o `role="presentation"` /
      `aria-hidden="true"` si son decorativas.
- [ ] Anchor text descriptivo en todos los `<a>` / `<Link>`. Si es icon-only,
      usar `aria-label`. Si es genérico, considerar `<DescriptiveLink>`.
- [ ] URL del path principal es slug, no ID numérico crudo.
- [ ] `<link rel="canonical">` apunta a URL absoluta HTTPS.
- [ ] Breadcrumb schema presente si la página es indexable.
- [ ] Si la página es noindex (auth, social, internal), confirmado en
      `useSeoMeta` o equivalente.

## Audits relacionados ya existentes

| Audit | Cubre |
|---|---|
| `audit-meta.mjs` | title/desc length, canonical absolute, h1 presente, breadcrumb schema, noindex leaks |
| `audit-internal-links.mjs` | gaps blog→festival, artist→festival, calendar→routes |
| `audit-uniqueness.mjs` | TF-IDF cosine entre páginas programáticas |
| `audit-schema-integrity.mjs` | JSON-LD parse errors, duplicates, common schema errors |
| `audit-cwv-static.mjs` | LCP/INP/CLS patterns estáticos (heroes, render-blocking, lazy) |
| `audit-google-fundamentals.mjs` | h1 únicidad, anchor text genérico, alt missing, URLs numéricas |

## Notas

- Esta guía no es el único factor SEO. Los pillars de la auditoría continúan
  siendo: contenido único, autoridad externa, CWV, schema, indexabilidad
  GSC, freshness.
- Google enfatiza expectativas realistas: resultados típicos `4–12 meses` tras
  cambios significativos.
- Más contexto interno: `CLAUDE.md`, `.claude/skills/gsc-indexing/SKILL.md`.
