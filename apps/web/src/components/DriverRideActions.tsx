import { useState } from "react";
import { AlertTriangle, Pencil, X } from "lucide-react";
import type { Ride } from "@concertride/types";
import { api } from "@/lib/api";

interface Props {
  ride: Ride;
  onUpdated: (next: Ride) => void;
}

// Inline "Edit + Cancel" card for the driver. Edit is intentionally minimal —
// only fields that commonly change: fecha/precio/plazas/notas. For deeper
// changes the driver can cancel + re-publish (we explicitly stop them from
// changing concert_id or round_trip).
export function DriverRideActions({ ride, onUpdated }: Props) {
  const [editing, setEditing] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  return (
    <section className="border border-cr-border bg-cr-surface p-5 md:p-6 space-y-4">
      <header className="flex items-center justify-between gap-3">
        <h2 className="font-display text-sm uppercase tracking-wide text-cr-text-muted">
          Gestión del viaje
        </h2>
        {!editing && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="inline-flex items-center gap-1.5 font-sans text-[11px] font-semibold uppercase tracking-[0.12em] border-2 border-cr-border text-cr-text hover:border-cr-primary hover:text-cr-primary px-3 py-1.5 transition-colors"
            >
              <Pencil size={11} /> Editar
            </button>
            <button
              type="button"
              disabled={cancelling}
              onClick={async () => {
                if (
                  !confirm(
                    "¿Cancelar el viaje? Se cancelan las reservas pendientes y confirmadas, y se notifica a los pasajeros. Esta acción no se puede deshacer.",
                  )
                ) {
                  return;
                }
                setCancelling(true);
                try {
                  const updated = await api.rides.cancel(ride.id);
                  onUpdated(updated);
                } catch {
                  alert("No se pudo cancelar. Inténtalo de nuevo.");
                } finally {
                  setCancelling(false);
                }
              }}
              className="inline-flex items-center gap-1.5 font-sans text-[11px] font-semibold uppercase tracking-[0.12em] border-2 border-cr-secondary text-cr-secondary hover:bg-cr-secondary hover:text-white px-3 py-1.5 transition-colors disabled:opacity-40"
            >
              <X size={11} /> {cancelling ? "Cancelando…" : "Cancelar viaje"}
            </button>
          </div>
        )}
      </header>

      {editing && <EditForm ride={ride} onUpdated={onUpdated} onClose={() => setEditing(false)} />}

      {!editing && (
        <p className="font-mono text-xs text-cr-text-muted flex items-start gap-2">
          <AlertTriangle size={12} className="mt-0.5 shrink-0" aria-hidden="true" />
          Si editas hora o precio avisaremos a los pasajeros confirmados. No se puede cambiar el
          concierto ni reducir plazas por debajo de las ya publicadas.
        </p>
      )}
    </section>
  );
}

function EditForm({
  ride,
  onUpdated,
  onClose,
}: {
  ride: Ride;
  onUpdated: (next: Ride) => void;
  onClose: () => void;
}) {
  // Build a local form state from the current ride; only the fields we
  // expose for editing.
  const [departureTime, setDepartureTime] = useState(() =>
    toDatetimeLocal(ride.departure_time),
  );
  const [price, setPrice] = useState(ride.price_per_seat);
  const [seats, setSeats] = useState(ride.seats_total);
  const [notes, setNotes] = useState(ride.notes ?? "");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    try {
      const updated = await api.rides.update(ride.id, {
        departure_time: new Date(departureTime).toISOString(),
        price_per_seat: Number(price),
        seats_total: Number(seats),
        notes: notes.trim() || null,
      });
      onUpdated(updated);
      onClose();
    } catch {
      setError("No se pudo guardar. Revisa los valores e inténtalo de nuevo.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <label className="block space-y-1.5">
        <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-cr-text-muted">
          Fecha y hora de salida
        </span>
        <input
          type="datetime-local"
          value={departureTime}
          onChange={(e) => setDepartureTime(e.target.value)}
          required
          className="w-full bg-cr-bg border border-cr-border px-3 py-2 font-mono text-sm text-cr-text focus:outline-none focus:border-cr-primary [color-scheme:dark]"
        />
      </label>

      <div className="grid grid-cols-2 gap-3">
        <label className="space-y-1.5">
          <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-cr-text-muted">
            Precio/asiento (€)
          </span>
          <input
            type="number"
            min="1"
            max="500"
            step="1"
            value={price}
            onChange={(e) => setPrice(Number(e.target.value))}
            required
            className="w-full bg-cr-bg border border-cr-border px-3 py-2 font-mono text-sm text-cr-text focus:outline-none focus:border-cr-primary"
          />
        </label>
        <label className="space-y-1.5">
          <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-cr-text-muted">
            Plazas totales (mín. {ride.seats_total})
          </span>
          <input
            type="number"
            min={ride.seats_total}
            max="8"
            step="1"
            value={seats}
            onChange={(e) => setSeats(Number(e.target.value))}
            required
            className="w-full bg-cr-bg border border-cr-border px-3 py-2 font-mono text-sm text-cr-text focus:outline-none focus:border-cr-primary"
          />
        </label>
      </div>

      <label className="block space-y-1.5">
        <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.12em] text-cr-text-muted">
          Notas
        </span>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value.slice(0, 500))}
          rows={3}
          placeholder="Punto de encuentro, paradas intermedias, etc."
          className="w-full bg-cr-bg border border-cr-border px-3 py-2 font-mono text-xs text-cr-text placeholder:text-cr-text-dim focus:outline-none focus:border-cr-primary resize-none"
        />
      </label>

      {error && (
        <p className="font-mono text-xs text-cr-secondary" role="alert">
          {error}
        </p>
      )}

      <div className="flex justify-end gap-2">
        <button
          type="button"
          onClick={onClose}
          disabled={submitting}
          className="font-sans text-xs font-semibold uppercase tracking-[0.12em] border border-cr-border text-cr-text-muted hover:text-cr-text px-4 py-2 transition-colors disabled:opacity-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="font-sans text-xs font-semibold uppercase tracking-[0.12em] bg-cr-primary text-black px-4 py-2 hover:bg-cr-primary/90 transition-colors disabled:opacity-40 disabled:pointer-events-none"
        >
          {submitting ? "Guardando…" : "Guardar cambios"}
        </button>
      </div>
    </form>
  );
}

// Convert ISO 8601 string into the format `<input type="datetime-local">` wants
// (local time, no timezone suffix, no seconds). Input assumed to be valid ISO.
function toDatetimeLocal(iso: string): string {
  const d = new Date(iso);
  if (isNaN(d.getTime())) return "";
  const pad = (n: number) => n.toString().padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}
