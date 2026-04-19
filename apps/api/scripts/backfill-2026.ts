// Runner script for the 2026 Spain concert backfill.
//
// Runs adapters DIRECTLY in Node (not via the worker HTTP endpoint) to avoid
// Cloudflare Workers' 30s CPU limit, which kills long-running SSE requests.
// Uses the same DrizzleStore + runIngestion pipeline as the Worker, but
// driven by tsx under Node with no time constraints.
//
// Usage (from apps/api/) — pass args WITHOUT "--" prefix to avoid npm intercepting them:
//   npm run ingest:backfill                                         # all sources, from today
//   npm run ingest:backfill --dryRun                               # dry run, no DB writes
//   npm run ingest:backfill --source=ticketmaster                   # single adapter
//   npm run ingest:backfill --source=ticketmaster --from=2025-01-01 # custom start date

import { config as loadEnv } from "dotenv";
loadEnv({ path: "../../.dev.vars" });
loadEnv({ path: "../../.env" });

import { createClient } from "@libsql/client";
import { drizzle } from "drizzle-orm/libsql";
import * as schema from "../src/db/schema";
import { ADAPTERS, findAdapter } from "../src/ingest/sources";
import type { AdapterEnv, RawConcert, SourceAdapter } from "../src/ingest/types";

// --- CLI args ---

const args = process.argv.slice(2);
const dryRun = args.includes("--dryRun") || args.includes("--dry-run");
const sourceArg = args.find((a) => a.startsWith("--source="));
const sourceFilter = sourceArg ? sourceArg.split("=")[1] : "all";
const fromArg = args.find((a) => a.startsWith("--from="));
const fromOverride = fromArg ? fromArg.split("=")[1] : null;

// --- Env validation ---

const TURSO_URL = process.env.TURSO_DATABASE_URL;
const TURSO_TOKEN = process.env.TURSO_AUTH_TOKEN;
const TM_KEY = process.env.TICKETMASTER_API_KEY;

if (!TURSO_URL) {
  console.error("❌  TURSO_DATABASE_URL not set in .dev.vars");
  process.exit(1);
}

const adapterEnv: AdapterEnv = {
  TICKETMASTER_API_KEY: TM_KEY ?? "",
  EVENTBRITE_TOKEN: process.env.EVENTBRITE_TOKEN ?? "",
  DICE_PARTNER_KEY: process.env.DICE_PARTNER_KEY ?? "",
};

// --- DB setup (Node client, not edge client) ---

const client = createClient({
  url: TURSO_URL,
  ...(TURSO_TOKEN ? { authToken: TURSO_TOKEN } : {}),
});
const db = drizzle(client, { schema });
const { DrizzleStore } = await import("../src/store/drizzle-internal");
const store = new DrizzleStore(db as never);

// --- Resolve adapters ---

const today = new Date();
today.setUTCHours(0, 0, 0, 0);
const BACKFILL_FROM = fromOverride ? `${fromOverride}T00:00:00Z` : today.toISOString();
const BACKFILL_TO   = "2027-12-31T23:59:59Z";

// For backfill: skip stubs (they throw immediately) unless explicitly requested.
const NON_STUB_IDS = new Set(["ticketmaster", "ra" /*, "wegow" */]);

let candidates: SourceAdapter[];
if (sourceFilter === "all") {
  candidates = ADAPTERS.filter((a) => NON_STUB_IDS.has(a.id));
} else {
  candidates = sourceFilter
    .split(",")
    .map((id) => findAdapter(id.trim()))
    .filter((a): a is SourceAdapter => a != null);
}

if (candidates.length === 0) {
  console.error(`❌  No adapters matched source="${sourceFilter}". Valid: ticketmaster, ra, all`);
  process.exit(1);
}

// --- Banner ---

console.log("\n╔══════════════════════════════════════════════════════════════╗");
console.log(`║  ConcertRide 2026 Spain Backfill${dryRun ? " [DRY RUN]" : ""}`.padEnd(64) + "║");
console.log(`║  source=${candidates.map((a) => a.id).join(",")}`.padEnd(64) + "║");
console.log(`║  from=${BACKFILL_FROM.slice(0, 10)} → 2026-12-31`.padEnd(64) + "║");
console.log(`║  db=${TURSO_URL.slice(0, 45)}`.padEnd(64) + "║");
console.log("╚══════════════════════════════════════════════════════════════╝\n");

