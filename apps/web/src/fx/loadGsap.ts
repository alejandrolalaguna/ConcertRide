// Carga perezosa de GSAP + ScrollTrigger (+ Lenis). SOLO se importa desde
// componentes de Nivel A. Ninguna página de Nivel B debe importar este módulo:
// así el chunk `vendor-fx` nunca entra en el bundle común.
//
// Comprobación: en el output de `vite build`, `vendor-fx-*.js` no debe aparecer
// en el `modulepreload` de RouteLandingPage, CityLandingPage, BlogPostPage ni
// ConcertsPage.

import type { gsap as GsapType } from "gsap";
import type { ScrollTrigger as ScrollTriggerType } from "gsap/ScrollTrigger";
import type Lenis from "lenis";

export interface GsapBundle {
  gsap: typeof GsapType;
  ScrollTrigger: typeof ScrollTriggerType;
}

let gsapPromise: Promise<GsapBundle> | null = null;

export function loadGsap(): Promise<GsapBundle> {
  if (!gsapPromise) {
    gsapPromise = Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(([g, s]) => {
      g.gsap.registerPlugin(s.ScrollTrigger);
      return { gsap: g.gsap, ScrollTrigger: s.ScrollTrigger };
    });
  }
  return gsapPromise;
}

let lenisPromise: Promise<typeof Lenis> | null = null;

export function loadLenis(): Promise<typeof Lenis> {
  if (!lenisPromise) {
    lenisPromise = import("lenis").then((m) => m.default);
  }
  return lenisPromise;
}
