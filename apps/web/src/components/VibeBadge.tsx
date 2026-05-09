import type { Vibe } from "@concertride/types";
import { VIBE_LABELS } from "@/lib/constants";

const STYLES: Record<Vibe, string> = {
  party:
    "bg-cr-secondary text-white border border-cr-secondary-dim shadow-[0_0_10px_rgb(255_79_0/0.3)]",
  chill:
    "bg-cr-surface-3 text-cr-text-muted border border-cr-border-mid",
  mixed:
    "bg-cr-primary text-black border border-cr-primary-dim shadow-[0_0_10px_rgb(212_247_0/0.25)]",
};

export function VibeBadge({ vibe }: { vibe: Vibe }) {
  const meta = VIBE_LABELS[vibe];
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-0.5 font-mono text-[10px] font-bold uppercase tracking-[0.1em] ${STYLES[vibe]}`}
    >
      <span aria-hidden="true" className="text-[11px]">{meta.emoji}</span>
      <span>{meta.label}</span>
    </span>
  );
}
