import { Link } from "react-router-dom";
import { ArrowRight, Building2, Train, Clock, Euro } from "lucide-react";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";
import { BRAND } from "@/lib/brandEntity";
import { ContentProvenance } from "@/components/ContentProvenance";

/**
 * Landing — /coche-compartido-conciertos
 *
 * Targets the head term "coche compartido" with the long-tail modifier
 * "conciertos" (sala/estadio, not festival camping). Unique angle vs
 * /viaje-compartido (festival-first) and /compartir-coche-festival
 * (generic festival). Focus: WiZink, Movistar Arena, Estadi Olímpic,
 * Roig Arena, Palau Sant Jordi, Bilbao Arena, La Cartuja — single-night
 * gigs where the show ends at 23:00-01:00 and metro/bus already closed.
 */

const CONCERT_VENUES = [
  {
    venue: "WiZink Center",
    city: "Madrid",
    endTime: "23:00–00:30",
    publicTransport: "Metro L7 hasta 01:30",
    carpoolFrom: "Centro Madrid: 4-8 €",
    nightProblem: "El último metro coincide justo con el final del concierto — colas y posibles taxis llenos.",
  },
  {
    venue: "Movistar Arena",
    city: "Madrid",
    endTime: "23:00–01:00",
    publicTransport: "Metro L5/L3 hasta 01:30",
    carpoolFrom: "Madrid sur: 3-6 €",
    nightProblem: "Mismo patrón que WiZink. La vuelta a barrios periféricos sin metro nocturno es complicada.",
  },
  {
    venue: "Estadi Olímpic Lluís Companys",
    city: "Barcelona",
    endTime: "23:00–00:00",
    publicTransport: "FGC Pl. Espanya + caminar",
    carpoolFrom: "Centro BCN: 5-10 €",
    nightProblem: "Subir y bajar Montjuïc a pie de noche con 50.000 personas saliendo a la vez no es rápido.",
  },
  {
    venue: "Palau Sant Jordi",
    city: "Barcelona",
    endTime: "23:00–01:00",
    publicTransport: "Funicular Montjuïc cierra 22:00",
    carpoolFrom: "BCN área metropolitana: 6-12 €",
    nightProblem: "Mismo problema: Montjuïc + horario tarde + capacidad 17.000 personas = caos en la salida.",
  },
  {
    venue: "Roig Arena",
    city: "Valencia",
    endTime: "23:00–01:00",
    publicTransport: "Metro L1/L7 hasta 23:30",
    carpoolFrom: "Centro Valencia: 4-7 €",
    nightProblem: "El metro cierra antes que el concierto algunas noches. Bus EMT nocturno cubre poco.",
  },
  {
    venue: "Bilbao Arena (Miribilla)",
    city: "Bilbao",
    endTime: "22:30–00:30",
    publicTransport: "Metro Bilbao L2 hasta 23:00 lab. / 02:00 finde",
    carpoolFrom: "Centro Bilbao: 3-6 €",
    nightProblem: "Entre semana, el metro cierra mientras la gente todavía está dentro del recinto.",
  },
  {
    venue: "Estadio La Cartuja",
    city: "Sevilla",
    endTime: "23:30–01:30",
    publicTransport: "TUSSAM línea C2 + caminar",
    carpoolFrom: "Centro Sevilla: 5-9 €",
    nightProblem: "Sin metro hasta el recinto. Bus nocturno con frecuencia escasa el día del concierto.",
  },
];

