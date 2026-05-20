// Microsoft Clarity — heatmaps + session recording (free).
//
// Loaded conditionally:
//   1. `VITE_CLARITY_PROJECT_ID` env var must be present at build time.
//   2. Analytics consent must have been granted via the CookieBanner
//      (same gate as PostHog, see `lib/observability.ts`).
//
// If either condition is unmet the component is a graceful no-op — no
// Clarity script is injected and no network requests are made.
//
// The component also listens to a `cr:analytics-consent` window event so
// Clarity loads the moment the user clicks "Aceptar todo" without needing
// a page reload.

import { useEffect, useState } from "react";
import { hasAnalyticsConsent } from "@/lib/observability";

const CLARITY_GLOBAL = "clarity";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    clarity?: any;
  }
}

function injectClarity(projectId: string): void {
  if (typeof window === "undefined" || typeof document === "undefined") return;
  if (window.clarity) return; // already loaded

  // Official Clarity bootstrap. We re-implement it in TS without the
  // minified IIFE pattern so it is easier to audit.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const w = window as any;
  w[CLARITY_GLOBAL] =
    w[CLARITY_GLOBAL] ||
    function (...args: unknown[]) {
      (w[CLARITY_GLOBAL].q = w[CLARITY_GLOBAL].q || []).push(args);
    };

  const tag = document.createElement("script");
  tag.async = true;
  tag.src = `https://www.clarity.ms/tag/${projectId}`;
  const firstScript = document.getElementsByTagName("script")[0];
  if (firstScript && firstScript.parentNode) {
    firstScript.parentNode.insertBefore(tag, firstScript);
  } else {
    document.head.appendChild(tag);
  }
}

export function ClarityScript() {
  const projectId = import.meta.env.VITE_CLARITY_PROJECT_ID as string | undefined;
  const [consented, setConsented] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return hasAnalyticsConsent();
  });

  // Listen for consent changes so Clarity loads as soon as the user accepts
  // the cookie banner (no page reload needed).
  useEffect(() => {
    if (typeof window === "undefined") return;
    function onConsent() {
      if (hasAnalyticsConsent()) setConsented(true);
    }
    window.addEventListener("cr:analytics-consent", onConsent);
    // Storage event covers consent set in another tab.
    window.addEventListener("storage", onConsent);
    return () => {
      window.removeEventListener("cr:analytics-consent", onConsent);
      window.removeEventListener("storage", onConsent);
    };
  }, []);

  useEffect(() => {
    if (!projectId) return;
    if (!consented) return;
    injectClarity(projectId);
  }, [projectId, consented]);

  return null;
}
