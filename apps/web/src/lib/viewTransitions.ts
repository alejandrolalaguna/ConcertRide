// View Transitions API helper with graceful fallback for browsers that don't
// support it (Firefox <144, Safari <18, very old Chrome). The fallback simply
// runs the callback synchronously — no transition, but no regression either.
//
// Usage:
//   import { withViewTransition } from "@/lib/viewTransitions";
//   withViewTransition(() => navigate(`/concerts/${id}`));
//
// For element-to-element morphs across navigations, also add
// `view-transition-name: cr-concert-card-${id}` (or similar) to the source
// element and the same name to the destination element. The browser handles
// the morph automatically.

type DocumentWithVT = Document & {
  startViewTransition?: (callback: () => void | Promise<void>) => {
    finished: Promise<void>;
    ready: Promise<void>;
    updateCallbackDone: Promise<void>;
  };
};

export function supportsViewTransitions(): boolean {
  if (typeof document === "undefined") return false;
  return typeof (document as DocumentWithVT).startViewTransition === "function";
}

export function withViewTransition(callback: () => void | Promise<void>): void {
  if (typeof document === "undefined") {
    void callback();
    return;
  }
  const doc = document as DocumentWithVT;
  if (typeof doc.startViewTransition === "function") {
    // Respect prefers-reduced-motion: still run the callback, but skip the
    // animation. The browser will follow user's OS-level setting if asked.
    if (typeof window !== "undefined" && window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
      void callback();
      return;
    }
    doc.startViewTransition(callback);
    return;
  }
  void callback();
}
