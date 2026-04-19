import { Hono } from "hono";
import { z } from "zod";
import type { RequestStatus, ReviewsResponse, RidesResponse } from "@concertride/types";
import type { HonoEnv } from "../types";
import { requireUser } from "../lib/identity";

const listQuery = z.object({
  concert_id: z.string().min(1).optional(),
  origin_city: z.string().min(1).optional(),
  vibe: z.enum(["party", "chill", "mixed"]).optional(),
  max_price: z.coerce.number().positive().optional(),
  round_trip: z
    .union([z.literal("true"), z.literal("false")])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === "true")),
  adhoc: z
    .union([z.literal("true"), z.literal("false")])
    .optional()
    .transform((v) => (v === undefined ? undefined : v === "true")),
});

const createRideSchema = z.object({
  concert_id: z.string().min(1),
  origin_city: z.string().min(2).max(80),
  origin_lat: z.number().min(-90).max(90),
  origin_lng: z.number().min(-180).max(180),
  origin_address: z.string().min(3).max(200),
  departure_time: z.string().datetime({ offset: true }),
  price_per_seat: z.number().positive().max(500),
  seats_total: z.number().int().min(1).max(8),
  round_trip: z.boolean(),
  return_time: z.string().datetime({ offset: true }).optional(),
  playlist_url: z.string().url().optional(),
  vibe: z.enum(["party", "chill", "mixed"]),
  notes: z.string().max(500).optional(),
});

const requestSeatSchema = z.object({
  seats: z.number().int().min(1).max(8),
  message: z.string().max(500).optional(),
});

const patchRequestSchema = z.object({
  status: z.enum(["confirmed", "rejected", "cancelled"]),
});

const createReviewSchema = z.object({
  reviewee_id: z.string().min(1),
  rating: z.number().int().min(1).max(5),
  comment: z.string().max(1000).optional(),
});

const route = new Hono<HonoEnv>();

route.get("/", async (c) => {
  const parsed = listQuery.safeParse(c.req.query());
  if (!parsed.success) return c.json({ error: "bad_request", issues: parsed.error.issues }, 400);

  const rides = await c.var.store.listRides(parsed.data);
  const body: RidesResponse = { rides, total: rides.length };
  return c.json(body);
});

route.get("/:id", async (c) => {
  const ride = await c.var.store.getRide(c.req.param("id"));
  if (!ride) return c.json({ error: "not_found" }, 404);
  return c.json(ride);
});

route.post("/", async (c) => {
  const userOrResp = await requireUser(c);
  if (userOrResp instanceof Response) return userOrResp;

  const body = await c.req.json().catch(() => null);
  if (!body) return c.json({ error: "bad_request", message: "Invalid JSON" }, 400);

  const parsed = createRideSchema.safeParse(body);
  if (!parsed.success) return c.json({ error: "bad_request", issues: parsed.error.issues }, 400);

  const concert = await c.var.store.getConcert(parsed.data.concert_id);
  if (!concert) return c.json({ error: "concert_not_found" }, 404);

  const ride = await c.var.store.createRide(userOrResp, concert, parsed.data);
  return c.json(ride, 201);
});

route.post("/:id/request", async (c) => {
  const userOrResp = await requireUser(c);
  if (userOrResp instanceof Response) return userOrResp;

  const ride = await c.var.store.getRide(c.req.param("id"));
  if (!ride) return c.json({ error: "ride_not_found" }, 404);

  const body = await c.req.json().catch(() => null);
  if (!body) return c.json({ error: "bad_request", message: "Invalid JSON" }, 400);

  const parsed = requestSeatSchema.safeParse(body);
  if (!parsed.success) return c.json({ error: "bad_request", issues: parsed.error.issues }, 400);

  const result = await c.var.store.createRequest(
    ride,
    userOrResp,
    parsed.data.seats,
    parsed.data.message,
  );
  if (result.error) return c.json({ error: result.error }, 409);
  return c.json(result.request, 201);
});

route.patch("/:id/request/:rid", async (c) => {
  const userOrResp = await requireUser(c);
  if (userOrResp instanceof Response) return userOrResp;

  const ride = await c.var.store.getRide(c.req.param("id"));
  if (!ride) return c.json({ error: "ride_not_found" }, 404);
  if (ride.driver_id !== userOrResp.id)
    return c.json({ error: "forbidden", message: "Only the driver can change request status" }, 403);

  const existing = await c.var.store.getRequest(c.req.param("rid"));
  if (!existing || existing.ride_id !== ride.id)
    return c.json({ error: "request_not_found" }, 404);

  const body = await c.req.json().catch(() => null);
  if (!body) return c.json({ error: "bad_request", message: "Invalid JSON" }, 400);

  const parsed = patchRequestSchema.safeParse(body);
  if (!parsed.success) return c.json({ error: "bad_request", issues: parsed.error.issues }, 400);

  const updated = await c.var.store.updateRequestStatus(
    existing.id,
    parsed.data.status as RequestStatus,
  );
  return c.json(updated);
});

route.get("/:id/requests", async (c) => {
  const userOrResp = await requireUser(c);
  if (userOrResp instanceof Response) return userOrResp;

  const ride = await c.var.store.getRide(c.req.param("id"));
  if (!ride) return c.json({ error: "ride_not_found" }, 404);
  if (ride.driver_id !== userOrResp.id) return c.json({ error: "forbidden" }, 403);

  const requests = await c.var.store.listRequestsForRide(ride.id);
  return c.json({ requests });
});

route.get("/:id/reviews", async (c) => {
  const ride = await c.var.store.getRide(c.req.param("id"));
  if (!ride) return c.json({ error: "ride_not_found" }, 404);

  const reviews = await c.var.store.listReviewsForRide(ride.id);
  const body: ReviewsResponse = { reviews, total: reviews.length };
  return c.json(body);
});

route.post("/:id/reviews", async (c) => {
  const userOrResp = await requireUser(c);
  if (userOrResp instanceof Response) return userOrResp;

  const ride = await c.var.store.getRide(c.req.param("id"));
  if (!ride) return c.json({ error: "ride_not_found" }, 404);

  const body = await c.req.json().catch(() => null);
  if (!body) return c.json({ error: "bad_request", message: "Invalid JSON" }, 400);

  const parsed = createReviewSchema.safeParse(body);
  if (!parsed.success) return c.json({ error: "bad_request", issues: parsed.error.issues }, 400);

  const result = await c.var.store.createReview(ride, userOrResp, parsed.data);
  if (result.error) return c.json({ error: result.error }, 409);
  return c.json(result.review, 201);
});

export default route;
