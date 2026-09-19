import React, { type CSSProperties } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { Concert } from "@concertride/types";
import { ConcertCard } from "@/components/ConcertCard";
import { SectionHead } from "@/components/system";
import { useI18n } from "@/lib/i18n";

interface Props {
  concerts: Concert[];
}

/**
 * El tablón de salidas.
 *
 * Estado base (SSR, móvil, reduced-motion): carril nativo con scroll-snap y
 * máscara de bordes. En escritorio con movimiento, la coreografía de la home
 * (homeChoreography.ts) ancla la sección y convierte el scroll vertical en
 * desplazamiento del carril, con foco por proximidad (0.94–1.06) y barra de
 * progreso. A3 del banco: lo que secuestra el scroll se paga con orientación.
 */
function HorizontalCarouselComponent({ concerts }: Props) {
  const { t } = useI18n();
  return (
    <section
      aria-labelledby="discover-title"
      data-departures
      className="bg-cr-bg text-cr-text overflow-hidden"
    >
      <div data-departures-stage className="lg:min-h-[100svh] flex flex-col justify-center gap-10 py-[var(--rhythm-2)]">
        <div className="max-w-6xl mx-auto w-full px-6">
          <SectionHead
            id="discover-title"
            eyebrow="Tablón de salidas"
            title={
              <>
                Conciertos con
                <br />
                viajes activos.
              </>
            }
            aside={
              <Link to="/concerts" className="cr-link cr-label text-cr-text-muted hover:text-cr-text inline-flex items-center gap-2">
                {t("nav.concerts")} <ArrowRight size={14} aria-hidden="true" />
              </Link>
            }
            scan="words"
          />
        </div>

        <ol data-departures-track className="cr-track lg:px-[calc((100vw-72rem)/2+1.5rem)]">
          {concerts.map((c, i) => (
            <li
              key={c.id}
              data-departures-card
              className="w-[78vw] sm:w-[320px] lg:w-[360px] cr-vt-card"
              style={{ "--cr-vt-name": `concert-card-${c.id}` } as CSSProperties}
            >
              <Link to={`/concerts/${c.id}`} className="block focus-visible:outline-2">
                <ConcertCard concert={c} priority={i === 0} />
              </Link>
            </li>
          ))}
          <li data-departures-card className="w-[78vw] sm:w-[320px] lg:w-[360px]">
            <Link
              to="/concerts"
              className="h-full min-h-[24rem] border border-dashed border-cr-border-mid flex flex-col items-start justify-end gap-3 p-6 text-cr-text hover:border-cr-text transition-colors"
            >
              <span className="cr-label text-cr-text-muted">Todos</span>
              <span className="font-display text-display-m">Ver todos los conciertos</span>
              <ArrowRight size={22} aria-hidden="true" />
            </Link>
          </li>
        </ol>

        {/* Barra de progreso: responde a «¿cuánto queda?» */}
        <div className="max-w-6xl mx-auto w-full px-6 hidden lg:block" aria-hidden="true">
          <div className="h-px bg-cr-border relative">
            <div data-departures-progress className="absolute inset-0 bg-cr-primary origin-left scale-x-0" />
          </div>
        </div>
      </div>
    </section>
  );
}

export const HorizontalCarousel = React.memo(HorizontalCarouselComponent);
