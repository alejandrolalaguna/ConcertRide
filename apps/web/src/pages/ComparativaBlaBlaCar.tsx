import { Link } from "react-router-dom";
import { ArrowRight, Check, X } from "lucide-react";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";

const COMPARISON_ROWS = [
  ["Especialización", "Solo conciertos y festivales", "Plataforma generalista de viajes compartidos"],
  ["Búsqueda", "Por festival, ciudad y ruta de evento", "Por origen-destino genérico"],
  ["Comisión", "0 %", "12–18 %"],
  ["Pago", "Efectivo o Bizum al conductor", "Pago gestionado en la plataforma"],
  ["Vuelta de madrugada", "Se pacta con el conductor", "Depende del horario publicado"],
  ["Verificación del conductor", "Carnet obligatorio", "Verificación variable"],
  ["Contexto de uso", "Ideal para ir y volver del concierto", "Útil para trayectos de transporte general"],
];

const FAQS = [
  {
    q: "¿ConcertRide sustituye a BlaBlaCar?",
    a: "No. ConcertRide está especializado en conciertos y festivales; BlaBlaCar es generalista. Si buscas un viaje para ir al mismo evento que otras personas, ConcertRide encaja mejor. Si solo quieres un trayecto entre dos ciudades sin contexto de evento, BlaBlaCar también puede servir.",
  },
  {
    q: "¿Por qué ConcertRide cobra menos comisión?",
    a: "Porque ConcertRide no cobra comisión de plataforma. El precio del asiento va íntegramente al conductor, que lo usa para cubrir gasolina y peajes.",
  },
  {
    q: "¿Qué opción es mejor para volver de madrugada?",
    a: "Para volver de madrugada a la salida de un festival, ConcertRide suele ser la más práctica porque la hora de regreso se acuerda con personas que también van al mismo evento.",
  },
  {
    q: "¿Qué pasa si necesito viajar con material de camping?",
    a: "En viajes para festivales con camping suele ser más fácil coordinarlo en ConcertRide, porque el equipaje se comenta antes y el coche se comparte entre asistentes del mismo evento.",
  },
];

