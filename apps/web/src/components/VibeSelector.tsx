import type { Vibe } from "@concertride/types";
import { VIBE_LABELS } from "@/lib/constants";

interface Props {
  value: Vibe | null;
  onChange: (vibe: Vibe) => void;
  name?: string;
}

const ORDER: Vibe[] = ["party", "mixed", "chill"];

export function VibeSelector({ value, onChange, name = "vibe" }: Props) {
  return (
    <fieldset className="grid grid-cols-1 md:grid-cols-3 gap-3">
      <legend className="sr-only">Vibe del viaje</legend>
      {ORDER.map((vibe) => {
        const meta = VIBE_LABELS[vibe];
        const selected = value === vibe;
        return (
          <label
            key={vibe}
            className={`relative flex flex-col items-start gap-2 p-5 cursor-pointer border-2 transition-all duration-150 ${
              selected
                ? "border-cr-primary bg-cr-primary/[0.06] shadow-[0_0_24px_rgb(219_255_0_/_0.12)]"
                : "border-cr-border hover:border-cr-text-muted bg-cr-surface"
            }`}
          >
            <input
              type="radio"
              name={name}
              value={vibe}
              checked={selected}
              onChange={() => onChange(vibe)}
              className="sr-only peer"
            />
            <span aria-hidden="true" className="text-3xl leading-none">
              {meta.emoji}
            </span>
            <span className="font-sans text-xs font-semibold uppercase tracking-[0.12em] text-cr-text">
              {meta.label}
            </span>
            <span className="font-sans text-xs text-cr-text-muted leading-snug">
              {meta.description}
            </span>
            {selected && (
              <span className="absolute top-3 right-3 w-2 h-2 rounded-full bg-cr-primary shadow-[0_0_10px_rgb(219_255_0_/_0.9)]" />
            )}
          </label>
        );
      })}
    </fieldset>
  );
}