const FAQS = [
  {
    q: "¿Qué es el coche compartido para conciertos?",
    a: `Es compartir el coche con otras personas que van al mismo concierto en sala o estadio, repartiendo gasolina y peajes. ${BRAND.legalName} se enfoca específicamente en conciertos y festivales, así que la búsqueda es por nombre del artista o por recinto (WiZink, Movistar Arena, La Cartuja, Roig Arena, etc.), no por origen-destino genérico.`,
  },
  {
    q: "¿Cuánto cuesta un coche compartido para un concierto?",
    a: "Entre 3 € y 12 € por asiento dentro del área metropolitana del recinto. Trayectos interurbanos (Madrid → concierto en Barcelona) suben a 15-25 €/asiento. El precio lo fija el conductor para cubrir gasolina y peajes del trayecto real, dividido entre 2-4 pasajeros.",
  },
  {
    q: "¿Por qué usar coche compartido en lugar de metro o bus?",
    a: "Por el horario de salida. La mayoría de conciertos en sala terminan entre las 23:00 y 01:00, justo cuando el metro está dando sus últimos servicios. Con 17.000-50.000 personas saliendo a la vez, el cuello de botella es brutal y la vuelta puede colapsar 45-90 minutos. El coche compartido te deja en la puerta y la vuelta sale del aparcamiento del recinto.",
  },
  {
    q: "¿Hay coches para todos los conciertos?",
    a: "Para conciertos en los grandes recintos (WiZink Center, Movistar Arena, Estadi Olímpic, Palau Sant Jordi, Roig Arena, Bilbao Arena, La Cartuja, Príncipe Felipe) habitualmente sí. Para conciertos pequeños en salas con aforo <2.000 personas, depende de si suficientes asistentes han publicado viaje. Mira el listado del concierto antes de descartar otras opciones.",
  },
  {
    q: "¿Cómo se paga?",
    a: `Directo entre conductor y pasajero el día del concierto: efectivo o Bizum. ${BRAND.legalName} no cobra comisión sobre el viaje y no procesa pagos. El conductor recibe exactamente el precio publicado por asiento; el pasajero no paga sobrecargos.`,
  },
  {
    q: "¿Es seguro?",
    a: "Los conductores verifican DNI y carnet antes de publicar viajes. Los pasajeros pueden ver foto, perfil y valoraciones reales de viajes anteriores. El chat queda registrado en la app y el pago no se adelanta por tarjeta — solo el día del viaje, en mano.",
  },
];

