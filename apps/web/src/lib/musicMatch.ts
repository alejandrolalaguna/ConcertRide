import type { MusicCompatibility, User } from "@concertride/types";

// Pure function (no side effects). Computed client-side because both
// sides of the match — viewer + other user — are already in the page
// payload. Avoids a round-trip and keeps the API surface small.
export function computeMusicMatch(viewer: User | null, other: User): MusicCompatibility {
  if (!viewer) return { score: 0, shared_genres: [], shared_artists: [] };

  const viewerGenres = norm(viewer.music_genres);
  const otherGenres = norm(other.music_genres);
  const viewerArtists = norm(viewer.top_artists);
  const otherArtists = norm(other.top_artists);

  const sharedGenres = intersection(viewerGenres, otherGenres);
  const sharedArtists = intersection(viewerArtists, otherArtists);

  // Composite score:
  //  - 60 pts max from artist overlap (each match worth 12, capped at 60)
  //  - 30 pts max from genre overlap (each match worth 6, capped at 30)
  //  - 10 pts free if both have any music identity at all (engagement bonus)
  const artistPts = Math.min(60, sharedArtists.size * 12);
  const genrePts = Math.min(30, sharedGenres.size * 6);
  const enrichedBonus = viewerArtists.size + viewerGenres.size > 0 && otherArtists.size + otherGenres.size > 0
    ? 10
    : 0;
  const score = artistPts + genrePts + enrichedBonus;

  return {
    score,
    shared_genres: Array.from(sharedGenres),
    shared_artists: Array.from(sharedArtists),
  };
}

function norm(list: string[] | null | undefined): Set<string> {
  if (!list) return new Set();
  return new Set(list.map((s) => s.trim().toLowerCase()).filter(Boolean));
}

function intersection(a: Set<string>, b: Set<string>): Set<string> {
  const out = new Set<string>();
  for (const x of a) if (b.has(x)) out.add(x);
  return out;
}

export function compatibilityLabel(score: number): { label: string; tone: "high" | "mid" | "low" | "none" } {
  if (score >= 90) return { label: "Vibe perfecta", tone: "high" };
  if (score >= 70) return { label: "Alta afinidad", tone: "high" };
  if (score >= 40) return { label: "Buena onda", tone: "mid" };
  if (score >= 20) return { label: "Algo en común", tone: "low" };
  return { label: "", tone: "none" };
}
