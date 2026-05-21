# Gen AI Disclosure Policy — ConcertRide

Última actualización: 2026-05-20 (WAVE G6).

## Por qué existe esta política

Google publicó en 2026 dos documentos que orientan cómo tratar contenido producido o asistido por IA:

- [Using AI-generated content in Search](https://developers.google.com/search/docs/fundamentals/using-gen-ai-content?hl=es)
- [Creating helpful, reliable, people-first content](https://developers.google.com/search/docs/fundamentals/creating-helpful-content?hl=es)

Resumen práctico de la guía:

1. Google **no penaliza** contenido asistido por IA si es útil, original, fiable y orientado a personas.
2. Google **no exige** una etiqueta de "hecho por IA", pero **recomienda** dar contexto al lector cuando ayuda a establecer expectativas correctas sobre autoría y metodología.
3. Lo importante es la **calidad editorial** (E-E-A-T): experiencia directa, expertise, autoría reconocible, revisión humana, contraste con fuentes oficiales.

ConcertRide adopta una política mixta: **contenido editorial muestra disclosure visible; producto / UI / legal no lo muestra**, porque ahí no hay generación editorial sobre la que informar.

## Los tres niveles

| Nivel | Significado | Render |
|---|---|---|
| `fully-human` | Sin participación de IA en el contenido visible. | `<AiDisclosureNote>` devuelve `null` — no se muestra nada. |
| `ai-assisted` | La IA ayudó con investigación, estructura o redacción puntual. Humanos editaron y verificaron datos. | Nota corta al final del artículo. |
| `ai-drafted-human-reviewed` | La IA generó el primer borrador. Humanos reescribieron sustancialmente, contrastaron datos y aprobaron antes de publicar. | Nota corta al final del artículo. |

Las cadenas literales viven en `apps/web/src/components/AiDisclosureNote.tsx`. La política (page type → nivel) vive en `apps/web/src/lib/aiContentPolicy.ts`.

## Tabla page type → nivel

Esta tabla es la fuente de verdad. Cualquier cambio se aplica en `PAGE_TYPE_AI_LEVELS` (no en los componentes).

| Page type | Nivel | Razonamiento |
|---|---|---|
| `pillar` | `ai-drafted-human-reviewed` | Las 11 guías pillar (`/guia/*`) tienen >2.000 palabras de contenido editorial denso. La IA produce un primer borrador que el equipo reescribe, verifica contra fuentes oficiales y aprueba. |
| `dataset` | `ai-drafted-human-reviewed` | Los 9 datasets (`/datos/*`) llevan texto explicativo y metodología redactados con el mismo flujo borrador-IA + revisión humana. Los datos cuantitativos son del equipo, no de la IA. |
| `blog` | `ai-drafted-human-reviewed` | Los 283 posts del blog comparten el mismo flujo editorial. El template `BlogPostPage.tsx` renderiza la nota una sola vez y cubre toda la colección. |
| `festival` | `fully-human` | Las 67 páginas de festival (`/festivales/:slug`) se construyen a partir de datos estructurados curados por el equipo + texto fáctico. No hay generación editorial AI. |
| `route` | `fully-human` | Las 3.800+ rutas programáticas (`/rutas/:route`) son páginas product/SEO con datos cuantitativos (precio, km, tiempo). Sin redacción editorial AI. |
| `city` | `fully-human` | Idem rutas. |
| `region` | `fully-human` | Idem. |
| `artist` | `fully-human` | 67 páginas de artista con datos fácticos. |
| `venue` | `fully-human` | 41 páginas de recinto con datos fácticos. |
| `calendar` | `fully-human` | Páginas de calendario por mes — listados estructurados. |
| `genre` | `fully-human` | Páginas de género — listados estructurados. |
| `legal` | `fully-human` | Aviso legal, privacidad, cookies, términos — redactados por humanos sin IA. |
| `product` | `fully-human` | Landing, Concerts, Publish, Login, Crew, Squad, Profile, etc. UI de producto, no contenido editorial. |

## Cuándo cambiar la política

La política es decisión del founder. Razones legítimas para subir o bajar un nivel:

- **Subir a `ai-drafted-human-reviewed`**: una página antes humana ahora usa borrador AI como punto de partida.
- **Bajar a `fully-human`**: una página antes AI-drafted ha sido reescrita íntegramente por una persona.
- **Cambiar a `ai-assisted`**: usar SOLO si la IA participó de forma puntual (p. ej. un sub-apartado, una tabla) y el resto es humano. No es el caso actual en ConcertRide — la guía es: cuando dudemos, preferir `ai-drafted-human-reviewed` que es más explícito.

NUNCA se debe poner un nivel que no refleje la realidad. Esto es lo que Google penaliza con la guía de "Spammy automatically-generated content": etiquetar como humano lo que es 100 % IA, o producir contenido AI sin revisión humana real.

## Cómo añadir un nuevo page type

1. Identificar si la página es **editorial** (guía, artículo, dataset con narrativa) o **producto / programmatic / legal**.
2. Editar `apps/web/src/lib/aiContentPolicy.ts` y añadir la entrada en `PAGE_TYPE_AI_LEVELS`:
   ```ts
   export const PAGE_TYPE_AI_LEVELS: Record<string, AiDisclosureLevel> = {
     // ...existentes
     miNuevoTipo: "ai-drafted-human-reviewed",
   };
   ```
3. En el componente de página, importar y renderizar:
   ```tsx
   import AiDisclosureNote from "@/components/AiDisclosureNote";
   import { aiLevelForPageType } from "@/lib/aiContentPolicy";

   // ...al final del article body, justo después de <EeatTrustBlock>:
   <AiDisclosureNote level={aiLevelForPageType("miNuevoTipo")} />
   ```
4. Si el page type es `fully-human`, el componente devuelve `null` y no renderiza nada. Es seguro dejar el render en su sitio aunque luego decidas bajar el nivel.

## Compliance — cómo verificar alineación con Google

Antes de publicar cambios masivos de contenido o de añadir page types nuevos, comprobar:

1. **Foco en utilidad real**: ¿este contenido responde a una pregunta concreta de un usuario potencial de ConcertRide? Si la respuesta es no, no publicar (independientemente de si es IA o humano).
2. **Verificación de datos**: cualquier número (precio, km, tiempo, capacidad) debe estar contrastado con fuente oficial (organización festival, ALSA, Renfe, APM, INE, DGT, EEA). En `EeatTrustBlock` decimos exactamente eso.
3. **Autoría real**: la firma debe corresponder a una persona o equipo identificable. En ConcertRide la firma canónica es "Equipo ConcertRide" o "Equipo ConcertRide", y siempre enlaza a `/autor/equipo-concertride`.
4. **Revisión humana documentada**: no publicamos AI raw. La página `/autor/equipo-concertride` describe el flujo público de revisión (sección "Cómo trabajamos el contenido").
5. **Disclosure cuando corresponde**: si el nivel es distinto de `fully-human`, el componente `<AiDisclosureNote>` aparece al final del artículo. No es opcional para esos niveles.
6. **Coherencia entre páginas**: la nota visible en pillars / datasets / blog debe coincidir conceptualmente con lo declarado en `/autor/equipo-concertride`. Si cambias el copy de uno, revisa el otro.

## Implementación actual (estado al 2026-05-20)

- `<AiDisclosureNote>` integrado en:
  - 11 pillars: `apps/web/src/pages/Guia*.tsx` (todas excepto `PillarGuiaPage.tsx`, que es un sub-pillar agregador y se trata aparte si procede).
  - 9 datasets: `apps/web/src/pages/Dataset*2026Page.tsx`.
  - 1 template blog: `apps/web/src/pages/BlogPostPage.tsx` (cubre los 283 posts).
- No integrado en festival / route / city / region / artist / venue / calendar / genre / legal / product (todos `fully-human`).
- Helper de freshness: `apps/web/src/lib/freshness.ts` exporta `isFresh()` y `formatLastReviewed()`.
- Página de autor en `/autor/equipo-concertride` documenta política y flujo editorial públicamente.
