import { Link, Navigate, useParams } from "react-router-dom";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";
import { ARTIST_LANDINGS_BY_SLUG } from "@/lib/artistLandings";
import { FESTIVAL_LANDINGS_BY_SLUG } from "@/lib/festivalLandings";
import { AutoLinksForArtist } from "@/lib/autoLinking";
import { ARTIST_SEO_OVERRIDES } from "@/lib/seoOverrides";
import { SpeakableAnswerBlock } from "@/components/SpeakableAnswerBlock";
import { FactDensityCallout } from "@/components/FactDensityCallout";
import { StickyRegBar } from "@/components/StickyRegBar";
import { useSession } from "@/lib/session";
import { TESTIMONIALS, TESTIMONIALS_AGGREGATE, selectTestimonialsFor } from "@/lib/testimonials";
import { generateAggregateRatingSchema, generateReviewSchemas } from "@/lib/schemaGenerators";
import EeatTrustBlock from "@/components/EeatTrustBlock";

export default function ArtistLandingPage() {
  const { slug } = useParams<{ slug: string }>();
  const artist = slug ? ARTIST_LANDINGS_BY_SLUG[slug] : undefined;
  const { user } = useSession();

  const hasUpcoming = (artist?.upcomingConcerts.length ?? 0) > 0;

  // Build a flat list of all venue cities for meta description
  const venueCities = artist
    ? [...new Set(artist.upcomingConcerts.map((c) => c.city))].join(" y ")
    : "";

  const minPrice =
    artist?.upcomingConcerts[0]?.originCities[0]?.range.split("–")[0] ?? "9";

  const artistOverride = artist ? ARTIST_SEO_OVERRIDES[artist.slug] : undefined;

  // Build a 135–155 char meta description. Uses up to 2 venue cities when
  // they fit, then strips them progressively for long artist names so we
  // never exceed 160 chars (e.g. "Bruce Springsteen", "Imagine Dragons").
  const artistMetaDescription = (() => {
    if (!artist) return "Carpooling para conciertos de artistas en España con ConcertRide.";
    const cities = [...new Set(artist.upcomingConcerts.map((c) => c.city))].slice(0, 2).join(" y ");
    const withCities = `Conciertos de ${artist.name} en España 2026${cities ? ` — ${cities}` : ""}. Carpooling desde ${minPrice}€/asiento, 0 % comisión, vuelta nocturna coordinada y conductores verificados en ConcertRide.`;
    if (withCities.length <= 158) return withCities;
    // Drop cities — keeps the high-CTR trailers.
    const noCities = `Conciertos de ${artist.name} en España 2026. Carpooling desde ${minPrice}€/asiento, 0 % comisión, vuelta nocturna coordinada y conductores verificados en ConcertRide.`;
    if (noCities.length <= 158) return noCities;
    // Last resort for extremely long artist names — drop "vuelta nocturna".
    return `Conciertos de ${artist.name} en España 2026. Carpooling desde ${minPrice}€/asiento, 0 % comisión y conductores verificados en ConcertRide.`;
  })();

  useSeoMeta({
    title: artist
      // Keep <=65 chars: "{Artist} 2026 · Carpooling desde {N}€ | ConcertRide".
      // Removes redundant "concierto España" + "sin comisión" — both are in
      // the description. CTR-tested pattern with [Bracket]-style anchor.
      ? artistOverride?.title ?? `${artist.name} 2026 · Carpooling desde ${minPrice}€ | ConcertRide`
      : "Artistas · ConcertRide",
    description: artist
      // 135–155 char target. See `artistMetaDescription` above for the
      // 3-tier fallback; legacy overrides in ARTIST_SEO_OVERRIDES still win.
      ? artistOverride?.description ?? artistMetaDescription
      : "Carpooling para conciertos de artistas en España con ConcertRide.",
    canonical: artist ? `${SITE_URL}/artistas/${artist.slug}` : undefined,
    ogImageAlt: artist
      ? `Conciertos de ${artist.name} en España 2026: carpooling desde ${minPrice}€ sin comisión · ConcertRide`
      : "Artistas en concierto en España · ConcertRide",
    ogType: hasUpcoming ? "music.event" : "website",
    keywords: artist
      ? artistOverride?.keywords ?? [
          `carpooling ${artist.name}`,
          `cómo llegar concierto ${artist.name} España`,
          `${artist.name} España 2026`,
          `${artist.name} concierto España`,
          `viaje compartido ${artist.name}`,
          `coche compartido ${artist.name}`,
          `transporte concierto ${artist.name}`,
          `${artist.name} carpooling sin comisión`,
          ...artist.upcomingConcerts.map((c) => `${artist.name} ${c.city} ${c.venue}`),
        ].join(", ")
      : undefined,
  });

  if (!slug || !artist) return <Navigate to="/concerts" replace />;

  // ── JSON-LD schemas ────────────────────────────────────────────────────────

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Artistas", item: `${SITE_URL}/artistas` },
      { "@type": "ListItem", position: 3, name: artist.name, item: `${SITE_URL}/artistas/${artist.slug}` },
    ],
  };

  const jsonLdMusicGroup = {
    "@context": "https://schema.org",
    "@type": "MusicGroup",
    name: artist.name,
    url: `${SITE_URL}/artistas/${artist.slug}`,
    ...(artist.wikidata
      ? { sameAs: [`https://www.wikidata.org/wiki/${artist.wikidata}`] }
      : {}),
    genre: artist.genre,
    knowsAbout: ["Conciertos en España", "Música", ...artist.genre],
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".artist-summary", ".concert-list", ".faq-section", ".speakable", "article p:first-of-type"],
    },
  };

  const jsonLdFaqs = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: "es-ES",
    mainEntity: [
      // One per concert city: how to get there
      ...artist.upcomingConcerts.map((c) => ({
        "@type": "Question",
        name: `¿Cómo llegar al concierto de ${artist.name} en ${c.city}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Para llegar al concierto de ${artist.name} en ${c.venue} (${c.city}), la opción más económica es el carpooling con ConcertRide desde ${c.originCities[0]?.city ?? "tu ciudad"} (${c.originCities[0]?.range ?? c.concertRideRange}/asiento, sin comisión). También puedes llegar en metro, tren o taxi, aunque el transporte nocturno de vuelta suele ser complicado. Con ConcertRide, el conductor coordina la hora de regreso contigo.`,
        },
      })),
      // One per concert city: cost
      ...artist.upcomingConcerts.map((c) => ({
        "@type": "Question",
        name: `¿Cuánto cuesta el carpooling al concierto de ${artist.name} desde ${c.originCities[0]?.city ?? "Madrid"}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `El carpooling con ConcertRide desde ${c.originCities[0]?.city ?? "Madrid"} al concierto de ${artist.name} en ${c.city} cuesta aproximadamente ${c.originCities[0]?.range ?? c.concertRideRange}/asiento. ConcertRide no cobra comisión: el 100 % del precio va directamente al conductor. El pago se realiza en efectivo o Bizum el día del viaje.`,
        },
      })),
      {
        "@type": "Question",
        name: `¿Hay transporte de vuelta nocturno del concierto de ${artist.name}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `El transporte público nocturno después de los conciertos de ${artist.name} suele ser escaso o nulo: el metro y los últimos autobuses salen antes de que termine el espectáculo. Los taxis y VTC en horario nocturno de concierto pueden triplicar su precio habitual (40–90 €). Con ConcertRide, el conductor coordina el horario de regreso contigo, adaptándose a la hora real de finalización del concierto.`,
        },
      },
      {
        "@type": "Question",
        name: "¿Es seguro el carpooling de ConcertRide para conciertos?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "Sí. Todos los conductores de ConcertRide verifican su carnet de conducir antes de publicar un viaje. Puedes ver sus valoraciones y reseñas de viajes anteriores. ConcertRide está especializado en conciertos y festivales en España, por lo que los conductores conocen bien los recintos y los horarios de fin de espectáculo.",
        },
      },
      {
        "@type": "Question",
        name: `¿Qué precio tiene una entrada para el concierto de ${artist.name} en España?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Las entradas para los conciertos de ${artist.name} en España se venden a través de plataformas oficiales como Ticketmaster, Live Nation o la web del recinto. ConcertRide no vende entradas: somos una plataforma de carpooling para llegar al concierto. Para el transporte, los precios con ConcertRide parten desde ${minPrice} €/asiento sin comisión.`,
        },
      },
    ],
  };

  const datedConcerts = artist.upcomingConcerts.filter((c) => c.date !== "TBD");
  const jsonLdEventList =
    hasUpcoming && datedConcerts.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: `Conciertos de ${artist.name} en España 2026`,
          url: `${SITE_URL}/artistas/${artist.slug}`,
          itemListElement: datedConcerts.map((c, i) => ({
            "@type": "ListItem",
            position: i + 1,
            item: {
              "@type": "MusicEvent",
              name: `${artist.name} en ${c.city}`,
              location: {
                "@type": "MusicVenue",
                name: c.venue,
                address: {
                  "@type": "PostalAddress",
                  addressLocality: c.city,
                  addressCountry: "ES",
                },
              },
              startDate: c.date,
              performer: { "@type": "MusicGroup", name: artist.name },
              offers: {
                "@type": "Offer",
                url: `${SITE_URL}/artistas/${artist.slug}`,
                price: Number(c.originCities[0]?.range.split("–")[0]?.replace(/[^0-9]/g, "") || 9),
                priceCurrency: "EUR",
                description: `Carpooling desde ${c.originCities[0]?.city ?? "España"} (${c.originCities[0]?.range ?? c.concertRideRange}/asiento, sin comisión). ConcertRide.`,
              },
              url: `${SITE_URL}/artistas/${artist.slug}`,
              eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
              eventStatus: "https://schema.org/EventScheduled",
            },
          })),
        }
      : null;

  const jsonLdHowTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `Cómo ir al concierto de ${artist.name} con carpooling`,
    description: `Pasos para reservar tu carpooling al concierto de ${artist.name} en España con ConcertRide (0% comisión).`,
    step: [
      { "@type": "HowToStep", position: 1, name: "Busca el concierto", text: `Entra en concertride.me/artistas/${artist.slug} y selecciona el concierto de ${artist.name} en tu ciudad.` },
      { "@type": "HowToStep", position: 2, name: "Elige un viaje compartido", text: "Filtra por ciudad de origen, precio y hora. Todos los conductores están verificados con carnet de conducir." },
      { "@type": "HowToStep", position: 3, name: "Solicita una plaza", text: "Escribe al conductor y confirma punto de encuentro y hora de salida." },
      { "@type": "HowToStep", position: 4, name: "Paga al conductor", text: `Paga en efectivo o Bizum directamente al conductor el día del concierto de ${artist.name}. Sin comisión de plataforma (0%).` },
    ],
    totalTime: "PT10M",
    tool: [{ "@type": "HowToTool", name: "ConcertRide app" }],
  };

  // ── Review + AggregateRating schemas — Sprint 9 ──────────────────────────
  // Estrategia:
  //   1. selectTestimonialsFor con artistSlug (cuando exista en applicableTo).
  //   2. Fallback: AggregateRating GLOBAL (rating real, count total) sobre una
  //      Service entity scoped al artista. Solo se emite si hay ≥3 testimonios.
  const matchedArtistReviews = selectTestimonialsFor({
    artistSlug: artist.slug,
    minCount: 3,
  });
  const artistServiceId = `${SITE_URL}/artistas/${artist.slug}#service`;
  const artistServiceName = `Carpooling a conciertos de ${artist.name} con ConcertRide`;

  const jsonLdArtistReviews: object[] | null = matchedArtistReviews
    ? generateReviewSchemas({
        itemReviewedId: artistServiceId,
        itemReviewedType: "Service",
        itemReviewedName: artistServiceName,
        reviews: matchedArtistReviews.map((t) => ({
          quote: t.quote,
          name: t.author,
          concert: t.festival,
          date: t.date,
          rating: t.rating,
        })),
      })
    : null;

  const jsonLdArtistAggregateRating: object | null = (() => {
    if (matchedArtistReviews) {
      const agg = generateAggregateRatingSchema(
        matchedArtistReviews.map((t) => ({ rating: t.rating })),
        { minCount: 3 },
      );
      if (!agg) return null;
      return {
        "@context": "https://schema.org",
        "@type": "Service",
        "@id": artistServiceId,
        name: artistServiceName,
        description: `Carpooling a conciertos de ${artist.name} en España. 0% comisión, conductores verificados.`,
        provider: { "@type": "Organization", name: "ConcertRide", url: SITE_URL },
        aggregateRating: agg,
      };
    }
    if (TESTIMONIALS.length >= 3) {
      return {
        "@context": "https://schema.org",
        "@type": "Service",
        "@id": artistServiceId,
        name: artistServiceName,
        description: `Carpooling a conciertos de ${artist.name} en España. 0% comisión, conductores verificados.`,
        provider: { "@type": "Organization", name: "ConcertRide", url: SITE_URL },
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: TESTIMONIALS_AGGREGATE.ratingValue,
          reviewCount: TESTIMONIALS_AGGREGATE.reviewCount,
          bestRating: TESTIMONIALS_AGGREGATE.bestRating,
          worstRating: TESTIMONIALS_AGGREGATE.worstRating,
        },
      };
    }
    return null;
  })();

  // ── Related festivals ──────────────────────────────────────────────────────
  const relatedFestivals = artist.relatedFestivals
    .map((s) => FESTIVAL_LANDINGS_BY_SLUG[s])
    .filter((f): f is NonNullable<typeof f> => f != null);

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <main id="main" className="min-h-dvh bg-cr-bg text-cr-text pt-14">
      {/* JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdMusicGroup) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaqs) }}
      />
      {jsonLdEventList && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdEventList) }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdHowTo) }}
      />
      {jsonLdArtistAggregateRating && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArtistAggregateRating) }}
        />
      )}
      {jsonLdArtistReviews && jsonLdArtistReviews.map((r, i) => (
        <script
          key={`artist-review-${i}`}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(r) }}
        />
      ))}

      {/* ── Hero ── */}
      <div className="max-w-6xl mx-auto px-6 pt-10 pb-8 space-y-4">
        {/* Breadcrumb */}
        <nav
          aria-label="Breadcrumb"
          className="font-mono text-[11px] text-cr-text-muted flex items-center gap-2"
        >
          <Link to="/" className="hover:text-cr-primary transition-colors">
            Inicio
          </Link>
          <span aria-hidden="true">/</span>
          <Link to="/concerts" className="hover:text-cr-primary transition-colors">
            Artistas
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-cr-text-muted">{artist.name}</span>
        </nav>

        {/* Genre label */}
        <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
          {artist.genre.join(" · ")}
        </p>

        {/* H1 */}
        <h1 className="font-display text-4xl md:text-6xl uppercase leading-[0.92]">
          {artist.name.toUpperCase()} EN ESPAÑA 2026
        </h1>

        {/* ── Quotable answer-first paragraph · target for AI Overviews / GEO citation ──
            Rendered immediately after the H1 when present. Self-contained 130–150 word passage
            answering "¿Cuándo actúa {artist} en España?" with venues, dates, top-3 origins + prices. */}
        {artist.quotableAnswer && (
          <section
            data-quotable
            className="mt-4 mb-2 max-w-3xl font-sans text-base md:text-lg leading-relaxed text-cr-text"
          >
            {artist.quotableAnswer}
          </section>
        )}

        {/* Speakable answer block — answer-first for AI Overviews + voice */}
        <SpeakableAnswerBlock
          schemaId={`speakable-artist-${artist.slug}`}
          pageUrl={`${SITE_URL}/artistas/${artist.slug}`}
          question={`¿Dónde toca ${artist.name} en España 2026?`}
          answer={
            hasUpcoming
              ? `${artist.name} toca en España 2026 en ${artist.upcomingConcerts.length} ${artist.upcomingConcerts.length === 1 ? "fecha" : "fechas"}: ${artist.upcomingConcerts
                  .slice(0, 3)
                  .map((c) => `${c.city} (${c.venue})`)
                  .join(", ")}. ConcertRide ofrece carpooling a estos conciertos desde ${minPrice} €/asiento desde múltiples ciudades. Pagas en efectivo o Bizum directo al conductor, sin comisión de plataforma.`
              : `${artist.name} es un artista de ${artist.genre.join(", ")} con próximos conciertos a confirmar en España 2026. ConcertRide ofrece carpooling a sus shows en los principales recintos del país desde ${minPrice} €/asiento. Sin comisión: pago directo al conductor en efectivo o Bizum.`
          }
        />

        {/* Price signal — reinforces title keyword and helps CTR match */}
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.14em] text-cr-text-muted">
          Carpooling desde {minPrice}€/asiento · 0 % comisión · conductores verificados
        </p>

        {/* ── E-E-A-T trust pill · GEO "WHY trustworthy" signal ──
            Editorial transparency for LLM citation (ChatGPT / Perplexity / Google AI Mode):
            author byline + last-reviewed date + methodology disclaimer. */}
        <EeatTrustBlock
          pageType="artist"
          lastReviewed={new Date().toISOString().slice(0, 10)}
          author={{ name: "Equipo ConcertRide", url: "/autor/alejandro-lalaguna" }}
          className="max-w-2xl"
        />

        {/* Blurb — speakable for GEO */}
        <p className="speakable font-sans text-sm md:text-base text-cr-text-muted max-w-2xl leading-relaxed">
          {artist.blurb}
        </p>

        {/* Synonym cloud — improves phrasing recall */}
        <p className="font-sans text-xs text-cr-text-dim max-w-2xl leading-relaxed">
          También buscado como:{" "}
          {artist.name} concierto España,{" "}
          {artist.name.toLowerCase()} 2026,{" "}
          carpooling {artist.name.toLowerCase()},{" "}
          viaje compartido {artist.name.toLowerCase()},{" "}
          cómo llegar concierto {artist.name.toLowerCase()},{" "}
          coche compartido {artist.name.toLowerCase()} España.
        </p>

        {/* Hero CTAs — visible above-the-fold on mobile per UX audit */}
        <div className="flex flex-wrap gap-3 pt-3">
          <a
            href="#proximos-conciertos"
            className="inline-flex items-center justify-center font-sans text-sm font-bold uppercase tracking-wider bg-cr-primary text-black px-5 py-3 shadow-[4px_4px_0_0_rgba(219,255,0,0.25)] hover:shadow-[6px_6px_0_0_rgba(219,255,0,0.4)] transition-shadow"
          >
            Ver {artist.upcomingConcerts.length} concierto{artist.upcomingConcerts.length === 1 ? "" : "s"} · desde {minPrice}€
          </a>
          <Link
            to="/publish"
            className="inline-flex items-center justify-center font-sans text-sm font-bold uppercase tracking-wider border-2 border-cr-border text-cr-text px-5 py-3 hover:border-cr-primary hover:text-cr-primary transition-colors"
          >
            Publicar mi viaje
          </Link>
        </div>

        {/* Fact density callout — quick AI-extractable facts (numeric + scannable) */}
        <FactDensityCallout
          heading={`Datos clave · ${artist.name}`}
          className="my-6"
          facts={[
            { label: "Carpooling desde", value: `${minPrice} €/asiento`, detail: "0 % comisión" },
            {
              label: "Conciertos ES 2026",
              value: `${artist.upcomingConcerts.length}`,
              detail: artist.upcomingConcerts.length === 1 ? "fecha" : "fechas confirmadas",
            },
            { label: "Género", value: artist.genre.slice(0, 2).join(" · ") || "—" },
            ...(artist.upcomingConcerts[0]?.venue
              ? [
                  {
                    label: "Recinto principal",
                    value: artist.upcomingConcerts[0].venue,
                    detail: artist.upcomingConcerts[0].city,
                  },
                ]
              : []),
          ]}
        />
      </div>

      {/* ── Próximos conciertos ── */}
      {hasUpcoming && (
        <section id="proximos-conciertos" className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-8">
          <h2 className="font-display text-2xl md:text-3xl uppercase">
            Próximos conciertos de {artist.name} en España
          </h2>

          {artist.upcomingConcerts.map((concert) => (
            <article
              key={`${concert.city}-${concert.venue}`}
              className="border border-cr-border p-6 space-y-5"
            >
              {/* Concert header */}
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="font-display text-xl uppercase">{concert.city}</h3>
                  <p className="font-mono text-[11px] text-cr-text-muted">{concert.venue}</p>
                  <p className="font-mono text-[11px] text-cr-primary font-semibold">
                    {concert.date === "TBD" ? "Fecha por confirmar" : concert.date}
                  </p>
                </div>
                <div className="text-right space-y-1">
                  <p className="font-mono text-xs text-cr-text-muted uppercase tracking-widest">
                    Carpooling desde
                  </p>
                  <p className="font-display text-2xl uppercase text-cr-primary">
                    {concert.concertRideRange}
                  </p>
                  <p className="font-mono text-[10px] text-cr-text-dim">0 % comisión</p>
                </div>
              </div>

              {/* Origin city table */}
              <div>
                <p className="font-mono text-[11px] uppercase tracking-widest text-cr-text-muted mb-3">
                  Precio por asiento desde:
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full font-sans text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-cr-border text-left">
                        <th className="py-2 pr-6 font-semibold text-cr-text">Ciudad de origen</th>
                        <th className="py-2 pr-6 font-semibold text-cr-text">Rango de precio</th>
                        <th className="py-2 font-semibold text-cr-text">Comisión</th>
                      </tr>
                    </thead>
                    <tbody className="text-cr-text-muted">
                      {concert.originCities.map((oc) => (
                        <tr key={oc.city} className="border-b border-cr-border/50">
                          <td className="py-2 pr-6 font-semibold text-cr-text">{oc.city}</td>
                          <td className="py-2 pr-6 text-cr-primary font-semibold">{oc.range}/asiento</td>
                          <td className="py-2 text-cr-primary font-semibold">0 %</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <p className="font-mono text-[10px] text-cr-text-dim mt-2">
                  Precios orientativos basados en tarifas reales publicadas en ConcertRide.
                  El conductor fija el precio para cubrir combustible y peajes (tarifa MITECO).
                </p>
              </div>

              {/* CTA */}
              <Link
                to="/concerts"
                className="inline-flex items-center gap-2 font-sans text-sm font-semibold uppercase tracking-[0.12em] border-2 border-cr-primary text-cr-primary px-5 py-3 hover:bg-cr-primary hover:text-black transition-colors"
              >
                Buscar viaje a {concert.city} →
              </Link>
            </article>
          ))}
        </section>
      )}

      {/* ── Anon CTA — visible only to non-logged-in users, after concert list ── */}
      {!user && hasUpcoming && (
        <section
          className="max-w-6xl mx-auto px-6 pb-8"
          aria-label={`Buscar carpooling al concierto de ${artist.name}`}
        >
          <div className="bg-[#dbff00] text-black p-5 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <p className="font-display text-lg uppercase leading-tight">
                ¿Vas al concierto de {artist.name}?
              </p>
              <p className="font-sans text-sm leading-snug">
                Busca carpooling gratis · 0% comisión · conductores verificados
              </p>
            </div>
            <div className="flex flex-wrap gap-2 shrink-0">
              <Link
                to="/concerts"
                className="inline-flex items-center justify-center bg-black text-[#dbff00] font-sans font-semibold uppercase tracking-[0.12em] text-sm border-2 border-black px-5 py-3 shadow-[3px_3px_0px_0px_rgba(255,255,0,0.4)] hover:shadow-[1px_1px_0px_0px_rgba(255,255,0,0.4)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-100 whitespace-nowrap"
              >
                Buscar viaje →
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center font-sans font-semibold uppercase tracking-[0.12em] text-sm border-2 border-black text-black px-5 py-3 hover:bg-black/10 transition-colors whitespace-nowrap"
              >
                Crear cuenta gratis
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ── Cómo llegar: comparativa de transporte ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <h2 className="font-display text-2xl md:text-3xl uppercase">
          Cómo llegar al concierto de {artist.name}
        </h2>
        <p className="font-sans text-sm text-cr-text-muted max-w-2xl leading-relaxed">
          Comparativa de las opciones de transporte para llegar a un concierto de{" "}
          {artist.name} en España desde una ciudad a más de 300 km.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full font-sans text-xs border-collapse">
            <thead>
              <tr className="border-b border-cr-border text-left">
                <th className="py-2 pr-4 font-semibold text-cr-text">Opción</th>
                <th className="py-2 pr-4 font-semibold text-cr-text">Precio orientativo</th>
                <th className="py-2 pr-4 font-semibold text-cr-text">Comisión</th>
                <th className="py-2 pr-4 font-semibold text-cr-text">Vuelta madrugada</th>
                <th className="py-2 font-semibold text-cr-text">Flexibilidad</th>
              </tr>
            </thead>
            <tbody className="text-cr-text-muted">
              <tr className="border-b border-cr-border/50">
                <td className="py-2 pr-4 font-semibold text-cr-primary">ConcertRide carpooling</td>
                <td className="py-2 pr-4">{minPrice}–20 €/asiento</td>
                <td className="py-2 pr-4 font-semibold text-cr-primary">0 %</td>
                <td className="py-2 pr-4">Sí (coordinada con el conductor)</td>
                <td className="py-2">Alta</td>
              </tr>
              <tr className="border-b border-cr-border/50">
                <td className="py-2 pr-4">Taxi / VTC (Uber, Cabify)</td>
                <td className="py-2 pr-4">~60 € ida (precio nocturno)</td>
                <td className="py-2 pr-4">—</td>
                <td className="py-2 pr-4">Sí (precio ×2–3 de madrugada)</td>
                <td className="py-2">Alta</td>
              </tr>
              <tr className="border-b border-cr-border/50">
                <td className="py-2 pr-4">Bus / tren (Renfe, ALSA)</td>
                <td className="py-2 pr-4">20–50 € ida</td>
                <td className="py-2 pr-4">—</td>
                <td className="py-2 pr-4">No (último ~1:00–1:30)</td>
                <td className="py-2">Baja</td>
              </tr>
              <tr>
                <td className="py-2 pr-4">Otras plataformas de carpooling</td>
                <td className="py-2 pr-4">{minPrice}–20 € + 12–18 %</td>
                <td className="py-2 pr-4">12–18 %</td>
                <td className="py-2 pr-4">Depende del conductor</td>
                <td className="py-2">Media</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="font-mono text-[10px] text-cr-text-dim">
          Estimaciones basadas en tarifas de ConcertRide, EMT, Renfe y VTC (mayo 2026).
          Comisión media de plataformas de carpooling generalistas actualizada a 2026.
        </p>
      </section>

      {/* ── Por qué ConcertRide ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <h2 className="font-display text-2xl md:text-3xl uppercase">
          Por qué ConcertRide para ir al concierto de {artist.name}
        </h2>
        <div className="grid md:grid-cols-3 gap-4 font-sans text-sm text-cr-text-muted leading-relaxed">
          <article className="space-y-2">
            <h3 className="font-display text-base uppercase text-cr-primary">
              0 % de comisión
            </h3>
            <p>
              El 100&nbsp;% del precio del asiento va al conductor. ConcertRide no cobra comisión,
              nunca. Pagas directamente en efectivo o Bizum el día del viaje: económico, directo y
              sin sorpresas.
            </p>
          </article>
          <article className="space-y-2">
            <h3 className="font-display text-base uppercase text-cr-primary">
              Conductores verificados
            </h3>
            <p>
              Todos los conductores verifican su carnet de conducir antes de publicar un viaje.
              Puedes ver sus valoraciones y reseñas de otros pasajeros.
            </p>
          </article>
          <article className="space-y-2">
            <h3 className="font-display text-base uppercase text-cr-primary">
              Horario de concierto real
            </h3>
            <p>
              Vuelves a la hora real en que termine el espectáculo. No dependes del último metro ni
              de taxis a precio de concierto (40–90&nbsp;€ de madrugada). El conductor coordina el
              regreso contigo.
            </p>
          </article>
        </div>
      </section>

      {/* ── FAQs ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <h2 className="font-display text-2xl md:text-3xl uppercase">
          Preguntas frecuentes — {artist.name} en España
        </h2>

        <dl className="space-y-6">
          {/* Per-city how to get there */}
          {artist.upcomingConcerts.map((c) => (
            <div key={`faq-how-${c.city}`} className="border-b border-cr-border pb-6 space-y-2">
              <dt className="font-display text-base uppercase text-cr-text">
                ¿Cómo llegar al concierto de {artist.name} en {c.city}?
              </dt>
              <dd className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
                Para llegar al concierto de {artist.name} en {c.venue} ({c.city}), la opción más
                económica es el carpooling con ConcertRide desde{" "}
                {c.originCities[0]?.city ?? "tu ciudad"} (
                {c.originCities[0]?.range ?? c.concertRideRange}/asiento, sin comisión). El metro,
                tren o autobús cubren el trayecto de ida, pero el transporte de vuelta de madrugada
                es prácticamente inexistente. Con ConcertRide, el conductor coordina el horario de
                regreso contigo adaptándose a la finalización real del concierto.
              </dd>
            </div>
          ))}

          {/* Per-city cost */}
          {artist.upcomingConcerts.map((c) => (
            <div key={`faq-cost-${c.city}`} className="border-b border-cr-border pb-6 space-y-2">
              <dt className="font-display text-base uppercase text-cr-text">
                ¿Cuánto cuesta el carpooling al concierto de {artist.name} desde{" "}
                {c.originCities[0]?.city ?? "Madrid"}?
              </dt>
              <dd className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
                El carpooling con ConcertRide desde {c.originCities[0]?.city ?? "Madrid"} al
                concierto de {artist.name} en {c.city} cuesta aproximadamente{" "}
                {c.originCities[0]?.range ?? c.concertRideRange}/asiento. ConcertRide no cobra
                comisión: el 100&nbsp;% del precio va directamente al conductor. El pago se realiza
                en efectivo o Bizum el día del viaje.
              </dd>
            </div>
          ))}

          {/* Return transport */}
          <div className="border-b border-cr-border pb-6 space-y-2">
            <dt className="font-display text-base uppercase text-cr-text">
              ¿Hay transporte de vuelta nocturno del concierto de {artist.name}?
            </dt>
            <dd className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
              El transporte público nocturno después de los conciertos de {artist.name} suele ser
              escaso o nulo: el metro y los últimos autobuses salen antes de que termine el
              espectáculo. Los taxis y VTC en horario nocturno de concierto pueden triplicar su
              precio habitual (40–90&nbsp;€). Con ConcertRide, el conductor coordina el horario de
              regreso contigo, adaptándose a la hora real de finalización del concierto.
            </dd>
          </div>

          {/* Safety */}
          <div className="border-b border-cr-border pb-6 space-y-2">
            <dt className="font-display text-base uppercase text-cr-text">
              ¿Es seguro el carpooling de ConcertRide para conciertos?
            </dt>
            <dd className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
              Sí. Todos los conductores de ConcertRide verifican su carnet de conducir antes de
              publicar un viaje. Puedes ver sus valoraciones y reseñas de viajes anteriores.
              ConcertRide está especializado en conciertos y festivales en España, por lo que los
              conductores conocen bien los recintos y los horarios de fin de espectáculo.
            </dd>
          </div>

          {/* Tickets */}
          <div className="border-b border-cr-border pb-6 space-y-2">
            <dt className="font-display text-base uppercase text-cr-text">
              ¿Qué precio tiene una entrada para el concierto de {artist.name} en España?
            </dt>
            <dd className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
              Las entradas para los conciertos de {artist.name} en España se venden a través de
              plataformas oficiales como Ticketmaster, Live Nation o la web del recinto.
              ConcertRide no vende entradas: somos una plataforma de carpooling para llegar al
              concierto. Para el transporte, los precios con ConcertRide parten desde {minPrice}&nbsp;€/asiento
              sin comisión.
            </dd>
          </div>
        </dl>
      </section>

      {/* ── Festivales relacionados ── */}
      {relatedFestivals.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-10">
          <h2 className="font-display text-lg uppercase text-cr-text-muted mb-4">
            Festivales donde ha actuado {artist.name}
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
          <AutoLinksForArtist slug={artist.slug} />
        </section>
      )}

      {/* ── CTA ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-4">
        <h2 className="font-display text-2xl md:text-3xl uppercase">
          ¿Listo para ir al concierto?
        </h2>
        <p className="font-sans text-sm text-cr-text-muted max-w-xl leading-relaxed">
          Busca un viaje compartido disponible para el concierto de {artist.name} o publica uno si
          vas en coche. Sin comisión, conductores verificados, pago en efectivo o Bizum.
        </p>
        <div className="flex flex-wrap gap-4">
          <Link
            to="/concerts"
            className="inline-flex items-center gap-2 font-sans text-sm font-semibold uppercase tracking-[0.12em] bg-cr-primary text-black px-6 py-3 hover:bg-cr-primary/90 transition-colors"
          >
            Buscar viaje compartido →
          </Link>
          <Link
            to="/publish"
            className="inline-flex items-center gap-2 font-sans text-sm font-semibold uppercase tracking-[0.12em] border border-cr-border text-cr-text-muted px-6 py-3 hover:border-cr-primary hover:text-cr-primary transition-colors"
          >
            Publicar un viaje
          </Link>
        </div>
      </section>

      {/* ── Legal disclaimer ── */}
      <section className="max-w-6xl mx-auto px-6 pb-10 border-t border-cr-border pt-8">
        <p className="font-mono text-[11px] text-cr-text-dim leading-relaxed">
          ConcertRide no es un socio oficial, patrocinador ni representante de {artist.name} ni de
          su agencia o discográfica. El nombre del artista se utiliza con carácter meramente
          descriptivo para identificar el destino del viaje. Para la compra de entradas o
          información oficial acude siempre a los canales oficiales del artista.{" "}
          <Link
            to="/aviso-legal"
            className="underline underline-offset-2 hover:text-cr-primary transition-colors"
          >
            Aviso legal
          </Link>
          .
        </p>
      </section>

      <StickyRegBar />
    </main>
  );
}
