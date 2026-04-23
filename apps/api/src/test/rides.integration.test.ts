import { describe, expect, it } from "vitest";
import { buildTestApp, registerAndLogin } from "./helpers";

// Pick an existing fixture concert for most tests — every fresh MemoryStore
// ships with the full CONCERTS fixture seed.
const FIXTURE_CONCERT_ID = "c_rosalia_wizink";

async function makeVerifiedDriver(app: ReturnType<typeof buildTestApp>, email: string) {
  const { cookie, userId } = await registerAndLogin(app, email);
  // Reach into the store to flag license_verified — publishing requires it.
  const user = await app.store.getUser(userId);
  if (user) {
    // Mutate directly on the MemoryUser (MemoryStore stores the real object)
    // instead of going through verifyLicense() which only flips the boolean.
    (user as unknown as { license_verified: boolean }).license_verified = true;
  }
  return { cookie, userId };
}

describe("POST /api/rides — trust gates", () => {
  it("rejects unverified email with 403", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({
        email: "unverified@test.es",
        password: "Test1234!",
        name: "U",
        tos_accepted: true,
      }),
    });
    const cookie = /cr_session=[^;]+/.exec(res.cookies)?.[0] ?? "";
    // Intentionally do NOT mark email_verified_at
    const publish = await app.request("/api/rides", {
      method: "POST",
      cookies: cookie,
      body: JSON.stringify({
        concert_id: FIXTURE_CONCERT_ID,
        origin_city: "Valencia",
        origin_lat: 39.47,
        origin_lng: -0.37,
        origin_address: "Plaza Ayuntamiento",
        departure_time: new Date(Date.now() + 48 * 3600_000).toISOString(),
        price_per_seat: 12,
        seats_total: 3,
        round_trip: false,
        vibe: "chill",
      }),
    });
    expect(publish.status).toBe(403);
    expect((publish.body as { error: string }).error).toBe("email_not_verified");
  });

  it("rejects when license is not verified", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, "nolic@test.es");
    // email verified, license still false
    const publish = await app.request("/api/rides", {
      method: "POST",
      cookies: cookie,
      body: JSON.stringify({
        concert_id: FIXTURE_CONCERT_ID,
        origin_city: "Valencia",
        origin_lat: 39.47,
        origin_lng: -0.37,
        origin_address: "Plaza Ayuntamiento",
        departure_time: new Date(Date.now() + 48 * 3600_000).toISOString(),
        price_per_seat: 12,
        seats_total: 3,
        round_trip: false,
        vibe: "chill",
      }),
    });
    expect(publish.status).toBe(403);
    expect((publish.body as { error: string }).error).toBe("license_not_verified");
  });

  it("creates a ride for a fully-verified driver", async () => {
    const app = buildTestApp();
    const { cookie } = await makeVerifiedDriver(app, "driver@test.es");
    const publish = await app.request("/api/rides", {
      method: "POST",
      cookies: cookie,
      body: JSON.stringify({
        concert_id: FIXTURE_CONCERT_ID,
        origin_city: "Valencia",
        origin_lat: 39.47,
        origin_lng: -0.37,
        origin_address: "Plaza Ayuntamiento",
        departure_time: new Date(Date.now() + 48 * 3600_000).toISOString(),
        price_per_seat: 12,
        seats_total: 3,
        round_trip: false,
        vibe: "chill",
      }),
    });
    expect(publish.status).toBe(201);
    const ride = publish.body as { id: string; seats_left: number; status: string };
    expect(ride.seats_left).toBe(3);
    expect(ride.status).toBe("active");
  });
});

describe("GET /api/rides/mine", () => {
  it("is not shadowed by the /:id catch-all (route ordering)", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, "mine@test.es");
    const res = await app.request("/api/rides/mine", { cookies: cookie });
    // Must NOT be "ride_not_found" — that would mean /:id is matching "mine"
    expect(res.status).toBe(200);
    const body = res.body as { driver_rides: unknown[]; passenger_requests: unknown[] };
    expect(Array.isArray(body.driver_rides)).toBe(true);
    expect(Array.isArray(body.passenger_requests)).toBe(true);
  });
});

describe("DELETE /api/rides/:id — driver cancels", () => {
  it("cancels the ride and cascades to pending/confirmed requests", async () => {
    const app = buildTestApp();
    const { cookie: driverCookie, userId: driverId } = await makeVerifiedDriver(app, "d2@test.es");
    const publish = await app.request("/api/rides", {
      method: "POST",
      cookies: driverCookie,
      body: JSON.stringify({
        concert_id: FIXTURE_CONCERT_ID,
        origin_city: "Bilbao",
        origin_lat: 43.25,
        origin_lng: -2.93,
        origin_address: "Plaza Moyúa",
        departure_time: new Date(Date.now() + 72 * 3600_000).toISOString(),
        price_per_seat: 20,
        seats_total: 3,
        round_trip: false,
        vibe: "party",
      }),
    });
    const ride = publish.body as { id: string };

    // Passenger reserves
    const { cookie: paxCookie } = await registerAndLogin(app, "p2@test.es");
    const reserve = await app.request(`/api/rides/${ride.id}/request`, {
      method: "POST",
      cookies: paxCookie,
      body: JSON.stringify({ seats: 1 }),
    });
    expect(reserve.status).toBe(201);
    const reservation = reserve.body as { id: string };

    // Driver cancels the ride
    const cancel = await app.request(`/api/rides/${ride.id}`, {
      method: "DELETE",
      cookies: driverCookie,
    });
    expect(cancel.status).toBe(200);

    // Ride now cancelled
    const refreshed = await app.request(`/api/rides/${ride.id}`);
    expect((refreshed.body as { status: string }).status).toBe("cancelled");

    // Reservation cascaded to cancelled
    const request = await app.store.getRequest(reservation.id);
    expect(request?.status).toBe("cancelled");

    void driverId;
  });
});

