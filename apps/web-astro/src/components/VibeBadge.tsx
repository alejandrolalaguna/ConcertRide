import type { Vibe } from "@concertride/types";
import { VIBE_LABELS } from "@/lib/constants";

const STYLES: Record<Vibe, string> = {
  party: "bg-cr-secondary text-black",
  chill: "bg-cr-surface-2 text-cr-text-muted border border-cr-border",
  mixed: "bg-cr-primary text-black",
};

export function VibeBadge({ vibe }: { vibe: Vibe }) {
  const meta = VIBE_LABELS[vibe];
  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 font-sans text-[10px] font-semibold uppercase tracking-[0.08em] ${STYLES[vibe]}`}
    >
      <span aria-hidden="true">{meta.emoji}</span>
      <span>{meta.label}</span>
    </span>
  );
}
