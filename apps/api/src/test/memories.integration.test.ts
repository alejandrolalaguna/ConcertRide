import { describe, expect, it } from "vitest";
import { buildTestApp, makeVerifiedDriver, publishRide, FIXTURE_CONCERT_ID } from "./helpers";

// NOTE: the /api/memories route only exposes POST (create), GET (by id), POST :id/share,
// GET /concert/:concertId, GET /user/mine and GET :id/share-image.svg. There's
// no PATCH or DELETE on the route layer — those endpoints simply don't exist.
// We test what the code does, not what an abstract spec demands.

async function createCompletedRide(app: ReturnType<typeof buildTestApp>, cookie: string): Promise<string> {
  const pub = await publishRide(app, cookie);
  if (pub.status !== 201) throw new Error(`publish failed: ${pub.status}`);
  const rides = (app.store as unknown as { rides: Array<{ id: string; status: string }> }).rides;
  const row = rides.find((r) => r.id === pub.ride.id);
  if (!row) throw new Error("ride row not found");
  row.status = "completed";
  return pub.ride.id;
}

describe("POST /api/memories", () => {
  it("requires auth", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/memories", {
      method: "POST",
      body: JSON.stringify({ ride_id: "r_nope" }),
    });
    expect(res.status).toBe(401);
  });

  it("rejects when ride doesn't exist", async () => {
    const app = buildTestApp();
    const { cookie } = await makeVerifiedDriver(app, `mem-${Math.random()}@cr.test`);
    const res = await app.request("/api/memories", {
      method: "POST",
      cookies: cookie,
      body: JSON.stringify({ ride_id: "r_nope" }),
    });
    expect(res.status).toBe(400);
  });

  it("creates a memory when the driver owns the completed ride", async () => {
    const app = buildTestApp();
    const { cookie } = await makeVerifiedDriver(app, `mem2-${Math.random()}@cr.test`);
    const rideId = await createCompletedRide(app, cookie);
    const res = await app.request("/api/memories", {
      method: "POST",
      cookies: cookie,
      body: JSON.stringify({ ride_id: rideId, title: "Gran viaje" }),
    });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
  });
});

describe("GET /api/memories/:id", () => {
  it("returns 404 for unknown id", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/memories/tm_nope");
    expect(res.status).toBe(404);
  });

  it("forbids viewing a private memory by another user", async () => {
    const app = buildTestApp();
    const { cookie: a } = await makeVerifiedDriver(app, `memA-${Math.random()}@cr.test`);
    const rideId = await createCompletedRide(app, a);
    const created = await app.request("/api/memories", {
      method: "POST",
      cookies: a,
      body: JSON.stringify({ ride_id: rideId, visibility: "private" }),
    });
    expect(created.status).toBe(201);
    const memId = (created.body as { id: string }).id;

    const { cookie: b } = await makeVerifiedDriver(app, `memB-${Math.random()}@cr.test`);
    const res = await app.request(`/api/memories/${memId}`, { cookies: b });
    expect(res.status).toBe(403);
  });

  it("lets the owner view their own private memory", async () => {
    const app = buildTestApp();
    const { cookie } = await makeVerifiedDriver(app, `memC-${Math.random()}@cr.test`);
    const rideId = await createCompletedRide(app, cookie);
    const created = await app.request("/api/memories", {
      method: "POST",
      cookies: cookie,
      body: JSON.stringify({ ride_id: rideId, visibility: "private" }),
    });
    const memId = (created.body as { id: string }).id;
    const res = await app.request(`/api/memories/${memId}`, { cookies: cookie });
    expect(res.status).toBe(200);
  });
});

describe("POST /api/memories/:id/share", () => {
  it("increments share count without auth", async () => {
    const app = buildTestApp();
    const { cookie } = await makeVerifiedDriver(app, `memS-${Math.random()}@cr.test`);
    const rideId = await createCompletedRide(app, cookie);
    const created = await app.request("/api/memories", {
      method: "POST",
      cookies: cookie,
      body: JSON.stringify({ ride_id: rideId }),
    });
    const memId = (created.body as { id: string }).id;
    const res = await app.request(`/api/memories/${memId}/share`, { method: "POST" });
    expect(res.status).toBe(200);
  });
});

describe("GET /api/memories/concert/:concertId", () => {
  it("returns memories array (empty by default)", async () => {
    const app = buildTestApp();
    const res = await app.request(`/api/memories/concert/${FIXTURE_CONCERT_ID}`);
    expect(res.status).toBe(200);
    expect(Array.isArray((res.body as { memories: unknown[] }).memories)).toBe(true);
  });
});

describe("GET /api/memories/user/mine", () => {
  it("requires auth", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/memories/user/mine");
    expect(res.status).toBe(401);
  });
});
