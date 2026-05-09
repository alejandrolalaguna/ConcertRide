import type { Concert, DemandPrediction } from "@concertride/types";
import type { StoreAdapter } from "../store/adapter";

// Computes a 0..100 urgency score for each upcoming concert. Higher
// values mean "lots of people said they're going but there aren't
// enough rides published yet" — the perfect prompt to nudge potential
// drivers. Pure heuristic, no ML.
export async function predictRideDemand(
  store: StoreAdapter,
  opts: { limit?: number; minGoing?: number } = {},
): Promise<DemandPrediction[]> {
  const limit = opts.limit ?? 12;
  const minGoing = opts.minGoing ?? 3;

  const now = new Date();
  const oneYearOut = new Date(now.getTime() + 365 * 24 * 3600 * 1000);
  const { concerts } = await store.listConcerts({
    date_from: now.toISOString(),
    date_to: oneYearOut.toISOString(),
    limit: 200,
    offset: 0,
  });

  const out: DemandPrediction[] = [];
  for (const concert of concerts) {
    const summary = await store.getAnticipationSummary(concert.id, null).catch(() => null);
    if (!summary) continue;
    const going = summary.going_count;
    if (going < minGoing) continue;

    const rides = await store.listRides({ concert_id: concert.id }).catch(() => []);
    const activeRides = rides.filter((r) => r.status === "active" || r.status === "full").length;

    // Heuristic — ratio between people going and active rides, scaled
    // by absolute demand and how soon the event is.
    const daysUntil = (new Date(concert.date).getTime() - Date.now()) / (24 * 3600 * 1000);
    if (daysUntil < 0) continue;
    const demandPerRide = activeRides === 0 ? going : going / activeRides;
    let urgency = Math.min(100, demandPerRide * 12);
    // Boost short-term events.
    if (daysUntil < 14) urgency = Math.min(100, urgency * 1.4);
    if (daysUntil < 7) urgency = Math.min(100, urgency * 1.5);
    // Penalise events well-covered already.
    if (activeRides >= going) urgency *= 0.4;

    // City breakdown — origin cities of active rides vs cities of
    // anticipating users (we approximate using ride origins; full
    // computation needs a join we keep light to avoid N+1 explosion).
    const ridesCities = new Set(rides.map((r) => r.origin_city.toLowerCase()));
    // We can't know each anticipator's home city without N user fetches,
    // so we present it as "cities not yet covered" derived from ride data.
    const underservedCities: string[] = [];
    if (concert.venue?.city && !ridesCities.has(concert.venue.city.toLowerCase())) {
      underservedCities.push(concert.venue.city);
    }

    out.push({
      concert,
      going_count: going,
      active_rides: activeRides,
      urgency: Math.round(urgency),
      underserved_cities: underservedCities,
    });
  }

  return out.sort((a, b) => b.urgency - a.urgency).slice(0, limit);
}
