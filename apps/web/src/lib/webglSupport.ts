// Detect WebGL support before instantiating MapLibre GL. Test environments
// (jsdom) and very old browsers don't expose WebGL — MapLibre throws on init.
// We probe lazily and cache the result for the page lifetime.

let cached: boolean | null = null;

export function hasWebGL(): boolean {
  if (cached !== null) return cached;
  if (typeof window === "undefined" || typeof document === "undefined") {
    cached = false;
    return false;
  }
  // jsdom's HTMLCanvasElement.getContext is not implemented and logs noisy
  // "Not implemented" errors. Probe for the WebGL constructor instead — if
  // WebGLRenderingContext isn't defined globally, we're definitely not in a
  // WebGL-capable runtime.
  if (typeof window.WebGLRenderingContext === "undefined") {
    cached = false;
    return false;
  }
  try {
    const canvas = document.createElement("canvas");
    const ctx =
      canvas.getContext("webgl2") ??
      canvas.getContext("webgl") ??
      canvas.getContext("experimental-webgl");
    cached = !!ctx;
  } catch {
    cached = false;
  }
  return cached;
}
