import { useState } from "react";
import { Bell } from "lucide-react";
import { api } from "@/lib/api";
import { trackAlertSubscribe } from "@/lib/seoEvents";
import { useI18n } from "@/lib/i18n";

interface Props {
  festivalSlug: string;
  festivalName: string;
}

type State = "idle" | "loading" | "done" | "error" | "duplicate";

export function FestivalAlertWidget({ festivalSlug, festivalName }: Props) {
  const { locale } = useI18n();
  const isEn = locale === "en";
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setState("loading");
    try {
      const res = await api.alerts.subscribeFestival(email.trim(), festivalSlug);
      if (!res.created) {
        setState("duplicate");
      } else {
        setState("done");
        trackAlertSubscribe(festivalSlug);
      }
    } catch {
      setState("error");
    }
  }

  if (state === "done") {
    return (
      <div className="border border-cr-primary/40 bg-cr-primary/5 p-5 space-y-1">
        <p className="font-display text-base uppercase text-cr-primary">{isEn ? "Done!" : "¡Listo!"}</p>
        <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
          {isEn ? (
            <>We'll notify you at <span className="text-cr-text">{email}</span> when shared rides to {festivalName} appear.</>
          ) : (
            <>Te avisaremos en <span className="text-cr-text">{email}</span> cuando aparezcan
            viajes compartidos a {festivalName}.</>
          )}
        </p>
      </div>
    );
  }

  if (state === "duplicate") {
    return (
      <div className="border border-cr-border p-5 space-y-1">
        <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
          {isEn
            ? <>This email is already subscribed to {festivalName} alerts.</>
            : <>Este email ya está suscrito a alertas de {festivalName}.</>}
        </p>
      </div>
    );
  }

  return (
    <div className="border border-cr-border p-5 space-y-4">
      <div className="flex items-start gap-3">
        <Bell size={16} className="text-cr-primary mt-0.5 shrink-0" />
        <div className="space-y-1">
          <p className="font-display text-base uppercase">{isEn ? "Notify me of rides" : "Avísame cuando haya viajes"}</p>
          <p className="font-sans text-xs text-cr-text-muted leading-relaxed">
            {isEn ? (
              <>Get an email when someone posts a shared ride to {festivalName}.
              No spam — just one notification per festival.</>
            ) : (
              <>Recibe un email cuando alguien publique un viaje compartido a {festivalName}.
              Sin spam — solo una notificación por festival.</>
            )}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2 flex-wrap">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          className="flex-1 min-w-0 bg-cr-bg border border-cr-border px-3 py-2 font-mono text-xs text-cr-text placeholder:text-cr-text-dim focus:outline-none focus:border-cr-primary/60 transition-colors"
          disabled={state === "loading"}
        />
        <button
          type="submit"
          disabled={state === "loading" || !email.trim()}
          className="font-sans text-xs font-semibold uppercase tracking-[0.12em] border-2 border-cr-primary text-cr-primary px-4 py-2 hover:bg-cr-primary hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {state === "loading" ? "…" : (isEn ? "Activate alert" : "Activar alerta")}
        </button>
      </form>

      {state === "error" && (
        <p className="font-mono text-[11px] text-cr-secondary">
          {isEn ? "Error saving. Please try again." : "Error al guardar. Inténtalo de nuevo."}
        </p>
      )}

      <p className="font-mono text-[10px] text-cr-text-dim leading-relaxed">
        {isEn
          ? "By subscribing you agree to receive an email from ConcertRide. You can unsubscribe at any time."
          : "Al suscribirte aceptas recibir un email de ConcertRide. Puedes cancelar en cualquier momento."}{" "}
        <a href="/privacidad" className="underline underline-offset-2 hover:text-cr-primary transition-colors">
          {isEn ? "Privacy" : "Privacidad"}
        </a>
        .
      </p>
    </div>
  );
}
