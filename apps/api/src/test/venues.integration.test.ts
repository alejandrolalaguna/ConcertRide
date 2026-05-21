import { describe, expect, it } from "vitest";
import { buildTestApp } from "./helpers";

describe("GET /api/venues", () => {
  it("returns the seeded venue list", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/venues");
    expect(res.status).toBe(200);
    const body = res.body as { venues: Array<{ id: string; name: string; city: string }> };
    expect(Array.isArray(body.venues)).toBe(true);
    expect(body.venues.length).toBeGreaterThan(0);
    // Sanity: each venue must have at least an id, name and city for the SEO landings.
    for (const v of body.venues) {
      expect(typeof v.id).toBe("string");
      expect(typeof v.name).toBe("string");
      expect(typeof v.city).toBe("string");
    }
  });

  it("does not require auth", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/venues");
    expect(res.status).toBe(200);
  });
});
