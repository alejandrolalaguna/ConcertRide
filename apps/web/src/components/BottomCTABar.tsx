import { Link } from "react-router-dom";

type Props = {
  label: string;
  sublabel?: string;
  onClick?: () => void;
  to?: string;
  disabled?: boolean;
  variant?: "primary" | "secondary";
};

/**
 * Sticky-bottom CTA bar — mobile only (md:hidden).
 *
 * Brutal Festival-First: 2px lime top border, dark surface w/ backdrop blur,
 * safe-area bottom padding for iOS home indicator.
 *
 * Surfaces a contextual primary action on long pages (e.g. "Reservar plaza"
 * on a ride detail).
 *
 * - `to` → renders as <Link>
 * - `onClick` (without `to`) → renders as <button>
 * - `variant: "primary"` → lime CTA
 * - `variant: "secondary"` → orange CTA
 *
 * NOTE: Component creates a fixed element at the viewport bottom. Pages that
 * adopt it should add bottom-padding (e.g. `pb-24 md:pb-0`) to their main
 * content so the last content row isn't hidden under the bar.
 */
export default function BottomCTABar({
  label,
  sublabel,
  onClick,
  to,
  disabled = false,
  variant = "primary",
}: Props) {
  const innerClass =
    variant === "primary"
      ? "cr-btn-primary w-full flex items-center justify-center gap-2 py-3"
      : "border-2 border-cr-secondary bg-cr-secondary text-black w-full flex items-center justify-center gap-2 py-3 font-display uppercase tracking-wide";

  const disabledCls = disabled ? " opacity-50 pointer-events-none" : "";

  const content = (
    <>
      <span>{label}</span>
      {sublabel && (
        <span className="text-[11px] font-mono opacity-70">· {sublabel}</span>
      )}
    </>
  );

  return (
    <div
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-cr-bg/95 backdrop-blur border-t-2 border-cr-primary px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
      role="region"
      aria-label="Acción principal"
    >
      {to ? (
        <Link
          to={to}
          onClick={onClick}
          aria-disabled={disabled || undefined}
          className={innerClass + disabledCls}
        >
          {content}
        </Link>
      ) : (
        <button
          type="button"
          onClick={onClick}
          disabled={disabled}
          className={
            innerClass + " disabled:opacity-50 disabled:pointer-events-none"
          }
        >
          {content}
        </button>
      )}
    </div>
  );
}
