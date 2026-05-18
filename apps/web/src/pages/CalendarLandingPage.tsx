import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowRight, Calendar } from "lucide-react";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";
import { CALENDAR_LANDINGS, CALENDAR_LANDINGS_BY_SLUG, CALENDAR_SLUGS, getCalendarFestivals } from "@/lib/calendarLandings";
import type { FestivalLanding } from "@/lib/festivalLandings";

export default function CalendarLandingPage() {
  const { slug } = useParams<{ slug: string }>();
  const cal = slug ? CALENDAR_LANDINGS_BY_SLUG[slug] : undefined;

  if (!slug || !cal) return <Navigate to="/festivales" replace />;

  const festivals = getCalendarFestivals(cal) as FestivalLanding[];

  // Build description 120–160 chars.
  // Months with few festivals use the blurb to pad to ≥120 chars.
  const calDesc = (() => {
    const festNames = festivals.slice(0, 3).map((f) => f.shortName).join(", ");
    const hasFests = festivals.length > 0;
    const core = hasFests
      ? `Festivales de música en ${cal.month.toLowerCase()} ${cal.year} en España: ${festNames}${festivals.length > 3 ? " y más" : ""}. Carpooling sin comisión con ConcertRide.`
      : `Festivales de música en ${cal.month.toLowerCase()} ${cal.year} en España. Carpooling sin comisión con ConcertRide.`;
    if (core.length >= 120) return core.slice(0, 160);
    // Pad with first sentence of blurb to reach ≥120 chars
    const blurbSentence = (cal.blurb.split(".")[0] ?? "").trim();
    const padded = `${core} ${blurbSentence}.`.slice(0, 160);
    return padded.length >= 120 ? padded : core;
  })();

  useSeoMeta({
    title: `Festivales ${cal.month} ${cal.year} España · Carpooling | ConcertRide`,
    description: calDesc,
    canonical: `${SITE_URL}/calendario-festivales/${cal.slug}`,
    keywords: [
      `festivales ${cal.month.toLowerCase()} ${cal.year}`,
      `festivales música ${cal.month.toLowerCase()} ${cal.year} españa`,
      `qué festivales hay en ${cal.month.toLowerCase()} ${cal.year}`,
      `festival ${cal.month.toLowerCase()} españa`,
      `carpooling festivales ${cal.month.toLowerCase()} ${cal.year}`,
      `transporte festivales ${cal.month.toLowerCase()} ${cal.year}`,
      ...festivals.map((f) => `carpooling ${f.shortName}`),
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
        name: `Festivales ${cal.month} ${cal.year}`,
        item: `${SITE_URL}/calendario-festivales/${cal.slug}`,
      },
    ],
  };

  const jsonLdCollectionPage = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `Festivales de música ${cal.month} ${cal.year} en España`,
    url: `${SITE_URL}/calendario-festivales/${cal.slug}`,
    description: cal.blurb,
    inLanguage: "es-ES",
    dateModified: new Date().toISOString().slice(0, 10),
    about: { "@type": "Thing", name: `Festivales de música en España en ${cal.month} ${cal.year}` },
    hasPart: festivals.map((f) => ({
      "@type": "WebPage",
      url: `${SITE_URL}/festivales/${f.slug}`,
      name: `Cómo ir a ${f.name} ${cal.year} | ConcertRide`,
    })),
    isPartOf: { "@type": "WebSite", "@id": `${SITE_URL}/#website`, name: "ConcertRide", url: SITE_URL },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".speakable", ".calendar-blurb"],
    },
  };

  const jsonLdItemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Festivales de música ${cal.month} ${cal.year} en España`,
    description: cal.blurb,
    url: `${SITE_URL}/calendario-festivales/${cal.slug}`,
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
    mainEntity: cal.faqs.map((f) => ({
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
          <span className="text-cr-text-muted">{cal.month} {cal.year}</span>
        </nav>

        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary inline-flex items-center gap-2">
          <Calendar size={12} /> Calendario festivalero
        </p>

        <h1 className="font-display text-4xl md:text-6xl uppercase leading-[0.92]">
          FESTIVALES {cal.month.toUpperCase()} {cal.year} EN ESPAÑA
        </h1>

        <p className="font-sans text-sm md:text-base text-cr-text-muted max-w-2xl leading-relaxed speakable calendar-blurb">
          {cal.blurb}
        </p>

        <div className="flex flex-wrap gap-4 pt-2">
          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-cr-text-muted border border-cr-border px-2 py-1">
            <Calendar size={10} /> {cal.month} {cal.year}
          </span>
          <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-cr-text-muted border border-cr-border px-2 py-1">
            {festivals.length} {festivals.length === 1 ? "festival" : "festivales"} en ConcertRide
          </span>
        </div>
      </div>

      {/* ── Summary table (featured-snippet target) ── */}
      {festivals.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pb-6">
          <div className="overflow-x-auto">
            <table className="w-full font-mono text-xs border-collapse" aria-label={`Festivales de música en España en ${cal.month} ${cal.year}`}>
              <thead>
                <tr className="border-b border-cr-border text-cr-text-muted text-left">
                  <th className="py-2 pr-4 font-semibold uppercase tracking-[0.1em]">Festival</th>
                  <th className="py-2 pr-4 font-semibold uppercase tracking-[0.1em]">Fechas</th>
                  <th className="py-2 pr-4 font-semibold uppercase tracking-[0.1em]">Ciudad</th>
                  <th className="py-2 font-semibold uppercase tracking-[0.1em]">Carpooling desde</th>
                </tr>
              </thead>
              <tbody>
                {festivals.map((f) => (
                  <tr key={f.slug} className="border-b border-cr-border/50 hover:bg-cr-primary/5 transition-colors">
                    <td className="py-2 pr-4">
                      <Link to={`/festivales/${f.slug}`} className="text-cr-text hover:text-cr-primary font-semibold">
                        {f.shortName}
                      </Link>
                    </td>
                    <td className="py-2 pr-4 text-cr-text-muted">{f.typicalDates}</td>
                    <td className="py-2 pr-4 text-cr-text-muted">{f.city}</td>
                    <td className="py-2 text-cr-primary font-semibold">{f.originCities[0]?.concertRideRange ?? "3 €"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* ── Festival cards ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <h2 className="font-display text-2xl md:text-3xl uppercase">
          ¿Qué festivales hay en {cal.month} {cal.year}?
        </h2>
        <p className="font-sans text-sm text-cr-text-muted max-w-2xl">
          Festivales de música en España en {cal.month.toLowerCase()} {cal.year} con carpooling disponible en ConcertRide.
          Precio por asiento sin comisión.
        </p>

        {festivals.length === 0 ? (
          <div className="border border-dashed border-cr-border p-10 text-center space-y-3">
            <p className="font-display text-xl uppercase text-cr-text-muted">
              Próximamente más festivales para este mes
            </p>
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

      {/* ── FAQ ── */}
      {cal.faqs.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
          <h2 className="font-display text-2xl md:text-3xl uppercase">
            Preguntas frecuentes — Festivales en {cal.month} {cal.year}
          </h2>
          <dl className="space-y-6">
            {cal.faqs.map((faq) => (
              <div key={faq.q} className="border-b border-cr-border pb-6 space-y-2">
                <dt className="font-display text-base uppercase text-cr-text">{faq.q}</dt>
                <dd className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">{faq.a}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {/* ── Rutas destacadas (internal linking → /rutas/) ── */}
      {cal.relatedLinks && cal.relatedLinks.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pb-12 border-t border-cr-border pt-10">
          <h2 className="font-display text-lg uppercase text-cr-text-muted mb-4">
            Rutas destacadas para {cal.month.toLowerCase()} {cal.year}
          </h2>
          <ul className="flex flex-wrap gap-2">
            {cal.relatedLinks.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  className="inline-flex items-center gap-1.5 font-sans text-xs text-cr-text-muted hover:text-cr-primary border border-cr-border hover:border-cr-primary px-3 py-1.5 transition-colors"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ── Other months ── */}
      <section className="max-w-6xl mx-auto px-6 pb-12 border-t border-cr-border pt-10">
        <h2 className="font-display text-lg uppercase text-cr-text-muted mb-4">
          Otros meses del calendario festivalero
        </h2>
        <ul className="flex flex-wrap gap-2">
          {CALENDAR_LANDINGS.filter((c) => c.slug !== cal.slug).map((c) => (
            <li key={c.slug}>
              <Link
                to={`/calendario-festivales/${c.slug}`}
                className="inline-flex items-center gap-1.5 font-sans text-xs text-cr-text-muted hover:text-cr-primary border border-cr-border hover:border-cr-primary px-3 py-1.5 transition-colors"
              >
                {c.month} {c.year}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12">
        <div className="border border-cr-primary/30 bg-cr-primary/5 p-8 space-y-4 text-center">
          <h2 className="font-display text-2xl md:text-3xl uppercase">
            ¿Vas a un festival en {cal.month} {cal.year}?
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

export { CALENDAR_SLUGS };
