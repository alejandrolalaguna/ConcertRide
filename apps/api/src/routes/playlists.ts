import { Hono } from "hono";
import { z } from "zod";
import type { HonoEnv } from "../types";
import { requireUser, getCurrentUser } from "../lib/identity";

const route = new Hono<HonoEnv>();

const addSchema = z.object({
  ride_id: z.string().min(1).optional(),
  squad_id: z.string().min(1).optional(),
  track_uri: z.string().url().or(z.string().regex(/^spotify:/)).optional(),
  track_name: z.string().min(1).max(200),
  artist_name: z.string().min(1).max(200),
  album_image_url: z.string().url().optional(),
  duration_ms: z.number().int().min(0).max(60 * 60 * 1000).optional(),
});

route.get("/ride/:rideId", async (c) => {
  const tracks = await c.var.store.listPlaylistTracks({ ride_id: c.req.param("rideId") });
  return c.json({ tracks });
});

route.get("/squad/:squadId", async (c) => {
  const viewer = await getCurrentUser(c);
  const squad = await c.var.store.getSquad(c.req.param("squadId"));
  if (!squad) return c.json({ error: "not_found" }, 404);
  if (squad.visibility === "private") {
    if (!viewer || !squad.members.some((m) => m.user.id === viewer.id)) {
      return c.json({ error: "forbidden" }, 403);
    }
  }
  const tracks = await c.var.store.listPlaylistTracks({ squad_id: c.req.param("squadId") });
  return c.json({ tracks });
});

route.post("/", async (c) => {
  const userOrResp = await requireUser(c);
  if (userOrResp instanceof Response) return userOrResp;
  const raw = await c.req.json().catch(() => null);
  const parsed = addSchema.safeParse(raw);
  if (!parsed.success) return c.json({ error: "bad_request", issues: parsed.error.issues }, 400);
  const result = await c.var.store.addPlaylistTrack(userOrResp, parsed.data);
  if ("error" in result) return c.json(result, 400);
  return c.json(result, 201);
});

route.delete("/:id", async (c) => {
  const userOrResp = await requireUser(c);
  if (userOrResp instanceof Response) return userOrResp;
  await c.var.store.removePlaylistTrack(c.req.param("id"), userOrResp.id);
  return c.json({ ok: true });
});

export default route;
