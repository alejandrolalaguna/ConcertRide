import { Hono, type Context } from "hono";
import { z } from "zod";
import type { HonoEnv } from "../types";
import { runIngestion } from "../ingest/dedup";
import { listRuns } from "../ingest/status";
import { getAdaptersForTier, findAdapter, ADAPTERS } from "../ingest/sources";
import type { SourceId, SourceTier } from "../ingest/types";

const route = new Hono<HonoEnv>();

function requireSecret(c: Context<HonoEnv>): Response | null {
  const secret = c.req.header("x-ingest-secret");
  if (!secret || secret !== c.env.INGEST_SECRET) {
    return c.json({ error: "unauthorized" }, 401);
  }
  return null;
}

const runQuery = z.object({
  tier: z.coerce.number().int().min(1).max(3).default(1),
});

route.post("/run", async (c) => {
  const guard = requireSecret(c);
  if (guard) return guard;

  const parsed = runQuery.safeParse(c.req.query());
  if (!parsed.success) return c.json({ error: "bad_request", issues: parsed.error.issues }, 400);
  const tier = parsed.data.tier as SourceTier;

  const adapters = getAdaptersForTier(tier);
  if (adapters.length === 0) return c.json({ error: "no_adapters_for_tier" }, 400);

  const now = new Date();
  const to = new Date(now); to.setFullYear(to.getFullYear() + 1);
  const result = await runIngestion({ adapters, fromDate: now.toISOString(), toDate: to.toISOString() }, c.env, c.var.store);
  return c.json(result);
});

route.get("/status", (c) => {
  const guard = requireSecret(c);
  if (guard) return guard;
  return c.json({ runs: listRuns() });
});

// ---------------------------------------------------------------------------
// POST /ingest/backfill-2026
// Full-year Spain backfill with SSE progress streaming and optional dry-run.
//
// Query params:
//   source=all|ticketmaster|bandsintown|ra|wegow|dice|eventbrite  (default: all)
//   dryRun=true|false  (default: false) — page 0 only, no DB writes
//
// Headers: X-Ingest-Secret required.
// Response: text/event-stream — one JSON data line per adapter, then totals.
// ---------------------------------------------------------------------------

const BACKFILL_FROM = "2026-01-01T00:00:00Z";
const BACKFILL_TO = "2026-12-31T23:59:59Z";

const backfillQuery = z.object({
  source: z.string().default("all"),
  dryRun: z
    .string()
    .optional()
    .transform((v) => v === "true"),
});

route.post("/backfill-2026", async (c) => {
  const guard = requireSecret(c);
  if (guard) return guard;

  const parsed = backfillQuery.safeParse(c.req.query());
  if (!parsed.success) return c.json({ error: "bad_request", issues: parsed.error.issues }, 400);

  const { source, dryRun } = parsed.data;

  // Resolve adapter list: "all" = every non-stub adapter, else filter by id.
  const candidates =
    source === "all"
      ? ADAPTERS
      : source
          .split(",")
          .map((id) => findAdapter(id.trim()))
          .filter((a) => a != null);

  if (candidates.length === 0) {
    return c.json({ error: "no_adapters_found", source }, 400);
  }

  const env = c.env;
  const store = c.var.store;

  // Stream SSE back to caller.
  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();
  const enc = new TextEncoder();

  const send = async (obj: unknown) => {
    await writer.write(enc.encode(`data: ${JSON.stringify(obj)}\n\n`));
  };

  // Run adapters in the background so the response stream can start immediately.
  const work = async () => {
    const totals = { fetched: 0, inserted: 0, merged: 0, errors: 0 };
    const sourceResults: unknown[] = [];

    for (const adapter of candidates) {
      const adapterStart = Date.now();
      let fetched = 0;
      let inserted = 0;
      let merged = 0;
      const errors: string[] = [];

      try {
        const rawConcerts = await adapter.fetch(
          { fromDate: BACKFILL_FROM, toDate: BACKFILL_TO },
          env,
        );
        fetched = rawConcerts.length;

        if (!dryRun) {
          for (const raw of rawConcerts) {
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
              errors.push(describeErr(err, `${raw.source}:${raw.source_event_id}`));
            }
          }
        } else {
          // Dry run: simulate counts without DB writes.
          inserted = fetched;
        }
      } catch (err) {
        errors.push(describeErr(err));
      }

      const elapsed_ms = Date.now() - adapterStart;
      totals.fetched += fetched;
      totals.inserted += inserted;
      totals.merged += merged;
      totals.errors += errors.length;

      const row = {
        adapter: adapter.id,
        fetched,
        inserted: dryRun ? 0 : inserted,
        merged: dryRun ? 0 : merged,
        would_insert: dryRun ? inserted : undefined,
        errors: errors.length,
        error_samples: errors.slice(0, 3),
        elapsed_ms,
        dry_run: dryRun,
      };
      sourceResults.push(row);
      await send(row);
    }

    await send({
      type: "totals",
      dry_run: dryRun,
      total_fetched: totals.fetched,
      total_inserted: dryRun ? 0 : totals.inserted,
      total_merged: dryRun ? 0 : totals.merged,
      total_would_insert: dryRun ? totals.inserted : undefined,
      total_errors: totals.errors,
      sources: sourceResults,
    });

    await writer.close();
  };

  // Don't await — stream starts immediately.
  work().catch(async (err) => {
    await send({ type: "fatal_error", message: String(err) }).catch(() => {});
    await writer.close().catch(() => {});
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "X-Accel-Buffering": "no",
    },
  });
});

function describeErr(err: unknown, prefix?: string): string {
  const p = prefix ? `${prefix} ` : "";
  if (err instanceof Error) return `${p}${err.message.slice(0, 200)}`;
  return `${p}${String(err).slice(0, 200)}`;
}

export default route;
