# Google Helpful Content + AI Disclosure — Implementation Notes (2026-05-20)

Aligns ConcertRide content with Google's official "Creating helpful, reliable,
people-first content" and "Using AI-generated content in Search" guidelines.

## 1. Resumen de las recomendaciones de Google (mayo 2026)

### Creating helpful, reliable, people-first content

Google evalúa el contenido con tres preguntas centrales: **Who?** (quién lo
creó, transparencia de autoría), **How?** (cómo se creó, especialmente si hay
IA implicada) y **Why?** (motivación — usuarios vs SEO).

Señales people-first que premia Google:

- Demonstrable **first-hand experience** del autor sobre el tema.
- **Authorship transparency**: nombre real, biografía, credibilidad
  comprobable.
- **Original research, data o análisis** propio, no reescritura de terceros.
- **Sources clearly cited** y atribuciones correctas.
- **Time and effort invested** evidente en el contenido (ej. tabla con datos
  primarios, no resumen de tres webs ajenas).
- Títulos descriptivos **sin sensacionalismo** ni clickbait.
- E-E-A-T: **Experience** + **Expertise** + **Authoritativeness** +
  **Trustworthiness**. Trustworthiness es la dimensión más crítica para
  topics YMYL (Your Money / Your Life), pero también para datos reproducibles
  (precios, tiempos, distancias) y para advertencias de seguridad.

Señales red flag:

- Mass content across many topics sin demostrar conocimiento real.
- Reescribir lo que dicen otros sin añadir valor.
- Seguir tendencias sin interés genuino.
- Promesas inexactas en títulos vs. contenido real.

### Using AI-generated content in Search

- Google **NO prohíbe** contenido generado o asistido por IA.
- Google **NO exige** disclosure obligatorio.
- Google **recomienda** "añadir información sobre cómo se ha utilizado la
  automatización" como buena práctica editorial.
- Lo que sí está prohibido como spam: **mass-produced low-value pages**,
  independientemente del método de creación (humano o IA).
- Standard de calidad es el mismo: cumplir guidelines, demostrar valor,
  experiencia, originalidad. Si el contenido final aporta valor, da igual el
  método.

## 2. Componentes creados

### `<EeatTrustBlock>` — `apps/web/src/components/EeatTrustBlock.tsx`

Bloque visible (no oculto a Google) que reúne las tres señales E-E-A-T más
importantes a nivel de página:

| Señal | Render |
|---|---|
| Authorship (Who?) | Avatar + nombre autor + link a `/autor/X` con `rel="author"` |
| Freshness (How?) | "Última revisión: {fecha legible}" con `<time datetime="">` |
| Methodology (Why?) | Link "¿Cómo lo hemos investigado?" → ancla o página |
| Trust disclaimer | Frase explícita sobre experiencia directa + verificación + revisión humana |

Props:

```ts
{
  pageType: "pillar" | "dataset" | "blog" | "festival",
  lastReviewed: string, // ISO YYYY-MM-DD
  author?: { name: string, url: string },
  methodologyHref?: string,
  className?: string,
}
```

Posición recomendada:

- **Pillars**: al final del article, antes del `</main>` (después de la última
  CTA section).
- **Datasets**: justo debajo de la H1 + download CTAs, con `methodologyHref` a
  `#metodologia` (sección que ya existe en cada dataset).
- **Blog**: opcional al final del post.
- **Festival**: opcional al final de la landing.

### `<AiDisclosureNote>` — `apps/web/src/components/AiDisclosureNote.tsx`

Nota de transparencia al pie del article. **NO se integra masivamente** —
queda disponible para el founder. Decisión por página según el contenido real.

Props:

```ts
{
  level: "ai-assisted" | "ai-drafted-human-reviewed" | "fully-human",
  className?: string,
}
```

Comportamiento:

- `"ai-assisted"`: render mensaje "redactado con asistencia de IA + revisión
  editorial humana".
- `"ai-drafted-human-reviewed"`: render mensaje "primer borrador IA +
  reescritura sustancial humana".
- `"fully-human"`: **devuelve `null`** (no renderiza nada — no se necesita
  disclosure cuando no hay IA).

Importante: el copy es **transparente, no defensivo**. Es una declaración
editorial de transparencia, no un mea culpa.

## 3. Criterios para decidir el `level` de cada página

Aplica el siguiente decision tree cuando publiques o edites una página:

1. ¿Has redactado el texto desde cero, sin pedirle a un LLM que escriba
   párrafos enteros, ni consultarle para definir estructura? → **`fully-human`**.
2. ¿Has usado un LLM para sugerir estructura, encontrar datos, pulir un
   párrafo o revisar redacción, pero la mayoría del contenido es tuyo y has
   verificado cada dato? → **`ai-assisted`**.
3. ¿El primer borrador completo lo ha generado un LLM y tú lo has reescrito
   sustancialmente (>50% del texto cambiado), verificado todos los datos
   contra fuentes y aprobado antes de publicar? → **`ai-drafted-human-reviewed`**.
