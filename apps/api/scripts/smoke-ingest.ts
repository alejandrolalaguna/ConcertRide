// One-off integration test for the ingestion pipeline against a live Turso DB.
// Spins a synthetic adapter, runs the dedup pipeline twice, and checks that:
//   1st run → inserted=1, merged=0, sources row created
//   2nd run → inserted=0, merged=1, sources row updated (not duplicated)
//
// Usage: cd apps/api && npx tsx scripts/smoke-ingest.ts

import { config as loadEnv } from "dotenv";
loadEnv({ path: "../../.dev.vars" });
loadEnv({ path: "../../.env" });

import { createClient } from "@libsql/client";
import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/libsql";
import { runIngestion } from "../src/ingest/dedup";
import type { RawConcert, SourceAdapter } from "../src/ingest/types";
import * as schema from "../src/db/schema";
import type { Env } from "../src/env";

const url = process.env.TURSO_DATABASE_URL;
if (!url) {
  console.error("TURSO_DATABASE_URL missing");
  process.exit(1);
}

// Use the Node variant of @libsql/client (supports libsql:// + file:) + build
// the same DrizzleStore surface on top. Mirrors what createDrizzleStore(env)
// does in the Worker.
const client = createClient({
  url,
  ...(process.env.TURSO_AUTH_TOKEN ? { authToken: process.env.TURSO_AUTH_TOKEN } : {}),
});
const db = drizzle(client, { schema });

// Dynamic import so the /web client chain isn't pulled into the Node process.
const { DrizzleStore } = await import("../src/store/drizzle-internal");
const store = new DrizzleStore(db as never);

const synth: SourceAdapter = {
  id: "ticketmaster",
  tier: 1,
  displayName: "Smoke Synth",
  mode: "api",
  legal: "public-api",
  async fetch(): Promise<RawConcert[]> {
    return [
      {
        source: "ticketmaster",
        source_event_id: "smoke-synth-001",
        source_url: "https://example.com/smoke-synth-001",
        artist: "Smoke Test Artist",
        title: null,
        venue_name: "Smoke Synth Venue",
        venue_city: "Smoke Synth City",
        venue_lat: 40.4168,
        venue_lng: -3.7038,
        date_iso: "2030-01-15T21:00:00.000+01:00",
        image_url: null,
        price_min: 15,
        price_max: 75,
        genre: "Pop",
        fetched_at: new Date().toISOString(),
      },
    ];
  },
};

const adapterEnv: Pick<Env, "TICKETMASTER_API_KEY" | "EVENTBRITE_TOKEN" | "DICE_PARTNER_KEY"> & {} = {
  TICKETMASTER_API_KEY: "",
  EVENTBRITE_TOKEN: "",
  DICE_PARTNER_KEY: "",
};

console.log("\n=== 1st run ===");
const first = await runIngestion({ tier: 1, adapters: [synth] }, adapterEnv, store);
console.log(JSON.stringify(first.sources, null, 2));

console.log("\n=== 2nd run (expect merged, not inserted) ===");
const second = await runIngestion({ tier: 1, adapters: [synth] }, adapterEnv, store);
console.log(JSON.stringify(second.sources, null, 2));

console.log("\n=== DB state ===");
const concerts = await db
  .select()
  .from(schema.concerts)
  .where(eq(schema.concerts.artist, "Smoke Test Artist"));
console.log(
  JSON.stringify(
    concerts.map((c) => ({ id: c.id.slice(0, 12), artist: c.artist, sources: c.sources_json })),
    null,
    2,
  ),
);
const sources = await db
  .select()
  .from(schema.concertSources)
  .where(and(eq(schema.concertSources.source, "ticketmaster"), eq(schema.concertSources.source_event_id, "smoke-synth-001")));
console.log(
  JSON.stringify(
    sources.map((s) => ({ id: s.id.slice(0, 12), concert: s.concert_id?.slice(0, 12), fetched: s.fetched_at })),
    null,
    2,
  ),
);

// Clean up so repeated runs stay idempotent.
console.log("\n=== cleanup ===");
await db
  .delete(schema.concertSources)
  .where(and(eq(schema.concertSources.source, "ticketmaster"), eq(schema.concertSources.source_event_id, "smoke-synth-001")));
for (const c of concerts) {
  await db.delete(schema.concerts).where(eq(schema.concerts.id, c.id));
}
await db.delete(schema.venues).where(eq(schema.venues.name, "Smoke Synth Venue"));
console.log("✓ cleaned");

client.close();
