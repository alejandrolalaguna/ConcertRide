import { Hono } from "hono";
import { z } from "zod";
import type { FavoritesResponse } from "@concertride/types";
import type { HonoEnv } from "../types";
import { requireUser } from "../lib/identity";

const route = new Hono<HonoEnv>();

const createSchema = z.object({
  kind: z.enum(["concert", "artist", "city"]),
  target_id: z.string().min(1).max(200),
  label: z.string().min(1).max(200),
});

// Normalise the target_id so "rosalía", "Rosalía" and "ROSALÍA" all dedupe.
// Concerts keep their prefixed id untouched.
function normaliseTargetId(kind: "concert" | "artist" | "city", raw: string): string {
  if (kind === "concert") return raw;
  return raw.trim().toLowerCase();
}

route.get("/", async (c) => {
  const userOrResp = await requireUser(c);
  if (userOrResp instanceof Response) return userOrResp;

  const [favorites, upcoming_concerts] = await Promise.all([
    c.var.store.listFavorites(userOrResp.id),
    c.var.store.listFavoriteUpcomingConcerts(userOrResp.id),
  ]);

  const body: FavoritesResponse = { favorites, upcoming_concerts };
  return c.json(body);
});

route.post("/", async (c) => {
  const userOrResp = await requireUser(c);
  if (userOrResp instanceof Response) return userOrResp;

  const raw = await c.req.json().catch(() => null);
  const parsed = createSchema.safeParse(raw);
  if (!parsed.success) return c.json({ error: "bad_request", issues: parsed.error.issues }, 400);

  const { kind, target_id, label } = parsed.data;
  const normalisedId = normaliseTargetId(kind, target_id);
  const fav = await c.var.store.addFavorite(userOrResp.id, kind, normalisedId, label.trim());
  return c.json(fav, 201);
});

route.delete("/:kind/:target_id", async (c) => {
  const userOrResp = await requireUser(c);
  if (userOrResp instanceof Response) return userOrResp;

  const kind = c.req.param("kind");
  if (kind !== "concert" && kind !== "artist" && kind !== "city") {
    return c.json({ error: "bad_request", message: "Invalid kind" }, 400);
  }
  const targetId = normaliseTargetId(kind, decodeURIComponent(c.req.param("target_id")));
  await c.var.store.removeFavorite(userOrResp.id, kind, targetId);
  return c.json({ ok: true });
});

export default route;
