import { describe, expect, it } from "vitest";
import { MD_ROUTES, MD_SKIPPED, resolveMdRoute } from "./registry";
import appTsx from "../../App.tsx?raw";

// Every public route must either get a markdown version or be skipped with a
// reason. Adding a page to App.tsx without touching the registry fails here.
const appPaths = [...new Set([...appTsx.matchAll(/\bpath="([^"]+)"/g)].map((m) => m[1]!))];

describe("markdown registry", () => {
  it("parses the App.tsx routes", () => {
    expect(appPaths.length).toBeGreaterThan(50);
  });

  it("covers every App.tsx route (renderer or explicit skip)", () => {
    const known = new Set([...MD_ROUTES.map((r) => r.path), ...MD_SKIPPED.map((s) => s.path)]);
    expect(appPaths.filter((p) => !known.has(p))).toEqual([]);
  });

  it("has no stale entries and no route both registered and skipped", () => {
    const registered = MD_ROUTES.map((r) => r.path);
    const skipped = new Set(MD_SKIPPED.map((s) => s.path));
    expect(registered.filter((p) => skipped.has(p))).toEqual([]);
    expect(new Set(registered).size).toBe(registered.length);
    const app = new Set(appPaths);
    expect([...registered, ...skipped].filter((p) => !app.has(p))).toEqual([]);
  });

  it("every skip has a reason", () => {
    for (const s of MD_SKIPPED) expect(s.reason.length).toBeGreaterThan(2);
  });

  it("resolves concrete paths to the right pattern", () => {
    expect(resolveMdRoute("/")?.section).toBe("core");
    expect(resolveMdRoute("/festivales/mad-cool")?.path).toBe("/festivales/:festival");
    expect(resolveMdRoute("/festivales/mad-cool/guia")?.path).toBe("/festivales/:festival/guia");
    expect(resolveMdRoute("/rutas/madrid-mad-cool")?.section).toBe("rutas");
    expect(resolveMdRoute("/concerts/abc123")?.source).toBe("concert-db");
    expect(resolveMdRoute("/login")).toBeNull();
    expect(resolveMdRoute("/rides/x")).toBeNull();
    expect(resolveMdRoute("/festivales/a/b/c")).toBeNull();
  });
});
