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
  };
  festivalName: string;
}

const TYPE_CONFIG = {
  bus: { label: "Bus", Icon: Bus, color: "text-blue-400", bg: "bg-blue-400/10" },
  train: { label: "Tren", Icon: Train, color: "text-green-400", bg: "bg-green-400/10" },
  shuttle: { label: "Lanzadera", Icon: Zap, color: "text-yellow-400", bg: "bg-yellow-400/10" },
  carpooling: { label: "Carpooling", Icon: Car, color: "text-cr-primary", bg: "bg-cr-primary/10" },
} as const;

function priceLabel(opt: TransportOption): string {
  if (opt.price_from === 0) return "Gratis";
  if (opt.price_to) return `${opt.price_from}–${opt.price_to} €`;
  return `Desde ${opt.price_from} €`;
}

export function TransportTable({ options, officialShuttle, festivalName }: Props) {
  // Group by type, carpooling always last
  const order: TransportOption["type"][] = ["shuttle", "bus", "train", "carpooling"];
  const grouped = order
    .map((t) => ({ type: t, items: options.filter((o) => o.type === t) }))
    .filter((g) => g.items.length > 0);

  return (
    <section className="transport-info my-10 space-y-6" aria-label={`Opciones de transporte a ${festivalName}`}>
      <h2 className="text-xl font-bold text-cr-text">
        Transporte a {festivalName}: buses, tren y carpooling
      </h2>

      {officialShuttle?.available && (
        <div className="rounded-xl border border-yellow-400/30 bg-yellow-400/5 p-4 flex gap-3 items-start">
          <Zap className="text-yellow-400 shrink-0 mt-0.5" size={18} />
          <div className="space-y-1 text-sm">
            <p className="font-semibold text-cr-text">
              Lanzadera oficial disponible
              {officialShuttle.price_from === 0 && (
                <span className="ml-2 text-yellow-400 font-bold">GRATIS</span>
              )}
              {officialShuttle.price_from != null && officialShuttle.price_from > 0 && (
                <span className="ml-2 text-yellow-400">desde {officialShuttle.price_from} €</span>
              )}
            </p>
            {officialShuttle.pickup_points && officialShuttle.pickup_points.length > 0 && (
              <p className="text-cr-text-muted">
                Puntos de salida: {officialShuttle.pickup_points.join(" · ")}
              </p>
            )}
            {officialShuttle.notes && (
              <p className="text-cr-text-muted">{officialShuttle.notes}</p>
            )}
            {officialShuttle.booking_url && (
              <a
                href={officialShuttle.booking_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-cr-primary underline underline-offset-2 text-xs"
              >
                Comprar entradas oficiales →
              </a>
            )}
          </div>
        </div>
      )}

      <div className="overflow-x-auto rounded-xl border border-white/10">
        <table className="w-full text-sm text-left">
          <thead className="bg-white/5 text-cr-text-muted text-xs uppercase tracking-wide">
            <tr>
              <th className="px-4 py-3">Tipo</th>
              <th className="px-4 py-3">Proveedor / Ruta</th>
              <th className="px-4 py-3">Origen</th>
              <th className="px-4 py-3">Precio/asiento</th>
              <th className="px-4 py-3 hidden md:table-cell">Horario / Frecuencia</th>
              <th className="px-4 py-3 hidden lg:table-cell">Notas</th>
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
                        {cfg.label}
                        {isCarpooling && <span className="text-[10px] opacity-70">★ sin comisión</span>}
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
                          {opt.provider}
                        </a>
                      ) : (
                        opt.provider
                      )}
                    </td>
                    <td className="px-4 py-3 text-cr-text-muted">{opt.origin}</td>
                    <td className="px-4 py-3 font-semibold text-cr-text">{priceLabel(opt)}</td>
                    <td className="px-4 py-3 text-cr-text-muted hidden md:table-cell">
                      {opt.schedule ?? opt.frequency ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-cr-text-muted text-xs hidden lg:table-cell">
                      {opt.notes ?? "—"}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      <p className="text-xs text-cr-text-muted">
        Precios orientativos. Los carpoolings de ConcertRide son publicados por conductores particulares — sin comisión de plataforma.
        {" "}Última revisión de datos: {new Date().toLocaleDateString("es-ES", { month: "long", year: "numeric" })}.
      </p>
    </section>
  );
}
