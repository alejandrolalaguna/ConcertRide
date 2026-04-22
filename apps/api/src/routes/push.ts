import { Hono } from "hono";
import { z } from "zod";
import type { HonoEnv } from "../types";
import { requireUser } from "../lib/identity";

const route = new Hono<HonoEnv>();

const subscribeSchema = z.object({
  endpoint: z.string().url().max(2048),
  p256dh: z.string().min(1).max(512),
  auth: z.string().min(1).max(256),
});

route.get("/vapid-public-key", (c) => {
  const key = c.env.VAPID_PUBLIC_KEY ?? "";
  return c.json({ key });
});

route.post("/subscribe", async (c) => {
  const userOrResp = await requireUser(c);
  if (userOrResp instanceof Response) return userOrResp;

  const body = await c.req.json().catch(() => null);
  const parsed = subscribeSchema.safeParse(body);
  if (!parsed.success) return c.json({ error: "bad_request", issues: parsed.error.issues }, 400);

  await c.var.store.savePushSubscription(userOrResp.id, parsed.data);
  return c.json({ ok: true });
});

route.post("/unsubscribe", async (c) => {
  const userOrResp = await requireUser(c);
  if (userOrResp instanceof Response) return userOrResp;

  const body = await c.req.json().catch(() => null);
  const endpoint = body?.endpoint;
  if (typeof endpoint !== "string") return c.json({ error: "bad_request" }, 400);

  await c.var.store.removePushSubscription(endpoint);
  return c.json({ ok: true });
});

export default route;
