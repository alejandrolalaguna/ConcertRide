import { Check, Star } from "lucide-react";
import type { User } from "@concertride/types";
import { initials } from "@/lib/format";

interface Props {
  user: User;
  compact?: boolean;
}

export function TrustBadge({ user, compact = false }: Props) {
  return (
    <div className="flex items-center gap-3">
      <div
        aria-hidden="true"
        className={`rounded-full bg-cr-surface-2 border border-cr-border flex items-center justify-center font-mono text-cr-text ${
          compact ? "w-8 h-8 text-[11px]" : "w-10 h-10 text-xs"
        }`}
      >
        {initials(user.name)}
      </div>
      <div className="leading-tight">
        <p className="flex items-center gap-1 text-sm text-cr-text">
          {user.name}
          {user.verified && (
            <span
              className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-cr-primary/15 text-cr-primary"
              aria-label="Perfil verificado"
            >
              <Check size={10} strokeWidth={3} />
            </span>
          )}
        </p>
        <p className="font-mono text-xs text-cr-text-muted flex items-center gap-1.5 flex-wrap">
          {user.rating_count >= 3 ? (
            <>
              <Star size={10} aria-hidden="true" className="fill-cr-primary text-cr-primary" />
              <span className="text-cr-primary">{user.rating.toFixed(1)}</span>
              <span className="text-cr-text-dim">({user.rating_count})</span>
              <span className="text-cr-text-dim">·</span>
            </>
          ) : null}
          <span>{user.rides_given} viajes</span>
          {user.smoker === false && (
            <>
              <span className="text-cr-text-dim">·</span>
              <span title="No fumador">🚭</span>
            </>
          )}
          {user.smoker === true && (
            <>
              <span className="text-cr-text-dim">·</span>
              <span title="Fumador">🚬</span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
