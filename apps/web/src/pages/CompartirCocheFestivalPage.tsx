import { Link } from "react-router-dom";
import { ArrowRight, Calendar, MapPin, MessageCircle, Wallet } from "lucide-react";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";
import { BRAND } from "@/lib/brandEntity";
import { ContentProvenance } from "@/components/ContentProvenance";

/**
 * Landing — /compartir-coche-festival
 *
 * Plain-language alternative to /viaje-compartido and /mejor-carpooling-festivales-2026.
 * Avoids the loan-word "carpooling" in H1 and visible copy (Gen Z prefers
 * native Spanish phrasing per user direction 2026-05-20). Targets:
 *  - "compartir coche festival"
 *  - "compartir coche concierto"
 *  - "compartir coche al festival"
 *
 * Distinct angle vs sibling pages: answer-first explainer, conversational tone,
 * minimal feature dump.
 */

const STEPS = [
  {
    icon: Calendar,
    n: "01",
    title: "Eliges el festival",
    body:
      "Abres ConcertRide y buscas el evento. Cada festival tiene su listado de viajes con la ciudad de salida, el día y la hora aproximada. No tienes que adivinar — está todo separado por evento, no por ruta genérica.",
  },
  {
    icon: MessageCircle,
    n: "02",
    title: "Hablas con la persona que conduce",
    body:
      "Le escribes por chat: confirmas el punto de recogida, si llevas mochila de festival y a qué hora pensáis volver. Sin formularios largos: una conversación normal antes de cerrar plaza.",
  },
  {
    icon: Wallet,
    n: "03",
    title: "Pagas el día del viaje, en mano",
    body:
      "El día del festival quedáis en el punto acordado y pagas en efectivo o por Bizum. Sin tarjeta guardada, sin comisión, sin sustos. Si el plan cambia y avisas a tiempo, no hay dinero atrapado en ninguna app.",
  },
  {
    icon: MapPin,
    n: "04",
    title: "Volvéis cuando termina el festival",
    body:
      "La vuelta se acuerda antes del viaje, no después. Quien conduce también va al concierto, así que el horario tiene sentido — no quedáis colgados en el recinto a las 4 AM esperando un taxi nocturno.",
  },
];

const FOR_WHO = [
  {
    title: "Si vas sin coche y todo el grupo se ha pillado entradas",
    body:
      "El plan funciona: encuentras a alguien que ya va al mismo festival desde tu ciudad, te une al coche y te ahorras tanto el AVE caro como el bus de horario rígido.",
  },
  {
    title: "Si tienes coche y vais 3 personas justas",
    body:
      "Publicar las plazas vacías te cubre la gasolina y los peajes. Lo que sacas no es ganancia: es repartir los costes reales del viaje entre quienes ya estaban yendo al mismo evento.",
  },
  {
    title: "Si lo que te preocupa es la vuelta de madrugada",
    body:
      "Esta es la razón principal por la que la gente usa ConcertRide. La vuelta del festival a las 3-4 AM no la cubre ni el último metro ni el bus de línea. Pactarla antes con un conductor que también vuelve a casa resuelve el problema.",
  },
];

