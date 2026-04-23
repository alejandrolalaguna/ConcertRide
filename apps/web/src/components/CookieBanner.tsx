import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { grantAnalyticsConsent, revokeAnalyticsConsent } from "@/lib/observability";

const DISMISSED_KEY = "cr_cookie_notice_v1";

type Choice = "accept_all" | "essential";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!localStorage.getItem(DISMISSED_KEY)) setVisible(true);
  }, []);

  if (!visible) return null;

  function dismiss(choice: Choice) {
    localStorage.setItem(DISMISSED_KEY, choice);
    if (choice === "accept_all") grantAnalyticsConsent();
    else revokeAnalyticsConsent();
    setVisible(false);
  }

  return (
    <div
      role="region"
      aria-label="Aviso de cookies"
      className="fixed bottom-0 left-0 right-0 z-[200] bg-cr-surface border-t border-cr-border shadow-[0_-4px_32px_rgba(0,0,0,0.55)]"
    >
      <div className="max-w-6xl mx-auto px-4 py-3 flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-6">
        <p className="font-sans text-xs text-cr-text-muted flex-1 leading-relaxed">
          Usamos una cookie de sesión (
          <code className="font-mono text-cr-text text-[11px]">cr_session</code>) estrictamente
          necesaria. Opcionalmente, podemos usar analítica anónima alojada en Europa
          (PostHog EU) para entender cómo mejorar el producto. Nunca publicidad.{" "}
          <Link to="/cookies" className="text-cr-primary underline underline-offset-2 hover:text-cr-primary/80">
            Política de cookies
          </Link>
        </p>
        <div className="flex-shrink-0 flex items-center gap-2">
          <button
            type="button"
            onClick={() => dismiss("essential")}
            className="font-sans text-xs font-semibold uppercase tracking-[0.1em] text-cr-text-muted hover:text-cr-text border border-cr-border px-3 py-2 transition-colors"
          >
            Solo esenciales
          </button>
          <button
            type="button"
            onClick={() => dismiss("accept_all")}
            className="font-sans text-xs font-semibold uppercase tracking-[0.1em] bg-cr-primary text-black px-5 py-2 hover:bg-cr-primary/90 transition-colors"
          >
            Aceptar todo
          </button>
        </div>
      </div>
    </div>
  );
}
