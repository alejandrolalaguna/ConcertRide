import { describe, expect, it } from "vitest";
import type { RawConcert } from "../ingest/types";
import { MemoryStore } from "./memory";

function fresh() {
  return new MemoryStore();
}

describe("MemoryStore.listRides filters", () => {
  it("filters by concert_id", async () => {
    const s = fresh();
    const rides = await s.listRides({ concert_id: "c_rosalia_wizink" });
    expect(rides.length).toBeGreaterThan(0);
    expect(rides.every((r) => r.concert_id === "c_rosalia_wizink")).toBe(true);
  });

  it("filters by vibe", async () => {
    const s = fresh();
    const party = await s.listRides({ vibe: "party" });
    expect(party.every((r) => r.vibe === "party")).toBe(true);
  });

  it("filters by max_price", async () => {
    const s = fresh();
    const cheap = await s.listRides({ max_price: 15 });
    expect(cheap.every((r) => r.price_per_seat <= 15)).toBe(true);
  });

  it("sorts by departure_time ascending", async () => {
    const s = fresh();
    const rides = await s.listRides({});
    for (let i = 1; i < rides.length; i++) {
      expect(rides[i]!.departure_time >= rides[i - 1]!.departure_time).toBe(true);
    }
  });
});

describe("MemoryStore.createRequest guards", () => {
  it("rejects when driver tries to reserve their own ride", async () => {
    const s = fresh();
    const ride = (await s.listRides({}))[0]!;
    const driver = (await s.getUser(ride.driver_id))!;
    const result = await s.createRequest(ride, driver, 1);
    expect(result.error).toBe("cannot_request_own_ride");
  });

  it("rejects duplicate pending request from same passenger", async () => {
    const s = fresh();
    const ride = (await s.listRides({}))[0]!;
    const passenger = await s.upsertUserByEmail("dup@test.es");
    const first = await s.createRequest(ride, passenger, 1);
    expect(first.request).toBeDefined();
    const second = await s.createRequest(ride, passenger, 1);
    expect(second.error).toBe("already_requested");
  });

  it("rejects when seats requested exceed seats_left", async () => {
    const s = fresh();
    const ride = (await s.listRides({}))[0]!;
    const passenger = await s.upsertUserByEmail("over@test.es");
    const result = await s.createRequest(ride, passenger, ride.seats_left + 1);
    expect(result.error).toBe("not_enough_seats");
  });

  it("decrements seats_left on confirmed status", async () => {
    const s = fresh();
    const ride = (await s.listRides({}))[0]!;
    const originalSeats = ride.seats_left;
    const passenger = await s.upsertUserByEmail("confirm@test.es");
    const { request } = await s.createRequest(ride, passenger, 2);
    expect(request).toBeDefined();
    await s.updateRequestStatus(request!.id, "confirmed");
    const updated = (await s.getRide(ride.id))!;
    expect(updated.seats_left).toBe(originalSeats - 2);
  });
});

describe("MemoryStore.upsertConcertFromIngest dedup", () => {
  const sample: RawConcert = {
    source: "ticketmaster",
    source_event_id: "tm-001",
    source_url: "https://www.ticketmaster.es/event/tm-001",
    artist: "Test Artist",
    title: null,
    venue_name: "Test Venue",
    venue_city: "Madrid",
    venue_lat: 40.4,
    venue_lng: -3.7,
    date_iso: "2030-01-15T21:00:00.000+01:00",
    image_url: null,
    price_min: 20,
    price_max: 60,
    genre: "Pop",
    fetched_at: "2026-04-19T00:00:00.000Z",
  };

  it("inserts a new concert on first call", async () => {
    const s = fresh();
    const venue = await s.ensureVenue({
      name: sample.venue_name,
      city: sample.venue_city,
      lat: sample.venue_lat,
      lng: sample.venue_lng,
    });
    const result = await s.upsertConcertFromIngest(sample, venue.id);
    expect(result.is_new).toBe(true);
    const stored = await s.getConcert(result.concert_id);
    expect(stored?.artist).toBe("Test Artist");
  });

  it("merges on second call with same fingerprint — no duplicate concert", async () => {
    const s = fresh();
    const venue = await s.ensureVenue({
      name: sample.venue_name,
      city: sample.venue_city,
      lat: sample.venue_lat,
      lng: sample.venue_lng,
    });
    const first = await s.upsertConcertFromIngest(sample, venue.id);
    const second = await s.upsertConcertFromIngest(sample, venue.id);
    expect(second.is_new).toBe(false);
    expect(second.concert_id).toBe(first.concert_id);
  });

  it("updates price_min to the cheaper value on merge", async () => {
    const s = fresh();
    const venue = await s.ensureVenue({
      name: sample.venue_name,
      city: sample.venue_city,
      lat: sample.venue_lat,
      lng: sample.venue_lng,
    });
    const { concert_id } = await s.upsertConcertFromIngest(sample, venue.id);
    await s.upsertConcertFromIngest({ ...sample, source_event_id: "other", price_min: 10 }, venue.id);
    const stored = await s.getConcert(concert_id);
    expect(stored?.price_min).toBe(10);
  });

  it("does not downgrade price_max on merge", async () => {
    const s = fresh();
    const venue = await s.ensureVenue({
      name: sample.venue_name,
      city: sample.venue_city,
      lat: sample.venue_lat,
      lng: sample.venue_lng,
    });
    const { concert_id } = await s.upsertConcertFromIngest(sample, venue.id);
    await s.upsertConcertFromIngest({ ...sample, source_event_id: "cheap", price_max: 30 }, venue.id);
    const stored = await s.getConcert(concert_id);
    expect(stored?.price_max).toBe(60);
  });
});

describe("MemoryStore.ensureVenue", () => {
  it("matches an existing venue case-insensitively by name + city", async () => {
    const s = fresh();
    const match = await s.ensureVenue({
      name: "wizink center",
      city: "madrid",
      lat: null,
      lng: null,
    });
    expect(match.id).toBe("wizink");
  });

  it("creates a new venue when no match", async () => {
    const s = fresh();
    const before = (await s.listVenues()).length;
    const created = await s.ensureVenue({
      name: "Totally New Venue",
      city: "Logroño",
      lat: 42.4627,
      lng: -2.4449,
    });
    expect(created.id).not.toBe("wizink");
    const after = (await s.listVenues()).length;
    expect(after).toBe(before + 1);
  });
});
