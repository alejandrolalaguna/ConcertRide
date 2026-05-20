import { Link, type LinkProps } from "react-router-dom";
import { type ReactNode, type AnchorHTMLAttributes } from "react";

/**
 * DescriptiveLink — opt-in helper para enforcement de anchor text descriptivo,
 * alineado con la guía oficial de Google "SEO Starter Guide":
 *   https://developers.google.com/search/docs/fundamentals/seo-starter-guide
 *
 * Recomendación de Google:
 *   "Use appropriate anchor text. Users and search engines should be able to
 *    easily understand what the linked pages contain before they visit them."
 *
 * Reglas que aplica este componente:
 *   1. El `children` debe contener texto descriptivo (no solo "aquí",
 *      "click aquí", "leer más", "ver más", "más info", "more", "here"…).
 *   2. Si el `children` es genérico, se permite proporcionar `ariaLabel`
 *      con contexto adicional (Google también acepta aria-label como señal).
 *   3. En desarrollo, se emite `console.warn` si el texto es genérico y NO
 *      hay `ariaLabel`. En producción se silencia para no romper el build.
 *
 * NOTA: este componente es opt-in. NO se reemplazan los `<Link>` existentes
 * automáticamente. Úsalo SOLO cuando crees un enlace nuevo.
 *
 * Uso:
 *   import { DescriptiveLink } from "@/components/DescriptiveLink";
 *
 *   // OK — anchor descriptivo
 *   <DescriptiveLink to="/festivales/mad-cool">
 *     Mad Cool Festival 2026 (Madrid)
 *   </DescriptiveLink>
 *
 *   // Genérico pero con ariaLabel — también OK
 *   <DescriptiveLink to="/concerts" ariaLabel="Buscar viajes a conciertos">
 *     Ver más
 *   </DescriptiveLink>
 *
 *   // Genérico sin ariaLabel — emite warning en dev
 *   <DescriptiveLink to="/concerts">Aquí</DescriptiveLink>
 */

const GENERIC_ANCHOR_PHRASES = new Set([
  "aquí",
  "click aquí",
  "haz clic",
  "haz clic aquí",
  "pulsa aquí",
  "leer más",
  "ver más",
  "más info",
  "más información",
  "here",
  "click here",
  "more",
  "read more",
  "learn more",
]);

export interface DescriptiveLinkProps
  extends Omit<LinkProps, "children" | "aria-label"> {
  /** Texto descriptivo del enlace (lo que ven usuarios y buscadores). */
  children: ReactNode;
  /**
   * Contexto adicional para lectores de pantalla y motores. Obligatorio si el
   * `children` es genérico ("aquí", "leer más", "ver más", …).
   */
  ariaLabel?: string;
  /** Opciones HTML estándar adicionales para el <a> subyacente. */
  rel?: AnchorHTMLAttributes<HTMLAnchorElement>["rel"];
  target?: AnchorHTMLAttributes<HTMLAnchorElement>["target"];
}

/**
 * Extrae el texto plano del nodo `children` para auditar contra la lista de
 * frases genéricas. Solo evalúa hojas que son `string` o `number` para no
 * recorrer árboles JSX profundos en cada render.
 */
function extractLeafText(node: ReactNode): string {
  if (node == null || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") {
    return String(node);
  }
  if (Array.isArray(node)) {
    return node.map(extractLeafText).join(" ");
  }
  return "";
}

function isGenericText(text: string): boolean {
  const norm = text.trim().toLowerCase();
  if (!norm) return false;
  return GENERIC_ANCHOR_PHRASES.has(norm);
}

export function DescriptiveLink({
  children,
  ariaLabel,
  to,
  ...rest
}: DescriptiveLinkProps) {
  if (typeof window !== "undefined" && import.meta.env?.DEV) {
    const text = extractLeafText(children);
    if (isGenericText(text) && !ariaLabel) {
      // eslint-disable-next-line no-console
      console.warn(
        `[DescriptiveLink] Anchor text "${text.trim()}" es demasiado genérico ` +
          `para el enlace "${String(to)}". Añade un texto descriptivo o un ariaLabel. ` +
          `Ref: https://developers.google.com/search/docs/fundamentals/seo-starter-guide`,
      );
    }
  }

  return (
    <Link to={to} aria-label={ariaLabel} {...rest}>
      {children}
    </Link>
  );
}

export default DescriptiveLink;