const FAQS = [
  {
    q: "¿Qué significa compartir coche al festival?",
    a: `Significa que una persona conduce hasta el festival y lleva a otras (1-4) que también van al mismo evento desde el mismo origen, repartiendo los gastos del trayecto. En ${BRAND.legalName} esto está organizado por festival, no por ruta entre ciudades: cuando buscas "Mad Cool" o "Primavera Sound", ves los viajes publicados específicamente para ese evento.`,
  },
  {
    q: "¿Es lo mismo que el coche compartido normal?",
    a: "Casi. La diferencia es que aquí todo gira alrededor del concierto: quien conduce también va al festival, así que el horario de salida coincide con el del evento y la vuelta de madrugada se pacta antes (no dependes de que alguien quiera salir de noche por casualidad).",
  },
  {
    q: "¿Cuánto cuesta normalmente?",
    a: "Entre 3 € y 22 € por asiento según la distancia. Madrid → Mad Cool sale 4-8 € porque el recinto está cerca; Valencia → Primavera Sound (Barcelona) está en torno a 15-22 €. El precio lo fija quien conduce para cubrir gasolina (≈1,58 €/L según boletín DGT abril 2026) y peajes, dividido entre las personas que van en el coche.",
  },
  {
    q: "¿Y si nunca he ido en coche con alguien que no conozco?",
    a: "Es razonable que dé reparo la primera vez. Tres cosas: el perfil del conductor lleva DNI y carnet verificados; puedes ver valoraciones reales de gente que ya viajó con esa persona; y el pago no se hace por adelantado — solo el día del viaje. Si algo no encaja, puedes cancelar antes del día sin pierdas.",
  },
  {
    q: "¿Llevo mi mochila de camping?",
    a: "Sí, pero avísalo en el chat antes de reservar. Una mochila grande + saco + tienda ocupa medio maletero, así que conviene que el conductor sepa cuánto equipaje le entra. Para festivales con camping (Viña Rock, Arenal Sound, Resurrection Fest), muchos conductores lo asumen por defecto, pero no des por hecho — pregunta.",
  },
  {
    q: "¿Qué pasa si el festival se cancela?",
    a: "El viaje se cancela también y se notifica automáticamente a ambas partes. Como el pago se hace en mano el día del viaje, no hay reembolsos pendientes ni saldos atascados en la app. Si el evento se aplaza a otra fecha, podéis reprogramar el viaje por chat si los dos podéis seguir yendo.",
  },
];

