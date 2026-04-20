import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const DISMISSED_KEY = "cr_cookie_notice_v1";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(DISMISSED_KEY)) setVisible(true);
  }, []);

  if (!visible) return null;

  function dismiss() {
    localStorage.setItem(DISMISSED_KEY, "1");
    setVisible(false);
  }

  return (
    <div
      role="region"
      aria-label="Aviso de cookies"
      className="fixed bottom-0 left-0 right-0 z-[200] bg-cr-surface border-t border-cr-border shadow-[0_-4px_32px_rgba(0,0,0,0.55)]"
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
        <p className="font-sans text-xs text-cr-text-muted flex-1 leading-relaxed">
          Este sitio usa únicamente una cookie de sesión (
          <code className="font-mono text-cr-text text-[11px]">cr_session</code>) estrictamente
          necesaria para el inicio de sesión. No se usan cookies de seguimiento ni publicidad.{" "}
          <Link to="/cookies" className="text-cr-primary underline underline-offset-2 hover:text-cr-primary/80">
            Política de cookies
          </Link>
        </p>
        <button
          type="button"
          onClick={dismiss}
          className="flex-shrink-0 font-sans text-xs font-semibold uppercase tracking-[0.1em] bg-cr-primary text-black px-5 py-2 hover:bg-cr-primary/90 transition-colors"
        >
          Entendido
        </button>
      </div>
    </div>
  );
}
