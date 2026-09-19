import type { ReactNode } from "react";
import { Eyebrow } from "./Eyebrow";

interface Props {
  id: string;
  eyebrow?: ReactNode;
  title: ReactNode;
  /** Acción o dato alineado a la base del título, a la derecha. */
  aside?: ReactNode;
  /** Párrafo de apoyo bajo el título (máx. 65ch). */
  lede?: ReactNode;
  /** Nivel del heading. Por defecto h2. */
  as?: "h1" | "h2" | "h3";
  size?: "xl" | "l" | "m";
  className?: string;
  /** Atributo data-scan para la máscara por palabra (sólo Nivel A). */
  scan?: "words" | "entrance";
}

/**
 * Cabecera de sección asimétrica: eyebrow + heading + acción a la derecha.
 * El heading es un elemento real (h1/h2/h3) con el texto completo en el DOM.
 */
export function SectionHead({ id, eyebrow, title, aside, lede, as: Tag = "h2", size = "m", className = "", scan }: Props) {
  const sizeCls = size === "xl" ? "text-display-xl" : size === "l" ? "text-display-l" : "text-display-m";
  return (
    <header className={`flex flex-col gap-4 ${className}`}>
      {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-10">
        <Tag id={id} className={`font-display ${sizeCls} max-w-[18ch]`} data-scan={scan}>
          {title}
        </Tag>
        {aside && <div className="flex-shrink-0 md:pb-1">{aside}</div>}
      </div>
      {lede && <p className="cr-prose text-lead text-cr-text-muted">{lede}</p>}
    </header>
  );
}
