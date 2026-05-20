import { Link } from "react-router-dom";
import { CalendarClock, ShieldCheck, BookOpen } from "lucide-react";

/**
 * `<EeatTrustBlock>` — visible E-E-A-T trust pill for pillar / dataset / blog /
 * festival pages.
 *
 * Rationale (Google "Creating helpful, reliable, people-first content" 2026):
 * - Authorship transparency (Who?) → renders author name + link to author page.
 * - Effort & freshness (How?) → renders "Última revisión" with humanized date.
 * - Methodology accessibility (Why?) → optional link to "¿Cómo lo hemos
 *   investigado?" section/page.
 * - Trustworthiness disclaimer → explicit statement about first-hand
 *   experience + official-source verification + human editorial review.
 *
 * The block is **always visible** (no `hidden`, no `aria-hidden`) so that both
 * Google indexing and human readers see it. Use after the H1 (preferred) or at
 * the end of the article body for pillars/datasets.
 *
 * Design: low-key compact pill, neutral border, primary accent on icons. NOT a
 * defensive disclaimer — it reads as editorial transparency.
 *
 * Props:
 * @param pageType  controls icon + microcopy variant ("pillar" | "dataset" |
 *                  "blog" | "festival").
 * @param lastReviewed  ISO date string (YYYY-MM-DD). Rendered humanized in
 *                  es-ES locale via `<time>`.
 * @param author    optional { name, url }. If absent, only the date + research
 *                  link are shown.
 * @param methodologyHref  optional anchor (e.g. "#metodologia") or full path.
 *                  When present, renders a "¿Cómo lo hemos investigado?" link.
 * @param className optional extra classes for layout overrides.
 */
export interface EeatTrustBlockProps {
  pageType: "pillar" | "dataset" | "blog" | "festival";
  lastReviewed: string;
  author?: { name: string; url: string };
  methodologyHref?: string;
  className?: string;
}

function formatHumanDate(iso: string): string {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString("es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function disclaimerFor(pageType: EeatTrustBlockProps["pageType"]): string {
  switch (pageType) {
    case "dataset":
      return "Dataset elaborado por nuestro equipo de datos, combinando observaciones reales de la comunidad de ConcertRide con fuentes oficiales (organización del festival, ALSA, Renfe, APM, INE, DGT) y revisión editorial humana.";
    case "festival":
      return "Información elaborada por nuestro equipo combinando experiencia directa asistiendo a festivales en España, datos de transporte verificados con fuentes oficiales y revisión editorial humana antes de publicación.";
    case "blog":
      return "Artículo redactado y editado por personas, contrastado con fuentes oficiales y experiencia directa de nuestro equipo en festivales y carpooling en España.";
    case "pillar":
    default:
      return "Guía elaborada combinando experiencia directa de nuestro equipo asistiendo a festivales en España, datos verificados con fuentes oficiales (organización del festival, ayuntamientos, INE, APM, DGT) y revisión editorial humana antes de publicación.";
  }
}

export default function EeatTrustBlock({
  pageType,
  lastReviewed,
  author,
  methodologyHref,
  className,
}: EeatTrustBlockProps) {
  const humanDate = formatHumanDate(lastReviewed);
  const disclaimer = disclaimerFor(pageType);

  return (
    <aside
      className={
        "not-prose border border-cr-border bg-cr-surface/40 p-4 md:p-5 space-y-3 font-sans text-sm text-cr-text-muted " +
        (className ?? "")
      }
      aria-label="Información editorial y de revisión del contenido"
    >
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        {author ? (
          <span className="inline-flex items-center gap-2">
            <span
              aria-hidden="true"
              className="w-7 h-7 rounded-full bg-cr-primary/10 border border-cr-primary/40 flex items-center justify-center font-display text-[11px] text-cr-primary uppercase select-none shrink-0"
            >
              {author.name.charAt(0)}
            </span>
            <span className="flex flex-col leading-tight">
              <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-cr-text-muted">
                Por
              </span>
              <Link
                to={author.url}
                className="text-cr-text hover:text-cr-primary transition-colors text-[13px]"
                rel="author"
              >
                {author.name}
              </Link>
            </span>
          </span>
        ) : null}

        <span className="inline-flex items-center gap-2">
          <CalendarClock
            size={14}
            aria-hidden="true"
            className="text-cr-primary shrink-0"
          />
          <span className="flex flex-col leading-tight">
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-cr-text-muted">
              Última revisión
            </span>
            <time dateTime={lastReviewed} className="text-cr-text text-[13px]">
              {humanDate}
            </time>
          </span>
        </span>

        {methodologyHref ? (
          <a
            href={methodologyHref}
            className="inline-flex items-center gap-2 font-sans text-[12px] font-semibold uppercase tracking-[0.1em] text-cr-primary hover:text-cr-text transition-colors border border-cr-primary/40 hover:border-cr-primary px-3 py-1.5 ml-auto"
          >
            <BookOpen size={12} aria-hidden="true" />
            ¿Cómo lo hemos investigado?
          </a>
        ) : null}
      </div>

      <p className="flex items-start gap-2 text-[12.5px] leading-relaxed text-cr-text-muted">
        <ShieldCheck
          size={14}
          aria-hidden="true"
          className="text-cr-primary mt-0.5 shrink-0"
        />
        <span>{disclaimer}</span>
      </p>
    </aside>
  );
}
