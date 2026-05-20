import type { ReactNode } from "react";

/**
 * RetrievalChunk — a self-contained, extractable answer unit.
 *
 * Built around the "Retrieval-Layer SEO" finding: frontier models (Gemini,
 * GPT, Claude) don't ingest documents holistically. They retrieve discrete
 * fragments and re-rank them by source quality. A section that depends on
 * prose from three sections earlier can't be pulled as a coherent unit and
 * effectively never enters the retrieval pool — irrespective of how good the
 * prose is.
 *
 * Each chunk encodes:
 *  - the conversational query it answers (becomes the visible H3 + the chunk's
 *    aria-label so retrieval scoping is unambiguous),
 *  - a one-sentence direct answer (the snippet that gets pulled verbatim into
 *    AI Overviews),
 *  - a fact-dense body with figures and dates,
 *  - an optional primary-source attribution that triggers the source-quality
 *    filter inside the model.
 *
 * IMPORTANT: do not add FAQPage schema around these (Google deprecated FAQ
 * rich results May 2025; the prior post warned that schema spam can damage
 * SEO). The chunkability lives in the HTML structure itself, not in markup.
 */

type SourceTier = "primary" | "official" | "gov" | "research";

interface PrimarySource {
  /** Tier signals weight to the retrieval-layer source-quality filter. */
  tier: SourceTier;
  /** Human label rendered to readers. */
  label: string;
  /** HTTPS URL of the primary source. */
  href: string;
}

interface RetrievalChunkProps {
  /** Conversational query this chunk answers. Used as the H3 + aria-label. */
  question: string;
  /**
   * One-sentence declarative answer. This is the line frontier models pull
   * verbatim. Keep it standalone (no pronouns referring to prior context),
   * under 30 words, and front-load the entity + key figure.
   */
  directAnswer: string;
  /** Fact-dense body. Numbers, dates, named entities. Avoid filler. */
  children: ReactNode;
  /**
   * Primary-source corroboration. Models are explicitly told to prefer
   * official/.gov/research sources over aggregators — citing them inline
   * makes the chunk eligible for the higher source-quality tier.
   */
  sources?: PrimarySource[];
  /** HTML id — pass to enable deep-link / anchor scrolling. */
  id?: string;
  /** Optional last-checked date — adds freshness signal. */
  lastChecked?: string;
}

const TIER_LABEL: Record<SourceTier, string> = {
  primary: "Fuente original",
  official: "Fuente oficial",
  gov: "Fuente gubernamental",
  research: "Investigación",
};

export function RetrievalChunk({
  question,
  directAnswer,
  children,
  sources,
  id,
  lastChecked,
}: RetrievalChunkProps) {
  return (
    <section
      id={id}
      aria-label={question}
      data-retrieval-chunk
      className="mb-8 border-l-2 border-cr-primary/40 pl-4 md:pl-6"
    >
      <h3 className="font-display text-base md:text-lg uppercase tracking-tight text-cr-text mb-2">
        {question}
      </h3>
      <p data-direct-answer className="text-sm md:text-base font-semibold text-cr-text leading-snug mb-3">
        {directAnswer}
      </p>
      <div className="text-sm md:text-base text-cr-text/85 leading-relaxed space-y-2">
        {children}
      </div>
      {sources && sources.length > 0 && (
        <p className="mt-3 text-xs text-cr-text/65">
          <span className="uppercase tracking-wider mr-1">Fuentes:</span>
          {sources.map((s, i) => (
            <span key={s.href}>
              {i > 0 && <span className="mx-1">·</span>}
              <a
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                className="underline decoration-cr-primary/40 hover:decoration-cr-primary"
                title={TIER_LABEL[s.tier]}
              >
                {s.label}
              </a>
            </span>
          ))}
          {lastChecked && (
            <span className="ml-2 text-cr-text/55">· Verificado {lastChecked}</span>
          )}
        </p>
      )}
    </section>
  );
}

/**
 * ClaimEvidence — even smaller atomic unit. A single claim with a single
 * primary-source citation. Use inline inside articles when a sentence needs
 * to carry retrieval weight on its own.
 *
 * Renders as a <span> with microformat-style classes so the claim ↔ source
 * relationship stays adjacent in the DOM (retrieval-friendly).
 */
interface ClaimEvidenceProps {
  claim: string;
  source: PrimarySource;
}

export function ClaimEvidence({ claim, source }: ClaimEvidenceProps) {
  return (
    <span className="inline-flex flex-wrap items-baseline gap-x-1">
      <span data-claim className="text-cr-text">
        {claim}
      </span>
      <a
        href={source.href}
        target="_blank"
        rel="noopener noreferrer"
        className="text-xs text-cr-text/60 underline decoration-cr-primary/40 hover:decoration-cr-primary"
        title={TIER_LABEL[source.tier]}
      >
        [{source.label}]
      </a>
    </span>
  );
}
