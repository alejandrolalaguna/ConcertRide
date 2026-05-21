import { describe, expect, it } from "vitest";
import { buildTestApp, registerAndLogin } from "./helpers";

// The /api/stats route is per-user (Wrapped-style) plus a public demand
// prediction endpoint. There's no public aggregate /api/stats catch-all.

describe("GET /api/stats/me", () => {
  it("requires auth", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/stats/me");
    expect(res.status).toBe(401);
  });

  it("returns aggregated travel stats for the user", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, `st-${Math.random()}@cr.test`);
    const res = await app.request("/api/stats/me", { cookies: cookie });
    expect(res.status).toBe(200);
    expect(typeof res.body).toBe("object");
    // The stats payload must never include raw PII. Light sanity check.
    const json = JSON.stringify(res.body);
    expect(json).not.toMatch(/@cr\.test/);
  });
});

describe("GET /api/stats/me/festival-history", () => {
  it("requires auth", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/stats/me/festival-history");
    expect(res.status).toBe(401);
  });

  it("returns items array", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, `sth-${Math.random()}@cr.test`);
    const res = await app.request("/api/stats/me/festival-history", { cookies: cookie });
    expect(res.status).toBe(200);
    expect(Array.isArray((res.body as { items: unknown[] }).items)).toBe(true);
  });
});

describe("GET /api/stats/demand (public)", () => {
  it("returns items without auth", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/stats/demand");
    expect(res.status).toBe(200);
    expect(Array.isArray((res.body as { items: unknown[] }).items)).toBe(true);
  });

  it("respects the limit query param", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/stats/demand?limit=3");
    expect(res.status).toBe(200);
    const items = (res.body as { items: unknown[] }).items;
    expect(items.length).toBeLessThanOrEqual(3);
  });
});
