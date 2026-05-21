import { Link } from "react-router-dom";

/**
 * AgentActionRail — DOM-stable primary actions, accessibility-tree friendly.
 *
 * Google I/O 2026 announced agentic booking expansion (Search now completes
 * tasks across local services). web.dev published "agent-friendly website
 * best practices" telling devs that AI agents reach pages via three routes:
 *   1. visual rendering with screenshots,
 *   2. DOM analysis,
 *   3. interpretation of the accessibility tree.
 *
 * This component encodes the page's primary actions in a way that scores well
 * on all three:
 *   - <nav role="navigation"> with descriptive aria-label = clear in the a11y tree
 *   - Each action is a real <a> or <button> with explicit text label (not icon-only)
 *   - data-agent-action and data-intent attributes give DOM-scrapers an unambiguous
 *     handle without relying on selector heuristics
 *   - keyboard-navigable by default (real anchors / buttons, no div+onClick)
 *
 * Treat it as the "what can be done here" map for both humans skimming and
 * agents acting.
 */

export type AgentIntent =
  | "search-ride"
  | "publish-ride"
  | "view-festival"
  | "view-route"
  | "contact-driver"
  | "view-pricing"
  | "view-faq"
  | "book-ride"
  | "view-driver"
  | "view-concert"
  | "buy-ticket";

interface AgentAction {
  /** Visible text. Should be a verb phrase: "Buscar viajes", "Publicar viaje". */
  label: string;
  /** Target href OR onClick handler — never both. */
  href: string;
  /** Semantic intent (machine label). Stable across visual redesigns. */
  intent: AgentIntent;
  /** Optional accessible description, in case the visible text is ambiguous. */
  description?: string;
  /** Visual treatment. "primary" for the booking-equivalent action. */
  variant?: "primary" | "secondary";
}

interface AgentActionRailProps {
  /** Context label, e.g. "Acciones disponibles en esta página". */
  ariaLabel: string;
  actions: AgentAction[];
}

export function AgentActionRail({ ariaLabel, actions }: AgentActionRailProps) {
  if (actions.length === 0) return null;
  return (
    <nav
      role="navigation"
      aria-label={ariaLabel}
      data-agent-action-rail
      className="my-6 flex flex-wrap items-center gap-3"
    >
      {actions.map((a) => {
        const base =
          "inline-flex items-center gap-2 font-display uppercase tracking-tight px-5 py-2.5 transition-colors min-h-[44px]";
        const primary =
          "bg-cr-primary text-cr-bg hover:bg-cr-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-cr-primary";
        const secondary =
          "border border-cr-primary text-cr-primary hover:bg-cr-primary hover:text-cr-bg focus-visible:outline focus-visible:outline-2 focus-visible:outline-cr-primary";
        const className = `${base} ${a.variant === "primary" ? primary : secondary}`;
        const isExternal = /^https?:/i.test(a.href);
        const isAnchor = a.href.startsWith("#");
        if (isExternal || isAnchor) {
          return (
            <a
              key={a.intent + a.href}
              href={a.href}
              data-agent-action={a.intent}
              data-intent={a.intent}
              aria-label={a.description ?? a.label}
              className={className}
              rel="noopener"
            >
              {a.label}
            </a>
          );
        }
        return (
          <Link
            key={a.intent + a.href}
            to={a.href}
            data-agent-action={a.intent}
            data-intent={a.intent}
            aria-label={a.description ?? a.label}
            className={className}
          >
            {a.label}
          </Link>
        );
      })}
    </nav>
  );
}
