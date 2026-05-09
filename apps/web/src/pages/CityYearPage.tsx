import { useMemo } from "react";
import { Link, Navigate, useParams } from "react-router-dom";
import { ArrowRight, MapPin, Music2, Calendar } from "lucide-react";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";
import { REGION_ISO } from "@/lib/seoConfig";
import { CITY_LANDINGS, CITY_LANDINGS_BY_SLUG } from "@/lib/cityLandings";
import { FESTIVAL_LANDINGS } from "@/lib/festivalLandings";
import { ROUTE_LANDINGS } from "@/lib/routeLandings";

const VALID_YEARS = ["2025", "2026", "2027"] as const;
type ValidYear = (typeof VALID_YEARS)[number];

const PRICE_TABLE: Record<string, { from: string; to: string; price: string }[]> = {
  madrid: [
    { from: "Madrid", to: "Barcelona", price: "14–22 €" },
    { from: "Madrid", to: "Bilbao (BBK Live)", price: "11–16 €" },
    { from: "Madrid", to: "Benicàssim (FIB)", price: "12–18 €" },
    { from: "Madrid", to: "Burriana (Arenal Sound)", price: "12–18 €" },
  ],
  barcelona: [
    { from: "Barcelona", to: "Madrid", price: "14–22 €" },
    { from: "Barcelona", to: "Valencia", price: "8–12 €" },
    { from: "Barcelona", to: "Zaragoza", price: "6–9 €" },
    { from: "Barcelona", to: "Benicàssim (FIB)", price: "5–8 €" },
  ],
  valencia: [
    { from: "Valencia", to: "Burriana (Arenal Sound)", price: "3–5 €" },
    { from: "Valencia", to: "Cullera (Medusa)", price: "3–5 €" },
    { from: "Valencia", to: "Benicàssim (FIB)", price: "4–7 €" },
    { from: "Valencia", to: "Madrid", price: "10–15 €" },
  ],
  sevilla: [
    { from: "Sevilla", to: "Málaga (Cala Mijas)", price: "6–9 €" },
    { from: "Sevilla", to: "Madrid (Mad Cool)", price: "12–18 €" },
    { from: "Sevilla", to: "Granada", price: "4–7 €" },
    { from: "Sevilla", to: "Barcelona (Primavera Sound)", price: "18–25 €" },
  ],
  bilbao: [
    { from: "Bilbao", to: "San Sebastián (Jazzaldia)", price: "3–5 €" },
    { from: "Bilbao", to: "Vitoria (Azkena Rock)", price: "3–5 €" },
    { from: "Bilbao", to: "Santander", price: "4–7 €" },
    { from: "Bilbao", to: "Madrid", price: "11–16 €" },
  ],
  malaga: [
    { from: "Málaga", to: "Sevilla", price: "6–9 €" },
    { from: "Málaga", to: "Granada", price: "3–5 €" },
    { from: "Málaga", to: "Madrid", price: "12–16 €" },
    { from: "Málaga", to: "Mijas (Cala Mijas)", price: "2–4 €" },
  ],
  zaragoza: [
    { from: "Zaragoza", to: "Madrid (Mad Cool)", price: "9–13 €" },
    { from: "Zaragoza", to: "Barcelona (Primavera Sound)", price: "8–12 €" },
    { from: "Zaragoza", to: "Burriana (Arenal Sound)", price: "8–12 €" },
    { from: "Zaragoza", to: "Lanuza (Pirineos Sur)", price: "5–8 €" },
  ],
  granada: [
    { from: "Granada", to: "Málaga (Cala Mijas)", price: "3–6 €" },
    { from: "Granada", to: "Sevilla (Interestelar)", price: "5–8 €" },
    { from: "Granada", to: "Madrid", price: "10–15 €" },
    { from: "Granada", to: "Barcelona", price: "16–22 €" },
  ],
  donostia: [
    { from: "Donostia", to: "Bilbao (BBK Live)", price: "3–5 €" },
    { from: "Donostia", to: "Vitoria (Azkena Rock)", price: "3–5 €" },
    { from: "Donostia", to: "Pamplona", price: "3–5 €" },
    { from: "Donostia", to: "Madrid", price: "14–20 €" },
  ],
  "santiago-de-compostela": [
    { from: "Santiago", to: "A Coruña", price: "3–5 €" },
    { from: "Santiago", to: "Viveiro (Resurrection Fest)", price: "10–14 €" },
    { from: "Santiago", to: "Vigo", price: "3–5 €" },
    { from: "Santiago", to: "Madrid", price: "20–28 €" },
  ],
  alicante: [
    { from: "Alicante", to: "Benidorm (Low Festival)", price: "3–5 €" },
    { from: "Alicante", to: "Burriana (Arenal Sound)", price: "5–8 €" },
    { from: "Alicante", to: "Albacete (Viña Rock)", price: "5–8 €" },
    { from: "Alicante", to: "Cullera (Medusa)", price: "4–7 €" },
  ],
  pamplona: [
    { from: "Pamplona", to: "Bilbao (BBK Live)", price: "5–8 €" },
    { from: "Pamplona", to: "Vitoria (Azkena Rock)", price: "4–7 €" },
    { from: "Pamplona", to: "Madrid (Mad Cool)", price: "11–16 €" },
    { from: "Pamplona", to: "Zaragoza", price: "4–7 €" },
  ],
  "vitoria-gasteiz": [
    { from: "Vitoria-Gasteiz", to: "Bilbao (BBK Live)", price: "3–6 €" },
    { from: "Vitoria-Gasteiz", to: "Aranda de Duero (Sonorama)", price: "7–11 €" },
    { from: "Vitoria-Gasteiz", to: "Pamplona", price: "3–5 €" },
    { from: "Vitoria-Gasteiz", to: "Madrid", price: "10–15 €" },
  ],
  "a-coruna": [
    { from: "A Coruña", to: "Viveiro (Resurrection Fest)", price: "10–14 €" },
    { from: "A Coruña", to: "Santiago (O Son do Camiño)", price: "3–5 €" },
    { from: "A Coruña", to: "Vigo", price: "5–8 €" },
    { from: "A Coruña", to: "Madrid", price: "22–30 €" },
  ],
  vigo: [
    { from: "Vigo", to: "Santiago (O Son do Camiño)", price: "3–5 €" },
    { from: "Vigo", to: "Viveiro (Resurrection Fest)", price: "12–16 €" },
    { from: "Vigo", to: "A Coruña", price: "5–8 €" },
    { from: "Vigo", to: "Madrid", price: "22–30 €" },
  ],
  murcia: [
    { from: "Murcia", to: "Cullera (Medusa)", price: "8–12 €" },
    { from: "Murcia", to: "Albacete (Viña Rock)", price: "6–9 €" },
    { from: "Murcia", to: "Burriana (Arenal Sound)", price: "10–14 €" },
    { from: "Murcia", to: "Madrid", price: "12–18 €" },
  ],
  valladolid: [
    { from: "Valladolid", to: "Aranda de Duero (Sonorama)", price: "4–7 €" },
    { from: "Valladolid", to: "Madrid (Mad Cool)", price: "8–12 €" },
    { from: "Valladolid", to: "Bilbao (BBK Live)", price: "9–13 €" },
    { from: "Valladolid", to: "Barcelona", price: "14–20 €" },
  ],
};

