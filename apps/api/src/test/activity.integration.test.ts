import { describe, expect, it } from "vitest";
import { buildTestApp, registerAndLogin, FIXTURE_CONCERT_ID } from "./helpers";

describe("GET /api/activity", () => {
  it("works anonymously for scope=all", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/activity?scope=all");
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("events");
  });

  it("rejects scope=self without auth", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/activity?scope=self");
    expect(res.status).toBe(401);
  });

  it("rejects scope=crew without auth", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/activity?scope=crew");
    expect(res.status).toBe(401);
  });

  it("accepts scope=self with auth", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, `act-${Math.random()}@cr.test`);
    const res = await app.request("/api/activity?scope=self", { cookies: cookie });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("events");
  });

  it("respects the limit query param", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/activity?limit=5&scope=all");
    expect(res.status).toBe(200);
    const events = (res.body as { events: unknown[] }).events;
    expect(events.length).toBeLessThanOrEqual(5);
  });

  it("rejects limits over 100", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/activity?limit=999");
    expect(res.status).toBe(400);
  });

  it("filters by concert_id", async () => {
    const app = buildTestApp();
    // Trigger one event so the filter has something to potentially match.
    const { cookie } = await registerAndLogin(app, `act2-${Math.random()}@cr.test`);
    await app.request("/api/favorites", {
      method: "POST",
      cookies: cookie,
      body: JSON.stringify({ kind: "concert", target_id: FIXTURE_CONCERT_ID, label: "R" }),
    });
    const res = await app.request(`/api/activity?scope=concert&concert_id=${FIXTURE_CONCERT_ID}`);
    expect(res.status).toBe(200);
  });
});