describe("PATCH /api/rides/:id/request/:rid — passenger self-cancel", () => {
  it("lets the passenger cancel a pending request and releases seats", async () => {
    const app = buildTestApp();
    const { cookie: driverCookie } = await makeVerifiedDriver(app, "d3@test.es");
    const ride = (
      await app.request("/api/rides", {
        method: "POST",
        cookies: driverCookie,
        body: JSON.stringify({
          concert_id: FIXTURE_CONCERT_ID,
          origin_city: "Córdoba",
          origin_lat: 37.88,
          origin_lng: -4.77,
          origin_address: "Gran Capitán",
          departure_time: new Date(Date.now() + 48 * 3600_000).toISOString(),
          price_per_seat: 10,
          seats_total: 3,
          round_trip: false,
          vibe: "mixed",
        }),
      })
    ).body as { id: string; seats_left: number };

    const { cookie: paxCookie } = await registerAndLogin(app, "p3@test.es");
    const reserve = await app.request(`/api/rides/${ride.id}/request`, {
      method: "POST",
      cookies: paxCookie,
      body: JSON.stringify({ seats: 2 }),
    });
    const req = reserve.body as { id: string };

    // Driver confirms (takes seats)
    const confirm = await app.request(`/api/rides/${ride.id}/request/${req.id}`, {
      method: "PATCH",
      cookies: driverCookie,
      body: JSON.stringify({ status: "confirmed" }),
    });
    expect(confirm.status).toBe(200);

    const beforeCancel = (await app.request(`/api/rides/${ride.id}`)).body as { seats_left: number };
    expect(beforeCancel.seats_left).toBe(1); // 3 - 2

    // Passenger cancels
    const cancel = await app.request(`/api/rides/${ride.id}/request/${req.id}`, {
      method: "PATCH",
      cookies: paxCookie,
      body: JSON.stringify({ status: "cancelled" }),
    });
    expect(cancel.status).toBe(200);

    const afterCancel = (await app.request(`/api/rides/${ride.id}`)).body as { seats_left: number };
    expect(afterCancel.seats_left).toBe(3); // seats returned
  });

  it("rejects a passenger trying to confirm their own request", async () => {
    const app = buildTestApp();
    const { cookie: driverCookie } = await makeVerifiedDriver(app, "d4@test.es");
    const ride = (
      await app.request("/api/rides", {
        method: "POST",
        cookies: driverCookie,
        body: JSON.stringify({
          concert_id: FIXTURE_CONCERT_ID,
          origin_city: "Málaga",
          origin_lat: 36.72,
          origin_lng: -4.42,
          origin_address: "Alameda",
          departure_time: new Date(Date.now() + 48 * 3600_000).toISOString(),
          price_per_seat: 15,
          seats_total: 3,
          round_trip: false,
          vibe: "chill",
        }),
      })
    ).body as { id: string };

    const { cookie: paxCookie } = await registerAndLogin(app, "p4@test.es");
    const reserve = await app.request(`/api/rides/${ride.id}/request`, {
      method: "POST",
      cookies: paxCookie,
      body: JSON.stringify({ seats: 1 }),
    });
    const req = reserve.body as { id: string };

    // Passenger tries to self-confirm — forbidden
    const attempt = await app.request(`/api/rides/${ride.id}/request/${req.id}`, {
      method: "PATCH",
      cookies: paxCookie,
      body: JSON.stringify({ status: "confirmed" }),
    });
    expect(attempt.status).toBe(403);
  });
});

describe("GET /api/rides/:id/confirmed-passengers", () => {
  it("returns only first name + initial (no email leak)", async () => {
    const app = buildTestApp();
    const { cookie: driverCookie } = await makeVerifiedDriver(app, "d5@test.es");
    const ride = (
      await app.request("/api/rides", {
        method: "POST",
        cookies: driverCookie,
        body: JSON.stringify({
          concert_id: FIXTURE_CONCERT_ID,
          origin_city: "Sevilla",
          origin_lat: 37.39,
          origin_lng: -5.98,
          origin_address: "Plaza Nueva",
          departure_time: new Date(Date.now() + 48 * 3600_000).toISOString(),
          price_per_seat: 18,
          seats_total: 3,
          round_trip: false,
          vibe: "party",
        }),
      })
    ).body as { id: string };

    // Passenger reserves + driver confirms
    const { cookie: paxCookie } = await registerAndLogin(app, "p5@test.es", "Test1234!", "Laura González");
    const reserve = await app.request(`/api/rides/${ride.id}/request`, {
      method: "POST",
      cookies: paxCookie,
      body: JSON.stringify({ seats: 1 }),
    });
    const req = reserve.body as { id: string };
    await app.request(`/api/rides/${ride.id}/request/${req.id}`, {
      method: "PATCH",
      cookies: driverCookie,
      body: JSON.stringify({ status: "confirmed" }),
    });

    // Query as a third party
    const { cookie: obsCookie } = await registerAndLogin(app, "obs@test.es");
    const res = await app.request(`/api/rides/${ride.id}/confirmed-passengers`, {
      cookies: obsCookie,
    });
    expect(res.status).toBe(200);
    const body = res.body as { passengers: Array<{ name: string; initial: string }> };
    expect(body.passengers).toHaveLength(1);
    expect(body.passengers[0]!.name).toBe("Laura");
    expect(body.passengers[0]!.initial).toBe("L");
    // Email must not be present
    const serialized = JSON.stringify(body);
    expect(serialized).not.toMatch(/p5@test\.es/);
  });
});
