import { Link } from "react-router-dom";
import { MapPin, Calendar } from "lucide-react";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";
import { FESTIVAL_LANDINGS } from "@/lib/festivalLandings";

const FEATURED_SLUGS = ["mad-cool", "primavera-sound", "sonar", "fib", "bbk-live", "arenal-sound"];

export default function FestivalesPage() {
  const year = new Date().getFullYear();
  useSeoMeta({
    title: `Festivales España ${year} · Carpooling y transporte | ConcertRide`,
    description: `+${FESTIVAL_LANDINGS.length} festivales con viaje compartido en España ${year}: Mad Cool, Primavera Sound, BBK Live, Arenal Sound y más. Sin comisión. Únete ahora.`,
    canonical: `${SITE_URL}/festivales`,
    keywords:
      `carpooling festivales españa ${year}, festivales españa ${year}, viaje compartido festival música ${year}, autobuses festivales españa, bus festivales ${year}, cómo ir al festival en coche compartido, transporte festivales ${year}, mad cool carpooling ${year}, primavera sound viaje compartido ${year}, sonar barcelona transporte, viña rock buses ${year}, arenal sound bus ${year}, bbk live santander carpooling, resurrection fest viajes compartidos, fib benicassim carpooling, sonorama ribera aranda carpooling, cala mijas malaga transporte, medusa cullera carpooling, o son do camino santiago carpooling, carpooling festivales verano ${year}`,
  });

  const featured = FESTIVAL_LANDINGS.filter((f) => FEATURED_SLUGS.includes(f.slug));
  const rest = FESTIVAL_LANDINGS.filter((f) => !FEATURED_SLUGS.includes(f.slug));

  const url = `${SITE_URL}/festivales`;
  const jsonLdWebPage = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${url}#webpage`,
    url,
    name: `Festivales de música España ${year}: carpooling y transporte | ConcertRide`,
    description: `Directorio de ${FESTIVAL_LANDINGS.length} festivales de música en España ${year} con carpooling disponible. Mad Cool (IFEMA Madrid, 9–11 jul), Primavera Sound (Parc del Fòrum Barcelona, 28 may–1 jun), Sónar (Fira de Barcelona, 18–20 jun), BBK Live (Kobetamendi Bilbao, 9–11 jul), Arenal Sound (Burriana, 29 jul–2 ago), Viña Rock (Villarrobledo, 30 abr–3 may) y más. Precios desde 3 €/asiento sin comisión.`,
    inLanguage: "es-ES",
    numberOfItems: FESTIVAL_LANDINGS.length,
    keywords: `festivales España ${year}, carpooling festivales, Mad Cool carpooling, Primavera Sound viaje compartido, Sónar transporte, BBK Live Bilbao, Arenal Sound Burriana, Viña Rock Villarrobledo`,
    datePublished: "2026-04-10",
    dateModified: new Date().toISOString().slice(0, 10),
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#service` },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".speakable"],
    },
  };
  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Festivales", item: url },
    ],
  };
  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: "es-ES",
    mainEntity: [
      {
        "@type": "Question",
        name: `¿Cuáles son los festivales más grandes de España en ${year}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Los cinco festivales con mayor aforo de España en ${year} son: Mad Cool (IFEMA Madrid, 9–11 jul, ~80.000 asistentes/día), Primavera Sound (Parc del Fòrum Barcelona, 28 may–1 jun, ~60.000/día), Medusa Festival (Playa de Cullera, 12–16 ago, +300.000 totales), Arenal Sound (Playa del Arenal Burriana, 29 jul–2 ago) y BBK Live (Kobetamendi Bilbao, 9–11 jul). Todos tienen viajes compartidos disponibles en ConcertRide.`,
        },
      },
      {
        "@type": "Question",
        name: "¿Hay autobuses a los festivales de España?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `Solo 8 de los 16 festivales cubiertos por ConcertRide disponen de autobús lanzadera oficial: BBK Live (gratuita desde Plaza Moyúa, Bilbao), Arenal Sound (lanzadera Castellón–Burriana), Medusa (lanzadera Valencia–Cullera), Viña Rock (bus Albacete–La Pulgosa, 35–55 € desde Madrid), Sonorama Ribera (La Sepulvedana Madrid–Aranda, 10–15 €), O Son do Camiño, Mad Cool (Metro L8 hasta las 2:30) y Primavera Sound (Metro L4). Los horarios son fijos y las plazas se agotan semanas antes. El carpooling con ConcertRide cubre los 16 festivales sin horario inamovible.`,
        },
      },
      {
        "@type": "Question",
        name: "¿Cuánto cuesta el carpooling a un festival de España?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `El precio lo fija cada conductor para cubrir combustible y peajes. Rangos orientativos: trayectos cortos (<100 km, ej. Valencia→FIB 75 km): 4–8 €/asiento; distancia media (100–300 km, ej. Zaragoza→Primavera Sound 306 km): 8–14 €/asiento; larga distancia (>400 km, ej. Madrid→Resurrection Fest ~620 km): 18–35 €/asiento. ConcertRide no cobra comisión: el 100 % va al conductor.`,
        },
      },
      {
        "@type": "Question",
        name: "¿Por qué usar ConcertRide para ir a festivales?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `Para festivales, ConcertRide tiene tres ventajas frente a las plataformas de carpooling generalistas: (1) 0 % de comisión — otras plataformas cobran 12–18 % al pasajero; (2) cada viaje está vinculado a un evento concreto, con hora de vuelta alineada al fin del show; (3) los conductores van al mismo festival, no a paradas genéricas de carretera. Además, ConcertRide no retiene el pago: se paga en efectivo o Bizum directamente al conductor el día del viaje.`,
        },
      },
      {
        "@type": "Question",
        name: "¿Cómo puedo volver de un festival de madrugada?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `La mejor opción es reservar la vuelta por adelantado en ConcertRide. El metro de Madrid cierra a la 1:30 (ampliado hasta las 2:30 en noches de festival), el de Barcelona a las 2:00. Los taxis cuestan 60–100 € de madrugada desde festivales periféricos. Con ConcertRide, acuerdas la hora de salida con el conductor (normalmente cuando acaba el último bolo, hacia las 2:00–3:00) y pagas 8–15 €/asiento según distancia. Es la opción más usada en festivales como Resurrection Fest (Viveiro), Cala Mijas (Mijas) y Sonorama Ribera (Aranda de Duero), donde no existe transporte público nocturno.`,
        },
      },
    ],
  };

  const jsonLdItemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Festivales de música en España ${year} con carpooling`,
    url: `${SITE_URL}/festivales`,
    inLanguage: "es-ES",
    numberOfItems: FESTIVAL_LANDINGS.length,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    itemListElement: FESTIVAL_LANDINGS.map((f, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: f.name,
      url: `${SITE_URL}/festivales/${f.slug}`,
      description: f.blurb.slice(0, 160),
    })),
  };

  return (
    <main id="main" className="min-h-dvh bg-cr-bg text-cr-text pt-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebPage) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdItemList) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />
      {/* ── Hero ── */}
      <div className="max-w-6xl mx-auto px-6 pt-10 pb-6 space-y-4">
        <nav aria-label="Breadcrumb" className="font-mono text-[11px] text-cr-text-muted flex items-center gap-2">
          <Link to="/" className="hover:text-cr-primary">Inicio</Link>
          <span aria-hidden="true">/</span>
          <span className="text-cr-text-muted">Festivales</span>
        </nav>

        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
          Temporada {year}
        </p>

        <h1 className="font-display text-4xl md:text-6xl uppercase leading-[0.92]">
          Carpooling festivales<br />España {year}.
        </h1>

        <p className="font-sans text-sm md:text-base text-cr-text-muted max-w-2xl leading-relaxed speakable">
          Encuentra o publica un viaje compartido a cualquier festival de España. Sin comisión,
          el 100&nbsp;% del precio va al conductor. Pago en efectivo o Bizum el día del viaje.
          Cubrimos los principales festivales del calendario {year}: Mad Cool (Madrid), Primavera Sound y Cruïlla (Barcelona),
          Sónar, BBK Live (Bilbao), Arenal Sound (Burriana), Viña Rock (Villarrobledo), Resurrection Fest (Viveiro),
          FIB (Benicàssim), Sonorama Ribera (Aranda de Duero), Cala Mijas (Málaga), Medusa (Cullera),
          O Son do Camiño (Santiago), Zevra (Valencia) y Low Festival (Benidorm).
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            to="/publish"
            className="inline-block font-sans text-xs font-semibold uppercase tracking-[0.12em] bg-cr-primary text-black border-2 border-black px-5 py-2.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-100"
          >
            Publicar un viaje
          </Link>
          <Link
            to="/concerts"
            className="inline-block font-sans text-xs font-semibold uppercase tracking-[0.12em] border-2 border-cr-border text-cr-text-muted hover:border-cr-primary hover:text-cr-primary px-5 py-2.5 transition-colors"
          >
            Ver conciertos
          </Link>
        </div>
      </div>

      {/* ── Festivales destacados ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12">
        <h2 className="font-display text-2xl md:text-3xl uppercase mb-2">
          Festivales principales
        </h2>
        <p className="font-sans text-sm text-cr-text-muted mb-8 max-w-xl">
          Los festivales con mayor demanda de carpooling en ConcertRide.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {featured.map((f) => (
            <Link
              key={f.slug}
              to={`/festivales/${f.slug}`}
              className="group border border-cr-border p-5 space-y-3 hover:border-cr-primary transition-colors"
            >
              <div className="space-y-1">
                <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.14em] text-cr-primary">
                  {f.region}
                </p>
                <h3 className="font-display text-xl uppercase leading-tight group-hover:text-cr-primary transition-colors">
                  {f.shortName}
                </h3>
              </div>
              <div className="flex flex-col gap-1.5 font-mono text-[11px] text-cr-text-muted">
                <span className="inline-flex items-center gap-1.5">
                  <MapPin size={10} /> {f.venue} · {f.city}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar size={10} /> {f.typicalDates}
                </span>
              </div>
              <p className="font-sans text-[11px] text-cr-text-muted leading-snug line-clamp-2">
                {f.blurb.slice(0, 120)}…
              </p>
              <p className="font-mono text-[11px] text-cr-primary font-semibold">
                Desde {f.originCities[0]?.concertRideRange ?? "3 €/asiento"} →
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Resto de festivales ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12">
        <h2 className="font-display text-2xl md:text-3xl uppercase mb-2">
          Más festivales en ConcertRide
        </h2>
        <p className="font-sans text-sm text-cr-text-muted mb-8 max-w-xl">
          Carpooling a festivales de todos los géneros y regiones de España.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {rest.map((f) => (
            <Link
              key={f.slug}
              to={`/festivales/${f.slug}`}
              className="group border border-cr-border p-4 flex items-start justify-between gap-4 hover:border-cr-primary transition-colors"
            >
              <div className="space-y-1 min-w-0">
                <h3 className="font-display text-base uppercase truncate group-hover:text-cr-primary transition-colors">
                  {f.shortName}
                </h3>
                <p className="font-mono text-[11px] text-cr-text-muted truncate">
                  {f.city} · {f.startDate.slice(5, 10).split("-").reverse().join("/")}
                </p>
              </div>
              <span className="font-mono text-[11px] text-cr-primary font-semibold whitespace-nowrap shrink-0">
                {f.originCities[0]?.concertRideRange ?? "—"}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Autobuses, buses y lanzaderas — body keyword block ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-5">
        <h2 className="font-display text-2xl md:text-3xl uppercase">
          Autobuses, buses y lanzaderas a festivales {year}
        </h2>
        <p className="font-sans text-sm text-cr-text-muted max-w-3xl leading-relaxed">
          ¿Buscas autobuses a Viña Rock, bus a Arenal Sound, lanzadera oficial del BBK Live
          o cómo llegar al Mad Cool? Cada festival tiene logística distinta: algunos operan
          autobuses lanzadera oficiales (BBK Live, Arenal Sound, Sonorama, Medusa, Viña Rock
          desde Albacete), otros dependen de líneas de larga distancia (ALSA, Avanza,
          FlixBus) y otros no tienen ninguna conexión de transporte público nocturno
          (Resurrection Fest, Cala Mijas, Sonorama). Donde el bus oficial no llega o no
          opera de madrugada, el carpooling con ConcertRide es la opción más usada por
          los asistentes.
        </p>
        <ul className="font-sans text-xs text-cr-text-muted space-y-1.5 max-w-3xl">
          <li>· <Link to="/festivales/vina-rock" className="hover:text-cr-primary underline-offset-2">Viña Rock</Link>: bus lanzadera Albacete → La Pulgosa, autobuses privados Madrid–Viña Rock 35–55 €.</li>
          <li>· <Link to="/festivales/arenal-sound" className="hover:text-cr-primary underline-offset-2">Arenal Sound</Link>: lanzadera Castellón → Burriana, sin tren directo a la playa.</li>
          <li>· <Link to="/festivales/bbk-live" className="hover:text-cr-primary underline-offset-2">BBK Live</Link>: lanzadera oficial gratuita desde Bilbao centro a Kobetamendi.</li>
          <li>· <Link to="/festivales/mad-cool" className="hover:text-cr-primary underline-offset-2">Mad Cool</Link>: Metro L8 Madrid (servicio ampliado hasta 2:30), sin lanzadera oficial.</li>
          <li>· <Link to="/festivales/resurrection-fest" className="hover:text-cr-primary underline-offset-2">Resurrection Fest</Link>: ALSA A Coruña–Lugo–Viveiro 2–3 al día, sin nocturno.</li>
          <li>· <Link to="/festivales/sonorama-ribera" className="hover:text-cr-primary underline-offset-2">Sonorama</Link>: bus La Sepulvedana Madrid–Aranda 10–15 €, sin nocturno.</li>
          <li>· <Link to="/festivales/cala-mijas" className="hover:text-cr-primary underline-offset-2">Cala Mijas</Link>: sin shuttle oficial, taxi 25–40 € desde Málaga centro.</li>
          <li>· <Link to="/festivales/medusa-festival" className="hover:text-cr-primary underline-offset-2">Medusa Festival</Link>: lanzadera Valencia → Cullera, plazas limitadas.</li>
        </ul>
        <p className="font-mono text-[11px] text-cr-text-dim">
          Guía detallada festival por festival: <Link to="/blog/autobuses-festivales-espana-2026" className="hover:text-cr-primary underline underline-offset-2">Autobuses a festivales de España {year}</Link>.
        </p>
      </section>

      {/* ── Por qué ConcertRide ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <h2 className="font-display text-2xl md:text-3xl uppercase">
          Por qué carpooling para festivales
        </h2>
        <div className="grid md:grid-cols-3 gap-4 font-sans text-sm text-cr-text-muted leading-relaxed">
          <article className="space-y-2">
            <h3 className="font-display text-base uppercase text-cr-primary">Sin comisión</h3>
            <p>
              El 100&nbsp;% del precio va al conductor. ConcertRide no cobra nada.
              Pago en efectivo o Bizum el día del viaje: directo y sin sorpresas.
            </p>
          </article>
          <article className="space-y-2">
            <h3 className="font-display text-base uppercase text-cr-primary">Conductores verificados</h3>
            <p>
              Todos los conductores verifican su carnet antes de publicar viajes.
              Puedes ver valoraciones y reseñas de otros pasajeros.
            </p>
          </article>
          <article className="space-y-2">
            <h3 className="font-display text-base uppercase text-cr-primary">Tu horario, tu festival</h3>
            <p>
              Llegas y vuelves cuando quieras. Sin depender del último autobús
              ni pagar 60&nbsp;€ en taxi de madrugada.
            </p>
          </article>
        </div>
      </section>

    </main>
  );
}
