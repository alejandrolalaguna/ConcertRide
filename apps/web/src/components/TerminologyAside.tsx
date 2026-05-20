/**
 * TerminologyAside — semantic vocabulary expansion block.
 *
 * Reusable component that lists the natural-Spanish synonyms for "carpooling"
 * with internal links to the dedicated landing pages. Two goals:
 *
 *  1. Semantic SEO: dense single block of synonyms ("compartir coche",
 *     "viaje compartido", "hacer piña", "ir juntos al festival", "compartir
 *     gastos", "viaje en grupo") helps search engines and LLMs map the
 *     entity to all of its colloquial labels without thin doorway pages.
 *
 *  2. UX/discovery: a single-sentence-style block at the bottom of any
 *     "carpooling"-titled page that nudges Gen Z readers — for whom the
 *     loan-word is less natural — towards the page that speaks their
 *     register.
 *
 * Designed to be dropped into LandingPage, ComoFuncionaCarpoolingPage,
 * MejorCarpoolingFestivales2026Page, and similar entries without code
 * duplication.
 */

import { Link } from "react-router-dom";

type Variant = "default" | "compact";

interface TerminologyAsideProps {
  variant?: Variant;
  /** Override the heading. Defaults to "Otros nombres para lo mismo". */
  title?: string;
}

const SYNONYMS = [
  { label: "Compartir coche al festival", to: "/compartir-coche-festival" },
  { label: "Viaje compartido en coche", to: "/viaje-compartido" },
  { label: "Compartir gastos del coche", to: "/compartir-gastos-festival" },
  { label: "Viaje en grupo al festival", to: "/viaje-en-grupo-festival" },
  { label: "Ir juntos al festival", to: "/ir-juntos-al-festival" },
  { label: "Hacer piña en el festival", to: "/hacer-pina-festival" },
  { label: "Coche compartido para conciertos", to: "/coche-compartido-conciertos" },
] as const;

export function TerminologyAside({
  variant = "default",
  title = "Otros nombres para lo mismo",
}: TerminologyAsideProps) {
  if (variant === "compact") {
    return (
      <aside
        aria-label="Vocabulario relacionado"
        className="border-l-2 border-cr-primary bg-white/[0.02] px-5 py-3 my-6"
      >
        <p className="font-sans text-xs md:text-sm text-cr-text/80 leading-relaxed">
          <span className="font-mono uppercase tracking-[0.14em] text-cr-primary">
            También llamado:
          </span>{" "}
          {SYNONYMS.map((s, i) => (
            <span key={s.to}>
              <Link to={s.to} className="text-cr-text/85 hover:text-cr-primary underline-offset-2 hover:underline">
                {s.label.toLowerCase()}
              </Link>
              {i < SYNONYMS.length - 1 ? " · " : "."}
            </span>
          ))}
        </p>
      </aside>
    );
  }

  return (
    <section
      aria-labelledby="terminology-aside-title"
      className="mx-auto max-w-4xl px-4 md:px-6 py-8"
    >
      <aside className="border border-cr-border bg-white/[0.02] p-5 md:p-6">
        <h2
          id="terminology-aside-title"
          className="font-display text-lg md:text-xl uppercase tracking-[0.04em]"
        >
          {title}
        </h2>
        <p className="mt-3 font-sans text-sm md:text-base text-cr-text/85 leading-relaxed">
          A esto le llamamos &ldquo;carpooling&rdquo; por costumbre, pero el plan tiene varios
          nombres en castellano según con quién hables. Todos describen lo mismo: gente que va al
          mismo festival comparte coche, divide el gasto real del viaje y coordina la vuelta.
        </p>
        <ul className="mt-4 grid gap-2 md:grid-cols-2">
          {SYNONYMS.map((s) => (
            <li key={s.to}>
              <Link
                to={s.to}
                className="group flex items-center gap-2 font-sans text-sm text-cr-text/85 hover:text-cr-primary transition-colors"
              >
                <span aria-hidden="true" className="text-cr-primary">·</span>
                <span className="underline-offset-2 group-hover:underline">{s.label}</span>
              </Link>
            </li>
          ))}
        </ul>
        <p className="mt-4 font-mono text-[10px] uppercase tracking-[0.16em] text-cr-text/50">
          Mismo producto en ConcertRide · vocabulario distinto según la edad y la zona.
        </p>
      </aside>
    </section>
  );
}
