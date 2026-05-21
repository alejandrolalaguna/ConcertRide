import { describe, expect, it } from "vitest";
import { buildTestApp, registerAndLogin, makeVerifiedDriver, publishRide, FIXTURE_CONCERT_ID } from "./helpers";

describe("POST /api/playlists", () => {
  it("requires auth", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/playlists", {
      method: "POST",
      body: JSON.stringify({ track_name: "Despechá", artist_name: "Rosalía" }),
    });
    expect(res.status).toBe(401);
  });

  it("rejects when no ride_id or squad_id is given (store returns error)", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, `pl-${Math.random()}@cr.test`);
    const res = await app.request("/api/playlists", {
      method: "POST",
      cookies: cookie,
      body: JSON.stringify({ track_name: "Despechá", artist_name: "Rosalía" }),
    });
    expect(res.status).toBe(400);
  });

  it("adds a track to a ride playlist when the user owns the ride", async () => {
    const app = buildTestApp();
    const { cookie } = await makeVerifiedDriver(app, `pl2-${Math.random()}@cr.test`);
    const pub = await publishRide(app, cookie);
    const res = await app.request("/api/playlists", {
      method: "POST",
      cookies: cookie,
      body: JSON.stringify({
        ride_id: pub.ride.id,
        track_name: "Despechá",
        artist_name: "Rosalía",
      }),
    });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty("id");
  });
});

describe("GET /api/playlists/ride/:rideId", () => {
  it("returns tracks array (empty by default)", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/playlists/ride/r_nope");
    expect(res.status).toBe(200);
    expect(Array.isArray((res.body as { tracks: unknown[] }).tracks)).toBe(true);
  });

  it("returns tracks added by the driver", async () => {
    const app = buildTestApp();
    const { cookie } = await makeVerifiedDriver(app, `pl3-${Math.random()}@cr.test`);
    const pub = await publishRide(app, cookie);
    await app.request("/api/playlists", {
      method: "POST",
      cookies: cookie,
      body: JSON.stringify({ ride_id: pub.ride.id, track_name: "Lux", artist_name: "Rosalía" }),
    });
    const res = await app.request(`/api/playlists/ride/${pub.ride.id}`);
    expect(res.status).toBe(200);
    const tracks = (res.body as { tracks: unknown[] }).tracks;
    expect(tracks.length).toBeGreaterThanOrEqual(1);
  });
});

describe("GET /api/playlists/squad/:squadId", () => {
  it("returns 404 for unknown squad", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/playlists/squad/sq_nope");
    expect(res.status).toBe(404);
  });

  it("returns tracks array for a public squad", async () => {
    const app = buildTestApp();
    const { cookie } = await registerAndLogin(app, `pl4-${Math.random()}@cr.test`);
    const created = await app.request("/api/squads", {
      method: "POST",
      cookies: cookie,
      body: JSON.stringify({
        concert_id: FIXTURE_CONCERT_ID,
        name: "Playlist crew",
        visibility: "public",
      }),
    });
    const sqId = (created.body as { id: string }).id;
    const res = await app.request(`/api/playlists/squad/${sqId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("tracks");
  });
});

describe("DELETE /api/playlists/:id", () => {
  it("requires auth", async () => {
    const app = buildTestApp();
    const res = await app.request("/api/playlists/pt_nope", { method: "DELETE" });
    expect(res.status).toBe(401);
  });

  it("returns ok when removing a track the user owns", async () => {
    const app = buildTestApp();
    const { cookie } = await makeVerifiedDriver(app, `pl5-${Math.random()}@cr.test`);
    const pub = await publishRide(app, cookie);
    const added = await app.request("/api/playlists", {
      method: "POST",
      cookies: cookie,
      body: JSON.stringify({ ride_id: pub.ride.id, track_name: "Tuya", artist_name: "Rosalía" }),
    });
    const trackId = (added.body as { id: string }).id;
    const res = await app.request(`/api/playlists/${trackId}`, { method: "DELETE", cookies: cookie });
    expect(res.status).toBe(200);
  });
});
