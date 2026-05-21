/**
 * Fires a brief confetti celebration from the bottom edge of the viewport
 * using ConcertRide's brand colors. Respects `prefers-reduced-motion` and
 * silently no-ops on server-side renders.
 *
 * Triggers a short haptic pattern on devices that support Vibration API.
 *
 * canvas-confetti is dynamically imported so the ~28 KB animation lib
 * never enters the initial bundle of any page that imports celebrate.
 */
export function celebrate(): void {
  if (typeof window === "undefined") return;
  if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) return;

  // jsdom / test environments don't implement canvas 2D context fully —
  // canvas-confetti throws on internal clearRect calls. Detect and bail.
  if (!isCanvas2DSupported()) return;

  const colors = ["#d4f700", "#ff4f00", "#f0f0f4"];
  const fire = (originX: number) => {
    void import("canvas-confetti")
      .then(({ default: confetti }) => {
        confetti({
          particleCount: 60,
          spread: 60,
          origin: { x: originX, y: 0.8 },
          colors,
          ticks: 200,
          scalar: 0.9,
          disableForReducedMotion: true,
        });
      })
      .catch(() => {
        // swallow — confetti is non-essential UI flourish
      });
  };

  fire(0.3);
  setTimeout(() => fire(0.7), 120);

  if (typeof navigator !== "undefined" && navigator.vibrate) {
    try {
      navigator.vibrate([10, 30, 10]);
    } catch {
      // some browsers throw if vibration is blocked by policy — ignore
    }
  }
}

function isCanvas2DSupported(): boolean {
  // jsdom doesn't implement HTMLCanvasElement.getContext, which produces noisy
  // "Not implemented" warnings AND makes canvas-confetti throw on internal
  // clearRect calls. We probe for the 2D context constructor first — if it's
  // missing from globalThis, there's no Canvas2D runtime at all.
  if (typeof window === "undefined") return false;
  if (typeof window.CanvasRenderingContext2D === "undefined") return false;
  try {
    const c = document.createElement("canvas");
    const ctx = c.getContext("2d");
    return !!ctx && typeof (ctx as CanvasRenderingContext2D).clearRect === "function";
  } catch {
    return false;
  }
}
