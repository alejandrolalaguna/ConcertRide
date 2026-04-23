import { Hono } from "hono";
import { z } from "zod";
import type { MessagesResponse, RequestStatus, ReviewsResponse, RidesResponse } from "@concertride/types";
import type { HonoEnv } from "../types";
import { requireUser } from "../lib/identity";
import { notifyUser } from "../lib/notify";
import {
  sendDemandMatchEmail,
  sendEmail,
  sendSeatDecisionEmail,
  sendSeatRequestedEmail,
} from "../lib/email";

const listQuery = z.object({
  concert_id: z.string().min(1).optional(),
  origin_city: z.string().min(1).optional(),
  driver_id: z.string().min(1).optional(),
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
  near_lat: z.coerce.number().min(-90).max(90).optional(),
  near_lng: z.coerce.number().min(-180).max(180).optional(),
  radius_km: z.coerce.number().positive().max(500).optional(),
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
  smoking_policy: z.enum(["no", "yes"]).optional(),
  max_luggage: z.enum(["none", "small", "backpack", "cabin", "large", "extra"]).optional(),
  notes: z.string().max(500).optional(),
  instant_booking: z.boolean().optional(),
  accepted_payment: z.enum(["cash", "bizum", "cash_or_bizum"]).optional(),
});

const requestSeatSchema = z.object({
  seats: z.number().int().min(1).max(8),
  message: z.string().max(500).optional(),
  luggage: z.enum(["none", "small", "backpack", "cabin", "large", "extra"]).optional(),
  payment_method: z.enum(["cash", "bizum", "cash_or_bizum"]).optional(),
});

const patchRequestSchema = z.object({
  status: z.enum(["confirmed", "rejected", "cancelled"]),
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

  // Trust gate: only drivers who've uploaded (and we've approved) a valid
  // driver's licence can publish rides. This is the core coherence check of
  // the "verified drivers" value prop — without it, `license_verified` badges
  // on cards are theatre.
  if (!userOrResp.license_verified) {
    return c.json(
      {
        error: "license_not_verified",
        message:
          "Necesitas verificar tu carnet de conducir antes de publicar un viaje. Hazlo desde Mi perfil → Verificar carnet.",
      },
      403,
    );
  }

  const body = await c.req.json().catch(() => null);
  if (!body) return c.json({ error: "bad_request", message: "Invalid JSON" }, 400);

  const parsed = createRideSchema.safeParse(body);
  if (!parsed.success) return c.json({ error: "bad_request", issues: parsed.error.issues }, 400);

  const concert = await c.var.store.getConcert(parsed.data.concert_id);
  if (!concert) return c.json({ error: "concert_not_found" }, 404);

  const ride = await c.var.store.createRide(userOrResp, concert, parsed.data);

  // Notify users who signalled interest in this concert — push AND email
  c.executionCtx.waitUntil(
    (async () => {
      const interested = await c.var.store.listInterestedUsers(concert.id).catch(() => []);
      const rideUrl = `https://concertride.es/rides/${ride.id}`;
      await Promise.allSettled(
        interested
          .filter((u) => u.id !== userOrResp.id && !u.deleted_at)
          .flatMap((u) => [
            notifyUser(c.var.store, c.env, u.id, {
              title: `Nuevo viaje a ${concert.artist} 🎶`,
              body: `Hay un viaje desde ${ride.origin_city} a €${ride.price_per_seat}/plaza.`,
              url: `/rides/${ride.id}`,
            }),
            sendDemandMatchEmail(c.env, u.email, {
              name: u.name,
              artist: concert.artist,
              origin: ride.origin_city,
              price: ride.price_per_seat,
              rideUrl,
            }),
          ]),
      );
    })(),
  );

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
    parsed.data.luggage,
    parsed.data.payment_method,
  );
  if (result.error) return c.json({ error: result.error }, 409);

  // Notify driver — push + email
  c.executionCtx.waitUntil(
    (async () => {
      await Promise.allSettled([
        notifyUser(c.var.store, c.env, ride.driver_id, {
          title: "Nueva solicitud de plaza 🚗",
          body: `${userOrResp.name} quiere ${parsed.data.seats} plaza${parsed.data.seats === 1 ? "" : "s"} en tu viaje a ${ride.concert.artist}.`,
          url: `/rides/${ride.id}`,
        }),
        ride.driver.email && !ride.driver.deleted_at
          ? sendSeatRequestedEmail(c.env, ride.driver.email, {
              driverName: ride.driver.name,
              passengerName: userOrResp.name,
              seats: parsed.data.seats,
              artist: ride.concert.artist,
              origin: ride.origin_city,
              rideUrl: `https://concertride.es/rides/${ride.id}`,
              instantBooking: false,
            })
          : Promise.resolve(),
      ]);
    })(),
  );

  return c.json(result.request, 201);
});

