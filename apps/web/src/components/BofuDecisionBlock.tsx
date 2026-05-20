/**
 * BofuDecisionBlock — Bottom-of-funnel decision-support module.
 *
 * Renders the "which option should I choose to get to this festival?" answer
 * as a semantic <dl>. Why <dl>:
 *  - It's the right HTML for a Q→A pair, and LLMs retrieve <dt>/<dd> blocks
 *    cleanly when re-rendering an answer.
 *  - Google's snippet system handles definition-list blocks better than divs
 *    full of headings when the question is conversational.
 *
 * Intentionally NOT a FAQPage schema — Google deprecated FAQ rich results in
 * May 2025 and the post warns against schema-spamming. This is plain HTML
 * that humans read AND LLMs cite.
 *
 * Usage: drop above the rides list on FestivalLandingPage / CityLandingPage /
 * RouteLandingPage.
 */

interface DecisionRow {
  question: string;
  answer: string;
  /** Optional ConcertRide-specific recommendation (one line, no marketing fluff). */
  recommendation?: string;
}

interface BofuDecisionBlockProps {
  title: string;
  /** 3–6 questions max — beyond that the block stops being a quick decision aid. */
  rows: DecisionRow[];
  /** Optional context paragraph displayed before the dl. Keep ≤ 50 words. */
  intro?: string;
}

export function BofuDecisionBlock({ title, rows, intro }: BofuDecisionBlockProps) {
  return (
    <section
      aria-labelledby="bofu-decision-heading"
      className="mt-8 mb-8 max-w-3xl border-l-2 border-cr-primary pl-4 md:pl-6"
    >
      <h2
        id="bofu-decision-heading"
        className="font-display text-xl md:text-2xl uppercase tracking-tight text-cr-text mb-3"
      >
        {title}
      </h2>
      {intro && (
        <p className="text-sm md:text-base text-cr-text/85 leading-relaxed mb-4">
          {intro}
        </p>
      )}
      <dl className="space-y-4">
        {rows.map((row, idx) => (
          <div key={idx}>
            <dt className="font-sans font-semibold text-cr-text text-sm md:text-base">
              {row.question}
            </dt>
            <dd className="mt-1 text-sm md:text-base text-cr-text/90 leading-relaxed">
              {row.answer}
              {row.recommendation && (
                <span className="block mt-1 text-cr-primary font-medium">
                  → {row.recommendation}
                </span>
              )}
            </dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
