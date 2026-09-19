// Hook de Nivel A. Una página lo llama una vez sobre su <main>; carga GSAP +
// ScrollTrigger (+ Lenis en escritorio con puntero fino), arma los `data-scan`
// del árbol y limpia todo al desmontar.
//
// SOLO se importa desde páginas de Nivel A (home, /festivales/:slug, pillar
// pages). Nivel B no debe tocar este módulo. Ver docs/design/DESIGN.md §5.

import { useEffect, type RefObject } from "react";
import { hasFinePointer, isDesktop, prefersReducedMotion, FX } from "./guards";
import { loadGsap, loadLenis, type GsapBundle } from "./loadGsap";
import { armScan } from "./scan";

export interface LevelAOptions {
  /** Scroll suave con Lenis (sólo escritorio + puntero fino). Por defecto sí. */
  smooth?: boolean;
  /** Callback con el bundle ya cargado para coreografías propias de la página. Debe devolver su cleanup. */
  onReady?: (bundle: GsapBundle, root: HTMLElement) => (() => void) | void;
}

export function useLevelAMotion(rootRef: RefObject<HTMLElement | null>, opts: LevelAOptions = {}) {
  const { smooth = true, onReady } = opts;

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (prefersReducedMotion()) return; // el HTML ya es el estado final
    const root = rootRef.current;
    if (!root) return;

    let disposed = false;
    let cleanupScan: (() => void) | null = null;
    let cleanupPage: (() => void) | null = null;
    let lenis: { destroy: () => void; raf: (t: number) => void; on: (e: "scroll", cb: () => void) => void } | null = null;
    let tickerFn: ((t: number) => void) | null = null;

    (async () => {
      const bundle = await loadGsap();
      if (disposed) return;
      const { gsap, ScrollTrigger } = bundle;

      // Reloj compartido: Lenis y GSAP con el mismo ticker o hay temblor.
      if (smooth && isDesktop() && hasFinePointer()) {
        try {
          const Lenis = await loadLenis();
          if (disposed) return;
          lenis = new Lenis({ lerp: FX.lenisLerp, smoothWheel: true, wheelMultiplier: 1 });
          lenis.on("scroll", ScrollTrigger.update);
          tickerFn = (t: number) => lenis?.raf(t * 1000);
          gsap.ticker.add(tickerFn);
          gsap.ticker.lagSmoothing(0);
        } catch {
          lenis = null;
        }
      }

      cleanupScan = armScan(root, bundle);
      const maybe = onReady?.(bundle, root);
      if (typeof maybe === "function") cleanupPage = maybe;

      if (typeof document !== "undefined" && document.fonts?.ready) {
        document.fonts.ready.then(() => {
          if (!disposed) ScrollTrigger.refresh();
        });
      }
    })();

    return () => {
      disposed = true;
      cleanupPage?.();
      cleanupScan?.();
      loadGsap().then(({ gsap }) => {
        if (tickerFn) gsap.ticker.remove(tickerFn);
      });
      lenis?.destroy();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
}
