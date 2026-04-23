import { Hono, type Context } from "hono";
import { z } from "zod";
import type { HonoEnv } from "../types";
import { requireUser } from "../lib/identity";
import { isAdminUserId } from "../lib/admin";

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
  return c.json(updated);
});

export default route;
