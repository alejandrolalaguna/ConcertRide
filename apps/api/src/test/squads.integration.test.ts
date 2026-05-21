import { describe, expect, it } from "vitest";
import { buildTestApp, registerAndLogin, FIXTURE_CONCERT_ID } from "./helpers";

// NOTE: this route exposes:
//   POST /api/squads, POST /api/squads/join, DELETE/PATCH /api/squads/:id/me
//   GET /api/squads/mine, /concert/:id, /invite/:code, /:id
// There is no DELETE /api/squads/:id (owner-side hard delete). The closest
// behaviour is DELETE /:id/me which removes the membership. Tested below.

describe("POST /api/squads", () => {
  it("requires auth", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/squads", {
      method: "POST",
      body: JSON.stringify({ concert_id: FIXTURE_CONCERT_ID, name: "Crew 1" }),
    });
    expect(res.status).toBe(401);
  });

  it("rejects when the concert id is invalid", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, `sq-${Math.random()}@cr.test`);
    const res = await app.request("/api/squads", {
      method: "POST",
      cookies: cookie,
      body: JSON.stringify({ concert_id: "c_nope", name: "Crew" }),
    });
    expect(res.status).toBe(404);
  });

  it("creates a squad and returns invite_code", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, `sq2-${Math.random()}@cr.test`);
    const res = await app.request("/api/squads", {
      method: "POST",
      cookies: cookie,
      body: JSON.stringify({ concert_id: FIXTURE_CONCERT_ID, name: "Los Wax" }),
    });
    expect(res.status).toBe(201);
    const body = res.body as { id: string; invite_code: string; name: string };
    expect(body.name).toBe("Los Wax");
    expect(typeof body.invite_code).toBe("string");
    expect(body.invite_code.length).toBeGreaterThanOrEqual(6);
  });
});

describe("POST /api/squads/join", () => {
  it("returns 404 for an invalid invite code", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, `sqj-${Math.random()}@cr.test`);
    const res = await app.request("/api/squads/join", {
      method: "POST",
      cookies: cookie,
      body: JSON.stringify({ invite_code: "abcdef" }),
    });
    expect(res.status).toBe(404);
  });

  it("lets a second user join with the owner's invite code", async () => {
    const app = buildTestApp();
    const { cookie: owner } = await registerAndLogin(app, `sqO-${Math.random()}@cr.test`);
    const created = await app.request("/api/squads", {
      method: "POST",
      cookies: owner,
      body: JSON.stringify({ concert_id: FIXTURE_CONCERT_ID, name: "Joining" }),
    });
    const code = (created.body as { invite_code: string }).invite_code;

    const { cookie: joiner } = await registerAndLogin(app, `sqJ-${Math.random()}@cr.test`);
    const res = await app.request("/api/squads/join", {
      method: "POST",
      cookies: joiner,
      body: JSON.stringify({ invite_code: code }),
    });
    expect(res.status).toBe(200);
  });
});

describe("GET /api/squads/mine", () => {
  it("requires auth", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/squads/mine");
    expect(res.status).toBe(401);
  });

  it("returns items for an authed user", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, `sqM-${Math.random()}@cr.test`);
    await app.request("/api/squads", {
      method: "POST",
      cookies: cookie,
      body: JSON.stringify({ concert_id: FIXTURE_CONCERT_ID, name: "Mine" }),
    });
    const res = await app.request("/api/squads/mine", { cookies: cookie });
    expect(res.status).toBe(200);
    const items = (res.body as { items: unknown[] }).items;
    expect(Array.isArray(items)).toBe(true);
    expect(items.length).toBeGreaterThanOrEqual(1);
  });
});

describe("GET /api/squads/invite/:code", () => {
  it("returns 404 for unknown code", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/squads/invite/zzzzzz");
    expect(res.status).toBe(404);
  });

  it("resolves the squad for a valid code", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, `sqI-${Math.random()}@cr.test`);
    const created = await app.request("/api/squads", {
      method: "POST",
      cookies: cookie,
      body: JSON.stringify({ concert_id: FIXTURE_CONCERT_ID, name: "Invitable" }),
    });
    const code = (created.body as { invite_code: string }).invite_code;
    const res = await app.request(`/api/squads/invite/${code}`);
    expect(res.status).toBe(200);
  });
});

describe("DELETE /api/squads/:id/me (leave)", () => {
  it("requires auth", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/squads/sq_anything/me", { method: "DELETE" });
    expect(res.status).toBe(401);
  });

  it("removes membership for the calling user", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, `sqL-${Math.random()}@cr.test`);
    const created = await app.request("/api/squads", {
      method: "POST",
      cookies: cookie,
      body: JSON.stringify({ concert_id: FIXTURE_CONCERT_ID, name: "Leaving" }),
    });
    const id = (created.body as { id: string }).id;
    const res = await app.request(`/api/squads/${id}/me`, { method: "DELETE", cookies: cookie });
    expect(res.status).toBe(200);
  });
});
