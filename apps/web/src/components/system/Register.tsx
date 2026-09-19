import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

/**
 * Registro de 12 columnas: la alternativa a la tarjeta para todo lo que no
 * tiene imagen. Filas separadas por un filete de 1 px; la jerarquía la hace el
 * tamaño del texto, no una caja. Hover: fondo y empujón de 12 px del título.
 *
 * Patrón C4 del banco de movimiento. Sin JS.
 */
export function Register({
  children,
  className = "",
  as: Tag = "div",
  ...rest
}: {
  children: ReactNode;
  className?: string;
  as?: "div" | "ol" | "ul";
} & Record<string, unknown>) {
  return (
    <Tag className={`cr-register ${className}`} {...rest}>
      {children}
    </Tag>
  );
}

interface RowProps {
  /** Número o clave de la fila (01, 02…). Opcional. */
  n?: ReactNode;
  title: ReactNode;
  /** Texto de apoyo en su propia columna. */
  description?: ReactNode;
  /** Meta corta bajo el título (fecha, ciudad, km…). */
  meta?: ReactNode;
  /** Acción a la derecha. Si hay `to`/`href`, se pinta una flecha por defecto. */
  action?: ReactNode;
  to?: string;
  href?: string;
  /** Nivel del título. Por defecto h3. */
  as?: "h3" | "h4" | "p" | "span";
  className?: string;
  /** Atributo data-scan (p.ej. "light") para Nivel A. */
  scan?: string;
  onClick?: () => void;
  ariaLabel?: string;
}

export function RegisterRow({ n, title, description, meta, action, to, href, as: Tag = "h3", className = "", scan, onClick, ariaLabel }: RowProps) {
  const isLink = Boolean(to || href);
  const inner = (
    <>
      {n !== undefined && (
        <span className="cr-register__n cr-label text-cr-text-muted">{n}</span>
      )}
      <div className="cr-register__title min-w-0">
        <Tag className="font-display text-display-s text-cr-text">{title}</Tag>
        {meta && <p className="cr-label text-cr-text-muted mt-2">{meta}</p>}
      </div>
      {description && (
        <p className="cr-register__desc text-sm leading-relaxed text-cr-text-muted max-w-[46ch]">{description}</p>
      )}
      <div className="cr-register__action flex items-center gap-2 text-cr-text">
        {action ?? (isLink ? <ArrowRight size={18} aria-hidden="true" /> : null)}
      </div>
    </>
  );

  const cls = `cr-register__row group ${className}`;

  if (to) {
    return (
      <Link to={to} className={cls} onClick={onClick} data-scan={scan} aria-label={ariaLabel}>
        {inner}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={cls} onClick={onClick} data-scan={scan} aria-label={ariaLabel}>
        {inner}
      </a>
    );
  }
  return (
    <div className={cls} data-scan={scan}>
      {inner}
    </div>
  );
}
