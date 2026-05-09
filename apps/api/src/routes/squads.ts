import { Hono } from "hono";
import { z } from "zod";
import type { HonoEnv } from "../types";
import { requireUser, getCurrentUser } from "../lib/identity";

const route = new Hono<HonoEnv>();

const createSchema = z.object({
  concert_id: z.string().min(1),
  name: z.string().min(2).max(80),
  vibe_tags: z.array(z.string().min(1).max(30)).max(6).optional(),
  visibility: z.enum(["public", "private"]).optional(),
});

const joinSchema = z.object({
  invite_code: z.string().min(6).max(40),
  ride_id: z.string().min(1).optional(),
  role: z.enum(["owner", "driver", "passenger", "looking"]).optional(),
});

const updateRoleSchema = z.object({
  role: z.enum(["owner", "driver", "passenger", "looking"]),
  ride_id: z.string().min(1).nullable().optional(),
});

route.get("/mine", async (c) => {
  const userOrResp = await requireUser(c);
  if (userOrResp instanceof Response) return userOrResp;
  const items = await c.var.store.listSquadsForUser(userOrResp.id);
  return c.json({ items });
});

route.get("/concert/:concertId", async (c) => {
  const items = await c.var.store.listSquadsForConcert(c.req.param("concertId"), { onlyPublic: true });
  return c.json({ items });
});

route.get("/invite/:code", async (c) => {
  const squad = await c.var.store.getSquadByInvite(c.req.param("code"));
  if (!squad) return c.json({ error: "not_found" }, 404);
  return c.json(squad);
});

route.get("/:id", async (c) => {
  const viewer = await getCurrentUser(c);
  const squad = await c.var.store.getSquad(c.req.param("id"));
  if (!squad) return c.json({ error: "not_found" }, 404);
  if (squad.visibility === "private") {
    if (!viewer || !squad.members.some((m) => m.user.id === viewer.id)) {
      return c.json({ error: "forbidden" }, 403);
    }
  }
  return c.json(squad);
});

route.post("/", async (c) => {
  const userOrResp = await requireUser(c);
  if (userOrResp instanceof Response) return userOrResp;
  const raw = await c.req.json().catch(() => null);
  const parsed = createSchema.safeParse(raw);
  if (!parsed.success) return c.json({ error: "bad_request", issues: parsed.error.issues }, 400);
  const concert = await c.var.store.getConcert(parsed.data.concert_id);
  if (!concert) return c.json({ error: "concert_not_found" }, 404);
  const squad = await c.var.store.createSquad(userOrResp, parsed.data);
  void c.var.store.recordActivity({
    actor: userOrResp,
    kind: "crew_invited",
    target_id: squad.id,
    concert_id: parsed.data.concert_id,
    label: `${userOrResp.name} creó el squad "${squad.name}" para ${concert.artist}`,
  });
  return c.json(squad, 201);
});

route.post("/join", async (c) => {
  const userOrResp = await requireUser(c);
  if (userOrResp instanceof Response) return userOrResp;
  const raw = await c.req.json().catch(() => null);
  const parsed = joinSchema.safeParse(raw);
  if (!parsed.success) return c.json({ error: "bad_request", issues: parsed.error.issues }, 400);
  const result = await c.var.store.joinSquad(userOrResp, parsed.data);
  if ("error" in result) return c.json(result, 404);
  void c.var.store.recordActivity({
    actor: userOrResp,
    kind: "crew_accepted",
    target_id: result.id,
    concert_id: result.concert.id,
    label: `${userOrResp.name} se unió al squad "${result.name}"`,
  });
  return c.json(result);
});

route.delete("/:id/me", async (c) => {
  const userOrResp = await requireUser(c);
  if (userOrResp instanceof Response) return userOrResp;
  await c.var.store.leaveSquad(c.req.param("id"), userOrResp.id);
  return c.json({ ok: true });
});

route.patch("/:id/me", async (c) => {
  const userOrResp = await requireUser(c);
  if (userOrResp instanceof Response) return userOrResp;
  const raw = await c.req.json().catch(() => null);
  const parsed = updateRoleSchema.safeParse(raw);
  if (!parsed.success) return c.json({ error: "bad_request", issues: parsed.error.issues }, 400);
  await c.var.store.updateSquadMemberRole(
    c.req.param("id"),
    userOrResp.id,
    parsed.data.role,
    parsed.data.ride_id ?? undefined,
  );
  const sq = await c.var.store.getSquad(c.req.param("id"));
  return c.json(sq);
});

export default route;
