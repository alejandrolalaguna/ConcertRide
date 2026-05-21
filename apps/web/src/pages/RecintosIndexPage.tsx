import { Link } from "react-router-dom";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";
import { VENUE_LANDINGS } from "@/lib/venueLandings";

export default function RecintosIndexPage() {
  const year = new Date().getFullYear();
  const url = `${SITE_URL}/recintos`;

  useSeoMeta({
    title: `Recintos de conciertos en España ${year}: cómo llegar con carpooling | ConcertRide`,
    description: `Guías de transporte para ${VENUE_LANDINGS.length}+ recintos de conciertos en España: WiZink Center, Palau Sant Jordi, IFEMA, Kobetamendi, Estadi Olímpic y más. Carpooling desde 3€/asiento.`,
    canonical: url,
  });

  const featured = VENUE_LANDINGS.slice(0, 24);

  const collectionLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#webpage`,
    url,
    name: `Recintos de conciertos en España ${year} — cómo llegar`,
    description: `Directorio de ${VENUE_LANDINGS.length} recintos de conciertos en España con guías de transporte y carpooling.`,
    inLanguage: "es-ES",
    numberOfItems: VENUE_LANDINGS.length,
    isPartOf: { "@id": `${SITE_URL}/#website` },
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Recintos", item: url },
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
          <span className="text-white">Recintos</span>
        </nav>
        <h1 className="font-display text-4xl uppercase tracking-tight md:text-6xl">
          Recintos de conciertos en España
        </h1>
        <p className="mt-4 max-w-3xl text-lg text-white/70">
          Directorio de {VENUE_LANDINGS.length} recintos con guías de transporte: cómo llegar en
          metro, bus, tren o carpooling. Precios orientativos desde 3 €/asiento.
        </p>

        <ul className="mt-12 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {featured.map((v) => (
            <li
              key={v.slug}
              className="rounded-xl border border-white/10 bg-white/5 p-5 transition hover:border-[#dbff00]/40 hover:bg-white/10"
            >
              <Link to={`/recintos/${v.slug}`} className="block">
                <h2 className="font-display text-xl uppercase tracking-tight">{v.name}</h2>
                <p className="mt-1 text-sm text-white/60">
                  {v.city} · {v.venueType} · {v.capacity}
                </p>
                <p className="mt-3 text-sm text-white/70 line-clamp-3">{v.blurb}</p>
              </Link>
            </li>
          ))}
        </ul>

        {VENUE_LANDINGS.length > featured.length ? (
          <details className="mt-10 rounded-xl border border-white/10 bg-white/5 p-5">
            <summary className="cursor-pointer font-display text-lg uppercase tracking-tight">
              Ver todos los recintos ({VENUE_LANDINGS.length})
            </summary>
            <ul className="mt-4 grid gap-2 text-sm md:grid-cols-2 lg:grid-cols-3">
              {VENUE_LANDINGS.slice(featured.length).map((v) => (
                <li key={v.slug}>
                  <Link to={`/recintos/${v.slug}`} className="text-white/80 hover:text-[#dbff00]">
                    {v.name} · {v.city}
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
