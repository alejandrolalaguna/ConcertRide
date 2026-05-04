import { MapPin, Navigation, ExternalLink } from "lucide-react";
import type { PickupPoint } from "@/lib/festivalLandings";

interface Props {
  points: PickupPoint[];
  festivalName: string;
  festivalLat: number;
  festivalLng: number;
}

export function PickupMap({ points, festivalName, festivalLat, festivalLng }: Props) {
  if (points.length === 0) return null;

  return (
    <section className="my-10 space-y-5" aria-label={`Puntos de recogida para ${festivalName}`}>
      <div>
        <h2 className="text-xl font-bold text-cr-text">
          Puntos de recogida frecuentes — {festivalName}
        </h2>
        <p className="text-sm text-cr-text-muted mt-1">
          Los conductores de ConcertRide suelen quedar en estos puntos. Coordina con tu conductor por chat.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {points.map((point, i) => {
          const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${point.lat},${point.lng}`;
          const isDestination = i === points.length - 1;
          return (
            <div
              key={i}
              className={`rounded-xl border p-4 space-y-2 ${
                isDestination
                  ? "border-cr-primary/40 bg-cr-primary/5"
                  : "border-white/10 bg-white/3"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  <MapPin
                    size={16}
                    className={isDestination ? "text-cr-primary" : "text-cr-text-muted"}
                  />
                  <h3 className="text-sm font-semibold text-cr-text">{point.name}</h3>
                </div>
                <a
                  href={mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="shrink-0 text-cr-text-muted hover:text-cr-primary transition-colors"
                  aria-label={`Ver ${point.name} en Google Maps`}
                >
                  <ExternalLink size={14} />
                </a>
              </div>

              <p className="text-xs text-cr-text-muted">{point.address}</p>

              <div className="flex items-start gap-1.5 text-xs text-cr-text-muted">
                <Navigation size={11} className="shrink-0 mt-0.5" />
                <span>{point.transport_access}</span>
              </div>

              {point.notes && (
                <p className={`text-xs font-medium ${isDestination ? "text-cr-primary" : "text-yellow-400"}`}>
                  {point.notes}
                </p>
              )}

              <a
                href={mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[11px] text-cr-text-muted hover:text-cr-primary transition-colors"
              >
                {point.lat.toFixed(4)}, {point.lng.toFixed(4)}
              </a>
            </div>
          );
        })}
      </div>

      {/* JSON-LD Place markers para SEO/GEO — invisible pero citable por LLMs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: `Puntos de recogida para carpooling a ${festivalName}`,
            description: `Puntos de encuentro habituales para conductores y pasajeros de ConcertRide con destino ${festivalName}.`,
            itemListElement: points.map((p, idx) => ({
              "@type": "ListItem",
              position: idx + 1,
              item: {
                "@type": "Place",
                name: p.name,
                address: p.address,
                geo: { "@type": "GeoCoordinates", latitude: p.lat, longitude: p.lng },
                description: p.transport_access,
              },
            })),
          }),
        }}
      />
    </section>
  );
}
