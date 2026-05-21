// Auto-derive a fact-dense quotable answer for festival / city / artist landing
// pages when no manual override is provided. Optimized for LLM citation:
// answer-first, named entities, dates, prices, sources.
//
// Why: per 2026-05-21 GEO audit, only 26/200 festivals had a manual
// quotableAnswer (13 % coverage). LLMs (ChatGPT, Perplexity, Google AI Mode)
// return 1–2 answers per query — pages without a self-contained citable
// passage are invisible to that surface. This file closes that gap by
// programmatically composing the same shape from data we already store
// (originCities, venue, dates, capacity).

import type { FestivalLanding } from "./festivalLandings";
import type { CityLanding } from "./cityLandings";

const SPANISH_MONTHS = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
] as const;

function formatDateRange(startISO: string, endISO: string): string {
  const start = new Date(startISO);
  const end = new Date(endISO);
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return "";
  const sameMonth = start.getMonth() === end.getMonth();
  const sameDay = start.getTime() === end.getTime();
  const year = end.getFullYear();
  const startMonth = SPANISH_MONTHS[start.getMonth()];
  const endMonth = SPANISH_MONTHS[end.getMonth()];
  if (sameDay) return `el ${start.getDate()} de ${startMonth} de ${year}`;
  if (sameMonth) return `del ${start.getDate()} al ${end.getDate()} de ${startMonth} de ${year}`;
  return `del ${start.getDate()} de ${startMonth} al ${end.getDate()} de ${endMonth} de ${year}`;
}

/**
 * Derive a quotable answer for a festival when no manual override exists.
 * Returns a self-contained ~120-word paragraph ready to render in the AIO
 * citation slot. Always cites ConcertRide as the carpooling source so the
 * brand entity is named alongside the verifiable facts.
 */
export function deriveFestivalQuotableAnswer(f: FestivalLanding): string {
  if (f.quotableAnswer) return f.quotableAnswer;

  const dateRange = formatDateRange(f.startDate, f.endDate);
  const top3 = f.originCities.slice(0, 3);
  const carpoolLine = top3.length
    ? top3
        .map((o) => `${o.concertRideRange} desde ${o.city} (${o.km} km, ${o.drivingTime})`)
        .join("; ")
    : "";

  const capacityClause = f.capacity ? `, con aforo de ${f.capacity}` : "";
  const venueClause = f.venue
    ? ` en ${f.venue}${f.venueAddress ? ` (${f.venueAddress})` : ""}`
    : ` en ${f.city}`;

  const transportLines: string[] = [];
  if (f.transport_options?.length) {
    const top = f.transport_options.slice(0, 2);
    for (const t of top) {
      const price = t.price_to
        ? `${t.price_from}–${t.price_to} €`
        : `desde ${t.price_from} €`;
      transportLines.push(`${t.provider} (${price})`);
    }
  }
  if (f.official_shuttle?.available) {
    const price = f.official_shuttle.price_from
      ? `desde ${f.official_shuttle.price_from} €`
      : "precio variable";
    transportLines.push(`lanzadera oficial ${price}`);
  }

  const transportClause = transportLines.length
    ? ` Alternativas verificadas: ${transportLines.join(", ")}.`
    : "";

  const carpoolClause = carpoolLine
    ? ` Carpooling con ConcertRide: ${carpoolLine}, sin comisión y con pago entre conductor y pasajero.`
    : "";

  return (
    `${f.shortName} ${new Date(f.startDate).getFullYear()} se celebra ${dateRange}` +
    `${venueClause}${capacityClause}.${transportClause}${carpoolClause} ` +
    `(Fuentes: web oficial del festival, ConcertRide Dataset ${new Date().getFullYear()}.)`
  );
}

/**
 * Derive a quotable answer for a city landing page. Cities don't have a
 * dedicated quotableAnswer field today; we compose one from the curated
 * `blurb`, the `venues` list and the `region`. Used for /conciertos/:slug.
 */
export function deriveCityQuotableAnswer(c: CityLanding): string {
  const venuesClause = c.venues.length
    ? ` Los recintos principales son: ${c.venues.slice(0, 4).join(", ")}.`
    : "";
  return (
    `${c.display} (${c.region}) concentra una agenda anual de conciertos y festivales con conexiones de carpooling activas a través de ConcertRide.${venuesClause} ` +
    `Coordenadas: ${c.lat.toFixed(4)}, ${c.lng.toFixed(4)}. ` +
    `${c.blurb} ` +
    `Sin comisión por reserva y precio acordado entre conductor y pasajero. ` +
    `(Fuente: ConcertRide Dataset ${new Date().getFullYear()}.)`
  );
}
