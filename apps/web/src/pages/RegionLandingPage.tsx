import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowRight, MapPin } from "lucide-react";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";
import { REGION_LANDINGS, REGION_LANDINGS_BY_SLUG } from "@/lib/regionLandings";
import { FESTIVAL_LANDINGS_BY_SLUG, type FestivalLanding } from "@/lib/festivalLandings";
import { StickyRegBar } from "@/components/StickyRegBar";

// Carpooling price reference per (region, origin city) pair — citable by AI overviews
const REGION_PRICE_TABLE: Record<string, Array<{ city: string; range: string; km: string }>> = {
  "madrid": [
    { city: "Valencia", range: "10–14 €/asiento", km: "355 km" },
    { city: "Zaragoza", range: "9–13 €/asiento", km: "325 km" },
    { city: "Barcelona", range: "15–20 €/asiento", km: "620 km" },
    { city: "Bilbao", range: "11–16 €/asiento", km: "395 km" },
    { city: "Sevilla", range: "13–18 €/asiento", km: "530 km" },
    { city: "Madrid", range: "4–7 €/asiento", km: "0–20 km" },
  ],
  "cataluna": [
    { city: "Madrid", range: "15–20 €/asiento", km: "620 km" },
    { city: "Valencia", range: "10–14 €/asiento", km: "355 km" },
    { city: "Zaragoza", range: "8–12 €/asiento", km: "306 km" },
    { city: "Bilbao", range: "15–20 €/asiento", km: "615 km" },
    { city: "Tarragona", range: "4–7 €/asiento", km: "100 km" },
  ],
  "comunidad-valenciana": [
    { city: "Madrid", range: "12–17 €/asiento", km: "460 km" },
    { city: "Barcelona", range: "8–12 €/asiento", km: "305 km" },
    { city: "Murcia", range: "5–8 €/asiento", km: "120 km" },
    { city: "Zaragoza", range: "8–12 €/asiento", km: "275 km" },
    { city: "Valencia", range: "3–6 €/asiento", km: "10–70 km" },
  ],
  "pais-vasco": [
    { city: "Madrid", range: "11–16 €/asiento", km: "395 km" },
    { city: "Santander", range: "4–7 €/asiento", km: "100 km" },
    { city: "Pamplona", range: "5–8 €/asiento", km: "155 km" },
    { city: "Donostia", range: "4–7 €/asiento", km: "100 km" },
    { city: "Vitoria-Gasteiz", range: "3–6 €/asiento", km: "65 km" },
  ],
  "andalucia": [
    { city: "Sevilla", range: "6–9 €/asiento", km: "200 km" },
    { city: "Granada", range: "5–8 €/asiento", km: "170 km" },
    { city: "Madrid", range: "12–18 €/asiento", km: "550 km" },
    { city: "Córdoba", range: "5–8 €/asiento", km: "180 km" },
    { city: "Barcelona", range: "18–25 €/asiento", km: "1.000 km" },
  ],
  "galicia": [
    { city: "A Coruña", range: "4–7 €/asiento", km: "100 km" },
    { city: "Vigo", range: "6–9 €/asiento", km: "200 km" },
    { city: "Santiago de Compostela", range: "6–9 €/asiento", km: "185 km" },
    { city: "Madrid", range: "16–22 €/asiento", km: "600 km" },
    { city: "Bilbao", range: "10–15 €/asiento", km: "375 km" },
  ],
  "castilla-leon": [
    { city: "Madrid", range: "10–14 €/asiento", km: "155 km" },
    { city: "Valladolid", range: "8–12 €/asiento", km: "100 km" },
    { city: "Burgos", range: "5–8 €/asiento", km: "60 km" },
    { city: "Bilbao", range: "7–11 €/asiento", km: "185 km" },
    { city: "Salamanca", range: "8–12 €/asiento", km: "190 km" },
  ],
  "castilla-la-mancha": [
    { city: "Madrid", range: "6–9 €/asiento", km: "220 km" },
    { city: "Valencia", range: "6–9 €/asiento", km: "200 km" },
    { city: "Murcia", range: "5–8 €/asiento", km: "155 km" },
    { city: "Albacete", range: "3–5 €/asiento", km: "50 km" },
    { city: "Toledo", range: "5–7 €/asiento", km: "160 km" },
  ],
};

