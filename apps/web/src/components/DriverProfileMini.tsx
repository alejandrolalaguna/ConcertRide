import { Link } from "react-router-dom";
import { initials } from "@/lib/format";
import type { User } from "@concertride/types";

interface Props {
  driver: User;
  rideCount?: number;
}

export function DriverProfileMini({ driver, rideCount = 0 }: Props) {
  return (
    <Link
      to={`/drivers/${driver.id}`}
      className="block p-3 rounded border border-cr-border bg-cr-surface-2 hover:border-cr-primary/40 hover:bg-cr-surface transition-all group"
    >
      <div className="flex gap-3">
        <div className="w-12 h-12 rounded-full bg-cr-primary text-black font-display text-sm flex items-center justify-center flex-shrink-0">
          {initials(driver.name)}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <p className="font-display text-sm text-cr-text truncate">{driver.name}</p>
            {driver.license_verified && (
              <span className="text-cr-primary flex-shrink-0" title="Licencia verificada">
                ✓
              </span>
            )}
            {driver.verified && (
              <span className="text-cr-primary flex-shrink-0" title="Email verificado">
                ✓
              </span>
            )}
          </div>
          <div className="flex items-center gap-2 text-[11px] text-cr-text-muted">
            {driver.rating_count >= 3 ? (
              <>
                <span className="text-cr-primary">★ {driver.rating.toFixed(1)}</span>
                <span>({driver.rating_count})</span>
                <span>·</span>
              </>
            ) : null}
            <span>{driver.rides_given} viajes</span>
          </div>
          {driver.car_model && (
            <p className="text-[11px] text-cr-text-dim mt-1 truncate">
              🚗 {driver.car_model}
              {driver.car_color ? ` · ${driver.car_color}` : ""}
            </p>
          )}
        </div>
      </div>
      <p className="text-[10px] text-cr-text-muted mt-2 group-hover:text-cr-text transition-colors">
        Ver perfil →
      </p>
    </Link>
  );
}
