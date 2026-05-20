import type { ReactNode } from "react";

/**
 * QueryFanoutCoverage — explicit list of related sub-queries this page answers.
 *
 * Google AI Mode fan-out (per Aleyda / iPullRank / Surfer research published
 * around the May 2026 official guide release) issues 8–16 concurrent sub-queries
 * for any single user prompt. Pages that cover multiple related angles on one
 * URL pick up citations across many of those sub-queries; pages that target one
 * narrow keyword pick up at most one.
 *
 * This component is a visible TOC of the conversational sub-queries the host
 * page answers. Each entry is an anchor link to the corresponding section ID
 * (typically a <RetrievalChunk id="...">). It serves three audiences:
 *   - humans navigating long pages
 *   - Google's fan-out retriever (the anchor texts ARE the queries)
 *   - AI agents reading the DOM to choose which section to extract
 *
 * Do NOT pad the list with queries the page doesn't actually answer well; a
 * link to a chunk that doesn't deliver is worse than no link.
 */

interface FanoutItem {
  /** The conversational sub-query as a real user would type it. */
  query: string;
  /** ID of the section that answers it. Must match a real id on the page. */
  targetId: string;
  /** Optional one-line summary surfaced inline. Keep ≤90 chars. */
  summary?: string;
}

interface QueryFanoutCoverageProps {
  /** Top-of-section heading. */
  title?: string;
  /** Optional intro shown before the list. Keep brief. */
  intro?: ReactNode;
  items: FanoutItem[];
}

export function QueryFanoutCoverage({
  title = "Esta página responde a estas búsquedas relacionadas",
  intro,
  items,
}: QueryFanoutCoverageProps) {
  if (items.length === 0) return null;
  return (
    <section
      aria-labelledby="fanout-coverage-heading"
      data-fanout-coverage
      className="my-8 max-w-3xl border border-cr-text/10 bg-cr-bg/30 px-4 md:px-6 py-5"
    >
      <h2
        id="fanout-coverage-heading"
        className="font-display text-lg md:text-xl uppercase tracking-tight text-cr-text mb-2"
      >
        {title}
      </h2>
      {intro && (
        <div className="text-sm text-cr-text/75 leading-relaxed mb-3">{intro}</div>
      )}
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.targetId}>
            <a
              href={`#${item.targetId}`}
              className="text-sm md:text-base font-medium text-cr-text underline decoration-cr-primary/40 hover:decoration-cr-primary"
            >
              {item.query}
            </a>
            {item.summary && (
              <span className="block text-xs md:text-sm text-cr-text/65 leading-snug mt-0.5">
                {item.summary}
              </span>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
