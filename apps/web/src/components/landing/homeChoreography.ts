// Coreografía de scroll de la home (Nivel A). Se ejecuta desde
// useLevelAMotion(onReady) con GSAP ya cargado. Dos piezas ancladas, ambas
// con orientación (raíl / barra), sólo en escritorio con puntero fino y sin
// reduced-motion:
//
//   1. El cartel que se abre (A1): pin del hero, la ventana se abre a sangre
//      sobre el mapa con contra-zoom, el cartel se retira, el dato aterriza.
//   2. El tablón de salidas (A3): pin de la sección, scroll → x del carril,
//      foco por proximidad 0.94–1.06, barra de progreso.
//
// Bajo 1024 px o con reduced-motion no se crea nada: el HTML ya es final.

import type { GsapBundle } from "@/fx/loadGsap";
import { FX } from "@/fx/guards";

export function buildHomeChoreography({ gsap, ScrollTrigger }: GsapBundle, root: HTMLElement): () => void {
  const mm = gsap.matchMedia();

  mm.add("(min-width: 1024px) and (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)", () => {
    // ── 1 · El cartel que se abre ────────────────────────────────────────
    const stage = root.querySelector<HTMLElement>("[data-hero-stage]");
    const clip = root.querySelector<HTMLElement>("[data-hero-clip]");
    const plate = root.querySelector<HTMLElement>("[data-hero-plate]");
    const fade = root.querySelector<HTMLElement>("[data-hero-fade]");
    const end = root.querySelector<HTMLElement>("[data-hero-end]");
    const railFill = stage?.querySelector<HTMLElement>("[data-rail-fill]");

    const slot = root.querySelector<HTMLElement>("[data-hero-slot]");
    if (stage && clip && plate && fade && slot) {
      stage.setAttribute("data-hero-open", "1");
      // Recorte inicial = la ventana, medida en el momento de (re)calcular el
      // tween (invalidateOnRefresh). Se mide contra el escenario, que cuando
      // está anclado es su pin-spacer quien ocupa el flujo.
      const startClip = () => {
        const s = stage.getBoundingClientRect();
        const r = slot.getBoundingClientRect();
        if (s.width < 100 || s.height < 300) return "inset(20% 5% 20% 60%)";
        const pct = (v: number, total: number) => `${Math.max(0, (v / total) * 100).toFixed(2)}%`;
        return `inset(${pct(r.top - s.top, s.height)} ${pct(s.right - r.right, s.width)} ${pct(s.bottom - r.bottom, s.height)} ${pct(r.left - s.left, s.width)})`;
      };

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stage,
          start: "top top",
          end: "+=120%",
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            // El mapa sólo es interactivo cuando está abierto del todo.
            clip.style.pointerEvents = self.progress > 0.98 ? "auto" : "none";
          },
        },
      });

      // Desplazamiento inicial de la placa para que la ventana enseñe el centro
      // del mapa (España) y no el mar: se anula al abrirse.
      const startDx = () => {
        const s = stage.getBoundingClientRect();
        const r = slot.getBoundingClientRect();
        return r.left + r.width / 2 - (s.left + s.width / 2);
      };
      const startDy = () => {
        const s = stage.getBoundingClientRect();
        const r = slot.getBoundingClientRect();
        return r.top + r.height / 2 - (s.top + s.height / 2);
      };
      tl.fromTo(clip, { clipPath: startClip }, { clipPath: "inset(0% 0% 0% 0%)", ease: "none" }, 0)
        .fromTo(plate, { scale: 1.12, x: startDx, y: startDy }, { scale: 1, x: 0, y: 0, ease: "none" }, 0)
        .to(fade, { autoAlpha: 0, yPercent: -6, ease: "power1.in", duration: 0.55 }, 0)
        .to(fade, { pointerEvents: "none", duration: 0.01 }, 0.2);
      if (end) tl.fromTo(end, { autoAlpha: 0, y: 26 }, { autoAlpha: 1, y: 0, ease: "none", duration: 0.45 }, 0.55);
      if (railFill) tl.fromTo(railFill, { scaleY: 0 }, { scaleY: 1, transformOrigin: "top", ease: "none" }, 0);
    }

    // ── 2 · El tablón de salidas ─────────────────────────────────────────
    const section = root.querySelector<HTMLElement>("[data-departures]");
    const stageD = root.querySelector<HTMLElement>("[data-departures-stage]");
    const track = root.querySelector<HTMLElement>("[data-departures-track]");
    const progress = root.querySelector<HTMLElement>("[data-departures-progress]");
    const cards = Array.from(root.querySelectorAll<HTMLElement>("[data-departures-card]"));

    if (section && stageD && track && cards.length > 1) {
      // El carril deja de ser scroll nativo: lo mueve el scroll de la página.
      // La máscara de bordes pasa del carril (que ahora viaja) al escenario
      // (que está anclado y mide un viewport): si se quedara en el carril,
      // recortaría a sus hijos por el borde de su propia caja.
      const EDGE_MASK = "linear-gradient(to right, transparent, #000 4%, #000 96%, transparent)";
      track.style.overflowX = "visible";
      track.style.scrollSnapType = "none";
      track.style.maskImage = "none";
      track.style.webkitMaskImage = "none";
      stageD.style.maskImage = EDGE_MASK;
      stageD.style.webkitMaskImage = EDGE_MASK;
      const distance = () => Math.max(0, track.scrollWidth - window.innerWidth);

      const [minS, maxS] = FX.focusScale;
      const center = () => window.innerWidth / 2;
      const measureFocus = () => {
        const c = center();
        for (const card of cards) {
          const r = card.getBoundingClientRect();
          const d = Math.abs(r.left + r.width / 2 - c) / window.innerWidth; // 0 centro … 0.5 borde
          const s = maxS - Math.min(1, d * 2) * (maxS - minS);
          card.style.transform = `scale(${s.toFixed(3)})`;
        }
      };

      gsap.to(track, {
        x: () => -distance(),
        ease: "none",
        scrollTrigger: {
          trigger: stageD,
          start: "top top",
          end: () => "+=" + distance(),
          scrub: 1,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            measureFocus();
            if (progress) progress.style.transform = `scaleX(${self.progress.toFixed(4)})`;
          },
          onRefresh: measureFocus,
        },
      });
      measureFocus();

      return () => {
        track.style.overflowX = "";
        track.style.scrollSnapType = "";
        track.style.maskImage = "";
        track.style.webkitMaskImage = "";
        stageD.style.maskImage = "";
        stageD.style.webkitMaskImage = "";
        cards.forEach((c) => (c.style.transform = ""));
        if (progress) progress.style.transform = "";
        if (clip) clip.style.pointerEvents = "";
        stage?.removeAttribute("data-hero-open");
      };
    }

    return () => {
      if (clip) clip.style.pointerEvents = "";
      stage?.removeAttribute("data-hero-open");
    };
  });

  return () => {
    mm.revert();
    ScrollTrigger.refresh();
  };
}
