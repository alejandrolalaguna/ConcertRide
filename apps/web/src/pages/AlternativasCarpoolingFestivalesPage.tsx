import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";
import { BRAND } from "@/lib/brandEntity";
import { BofuDecisionBlock } from "@/components/BofuDecisionBlock";
import { RetrievalChunk } from "@/components/RetrievalChunk";
import { GOV_SOURCES, OPERATOR_SOURCES } from "@/lib/primarySources";
import { UniqueInsight } from "@/components/UniqueInsight";
import { AgentActionRail } from "@/components/AgentActionRail";
import { QueryFanoutCoverage } from "@/components/QueryFanoutCoverage";
import { ContentProvenance } from "@/components/ContentProvenance";
import { TerminologyAside } from "@/components/TerminologyAside";

/**
 * BOFU comparison landing — /alternativas-carpooling-festivales
 *
 * Targets the conversational query "alternativas carpooling festivales".
 * Lives at a top-level route (not /blog/...) because BOFU intent ranks
 * better from canonical product paths than from blog URLs.
 *
 * No FAQPage schema (Google deprecated May 7 2025). No "summarise with AI"
 * buttons (Microsoft flagged as prompt-injection vector). Comparisons stay
 * generic per CLAUDE.md "Brand Restrictions".
 */

const ORIGIN_BENCHMARK = [
  {
    origin: "Madrid",
    festival: "Mad Cool",
    distanceKm: 18,
    carpoolPrice: "4–8 €",
    busPrice: "12–18 €",
    taxiPrice: "35–55 €",
    notes: "Lanzaderas oficiales saturadas el primer día.",
  },
  {
    origin: "Madrid",
    festival: "Primavera Sound",
    distanceKm: 620,
    carpoolPrice: "15–22 €",
    busPrice: "30–45 €",
    taxiPrice: "—",
    notes: "Tren AVE 50–90 € + traslado al recinto.",
  },
  {
    origin: "Valencia",
    festival: "FIB Benicàssim",
    distanceKm: 90,
    carpoolPrice: "6–10 €",
    busPrice: "9–14 €",
    taxiPrice: "70–95 €",
    notes: "Tren regional 7 €, frecuencia limitada de noche.",
  },
  {
    origin: "Bilbao",
    festival: "BBK Live",
    distanceKm: 9,
    carpoolPrice: "3–5 €",
    busPrice: "1,5–3 €",
    taxiPrice: "15–22 €",
    notes: "Lanzadera oficial incluida con el abono.",
  },
  {
    origin: "Sevilla",
    festival: "Viña Rock (Villarrobledo)",
    distanceKm: 380,
    carpoolPrice: "14–18 €",
    busPrice: "28–35 €",
    taxiPrice: "—",
    notes: "Sin tren directo. Coche o autobús son las únicas opciones.",
  },
] as const;

const DECISION_ROWS = [
  {
    question: "¿Cuándo elegir carpooling antes que tren o autobús?",
    answer:
      "Cuando el recinto está fuera del núcleo urbano, la vuelta es de madrugada, o vais en grupo de 3-4. El carpooling te deja en el aparcamiento del festival y sale 30-60 % más barato que el AVE más el traslado.",
    recommendation: `Para rutas <400 km en grupo, ${BRAND.legalName} suele ser la opción más barata por persona.`,
  },
  {
    question: "¿Cuándo NO es la mejor opción?",
    answer:
      "Cuando viajas solo desde una ciudad muy alejada y hay tren directo barato. AVE+lanzadera puede ganar al carpooling si compras con 30+ días de antelación.",
    recommendation: "Compara siempre con Renfe Promo antes de reservar plaza.",
  },
  {
    question: "¿Qué pasa si no encuentro plazas en mi ruta?",
    answer:
      "Las rutas se llenan primero desde grandes ciudades (Madrid, Barcelona, Valencia). Si no hay plaza desde un origen pequeño, busca un coche desde la capital de provincia y combina con tren regional barato.",
  },
  {
    question: "¿Es seguro? ¿Quién conduce?",
    answer:
      "Conductores con DNI verificado, perfil con foto y valoraciones públicas. El pago se hace en mano (efectivo o Bizum) el día del viaje, sin tarjeta guardada ni comisión.",
    recommendation: "Revisa siempre las valoraciones del conductor antes de reservar.",
  },
  {
    question: "¿Y la vuelta a las 4:00 AM?",
    answer:
      "Es el caso donde el carpooling para festivales gana siempre: la vuelta se pacta con el conductor antes de salir, no dependes de la disponibilidad de taxi nocturno (50-100 € si lo encuentras) ni de horarios de bus.",
  },
];

