import { Link, Navigate, useParams } from "react-router-dom";
import { MapPin, Train, Bus, Car, ParkingSquare, Users, ArrowRight } from "lucide-react";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";
import { REGION_ISO } from "@/lib/seoConfig";
import { VENUE_LANDINGS, VENUE_LANDINGS_BY_SLUG } from "@/lib/venueLandings";
import { FESTIVAL_LANDINGS_BY_SLUG } from "@/lib/festivalLandings";
import { AutoLinksForVenue } from "@/lib/autoLinking";
import { VENUE_SEO_OVERRIDES } from "@/lib/seoOverrides";

const VENUE_DEFAULT_OG = `${SITE_URL}/og-fallback.png`;

export default function VenueLandingPage() {
  const { slug } = useParams<{ slug: string }>();
  const venue = slug ? VENUE_LANDINGS_BY_SLUG[slug] : undefined;

  const venueOgImage = venue?.ogImage
    ? (venue.ogImage.startsWith("http") ? venue.ogImage : `${SITE_URL}${venue.ogImage}`)
    : VENUE_DEFAULT_OG;

  const topOrigin = venue?.originCities[0];
  const topPrice = topOrigin?.concertRideRange.split("–")[0]?.replace(/[^0-9]/g, "") ?? "9";

  const venueOverride = venue ? VENUE_SEO_OVERRIDES[venue.slug] : undefined;

  useSeoMeta({
    title: venue
      ? venueOverride?.title ?? `Cómo llegar a ${venue.name} — transporte y carpooling | ConcertRide`
      : "Recintos de conciertos en España | ConcertRide",
    description: venue
      ? venueOverride?.description ?? `${venue.name} (${venue.city}): ${venue.transport.metro ? `Metro ${venue.transport.metro}.` : ""} ${venue.transport.bus ? `Bus: ${venue.transport.bus}.` : ""} Carpooling desde ${topOrigin?.city ?? "tu ciudad"} desde ${topPrice} €/asiento sin comisión. ${venue.blurb.slice(0, 120)}…`
      : "Guías de transporte para los principales recintos de conciertos de España. Cómo llegar, opciones de bus, metro y carpooling.",
    canonical: venue
      ? `${SITE_URL}/recintos/${venue.slug}`
      : `${SITE_URL}/concerts`,
    ogImage: venueOgImage,
    ogImageAlt: venue
      ? `Cómo llegar a ${venue.name} en ${venue.city}: carpooling y transporte — ConcertRide`
      : "Recintos de conciertos en España — ConcertRide",
    ogType: "website",
    keywords: venue
      ? venueOverride?.keywords ?? [
          `cómo llegar a ${venue.name}`,
          `cómo ir a ${venue.shortName}`,
          `transporte ${venue.shortName}`,
          `metro ${venue.shortName}`,
          `bus ${venue.shortName}`,
          `carpooling ${venue.name}`,
          `coche compartido ${venue.shortName}`,
          `${venue.shortName} ${venue.city}`,
          `parking ${venue.shortName}`,
          `${venue.shortName} transporte público`,
          `conciertos ${venue.shortName}`,
          `cómo llegar ${venue.city} conciertos`,
          `carpooling ${venue.city} conciertos`,
          `viaje compartido ${venue.shortName}`,
          `${venue.venueType.toLowerCase()} ${venue.city}`,
        ].join(", ")
      : undefined,
    geoRegion: venue ? (REGION_ISO[venue.region] ?? undefined) : undefined,
    geoPlacename: venue ? `${venue.city}, España` : undefined,
    geoLat: venue?.lat,
    geoLng: venue?.lng,
  });

  if (!slug || !venue) return <Navigate to="/concerts" replace />;

  const relatedFestivals = venue.relatedFestivals
    .map((fs) => FESTIVAL_LANDINGS_BY_SLUG[fs])
    .filter((f): f is NonNullable<typeof f> => f !== undefined);

  // ── Schema: choose type based on venueType ──────────────────────────────────
  const schemaType: string =
    venue.venueType === "Arena" || venue.venueType === "Teatro"
      ? "PerformingArtsTheater"
      : "CivicStructure";

  const jsonLdPlace = {
    "@context": "https://schema.org",
    "@type": schemaType,
    name: venue.name,
    url: `${SITE_URL}/recintos/${venue.slug}`,
    description: venue.blurb,
    address: {
      "@type": "PostalAddress",
      ...(venue.address?.split(",").slice(0, -1).join(",").trim()
        ? { streetAddress: venue.address.split(",").slice(0, -1).join(",").trim() }
        : {}),
      addressLocality: venue.city || venue.region,
      addressRegion: venue.region,
      addressCountry: "ES",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: venue.lat,
      longitude: venue.lng,
    },
    maximumAttendeeCapacity: parseInt(venue.capacity.replace(/\D/g, ""), 10) || undefined,
    amenityFeature: [
      ...(venue.transport.metro
        ? [{ "@type": "LocationFeatureSpecification", name: "Metro", value: venue.transport.metro }]
        : []),
      ...(venue.transport.bus
        ? [{ "@type": "LocationFeatureSpecification", name: "Autobús", value: venue.transport.bus }]
        : []),
      ...(venue.transport.tren
        ? [{ "@type": "LocationFeatureSpecification", name: "Tren / Cercanías", value: venue.transport.tren }]
        : []),
      ...(venue.transport.parking
        ? [{ "@type": "LocationFeatureSpecification", name: "Parking", value: venue.transport.parking }]
        : []),
    ],
    additionalProperty: venue.originCities.map((oc) => ({
      "@type": "PropertyValue",
      name: `Carpooling desde ${oc.city}`,
      value: `${oc.km} km · ${oc.drivingTime} · ${oc.concertRideRange}`,
    })),
  };

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Recintos", item: `${SITE_URL}/recintos` },
      { "@type": "ListItem", position: 3, name: venue.shortName, item: `${SITE_URL}/recintos/${venue.slug}` },
    ],
  };

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: "es-ES",
    mainEntity: venue.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const jsonLdLocalBusiness = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: `Carpooling a ${venue.name} — ConcertRide`,
    url: `${SITE_URL}/recintos/${venue.slug}`,
    description: `Carpooling sin comisión para llegar a ${venue.name} desde ${venue.originCities.length} ciudades. Desde ${topPrice} €/asiento.`,
    areaServed: {
      "@type": "State",
      name: venue.region,
      containedInPlace: { "@type": "Country", name: "Spain" },
    },
    hasMap: `https://maps.google.com/?q=${venue.lat},${venue.lng}`,
    currenciesAccepted: "EUR",
    paymentAccepted: "Cash, Bizum",
    priceRange: `${topPrice}–${venue.originCities[venue.originCities.length - 1]?.concertRideRange.split("–")[1]?.replace(/[^0-9]/g, "") ?? "20"} €`,
  };

  const jsonLdWebPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE_URL}/recintos/${venue.slug}#webpage`,
    url: `${SITE_URL}/recintos/${venue.slug}`,
    name: `Cómo llegar a ${venue.name} — transporte y carpooling | ConcertRide`,
    description: `Guía de transporte para ${venue.name} (${venue.city}, ${venue.region}). Metro, bus, parking y carpooling desde ${venue.originCities.length} ciudades. Desde ${topPrice} €/asiento sin comisión.`,
    inLanguage: "es-ES",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: {
      "@type": schemaType,
      name: venue.name,
      addressLocality: venue.city,
    },
    keywords: `cómo llegar ${venue.shortName}, transporte ${venue.shortName}, carpooling ${venue.name}, metro ${venue.shortName}, parking ${venue.shortName}`,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".speakable", ".venue-summary", ".transport-info", "article p:first-of-type"],
    },
  };

  const jsonLdHowTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `Cómo llegar a ${venue.name} en coche compartido`,
    description: `Guía paso a paso para ir a ${venue.name} (${venue.city}) con carpooling desde ConcertRide.`,
    step: [
      { "@type": "HowToStep", position: 1, name: "Busca tu ciudad de origen", text: `Entra en concertride.me/recintos/${venue.slug} y selecciona tu ciudad de salida.` },
      { "@type": "HowToStep", position: 2, name: "Elige el conductor", text: "Filtra por fecha, precio y valoraciones. Los conductores verifican su carnet antes de publicar." },
      { "@type": "HowToStep", position: 3, name: "Confirma el viaje", text: "Chatea con el conductor para confirmar el punto de encuentro y la hora de vuelta del concierto." },
      { "@type": "HowToStep", position: 4, name: "Paga en efectivo o Bizum", text: `Paga directamente al conductor el día del evento en ${venue.name}. Sin comisión (0% para conductor y pasajero).` },
    ],
    totalTime: "PT10M",
    estimatedCost: { "@type": "MonetaryAmount", currency: "EUR", value: topPrice },
  };

  return (
    <main id="main" className="min-h-dvh bg-cr-bg text-cr-text pt-14">
      {/* ── JSON-LD ── */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdPlace) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdLocalBusiness) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebPage) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdHowTo) }} />

      {/* ── Hero ── */}
      <div className="max-w-6xl mx-auto px-6 pt-10 pb-6 space-y-4">
        <nav aria-label="Breadcrumb" className="font-mono text-[11px] text-cr-text-muted flex items-center gap-2">
          <Link to="/" className="hover:text-cr-primary">Inicio</Link>
          <span aria-hidden="true">/</span>
          <span className="text-cr-text-muted">Recintos</span>
          <span aria-hidden="true">/</span>
          <span className="text-cr-text-muted">{venue.shortName}</span>
        </nav>

        <div className="flex flex-wrap items-center gap-2 pt-1">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary inline-flex items-center gap-1.5">
            <MapPin size={12} /> {venue.region}
          </p>
          <span className="font-mono text-[11px] text-cr-text-dim border border-cr-border px-2 py-0.5">
            {venue.venueType}
          </span>
          <span className="font-mono text-[11px] text-cr-text-dim border border-cr-border px-2 py-0.5 inline-flex items-center gap-1">
            <Users size={10} /> {venue.capacity}
          </span>
        </div>

        <h1 className="font-display text-4xl md:text-6xl uppercase leading-[0.92]">
          Cómo llegar a<br />{venue.shortName}.
        </h1>

        <p className="font-sans text-sm font-semibold text-cr-text max-w-2xl speakable venue-summary">
          {venue.name}, {venue.city} ({venue.address}). Carpooling desde{" "}
          {topOrigin?.city}: desde {topOrigin?.concertRideRange ?? `${topPrice} €`}/asiento,
          sin comisión, conductores verificados con carnet.
        </p>

        <p className="font-sans text-sm md:text-base text-cr-text-muted max-w-2xl leading-relaxed speakable">
          {venue.blurb}
        </p>

        {/* Search-query synonyms */}
        <p className="font-sans text-xs text-cr-text-dim max-w-2xl leading-relaxed">
          También buscado como:{" "}
          cómo llegar a {venue.shortName.toLowerCase()},{" "}
          cómo ir a {venue.shortName.toLowerCase()},{" "}
          transporte {venue.shortName.toLowerCase()},{" "}
          metro {venue.shortName.toLowerCase()},{" "}
          bus {venue.shortName.toLowerCase()},{" "}
          parking {venue.shortName.toLowerCase()},{" "}
          {venue.shortName.toLowerCase()} {venue.city.toLowerCase()},{" "}
          conciertos {venue.shortName.toLowerCase()}.
        </p>
      </div>

      {/* ── Transport section ── */}
      <section className="max-w-6xl mx-auto px-6 pb-12 border-t border-cr-border pt-12 space-y-6 transport-info">
        <h2 className="font-display text-2xl md:text-3xl uppercase">
          Cómo llegar a {venue.shortName} en transporte público: metro, bus y tren
        </h2>
        <p className="font-sans text-sm text-cr-text-muted max-w-3xl leading-relaxed">
          Dirección exacta: <strong className="text-cr-text">{venue.address}</strong>.
          Coordenadas GPS: {venue.lat.toFixed(4)} N, {Math.abs(venue.lng).toFixed(4)}{" "}
          {venue.lng < 0 ? "W" : "E"}.
        </p>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {venue.transport.metro && (
            <article className="border border-cr-border p-4 space-y-2">
              <h3 className="font-display text-base uppercase text-cr-primary flex items-center gap-1.5">
                <Train size={14} /> Metro a {venue.shortName}
              </h3>
              <p className="font-sans text-xs text-cr-text-muted leading-relaxed">
                {venue.transport.metro}
              </p>
            </article>
          )}
          {venue.transport.bus && (
            <article className="border border-cr-border p-4 space-y-2">
              <h3 className="font-display text-base uppercase text-cr-primary flex items-center gap-1.5">
                <Bus size={14} /> Autobús a {venue.shortName}
              </h3>
              <p className="font-sans text-xs text-cr-text-muted leading-relaxed">
                {venue.transport.bus}
              </p>
            </article>
          )}
          {venue.transport.tren && (
            <article className="border border-cr-border p-4 space-y-2">
              <h3 className="font-display text-base uppercase text-cr-primary flex items-center gap-1.5">
                <Train size={14} /> Tren / Cercanías a {venue.shortName}
              </h3>
              <p className="font-sans text-xs text-cr-text-muted leading-relaxed">
                {venue.transport.tren}
              </p>
            </article>
          )}
          {venue.transport.parking && (
            <article className="border border-cr-border p-4 space-y-2">
              <h3 className="font-display text-base uppercase text-cr-primary flex items-center gap-1.5">
                <ParkingSquare size={14} /> Parking en {venue.shortName}
              </h3>
              <p className="font-sans text-xs text-cr-text-muted leading-relaxed">
                {venue.transport.parking}
              </p>
            </article>
          )}
          <article className="border border-cr-border p-4 space-y-2">
            <h3 className="font-display text-base uppercase text-cr-primary flex items-center gap-1.5">
              <Car size={14} /> Carpooling a {venue.shortName} sin comisión
            </h3>
            <p className="font-sans text-xs text-cr-text-muted leading-relaxed">
              Carpooling con ConcertRide desde {venue.originCities.length} ciudades.
              Desde {topOrigin?.concertRideRange ?? `${topPrice} €`}/asiento. Sin comisión:
              el 100&nbsp;% va al conductor. Pago en efectivo o Bizum.
            </p>
          </article>
        </div>

        <p className="font-mono text-[11px] text-cr-text-dim">
          ¿Buscas cómo ir a {venue.shortName}, bus a {venue.shortName} o el modo más
          rápido para llegar desde{" "}
          {venue.originCities
            .slice(0, 3)
            .map((c) => c.city)
            .join(", ")}? Tienes los detalles por ciudad de origen más abajo.
        </p>
      </section>

      {/* ── Origin cities table ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12">
        <h2 className="font-display text-2xl md:text-3xl uppercase mb-2">
          Precio del carpooling a {venue.shortName} desde tu ciudad: tarifas orientativas
        </h2>
        <p className="font-sans text-sm text-cr-text-muted mb-8 max-w-xl">
          Precio medio por asiento con ConcertRide desde las principales ciudades de origen.
          El 100&nbsp;% va al conductor, sin comisión de plataforma.
        </p>

        <div className="overflow-x-auto mb-8">
          <table className="w-full font-sans text-xs border-collapse">
            <thead>
              <tr className="border-b border-cr-border text-left">
                <th className="py-2 pr-6 font-semibold text-cr-text">Ciudad de origen</th>
                <th className="py-2 pr-6 font-semibold text-cr-text">Distancia</th>
                <th className="py-2 pr-6 font-semibold text-cr-text">Tiempo conduciendo</th>
                <th className="py-2 font-semibold text-cr-text">Carpooling ConcertRide</th>
              </tr>
            </thead>
            <tbody className="text-cr-text-muted">
              {venue.originCities.map((oc) => (
                <tr key={oc.city} className="border-b border-cr-border/50">
                  <td className="py-2 pr-6 font-semibold text-cr-text">{oc.city}</td>
                  <td className="py-2 pr-6">{oc.km} km</td>
                  <td className="py-2 pr-6">{oc.drivingTime}</td>
                  <td className="py-2 font-semibold text-cr-primary">{oc.concertRideRange}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {venue.originCities.map((oc) => (
            <article
              key={oc.city}
              className="border border-cr-border p-4 space-y-2 hover:border-cr-primary/40 transition-colors"
            >
              <div className="flex items-center justify-between">
                <h3 className="font-display text-base uppercase">{oc.city}</h3>
                <span className="font-mono text-xs text-cr-primary font-semibold">
                  {oc.concertRideRange}
                </span>
              </div>
              <div className="flex gap-4 font-mono text-[11px] text-cr-text-muted">
                <span>{oc.km} km</span>
                <span>·</span>
                <span>{oc.drivingTime}</span>
              </div>
              <p className="font-sans text-[11px] text-cr-text-muted">
                sin comisión — pagas directamente al conductor
              </p>
            </article>
          ))}
        </div>

        <div className="mt-8 p-4 border border-cr-primary/30 bg-cr-primary/5 space-y-1">
          <p className="font-sans text-xs text-cr-text-muted">
            <strong className="text-cr-text">Precios orientativos</strong> basados en tarifas
            reales publicadas en ConcertRide. El conductor fija el precio por asiento para cubrir
            combustible y peajes (tarifa MITECO de referencia).
          </p>
        </div>
      </section>

      {/* ── Transport comparison table ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <h2 className="font-display text-2xl md:text-3xl uppercase">
          Comparativa de transporte a {venue.shortName}: carpooling vs. taxi vs. metro vs. BlaBlaCar
        </h2>
        <p className="font-sans text-sm text-cr-text-muted max-w-2xl">
          Precios, comisiones y disponibilidad nocturna para llegar a {venue.name} desde{" "}
          {topOrigin?.city ?? "tu ciudad"}.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full font-sans text-xs border-collapse">
            <thead>
              <tr className="border-b border-cr-border text-left">
                <th className="py-2 pr-4 font-semibold text-cr-text">Opción</th>
                <th className="py-2 pr-4 font-semibold text-cr-text">
                  Precio desde {topOrigin?.city ?? "origen"}
                </th>
                <th className="py-2 pr-4 font-semibold text-cr-text">Comisión</th>
                <th className="py-2 pr-4 font-semibold text-cr-text">Vuelta madrugada</th>
                <th className="py-2 font-semibold text-cr-text">Reserva</th>
              </tr>
            </thead>
            <tbody className="text-cr-text-muted">
              <tr className="border-b border-cr-border/50">
                <td className="py-2 pr-4 font-semibold text-cr-primary">ConcertRide carpooling</td>
                <td className="py-2 pr-4">{topOrigin?.concertRideRange ?? `desde ${topPrice} €`}/asiento</td>
                <td className="py-2 pr-4 font-semibold text-cr-primary">0 %</td>
                <td className="py-2 pr-4">Sí (coordinada con el conductor)</td>
                <td className="py-2">Instantánea</td>
              </tr>
              <tr className="border-b border-cr-border/50">
                <td className="py-2 pr-4">Taxi / VTC (Uber, Cabify)</td>
                <td className="py-2 pr-4">25–80 € ida (precio nocturno)</td>
                <td className="py-2 pr-4">—</td>
                <td className="py-2 pr-4">Sí (precio ×2–3 de madrugada)</td>
                <td className="py-2">App</td>
              </tr>
              <tr className="border-b border-cr-border/50">
                <td className="py-2 pr-4">BlaBlaCar</td>
                <td className="py-2 pr-4">
                  {topOrigin?.concertRideRange ?? "precio similar"} + 12–18 %
                </td>
                <td className="py-2 pr-4">12–18 %</td>
                <td className="py-2 pr-4">Depende del conductor</td>
                <td className="py-2">Con aprobación</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">Metro / bus público</td>
                <td className="py-2 pr-4">2–6 € (si hay servicio)</td>
                <td className="py-2 pr-4">—</td>
                <td className="py-2 pr-4">No (último ~1:30)</td>
                <td className="py-2">App / taquilla</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="font-mono text-[10px] text-cr-text-dim">
          Datos de ConcertRide, estimaciones de VTC nocturno y tarifas EMT/TMB/Renfe 2026.
          BlaBlaCar comisión media actualizada a mayo 2026.
        </p>
      </section>

      {/* ── Por qué ConcertRide ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <h2 className="font-display text-2xl md:text-3xl uppercase">
          Por qué ir a {venue.shortName} con ConcertRide y no con BlaBlaCar o taxi
        </h2>
        <div className="grid md:grid-cols-3 gap-4 font-sans text-sm text-cr-text-muted leading-relaxed">
          <article className="space-y-2">
            <h3 className="font-display text-base uppercase text-cr-primary">Sin comisión para {venue.shortName}</h3>
            <p>
              El 100&nbsp;% del precio del asiento va al conductor. ConcertRide no cobra
              comisión nunca. Pagas en efectivo o Bizum el día del viaje.
            </p>
          </article>
          <article className="space-y-2">
            <h3 className="font-display text-base uppercase text-cr-primary">Conductores verificados en {venue.shortName}</h3>
            <p>
              Todos los conductores verifican su carnet de conducir antes de publicar
              un viaje. Puedes ver sus valoraciones y reseñas de otros pasajeros.
            </p>
          </article>
          <article className="space-y-2">
            <h3 className="font-display text-base uppercase text-cr-primary">Vuelta de madrugada desde {venue.shortName}</h3>
            <p>
              El conductor espera a que el concierto termine antes de salir. No
              dependes del último metro ni de taxis a precio multiplicado de madrugada.
            </p>
          </article>
        </div>

        <div className="pt-6 flex flex-wrap gap-4 border-t border-cr-border">
          <Link
            to={`/conciertos/${venue.citySlug}`}
            className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-cr-text-muted hover:text-cr-primary transition-colors"
          >
            Todos los conciertos en {venue.city} <ArrowRight size={12} />
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

      {/* ── AutoLinks ── */}
      <div className="max-w-6xl mx-auto px-6">
        <AutoLinksForVenue slug={venue.slug} />
      </div>

      {/* ── FAQs ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <h2 className="font-display text-2xl md:text-3xl uppercase">
          Preguntas frecuentes sobre cómo llegar a {venue.shortName}: transporte y carpooling
        </h2>
        <dl className="space-y-0 divide-y divide-cr-border">
          {venue.faqs.map((faq) => (
            <details key={faq.q} className="group py-5">
              <summary className="list-none cursor-pointer flex items-start justify-between gap-4">
                <dt className="font-display text-base uppercase text-cr-text group-open:text-cr-primary transition-colors">
                  {faq.q}
                </dt>
                <span
                  aria-hidden="true"
                  className="font-mono text-cr-primary mt-0.5 shrink-0 group-open:rotate-45 transition-transform"
                >
                  +
                </span>
              </summary>
              <dd className="font-sans text-sm text-cr-text-muted leading-relaxed mt-3 max-w-2xl">
                {faq.a}
              </dd>
            </details>
          ))}
        </dl>
      </section>

      {/* ── Related festivals ── */}
      {relatedFestivals.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-10">
          <h2 className="font-display text-lg uppercase text-cr-text-muted mb-4">
            Festivales en {venue.shortName}: carpooling y transporte
          </h2>
          <ul className="flex flex-wrap gap-2">
            {relatedFestivals.map((f) => (
              <li key={f.slug}>
                <Link
                  to={`/festivales/${f.slug}`}
                  className="inline-flex items-center gap-1.5 font-sans text-xs text-cr-text-muted hover:text-cr-primary border border-cr-border hover:border-cr-primary px-3 py-1.5 transition-colors"
                >
                  {f.shortName} — {f.city}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ── All venues hub ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-10">
        <h2 className="font-display text-lg uppercase text-cr-text-muted mb-4">
          Otros recintos en ConcertRide
        </h2>
        <ul className="flex flex-wrap gap-2">
          {VENUE_LANDINGS.filter((v) => v.slug !== venue.slug).map((v) => (
            <li key={v.slug}>
              <Link
                to={`/recintos/${v.slug}`}
                className="inline-flex items-center gap-1.5 font-sans text-xs text-cr-text-muted hover:text-cr-primary border border-cr-border hover:border-cr-primary px-3 py-1.5 transition-colors"
              >
                {v.shortName}
                <span className="text-cr-text-dim">— {v.city}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12">
        <div className="p-8 border border-cr-primary/30 bg-cr-primary/5 space-y-4 text-center">
          <h2 className="font-display text-2xl md:text-3xl uppercase">
            Encuentra tu viaje a {venue.shortName}
          </h2>
          <p className="font-sans text-sm text-cr-text-muted max-w-xl mx-auto">
            Busca conductores que vayan a conciertos en {venue.city}.
            Sin comisión, pago en efectivo o Bizum, conductores verificados.
          </p>
          <Link
            to="/concerts"
            className="inline-flex items-center gap-2 font-sans text-sm font-semibold uppercase tracking-[0.12em] bg-cr-primary text-black px-6 py-3 hover:bg-cr-primary/90 transition-colors"
          >
            Ver conciertos disponibles <ArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* ── Legal disclaimer ── */}
      <section className="max-w-6xl mx-auto px-6 pb-10 border-t border-cr-border pt-8">
        <p className="font-mono text-[11px] text-cr-text-dim leading-relaxed">
          ConcertRide no es un socio oficial, patrocinador ni representante de{" "}
          {venue.name} ni de su organización. El nombre del recinto se utiliza con carácter
          meramente descriptivo para identificar el destino del viaje. Para información
          oficial sobre eventos en {venue.shortName} acude siempre a la web del organizador.{" "}
          <Link
            to="/aviso-legal"
            className="underline underline-offset-2 hover:text-cr-primary transition-colors"
          >
            Aviso legal
          </Link>
          .
        </p>
      </section>
    </main>
  );
}
