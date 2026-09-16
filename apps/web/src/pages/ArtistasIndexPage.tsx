// ─── §AG: /artistas index hub (added 2026-09-16) ────────────────────────────
//
// Until now `/artistas` had NO route in App.tsx and no prerendered asset, so it
// fell through to the SPA shell. Verified live on 2026-09-16:
//   curl -sA Googlebot https://concertride.me/artistas | md5sum
//     → 5ef39876ea9d7732c010fa026ad4626d  — BYTE-IDENTICAL to the homepage,
//   including `<link rel="canonical" href="https://concertride.me/">`.
//
// Consequences, all of which this page fixes:
//   1. `/artistas` was a homepage duplicate claiming the homepage canonical
//      (feeds "Duplicada: el usuario no ha indicado ninguna versión canónica").
//   2. The 216 `/artistas/:slug` pages had NO hub. They were reachable only
//      from scattered festival line-ups, which is exactly the link-starvation
//      that parks URLs in "Descubierta: actualmente sin indexar".
//   3. `/artistas` appears in no sitemap, so nothing pointed at it either.
//
// Mirrors RecintosIndexPage deliberately: same CollectionPage + BreadcrumbList
// shape, same featured-grid + <details> full list. The <details> list is in the
// SSR DOM, so every artist gets a real crawlable inbound link (§AF.5 —
// client-side filters do NOT count as internal links).
import { Link } from "react-router-dom";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";
import { ARTIST_LANDINGS } from "@/lib/artistLandings";

export default function ArtistasIndexPage() {
  const year = new Date().getFullYear();
  const url = `${SITE_URL}/artistas`;

  useSeoMeta({
    title: `Artistas en gira por España ${year}: fechas y cómo llegar | ConcertRide`,
    description: `Conciertos de ${ARTIST_LANDINGS.length}+ artistas en España ${year}: fechas, recintos y cómo llegar compartiendo coche desde 3 €/asiento, sin comisión de plataforma.`,
    canonical: url,
    keywords: `artistas gira españa ${year}, conciertos españa ${year}, entradas conciertos, como llegar concierto, carpooling concierto`,
  });

  // Artists with at least one dated concert lead the grid — they are the ones a
  // user can actually act on. The rest stay fully linked in the <details>.
  const withDates = ARTIST_LANDINGS.filter((a) =>
    a.upcomingConcerts.some((c) => c.date !== "TBD"),
  );
  const featured = (withDates.length >= 24 ? withDates : ARTIST_LANDINGS).slice(0, 24);
  const featuredSlugs = new Set(featured.map((a) => a.slug));
  const rest = ARTIST_LANDINGS.filter((a) => !featuredSlugs.has(a.slug));

  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#webpage`,
    url,
    name: `Artistas en gira por España ${year}`,
    description: `Directorio de ${ARTIST_LANDINGS.length} artistas con fechas en España y opciones de transporte al concierto.`,
    inLanguage: "es-ES",
    numberOfItems: ARTIST_LANDINGS.length,
    isPartOf: { "@id": `${SITE_URL}/#website` },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Artistas", item: url },
    ],
  };

  return (
    <main id="main" role="main" className="min-h-screen bg-[#080808] pb-24 pt-12 text-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(collectionLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <div className="mx-auto max-w-6xl px-4">
        <nav aria-label="Breadcrumb" className="mb-6 text-sm text-white/60">
          <Link to="/" className="hover:text-[#dbff00]">Inicio</Link>
          <span className="mx-2">/</span>
          <span className="text-white">Artistas</span>
        </nav>

        <h1 className="font-display text-4xl uppercase tracking-tight md:text-6xl">
          Artistas en gira por España
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-white/70">
          Directorio de {ARTIST_LANDINGS.length} artistas con fechas confirmadas en España:
          en qué recinto tocan, qué día y cómo llegar sin pagar un taxi nocturno.
          El coche compartido arranca en 3 €/asiento y se paga directamente al
          conductor — ConcertRide no cobra comisión.
        </p>

        <ul className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((a) => {
            const next = a.upcomingConcerts.find((c) => c.date !== "TBD");
            return (
              <li key={a.slug}>
                <Link
                  to={`/artistas/${a.slug}`}
                  className="block rounded-xl border border-white/10 bg-white/5 p-5 transition-colors hover:border-[#dbff00]/50"
                >
                  <h2 className="font-display text-xl uppercase tracking-tight">{a.name}</h2>
                  <p className="mt-1 text-sm text-white/60">
                    {next ? `${next.city} · ${next.venue}` : a.genre.join(" · ")}
                  </p>
                  <p className="mt-3 text-sm text-white/70 line-clamp-3">{a.blurb}</p>
                </Link>
              </li>
            );
          })}
        </ul>

        {rest.length > 0 ? (
          <details className="mt-10 rounded-xl border border-white/10 bg-white/5 p-5">
            <summary className="cursor-pointer font-display text-lg uppercase tracking-tight">
              Ver todos los artistas ({ARTIST_LANDINGS.length})
            </summary>
            <ul className="mt-4 grid gap-2 text-sm md:grid-cols-2 lg:grid-cols-3">
              {rest.map((a) => (
                <li key={a.slug}>
                  <Link to={`/artistas/${a.slug}`} className="text-white/80 hover:text-[#dbff00]">
                    {a.name}
                  </Link>
                </li>
              ))}
            </ul>
          </details>
        ) : null}
      </div>
    </main>
  );
}
