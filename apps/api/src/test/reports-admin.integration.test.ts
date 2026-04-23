import { describe, expect, it } from "vitest";
import { buildTestApp, registerAndLogin } from "./helpers";
import { signSession } from "../lib/jwt";

const TEST_JWT_SECRET = "test-secret-32bytes-hex-padded-ab";

// Helper: build an admin-enabled app where `ADMIN_USER_IDS` is a stable value,
// then craft a user with that exact id and a matching session JWT. Avoids the
// register-then-rebuild dance that the env snapshot forces.
async function buildAdminApp() {
  const ADMIN_ID = "admin-fixed-id";
  const ctx = buildTestApp({ ADMIN_USER_IDS: ADMIN_ID });
  const admin = await ctx.store.createUserWithPassword("admin@test.es", "Admin", "h", "s");
  (admin as unknown as { id: string }).id = ADMIN_ID;
  const jwt = await signSession(
    { sub: ADMIN_ID, email: admin.email },
    TEST_JWT_SECRET,
  );
  return { ...ctx, adminId: ADMIN_ID, adminCookie: `cr_session=${jwt}` };
}

describe("POST /api/reports", () => {
  it("requires auth", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/reports", {
      method: "POST",
      body: JSON.stringify({ reason: "spam", target_user_id: "u_nobody" }),
    });
    expect(res.status).toBe(401);
  });

  it("rejects when neither target_user nor ride are provided", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, "r@test.es");
    const res = await app.request("/api/reports", {
      method: "POST",
      cookies: cookie,
      body: JSON.stringify({ reason: "spam" }),
    });
    expect(res.status).toBe(400);
  });

  it("creates a report targeting a valid user", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, "reporter@test.es");
    const { userId: targetId } = await registerAndLogin(app, "target@test.es");
    const res = await app.request("/api/reports", {
      method: "POST",
      cookies: cookie,
      body: JSON.stringify({
        target_user_id: targetId,
        reason: "harassment",
        body: "sample report body",
      }),
    });
    expect(res.status).toBe(201);
    const report = res.body as { id: string; status: string; reason: string };
    expect(report.status).toBe("pending");
    expect(report.reason).toBe("harassment");
  });

  it("never responds with 500 on invalid target (400 or 201 only)", async () => {
    // MemoryStore doesn't enforce FK so it accepts unknown ids as 201; Drizzle
    // would throw → route catches → 400. Either is fine; 500 is not.
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, "rr@test.es");
    const res = await app.request("/api/reports", {
      method: "POST",
      cookies: cookie,
      body: JSON.stringify({ target_user_id: "u_doesnt_exist", reason: "spam" }),
    });
    expect([201, 400]).toContain(res.status);
  });

  it("caps at 10 reports per reporter per 24h (then 429)", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, "spammy@test.es");
    const { userId: targetId } = await registerAndLogin(app, "target2@test.es");
    const body = { target_user_id: targetId, reason: "spam", body: "x" };
    let lastStatus = 0;
    for (let i = 0; i < 12; i++) {
      const res = await app.request("/api/reports", {
        method: "POST",
        cookies: cookie,
        body: JSON.stringify(body),
        // Use different IPs so the universal 60/min write limiter doesn't
        // kick in before the per-user daily report cap.
        headers: { "cf-connecting-ip": `10.0.${i}.1` },
      });
      lastStatus = res.status;
      if (res.status === 429) break;
    }
    expect(lastStatus).toBe(429);
  });
});

describe("Admin gate (ADMIN_USER_IDS)", () => {
  it("returns 401 for anon", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/admin/me");
    expect(res.status).toBe(401);
  });

  it("returns 404 for non-admin authed users", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, "muggle@test.es");
    const res = await app.request("/api/admin/me", { cookies: cookie });
    expect(res.status).toBe(404);
  });

  it("lets the admin through", async () => {
    const { request, adminCookie } = await buildAdminApp();
    const res = await request("/api/admin/me", { cookies: adminCookie });
    expect(res.status).toBe(200);
    expect((res.body as { ok: true }).ok).toBe(true);
  });

  it("admin can list pending reports", async () => {
    const { request, adminCookie, store } = await buildAdminApp();
    // Seed a report directly
    const reporter = await store.createUserWithPassword("rx@t.es", "RX", "h", "s");
    const target = await store.createUserWithPassword("tx@t.es", "TX", "h", "s");
    await store.createReport(reporter.id, {
      target_user_id: target.id,
      reason: "no_show",
      body: "didn't show up",
    });

    const res = await request("/api/admin/reports?status=pending", { cookies: adminCookie });
    expect(res.status).toBe(200);
    const body = res.body as { reports: Array<{ reason: string; reporter: { name: string } }> };
    expect(body.reports.length).toBeGreaterThanOrEqual(1);
    const seeded = body.reports.find((r) => r.reason === "no_show");
    expect(seeded).toBeDefined();
    expect(seeded!.reporter.name).toBe("RX");
  });

  it("admin can mutate a report status", async () => {
    const { request, adminCookie, store } = await buildAdminApp();
    const reporter = await store.createUserWithPassword("ra@t.es", "R", "h", "s");
    const target = await store.createUserWithPassword("ta@t.es", "T", "h", "s");
    const report = await store.createReport(reporter.id, {
      target_user_id: target.id,
      reason: "spam",
    });

    const res = await request(`/api/admin/reports/${report.id}`, {
      method: "PATCH",
      cookies: adminCookie,
      body: JSON.stringify({ status: "resolved" }),
    });
    expect(res.status).toBe(200);
    expect((res.body as { status: string }).status).toBe("resolved");
  });
});
