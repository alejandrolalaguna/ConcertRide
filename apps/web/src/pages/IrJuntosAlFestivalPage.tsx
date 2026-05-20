import { Link } from "react-router-dom";
import { ArrowRight, Users, Music, Headphones, Sparkles } from "lucide-react";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";
import { BRAND } from "@/lib/brandEntity";
import { ContentProvenance } from "@/components/ContentProvenance";

/**
 * Landing — /ir-juntos-al-festival
 *
 * Gen Z framing: "ir juntos", "crew", "plan", "vibe". Avoids the loan word
 * "carpooling" in copy. Same product underneath as /viaje-compartido and
 * /compartir-coche-festival, but the angle is social/community-first, not
 * cost-first. Routes the reader towards /crew and the squad features.
 *
 * Targets:
 *  - "ir juntos al festival"
 *  - "plan festival amigos"
 *  - "ir al festival con amigos"
 *  - "crew festival"
 */

const VIBES = [
  {
    icon: Music,
    title: "Playlist compartida en el coche",
    body:
      "Tres horas hasta el recinto se hacen otra cosa cuando suena lo que vais a escuchar luego en directo. Cada viaje en ConcertRide tiene playlist colaborativa: todo el mundo añade temas antes de salir.",
  },
  {
    icon: Headphones,
    title: "Gente que va al mismo cartel",
    body:
      "No compartes con desconocidos cualquiera — compartes con gente que también va a ver al mismo artista. La conversación arranca sola, no es ese silencio incómodo de los viajes de empresa.",
  },
  {
    icon: Users,
    title: "Crew para el finde, no solo el coche",
    body:
      "Mucha gente que se conoce en el viaje termina viendo el concierto junta, compartiendo barra y volviendo al mismo coche el último día. ConcertRide tiene una sección de Crew para que el grupo siga organizado fuera del trayecto.",
  },
  {
    icon: Sparkles,
    title: "Vuelta de madrugada pactada antes",
    body:
      "Lo peor de un festival no es la entrada — es la vuelta a las 4 AM cuando ya no hay metro, los taxis no aparecen y el bus de línea cerró a las 23:00. Yendo juntos esto se resuelve antes de salir de casa.",
  },
];

const PLANS = [
  {
    n: "01",
    title: "Sois 4 amigos y solo uno tiene coche",
    body:
      "El conductor publica las plazas en la app y los otros tres reservan. Aunque ya os conocéis, registrar el viaje en ConcertRide cubre el reparto del gasto (Bizum al final) y sirve si decidís luego abrir una plaza más a alguien externo.",
  },
  {
    n: "02",
    title: "Vais 2 personas y queréis abrir el coche a otros 2",
    body:
      "Publicáis 2 asientos en el viaje a vuestro festival. Recibís solicitudes de gente que va al mismo evento y vosotros aceptáis a quien encaje (perfil verificado, valoraciones, conversación corta por chat). El precio cubre gasolina y peajes, dividido entre 4.",
  },
  {
    n: "03",
    title: "Vas solo y no tienes con quién ir",
    body:
      "Buscas el festival, miras los viajes desde tu ciudad y reservas plaza en el que mejor te encaje. No es raro que el viaje termine en plan de fin de semana: gente que se conoce el viernes al subir al coche y se vuelve junta el domingo de noche.",
  },
];

