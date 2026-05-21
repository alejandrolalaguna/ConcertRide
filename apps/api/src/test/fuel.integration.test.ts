import { describe, expect, it } from "vitest";
import { buildTestApp } from "./helpers";

describe("GET /api/fuel-price", () => {
  it("returns gasoline95, diesel and updatedAt", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/fuel-price");
    expect(res.status).toBe(200);
    const body = res.body as { gasoline95: number; diesel: number; updatedAt: string };
    // Either real-fetched or fallback — both shapes match.
    expect(typeof body.gasoline95).toBe("number");
    expect(typeof body.diesel).toBe("number");
    expect(typeof body.updatedAt).toBe("string");
  });

  it("serves a cache-control header", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/fuel-price");
    expect(res.status).toBe(200);
    const cc = res.headers.get("cache-control");
    expect(cc).toMatch(/public/);
  });
});
