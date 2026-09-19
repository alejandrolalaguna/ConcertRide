# ConcertRide · Sistema de diseño de la capa comercial

Versión 1 · 2026-09-19 · Rama `redesign/capa-comercial-wow`

Este documento es la fuente de verdad del rediseño de la capa comercial (home, /concerts,
festivales, ciudades, rutas, blog, pillar pages y componentes compartidos). Cada regla es
comprobable mirando una pantalla. Si una regla no se puede comprobar, se borra.

---

## 1. Intención

**"Vais al mismo festival. Id en el mismo coche."**

El sitio se lee como el cartel de un festival pegado en un poste a las tres de la mañana:
dice adónde, cuándo, por cuánto y con quién, en letras enormes sobre negro, con una sola luz
de escenario encendida. Nada decorativo compite con el dato. Lo que tiene imagen es tarjeta;
todo lo demás es tipografía sobre filetes.

### Do / Don't

| Do | Don't |
|---|---|
| Un acento por viewport: lima. | Lima y naranja compitiendo en el mismo bloque. |
| Tarjeta sólo cuando hay imagen real (póster de Ticketmaster desde su CDN). | Tarjetas con icono + título + dos líneas. |
| Registro de 12 columnas con filete de 1 px para listas de texto. | Cajas con borde para separar cosas que ya separa el tamaño del texto. |
| Ritmo vertical variable: `--rhythm-1/2/3`. | Todas las secciones con el mismo `py-24`. |
| Datos en Inter con `tabular-nums` y mayúsculas espaciadas. | Fuente mono descargada para etiquetas. |
| Cifras sólo si salen del catálogo (`FESTIVAL_LANDINGS.length`, `ROUTE_SLUGS.length`). | "+2k fans", "60 % de ahorro", tickers de "María se ha unido". |
| Fondo `#080808` plano con ruido al 3,5 % en heros de Nivel A. | Fotos de stock al 4 % de opacidad como textura. |
| Un bucle por página: el punto vivo de 2,2 s junto a un dato real. | Marquesinas, orbes, anillos, brillos y flotaciones simultáneos. |

---

## 2. Tokens

Todos en `apps/web/src/index.css` dentro de `@theme inline` (colores, fuentes, escala, radios,
sombras) y en `:root` (movimiento, ritmo). **Cero hex escritos a mano en JSX.**

### Color

| Token | Valor | Uso |
|---|---|---|
| `--color-cr-bg` | `#080808` | Fondo de página. |
| `--color-cr-surface` | `#0e0e10` | Superficie de tarjeta y menús. |
| `--color-cr-surface-2` | `#151517` | Hover de fila, inputs. |
| `--color-cr-surface-3` | `#1c1c1f` | Skeletons. |
| `--color-cr-border` | `#232326` | Filete estándar (1 px). |
| `--color-cr-border-mid` | `#38383d` | Filete de controles. |
| `--color-cr-primary` | `#dbff00` | **El único acento.** CTA primario, foco, dato clave, filete lima. |
| `--color-cr-primary-dim` | `#b3d100` | Hover del CTA primario. |
| `--color-cr-secondary` | `#ff4f00` | Señal de demanda real ("N buscan viaje"), avisos, PASADO. Nunca como segundo acento decorativo. |
| `--color-cr-text` | `#f0f0f4` | Texto principal. 17,4:1 sobre bg. |
| `--color-cr-text-muted` | `#9094a8` | Texto secundario. 5,0:1 sobre bg, AA. |
| `--color-cr-text-dim` | `#3c3c50` | Sólo placeholders y filetes tipográficos. No para texto legible. |
| `--color-cr-text-inverse` | `#080808` | Texto sobre lima. |

Los acentos espectrales (`violet`, `pink`, `teal`, `amber`) siguen existiendo para el producto
autenticado (`Badge` de vibe) y **no se usan en la capa comercial**.

Lima sobre negro: 18,4:1. Negro sobre lima: 18,4:1. Naranja sobre negro: 5,9:1 (AA en texto normal).

### Tipografía

Dos familias. Cuatro pesos.

