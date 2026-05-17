import { useEffect, useRef, useState, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { X } from "lucide-react";
import { useSession } from "../lib/session";

const AUTH_PATHS = new Set(["/login", "/register", "/forgot-password", "/reset-password"]);
const SESSION_KEY = "cr_exit_shown";

// Selectors for all focusable elements inside a container
const FOCUSABLE_SELECTORS = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  '[tabindex]:not([tabindex="-1"])',
].join(", ");

export function ExitIntentModal() {
  const { user, loading } = useSession();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  // Focus trap refs
  const panelRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<Element | null>(null);

  const shouldSuppress =
    loading ||
    !!user ||
    AUTH_PATHS.has(location.pathname);

  const tryShow = useCallback(() => {
    if (shouldSuppress) return;
    if (typeof sessionStorage === "undefined") return;
    if (sessionStorage.getItem(SESSION_KEY)) return;
    sessionStorage.setItem(SESSION_KEY, "1");
    // Remember what was focused before opening the modal
    triggerRef.current = document.activeElement;
    setOpen(true);
  }, [shouldSuppress]);

  const close = useCallback(() => {
    setOpen(false);
    // Return focus to the element that triggered the modal (WCAG 2.4.3)
    if (triggerRef.current && typeof (triggerRef.current as HTMLElement).focus === "function") {
      requestAnimationFrame(() => {
        (triggerRef.current as HTMLElement).focus();
      });
    }
  }, []);

  // Desktop: mouseleave toward top of viewport
  useEffect(() => {
    if (shouldSuppress) return;

    function handleMouseLeave(e: MouseEvent) {
      if (e.clientY <= 0) {
        tryShow();
      }
    }

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [shouldSuppress, tryShow]);

  // Mobile: scroll up after passing 30% of document height
  useEffect(() => {
    if (shouldSuppress) return;

    let lastScrollY = 0;
    let triggered = false;

    function handleScroll() {
      if (triggered) return;
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? scrollY / docHeight : 0;
      const isScrollingUp = scrollY < lastScrollY;
      if (pct > 0.3 && isScrollingUp) {
        triggered = true;
        tryShow();
      }
      lastScrollY = scrollY;
    }

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [shouldSuppress, tryShow]);

  // Escape key + focus trap (Tab / Shift+Tab cycle within modal)
  useEffect(() => {
    if (!open) return;

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        close();
        return;
      }

      if (e.key !== "Tab") return;

      const panel = panelRef.current;
      if (!panel) return;

      const focusable = Array.from(
        panel.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTORS)
      );
      if (focusable.length === 0) return;

      const first = focusable.at(0);
      const last = focusable.at(-1);

      if (!first || !last) return;

      if (e.shiftKey) {
        // Shift+Tab: if focus is on first element, wrap to last
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        // Tab: if focus is on last element, wrap to first
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, close]);

  // Move focus to first interactive element when modal opens
  useEffect(() => {
    if (!open) return;

    const panel = panelRef.current;
    if (!panel) return;

    requestAnimationFrame(() => {
      const first = panel.querySelector<HTMLElement>(FOCUSABLE_SELECTORS);
      first?.focus();
    });
  }, [open]);

  // Lock body scroll while open
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
      aria-labelledby="exit-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
        onClick={close}
        aria-hidden="true"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        className="relative z-10 w-full max-w-md bg-[#111111] border border-white/10 p-8 shadow-2xl animate-[fadeIn_0.25s_ease-out]"
      >
        {/* Close button */}
        <button
          type="button"
          onClick={close}
          aria-label="Cerrar modal"
          className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
        >
          <X size={18} aria-hidden="true" />
        </button>

        {/* Content */}
        <div className="space-y-5 text-center">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-[#dbff00]">
            ¡Espera!
          </p>

          <h2
            id="exit-modal-title"
            className="font-display text-2xl md:text-3xl uppercase leading-[0.95] text-white"
          >
            ¿Te vas sin reservar<br />tu plaza?
          </h2>

          <div className="flex flex-wrap items-center justify-center gap-2" aria-label="Ventajas de ConcertRide">
            {["Plazas limitadas", "0% comisión", "Solo 30 segundos"].map((label) => (
              <span
                key={label}
                className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] border border-[#dbff00]/40 text-[#dbff00] px-2.5 py-1"
              >
                {label}
              </span>
            ))}
          </div>

          <div className="space-y-3 pt-1">
            <Link
              to="/register"
              onClick={close}
              className="flex items-center justify-center w-full bg-[#dbff00] text-black font-sans font-semibold uppercase tracking-[0.12em] text-sm border-2 border-black px-6 py-3.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-100"
            >
              Crear cuenta gratis
            </Link>

            <button
              type="button"
              onClick={close}
              className="flex items-center justify-center w-full font-sans text-sm font-semibold uppercase tracking-[0.12em] text-white/50 hover:text-white/80 border border-white/10 px-6 py-3 transition-colors"
            >
              Seguir viendo
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.97) translateY(8px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
