// Seed fixtures (venues + concerts + users) into Turso.
// Usage: TURSO_DATABASE_URL=... TURSO_AUTH_TOKEN=... npm run db:seed
//
// Connects via @libsql/client (Node variant — NOT the /web variant used by the
// Worker) so you can target either a local sqld file or a hosted Turso DB.

import { config as loadEnv } from "dotenv";
import { createClient } from "@libsql/client";
import { sql } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";
import { CONCERTS, USERS, VENUES } from "../src/fixtures";
import { computeFingerprint } from "../src/lib/fingerprint";
import * as schema from "../src/db/schema";

loadEnv({ path: new URL("../../../.dev.vars", import.meta.url).pathname.replace(/^\//, "") });
loadEnv({ path: ".env" });

const url = process.env.TURSO_DATABASE_URL;
if (!url) {
  console.error(
    "TURSO_DATABASE_URL is empty. Set it in .dev.vars (for local) or the shell environment (for prod).",
  );
  process.exit(1);
}

const client = createClient({
  url,
  ...(process.env.TURSO_AUTH_TOKEN ? { authToken: process.env.TURSO_AUTH_TOKEN } : {}),
});
const db = drizzle(client, { schema });

async function seed() {
  console.log(`Connecting to ${url}…`);

  console.log(`Inserting ${VENUES.length} venues…`);
  await db
    .insert(schema.venues)
    .values(
      VENUES.map((v) => ({
        id: v.id,
        name: v.name,
        city: v.city,
        address: v.address,
        lat: v.lat,
        lng: v.lng,
        capacity: v.capacity,
        image_url: v.image_url,
      })),
    )
    .onConflictDoNothing();

  console.log(`Inserting ${USERS.length} users…`);
  await db
    .insert(schema.users)
    .values(
      USERS.map((u) => ({
        id: u.id,
        email: u.email,
        name: u.name,
        avatar_url: u.avatar_url,
        verified: u.verified,
        rating: u.rating,
        rating_count: u.rating_count,
        car_model: u.car_model,
        car_color: u.car_color,
        rides_given: u.rides_given,
        created_at: u.created_at,
      })),
    )
    .onConflictDoNothing();

  console.log(`Inserting ${CONCERTS.length} concerts (computing fingerprints)…`);
  const concertRows = await Promise.all(
    CONCERTS.map(async (c) => ({
      id: c.id,
      name: c.name,
      artist: c.artist,
      venue_id: c.venue_id,
      date: c.date,
      image_url: c.image_url,
      ticketmaster_id: c.ticketmaster_id,
      ticketmaster_url: c.ticketmaster_url,
      official_url: c.official_url,
      lineup: c.lineup,
      genre: c.genre,
      price_min: c.price_min,
      price_max: c.price_max,
      fingerprint: await computeFingerprint(c.artist, c.venue.city, c.date),
      sources_json: "[]",
    })),
  );
  await db
    .insert(schema.concerts)
    .values(concertRows)
    .onConflictDoUpdate({
      target: schema.concerts.id,
      // Refresh editorial fields so re-running the seed picks up cartel /
      // official URL changes added to the fixtures.
      set: {
        name: sql`excluded.name`,
        official_url: sql`excluded.official_url`,
        lineup: sql`excluded.lineup`,
        genre: sql`excluded.genre`,
        price_min: sql`excluded.price_min`,
        price_max: sql`excluded.price_max`,
        image_url: sql`excluded.image_url`,
      },
    });

  console.log("✓ seed complete");
}

seed()
  .catch((err) => {
    console.error("seed failed:", err);
    process.exit(1);
  })
  .finally(() => {
    client.close();
  });
