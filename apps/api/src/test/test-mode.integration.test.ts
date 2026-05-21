import { describe, expect, it } from "vitest";
import { buildTestApp } from "./helpers";

// Per src/routes/test-mode.ts, the entire /api/__test__/* namespace is hard-gated
// behind BOTH env.TEST_MODE === "true" AND env.ENVIRONMENT === "development".
// Without both, the middleware returns 404 for every path in the namespace.

describe("/api/__test__/* — gated namespace", () => {
  it("returns 404 when TEST_MODE is unset (dev env)", async () => {
    const app = buildTestApp();
    const seed = await app.request("/api/__test__/seed", {
      method: "POST",
      body: JSON.stringify({ email: "e@cr.test" }),
    });
    expect(seed.status).toBe(404);
    const emails = await app.request("/api/__test__/emails");
    expect(emails.status).toBe(404);
  });

  it("returns 404 when TEST_MODE=true but ENVIRONMENT=production", async () => {
    const app = buildTestApp({ TEST_MODE: "true", ENVIRONMENT: "production" });
    const seed = await app.request("/api/__test__/seed", {
      method: "POST",
      body: JSON.stringify({ email: "e2@cr.test" }),
    });
    expect(seed.status).toBe(404);
  });

  it("returns 404 for any /api/__test__/* path when gated off", async () => {
    const app = buildTestApp();
    const reset = await app.request("/api/__test__/reset", { method: "POST" });
    expect(reset.status).toBe(404);
  });
});

describe("/api/__test__/* — enabled in TEST_MODE+development", () => {
  it("POST /api/__test__/seed creates a new verified user (201)", async () => {
    const app = buildTestApp({ TEST_MODE: "true", ENVIRONMENT: "development" });
    const res = await app.request("/api/__test__/seed", {
      method: "POST",
      body: JSON.stringify({ email: `seed-${Math.random()}@cr.test`, name: "Seed" }),
    });
    expect(res.status).toBe(201);
    const body = res.body as { user: { id: string; email: string }; seeded: boolean };
    expect(body.seeded).toBe(true);
    expect(body.user.email).toMatch(/seed-/);
  });

  it("POST /api/__test__/seed is idempotent — second call returns 200", async () => {
    const app = buildTestApp({ TEST_MODE: "true", ENVIRONMENT: "development" });
    const email = `idemp-${Math.random()}@cr.test`;
    const a = await app.request("/api/__test__/seed", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
    expect(a.status).toBe(201);
    const b = await app.request("/api/__test__/seed", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
    expect(b.status).toBe(200);
    expect((b.body as { seeded: boolean }).seeded).toBe(false);
  });

  it("GET /api/__test__/emails returns the mailbox shape", async () => {
    const app = buildTestApp({ TEST_MODE: "true", ENVIRONMENT: "development" });
    const res = await app.request("/api/__test__/emails");
    expect(res.status).toBe(200);
    const body = res.body as { emails: unknown[]; total: number };
    expect(Array.isArray(body.emails)).toBe(true);
    expect(typeof body.total).toBe("number");
  });

  it("POST /api/__test__/verify-license requires email and finds the user", async () => {
    const app = buildTestApp({ TEST_MODE: "true", ENVIRONMENT: "development" });
    const email = `vl-${Math.random()}@cr.test`;
    await app.request("/api/__test__/seed", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
    const res = await app.request("/api/__test__/verify-license", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
    expect(res.status).toBe(200);
    expect((res.body as { ok: boolean }).ok).toBe(true);
  });
});
