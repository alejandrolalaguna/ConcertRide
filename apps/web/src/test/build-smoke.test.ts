// Smoke check: every page module in src/pages/ MUST import cleanly.
// This catches broken imports, circular references, and bad lazy() chunks
// without needing to do a full vite build. Doesn't render the components —
// React's render path requires DOM context. Pure module-load only.
import { describe, it, expect, vi } from "vitest";

// Stub heavy / browser-only modules so import doesn't fail in jsdom workers.
vi.mock("motion/react", async () => {
  const React = await import("react");
  const pass = (props: Record<string, unknown>) => {
    const { children, as, ...rest } = props as { children?: unknown; as?: string };
    return React.createElement(as ?? "div", rest, children as never);
  };
  return {
    motion: new Proxy({} as Record<string, unknown>, { get: () => pass }),
    AnimatePresence: ({ children }: { children: unknown }) => children as never,
    LayoutGroup: ({ children }: { children: unknown }) => children as never,
  };
});

vi.mock("react-leaflet", () => ({
  MapContainer: () => null,
  TileLayer: () => null,
  Marker: () => null,
  Popup: () => null,
  useMap: () => ({}),
}));

vi.mock("leaflet", () => ({
  default: { icon: () => ({}), divIcon: () => ({}) },
  icon: () => ({}),
  divIcon: () => ({}),
}));

vi.mock("canvas-confetti", () => ({
  default: () => {},
}));

// Use Vite's import.meta.glob so we don't depend on Node's fs/path APIs —
// keeps the test green even when the web tsconfig excludes @types/node.
const pageModules = import.meta.glob<{ default: unknown }>(
  "../pages/*.tsx",
  { eager: false },
);

describe("Production-smoke: every page module imports cleanly", () => {
  for (const [path, loader] of Object.entries(pageModules)) {
    const filename = path.split("/").pop() ?? path;
    if (filename.endsWith(".test.tsx")) continue;
    it(`imports ${filename}`, async () => {
      const mod = await loader();
      expect(mod).toBeTruthy();
      expect(mod.default).toBeTruthy();
    });
  }
});