| Rol | Familia | Peso | Token de tamaño | Tracking | Interlínea |
|---|---|---|---|---|---|
| Display XL (hero home) | Archivo Black | 400 | `--text-display-xl` = `clamp(2.75rem, 1.2rem + 7vw, 7rem)` | −0.02em | 0.88 |
| Display L (h1 landings) | Archivo Black | 400 | `--text-display-l` = `clamp(2.25rem, 1rem + 4.5vw, 4.75rem)` | −0.02em | 0.92 |
| Display M (h2) | Archivo Black | 400 | `--text-display-m` = `clamp(1.625rem, 1rem + 2.2vw, 2.75rem)` | −0.01em | 0.95 |
| Display S (h3, tarjeta) | Archivo Black | 400 | `--text-display-s` = `1.375rem` | 0 | 1 |
| Lead | Inter | 400 | `--text-lead` = `clamp(1.0625rem, 0.95rem + 0.5vw, 1.25rem)` | 0 | 1.55 |
| Cuerpo | Inter | 400 | `1rem` | 0 | 1.6 |
| Cuerpo fuerte | Inter | 500 | `1rem` | 0 | 1.6 |
| Pequeño | Inter | 400 | `0.875rem` | 0 | 1.5 |
| Etiqueta / dato | Inter | 700 | `--text-label` = `0.6875rem` | +0.14em, mayúsculas, `tabular-nums` | 1.2 |

- Tracking negativo sólo en Display XL, L y M (todos > 32 px).
- Texto corrido: `max-width: 65ch` (`.cr-prose`). Nunca centrado si pasa de dos líneas.
- Archivo Black siempre en mayúsculas. Inter nunca en mayúsculas salvo en etiqueta.
- La fuente mono del sistema (`--font-mono`) queda para `code` y `kbd` del producto. No se descarga JetBrains Mono.
- Google Fonts: `Archivo+Black` y `Inter:wght@400;500;700`. Sin preload de URLs versionadas.

### Espacio y retícula

- Unidad base 4 px. Escala Tailwind.
- Contenedor: `max-w-6xl` (1152 px) con `px-6`. Heros de Nivel A pueden ir a `max-w-7xl`.
- Retícula de 12 columnas para registros (`.cr-register__row`): número 1 col · título 5 · descripción 4 · acción 2. Bajo 768 px se apila.
- Ritmo vertical entre secciones, tres valores, **nunca el mismo dos veces seguidas**:
  - `--rhythm-1` = `clamp(2rem, 5vw, 3rem)` — secciones hermanas.
  - `--rhythm-2` = `clamp(3.5rem, 8vw, 6rem)` — cambio de tema.
  - `--rhythm-3` = `clamp(6rem, 13vw, 10rem)` — antes y después de un momento WOW.
- El hero no mide `100vh` por reflejo: mide lo que mide su contenido más `--rhythm-3`.

### Radios

Tres. `--radius-0: 0` (todo), `--radius-1: 2px` (inputs y chips), `--radius-full: 9999px` (sólo puntos y avatares).

### Elevación

Tres. Nada más.

| Token | Valor | Cuándo |
|---|---|---|
| `--shadow-hard` | `4px 4px 0 0 var(--color-cr-primary)` | Materia brutal: CTA primario en reposo, tarjeta destacada. |
| `--shadow-float` | `0 24px 80px rgb(0 0 0 / 0.9)` | Lo que flota: menús, popovers, cabecera fija con scroll. |
| `--shadow-glow` | `0 0 40px rgb(219 255 0 / 0.25)` | Sólo el CTA primario en hover. Un glow por viewport. |

### Movimiento (tokens)

```
--ease-cr: cubic-bezier(.22, 1, .36, 1)
--dur-1: 120ms   feedback directo (hover, press)
--dur-2: 240ms   cambio de estado (abrir, cerrar)
--dur-3: 450ms   cambio de contexto (subrayado, CTA diferida)
--dur-wipe: 1400ms  barrido de imagen (excepción justificada: es el gesto)
```

---

## 3. Estados

Todo lo interactivo tiene los ocho. Se comprueba con teclado y con el ratón.

| Estado | Regla |
|---|---|
| default | Lo que dice la sección. |
| hover | **Una sola propiedad**: color del texto, `translateX(12px)` del título de fila, `scale(1.06)` de la placa. Sólo bajo `(hover:hover)`. |
| focus-visible | `outline: 2px solid var(--color-cr-primary); outline-offset: 2px`. Global. Nunca `outline: none` sin sustituto. |
| active | CTA primario: `translate(2px, 2px)` y la sombra dura desaparece (se "pulsa"). |
| disabled | `opacity: .5; pointer-events: none; cursor: not-allowed`. |
| loading | `.cr-shimmer` sobre la geometría final (mismo tamaño que el contenido). Nunca un spinner en el lugar de una lista. |
| empty | Una frase en `text-muted` y un CTA ghost. Sin ilustración. |
| error | Texto en `--color-cr-secondary`, borde del control en secondary, mensaje con `role="alert"`. |