export default function ComparativaBlaBlaCar() {
  useSeoMeta({
    title: "ConcertRide vs BlaBlaCar para festivales: comparativa | ConcertRide",
    description:
      "ConcertRide cobra 0 % de comisión; BlaBlaCar cobra 12–18 %. Comparativa real para festivales en España: especialización, pago, vuelta de madrugada y verificación de conductores.",
    canonical: `${SITE_URL}/comparativa/concertride-vs-blablacar`,
    keywords:
      "ConcertRide vs BlaBlaCar, comparativa carpooling festivales, BlaBlaCar festivales, carpooling conciertos España, comisión bla bla car, viaje compartido festival",
    ogType: "article",
    articlePublishedTime: "2026-05-04",
    articleModifiedTime: new Date().toISOString().slice(0, 10),
    articleAuthor: "Equipo ConcertRide",
  });

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Comparativa", item: `${SITE_URL}/comparativa/concertride-vs-blablacar` },
    ],
  };

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: "es-ES",
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  const jsonLdWebPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE_URL}/comparativa/concertride-vs-blablacar#webpage`,
    url: `${SITE_URL}/comparativa/concertride-vs-blablacar`,
    name: "ConcertRide vs BlaBlaCar para festivales",
    description:
      "Comparativa entre ConcertRide y BlaBlaCar para carpooling a festivales y conciertos en España.",
    inLanguage: "es-ES",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#service` },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".comparison-summary", ".faq-answer", "article p:first-of-type"],
    },
  };

  return (
    <main id="main" className="min-h-dvh bg-cr-bg text-cr-text pt-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebPage) }} />

      <div className="max-w-5xl mx-auto px-6 py-12 md:py-16 space-y-12">
        <header className="space-y-4 border-b border-cr-border pb-8">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary">Comparativa</p>
          <h1 className="font-display text-4xl md:text-6xl uppercase leading-[0.92]">
            ConcertRide vs BlaBlaCar para festivales.
          </h1>
          <p className="comparison-summary font-sans text-base text-cr-text-muted max-w-3xl leading-relaxed speakable">
            ConcertRide está pensado para conciertos y festivales; BlaBlaCar es una plataforma generalista. Si quieres una experiencia optimizada para volver de madrugada con gente que también va al mismo evento, la diferencia se nota en precio, horario y coordinación.
          </p>
        </header>

        <section className="space-y-6">
          <h2 className="font-display text-2xl md:text-3xl uppercase">Tabla rápida</h2>
          <div className="overflow-x-auto border border-cr-border">
            <table className="w-full border-collapse font-sans text-sm">
              <thead>
                <tr className="bg-cr-surface/40 border-b border-cr-border text-left">
                  <th className="p-3 font-semibold">Concepto</th>
                  <th className="p-3 font-semibold text-cr-primary">ConcertRide</th>
                  <th className="p-3 font-semibold">BlaBlaCar</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_ROWS.map(([label, concertRide, blablacar]) => (
                  <tr key={label} className="border-b border-cr-border/60 align-top">
                    <td className="p-3 font-semibold">{label}</td>
                    <td className="p-3 text-cr-text-muted">{concertRide}</td>
                    <td className="p-3 text-cr-text-muted">{blablacar}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="font-display text-2xl md:text-3xl uppercase">¿Cuándo usar cada uno?</h2>
          <div className="grid md:grid-cols-2 gap-5">
            <article className="border border-cr-primary p-5 space-y-3">
              <h3 className="font-display text-xl uppercase text-cr-primary">Usa ConcertRide si…</h3>
              <ul className="space-y-2 font-sans text-sm text-cr-text-muted leading-relaxed">
                <li className="flex gap-2"><Check size={16} className="mt-0.5 text-cr-primary" /> Vas a un concierto o festival concreto.</li>
                <li className="flex gap-2"><Check size={16} className="mt-0.5 text-cr-primary" /> Quieres coordinar la vuelta de madrugada.</li>
                <li className="flex gap-2"><Check size={16} className="mt-0.5 text-cr-primary" /> Prefieres no pagar comisión.</li>
                <li className="flex gap-2"><Check size={16} className="mt-0.5 text-cr-primary" /> Llevas algo de equipaje o camping.</li>
              </ul>
            </article>
            <article className="border border-cr-border p-5 space-y-3">
              <h3 className="font-display text-xl uppercase">Usa BlaBlaCar si…</h3>
              <ul className="space-y-2 font-sans text-sm text-cr-text-muted leading-relaxed">
                <li className="flex gap-2"><X size={16} className="mt-0.5 text-cr-secondary" /> Solo buscas un trayecto genérico entre dos ciudades.</li>
                <li className="flex gap-2"><X size={16} className="mt-0.5 text-cr-secondary" /> No te importa la comisión de plataforma.</li>
                <li className="flex gap-2"><X size={16} className="mt-0.5 text-cr-secondary" /> No necesitas coordinar la vuelta del evento.</li>
                <li className="flex gap-2"><X size={16} className="mt-0.5 text-cr-secondary" /> El horario fijo te encaja sin problema.</li>
              </ul>
            </article>
          </div>
        </section>

        <section className="space-y-6 border-t border-cr-border pt-12">
          <h2 className="font-display text-2xl md:text-3xl uppercase">Conclusión práctica</h2>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-3xl">
            Para festivales y conciertos, ConcertRide resuelve mejor el caso de uso real: un grupo de personas que quieren llegar y volver al mismo evento sin depender de horarios cerrados ni de comisiones. BlaBlaCar sigue siendo útil como plataforma general, pero no está diseñada alrededor de la experiencia festivalera.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              to="/concerts"
              className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] border-2 border-cr-primary text-cr-primary px-4 py-2 hover:bg-cr-primary hover:text-black transition-colors"
            >
              Buscar viaje <ArrowRight size={12} />
            </Link>
            <Link
              to="/comparativa/carpooling-vs-taxi-festival"
              className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] border-2 border-cr-border text-cr-text-muted px-4 py-2 hover:border-cr-primary hover:text-cr-primary transition-colors"
            >
              Carpooling vs taxi <ArrowRight size={12} />
            </Link>
            <Link
              to="/como-funciona-carpooling"
              className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] border-2 border-cr-border text-cr-text-muted px-4 py-2 hover:border-cr-primary hover:text-cr-primary transition-colors"
            >
              Cómo funciona <ArrowRight size={12} />
            </Link>
          </div>
        </section>

        <section className="space-y-6 border-t border-cr-border pt-12">
          <h2 className="font-display text-2xl md:text-3xl uppercase">Preguntas frecuentes</h2>
          <dl className="space-y-5">
            {FAQS.map((faq) => (
              <div key={faq.q} className="border-b border-cr-border pb-5 space-y-2">
                <dt className="font-display text-base uppercase">{faq.q}</dt>
                <dd className="faq-answer font-sans text-sm text-cr-text-muted leading-relaxed">{faq.a}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
    </main>
  );
}
