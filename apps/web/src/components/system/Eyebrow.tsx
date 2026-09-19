import type { ReactNode } from "react";

/** Etiqueta de sección: filete lima de 16 px + Inter 700 mayúsculas. */
export function Eyebrow({ children, className = "", as: Tag = "p" }: { children: ReactNode; className?: string; as?: "p" | "span" | "div" }) {
  return <Tag className={`cr-eyebrow ${className}`}>{children}</Tag>;
}
