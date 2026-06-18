import { Bus, Train, Car, Zap } from "lucide-react";
import type { TransportOption } from "@/lib/festivalLandings";

interface Props {
  options: TransportOption[];
  officialShuttle?: {
    available: boolean;
    price_from?: number;
    booking_url?: string;
    pickup_points?: string[];
    notes?: string;
    notes_en?: string;
  };
  festivalName: string;
  /** Render English chrome + the *_en data fields. Defaults to Spanish so every
   *  existing (ES) caller stays byte-identical. */
  isEn?: boolean;
}

const TYPE_CONFIG = {
  bus: { label: "Bus", label_en: "Bus", Icon: Bus, color: "text-blue-400", bg: "bg-blue-400/10" },
  train: { label: "Tren", label_en: "Train", Icon: Train, color: "text-green-400", bg: "bg-green-400/10" },
  shuttle: { label: "Lanzadera", label_en: "Shuttle", Icon: Zap, color: "text-yellow-400", bg: "bg-yellow-400/10" },
  carpooling: { label: "Carpooling", label_en: "Carpooling", Icon: Car, color: "text-cr-primary", bg: "bg-cr-primary/10" },
} as const;

function priceLabel(opt: TransportOption, isEn: boolean): string {
  if (opt.price_from === 0) return isEn ? "Free" : "Gratis";
  if (opt.price_to) return `${opt.price_from}–${opt.price_to} €`;
  return isEn ? `From ${opt.price_from} €` : `Desde ${opt.price_from} €`;
}

function scheduleLabel(opt: TransportOption, isEn: boolean): string {
  if (isEn) return opt.schedule_en ?? opt.frequency_en ?? opt.schedule ?? opt.frequency ?? "—";
  return opt.schedule ?? opt.frequency ?? "—";
}

export function TransportTable({ options, officialShuttle, festivalName, isEn = false }: Props) {
  // Group by type, carpooling always last
  const order: TransportOption["type"][] = ["shuttle", "bus", "train", "carpooling"];
  const grouped = order
    .map((t) => ({ type: t, items: options.filter((o) => o.type === t) }))
    .filter((g) => g.items.length > 0);

  const reviewed = new Date().toLocaleDateString(isEn ? "en-GB" : "es-ES", { month: "long", year: "numeric" });
  const shuttleNotes = isEn ? (officialShuttle?.notes_en ?? officialShuttle?.notes) : officialShuttle?.notes;

  return (
    <section
      className="transport-info my-10 space-y-6"
      aria-label={isEn ? `Transport options to ${festivalName}` : `Opciones de transporte a ${festivalName}`}
    >
      <h2 className="text-xl font-bold text-cr-text">
        {isEn
          ? <>Transport to {festivalName}: buses, train and carpooling</>
          : <>Transporte a {festivalName}: buses, tren y carpooling</>}
      </h2>

      {officialShuttle?.available && (
        <div className="rounded-xl border border-yellow-400/30 bg-yellow-400/5 p-4 flex gap-3 items-start">
          <Zap className="text-yellow-400 shrink-0 mt-0.5" size={18} />
          <div className="space-y-1 text-sm">
            <p className="font-semibold text-cr-text">
              {isEn ? "Official shuttle available" : "Lanzadera oficial disponible"}
              {officialShuttle.price_from === 0 && (
                <span className="ml-2 text-yellow-400 font-bold">{isEn ? "FREE" : "GRATIS"}</span>
              )}
              {officialShuttle.price_from != null && officialShuttle.price_from > 0 && (
                <span className="ml-2 text-yellow-400">
                  {isEn ? <>from {officialShuttle.price_from} €</> : <>desde {officialShuttle.price_from} €</>}
                </span>
              )}
            </p>
            {officialShuttle.pickup_points && officialShuttle.pickup_points.length > 0 && (
              <p className="text-cr-text-muted">
                {isEn
                  ? <>Pickup points: {officialShuttle.pickup_points.join(" · ")}</>
                  : <>Puntos de salida: {officialShuttle.pickup_points.join(" · ")}</>}
              </p>
            )}
            {shuttleNotes && (
              <p className="text-cr-text-muted">{shuttleNotes}</p>
            )}
            {officialShuttle.booking_url && (
              <a
                href={officialShuttle.booking_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cr-primary underline underline-offset-2 text-xs"
              >
                {isEn ? "Buy official tickets →" : "Comprar entradas oficiales →"}
              </a>
            )}
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-sm text-left">
          <thead className="bg-white/5 text-cr-text-muted text-xs uppercase tracking-wide">
            <tr>
              <th className="px-4 py-3">{isEn ? "Type" : "Tipo"}</th>
              <th className="px-4 py-3">{isEn ? "Provider / Route" : "Proveedor / Ruta"}</th>
              <th className="px-4 py-3">{isEn ? "Origin" : "Origen"}</th>
              <th className="px-4 py-3">{isEn ? "Price/seat" : "Precio/asiento"}</th>
              <th className="px-4 py-3 hidden md:table-cell">{isEn ? "Schedule / Frequency" : "Horario / Frecuencia"}</th>
              <th className="px-4 py-3 hidden lg:table-cell">{isEn ? "Notes" : "Notas"}</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {grouped.map(({ type, items }) =>
              items.map((opt, i) => {
                const cfg = TYPE_CONFIG[type];
                const isCarpooling = type === "carpooling";
                return (
                  <tr
                    key={`${type}-${i}`}
                    className={`transition-colors ${isCarpooling ? "bg-cr-primary/5 hover:bg-cr-primary/10" : "hover:bg-white/3"}`}
                  >
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-medium ${cfg.bg} ${cfg.color}`}>
                        <cfg.Icon size={12} />
                        {isEn ? cfg.label_en : cfg.label}
                        {isCarpooling && <span className="text-[10px] opacity-70">{isEn ? "★ no commission" : "★ sin comisión"}</span>}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-medium text-cr-text">
                      {isCarpooling ? (
                        <a href="/concerts" className="text-cr-primary hover:underline">
                          ConcertRide →
                        </a>
                      ) : opt.booking_url ? (
                        <a
                          href={opt.booking_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="hover:underline"
                        >
                          {isEn && opt.provider_en ? opt.provider_en : opt.provider}
                        </a>
                      ) : (
                        isEn && opt.provider_en ? opt.provider_en : opt.provider
                      )}
                    </td>
                    <td className="px-4 py-3 text-cr-text-muted">{isEn && opt.origin_en ? opt.origin_en : opt.origin}</td>
                    <td className="px-4 py-3 font-semibold text-cr-text">{priceLabel(opt, isEn)}</td>
                    <td className="px-4 py-3 text-cr-text-muted hidden md:table-cell">
                      {scheduleLabel(opt, isEn)}
                    </td>
                    <td className="px-4 py-3 text-cr-text-muted text-xs hidden lg:table-cell">
                      {isEn ? (opt.notes_en ?? opt.notes ?? "—") : (opt.notes ?? "—")}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-cr-text-muted">
        {isEn ? (
          <>Indicative prices. ConcertRide carpools are posted by private drivers — no platform commission.{" "}Data last reviewed: {reviewed}.</>
        ) : (
          <>Precios orientativos. Los carpoolings de ConcertRide son publicados por conductores particulares — sin comisión de plataforma.{" "}Última revisión de datos: {reviewed}.</>
        )}
      </p>
    </section>
  );
}
