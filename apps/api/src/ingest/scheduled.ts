import type { Env } from "../env";
import { getStore } from "../store/factory";
import { runIngestion } from "./dedup";
import { getAdaptersForTier } from "./sources";
import type { SourceTier } from "./types";

const CRON_TO_TIER: Record<string, SourceTier> = {
  "0 0 * * *": 1,
};

export async function dispatchScheduled(
  event: ScheduledController,
  env: Env,
  ctx: ExecutionContext,
): Promise<void> {
  const tier = CRON_TO_TIER[event.cron];
  if (!tier) {
    console.warn(`unknown cron: ${event.cron}`);
    return;
  }
  const adapters = getAdaptersForTier(tier);
  if (adapters.length === 0) return;

  const store = await getStore(env);
  // ctx.waitUntil keeps the scheduled task alive even if the edge function
  // would otherwise terminate between I/O boundaries.
  ctx.waitUntil(
    runIngestion({ tier, adapters }, env, store)
      .then((result) => {
        console.log(
          `cron ${event.cron} tier ${tier}:`,
          result.sources
            .map((s) => `${s.source}=${s.fetched}/${s.inserted}new/${s.merged}merged/${s.errors.length}err`)
            .join(" "),
        );
      })
      .catch((err) => {
        console.error(`cron ${event.cron} failed:`, err);
      }),
  );
}
