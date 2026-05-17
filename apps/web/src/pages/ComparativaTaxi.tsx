import { Link } from "react-router-dom";
import { ArrowRight, Leaf, CarTaxiFront } from "lucide-react";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";

const FAQS = [
  {
    q: "¿Sale más barato el carpooling que el taxi para ir a un festival?",
    a: "Sí, casi siempre. Para rutas medias y largas el carpooling suele quedar entre 3 y 20 €/asiento, mientras que un taxi de ida y vuelta a un festival puede superar fácilmente los 50–100 € según la distancia y la tarifa nocturna.",
  },
  {
    q: "¿Qué pasa con la vuelta de madrugada?",
    a: "El taxi funciona, pero puede ser caro y difícil de encontrar justo al acabar el último concierto. Con ConcertRide la vuelta se acuerda antes del viaje y viajas con gente que también sale del evento, así que el horario es más natural.",
  },
  {
    q: "¿Es más sostenible compartir coche que ir solo en taxi?",
    a: "Sí. Compartir coche reparte las emisiones entre varias personas y evita que cada asistente pague un vehículo completo. En festivales, eso reduce mucho el impacto por pasajero.",
  },
  {
    q: "¿Cuándo puede compensar el taxi?",
    a: "El taxi puede compensar si solo haces un trayecto muy corto, viajas con mucha prisa o no encuentras ninguna alternativa. Para la mayoría de festivales españoles, el carpooling suele ser más barato y flexible.",
  },
];

export default function ComparativaTaxi() {
  useSeoMeta({
    title: "Carpooling vs taxi para ir a un festival · ConcertRide",
    description:
      "Carpooling 3–20 €/asiento vs taxi 50–100 € ida y vuelta. Comparativa real para festivales en España: precio, vuelta nocturna y CO₂ evitado.",
    canonical: `${SITE_URL}/comparativa/carpooling-vs-taxi-festival`,
    keywords:
      "carpooling vs taxi festival, taxi festival precio, ahorrar taxi festival, vuelta de madrugada festival, coche compartido versus taxi, transporte festival barato",
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
      { "@type": "ListItem", position: 2, name: "Comparativa", item: `${SITE_URL}/comparativa/carpooling-vs-taxi-festival` },
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
    "@id": `${SITE_URL}/comparativa/carpooling-vs-taxi-festival#webpage`,
    url: `${SITE_URL}/comparativa/carpooling-vs-taxi-festival`,
    name: "Carpooling vs taxi para ir a un festival",
    description:
      "Comparativa de ahorro económico y sostenibilidad entre carpooling y taxi para ir a festivales en España.",
    inLanguage: "es-ES",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#service` },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".comparison-summary", ".faq-answer", "article p:first-of-type"],
    },
  };

  const sampleRows = [
    ["Trayecto corto (20 km)", "3–5 € por asiento", "20–35 € ida"],
    ["Trayecto medio (100 km)", "5–10 € por asiento", "35–60 € ida"],
    ["Trayecto largo (300 km)", "10–20 € por asiento", "80–140 € ida"],
    ["Vuelta de madrugada", "Se coordina con el conductor", "Disponible, pero más cara"],
  ];

  return (
    <main id="main" className="min-h-dvh bg-cr-bg text-cr-text pt-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebPage) }} />

      <div className="max-w-5xl mx-auto px-6 py-12 md:py-16 space-y-12">
        <header className="space-y-4 border-b border-cr-border pb-8">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary">Comparativa</p>
          <h1 className="font-display text-4xl md:text-6xl uppercase leading-[0.92]">
            Carpooling vs taxi para ir a un festival.
          </h1>
          <p className="comparison-summary font-sans text-base text-cr-text-muted max-w-3xl leading-relaxed speakable">
            Si vas a un festival o a un concierto de noche, el taxi resuelve el último kilómetro, pero el carpooling suele ganar en precio total, comodidad para grupos y coordinación de vuelta.
          </p>
        </header>

        <section className="space-y-6">
          <h2 className="font-display text-2xl md:text-3xl uppercase">Tabla de ahorro</h2>
          <div className="overflow-x-auto border border-cr-border">
            <table className="w-full border-collapse font-sans text-sm">
              <thead>
                <tr className="bg-cr-surface/40 border-b border-cr-border text-left">
                  <th className="p-3 font-semibold">Escenario</th>
                  <th className="p-3 font-semibold text-cr-primary">Carpooling</th>
                  <th className="p-3 font-semibold">Taxi</th>
                </tr>
              </thead>
              <tbody>
                {sampleRows.map(([scenario, carpooling, taxi]) => (
                  <tr key={scenario} className="border-b border-cr-border/60 align-top">
                    <td className="p-3 font-semibold">{scenario}</td>
                    <td className="p-3 text-cr-text-muted">{carpooling}</td>
                    <td className="p-3 text-cr-text-muted">{taxi}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="space-y-6">
          <h2 className="font-display text-2xl md:text-3xl uppercase">Ventajas medioambientales</h2>
          <div className="grid md:grid-cols-2 gap-5">
            <article className="border border-cr-primary p-5 space-y-3">
              <h3 className="font-display text-xl uppercase text-cr-primary flex items-center gap-2"><Leaf size={18} /> Menos CO₂ por persona</h3>
              <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
                Compartir coche reduce la huella por pasajero porque la emisión del trayecto se reparte entre varias plazas. Cuatro personas en un mismo coche contaminan mucho menos por cabeza que cuatro taxis separados.
              </p>
            </article>
            <article className="border border-cr-border p-5 space-y-3">
              <h3 className="font-display text-xl uppercase flex items-center gap-2"><CarTaxiFront size={18} /> Taxi: útil pero poco eficiente</h3>
              <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
                El taxi puede ser muy cómodo para trayectos cortos o urgencias, pero en festivales y conciertos de madrugada el precio sube mucho y la disponibilidad puede caer justo cuando todo el mundo sale a la vez.
              </p>
            </article>
          </div>
        </section>

        <section className="space-y-6 border-t border-cr-border pt-12">
          <h2 className="font-display text-2xl md:text-3xl uppercase">Conclusión práctica</h2>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-3xl">
            Para ir a un festival, el carpooling suele ser la opción más equilibrada: ahorro, flexibilidad y vuelta coordinada. El taxi sigue siendo una alternativa válida si el trayecto es muy corto o necesitas salir con máxima rapidez, pero rara vez gana en precio total para rutas de concierto.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              to="/concerts"
              className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] border-2 border-cr-primary text-cr-primary px-4 py-2 hover:bg-cr-primary hover:text-black transition-colors"
            >
              Buscar viaje <ArrowRight size={12} />
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
