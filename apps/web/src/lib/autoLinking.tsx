import React from "react";
import { Link } from "react-router-dom";
import { FESTIVAL_LANDINGS } from "./festivalLandings";
import { CITY_LANDINGS } from "./cityLandings";
import { ROUTE_LANDINGS } from "./routeLandings";

// Simple AutoLinks component: given a festivalSlug or citySlug, render related links
export function AutoLinksForFestival({ slug }: { slug: string }) {
  const festival = FESTIVAL_LANDINGS.find((f) => f.slug === slug);
  if (!festival) return null;

  // Related: how-to page, city page, 3 closest origin cities, top 3 routes
  const howTo = `/como-llegar/${festival.slug}`;
  const cityPage = festival.city ? `/conciertos/${festival.city.toLowerCase().replace(/\s+/g, "-")}` : null;

  // pick up to 3 origin cities from CITY_LANDINGS based on proximity (naive: same region first)
  const relatedCities = CITY_LANDINGS.filter((c) => c.region === festival.region).slice(0, 3);

  const relatedRoutes = ROUTE_LANDINGS.filter((r) => r.festival.slug === festival.slug).slice(0, 4);

  return (
    <aside className="mt-8">
      <div className="bg-gray-900 p-4 rounded-lg">
        <h3 className="font-bold mb-2">Enlaces útiles</h3>
        <ul className="space-y-2 text-sm">
          <li>
            <Link to={howTo} className="text-cr-primary hover:underline">Cómo llegar a {festival.shortName}</Link>
          </li>
          {cityPage && (
            <li>
              <Link to={cityPage} className="hover:underline">Conciertos en {festival.city}</Link>
            </li>
          )}
          {relatedCities.map((c) => (
            <li key={c.slug}>
              <Link to={`/conciertos/${c.slug}`} className="hover:underline">Conciertos en {c.display}</Link>
            </li>
          ))}
          {relatedRoutes.length > 0 && (
            <>
              <li className="mt-2 font-semibold">Rutas recomendadas</li>
              {relatedRoutes.map((r) => (
                <li key={r.slug}>
                  <Link to={`/rutas/${r.slug}`} className="hover:underline">{r.originCity} → {festival.city}</Link>
                </li>
              ))}
            </>
          )}
        </ul>
      </div>
    </aside>
  );
}

export function AutoLinksForCity({ slug }: { slug: string }) {
  const city = CITY_LANDINGS.find((c) => c.slug === slug);
  if (!city) return null;

  const relatedFestivals = FESTIVAL_LANDINGS.filter((f) => f.city === city.city).slice(0, 6);

  return (
    <aside className="mt-8">
      <div className="bg-gray-900 p-4 rounded-lg">
        <h3 className="font-bold mb-2">Enlaces relacionados</h3>
        <ul className="space-y-2 text-sm">
          {relatedFestivals.map((f) => (
            <li key={f.slug}>
              <Link to={`/festivales/${f.slug}`} className="hover:underline">{f.shortName} — Cómo llegar</Link>
            </li>
          ))}
          <li className="mt-2">
            <Link to={`/rutas`} className="text-cr-primary hover:underline">Ver rutas desde {city.display}</Link>
          </li>
        </ul>
      </div>
    </aside>
  );
}

export default AutoLinksForFestival;
