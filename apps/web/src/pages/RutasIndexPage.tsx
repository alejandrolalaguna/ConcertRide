import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, MapPin } from "lucide-react";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";
import { ROUTE_LANDINGS } from "@/lib/routeLandings";
import { FESTIVAL_LANDINGS } from "@/lib/festivalLandings";

const ALL_FESTIVALS = [{ slug: "", shortName: "Todos" }, ...FESTIVAL_LANDINGS.map((f) => ({ slug: f.slug, shortName: f.shortName }))];

export default function RutasIndexPage() {
  useSeoMeta({
    title: `Rutas de carpooling a festivales en España ${new Date().getFullYear()}`,
    description: `${ROUTE_LANDINGS.length} rutas de viaje compartido a festivales de música en España. Carpooling Madrid–Mad Cool, Barcelona–Primavera Sound, Valencia–Arenal Sound, Santander–BBK Live, Marbella–Cala Mijas y más. Sin comisión, conductores verificados.`,
    canonical: `${SITE_URL}/rutas`,
    keywords:
      "rutas carpooling festivales, viaje compartido festival, madrid mad cool carpooling, barcelona primavera sound viaje compartido, valencia fib transporte, santander bbk live, marbella cala mijas, burriana arenal sound, autobuses festivales españa, bus festivales 2026, carpooling festivales españa 2026",
  });

  const [activeFilter, setActiveFilter] = useState("");

  const filtered = useMemo(
    () => activeFilter ? ROUTE_LANDINGS.filter((r) => r.festival.slug === activeFilter) : ROUTE_LANDINGS,
    [activeFilter],
  );

  const grouped = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    for (const r of filtered) {
      const key = r.festival.slug;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(r);
    }
    return map;
  }, [filtered]);

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Rutas", item: `${SITE_URL}/rutas` },
    ],
  };

  const jsonLdItemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Rutas de carpooling a festivales en España 2026",
    url: `${SITE_URL}/rutas`,
    numberOfItems: ROUTE_LANDINGS.length,
    itemListElement: ROUTE_LANDINGS.slice(0, 50).map((r, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `Carpooling ${r.originCity} → ${r.festival.shortName}`,
      url: `${SITE_URL}/rutas/${r.slug}`,
    })),
  };

  return (
    <main id="main" className="min-h-dvh bg-cr-bg text-cr-text pt-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdItemList) }} />

      {/* ── Hero ── */}
      <div className="max-w-6xl mx-auto px-6 pt-10 pb-6 space-y-4">
        <nav aria-label="Breadcrumb" className="font-mono text-[11px] text-cr-text-muted flex items-center gap-2">
          <Link to="/" className="hover:text-cr-primary">Inicio</Link>
          <span aria-hidden="true">/</span>
          <span className="text-cr-text-muted">Rutas</span>
        </nav>

        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
          {ROUTE_LANDINGS.length} rutas disponibles
        </p>

        <h1 className="font-display text-4xl md:text-6xl uppercase leading-[0.92]">
          Rutas de<br />carpooling {new Date().getFullYear()}.
        </h1>

        <p className="font-sans text-sm md:text-base text-cr-text-muted max-w-2xl leading-relaxed">
          Viajes compartidos desde todas las ciudades de España a los mejores festivales.
          Alternativa a los autobuses oficiales y de larga distancia (ALSA, Avanza, FlixBus)
          cuando no operan en horarios de festival. Sin comisión, pago en efectivo o Bizum el día del viaje.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            to="/publish"
            className="inline-block font-sans text-xs font-semibold uppercase tracking-[0.12em] bg-cr-primary text-black border-2 border-black px-5 py-2.5 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-100"
          >
            Publicar un viaje
          </Link>
          <Link
            to="/festivales"
            className="inline-block font-sans text-xs font-semibold uppercase tracking-[0.12em] border-2 border-cr-border text-cr-text-muted hover:border-cr-primary hover:text-cr-primary px-5 py-2.5 transition-colors"
          >
            Ver festivales
          </Link>
        </div>
      </div>

      {/* ── Stats bar ── */}
      <div className="border-t border-cr-border">
        <div className="max-w-6xl mx-auto px-6 py-4 grid grid-cols-3 sm:grid-cols-3 gap-4">
          {[
            { value: `${ROUTE_LANDINGS.length}`, label: "Rutas programáticas" },
            { value: `${FESTIVAL_LANDINGS.length}`, label: "Festivales cubiertos" },
            { value: "0 %", label: "Comisión de plataforma" },
          ].map((s) => (
            <div key={s.label} className="space-y-0.5">
              <p className="font-display text-xl md:text-2xl uppercase text-cr-primary">{s.value}</p>
              <p className="font-mono text-[10px] text-cr-text-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* ── Filter chips ── */}
      <div className="border-t border-cr-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-wrap gap-2">
          {ALL_FESTIVALS.map((f) => (
            <button
              key={f.slug}
              onClick={() => setActiveFilter(f.slug)}
              className={`font-sans text-[11px] font-semibold uppercase tracking-[0.1em] px-3 py-1.5 border transition-colors ${
                activeFilter === f.slug
                  ? "border-cr-primary bg-cr-primary text-black"
                  : "border-cr-border text-cr-text-muted hover:border-cr-primary hover:text-cr-primary"
              }`}
            >
              {f.shortName}
            </button>
          ))}
        </div>
      </div>

      {/* ── Route groups ── */}
      <div className="max-w-6xl mx-auto px-6 pb-24 space-y-12 pt-10">
        {Array.from(grouped.entries()).map(([festSlug, routes]) => {
          const festival = routes[0]!.festival;
          return (
            <section key={festSlug} className="space-y-4">
              <div className="flex items-baseline gap-3 border-t border-cr-border pt-6">
                <Link
                  to={`/festivales/${festival.slug}`}
                  className="font-display text-xl md:text-2xl uppercase hover:text-cr-primary transition-colors"
                >
                  {festival.name}
                </Link>
                <span className="font-mono text-[11px] text-cr-text-muted">
                  {festival.city} · {festival.startDate.slice(0, 7).split("-").reverse().join("/")}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                {routes.map((r) => (
                  <Link
                    key={r.slug}
                    to={`/rutas/${r.slug}`}
                    className="group border border-cr-border p-4 flex items-start justify-between gap-3 hover:border-cr-primary transition-colors"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-1.5 font-mono text-[11px] text-cr-text-muted">
                        <MapPin size={10} />
                        <span className="truncate">{r.originCity}</span>
                      </div>
                      <p className="font-sans text-xs text-cr-text group-hover:text-cr-primary transition-colors truncate">
                        {r.originData.km} km · {r.originData.drivingTime}
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="font-mono text-[11px] text-cr-primary font-semibold">
                        {r.originData.concertRideRange}
                      </span>
                      <ArrowRight size={11} className="text-cr-text-muted group-hover:text-cr-primary transition-colors" />
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      {/* ── Bottom CTA ── */}
      <div className="border-t border-cr-border">
        <div className="max-w-6xl mx-auto px-6 py-12 space-y-4">
          <h2 className="font-display text-2xl md:text-3xl uppercase">
            ¿No encuentras tu ruta?
          </h2>
          <p className="font-sans text-sm text-cr-text-muted max-w-xl leading-relaxed">
            Publica tu viaje o busca uno existente desde cualquier ciudad.
            También puedes activar alertas para recibir aviso cuando salga un viaje a tu festival.
          </p>
          <div className="flex flex-wrap gap-3">
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
              Buscar conciertos
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
