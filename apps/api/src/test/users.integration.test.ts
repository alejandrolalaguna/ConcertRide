import { describe, expect, it } from "vitest";
import { buildTestApp, registerAndLogin } from "./helpers";

describe("GET /api/users/:id (public profile)", () => {
  it("returns 404 for unknown id", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/users/u_does_not_exist");
    expect(res.status).toBe(404);
  });

  it("returns ONLY public fields — no email, no phone", async () => {
    const app = buildTestApp();
    const { userId } = await registerAndLogin(app, `pub-${Math.random()}@cr.test`);
    const res = await app.request(`/api/users/${userId}`);
    expect(res.status).toBe(200);
    const body = res.body as Record<string, unknown>;
    expect(body.id).toBe(userId);
    expect("email" in body).toBe(false);
    expect("phone" in body).toBe(false);
    expect("home_city" in body).toBe(false);
    expect("referral_code" in body).toBe(false);
    expect(body).toHaveProperty("name");
    expect(body).toHaveProperty("badges");
  });

  it("accepts the id without the u_ prefix", async () => {
    const app = buildTestApp();
    const { userId } = await registerAndLogin(app, `pub2-${Math.random()}@cr.test`);
    const stripped = userId.replace(/^u_/, "");
    const res = await app.request(`/api/users/${stripped}`);
    expect(res.status).toBe(200);
    expect((res.body as { id: string }).id).toBe(userId);
  });
});

describe("GET /api/users/:id/badges", () => {
  it("returns a badges array", async () => {
    const app = buildTestApp();
    const { userId } = await registerAndLogin(app, `b-${Math.random()}@cr.test`);
    const res = await app.request(`/api/users/${userId}/badges`);
    expect(res.status).toBe(200);
    expect(Array.isArray((res.body as { badges: unknown[] }).badges)).toBe(true);
  });

  it("returns 404 for unknown user", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/users/u_nope/badges");
    expect(res.status).toBe(404);
  });
});

describe("GET /api/users/:id/reviews", () => {
  it("returns reviews list shape", async () => {
    const app = buildTestApp();
    const { userId } = await registerAndLogin(app, `rev-${Math.random()}@cr.test`);
    const res = await app.request(`/api/users/${userId}/reviews`);
    expect(res.status).toBe(200);
    const body = res.body as { reviews: unknown[]; total: number };
    expect(Array.isArray(body.reviews)).toBe(true);
    expect(typeof body.total).toBe("number");
  });
});
