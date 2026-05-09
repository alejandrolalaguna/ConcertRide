import type { Env } from "../env";
import type { StoreAdapter } from "../store/adapter";
import { sendCountdownReminderEmail } from "./email";
import { notifyUser } from "./notify";
import { getSiteUrl } from "./siteUrl";

// Runs every hour. Picks up event_anticipations whose linked concert is
// between now+23h and now+25h and whose `last_notified_at` is null —
// then emails + pushes the user with a "Mañana toca" reminder. Marks the
// row as notified so the next hourly tick doesn't double-send.
//
// Why a separate cron from runRideReminders: ride reminders fire only for
// users who actually booked a seat; this one fires for users who said
// "I'm going" but may still not have transport. Conversion-driving.
export async function runCountdownReminders(env: Env, store: StoreAdapter): Promise<number> {
  const now = Date.now();
  const fromISO = new Date(now + 23 * 3600_000).toISOString();
  const toISO = new Date(now + 25 * 3600_000).toISOString();

  const rows = await store.listAnticipationsForCountdown(fromISO, toISO);
  if (!rows.length) return 0;

  let sent = 0;
  for (const row of rows) {
    try {
      const { concert, user } = row;
      if (user.deleted_at || !user.email || user.banned_at) {
        await store.markAnticipationNotified(row.id);
        continue;
      }
      const dateLocal = new Date(concert.date).toLocaleString("es-ES", {
        dateStyle: "full",
        timeStyle: "short",
        timeZone: "Europe/Madrid",
      });
      const concertUrl = `${getSiteUrl(env)}/concerts/${concert.id}`;

      // How many of the viewer's crew are going to the same concert.
      let crewGoing = 0;
      try {
        const crewAttending = await store.listCrewAttendingConcert(user.id, concert.id);
        crewGoing = crewAttending.length;
      } catch {
        /* ignore */
      }

      const crewBody = crewGoing > 0
        ? `${concert.artist} mañana. ${crewGoing} de tu crew ${crewGoing === 1 ? "va" : "van"}.`
        : `${concert.artist} mañana en ${concert.venue.city}. ¿Ya tienes cómo llegar?`;

      await Promise.allSettled([
        notifyUser(store, env, user.id, {
          title: `Mañana: ${concert.artist} 🔥`,
          body: crewBody,
          url: `/concerts/${concert.id}`,
        }),
        sendCountdownReminderEmail(env, user.email, {
          name: user.name,
          artist: concert.artist,
          venueCity: concert.venue.city,
          dateLocal,
          concertUrl,
          crewGoing,
        }),
      ]);
      await store.markAnticipationNotified(row.id);
      sent += 1;
    } catch (err) {
      console.error(`[countdown] anticipation ${row.id} failed:`, err);
    }
  }
  return sent;
}