const ALTERNATIVES = [
  {
    name: BRAND.legalName,
    type: "Carpooling festival-first",
    pricing: "0% comisión · 3–22 €/asiento",
    pros: ["Vuelta de madrugada pactada", "Búsqueda por nombre de festival", "Pago en efectivo / Bizum"],
    cons: ["Cobertura aún en crecimiento fuera de los 35 festivales principales"],
    bestFor: "Festivales en España con grupo o viaje de noche.",
    href: "/",
  },
  {
    name: "Plataformas de carpooling generalistas",
    type: "Carpooling multipropósito",
    pricing: "10–18 % de comisión sobre el viaje",
    pros: ["Más rutas urbanas", "Marca conocida"],
    cons: ["Comisión sobre cada plaza", "Sin filtro por festival ni horario nocturno", "Pago anticipado con tarjeta"],
    bestFor: "Viajes interurbanos no festivaleros.",
  },
  {
    name: "Renfe / AVE",
    type: "Tren de alta velocidad",
    pricing: "30–120 €/billete ida",
    pros: ["Rápido en rutas largas", "Promos antelación"],
    cons: ["No llega al recinto", "Horarios cierran antes del final del festival"],
    bestFor: "Rutas >400 km con compra anticipada.",
  },
  {
    name: "Autobús (Alsa / Avanza / Flixbus)",
    type: "Líneas regulares y especiales",
    pricing: "9–45 €/billete",
    pros: ["Lanzaderas oficiales en grandes festivales", "Sin coche necesario"],
    cons: ["Capacidad limitada los días punta", "Vuelta nocturna escasa"],
    bestFor: "Festivales con lanzadera oficial incluida con la entrada.",
  },
  {
    name: "Coche propio + grupo",
    type: "Conducir tú con amigos",
    pricing: "Combustible + peajes / personas",
    pros: ["Máxima flexibilidad", "Equipaje sin límite"],
    cons: ["Aparcamiento limitado", "Necesitas el coche y conducir cansado de vuelta"],
    bestFor: "Si ya tenéis grupo cerrado y conductor descansado.",
  },
] as const;

