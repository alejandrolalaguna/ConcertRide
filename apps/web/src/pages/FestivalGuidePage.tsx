import { useState } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import {
  ArrowLeft, CheckSquare, Square, Package, MapPin,
  Signal, AlertTriangle, Car, ChevronRight, ExternalLink
} from "lucide-react";
import { FESTIVAL_LANDINGS_BY_SLUG } from "@/lib/festivalLandings";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";

const CATEGORY_LABEL: Record<string, string> = {
  esencial: "Imprescindible",
  comodidad: "Comodidad",
  opcional: "Opcional",
};
const CATEGORY_COLOR: Record<string, string> = {
  esencial: "text-red-400 border-red-400/30 bg-red-400/5",
  comodidad: "text-yellow-400 border-yellow-400/30 bg-yellow-400/5",
  opcional: "text-blue-400 border-blue-400/30 bg-blue-400/5",
};

export default function FestivalGuidePage() {
  const { festival: slug } = useParams<{ festival: string }>();
  const festival = slug ? FESTIVAL_LANDINGS_BY_SLUG[slug] : undefined;

  const [checked, setChecked] = useState<Set<number>>(new Set());
  const toggle = (i: number) =>
    setChecked((prev) => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });

  if (!slug || !festival) return <Navigate to="/festivales" replace />;

  const guide = festival.guide;
  const festYear = new Date(festival.startDate).getFullYear();

  useSeoMeta({
    title: `Guía ${festival.shortName} ${festYear}: qué llevar · ConcertRide`,
    description: `Guía completa para ${festival.name} ${festYear}. Qué llevar al festival, logística del recinto, acampada, transporte y consejos de veteranos. ${festival.venue}, ${festival.city}.`,
    canonical: `${SITE_URL}/festivales/${slug}/guia`,
    keywords: `guia ${festival.shortName}, que llevar ${festival.shortName}, ${festival.shortName} lista, como prepararse ${festival.shortName}, ${festival.shortName} acampada, ${festival.shortName} consejos, lista que llevar festival`,
    ogImageAlt: `Guía completa ${festival.shortName} ${festYear}: qué llevar, transporte y carpooling · ConcertRide`,
    geoLat: festival.lat,
    geoLng: festival.lng,
    geoPlacename: `${festival.city}, España`,
  });

  const packingList = guide?.packing_list ?? [
    { item: "Protector solar FPS 50+", category: "esencial" as const },
    { item: "Calzado cómodo", category: "esencial" as const },
    { item: "Tapones para los oídos", category: "esencial" as const },
    { item: "Botella de agua reutilizable", category: "esencial" as const },
    { item: "Powerbank", category: "comodidad" as const },
    { item: "Efectivo / Bizum para el carpooling", category: "esencial" as const },
    { item: "DNI / pasaporte", category: "esencial" as const },
    { item: "Impermeable ligero", category: "opcional" as const },
  ];

  const jsonLdHowTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: `Cómo prepararse para ${festival.name} ${festYear}`,
    description: `Guía paso a paso para ir a ${festival.name}: qué llevar, cómo llegar a ${festival.venue} en ${festival.city}, logística del recinto y consejos prácticos.`,
    totalTime: "PT30M",
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Organiza el transporte",
        text: `Reserva tu carpooling en ConcertRide con antelación. ${festival.originCities[0] ? `Desde ${festival.originCities[0].city} el precio es ${festival.originCities[0].concertRideRange}/asiento.` : ""} El transporte en madrugada es el mayor problema logístico.`,
        url: `${SITE_URL}/festivales/${slug}`,
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Prepara tu mochila",
        text: `Imprescindibles: protector solar, tapones, botella reutilizable y powerbank. ${guide?.logistics.camping_available ? "Si vas al camping, añade tienda de campaña y saco de dormir." : ""}`,
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Planifica las actuaciones",
        text: "Descarga la app oficial del festival y marca las actuaciones que no te puedes perder. Ten en cuenta la distancia entre escenarios.",
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "El día del festival",
        text: `El recinto abre a las ${guide?.logistics.gates_open ?? "15:00"}. Llega con 30 min de antelación a las actuaciones principales para pillar buen sitio.`,
      },
    ],
  };

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Festivales", item: `${SITE_URL}/festivales` },
      { "@type": "ListItem", position: 3, name: festival.name, item: `${SITE_URL}/festivales/${slug}` },
      { "@type": "ListItem", position: 4, name: `Guía ${festival.shortName} ${festYear}`, item: `${SITE_URL}/festivales/${slug}/guia` },
    ],
  };

  const jsonLdItemList = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `Lista de cosas que llevar a ${festival.shortName}`,
    description: `Qué llevar a ${festival.name} ${festYear} en ${festival.city}. Lista completa con imprescindibles, comodidad y opcionales.`,
    numberOfItems: packingList.length,
    itemListElement: packingList.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.item,
      description: item.notes ?? CATEGORY_LABEL[item.category],
    })),
  };

  const esenciales = packingList.filter((p) => p.category === "esencial");
  const comodidad = packingList.filter((p) => p.category === "comodidad");
  const opcionales = packingList.filter((p) => p.category === "opcional");

  return (
    <main className="min-h-dvh bg-cr-bg text-cr-text pt-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdHowTo) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdItemList) }} />

      <div className="max-w-4xl mx-auto px-6 pt-10 pb-20 space-y-12">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs font-mono text-cr-text-muted flex-wrap">
          <Link to="/" className="hover:text-cr-primary">Inicio</Link>
          <ChevronRight size={10} />
          <Link to="/festivales" className="hover:text-cr-primary">Festivales</Link>
          <ChevronRight size={10} />
          <Link to={`/festivales/${slug}`} className="hover:text-cr-primary">{festival.shortName}</Link>
          <ChevronRight size={10} />
          <span className="text-cr-text">Guía</span>
        </nav>

        {/* Hero */}
        <div className="space-y-3">
          <Link
            to={`/festivales/${slug}`}
            className="inline-flex items-center gap-1.5 text-xs text-cr-text-muted hover:text-cr-primary transition-colors"
          >
            <ArrowLeft size={12} /> Volver a {festival.shortName}
          </Link>
          <h1 className="font-display text-3xl md:text-5xl uppercase leading-none">
            Guía {festival.shortName} {festYear}
          </h1>
          <p className="text-cr-text-muted text-sm max-w-2xl">
            Todo lo que necesitas saber para ir a {festival.name}: qué llevar, cómo llegar a{" "}
            <strong className="text-cr-text">{festival.venue}</strong> en {festival.city},
            logística del recinto y consejos de veteranos.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            <span className="font-mono text-[10px] border border-cr-border px-2 py-1 text-cr-text-muted">
              <MapPin size={9} className="inline mr-1" />{festival.venueAddress}
            </span>
            <span className="font-mono text-[10px] border border-cr-border px-2 py-1 text-cr-text-muted">
              {festival.typicalDates}
            </span>
          </div>
        </div>

        {/* Logística */}
        {guide && (
          <section className="space-y-4">
            <h2 className="font-display text-2xl uppercase">Logística del recinto</h2>
            <div className="grid sm:grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl border border-white/10 bg-white/3 p-4 space-y-1">
                <p className="text-cr-text-muted text-xs uppercase tracking-wide font-mono">Apertura de puertas</p>
                <p className="font-semibold text-cr-text text-lg">{guide.logistics.gates_open}</p>
                {guide.logistics.last_entry && (
                  <p className="text-xs text-cr-text-muted">Última entrada: {guide.logistics.last_entry}</p>
                )}
              </div>
              <div className="rounded-xl border border-white/10 bg-white/3 p-4 space-y-1">
                <p className="text-cr-text-muted text-xs uppercase tracking-wide font-mono">Parking</p>
                <p className="font-semibold text-cr-text">
                  {guide.logistics.parking_available ? "Disponible" : "No disponible"}
                  {guide.logistics.parking_price && ` · ${guide.logistics.parking_price}`}
                </p>
              </div>
              <div className={`rounded-xl border p-4 space-y-1 col-span-full sm:col-span-${guide.logistics.camping_available ? "1" : "2"}`}>
                <p className="text-cr-text-muted text-xs uppercase tracking-wide font-mono">Acampada</p>
                <p className="font-semibold text-cr-text">
                  {guide.logistics.camping_available ? "✓ Disponible" : "✗ No disponible"}
                </p>
                {guide.logistics.camping_notes && (
                  <p className="text-xs text-cr-text-muted">{guide.logistics.camping_notes}</p>
                )}
              </div>
              {guide.emergency_number && (
                <div className="rounded-xl border border-red-400/20 bg-red-400/5 p-4 space-y-1">
                  <p className="text-red-400 text-xs uppercase tracking-wide font-mono flex items-center gap-1">
                    <AlertTriangle size={11} /> Emergencias
                  </p>
                  <p className="font-bold text-red-400 text-xl">{guide.emergency_number}</p>
                  <p className="text-xs text-cr-text-muted">Número de emergencias España</p>
                </div>
              )}
            </div>
          </section>
        )}

        {/* Qué llevar — checklist interactivo */}
        <section className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-2xl uppercase">Qué llevar a {festival.shortName}</h2>
            {checked.size > 0 && (
              <span className="font-mono text-xs text-cr-primary">
                {checked.size}/{packingList.length} listos
              </span>
            )}
          </div>
          <p className="text-sm text-cr-text-muted">Marca los items mientras preparas tu mochila. Se guarda en el navegador.</p>

          {[
            { items: esenciales, startIdx: 0, label: "Imprescindibles" },
            { items: comodidad, startIdx: esenciales.length, label: "Comodidad" },
            { items: opcionales, startIdx: esenciales.length + comodidad.length, label: "Opcionales" },
          ].map(({ items, startIdx, label }) =>
            items.length === 0 ? null : (
              <div key={label} className="space-y-2">
                <h3 className="text-xs font-mono uppercase tracking-wide text-cr-text-muted">{label}</h3>
                <ul className="space-y-1.5">
                  {items.map((item, localIdx) => {
                    const globalIdx = startIdx + localIdx;
                    const done = checked.has(globalIdx);
                    return (
                      <li key={globalIdx}>
                        <button
                          onClick={() => toggle(globalIdx)}
                          className={`w-full flex items-start gap-3 rounded-xl border p-3 text-left transition-all ${
                            done
                              ? "border-cr-primary/30 bg-cr-primary/5 opacity-60"
                              : "border-white/10 bg-white/3 hover:border-white/20"
                          }`}
                        >
                          {done ? (
                            <CheckSquare size={16} className="text-cr-primary shrink-0 mt-0.5" />
                          ) : (
                            <Square size={16} className="text-cr-text-muted shrink-0 mt-0.5" />
                          )}
                          <div className="min-w-0">
                            <span className={`text-sm font-medium ${done ? "line-through text-cr-text-muted" : "text-cr-text"}`}>
                              {item.item}
                            </span>
                            {item.notes && (
                              <p className="text-xs text-cr-text-muted mt-0.5">{item.notes}</p>
                            )}
                          </div>
                          <span className={`ml-auto shrink-0 text-[10px] border rounded-full px-2 py-0.5 ${CATEGORY_COLOR[item.category]}`}>
                            {CATEGORY_LABEL[item.category]}
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )
          )}
        </section>

        {/* Consejos del recinto */}
        {guide?.venue_tips && guide.venue_tips.length > 0 && (
          <section className="space-y-4">
            <h2 className="font-display text-2xl uppercase">Consejos del recinto</h2>
            <ul className="space-y-3">
              {guide.venue_tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-cr-text-muted">
                  <span className="shrink-0 font-mono text-cr-primary text-xs mt-0.5">{String(i + 1).padStart(2, "0")}</span>
                  {tip}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Cobertura móvil */}
        {guide?.network_coverage && (
          <section className="rounded-xl border border-white/10 bg-white/3 p-5 flex gap-3">
            <Signal className="text-cr-primary shrink-0 mt-0.5" size={18} />
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-cr-text">Cobertura móvil</h3>
              <p className="text-sm text-cr-text-muted">{guide.network_coverage}</p>
            </div>
          </section>
        )}

        {/* CTA transporte */}
        <section className="rounded-2xl border border-cr-primary/30 bg-cr-primary/5 p-6 space-y-4">
          <div className="flex items-start gap-3">
            <Car className="text-cr-primary shrink-0 mt-0.5" size={20} />
            <div>
              <h2 className="font-display text-xl uppercase">Organiza el transporte</h2>
              <p className="text-sm text-cr-text-muted mt-1">
                La logística de ir y volver es el mayor reto de un festival.
                ConcertRide conecta conductores y pasajeros desde{" "}
                {festival.originCities[0]?.concertRideRange ?? "3 €"}/asiento, sin comisión.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link
              to={`/festivales/${slug}`}
              className="inline-flex items-center gap-2 rounded-xl bg-cr-primary px-5 py-2.5 text-sm font-bold text-black hover:bg-cr-primary/90 transition-colors"
            >
              Ver opciones de transporte <ChevronRight size={14} />
            </Link>
            <Link
              to="/concerts"
              className="inline-flex items-center gap-2 rounded-xl border border-cr-primary/40 px-5 py-2.5 text-sm font-medium text-cr-primary hover:bg-cr-primary/5 transition-colors"
            >
              Buscar viaje compartido <ExternalLink size={14} />
            </Link>
          </div>
        </section>

        {/* Festivales sin guía: CTA genérico */}
        {!guide && (
          <div className="rounded-xl border border-white/10 bg-white/3 p-6 text-center space-y-2">
            <Package className="text-cr-text-muted mx-auto" size={24} />
            <p className="text-sm text-cr-text-muted">
              La guía detallada de {festival.shortName} estará disponible próximamente.
            </p>
            <Link
              to={`/festivales/${slug}`}
              className="inline-flex items-center gap-1 text-sm text-cr-primary hover:underline"
            >
              <ArrowLeft size={12} /> Ver info de transporte
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}
