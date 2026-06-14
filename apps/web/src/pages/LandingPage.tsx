import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Banknote, Clock, MapPinned, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import type { Concert, Ride } from "@concertride/types";
import { api } from "@/lib/api";
import { useI18n } from "@/lib/i18n";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";
import { concertStatus } from "@/components/ConcertCard";
import { TESTIMONIAL_REVIEWS, TESTIMONIALS_AGGREGATE } from "@/lib/testimonials";
import { Hero } from "@/components/landing/Hero";
import { StatsBar } from "@/components/StatsBar";
import { HorizontalCarousel } from "@/components/landing/HorizontalCarousel";
import { HowItWorks } from "@/components/HowItWorks";
import { AdhocRidesSection } from "@/components/landing/AdhocRidesSection";
import { MapSection } from "@/components/landing/MapSection";
import { TrustSection } from "@/components/landing/TrustSection";
import { FinalCTA } from "@/components/landing/FinalCTA";
import { TestimonialsSection } from "@/components/landing/TestimonialsSection";
import { TerminologyAside } from "@/components/TerminologyAside";
import { FestivalMarquee } from "@/components/landing/FestivalMarquee";
import { DriverCTA } from "@/components/landing/DriverCTA";
import { RegistrationNudge } from "@/components/landing/RegistrationNudge";

// Icon + i18n-key map for the 6-card "Por qué ConcertRide" grid. Visible text
// (title/body/highlight) is resolved at render time via t("home.whyN…") so the
// Spanish output stays byte-identical while en/ca render translated copy.
const WHY_CONCERTRIDE = [
  { icon: Banknote, titleKey: "home.why1Title", bodyKey: "home.why1Body", highlightKey: "home.why1Highlight" },
  { icon: ShieldCheck, titleKey: "home.why2Title", bodyKey: "home.why2Body", highlightKey: "home.why2Highlight" },
  { icon: MapPinned, titleKey: "home.why3Title", bodyKey: "home.why3Body", highlightKey: "home.why3Highlight" },
  { icon: Clock, titleKey: "home.why4Title", bodyKey: "home.why4Body", highlightKey: "home.why4Highlight" },
  { icon: Banknote, titleKey: "home.why5Title", bodyKey: "home.why5Body", highlightKey: "home.why5Highlight" },
  { icon: ShieldCheck, titleKey: "home.why6Title", bodyKey: "home.why6Body", highlightKey: "home.why6Highlight" },
] as const;

// FAQ items as i18n-key pairs. Rendered text comes from t("home.faqN…"); the
// Spanish render must stay byte-identical with the previous hardcoded copy
// because it also feeds the visible FAQ block consumed by AI Overviews.
const FAQ_ITEMS_LANDING = [
  { questionKey: "home.faq1Q", answerKey: "home.faq1A" },
  { questionKey: "home.faq2Q", answerKey: "home.faq2A" },
  { questionKey: "home.faq3Q", answerKey: "home.faq3A" },
  { questionKey: "home.faq4Q", answerKey: "home.faq4A" },
] as const;