const FAQS = [
  {
    q: "¿Para qué sirve ir juntos al festival si ya tengo plan con mis amigos?",
    a: `Aunque ya tengáis grupo, publicar las plazas vacías cubre el coste del viaje (gasolina + peajes ≈40-60 € que entre 4 sale a 10-15 €/persona). Y si alguien del grupo se cae a última hora, no te quedas con plazas perdidas — alguien externo las puede reservar. ${BRAND.legalName} no os obliga a publicar para extraños: podéis hacer el viaje cerrado entre amigos y solo usar la app para registrar el reparto.`,
  },
  {
    q: "¿Cómo es la gente que va en estos viajes?",
    a: "El perfil habitual es 18-35 años yendo a Mad Cool, Primavera Sound, BBK Live, Sónar, Arenal Sound, Viña Rock o festivales similares. La verificación pide DNI y carnet del conductor antes de poder publicar viajes, así que los perfiles son reales — no perfiles anónimos. Puedes ver valoraciones de viajes previos antes de reservar.",
  },
  {
    q: "¿Tengo que pagar por adelantado?",
    a: `No. ${BRAND.legalName} no procesa pagos. Todo se hace en mano el día del viaje (Bizum o efectivo, lo que prefiráis). Eso significa cero comisión y cero saldo atrapado en la app si surge un cambio.`,
  },
  {
    q: "¿Y si nos llevamos mal en el viaje?",
    a: "Pasa poco, pero pasa. La función de chat queda registrada por si hay que reportar algo, y puedes valorar el viaje al terminar (visible para futuros pasajeros). Si algo te genera dudas antes de salir, cancela — no hay penalización porque no hay pago anticipado.",
  },
  {
    q: "¿Puedo conocer al conductor antes del viaje?",
    a: "Conocer en persona no, pero el chat de la app sirve para resolver dudas: punto exacto de recogida, capacidad del maletero (importante con mochila grande), horario de vuelta, si lleva playlist puesta o prefiere silencio. La mayoría de viajes empiezan con 2-3 mensajes por chat antes del día.",
  },
];

