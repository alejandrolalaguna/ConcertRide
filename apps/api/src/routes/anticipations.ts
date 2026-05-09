import { Hono } from "hono";
import { z } from "zod";
import type { HonoEnv } from "../types";
import { requireUser, getCurrentUser } from "../lib/identity";

const route = new Hono<HonoEnv>();

const setSchema = z.object({
  status: z.enum(["going", "maybe"]),
});

// Public read — used by ConcertDetailPage to show "X going · Y maybe" + crew preview.
route.get("/concert/:concertId", async (c) => {
  const viewer = await getCurrentUser(c);
  const summary = await c.var.store.getAnticipationSummary(c.req.param("concertId"), viewer?.id ?? null);
  return c.json(summary);
});

// "I'm going" toggle.
route.post("/concert/:concertId", async (c) => {
  const userOrResp = await requireUser(c);
  if (userOrResp instanceof Response) return userOrResp;
  const raw = await c.req.json().catch(() => ({}));
  const parsed = setSchema.safeParse(raw);
  if (!parsed.success) return c.json({ error: "bad_request", issues: parsed.error.issues }, 400);
  const concertId = c.req.param("concertId");
  const concert = await c.var.store.getConcert(concertId);
  if (!concert) return c.json({ error: "concert_not_found" }, 404);
  const row = await c.var.store.setAnticipation(userOrResp.id, concertId, parsed.data.status);
  void c.var.store.recordActivity({
    actor: userOrResp,
    kind: "interest_added",
    concert_id: concertId,
    city: concert.venue?.city?.toLowerCase() ?? null,
    label: `${userOrResp.name} ${parsed.data.status === "going" ? "va a" : "le interesa"} ${concert.artist}`,
  });
  return c.json(row);
});

route.delete("/concert/:concertId", async (c) => {
  const userOrResp = await requireUser(c);
  if (userOrResp instanceof Response) return userOrResp;
  await c.var.store.removeAnticipation(userOrResp.id, c.req.param("concertId"));
  return c.json({ ok: true });
});

route.get("/mine", async (c) => {
  const userOrResp = await requireUser(c);
  if (userOrResp instanceof Response) return userOrResp;
  const items = await c.var.store.listAnticipatedConcerts(userOrResp.id);
  return c.json({ items });
});

export default route;
