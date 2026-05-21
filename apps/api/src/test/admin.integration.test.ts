import { beforeEach, describe, expect, it, vi } from "vitest";
import { buildTestApp, registerAndLogin } from "./helpers";
import { signSession } from "../lib/jwt";
import { clearSentEmails, sentByTemplate } from "./mocks/email";

vi.mock("../lib/email", async () => {
  const mod = await import("./mocks/email");
  return mod.emailMockFactory();
});

beforeEach(() => {
  clearSentEmails();
});

const ADMIN_ID = "u_admin_test";
const JWT_SECRET = "test-secret-32bytes-hex-padded-ab";

async function buildAdminApp() {
  const ctx = buildTestApp({ ADMIN_USER_IDS: ADMIN_ID });
  const admin = await ctx.store.createUserWithPassword("admin@cr.test", "Admin", "h", "s");
  (admin as unknown as { id: string }).id = ADMIN_ID;
  const jwt = await signSession({ sub: ADMIN_ID, email: admin.email }, JWT_SECRET);
  return { ...ctx, admin, adminCookie: `cr_session=${jwt}` };
}

describe("Admin gate", () => {
  it("returns 401 for anon on /api/admin/stats", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/admin/stats");
    expect(res.status).toBe(401);
  });

  it("returns 404 (opaque) for non-admin on /api/admin/stats", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, `nonadmin-${Math.random()}@cr.test`);
    const res = await app.request("/api/admin/stats", { cookies: cookie });
    expect(res.status).toBe(404);
  });

  it("returns 404 for non-admin on /api/admin/audit-log", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, `na-${Math.random()}@cr.test`);
    const res = await app.request("/api/admin/audit-log", { cookies: cookie });
    expect(res.status).toBe(404);
  });
});

describe("GET /api/admin/stats", () => {
  it("returns counts for the admin", async () => {
    const { request, adminCookie } = await buildAdminApp();
    const res = await request("/api/admin/stats", { cookies: adminCookie });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("users");
    expect(res.body).toHaveProperty("rides");
  });
});

describe("GET /api/admin/license-reviews", () => {
  it("returns the pending review queue", async () => {
    const { request, store, adminCookie } = await buildAdminApp();
    const user = await store.createUserWithPassword(`lic-${Math.random()}@cr.test`, "Lic", "h", "s");
    await store.createLicenseReview(user.id, "kv:licenses/dummy");
    const res = await request("/api/admin/license-reviews?status=pending", { cookies: adminCookie });
    expect(res.status).toBe(200);
    const body = res.body as { reviews: Array<{ status: string }> };
    expect(body.reviews.some((r) => r.status === "pending")).toBe(true);
  });
});

describe("POST /api/admin/license-reviews/:id/approve", () => {
  it("approves, flips license_verified and fires result email", async () => {
    const { request, store, adminCookie } = await buildAdminApp();
    const email = `licA-${Math.random()}@cr.test`;
    const user = await store.createUserWithPassword(email, "L", "h", "s");
    const review = await store.createLicenseReview(user.id, "kv:dummy");
    const res = await request(`/api/admin/license-reviews/${review.id}/approve`, {
      method: "POST",
      cookies: adminCookie,
    });
    expect(res.status).toBe(200);
    const updated = await store.getUser(user.id);
    expect(updated?.license_verified).toBe(true);
    expect(sentByTemplate("license_review_result").length).toBeGreaterThan(0);
  });
});

describe("POST /api/admin/license-reviews/:id/reject", () => {
  it("rejects with reason and fires result email", async () => {
    const { request, store, adminCookie } = await buildAdminApp();
    const email = `licR-${Math.random()}@cr.test`;
    const user = await store.createUserWithPassword(email, "L", "h", "s");
    const review = await store.createLicenseReview(user.id, "kv:dummy");
    const res = await request(`/api/admin/license-reviews/${review.id}/reject`, {
      method: "POST",
      cookies: adminCookie,
      body: JSON.stringify({ reason: "Foto borrosa" }),
    });
    expect(res.status).toBe(200);
    const updated = await store.getUser(user.id);
    // Reject does NOT auto-flip license_verified, so it stays false.
    expect(updated?.license_verified).toBeFalsy();
    expect(sentByTemplate("license_review_result").length).toBeGreaterThan(0);
  });

  it("requires a reason", async () => {
    const { request, store, adminCookie } = await buildAdminApp();
    const user = await store.createUserWithPassword(`licE-${Math.random()}@cr.test`, "L", "h", "s");
    const review = await store.createLicenseReview(user.id, "kv:dummy");
    const res = await request(`/api/admin/license-reviews/${review.id}/reject`, {
      method: "POST",
      cookies: adminCookie,
      body: JSON.stringify({}),
    });
    expect(res.status).toBe(400);
  });
});

describe("POST /api/admin/users/:id/ban → cannot login", () => {
  it("bans the user, returns account_banned on next login", async () => {
    const { request, store, adminCookie } = await buildAdminApp();
    const email = `ban-${Math.random()}@cr.test`;
    // Register through the real auth flow so the password hash is set
    const reg = await request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ email, password: "Test1234!", name: "Banee", tos_accepted: true }),
    });
    expect(reg.status).toBe(201);
    const userId = (reg.body as { user: { id: string } }).user.id;

    const banRes = await request(`/api/admin/users/${userId}/ban`, {
      method: "POST",
      cookies: adminCookie,
      body: JSON.stringify({ reason: "Conducta abusiva" }),
    });
    expect(banRes.status).toBe(200);
    expect((await store.getUser(userId))?.banned_at).toBeTruthy();

    const login = await request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password: "Test1234!" }),
    });
    expect(login.status).toBe(403);
    expect((login.body as { error: string }).error).toBe("account_banned");
  });
});

describe("GET /api/admin/audit-log", () => {
  it("returns entries array", async () => {
    const { request, adminCookie } = await buildAdminApp();
    const res = await request("/api/admin/audit-log", { cookies: adminCookie });
    expect(res.status).toBe(200);
    expect(Array.isArray((res.body as { entries: unknown[] }).entries)).toBe(true);
  });
});

describe("GET /api/admin/llm-bots", () => {
  it("returns the visibility report shape", async () => {
    const { request, adminCookie } = await buildAdminApp();
    const res = await request("/api/admin/llm-bots?days=7", { cookies: adminCookie });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("by_bot");
    expect(res.body).toHaveProperty("top_paths");
  });
});