---

## 4. Componentes del sistema

`apps/web/src/components/system/`

- **`Eyebrow`** — etiqueta de sección: filete lima de 16 px + Inter 700 mayúsculas. Sustituye a los overlines en mono.
- **`SectionHead`** — eyebrow + `<h2>` Display M + acción opcional a la derecha, alineados a la base. Asimétrico por defecto.
- **`Register` / `RegisterRow`** — la alternativa a la tarjeta. Filas de 12 columnas separadas por filete. Hover: fondo `surface-2` y título `translateX(12px)` en `--dur-3`. Si la fila es enlace, toda la fila es el `<a>`.
- **`ProgressRail`** — filete vertical de 1 px con relleno lima `scaleY 0→1` ligado al scroll. Obligatorio junto a cualquier sección con `pin`.
- **`ConcertCard`** (existente, API intacta) — la tarjeta. Póster 3:4 desde el CDN de Ticketmaster tal cual. Hover: placa `scale(1.06) saturate(1.3) contrast(1.05)` en 800 ms, inclinación ±6° con puntero fino, CTA "Ver viajes" diferida (`opacity 0` en reposo). Sin blur.
- **`TopNav`** (existente) — transparente sobre el hero, a 24 px de scroll gana fondo, filete y encoge de 56 a 48 px. Menú móvil real con los tres destinos y el CTA. Subrayado direccional en los enlaces.
- **`Footer`** (existente) — cierre en registro: wordmark grande, una frase, tres columnas de enlaces con filetes. Todos los enlaces internos se conservan (son enlazado interno para SEO).

---

## 5. Capa de movimiento

`apps/web/src/fx/`

### Principio

**El escáner.** Todo entra revelado por una pasada de izquierda a derecha, como el lector de
códigos de barras del ticket. Un gesto, una dirección, sin excepciones. El movimiento explica
que algo *se está leyendo*, no que algo *aparece*.

### Niveles

| | Nivel A | Nivel B |
|---|---|---|
| Páginas | Home, `/festivales/:slug`, pillar pages de marketing | `/rutas/:slug`, `/conciertos/:city`, `/blog`, `/blog/:slug`, `/concerts` |
| Librerías | GSAP + ScrollTrigger + Lenis, cargadas con `import()` desde `fx/loadGsap.ts` (chunk `vendor-fx`) | Ninguna. Sólo CSS y `fx/tilt.ts` (0 dependencias, ~1 KB) |
| Efectos | Máscara por palabra, barrido con contra-zoom, subida de bloque, raíl, carril anclado, fila que se enciende | Hover de placa, tilt, subrayado, `translateX` de fila, transiciones de estado |
| Framer Motion | No | No (se retira de `/concerts`) |

Cómo se garantiza: ninguna página de Nivel B importa nada de `fx/loadGsap.ts` ni de `motion/react`.
Se comprueba en el output del build: `vendor-fx` y `vendor-motion` no deben aparecer en el
`modulepreload` de las páginas de Nivel B.

### Los gestos y sus valores

| Atributo | Qué hace | Valores |
|---|---|---|
| `data-scan="words"` | Divide el heading en palabras enmascaradas y las sube. El texto completo sigue en el heading; se añade `aria-label`. | `yPercent 130 → 0`, 1.0 s, `power4.out`, stagger 0.05, `once`, start `top 92%`. Caja con `padding-bottom:.14em; margin-bottom:-.14em`. |
| `data-scan="entrance"` | Igual que `words`, pero se dispara al montar (sólo el h1 del hero). | Igual. |
| `data-scan="wipe"` | Descubre un contenedor de media con recorte de izquierda a derecha y contra-zoom de la placa `[data-scan-plate]`. Un filete lima `[data-scan-edge]` encabeza el corte. | `clip-path inset(0 100% 0 0) → inset(0 0 0 0)`, 1.4 s, `power4.inOut`; placa `scale 1.12 → 1`; `once`, start `top 80%`. |
| `data-scan="rise"` | Subida de bloque para grupos bajo el pliegue. Nunca sobre lo que ya está en pantalla al cargar. | `y 36 → 0`, `autoAlpha 0 → 1`, 1.1 s, `power3.out`, stagger 0.08, `once`, `clearProps` al terminar. |
| `data-scan="light"` | La fila se enciende cuando cruza la zona activa. El scroll es el cursor. Sólo una encendida a la vez. | `toggleClass "is-on"` entre `top 72%` y `bottom 42%`. La transición la hace el CSS: `.7s var(--ease-cr)`. |
| `data-rail-stage` + `[data-rail-fill]` | Raíl de avance. | `scaleY 0 → 1`, `transform-origin: top`, scrub 1, start `top 70%`, end `bottom 75%`. |
| Carril anclado (home) | Scroll vertical → `x` del carril. Foco por proximidad al centro. Máscara de bordes. Barra de progreso. | escala 0.94–1.06; `mask-image` 6 %/94 %; pin sólo ≥1024 px; bajo eso `scroll-snap-type: x mandatory`. |
| Núcleo que se abre (home, una vez) | El marco recortado se abre a sangre sobre el mapa. | `inset(22% 30% round 0) → inset(0)`, `end: +=160%`, scrub 1, pin, contra-zoom 1.12 → 1, titular partido `xPercent ±150`. Con raíl. |
| Cabecera adaptativa | Gana fondo y encoge. | Umbral 24 px. `--dur-3`. |
| Punto vivo | El único bucle. | 2.2 s, `ease-in-out`, sólo junto a un dato real. |
| Tilt | Materia, no juguete. | ±6°, `perspective 900px`, transición `transform .6s var(--ease-cr)`, variables CSS escritas en un solo rAF. |
| Subrayado | Entra por la izquierda, sale por la derecha. | `scaleX`, `transform-origin` conmutado, `--dur-3`. |

