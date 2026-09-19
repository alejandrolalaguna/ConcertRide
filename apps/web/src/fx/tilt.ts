// Inclinación 3D sin dependencias. Patrón del tilt-card de 21st.dev
// (variables CSS + un solo requestAnimationFrame por evento), con el ángulo
// del banco de movimiento: ±6° sugiere materia; 15° es un juguete.
//
// El elemento lleva la clase `.cr-tilt` (index.css), que lee `--rx` y `--ry`
// y aplica la transición. Aquí sólo escribimos variables. Cero GSAP: sirve en
// Nivel B.

import { FX, hasFinePointer, prefersReducedMotion } from "./guards";

export function attachTilt(el: HTMLElement, maxDeg: number = FX.tiltDeg): () => void {
  if (!hasFinePointer() || prefersReducedMotion()) return () => {};

  let raf = 0;
  let nextX = 0;
  let nextY = 0;

  const write = () => {
    raf = 0;
    el.style.setProperty("--rx", `${nextX.toFixed(2)}deg`);
    el.style.setProperty("--ry", `${nextY.toFixed(2)}deg`);
  };

  const onMove = (e: PointerEvent) => {
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0) return;
    const px = (e.clientX - r.left) / r.width; // 0..1
    const py = (e.clientY - r.top) / r.height; // 0..1
    nextY = (px - 0.5) * 2 * maxDeg;
    nextX = -(py - 0.5) * 2 * maxDeg;
    if (!raf) raf = requestAnimationFrame(write);
  };

  const onLeave = () => {
    nextX = 0;
    nextY = 0;
    if (!raf) raf = requestAnimationFrame(write);
  };

  el.addEventListener("pointermove", onMove, { passive: true });
  el.addEventListener("pointerleave", onLeave, { passive: true });
  el.addEventListener("pointercancel", onLeave, { passive: true });

  return () => {
    el.removeEventListener("pointermove", onMove);
    el.removeEventListener("pointerleave", onLeave);
    el.removeEventListener("pointercancel", onLeave);
    if (raf) cancelAnimationFrame(raf);
    el.style.removeProperty("--rx");
    el.style.removeProperty("--ry");
  };
}