route.post("/:id/book", async (c) => {
  const userOrResp = await requireUser(c);
  if (userOrResp instanceof Response) return userOrResp;

  const ride = await c.var.store.getRide(c.req.param("id"));
  if (!ride) return c.json({ error: "ride_not_found" }, 404);
  if (!ride.instant_booking) return c.json({ error: "not_instant_booking" }, 409);

  const body = await c.req.json().catch(() => null);
  if (!body) return c.json({ error: "bad_request", message: "Invalid JSON" }, 400);

  const parsed = requestSeatSchema.safeParse(body);
  if (!parsed.success) return c.json({ error: "bad_request", issues: parsed.error.issues }, 400);

  const result = await c.var.store.createRequest(
    ride,
    userOrResp,
    parsed.data.seats,
    parsed.data.message,
    parsed.data.luggage,
    parsed.data.payment_method,
  );
  if (result.error || !result.request) return c.json({ error: result.error ?? "create_failed" }, 409);

  // Auto-confirm immediately
  const confirmed = await c.var.store.updateRequestStatus(result.request.id, "confirmed");
  // Notify driver of the instant booking — email is the main channel since
  // many drivers won't have push subscriptions.
  c.executionCtx.waitUntil(
    (async () => {
      await Promise.allSettled([
        notifyUser(c.var.store, c.env, ride.driver_id, {
          title: "Nueva reserva 🎟️",
          body: `${userOrResp.name} reservó ${parsed.data.seats} plaza${parsed.data.seats === 1 ? "" : "s"} para ${ride.concert.artist}.`,
          url: `/rides/${ride.id}`,
        }),
        ride.driver.email && !ride.driver.deleted_at
          ? sendSeatRequestedEmail(c.env, ride.driver.email, {
              driverName: ride.driver.name,
              passengerName: userOrResp.name,
              seats: parsed.data.seats,
              artist: ride.concert.artist,
              origin: ride.origin_city,
              rideUrl: `https://concertride.es/rides/${ride.id}`,
              instantBooking: true,
            })
          : Promise.resolve(),
      ]);
    })(),
  );
  return c.json(confirmed, 201);
});

