// Vitest setup. Loaded before every test file via vitest.config.ts.
//
// Wires:
//  - jest-dom matchers (toBeInTheDocument, toHaveAttribute, ...)
//  - a default fetch stub so tests that forget to mock get a clear error
//  - matchMedia / IntersectionObserver / ResizeObserver polyfills (jsdom lacks them)
import "@testing-library/jest-dom/vitest";
import { afterEach, vi } from "vitest";
import { cleanup } from "@testing-library/react";

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
});

// jsdom doesn't ship these — many React libs (motion, sentry, swr) blow up
// without polyfills. Make them no-ops.
class MockIntersectionObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() {
    return [];
  }
  root = null;
  rootMargin = "";
  thresholds = [];
}
class MockResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

(globalThis as unknown as { IntersectionObserver: typeof IntersectionObserver }).IntersectionObserver =
  MockIntersectionObserver as unknown as typeof IntersectionObserver;
(globalThis as unknown as { ResizeObserver: typeof ResizeObserver }).ResizeObserver =
  MockResizeObserver as unknown as typeof ResizeObserver;

if (!window.matchMedia) {
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => false,
    }),
  });
}

// Scroll APIs jsdom doesn't implement
(window as unknown as { scrollTo: (...a: unknown[]) => void }).scrollTo = () => {};
Element.prototype.scrollIntoView = Element.prototype.scrollIntoView ?? (() => {});

// localStorage / sessionStorage exist in jsdom but some tests need a clean slate.
// Tests can call `window.localStorage.clear()` in their own setup.

// Default fetch: throw a loud error so unmocked tests fail visibly.
if (!globalThis.fetch || (globalThis.fetch as unknown as { __mocked?: true }).__mocked !== true) {
  globalThis.fetch = vi.fn(async (input: RequestInfo | URL) => {
    throw new Error(
      `Unmocked fetch in test: ${typeof input === "string" ? input : input.toString()}. ` +
        `Stub api.* via vi.mock("../lib/api") or window.fetch in your test.`,
    );
  }) as unknown as typeof fetch;
}
