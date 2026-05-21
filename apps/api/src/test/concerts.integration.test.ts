import { describe, expect, it } from "vitest";
import { buildTestApp, registerAndLogin, FIXTURE_CONCERT_ID } from "./helpers";

describe("GET /api/concerts", () => {
  it("returns the seeded list with total + page", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/concerts");
    expect(res.status).toBe(200);
    const body = res.body as { concerts: Array<{ id: string }>; total: number; page: number };
    expect(body.concerts.length).toBeGreaterThan(0);
    expect(body.total).toBeGreaterThanOrEqual(body.concerts.length);
    expect(body.page).toBe(1);
  });

  it("filters by city", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/concerts?city=Madrid");
    expect(res.status).toBe(200);
    const body = res.body as { concerts: Array<{ venue: { city: string } }> };
    for (const c of body.concerts) {
      expect(c.venue.city.toLowerCase()).toContain("madrid");
    }
  });

  it("respects pagination limit/offset", async () => {
    const app = buildTestApp();
    const a = (await app.request("/api/concerts?limit=2&offset=0")).body as { concerts: unknown[]; page: number };
    const b = (await app.request("/api/concerts?limit=2&offset=2")).body as { concerts: unknown[]; page: number };
    expect(a.concerts).toHaveLength(2);
    expect(b.page).toBe(2);
  });

  it("rejects invalid date_from format", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/concerts?date_from=not-a-date");
    expect(res.status).toBe(400);
  });
});

describe("GET /api/concerts/:id", () => {
  it("returns 200 with ticketmaster_url key present (TM ToS attribution)", async () => {
    const app = buildTestApp();
    const res = await app.request(`/api/concerts/${FIXTURE_CONCERT_ID}`);
    expect(res.status).toBe(200);
    const body = res.body as Record<string, unknown>;
    // TM ToS rule: clients must be able to render the "Comprar en Ticketmaster"
    // CTA, so the key must be present even when null.
    expect("ticketmaster_url" in body).toBe(true);
  });

  it("returns 404 when concert does not exist", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/concerts/c_does_not_exist");
    expect(res.status).toBe(404);
  });
});

describe("GET /api/concerts/facets", () => {
  it("returns curated genres and cities", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/concerts/facets");
    expect(res.status).toBe(200);
    const body = res.body as { genres: string[]; cities: string[] };
    expect(Array.isArray(body.genres)).toBe(true);
    expect(Array.isArray(body.cities)).toBe(true);
  });
});

describe("POST /api/concerts/:id/interest (toggleDemandSignal)", () => {
  it("requires auth", async () => {
    const app = buildTestApp();
    const res = await app.request(`/api/concerts/${FIXTURE_CONCERT_ID}/interest`, { method: "POST" });
    expect(res.status).toBe(401);
  });

  it("toggles on then off for an authed user", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, `interest-${Math.random()}@cr.test`);
    const on = await app.request(`/api/concerts/${FIXTURE_CONCERT_ID}/interest`, {
      method: "POST",
      cookies: cookie,
    });
    expect(on.status).toBe(200);
    const off = await app.request(`/api/concerts/${FIXTURE_CONCERT_ID}/interest`, {
      method: "POST",
      cookies: cookie,
    });
    expect(off.status).toBe(200);
    // toggleDemandSignal must return the current DemandSignal payload either way
    expect(off.body).toHaveProperty("count");
  });

  it("returns 404 when toggling interest for an unknown concert", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, `interest2-${Math.random()}@cr.test`);
    const res = await app.request("/api/concerts/c_nope/interest", { method: "POST", cookies: cookie });
    expect(res.status).toBe(404);
  });
});

describe("GET /api/concerts/:id/interest (public DemandSignal)", () => {
  it("returns demand signal without auth", async () => {
    const app = buildTestApp();
    const res = await app.request(`/api/concerts/${FIXTURE_CONCERT_ID}/interest`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("count");
  });
});
