import { describe, expect, it } from "vitest";
import {
  buildTestApp,
  makeVerifiedDriver,
  makeVerifiedPassenger,
  publishRide,
  registerAndLogin,
} from "./helpers";

async function setupRideWithMixedPassengers() {
  const app = buildTestApp();
  const { cookie: driverCookie } = await makeVerifiedDriver(app, "rt-driver@test.es", "Test1234!", "Driver");
  // publishRide() in helpers.ts wraps the response as { ride } but the route
  // returns the ride directly, so we re-read from raw.
  const pub = await publishRide(app, driverCookie);
  const ride = pub.raw as { id: string };

  // Passenger A — requests then driver confirms
  const { cookie: aCookie } = await makeVerifiedPassenger(app, "rt-paxA@test.es", "Test1234!", "PaxA");
  const reqA = await app.request(`/api/rides/${ride.id}/request`, {
    method: "POST",
    cookies: aCookie,
    body: JSON.stringify({ seats: 1 }),
  });
  const reqAId = (reqA.body as { id: string }).id;
  await app.request(`/api/rides/${ride.id}/request/${reqAId}`, {
    method: "PATCH",
    cookies: driverCookie,
    body: JSON.stringify({ status: "confirmed" }),
  });

  // Passenger B — requests, stays pending
  const { cookie: bCookie } = await makeVerifiedPassenger(app, "rt-paxB@test.es", "Test1234!", "PaxB");
  await app.request(`/api/rides/${ride.id}/request`, {
    method: "POST",
    cookies: bCookie,
    body: JSON.stringify({ seats: 1 }),
  });

  // User C — never requests
  const { cookie: cCookie } = await registerAndLogin(app, "rt-userC@test.es", "Test1234!", "UserC");

  return { app, ride, driverCookie, aCookie, bCookie, cCookie };
}

describe("GET /api/rides/:id/messages — access control", () => {
  it("allows the driver", async () => {
    const { app, ride, driverCookie } = await setupRideWithMixedPassengers();
    const res = await app.request(`/api/rides/${ride.id}/messages`, { cookies: driverCookie });
    expect(res.status).toBe(200);
    expect(Array.isArray((res.body as { messages: unknown[] }).messages)).toBe(true);
  });

  it("allows a confirmed passenger", async () => {
    const { app, ride, aCookie } = await setupRideWithMixedPassengers();
    const res = await app.request(`/api/rides/${ride.id}/messages`, { cookies: aCookie });
    expect(res.status).toBe(200);
  });

  it("rejects a pending (not confirmed) passenger with 403", async () => {
    const { app, ride, bCookie } = await setupRideWithMixedPassengers();
    const res = await app.request(`/api/rides/${ride.id}/messages`, { cookies: bCookie });
    expect(res.status).toBe(403);
  });

  it("rejects an unrelated user with 403", async () => {
    const { app, ride, cCookie } = await setupRideWithMixedPassengers();
    const res = await app.request(`/api/rides/${ride.id}/messages`, { cookies: cCookie });
    expect(res.status).toBe(403);
  });

  it("requires auth", async () => {
    const { app, ride } = await setupRideWithMixedPassengers();
    const res = await app.request(`/api/rides/${ride.id}/messages`);
    expect(res.status).toBe(401);
  });

  it("returns 404 for an unknown ride id", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, "rt-404@test.es");
    const res = await app.request("/api/rides/r_does_not_exist/messages", { cookies: cookie });
    expect(res.status).toBe(404);
  });
});

describe("POST /api/rides/:id/messages — access control", () => {
  it("lets the driver post", async () => {
    const { app, ride, driverCookie } = await setupRideWithMixedPassengers();
    const res = await app.request(`/api/rides/${ride.id}/messages`, {
      method: "POST",
      cookies: driverCookie,
      body: JSON.stringify({ body: "Salimos a las 18:00" }),
    });
    expect(res.status).toBe(201);
  });

  it("lets a confirmed passenger post", async () => {
    const { app, ride, aCookie } = await setupRideWithMixedPassengers();
    const res = await app.request(`/api/rides/${ride.id}/messages`, {
      method: "POST",
      cookies: aCookie,
      body: JSON.stringify({ body: "Perfecto, voy" }),
    });
    expect(res.status).toBe(201);
  });

  it("rejects a pending passenger with 403", async () => {
    const { app, ride, bCookie } = await setupRideWithMixedPassengers();
    const res = await app.request(`/api/rides/${ride.id}/messages`, {
      method: "POST",
      cookies: bCookie,
      body: JSON.stringify({ body: "¿Aceptas mi plaza?" }),
    });
    expect(res.status).toBe(403);
  });

  it("rejects an unrelated user with 403", async () => {
    const { app, ride, cCookie } = await setupRideWithMixedPassengers();
    const res = await app.request(`/api/rides/${ride.id}/messages`, {
      method: "POST",
      cookies: cCookie,
      body: JSON.stringify({ body: "Hola" }),
    });
    expect(res.status).toBe(403);
  });

  it("validates body 1-280 chars", async () => {
    const { app, ride, driverCookie } = await setupRideWithMixedPassengers();
    const tooLong = await app.request(`/api/rides/${ride.id}/messages`, {
      method: "POST",
      cookies: driverCookie,
      body: JSON.stringify({ body: "a".repeat(281) }),
    });
    expect(tooLong.status).toBe(400);
    const empty = await app.request(`/api/rides/${ride.id}/messages`, {
      method: "POST",
      cookies: driverCookie,
      body: JSON.stringify({ body: "" }),
    });
    expect(empty.status).toBe(400);
  });
});
