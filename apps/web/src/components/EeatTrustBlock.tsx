import { Link } from "react-router-dom";
import { CalendarClock, ShieldCheck, BookOpen } from "lucide-react";
import { useI18n } from "@/lib/i18n";

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
  pageType: "pillar" | "dataset" | "blog" | "festival" | "city" | "artist" | "venue";
  lastReviewed: string;
  author?: { name: string; url: string };
  methodologyHref?: string;
  className?: string;
}

function formatHumanDate(iso: string, isEn: boolean): string {
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return iso;
    return d.toLocaleDateString(isEn ? "en-GB" : "es-ES", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

function disclaimerFor(pageType: EeatTrustBlockProps["pageType"], isEn: boolean): string {
  if (isEn) {
    switch (pageType) {
      case "dataset":
        return "Dataset compiled by our data team, combining real observations from the ConcertRide community with official sources (festival organisers, ALSA, Renfe, APM, INE, DGT) and human editorial review.";
      case "festival":
        return "Information compiled by our team combining first-hand experience attending festivals in Spain, transport data verified against official sources, and human editorial review before publication.";
      case "blog":
        return "Article written and edited by people, cross-checked against official sources and our team's first-hand experience with festivals and carpooling in Spain.";
      case "city":
        return "City page compiled by our team combining venues, festivals and carpooling routes verified on ConcertRide, with data cross-checked against the city council, official venues and APM, and human editorial review.";
      case "artist":
        return "Artist information compiled by our team from dates officially announced by the promoter, the Ticketmaster Discovery API schedule and real carpooling routes active on ConcertRide, with human editorial review.";
      case "venue":
        return "Venue profile compiled by our team combining the venue operator's official capacity and address, a verified event schedule and active carpooling routes on ConcertRide, with human editorial review.";
      case "pillar":
      default:
        return "Guide compiled combining our team's first-hand experience attending festivals in Spain, data verified against official sources (festival organisers, city councils, INE, APM, DGT) and human editorial review before publication.";
    }
  }
  switch (pageType) {
    case "dataset":
      return "Dataset elaborado por nuestro equipo de datos, combinando observaciones reales de la comunidad de ConcertRide con fuentes oficiales (organización del festival, ALSA, Renfe, APM, INE, DGT) y revisión editorial humana.";
    case "festival":
      return "Información elaborada por nuestro equipo combinando experiencia directa asistiendo a festivales en España, datos de transporte verificados con fuentes oficiales y revisión editorial humana antes de publicación.";
    case "blog":
      return "Artículo redactado y editado por personas, contrastado con fuentes oficiales y experiencia directa de nuestro equipo en festivales y carpooling en España.";
    case "city":
      return "Página de ciudad elaborada por nuestro equipo combinando recintos, festivales y rutas de carpooling verificadas en ConcertRide, con datos cruzados con ayuntamiento, recintos oficiales y APM, y revisión editorial humana.";
    case "artist":
      return "Información de artista compilada por nuestro equipo a partir de fechas anunciadas oficialmente por la promotora, agenda Ticketmaster Discovery API y rutas reales de carpooling activas en ConcertRide, con revisión editorial humana.";
    case "venue":
      return "Ficha de recinto elaborada por nuestro equipo combinando capacidad y dirección oficial del operador del recinto, agenda de eventos verificada y rutas de carpooling activas en ConcertRide, con revisión editorial humana.";
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
  const { locale } = useI18n();
  const isEn = locale === "en";
  const humanDate = formatHumanDate(lastReviewed, isEn);
  const disclaimer = disclaimerFor(pageType, isEn);

  return (
    <aside
      className={
        "not-prose border border-cr-border bg-cr-surface/40 p-4 md:p-5 space-y-3 font-sans text-sm text-cr-text-muted " +
        (className ?? "")
      }
      aria-label={isEn ? "Editorial and content-review information" : "Información editorial y de revisión del contenido"}
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
                {isEn ? "By" : "Por"}
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
              {isEn ? "Last reviewed" : "Última revisión"}
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
            {isEn ? "How we researched this" : "¿Cómo lo hemos investigado?"}
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
