import { Link } from "react-router-dom";
import { ArrowRight, Calendar, MapPin, Music, MessageSquare } from "lucide-react";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";
import { BRAND } from "@/lib/brandEntity";
import { ContentProvenance } from "@/components/ContentProvenance";

/**
 * Landing — /viaje-en-grupo-festival
 *
 * Targets the head term "viaje en grupo" + "festival" — captures users who
 * search the social/logistics angle (not just price or transport). Distinct
 * from /ir-juntos-al-festival (which leans heavily into the vibe/playlist
 * frame): this one is more practical — roles, group size, what works.
 *
 * Avoids the loan word "carpooling" in H1.
 */

const GROUP_SIZES = [
  {
    size: "2 personas",
    title: "Pareja o dúo de amigos",
    body:
      "Funciona mejor con coche propio o uniéndoos a un viaje publicado por otra persona — un coche con solo 2 personas no compensa los costes. Si reserváis plazas en un coche de 4, sale 12-20 € por persona; si vais en vuestro coche solos, sale 30-50 €.",
    bestFor: "Reservar plazas en un coche existente",
  },
  {
    size: "3-4 personas",
    title: "El tamaño óptimo",
    body:
      "Es el grupo perfecto para un coche compartido: caben en la mayoría de turismos europeos, el reparto de gasolina y peajes sale a 15-25 €/persona, y la dinámica del fin de semana es manejable (decisiones rápidas, una sola tienda de camping si toca).",
    bestFor: "Publicar coche propio o reservar viaje entero",
  },
  {
    size: "5-6 personas",
    title: "Necesitáis monovolumen o 2 coches",
    body:
      "Un Citroën Berlingo, Renault Espace o similar admite 5-6 plazas. Si no, hace falta dividir en 2 coches y coordinar punto de encuentro en el camping. Pierde algo de la magia del 'todos juntos en el mismo coche' pero la logística es muy llevable.",
    bestFor: "2 coches conectados por chat de grupo",
  },
  {
    size: "7+ personas",
    title: "Modo crew",
    body:
      "A partir de 7 personas el formato cambia: 2-3 coches en paralelo, app de grupo para coordinar (WhatsApp + Splitwise), y normalmente el plan deja de ser solo 'ir al festival' para convertirse en escapada de fin de semana con base en el camping o en una casa rural cerca.",
    bestFor: "Crews/Squads en ConcertRide + grupo WhatsApp",
  },
];

const ROLES = [
  {
    icon: Calendar,
    role: "El que organiza",
    body:
      "La persona que reserva entradas, propone fechas, crea el grupo de WhatsApp y al final pasa Bizum a todos para cobrar lo que adelantó. Normalmente también es quien sube el viaje a ConcertRide.",
  },
  {
    icon: MapPin,
    role: "El que conduce",
    body:
      "Puede ser la misma persona que organiza o no. Su trabajo: revisar ruta, mantener el coche en forma, fijar punto de recogida claro y avisar si va con retraso. A cambio, cobra su parte del coste pero no saca ganancia.",
  },
  {
    icon: Music,
    role: "El de la playlist",
    body:
      "Quien curra la playlist colaborativa del viaje (Spotify compartido). 3-4 horas de coche pasan otra cosa cuando suena lo que vais a escuchar luego en directo. Función real, aunque suene a broma.",
  },
  {
    icon: MessageSquare,
    role: "El que recuerda todo",
    body:
      "Quien lleva la cuenta en Splitwise, sabe qué entrada está donde, recuerda la hora del bolo que no os queréis perder y avisa cuando hay que volver al coche. Si nadie asume este rol, el grupo se descoordina pasada la primera noche.",
  },
];