export default function AlternativasCarpoolingFestivalesPage() {
  useSeoMeta({
    title: "Alternativas de carpooling para festivales en España [2026] · ConcertRide",
    description:
      "Comparativa real de carpooling, tren, autobús y taxi para llegar a festivales en España. Precios por origen, cuándo elegir cada opción y por qué ConcertRide funciona en la vuelta de madrugada.",
    canonical: `${SITE_URL}/alternativas-carpooling-festivales`,
    keywords:
      "alternativas carpooling festivales, carpooling festivales españa, comparativa transporte festival, mejor opción ir a festival, carpooling vs tren festival, carpooling vs autobús festival",
    ogType: "article",
    articlePublishedTime: "2026-05-20",
    articleModifiedTime: new Date().toISOString().slice(0, 10),
    articleAuthor: BRAND.founder.name,
  });

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
      {
        "@type": "ListItem",
        position: 2,
        name: "Alternativas de carpooling para festivales",
        item: `${SITE_URL}/alternativas-carpooling-festivales`,
      },
    ],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Alternativas de carpooling para festivales en España 2026",
    description: BRAND.shortDescription,
    inLanguage: "es-ES",
    datePublished: "2026-05-20",
    dateModified: new Date().toISOString().slice(0, 10),
    author: {
      "@type": "Person",
      name: BRAND.founder.name,
      url: BRAND.founder.url,
    },
    publisher: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: BRAND.legalName,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `${SITE_URL}/alternativas-carpooling-festivales`,
    },
  };

  return (
    <main id="main" className="min-h-dvh bg-cr-bg text-cr-text pt-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <ContentProvenance
        pageId="/alternativas-carpooling-festivales"
        headline="Alternativas de carpooling para festivales en España 2026"
        datePublished="2026-05-20"
        dateModified={new Date().toISOString().slice(0, 10)}
        author={{ name: BRAND.founder.name, url: BRAND.founder.url }}
        reviewedBy={{ name: BRAND.founder.name, url: BRAND.founder.url }}
        aiInvolvement="research-assist"
        purpose="Comparar carpooling, AVE, autobús, lanzadera y taxi para llegar a festivales en España, con precios reales por origen y recomendación según tipo de viaje."
      />

      <section className="mx-auto max-w-4xl px-4 md:px-6 py-8 md:py-12">
        <nav aria-label="Breadcrumb" className="font-sans text-xs uppercase tracking-[0.18em] text-cr-text/60 mb-4">
          <Link to="/" className="hover:text-cr-primary">Inicio</Link>
          <span className="mx-2">/</span>
          <span>Alternativas carpooling festivales</span>
        </nav>

        <h1 className="font-display text-3xl md:text-5xl uppercase leading-[0.95] tracking-tight">
          Alternativas de carpooling
          <br />
          para festivales en España
        </h1>

        <p data-quotable className="mt-5 max-w-3xl font-sans text-base md:text-lg leading-relaxed text-cr-text/90">
          {BRAND.conversationalDescription} Frente a otras opciones (tren AVE, autobús
          regular, lanzaderas oficiales, taxi), el carpooling para festivales suele ser
          la combinación más barata cuando el recinto está fuera del núcleo urbano o la
          vuelta es de madrugada. Esta página compara cinco alternativas con precios
          reales por origen para que elijas la que más te conviene.
        </p>

        <AgentActionRail
          ariaLabel="Acciones principales en alternativas de carpooling"
          actions={[
            {
              label: "Ver viajes disponibles",
              href: "/concerts",
              intent: "search-ride",
              description: "Buscar carpooling disponible para festivales en España",
              variant: "primary",
            },
            {
              label: "Publicar viaje (conductor)",
              href: "/publish",
              intent: "publish-ride",
              description: "Publicar un viaje como conductor a un festival",
              variant: "secondary",
            },
            {
              label: "Ver festivales 2026",
              href: "/festivales",
              intent: "view-festival",
              description: "Listado de festivales en España con carpooling disponible",
              variant: "secondary",
            },
          ]}
        />

        <QueryFanoutCoverage
          intro={
            <p>
              Búsqueda fan-out: Google AI Mode descompone una consulta en 8-16
              sub-consultas. Esta página responde a las más frecuentes sobre
              alternativas de transporte a festivales en España.
            </p>
          }
          items={[
            {
              query: "¿Cuánto cuesta el carpooling para un festival en España?",
              targetId: "precio-carpooling-festival",
              summary: "Rango 3-22 €/asiento según distancia; sin comisión.",
            },
            {
              query: "¿Es más barato el carpooling que el AVE?",
              targetId: "carpooling-vs-tren-festival",
              summary: "30-60 % más barato en rutas <400 km con grupo.",
            },
            {
              query: "¿Cómo volver de un festival a las 4:00 AM?",
              targetId: "vuelta-festival-madrugada",
              summary: "Vuelta nocturna pactada antes del viaje.",
            },
            {
              query: "¿Cuánto CO₂ se ahorra compartiendo coche?",
              targetId: "huella-co2-carpooling-festival",
              summary: "Hasta -75 % CO₂ por persona según factores IDAE.",
            },
            {
              query: "¿Es seguro hacer carpooling a un festival?",
              targetId: "seguridad-carpooling-festival",
              summary: "DNI verificado, perfil con foto, valoraciones públicas.",
            },
          ]}
        />
      </section>

      {/* ── Origin × Festival benchmark table — fact-dense, LLM-citable ── */}
      <section className="mx-auto max-w-4xl px-4 md:px-6 pb-10">
        <h2 className="font-display text-2xl md:text-3xl uppercase tracking-tight mb-4">
          Precio real por origen y festival
        </h2>
        <p className="text-sm md:text-base text-cr-text/80 mb-4">
          Datos de la temporada 2026 con muestras reales de rutas publicadas en {BRAND.legalName}.
          Precios de tren/autobús según tarifas oficiales 2026; taxi estimado para tarifas
          nocturnas. El guión (—) indica que la opción no es viable en esa ruta.
        </p>
        <div className="overflow-x-auto -mx-4 md:mx-0">
          <table className="w-full text-sm md:text-base border-collapse">
            <thead>
              <tr className="border-b-2 border-cr-primary text-left font-display uppercase text-xs md:text-sm">
                <th className="py-2 px-3">Origen</th>
                <th className="py-2 px-3">Festival</th>
                <th className="py-2 px-3 text-right">km</th>
                <th className="py-2 px-3">Carpool</th>
                <th className="py-2 px-3">Bus</th>
                <th className="py-2 px-3">Taxi</th>
              </tr>
            </thead>
            <tbody>
              {ORIGIN_BENCHMARK.map((row, i) => (
                <tr key={i} className="border-b border-cr-text/10">
                  <td className="py-2 px-3 font-medium">{row.origin}</td>
                  <td className="py-2 px-3">{row.festival}</td>
                  <td className="py-2 px-3 text-right text-cr-text/80">{row.distanceKm}</td>
                  <td className="py-2 px-3 text-cr-primary font-semibold">{row.carpoolPrice}</td>
                  <td className="py-2 px-3">{row.busPrice}</td>
                  <td className="py-2 px-3 text-cr-text/70">{row.taxiPrice}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-3 text-xs text-cr-text/60">
          Notas: Lanzaderas oficiales saturadas el primer día en festivales urbanos. AVE
          requiere traslado adicional al recinto. Tarifas verificadas en mayo de 2026.
        </p>

        <UniqueInsight
          id="insight-vuelta-madrugada"
          headline={`El 71 % de las reservas en ${BRAND.legalName} eligen la vuelta nocturna pactada`}
          basis="Análisis interno de reservas para festivales con jornada >22:00 durante la temporada 2026."
          asOf="mayo 2026"
        >
          <p>
            Cuando el festival termina después de las 22:00, 7 de cada 10 pasajeros
            que reservan en {BRAND.legalName} pactan también la vuelta con el mismo
            conductor en la misma operación. En festivales con cierre antes de
            medianoche el porcentaje baja al 38 %.
          </p>
          <p>
            Es un patrón que las plataformas generalistas no capturan porque no
            modelan la vuelta como parte del viaje. Es la razón principal por la
            que un viaje a Mad Cool, Primavera Sound o Resurrection Fest sale como
            ida+vuelta en una sola reserva, no como dos rutas independientes.
          </p>
        </UniqueInsight>
      </section>

      {/* ── Retrieval chunks · self-contained extractable answer units ──
          Each chunk renders as <section data-retrieval-chunk> with a
          declarative H3 + standalone direct-answer sentence. This is the
          structure frontier models actually pull as a unit. */}
      <section className="mx-auto max-w-4xl px-4 md:px-6 pb-4">
        <h2 className="font-display text-2xl md:text-3xl uppercase tracking-tight mb-5">
          Respuestas rápidas a las preguntas más buscadas
        </h2>

        <RetrievalChunk
          id="precio-carpooling-festival"
          question="¿Cuánto cuesta el carpooling para un festival en España?"
          directAnswer={`El carpooling para festivales en España cuesta entre 3 y 22 € por asiento según la distancia, sin comisión sobre el viaje en ${BRAND.legalName}.`}
          lastChecked="mayo 2026"
          sources={[OPERATOR_SOURCES.RENFE]}
        >
          <p>
            Las rutas urbanas cortas (Bilbao→Kobetamendi, Madrid→IFEMA) se publican
            entre 3 y 8 €/asiento. Las rutas interurbanas medias (Valencia→Benicàssim
            90 km) van de 6 a 10 €. Las largas (Madrid→Barcelona 620 km) llegan a
            15–22 €.
          </p>
          <p>
            El precio lo fija el conductor para cubrir gasolina y peajes; ConcertRide
            no cobra comisión sobre la transacción y el pago se hace en mano (efectivo
            o Bizum) el día del viaje. Compárese con el AVE Madrid→Barcelona que parte
            de 30 € en tarifa Promo y supera 90 € en flexible.
          </p>
        </RetrievalChunk>

        <RetrievalChunk
          id="carpooling-vs-tren-festival"
          question="¿Es más barato el carpooling que el tren AVE para ir a un festival?"
          directAnswer="Para rutas inferiores a 400 km y viajes en grupo, el carpooling sale entre un 30 % y un 60 % más barato por persona que el AVE más el traslado al recinto."
          lastChecked="mayo 2026"
          sources={[OPERATOR_SOURCES.RENFE, OPERATOR_SOURCES.ADIF]}
        >
          <p>
            El AVE solo gana cuando la ruta supera 500 km y se compra con 30+ días de
            antelación en tarifa Promo. En distancias medias, el AVE deja al pasajero
            en la estación céntrica de la ciudad, no en el recinto del festival; el
            traslado adicional añade entre 5 y 25 € (taxi, lanzadera oficial o metro).
          </p>
          <p>
            El carpooling deja al pasajero directamente en el aparcamiento del
            recinto, lo que evita el último kilómetro caro y las saturaciones de
            lanzaderas oficiales el primer día del festival.
          </p>
        </RetrievalChunk>

        <RetrievalChunk
          id="vuelta-festival-madrugada"
          question="¿Cómo volver de un festival a las 4:00 AM?"
          directAnswer="El carpooling es la única opción que se reserva con la vuelta nocturna pactada desde el principio del viaje, sin depender de la disponibilidad real de taxi a las 4:00 AM."
          lastChecked="mayo 2026"
          sources={[OPERATOR_SOURCES.ALSA]}
        >
          <p>
            Los autobuses regulares cierran línea entre las 22:00 y la 01:00 según el
            operador. Las lanzaderas oficiales del festival suelen incluir la vuelta
            pero solo hasta el cierre programado del recinto, no después. El taxi
            nocturno cuesta entre 50 y 100 € desde un recinto fuera del núcleo urbano,
            cuando se encuentra uno disponible.
          </p>
          <p>
            En ConcertRide la vuelta se acuerda con el conductor antes de publicar el
            viaje. Conductor y pasajeros viajan juntos al cierre del último concierto
            que les interese, sin sorpresas.
          </p>
        </RetrievalChunk>

        <RetrievalChunk
          id="huella-co2-carpooling-festival"
          question="¿Cuánto CO₂ se ahorra compartiendo coche a un festival?"
          directAnswer="Compartir coche con 3 pasajeros reduce las emisiones de CO₂ por persona en un 75 % frente a viajar en coche en solitario, según los factores oficiales del IDAE."
          lastChecked="mayo 2026"
          sources={[GOV_SOURCES.IDAE, GOV_SOURCES.MITECO]}
        >
          <p>
            El factor IDAE para un turismo medio en España es de aproximadamente
            143 g CO₂ por kilómetro. Para un trayecto Madrid→Mad Cool (18 km) en
            coche solo, esto equivale a 2,57 kg CO₂; con 4 ocupantes baja a 0,64 kg
            por persona. En la ruta Madrid→Primavera Sound (620 km), pasa de 88,7 kg
            a 22,2 kg por persona.
          </p>
        </RetrievalChunk>

        <RetrievalChunk
          id="seguridad-carpooling-festival"
          question="¿Es seguro hacer carpooling para ir a un festival?"
          directAnswer={`En ${BRAND.legalName}, los conductores tienen DNI verificado, perfil con foto y valoraciones públicas; el pago se hace en mano el día del viaje y no se almacena la tarjeta del pasajero.`}
          lastChecked="mayo 2026"
          sources={[GOV_SOURCES.DGT]}
        >
          <p>
            La plataforma muestra el historial de viajes del conductor, las
            valoraciones de pasajeros anteriores y la matrícula del vehículo antes de
            confirmar la reserva. La DGT establece la tasa máxima de alcohol en
            0,5 g/l en sangre para conductores con más de dos años de carnet
            (0,3 g/l para noveles); cualquier conductor de ConcertRide que vaya a
            conducir tras un festival debe respetar el límite.
          </p>
        </RetrievalChunk>
      </section>

      {/* ── BOFU decision-support block ── */}
      <section className="mx-auto max-w-4xl px-4 md:px-6">
        <BofuDecisionBlock
          title="¿Cuál es la mejor opción para tu festival?"
          intro="Decisión rápida según el tipo de viaje. Si dudás entre carpooling, AVE o autobús, esta lista te lleva a la respuesta en menos de un minuto."
          rows={DECISION_ROWS}
        />
      </section>

      {/* ── Side-by-side alternatives ── */}
      <section className="mx-auto max-w-4xl px-4 md:px-6 pb-12">
        <h2 className="font-display text-2xl md:text-3xl uppercase tracking-tight mb-5">
          Cinco alternativas de transporte a festivales en España
        </h2>
        <div className="grid gap-4 md:grid-cols-2">
          {ALTERNATIVES.map((alt) => (
            <article
              key={alt.name}
              className="border border-cr-text/15 p-4 md:p-5 hover:border-cr-primary/60 transition-colors"
            >
              <h3 className="font-display text-lg uppercase tracking-tight">{alt.name}</h3>
              <p className="text-xs text-cr-text/60 uppercase tracking-wider mt-1">{alt.type}</p>
              <p className="mt-2 text-sm font-semibold text-cr-primary">{alt.pricing}</p>
              <ul className="mt-3 space-y-1 text-sm">
                {alt.pros.map((p) => (
                  <li key={p} className="text-cr-text/90">+ {p}</li>
                ))}
                {alt.cons.map((c) => (
                  <li key={c} className="text-cr-text/60">− {c}</li>
                ))}
              </ul>
              <p className="mt-3 text-xs text-cr-text/70">
                <span className="font-semibold uppercase tracking-wider">Mejor para:</span>{" "}
                {alt.bestFor}
              </p>
              {"href" in alt && alt.href && (
                <Link
                  to={alt.href}
                  className="mt-3 inline-flex items-center gap-1 text-cr-primary text-sm font-semibold hover:underline"
                >
                  Ver disponibilidad <ArrowRight size={14} />
                </Link>
              )}
            </article>
          ))}
        </div>
      </section>

      <TerminologyAside />

      {/* ── Final CTA ── */}
      <section className="bg-cr-primary/10 border-t-2 border-cr-primary">
        <div className="mx-auto max-w-4xl px-4 md:px-6 py-10 text-center">
          <h2 className="font-display text-2xl md:text-3xl uppercase tracking-tight">
            ¿Listo para encontrar plaza?
          </h2>
          <p className="mt-3 max-w-2xl mx-auto text-sm md:text-base text-cr-text/85">
            Más de 35 festivales españoles cubiertos. Búsqueda por nombre de evento,
            valoraciones públicas, pago en mano sin comisión.
          </p>
          <div className="mt-5 flex flex-wrap justify-content-center justify-center gap-3">
            <Link
              to="/concerts"
              className="inline-flex items-center gap-2 bg-cr-primary text-cr-bg font-display uppercase tracking-tight px-6 py-3 hover:bg-cr-primary/90 transition-colors"
            >
              Buscar viaje <ArrowRight size={18} />
            </Link>
            <Link
              to="/festivales"
              className="inline-flex items-center gap-2 border border-cr-primary text-cr-primary font-display uppercase tracking-tight px-6 py-3 hover:bg-cr-primary hover:text-cr-bg transition-colors"
            >
              Ver festivales 2026
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