export default function RegionLandingPage() {
  const { slug } = useParams<{ slug: string }>();
  const region = slug ? REGION_LANDINGS_BY_SLUG[slug] : undefined;

  if (!slug || !region) return <Navigate to="/festivales" replace />;

  const year = 2026;
  const priceRows = REGION_PRICE_TABLE[region.slug] ?? [];

  const festivalsData = region.festivalsInRegion
    .map((s) => FESTIVAL_LANDINGS_BY_SLUG[s])
    .filter((f): f is FestivalLanding => f !== undefined);

  const nearbyCity = region.mainCities[1] ?? region.mainCities[0] ?? "otras ciudades";

  // ── SEO meta ──────────────────────────────────────────────────────────────
  // Build a 135–155 char description with a 3-tier fallback so regions with
  // many festivals (e.g. Comunitat Valenciana with 5+ shortNames) don't
  // overflow 160 chars, and regions with 0–1 festivals still reach 135+.
  const regionFestNames = festivalsData.map((f) => f.shortName);
  const regionPriceRange = priceRows[0]?.range ?? "3 €/asiento";
  // Try 3 festivals, then 2, then 1, then drop the festival list entirely.
  const buildRegionDesc = (n: number) =>
    `Festivales en ${region.name} ${year}: ${regionFestNames.slice(0, n).join(", ")}. Carpooling desde ${nearbyCity} desde ${regionPriceRange}, 0 % comisión, vuelta nocturna y conductores verificados.`;
  const regionDescNoFest = `Festivales en ${region.name} ${year}: agenda actualizada y carpooling desde ${nearbyCity} desde ${regionPriceRange}, 0 % comisión, vuelta nocturna y conductores verificados.`;
  let regionDescription = "";
  for (const n of [3, 2, 1]) {
    if (regionFestNames.length < n) continue;
    const candidate = buildRegionDesc(n);
    if (candidate.length <= 158) {
      regionDescription = candidate;
      break;
    }
  }
  if (!regionDescription) {
    regionDescription = regionDescNoFest.length <= 158
      ? regionDescNoFest
      : `Festivales en ${region.name} ${year} — carpooling 0 % comisión, vuelta nocturna y conductores verificados desde ${regionPriceRange} en ConcertRide.`;
  }
  useSeoMeta({
    title: `Festivales en ${region.displayName} ${year} · Carpooling | ConcertRide`,
    description: regionDescription,
    canonical: `${SITE_URL}/festivales-en/${region.slug}`,
    keywords: [
      `festivales ${region.displayName} ${year}`,
      `festivales en ${region.name}`,
      `carpooling festivales ${region.displayName}`,
      `cómo llegar festivales ${region.displayName}`,
      `transporte festivales ${region.name}`,
      ...festivalsData.map((f) => `carpooling ${f.shortName}`),
      ...festivalsData.map((f) => `cómo ir a ${f.shortName}`),
      `viaje compartido ${region.displayName} festival`,
    ].join(", "),
    geoRegion: region.isoCode,
    geoPlacename: region.name,
    geoLat: region.lat,
    geoLng: region.lng,
  });

  // ── JSON-LD ───────────────────────────────────────────────────────────────
  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Festivales", item: `${SITE_URL}/festivales` },
      {
        "@type": "ListItem",
        position: 3,
        name: `Festivales en ${region.displayName}`,
        item: `${SITE_URL}/festivales-en/${region.slug}`,
      },
    ],
  };

  const jsonLdAdminArea = {
    "@context": "https://schema.org",
    "@type": "AdministrativeArea",
    name: region.name,
    alternateName: region.displayName,
    identifier: region.isoCode,
    url: `${SITE_URL}/festivales-en/${region.slug}`,
    geo: {
      "@type": "GeoCoordinates",
      latitude: region.lat,
      longitude: region.lng,
    },
    // Reference the canonical MusicEvent on each festival page by @id.
    // A pure @id ref is treated as a reference by Google's JSON-LD parser
    // and avoids "missing field" errors for image/description/organizer/
    // offers/performer/eventStatus that would otherwise trigger on every
    // region page (one error per nested festival × ~10 regions).
    containsPlace: festivalsData.map((f) => ({
      "@id": `${SITE_URL}/festivales/${f.slug}#event`,
    })),
    description: region.blurb,
    inLanguage: "es-ES",
  };

  const jsonLdCollectionPage = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Festivales en ${region.displayName} ${year} · carpooling sin comisión`,
    url: `${SITE_URL}/festivales-en/${region.slug}`,
    description: region.blurb,
    inLanguage: "es-ES",
    dateModified: new Date().toISOString().slice(0, 10),
    about: {
      "@type": "AdministrativeArea",
      name: region.name,
      identifier: region.isoCode,
    },
    hasPart: festivalsData.map((f) => ({
      "@type": "WebPage",
      url: `${SITE_URL}/festivales/${f.slug}`,
      name: `Cómo ir a ${f.name} ${year} | ConcertRide`,
      description: `Carpooling a ${f.shortName} (${f.venue}, ${f.city}). Desde ${f.originCities[0]?.concertRideRange ?? "3 €/asiento"}. Fechas: ${f.typicalDates}.`,
    })),
    isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: "ConcertRide", url: SITE_URL },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".speakable", ".region-blurb", "article p:first-of-type"],
    },
  };

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: "es-ES",
    mainEntity: region.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <main id="main" className="min-h-dvh bg-cr-bg text-cr-text pt-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdAdminArea) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdCollectionPage) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />

      {/* ── Hero ── */}
      <div className="max-w-6xl mx-auto px-6 pt-10 pb-6 space-y-4">
        <nav aria-label="Breadcrumb" className="font-mono text-[11px] text-cr-text-muted flex items-center gap-2">
          <Link to="/" className="hover:text-cr-primary">Inicio</Link>
          <span aria-hidden="true">/</span>
          <Link to="/festivales" className="hover:text-cr-primary">Festivales</Link>
          <span aria-hidden="true">/</span>
          <span className="text-cr-text-muted">{region.displayName}</span>
        </nav>

        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary inline-flex items-center gap-2">
          <MapPin size={12} /> {region.isoCode}
        </p>

        <h1 className="font-display text-4xl md:text-6xl uppercase leading-[0.92]">
          FESTIVALES EN {region.displayName.toUpperCase()} {year}
        </h1>

        <p className="font-sans text-sm md:text-base text-cr-text-muted max-w-2xl leading-relaxed speakable region-blurb">
          {region.blurb}
        </p>

        <div className="flex flex-wrap gap-4 pt-2">
          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-cr-text-muted border border-cr-border px-2 py-1">
            <MapPin size={10} /> {region.name}
          </span>
          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-cr-text-muted border border-cr-border px-2 py-1">
            {festivalsData.length} {festivalsData.length === 1 ? "festival" : "festivales"} en ConcertRide
          </span>
        </div>

        <div className="flex flex-wrap gap-3 pt-3">
          <Link
            to="/festivales"
            className="inline-flex items-center justify-center font-sans text-sm font-bold uppercase tracking-wider bg-cr-primary text-black px-5 py-3 shadow-[4px_4px_0_0_rgba(219,255,0,0.25)] hover:shadow-[6px_6px_0_0_rgba(219,255,0,0.4)] transition-shadow"
          >
            Ver festivales en {region.displayName}
          </Link>
          <Link
            to="/publish"
            className="inline-flex items-center justify-center font-sans text-sm font-bold uppercase tracking-wider border-2 border-cr-border text-cr-text px-5 py-3 hover:border-cr-primary hover:text-cr-primary transition-colors"
          >
            Publicar mi viaje
          </Link>
        </div>
      </div>

      {/* ── Festival cards ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <h2 className="font-display text-2xl md:text-3xl uppercase">
          Festivales en {region.displayName} {year}
        </h2>
        <p className="font-sans text-sm text-cr-text-muted max-w-2xl">
          Festivales de música con carpooling disponible en {region.name} para {year}. Precios por asiento sin comisión.
        </p>

        {festivalsData.length === 0 ? (
          <div className="border border-dashed border-cr-border p-10 text-center space-y-3">
            <p className="font-display text-xl uppercase text-cr-text-muted">
              Próximamente más festivales
            </p>
            <p className="font-sans text-sm text-cr-text-muted">
              Explora todos los festivales disponibles en ConcertRide.
            </p>
            <Link
              to="/festivales"
              className="inline-block font-sans text-sm font-semibold uppercase tracking-[0.12em] border-2 border-cr-primary text-cr-primary px-5 py-3 hover:bg-cr-primary hover:text-black transition-colors"
            >
              Ver todos los festivales →
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {festivalsData.map((f) => {
              const highlight = f.slug === region.upcomingFestivalHighlight;
              return (
                <Link
                  key={f.slug}
                  to={`/festivales/${f.slug}`}
                  className={`border p-5 space-y-3 hover:border-cr-primary/50 transition-colors block ${highlight ? "border-cr-primary/40 bg-cr-primary/5" : "border-cr-border"}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="space-y-1">
                      {highlight && (
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
              );
            })}
          </div>
        )}
      </section>

      {/* ── Cómo llegar desde la ciudad más cercana ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <h2 className="font-display text-2xl md:text-3xl uppercase">
          Cómo llegar a los festivales de {region.displayName} desde {nearbyCity}
        </h2>
        <p className="font-sans text-sm text-cr-text-muted max-w-3xl leading-relaxed speakable">
          Los festivales de {region.name} están distribuidos por distintos municipios de la región.
          La mayoría carecen de transporte público nocturno directo desde {nearbyCity}, lo que
          convierte el carpooling con ConcertRide en la opción más utilizada para llegar y volver
          del festival a cualquier hora sin depender de taxis o del último autobús.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3 font-sans text-sm">
          <article className="border border-cr-border p-4 space-y-2">
            <h3 className="font-display text-base uppercase text-cr-primary">Autobús / Bus</h3>
            <p className="text-cr-text-muted text-xs leading-relaxed">
              Algunos festivales habilitan buses lanzadera oficiales desde la ciudad más
              cercana, con plazas limitadas y horario diurno. Los autobuses de larga
              distancia (ALSA, FlixBus, Avanza) llegan a la estación, no al recinto.
            </p>
          </article>
          <article className="border border-cr-border p-4 space-y-2">
            <h3 className="font-display text-base uppercase text-cr-primary">Tren</h3>
            <p className="text-cr-text-muted text-xs leading-relaxed">
              El AVE o Cercanías Renfe llega habitualmente a la estación más cercana,
              no al recinto. La vuelta de madrugada en tren es casi siempre imposible:
              el último servicio suele salir antes del cabeza de cartel.
            </p>
          </article>
          <article className="border border-cr-border p-4 space-y-2">
            <h3 className="font-display text-base uppercase text-cr-primary">Coche propio</h3>
            <p className="text-cr-text-muted text-xs leading-relaxed">
              Llegada directa al recinto con máxima flexibilidad. Coste: combustible
              + peajes + parking (5–18 €/día). En recintos con parking limitado, los
              accesos colapsan en hora punta.
            </p>
          </article>
          <article className="border border-cr-border p-4 space-y-2">
            <h3 className="font-display text-base uppercase text-cr-primary">Coche compartido</h3>
            <p className="text-cr-text-muted text-xs leading-relaxed">
              Carpooling con ConcertRide desde {region.mainCities.length} ciudades de origen.
              Sin comisión: el 100&nbsp;% va al conductor. Vuelta flexible, pago
              en efectivo o Bizum.
            </p>
          </article>
        </div>
      </section>

      {/* ── Carpooling price table ── */}
      {priceRows.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
          <h2 className="font-display text-2xl md:text-3xl uppercase">
            Precios de carpooling a festivales de {region.displayName}
          </h2>
          <p className="font-sans text-sm text-cr-text-muted max-w-2xl">
            Precio medio por asiento con ConcertRide desde las principales ciudades de origen.
            El 100&nbsp;% va al conductor, sin comisión.
          </p>

          <div className="overflow-x-auto">
            <table className="w-full font-sans text-xs border-collapse">
              <thead>
                <tr className="border-b border-cr-border text-left">
                  <th className="py-2 pr-4 font-semibold text-cr-text">Ciudad de origen</th>
                  <th className="py-2 pr-4 font-semibold text-cr-text">Distancia</th>
                  <th className="py-2 pr-4 font-semibold text-cr-text">Precio por asiento</th>
                  <th className="py-2 font-semibold text-cr-text">Comisión</th>
                </tr>
              </thead>
              <tbody className="text-cr-text-muted">
                {priceRows.map((row) => (
                  <tr key={row.city} className="border-b border-cr-border/50">
                    <td className="py-2 pr-4 font-semibold text-cr-text">{row.city}</td>
                    <td className="py-2 pr-4">{row.km}</td>
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

      {/* ── Por qué ConcertRide ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <h2 className="font-display text-2xl md:text-3xl uppercase">
          Por qué ir a festivales de {region.displayName} con ConcertRide
        </h2>
        <div className="grid md:grid-cols-3 gap-4 font-sans text-sm text-cr-text-muted leading-relaxed">
          <article className="space-y-2">
            <h3 className="font-display text-base uppercase text-cr-primary">Sin intermediarios</h3>
            <p>
              El 100&nbsp;% del precio del asiento va al conductor. ConcertRide no cobra comisión,
              nunca. El pago es en efectivo o Bizum el día del viaje.
            </p>
          </article>
          <article className="space-y-2">
            <h3 className="font-display text-base uppercase text-cr-primary">Conductores verificados</h3>
            <p>
              Todos los conductores verifican su carnet de conducir antes de publicar.
              Puedes ver sus valoraciones y reseñas de otros pasajeros.
            </p>
          </article>
          <article className="space-y-2">
            <h3 className="font-display text-base uppercase text-cr-primary">Horario flexible</h3>
            <p>
              Llegas y vuelves en el horario que quieras. No dependes del último metro
              ni de taxis a precio de festival (30–90&nbsp;€ de madrugada).
            </p>
          </article>
        </div>

        <div className="pt-6 flex flex-wrap gap-4 border-t border-cr-border">
          <Link
            to="/concerts"
            className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-cr-text-muted hover:text-cr-primary transition-colors"
          >
            Ver todos los conciertos <ArrowRight size={12} />
          </Link>
          <Link
            to="/como-funciona"
            className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-cr-text-muted hover:text-cr-primary transition-colors"
          >
            Cómo funciona <ArrowRight size={12} />
          </Link>
          <Link
            to="/publish"
            className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-cr-primary border-b border-cr-primary hover:text-cr-primary/80 transition-colors ml-auto"
          >
            Publicar un viaje <ArrowRight size={12} />
          </Link>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <h2 className="font-display text-2xl md:text-3xl uppercase">
          Preguntas frecuentes — Festivales en {region.displayName}
        </h2>
        <dl className="space-y-6">
          {region.faqs.map((faq) => (
            <div key={faq.q} className="border-b border-cr-border pb-6 space-y-2">
              <dt className="font-display text-base uppercase text-cr-text">{faq.q}</dt>
              <dd className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">{faq.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ── All regions hub ── */}
      <section className="max-w-6xl mx-auto px-6 pb-12 border-t border-cr-border pt-10">
        <h2 className="font-display text-lg uppercase text-cr-text-muted mb-4">
          Otras comunidades autónomas
        </h2>
        <ul className="flex flex-wrap gap-2">
          {REGION_LANDINGS.filter((r) => r.slug !== region.slug).map((r) => (
            <li key={r.slug}>
              <Link
                to={`/festivales-en/${r.slug}`}
                className="inline-flex items-center gap-1.5 font-sans text-xs text-cr-text-muted hover:text-cr-primary border border-cr-border hover:border-cr-primary px-3 py-1.5 transition-colors"
              >
                {r.displayName}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Festivals hub ── */}
      <section className="max-w-6xl mx-auto px-6 pb-12 border-t border-cr-border pt-10">
        <h2 className="font-display text-lg uppercase text-cr-text-muted mb-4">
          Todos los festivales en ConcertRide
        </h2>
        <ul className="flex flex-wrap gap-2">
          {Object.values(FESTIVAL_LANDINGS_BY_SLUG).map((f) => (
            <li key={f.slug}>
              <Link
                to={`/festivales/${f.slug}`}
                className="inline-flex items-center gap-1.5 font-sans text-xs text-cr-text-muted hover:text-cr-primary border border-cr-border hover:border-cr-primary px-3 py-1.5 transition-colors"
              >
                {f.shortName}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12">
        <div className="border border-cr-primary/30 bg-cr-primary/5 p-8 space-y-4 text-center">
          <h2 className="font-display text-2xl md:text-3xl uppercase">
            ¿Vas a un festival de {region.displayName}?
          </h2>
          <p className="font-sans text-sm text-cr-text-muted max-w-xl mx-auto">
            Busca un viaje compartido o publica el tuyo en ConcertRide. Sin comisión, pago en
            efectivo o Bizum el día del festival.
          </p>
          <div className="flex flex-wrap gap-3 justify-center pt-2">
            <Link
              to="/concerts"
              className="inline-block font-sans text-sm font-semibold uppercase tracking-[0.12em] bg-cr-primary text-black px-5 py-3 hover:bg-cr-primary/90 transition-colors"
            >
              Buscar viaje →
            </Link>
            <Link
              to="/publish"
              className="inline-block font-sans text-sm font-semibold uppercase tracking-[0.12em] border-2 border-cr-primary text-cr-primary px-5 py-3 hover:bg-cr-primary hover:text-black transition-colors"
            >
              Publicar viaje
            </Link>
          </div>
        </div>
      </section>

      {/* ── Legal disclaimer ── */}
      <section className="max-w-6xl mx-auto px-6 pb-10 border-t border-cr-border pt-8">
        <p className="font-mono text-[11px] text-cr-text-dim leading-relaxed">
          ConcertRide no es un socio oficial, patrocinador ni representante de ninguno de los
          festivales mencionados ni de sus organizaciones. Los nombres de festivales y eventos
          se utilizan con carácter meramente descriptivo para identificar el destino del viaje.
          Para compra de entradas o información oficial acude siempre a la web del organizador.{" "}
          <Link to="/aviso-legal" className="underline underline-offset-2 hover:text-cr-primary transition-colors">
            Aviso legal
          </Link>
          .
        </p>
      </section>
      <StickyRegBar />
    </main>
  );
}
