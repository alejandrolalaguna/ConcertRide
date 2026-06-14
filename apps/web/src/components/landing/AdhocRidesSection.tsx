import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { PenLine, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import type { Ride } from "@concertride/types";
import { api } from "@/lib/api";
import { useI18n } from "@/lib/i18n";
import { TicketCard } from "@/components/TicketCard";
import { SkeletonCard } from "@/components/ui";

export function AdhocRidesSection() {
  const { locale } = useI18n();
  const navigate = useNavigate();
  const [rides, setRides] = useState<Ride[] | null>(null);

  useEffect(() => {
    api.rides.list({ adhoc: true }).then((r) => setRides(r.rides)).catch(() => setRides([]));
  }, []);

  if (rides !== null && rides.length === 0) return null;

  return (
    <section
      aria-labelledby="adhoc-heading"
      className="relative py-16 md:py-24 overflow-hidden border-t border-white/[0.06]"
      style={{ backgroundColor: "#0a0a0a" }}
    >
      {/* Subtle bg */}
      <img
        aria-hidden="true"
        src="https://images.unsplash.com/photo-1504208434309-cb69f4fe52b0?w=1400&q=40&auto=format&fit=crop"
        alt=""
        width={1400}
        height={800}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover object-center opacity-[0.04] pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[300px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(219,255,0,0.05) 0%, transparent 60%)" }}
      />

      <div className="relative max-w-7xl mx-auto px-6">
        <motion.header
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
          className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6"
        >
          <div className="space-y-3">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary inline-flex items-center gap-2">
              <PenLine size={12} aria-hidden="true" /> {locale === "en" ? "Unlisted concerts" : "Conciertos no listados"}
            </p>
            <h2
              id="adhoc-heading"
              className="font-display uppercase text-3xl md:text-4xl leading-[0.95]"
            >
              {locale === "en" ? "Trips for" : "Viajes para"}
              <br />
              <span className="text-[#dbff00]">{locale === "en" ? "other concerts" : "otros conciertos"}</span>
            </h2>
            <p className="font-sans text-sm text-cr-text-muted max-w-md">
              {locale === "en" ? (
                <>
                  Trips posted by drivers for concerts that aren't on our calendar yet. Yours isn't
                  there either?{" "}
                  <Link
                    to="/publish"
                    className="text-cr-primary underline hover:no-underline"
                  >
                    Post it now.
                  </Link>
                </>
              ) : (
                <>
                  Viajes publicados por conductores para conciertos que todavía no aparecen en nuestra
                  agenda. ¿El tuyo tampoco está?{" "}
                  <Link
                    to="/publish"
                    className="text-cr-primary underline hover:no-underline"
                  >
                    Publícalo ahora.
                  </Link>
                </>
              )}
            </p>
          </div>
          <Link
            to="/concerts"
            className="hidden md:inline-flex items-center gap-2 font-mono text-xs text-white/30 uppercase tracking-[0.15em] hover:text-white/60 transition-colors group"
          >
            {locale === "en" ? "See all trips" : "Ver todos los viajes"}
            <ArrowRight size={11} className="transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </motion.header>

        {rides === null ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[0, 1, 2].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {rides.slice(0, 6).map((ride, i) => (
              <motion.li
                key={ride.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.45, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              >
                <TicketCard ride={ride} onClick={() => navigate(`/rides/${ride.id}`)} />
              </motion.li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
