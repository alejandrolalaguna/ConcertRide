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

// Festival demand — registro de interés por festival × ciudad de origen
const demandSchema = z.object({
  origin_city: z.string().min(2).max(80),
  email: z.string().email().max(254).optional(),
});

route.post("/festivals/:slug/demand", async (c) => {
  const slug = c.req.param("slug");
  const body = await c.req.json().catch(() => null);
  const parsed = demandSchema.safeParse(body);
  if (!parsed.success) return c.json({ error: "bad_request" }, 400);

  const user = c.get("user" as never) as { id: string } | undefined;
  const result = await c.var.store.registerFestivalDemand({
    festival_slug: slug,
    origin_city: parsed.data.origin_city,
    user_id: user?.id,
    email: parsed.data.email,
  });
  return c.json({ ok: true, created: result.created }, result.created ? 201 : 200);
});

route.get("/festivals/:slug/demand/count", async (c) => {
  const slug = c.req.param("slug");
  const origin_city = c.req.query("origin_city");
  const count = await c.var.store.getFestivalDemandCount(slug, origin_city);
  return c.json({ count });
});

export default route;
