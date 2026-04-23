import { describe, expect, it } from "vitest";
import { buildTestApp, registerAndLogin } from "./helpers";

const CONCERT_ID = "c_rosalia_wizink"; // fixture

describe("POST /api/favorites", () => {
  it("requires auth", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/favorites", {
      method: "POST",
      body: JSON.stringify({ kind: "concert", target_id: CONCERT_ID, label: "Rosalía" }),
    });
    expect(res.status).toBe(401);
  });

  it("adds a concert favorite and returns it on /favorites", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, "fav1@test.es");
    const add = await app.request("/api/favorites", {
      method: "POST",
      cookies: cookie,
      body: JSON.stringify({ kind: "concert", target_id: CONCERT_ID, label: "Rosalía" }),
    });
    expect(add.status).toBe(201);
    const list = await app.request("/api/favorites", { cookies: cookie });
    const body = list.body as { favorites: Array<{ kind: string; target_id: string }> };
    expect(body.favorites).toHaveLength(1);
    expect(body.favorites[0]!.kind).toBe("concert");
    expect(body.favorites[0]!.target_id).toBe(CONCERT_ID);
  });

  it("is idempotent — duplicates return the same row", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, "fav2@test.es");
    const body = JSON.stringify({ kind: "artist", target_id: "Rosalía", label: "Rosalía" });
    const a = await app.request("/api/favorites", { method: "POST", cookies: cookie, body });
    const b = await app.request("/api/favorites", { method: "POST", cookies: cookie, body });
    const aId = (a.body as { id: string }).id;
    const bId = (b.body as { id: string }).id;
    expect(aId).toBe(bId);
  });

  it("normalises artist/city target_id to lowercase", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, "fav3@test.es");
    await app.request("/api/favorites", {
      method: "POST",
      cookies: cookie,
      body: JSON.stringify({ kind: "city", target_id: "Madrid", label: "Madrid" }),
    });
    await app.request("/api/favorites", {
      method: "POST",
      cookies: cookie,
      body: JSON.stringify({ kind: "city", target_id: "MADRID", label: "Madrid" }),
    });
    const list = await app.request("/api/favorites", { cookies: cookie });
    const body = list.body as { favorites: Array<{ target_id: string }> };
    expect(body.favorites).toHaveLength(1);
    expect(body.favorites[0]!.target_id).toBe("madrid");
  });
});

describe("DELETE /api/favorites/:kind/:target_id", () => {
  it("removes the favorite", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, "fav4@test.es");
    await app.request("/api/favorites", {
      method: "POST",
      cookies: cookie,
      body: JSON.stringify({ kind: "concert", target_id: CONCERT_ID, label: "R" }),
    });
    const del = await app.request(
      `/api/favorites/concert/${encodeURIComponent(CONCERT_ID)}`,
      { method: "DELETE", cookies: cookie },
    );
    expect(del.status).toBe(200);
    const list = (await app.request("/api/favorites", { cookies: cookie })).body as {
      favorites: unknown[];
    };
    expect(list.favorites).toHaveLength(0);
  });
});

describe("Concert chat — public for any authed user", () => {
  it("lets ANY authed user post a message (no ride booking required)", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, "chatter@test.es");
    const res = await app.request(`/api/concerts/${CONCERT_ID}/messages`, {
      method: "POST",
      cookies: cookie,
      body: JSON.stringify({ body: "Hola a todos los fans!", kind: "text" }),
    });
    expect(res.status).toBe(201);
    const msg = res.body as { body: string; kind: string };
    expect(msg.body).toBe("Hola a todos los fans!");
    expect(msg.kind).toBe("text");
  });

  it("requires auth for the concert chat", async () => {
    const app = buildTestApp();
    const res = await app.request(`/api/concerts/${CONCERT_ID}/messages`);
    expect(res.status).toBe(401);
  });

  it("lists messages chronologically", async () => {
    const app = buildTestApp();
    const { cookie: a } = await registerAndLogin(app, "m1@test.es");
    const { cookie: b } = await registerAndLogin(app, "m2@test.es");
    await app.request(`/api/concerts/${CONCERT_ID}/messages`, {
      method: "POST",
      cookies: a,
      body: JSON.stringify({ body: "Primero" }),
    });
    await app.request(`/api/concerts/${CONCERT_ID}/messages`, {
      method: "POST",
      cookies: b,
      body: JSON.stringify({ body: "Segundo" }),
    });
    const list = await app.request(`/api/concerts/${CONCERT_ID}/messages`, { cookies: a });
    const body = list.body as { messages: Array<{ body: string }> };
    expect(body.messages.map((m) => m.body)).toEqual(["Primero", "Segundo"]);
  });
});

describe("GET /api/concerts/facets", () => {
  it("returns curated genres and cities from the fixture catalogue", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/concerts/facets");
    expect(res.status).toBe(200);
    const body = res.body as { genres: string[]; cities: string[] };
    expect(body.genres.length).toBeGreaterThan(5);
    expect(body.cities).toContain("Madrid");
    expect(body.cities).toContain("Barcelona");
  });
});
