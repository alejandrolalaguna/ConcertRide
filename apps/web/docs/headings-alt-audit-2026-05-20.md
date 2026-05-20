# Headings & Alt-text Audit — 2026-05-20

Auditoría de `<img>` alt text + jerarquía de headings en `apps/web/src/{pages,components}`, alineada con:

- Google SEO Starter Guide (secciones Images + Headings)
  https://developers.google.com/search/docs/fundamentals/seo-starter-guide?hl=es
- WCAG 2.2 — 1.1.1 Non-text Content + 2.4.6 Headings and Labels

---

## Resumen del audit

Total `<img>` JSX tags auditados: **33** (across .tsx files in `apps/web/src`).

| Hallazgo | Count antes | Count después |
|---|---:|---:|
| `<img>` sin `alt=` | 0 | 0 |
| `alt=""` sin `aria-hidden`/`role="presentation"` | 5 | 0 |
| `alt` genérico (`"preview"`, `"imagen"`, `"foto"`) | 1 | 0 |
| `alt` correcto + descriptivo o aria-hidden adecuado | 27 | 33 |

Headings:

| Hallazgo | Count |
|---|---:|
| Pages sin `<h1>` | 0 |
| Pages con `>1 <h1>` real (no condicional) | 0 |
| `<h1>` en ramas mutuamente exclusivas (early-returns 404 / stage state) | 5 (correcto, no violación) |
| Saltos de nivel directos h2→h4 / h3→h5 | 0 |

Las 5 páginas con múltiples `<h1>` (`ConcertDetailPage`, `DriverProfilePage`, `PublishRidePage`, `RideDetailPage`, `VerifyEmailPage`) los colocan en ramas mutuamente exclusivas dentro del JSX (early-return de "no encontrado" o `stage === "ready" | "invalid"`). No es un problema porque sólo uno se renderiza en runtime.

---

## Fixes aplicados (10)

1. `apps/web/src/components/PlaylistPanel.tsx:125` — añadido `aria-hidden="true"` al `<img>` del álbum (era `alt=""` solo).
2. `apps/web/src/components/ChatPanel.tsx:325` — alt genérico `"preview"` → `"Vista previa de la foto adjunta"`.
3. `apps/web/src/components/ChatPanel.tsx:103` — alt enriquecido: `"Foto del punto de encuentro compartida en el chat"`.
4. `apps/web/src/components/ChatPanel.tsx:123` — alt enriquecido (lightbox): `"Foto ampliada del punto de encuentro compartida en el chat"`.
5. `apps/web/src/components/CrewAvatars.tsx:50` — `alt=""` → `alt={Avatar de ${user.name}}` (avatar real, no decorativo).
6. `apps/web/src/components/LiveActivityFeed.tsx:134` — añadido `aria-hidden="true"` (avatar del actor en feed, decorativo porque el nombre acompaña en texto adyacente).
7. `apps/web/src/components/landing/PastConcertsSection.tsx:30` — añadido `aria-hidden="true"` (imagen decorativa de fondo del card).
8. `apps/web/src/components/ui/index.tsx:88` — `alt={driver.name}` → `alt={Avatar del conductor ${driver.name}}` (descriptivo).
9. `apps/web/src/components/RideReviewsSection.tsx:61` — `alt={review.reviewer.name}` → `alt={Avatar de ${review.reviewer.name}, autor de la reseña}`.

(El #10 ya estaba bien — `ConcertCard.tsx:64` usa `alt={${concert.artist} — ${concert.venue.name}, ${concert.venue.city}}`, ejemplo de referencia.)

### No tocados a propósito

Imágenes con `aria-hidden="true"` y `alt=""` en componentes de landing (`Hero.tsx`, `FinalCTA.tsx`, `MapSection.tsx`, `StatsBar.tsx`, `TrustSection.tsx`, `RegistrationNudge.tsx`, `AdhocRidesSection.tsx`, `TestimonialsSection.tsx`, `DriverCTA.tsx`, y varias secciones de `LandingPage.tsx`). Son **decorativas** (fondos con `opacity-[0.04..0.07]`, parallax, gradients). El patrón actual `alt="" + aria-hidden="true"` es la práctica correcta por WCAG 1.1.1.

`BlogPostPage` y `FestivalLandingPage` no se tocan (territorio del agente G4 según las reglas del prompt).

---

## Heading hierarchy — fixes aplicados

Ninguno. Tras inspección manual de:

- `LandingPage.tsx` (h1 en `Hero`, h2 estructurados, h3 sólo dentro de cards de blog/secciones) — OK.
- `ConcertsPage.tsx` (1 h1, sin sub-headings problemáticos) — OK.
- `FestivalLandingPage.tsx` (1 h1) — OK.
- `RouteLandingPage.tsx` (1 h1, h2/h3 alternados correctamente) — OK.
- Pillars (`GuiaTransporteFestivalesPage`, `GuiaFestivalSinCochePage`) — OK.

Los casos con varios `<h1>` literales son todos en ramas mutuamente exclusivas. No es necesario degradarlos a `<h2>` porque sólo se renderiza uno en cada estado del componente.

---

## Cómo correr el script

```bash
node apps/web/scripts/audit-headings-and-alt.mjs
```

Sin flags. Recorre `apps/web/src/pages/*.tsx` + `apps/web/src/components/**/*.tsx` y genera:

- `apps/web/scripts/reports/headings-alt-YYYY-MM-DD.json`

Resumen en stdout:

```
[audit-headings-and-alt] scanned N .tsx files
  pages missing <h1>:                X
  pages with >1 <h1> (may be ok):    X
  files with heading level jumps:    X
  <img> without alt:                 X
  alt="" missing aria-hidden:        X
  generic alt (imagen/foto/etc):     X
```

Exit code siempre 0 (informativo). Se puede integrar en CI como warning.

---

## Checklist pre-publish

Antes de hacer merge de un nuevo componente o page:

- [ ] Cada `<img>` tiene atributo `alt=` (vacío o descriptivo).
- [ ] Si `alt=""`, va con `aria-hidden="true"` o `role="presentation"`.
- [ ] Si la imagen es **informativa** (avatar real, foto del punto de encuentro, poster de concierto, imagen de hero con contenido), el `alt` describe el contenido visual de forma específica (no "imagen", "foto", "preview").
- [ ] Página tiene exactamente 1 `<h1>` activo en runtime. Si hay múltiples literales en JSX, están en ramas mutuamente exclusivas (early return / `stage === X` switch).
- [ ] Saltos de heading respetan la jerarquía: h1 → h2 → h3 → h4. **Nunca h2 directamente a h4.**
- [ ] Run `node apps/web/scripts/audit-headings-and-alt.mjs` y revisar el JSON.
- [ ] No mencionar marcas restringidas (ver `CLAUDE.md`) en `alt` ni en headings.
