// El escáner: la gramática de movimiento de ConcertRide.
//
// Todo entra revelado por una pasada de izquierda a derecha. Un gesto, una
// dirección. Los elementos se marcan con atributos `data-scan` en el JSX; el
// HTML prerenderizado ya es el estado final (todo visible), y este módulo, que
// sólo corre en el cliente y sólo en páginas de Nivel A, lo esconde y lo revela
// al entrar en viewport.
//
//   data-scan="words"     heading: máscara por palabra, yPercent 130→0
//   data-scan="entrance"  igual, pero se dispara al montar (h1 del hero)
//   data-scan="wipe"      media: clip-path inset(0 100% 0 0)→inset(0), contra-zoom
//                         de [data-scan-plate], filete [data-scan-edge]
//   data-scan="rise"      bloque: y 36→0 + autoAlpha, once + clearProps
//   data-scan="light"     fila: toggleClass is-on en la zona activa
//   data-rail-stage       raíl: [data-rail-fill] scaleY 0→1 scrub
//
// Reglas del banco que se respetan aquí:
//   - nunca se anima lo que ya está en pantalla al montar (salvo `entrance`)
//   - todo `once` limpia con clearProps
//   - reduced-motion: no se arma nada (ver useLevelAMotion)

import type { GsapBundle } from "./loadGsap";
import { FX } from "./guards";

const ARMED = "data-scan-armed";

function inViewportNow(el: Element, fraction = 0.9): boolean {
  const r = el.getBoundingClientRect();
  return r.top < window.innerHeight * fraction && r.bottom > 0;
}

/** Divide el texto de un heading en palabras enmascaradas, respetando spans internos. */
function splitWords(root: HTMLElement): HTMLElement[] {
  const inners: HTMLElement[] = [];
  const walk = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const text = node.textContent ?? "";
      if (!text.trim()) return;
      const frag = document.createDocumentFragment();
      const parts = text.split(/(\s+)/);
      for (const part of parts) {
        if (!part) continue;
        if (/^\s+$/.test(part)) {
          frag.appendChild(document.createTextNode(part));
          continue;
        }
        const mask = document.createElement("span");
        mask.className = "cr-mask";
        mask.setAttribute("aria-hidden", "true");
        const inner = document.createElement("span");
        inner.className = "cr-mask__in";
        inner.textContent = part;
        mask.appendChild(inner);
        frag.appendChild(mask);
        inners.push(inner);
      }
      node.parentNode?.replaceChild(frag, node);
      return;
    }
    if (node.nodeType === Node.ELEMENT_NODE) {
      if ((node as Element).tagName === "BR") return;
      Array.from(node.childNodes).forEach(walk);
    }
  };
  Array.from(root.childNodes).forEach(walk);
  return inners;
}

