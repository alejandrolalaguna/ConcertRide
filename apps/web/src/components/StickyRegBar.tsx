import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { X } from "lucide-react";
import { useSession } from "../lib/session";

const DISMISS_KEY = "cr_sticky_dismissed";

export function StickyRegBar() {
  const { user, loading } = useSession();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Guard: only for anonymous users
    if (loading || user) return;

    // Check dismiss flag
    if (typeof sessionStorage !== "undefined" && sessionStorage.getItem(DISMISS_KEY)) return;

    // Delay 3 seconds before showing
    const timer = setTimeout(() => {
      setVisible(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, [loading, user]);

  function dismiss() {
    setVisible(false);
    if (typeof sessionStorage !== "undefined") {
      sessionStorage.setItem(DISMISS_KEY, "1");
    }
  }

  if (!visible) return null;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#111111] border-t border-white/10"
      role="complementary"
      aria-label="Registro requerido para reservar"
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        {/* Message */}
        <p className="font-sans text-xs sm:text-sm text-white/80 flex items-center gap-1.5 min-w-0 truncate">
          <span aria-hidden="true">🎫</span>
          <span>Regístrate para reservar tu plaza · 0% comisión</span>
        </p>

        <div className="flex items-center gap-2 shrink-0">
          <Link
            to="/register"
            className="inline-flex items-center justify-center bg-[#dbff00] text-black font-sans font-semibold uppercase tracking-[0.1em] text-xs border-2 border-black px-4 py-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-100 whitespace-nowrap"
          >
            Crear cuenta
          </Link>

          <button
            type="button"
            onClick={dismiss}
            aria-label="Cerrar barra de registro"
            className="text-white/40 hover:text-white/80 transition-colors p-1"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>
      </div>
    </div>
  );
}
