import { useEffect, useState } from "react";
import type { PlaylistTrack } from "@concertride/types";
import { api } from "@/lib/api";
import { useSession } from "@/lib/session";
import { track } from "@/lib/observability";

interface Props {
  scope: { ride_id: string } | { squad_id: string };
  // Title shown in the header. Defaults to "Playlist del viaje".
  heading?: string;
}

function formatDuration(ms: number | null): string {
  if (!ms) return "";
  const total = Math.round(ms / 1000);
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function parseSpotifyTrackUri(input: string): string | null {
  // Accepts spotify:track:abc OR https://open.spotify.com/track/abc?... OR raw id.
  const trimmed = input.trim();
  if (!trimmed) return null;
  if (trimmed.startsWith("spotify:track:")) return trimmed;
  const url = trimmed.match(/spotify\.com\/(?:[a-z-]+\/)?track\/([A-Za-z0-9]+)/i);
  if (url) return `spotify:track:${url[1]}`;
  if (/^[A-Za-z0-9]{20,30}$/.test(trimmed)) return `spotify:track:${trimmed}`;
  return null;
}

export function PlaylistPanel({ scope, heading = "Playlist del viaje" }: Props) {
  const { user } = useSession();
  const [tracks, setTracks] = useState<PlaylistTrack[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [trackName, setTrackName] = useState("");
  const [artistName, setArtistName] = useState("");
  const [trackUri, setTrackUri] = useState("");
  const [error, setError] = useState<string | null>(null);

  const isRide = "ride_id" in scope;
  const scopeId = isRide ? scope.ride_id : scope.squad_id;

  useEffect(() => {
    let cancelled = false;
    void (async () => {
      try {
        const res = isRide
          ? await api.playlists.forRide(scope.ride_id)
          : await api.playlists.forSquad(scope.squad_id);
        if (!cancelled) setTracks(res.tracks);
      } catch {
        if (!cancelled) setTracks([]);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [scopeId, isRide]);

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    if (!user) {
      window.location.href = "/login";
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const uri = parseSpotifyTrackUri(trackUri);
      const body = await api.playlists.add({
        ...(isRide ? { ride_id: scope.ride_id } : { squad_id: scope.squad_id }),
        track_name: trackName.trim(),
        artist_name: artistName.trim(),
        track_uri: uri ?? undefined,
      });
      track("playlist_track_added", { scope: isRide ? "ride" : "squad" });
      setTracks((prev) => [...prev, body]);
      setTrackName("");
      setArtistName("");
      setTrackUri("");
    } catch {
      setError("No se pudo añadir.");
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRemove(id: string) {
    const prev = tracks;
    setTracks((p) => p.filter((t) => t.id !== id));
    try {
      await api.playlists.remove(id);
    } catch {
      setTracks(prev);
    }
  }

  return (
    <section className="border-2 border-cr-border bg-cr-surface-2">
      <header className="flex items-center justify-between gap-3 border-b border-cr-border px-4 py-3 sm:px-5">
        <h2 className="font-display text-lg uppercase">🎶 {heading}</h2>
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-cr-text-muted">
          {tracks.length} {tracks.length === 1 ? "track" : "tracks"}
        </span>
      </header>

      {loading ? (
        <p className="px-5 py-6 font-mono text-xs text-cr-text-muted">Cargando…</p>
      ) : tracks.length === 0 ? (
        <p className="px-5 py-6 text-sm text-cr-text-muted">
          Aún sin canciones. Añade el track que pongáis primero al meterte en el coche.
        </p>
      ) : (
        <ul className="divide-y divide-cr-border">
          {tracks.map((t, idx) => (
            <li key={t.id} className="flex items-center gap-3 px-4 py-3 sm:px-5">
              <span className="w-6 flex-shrink-0 font-mono text-[11px] text-cr-text-dim">
                {String(idx + 1).padStart(2, "0")}
              </span>
              {t.album_image_url ? (
                <img src={t.album_image_url} alt="" aria-hidden="true" className="h-10 w-10 object-cover" />
              ) : (
                <span className="inline-flex h-10 w-10 items-center justify-center bg-cr-surface-3 text-cr-text-muted" aria-hidden>
                  🎵
                </span>
              )}
              <div className="min-w-0 flex-1">
                <p className="truncate font-display text-sm uppercase leading-tight">{t.track_name}</p>
                <p className="truncate font-mono text-[10px] uppercase tracking-[0.1em] text-cr-text-muted">
                  {t.artist_name} · {t.added_by_name}
                  {t.duration_ms ? ` · ${formatDuration(t.duration_ms)}` : ""}
                </p>
              </div>
              {t.track_uri && (
                <a
                  href={t.track_uri.startsWith("spotify:") ? `https://open.spotify.com/track/${t.track_uri.split(":").pop()}` : t.track_uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[10px] uppercase tracking-[0.14em] text-cr-primary hover:underline"
                >
                  Abrir →
                </a>
              )}
              {user?.id === t.added_by && (
                <button
                  type="button"
                  onClick={() => handleRemove(t.id)}
                  className="font-mono text-[10px] uppercase tracking-[0.14em] text-cr-text-muted hover:text-cr-secondary"
                >
                  ×
                </button>
              )}
            </li>
          ))}
        </ul>
      )}

      <form
        onSubmit={handleAdd}
        className="grid gap-2 border-t border-cr-border bg-cr-bg/40 p-4 sm:grid-cols-3"
      >
        <input
          type="text"
          required
          maxLength={200}
          value={trackName}
          onChange={(e) => setTrackName(e.target.value)}
          placeholder="Nombre de la canción"
          className="bg-cr-surface border-2 border-cr-border focus:border-cr-primary outline-none px-3 py-2 font-sans text-sm text-cr-text"
        />
        <input
          type="text"
          required
          maxLength={200}
          value={artistName}
          onChange={(e) => setArtistName(e.target.value)}
          placeholder="Artista"
          className="bg-cr-surface border-2 border-cr-border focus:border-cr-primary outline-none px-3 py-2 font-sans text-sm text-cr-text"
        />
        <div className="flex gap-2">
          <input
            type="text"
            value={trackUri}
            onChange={(e) => setTrackUri(e.target.value)}
            placeholder="Link Spotify (opcional)"
            className="flex-1 bg-cr-surface border-2 border-cr-border focus:border-cr-primary outline-none px-3 py-2 font-sans text-sm text-cr-text"
          />
          <button
            type="submit"
            disabled={submitting || trackName.trim().length < 1 || artistName.trim().length < 1}
            className="border-2 border-cr-primary bg-cr-primary px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-cr-text-inverse disabled:opacity-40"
          >
            +
          </button>
        </div>
        {error && (
          <p className="sm:col-span-3 font-mono text-[10px] text-cr-secondary">{error}</p>
        )}
      </form>
    </section>
  );
}
