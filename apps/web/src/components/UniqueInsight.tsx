import type { ReactNode } from "react";

/**
 * UniqueInsight — first-party data callout.
 *
 * Per Google's official AI Optimization Guide (May 15 2026) and I/O 2026
 * guidance: AI Mode upweights content from someone who brings a unique
 * perspective or original data the model can't reconstruct from common-knowledge
 * sources. "Generic summaries" lose; first-hand experience + proprietary numbers
 * win.
 *
 * ConcertRide has exactly that asset: real ride data (routes published, prices
 * paid, occupancy rates, vuelta-de-madrugada patterns) that no aggregator
 * possesses. Surfacing it as a labeled, scoped section is the cheapest way to
 * convert that data into citation surface.
 *
 * Each insight renders as <aside role="note"> so accessibility trees AND
 * AI agents (which use the accessibility tree per I/O 2026 docs) can find it
 * unambiguously.
 */

interface UniqueInsightProps {
  /** Short label — e.g. "Datos propios", "Análisis ConcertRide", "Observación interna". */
  label?: string;
  /** Headline of the insight. Treat as a standalone fact. */
  headline: string;
  /** Body content — a chart, a list, a paragraph with figures. */
  children: ReactNode;
  /**
   * What dataset / sample this came from. Required: the moment we describe
   * something as "datos propios" without stating sample size / period, we
   * forfeit the credibility signal we were trying to earn.
   */
  basis: string;
  /** Date the data was last refreshed. Required — freshness signal. */
  asOf: string;
  /** Optional id for deep linking. */
  id?: string;
}

export function UniqueInsight({
  label = "Datos propios de ConcertRide",
  headline,
  children,
  basis,
  asOf,
  id,
}: UniqueInsightProps) {
  return (
    <aside
      id={id}
      role="note"
      aria-label={`Insight: ${headline}`}
      data-unique-insight
      className="my-6 border-l-4 border-cr-primary bg-cr-primary/5 px-4 md:px-6 py-4"
    >
      <p className="font-display text-xs uppercase tracking-[0.18em] text-cr-primary mb-1">
        {label}
      </p>
      <h3 className="font-display text-base md:text-lg uppercase tracking-tight text-cr-text mb-2">
        {headline}
      </h3>
      <div className="text-sm md:text-base text-cr-text/90 leading-relaxed space-y-2">
        {children}
      </div>
      <p className="mt-3 text-xs text-cr-text/60">
        <span className="uppercase tracking-wider mr-1">Base:</span>
        {basis}
        <span className="mx-2 text-cr-text/40">·</span>
        <span className="uppercase tracking-wider mr-1">A fecha de:</span>
        {asOf}
      </p>
    </aside>
  );
}
