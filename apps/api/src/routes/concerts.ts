import { Hono } from "hono";
import { z } from "zod";
import type { ConcertsResponse, DemandSignal, MessagesResponse } from "@concertride/types";
import type { HonoEnv } from "../types";
import { requireUser } from "../lib/identity";

const querySchema = z.object({
  city: z.string().min(1).optional(),
  date_from: z.string().datetime().optional(),
  date_to: z.string().datetime().optional(),
  artist: z.string().min(1).optional(),
  genre: z.string().min(1).max(80).optional(),
  festival: z
    .union([z.literal("true"), z.literal("false")])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === "true")),
  limit: z.coerce.number().int().min(1).max(200).default(100),
  offset: z.coerce.number().int().min(0).default(0),
});

const createConcertSchema = z.object({
  artist: z.string().min(1).max(120),
  name: z.string().min(1).max(200),
  venue_name: z.string().min(1).max(120),
  venue_city: z.string().min(1).max(80),
  date: z.string().datetime({ offset: true }),
  genre: z.string().max(80).optional(),
  official_url: z.string().url().max(500).optional(),
  lineup: z.string().max(500).optional(),
});

const route = new Hono<HonoEnv>();

route.get("/", async (c) => {
  const parsed = querySchema.safeParse(c.req.query());
  if (!parsed.success) return c.json({ error: "bad_request", issues: parsed.error.issues }, 400);

  const { concerts, total } = await c.var.store.listConcerts(parsed.data);
  const page = Math.floor(parsed.data.offset / parsed.data.limit) + 1;
  const body: ConcertsResponse = { concerts, total, page };
  return c.json(body);
});

route.get("/facets", async (c) => {
  const facets = await c.var.store.listConcertFacets();
  return c.json(facets, 200, {
    "Cache-Control": "public, max-age=300",
  });
});

route.get("/:id", async (c) => {
  const concert = await c.var.store.getConcert(c.req.param("id"));
  if (!concert) return c.json({ error: "not_found" }, 404);
  return c.json(concert);
});

route.post("/", async (c) => {
  const userOrResp = await requireUser(c);
  if (userOrResp instanceof Response) return userOrResp;

  const body = await c.req.json().catch(() => null);
  if (!body) return c.json({ error: "bad_request", message: "Invalid JSON" }, 400);

  const parsed = createConcertSchema.safeParse(body);
  if (!parsed.success) return c.json({ error: "bad_request", issues: parsed.error.issues }, 400);

  const concert = await c.var.store.createConcert(parsed.data);
  return c.json(concert, 201);
});

const sendMessageSchema = z.object({
  body: z.string().min(0).max(280).default(""),
  kind: z.enum(["text", "location", "photo"]).optional(),
  // Accept either a full URL (e.g. Ticketmaster image) or an internal path
  // like `/api/messages/media/<id>` returned by our own upload endpoint.
  attachment_url: z
    .string()
    .max(500)
    .regex(/^(https?:\/\/|\/)/, "must be an URL or absolute path")
    .optional(),
});

// Concert chat is an OPEN room for any signed-in user: it's a shared space
// for fans of the same concert, regardless of whether they already have a
// ride booked. This is what turns each concert page into a community hub
// and keeps users coming back between rides.
route.get("/:id/messages", async (c) => {
  const userOrResp = await requireUser(c);
  if (userOrResp instanceof Response) return userOrResp;

  const concertId = c.req.param("id");
  const concert = await c.var.store.getConcert(concertId);
  if (!concert) return c.json({ error: "concert_not_found" }, 404);

  const msgs = await c.var.store.listMessages({ concert_id: concertId });
  const body: MessagesResponse = { messages: msgs };
  return c.json(body);
});

route.post("/:id/messages", async (c) => {
  const userOrResp = await requireUser(c);
  if (userOrResp instanceof Response) return userOrResp;

  const concertId = c.req.param("id");
  const concert = await c.var.store.getConcert(concertId);
  if (!concert) return c.json({ error: "concert_not_found" }, 404);

  const rawBody = await c.req.json().catch(() => null);
  if (!rawBody) return c.json({ error: "bad_request", message: "Invalid JSON" }, 400);

  const parsed = sendMessageSchema.safeParse(rawBody);
  if (!parsed.success) return c.json({ error: "bad_request", issues: parsed.error.issues }, 400);

  const { body, kind, attachment_url } = parsed.data;
  const msg = await c.var.store.createMessage(
    { concert_id: concertId },
    userOrResp,
    body,
    { kind: kind ?? "text", attachment_url },
  );
  return c.json(msg, 201);
});

route.get("/:id/interest", async (c) => {
  const concert = await c.var.store.getConcert(c.req.param("id"));
  if (!concert) return c.json({ error: "concert_not_found" }, 404);

  // Try to get the current user (optional — anonymous gets count only)
  let userId: string | null = null;
  try {
    const { requireUser } = await import("../lib/identity");
    const userOrResp = await requireUser(c);
    if (!(userOrResp instanceof Response)) userId = userOrResp.id;
  } catch { /* unauthenticated — fine */ }

  const signal: DemandSignal = await c.var.store.getDemandSignal(c.req.param("id"), userId);
  return c.json(signal);
});

route.post("/:id/interest", async (c) => {
  const userOrResp = await requireUser(c);
  if (userOrResp instanceof Response) return userOrResp;

  const concert = await c.var.store.getConcert(c.req.param("id"));
  if (!concert) return c.json({ error: "concert_not_found" }, 404);

  const signal: DemandSignal = await c.var.store.toggleDemandSignal(c.req.param("id"), userOrResp);
  return c.json(signal);
});

route.post("/sync", (c) => {
  const secret = c.req.header("x-ingest-secret");
  if (!secret || secret !== c.env.INGEST_SECRET) {
    return c.json({ error: "unauthorized" }, 401);
  }
  return c.json({ error: "not_implemented", message: "Wired in M5 (ingestion)" }, 501);
});

export default route;
