import type { Env } from "../env";
import type { StoreAdapter } from "../store/adapter";
import { sendRideReminderEmail } from "./email";
import { notifyUser } from "./notify";

// Runs every hour. Picks up rides whose departure_time is between now+23h and
// now+25h and whose `reminded_at` is still null — then emails + pushes both
// driver and confirmed passengers, and marks the ride as reminded so the next
// hourly tick doesn't double-send.
export async function runRideReminders(env: Env, store: StoreAdapter): Promise<number> {
  const now = Date.now();
  const fromISO = new Date(now + 23 * 3600_000).toISOString();
  const toISO = new Date(now + 25 * 3600_000).toISOString();

  const rides = await store.listRidesForReminder(fromISO, toISO);
  if (rides.length === 0) return 0;

  let sent = 0;
  for (const ride of rides) {
    try {
      const requests = await store.listRequestsForRide(ride.id).catch(() => []);
      const confirmedPassengers = requests.filter((r) => r.status === "confirmed");
      const departureLocal = new Date(ride.departure_time).toLocaleString("es-ES", {
        dateStyle: "full",
        timeStyle: "short",
        timeZone: "Europe/Madrid",
      });
      const rideUrl = `https://concertride.es/rides/${ride.id}`;

      const jobs: Promise<unknown>[] = [];

      // Driver
      if (!ride.driver.deleted_at) {
        jobs.push(
          notifyUser(store, env, ride.driver_id, {
            title: `Mañana: ${ride.concert.artist} 🎶`,
            body: `Tu viaje sale mañana desde ${ride.origin_city}.`,
            url: `/rides/${ride.id}`,
          }),
          sendRideReminderEmail(env, ride.driver.email, {
            name: ride.driver.name,
            role: "driver",
            artist: ride.concert.artist,
            departureLocal,
            origin: ride.origin_city,
            venueCity: ride.concert.venue.city,
            rideUrl,
          }),
        );
      }

      // Passengers
      for (const req of confirmedPassengers) {
        const p = req.passenger;
        if (!p || p.deleted_at) continue;
        jobs.push(
          notifyUser(store, env, p.id, {
            title: `Mañana: ${ride.concert.artist} 🎶`,
            body: `Tu viaje sale mañana desde ${ride.origin_city}.`,
            url: `/rides/${ride.id}`,
          }),
          sendRideReminderEmail(env, p.email, {
            name: p.name,
            role: "passenger",
            artist: ride.concert.artist,
            departureLocal,
            origin: ride.origin_city,
            venueCity: ride.concert.venue.city,
            rideUrl,
          }),
        );
      }

      await Promise.allSettled(jobs);
      await store.markRideReminded(ride.id);
      sent += 1;
    } catch (err) {
      console.error(`[reminders] ride ${ride.id} failed:`, err);
    }
  }
  return sent;
}
