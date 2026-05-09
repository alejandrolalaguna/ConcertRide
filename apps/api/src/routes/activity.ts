import { Hono } from "hono";
import { z } from "zod";
import type { HonoEnv } from "../types";
import { getCurrentUser } from "../lib/identity";

const route = new Hono<HonoEnv>();

const querySchema = z.object({
  scope: z.enum(["all", "city", "concert", "crew", "self"]).optional(),
  city: z.string().min(1).max(80).optional(),
  concert_id: z.string().min(1).max(80).optional(),
  limit: z.coerce.number().int().min(1).max(100).optional(),
  before: z.string().min(1).max(40).optional(),
});

route.get("/", async (c) => {
  const viewer = await getCurrentUser(c);
  const parsed = querySchema.safeParse({
    scope: c.req.query("scope"),
    city: c.req.query("city"),
    concert_id: c.req.query("concert_id"),
    limit: c.req.query("limit"),
    before: c.req.query("before"),
  });
  if (!parsed.success) return c.json({ error: "bad_request", issues: parsed.error.issues }, 400);
  const data = parsed.data;
  if ((data.scope === "self" || data.scope === "crew") && !viewer) {
    return c.json({ error: "unauthorized" }, 401);
  }
  const result = await c.var.store.listActivity(viewer, data);
  return c.json(result);
});

export default route;
