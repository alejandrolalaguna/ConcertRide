import { Hono } from "hono";
import { z } from "zod";
import type { HonoEnv } from "../types";

const route = new Hono<HonoEnv>();

const festivalAlertSchema = z.object({
  email: z.string().email().max(254).transform((s) => s.toLowerCase().trim()),
  festival_slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/),
});

route.post("/festival", async (c) => {
  const body = await c.req.json().catch(() => null);
  const parsed = festivalAlertSchema.safeParse(body);
  if (!parsed.success) return c.json({ error: "bad_request", issues: parsed.error.issues }, 400);

  const { email, festival_slug } = parsed.data;
  const result = await c.var.store.subscribeFestivalAlert(email, festival_slug);
  return c.json({ ok: true, created: result.created }, result.created ? 201 : 200);
});

export default route;
