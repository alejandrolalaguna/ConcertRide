import React from "react";
import { Link } from "react-router-dom";
import { FESTIVAL_LANDINGS, FESTIVAL_LANDINGS_BY_SLUG } from "./festivalLandings";
import { CITY_LANDINGS } from "./cityLandings";
import { ROUTE_LANDINGS } from "./routeLandings";
import { ARTIST_LANDINGS } from "./artistLandings";
import { VENUE_LANDINGS } from "./venueLandings";
import { BLOG_POSTS_BY_SLUG } from "./blogPosts";

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
  const routesFromCity = ROUTE_LANDINGS.filter((r) => r.originCitySlug === slug).slice(0, 4);

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
          {routesFromCity.length > 0 && (
            <>
              <li className="mt-2 font-semibold">Carpooling desde {city.display}</li>
              {routesFromCity.map((r) => (
                <li key={r.slug}>
                  <Link to={`/rutas/${r.slug}`} className="hover:underline">
                    {city.display} → {r.festival.shortName}
                  </Link>
                </li>
              ))}
            </>
          )}
          <li className="mt-2">
            <Link to={`/rutas`} className="text-cr-primary hover:underline">Ver todas las rutas desde {city.display}</Link>
          </li>
        </ul>
      </div>
    </aside>
  );
}

export function AutoLinksForRoute({ originCitySlug, festivalSlug }: { originCitySlug: string; festivalSlug: string }) {
  const festival = FESTIVAL_LANDINGS.find((f) => f.slug === festivalSlug);
  const city = CITY_LANDINGS.find((c) => c.slug === originCitySlug);

  // Similar routes: same festival from nearby cities, or same origin to other festivals
  const sameFestivalRoutes = ROUTE_LANDINGS
    .filter((r) => r.festival.slug === festivalSlug && r.originCitySlug !== originCitySlug)
    .slice(0, 3);
  const sameOriginRoutes = ROUTE_LANDINGS
    .filter((r) => r.originCitySlug === originCitySlug && r.festival.slug !== festivalSlug)
    .slice(0, 3);

  return (
    <aside className="mt-8">
      <div className="bg-gray-900 p-4 rounded-lg space-y-3">
        <h3 className="font-bold">Páginas relacionadas</h3>
        <ul className="space-y-2 text-sm">
          {festival && (
            <li>
              <Link to={`/festivales/${festival.slug}`} className="text-cr-primary hover:underline">
                {festival.shortName} — información y transporte
              </Link>
            </li>
          )}
          {festival && (
            <li>
              <Link to={`/como-llegar/${festival.slug}`} className="hover:underline">
                Cómo llegar a {festival.shortName}
              </Link>
            </li>
          )}
          {city && (
            <li>
              <Link to={`/conciertos/${city.slug}`} className="hover:underline">
                Conciertos en {city.display}
              </Link>
            </li>
          )}
          {sameFestivalRoutes.length > 0 && (
            <>
              <li className="mt-2 font-semibold text-cr-text-muted">Otras ciudades a {festival?.shortName}</li>
              {sameFestivalRoutes.map((r) => (
                <li key={r.slug}>
                  <Link to={`/rutas/${r.slug}`} className="hover:underline">
                    {r.originCity} → {festival?.shortName}
                  </Link>
                </li>
              ))}
            </>
          )}
          {sameOriginRoutes.length > 0 && (
            <>
              <li className="mt-2 font-semibold text-cr-text-muted">Más festivales desde {city?.display}</li>
              {sameOriginRoutes.map((r) => (
                <li key={r.slug}>
                  <Link to={`/rutas/${r.slug}`} className="hover:underline">
                    {city?.display} → {r.festival.shortName}
                  </Link>
                </li>
              ))}
            </>
          )}
        </ul>
      </div>
    </aside>
  );
}

