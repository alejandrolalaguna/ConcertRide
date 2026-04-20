import type { StoreAdapter } from "../store/adapter";
import { recordRun } from "./status";
import type {
  AdapterEnv,
  RawConcert,
  SourceAdapter,
  SourceRunStats,
  TierRunStatus,
} from "./types";

interface RunOptions {
  adapters: SourceAdapter[];
  fromDate: string;
  toDate: string;
}

export async function runIngestion(
  opts: RunOptions,
  env: AdapterEnv,
  store: StoreAdapter,
): Promise<TierRunStatus> {
  const window = { fromDate: opts.fromDate, toDate: opts.toDate };
  const startedAt = new Date().toISOString();
  const stats: SourceRunStats[] = [];

  for (const adapter of opts.adapters) {
    const adapterStart = new Date().toISOString();
    const s: SourceRunStats = {
      source: adapter.id,
      fetched: 0,
      inserted: 0,
      merged: 0,
      errors: [],
      started_at: adapterStart,
      finished_at: adapterStart,
    };
    try {
      const raws = await adapter.fetch(window, env);
      s.fetched = raws.length;

      for (const raw of raws) {
        try {
          const venue = await store.ensureVenue({
            name: raw.venue_name,
            city: raw.venue_city,
            lat: raw.venue_lat,
            lng: raw.venue_lng,
          });
          const result = await store.upsertConcertFromIngest(raw, venue.id);
          if (result.is_new) s.inserted++;
          else s.merged++;
          await store.recordSource({
            source: raw.source,
            source_event_id: raw.source_event_id,
            source_url: raw.source_url,
            concert_id: result.concert_id,
            raw_json: JSON.stringify(raw),
          });
        } catch (err) {
          s.errors.push(describeError(err, raw));
        }
      }
    } catch (err) {
      s.errors.push(describeError(err));
    } finally {
      s.finished_at = new Date().toISOString();
      stats.push(s);
    }
  }

  const status: TierRunStatus = {
    tier: 1,
    started_at: startedAt,
    finished_at: new Date().toISOString(),
    sources: stats,
  };
  recordRun(status);
  return status;
}

function describeError(err: unknown, raw?: RawConcert): string {
  const prefix = raw ? `${raw.source}:${raw.source_event_id} ` : "";
  if (err instanceof Error) return `${prefix}${err.message.slice(0, 200)}`;
  return `${prefix}${String(err).slice(0, 200)}`;
}
