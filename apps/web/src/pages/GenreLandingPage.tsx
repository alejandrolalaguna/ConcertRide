import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowRight, Music } from "lucide-react";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";
import { GENRE_LANDINGS, GENRE_LANDINGS_BY_SLUG, GENRE_SLUGS, getGenreFestivals } from "@/lib/genreLandings";
import type { FestivalLanding } from "@/lib/festivalLandings";

// Genre-level price reference table for AI overview citability
const GENRE_PRICE_REF: Record<string, Array<{ from: string; to: string; range: string }>> = {
  rock: [
    { from: "Madrid", to: "Viña Rock (Albacete)", range: "9–13 €/asiento" },
    { from: "Madrid", to: "Mad Cool (Madrid)", range: "3–6 €/asiento" },
    { from: "Madrid", to: "Resurrection Fest (Viveiro)", range: "16–22 €/asiento" },
    { from: "Barcelona", to: "Mad Cool (Madrid)", range: "15–20 €/asiento" },
    { from: "Bilbao", to: "BBK Live (Bilbao)", range: "3–5 €/asiento" },
  ],
  indie: [
    { from: "Madrid", to: "Primavera Sound (Barcelona)", range: "15–20 €/asiento" },
    { from: "Madrid", to: "Sonorama (Aranda de Duero)", range: "10–14 €/asiento" },
    { from: "Valencia", to: "FIB (Benicàssim)", range: "5–8 €/asiento" },
    { from: "Bilbao", to: "Mad Cool (Madrid)", range: "11–16 €/asiento" },
    { from: "Madrid", to: "Low Festival (Benidorm)", range: "12–17 €/asiento" },
  ],
  electronica: [
    { from: "Madrid", to: "Medusa (Cullera)", range: "12–17 €/asiento" },
    { from: "Valencia", to: "Medusa (Cullera)", range: "3–6 €/asiento" },
    { from: "Madrid", to: "Sónar (Barcelona)", range: "15–20 €/asiento" },
    { from: "Murcia", to: "Medusa (Cullera)", range: "5–8 €/asiento" },
    { from: "Madrid", to: "Arenal Sound (Burriana)", range: "11–16 €/asiento" },
  ],
  reggaeton: [
    { from: "Barcelona", to: "RBF Salou", range: "4–7 €/asiento" },
    { from: "Madrid", to: "RBF Salou", range: "15–20 €/asiento" },
    { from: "Valencia", to: "RBF Salou", range: "6–10 €/asiento" },
    { from: "Zaragoza", to: "Vive Latino (Zaragoza)", range: "3–5 €/asiento" },
    { from: "Madrid", to: "Vive Latino (Zaragoza)", range: "9–13 €/asiento" },
  ],
  metal: [
    { from: "Madrid", to: "Resurrection Fest (Viveiro)", range: "16–22 €/asiento" },
    { from: "A Coruña", to: "Resurrection Fest (Viveiro)", range: "5–8 €/asiento" },
    { from: "Oviedo", to: "Resurrection Fest (Viveiro)", range: "8–12 €/asiento" },
    { from: "Madrid", to: "Viña Rock (Albacete)", range: "9–13 €/asiento" },
    { from: "Bilbao", to: "Atlantic Fest (Ponteceso)", range: "10–15 €/asiento" },
  ],
  pop: [
    { from: "Madrid", to: "Mad Cool (Madrid)", range: "3–6 €/asiento" },
    { from: "Valencia", to: "FIB (Benicàssim)", range: "5–8 €/asiento" },
    { from: "Madrid", to: "Granada Sound (Granada)", range: "13–18 €/asiento" },
    { from: "Madrid", to: "Arenal Sound (Burriana)", range: "11–16 €/asiento" },
    { from: "Barcelona", to: "Starlite Marbella", range: "20–28 €/asiento" },
  ],
  "world-music": [
    { from: "Zaragoza", to: "Pirineos Sur (Sallent de Gállego)", range: "6–9 €/asiento" },
    { from: "A Coruña", to: "Ortigueira", range: "3–5 €/asiento" },
    { from: "Madrid", to: "Jazzaldia (Donostia)", range: "11–16 €/asiento" },
    { from: "Madrid", to: "Cruïlla (Barcelona)", range: "15–20 €/asiento" },
    { from: "Bilbao", to: "Jazzaldia (Donostia)", range: "4–7 €/asiento" },
  ],
  "folk-flamenco": [
    { from: "A Coruña", to: "Ortigueira", range: "3–5 €/asiento" },
    { from: "Sevilla", to: "Tío Pepe Festival (Jerez)", range: "3–6 €/asiento" },
    { from: "Madrid", to: "Ortigueira", range: "16–22 €/asiento" },
    { from: "Vigo", to: "PortAmérica (Catoira)", range: "4–7 €/asiento" },
    { from: "Madrid", to: "Tío Pepe Festival (Jerez)", range: "13–18 €/asiento" },
  ],
};

