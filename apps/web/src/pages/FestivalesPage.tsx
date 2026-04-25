import { Link } from "react-router-dom";
import { MapPin, Calendar } from "lucide-react";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";
import { FESTIVAL_LANDINGS } from "@/lib/festivalLandings";

const FEATURED_SLUGS = ["mad-cool", "primavera-sound", "sonar", "fib", "bbk-live", "arenal-sound"];

export default function FestivalesPage() {
  useSeoMeta({
    title: "Carpooling para festivales de música en España 2026",
    description:
      "Viajes compartidos a los mejores festivales de España: Mad Cool, Primavera Sound, Sónar, FIB, BBK Live, Arenal Sound y más. Sin taxi, sin comisión. Conductores verificados.",
    canonical: `${SITE_URL}/festivales`,
    keywords:
      "carpooling festivales españa, viaje compartido festival música, cómo ir al festival en coche, transporte festivales 2026, mad cool carpooling, primavera sound viaje compartido, sonar barcelona transporte",
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
          Temporada 2026
        </p>

        <h1 className="font-display text-4xl md:text-6xl uppercase leading-[0.92]">
          Carpooling<br />para festivales.
        </h1>

        <p className="font-sans text-sm md:text-base text-cr-text-muted max-w-2xl leading-relaxed">
          Encuentra o publica un viaje compartido a cualquier festival de España. Sin comisión,
          el 100&nbsp;% del precio va al conductor. Pago en efectivo o Bizum el día del viaje.
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