if (dryRun) {
  console.log("ℹ  Dry run: adapters fetch normally but no DB writes occur.\n");
}

// --- Run adapters ---

interface AdapterResult {
  adapter: string;
  fetched: number;
  inserted: number;
  merged: number;
  errors: number;
  error_samples: string[];
  elapsed_ms: number;
}

const results: AdapterResult[] = [];
let totalFetched = 0, totalInserted = 0, totalMerged = 0, totalErrors = 0;

for (const adapter of candidates) {
  const start = Date.now();
  let fetched = 0, inserted = 0, merged = 0;
  const errors: string[] = [];

  process.stdout.write(`  ⏳ ${adapter.displayName.padEnd(20)} fetching...`);

  try {
    const raws: RawConcert[] = await adapter.fetch(
      { fromDate: BACKFILL_FROM, toDate: BACKFILL_TO },
      adapterEnv,
    );
    fetched = raws.length;
    process.stdout.write(`\r  ✓  ${adapter.id.padEnd(16)} fetched=${String(fetched).padStart(5)}  `);

    if (!dryRun) {
      for (const raw of raws) {
        try {
          const venue = await store.ensureVenue({
            name: raw.venue_name,
            city: raw.venue_city,
            lat: raw.venue_lat,
            lng: raw.venue_lng,
          });
          const result = await store.upsertConcertFromIngest(raw, venue.id);
          if (result.is_new) inserted++;
          else merged++;
          await store.recordSource({
            source: raw.source,
            source_event_id: raw.source_event_id,
            source_url: raw.source_url,
            concert_id: result.concert_id,
            raw_json: JSON.stringify(raw),
          });
        } catch (err) {
          const msg = err instanceof Error ? err.message.slice(0, 150) : String(err).slice(0, 150);
          errors.push(`${raw.source}:${raw.source_event_id} ${msg}`);
        }
      }
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message.slice(0, 200) : String(err).slice(0, 200);
    errors.push(msg);
    process.stdout.write(`\r  ⚠  ${adapter.id.padEnd(16)} FAILED                    `);
  }

  const elapsed_ms = Date.now() - start;
  const elapsed = (elapsed_ms / 1000).toFixed(1);
  const status = errors.length > 0 ? "⚠" : "✓";
  const counts = dryRun
    ? `would_insert=${fetched}`
    : `inserted=${inserted} merged=${merged}`;

  console.log(
    `\r  ${status}  ${adapter.id.padEnd(16)} fetched=${String(fetched).padStart(5)}  ${counts}  errors=${errors.length}  (${elapsed}s)`,
  );
  for (const e of errors.slice(0, 3)) {
    console.log(`       ⤷ ${e}`);
  }

  totalFetched  += fetched;
  totalInserted += inserted;
  totalMerged   += merged;
  totalErrors   += errors.length;
  results.push({ adapter: adapter.id, fetched, inserted, merged, errors: errors.length, error_samples: errors.slice(0, 3), elapsed_ms });
}

// --- Summary ---

client.close();

const totals = {
  type: "totals" as const,
  dry_run: dryRun,
  total_fetched: totalFetched,
  total_inserted: dryRun ? 0 : totalInserted,
  total_merged: dryRun ? 0 : totalMerged,
  total_would_insert: dryRun ? totalFetched : undefined,
  total_errors: totalErrors,
  sources: results,
};

console.log("\n" + "─".repeat(72));
console.log("  BACKFILL SUMMARY");
console.log("─".repeat(72));
console.log(`  Adapters run   : ${results.length}`);
console.log(`  Total fetched  : ${totalFetched}`);
if (dryRun) {
  console.log(`  Would insert   : ${totalFetched}`);
  console.log(`  DB writes      : none (dry run)`);
} else {
  console.log(`  Inserted (new) : ${totalInserted}`);
  console.log(`  Merged (dedup) : ${totalMerged}`);
  const dedup = totalFetched > 0
    ? (((totalFetched - totalInserted) / totalFetched) * 100).toFixed(1)
    : "0.0";
  console.log(`  Dedup ratio    : ${dedup}%`);
}
console.log(`  Total errors   : ${totalErrors}`);
console.log("─".repeat(72));

console.log("\n  [paste this block back to Claude for sanity-check]");
console.log(JSON.stringify(totals, null, 2));
console.log();
