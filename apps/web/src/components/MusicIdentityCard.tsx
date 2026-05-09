import type { User } from "@concertride/types";

interface Props {
  user: Pick<User, "name" | "music_genres" | "top_artists" | "bio">;
  // When true the card collapses to a single inline line (used on ride cards).
  compact?: boolean;
  // Optional list of shared values from the viewer's perspective. When set,
  // matched chips glow.
  sharedGenres?: string[];
  sharedArtists?: string[];
  className?: string;
}

export function MusicIdentityCard({ user, compact, sharedGenres, sharedArtists, className }: Props) {
  const genres = user.music_genres ?? [];
  const artists = user.top_artists ?? [];
  if (!user.bio && !genres.length && !artists.length) return null;

  if (compact) {
    const head = artists[0] ?? genres[0];
    const rest = (artists.length + genres.length) - (head ? 1 : 0);
    if (!head) return null;
    return (
      <p className={`font-mono text-[10px] uppercase tracking-[0.12em] text-cr-text-muted ${className ?? ""}`}>
        🎶 {head}
        {rest > 0 ? ` · +${rest}` : ""}
      </p>
    );
  }

  const sharedG = new Set((sharedGenres ?? []).map((g) => g.toLowerCase()));
  const sharedA = new Set((sharedArtists ?? []).map((a) => a.toLowerCase()));

  return (
    <section
      aria-label={`Identidad musical de ${user.name}`}
      className={`border-2 border-cr-border bg-cr-surface-2 p-4 ${className ?? ""}`}
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-cr-text-muted">
        🎶 identidad musical
      </p>
      {user.bio && <p className="mt-2 text-sm text-cr-text">{user.bio}</p>}
      {artists.length > 0 && (
        <div className="mt-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-cr-text-dim">artistas</p>
          <ul className="mt-1 flex flex-wrap gap-1.5">
            {artists.map((a) => {
              const match = sharedA.has(a.toLowerCase());
              return (
                <li
                  key={a}
                  className={`px-2 py-0.5 font-mono text-[11px] font-bold uppercase tracking-[0.06em] ${
                    match
                      ? "border border-cr-primary-dim bg-cr-primary text-cr-text-inverse shadow-[0_0_10px_rgb(212_247_0/0.35)]"
                      : "border border-cr-border-mid text-cr-text"
                  }`}
                >
                  {a}
                </li>
              );
            })}
          </ul>
        </div>
      )}
      {genres.length > 0 && (
        <div className="mt-3">
          <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-cr-text-dim">géneros</p>
          <ul className="mt-1 flex flex-wrap gap-1.5">
            {genres.map((g) => {
              const match = sharedG.has(g.toLowerCase());
              return (
                <li
                  key={g}
                  className={`px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.1em] ${
                    match ? "border border-cr-primary-dim text-cr-primary" : "border border-cr-border text-cr-text-muted"
                  }`}
                >
                  {g}
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </section>
  );
}