### Lo que NUNCA se mueve

Logo, navegación en reposo, texto corrido, precios, breadcrumbs, tablas de datos, JSON-LD.
Ninguna imagen hace `opacity 0 → 1`. Nada anima `width`, `height`, `top`, `left`, `filter` (salvo
el `saturate` del hover de placa, que sí se permite porque es una propiedad de composición barata y sólo bajo hover fino).

### Guardas

```js
matchMedia("(prefers-reduced-motion: reduce)")   // toda la capa fx no se arma; el CSS baja todo a .01ms
matchMedia("(hover: hover) and (pointer: fine)")  // tilt, magnetismo, CTA diferida, Lenis
matchMedia("(min-width: 1024px)")                 // pin y carril anclado; debajo, scroll nativo con snap
```

Con `prefers-reduced-motion` la página se ve **entera y quieta**: el HTML prerenderizado ya es el
estado final. Ningún elemento depende del JS para ser visible.

### Reloj compartido (Nivel A)

```js
lenis.on("scroll", ScrollTrigger.update);
gsap.ticker.add((t) => lenis.raf(t * 1000));
gsap.ticker.lagSmoothing(0);
document.fonts.ready.then(() => ScrollTrigger.refresh());
```

Lenis con `lerp: 0.09`, sólo con puntero fino y ≥1024 px. En táctil, scroll nativo.

### Regla del `once`

Todo tween `once` limpia con `clearProps` al terminar. Un `transform` residual rompe el
`position: fixed` de los hijos (BottomCTABar, StickyRegBar).

---

## 6. SEO e indexación (invariantes del rediseño)

- El HTML prerenderizado contiene todo el texto indexable en su estado final. Los efectos lo decoran después.
- Un `<h1>` por página. Los `data-scan` dividen en `<span>` dentro del heading, nunca sustituyen el heading.
- Canonical, trailing-slash, `LEGACY_REDIRECTS`, sitemaps, robots, hreflang y JSON-LD: intactos.
- Triple invariante `App.tsx ⇄ entry-server.tsx ⇄ seoPrerender.ts`: no se añade ni se quita ninguna ruta.
- Sin `onclick=`/`onload=` como atributos. CSP sin `unsafe-inline`.
- Imágenes de Ticketmaster: URL del CDN tal cual, sin proxy ni reproceso.

---

## 7. Voz

Frases cortas. Segunda persona del plural cuando hablamos del plan ("vais", "id"); segunda del
singular cuando hablamos de la acción ("publica", "reserva"). Se dice el límite antes de la
promesa: "Pagas al conductor, no a nosotros". Prohibido: "revoluciona", "el futuro de",
"transforma tu", "sin fricciones", tres adjetivos seguidos, cifras que no salgan del catálogo.

---

## 8. Filtro final antes de dar por buena una pantalla

1. ¿Podría ser de otro producto cambiando el logo? Vuelve a §1.
2. ¿Hay una decisión de la que me acordaría mañana?
3. ¿Qué he dejado porque quitarlo daba pereza?
4. Captura a 1440 y a 390 mirada con los ojos. Nunca declarada terminada sin verla.
