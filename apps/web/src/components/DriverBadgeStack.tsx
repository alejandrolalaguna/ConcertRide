import type { DriverBadge } from "@concertride/types";

interface Props {
  badges: DriverBadge[];
  // Compact = horizontal pill row; full = grid card per badge.
  layout?: "compact" | "full";
  className?: string;
}

const ICON: Record<DriverBadge["id"], string> = {
  verified_driver: "✓",
  veteran: "★",
  vibe_curator: "🎧",
  festival_regular: "🎪",
  early_bird: "🐦",
  playlist_master: "🎵",
};

const TONE: Record<DriverBadge["id"], string> = {
  verified_driver: "border-cr-primary text-cr-primary",
  veteran: "border-cr-secondary text-cr-secondary",
  vibe_curator: "border-cr-primary-dim text-cr-primary-dim",
  festival_regular: "border-cr-primary text-cr-primary",
  early_bird: "border-cr-border-mid text-cr-text-muted",
  playlist_master: "border-cr-border-mid text-cr-text-muted",
};

export function DriverBadgeStack({ badges, layout = "compact", className }: Props) {
  if (!badges.length) return null;
  if (layout === "compact") {
    return (
      <ul className={`flex flex-wrap gap-2 ${className ?? ""}`}>
        {badges.map((b) => (
          <li
            key={b.id}
            title={b.description}
            className={`inline-flex items-center gap-1 border-2 px-2 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.14em] ${TONE[b.id]}`}
          >
            <span aria-hidden>{ICON[b.id]}</span>
            <span>{b.label}</span>
            {b.metric && <span className="opacity-70">· {b.metric}</span>}
          </li>
        ))}
      </ul>
    );
  }
  return (
    <ul className={`grid gap-3 sm:grid-cols-2 ${className ?? ""}`}>
      {badges.map((b) => (
        <li
          key={b.id}
          className="flex items-start gap-3 border-2 border-cr-border bg-cr-surface-2 p-3"
        >
          <span className={`flex h-10 w-10 flex-shrink-0 items-center justify-center border-2 ${TONE[b.id]} text-lg`} aria-hidden>
            {ICON[b.id]}
          </span>
          <div className="min-w-0">
            <p className="font-display text-sm uppercase leading-tight">{b.label}</p>
            <p className="mt-1 text-xs text-cr-text-muted">{b.description}</p>
            {b.metric && (
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.12em] text-cr-text-dim">
                {b.metric}
              </p>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
