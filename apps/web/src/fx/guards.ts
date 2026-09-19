// Guardas de la capa de movimiento. Ver docs/design/DESIGN.md §5.
// Todas devuelven `false` en SSR y en jsdom sin matchMedia.

function mq(query: string): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
  try {
    return window.matchMedia(query).matches;
  } catch {
    return false;
  }
}

/** El usuario pidió menos movimiento: la capa fx no se arma. */
export const prefersReducedMotion = (): boolean => mq("(prefers-reduced-motion: reduce)");

/** Puntero fino con hover real: tilt, CTA diferida, Lenis. */
export const hasFinePointer = (): boolean => mq("(hover: hover) and (pointer: fine)");

/** Escritorio: pin y carril anclado. Debajo, scroll nativo con snap. */
export const isDesktop = (): boolean => mq("(min-width: 1024px)");

/** Curva global. Igual que `--ease-cr` en index.css. */
export const EASE_CR = "cubic-bezier(.22,1,.36,1)";

/** Umbrales medidos (motion-bench/03-reglas.md). */
export const FX = {
  lenisLerp: 0.09,
  tiltDeg: 6,
  focusScale: [0.94, 1.06] as const,
  parallaxPct: -12,
  headerThresholdPx: 24,
  staggerBlock: 0.08,
  staggerWord: 0.05,
  riseY: 36,
  riseDur: 1.1,
  wipeDur: 1.4,
  wordDur: 1.0,
  loopDur: 2.2,
} as const;