export default function CityYearPage() {
  const { city: slug, year } = useParams<{ city: string; year: string }>();
  const landing = slug ? CITY_LANDINGS_BY_SLUG[slug] : undefined;

  const isValidYear = (year && (VALID_YEARS as readonly string[]).includes(year)) as boolean;

  const cityFestivals = useMemo(
    () => (landing ? FESTIVAL_LANDINGS.filter((f) => f.citySlug === landing.slug) : []),
    [landing],
  );

  const routesFromCity = useMemo(
    () => (landing ? ROUTE_LANDINGS.filter((r) => r.originCitySlug === landing.slug) : []),
    [landing],
  );

  const priceRows = useMemo(
    () => (landing ? (PRICE_TABLE[landing.slug] ?? []) : []),
    [landing],
  );

  const y = (isValidYear ? year : "2026") as ValidYear;

  // Hook must be called unconditionally before any early returns
  useSeoMeta({
    title: landing
      ? `Conciertos ${landing.display} ${y}: festivales y carpooling | ConcertRide`
      : "Conciertos por ciudad y año",
    description: landing
      ? `Próximos conciertos en ${landing.display} ${y}. ${landing.venues.slice(0, 2).join(", ")}. Carpooling sin comisión desde 3 €/asiento con ConcertRide. Conductores verificados.`
      : "Conciertos en España por ciudad y año.",
    canonical: landing
      ? `${SITE_URL}/conciertos/${slug}/${y}`
      : `${SITE_URL}/concerts`,
    keywords: landing
      ? `conciertos ${landing.display} ${y}, conciertos en ${landing.display} ${y}, conciertos ${landing.city} ${y}, festivales ${landing.display} ${y}, agenda musical ${landing.display} ${y}, próximos conciertos ${landing.display} ${y}, carpooling ${landing.display} ${y}, coche compartido concierto ${landing.display}, cómo ir a conciertos ${landing.display} ${y}, viaje compartido ${landing.display} ${y}, conciertos ${landing.display.toLowerCase()} ${y}`
      : undefined,
    geoRegion: landing ? (REGION_ISO[landing.region] ?? undefined) : undefined,
    geoPlacename: landing ? `${landing.display}, España` : undefined,
    geoLat: landing?.lat,
    geoLng: landing?.lng,
  });

  // Guard: invalid city → /concerts, invalid year → /conciertos/:city
  if (!slug || !landing) return <Navigate to="/concerts" replace />;
  if (!isValidYear) return <Navigate to={`/conciertos/${slug}`} replace />;

  const otherYears = (VALID_YEARS as readonly string[]).filter((vy) => vy !== y);

  return (
    <main id="main" className="min-h-dvh bg-cr-bg text-cr-text pt-14">
      {/* ── JSON-LD: BreadcrumbList ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
              { "@type": "ListItem", position: 2, name: "Conciertos", item: `${SITE_URL}/concerts` },
              {
                "@type": "ListItem",
                position: 3,
                name: `Conciertos en ${landing.display}`,
                item: `${SITE_URL}/conciertos/${landing.slug}`,
              },
              {
                "@type": "ListItem",
                position: 4,
                name: `Conciertos ${landing.display} ${y}`,
                item: `${SITE_URL}/conciertos/${landing.slug}/${y}`,
              },
            ],
          }),
        }}
      />

      {/* ── JSON-LD: CollectionPage ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: `Conciertos en ${landing.display} ${y}`,
            url: `${SITE_URL}/conciertos/${landing.slug}/${y}`,
            inLanguage: "es-ES",
            dateModified: new Date().toISOString().slice(0, 10),
            description: `Agenda de conciertos y festivales en ${landing.display} para el año ${y}. ${landing.venues.slice(0, 3).join(", ")}.`,
            about: {
              "@type": "Place",
              name: landing.display,
              address: {
                "@type": "PostalAddress",
                addressLocality: landing.display,
                addressRegion: landing.region,
                addressCountry: "ES",
              },
            },
            isPartOf: {
              "@type": "WebSite",
              "@id": `${SITE_URL}/#website`,
              name: "ConcertRide",
              url: SITE_URL,
            },
          }),
        }}
      />

      {/* ── JSON-LD: LocalBusiness ── */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            "@id": `${SITE_URL}/conciertos/${landing.slug}/${y}#localbusiness`,
            name: `ConcertRide · Carpooling para conciertos en ${landing.display} ${y}`,
            description: `Carpooling para conciertos y festivales en ${landing.display} en ${y}. Sin comisión, conductores verificados.`,
            url: `${SITE_URL}/conciertos/${landing.slug}/${y}`,
            logo: `${SITE_URL}/favicon.svg`,
            image: `${SITE_URL}/og/home.png`,
            priceRange: "€3–€35",
            currenciesAccepted: "EUR",
            paymentAccepted: "Cash, Bizum",
            geo: {
              "@type": "GeoCoordinates",
              latitude: landing.lat,
              longitude: landing.lng,
            },
            address: {
              "@type": "PostalAddress",
              addressLocality: landing.display,
              addressRegion: landing.region,
              addressCountry: "ES",
            },
            sameAs: [
              "https://twitter.com/concertride_es",
              "https://www.instagram.com/concertride_es/",
            ],
          }),
        }}
      />

      {/* ── Hero ── */}
      <div className="max-w-6xl mx-auto px-6 pt-10 pb-6 space-y-4">
        <nav
          aria-label="Breadcrumb"
          className="font-mono text-[11px] text-cr-text-dim flex items-center gap-2 flex-wrap"
        >
          <Link to="/" className="hover:text-cr-primary">Inicio</Link>
          <span aria-hidden="true">/</span>
          <Link to="/concerts" className="hover:text-cr-primary">Conciertos</Link>
          <span aria-hidden="true">/</span>
          <Link to={`/conciertos/${landing.slug}`} className="hover:text-cr-primary">
            {landing.display}
          </Link>
          <span aria-hidden="true">/</span>
          <span className="text-cr-text-muted">{y}</span>
        </nav>

        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary inline-flex items-center gap-2">
          <MapPin size={12} /> {landing.region}
        </p>
        <h1 className="font-display text-4xl md:text-6xl uppercase leading-[0.92]">
          Conciertos en {landing.display} {y}.
        </h1>
        <p className="font-sans text-sm md:text-base text-cr-text-muted max-w-2xl leading-relaxed speakable">
          {landing.blurb}
        </p>

        {landing.venues.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-2">
            {landing.venues.map((v) => (
              <span
                key={v}
                className="inline-flex items-center gap-1.5 font-mono text-[11px] text-cr-text-muted border border-cr-border px-2 py-1"
              >
                <Music2 size={10} /> {v}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* ── Year navigation ── */}
      <div className="max-w-6xl mx-auto px-6 pb-8">
        <div className="flex items-center gap-3 flex-wrap">
          <span className="font-mono text-[11px] text-cr-text-dim uppercase tracking-[0.12em] flex items-center gap-1.5">
            <Calendar size={11} /> Año:
          </span>
          {(VALID_YEARS as readonly string[]).map((vy) => (
            <Link
              key={vy}
              to={`/conciertos/${landing.slug}/${vy}`}
              className={`font-mono text-[11px] uppercase tracking-[0.12em] px-3 py-1 border transition-colors ${
                vy === y
                  ? "border-cr-primary text-cr-primary bg-cr-primary/10 font-semibold"
                  : "border-cr-border text-cr-text-muted hover:border-cr-primary hover:text-cr-primary"
              }`}
            >
              {vy}
            </Link>
          ))}
          <Link
            to={`/conciertos/${landing.slug}`}
            className="font-mono text-[11px] uppercase tracking-[0.12em] text-cr-text-dim hover:text-cr-primary transition-colors ml-auto"
          >
            Ver todos →
          </Link>
        </div>
      </div>

      {/* ── Venues section ── */}
      <section className="max-w-6xl mx-auto px-6 pb-12 border-t border-cr-border pt-10">
        <h2 className="font-display text-xl md:text-2xl uppercase mb-6">
          Principales recintos en {landing.display}
        </h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {landing.venues.map((v) => (
            <div
              key={v}
              className="border border-cr-border p-4 space-y-1 hover:border-cr-primary/50 transition-colors"
            >
              <p className="font-display text-sm uppercase text-cr-text leading-tight">{v}</p>
              <p className="font-mono text-[10px] text-cr-text-dim uppercase tracking-[0.12em]">
                {landing.display} — {landing.region}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Related festivals ── */}
      {cityFestivals.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pb-12 border-t border-cr-border pt-10">
          <h2 className="font-display text-xl md:text-2xl uppercase mb-6">
            Festivales en {landing.display} {y}
          </h2>
          <p className="font-sans text-sm text-cr-text-muted mb-4 max-w-2xl">
            Estos festivales se celebran en {landing.display} o en su área metropolitana. Carpooling disponible desde toda España.
          </p>
          <ul className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {cityFestivals.map((f) => (
              <li key={f.slug}>
                <Link
                  to={`/festivales/${f.slug}`}
                  className="group flex flex-col p-4 border border-cr-border hover:border-cr-primary transition-colors space-y-1"
                >
                  <span className="font-display text-sm uppercase text-cr-text group-hover:text-cr-primary transition-colors leading-tight">
                    {f.shortName}
                  </span>
                  <span className="font-mono text-[10px] text-cr-text-dim uppercase tracking-[0.12em]">
                    Cómo llegar →
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ── Carpooling price table ── */}
      {priceRows.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pb-12 border-t border-cr-border pt-10">
          <h2 className="font-display text-xl md:text-2xl uppercase mb-6">
            Precios carpooling desde {landing.display} — {y}
          </h2>
          <p className="font-sans text-sm text-cr-text-muted mb-4 max-w-2xl">
            Precios medios orientativos para viajes compartidos desde {landing.display} a festivales y ciudades. Sin comisión — solo coste de combustible y peajes dividido entre plazas.
          </p>
          <div className="overflow-x-auto">
            <table className="w-full border border-cr-border font-sans text-sm">
              <thead>
                <tr className="border-b border-cr-border bg-cr-bg">
                  <th className="text-left px-4 py-2 font-semibold text-cr-text-muted uppercase tracking-[0.1em] text-[11px]">
                    Origen
                  </th>
                  <th className="text-left px-4 py-2 font-semibold text-cr-text-muted uppercase tracking-[0.1em] text-[11px]">
                    Destino
                  </th>
                  <th className="text-right px-4 py-2 font-semibold text-cr-primary uppercase tracking-[0.1em] text-[11px]">
                    Precio / plaza
                  </th>
                </tr>
              </thead>
              <tbody>
                {priceRows.map((row, i) => (
                  <tr
                    key={i}
                    className="border-b border-cr-border last:border-0 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-4 py-3 text-cr-text-muted">{row.from}</td>
                    <td className="px-4 py-3 text-cr-text">{row.to}</td>
                    <td className="px-4 py-3 text-right font-mono text-cr-primary">{row.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="font-mono text-[10px] text-cr-text-dim mt-2 uppercase tracking-[0.1em]">
            * Precios estimados. El conductor fija el precio final al publicar el viaje.
          </p>
        </section>
      )}

      {/* ── Carpooling routes from this city ── */}
      {routesFromCity.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 pb-12 border-t border-cr-border pt-10">
          <h2 className="font-display text-lg uppercase text-cr-text-muted mb-4">
            Rutas de carpooling desde {landing.display} a festivales
          </h2>
          <ul className="flex flex-wrap gap-2">
            {routesFromCity.map((r) => (
              <li key={r.slug}>
                <Link
                  to={`/rutas/${r.slug}`}
                  className="inline-flex items-center gap-1.5 font-sans text-xs text-cr-text-muted hover:text-cr-primary border border-cr-border hover:border-cr-primary px-3 py-1.5 transition-colors"
                >
                  {landing.display} → {r.festival.shortName}
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* ── How carpooling works ── */}
      <section className="max-w-6xl mx-auto px-6 pb-24 border-t border-cr-border pt-12 space-y-6">
        <h2 className="font-display text-xl md:text-2xl uppercase">
          Cómo ir a un concierto en {landing.display} {y}
        </h2>
        <div className="grid md:grid-cols-3 gap-4 font-sans text-sm text-cr-text-muted leading-relaxed">
          <article className="space-y-2">
            <h3 className="font-display text-base uppercase text-cr-primary">1. Busca el concierto</h3>
            <p>
              Encuentra el evento al que vas en ConcertRide. Cada ficha muestra cuántos viajes
              compartidos están ya publicados desde distintas ciudades de España hacia {landing.display}.
            </p>
          </article>
          <article className="space-y-2">
            <h3 className="font-display text-base uppercase text-cr-primary">2. Elige un viaje</h3>
            <p>
              Revisa precio por plaza, vibe (party/chill/mixed) y la valoración del conductor.
              Puedes ver qué otros pasajeros ya están confirmados antes de unirte.
            </p>
          </article>
          <article className="space-y-2">
            <h3 className="font-display text-base uppercase text-cr-primary">3. Llega juntos</h3>
            <p>
              Pagas al conductor en efectivo o Bizum el día del viaje. Recibes un recordatorio
              24h antes con la hora y el punto de encuentro en {landing.display}.
            </p>
          </article>
        </div>

        <div className="pt-6 flex flex-wrap gap-4 border-t border-cr-border">
          <Link
            to={`/conciertos/${landing.slug}`}
            className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-cr-text-muted hover:text-cr-primary transition-colors"
          >
            Todos los conciertos en {landing.display} <ArrowRight size={12} />
          </Link>
          <Link
            to="/concerts"
            className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-cr-text-muted hover:text-cr-primary transition-colors"
          >
            Ver todos los conciertos <ArrowRight size={12} />
          </Link>
          <Link
            to="/festivales"
            className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-cr-text-muted hover:text-cr-primary transition-colors ml-auto"
          >
            Festivales <ArrowRight size={12} />
          </Link>
        </div>
      </section>

      {/* ── Other years ── */}
      <section className="max-w-6xl mx-auto px-6 pb-12 border-t border-cr-border pt-10">
        <h2 className="font-display text-lg uppercase text-cr-text-muted mb-4">
          Otros años — conciertos en {landing.display}
        </h2>
        <ul className="flex flex-wrap gap-2">
          {otherYears.map((vy) => (
            <li key={vy}>
              <Link
                to={`/conciertos/${landing.slug}/${vy}`}
                className="inline-flex items-center gap-1.5 font-sans text-xs text-cr-text-muted hover:text-cr-primary border border-cr-border hover:border-cr-primary px-3 py-1.5 transition-colors"
              >
                Conciertos {landing.display} {vy}
              </Link>
            </li>
          ))}
          <li>
            <Link
              to={`/conciertos/${landing.slug}`}
              className="inline-flex items-center gap-1.5 font-sans text-xs text-cr-text-muted hover:text-cr-primary border border-cr-border hover:border-cr-primary px-3 py-1.5 transition-colors"
            >
              Todos los años →
            </Link>
          </li>
        </ul>
      </section>

      {/* ── Other cities hub ── */}
      <section className="max-w-6xl mx-auto px-6 pb-24 border-t border-cr-border pt-10">
        <h2 className="font-display text-lg uppercase text-cr-text-muted mb-4">
          Otras ciudades — conciertos {y}
        </h2>
        <ul className="flex flex-wrap gap-2">
          {CITY_LANDINGS.filter((c) => c.slug !== landing.slug).map((c) => (
            <li key={c.slug}>
              <Link
                to={`/conciertos/${c.slug}/${y}`}
                className="inline-flex items-center gap-1.5 font-sans text-xs text-cr-text-muted hover:text-cr-primary border border-cr-border hover:border-cr-primary px-3 py-1.5 transition-colors"
              >
                {c.display} {y}
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
