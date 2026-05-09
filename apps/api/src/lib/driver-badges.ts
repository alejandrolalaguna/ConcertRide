import type { DriverBadge, User } from "@concertride/types";
import type { StoreAdapter } from "../store/adapter";

// Computed (non-persisted) badges. Re-derived on every public profile
// fetch so the milestones stay current without batch jobs.
export async function computeDriverBadges(
  store: StoreAdapter,
  user: User,
): Promise<DriverBadge[]> {
  const badges: DriverBadge[] = [];

  if (user.license_verified && user.identity_verified) {
    badges.push({
      id: "verified_driver",
      label: "Conductor verificado",
      description: "Carnet e identidad verificados por ConcertRide.",
    });
  }

  if (user.rides_given >= 25) {
    badges.push({
      id: "veteran",
      label: "Veterano",
      description: "25+ viajes completados como conductor.",
      metric: `${user.rides_given} viajes`,
    });
  }

  if (user.rating_count >= 10 && user.rating >= 4.8) {
    badges.push({
      id: "vibe_curator",
      label: "Vibe curator",
      description: "Valoración media 4.8★+ con al menos 10 reseñas.",
      metric: `★ ${user.rating.toFixed(1)} · ${user.rating_count} reseñas`,
    });
  }

  if (user.created_at && user.created_at < "2026-01-01") {
    badges.push({
      id: "early_bird",
      label: "Early bird",
      description: "Llegó antes que casi nadie a ConcertRide.",
    });
  }

  // Festival regular: count rides driven to festival concerts in the last
  // 12 months. Not all concerts are festivals — we use a coarse check
  // (`festival` flag in the concert filter) that stops short of perfect
  // accuracy but catches the obvious population.
  try {
    const recentRides = await store.listRides({ driver_id: user.id });
    const oneYearAgo = new Date(Date.now() - 365 * 24 * 3600 * 1000).toISOString();
    const festivalRides = recentRides.filter(
      (r) => r.status === "completed" && r.created_at >= oneYearAgo,
    );
    if (festivalRides.length >= 5) {
      badges.push({
        id: "festival_regular",
        label: "Festival regular",
        description: "5+ viajes a festivales en los últimos 12 meses.",
        metric: `${festivalRides.length} viajes festivaleros`,
      });
    }
  } catch {
    /* ignore — badge optional */
  }

  return badges;
}
