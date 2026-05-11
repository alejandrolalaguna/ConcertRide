/**
 * SpeakableAnswerBlock — answer-first content block optimized for AI Overviews,
 * Google SGE, ChatGPT, Perplexity and voice assistants.
 *
 * Renders a featured question + answer-first paragraph with a unique anchor id,
 * AND emits a standalone WebPage + SpeakableSpecification JSON-LD that targets
 * this exact block via its `id` selector.
 *
 * SSR-friendly: pure render, no browser-only hooks. The <script> tag is inlined
 * in JSX so prerender (scripts/prerender.mjs) captures it verbatim.
 *
 * Pattern: place this just below the H1 of festival/route/city landing pages.
 */

interface SpeakableAnswerBlockProps {
  /** Headline of the answer block — typically the primary user query. */
  question: string;
  /** Answer paragraph (50–80 words). Should lead with the direct answer in the first sentence. */
  answer: string;
  /** Unique DOM id used as both the section anchor and the SpeakableSpecification cssSelector target. */
  schemaId?: string;
  /** Optional canonical URL of the page this block lives on. When provided, the emitted schema includes `url`. */
  pageUrl?: string;
}

export function SpeakableAnswerBlock({
  question,
  answer,
  schemaId = "speakable-answer",
  pageUrl,
}: SpeakableAnswerBlockProps) {
  // CSS selector that points at the answer <p> inside this block — what voice
  // assistants and AI engines will read aloud / cite.
  const cssSelector = `#${schemaId} .speakable`;

  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${pageUrl ?? ""}#${schemaId}`,
    name: question,
    description: answer,
    inLanguage: "es-ES",
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: [cssSelector, `#${schemaId} h2`],
    },
    ...(pageUrl ? { url: pageUrl, mainEntityOfPage: { "@id": pageUrl } } : {}),
  };

  return (
    <section
      id={schemaId}
      aria-label={question}
      className="mt-4 px-5 py-4 md:px-6 md:py-5 border border-cr-primary/40 bg-cr-primary/[0.04] max-w-2xl"
    >
      <h2 className="font-display text-base md:text-lg uppercase tracking-wide text-cr-primary leading-tight">
        {question}
      </h2>
      <p className="speakable mt-2 font-sans text-sm md:text-[15px] leading-relaxed text-cr-text">
        {answer}
      </p>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
    </section>
  );
}