export function AutoLinksForArtist({ slug }: { slug: string }) {
  const artist = ARTIST_LANDINGS.find((a) => a.slug === slug);
  if (!artist) return null;

  const relatedFestivals = artist.relatedFestivals
    .slice(0, 3)
    .map((s) => FESTIVAL_LANDINGS_BY_SLUG[s])
    .filter((f): f is NonNullable<typeof f> => f != null);

  // Find routes for the artist's concert cities matched to a related festival
  const artistFestivalSlugs = new Set(artist.relatedFestivals);
  const relatedRoutes = ROUTE_LANDINGS.filter(
    (r) => artistFestivalSlugs.has(r.festival.slug)
  ).slice(0, 3);

  return (
    <aside className="mt-8">
      <div className="bg-gray-900 p-4 rounded-lg space-y-3">
        <h3 className="font-bold">Páginas relacionadas</h3>
        <ul className="space-y-2 text-sm">
          {relatedFestivals.map((f) => (
            <li key={f.slug}>
              <Link to={`/festivales/${f.slug}`} className="text-cr-primary hover:underline">
                {f.shortName} — {f.city}
              </Link>
            </li>
          ))}
          {relatedRoutes.length > 0 && (
            <>
              <li className="mt-2 font-semibold text-cr-text-muted">Rutas a festivales con {artist.name}</li>
              {relatedRoutes.map((r) => (
                <li key={r.slug}>
                  <Link to={`/rutas/${r.slug}`} className="hover:underline">
                    {r.originCity} → {r.festival.shortName}
                  </Link>
                </li>
              ))}
            </>
          )}
          <li className="mt-2">
            <Link to="/concerts" className="text-cr-primary hover:underline">
              Ver todos los conciertos de {artist.name} →
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
}

export function AutoLinksForVenue({ slug }: { slug: string }) {
  const venue = VENUE_LANDINGS.find((v) => v.slug === slug);
  if (!venue) return null;

  const relatedFestivals = venue.relatedFestivals
    .slice(0, 4)
    .map((s) => FESTIVAL_LANDINGS_BY_SLUG[s])
    .filter((f): f is NonNullable<typeof f> => f != null);

  const relatedRoutes = ROUTE_LANDINGS.filter(
    (r) => r.festival.city === venue.city
  ).slice(0, 3);

  return (
    <aside className="mt-8">
      <div className="bg-gray-900 p-4 rounded-lg space-y-3">
        <h3 className="font-bold">Páginas relacionadas</h3>
        <ul className="space-y-2 text-sm">
          {relatedFestivals.map((f) => (
            <li key={f.slug}>
              <Link to={`/festivales/${f.slug}`} className="text-cr-primary hover:underline">
                {f.shortName} — Cómo llegar
              </Link>
            </li>
          ))}
          {relatedRoutes.length > 0 && (
            <>
              <li className="mt-2 font-semibold text-cr-text-muted">Rutas a {venue.city}</li>
              {relatedRoutes.map((r) => (
                <li key={r.slug}>
                  <Link to={`/rutas/${r.slug}`} className="hover:underline">
                    {r.originCity} → {r.festival.shortName}
                  </Link>
                </li>
              ))}
            </>
          )}
          <li className="mt-2">
            <Link to={`/conciertos/${venue.citySlug}`} className="hover:underline">
              Conciertos en {venue.city}
            </Link>
          </li>
        </ul>
      </div>
    </aside>
  );
}

export function AutoLinksForBlog({ slug }: { slug: string }) {
  const post = BLOG_POSTS_BY_SLUG[slug];
  if (!post) return null;

  const relatedPosts = (post.relatedPosts ?? [])
    .map((s) => BLOG_POSTS_BY_SLUG[s])
    .filter((p): p is NonNullable<typeof p> => p != null);

  const festivalLinks = (post.relatedLinks ?? []).filter((l) =>
    l.to.startsWith("/festivales/")
  );
  const routeLinks = (post.relatedLinks ?? []).filter((l) =>
    l.to.startsWith("/rutas/")
  );
  const showComparativa =
    post.category === "comparativas" &&
    slug !== "blablacar-vs-concertride";

  return (
    <aside className="mt-8">
      <div className="bg-gray-900 p-4 rounded-lg space-y-3">
        <h3 className="font-bold">Artículos y páginas relacionadas</h3>
        <ul className="space-y-2 text-sm">
          {relatedPosts.map((p) => (
            <li key={p.slug}>
              <Link to={`/blog/${p.slug}`} className="text-cr-primary hover:underline">
                {p.title}
              </Link>
            </li>
          ))}
          {festivalLinks.length > 0 && (
            <>
              <li className="mt-2 font-semibold text-cr-text-muted">Festivales relacionados</li>
              {festivalLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="hover:underline">{l.label}</Link>
                </li>
              ))}
            </>
          )}
          {routeLinks.length > 0 && (
            <>
              <li className="mt-2 font-semibold text-cr-text-muted">Rutas de carpooling</li>
              {routeLinks.map((l) => (
                <li key={l.to}>
                  <Link to={l.to} className="hover:underline">{l.label}</Link>
                </li>
              ))}
            </>
          )}
          {showComparativa && (
            <li className="mt-2">
              <Link to="/blog/blablacar-vs-concertride" className="text-cr-primary hover:underline">
                BlaBlaCar vs ConcertRide — comparativa completa
              </Link>
            </li>
          )}
        </ul>
      </div>
    </aside>
  );
}

export default AutoLinksForFestival;
