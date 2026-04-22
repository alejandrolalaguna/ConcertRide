import { useEffect, useState } from "react";
import { motion } from "motion/react";
import { Check, X } from "lucide-react";
import type { PaymentMethod, RequestStatus, Ride, RideRequest } from "@concertride/types";
import { api, ApiError } from "@/lib/api";
import { formatTime } from "@/lib/format";
import { TrustBadge } from "./TrustBadge";
import { PulsingDot } from "./LoadingStates";

const PAYMENT_LABEL: Record<PaymentMethod, string> = {
  cash: "💵 Efectivo",
  bizum: "📱 Bizum",
  cash_or_bizum: "Efectivo / Bizum",
};

const STATUS_LABEL: Record<RequestStatus, string> = {
  pending: "Pendiente",
  confirmed: "Confirmado",
  rejected: "Rechazado",
  cancelled: "Cancelado",
};

const STATUS_STYLES: Record<RequestStatus, string> = {
  pending: "bg-cr-surface-2 text-cr-text-muted border border-cr-border",
  confirmed: "bg-cr-primary text-black",
  rejected: "bg-cr-secondary/20 text-cr-secondary border border-cr-secondary/40",
  cancelled: "bg-cr-surface-2 text-cr-text-dim border border-cr-border",
};

interface Props {
  ride: Ride;
  onRequestUpdated?: (ride: Ride) => void;
}

export function DriverInbox({ ride, onRequestUpdated }: Props) {
  const [requests, setRequests] = useState<RideRequest[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    let active = true;
    api.rides
      .listRequests(ride.id)
      .then((res) => {
        if (active) setRequests(res.requests);
      })
      .catch((err: unknown) => {
        if (!active) return;
        setError(err instanceof ApiError ? err.message : "No se pudieron cargar las solicitudes");
      });
    return () => {
      active = false;
    };
  }, [ride.id]);

  async function patch(reqId: string, status: RequestStatus) {
    setBusy(reqId);
    try {
      const updated = await api.rides.updateRequest(ride.id, reqId, status);
      setRequests((prev) => (prev ? prev.map((r) => (r.id === reqId ? updated : r)) : prev));
      if (status === "confirmed" && onRequestUpdated) {
        const fresh = await api.rides.get(ride.id);
        onRequestUpdated(fresh);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo actualizar");
    } finally {
      setBusy(null);
    }
  }

  const pending = requests?.filter((r) => r.status === "pending") ?? [];
  const resolved = requests?.filter((r) => r.status !== "pending") ?? [];

  return (
    <section
      aria-labelledby="inbox-title"
      className="bg-cr-surface border border-cr-border p-6 md:p-8 space-y-5"
    >
      <header className="flex items-baseline justify-between gap-4">
        <h2 id="inbox-title" className="font-display text-lg uppercase tracking-wide">
          Solicitudes
        </h2>
        <p className="font-mono text-xs text-cr-text-muted">
          {requests ? `${pending.length} pendiente${pending.length === 1 ? "" : "s"}` : "…"}
        </p>
      </header>

      {error && (
        <p className="font-mono text-xs text-cr-secondary" role="alert">
          {error}
        </p>
      )}

      {!requests && <PulsingDot label="Cargando solicitudes" />}

      {requests && requests.length === 0 && (
        <p className="font-mono text-xs text-cr-text-dim">
          Aún nadie ha solicitado asiento. Se listará aquí cuando lleguen.
        </p>
      )}

      {pending.length > 0 && (
        <ul className="space-y-3">
          {pending.map((req) => (
            <motion.li
              key={req.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className="border border-cr-border p-4 space-y-3"
            >
              <div className="flex items-start justify-between gap-4">
                <TrustBadge user={req.passenger} compact />
                <span className="font-mono text-xs text-cr-primary whitespace-nowrap">
                  {req.seats} plaza{req.seats === 1 ? "" : "s"}
                </span>
              </div>
              {req.message && (
                <p className="font-sans text-sm text-cr-text-muted leading-relaxed italic">
                  "{req.message}"
                </p>
              )}
              <div className="flex items-center justify-between gap-3 pt-1 border-t border-dashed border-cr-border">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[11px] text-cr-text-dim">
                    {formatTime(req.created_at)}
                  </span>
                  {req.payment_method && (
                    <span className="font-mono text-[11px] text-cr-text-muted">
                      {PAYMENT_LABEL[req.payment_method]}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={busy === req.id}
                    onClick={() => patch(req.id, "rejected")}
                    className="inline-flex items-center gap-1.5 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-cr-text-muted hover:text-cr-secondary border border-cr-border hover:border-cr-secondary px-3 py-2 transition-colors disabled:opacity-50"
                  >
                    <X size={12} aria-hidden="true" /> Rechazar
                  </button>
                  <button
                    type="button"
                    disabled={busy === req.id}
                    onClick={() => patch(req.id, "confirmed")}
                    className="inline-flex items-center gap-1.5 bg-cr-primary text-black font-sans text-xs font-semibold uppercase tracking-[0.12em] border-2 border-black px-3 py-2 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-100 disabled:opacity-50"
                  >
                    <Check size={12} aria-hidden="true" /> Aceptar
                  </button>
                </div>
              </div>
            </motion.li>
          ))}
        </ul>
      )}

      {resolved.length > 0 && (
        <details className="pt-3 border-t border-dashed border-cr-border">
          <summary className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-cr-text-muted cursor-pointer hover:text-cr-text">
            Resueltas ({resolved.length})
          </summary>
          <ul className="space-y-2 mt-3">
            {resolved.map((req) => (
              <li
                key={req.id}
                className="flex items-center justify-between gap-3 py-2"
              >
                <TrustBadge user={req.passenger} compact />
                <span
                  className={`font-sans text-[10px] font-semibold uppercase tracking-[0.12em] px-2 py-1 ${STATUS_STYLES[req.status]}`}
                >
                  {STATUS_LABEL[req.status]}
                </span>
              </li>
            ))}
          </ul>
        </details>
      )}
    </section>
  );
}
