import type { TripMemory } from "@concertride/types";
import { CrewAvatars } from "./CrewAvatars";

interface Props {
  memory: TripMemory;
  // Render a "Compartir" button overlay.
  shareable?: boolean;
  onShare?: () => void;
  className?: string;
}

const VIBE_COPY = {
  party: { emoji: "🔥", label: "PARTY" },
  chill: { emoji: "🌙", label: "CHILL" },
  mixed: { emoji: "✨", label: "MIXED" },
} as const;

export function TripVibeCard({ memory, shareable, onShare, className }: Props) {
  const vibe = VIBE_COPY[memory.vibe] ?? VIBE_COPY.mixed;
  const heroColor = memory.hero_color ?? "#dbff00";

  return (
    <article
      className={`relative overflow-hidden border-2 border-cr-border bg-cr-surface-2 ${className ?? ""}`}
      aria-label={`Recuerdo del viaje a ${memory.concert_artist}`}
    >
      <div
        className="px-4 py-5"
        style={{
          background: `radial-gradient(120% 80% at 0% 0%, ${heroColor}33 0%, transparent 60%), radial-gradient(120% 100% at 100% 100%, ${heroColor}22 0%, transparent 50%)`,
        }}
      >
        <div className="flex items-center justify-between">
          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-cr-text-muted">
            CR · TRIP MEMORY
          </span>
          <span
            className="px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-black"
            style={{ background: heroColor }}
          >
            {vibe.emoji} {vibe.label}
          </span>
        </div>
        <h3 className="mt-3 font-display text-2xl uppercase leading-tight text-cr-text">
          {memory.title}
        </h3>
        {memory.caption && (
          <p className="mt-2 line-clamp-2 text-sm text-cr-text-muted">{memory.caption}</p>
        )}
        <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.14em] text-cr-text-muted">
          {memory.origin_city || "—"} → {memory.destination_city || memory.concert_artist}
        </p>
        {memory.crew.length > 0 && (
          <div className="mt-3">
            <CrewAvatars
              size="sm"
              people={memory.crew}
              label={`${memory.crew.length} ${memory.crew.length === 1 ? "viajero" : "viajeros"}`}
            />
          </div>
        )}
      </div>
      <footer className="flex items-center justify-between border-t border-cr-border bg-cr-bg/60 px-4 py-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-cr-text-muted">
          @{memory.creator_name} · {memory.share_count > 0 ? `${memory.share_count} compartido${memory.share_count === 1 ? "" : "s"}` : "concertride.me"}
        </span>
        {shareable && (
          <button
            type="button"
            onClick={onShare}
            className="border-2 border-cr-primary px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em] text-cr-primary hover:bg-cr-primary hover:text-cr-text-inverse"
          >
            Compartir →
          </button>
        )}
      </footer>
    </article>
  );
}