function FAQAccordion({
  items,
  t,
}: {
  items: typeof FAQ_ITEMS_LANDING;
  t: (key: string, params?: Record<string, string | number>) => string;
}) {
  const [open, setOpen] = useState<number | null>(null);
  return (
    <div className="divide-y divide-white/[0.06] border border-white/[0.06]" role="list">
      {items.map((item, i) => {
        const panelId = `faq-panel-${i}`;
        const btnId = `faq-btn-${i}`;
        return (
          <div key={item.questionKey} role="listitem">
            <button
              id={btnId}
              onClick={() => setOpen(open === i ? null : i)}
              aria-expanded={open === i}
              aria-controls={panelId}
              className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left hover:bg-white/[0.02] transition-colors"
            >
              <span className="font-display text-base lg:text-lg uppercase tracking-tight text-white/80">
                {t(item.questionKey)}
              </span>
              <span
                className={`flex-shrink-0 w-8 h-8 border flex items-center justify-center font-mono text-sm transition-colors duration-200 ${
                  open === i
                    ? "border-[#dbff00] text-[#dbff00]"
                    : "border-white/10 text-white/40"
                }`}
                aria-hidden="true"
              >
                {open === i ? "−" : "+"}
              </span>
            </button>
            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              aria-hidden={open !== i}
              className="overflow-hidden transition-all duration-300 ease-in-out"
              style={{ maxHeight: open === i ? "300px" : "0" }}
            >
              <p className="px-6 pb-5 pt-1 font-sans text-sm text-white/40 font-light leading-relaxed">
                {t(item.answerKey)}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default function LandingPage() {
  const { t } = useI18n();
  useSeoMeta({
    title: t("home.metaTitle"),
    description: t("home.metaDescription"),
    canonical: `${SITE_URL}/`,
    preloadImage:
      "https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1800&q=80&auto=format&fit=crop",
    keywords: t("home.metaKeywords"),
    ogType: "website",
    ogImageAlt: t("home.metaOgImageAlt"),
  });

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
        const t = new Date(c.date).getTime();
        return Number.isFinite(t) && t > nowMs && concertStatus(c.date) === "upcoming";
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
        const t = new Date(c.date).getTime();
        return t >= nowMs && t <= cutoffMs;
      })
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(0, 20);
  }, [concerts]);

  const mapRides = useMemo(() => {
    const nearConcertIds = new Set(mapConcerts.map((c) => c.id));
    return (rides ?? []).filter(
      (r) => r.seats_left > 0 && r.status === "active" && nearConcertIds.has(r.concert_id),
    );
  }, [mapConcerts, rides]);

  return (
    <main id="main" className="bg-cr-bg text-cr-text">
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

      {/* 1. HERO */}
      <Hero />

      {/* 2. Festival marquee ticker */}
      <FestivalMarquee />

      {/* 3. Stats bar */}
      <StatsBar />

      {/* 4. Concert carousel — bastante arriba, justo tras los stats */}
      {activeConcerts.length > 0 && <HorizontalCarousel concerts={activeConcerts} />}

      {/* Premium scan-line divider */}
      <div aria-hidden="true" className="cr-scan-divider" />

      {/* 6. Por qué ConcertRide */}
      <section aria-labelledby="why-title" className="relative py-24 lg:py-32 px-6 overflow-hidden bg-[#080808]" id="conciertos">
        {/* Crowd silhouette bg */}
        <img
          aria-hidden="true"
          src="https://images.unsplash.com/photo-1506157786151-b8491531f063?w=1400&q=50&auto=format&fit=crop"
          alt=""
          width={1400}
          height={800}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover object-top opacity-[0.07] pointer-events-none"
        />
        {/* Orange glow top-right */}
        <div
          aria-hidden="true"
          className="absolute top-0 right-0 w-[700px] h-[500px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 100% 0%, rgba(255,79,0,0.09) 0%, transparent 60%)" }}
        />
        {/* Lime glow bottom-left */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 left-0 w-[600px] h-[400px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 0% 100%, rgba(219,255,0,0.06) 0%, transparent 55%)" }}
        />
        <div className="relative max-w-6xl mx-auto space-y-14">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 mb-20 items-center">
            {/* Left — copy */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="font-mono text-xs tracking-[0.3em] text-[#ff4f00] uppercase">
                {t("home.whyEyebrow")}
              </p>
              <h2
                id="why-title"
                className="font-display text-4xl lg:text-6xl uppercase tracking-tight mt-4 leading-[0.88]"
              >
                {t("home.whyTitleLine1")}
                <br />
                <span className="text-[#dbff00]">{t("home.whyTitleLine2")}</span>
              </h2>
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                className="origin-left h-[2px] bg-[#dbff00] w-16 my-8"
                aria-hidden="true"
              />
              <p className="text-white/40 font-light leading-relaxed max-w-md text-base font-sans">
                {t("home.whyIntro")}
              </p>
            </motion.div>

            {/* Right — night car ride photo */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="relative h-72 lg:h-[480px] overflow-hidden group"
            >
              <motion.img
                src="https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=900&q=80&fit=crop"
                alt={t("home.whyImageAlt")}
                width={900}
                height={600}
                className="w-full h-full object-cover"
                loading="lazy"
                decoding="async"
                whileHover={{ scale: 1.04 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              />
              {/* Selective edge overlays — not full cover */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#080808]/90 via-transparent to-[#080808]/20" />
              <div className="absolute inset-0 bg-gradient-to-r from-[#080808]/60 via-transparent to-transparent" />
              {/* Lime tint on hover */}
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
                style={{ background: "linear-gradient(to top, rgba(219,255,0,0.06), transparent 50%)" }}
              />
              {/* Bottom lime hairline */}
              <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-gradient-to-r from-[#dbff00]/60 to-transparent" aria-hidden="true" />
              {/* Corner bracket */}
              <div aria-hidden="true" className="absolute top-4 right-4 w-8 h-8">
                <span className="absolute top-0 right-0 w-6 h-px bg-[#dbff00]/40" />
                <span className="absolute top-0 right-0 w-px h-6 bg-[#dbff00]/40" />
              </div>
              {/* Caption */}
              <div className="absolute bottom-4 left-4 space-y-1">
                <p className="font-mono text-[9px] tracking-[0.18em] text-white/35 uppercase">
                  {t("home.whyImageCaption")}
                </p>
                <div className="flex items-center gap-1.5">
                  <span className="w-1 h-1 rounded-full bg-[#dbff00]/40" aria-hidden="true" />
                  <span className="font-mono text-[8px] text-white/20 uppercase tracking-[0.1em]">{t("home.whyImageBadge")}</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* 6-card feature grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/[0.05]">
            {WHY_CONCERTRIDE.map(({ icon: Icon, titleKey, bodyKey, highlightKey }, i) => (
              <motion.div
                key={titleKey}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.5, delay: i * 0.09, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -3, transition: { duration: 0.2 } }}
                className="relative bg-[#080808] p-8 flex flex-col gap-5 hover:bg-[#0d0d0d] transition-colors duration-200 group overflow-hidden"
              >
                {/* Hover glow */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: "radial-gradient(ellipse at 0% 0%, rgba(219,255,0,0.04) 0%, transparent 60%)" }}
                />
                {/* Hover top accent */}
                <div
                  aria-hidden="true"
                  className="absolute top-0 left-0 right-0 h-[1px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                  style={{ background: "linear-gradient(to right, #dbff00, transparent)" }}
                />
                <div className="flex items-start justify-between gap-4 relative">
                  <div className="w-10 h-10 border border-[#dbff00]/30 flex items-center justify-center text-[#dbff00] group-hover:border-[#dbff00]/60 group-hover:scale-110 transition-all duration-300">
                    <Icon size={18} aria-hidden="true" />
                  </div>
                  <span className="font-mono text-[9px] font-semibold text-[#dbff00] border border-[#dbff00]/20 bg-[#dbff00]/5 px-2 py-1 uppercase tracking-[0.1em]">
                    {t(highlightKey)}
                  </span>
                </div>
                <h3 className="font-display text-lg uppercase leading-tight text-white relative group-hover:text-[#f5f5f5] transition-colors">
                  {t(titleKey)}
                </h3>
                <p className="font-sans text-sm text-white/40 leading-relaxed font-light relative group-hover:text-white/55 transition-colors">
                  {t(bodyKey)}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Link
              to="/register"
              className="cr-btn-shine inline-flex items-center justify-center gap-2 bg-[#dbff00] text-black font-sans font-semibold uppercase tracking-[0.12em] text-sm px-8 py-4 hover:bg-[#c8ec00] transition-colors duration-150 group"
            >
              {t("home.whyCtaJoin")}
              <ArrowRight size={14} className="transition-transform duration-150 group-hover:translate-x-1" aria-hidden="true" />
            </Link>
            <Link
              to="/concerts"
              className="inline-flex items-center justify-center font-sans font-semibold uppercase tracking-[0.12em] text-sm border border-white/20 text-white/70 px-8 py-4 hover:border-white/40 hover:text-white transition-colors duration-150"
            >
              {t("home.whyCtaSeeRides")}
            </Link>
          </div>
        </div>
      </section>

      {/* 7. Cómo funciona */}
      <HowItWorks />

      {/* 8. Mapa viajes activos — refuerza el paso 1 "elige el concierto" */}
      {mapConcerts.length > 0 && <MapSection concerts={mapConcerts} rides={mapRides} />}

      {/* 9. Adhoc rides */}
      <AdhocRidesSection />

      {/* Premium scan-line divider */}
      <div aria-hidden="true" className="cr-scan-divider" />

      {/* 10. Testimonios — grid 4 col */}
      <TestimonialsSection />

      {/* 10b. Registration nudge — urgency strip */}
      <RegistrationNudge />

      {/* 11. Para conductores */}
      <DriverCTA />

      {/* 12. FAQ con accordion premium */}
      <section className="relative py-24 lg:py-32 px-6 overflow-hidden bg-[#080808]">
        {/* Background — crowd silhouette */}
        <img
          aria-hidden="true"
          src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1400&q=40&auto=format&fit=crop"
          alt=""
          width={1400}
          height={800}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-[0.06] pointer-events-none"
        />
        {/* Lime atmospheric glow top-center */}
        <div
          aria-hidden="true"
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[350px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(219,255,0,0.07) 0%, transparent 60%)" }}
        />
        {/* Orange glow bottom-right */}
        <div
          aria-hidden="true"
          className="absolute bottom-0 right-0 w-[500px] h-[300px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 100% 100%, rgba(255,79,0,0.05) 0%, transparent 60%)" }}
        />
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Left */}
            <div className="space-y-6">
              <div className="space-y-4">
                <p className="font-mono text-xs tracking-[0.3em] uppercase text-[#ff4f00]">
                  {t("home.faqEyebrow")}
                </p>
                <h2 className="font-display text-4xl lg:text-5xl uppercase tracking-tight leading-[0.88]">
                  {t("home.faqTitleLine1")}
                  <br />
                  <span className="text-[#dbff00]">{t("home.faqTitleLine2")}</span>
                </h2>
                <div className="h-[2px] bg-[#dbff00] w-16" aria-hidden="true" />
              </div>
              <p className="font-sans text-sm text-white/40 font-light leading-relaxed">
                {t("home.faqMorePrefix")}{" "}
                <a href="mailto:help@concertride.me" className="text-[#dbff00] hover:underline">
                  {t("home.faqMoreLink")}
                </a>
              </p>
              <div className="hidden lg:block">
                <Link
                  to="/como-funciona-carpooling"
                  className="inline-flex items-center gap-2 font-mono text-xs text-white/30 uppercase tracking-[0.15em] hover:text-white/60 transition-colors"
                >
                  {t("home.faqGuideLink")} <ArrowRight size={11} aria-hidden="true" />
                </Link>
              </div>
            </div>

            {/* Right — accordion */}
            <FAQAccordion items={FAQ_ITEMS_LANDING} t={t} />
          </div>
        </div>
      </section>

      {/* 11.5. Terminology bridge — natural-Spanish synonyms for "carpooling" */}
      <TerminologyAside />

      {/* 12. Trust section — sector stats + full FAQ + badges */}
      <TrustSection />

      {/* 13. Industry authority quotes */}
      <section className="border-t border-cr-border bg-cr-bg">
        <div className="max-w-6xl mx-auto px-6 py-12 md:py-16 space-y-6">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
            {t("home.sourcesEyebrow")}
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <blockquote className="space-y-3 border-l-2 border-cr-primary/30 pl-4">
              <p className="font-sans text-sm text-cr-text-muted italic leading-relaxed">
                {t("home.quote1Text")}
              </p>
              <footer className="font-mono text-[10px] text-cr-text-dim">
                —{" "}
                <a href="https://juliesbicycle.com/" target="_blank" rel="noopener noreferrer" className="hover:text-cr-primary">
                  {t("home.quote1Source")}
                </a>
              </footer>
            </blockquote>
            <blockquote className="space-y-3 border-l-2 border-cr-primary/30 pl-4">
              <p className="font-sans text-sm text-cr-text-muted italic leading-relaxed">
                {t("home.quote2Text")}
              </p>
              <footer className="font-mono text-[10px] text-cr-text-dim">
                —{" "}
                <a href="https://www.apmusicales.com/" target="_blank" rel="noopener noreferrer" className="hover:text-cr-primary">
                  {t("home.quote2Source")}
                </a>
                {t("home.quote2Suffix")}
              </footer>
            </blockquote>
            <blockquote className="space-y-3 border-l-2 border-cr-primary/30 pl-4">
              <p className="font-sans text-sm text-cr-text-muted italic leading-relaxed">
                {t("home.quote3Text")}
              </p>
              <footer className="font-mono text-[10px] text-cr-text-dim">
                —{" "}
                <a href="https://www.pollstar.com/" target="_blank" rel="noopener noreferrer" className="hover:text-cr-primary">
                  {t("home.quote3Source")}
                </a>
                {t("home.quote3Suffix")}
              </footer>
            </blockquote>
            <blockquote className="space-y-3 border-l-2 border-cr-primary/30 pl-4">
              <p className="font-sans text-sm text-cr-text-muted italic leading-relaxed">
                {t("home.quote4Text")}
              </p>
              <footer className="font-mono text-[10px] text-cr-text-dim">
                —{" "}
                <a href="https://www.eea.europa.eu/" target="_blank" rel="noopener noreferrer" className="hover:text-cr-primary">
                  {t("home.quote4Source")}
                </a>
                {t("home.quote4Suffix")}
              </footer>
            </blockquote>
            <blockquote className="space-y-3 border-l-2 border-cr-primary/30 pl-4">
              <p className="font-sans text-sm text-cr-text-muted italic leading-relaxed">
                {t("home.quote5Text")}
              </p>
              <footer className="font-mono text-[10px] text-cr-text-dim">
                —{" "}
                <a href="https://www.poderjudicial.es/" target="_blank" rel="noopener noreferrer" className="hover:text-cr-primary">
                  {t("home.quote5Source")}
                </a>
                {t("home.quote5Suffix")}
              </footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* 14. Tabla comparativa */}
      <section aria-labelledby="comparativa-title" className="relative border-t border-white/[0.06] bg-[#080808] overflow-hidden">
        {/* Road at night — very subtle */}
        <img
          aria-hidden="true"
          src="https://images.unsplash.com/photo-1504208434309-cb69f4fe52b0?w=1400&q=40&auto=format&fit=crop"
          alt=""
          width={1400}
          height={800}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-[0.05] pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 50% 100%, rgba(219,255,0,0.04) 0%, transparent 60%)" }}
        />
        <div className="relative max-w-6xl mx-auto px-6 py-12 md:py-16 space-y-6">
          <header className="space-y-2">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
              {t("home.compareEyebrow")}
            </p>
            <h2 id="comparativa-title" className="font-display text-2xl md:text-3xl uppercase leading-tight">
              {t("home.compareTitle")}
            </h2>
            <p className="font-sans text-sm text-cr-text-muted">
              {t("home.compareSubtitle")}
            </p>
          </header>

          <div className="overflow-x-auto">
            <table className="w-full text-sm font-sans border-collapse">
              <thead>
                <tr className="border-b border-cr-border">
                  <th className="text-left py-3 pr-6 font-semibold text-cr-text text-xs uppercase tracking-[0.1em]">{t("home.compareColOption")}</th>
                  <th className="text-right py-3 px-4 font-semibold text-cr-text text-xs uppercase tracking-[0.1em]">{t("home.compareColPrice")}</th>
                  <th className="text-right py-3 px-4 font-semibold text-cr-text text-xs uppercase tracking-[0.1em]">{t("home.compareColFee")}</th>
                  <th className="text-left py-3 pl-4 font-semibold text-cr-text text-xs uppercase tracking-[0.1em]">{t("home.compareColReturn")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-cr-border">
                <tr className="bg-cr-primary/5">
                  <td className="py-3 pr-6 font-semibold text-cr-primary">{t("home.compareRow1Option")}</td>
                  <td className="py-3 px-4 text-right text-cr-text">{t("home.compareRow1Price")}</td>
                  <td className="py-3 px-4 text-right text-cr-primary font-semibold">{t("home.compareRow1Fee")}</td>
                  <td className="py-3 pl-4 text-cr-text-muted">{t("home.compareRow1Return")}</td>
                </tr>
                <tr>
                  <td className="py-3 pr-6 text-cr-text">{t("home.compareRow2Option")}</td>
                  <td className="py-3 px-4 text-right text-cr-text">{t("home.compareRow2Price")}</td>
                  <td className="py-3 px-4 text-right text-cr-text-muted">{t("home.compareRow2Fee")}</td>
                  <td className="py-3 pl-4 text-cr-text-muted">{t("home.compareRow2Return")}</td>
                </tr>
                <tr>
                  <td className="py-3 pr-6 text-cr-text">{t("home.compareRow3Option")}</td>
                  <td className="py-3 px-4 text-right text-cr-text">{t("home.compareRow3Price")}</td>
                  <td className="py-3 px-4 text-right text-cr-text-muted">{t("home.compareRow3Fee")}</td>
                  <td className="py-3 pl-4 text-cr-text-muted">{t("home.compareRow3Return")}</td>
                </tr>
                <tr>
                  <td className="py-3 pr-6 text-cr-text">{t("home.compareRow4Option")}</td>
                  <td className="py-3 px-4 text-right text-cr-text">{t("home.compareRow4Price")}</td>
                  <td className="py-3 px-4 text-right text-cr-text-muted">{t("home.compareRow4Fee")}</td>
                  <td className="py-3 pl-4 text-cr-text-muted">{t("home.compareRow4Return")}</td>
                </tr>
                <tr>
                  <td className="py-3 pr-6 text-cr-text">{t("home.compareRow5Option")}</td>
                  <td className="py-3 px-4 text-right text-cr-text">{t("home.compareRow5Price")}</td>
                  <td className="py-3 px-4 text-right text-cr-text-muted">{t("home.compareRow5Fee")}</td>
                  <td className="py-3 pl-4 text-cr-text-muted">{t("home.compareRow5Return")}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <p className="font-mono text-[10px] text-cr-text-dim">
            {t("home.compareFootnote")}
          </p>
        </div>
      </section>

      {/* 15. Content hub — internal linking */}
      <section className="relative border-t border-white/[0.06] bg-[#0a0a0a] overflow-hidden">
        {/* Festival lights bg — barely visible */}
        <img
          aria-hidden="true"
          src="https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=1400&q=40&auto=format&fit=crop"
          alt=""
          width={1400}
          height={800}
          loading="lazy"
          decoding="async"
          className="absolute inset-0 w-full h-full object-cover object-center opacity-[0.04] pointer-events-none"
        />
        <div
          aria-hidden="true"
          className="absolute top-0 right-0 w-[500px] h-[300px] pointer-events-none"
          style={{ background: "radial-gradient(ellipse at 100% 0%, rgba(255,79,0,0.05) 0%, transparent 60%)" }}
        />
        <div className="relative max-w-6xl mx-auto px-6 py-12 md:py-16 space-y-10">
          <div className="space-y-2">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
              {t("home.hubEyebrow")}
            </p>
            <h2 className="font-display text-2xl md:text-3xl uppercase">
              {t("home.hubTitle")}
            </h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <Link to="/guia-transporte-festivales" className="border border-cr-border p-5 hover:border-cr-primary/50 transition-colors group space-y-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-cr-primary">{t("home.hubLabelGuide")}</p>
              <h3 className="font-display text-base uppercase leading-tight group-hover:text-cr-primary transition-colors">{t("home.hubCard1Title")}</h3>
              <p className="font-sans text-xs text-cr-text-muted leading-relaxed">{t("home.hubCard1Body")}</p>
              <span className="inline-flex items-center gap-1 font-sans text-xs text-cr-primary">{t("home.hubReadCta")} <ArrowRight size={11} /></span>
            </Link>
            <Link to="/guia/festival-sin-coche" className="border border-cr-border p-5 hover:border-cr-primary/50 transition-colors group space-y-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-cr-primary">{t("home.hubLabelGuide")}</p>
              <h3 className="font-display text-base uppercase leading-tight group-hover:text-cr-primary transition-colors">{t("home.hubCard2Title")}</h3>
              <p className="font-sans text-xs text-cr-text-muted leading-relaxed">{t("home.hubCard2Body")}</p>
              <span className="inline-flex items-center gap-1 font-sans text-xs text-cr-primary">{t("home.hubReadCta")} <ArrowRight size={11} /></span>
            </Link>
            <Link to="/guia/presupuesto-festival-grupo" className="border border-cr-border p-5 hover:border-cr-primary/50 transition-colors group space-y-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-cr-primary">{t("home.hubLabelGuide")}</p>
              <h3 className="font-display text-base uppercase leading-tight group-hover:text-cr-primary transition-colors">{t("home.hubCard3Title")}</h3>
              <p className="font-sans text-xs text-cr-text-muted leading-relaxed">{t("home.hubCard3Body")}</p>
              <span className="inline-flex items-center gap-1 font-sans text-xs text-cr-primary">{t("home.hubReadCta")} <ArrowRight size={11} /></span>
            </Link>
            <Link to="/guia/seguridad-carpooling-festival" className="border border-cr-border p-5 hover:border-cr-primary/50 transition-colors group space-y-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-cr-primary">{t("home.hubLabelGuide")}</p>
              <h3 className="font-display text-base uppercase leading-tight group-hover:text-cr-primary transition-colors">{t("home.hubCard4Title")}</h3>
              <p className="font-sans text-xs text-cr-text-muted leading-relaxed">{t("home.hubCard4Body")}</p>
              <span className="inline-flex items-center gap-1 font-sans text-xs text-cr-primary">{t("home.hubReadCta")} <ArrowRight size={11} /></span>
            </Link>
            <Link to="/guia/festival-primera-vez" className="border border-cr-border p-5 hover:border-cr-primary/50 transition-colors group space-y-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-cr-primary">{t("home.hubLabelGuide")}</p>
              <h3 className="font-display text-base uppercase leading-tight group-hover:text-cr-primary transition-colors">{t("home.hubCard5Title")}</h3>
              <p className="font-sans text-xs text-cr-text-muted leading-relaxed">{t("home.hubCard5Body")}</p>
              <span className="inline-flex items-center gap-1 font-sans text-xs text-cr-primary">{t("home.hubReadCta")} <ArrowRight size={11} /></span>
            </Link>
            <Link to="/guia/carpooling-conductor-festival" className="border border-cr-border p-5 hover:border-cr-primary/50 transition-colors group space-y-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-cr-primary">{t("home.hubCard6Label")}</p>
              <h3 className="font-display text-base uppercase leading-tight group-hover:text-cr-primary transition-colors">{t("home.hubCard6Title")}</h3>
              <p className="font-sans text-xs text-cr-text-muted leading-relaxed">{t("home.hubCard6Body")}</p>
              <span className="inline-flex items-center gap-1 font-sans text-xs text-cr-primary">{t("home.hubReadCta")} <ArrowRight size={11} /></span>
            </Link>
            <Link to="/guia/festival-accesibilidad-movilidad-reducida" className="border border-cr-border p-5 hover:border-cr-primary/50 transition-colors group space-y-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-cr-primary">{t("home.hubCard7Label")}</p>
              <h3 className="font-display text-base uppercase leading-tight group-hover:text-cr-primary transition-colors">{t("home.hubCard7Title")}</h3>
              <p className="font-sans text-xs text-cr-text-muted leading-relaxed">{t("home.hubCard7Body")}</p>
              <span className="inline-flex items-center gap-1 font-sans text-xs text-cr-primary">{t("home.hubReadCta")} <ArrowRight size={11} /></span>
            </Link>
            <Link to="/guia/festival-veterano-aficionados-mayores-2026" className="border border-cr-border p-5 hover:border-cr-primary/50 transition-colors group space-y-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-cr-primary">{t("home.hubCard8Label")}</p>
              <h3 className="font-display text-base uppercase leading-tight group-hover:text-cr-primary transition-colors">{t("home.hubCard8Title")}</h3>
              <p className="font-sans text-xs text-cr-text-muted leading-relaxed">{t("home.hubCard8Body")}</p>
              <span className="inline-flex items-center gap-1 font-sans text-xs text-cr-primary">{t("home.hubReadCta")} <ArrowRight size={11} /></span>
            </Link>
            <Link to="/blog/como-volver-festival-madrugada" className="border border-cr-border p-5 hover:border-cr-primary/50 transition-colors group space-y-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-cr-primary">{t("home.hubLabelGuide")}</p>
              <h3 className="font-display text-base uppercase leading-tight group-hover:text-cr-primary transition-colors">{t("home.hubCard9Title")}</h3>
              <p className="font-sans text-xs text-cr-text-muted leading-relaxed">{t("home.hubCard9Body")}</p>
              <span className="inline-flex items-center gap-1 font-sans text-xs text-cr-primary">{t("home.hubReadCta")} <ArrowRight size={11} /></span>
            </Link>
            <Link to="/rutas/madrid-mad-cool" className="border border-cr-border p-5 hover:border-cr-primary/50 transition-colors group space-y-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-cr-primary">{t("home.hubLabelRoute")}</p>
              <h3 className="font-display text-base uppercase leading-tight group-hover:text-cr-primary transition-colors">{t("home.hubCard10Title")}</h3>
              <p className="font-sans text-xs text-cr-text-muted leading-relaxed">{t("home.hubCard10Body")}</p>
              <span className="inline-flex items-center gap-1 font-sans text-xs text-cr-primary">{t("home.hubSeeRouteCta")} <ArrowRight size={11} /></span>
            </Link>
            <Link to="/rutas/madrid-primavera-sound" className="border border-cr-border p-5 hover:border-cr-primary/50 transition-colors group space-y-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-cr-primary">{t("home.hubLabelRoute")}</p>
              <h3 className="font-display text-base uppercase leading-tight group-hover:text-cr-primary transition-colors">{t("home.hubCard11Title")}</h3>
              <p className="font-sans text-xs text-cr-text-muted leading-relaxed">{t("home.hubCard11Body")}</p>
              <span className="inline-flex items-center gap-1 font-sans text-xs text-cr-primary">{t("home.hubSeeRouteCta")} <ArrowRight size={11} /></span>
            </Link>
            <Link to="/como-funciona-carpooling" className="border border-cr-border p-5 hover:border-cr-primary/50 transition-colors group space-y-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-cr-primary">{t("home.hubLabelGuide")}</p>
              <h3 className="font-display text-base uppercase leading-tight group-hover:text-cr-primary transition-colors">{t("home.hubCard12Title")}</h3>
              <p className="font-sans text-xs text-cr-text-muted leading-relaxed">{t("home.hubCard12Body")}</p>
              <span className="inline-flex items-center gap-1 font-sans text-xs text-cr-primary">{t("home.hubReadCta")} <ArrowRight size={11} /></span>
            </Link>
            <Link to="/comparativa/carpooling-vs-taxi-festival" className="border border-cr-border p-5 hover:border-cr-primary/50 transition-colors group space-y-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-cr-primary">{t("home.hubLabelComparison")}</p>
              <h3 className="font-display text-base uppercase leading-tight group-hover:text-cr-primary transition-colors">{t("home.hubCard13Title")}</h3>
              <p className="font-sans text-xs text-cr-text-muted leading-relaxed">{t("home.hubCard13Body")}</p>
              <span className="inline-flex items-center gap-1 font-sans text-xs text-cr-primary">{t("home.hubReadCta")} <ArrowRight size={11} /></span>
            </Link>
            <Link to="/blog" className="border border-cr-border p-5 hover:border-cr-primary/50 transition-colors group space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-cr-primary">{t("home.hubLabelBlog")}</p>
                <h3 className="font-display text-base uppercase leading-tight group-hover:text-cr-primary transition-colors">{t("home.hubCard14Title")}</h3>
                <p className="font-sans text-xs text-cr-text-muted leading-relaxed">{t("home.hubCard14Body")}</p>
              </div>
              <span className="inline-flex items-center gap-1 font-sans text-xs text-cr-primary mt-3">{t("home.hubSeeBlogCta")} <ArrowRight size={11} /></span>
            </Link>
          </div>
        </div>
      </section>

      {/* Premium scan-line divider */}
      <div aria-hidden="true" className="cr-scan-divider" />

      {/* 16. Final CTA — crowd photo + lime bloom */}
      <FinalCTA />

      {/* 17. Sticky mobile CTA — links to next festival landing (Primavera Sound 28 may–1 jun) */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 sm:hidden bg-[#080808]/95 backdrop-blur border-t border-white/[0.06] p-3"
        role="complementary"
        aria-label={t("home.stickyAriaRegion")}
      >
        <a
          href="/festivales/primavera-sound"
          aria-label={t("home.stickyAriaLink")}
          className="block w-full text-center bg-[#dbff00] text-black font-sans font-semibold uppercase tracking-[0.12em] text-sm py-3 hover:bg-[#c8ec00] transition-colors"
        >
          {t("home.stickyCta")}
        </a>
      </div>
    </main>
  );
}
