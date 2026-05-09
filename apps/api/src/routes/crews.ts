import { Hono } from "hono";
import { z } from "zod";
import type { HonoEnv } from "../types";
import { requireUser, getCurrentUser } from "../lib/identity";

const route = new Hono<HonoEnv>();

const inviteSchema = z.object({
  user_id: z.string().min(1),
  ride_id: z.string().min(1).optional(),
});

route.get("/", async (c) => {
  const userOrResp = await requireUser(c);
  if (userOrResp instanceof Response) return userOrResp;
  const list = await c.var.store.listCrewForUser(userOrResp.id);
  return c.json(list);
});

route.post("/invite", async (c) => {
  const userOrResp = await requireUser(c);
  if (userOrResp instanceof Response) return userOrResp;
  const raw = await c.req.json().catch(() => null);
  const parsed = inviteSchema.safeParse(raw);
  if (!parsed.success) return c.json({ error: "bad_request", issues: parsed.error.issues }, 400);
  if (parsed.data.user_id === userOrResp.id) {
    return c.json({ error: "self_invite" }, 400);
  }
  const member = await c.var.store.inviteToCrew(userOrResp, parsed.data.user_id, {
    ride_id: parsed.data.ride_id,
  });
  if (!member) return c.json({ error: "user_not_found" }, 404);

  // Fire-and-forget activity event so the recipient sees the invite in their
  // feed even before they tap the notification.
  void c.var.store.recordActivity({
    actor: userOrResp,
    kind: "crew_invited",
    target_id: parsed.data.user_id,
    label: `${userOrResp.name} te ha invitado a su crew`,
    visibility: "private",
  });

  return c.json(member, 201);
});

route.post("/:userId/accept", async (c) => {
  const userOrResp = await requireUser(c);
  if (userOrResp instanceof Response) return userOrResp;
  const otherId = c.req.param("userId");
  const member = await c.var.store.acceptCrewInvite(userOrResp.id, otherId);
  if (!member) return c.json({ error: "not_found_or_not_pending" }, 404);
  void c.var.store.recordActivity({
    actor: userOrResp,
    kind: "crew_accepted",
    target_id: otherId,
    label: `${userOrResp.name} y ${member.user.name} ahora son crew`,
    visibility: "public",
  });
  return c.json(member);
});

route.delete("/:userId", async (c) => {
  const userOrResp = await requireUser(c);
  if (userOrResp instanceof Response) return userOrResp;
  await c.var.store.removeCrewConnection(userOrResp.id, c.req.param("userId"));
  return c.json({ ok: true });
});

// Public read: list a viewer's crew that is attending a given concert. Used
// by the "X from your crew is going" widget on /concerts/:id.
route.get("/attending/:concertId", async (c) => {
  const viewer = await getCurrentUser(c);
  if (!viewer) return c.json({ crew: [] });
  const crew = await c.var.store.listCrewAttendingConcert(viewer.id, c.req.param("concertId"));
  return c.json({ crew });
});

export default route;
