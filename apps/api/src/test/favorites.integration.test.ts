import { describe, expect, it } from "vitest";
import { buildTestApp, registerAndLogin, FIXTURE_CONCERT_ID } from "./helpers";

// favorites-chat.integration.test.ts already covers POST concerts, dedup, and
// the city normalisation path. This file fills the remaining gaps:
//   - artist favourite kind end-to-end
//   - upcoming_concerts present in the list response
//   - DELETE /api/favorites/:kind/:target_id behavior for unknown targets

describe("POST /api/favorites — every kind", () => {
  it("accepts kind=artist", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, `fartist-${Math.random()}@cr.test`);
    const res = await app.request("/api/favorites", {
      method: "POST",
      cookies: cookie,
      body: JSON.stringify({ kind: "artist", target_id: "Rosalía", label: "Rosalía" }),
    });
    expect(res.status).toBe(201);
    expect((res.body as { kind: string }).kind).toBe("artist");
  });

  it("accepts kind=city and lowercases the target_id", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, `fcity-${Math.random()}@cr.test`);
    const res = await app.request("/api/favorites", {
      method: "POST",
      cookies: cookie,
      body: JSON.stringify({ kind: "city", target_id: "Madrid", label: "Madrid" }),
    });
    expect(res.status).toBe(201);
    expect((res.body as { target_id: string }).target_id).toBe("madrid");
  });

  it("rejects unknown kinds", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, `funk-${Math.random()}@cr.test`);
    const res = await app.request("/api/favorites", {
      method: "POST",
      cookies: cookie,
      body: JSON.stringify({ kind: "venue", target_id: "wizink", label: "WiZink" }),
    });
    expect(res.status).toBe(400);
  });
});

describe("GET /api/favorites", () => {
  it("returns favorites + upcoming_concerts shape", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, `flist-${Math.random()}@cr.test`);
    await app.request("/api/favorites", {
      method: "POST",
      cookies: cookie,
      body: JSON.stringify({ kind: "concert", target_id: FIXTURE_CONCERT_ID, label: "R" }),
    });
    const res = await app.request("/api/favorites", { cookies: cookie });
    expect(res.status).toBe(200);
    const body = res.body as { favorites: unknown[]; upcoming_concerts: unknown[] };
    expect(Array.isArray(body.favorites)).toBe(true);
    expect(Array.isArray(body.upcoming_concerts)).toBe(true);
    expect(body.favorites.length).toBe(1);
  });

  it("requires auth", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/favorites");
    expect(res.status).toBe(401);
  });
});

describe("DELETE /api/favorites/:kind/:target_id", () => {
  it("is idempotent — second delete still returns ok", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, `fdel-${Math.random()}@cr.test`);
    await app.request("/api/favorites", {
      method: "POST",
      cookies: cookie,
      body: JSON.stringify({ kind: "city", target_id: "Madrid", label: "Madrid" }),
    });
    const first = await app.request("/api/favorites/city/madrid", { method: "DELETE", cookies: cookie });
    expect(first.status).toBe(200);
    const second = await app.request("/api/favorites/city/madrid", { method: "DELETE", cookies: cookie });
    expect(second.status).toBe(200);
  });

  it("rejects invalid kind in path", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, `fdel2-${Math.random()}@cr.test`);
    const res = await app.request("/api/favorites/venue/wizink", { method: "DELETE", cookies: cookie });
    expect(res.status).toBe(400);
  });
});