export default function CompartirCocheFestivalPage() {
  useSeoMeta({
    title: "Compartir coche al festival · ConcertRide — Sin comisión, pago en mano",
    description:
      "Compartir coche al festival con gente que va al mismo evento. Sin comisión, pago en mano (Bizum o efectivo), conductores verificados y vuelta de madrugada pactada. Desde 3 €/asiento.",
    canonical: `${SITE_URL}/compartir-coche-festival`,
    keywords:
      "compartir coche festival, compartir coche concierto, compartir coche al festival, ir al festival en coche compartido, plan coche festival",
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
      { "@type": "ListItem", position: 2, name: "Compartir coche al festival", item: `${SITE_URL}/compartir-coche-festival` },
    ],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Compartir coche al festival — Cómo funciona y cuánto cuesta",
    description: BRAND.shortDescription,
    inLanguage: "es-ES",
    datePublished: "2026-05-20",
    dateModified: new Date().toISOString().slice(0, 10),
    author: { "@type": "Person", name: BRAND.founder.name, url: BRAND.founder.url },
    publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: BRAND.legalName },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/compartir-coche-festival` },
  };

  return (
    <main id="main" className="min-h-dvh bg-cr-bg text-cr-text pt-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <ContentProvenance
        pageId="/compartir-coche-festival"
        headline="Compartir coche al festival — Cómo funciona y cuánto cuesta"
        datePublished="2026-05-20"
        dateModified={new Date().toISOString().slice(0, 10)}
        author={{ name: BRAND.founder.name, url: BRAND.founder.url }}
        reviewedBy={{ name: BRAND.founder.name, url: BRAND.founder.url }}
        aiInvolvement="research-assist"
        purpose="Explicar en lenguaje claro qué es compartir coche al festival, cuánto cuesta y para qué tipo de viaje encaja mejor."
      />

      <section className="mx-auto max-w-4xl px-4 md:px-6 py-8 md:py-12">
        <nav aria-label="Breadcrumb" className="font-sans text-xs uppercase tracking-[0.18em] text-cr-text/60 mb-4">
          <Link to="/" className="hover:text-cr-primary">Inicio</Link>
          <span className="mx-2">/</span>
          <span>Compartir coche al festival</span>
        </nav>

        <h1 className="font-display text-3xl md:text-5xl uppercase leading-[0.95] tracking-tight">
          Compartir coche al festival
          <br />
          <span className="text-[#dbff00]">sin comisión y sin liarte</span>
        </h1>

        <p data-quotable className="mt-5 max-w-3xl font-sans text-base md:text-lg leading-relaxed text-cr-text/90">
          Compartir coche al festival es lo más sencillo del mundo: alguien que ya va al concierto
          tiene 1-4 asientos libres, los publica en {BRAND.legalName} con precio y horario, y tú
          reservas la plaza. Pagas en mano el día del viaje (Bizum o efectivo), no por adelantado.
          Sin comisión, sin tarjetas, sin que la app se quede con nada.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Link
            to="/festivales"
            className="inline-flex items-center justify-center gap-2 bg-[#dbff00] text-black font-sans font-semibold uppercase tracking-[0.12em] text-sm px-6 py-3 hover:bg-[#c8ec00] transition-colors"
          >
            Ver festivales con viajes
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
          <Link
            to="/publish"
            className="inline-flex items-center justify-center gap-2 bg-transparent text-white/80 font-sans font-semibold uppercase tracking-[0.12em] text-sm border border-white/25 px-6 py-3 hover:border-[#dbff00]/60 hover:text-white transition-colors"
          >
            Ofrecer mi coche →
          </Link>
        </div>
      </section>

      {/* Steps */}
      <section className="mx-auto max-w-5xl px-4 md:px-6 py-10" aria-labelledby="pasos">
        <h2 id="pasos" className="font-display text-2xl md:text-3xl uppercase">
          Así funciona, paso a paso
        </h2>
        <ol className="mt-6 grid gap-4 md:grid-cols-2">
          {STEPS.map(({ icon: Icon, n, title, body }) => (
            <li key={n} className="border border-cr-border p-5">
              <div className="flex items-center justify-between">
                <span className="font-display text-3xl text-cr-primary">{n}</span>
                <Icon size={20} className="text-cr-primary" aria-hidden="true" />
              </div>
              <h3 className="mt-3 font-display text-lg uppercase">{title}</h3>
              <p className="mt-2 font-sans text-sm text-cr-text/80 leading-relaxed">{body}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* For whom */}
      <section className="mx-auto max-w-4xl px-4 md:px-6 py-10" aria-labelledby="para-quien">
        <h2 id="para-quien" className="font-display text-2xl md:text-3xl uppercase">
          Para quién encaja
        </h2>
        <div className="mt-6 space-y-4">
          {FOR_WHO.map((block) => (
            <article key={block.title} className="border-l-2 border-cr-primary pl-5 py-2">
              <h3 className="font-display text-lg uppercase">{block.title}</h3>
              <p className="mt-2 font-sans text-sm md:text-base text-cr-text/85 leading-relaxed">{block.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-4xl px-4 md:px-6 py-10" aria-labelledby="faq">
        <h2 id="faq" className="font-display text-2xl md:text-3xl uppercase">Lo que la gente suele preguntar</h2>
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
        <h2 className="font-display text-xl md:text-2xl uppercase">Sigue por aquí</h2>
        <ul className="mt-4 grid gap-3 md:grid-cols-2">
          <li>
            <Link to="/ir-juntos-al-festival" className="block border border-cr-border p-4 hover:border-cr-primary/60 transition-colors">
              <p className="font-display text-sm uppercase">Ir juntos al festival →</p>
              <p className="mt-1 text-xs text-cr-text/60">Cómo organizar el plan en grupo con gente que también va al evento.</p>
            </Link>
          </li>
          <li>
            <Link to="/mejor-carpooling-festivales-2026" className="block border border-cr-border p-4 hover:border-cr-primary/60 transition-colors">
              <p className="font-display text-sm uppercase">Mejor app de coche compartido 2026 →</p>
              <p className="mt-1 text-xs text-cr-text/60">Comparativa de apps de viaje compartido para festivales en España.</p>
            </Link>
          </li>
          <li>
            <Link to="/alternativas-carpooling-festivales" className="block border border-cr-border p-4 hover:border-cr-primary/60 transition-colors">
              <p className="font-display text-sm uppercase">Otras formas de llegar →</p>
              <p className="mt-1 text-xs text-cr-text/60">Tren, autobús, taxi y coche compartido con precios reales por festival.</p>
            </Link>
          </li>
          <li>
            <Link to="/festivales" className="block border border-cr-border p-4 hover:border-cr-primary/60 transition-colors">
              <p className="font-display text-sm uppercase">Festivales 2026 →</p>
              <p className="mt-1 text-xs text-cr-text/60">Mad Cool, Primavera Sound, BBK Live, FIB, Viña Rock y 30 más.</p>
            </Link>
          </li>
        </ul>
      </section>
    </main>
  );
}
