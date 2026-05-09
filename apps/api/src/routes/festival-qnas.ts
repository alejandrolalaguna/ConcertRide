import { Hono } from "hono";
import { z } from "zod";
import type { HonoEnv } from "../types";
import { requireUser } from "../lib/identity";
import { rateLimit } from "../lib/ratelimit";

const route = new Hono<HonoEnv>();

route.post("/", rateLimit({ scope: "festival_qna_create", limit: 5, windowSec: 3600 }));
route.post("/:id/upvote", rateLimit({ scope: "festival_qna_upvote", limit: 50, windowSec: 3600 }));

const createSchema = z.object({
  festival_slug: z.string().min(1).max(80).regex(/^[a-z0-9-]+$/),
  question: z.string().min(8).max(200),
  answer: z.string().min(8).max(1000),
});

// Public list — only approved Q&As. The festival landing page schema and
// the public widget both consume this.
route.get("/:slug", async (c) => {
  const slug = c.req.param("slug").toLowerCase();
  const items = await c.var.store.listFestivalQnas(slug, { onlyApproved: true, limit: 30 });
  return c.json({ items });
});

// Authenticated submit — pending until an admin approves. Rate-limited
// to avoid spam: 5 per hour per IP via the middleware above.
route.post("/", async (c) => {
  const userOrResp = await requireUser(c);
  if (userOrResp instanceof Response) return userOrResp;
  const raw = await c.req.json().catch(() => null);
  const parsed = createSchema.safeParse(raw);
  if (!parsed.success) return c.json({ error: "bad_request", issues: parsed.error.issues }, 400);
  // Block obvious link spam — Q&As are text-only.
  if (/(https?:\/\/|www\.)/i.test(parsed.data.question + parsed.data.answer)) {
    return c.json({ error: "no_links_allowed" }, 400);
  }
  const qna = await c.var.store.createFestivalQna(userOrResp, {
    festival_slug: parsed.data.festival_slug.toLowerCase(),
    question: parsed.data.question,
    answer: parsed.data.answer,
  });
  void c.var.store.recordActivity({
    actor: userOrResp,
    kind: "favorite_added",
    target_id: qna.id,
    label: `${userOrResp.name} compartió un consejo para ${parsed.data.festival_slug}`,
    visibility: "public",
  });
  return c.json(qna, 201);
});

route.post("/:id/upvote", async (c) => {
  const userOrResp = await requireUser(c);
  if (userOrResp instanceof Response) return userOrResp;
  const updated = await c.var.store.upvoteFestivalQna(c.req.param("id"));
  if (!updated) return c.json({ error: "not_found" }, 404);
  return c.json(updated);
});

// Admin-only approval endpoint. Reuses the admin gate already present
// in /api/admin/* routes.
route.post("/:id/approve", async (c) => {
  const userOrResp = await requireUser(c);
  if (userOrResp instanceof Response) return userOrResp;
  const adminIds = (c.env.ADMIN_USER_IDS ?? "").split(",").map((s) => s.trim()).filter(Boolean);
  if (!adminIds.includes(userOrResp.id)) return c.json({ error: "forbidden" }, 403);
  const updated = await c.var.store.approveFestivalQna(c.req.param("id"));
  if (!updated) return c.json({ error: "not_found" }, 404);
  return c.json(updated);
});

export default route;
