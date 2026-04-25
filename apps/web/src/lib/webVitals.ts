// Core Web Vitals collector — pipes LCP, CLS, INP, FCP and TTFB into the
// product analytics pipeline (PostHog via track()). Uses the native
// PerformanceObserver API directly so we don't pull in the `web-vitals`
// package: keeps the bundle lean and avoids version drift.
//
// Each metric fires at most once per page load except CLS, which is updated
// on every layout shift and reported on visibilitychange/pagehide.

import { track } from "./observability";

type VitalName = "LCP" | "CLS" | "INP" | "FCP" | "TTFB";

function rating(name: VitalName, value: number): "good" | "needs-improvement" | "poor" {
  // Thresholds per https://web.dev/vitals/
  switch (name) {
    case "LCP": return value <= 2500 ? "good" : value <= 4000 ? "needs-improvement" : "poor";
    case "CLS": return value <= 0.1 ? "good" : value <= 0.25 ? "needs-improvement" : "poor";
    case "INP": return value <= 200 ? "good" : value <= 500 ? "needs-improvement" : "poor";
    case "FCP": return value <= 1800 ? "good" : value <= 3000 ? "needs-improvement" : "poor";
    case "TTFB": return value <= 800 ? "good" : value <= 1800 ? "needs-improvement" : "poor";
  }
}

function report(name: VitalName, value: number) {
  track("web_vital", {
    metric: name,
    value: Math.round(name === "CLS" ? value * 1000 : value),
    rating: rating(name, value),
    path: typeof location !== "undefined" ? location.pathname : "",
  });
}

export function initWebVitals() {
  if (typeof window === "undefined" || typeof PerformanceObserver === "undefined") return;

  // ── LCP ───────────────────────────────────────────────────────────────
  try {
    const lcpObserver = new PerformanceObserver((list) => {
      const entries = list.getEntries() as PerformanceEntry[];
      const last = entries[entries.length - 1] as PerformanceEntry & { renderTime?: number; loadTime?: number };
      if (!last) return;
      const value = last.renderTime || last.loadTime || last.startTime;
      report("LCP", value);
    });
    lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });

    // LCP is finalised on first user input or page hide
    const finaliseLcp = () => {
      try { lcpObserver.takeRecords(); } catch { /* ignore */ }
      lcpObserver.disconnect();
    };
    addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") finaliseLcp(); }, { once: true });
  } catch { /* observer not supported */ }

  // ── CLS ───────────────────────────────────────────────────────────────
  let clsValue = 0;
  let clsReported = false;
  try {
    const clsObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as (PerformanceEntry & { value: number; hadRecentInput: boolean })[]) {
        if (!entry.hadRecentInput) clsValue += entry.value;
      }
    });
    clsObserver.observe({ type: "layout-shift", buffered: true });

    const flushCls = () => {
      if (clsReported) return;
      clsReported = true;
      report("CLS", clsValue);
    };
    addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") flushCls(); });
    addEventListener("pagehide", flushCls);
  } catch { /* ignore */ }

  // ── INP (event timing) ────────────────────────────────────────────────
  let worstInp = 0;
  let inpReported = false;
  try {
    const inpObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as (PerformanceEntry & { duration: number; interactionId?: number })[]) {
        if (entry.interactionId && entry.duration > worstInp) worstInp = entry.duration;
      }
    });
    inpObserver.observe({ type: "event", buffered: true, durationThreshold: 40 } as PerformanceObserverInit);

    const flushInp = () => {
      if (inpReported || worstInp === 0) return;
      inpReported = true;
      report("INP", worstInp);
    };
    addEventListener("visibilitychange", () => { if (document.visibilityState === "hidden") flushInp(); });
    addEventListener("pagehide", flushInp);
  } catch { /* ignore */ }

  // ── FCP ───────────────────────────────────────────────────────────────
  try {
    const fcpObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === "first-contentful-paint") {
          report("FCP", entry.startTime);
          fcpObserver.disconnect();
        }
      }
    });
    fcpObserver.observe({ type: "paint", buffered: true });
  } catch { /* ignore */ }

  // ── TTFB ──────────────────────────────────────────────────────────────
  try {
    const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    if (nav && nav.responseStart > 0) report("TTFB", nav.responseStart);
  } catch { /* ignore */ }
}
