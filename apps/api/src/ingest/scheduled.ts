import type { Env } from "../env";
import { getStore } from "../store/factory";
import { runIngestion } from "./dedup";
import { ticketmaster } from "./sources/ticketmaster";
import { fetchFuelPrices } from "../lib/fuel";
import { KV_KEY } from "../routes/fuel";
import { runRideReminders } from "../lib/reminders";

// Lunes 3am UTC — ingesta Ticketmaster + limpieza de conciertos pasados
const INGEST_CRON = "0 3 * * 1";
// Lunes 4am UTC — refresco precio gasolina MITECO
const FUEL_CRON = "0 4 * * 1";
// Cada hora (minuto 5) — recordatorios de viaje 24h antes
const REMINDERS_CRON = "5 * * * *";

// Fetch from today to 1 year ahead
function yearWindow(): { fromDate: string; toDate: string } {
  const now = new Date();
  const to = new Date(now);
  to.setFullYear(to.getFullYear() + 1);
  return { fromDate: now.toISOString(), toDate: to.toISOString() };
}

// Concerts older than 2 months get deleted if they have no rides
function twoMonthsAgo(): string {
  const d = new Date();
  d.setMonth(d.getMonth() - 2);
  return d.toISOString();
}

export async function dispatchScheduled(
  event: ScheduledController,
  env: Env,
  ctx: ExecutionContext,
): Promise<void> {
  if (event.cron === FUEL_CRON) {
    ctx.waitUntil(
      fetchFuelPrices()
        .then((prices) => env.CACHE.put(KV_KEY, JSON.stringify(prices), { expirationTtl: 8 * 24 * 3600 }))
        .then(() => console.log("fuel prices updated"))
        .catch((err) => console.error("fuel price refresh failed:", err)),
    );
    return;
  }

  if (event.cron === REMINDERS_CRON) {
    ctx.waitUntil(
      (async () => {
        const store = await getStore(env);
        const sent = await runRideReminders(env, store);
        if (sent > 0) console.log(`[cron] reminders sent for ${sent} ride(s)`);
      })().catch((err) => console.error("reminders cron failed:", err)),
    );
    return;
  }

  if (event.cron === INGEST_CRON) {
    ctx.waitUntil(
      (async () => {
        const store = await getStore(env);
        const window = yearWindow();

        // 1. Ingest new concerts from Ticketmaster
        const result = await runIngestion({ adapters: [ticketmaster], ...window }, env, store);
        const s = result.sources[0];
        console.log(
          `ingest ticketmaster: ${s?.fetched ?? 0} fetched / ${s?.inserted ?? 0} new / ${s?.merged ?? 0} merged / ${s?.errors.length ?? 0} errors`,
        );

        // 2. Delete concerts older than 2 months with no rides
        const deleted = await store.deletePastConcerts(twoMonthsAgo());
        console.log(`cleanup: deleted ${deleted} past concerts`);
      })().catch((err) => console.error("ingest cron failed:", err)),
    );
    return;
  }

  console.warn(`unknown cron: ${event.cron}`);
}
