import { useMemo } from "react";
import type { User } from "@concertride/types";
import { useSession } from "@/lib/session";
import { compatibilityLabel, computeMusicMatch } from "@/lib/musicMatch";

interface Props {
  other: User;
  size?: "sm" | "md";
  className?: string;
}

const TONE_STYLE = {
  high: "border-cr-primary text-cr-primary bg-cr-primary/10",
  mid: "border-cr-border-mid text-cr-text",
  low: "border-cr-border text-cr-text-muted",
  none: "",
} as const;

export function MusicMatchBadge({ other, size = "sm", className }: Props) {
  const { user } = useSession();
  const match = useMemo(() => computeMusicMatch(user, other), [user, other]);
  const meta = compatibilityLabel(match.score);
  if (!user || meta.tone === "none") return null;

  const sizeCls = size === "md" ? "px-2.5 py-1 text-[11px]" : "px-2 py-0.5 text-[10px]";
  const sample = [...match.shared_artists.slice(0, 1), ...match.shared_genres.slice(0, 1)]
    .filter(Boolean)
    .join(" · ");

  return (
    <span
      title={
        match.shared_artists.length || match.shared_genres.length
          ? `Compartís ${[...match.shared_artists, ...match.shared_genres].join(", ")}`
          : `Score: ${match.score}/100`
      }
      className={`inline-flex items-center gap-1 border-2 font-mono font-bold uppercase tracking-[0.1em] ${TONE_STYLE[meta.tone]} ${sizeCls} ${className ?? ""}`}
    >
      <span aria-hidden>🎶</span>
      <span>{meta.label}</span>
      {sample && <span className="opacity-70">· {sample}</span>}
    </span>
  );
}
