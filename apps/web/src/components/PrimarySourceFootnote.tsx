import type { PrimarySource } from "@/lib/primarySources";
import { useI18n } from "@/lib/i18n";

/**
 * PrimarySourceFootnote — renders the "verified against primary sources"
 * block at the end of a content section.
 *
 * Frontier model system prompts instruct the retriever to prefer original
 * sources, government sites, and official documentation. Citing them inline
 * next to our claims earns retrieval weighting that aggregator content can't
 * touch — and signals authenticity to the SEO-skepticism filter that flags
 * aggregator listicles.
 *
 * Render this block once per major section (not per claim — that's what
 * <ClaimEvidence> is for).
 */

interface PrimarySourceFootnoteProps {
  /** Section the citations belong to, e.g. "Transporte oficial al festival". */
  context: string;
  sources: PrimarySource[];
  /** When the citations were last verified. Triggers freshness signals. */
  verifiedOn?: string;
}

const TIER_LABEL = {
  primary: "Fuente original",
  official: "Sitio oficial",
  gov: "Fuente oficial gubernamental",
  research: "Investigación",
} as const;

const TIER_LABEL_EN = {
  primary: "Original source",
  official: "Official site",
  gov: "Official government source",
  research: "Research",
} as const;

export function PrimarySourceFootnote({
  context,
  sources,
  verifiedOn,
}: PrimarySourceFootnoteProps) {
  const { locale } = useI18n();
  const isEn = locale === "en";
  if (sources.length === 0) return null;
  return (
    <aside
      aria-label={isEn ? `Sources consulted for ${context}` : `Fuentes consultadas para ${context}`}
      data-primary-sources
      className="mt-4 border-t border-cr-text/10 pt-3"
    >
      <p className="text-xs text-cr-text/70 leading-relaxed">
        <span className="font-display uppercase tracking-[0.15em] text-cr-text/80 mr-2">
          {isEn ? "Sources:" : "Fuentes:"}
        </span>
        {sources.map((s, i) => (
          <span key={s.href}>
            {i > 0 && <span className="mx-1 text-cr-text/40">·</span>}
            <a
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              title={isEn ? TIER_LABEL_EN[s.tier] : TIER_LABEL[s.tier]}
              className="text-cr-text/85 underline decoration-cr-primary/40 hover:decoration-cr-primary"
            >
              {s.label}
            </a>
          </span>
        ))}
        {verifiedOn && (
          <span className="ml-2 text-cr-text/55">
            {isEn ? <>· Verified {verifiedOn}</> : <>· Verificado {verifiedOn}</>}
          </span>
        )}
      </p>
    </aside>
  );
}
