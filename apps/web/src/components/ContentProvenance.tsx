import { BRAND } from "@/lib/brandEntity";

/**
 * ContentProvenance — emits JSON-LD covering Google's "Who / How / Why"
 * helpful-content framework as machine-readable metadata.
 *
 * Pairs with the visible <EeatTrustBlock>: the block speaks to humans, this
 * speaks to crawlers + AI Overview retrievers. Both must agree.
 *
 * Per developers.google.com "creating-helpful-content":
 *   - Who   → author + reviewer (real names + URLs).
 *   - How   → research methodology, AI involvement disclosure, edit cadence.
 *   - Why   → declared purpose of the article in audienceType + about.
 *
 * Renders an Article schema with `reviewedBy`, `creativeWorkStatus`,
 * `dateModified` and (optionally) an `editor` for the human-review signal. No
 * FAQPage spam (deprecated May 2025). Standalone — does not collide with the
 * page's existing Article schema because @id is unique per provenance block.
 */

export type AiInvolvement =
  | "none"
  | "research-assist"
  | "draft-assist"
  | "editorial-summary";

interface ContentProvenanceProps {
  /** Page URL slug or anchor for stable @id. */
  pageId: string;
  /** Headline of the work being attributed. */
  headline: string;
  /** YYYY-MM-DD. The day the article was first published. */
  datePublished: string;
  /** YYYY-MM-DD. Most recent meaningful update (not a touch). */
  dateModified: string;
  /** Primary author. */
  author: { name: string; url: string };
  /** Optional human editor / reviewer (the "How" signal Google wants to see). */
  reviewedBy?: { name: string; url: string };
  /** AI involvement level. Drives the disclosure language. */
  aiInvolvement?: AiInvolvement;
  /** One-sentence "Why this exists." Surfaces in audienceType + about. */
  purpose: string;
}

const AI_DISCLOSURE_TEXT: Record<AiInvolvement, string> = {
  none: "Contenido redactado y editado íntegramente por personas.",
  "research-assist":
    "Investigación apoyada por herramientas de IA para sintetizar fuentes; redacción y verificación a cargo del equipo editorial.",
  "draft-assist":
    "Borrador inicial asistido por IA, revisado, reescrito y verificado por el equipo editorial antes de publicación.",
  "editorial-summary":
    "Resumen ejecutivo generado con apoyo de IA a partir de los datos del artículo; verificado por el equipo editorial.",
};

export function ContentProvenance({
  pageId,
  headline,
  datePublished,
  dateModified,
  author,
  reviewedBy,
  aiInvolvement = "none",
  purpose,
}: ContentProvenanceProps) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Article",
    "@id": `${BRAND.url}${pageId}#provenance`,
    headline,
    datePublished,
    dateModified,
    inLanguage: BRAND.language,
    creativeWorkStatus: "Published",
    author: {
      "@type": "Person",
      name: author.name,
      url: author.url,
    },
    publisher: {
      "@type": "Organization",
      "@id": `${BRAND.url}/#organization`,
      name: BRAND.legalName,
    },
    about: {
      "@type": "Thing",
      description: purpose,
    },
    // The "How" signal Google's helpful-content guide calls out explicitly.
    contentReferenceTime: dateModified,
    abstract: AI_DISCLOSURE_TEXT[aiInvolvement],
  };

  if (reviewedBy) {
    (schema as { reviewedBy?: unknown }).reviewedBy = {
      "@type": "Person",
      name: reviewedBy.name,
      url: reviewedBy.url,
    };
    (schema as { editor?: unknown }).editor = {
      "@type": "Person",
      name: reviewedBy.name,
      url: reviewedBy.url,
    };
  }

  return (
    <script
      type="application/ld+json"
      data-provenance-for={pageId}
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

/**
 * AiContentNotice — visible disclosure block.
 *
 * Per Google's using-gen-ai-content policy: disclosure is recommended when AI
 * is involved meaningfully. The text is fixed (not free-form) so users see
 * consistent wording across the site and we cannot drift into hand-wavy
 * language that hides actual involvement.
 *
 * Renders only when aiInvolvement !== "none". Pair with <ContentProvenance> on
 * the same page so the visible disclosure matches the JSON-LD.
 */
interface AiContentNoticeProps {
  aiInvolvement: AiInvolvement;
  reviewedBy?: { name: string };
}

export function AiContentNotice({
  aiInvolvement,
  reviewedBy,
}: AiContentNoticeProps) {
  if (aiInvolvement === "none") return null;
  const base = AI_DISCLOSURE_TEXT[aiInvolvement];
  const reviewer = reviewedBy
    ? ` Revisión editorial: ${reviewedBy.name}.`
    : "";
  return (
    <aside
      role="note"
      aria-label="Aviso sobre uso de IA"
      data-ai-content-notice
      className="my-4 text-xs text-cr-text/65 border border-cr-text/10 px-3 py-2"
    >
      <span className="font-display uppercase tracking-[0.15em] text-cr-text/80 mr-2">
        Cómo se hizo:
      </span>
      {base}
      {reviewer}
    </aside>
  );
}
