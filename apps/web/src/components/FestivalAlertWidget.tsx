import { useState } from "react";
import { Bell } from "lucide-react";
import { api } from "@/lib/api";
import { trackAlertSubscribe } from "@/lib/seoEvents";

interface Props {
  festivalSlug: string;
  festivalName: string;
}

type State = "idle" | "loading" | "done" | "error" | "duplicate";

export function FestivalAlertWidget({ festivalSlug, festivalName }: Props) {
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
        <p className="font-display text-base uppercase text-cr-primary">¡Listo!</p>
        <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
          Te avisaremos en <span className="text-cr-text">{email}</span> cuando aparezcan
          viajes compartidos a {festivalName}.
        </p>
      </div>
    );
  }

  if (state === "duplicate") {
    return (
      <div className="border border-cr-border p-5 space-y-1">
        <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
          Este email ya está suscrito a alertas de {festivalName}.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-cr-border p-5 space-y-4">
      <div className="flex items-start gap-3">
        <Bell size={16} className="text-cr-primary mt-0.5 shrink-0" />
        <div className="space-y-1">
          <p className="font-display text-base uppercase">Avísame cuando haya viajes</p>
          <p className="font-sans text-xs text-cr-text-muted leading-relaxed">
            Recibe un email cuando alguien publique un viaje compartido a {festivalName}.
            Sin spam — solo una notificación por festival.
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
          {state === "loading" ? "…" : "Activar alerta"}
        </button>
      </form>

      {state === "error" && (
        <p className="font-mono text-[11px] text-cr-secondary">
          Error al guardar. Inténtalo de nuevo.
        </p>
      )}

      <p className="font-mono text-[10px] text-cr-text-dim leading-relaxed">
        Al suscribirte aceptas recibir un email de ConcertRide.
        Puedes cancelar en cualquier momento.{" "}
        <a href="/privacidad" className="underline underline-offset-2 hover:text-cr-primary transition-colors">
          Privacidad
        </a>
        .
      </p>
    </div>
  );
}