export default function GenreLandingPage() {
  const { slug } = useParams<{ slug: string }>();
  const genre = slug ? GENRE_LANDINGS_BY_SLUG[slug] : undefined;

  if (!slug || !genre) return <Navigate to="/festivales" replace />;

  const festivals = getGenreFestivals(genre) as FestivalLanding[];
  const priceRows = GENRE_PRICE_REF[genre.slug] ?? [];
  const year = 2026;

  useSeoMeta({
    title: `${genre.nameFull} ${year} · Transporte y carpooling | ConcertRide`,
    description: `${genre.nameFull} ${year}: ${festivals.slice(0, 4).map((f) => f.shortName).join(", ")} y más. Carpooling desde ${priceRows[0]?.range ?? "3 €/asiento"}. Conductores verificados, 0% comisión.`,
    canonical: `${SITE_URL}/festivales-genero/${genre.slug}`,
    keywords: [
      `festivales ${genre.name.toLowerCase()} España ${year}`,
      `festivales ${genre.name.toLowerCase()} España`,
      `carpooling festivales ${genre.name.toLowerCase()}`,
      `transporte festivales ${genre.name.toLowerCase()}`,
      ...festivals.map((f) => `carpooling ${f.shortName}`),
      `viaje compartido festival ${genre.name.toLowerCase()}`,
      `cómo llegar festival ${genre.name.toLowerCase()}`,
    ].join(", "),
  });

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Festivales", item: `${SITE_URL}/festivales` },
      {
        "@type": "ListItem",
        position: 3,
        name: genre.nameFull,
        item: `${SITE_URL}/festivales-genero/${genre.slug}`,
      },
    ],
  };

  const jsonLdCollectionPage = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${genre.nameFull} ${year} · carpooling sin comisión`,
    url: `${SITE_URL}/festivales-genero/${genre.slug}`,
    description: genre.blurb,
    inLanguage: "es-ES",
    dateModified: new Date().toISOString().slice(0, 10),
    about: { "@type": "MusicGenre", name: genre.name },
    hasPart: festivals.map((f) => ({
      "@type": "WebPage",
      url: `${SITE_URL}/festivales/${f.slug}`,
      name: `Cómo ir a ${f.name} ${year} | ConcertRide`,
      description: `Carpooling a ${f.shortName} (${f.venue}, ${f.city}).`,
    })),
    isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: "ConcertRide", url: SITE_URL },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".speakable", ".genre-blurb"],
    },
  };

  const jsonLdItemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${genre.nameFull} ${year}`,
    description: genre.blurb,
    url: `${SITE_URL}/festivales-genero/${genre.slug}`,
    numberOfItems: festivals.length,
    itemListElement: festivals.map((f, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: f.name,
      url: `${SITE_URL}/festivales/${f.slug}`,
      description: `${f.shortName} — ${f.venue}, ${f.city}. ${f.typicalDates}. Capacidad: ${f.capacity}.`,
    })),
  };

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: "es-ES",
    mainEntity: genre.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <main id="main" className="min-h-dvh bg-cr-bg text-cr-text pt-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdCollectionPage) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdItemList) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />

      {/* ── Hero ── */}
      <div className="max-w-6xl mx-auto px-6 pt-10 pb-6 space-y-4">
        <nav aria-label="Breadcrumb" className="font-mono text-[11px] text-cr-text-muted flex items-center gap-2">
          <Link to="/" className="hover:text-cr-primary">Inicio</Link>
          <span aria-hidden="true">/</span>
          <Link to="/festivales" className="hover:text-cr-primary">Festivales</Link>
          <span aria-hidden="true">/</span>
          <span className="text-cr-text-muted">{genre.name}</span>
        </nav>

        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary inline-flex items-center gap-2">
          <Music size={12} /> Género musical
        </p>

        <h1 className="font-display text-4xl md:text-6xl uppercase leading-[0.92]">
          {genre.nameFull.toUpperCase()} {year}
        </h1>

        <p className="font-sans text-sm md:text-base text-cr-text-muted max-w-2xl leading-relaxed speakable genre-blurb">
          {genre.blurb}
        </p>

        <div className="flex flex-wrap gap-4 pt-2">
          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-cr-text-muted border border-cr-border px-2 py-1">
            {genre.emoji} {genre.name}
          </span>
          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-cr-text-muted border border-cr-border px-2 py-1">
            {festivals.length} {festivals.length === 1 ? "festival" : "festivales"} en ConcertRide
          </span>
        </div>
      </div>

      {/* ── Festival cards ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <h2 className="font-display text-2xl md:text-3xl uppercase">
          {genre.nameFull} en {year}
        </h2>
        <p className="font-sans text-sm text-cr-text-muted max-w-2xl">
          Festivales de {genre.name.toLowerCase()} con carpooling disponible en España para {year}. Precio por asiento sin comisión.
        </p>

        {festivals.length === 0 ? (
          <div className="border border-dashed border-cr-border p-10 text-center space-y-3">
            <p className="font-display text-xl uppercase text-cr-text-muted">Próximamente más festivales</p>
            <Link
              to="/festivales"
              className="inline-block font-sans text-xs font-semibold uppercase tracking-[0.12em] border-2 border-cr-primary text-cr-primary px-4 py-2 hover:bg-cr-primary hover:text-black transition-colors"
            >
              Ver todos los festivales →
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {festivals.map((f, i) => (
              <Link
                key={f.slug}
                to={`/festivales/${f.slug}`}
                className={`border p-5 space-y-3 hover:border-cr-primary/50 transition-colors block ${i === 0 ? "border-cr-primary/40 bg-cr-primary/5" : "border-cr-border"}`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="space-y-1">
                    {i === 0 && (
                      <p className="font-mono text-[10px] text-cr-primary uppercase tracking-[0.14em]">
                        Destacado
                      </p>
                    )}
                    <h3 className="font-display text-lg uppercase leading-tight">{f.shortName}</h3>
                    <p className="font-mono text-[11px] text-cr-text-muted">{f.venue}, {f.city}</p>
                  </div>
                  <span className="font-mono text-xs text-cr-primary font-semibold shrink-0">
                    {f.originCities[0]?.concertRideRange ?? "desde 3 €"}
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 font-mono text-[11px] text-cr-text-dim">
                  <span>{f.typicalDates}</span>
                  <span>·</span>
                  <span>{f.capacity}</span>
                </div>

                <p className="font-sans text-xs text-cr-text-muted leading-relaxed line-clamp-3">
                  {f.blurb}
                </p>

                <p className="font-sans text-xs text-cr-primary inline-flex items-center gap-1">
                  Ver transporte y carpooling <ArrowRight size={10} />
                </p>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* ── Carpooling price table ── */}
      {priceRows.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
          <h2 className="font-display text-2xl md:text-3xl uppercase">
            Precios de carpooling a festivales de {genre.name.toLowerCase()}
          </h2>
          <p className="font-sans text-sm text-cr-text-muted max-w-2xl">
            Precio medio por asiento con ConcertRide desde las principales ciudades de origen.
            El 100&nbsp;% va al conductor, sin comisión.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full font-sans text-xs border-collapse">
              <thead>
                <tr className="border-b border-cr-border text-left">
                  <th className="py-2 pr-4 font-semibold text-cr-text">Desde</th>
                  <th className="py-2 pr-4 font-semibold text-cr-text">Hasta</th>
                  <th className="py-2 pr-4 font-semibold text-cr-text">Precio por asiento</th>
                  <th className="py-2 font-semibold text-cr-text">Comisión</th>
                </tr>
              </thead>
              <tbody className="text-cr-text-muted">
                {priceRows.map((row) => (
                  <tr key={`${row.from}-${row.to}`} className="border-b border-cr-border/50">
                    <td className="py-2 pr-4 font-semibold text-cr-text">{row.from}</td>
                    <td className="py-2 pr-4">{row.to}</td>
                    <td className="py-2 pr-4 font-semibold text-cr-primary">{row.range}</td>
                    <td className="py-2 font-semibold text-cr-primary">0 %</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="font-mono text-[10px] text-cr-text-dim">
            Precios orientativos basados en tarifas reales publicadas en ConcertRide. El conductor fija el precio
            por asiento para cubrir combustible y peajes (tarifa MITECO de referencia). Sin comisión de plataforma.
          </p>
        </section>
      )}

      {/* ── FAQ ── */}
      {genre.faqs.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
          <h2 className="font-display text-2xl md:text-3xl uppercase">
            Preguntas frecuentes — {genre.nameFull}
          </h2>
          <dl className="space-y-6">
            {genre.faqs.map((faq) => (
              <div key={faq.q} className="border-b border-cr-border pb-6 space-y-2">
                <dt className="font-display text-base uppercase text-cr-text">{faq.q}</dt>
                <dd className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">{faq.a}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {/* ── Other genres hub ── */}
      <section className="max-w-6xl mx-auto px-6 pb-12 border-t border-cr-border pt-10">
        <h2 className="font-display text-lg uppercase text-cr-text-muted mb-4">
          Otros géneros musicales
        </h2>
        <ul className="flex flex-wrap gap-2">
          {GENRE_LANDINGS.filter((g) => g.slug !== genre.slug).map((g) => (
            <li key={g.slug}>
              <Link
                to={`/festivales-genero/${g.slug}`}
                className="inline-flex items-center gap-1.5 font-sans text-xs text-cr-text-muted hover:text-cr-primary border border-cr-border hover:border-cr-primary px-3 py-1.5 transition-colors"
              >
                {g.emoji} {g.name}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Related genres ── */}
      {genre.relatedGenres.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pb-8 border-t border-cr-border pt-8">
          <p className="font-mono text-[11px] text-cr-text-dim">
            Géneros relacionados: {genre.relatedGenres.join(" · ")}
          </p>
        </section>
      )}

      {/* ── CTA ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12">
        <div className="border border-cr-primary/30 bg-cr-primary/5 p-8 space-y-4 text-center">
          <h2 className="font-display text-2xl md:text-3xl uppercase">
            ¿Vas a un festival de {genre.name.toLowerCase()} en {year}?
          </h2>
          <p className="font-sans text-sm text-cr-text-muted max-w-xl mx-auto">
            Busca un viaje compartido o publica el tuyo en ConcertRide. Sin comisión, pago en
            efectivo o Bizum el día del festival.
          </p>
          <div className="flex flex-wrap gap-3 justify-center pt-2">
            <Link
              to="/concerts"
              className="inline-block font-sans text-xs font-semibold uppercase tracking-[0.12em] bg-cr-primary text-black px-5 py-2.5 hover:bg-cr-primary/90 transition-colors"
            >
              Buscar viaje →
            </Link>
            <Link
              to="/publish"
              className="inline-block font-sans text-xs font-semibold uppercase tracking-[0.12em] border-2 border-cr-primary text-cr-primary px-5 py-2.5 hover:bg-cr-primary hover:text-black transition-colors"
            >
              Publicar viaje
            </Link>
          </div>
        </div>
      </section>

      {/* ── Legal ── */}
      <section className="max-w-6xl mx-auto px-6 pb-10 border-t border-cr-border pt-8">
        <p className="font-mono text-[11px] text-cr-text-dim leading-relaxed">
          ConcertRide no es un socio oficial ni representante de ninguno de los festivales mencionados.
          Los nombres de festivales se utilizan con carácter meramente descriptivo para identificar el destino del viaje.{" "}
          <Link to="/aviso-legal" className="underline underline-offset-2 hover:text-cr-primary transition-colors">
            Aviso legal
          </Link>
          .
        </p>
      </section>
    </main>
  );
}

// Export slug list for prerender/entry-server
export { GENRE_SLUGS };