export function armScan(root: ParentNode, { gsap, ScrollTrigger }: GsapBundle): () => void {
  const ctx = gsap.context(() => {
    // ── Palabras ────────────────────────────────────────────────────────
    root.querySelectorAll<HTMLElement>('[data-scan="words"], [data-scan="entrance"]').forEach((el) => {
      if (el.hasAttribute(ARMED)) return;
      const entrance = el.dataset.scan === "entrance";
      if (!entrance && inViewportNow(el)) return; // ya en pantalla: no se toca
      el.setAttribute(ARMED, "1");
      const label = (el.textContent ?? "").replace(/\s+/g, " ").trim();
      if (label && !el.hasAttribute("aria-label")) el.setAttribute("aria-label", label);
      const inners = splitWords(el);
      if (!inners.length) return;
      gsap.set(inners, { yPercent: 130 });
      const tween = gsap.to(inners, {
        yPercent: 0,
        duration: FX.wordDur,
        ease: "power4.out",
        stagger: FX.staggerWord,
        paused: true,
        onComplete: () => gsap.set(inners, { clearProps: "transform" }),
      });
      if (entrance) {
        tween.play();
      } else {
        ScrollTrigger.create({ trigger: el, start: "top 92%", once: true, onEnter: () => tween.play() });
      }
    });

    // ── Barrido ─────────────────────────────────────────────────────────
    root.querySelectorAll<HTMLElement>('[data-scan="wipe"]').forEach((el) => {
      if (el.hasAttribute(ARMED) || inViewportNow(el, 0.8)) return;
      el.setAttribute(ARMED, "1");
      const plate = el.querySelector<HTMLElement>("[data-scan-plate]");
      const edge = el.querySelector<HTMLElement>("[data-scan-edge]");
      gsap.set(el, { clipPath: "inset(0 100% 0 0)" });
      if (plate) gsap.set(plate, { scale: 1.12, transformOrigin: "50% 50%" });
      const tl = gsap.timeline({
        paused: true,
        onComplete: () => {
          gsap.set(el, { clearProps: "clipPath" });
          if (plate) gsap.set(plate, { clearProps: "transform" });
          if (edge) gsap.set(edge, { autoAlpha: 0 });
        },
      });
      tl.to(el, { clipPath: "inset(0 0% 0 0)", duration: FX.wipeDur, ease: "power4.inOut" }, 0);
      if (plate) tl.to(plate, { scale: 1, duration: FX.wipeDur, ease: "power4.inOut" }, 0);
      if (edge) {
        tl.fromTo(
          edge,
          { x: 0, autoAlpha: 1 },
          { x: () => el.clientWidth, duration: FX.wipeDur, ease: "power4.inOut" },
          0,
        );
      }
      ScrollTrigger.create({ trigger: el, start: "top 80%", once: true, onEnter: () => tl.play() });
    });

    // ── Subida en bloque ────────────────────────────────────────────────
    root.querySelectorAll<HTMLElement>('[data-scan="rise"]').forEach((group) => {
      if (group.hasAttribute(ARMED) || inViewportNow(group)) return;
      group.setAttribute(ARMED, "1");
      const items = group.hasAttribute("data-scan-children")
        ? Array.from(group.children).filter((c): c is HTMLElement => c instanceof HTMLElement)
        : [group];
      gsap.set(items, { y: FX.riseY, autoAlpha: 0 });
      gsap.to(items, {
        y: 0,
        autoAlpha: 1,
        duration: FX.riseDur,
        ease: "power3.out",
        stagger: FX.staggerBlock,
        clearProps: "transform,opacity,visibility",
        scrollTrigger: { trigger: group, start: "top 88%", once: true },
      });
    });

    // ── Fila que se enciende ────────────────────────────────────────────
    root.querySelectorAll<HTMLElement>('[data-scan="light"]').forEach((row) => {
      if (row.hasAttribute(ARMED)) return;
      row.setAttribute(ARMED, "1");
      row.classList.add("cr-light");
      ScrollTrigger.create({
        trigger: row,
        start: "top 72%",
        end: "bottom 42%",
        toggleClass: { targets: row, className: "is-on" },
      });
    });

    // ── El ticket se rellena solo ───────────────────────────────────────
    // Cada paso enciende (is-on) y añade sus campos al ticket. Sin JS el
    // ticket está completo; al armar, se vacían los campos y se van
    // rellenando con el scroll. Nunca se vacía lo ya rellenado al subir.
    root.querySelectorAll<HTMLElement>('[data-scan="ticket"]').forEach((block) => {
      if (block.hasAttribute(ARMED)) return;
      block.setAttribute(ARMED, "1");
      const ticket = block.querySelector<HTMLElement>("[data-ticket]");
      const steps = Array.from(block.querySelectorAll<HTMLElement>("[data-step]"));
      if (!ticket || !steps.length) return;
      ticket.setAttribute("data-ticket-armed", "1");
      const fields = Array.from(ticket.querySelectorAll<HTMLElement>("[data-field]"));
      const fill = (upTo: number) => {
        const keys = new Set<string>();
        steps.slice(0, upTo + 1).forEach((s) => (s.dataset.stepFills ?? "").split(/\s+/).filter(Boolean).forEach((k) => keys.add(k)));
        fields.forEach((f) => f.classList.toggle("is-filled", keys.has(f.dataset.field ?? "")));
      };
      let maxReached = -1;
      steps.forEach((step, i) => {
        step.classList.add("cr-light");
        ScrollTrigger.create({
          trigger: step,
          start: "top 65%",
          end: "bottom 35%",
          toggleClass: { targets: step, className: "is-on" },
          onEnter: () => {
            maxReached = Math.max(maxReached, i);
            fill(maxReached);
          },
        });
      });
      fill(maxReached);
    });

    // ── Raíl de avance ──────────────────────────────────────────────────
    root.querySelectorAll<HTMLElement>("[data-rail-stage]").forEach((stage) => {
      const fill = stage.querySelector<HTMLElement>("[data-rail-fill]");
      if (!fill || stage.hasAttribute(ARMED)) return;
      stage.setAttribute(ARMED, "1");
      gsap.fromTo(
        fill,
        { scaleY: 0 },
        {
          scaleY: 1,
          transformOrigin: "top",
          ease: "none",
          scrollTrigger: { trigger: stage, start: "top 70%", end: "bottom 75%", scrub: 1 },
        },
      );
    });
  }, root as Element);

  return () => ctx.revert();
}
