import type { Env } from "../env";
import type { StoreAdapter } from "../store/adapter";
import { notifyUser } from "./notify";
import { sendPreConcertReminderEmail } from "./email";
import { getSiteUrl } from "./siteUrl";

// KV key prefix for dedup. TTL 24h prevents double-firing if the hourly cron
// overlaps a ride that sits exactly on the 2h boundary across two ticks.
const KV_PREFIX = "push2h:ride:";
const KV_TTL_SEC = 86_400; // 24 h

// Runs every hour. Picks up active rides departing in 1h50m–2h10m, sends
// a push notification to the driver and all confirmed passengers with a
// specific departure summary, and writes a KV dedup key so the next tick
// skips them. Falls back to email when the user has no push subscription.
export async function runPreConcertPush(env: Env, store: StoreAdapter): Promise<number> {
  if (!env.VAPID_PUBLIC_KEY || !env.VAPID_PRIVATE_KEY) return 0;

  const now = Date.now();
  const fromISO = new Date(now + 110 * 60_000).toISOString(); // now + 1h50m
  const toISO = new Date(now + 130 * 60_000).toISOString();   // now + 2h10m

  // Reuse listRidesForReminder query — departure window + active/full status.
  // We use our own KV dedup so we don't need a separate DB column.
  const allRides = await store.listRidesForReminder(fromISO, toISO).catch(() => []);

  let sent = 0;
  for (const ride of allRides) {
    const kvKey = `${KV_PREFIX}${ride.id}`;

    // Skip if already pushed for this ride
    const existing = await env.CACHE.get(kvKey).catch(() => null);
    if (existing) continue;

    try {
      const requests = await store.listRequestsForRide(ride.id).catch(() => []);
      const confirmedPassengers = requests.filter((r) => r.status === "confirmed");

      const departureLocal = new Date(ride.departure_time).toLocaleString("es-ES", {
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Europe/Madrid",
      });
      // Prefer origin_address when available; fall back to city name
      const meetingPoint = ride.origin_address?.trim() || ride.origin_city;
      const rideUrl = `/rides/${ride.id}`;
      const rideUrlAbsolute = `${getSiteUrl(env)}${rideUrl}`;
      const passengerCount = confirmedPassengers.length;
      const siteBase = getSiteUrl(env);

      const jobs: Promise<unknown>[] = [];

      // ── Driver ─────────────────────────────────────────────────────────
      if (!ride.driver.deleted_at && !ride.driver.banned_at) {
        const passengerLine = passengerCount > 0
          ? `Tienes ${passengerCount} pasajero${passengerCount === 1 ? "" : "s"} para ${ride.concert.artist}. Confirma el punto de encuentro.`
          : `Vas a ${ride.concert.artist} sin pasajeros aún — sale en 2h.`;
        jobs.push(
          notifyUser(store, env, ride.driver_id, {
            title: `En 2h: ${ride.concert.artist} 🚗`,
            body: passengerLine,
            url: rideUrl,
          }),
        );
        // Email fallback — only if push subscriptions are absent
        if (ride.driver.email) {
          const subs = await store.getPushSubscriptionsForUser(ride.driver_id).catch(() => []);
          if (subs.length === 0) {
            jobs.push(
              sendPreConcertReminderEmail(env, ride.driver.email, {
                name: ride.driver.name,
                role: "driver",
                artist: ride.concert.artist,
                departureLocal,
                meetingPoint,
                passengerCount,
                rideUrl: rideUrlAbsolute,
              }),
            );
          }
        }
      }

      // ── Confirmed passengers ────────────────────────────────────────────
      for (const req of confirmedPassengers) {
        const p = req.passenger;
        if (!p || p.deleted_at || p.banned_at) continue;
        jobs.push(
          notifyUser(store, env, p.id, {
            title: `En 2h: ${ride.concert.artist} 🎶`,
            body: `Tu carpooling a ${ride.concert.artist} sale a las ${departureLocal} desde ${meetingPoint}. ¡Confirma con tu conductor!`,
            url: rideUrl,
          }),
        );
        // Email fallback
        if (p.email) {
          const subs = await store.getPushSubscriptionsForUser(p.id).catch(() => []);
          if (subs.length === 0) {
            jobs.push(
              sendPreConcertReminderEmail(env, p.email, {
                name: p.name,
                role: "passenger",
                artist: ride.concert.artist,
                departureLocal,
                meetingPoint,
                passengerCount,
                rideUrl: rideUrlAbsolute,
              }),
            );
          }
        }
      }

      await Promise.allSettled(jobs);
      // Mark as sent — 24h TTL prevents double-firing
      await env.CACHE.put(kvKey, siteBase, { expirationTtl: KV_TTL_SEC });
      sent += 1;
    } catch (err) {
      console.error(`[pre-concert-push] ride ${ride.id} failed:`, err);
    }
  }
  return sent;
}
