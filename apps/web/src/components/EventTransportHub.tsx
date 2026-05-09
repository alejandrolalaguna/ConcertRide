/**
 * EventTransportHub — renders the "how to get there" travel hub section
 * used in both ConcertDetailPage and FestivalLandingPage.
 *
 * Targets queries like:
 *  "how to get to [event]", "transport [event]", "bus [event]", "parking [event]"
 *  "nearest airport [venue]", "accommodation [festival]", "carpool [event]"
 */

import { Link } from "react-router-dom";
import { ArrowRight, Car, Train, Bus, Plane, MapPin, Clock, Euro } from "lucide-react";
import { SITE_URL } from "@/lib/siteUrl";

export interface TransportMode {
  type: "car" | "train" | "bus" | "plane" | "carpooling" | "shuttle" | "local";
  title: string;
  summary: string;
  duration?: string;
  price?: string;
  notes?: string;
  bookingUrl?: string;
  recommended?: boolean;
}

export interface NearbyAirport {
  name: string;
  iata: string;
  distanceKm: number;
  transferTime: string;
  transferOptions: string;
}

export interface AccommodationZone {
  area: string;
  distanceKm: number;
  priceRange: string;
  notes?: string;
}

export interface ArrivalTip {
  title: string;
  body: string;
}

export interface EventTransportHubProps {
  /** Event name for text generation */
  eventName: string;
  /** Short event name for inline refs */
  eventShortName?: string;
  /** Host city */
  city: string;
  /** Venue name */
  venue: string;
  /** ISO date of the event */
  date?: string;
  /** Parking info */
  parking?: { available: boolean; price?: string; notes?: string };
  /** Camping info */
  camping?: { available: boolean; notes?: string };
  /** Transport modes (car, train, bus, carpooling, …) */
  transportModes?: TransportMode[];
  /** Nearest airports */
  nearbyAirports?: NearbyAirport[];
  /** Recommended accommodation areas */
  accommodationZones?: AccommodationZone[];
  /** Arrival tips */
  arrivalTips?: ArrivalTip[];
  /** CTA to search rides */
  concertId?: string;
  festivalSlug?: string;
  /** Link to publish a ride */
  showPublishCTA?: boolean;
}

function modeIcon(type: TransportMode["type"]) {
  const cls = "shrink-0 text-cr-primary";
  switch (type) {
    case "plane": return <Plane size={16} className={cls} />;
    case "train": return <Train size={16} className={cls} />;
    case "bus":
    case "shuttle": return <Bus size={16} className={cls} />;
    case "carpooling": return <Car size={16} className={cls} />;
    default: return <MapPin size={16} className={cls} />;
  }
}