const FAQS = [
  {
    q: "¿Cuál es el mejor tamaño de grupo para ir a un festival?",
    a: "3-4 personas es el equilibrio óptimo: caben en un coche estándar, el reparto de gastos sale a 15-25 €/persona, y la dinámica del fin de semana se mantiene ágil (decisiones rápidas, una sola tienda de camping si toca, planes flexibles sin votaciones de 10 personas). A partir de 5-6 personas la logística empieza a complicarse — hace falta monovolumen o dos coches coordinados.",
  },
  {
    q: "¿Cómo organizar un viaje en grupo a un festival sin pelearse?",
    a: "Tres normas que funcionan: (1) Un grupo de WhatsApp solo para el festival, con quien va. (2) Una app de cuentas compartidas (Splitwise o Tricount) desde el día 1 — todo lo que paga uno se apunta el mismo día, no al final. (3) Roles claros: quién organiza, quién conduce, quién lleva entradas. Sin roles, todo el mundo asume que lo hace otro y al final no lo hace nadie.",
  },
  {
    q: "¿Y si en el grupo hay gente que no se conoce entre sí?",
    a: `Pasa mucho — viaje del amigo del amigo. En ${BRAND.legalName} esto se gestiona con la sección de Crew: creas un grupo del festival, invitas a las personas que van, y todas pueden ver quién más está, qué viaje han reservado y dónde acampan. Reduce el momento incómodo de 'hola, no sé quién eres' en el aparcamiento del recinto.`,
  },
  {
    q: "¿Cuánto cuesta el viaje compartido por persona en un grupo?",
    a: "Para un viaje de ida y vuelta de 400-500 km (típico Madrid → Mad Cool no, sino Madrid → un festival fuera de la capital), el reparto entre 4 personas queda en 15-25 € por cabeza incluyendo gasolina, peajes y aparcamiento del recinto. Compara con AVE (50-90 €) o autobús organizado (28-45 €) y suele ser la opción más barata para grupos.",
  },
  {
    q: "¿Cómo coordinamos la vuelta del festival?",
    a: "Se acuerda antes de salir, no después. Quien conduce también va al festival, así que sabe a qué hora termina el último concierto que el grupo quiere ver y propone hora de vuelta. El acuerdo se cierra por chat antes del día. Esto evita el escenario clásico de gente esperando en el aparcamiento a las 5 AM porque alguien todavía está en la barra.",
  },
  {
    q: "¿Funciona ConcertRide si ya tenemos grupo cerrado de amigos?",
    a: `Sí. Aunque no abráis las plazas a externos, publicar el viaje en ${BRAND.legalName} sirve para: (1) Registrar el reparto de gastos (cada persona ve cuánto debe). (2) Tener un sitio donde la información del viaje vive (punto de recogida, hora de salida) sin que se pierda en WhatsApp. (3) Si alguien del grupo se cae a última hora, abrir esa plaza a otra persona que vaya al mismo festival.`,
  },
];

