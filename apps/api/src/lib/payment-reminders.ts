import type { Env } from "../env";
import type { StoreAdapter } from "../store/adapter";
import { sendPaymentReminderEmail } from "./email";
import { notifyUser } from "./notify";
import { getSiteUrl } from "./siteUrl";

// Runs every hour. Picks up rides whose departure_time is between now+55min and
// now+65min and whose `payment_reminder_sent_at` is still null — then emails + pushes
// both driver and confirmed passengers to confirm payment method and availability,
// and marks the ride as reminded so the next hourly tick doesn't double-send.
export async function runPaymentReminders(env: Env, store: StoreAdapter): Promise<number> {
  const now = Date.now();
  const fromISO = new Date(now + 55 * 60_000).toISOString();
  const toISO = new Date(now + 65 * 60_000).toISOString();

  const rides = await store.listRidesForPaymentReminder(fromISO, toISO);
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
      const rideUrl = `${getSiteUrl(env)}/rides/${ride.id}`;

      const jobs: Promise<unknown>[] = [];

      // Driver
      if (!ride.driver.deleted_at) {
        jobs.push(
          notifyUser(store, env, ride.driver_id, {
            title: `Confirmación en 1h: ${ride.concert.artist}`,
            body: `Tu viaje sale en 1 hora. Confirma que todo está bien.`,
            url: `/rides/${ride.id}`,
          }),
          sendPaymentReminderEmail(env, ride.driver.email, {
            name: ride.driver.name,
            role: "driver",
            artist: ride.concert.artist,
            departureLocal,
            origin: ride.origin_city,
            venueCity: ride.concert.venue.city,
            passengerCount: confirmedPassengers.length,
            paymentMethod: ride.accepted_payment,
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
            title: `Confirmación en 1h: ${ride.concert.artist}`,
            body: `Tu viaje sale en 1 hora. Confirma que andas listo.`,
            url: `/rides/${ride.id}`,
          }),
          sendPaymentReminderEmail(env, p.email, {
            name: p.name,
            role: "passenger",
            artist: ride.concert.artist,
            departureLocal,
            origin: ride.origin_city,
            venueCity: ride.concert.venue.city,
            passengerCount: confirmedPassengers.length,
            paymentMethod: req.payment_method ?? ride.accepted_payment,
            rideUrl,
          }),
        );
      }

      await Promise.allSettled(jobs);
      await store.markPaymentReminderSent(ride.id);
      sent += 1;
    } catch (err) {
      console.error(`[payment-reminders] ride ${ride.id} failed:`, err);
    }
  }
  return sent;
}
