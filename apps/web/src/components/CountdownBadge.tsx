import { useEffect, useState } from "react";

interface Props {
  // ISO date of the event.
  target: string;
  // Optional copy prepended to the countdown ("hasta Mad Cool").
  prefix?: string;
  size?: "sm" | "md" | "lg";
  className?: string;
}

function diffParts(target: string) {
  const t = new Date(target).getTime();
  if (!Number.isFinite(t)) return null;
  const ms = t - Date.now();
  if (ms <= 0) return null;
  const days = Math.floor(ms / 86_400_000);
  const hours = Math.floor((ms % 86_400_000) / 3_600_000);
  const minutes = Math.floor((ms % 3_600_000) / 60_000);
  return { days, hours, minutes };
}

const SIZES: Record<NonNullable<Props["size"]>, string> = {
  sm: "text-xs px-2 py-1",
  md: "text-sm px-3 py-1.5",
  lg: "text-base px-4 py-2",
};

export function CountdownBadge({ target, prefix, size = "md", className }: Props) {
  const [parts, setParts] = useState(() => diffParts(target));

  useEffect(() => {
    setParts(diffParts(target));
    const id = setInterval(() => setParts(diffParts(target)), 60_000);
    return () => clearInterval(id);
  }, [target]);

  if (!parts) return null;

  const isClose = parts.days <= 1;
  const intensity = parts.days <= 3
    ? "border-cr-secondary bg-cr-secondary/10 text-cr-secondary"
    : "border-cr-primary-dim bg-cr-primary/10 text-cr-primary";

  return (
    <span
      className={`inline-flex items-center gap-1 border-2 font-mono font-bold uppercase tracking-[0.1em] ${intensity} ${SIZES[size]} ${className ?? ""}`}
    >
      {isClose && <span className="relative flex h-2 w-2" aria-hidden>
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cr-secondary opacity-70" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-cr-secondary" />
      </span>}
      {prefix ? <span className="opacity-80">{prefix}</span> : null}
      <span>
        {parts.days > 0
          ? `${parts.days}d ${parts.hours}h`
          : parts.hours > 0
            ? `${parts.hours}h ${parts.minutes}m`
            : `${parts.minutes}m`}
      </span>
    </span>
  );
}
