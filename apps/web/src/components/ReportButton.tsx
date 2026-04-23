import { useState } from "react";
import { Flag, X } from "lucide-react";
import type { ReportReason } from "@concertride/types";
import { api, ApiError } from "@/lib/api";
import { useSession } from "@/lib/session";
import { useNavigate } from "react-router-dom";

const REASONS: { value: ReportReason; label: string }[] = [
  { value: "scam", label: "Estafa / fraude" },
  { value: "harassment", label: "Acoso o comportamiento abusivo" },
  { value: "no_show", label: "No se presentó al viaje" },
  { value: "unsafe", label: "Conducción peligrosa o inseguridad" },
  { value: "spam", label: "Spam / contenido no deseado" },
  { value: "other", label: "Otro motivo" },
];

interface Props {
  targetUserId?: string;
  rideId?: string;
  // How the trigger looks — "inline" = small link, "pill" = bordered pill button.
  variant?: "inline" | "pill";
  className?: string;
}

export function ReportButton({ targetUserId, rideId, variant = "inline", className = "" }: Props) {
  const { user } = useSession();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<ReportReason | "">("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleOpen(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      navigate(`/login?next=${encodeURIComponent(window.location.pathname)}`);
      return;
    }
    setOpen(true);
  }

  function reset() {
    setOpen(false);
    setReason("");
    setBody("");
    setDone(false);
    setError(null);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (!reason) return;
    setSubmitting(true);
    setError(null);
    try {
      await api.reports.create({
        target_user_id: targetUserId,
        ride_id: rideId,
        reason,
        body: body.trim() || undefined,
      });
      setDone(true);
    } catch (err) {
      if (err instanceof ApiError && err.status === 429) {
        setError("Has enviado demasiados reportes hoy. Vuelve mañana.");
      } else {
        setError("No se pudo enviar el reporte. Inténtalo de nuevo.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  const trigger =
    variant === "pill" ? (
      <button
        type="button"
        onClick={handleOpen}
        className={`inline-flex items-center gap-1.5 font-sans text-[11px] font-semibold uppercase tracking-[0.12em] border border-cr-border text-cr-text-muted hover:border-cr-secondary hover:text-cr-secondary px-3 py-1.5 transition-colors ${className}`}
      >
        <Flag size={11} /> Reportar
      </button>
    ) : (
      <button
        type="button"
        onClick={handleOpen}
        className={`inline-flex items-center gap-1 font-sans text-[11px] text-cr-text-dim hover:text-cr-secondary transition-colors ${className}`}
      >
        <Flag size={10} /> Reportar
      </button>
    );

  return (
    <>
      {trigger}
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="report-title"
          className="fixed inset-0 z-[300] flex items-center justify-center bg-black/70 px-4"
          onClick={reset}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-cr-surface border border-cr-border max-w-md w-full p-6 space-y-5 relative"
          >
            <button
              type="button"
              onClick={reset}
              className="absolute top-3 right-3 text-cr-text-muted hover:text-cr-text transition-colors"
              aria-label="Cerrar"
            >
              <X size={18} />
            </button>
            <h2 id="report-title" className="font-display text-lg uppercase tracking-wide text-cr-text flex items-center gap-2">
              <Flag size={14} className="text-cr-secondary" /> Reportar
            </h2>

            {done ? (
              <div className="space-y-3">
                <p className="font-sans text-sm text-cr-text">
                  Gracias. Hemos recibido tu reporte y lo revisaremos.
                </p>
                <button
                  type="button"
                  onClick={reset}
                  className="w-full font-sans text-xs font-semibold uppercase tracking-[0.12em] bg-cr-primary text-black px-4 py-2"
                >
                  Cerrar
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <div className="space-y-2">
                  <label className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-cr-text-muted">
                    Motivo
                  </label>
                  <div className="space-y-1.5">
                    {REASONS.map((r) => (
                      <label
                        key={r.value}
                        className={`flex items-center gap-2 px-3 py-2 border cursor-pointer transition-colors ${
                          reason === r.value
                            ? "border-cr-secondary bg-cr-secondary/10"
                            : "border-cr-border hover:border-cr-text-muted"
                        }`}
                      >
                        <input
                          type="radio"
                          name="reason"
                          value={r.value}
                          checked={reason === r.value}
                          onChange={() => setReason(r.value)}
                          className="accent-cr-secondary"
                        />
                        <span className="font-sans text-sm text-cr-text">{r.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <label className="block space-y-2">
                  <span className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-cr-text-muted">
                    Detalle (opcional)
                  </span>
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value.slice(0, 2000))}
                    placeholder="Cuéntanos qué pasó…"
                    rows={4}
                    className="w-full bg-cr-bg border border-cr-border px-3 py-2 font-mono text-xs text-cr-text placeholder:text-cr-text-dim focus:outline-none focus:border-cr-secondary transition-colors resize-none"
                  />
                </label>

                {error && (
                  <p className="font-mono text-xs text-cr-secondary" role="alert">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={submitting || !reason}
                  className="w-full font-sans text-xs font-semibold uppercase tracking-[0.12em] bg-cr-secondary text-white px-4 py-3 hover:bg-cr-secondary/90 transition-colors disabled:opacity-40 disabled:pointer-events-none"
                >
                  {submitting ? "Enviando…" : "Enviar reporte"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
