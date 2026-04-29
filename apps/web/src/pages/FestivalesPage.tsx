import { Link } from "react-router-dom";
import { MapPin, Calendar } from "lucide-react";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";
import { FESTIVAL_LANDINGS } from "@/lib/festivalLandings";

const FEATURED_SLUGS = ["mad-cool", "primavera-sound", "sonar", "fib", "bbk-live", "arenal-sound"];

export default function FestivalesPage() {
  const year = new Date().getFullYear();
  useSeoMeta({
    title: `Festivales de música en España ${year}: carpooling, autobuses y guía completa`,
    description: `Viajes compartidos y autobuses a los festivales de España ${year}: Mad Cool, Primavera Sound, Sónar, FIB, BBK Live, Arenal Sound, Viña Rock, Resurrection Fest y más. Sin taxi, sin comisión. Conductores verificados.`,
    canonical: `${SITE_URL}/festivales`,
    keywords:
      "festivales españa 2026, carpooling festivales españa, viaje compartido festival música, autobuses festivales españa, bus festivales, cómo ir al festival en coche, transporte festivales 2026, mad cool carpooling, primavera sound viaje compartido, sonar barcelona transporte, viña rock buses, arenal sound bus, bbk live santander, resurrection fest viajes",
  });

  const featured = FESTIVAL_LANDINGS.filter((f) => FEATURED_SLUGS.includes(f.slug));
  const rest = FESTIVAL_LANDINGS.filter((f) => !FEATURED_SLUGS.includes(f.slug));

  return (
    <main id="main" className="min-h-dvh bg-cr-bg text-cr-text pt-14">
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
          Festivales de música<br />en España {year}.
        </h1>

        <p className="font-sans text-sm md:text-base text-cr-text-muted max-w-2xl leading-relaxed">
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

      {/* ── Schema.org ItemList ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ItemList",
            name: "Festivales de música en España con carpooling 2026",
            description: "Lista de festivales de música en España con viajes compartidos disponibles en ConcertRide.",
            url: `${SITE_URL}/festivales`,
            numberOfItems: FESTIVAL_LANDINGS.length,
            itemListElement: FESTIVAL_LANDINGS.map((f, i) => ({
              "@type": "ListItem",
              position: i + 1,
              name: f.name,
              url: `${SITE_URL}/festivales/${f.slug}`,
              description: `Carpooling a ${f.name} desde ${f.originCities[0]?.city ?? "toda España"}. ${f.typicalDates}.`,
            })),
          }),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
              { "@type": "ListItem", position: 2, name: "Festivales", item: `${SITE_URL}/festivales` },
            ],
          }),
        }}
      />
    </main>
  );
}