export default function IrJuntosAlFestivalPage() {
  useSeoMeta({
    title: "Ir juntos al festival · ConcertRide — Plan en grupo, sin comisión",
    description:
      "Ir juntos al festival con gente que va al mismo cartel. Playlist compartida, crew para el finde y vuelta de madrugada pactada. Conductores verificados, pago en mano (Bizum o efectivo). Desde 3 €/asiento.",
    canonical: `${SITE_URL}/ir-juntos-al-festival`,
    keywords:
      "ir juntos al festival, ir al festival con amigos, plan festival amigos, crew festival, ir festival en grupo, festival con gente",
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
      { "@type": "ListItem", position: 2, name: "Ir juntos al festival", item: `${SITE_URL}/ir-juntos-al-festival` },
    ],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Ir juntos al festival — Plan en grupo con gente que va al mismo cartel",
    description: BRAND.shortDescription,
    inLanguage: "es-ES",
    datePublished: "2026-05-20",
    dateModified: new Date().toISOString().slice(0, 10),
    author: { "@type": "Person", name: BRAND.founder.name, url: BRAND.founder.url },
    publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: BRAND.legalName },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/ir-juntos-al-festival` },
  };

  return (
    <main id="main" className="min-h-dvh bg-cr-bg text-cr-text pt-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <ContentProvenance
        pageId="/ir-juntos-al-festival"
        headline="Ir juntos al festival — Plan en grupo con gente que va al mismo cartel"
        datePublished="2026-05-20"
        dateModified={new Date().toISOString().slice(0, 10)}
        author={{ name: BRAND.founder.name, url: BRAND.founder.url }}
        reviewedBy={{ name: BRAND.founder.name, url: BRAND.founder.url }}
        aiInvolvement="research-assist"
        purpose="Explicar el ángulo social de ConcertRide: ir al festival con gente que también va al mismo evento, no solo compartir gasolina."
      />

      <section className="mx-auto max-w-4xl px-4 md:px-6 py-8 md:py-12">
        <nav aria-label="Breadcrumb" className="font-sans text-xs uppercase tracking-[0.18em] text-cr-text/60 mb-4">
          <Link to="/" className="hover:text-cr-primary">Inicio</Link>
          <span className="mx-2">/</span>
          <span>Ir juntos al festival</span>
        </nav>

        <h1 className="font-display text-3xl md:text-5xl uppercase leading-[0.95] tracking-tight">
          Ir juntos al festival
          <br />
          <span className="text-[#dbff00]">con gente que va al mismo cartel</span>
        </h1>

        <p data-quotable className="mt-5 max-w-3xl font-sans text-base md:text-lg leading-relaxed text-cr-text/90">
          El plan no es solo el coche — es lo que pasa dentro. {BRAND.legalName} junta a fans del
          mismo festival en el mismo viaje: playlist compartida, conversación que va sola, vuelta
          de madrugada pactada antes de salir. Sin comisión, perfiles con DNI y carnet verificados,
          pago en mano el día del viaje.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Link
            to="/festivales"
            className="inline-flex items-center justify-center gap-2 bg-[#dbff00] text-black font-sans font-semibold uppercase tracking-[0.12em] text-sm px-6 py-3 hover:bg-[#c8ec00] transition-colors"
          >
            Festivales 2026
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
          <Link
            to="/crew"
            className="inline-flex items-center justify-center gap-2 bg-transparent text-white/80 font-sans font-semibold uppercase tracking-[0.12em] text-sm border border-white/25 px-6 py-3 hover:border-[#dbff00]/60 hover:text-white transition-colors"
          >
            Cómo funciona el Crew →
          </Link>
        </div>
      </section>

      {/* Vibes block */}
      <section className="mx-auto max-w-5xl px-4 md:px-6 py-10" aria-labelledby="vibe">
        <h2 id="vibe" className="font-display text-2xl md:text-3xl uppercase">
          Lo que hace que el viaje no sea solo un viaje
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {VIBES.map(({ icon: Icon, title, body }) => (
            <article key={title} className="border border-cr-border p-5">
              <Icon size={20} className="text-cr-primary" aria-hidden="true" />
              <h3 className="mt-3 font-display text-lg uppercase">{title}</h3>
              <p className="mt-2 font-sans text-sm text-cr-text/80 leading-relaxed">{body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* 3 plans */}
      <section className="mx-auto max-w-4xl px-4 md:px-6 py-10" aria-labelledby="planes">
        <h2 id="planes" className="font-display text-2xl md:text-3xl uppercase">
          Tres planes típicos
        </h2>
        <ol className="mt-6 space-y-4">
          {PLANS.map((plan) => (
            <li key={plan.n} className="flex items-start gap-4 border border-cr-border p-5">
              <span className="font-display text-3xl text-cr-primary flex-shrink-0">{plan.n}</span>
              <div>
                <h3 className="font-display text-lg uppercase">{plan.title}</h3>
                <p className="mt-1 font-sans text-sm md:text-base text-cr-text/85 leading-relaxed">{plan.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-4xl px-4 md:px-6 py-10" aria-labelledby="faq">
        <h2 id="faq" className="font-display text-2xl md:text-3xl uppercase">Preguntas típicas</h2>
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
            <Link to="/compartir-coche-festival" className="block border border-cr-border p-4 hover:border-cr-primary/60 transition-colors">
              <p className="font-display text-sm uppercase">Compartir coche al festival →</p>
              <p className="mt-1 text-xs text-cr-text/60">Cómo funciona y cuánto cuesta, paso a paso.</p>
            </Link>
          </li>
          <li>
            <Link to="/coche-compartido-conciertos" className="block border border-cr-border p-4 hover:border-cr-primary/60 transition-colors">
              <p className="font-display text-sm uppercase">Coche compartido para conciertos →</p>
              <p className="mt-1 text-xs text-cr-text/60">Misma idea, pero para conciertos en sala o estadio.</p>
            </Link>
          </li>
          <li>
            <Link to="/crew" className="block border border-cr-border p-4 hover:border-cr-primary/60 transition-colors">
              <p className="font-display text-sm uppercase">Crew & Squads →</p>
              <p className="mt-1 text-xs text-cr-text/60">Organiza el grupo del festival más allá del trayecto.</p>
            </Link>
          </li>
          <li>
            <Link to="/feed" className="block border border-cr-border p-4 hover:border-cr-primary/60 transition-colors">
              <p className="font-display text-sm uppercase">Feed en vivo →</p>
              <p className="mt-1 text-xs text-cr-text/60">Ve quién está publicando viajes y a qué festival.</p>
            </Link>
          </li>
        </ul>
      </section>
    </main>
  );
}
