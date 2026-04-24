import { Hono, type Context } from "hono";
import { z } from "zod";
import type { HonoEnv } from "../types";
import { requireUser } from "../lib/identity";
import { isAdminUserId } from "../lib/admin";
import { sendLicenseReviewResultEmail, sendBanNotificationEmail } from "../lib/email";

const route = new Hono<HonoEnv>();

const statusSchema = z.enum(["pending", "reviewed", "resolved", "dismissed"]);

// Guard: every admin route verifies the session user is in ADMIN_USER_IDS.
// Returns an opaque 404 (not 403) so anonymous scanners can't fingerprint
// the feature existence.
async function requireAdmin(c: Context<HonoEnv>) {
  const userOrResp = await requireUser(c);
  if (userOrResp instanceof Response) return userOrResp;
  if (!isAdminUserId(c.env, userOrResp.id)) {
    return c.json({ error: "not_found" }, 404);
  }
  return userOrResp;
}

route.get("/stats", async (c) => {
  const gate = await requireAdmin(c);
  if (gate instanceof Response) return gate;
  const stats = await c.var.store.getAdminStats();
  return c.json(stats);
});

route.get("/me", async (c) => {
  // Used by the admin UI to verify access before rendering. Returns 404 for
  // non-admins, 200 + user payload otherwise.
  const gate = await requireAdmin(c);
  if (gate instanceof Response) return gate;
  return c.json({ ok: true, user: gate });
});

route.get("/reports", async (c) => {
  const gate = await requireAdmin(c);
  if (gate instanceof Response) return gate;

  const statusParam = c.req.query("status");
  const parsed = statusParam ? statusSchema.safeParse(statusParam) : null;
  const reports = await c.var.store.listReportsForAdmin({
    status: parsed?.success ? parsed.data : undefined,
  });
  return c.json({ reports });
});

route.patch("/reports/:id", async (c) => {
  const gate = await requireAdmin(c);
  if (gate instanceof Response) return gate;

  const body = await c.req.json().catch(() => null);
  const parsed = z.object({ status: statusSchema }).safeParse(body);
  if (!parsed.success) return c.json({ error: "bad_request" }, 400);

  const updated = await c.var.store.updateReportStatus(c.req.param("id"), parsed.data.status);
  if (!updated) return c.json({ error: "not_found" }, 404);

  if (parsed.data.status === "resolved" || parsed.data.status === "dismissed") {
    const action = parsed.data.status === "resolved" ? "report_resolve" : "report_dismiss";
    c.var.store.logAdminAction(gate.id, action, updated.target_user_id ?? undefined, updated.id).catch(() => {});
  }
  return c.json(updated);
});

// ── License reviews ────────────────────────────────────────────────────────

const licenseStatusSchema = z.enum(["pending", "approved", "rejected"]);

route.get("/license-reviews", async (c) => {
  const gate = await requireAdmin(c);
  if (gate instanceof Response) return gate;

  const statusParam = c.req.query("status");
  const parsed = statusParam ? licenseStatusSchema.safeParse(statusParam) : null;
  const reviews = await c.var.store.listLicenseReviews({
    status: parsed?.success ? parsed.data : undefined,
  });
  return c.json({ reviews });
});

route.post("/license-reviews/:id/approve", async (c) => {
  const gate = await requireAdmin(c);
  if (gate instanceof Response) return gate;

  const { review, user } = await c.var.store.approveLicenseReview(c.req.param("id")).catch(() => ({ review: null, user: null }));
  if (!review) return c.json({ error: "not_found" }, 404);

  c.var.store.logAdminAction(gate.id, "license_approve", review.user_id).catch(() => {});
  if (user?.email) {
    sendLicenseReviewResultEmail(c.env, user.email, { name: user.name, approved: true }).catch(() => {});
  }
  return c.json({ ok: true, review });
});

route.post("/license-reviews/:id/reject", async (c) => {
  const gate = await requireAdmin(c);
  if (gate instanceof Response) return gate;

  const body = await c.req.json().catch(() => null);
  const parsed = z.object({ reason: z.string().min(1).max(500) }).safeParse(body);
  if (!parsed.success) return c.json({ error: "bad_request", message: "Se requiere un motivo" }, 400);

  const review = await c.var.store.rejectLicenseReview(c.req.param("id"), parsed.data.reason);
  if (!review) return c.json({ error: "not_found" }, 404);

  c.var.store.logAdminAction(gate.id, "license_reject", review.user_id, parsed.data.reason).catch(() => {});
  const user = await c.var.store.getUser(review.user_id);
  if (user?.email) {
    sendLicenseReviewResultEmail(c.env, user.email, {
      name: user.name,
      approved: false,
      reason: parsed.data.reason,
    }).catch(() => {});
  }
  return c.json({ ok: true, review });
});

// ── Ban system ────────────────────────────────────────────────────────────

const banSchema = z.object({ reason: z.string().min(1).max(500) });

route.post("/users/:id/ban", async (c) => {
  const admin = await requireAdmin(c);
  if (admin instanceof Response) return admin;

  const body = await c.req.json().catch(() => null);
  const parsed = banSchema.safeParse(body);
  if (!parsed.success) return c.json({ error: "bad_request", message: "Se requiere un motivo" }, 400);

  const user = await c.var.store.banUser(admin.id, c.req.param("id"), parsed.data.reason);
  if (!user) return c.json({ error: "not_found" }, 404);

  if (user.email) {
    sendBanNotificationEmail(c.env, user.email, { name: user.name, reason: parsed.data.reason }).catch(() => {});
  }
  return c.json({ ok: true, user });
});

route.post("/users/:id/unban", async (c) => {
  const admin = await requireAdmin(c);
  if (admin instanceof Response) return admin;

  const user = await c.var.store.unbanUser(admin.id, c.req.param("id"));
  if (!user) return c.json({ error: "not_found" }, 404);
  return c.json({ ok: true, user });
});

route.get("/users", async (c) => {
  const admin = await requireAdmin(c);
  if (admin instanceof Response) return admin;

  const store = c.var.store;
  // Return recently registered users for moderation overview (last 100)
  const stats = await store.getAdminStats();
  return c.json({ stats });
});

// ── Audit log ─────────────────────────────────────────────────────────────

route.get("/audit-log", async (c) => {
  const admin = await requireAdmin(c);
  if (admin instanceof Response) return admin;

  const limitParam = Number(c.req.query("limit") ?? "50");
  const limit = isNaN(limitParam) || limitParam < 1 ? 50 : Math.min(limitParam, 200);
  const entries = await c.var.store.listAdminAuditLog(limit);
  return c.json({ entries });
});

export default route;
