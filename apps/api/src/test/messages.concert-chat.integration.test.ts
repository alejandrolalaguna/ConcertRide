import { describe, expect, it } from "vitest";
import { buildTestApp, registerAndLogin } from "./helpers";

const CONCERT_ID = "c_rosalia_wizink"; // fixture seeded in MemoryStore

describe("GET /api/concerts/:id/messages", () => {
  it("requires auth", async () => {
    const app = buildTestApp();
    const res = await app.request(`/api/concerts/${CONCERT_ID}/messages`);
    expect(res.status).toBe(401);
  });

  it("returns an empty list when no messages have been posted", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, "ccempty@test.es");
    const res = await app.request(`/api/concerts/${CONCERT_ID}/messages`, { cookies: cookie });
    expect(res.status).toBe(200);
    expect((res.body as { messages: unknown[] }).messages).toEqual([]);
  });

  it("returns 404 when the concert does not exist", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, "ccmiss@test.es");
    const res = await app.request("/api/concerts/c_does_not_exist/messages", { cookies: cookie });
    expect(res.status).toBe(404);
  });
});

describe("POST /api/concerts/:id/messages", () => {
  it("requires auth", async () => {
    const app = buildTestApp();
    const res = await app.request(`/api/concerts/${CONCERT_ID}/messages`, {
      method: "POST",
      body: JSON.stringify({ body: "Sin sesión" }),
    });
    expect(res.status).toBe(401);
  });

  it("rejects empty body with 400", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, "cc-empty@test.es");
    const res = await app.request(`/api/concerts/${CONCERT_ID}/messages`, {
      method: "POST",
      cookies: cookie,
      body: JSON.stringify({ body: "" }),
    });
    expect(res.status).toBe(400);
  });

  it("rejects body over 280 chars with 400", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, "cc-long@test.es");
    const res = await app.request(`/api/concerts/${CONCERT_ID}/messages`, {
      method: "POST",
      cookies: cookie,
      body: JSON.stringify({ body: "z".repeat(281) }),
    });
    expect(res.status).toBe(400);
  });

  it("returns 404 when the concert does not exist", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, "cc-miss@test.es");
    const res = await app.request("/api/concerts/c_does_not_exist/messages", {
      method: "POST",
      cookies: cookie,
      body: JSON.stringify({ body: "Hola" }),
    });
    expect(res.status).toBe(404);
  });

  it("persists a valid message and lets a second user see it", async () => {
    const app = buildTestApp();
    const { cookie: aCookie } = await registerAndLogin(app, "cc-a@test.es", "Test1234!", "Alex");
    const { cookie: bCookie } = await registerAndLogin(app, "cc-b@test.es", "Test1234!", "Bea");

    const postA = await app.request(`/api/concerts/${CONCERT_ID}/messages`, {
      method: "POST",
      cookies: aCookie,
      body: JSON.stringify({ body: "Hype total" }),
    });
    expect(postA.status).toBe(201);

    const postB = await app.request(`/api/concerts/${CONCERT_ID}/messages`, {
      method: "POST",
      cookies: bCookie,
      body: JSON.stringify({ body: "Allí estaré" }),
    });
    expect(postB.status).toBe(201);

    const list = await app.request(`/api/concerts/${CONCERT_ID}/messages`, { cookies: aCookie });
    const body = list.body as { messages: Array<{ body: string; user: { name: string } }> };
    expect(body.messages.map((m) => m.body)).toEqual(["Hype total", "Allí estaré"]);
    expect(body.messages.map((m) => m.user.name)).toEqual(["Alex", "Bea"]);
  });
});
