import { useEffect, useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { Concert, Ride } from "@concertride/types";
import { api } from "@/lib/api";
import { useI18n } from "@/lib/i18n";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";
import { concertStatus } from "@/components/ConcertCard";
import { TESTIMONIAL_REVIEWS, TESTIMONIALS_AGGREGATE } from "@/lib/testimonials";
import { Hero } from "@/components/landing/Hero";
import { HorizontalCarousel } from "@/components/landing/HorizontalCarousel";
import { HowItWorks } from "@/components/HowItWorks";
import { TrustSection } from "@/components/landing/TrustSection";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { TerminologyAside } from "@/components/TerminologyAside";
import { DriverCTA } from "@/components/landing/DriverCTA";
import { Eyebrow, Register, RegisterRow, SectionHead } from "@/components/system";
import { useLevelAMotion } from "@/fx/useLevelAMotion";
import { buildHomeChoreography } from "@/components/landing/homeChoreography";

// "Por qué ConcertRide": seis argumentos en registro. El texto visible se
// resuelve en render con t("home.whyN…"); el español queda byte-idéntico.
const WHY_CONCERTRIDE = [
  { n: "01", titleKey: "home.why1Title", bodyKey: "home.why1Body" },
  { n: "02", titleKey: "home.why2Title", bodyKey: "home.why2Body" },
  { n: "03", titleKey: "home.why3Title", bodyKey: "home.why3Body" },
  { n: "04", titleKey: "home.why4Title", bodyKey: "home.why4Body" },
  { n: "05", titleKey: "home.why5Title", bodyKey: "home.why5Body" },
  { n: "06", titleKey: "home.why6Title", bodyKey: "home.why6Body" },
] as const;

// FAQ corta de la landing (sin schema: el FAQPage vive en TrustSection).
const FAQ_ITEMS_LANDING = [
  { questionKey: "home.faq1Q", answerKey: "home.faq1A" },
  { questionKey: "home.faq2Q", answerKey: "home.faq2A" },
  { questionKey: "home.faq3Q", answerKey: "home.faq3A" },
  { questionKey: "home.faq4Q", answerKey: "home.faq4A" },
] as const;

const SOURCE_QUOTES = [
  { textKey: "home.quote1Text", sourceKey: "home.quote1Source", suffixKey: null, url: "https://juliesbicycle.com/" },
  { textKey: "home.quote2Text", sourceKey: "home.quote2Source", suffixKey: "home.quote2Suffix", url: "https://www.apmusicales.com/" },
  { textKey: "home.quote3Text", sourceKey: "home.quote3Source", suffixKey: "home.quote3Suffix", url: "https://www.pollstar.com/" },
  { textKey: "home.quote4Text", sourceKey: "home.quote4Source", suffixKey: "home.quote4Suffix", url: "https://www.eea.europa.eu/" },
  { textKey: "home.quote5Text", sourceKey: "home.quote5Source", suffixKey: "home.quote5Suffix", url: "https://www.poderjudicial.es/" },
] as const;

const COMPARE_ROWS = [1, 2, 3, 4, 5] as const;

// Hub de contenidos: enlazado interno. Mismos destinos que antes.
const HUB_LINKS = [
  { to: "/guia-transporte-festivales", labelKey: "home.hubLabelGuide", titleKey: "home.hubCard1Title", bodyKey: "home.hubCard1Body", ctaKey: "home.hubReadCta" },
  { to: "/guia/festival-sin-coche", labelKey: "home.hubLabelGuide", titleKey: "home.hubCard2Title", bodyKey: "home.hubCard2Body", ctaKey: "home.hubReadCta" },
  { to: "/guia/presupuesto-festival-grupo", labelKey: "home.hubLabelGuide", titleKey: "home.hubCard3Title", bodyKey: "home.hubCard3Body", ctaKey: "home.hubReadCta" },
  { to: "/guia/seguridad-carpooling-festival", labelKey: "home.hubLabelGuide", titleKey: "home.hubCard4Title", bodyKey: "home.hubCard4Body", ctaKey: "home.hubReadCta" },
  { to: "/guia/festival-primera-vez", labelKey: "home.hubLabelGuide", titleKey: "home.hubCard5Title", bodyKey: "home.hubCard5Body", ctaKey: "home.hubReadCta" },
  { to: "/guia/carpooling-conductor-festival", labelKey: "home.hubCard6Label", titleKey: "home.hubCard6Title", bodyKey: "home.hubCard6Body", ctaKey: "home.hubReadCta" },
  { to: "/guia/festival-accesibilidad-movilidad-reducida", labelKey: "home.hubCard7Label", titleKey: "home.hubCard7Title", bodyKey: "home.hubCard7Body", ctaKey: "home.hubReadCta" },
  { to: "/guia/festival-veterano-aficionados-mayores-2026", labelKey: "home.hubCard8Label", titleKey: "home.hubCard8Title", bodyKey: "home.hubCard8Body", ctaKey: "home.hubReadCta" },
  { to: "/blog/como-volver-festival-madrugada", labelKey: "home.hubLabelGuide", titleKey: "home.hubCard9Title", bodyKey: "home.hubCard9Body", ctaKey: "home.hubReadCta" },
  { to: "/rutas/madrid-mad-cool", labelKey: "home.hubLabelRoute", titleKey: "home.hubCard10Title", bodyKey: "home.hubCard10Body", ctaKey: "home.hubSeeRouteCta" },
  { to: "/rutas/madrid-primavera-sound", labelKey: "home.hubLabelRoute", titleKey: "home.hubCard11Title", bodyKey: "home.hubCard11Body", ctaKey: "home.hubSeeRouteCta" },
  { to: "/como-funciona-carpooling", labelKey: "home.hubLabelGuide", titleKey: "home.hubCard12Title", bodyKey: "home.hubCard12Body", ctaKey: "home.hubReadCta" },
  { to: "/comparativa/carpooling-vs-taxi-festival", labelKey: "home.hubLabelComparison", titleKey: "home.hubCard13Title", bodyKey: "home.hubCard13Body", ctaKey: "home.hubReadCta" },
  { to: "/blog", labelKey: "home.hubLabelBlog", titleKey: "home.hubCard14Title", bodyKey: "home.hubCard14Body", ctaKey: "home.hubSeeBlogCta" },
] as const;

export default function LandingPage() {
  const { t } = useI18n();
  useSeoMeta({
    title: t("home.metaTitle"),
    description: t("home.metaDescription"),
    canonical: `${SITE_URL}/`,
    keywords: t("home.metaKeywords"),
    ogType: "website",
    ogImageAlt: t("home.metaOgImageAlt"),
  });

  const mainRef = useRef<HTMLElement | null>(null);
  useLevelAMotion(mainRef, { onReady: buildHomeChoreography });

  const [concerts, setConcerts] = useState<Concert[] | null>(null);
  const [rides, setRides] = useState<Ride[] | null>(null);

  useEffect(() => {
    Promise.all([api.concerts.list({ limit: 50, date_from: new Date().toISOString() }), api.rides.list({})])
      .then(([c, r]) => {
        setConcerts(c.concerts);
        setRides(r.rides);
      })
      .catch(() => {
        setConcerts([]);
        setRides([]);
      });
  }, []);

  const activeConcerts = useMemo(() => {
    const nowMs = Date.now();
    const futuros = (concerts ?? [])
      .filter((c) => {
        const tm = new Date(c.date).getTime();
        return Number.isFinite(tm) && tm > nowMs && concertStatus(c.date) === "upcoming";
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    return futuros.slice(0, 10);
  }, [concerts]);

  const NINETY_DAYS_MS = 90 * 24 * 60 * 60 * 1000;
  const mapConcerts = useMemo(() => {
    const nowMs = Date.now();
    const cutoffMs = nowMs + NINETY_DAYS_MS;
    return (concerts ?? [])
      .filter((c) => {
        const tm = new Date(c.date).getTime();
        return tm >= nowMs && tm <= cutoffMs;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 20);
  }, [concerts]);

  const mapRides = useMemo(() => {
    const nearConcertIds = new Set(mapConcerts.map((c) => c.id));
    return (rides ?? []).filter((r) => r.seats_left > 0 && r.status === "active" && nearConcertIds.has(r.concert_id));
  }, [mapConcerts, rides]);

  // Ticket del hero: el concierto más próximo con viajes; si no hay, el más próximo.
  const featured = useMemo(
    () => activeConcerts.find((c) => c.active_rides_count > 0) ?? activeConcerts[0] ?? null,
    [activeConcerts],
  );

  return (
    <main id="main" ref={mainRef} className="bg-cr-bg text-cr-text">
      {/* JSON-LD schemas.
          NOTE (Sprint 10 dedup): WebSite + SoftwareApplication + Organization
          ya se emiten globalmente en apps/web/index.html (SPA shell), por lo
          que se han eliminado de esta página para evitar duplicados
          intra-página detectados por scripts/audit-schema-integrity.mjs. */}
      {/* SpeakableSpecification — flags answer-first H1 + lede paragraphs +
          [data-quotable] blocks to AI Overviews / voice assistants. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "@id": `${SITE_URL}/#webpage`,
            url: SITE_URL,
            name: "ConcertRide · Carpooling para conciertos y festivales en España",
            inLanguage: "es-ES",
            isPartOf: { "@id": `${SITE_URL}/#website` },
            speakable: {
              "@type": "SpeakableSpecification",
              cssSelector: ["h1", ".lede", "[data-quotable]", ".speakable"],
            },
          }),
        }}
      />
      {/* Service entity (single, consolidated). Combina la definición canónica
          del servicio (provider/offers/areaServed) con AggregateRating + Reviews
          derivados de lib/testimonials.ts. Sprint 10 dedup: previamente se
          emitían dos bloques Service con el mismo @id="#service". */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "@id": `${SITE_URL}/#service`,
            name: "ConcertRide · Carpooling para conciertos y festivales",
            description: "Plataforma española de carpooling exclusiva para conciertos y festivales de música. Conecta conductores y pasajeros que van al mismo evento. 0 % de comisión, conductores verificados, pago en efectivo o Bizum.",
            serviceType: "Carpooling",
            provider: { "@id": `${SITE_URL}/#organization` },
            areaServed: { "@type": "Country", name: "Spain", sameAs: "https://www.wikidata.org/wiki/Q29" },
            availableChannel: {
              "@type": "ServiceChannel",
              serviceUrl: SITE_URL,
              availableLanguage: ["Spanish", "es"],
            },
            offers: {
              "@type": "Offer",
              price: 0,
              priceCurrency: "EUR",
              priceSpecification: {
                "@type": "PriceSpecification",
                price: 0,
                priceCurrency: "EUR",
                description: "Sin comisión de plataforma — el precio lo fija el conductor para cubrir combustible y peajes",
              },
              seller: { "@id": `${SITE_URL}/#organization` },
            },
            aggregateRating: {
              "@type": "AggregateRating",
              ratingValue: TESTIMONIALS_AGGREGATE.ratingValue,
              reviewCount: TESTIMONIALS_AGGREGATE.reviewCount,
              bestRating: TESTIMONIALS_AGGREGATE.bestRating,
              worstRating: TESTIMONIALS_AGGREGATE.worstRating,
            },
            // Reviews are NESTED inside the parent Service via the `review`
            // property. Google's GSC errors when a nested Review also carries
            // `itemReviewed` ("Un objeto <parent_node> anidado no puede
            // contener el campo itemReviewed. Quita itemReviewed para evitar
            // conflictos de dirección"). Direction is already implied by the
            // parent — omit itemReviewed on every nested review.
            review: TESTIMONIAL_REVIEWS.map((r) => ({
              "@type": "Review",
              author: { "@type": "Person", name: r.name },
              datePublished: r.date,
              reviewBody: r.quote,
              reviewRating: {
                "@type": "Rating",
                ratingValue: r.rating,
                bestRating: 5,
                worstRating: 1,
              },
            })),
          }),
        }}
      />
      {activeConcerts.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "ItemList",
              name: "Próximos conciertos con viajes compartidos en España",
              itemListOrder: "https://schema.org/ItemListOrderAscending",
              numberOfItems: activeConcerts.length,
              itemListElement: activeConcerts.slice(0, 10).map((c, i) => ({
                "@type": "ListItem",
                position: i + 1,
                url: `${SITE_URL}/concerts/${c.id}`,
                name: `${c.artist} · ${c.venue.name}, ${c.venue.city}`,
              })),
            }),
          }}
        />
      )}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Guías cómo llegar a festivales de música en España",
            description: "Guías de transporte con bus lanzadera, tren, metro y carpooling para los festivales más grandes de España",
            numberOfItems: 16,
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Cómo llegar a Mad Cool", url: `${SITE_URL}/como-llegar/mad-cool` },
              { "@type": "ListItem", position: 2, name: "Cómo llegar a Primavera Sound", url: `${SITE_URL}/como-llegar/primavera-sound` },
              { "@type": "ListItem", position: 3, name: "Cómo llegar a Viña Rock", url: `${SITE_URL}/como-llegar/vina-rock` },
              { "@type": "ListItem", position: 4, name: "Cómo llegar a BBK Live", url: `${SITE_URL}/como-llegar/bbk-live` },
              { "@type": "ListItem", position: 5, name: "Cómo llegar a Arenal Sound", url: `${SITE_URL}/como-llegar/arenal-sound` },
              { "@type": "ListItem", position: 6, name: "Cómo llegar a Resurrection Fest", url: `${SITE_URL}/como-llegar/resurrection-fest` },
              { "@type": "ListItem", position: 7, name: "Cómo llegar a FIB Benicàssim", url: `${SITE_URL}/como-llegar/fib` },
              { "@type": "ListItem", position: 8, name: "Cómo llegar a Medusa Festival", url: `${SITE_URL}/como-llegar/medusa-festival` },
              { "@type": "ListItem", position: 9, name: "Cómo llegar a Sónar", url: `${SITE_URL}/como-llegar/sonar` },
              { "@type": "ListItem", position: 10, name: "Cómo llegar a O Son do Camiño", url: `${SITE_URL}/como-llegar/o-son-do-camino` },
              { "@type": "ListItem", position: 11, name: "Cómo llegar a Cala Mijas", url: `${SITE_URL}/como-llegar/cala-mijas` },
              { "@type": "ListItem", position: 12, name: "Cómo llegar a Sonorama Ribera", url: `${SITE_URL}/como-llegar/sonorama-ribera` },
              { "@type": "ListItem", position: 13, name: "Cómo llegar a Zevra Festival", url: `${SITE_URL}/como-llegar/zevra-festival` },
              { "@type": "ListItem", position: 14, name: "Cómo llegar a Low Festival", url: `${SITE_URL}/como-llegar/low-festival` },
              { "@type": "ListItem", position: 15, name: "Cómo llegar a Cruïlla Barcelona", url: `${SITE_URL}/como-llegar/cruilla` },
              { "@type": "ListItem", position: 16, name: "Cómo llegar a Tomavistas Madrid", url: `${SITE_URL}/como-llegar/tomavistas` },
            ],
          }),
        }}
      />
      {/* Sprint 10 dedup: el bloque Service+Reviews ahora va consolidado
          arriba en un único schema con @id="#service". La función
          generateServiceReviewSchema sigue disponible para otras páginas. */}
      {/* SoftwareApplication eliminado (Sprint 10 dedup) — la versión canónica
          se emite en apps/web/index.html con @id estable. La aggregateRating
          se mantiene en el bloque Service de arriba (generateServiceReviewSchema)
          que también referencia provider via @id="#organization". */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "HowTo",
            name: "Cómo reservar un viaje en ConcertRide",
            description: "Pasos para encontrar y reservar un viaje compartido a un concierto o festival en España con ConcertRide",
            step: [
              { "@type": "HowToStep", position: 1, name: "Crea tu cuenta gratis", text: "Regístrate en ConcertRide con tu email. El registro es gratuito y tarda menos de 2 minutos." },
              { "@type": "HowToStep", position: 2, name: "Busca tu destino", text: "Introduce el festival o concierto al que vas. Puedes buscar por artista, ciudad o nombre del evento." },
              { "@type": "HowToStep", position: 3, name: "Elige un viaje disponible", text: "Consulta los viajes activos: precio por asiento, hora de salida y perfil del conductor verificado." },
              { "@type": "HowToStep", position: 4, name: "Solicita tu plaza", text: "Haz click en 'Solicitar plaza' y el conductor recibirá tu petición al instante." },
              { "@type": "HowToStep", position: 5, name: "Confirma el viaje", text: "El conductor acepta tu solicitud y recibes los detalles del punto de recogida." },
              { "@type": "HowToStep", position: 6, name: "Paga el día del viaje", text: "El pago se hace directamente al conductor en efectivo o Bizum. Sin cargos de plataforma." },
              { "@type": "HowToStep", position: 7, name: "¡A disfrutar del festival!", text: "Llega al recinto compartiendo los gastos. Divide el coste entre los pasajeros." },
            ],
            totalTime: "PT2M",
            supply: [],
            tool: [],
          }),
        }}
      />

      {/* 1 · El cartel que se abre */}
      <Hero mapConcerts={mapConcerts} mapRides={mapRides} featured={featured} loaded={concerts !== null} />

      {/* 2 · Tablón de salidas */}
      {activeConcerts.length > 0 && <HorizontalCarousel concerts={activeConcerts} />}

      {/* 3 · Cómo funciona */}
      <HowItWorks />

      {/* 4 · Por qué ConcertRide */}
      <section aria-labelledby="why-title" id="conciertos" className="px-6 py-[var(--rhythm-3)] border-t border-cr-border">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-5 flex flex-col gap-8">
            <SectionHead
              id="why-title"
              eyebrow={t("home.whyEyebrow")}
              size="l"
              title={
                <>
                  {t("home.whyTitleLine1")}
                  <br />
                  <span className="text-cr-primary">{t("home.whyTitleLine2")}</span>
                </>
              }
              lede={t("home.whyIntro")}
              scan="words"
            />
            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/register" className="cr-btn-primary">{t("home.whyCtaJoin")}</Link>
              <Link to="/concerts" className="cr-link cr-label text-cr-text-muted hover:text-cr-text self-center">
                {t("home.whyCtaSeeRides")}
              </Link>
            </div>
          </div>
          <Register as="ol" className="lg:col-span-7">
            {WHY_CONCERTRIDE.map((item) => (
              <li key={item.n}>
                <RegisterRow n={item.n} title={t(item.titleKey)} description={t(item.bodyKey)} scan="light" />
              </li>
            ))}
          </Register>
        </div>
      </section>

      {/* 5 · Para conductores */}
      <DriverCTA />

      {/* 6 · FAQ corta */}
      <section aria-labelledby="faq-title" className="px-6 py-[var(--rhythm-2)] border-t border-cr-border">
        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-4 flex flex-col gap-6">
            <SectionHead
              id="faq-title"
              eyebrow={t("home.faqEyebrow")}
              title={
                <>
                  {t("home.faqTitleLine1")}
                  <br />
                  <span className="text-cr-primary">{t("home.faqTitleLine2")}</span>
                </>
              }
              scan="words"
            />
            <p className="text-sm text-cr-text-muted leading-relaxed">
              {t("home.faqMorePrefix")}{" "}
              <a href="mailto:help@concertride.me" className="cr-link text-cr-text">
                {t("home.faqMoreLink")}
              </a>
            </p>
            <Link to="/como-funciona-carpooling" className="cr-link cr-label text-cr-text-muted hover:text-cr-text inline-flex items-center gap-2 self-start">
              {t("home.faqGuideLink")} <ArrowRight size={14} aria-hidden="true" />
            </Link>
          </div>
          <div className="lg:col-span-8 cr-register" role="list">
            {FAQ_ITEMS_LANDING.map((item) => (
              <details key={item.questionKey} role="listitem" className="group border-b border-cr-border">
                <summary className="flex items-center justify-between gap-6 py-5 cursor-pointer list-none select-none">
                  <span className="font-display text-display-s text-cr-text">{t(item.questionKey)}</span>
                  <span
                    className="flex-shrink-0 w-7 h-7 border border-cr-border-mid flex items-center justify-center text-cr-text-muted group-open:rotate-45 group-open:border-cr-primary group-open:text-cr-primary transition-transform duration-[var(--dur-2)]"
                    aria-hidden="true"
                  >
                    +
                  </span>
                </summary>
                <p className="cr-prose pb-6 text-sm text-cr-text-muted leading-relaxed">{t(item.answerKey)}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 7 · Vocabulario: sinónimos naturales de "carpooling" */}
      <TerminologyAside />

      {/* 8 · Sector en cifras + FAQ larga (FAQPage) */}
      <TrustSection />

      {/* 9 · Fuentes */}
      <section aria-labelledby="sources-title" className="px-6 py-[var(--rhythm-2)] border-t border-cr-border">
        <div className="max-w-6xl mx-auto flex flex-col gap-8">
          <Eyebrow as="p">{t("home.sourcesEyebrow")}</Eyebrow>
          <h2 id="sources-title" className="sr-only">{t("home.sourcesEyebrow")}</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-x-10 gap-y-8" data-scan="rise" data-scan-children="">
            {SOURCE_QUOTES.map((q) => (
              <blockquote key={q.textKey} className="border-l border-cr-border-mid pl-5 flex flex-col gap-3">
                <p className="text-sm text-cr-text-muted leading-relaxed max-w-[42ch]">{t(q.textKey)}</p>
                <footer className="cr-label text-cr-text-muted">
                  <a href={q.url} target="_blank" rel="noopener noreferrer" className="cr-link text-cr-text">
                    {t(q.sourceKey)}
                  </a>
                  {q.suffixKey ? t(q.suffixKey) : null}
                </footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* 10 · Comparativa */}
      <section aria-labelledby="comparativa-title" className="px-6 py-[var(--rhythm-2)] border-t border-cr-border">
        <div className="max-w-6xl mx-auto flex flex-col gap-8">
          <SectionHead
            id="comparativa-title"
            eyebrow={t("home.compareEyebrow")}
            title={t("home.compareTitle")}
            lede={t("home.compareSubtitle")}
            scan="words"
          />
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="border-b border-cr-border">
                  <th className="text-left py-3 pr-6 cr-label text-cr-text-muted">{t("home.compareColOption")}</th>
                  <th className="text-right py-3 px-4 cr-label text-cr-text-muted">{t("home.compareColPrice")}</th>
                  <th className="text-right py-3 px-4 cr-label text-cr-text-muted">{t("home.compareColFee")}</th>
                  <th className="text-left py-3 pl-4 cr-label text-cr-text-muted">{t("home.compareColReturn")}</th>
                </tr>
              </thead>
              <tbody>
                {COMPARE_ROWS.map((i) => (
                  <tr key={i} data-scan="light" className={`border-b border-cr-border ${i === 1 ? "text-cr-text" : ""}`}>
                    <td className={`py-4 pr-6 pl-4 font-medium ${i === 1 ? "cr-light__key" : ""}`}>{t(`home.compareRow${i}Option`)}</td>
                    <td className="py-4 px-4 text-right cr-tabular">{t(`home.compareRow${i}Price`)}</td>
                    <td className={`py-4 px-4 text-right cr-tabular ${i === 1 ? "cr-light__key font-medium" : ""}`}>{t(`home.compareRow${i}Fee`)}</td>
                    <td className="py-4 pl-4">{t(`home.compareRow${i}Return`)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="text-[11px] text-cr-text-muted">{t("home.compareFootnote")}</p>
        </div>
      </section>

      {/* 11 · Guías y recursos: enlazado interno en registro */}
      <section aria-labelledby="hub-title" className="px-6 py-[var(--rhythm-2)] border-t border-cr-border">
        <div className="max-w-6xl mx-auto flex flex-col gap-10">
          <SectionHead id="hub-title" eyebrow={t("home.hubEyebrow")} title={t("home.hubTitle")} scan="words" />
          <Register>
            {HUB_LINKS.map((l) => (
              <RegisterRow
                key={l.to}
                to={l.to}
                n={t(l.labelKey)}
                title={t(l.titleKey)}
                description={t(l.bodyKey)}
                action={
                  <span className="cr-label text-cr-text inline-flex items-center gap-2">
                    {t(l.ctaKey)} <ArrowRight size={14} aria-hidden="true" />
                  </span>
                }
              />
            ))}
          </Register>
        </div>
      </section>

      {/* 12 · Cierre */}
      <FinalCTA />

      {/* 13 · CTA fija en móvil: a la lista real de conciertos, no a un festival concreto */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 sm:hidden bg-cr-bg/95 border-t border-cr-border p-3 pb-[max(0.75rem,env(safe-area-inset-bottom))]"
        role="complementary"
        aria-label={t("home.stickyAriaRegion")}
      >
        <a href="/concerts" className="cr-btn-primary w-full !shadow-none">
          {t("home.heroCtaSearch")} →
        </a>
      </div>
    </main>
  );
}
