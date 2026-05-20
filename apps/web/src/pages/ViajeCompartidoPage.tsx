import { Link } from "react-router-dom";
import { ArrowRight, Car, Euro, MapPin, ShieldCheck, Users } from "lucide-react";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";
import { BRAND } from "@/lib/brandEntity";
import { ContentProvenance } from "@/components/ContentProvenance";

/**
 * Landing — /viaje-compartido
 *
 * Targets head-term keywords:
 *  - "viaje compartido coche" (vol 720, med diff)
 *  - "viaje en coche compartido"
 *
 * Positions ConcertRide as the festival-specific option vs generalist
 * carpooling. Generic competitor framing per CLAUDE.md.
 */

const USE_CASES = [
  {
    icon: Car,
    title: "Festivales y conciertos",
    body:
      "El uso natural de ConcertRide: viajar al mismo evento que el conductor. Vuelta de madrugada pactada, búsqueda por nombre del festival y precios desde 3 €.",
  },
  {
    icon: MapPin,
    title: "Trayectos largos en grupo",
    body:
      "Para rutas de 200–700 km en las que el coche compartido sale más barato que el tren AVE más el traslado. Ideal con 3-4 personas.",
  },
  {
    icon: Users,
    title: "Vuelta del recinto sin metro ni taxi",
    body:
      "Festivales que acaban después de las 02:00 dejan sin opciones de transporte público. El viaje compartido resuelve la vuelta porque el conductor también va al evento.",
  },
];

const HOW_IT_WORKS = [
  {
    n: "01",
    title: "Busca tu festival o concierto",
    body:
      "Abre ConcertRide, busca el evento al que quieres ir y mira los viajes publicados desde tu ciudad de origen. Cada viaje muestra precio por asiento, hora de salida y valoración del conductor.",
  },
  {
    n: "02",
    title: "Reserva tu plaza",
    body:
      "Envía la solicitud al conductor. Si tiene confirmación inmediata, el asiento queda reservado al instante. Si no, el conductor responde en pocas horas. Sin pago anticipado por tarjeta.",
  },
  {
    n: "03",
    title: "Viaja, paga en mano y vuelve tranquilo",
    body:
      "El día del viaje te encuentras con el conductor en el punto de recogida acordado, pagas en efectivo o Bizum directo y vais juntos al evento. La vuelta se coordina antes para evitar taxis caros o el último bus.",
  },
];

const FAQS = [
  {
    q: "¿Qué es un viaje compartido en coche?",
    a: "Un viaje compartido es un trayecto en coche en el que el conductor lleva a uno o varios pasajeros que van al mismo destino, repartiendo los gastos de gasolina, peajes y desgaste. En ConcertRide está orientado a festivales y conciertos: el conductor también va al evento, así que el horario tiene sentido festivalero.",
  },
  {
    q: "¿Cuánto cuesta un viaje compartido a un festival?",
    a: "El precio por asiento suele estar entre 3 € (rutas cortas, p. ej. ciudad-recinto del mismo área metropolitana) y 22 € (rutas interurbanas largas, p. ej. Madrid-Barcelona). El conductor fija el precio para cubrir gasolina (≈1,58 €/L según boletín DGT abril 2026) y peajes, dividido entre 2-4 pasajeros.",
  },
  {
    q: "¿Es seguro un viaje compartido con desconocidos?",
    a: "Sí, con verificación. ConcertRide pide DNI y carnet de conducir al conductor antes de publicar un viaje. Los pasajeros pueden ver perfil, foto y valoraciones reales antes de reservar. El pago en mano (no por tarjeta anticipada) evita estafas de plataforma.",
  },
  {
    q: "¿Cómo se paga un viaje compartido?",
    a: `En ${BRAND.legalName} el pago se hace directo entre conductor y pasajero el día del viaje: efectivo o Bizum. ${BRAND.legalName} no cobra comisión ni custodia el dinero, así que el conductor recibe el 100 % del precio publicado y el pasajero no paga sobrecargos.`,
  },
  {
    q: "¿Qué pasa si el conductor cancela?",
    a: "El conductor puede cancelar avisando por chat con antelación. ConcertRide notifica al pasajero y este puede buscar otra plaza en un viaje distinto al mismo evento. Como el pago no se adelanta por tarjeta, no hay reembolsos pendientes ni saldos atrapados en la app.",
  },
  {
    q: "¿Cuántos pasajeros caben en un viaje compartido?",
    a: "El conductor indica al publicar el viaje cuántos asientos ofrece (normalmente 2-4). Los coches medianos europeos permiten 3 pasajeros + conductor; un monovolumen o SUV familiar puede ofrecer 4 plazas + conductor. El precio total se divide entre los pasajeros, así que cuantos más, más barato sale.",
  },
  {
    q: "¿Puedo llevar equipaje de festival (camping, mochila)?",
    a: "Sí, siempre que lo indiques en el anuncio. Para festivales con camping conviene avisar al conductor del volumen de equipaje (mochila grande + saco + tienda) antes de reservar, porque el maletero limita lo que cabe. Algunos conductores excluyen explícitamente equipaje de camping; revísalo en el detalle del viaje.",
  },
];