export default function CocheCompartidoConciertosPage() {
  useSeoMeta({
    title: "Coche compartido para conciertos · ConcertRide — WiZink, Movistar Arena, Roig",
    description:
      "Coche compartido para ir a conciertos en España: WiZink Center, Movistar Arena, Estadi Olímpic, Palau Sant Jordi, Roig Arena, Bilbao Arena y más. 0 % comisión, pago en mano. Desde 3 €/asiento.",
    canonical: `${SITE_URL}/coche-compartido-conciertos`,
    keywords:
      "coche compartido conciertos, coche compartido concierto, coche compartido madrid concierto, coche compartido barcelona concierto, coche compartido valencia concierto, coche compartido wizink, coche compartido movistar arena",
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
      { "@type": "ListItem", position: 2, name: "Coche compartido para conciertos", item: `${SITE_URL}/coche-compartido-conciertos` },
    ],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Coche compartido para conciertos en España",
    description: BRAND.shortDescription,
    inLanguage: "es-ES",
    datePublished: "2026-05-20",
    dateModified: new Date().toISOString().slice(0, 10),
    author: { "@type": "Person", name: BRAND.founder.name, url: BRAND.founder.url },
    publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: BRAND.legalName },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/coche-compartido-conciertos` },
  };

  return (
    <main id="main" className="min-h-dvh bg-cr-bg text-cr-text pt-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <ContentProvenance
        pageId="/coche-compartido-conciertos"
        headline="Coche compartido para conciertos en España"
        datePublished="2026-05-20"
        dateModified={new Date().toISOString().slice(0, 10)}
        author={{ name: BRAND.founder.name, url: BRAND.founder.url }}
        reviewedBy={{ name: BRAND.founder.name, url: BRAND.founder.url }}
        aiInvolvement="research-assist"
        purpose="Explicar por qué el coche compartido encaja para conciertos en sala y estadio donde el transporte público nocturno colapsa o cierra antes del fin del show."
      />

      <section className="mx-auto max-w-4xl px-4 md:px-6 py-8 md:py-12">
        <nav aria-label="Breadcrumb" className="font-sans text-xs uppercase tracking-[0.18em] text-cr-text/60 mb-4">
          <Link to="/" className="hover:text-cr-primary">Inicio</Link>
          <span className="mx-2">/</span>
          <span>Coche compartido para conciertos</span>
        </nav>

        <h1 className="font-display text-3xl md:text-5xl uppercase leading-[0.95] tracking-tight">
          Coche compartido
          <br />
          <span className="text-[#dbff00]">para conciertos en España</span>
        </h1>

        <p data-quotable className="mt-5 max-w-3xl font-sans text-base md:text-lg leading-relaxed text-cr-text/90">
          Coche compartido para ir a conciertos en sala y estadio: WiZink Center, Movistar Arena,
          Estadi Olímpic, Palau Sant Jordi, Roig Arena, Bilbao Arena, La Cartuja. La razón principal
          es la vuelta: la mayoría de conciertos terminan entre 23:00 y 01:00, justo cuando el metro
          cierra o colapsa. {BRAND.legalName} junta a gente que va al mismo show desde el mismo
          origen. Sin comisión, pago en mano (Bizum o efectivo), desde 3 €/asiento.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Link
            to="/concerts"
            className="inline-flex items-center justify-center gap-2 bg-[#dbff00] text-black font-sans font-semibold uppercase tracking-[0.12em] text-sm px-6 py-3 hover:bg-[#c8ec00] transition-colors"
          >
            Buscar conciertos
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

      {/* Venues table */}
      <section className="mx-auto max-w-6xl px-4 md:px-6 py-10" aria-labelledby="recintos">
        <h2 id="recintos" className="font-display text-2xl md:text-3xl uppercase">
          Recintos cubiertos y por qué tiene sentido
        </h2>
        <p className="mt-3 max-w-3xl font-sans text-sm text-cr-text/70 leading-relaxed">
          Horarios de fin de concierto y de cierre del transporte público de cada recinto. El cruce
          entre los dos es donde el coche compartido suele ganar.
        </p>

        <div className="mt-6 overflow-x-auto border border-cr-border">
          <table className="w-full min-w-[820px] text-left text-sm">
            <thead className="bg-white/[0.04] uppercase font-mono text-[10px] tracking-[0.14em] text-cr-text/70">
              <tr>
                <th scope="col" className="px-3 py-3">Recinto</th>
                <th scope="col" className="px-3 py-3">Ciudad</th>
                <th scope="col" className="px-3 py-3">Final concierto</th>
                <th scope="col" className="px-3 py-3">Transporte público</th>
                <th scope="col" className="px-3 py-3">Coche compartido desde</th>
                <th scope="col" className="px-3 py-3">Por qué encaja</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cr-border">
              {CONCERT_VENUES.map((venue) => (
                <tr key={venue.venue}>
                  <th scope="row" className="px-3 py-3 font-display uppercase text-sm">
                    {venue.venue}
                  </th>
                  <td className="px-3 py-3 text-cr-text/80">{venue.city}</td>
                  <td className="px-3 py-3 text-cr-text/80 font-mono text-xs">{venue.endTime}</td>
                  <td className="px-3 py-3 text-cr-text/80">{venue.publicTransport}</td>
                  <td className="px-3 py-3 text-[#dbff00]">{venue.carpoolFrom}</td>
                  <td className="px-3 py-3 text-cr-text/70 text-xs">{venue.nightProblem}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 font-mono text-[11px] text-cr-text/50">
          Fuente: páginas oficiales de cada recinto y operadores de transporte (Metro de Madrid, TMB,
          Metrovalencia, Metro Bilbao, TUSSAM), mayo 2026. Los horarios de cierre del metro varían
          entre días laborables y fin de semana.
        </p>
      </section>

      {/* Why it works */}
      <section className="mx-auto max-w-4xl px-4 md:px-6 py-10" aria-labelledby="por-que">
        <h2 id="por-que" className="font-display text-2xl md:text-3xl uppercase">
          Por qué el coche compartido encaja en conciertos
        </h2>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <article className="border border-cr-border p-5">
            <Clock size={20} className="text-cr-primary" aria-hidden="true" />
            <h3 className="mt-3 font-display text-lg uppercase">Horario que coincide con el del show</h3>
            <p className="mt-2 font-sans text-sm text-cr-text/80 leading-relaxed">
              Quien conduce también va al concierto, así que la hora de salida y de vuelta tienen
              sentido para el evento — no es un trayecto que casualmente sale a esa hora.
            </p>
          </article>
          <article className="border border-cr-border p-5">
            <Building2 size={20} className="text-cr-primary" aria-hidden="true" />
            <h3 className="mt-3 font-display text-lg uppercase">Aparcamiento ya resuelto</h3>
            <p className="mt-2 font-sans text-sm text-cr-text/80 leading-relaxed">
              Para los recintos grandes (WiZink, Movistar Arena, Sant Jordi), aparcar cerca puede
              costar 10-20 € y exigir reserva. Yendo en un solo coche, el coste del aparcamiento se
              reparte entre 3-4 personas.
            </p>
          </article>
          <article className="border border-cr-border p-5">
            <Euro size={20} className="text-cr-primary" aria-hidden="true" />
            <h3 className="mt-3 font-display text-lg uppercase">Más barato que un taxi nocturno</h3>
            <p className="mt-2 font-sans text-sm text-cr-text/80 leading-relaxed">
              Un taxi del WiZink a barrios periféricos de Madrid sale 18-28 €. Bilbao Arena → centro
              ronda los 12-18 €. El coche compartido cuesta 3-8 € por asiento porque vais varias
              personas y nadie cobra comisión.
            </p>
          </article>
          <article className="border border-cr-border p-5">
            <Train size={20} className="text-cr-primary" aria-hidden="true" />
            <h3 className="mt-3 font-display text-lg uppercase">Y si vienes de otra ciudad</h3>
            <p className="mt-2 font-sans text-sm text-cr-text/80 leading-relaxed">
              Trayecto interurbano para un concierto (Toledo → Madrid, Tarragona → Barcelona) sale
              normalmente más barato que el AVE más el traslado al recinto, especialmente si
              comparas el último AVE de vuelta vs salir cuando termine el show.
            </p>
          </article>
        </div>
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
            <Link to="/compartir-coche-festival" className="block border border-cr-border p-4 hover:border-cr-primary/60 transition-colors">
              <p className="font-display text-sm uppercase">Compartir coche al festival →</p>
              <p className="mt-1 text-xs text-cr-text/60">Misma idea pero enfocada en festivales (no conciertos en sala).</p>
            </Link>
          </li>
          <li>
            <Link to="/ir-juntos-al-festival" className="block border border-cr-border p-4 hover:border-cr-primary/60 transition-colors">
              <p className="font-display text-sm uppercase">Ir juntos al festival →</p>
              <p className="mt-1 text-xs text-cr-text/60">El ángulo social: ir con gente que también va al cartel.</p>
            </Link>
          </li>
          <li>
            <Link to="/viaje-compartido" className="block border border-cr-border p-4 hover:border-cr-primary/60 transition-colors">
              <p className="font-display text-sm uppercase">Viaje compartido en coche →</p>
              <p className="mt-1 text-xs text-cr-text/60">Visión general del producto y casos de uso.</p>
            </Link>
          </li>
          <li>
            <Link to="/concerts" className="block border border-cr-border p-4 hover:border-cr-primary/60 transition-colors">
              <p className="font-display text-sm uppercase">Conciertos 2026 →</p>
              <p className="mt-1 text-xs text-cr-text/60">Listado completo con viajes disponibles por concierto.</p>
            </Link>
          </li>
        </ul>
      </section>
    </main>
  );
}
