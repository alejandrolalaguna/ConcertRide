import { describe, expect, it } from "vitest";
import { buildTestApp, registerAndLogin, FIXTURE_CONCERT_ID } from "./helpers";

describe("GET /api/anticipations/concert/:concertId", () => {
  it("returns a summary anonymously", async () => {
    const app = buildTestApp();
    const res = await app.request(`/api/anticipations/concert/${FIXTURE_CONCERT_ID}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("going_count");
    expect(res.body).toHaveProperty("maybe_count");
  });
});

describe("POST /api/anticipations/concert/:concertId", () => {
  it("requires auth", async () => {
    const app = buildTestApp();
    const res = await app.request(`/api/anticipations/concert/${FIXTURE_CONCERT_ID}`, {
      method: "POST",
      body: JSON.stringify({ status: "going" }),
    });
    expect(res.status).toBe(401);
  });

  it("rejects unknown status enum", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, `ant-${Math.random()}@cr.test`);
    const res = await app.request(`/api/anticipations/concert/${FIXTURE_CONCERT_ID}`, {
      method: "POST",
      cookies: cookie,
      body: JSON.stringify({ status: "unsure" }),
    });
    expect(res.status).toBe(400);
  });

  it("sets and transitions going → maybe", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, `ant2-${Math.random()}@cr.test`);
    const going = await app.request(`/api/anticipations/concert/${FIXTURE_CONCERT_ID}`, {
      method: "POST",
      cookies: cookie,
      body: JSON.stringify({ status: "going" }),
    });
    expect(going.status).toBe(200);
    expect((going.body as { status: string }).status).toBe("going");

    const maybe = await app.request(`/api/anticipations/concert/${FIXTURE_CONCERT_ID}`, {
      method: "POST",
      cookies: cookie,
      body: JSON.stringify({ status: "maybe" }),
    });
    expect(maybe.status).toBe(200);
    expect((maybe.body as { status: string }).status).toBe("maybe");
  });

  it("returns 404 for unknown concert id", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, `ant3-${Math.random()}@cr.test`);
    const res = await app.request("/api/anticipations/concert/c_nope", {
      method: "POST",
      cookies: cookie,
      body: JSON.stringify({ status: "going" }),
    });
    expect(res.status).toBe(404);
  });
});

describe("DELETE /api/anticipations/concert/:concertId", () => {
  it("removes the anticipation idempotently", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, `ant4-${Math.random()}@cr.test`);
    await app.request(`/api/anticipations/concert/${FIXTURE_CONCERT_ID}`, {
      method: "POST",
      cookies: cookie,
      body: JSON.stringify({ status: "going" }),
    });
    const del = await app.request(`/api/anticipations/concert/${FIXTURE_CONCERT_ID}`, {
      method: "DELETE",
      cookies: cookie,
    });
    expect(del.status).toBe(200);
  });
});

describe("GET /api/anticipations/mine", () => {
  it("requires auth", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/anticipations/mine");
    expect(res.status).toBe(401);
  });

  it("returns items array for authed user", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, `ant5-${Math.random()}@cr.test`);
    await app.request(`/api/anticipations/concert/${FIXTURE_CONCERT_ID}`, {
      method: "POST",
      cookies: cookie,
      body: JSON.stringify({ status: "going" }),
    });
    const res = await app.request("/api/anticipations/mine", { cookies: cookie });
    expect(res.status).toBe(200);
    expect(Array.isArray((res.body as { items: unknown[] }).items)).toBe(true);
  });
});