export default function ViajeCompartidoPage() {
  useSeoMeta({
    title: "Viaje compartido en coche · ConcertRide — Festivales y conciertos sin comisión",
    description:
      "Viaje compartido en coche para festivales y conciertos en España. Conductores verificados, 0 % comisión, pago en efectivo o Bizum y vuelta de madrugada pactada. Desde 3 € por asiento.",
    canonical: `${SITE_URL}/viaje-compartido`,
    keywords:
      "viaje compartido coche, viaje en coche compartido, coche compartido españa, compartir coche festival, viaje compartido madrid, viaje compartido barcelona",
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
      { "@type": "ListItem", position: 2, name: "Viaje compartido", item: `${SITE_URL}/viaje-compartido` },
    ],
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Cómo reservar un viaje compartido en coche a un festival",
    description:
      "Pasos para encontrar y reservar un viaje compartido en ConcertRide hacia un concierto o festival en España.",
    totalTime: "PT5M",
    step: HOW_IT_WORKS.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.title,
      text: step.body,
    })),
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Viaje compartido en coche — Festivales y conciertos",
    description: BRAND.shortDescription,
    inLanguage: "es-ES",
    datePublished: "2026-05-20",
    dateModified: new Date().toISOString().slice(0, 10),
    author: { "@type": "Person", name: BRAND.founder.name, url: BRAND.founder.url },
    publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: BRAND.legalName },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/viaje-compartido` },
  };

  return (
    <main id="main" className="min-h-dvh bg-cr-bg text-cr-text pt-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <ContentProvenance
        pageId="/viaje-compartido"
        headline="Viaje compartido en coche — Festivales y conciertos"
        datePublished="2026-05-20"
        dateModified={new Date().toISOString().slice(0, 10)}
        author={{ name: BRAND.founder.name, url: BRAND.founder.url }}
        reviewedBy={{ name: BRAND.founder.name, url: BRAND.founder.url }}
        aiInvolvement="research-assist"
        purpose="Explicar qué es un viaje compartido en coche, cuánto cuesta y cómo funciona dentro de ConcertRide para llegar a festivales y conciertos en España."
      />

      <section className="mx-auto max-w-4xl px-4 md:px-6 py-8 md:py-12">
        <nav aria-label="Breadcrumb" className="font-sans text-xs uppercase tracking-[0.18em] text-cr-text/60 mb-4">
          <Link to="/" className="hover:text-cr-primary">Inicio</Link>
          <span className="mx-2">/</span>
          <span>Viaje compartido</span>
        </nav>

        <h1 className="font-display text-3xl md:text-5xl uppercase leading-[0.95] tracking-tight">
          Viaje compartido en coche
          <br />
          <span className="text-[#dbff00]">para festivales y conciertos</span>
        </h1>

        <p data-quotable className="mt-5 max-w-3xl font-sans text-base md:text-lg leading-relaxed text-cr-text/90">
          Un viaje compartido es un trayecto en coche en el que conductor y pasajeros van al mismo
          destino y reparten los gastos de gasolina y peajes. En {BRAND.legalName} está orientado a
          conciertos y festivales: el conductor también va al evento, así que el horario y la vuelta
          tienen sentido festivalero. Sin comisión, pago en efectivo o Bizum, desde 3 €/asiento.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Link
            to="/concerts"
            className="inline-flex items-center justify-center gap-2 bg-[#dbff00] text-black font-sans font-semibold uppercase tracking-[0.12em] text-sm px-6 py-3 hover:bg-[#c8ec00] transition-colors"
          >
            Buscar viajes
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
          <Link
            to="/publish"
            className="inline-flex items-center justify-center gap-2 bg-transparent text-white/80 font-sans font-semibold uppercase tracking-[0.12em] text-sm border border-white/25 px-6 py-3 hover:border-[#dbff00]/60 hover:text-white transition-colors"
          >
            Publicar mi coche →
          </Link>
        </div>
      </section>

      {/* Use cases */}
      <section className="mx-auto max-w-5xl px-4 md:px-6 py-10" aria-labelledby="casos-uso">
        <h2 id="casos-uso" className="font-display text-2xl md:text-3xl uppercase">
          Cuándo tiene sentido un viaje compartido
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {USE_CASES.map(({ icon: Icon, title, body }) => (
            <article key={title} className="border border-cr-border p-5">
              <Icon size={20} className="text-cr-primary" aria-hidden="true" />
              <h3 className="mt-3 font-display text-lg uppercase">{title}</h3>
              <p className="mt-2 font-sans text-sm text-cr-text/80 leading-relaxed">{body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Differentiation block */}
      <section className="mx-auto max-w-4xl px-4 md:px-6 py-10" aria-labelledby="diferencia">
        <h2 id="diferencia" className="font-display text-2xl md:text-3xl uppercase">
          En qué se diferencia de las apps de carpooling generalistas
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <div className="border border-cr-primary/30 bg-cr-primary/[0.04] p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-cr-primary mb-2">
              ConcertRide
            </p>
            <ul className="space-y-2 text-sm text-cr-text/90">
              <li className="flex items-start gap-2"><Euro size={14} className="text-cr-primary mt-0.5 flex-shrink-0" aria-hidden="true" /> 0 % comisión sobre el viaje</li>
              <li className="flex items-start gap-2"><MapPin size={14} className="text-cr-primary mt-0.5 flex-shrink-0" aria-hidden="true" /> Búsqueda por nombre de festival o concierto</li>
              <li className="flex items-start gap-2"><ShieldCheck size={14} className="text-cr-primary mt-0.5 flex-shrink-0" aria-hidden="true" /> Conductores con DNI + carnet verificado</li>
              <li className="flex items-start gap-2"><Car size={14} className="text-cr-primary mt-0.5 flex-shrink-0" aria-hidden="true" /> Vuelta de madrugada pactada antes de salir</li>
              <li className="flex items-start gap-2"><Users size={14} className="text-cr-primary mt-0.5 flex-shrink-0" aria-hidden="true" /> Pago en efectivo o Bizum (en mano)</li>
            </ul>
          </div>
          <div className="border border-cr-border p-5">
            <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-cr-text/60 mb-2">
              Plataformas de carpooling generalistas
            </p>
            <ul className="space-y-2 text-sm text-cr-text/70">
              <li>· Comisión 10–18 % sobre cada plaza</li>
              <li>· Búsqueda por origen–destino, sin filtro por evento</li>
              <li>· Verificación parcial del conductor</li>
              <li>· Horario nocturno del recinto no pactado</li>
              <li>· Pago anticipado con tarjeta</li>
            </ul>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="mx-auto max-w-4xl px-4 md:px-6 py-10" aria-labelledby="como">
        <h2 id="como" className="font-display text-2xl md:text-3xl uppercase">
          Cómo reservar tu viaje compartido en 3 pasos
        </h2>
        <ol className="mt-6 space-y-4">
          {HOW_IT_WORKS.map((step) => (
            <li key={step.n} className="flex items-start gap-4 border border-cr-border p-5">
              <span className="font-display text-3xl text-cr-primary flex-shrink-0">{step.n}</span>
              <div>
                <h3 className="font-display text-lg uppercase">{step.title}</h3>
                <p className="mt-1 font-sans text-sm md:text-base text-cr-text/85 leading-relaxed">{step.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-4xl px-4 md:px-6 py-10" aria-labelledby="faq">
        <h2 id="faq" className="font-display text-2xl md:text-3xl uppercase">Preguntas frecuentes sobre el viaje compartido</h2>
        <dl className="mt-6 divide-y divide-cr-border border-y border-cr-border">
          {FAQS.map((item) => (
            <div key={item.q} className="py-5">
              <dt className="font-display text-lg uppercase">{item.q}</dt>
              <dd className="mt-2 font-sans text-sm md:text-base leading-relaxed text-cr-text/85">{item.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Related */}
      <section className="mx-auto max-w-4xl px-4 md:px-6 pb-16">
        <h2 className="font-display text-xl md:text-2xl uppercase">Más sobre carpooling para festivales</h2>
        <ul className="mt-4 grid gap-3 md:grid-cols-2">
          <li>
            <Link to="/mejor-carpooling-festivales-2026" className="block border border-cr-border p-4 hover:border-cr-primary/60 transition-colors">
              <p className="font-display text-sm uppercase">Mejor carpooling festivales 2026 →</p>
              <p className="mt-1 text-xs text-cr-text/60">Comparativa de las apps de carpooling disponibles para festivales en España.</p>
            </Link>
          </li>
          <li>
            <Link to="/alternativas-carpooling-festivales" className="block border border-cr-border p-4 hover:border-cr-primary/60 transition-colors">
              <p className="font-display text-sm uppercase">Alternativas de transporte →</p>
              <p className="mt-1 text-xs text-cr-text/60">Carpooling vs AVE vs autobús vs taxi con precios reales por origen.</p>
            </Link>
          </li>
          <li>
            <Link to="/como-funciona-carpooling" className="block border border-cr-border p-4 hover:border-cr-primary/60 transition-colors">
              <p className="font-display text-sm uppercase">Cómo funciona ConcertRide →</p>
              <p className="mt-1 text-xs text-cr-text/60">Guía completa del proceso: reservar, publicar y pagar.</p>
            </Link>
          </li>
          <li>
            <Link to="/festivales" className="block border border-cr-border p-4 hover:border-cr-primary/60 transition-colors">
              <p className="font-display text-sm uppercase">Festivales 2026 →</p>
              <p className="mt-1 text-xs text-cr-text/60">Listado de festivales en España con carpooling disponible.</p>
            </Link>
          </li>
        </ul>
      </section>
    </main>
  );
}