4. ¿El LLM ha generado el contenido y no ha pasado por revisión humana real?
   → **NO publicar**. Esto entra dentro de "mass-produced low-value content"
   que Google bloquea como spam.

Cuando dudes entre `ai-assisted` y `fully-human`, prefiere `fully-human` si
realmente no hay aporte material de IA, o `ai-assisted` si la hay aunque
mínima. La transparencia se valora; la sobre-disclosure no penaliza.

## 4. Checklist E-E-A-T antes de publicar contenido nuevo

Para cada nueva guía, dataset, blog post o landing antes de hacer commit:

- [ ] La página tiene **author attribution visible** (link a `/autor/X`) con
  `rel="author"`.
- [ ] La página tiene **dateModified visible** (no solo en JSON-LD, también en
  el DOM) con `<time datetime="YYYY-MM-DD">`.
- [ ] Si hay datos cuantitativos (precios, distancias, tiempos), la **fuente
  está citada** explícitamente y es verificable.
- [ ] Hay al menos un párrafo de **experiencia first-person** o referencia
  concreta a observación directa del equipo (ej. "asistimos a Mad Cool 2025
  y..." o "testamos la ruta Madrid→Burriana en mayo 2025...").
- [ ] El **título no exagera** ni promete lo que el cuerpo no entrega.
- [ ] La **sección "Cómo lo investigamos" o "Metodología"** existe si la
  página tiene datos primarios.
- [ ] El `<EeatTrustBlock>` está integrado con `lastReviewed` actualizado.
- [ ] Si has usado IA en el proceso, el `<AiDisclosureNote level="...">`
  refleja honestamente el nivel.
- [ ] **No se menciona BlaBlaCar** (CLAUDE.md brand restriction).
- [ ] **TM compliance**: si la página usa datos de Ticketmaster, la
  attribution sigue los rules de CLAUDE.md §Ticketmaster Compliance.

## 5. Cobertura actual (2026-05-20)

### WAVE G1 (2026-05-20)

- 11/11 pillars con `<EeatTrustBlock pageType="pillar">` integrado.
- 9/9 dataset pages con `<EeatTrustBlock pageType="dataset">` integrado +
  ancla `#metodologia` para el link "¿Cómo lo hemos investigado?".
- `AutorAlejandroLalagunaPage` ampliada con sección "Cómo trabajamos el
  contenido" (6 bloques: experiencia, verificación, independencia, IA,
  revisiones, correcciones) y `dateModified` actualizado a 2026-05-20.
- `<AiDisclosureNote>` creado pero NO integrado por defecto. El founder
  decide caso a caso.

### Cobertura ampliada (WAVE G4, 2026-05-20)

Estrategia: integración una sola vez en cada template único de página,
cubriendo automáticamente todas las instancias renderizadas por `:slug`.

- 54/54 **festival landings** vía `FestivalLandingPage.tsx` (template único).
  El componente aparece al final del article, después del bloque de
  ciudades de origen y CTA "Publicar coche", justo antes del disclaimer
  legal. Se añade una sección `#fuentes-datos` con `scroll-mt-20` que
  enumera las fuentes (organización oficial, ayuntamientos, INE, APM, DGT,
  ALSA, Renfe) y registra la última verificación coordinada (2026-05-20).
  El `methodologyHref="#fuentes-datos"` ancla al bloque de fuentes recién
  creado.
- 283/283 **blog posts** vía `BlogPostPage.tsx` (template único).
  El componente aparece al final del article, después de las CTAs y antes
  de los "Más artículos" relacionados. `lastReviewed` resuelve a
  `post.updatedAt ?? post.publishedAt`, y el `author` se rellena con la
  byline del post sólo si `isFounderByline()` la reconoce como Alejandro /
  Equipo ConcertRide (link a `/autor/equipo-concertride`). Para bylines
  ajenos, se omite el author y se muestra sólo fecha + disclaimer.

### Total cobertura E-E-A-T (acumulada)

| Origen | Pages | Estrategia |
|---|---:|---|
| WAVE G1 — pillars | 11 | Integración por página |
| WAVE G1 — datasets | 9 | Integración por página |
| WAVE G4 — festival landings | 54 | Template único |
| WAVE G4 — blog posts | 283 | Template único |
| **Total** | **357** | — |

Beneficio: cubrimos ~357 páginas con un esfuerzo de 4 ediciones (2 imports
+ 2 inserciones JSX en los templates). Cualquier nuevo festival o blog
post añadido a futuro hereda automáticamente el trust block sin tocar
páginas.

## 6. Referencias

- https://developers.google.com/search/docs/fundamentals/creating-helpful-content?hl=es
- https://developers.google.com/search/docs/fundamentals/using-gen-ai-content?hl=es
- Google Search Central Blog — "AI overviews and the future of search content"
