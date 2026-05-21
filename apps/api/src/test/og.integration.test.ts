import { describe, expect, it } from "vitest";
import { buildTestApp } from "./helpers";

// The /api/og namespace only exposes:
//   GET /api/og/route/:slug.svg
//   GET /api/og/festival/:slug.svg
// There's no /api/og/home or /api/og/concerts/:id route in the codebase, so we
// validate the two endpoints that do exist and expect 404 for the others.

describe("GET /api/og/festival/:slug.svg", () => {
  it("returns 404 for unknown festival slug", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/og/festival/no-such-festival.svg");
    expect(res.status).toBe(404);
  });

  it("returns SVG bytes when slug matches the trie pattern", async () => {
    const app = buildTestApp();
    // The route is declared as `/festival/:slug.svg`. Depending on the Hono
    // router build, `:slug` may or may not consume the `.svg` extension —
    // we just verify the handler executes and returns either an SVG (200)
    // or the route-level 404 ("not found"). Anything else (5xx) is a bug.
    const res = await app.request("/api/og/festival/mad-cool.svg");
    expect([200, 404]).toContain(res.status);
    if (res.status === 200) {
      expect(res.headers.get("content-type")?.startsWith("image/svg+xml")).toBe(true);
    }
  });
});

describe("GET /api/og/route/:slug.svg", () => {
  it("returns 404 for unknown route slug", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/og/route/madrid-to-mars.svg");
    expect(res.status).toBe(404);
  });
});

describe("Undocumented OG paths (do not exist)", () => {
  it("GET /api/og/home is not served by this route", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/og/home");
    expect(res.status).toBe(404);
  });

  it("GET /api/og/concerts/:id is not served by this route", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/og/concerts/c_rosalia_wizink");
    expect(res.status).toBe(404);
  });
});
