import { useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight } from "lucide-react";
import type { Concert } from "@concertride/types";
import { ConcertCard } from "@/components/ConcertCard";

interface Props {
  concerts: Concert[];
}

export function HorizontalCarousel({ concerts }: Props) {
  const ref = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end end"],
  });

  // +1 for the "Ver todos" card; -1.5 keeps the last card partially visible so
  // the user knows the section ended (avoids dead-scroll at the tail).
  const totalCards = concerts.length + 1;
  const range = Math.max(0, totalCards - 1.5);
  const x = useTransform(scrollYProgress, [0, 1], ["0%", `-${range * 18}%`]);

  return (
    <section aria-labelledby="discover-title" className="bg-cr-bg text-cr-text">
      <div className="max-w-6xl mx-auto px-6 pt-20 md:pt-28 pb-8 space-y-3">
        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
          Discover
        </p>
        <div className="flex items-end justify-between gap-6">
          <h2
            id="discover-title"
            className="font-display text-3xl md:text-5xl uppercase leading-[0.95]"
          >
            Conciertos
            <br />
            con viajes activos.
          </h2>
          <Link
            to="/concerts"
            className="hidden md:inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-cr-text-muted hover:text-cr-primary transition-colors"
          >
            Ver todos
            <ArrowRight size={14} />
          </Link>
        </div>
      </div>

      {/* Desktop: vertical-scroll → horizontal-translate */}
      <div
        ref={ref}
        className="relative hidden md:block"
        style={{ height: `${Math.min(Math.max(1, range) * 50 + 80, 180)}vh` }}
      >
        <div className="sticky top-0 h-dvh flex items-center overflow-hidden">
          <motion.ol
            style={{ x }}
            className="flex gap-6 px-[6vw]"
          >
            {concerts.map((c) => (
              <li key={c.id} className="shrink-0 w-[340px] lg:w-[400px]">
                <Link to={`/concerts/${c.id}`} className="block">
                  <ConcertCard concert={c} />
                </Link>
              </li>
            ))}
            <li className="shrink-0 w-[340px] lg:w-[400px] flex items-center justify-center">
              <Link
                to="/concerts"
                className="h-full w-full border border-dashed border-cr-border aspect-[4/3] flex flex-col items-center justify-center gap-2 hover:border-cr-primary hover:text-cr-primary transition-colors"
              >
                <span className="font-display text-3xl uppercase">Ver todos</span>
                <ArrowRight size={24} />
              </Link>
            </li>
          </motion.ol>
        </div>
      </div>

      {/* Mobile: native horizontal scroll with snap */}
      <div className="md:hidden">
        <ol className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-6 pb-10 -mx-1 scroll-pl-6">
          {concerts.map((c) => (
            <li key={c.id} className="shrink-0 w-[78%] snap-start">
              <Link to={`/concerts/${c.id}`} className="block">
                <ConcertCard concert={c} />
              </Link>
            </li>
          ))}
          <li className="shrink-0 w-[78%] snap-start">
            <Link
              to="/concerts"
              className="block h-full border border-dashed border-cr-border aspect-[4/3] flex flex-col items-center justify-center gap-2 text-cr-text-muted hover:text-cr-primary"
            >
              <span className="font-display text-2xl uppercase">Ver todos</span>
              <ArrowRight size={20} />
            </Link>
          </li>
        </ol>
      </div>
    </section>
  );
}
