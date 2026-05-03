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
    title: `Rutas carpooling festivales España ${new Date().getFullYear()} | ConcertRide`,
    description: `+${ROUTE_LANDINGS.length} rutas carpooling a festivales en España ${new Date().getFullYear()}: Madrid–Mad Cool, Barcelona–Primavera Sound, Valencia–Arenal Sound, Bilbao–BBK Live y más. Sin comisión.`,
    canonical: `${SITE_URL}/rutas`,
    keywords:
      `rutas carpooling festivales ${new Date().getFullYear()}, viaje compartido festival españa, madrid mad cool carpooling ${new Date().getFullYear()}, barcelona primavera sound viaje compartido, valencia fib transporte, bilbao bbk live carpooling, marbella cala mijas transporte, burriana arenal sound bus, autobuses festivales españa ${new Date().getFullYear()}, carpooling festivales verano ${new Date().getFullYear()}, rutas coche compartido festivales, carpooling festival música españa`,
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

  const year = new Date().getFullYear();

  const jsonLdWebPage = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${SITE_URL}/rutas#webpage`,
    url: `${SITE_URL}/rutas`,
    name: `Rutas de carpooling a festivales en España ${year} | ConcertRide`,
    description: `${ROUTE_LANDINGS.length} rutas de viaje compartido a festivales de música en España. Sin comisión, conductores verificados.`,
    inLanguage: "es-ES",
    datePublished: "2026-04-10",
    dateModified: "2026-05-03",
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
      { "@type": "ListItem", position: 2, name: "Rutas", item: `${SITE_URL}/rutas` },
    ],
  };

  const jsonLdItemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Rutas de carpooling a festivales en España ${year}`,
    url: `${SITE_URL}/rutas`,
    itemListOrder: "https://schema.org/ItemListOrderAscending",
    numberOfItems: ROUTE_LANDINGS.length,
    itemListElement: ROUTE_LANDINGS.map((r, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: `Carpooling ${r.originCity} → ${r.festival.shortName}`,
      url: `${SITE_URL}/rutas/${r.slug}`,
    })),
  };

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: "es-ES",
    mainEntity: [
      {
        "@type": "Question",
        name: `¿Cuáles son las rutas de carpooling a festivales más populares en España ${year}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Las rutas con más viajes publicados en ConcertRide en ${year} son: Madrid→Mad Cool (15 km, 4–7 €), Madrid→Primavera Sound (620 km, 14–22 €), Valencia→Arenal Sound (65 km, 3–6 €), Madrid→BBK Live (395 km, 11–16 €), y A Coruña→Resurrection Fest (100 km, 4–7 €). En total hay ${ROUTE_LANDINGS.length} rutas city→festival disponibles.`,
        },
      },
      {
        "@type": "Question",
        name: "¿Cuánto cuesta el carpooling a un festival desde Madrid?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `Desde Madrid el precio depende del festival: Mad Cool (IFEMA, 15 km) 4–7 €; BBK Live (Bilbao, 395 km) 11–16 €; Primavera Sound (Barcelona, 620 km) 14–22 €; Resurrection Fest (Viveiro, 600 km) 16–22 €; Arenal Sound (Burriana, 460 km) 12–17 €. ConcertRide no cobra comisión — el 100 % va al conductor.`,
        },
      },
      {
        "@type": "Question",
        name: "¿Hay rutas de carpooling de vuelta desde los festivales?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `Sí. La mayoría de conductores publican tanto la ida como la vuelta. La vuelta es especialmente importante en festivales donde el transporte público no opera de madrugada: Resurrection Fest (Viveiro), Cala Mijas (Málaga), Sonorama Ribera (Aranda de Duero), Medusa Festival (Cullera), Low Festival (Benidorm). Acuerda la hora de vuelta con el conductor por chat.`,
        },
      },
      {
        "@type": "Question",
        name: "¿Cuánto se ahorra usando ConcertRide en vez de un taxi al festival?",
        acceptedAnswer: {
          "@type": "Answer",
          text: `Un taxi nocturno desde el festival suele costar 40–90 € solo (precio ×2–3 de madrugada). El carpooling con ConcertRide cuesta entre 3 y 22 €/asiento según la distancia. Para Mad Cool (IFEMA Madrid), el ahorro es de 50–80 € respecto a un VTC nocturno. Sin comisión de plataforma.`,
        },
      },
    ],
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
          <span className="text-cr-text-muted">Rutas</span>
        </nav>

        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
          {ROUTE_LANDINGS.length} rutas disponibles
        </p>

        <h1 className="font-display text-4xl md:text-6xl uppercase leading-[0.92]">
          Rutas de<br />carpooling {new Date().getFullYear()}.
        </h1>

        <p className="font-sans text-sm md:text-base text-cr-text-muted max-w-2xl leading-relaxed speakable">
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

      {/* ── FAQ ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <h2 className="font-display text-2xl md:text-3xl uppercase">
          Preguntas frecuentes — rutas de carpooling
        </h2>
        <dl className="space-y-6">
          {([
            {
              q: `¿Cuáles son las rutas de carpooling a festivales más populares en España ${year}?`,
              a: `Las rutas con más viajes publicados son Madrid→Mad Cool (15 km, 4–7 €), Madrid→Primavera Sound (620 km, 14–22 €), Valencia→Arenal Sound (65 km, 3–6 €), Madrid→BBK Live (395 km, 11–16 €) y A Coruña→Resurrection Fest (100 km, 4–7 €). En total ${ROUTE_LANDINGS.length} rutas disponibles.`,
            },
            {
              q: "¿Cuánto cuesta el carpooling a un festival desde Madrid?",
              a: "Desde Madrid: Mad Cool (IFEMA) 4–7 €; BBK Live (Bilbao) 11–16 €; Primavera Sound (Barcelona) 14–22 €; Resurrection Fest (Viveiro) 16–22 €; Arenal Sound (Burriana) 12–17 €. Sin comisión — el 100 % va al conductor.",
            },
            {
              q: "¿Hay rutas de carpooling de vuelta desde los festivales?",
              a: "Sí. La mayoría de conductores publican ida y vuelta. La vuelta es clave donde no hay transporte público nocturno: Resurrection Fest, Cala Mijas, Sonorama, Medusa y Low Festival.",
            },
            {
              q: "¿Cuánto se ahorra usando ConcertRide en vez de un taxi al festival?",
              a: "Un taxi nocturno desde el festival cuesta 40–90 € (precio ×2–3). Carpooling ConcertRide: 3–22 €/asiento según distancia. Para Mad Cool desde IFEMA, el ahorro es de 50–80 € respecto a un VTC.",
            },
          ] as const).map((faq) => (
            <div key={faq.q} className="border-b border-cr-border pb-6 space-y-2">
              <dt className="font-display text-base uppercase text-cr-text">{faq.q}</dt>
              <dd className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">{faq.a}</dd>
            </div>
          ))}
        </dl>
      </section>

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
