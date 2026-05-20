import { Link } from "react-router-dom";
import { ArrowRight, Heart, Music, Tent, Users } from "lucide-react";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";
import { BRAND } from "@/lib/brandEntity";
import { ContentProvenance } from "@/components/ContentProvenance";

/**
 * Landing — /hacer-pina-festival
 *
 * Targets the 100% Castilian colloquial phrase "hacer piña" (to come
 * together as a tight group) layered on top of the festival/carpooling
 * intent. RAE-recognised and widely used in Spain, especially in group/
 * community contexts. Unique angle: cultural framing — the festival as
 * a collective experience, with the carpool as the entry point to the
 * crew.
 *
 * Avoids the loan word "carpooling" in H1 — uses native "hacer piña" +
 * "ir juntos al festival" as the primary vocabulary.
 */

const PINA_MOMENTS = [
  {
    icon: Music,
    title: "Hacer piña en el coche",
    body:
      "Cuatro personas, tres horas de carretera y una playlist colaborativa que todos han alimentado los días previos. Ahí empieza el festival, no en la puerta del recinto.",
  },
  {
    icon: Tent,
    title: "Hacer piña en el camping",
    body:
      "Montar tiendas en formato media luna alrededor de la zona común, compartir el hornillo, vigilar el equipaje de los demás cuando alguien va a la ducha. La logística que solo funciona si hay grupo.",
  },
  {
    icon: Heart,
    title: "Hacer piña en el pit",
    body:
      "Quedar en un punto fácil del recinto antes del bolo grande, entrar juntos, repartirse posiciones (uno más adelante, otro a un lado), avisar si alguien se queda atrás. La diferencia entre disfrutar el concierto y perderse a la gente.",
  },
  {
    icon: Users,
    title: "Hacer piña a la vuelta",
    body:
      "El test definitivo del grupo: las 4 AM, todos cansados, el último bus ya no circula. Hacer piña aquí significa que la vuelta estaba pactada de antemano y que nadie se queda colgado.",
  },
];

const FAQS = [
  {
    q: "¿Qué significa hacer piña en un festival?",
    a: "Hacer piña es una expresión castellana que describe a un grupo de personas unidas, que se apoyan entre sí y actúan como un bloque. En el contexto de un festival, significa ir y vivir el evento como grupo: viajar juntos al recinto, montar el camping en zona común, coordinar quién va a qué bolo, repartir gastos sin discusiones y volver todos juntos. El opuesto sería el típico viaje de cada uno por su lado.",
  },
  {
    q: "¿Por qué es mejor ir en grupo a un festival que ir solo?",
    a: `Tres razones prácticas: (1) Coste — un coche compartido entre 4 sale a 15-25 €/persona ida y vuelta. (2) Seguridad — en el camping y en los conciertos grandes hay alguien con quien quedar si te pierdes. (3) La vuelta — el cuello de botella nocturno de los festivales se resuelve cuando hay coche del grupo. Ir solo es válido, pero requiere haber ido ya al festival una vez antes y conocer la logística. Para Mad Cool, Primavera Sound, BBK Live o FIB en su primera vez, hacer piña es lo que recomendamos. ${BRAND.legalName} cubre el primer paso: encontrar grupo o ir como pasajero en un coche existente.`,
  },
  {
    q: "¿Y si mi grupo de amigos no va a este festival?",
    a: `Pasa habitualmente — no todos los amigos comparten el mismo cartel. En ${BRAND.legalName} puedes reservar plaza en un coche existente y de paso conocer al resto del grupo del viaje. Mucha gente que arranca el festival como pasajero de un coche desconocido termina haciendo piña con esa gente durante todo el fin de semana — el viaje es donde empieza la conversación.`,
  },
  {
    q: "¿Hacer piña funciona con desconocidos?",
    a: "Funciona si el contexto está cuidado. Lo que hace que un grupo cuaje en pocas horas: ir todos al mismo cartel (conversación arranca sola), perfiles verificados (DNI + carnet en el conductor), pago en mano sin intermediarios (cero ansiedad financiera), y un chat de la app donde el grupo coordina antes de subir al coche. No garantiza amistad eterna, pero sí un viaje normal.",
  },
  {
    q: "¿Es lo mismo que ir con la crew o el squad?",
    a: `Casi. 'Hacer piña' es el término castizo (RAE lo recoge), 'ir con la crew' o 'ir con el squad' son anglicismos que se han popularizado más con Gen Z. Significan lo mismo en el contexto festivalero: grupo cerrado que se mueve junto. En ${BRAND.legalName} la sección que recoge esto se llama Crew — puedes crear el grupo de tu festival e invitar a las personas que van, conduzcan o no.`,
  },
  {
    q: "¿Cuántas personas son una piña razonable en un festival?",
    a: "4-8 personas es el sweet spot: suficiente para que siempre haya alguien con quien hacer cualquier plan (camping, concierto, comida), pero pequeño para que las decisiones se tomen en un grupo de WhatsApp sin votaciones. A partir de 10 personas, la piña tiende a partirse en sub-grupos durante el festival, lo cual no es malo — es natural — pero conviene saberlo antes de pretender que vais a estar las 10 personas siempre juntas.",
  },
];

