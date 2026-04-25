import { useRef } from "react";
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

  // 180vh gives a comfortable slow scroll pace.
  // Translation stops when 2 cards are still visible — user never needs to
  // scroll past all cards to reach content below.
  const totalCards = concerts.length + 1; // +1 for "Ver todos"
  const CARD_WIDTH_PX = 400; // matches lg:w-[400px]
  const GAP_PX = 24;
  const totalWidthPx = totalCards * (CARD_WIDTH_PX + GAP_PX);
  const keepVisiblePx = 2 * (CARD_WIDTH_PX + GAP_PX);
  const translatePx = Math.max(0, totalWidthPx - keepVisiblePx);
  const x = useTransform(scrollYProgress, [0, 1], ["0px", `-${translatePx}px`]);

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
          <a
            href="/concerts"
            className="hidden md:inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-cr-text-muted hover:text-cr-primary transition-colors"
          >
            Ver todos
            <ArrowRight size={14} />
          </a>
        </div>
      </div>

      {/* Desktop: vertical-scroll → horizontal-translate */}
      <div
        ref={ref}
        className="relative hidden md:block"
        style={{ height: "180vh" }}
      >
        <div className="sticky top-0 h-dvh flex items-center overflow-hidden">
          <motion.ol
            style={{ x }}
            className="flex gap-6 px-[6vw]"
          >
            {concerts.map((c) => (
              <li key={c.id} className="shrink-0 w-[340px] lg:w-[400px]">
                <a href={`/concerts/${c.id}`} className="block">
                  <ConcertCard concert={c} />
                </a>
              </li>
            ))}
            <li className="shrink-0 w-[340px] lg:w-[400px] flex items-center justify-center">
              <a
                href="/concerts"
                className="h-full w-full border border-dashed border-cr-border aspect-[4/3] flex flex-col items-center justify-center gap-2 hover:border-cr-primary hover:text-cr-primary transition-colors"
              >
                <span className="font-display text-3xl uppercase">Ver todos</span>
                <ArrowRight size={24} />
              </a>
            </li>
          </motion.ol>
        </div>
      </div>

      {/* Mobile: native horizontal scroll with snap */}
      <div className="md:hidden">
        <ol className="flex gap-4 overflow-x-auto snap-x snap-mandatory px-6 pb-10 -mx-1 scroll-pl-6">
          {concerts.map((c) => (
            <li key={c.id} className="shrink-0 w-[78%] snap-start">
              <a href={`/concerts/${c.id}`} className="block">
                <ConcertCard concert={c} />
              </a>
            </li>
          ))}
          <li className="shrink-0 w-[78%] snap-start">
            <a
              href="/concerts"
              className="block h-full border border-dashed border-cr-border aspect-[4/3] flex flex-col items-center justify-center gap-2 text-cr-text-muted hover:text-cr-primary"
            >
              <span className="font-display text-2xl uppercase">Ver todos</span>
              <ArrowRight size={20} />
            </a>
          </li>
        </ol>
      </div>
    </section>
  );
}