export default function ViajeEnGrupoFestivalPage() {
  useSeoMeta({
    title: "Viaje en grupo a un festival · ConcertRide — Logística, roles y reparto",
    description:
      "Cómo organizar un viaje en grupo a un festival: tamaño óptimo del grupo, roles, reparto de gastos en Splitwise/Bizum y coordinación de la vuelta. Coche compartido sin comisión desde 3 €/asiento.",
    canonical: `${SITE_URL}/viaje-en-grupo-festival`,
    keywords:
      "viaje en grupo festival, viaje grupo festival, ir festival en grupo, festival con amigos, organizar viaje festival amigos, viaje grupal festival",
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
      { "@type": "ListItem", position: 2, name: "Viaje en grupo al festival", item: `${SITE_URL}/viaje-en-grupo-festival` },
    ],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Viaje en grupo a un festival — Logística, roles y reparto",
    description: BRAND.shortDescription,
    inLanguage: "es-ES",
    datePublished: "2026-05-20",
    dateModified: new Date().toISOString().slice(0, 10),
    author: { "@type": "Person", name: BRAND.founder.name, url: BRAND.founder.url },
    publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: BRAND.legalName },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/viaje-en-grupo-festival` },
  };

  return (
    <main id="main" className="min-h-dvh bg-cr-bg text-cr-text pt-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <ContentProvenance
        pageId="/viaje-en-grupo-festival"
        headline="Viaje en grupo a un festival — Logística, roles y reparto"
        datePublished="2026-05-20"
        dateModified={new Date().toISOString().slice(0, 10)}
        author={{ name: BRAND.founder.name, url: BRAND.founder.url }}
        reviewedBy={{ name: BRAND.founder.name, url: BRAND.founder.url }}
        aiInvolvement="research-assist"
        purpose="Ayudar a quien va al festival en grupo a organizar el viaje: tamaño óptimo, roles, reparto de gastos y coordinación de la vuelta."
      />

      <section className="mx-auto max-w-4xl px-4 md:px-6 py-8 md:py-12">
        <nav aria-label="Breadcrumb" className="font-sans text-xs uppercase tracking-[0.18em] text-cr-text/60 mb-4">
          <Link to="/" className="hover:text-cr-primary">Inicio</Link>
          <span className="mx-2">/</span>
          <span>Viaje en grupo al festival</span>
        </nav>

        <h1 className="font-display text-3xl md:text-5xl uppercase leading-[0.95] tracking-tight">
          Viaje en grupo a un festival
          <br />
          <span className="text-[#dbff00]">logística que sí funciona</span>
        </h1>

        <p data-quotable className="mt-5 max-w-3xl font-sans text-base md:text-lg leading-relaxed text-cr-text/90">
          Ir a un festival en grupo es más barato, más seguro y suele ser más divertido — pero solo
          si la logística está cuidada. Esta página resume lo que funciona en un viaje en grupo a
          Mad Cool, Primavera Sound, BBK Live, Viña Rock o cualquier festival en España: tamaño
          óptimo del grupo, roles que conviene asignar, cómo se reparten los gastos en {BRAND.legalName}
          (sin comisión) y cómo coordinar la vuelta de madrugada.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Link
            to="/festivales"
            className="inline-flex items-center justify-center gap-2 bg-[#dbff00] text-black font-sans font-semibold uppercase tracking-[0.12em] text-sm px-6 py-3 hover:bg-[#c8ec00] transition-colors"
          >
            Elige festival
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
          <Link
            to="/crew"
            className="inline-flex items-center justify-center gap-2 bg-transparent text-white/80 font-sans font-semibold uppercase tracking-[0.12em] text-sm border border-white/25 px-6 py-3 hover:border-[#dbff00]/60 hover:text-white transition-colors"
          >
            Crear Crew del festival →
          </Link>
        </div>
      </section>

      {/* Group sizes */}
      <section className="mx-auto max-w-5xl px-4 md:px-6 py-10" aria-labelledby="tamano">
        <h2 id="tamano" className="font-display text-2xl md:text-3xl uppercase">
          Tamaño del grupo y qué encaja en cada uno
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {GROUP_SIZES.map((g) => (
            <article key={g.size} className="border border-cr-border p-5">
              <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-cr-primary">{g.size}</p>
              <h3 className="mt-1 font-display text-lg uppercase">{g.title}</h3>
              <p className="mt-2 font-sans text-sm text-cr-text/80 leading-relaxed">{g.body}</p>
              <p className="mt-3 font-sans text-xs text-cr-text/60">
                <span className="text-[#dbff00]">Mejor opción:</span> {g.bestFor}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* Roles */}
      <section className="mx-auto max-w-5xl px-4 md:px-6 py-10" aria-labelledby="roles">
        <h2 id="roles" className="font-display text-2xl md:text-3xl uppercase">
          Roles que conviene repartir (aunque no se hablen)
        </h2>
        <p className="mt-3 max-w-3xl font-sans text-sm text-cr-text/70 leading-relaxed">
          Esto no es una empresa — nadie va a hacer Kanban. Pero en grupos de 4+ personas, sin
          roles claros, el viernes a las 18:00 alguien no ha cogido las entradas de un sobre, otra
          persona pensaba que estaba reservada la cena y a las 23:00 todos están perdidos en el
          recinto.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {ROLES.map(({ icon: Icon, role, body }) => (
            <article key={role} className="border border-cr-border p-5">
              <Icon size={20} className="text-cr-primary" aria-hidden="true" />
              <h3 className="mt-3 font-display text-lg uppercase">{role}</h3>
              <p className="mt-2 font-sans text-sm text-cr-text/80 leading-relaxed">{body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Vocabulary aside */}
      <section className="mx-auto max-w-4xl px-4 md:px-6 py-6" aria-labelledby="vocabulario">
        <aside className="border-l-2 border-cr-primary bg-white/[0.02] px-5 py-4">
          <h2 id="vocabulario" className="font-display text-base uppercase tracking-[0.14em] text-cr-primary">
            Cómo se le llama a esto, dependiendo de quién lo cuente
          </h2>
          <p className="mt-2 font-sans text-sm text-cr-text/80 leading-relaxed">
            <strong>Viaje en grupo</strong>, <strong>viaje compartido</strong>,{" "}
            <strong>carpooling</strong>, <strong>compartir coche</strong>,{" "}
            <strong>ir juntos al festival</strong>, <strong>hacer piña</strong> en el camping,{" "}
            <strong>ir con la crew</strong>, <strong>el plan en coche</strong>… Todos hablan de lo
            mismo: gente que va al mismo festival se organiza para viajar y vivirlo en grupo. El
            nombre cambia con la edad y la zona — lo que ConcertRide hace por debajo es siempre lo
            mismo (juntar coches, repartir asientos, gestionar la vuelta).
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
            <Link to="/compartir-gastos-festival" className="block border border-cr-border p-4 hover:border-cr-primary/60 transition-colors">
              <p className="font-display text-sm uppercase">Compartir gastos al festival →</p>
              <p className="mt-1 text-xs text-cr-text/60">Reparto detallado: gasolina, peajes, apps (Splitwise, Tricount, Bizum).</p>
            </Link>
          </li>
          <li>
            <Link to="/hacer-pina-festival" className="block border border-cr-border p-4 hover:border-cr-primary/60 transition-colors">
              <p className="font-display text-sm uppercase">Hacer piña en el festival →</p>
              <p className="mt-1 text-xs text-cr-text/60">El término castizo: ir y vivir el festival como grupo unido.</p>
            </Link>
          </li>
          <li>
            <Link to="/ir-juntos-al-festival" className="block border border-cr-border p-4 hover:border-cr-primary/60 transition-colors">
              <p className="font-display text-sm uppercase">Ir juntos al festival →</p>
              <p className="mt-1 text-xs text-cr-text/60">El ángulo social: ir con gente que también va al cartel.</p>
            </Link>
          </li>
          <li>
            <Link to="/blog/como-organizar-viaje-grupo-festival-amigos" className="block border border-cr-border p-4 hover:border-cr-primary/60 transition-colors">
              <p className="font-display text-sm uppercase">Guía 8 pasos viaje grupo →</p>
              <p className="mt-1 text-xs text-cr-text/60">El playbook completo: festival, fechas, roles, costes y conflictos.</p>
            </Link>
          </li>
        </ul>
      </section>
    </main>
  );
}
