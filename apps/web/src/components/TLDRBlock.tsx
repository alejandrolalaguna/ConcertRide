/**
 * TLDRBlock — visible "Too Long; Didn't Read" answer-first block.
 *
 * Why this exists: Google deprecated FAQ + HowTo rich results in 2026. The schema
 * still helps LLMs/AI Overviews understand pages, but the SERP UI is gone. To win
 * AI Overviews and "answer engines" (ChatGPT, Perplexity, Gemini, Claude) we need
 * the answer to be VISIBLE at the top of the page, not just embedded in schema.
 *
 * Pattern: place this directly after SpeakableAnswerBlock on every blog post that
 * has a usable excerpt. The answer paragraph carries the `.speakable` class so the
 * existing BlogPosting `speakable.cssSelector` already picks it up — no schema
 * change required here.
 *
 * SSR-friendly: pure render, no browser-only hooks.
 */

export interface TLDRBlockProps {
  /** 1–2 sentence answer-first paragraph (the direct response to the post's title-question). */
  answer: string;
  /** Optional bullet list with key data points (prices, distances, times). 2–4 ideal. */
  highlights?: string[];
}

export function TLDRBlock({ answer, highlights }: TLDRBlockProps) {
  if (!answer || answer.trim().length < 20) return null;

  return (
    <aside
      className="my-6 rounded-sm border-l-4 border-cr-primary bg-cr-primary/[0.04] p-4 sm:p-5"
      role="complementary"
      aria-label="Resumen rápido"
    >
      <div className="flex items-start gap-3">
        <div className="font-display text-xs uppercase tracking-[0.16em] text-cr-primary shrink-0 pt-0.5">
          TL;DR
        </div>
        <div className="flex-1 space-y-2 min-w-0">
          <p className="speakable text-base sm:text-lg text-cr-text font-medium leading-snug">
            {answer}
          </p>
          {highlights && highlights.length > 0 && (
            <ul className="mt-2 space-y-1 text-sm text-cr-text/80">
              {highlights.map((h, i) => (
                <li key={i} className="flex gap-2 leading-relaxed">
                  <span className="text-cr-primary shrink-0">→</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </aside>
  );
}
