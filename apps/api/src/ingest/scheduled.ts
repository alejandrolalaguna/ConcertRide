import type { Env } from "../env";
import { getStore } from "../store/factory";
import { runIngestion } from "./dedup";
import { ticketmaster } from "./sources/ticketmaster";
import { fetchFuelPrices } from "../lib/fuel";
import { KV_KEY } from "../routes/fuel";
import { sendHomeCityNudgeEmail, sendReengagementEmail } from "../lib/email";
import { getSiteUrl } from "../lib/siteUrl";
// Lunes 3am UTC — ingesta Ticketmaster + limpieza de conciertos pasados
const INGEST_CRON = "0 3 * * 1";
// Lunes 4am UTC — refresco precio gasolina MITECO
const FUEL_CRON = "0 4 * * 1";
// Lunes 9am UTC — emails semanales de activación/engagement
const ENGAGEMENT_CRON = "0 9 * * 1";

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

  if (event.cron === ENGAGEMENT_CRON) {
    ctx.waitUntil(
      (async () => {
        const store = await getStore(env);
        const base = getSiteUrl(env);
        // Only target reasonably-recent signups so we never nag old accounts forever.
        const createdAfter = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString();
        const emailedThisRun = new Set<string>();

        // A) home_city nudge — once ever per user (1-year KV flag).
        const noCity = await store.listUsersForHomeCityNudge(createdAfter);
        let cityNudges = 0;
        for (const u of noCity) {
          const key = `nudge:city:${u.id}`;
          if (env.CACHE && (await env.CACHE.get(key))) continue;
          const res = await sendHomeCityNudgeEmail(env, u.email, u.name, `${base}/profile`);
          if (res.sent) {
            cityNudges++;
            emailedThisRun.add(u.id);
            if (env.CACHE) await env.CACHE.put(key, "1", { expirationTtl: 365 * 24 * 60 * 60 });
          }
        }

        // B) re-engagement — inactive users, at most once per week (6-day KV TTL
        //    expires before the next weekly run, so it recurs until they engage).
        const inactive = await store.listInactiveUsers(createdAfter);
        let reNudges = 0;
        for (const u of inactive) {
          if (emailedThisRun.has(u.id)) continue; // don't double-email the same person this run
          const key = `nudge:reengage:${u.id}`;
          if (env.CACHE && (await env.CACHE.get(key))) continue;
          const res = await sendReengagementEmail(env, u.email, u.name, `${base}/concerts`);
          if (res.sent) {
            reNudges++;
            if (env.CACHE) await env.CACHE.put(key, "1", { expirationTtl: 6 * 24 * 60 * 60 });
          }
        }

        console.log(`engagement weekly: home_city=${cityNudges}/${noCity.length} · re-engage=${reNudges}/${inactive.length}`);
      })().catch((err) => console.error("engagement cron failed:", err)),
    );
    return;
  }

  console.warn(`unknown cron: ${event.cron}`);
}
