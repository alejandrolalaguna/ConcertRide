import { Sparkles } from "lucide-react";

/**
 * `<AiDisclosureNote>` — transparent AI-content disclosure note (Google
 * "Using AI-generated content in Search" guidelines, 2026).
 *
 * Google does NOT require disclosure of AI assistance, but recommends adding
 * "information about how automation has been used" to give readers context.
 * This component renders that note in a transparent, NON-defensive tone — it
 * communicates editorial transparency, not a mea culpa.
 *
 * Use sparingly and only when accurate. The founder decides per-page whether
 * the content qualifies. When in doubt, prefer "fully-human" (which renders
 * nothing) over a misleading "ai-assisted" tag.
 *
 * Levels:
 * - "ai-assisted":            AI helped with drafting, structure, or research;
 *                             humans edited, verified facts, and approved.
 * - "ai-drafted-human-reviewed": AI produced the first draft; humans
 *                             rewrote substantively + verified facts + approved.
 * - "fully-human":            no AI involvement → component returns null.
 *
 * Render position: at the end of the article body, after the conclusion and
 * before footer-style links.
 */
export interface AiDisclosureNoteProps {
  level: "ai-assisted" | "ai-drafted-human-reviewed" | "fully-human";
  className?: string;
}

function noteFor(level: AiDisclosureNoteProps["level"]): string | null {
  switch (level) {
    case "ai-assisted":
      return "Este contenido se ha redactado con asistencia de inteligencia artificial y ha sido revisado, editado y verificado por nuestro equipo editorial humano antes de su publicación. Los datos citados se han contrastado con fuentes oficiales y experiencia directa del equipo en festivales en España.";
    case "ai-drafted-human-reviewed":
      return "El primer borrador de este artículo se generó con asistencia de inteligencia artificial. Nuestro equipo editorial lo ha reescrito sustancialmente, verificado contra fuentes oficiales y aprobado antes de publicación.";
    case "fully-human":
    default:
      return null;
  }
}

export default function AiDisclosureNote({
  level,
  className,
}: AiDisclosureNoteProps) {
  const text = noteFor(level);
  if (!text) return null;

  return (
    <p
      className={
        "not-prose flex items-start gap-2 font-sans text-[11px] leading-relaxed text-cr-text-muted border-t border-cr-border pt-4 mt-8 " +
        (className ?? "")
      }
      aria-label="Nota de transparencia sobre uso de inteligencia artificial"
    >
      <Sparkles
        size={12}
        aria-hidden="true"
        className="text-cr-primary mt-0.5 shrink-0"
      />
      <span>{text}</span>
    </p>
  );
}