route.patch("/:id/request/:rid", async (c) => {
  const userOrResp = await requireUser(c);
  if (userOrResp instanceof Response) return userOrResp;

  const ride = await c.var.store.getRide(c.req.param("id"));
  if (!ride) return c.json({ error: "ride_not_found" }, 404);

  const existing = await c.var.store.getRequest(c.req.param("rid"));
  if (!existing || existing.ride_id !== ride.id)
    return c.json({ error: "request_not_found" }, 404);

  const body = await c.req.json().catch(() => null);
  if (!body) return c.json({ error: "bad_request", message: "Invalid JSON" }, 400);

  const parsed = patchRequestSchema.safeParse(body);
  if (!parsed.success) return c.json({ error: "bad_request", issues: parsed.error.issues }, 400);

  const isDriver = ride.driver_id === userOrResp.id;
  const isPassenger = existing.passenger_id === userOrResp.id;

  // Auth matrix:
  //   • Driver → can set any status (confirmed / rejected / cancelled)
  //   • Passenger → can only cancel their OWN pending/confirmed request
  if (!isDriver && !isPassenger) {
    return c.json({ error: "forbidden" }, 403);
  }
  if (isPassenger && !isDriver) {
    if (parsed.data.status !== "cancelled") {
      return c.json(
        { error: "forbidden", message: "Como pasajero solo puedes cancelar tu propia reserva." },
        403,
      );
    }
    if (existing.status !== "pending" && existing.status !== "confirmed") {
      return c.json(
        { error: "invalid_transition", message: "Esta reserva ya no se puede cancelar." },
        409,
      );
    }
  }

  const updated = await c.var.store.updateRequestStatus(
    existing.id,
    parsed.data.status as RequestStatus,
  );

  // Passenger self-cancel → notify the driver so they can re-publish the
  // freed seat mentally / emotionally.
  if (updated && isPassenger && !isDriver && parsed.data.status === "cancelled") {
    c.executionCtx.waitUntil(
      (async () => {
        await Promise.allSettled([
          notifyUser(c.var.store, c.env, ride.driver_id, {
            title: "Reserva cancelada",
            body: `${userOrResp.name} canceló su plaza en tu viaje a ${ride.concert.artist}.`,
            url: `/rides/${ride.id}`,
          }),
          ride.driver.email && !ride.driver.deleted_at
            ? sendEmail(c.env, {
                to: ride.driver.email,
                subject: `Reserva cancelada — ${ride.concert.artist}`,
                html: `<p>Hola, ${ride.driver.name}.</p><p><strong>${userOrResp.name}</strong> ha cancelado su plaza en tu viaje a <strong>${ride.concert.artist}</strong> desde ${ride.origin_city}. La plaza vuelve a estar disponible.</p><p><a href="https://concertride.es/rides/${ride.id}">Ver el viaje</a></p>`,
              })
            : Promise.resolve(),
        ]);
      })(),
    );
  }

  // Notify passenger of decision — push + email
  if (updated && (parsed.data.status === "confirmed" || parsed.data.status === "rejected")) {
    const status = parsed.data.status;
    const passenger = existing.passenger;
    const passengerEmail = passenger?.email;
    c.executionCtx.waitUntil(
      (async () => {
        await Promise.allSettled([
          notifyUser(c.var.store, c.env, existing.passenger_id, {
            title: status === "confirmed" ? "¡Plaza confirmada! 🎉" : "Solicitud rechazada",
            body:
              status === "confirmed"
                ? `${ride.driver.name} ha aceptado tu solicitud para ir a ${ride.concert.artist}.`
                : `Tu solicitud para el viaje a ${ride.concert.artist} no fue aceptada.`,
            url: status === "confirmed" ? `/rides/${ride.id}` : `/concerts/${ride.concert_id}`,
          }),
          passengerEmail && passenger && !passenger.deleted_at
            ? sendSeatDecisionEmail(c.env, passengerEmail, {
                passengerName: passenger.name,
                driverName: ride.driver.name,
                artist: ride.concert.artist,
                origin: ride.origin_city,
                rideUrl: `https://concertride.es/rides/${ride.id}`,
                status,
              })
            : Promise.resolve(),
        ]);
      })(),
    );
  }

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

// Returns the current user's own request on this ride (or null). Used by the
// ride detail page to show the right banner on reload (pending / confirmed /
// cancelled / rejected) and expose a "Cancelar reserva" action.
route.get("/:id/my-request", async (c) => {
  const userOrResp = await requireUser(c);
  if (userOrResp instanceof Response) return userOrResp;

  const rideId = c.req.param("id");
  const requests = await c.var.store.listRequestsForRide(rideId);
  const mine = requests.find((r) => r.passenger_id === userOrResp.id) ?? null;
  return c.json({ request: mine });
});

// Public list of confirmed passengers for social proof. Returns only first
// name + initial so other users can see "Laura, Dani y 3 más van también"
// without leaking full identities or emails. Readable by anyone with a
// session (not just driver / confirmed peers).
route.get("/:id/confirmed-passengers", async (c) => {
  const userOrResp = await requireUser(c);
  if (userOrResp instanceof Response) return userOrResp;

  const rideId = c.req.param("id");
  const requests = await c.var.store.listRequestsForRide(rideId);
  const confirmed = requests
    .filter((r) => r.status === "confirmed" && !r.passenger?.deleted_at)
    .map((r) => ({
      id: r.passenger.id,
      name: r.passenger.name.split(/\s+/)[0] ?? r.passenger.name, // first name only
      initial: r.passenger.name.trim().charAt(0).toUpperCase() || "?",
      seats: r.seats,
    }));
  return c.json({ passengers: confirmed });
});

route.get("/:id/messages", async (c) => {
  const userOrResp = await requireUser(c);
  if (userOrResp instanceof Response) return userOrResp;

  const ride = await c.var.store.getRide(c.req.param("id"));
  if (!ride) return c.json({ error: "ride_not_found" }, 404);

  const allowed = await c.var.store.isParticipant({ ride_id: ride.id }, userOrResp.id);
  if (!allowed) return c.json({ error: "forbidden", message: "Only driver and confirmed passengers can read this thread" }, 403);

  const msgs = await c.var.store.listMessages({ ride_id: ride.id });
  const body: MessagesResponse = { messages: msgs };
  return c.json(body);
});

route.post("/:id/messages", async (c) => {
  const userOrResp = await requireUser(c);
  if (userOrResp instanceof Response) return userOrResp;

  const ride = await c.var.store.getRide(c.req.param("id"));
  if (!ride) return c.json({ error: "ride_not_found" }, 404);

  const allowed = await c.var.store.isParticipant({ ride_id: ride.id }, userOrResp.id);
  if (!allowed) return c.json({ error: "forbidden", message: "Only driver and confirmed passengers can post" }, 403);

  const rawBody = await c.req.json().catch(() => null);
  if (!rawBody) return c.json({ error: "bad_request", message: "Invalid JSON" }, 400);

  const parsed = sendMessageSchema.safeParse(rawBody);
  if (!parsed.success) return c.json({ error: "bad_request", issues: parsed.error.issues }, 400);

  const { body, kind, attachment_url } = parsed.data;
  const msg = await c.var.store.createMessage(
    { ride_id: ride.id },
    userOrResp,
    body,
    { kind: kind ?? "text", attachment_url },
  );

  // Fan out a push notification to every other participant in this ride —
  // driver + confirmed passengers, excluding the sender. No email, it'd be
  // way too spammy for a chat.
  c.executionCtx.waitUntil(
    (async () => {
      const requests = await c.var.store.listRequestsForRide(ride.id).catch(() => []);
      const confirmed = requests.filter((r) => r.status === "confirmed");
      const recipientIds = new Set<string>();
      if (ride.driver_id !== userOrResp.id) recipientIds.add(ride.driver_id);
      for (const r of confirmed) {
        if (r.passenger_id !== userOrResp.id) recipientIds.add(r.passenger_id);
      }
      const preview =
        kind === "photo"
          ? "📷 Foto"
          : kind === "location"
            ? "📍 Ubicación"
            : body.slice(0, 80);
      await Promise.allSettled(
        [...recipientIds].map((id) =>
          notifyUser(c.var.store, c.env, id, {
            title: `${userOrResp.name} — ${ride.concert.artist}`,
            body: preview,
            url: `/rides/${ride.id}`,
          }),
        ),
      );
    })(),
  );

  return c.json(msg, 201);
});

route.post("/:id/complete", async (c) => {
  const userOrResp = await requireUser(c);
  if (userOrResp instanceof Response) return userOrResp;

  const ride = await c.var.store.getRide(c.req.param("id"));
  if (!ride) return c.json({ error: "ride_not_found" }, 404);
  if (ride.status === "cancelled") return c.json({ error: "ride_cancelled" }, 409);
  if (ride.status === "completed") return c.json({ error: "already_completed" }, 409);

  const isDriver = ride.driver_id === userOrResp.id;
  const confirmedRequests = await c.var.store.listRequestsForRide(ride.id);
  const isPassenger = confirmedRequests.some(
    (r) => r.passenger_id === userOrResp.id && r.status === "confirmed",
  );

  if (!isDriver && !isPassenger) return c.json({ error: "forbidden" }, 403);

  const role: "driver" | "passenger" = isDriver ? "driver" : "passenger";
  const updated = await c.var.store.confirmRideComplete(ride.id, role);
  if (!updated) return c.json({ error: "update_failed" }, 500);
  return c.json(updated);
});

// Driver undoes their own "viaje completado" confirmation before the passenger
// confirms. Forbidden once the ride has been marked completed.
route.delete("/:id/complete", async (c) => {
  const userOrResp = await requireUser(c);
  if (userOrResp instanceof Response) return userOrResp;

  const ride = await c.var.store.getRide(c.req.param("id"));
  if (!ride) return c.json({ error: "ride_not_found" }, 404);
  if (ride.driver_id !== userOrResp.id) return c.json({ error: "forbidden" }, 403);
  if (ride.status === "completed") return c.json({ error: "already_completed" }, 409);
  if (ride.completion_confirmed_by !== "driver") {
    return c.json({ error: "nothing_to_revoke" }, 409);
  }

  const updated = await c.var.store.revokeDriverCompletion(ride.id);
  if (!updated) return c.json({ error: "update_failed" }, 500);
  return c.json(updated);
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
