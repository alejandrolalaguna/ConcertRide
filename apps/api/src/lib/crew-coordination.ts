import type { Concert, Ride, User } from "@concertride/types";
import type { Env } from "../env";
import type { StoreAdapter } from "../store/adapter";
import { notifyUser } from "./notify";

// When a user publishes a ride, push their crew members who have already
// said "voy/maybe" to the same concert. This is the highest-signal push
// in the platform: someone you trust is now offering a ride to an event
// you're going to. Conversion-driving without being spammy because the
// audience is by definition self-selected.
export async function pushCrewCoordinationPrompt(
  env: Env,
  store: StoreAdapter,
  driver: User,
  ride: Ride,
  concert: Concert,
): Promise<number> {
  // Crew members of the driver
  const { crew } = await store.listCrewForUser(driver.id).catch(() => ({ crew: [] }));
  if (!crew.length) return 0;

  // Of those, the ones who have an anticipation row for this concert
  const anticipationSummary = await store.getAnticipationSummary(concert.id, null).catch(() => null);
  if (!anticipationSummary || anticipationSummary.preview.length === 0) return 0;

  const goingIds = new Set(anticipationSummary.preview.map((u) => u.id));

  let pushed = 0;
  await Promise.allSettled(
    crew
      .filter((c) => goingIds.has(c.user.id))
      .map(async (c) => {
        try {
          await notifyUser(store, env, c.user.id, {
            title: `${driver.name} va a ${concert.artist} 🚗`,
            body: `Sale desde ${ride.origin_city} · ${ride.seats_left} ${ride.seats_left === 1 ? "plaza" : "plazas"} · €${ride.price_per_seat}.`,
            url: `/rides/${ride.id}`,
          });
          pushed += 1;
        } catch {
          /* ignore */
        }
      }),
  );
  return pushed;
}
