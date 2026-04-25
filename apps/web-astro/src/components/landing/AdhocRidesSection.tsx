import { useEffect, useState } from "react";
import { PenLine } from "lucide-react";
import type { Ride } from "@concertride/types";
import { api } from "@/lib/api";
import { TicketCard } from "@/components/TicketCard";
import { SkeletonCard } from "@/components/ui";

export function AdhocRidesSection() {
  const [rides, setRides] = useState<Ride[] | null>(null);

  useEffect(() => {
    api.rides.list({ adhoc: true }).then((r) => setRides(r.rides)).catch(() => setRides([]));
  }, []);

  // Don't render the section until we know there's something to show
  if (rides !== null && rides.length === 0) return null;

  return (
    <section aria-labelledby="adhoc-heading" className="py-16 md:py-24 border-t border-cr-border">
      <div className="max-w-7xl mx-auto px-6">
        <header className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div className="space-y-3">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary inline-flex items-center gap-2">
              <PenLine size={12} aria-hidden="true" /> Conciertos no listados
            </p>
            <h2
              id="adhoc-heading"
              className="font-display uppercase text-3xl md:text-4xl leading-[0.95]"
            >
              Viajes para
              <br />
              otros conciertos
            </h2>
            <p className="font-sans text-sm text-cr-text-muted max-w-md">
              Viajes publicados por conductores para conciertos que todavía no aparecen en nuestra
              agenda. ¿El tuyo tampoco está?{" "}
              <a
                href="/publish"
                className="text-cr-primary underline hover:no-underline"
              >
                Publícalo ahora.
              </a>
            </p>
          </div>
        </header>

        {rides === null ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[0, 1, 2].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rides.slice(0, 6).map((ride) => (
              <li key={ride.id}>
                <TicketCard ride={ride} onClick={() => { window.location.href = `/rides/${ride.id}`; }} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