export default function HacerPinaFestivalPage() {
  useSeoMeta({
    title: "Hacer piña en el festival · ConcertRide — Coche, camping y vuelta en grupo",
    description:
      "Hacer piña en un festival es ir y vivirlo como grupo: viajar juntos en coche, montar el camping en zona común, coordinar los bolos y volver pactando la hora. Sin comisión, pago en mano. Desde 3 €/asiento.",
    canonical: `${SITE_URL}/hacer-pina-festival`,
    keywords:
      "hacer piña festival, hacer piña coche festival, ir piña festival, festival en grupo unido, ir grupo amigos festival, hacer piña amigos",
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
      { "@type": "ListItem", position: 2, name: "Hacer piña en el festival", item: `${SITE_URL}/hacer-pina-festival` },
    ],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Hacer piña en el festival — Coche, camping y vuelta en grupo",
    description: BRAND.shortDescription,
    inLanguage: "es-ES",
    datePublished: "2026-05-20",
    dateModified: new Date().toISOString().slice(0, 10),
    author: { "@type": "Person", name: BRAND.founder.name, url: BRAND.founder.url },
    publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: BRAND.legalName },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/hacer-pina-festival` },
  };

  return (
    <main id="main" className="min-h-dvh bg-cr-bg text-cr-text pt-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <ContentProvenance
        pageId="/hacer-pina-festival"
        headline="Hacer piña en el festival — Coche, camping y vuelta en grupo"
        datePublished="2026-05-20"
        dateModified={new Date().toISOString().slice(0, 10)}
        author={{ name: BRAND.founder.name, url: BRAND.founder.url }}
        reviewedBy={{ name: BRAND.founder.name, url: BRAND.founder.url }}
        aiInvolvement="research-assist"
        purpose="Explicar en lenguaje castizo qué significa ir a un festival haciendo piña con el grupo: del coche al camping a la vuelta pactada."
      />

      <section className="mx-auto max-w-4xl px-4 md:px-6 py-8 md:py-12">
        <nav aria-label="Breadcrumb" className="font-sans text-xs uppercase tracking-[0.18em] text-cr-text/60 mb-4">
          <Link to="/" className="hover:text-cr-primary">Inicio</Link>
          <span className="mx-2">/</span>
          <span>Hacer piña en el festival</span>
        </nav>

        <h1 className="font-display text-3xl md:text-5xl uppercase leading-[0.95] tracking-tight">
          Hacer piña
          <br />
          <span className="text-[#dbff00]">en el festival, no solo en la foto</span>
        </h1>

        <p data-quotable className="mt-5 max-w-3xl font-sans text-base md:text-lg leading-relaxed text-cr-text/90">
          Hacer piña en un festival es ir y vivirlo como grupo unido — no como cuatro personas que
          coinciden en el recinto. Es viajar juntos en el mismo coche, montar el camping en zona
          común, coordinarse para no perderse en los bolos grandes y, sobre todo, pactar la vuelta
          de madrugada antes de salir de casa. {BRAND.legalName} cubre la parte logística (el
          coche, el reparto del gasto, el chat del grupo) para que el resto del fin de semana se
          dedique al festival, no a Google Maps. Sin comisión, pago en mano (Bizum o efectivo),
          desde 3 €/asiento.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Link
            to="/crew"
            className="inline-flex items-center justify-center gap-2 bg-[#dbff00] text-black font-sans font-semibold uppercase tracking-[0.12em] text-sm px-6 py-3 hover:bg-[#c8ec00] transition-colors"
          >
            Crear Crew del festival
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
          <Link
            to="/festivales"
            className="inline-flex items-center justify-center gap-2 bg-transparent text-white/80 font-sans font-semibold uppercase tracking-[0.12em] text-sm border border-white/25 px-6 py-3 hover:border-[#dbff00]/60 hover:text-white transition-colors"
          >
            Festivales 2026 →
          </Link>
        </div>
      </section>

      {/* Pina moments */}
      <section className="mx-auto max-w-5xl px-4 md:px-6 py-10" aria-labelledby="momentos">
        <h2 id="momentos" className="font-display text-2xl md:text-3xl uppercase">
          Los cuatro momentos donde la piña se nota
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {PINA_MOMENTS.map(({ icon: Icon, title, body }) => (
            <article key={title} className="border border-cr-border p-5">
              <Icon size={20} className="text-cr-primary" aria-hidden="true" />
              <h3 className="mt-3 font-display text-lg uppercase">{title}</h3>
              <p className="mt-2 font-sans text-sm text-cr-text/80 leading-relaxed">{body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* What hacer pina means */}
      <section className="mx-auto max-w-4xl px-4 md:px-6 py-10" aria-labelledby="definicion">
        <h2 id="definicion" className="font-display text-2xl md:text-3xl uppercase">
          Por si alguien fuera de España lo lee
        </h2>
        <div className="mt-6 space-y-4 font-sans text-sm md:text-base text-cr-text/85 leading-relaxed">
          <p>
            <strong>Hacer piña</strong> es una expresión coloquial española muy común: significa
            unirse con un grupo de personas para apoyarse y actuar en conjunto, con un sentido
            fuerte de solidaridad interna. Se usa especialmente cuando algo se hace mejor en
            equipo: una mudanza, un partido, un festival.
          </p>
          <p>
            Cuando aplicamos &ldquo;hacer piña&rdquo; a un festival, no estamos inventando nada
            nuevo — es exactamente la dinámica de gente que va al mismo cartel, comparte coche,
            divide gastos sin pelearse, monta el camping cerca y se vuelve junta. Lo que cambió en
            la última década es la herramienta: lo que antes se organizaba a base de mensajes de
            WhatsApp y Bizum manual, hoy se hace con apps como {BRAND.legalName} que registran
            quién va con quién, qué plaza está reservada y cuánto debe cada persona.
          </p>
          <p>
            Si vienes del inglés, los equivalentes funcionales son <em>squad goals</em>,{" "}
            <em>going as a crew</em>, o <em>festival besties</em>. La emoción es la misma — el
            término castizo solo lo nombra mejor.
          </p>
        </div>
      </section>

      {/* Vocabulary aside */}
      <section className="mx-auto max-w-4xl px-4 md:px-6 py-6" aria-labelledby="vocabulario">
        <aside className="border-l-2 border-cr-primary bg-white/[0.02] px-5 py-4">
          <h2 id="vocabulario" className="font-display text-base uppercase tracking-[0.14em] text-cr-primary">
            Vocabulario que describe lo mismo
          </h2>
          <p className="mt-2 font-sans text-sm text-cr-text/80 leading-relaxed">
            <strong>Hacer piña</strong> · <strong>ser una piña</strong> · <strong>ir piña</strong>{" "}
            · <strong>ir con la crew</strong> · <strong>ir con el squad</strong> ·{" "}
            <strong>viaje en grupo</strong> · <strong>plan en coche</strong> ·{" "}
            <strong>ir todos juntos</strong> · <strong>compartir coche</strong> ·{" "}
            <strong>carpooling festivalero</strong>. Lenguajes distintos, mismo plan. Lo que
            importa es la mecánica: gente que va al mismo festival se organiza para viajar y
            vivirlo en grupo.
          </p>
        </aside>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-4xl px-4 md:px-6 py-10" aria-labelledby="faq">
        <h2 id="faq" className="font-display text-2xl md:text-3xl uppercase">Preguntas frecuentes</h2>
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
            <Link to="/viaje-en-grupo-festival" className="block border border-cr-border p-4 hover:border-cr-primary/60 transition-colors">
              <p className="font-display text-sm uppercase">Viaje en grupo al festival →</p>
              <p className="mt-1 text-xs text-cr-text/60">Logística: tamaño óptimo, roles y coordinación.</p>
            </Link>
          </li>
          <li>
            <Link to="/ir-juntos-al-festival" className="block border border-cr-border p-4 hover:border-cr-primary/60 transition-colors">
              <p className="font-display text-sm uppercase">Ir juntos al festival →</p>
              <p className="mt-1 text-xs text-cr-text/60">Vibe, playlist, crew. El ángulo social del viaje.</p>
            </Link>
          </li>
          <li>
            <Link to="/compartir-gastos-festival" className="block border border-cr-border p-4 hover:border-cr-primary/60 transition-colors">
              <p className="font-display text-sm uppercase">Compartir gastos al festival →</p>
              <p className="mt-1 text-xs text-cr-text/60">Reparto, apps y por qué no hay comisión.</p>
            </Link>
          </li>
          <li>
            <Link to="/crew" className="block border border-cr-border p-4 hover:border-cr-primary/60 transition-colors">
              <p className="font-display text-sm uppercase">Crew & Squads →</p>
              <p className="mt-1 text-xs text-cr-text/60">Crea el grupo de tu festival en la app.</p>
            </Link>
          </li>
        </ul>
      </section>
    </main>
  );
}
