import { useEffect, useState, useCallback } from "react";
import { Link, useLocation } from "react-router-dom";
import { X } from "lucide-react";
import * as Dialog from "@radix-ui/react-dialog";
import { useSession } from "../lib/session";
import { useI18n } from "@/lib/i18n";

const AUTH_PATHS = new Set(["/login", "/register", "/forgot-password", "/reset-password", "/bienvenida"]);
// Persisted in localStorage (not sessionStorage) so the modal fires at most
// once per browser profile — closing the tab and returning later will not
// re-trigger. Bump the key suffix to force-show again after a copy change.
const STORAGE_KEY = "cr_exit_shown_v2";

/** Convert a URL slug segment into a readable display name.
 *  "mad-cool-festival" → "Mad Cool Festival" */
function slugToDisplayName(slug: string): string {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

/** Derive a contextual modal title from the current pathname. */
function contextualTitle(
  pathname: string,
  t: (key: string, params?: Record<string, string | number>) => string,
): string {
  const segments = pathname.split("/").filter(Boolean);

  if (segments[0] === "festivales" && segments[1]) {
    const festivalName = slugToDisplayName(segments[1]);
    return t("exitModal.titleFestival", { name: festivalName });
  }

  if (segments[0] === "artistas" && segments[1]) {
    const artistName = slugToDisplayName(segments[1]);
    return t("exitModal.titleArtist", { name: artistName });
  }

  if (segments[0] === "rutas") {
    return t("exitModal.titleRoute");
  }

  if (segments[0] === "conciertos" && segments[1]) {
    const cityName = slugToDisplayName(segments[1]);
    return t("exitModal.titleCity", { name: cityName });
  }

  return t("exitModal.titleDefault");
}

export function ExitIntentModal() {
  const { t } = useI18n();
  const { user, loading } = useSession();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  const modalTitle = contextualTitle(location.pathname, t);

  const shouldSuppress =
    loading ||
    !!user ||
    AUTH_PATHS.has(location.pathname);

  const tryShow = useCallback(() => {
    if (shouldSuppress) return;
    if (typeof window === "undefined" || typeof window.localStorage === "undefined") return;
    try {
      if (window.localStorage.getItem(STORAGE_KEY)) return;
      window.localStorage.setItem(STORAGE_KEY, "1");
    } catch {
      // localStorage can throw in private mode / quota — fall through and
      // still show once for this page lifetime to keep the UX intact.
    }
    setOpen(true);
  }, [shouldSuppress]);

  const close = useCallback(() => {
    setOpen(false);
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

  return (
    <Dialog.Root open={open} onOpenChange={(o) => { if (!o) close(); else setOpen(true); }}>
      <Dialog.Portal>
        <Dialog.Overlay
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]"
        />
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none">
          <Dialog.Content
            className="pointer-events-auto relative z-10 w-full max-w-md bg-[#111111] border border-white/10 p-8 shadow-2xl animate-[fadeIn_0.25s_ease-out]"
          >
            {/* Required for a11y — Radix auto-wires aria-labelledby / aria-describedby
                when Title and Description are descendants of Content. */}
            <Dialog.Title className="font-display text-2xl md:text-3xl uppercase leading-[0.95] text-white sr-only">
              {modalTitle}
            </Dialog.Title>
            <Dialog.Description className="sr-only">
              {t("exitModal.description")}
            </Dialog.Description>

            {/* Close button */}
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label={t("exitModal.close")}
                className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
              >
                <X size={18} aria-hidden="true" />
              </button>
            </Dialog.Close>

            {/* Content */}
            <div className="space-y-5 text-center">
              <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.2em] text-[#dbff00]">
                {t("exitModal.wait")}
              </p>

              <h2
                aria-hidden="true"
                className="font-display text-2xl md:text-3xl uppercase leading-[0.95] text-white"
              >
                {modalTitle}
              </h2>

              <div className="flex flex-wrap items-center justify-center gap-2" aria-label={t("exitModal.benefitsLabel")}>
                {[t("exitModal.benefitLimited"), t("exitModal.benefitNoFee"), t("exitModal.benefitFast")].map((label) => (
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
                  {t("exitModal.ctaPrimary")}
                </Link>

                <Dialog.Close asChild>
                  <button
                    type="button"
                    className="flex items-center justify-center w-full font-sans text-sm font-semibold uppercase tracking-[0.12em] text-white/50 hover:text-white/80 border border-white/10 px-6 py-3 transition-colors"
                  >
                    {t("exitModal.ctaSecondary")}
                  </button>
                </Dialog.Close>
              </div>
            </div>
          </Dialog.Content>
        </div>

        <style>{`
          @keyframes fadeIn {
            from { opacity: 0; transform: scale(0.97) translateY(8px); }
            to   { opacity: 1; transform: scale(1) translateY(0); }
          }
        `}</style>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
