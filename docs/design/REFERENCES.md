# Referencias · qué se tomó y qué se rechazó

Fuente: `C:\Users\admin\Downloads\design-master\design-master\` (banco de movimiento del
GenAI4EU Hub y 67 componentes archivados de 21st.dev). De ahí se toma **el método y la gramática
de movimiento**, nunca la paleta, las tipografías ni el tono.

## Del banco de movimiento (`motion-bench/`)

| Espécimen | Tomado | Rechazado |
|---|---|---|
| A1 Núcleo que se abre | El gesto del hero de la home: pin, `inset(22% 30%) → inset(0)`, contra-zoom 1.12 → 1, titular partido `xPercent ±150`. Una sola vez en todo el sitio. | Usarlo en más de una página. |
| A2 Apertura con dato encima | La idea de que el dato *aterriza* sobre la imagen ya abierta. Se usa en el bloque de precio de festival. | El `backdrop-blur` de las celdas (glassmorphism). Las celdas van con fondo sólido `surface`. |
| A3 Carrusel anclado | Foco por proximidad 0.94–1.06, máscara de bordes, barra de progreso, `invalidateOnRefresh`, snap nativo bajo 1024. Es el "tablón de salidas" de la home. | Tarjetas homogéneas sin imagen: aquí cada tarjeta lleva el póster real. |
| A4 Raíl de avance | Tal cual. Obligatorio junto a A1 y A3. | Nada. |
| A5 Parallax diferencial | Sólo la regla: −12 %, nunca bajo texto, sólo con contraste entre capas. No se implementa ninguna capa parallax en v1 porque no tenemos tres imágenes con luz común. | El parallax decorativo. |
| A6 Telón | La idea. Descartada en v1: el Footer tiene 40 enlaces y supera el `min(62vh, 440px)`, y los CTA bars fijos colisionarían con un panel fijo. Candidato para v2 con un panel de cierre compacto. | — |
| B1 Máscara por carácter | Convertida a **máscara por palabra** (regla 13 del banco), `yPercent 130 → 0`, `power4.out`, stagger 0.05, `padding-bottom:.14em`. Racionada: sólo h1 y h2 de Nivel A. | El split por carácter y dispararla en ocho titulares. |
| B2 Subida en bloque | `y 36 / 1.1s / power3.out / stagger .08 / once + clearProps`. Sólo bajo el pliegue. | Dispararla sobre lo que ya está en pantalla al cargar. |
| B3 Contorno que se rellena | Como "fila que se enciende" en la tabla de transporte del festival y en los pasos de las pillar pages. GSAP sólo conmuta la clase; la transición es CSS. | El `-webkit-text-stroke` sobre Archivo Black: a esos pesos el contorno se lee como error. Se enciende por color y filete. |
| B4 Contadores | Nada. Las cifras no son el argumento del sitio y las que había eran inventadas. | Todo. |
| B5 Peso variable + subrayado direccional | El subrayado direccional como estándar de enlace. | El eje de peso: Archivo Black e Inter estática no tienen eje variable cargado. |
| C1 Tarjeta con inclinación | ±6°, `perspective 900`, placa `scale(1.06) saturate(1.3) contrast(1.05)` en .8 s, CTA diferida `opacity 0 → 1` en .45 s, anulada sin hover. Implementada con variables CSS y un solo rAF (patrón del tilt-card de 21st), sin GSAP, para que sirva también en Nivel B. | El `quickTo` de GSAP (haría que Nivel B cargase GSAP). |
| C2 Barrido direccional | Es **el gesto**: `inset(0 100% 0 0) → inset(0)`, 1.4 s `power4.inOut`, siempre de izquierda a derecha. | Las otras tres direcciones. Una gramática, no un catálogo. |
| C3 Rótulo integrado | El velo plano `.34` y las esquinas de registro. | `mix-blend-difference` (falla en gris medio y los pósters de TM son impredecibles) y la franja con `backdrop-blur`. |
| C4 Registro de 12 columnas | Tal cual: filete 1 px, número, título grande, descripción en su columna, acción a la derecha, `translateX(12px)` al hover en .5 s. Es el componente base del Nivel B. | Nada. |
| D1 Botón magnético | Nada en v1. Con un solo CTA primario por viewport, el magnetismo no añade información. | Todo. |
| D2 Cabecera adaptativa | Umbral 24 px, gana fondo y encoge de 56 a 48 px. | El blur de 10 px: el fondo pasa a `bg/92` sólido. Sin glassmorphism. |
| D3 Punto vivo | 2.2 s, un solo bucle por página, sólo junto a un dato real. | Los ocho bucles que había. |
| D4 Scroll suave | Lenis `lerp 0.09` con reloj compartido con GSAP, sólo Nivel A, sólo puntero fino y ≥1024. | Lenis en Nivel B o en táctil. |

## De 21st.dev

| Componente | Tomado | Rechazado |
|---|---|---|
| `arunachalam__scroll-expansion-hero` | La idea del marco que crece hasta llenar el viewport. | El scroll-jacking con `preventDefault` (se sustituye por pin de ScrollTrigger con raíl), la interpolación de `width/height` en px (se hace con `clip-path` + `scale`), el `ease-in-out` blando. |
| `efferd__zoom-parallax` | La pista pegajosa `sticky` con escala divergente por elemento, como concepto. | Lenis por defecto, las siete posiciones mágicas en vw/vh, escalas hasta 9×. |
| `danielpetho__stacking-cards` | La fórmula `1 - (n - i) * 0.03` y `top: 5% + i*3%`. Reservada para la versión apilada de "Cómo funciona" en móvil si hace falta. | Paleta pastel y `rounded-3xl`. |
| `manuarora700__hero-parallax` | Nada estructural (no trae bundle; valores sin verificar). | El `opacity 0.2` inicial que hunde el LCP, `rotateX/rotateZ`, quince imágenes. |
| `hyperiux__sticky-content-wrapper` | La máquina de pasos con `stepGap`, y sobre todo su **rama de reduced-motion** (crossfade a opacidad, sin clip ni escala). Es el patrón de "el ticket se rellena solo" en las pillar pages. | El `snap` de ScrollTrigger (pelea con el usuario), radios `3.5vw`, la deriva de escala 1.5 → 1.2 → 1. |
| `hyperiux__horizontal-feature-reveal` | Scroll vertical → carril horizontal `xPercent`, viewport `sticky`, ventanas de trigger por tarjeta. | SplitText (rompe el DOM y la accesibilidad), dispersión aleatoria ±200 % de caracteres, corte duro `≤ 1025px` sin versión móvil. |
| `prashantsom75__scroll-morph-hero` | La máquina de estados `scatter → line → circle` como idea. | Todo lo demás: modo claro, `blur(10px)`, `ResizeObserver` con estado cero, scroll-jacking por contenedor. |
| `ravikatiyar162__animated-shader-hero` | La cascada `200/400/600/800ms` como referencia de escalonado de CTA. | El canvas WebGL2 a pantalla completa (revienta en jsdom, quema batería, no aporta información), texto en degradado, `rounded-full`. |
| `sh20raj__optimized-tilt-card` | **La implementación entera**: variables CSS `--rx/--ry`, un solo rAF por evento, transición `transform .35s`. Base de `fx/tilt.ts`. | 11° de inclinación (se baja a 6°), `scale 1.045`, `backdrop-blur-xl`, degradado violeta-cian. |
| `cult-ui__3d-carousel` | El arrastre para girar como idea; `layoutId` para "toca un festival y ves sus rutas" queda para v2. | El cilindro 3D (esconde el contenido detrás de sí mismo; fatal para tarjetas que son enlaces indexables). |
| `ruixen.ui__coverflow-carousel` | El motor sin dependencias: `pow(distancia, .56)` para el falloff entre hermanas, lerp `+= delta * 0.16` en rAF, guarda `typeof window` para `useLayoutEffect`. | El giro `44°/82°`: hace ilegibles precio y hora en la tarjeta. Rotación 0; trabajan escala y opacidad. |
| `motiondotdev__motion-scroll-word-reveal` | **El patrón de accesibilidad**: `aria-label` en el padre, `aria-hidden` en los spans animados, retorno temprano con `useReducedMotion`. Copiado en `fx/scan.ts`. | `BASE_OPACITY 0.15` sobre negro (se lee como roto). |
| `cnippet-dev__m-vertical-cut-reveal-2` | Máscara `overflow:hidden` + `y: 100%` y el `sr-only` con el texto original. | El stagger desde el centro y el spring rebotado: el tipo brutal se estampa, no rebota. |
| `jahed__spotlight-card` | El pipeline `--xp/--yp` desde el puntero. | El halo degradado (repinta gradientes en cada movimiento, y es el cliché nº 1 del dark-UI). |
| `satoriui__kinetic-grid` | La onda al clic (`400px/s`, 0.83 s) como idea para una v2. | El canvas fijo con rAF perpetuo. |
| `lovesickfromthe6ix__horizon-hero-section` | El contador `01 / 03` con pista de progreso como tipografía de raíl. | three.js, EffectComposer, y sobre todo `visibility: hidden` como estado inicial: es el fallo de indexación que no podemos permitirnos. |

## Regla que sale de todo esto

De dieciséis componentes, sólo tres respetan `prefers-reduced-motion` y cuatro revientan en
jsdom. Por eso la capa `fx/` de ConcertRide se arma **después** de que el HTML ya sea final, se
desactiva entera con reduced-motion y no toca `getContext` en ningún sitio.