export function EventTransportHub({
  eventName,
  eventShortName,
  city,
  venue,
  date,
  parking,
  camping,
  transportModes = [],
  nearbyAirports = [],
  accommodationZones = [],
  arrivalTips = [],
  concertId,
  festivalSlug,
  showPublishCTA = true,
}: EventTransportHubProps) {
  const name = eventShortName ?? eventName;
  const year = date ? new Date(date).getFullYear() : new Date().getFullYear();

  const ridesHref = festivalSlug
    ? `/concerts?city=${encodeURIComponent(city)}`
    : concertId
    ? `/concerts/${concertId}`
    : `/concerts?city=${encodeURIComponent(city)}`;

  return (
    <div className="space-y-12">
      {/* ── Transport modes ── */}
      {transportModes.length > 0 && (
        <section aria-labelledby="transport-modes-heading">
          <h2
            id="transport-modes-heading"
            className="font-display text-2xl md:text-3xl uppercase mb-6"
          >
            Cómo llegar a {name} {year}: todas las opciones de transporte
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 font-sans text-sm">
            {transportModes.map((mode) => (
              <article
                key={mode.type + mode.title}
                className={`border p-4 space-y-3 ${
                  mode.recommended
                    ? "border-cr-primary/50 bg-cr-primary/5"
                    : "border-cr-border"
                }`}
              >
                <div className="flex items-start gap-2">
                  {modeIcon(mode.type)}
                  <div className="space-y-0.5">
                    <h3 className="font-display text-sm uppercase leading-tight">
                      {mode.title}
                      {mode.recommended && (
                        <span className="ml-2 font-sans text-[10px] text-cr-primary normal-case font-semibold tracking-widest">
                          [RECOMENDADO]
                        </span>
                      )}
                    </h3>
                    {(mode.duration || mode.price) && (
                      <div className="flex gap-3 font-mono text-[11px] text-cr-text-muted">
                        {mode.duration && (
                          <span className="inline-flex items-center gap-1">
                            <Clock size={10} /> {mode.duration}
                          </span>
                        )}
                        {mode.price && (
                          <span className="inline-flex items-center gap-1">
                            <Euro size={10} /> {mode.price}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <p className="text-cr-text-muted text-xs leading-relaxed">{mode.summary}</p>
                {mode.notes && (
                  <p className="text-cr-text-dim text-[11px] italic leading-relaxed">
                    {mode.notes}
                  </p>
                )}
                {mode.type === "carpooling" && (
                  <Link
                    to={ridesHref}
                    className="inline-flex items-center gap-1 font-sans text-xs font-semibold text-cr-primary hover:underline"
                  >
                    Buscar viajes <ArrowRight size={11} />
                  </Link>
                )}
                {mode.bookingUrl && mode.type !== "carpooling" && (
                  <a
                    href={mode.bookingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 font-sans text-xs font-semibold text-cr-text-muted hover:text-cr-primary"
                  >
                    Reservar <ArrowRight size={11} />
                  </a>
                )}
              </article>
            ))}
          </div>
        </section>
      )}

      {/* ── Parking + Camping row ── */}
      {(parking !== undefined || camping !== undefined) && (
        <section
          aria-labelledby="logistics-heading"
          className="border-t border-cr-border pt-8"
        >
          <h2
            id="logistics-heading"
            className="font-display text-xl uppercase mb-4"
          >
            Parking y acampada en {name} {year}
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 font-sans text-sm">
            {parking !== undefined && (
              <article className="border border-cr-border p-4 space-y-2">
                <h3 className="font-display text-sm uppercase">
                  Parking en {venue}
                </h3>
                <p
                  className={`font-mono text-xs font-semibold ${
                    parking.available ? "text-cr-primary" : "text-cr-secondary"
                  }`}
                >
                  {parking.available ? "Parking disponible" : "Sin parking en recinto"}
                </p>
                {parking.price && (
                  <p className="text-xs text-cr-text-muted">
                    Precio: {parking.price}
                  </p>
                )}
                {parking.notes && (
                  <p className="text-xs text-cr-text-muted leading-relaxed">
                    {parking.notes}
                  </p>
                )}
                {!parking.available && (
                  <p className="text-xs text-cr-text-dim leading-relaxed">
                    Sin parking en el recinto, el carpooling es la opción más práctica: el conductor se encarga del coche y el coste se divide entre todos.
                  </p>
                )}
              </article>
            )}
            {camping !== undefined && (
              <article className="border border-cr-border p-4 space-y-2">
                <h3 className="font-display text-sm uppercase">
                  Acampada en {name}
                </h3>
                <p
                  className={`font-mono text-xs font-semibold ${
                    camping.available ? "text-cr-primary" : "text-cr-text-muted"
                  }`}
                >
                  {camping.available ? "Camping disponible" : "Sin camping oficial"}
                </p>
                {camping.notes && (
                  <p className="text-xs text-cr-text-muted leading-relaxed">
                    {camping.notes}
                  </p>
                )}
              </article>
            )}
          </div>
        </section>
      )}

      {/* ── Nearby airports ── */}
      {nearbyAirports.length > 0 && (
        <section
          aria-labelledby="airports-heading"
          className="border-t border-cr-border pt-8"
        >
          <h2
            id="airports-heading"
            className="font-display text-xl uppercase mb-4"
          >
            Aeropuertos más cercanos a {venue}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 font-sans text-sm">
            {nearbyAirports.map((ap) => (
              <article key={ap.iata} className="border border-cr-border p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Plane size={14} className="text-cr-primary" />
                  <h3 className="font-display text-sm uppercase">{ap.name}</h3>
                  <span className="font-mono text-[11px] text-cr-text-dim">({ap.iata})</span>
                </div>
                <div className="flex gap-4 font-mono text-[11px] text-cr-text-muted">
                  <span>{ap.distanceKm} km</span>
                  <span>·</span>
                  <span>{ap.transferTime}</span>
                </div>
                <p className="text-xs text-cr-text-muted leading-relaxed">
                  {ap.transferOptions}
                </p>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* ── Accommodation zones ── */}
      {accommodationZones.length > 0 && (
        <section
          aria-labelledby="accommodation-heading"
          className="border-t border-cr-border pt-8"
        >
          <h2
            id="accommodation-heading"
            className="font-display text-xl uppercase mb-4"
          >
            Dónde alojarse para ir a {name}: zonas recomendadas
          </h2>
          <p className="font-sans text-xs text-cr-text-muted mb-4 max-w-2xl">
            Si vienes de fuera de {city}, aquí tienes las zonas con mejor relación precio / accesibilidad al recinto.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 font-sans text-sm">
            {accommodationZones.map((zone) => (
              <article key={zone.area} className="border border-cr-border p-4 space-y-2">
                <h3 className="font-display text-sm uppercase">{zone.area}</h3>
                <div className="flex gap-3 font-mono text-[11px] text-cr-text-muted">
                  <span>{zone.distanceKm} km del recinto</span>
                  <span>·</span>
                  <span>{zone.priceRange}</span>
                </div>
                {zone.notes && (
                  <p className="text-xs text-cr-text-muted leading-relaxed">{zone.notes}</p>
                )}
              </article>
            ))}
          </div>
          <p className="font-mono text-[10px] text-cr-text-dim mt-3">
            Precios orientativos por noche (2 personas, temporada alta). Reserva con antelación — las fechas de festival se agotan en semanas.
          </p>
        </section>
      )}

      {/* ── Arrival tips ── */}
      {arrivalTips.length > 0 && (
        <section
          aria-labelledby="arrival-tips-heading"
          className="border-t border-cr-border pt-8"
        >
          <h2
            id="arrival-tips-heading"
            className="font-display text-xl uppercase mb-4"
          >
            Consejos de llegada a {name} {year}
          </h2>
          <ul className="space-y-3">
            {arrivalTips.map((tip, i) => (
              <li key={i} className="flex gap-3 font-sans text-sm">
                <span className="font-mono text-[11px] text-cr-primary shrink-0 pt-0.5">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="space-y-0.5">
                  <p className="font-semibold text-cr-text">{tip.title}</p>
                  <p className="text-xs text-cr-text-muted leading-relaxed">{tip.body}</p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ── CTA bar ── */}
      {showPublishCTA && (
        <div className="border-t border-cr-border pt-8 flex flex-wrap gap-3">
          <Link
            to={ridesHref}
            className="inline-flex items-center gap-2 bg-cr-primary text-black font-sans text-sm font-bold uppercase tracking-[0.12em] px-5 py-3 hover:bg-cr-primary/90 transition-colors"
          >
            Buscar viajes a {name} <ArrowRight size={14} />
          </Link>
          <Link
            to="/publish"
            className="inline-flex items-center gap-2 border-2 border-cr-primary text-cr-primary font-sans text-sm font-bold uppercase tracking-[0.12em] px-5 py-3 hover:bg-cr-primary hover:text-black transition-colors"
          >
            Publicar un viaje →
          </Link>
        </div>
      )}
    </div>
  );
}

/**
 * Generates schema.org JSON-LD for transport modes.
 * Emits a Service + ItemList for LLM citation.
 */
export function generateTransportHubSchema({
  eventName,
  city,
  venue,
  siteUrl,
  transportModes = [],
  nearbyAirports = [],
  accommodationZones = [],
}: {
  eventName: string;
  city: string;
  venue: string;
  siteUrl: string;
  transportModes?: TransportMode[];
  nearbyAirports?: NearbyAirport[];
  accommodationZones?: AccommodationZone[];
}) {
  const schemas: object[] = [];

  if (transportModes.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `Opciones de transporte para ${eventName} en ${venue}, ${city}`,
      description: `Modos de transporte disponibles para llegar a ${eventName}: ${transportModes.map((m) => m.title).join(", ")}.`,
      itemListElement: transportModes.map((m, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: `${m.title}${m.price ? ` · ${m.price}` : ""}${m.duration ? ` · ${m.duration}` : ""}`,
        item: m.type === "carpooling" ? { "@id": `${siteUrl}/concerts?city=${encodeURIComponent(city)}`, "@type": "WebPage" } : undefined,
      })),
    });
  }

  if (nearbyAirports.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `Aeropuertos cercanos a ${venue} (${eventName})`,
      itemListElement: nearbyAirports.map((ap, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: `${ap.name} (${ap.iata}): ${ap.distanceKm} km · ${ap.transferTime} en transporte`,
      })),
    });
  }

  if (accommodationZones.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "ItemList",
      name: `Zonas de alojamiento para ${eventName} en ${city}`,
      itemListElement: accommodationZones.map((z, i) => ({
        "@type": "ListItem",
        position: i + 1,
        name: `${z.area}: ${z.distanceKm} km del recinto · ${z.priceRange}`,
      })),
    });
  }

  return schemas;
}
