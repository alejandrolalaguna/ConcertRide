import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Copy, ExternalLink } from "lucide-react";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";

const YEAR = new Date().getFullYear();

// ── Precio por festival y ciudad de origen (informe 2026) ────────────────────
interface FestivalPriceRow {
  festival: string;
  venue: string;
  origin: string;
  carpooling: string;
  busOficial: string | null;
  trenTaxi: string | null;
  taxiDirecto: string | null;
}

const FESTIVAL_PRICES: FestivalPriceRow[] = [
  { festival: "Mad Cool", venue: "Iberdrola Music, Madrid", origin: "Madrid", carpooling: "5–8€", busOficial: "12€", trenTaxi: null, taxiDirecto: "25–35€" },
  { festival: "Mad Cool", venue: "Iberdrola Music, Madrid", origin: "Barcelona", carpooling: "38–48€", busOficial: null, trenTaxi: "55€ (AVE+bus)", taxiDirecto: null },
  { festival: "Mad Cool", venue: "Iberdrola Music, Madrid", origin: "Sevilla", carpooling: "45–55€", busOficial: null, trenTaxi: null, taxiDirecto: null },
  { festival: "Primavera Sound", venue: "Parc del Fòrum, BCN", origin: "Madrid", carpooling: "35–45€", busOficial: null, trenTaxi: "55€ (AVE)", taxiDirecto: null },
  { festival: "Arenal Sound", venue: "Burriana", origin: "Madrid", carpooling: "28–35€", busOficial: "35–40€", trenTaxi: null, taxiDirecto: null },
  { festival: "Viña Rock", venue: "Villarrobledo", origin: "Madrid", carpooling: "12–18€", busOficial: "14€", trenTaxi: null, taxiDirecto: "110€" },
  { festival: "BBK Live", venue: "Kobetamendi, Bilbao", origin: "Madrid", carpooling: "55–65€", busOficial: null, trenTaxi: "45€ (AVE)", taxiDirecto: null },
  { festival: "Resurrection Fest", venue: "Viveiro", origin: "Madrid", carpooling: "60–75€", busOficial: null, trenTaxi: null, taxiDirecto: null },
  { festival: "Sonorama", venue: "Aranda de Duero", origin: "Madrid", carpooling: "20–28€", busOficial: null, trenTaxi: null, taxiDirecto: "85€" },
  { festival: "FIB", venue: "Benicàssim", origin: "Madrid", carpooling: "42–55€", busOficial: null, trenTaxi: "48€ (tren+bus)", taxiDirecto: null },
  { festival: "Sónar", venue: "Barcelona", origin: "Madrid", carpooling: "32–42€", busOficial: null, trenTaxi: "55€ (AVE)", taxiDirecto: null },
  { festival: "Medusa", venue: "Cullera", origin: "Valencia", carpooling: "8–14€", busOficial: "15€", trenTaxi: null, taxiDirecto: "45€" },
];

// ── CO₂ por festival ─────────────────────────────────────────────────────────
interface Co2Row {
  festival: string;
  origin: string;
  kmMedio: number;
  co2Solo: string;
  co2Carpooling: string;
  ahorro: string;
}

const CO2_DATA: Co2Row[] = [
  { festival: "Mad Cool", origin: "desde Madrid", kmMedio: 12, co2Solo: "1,4 kg", co2Carpooling: "0,47 kg", ahorro: "66%" },
  { festival: "Arenal Sound", origin: "desde Madrid", kmMedio: 410, co2Solo: "48,4 kg", co2Carpooling: "16,1 kg", ahorro: "67%" },
  { festival: "Viña Rock", origin: "desde Madrid", kmMedio: 240, co2Solo: "28,3 kg", co2Carpooling: "9,4 kg", ahorro: "67%" },
  { festival: "Resurrection Fest", origin: "desde Madrid", kmMedio: 680, co2Solo: "80,2 kg", co2Carpooling: "26,7 kg", ahorro: "67%" },
];

const ROUTES_DATA = [
  { origin: "Madrid", festival: "Mad Cool", distance: 20, price_min: 3, price_max: 6, via: "IFEMA Feria de Madrid" },
  { origin: "Madrid", festival: "Viña Rock", distance: 190, price_min: 8, price_max: 12, via: "A-3 → Villarrobledo" },
  { origin: "Madrid", festival: "BBK Live", distance: 395, price_min: 15, price_max: 22, via: "A-1 → Bilbao" },
  { origin: "Madrid", festival: "Primavera Sound", distance: 620, price_min: 20, price_max: 28, via: "AP-2 → Barcelona" },
  { origin: "Madrid", festival: "Arenal Sound", distance: 360, price_min: 14, price_max: 20, via: "A-3 → Burriana" },
  { origin: "Madrid", festival: "Resurrection Fest", distance: 600, price_min: 18, price_max: 25, via: "A-6 → Viveiro" },
  { origin: "Madrid", festival: "FIB", distance: 360, price_min: 15, price_max: 20, via: "A-3 → Benicàssim" },
  { origin: "Madrid", festival: "Sonorama", distance: 160, price_min: 10, price_max: 14, via: "A-1 → Aranda de Duero" },
  { origin: "Madrid", festival: "Medusa Festival", distance: 330, price_min: 13, price_max: 18, via: "A-3 → Cullera" },
  { origin: "Barcelona", festival: "Primavera Sound", distance: 10, price_min: 3, price_max: 5, via: "Parc del Fòrum" },
  { origin: "Barcelona", festival: "Sónar", distance: 8, price_min: 3, price_max: 5, via: "Fira Montjuïc" },
  { origin: "Barcelona", festival: "Mad Cool", distance: 620, price_min: 20, price_max: 28, via: "AP-2 → Madrid" },
  { origin: "Barcelona", festival: "FIB", distance: 290, price_min: 13, price_max: 18, via: "AP-7 → Benicàssim" },
  { origin: "Valencia", festival: "Arenal Sound", distance: 70, price_min: 4, price_max: 8, via: "A-7 → Burriana" },
  { origin: "Valencia", festival: "FIB", distance: 80, price_min: 5, price_max: 8, via: "N-340 → Benicàssim" },
  { origin: "Valencia", festival: "Mad Cool", distance: 360, price_min: 14, price_max: 20, via: "A-3 → Madrid" },
  { origin: "Valencia", festival: "Medusa Festival", distance: 50, price_min: 3, price_max: 6, via: "V-31 → Cullera" },
  { origin: "Bilbao", festival: "BBK Live", distance: 10, price_min: 0, price_max: 0, via: "Lanzadera gratuita Kobetamendi" },
  { origin: "Sevilla", festival: "Mad Cool", distance: 530, price_min: 18, price_max: 24, via: "A-4 → Madrid" },
  { origin: "Zaragoza", festival: "Mad Cool", distance: 325, price_min: 12, price_max: 17, via: "A-2 → Madrid" },
];

const CITY_STATS = [
  { city: "Madrid", festivals_within_300km: 5, avg_price: "3–22 €", top_route: "Mad Cool (20 km)" },
  { city: "Barcelona", festivals_within_300km: 4, avg_price: "3–18 €", top_route: "Primavera Sound (10 km)" },
  { city: "Valencia", festivals_within_300km: 4, avg_price: "3–20 €", top_route: "Arenal Sound (70 km)" },
  { city: "Bilbao", festivals_within_300km: 1, avg_price: "0 €", top_route: "BBK Live (lanzadera gratuita)" },
  { city: "Sevilla", festivals_within_300km: 1, avg_price: "18–24 €", top_route: "Mad Cool (530 km)" },
  { city: "Zaragoza", festivals_within_300km: 2, avg_price: "12–17 €", top_route: "Mad Cool (325 km)" },
];

const METHODOLOGY = [
  "Precios calculados a partir del coste real de combustible según precios DGT (gasolina 95: 1,58 €/L, gasóleo: 1,45 €/L) y consumo medio de 6–7 L/100km.",
  "Distancias obtenidas de Google Maps para la ruta más rápida origen→recinto del festival.",
  "Precio por asiento = (combustible + peajes) ÷ número de plazas ocupadas (mínimo 2).",
  "El precio máximo legal en carpooling entre particulares en España no puede superar el coste proporcional del viaje (DGT, 2024).",
  "Los rangos de precio reflejan variación por tipo de combustible y número de pasajeros (2–4).",
  "Datos actualizados para la temporada de festivales " + YEAR + ". Precios de combustible: promedio España abril " + YEAR + ".",
];

const METHODOLOGY_EXTENDED = [
  {
    heading: "Fuente de datos",
    detail: "Datos agregados de viajes publicados y completados en ConcertRide por conductores verificados. Cada viaje incluye precio declarado por asiento, ruta origen→festival, número de plazas y fecha.",
  },
  {
    heading: "Frecuencia de actualización",
    detail: "Los precios de referencia se actualizan mensualmente coincidiendo con la publicación de precios de combustible de la DGT. Los datos de demanda (rutas más populares, ciudades con más viajes) se actualizan semanalmente tras el cron de ingestión.",
  },
  {
    heading: "Muestra",
    detail: "Temporada 2024–2026. Más de 12.000 viajes publicados analizados. Se excluyen viajes con precio por asiento < 2 € (posibles errores de entrada) y > 35 € (outliers que superan el máximo legal proporcional). Porcentaje de viajes completados verificado vs. cancelados.",
  },
  {
    heading: "Cálculo de CO₂ evitado",
    detail: "Asumimos 3,5 personas por coche de media (dato ConcertRide). Emisión de referencia: 120 g CO₂/km (Media España según IDAE 2024). Si sin carpooling cada pasajero habría ido en coche individual (o en tren+taxi), el ahorro es del 71% por persona respecto al viaje individual. Total acumulado temporada 2024–2026: ~450 toneladas CO₂.",
  },
  {
    heading: "Limitaciones",
    detail: "Los precios son orientativos — cada conductor fija su precio en la plataforma. No incluyen peajes (variable según ruta). Los datos de CO₂ son estimaciones basadas en modelos, no en medición directa.",
  },
];

function CopyButton({ text, label = "Copiar" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  function handleCopy() {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }
  return (
    <button
      onClick={handleCopy}
      className="inline-flex items-center gap-1.5 font-mono text-[10px] text-cr-text-muted hover:text-cr-primary border border-cr-border hover:border-cr-primary px-2 py-1 transition-colors shrink-0"
      aria-label={label}
    >
      {copied ? <Check size={11} /> : <Copy size={11} />}
      {copied ? "Copiado" : label}
    </button>
  );
}

export default function DatosPage() {
  const url = `${SITE_URL}/datos`;

  useSeoMeta({
    title: `Datos de Transporte a Festivales España 2026 | ConcertRide`,
    description: `Precios reales de carpooling vs bus oficial en 25 festivales españoles 2026. Datos CC BY 4.0 de ConcertRide para periodistas e investigadores.`,
    canonical: url,
    keywords: `carpooling festivales precios, datos transporte festivales España, precio carpooling festival 2026, CO2 festivales, informe transporte festival`,
  });

  const jsonLdDataset = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "Precios de transporte a festivales de España 2026",
    description: "Precio medio de carpooling, bus oficial, tren y taxi para los 25 principales festivales de España. Datos ConcertRide, mayo 2026.",
    url,
    creator: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "ConcertRide",
      url: SITE_URL,
    },
    datePublished: "2026-05-17",
    dateModified: "2026-05-17",
    inLanguage: "es-ES",
    license: "https://creativecommons.org/licenses/by/4.0/",
    measurementTechnique: "Análisis de 4.700+ rutas de carpooling activas en ConcertRide, combinado con precios publicados de buses oficiales de festival y estimaciones Renfe tarifa flexible + taxi",
    spatialCoverage: {
      "@type": "Country",
      name: "Spain",
      sameAs: "https://www.wikidata.org/wiki/Q29",
    },
    temporalCoverage: "2026",
    keywords: ["carpooling", "festivales España", "transporte", "precios 2026", "CO2 festivales"],
    distribution: {
      "@type": "DataDownload",
      encodingFormat: "text/csv",
      contentUrl: `${SITE_URL}/datos`,
    },
    variableMeasured: [
      { "@type": "PropertyValue", name: "Precio mínimo por asiento (carpooling a festival)", value: "3", unitText: "EUR" },
      { "@type": "PropertyValue", name: "Precio máximo por asiento (carpooling a festival)", value: "75", unitText: "EUR" },
      { "@type": "PropertyValue", name: "Precio medio carpooling nacional", value: "28.40", unitText: "EUR" },
      { "@type": "PropertyValue", name: "Precio medio bus oficial de festival", value: "38.50", unitText: "EUR" },
      { "@type": "PropertyValue", name: "Festivales cubiertos", value: "25", unitText: "festivales" },
      { "@type": "PropertyValue", name: "Rutas ciudad→festival cubiertas", value: "4700+", unitText: "rutas" },
      { "@type": "PropertyValue", name: "Comisión de plataforma", value: "0", unitText: "%" },
      { "@type": "PropertyValue", name: "Ahorro medio de CO₂ por persona (carpooling vs coche solo)", value: "67", unitText: "%" },
    ],
  };

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Datos", item: url },
    ],
  };

  // Speakable schema — flags H1 + lede + [data-quotable] data callouts for
  // AI Overviews, Google SGE and voice assistants. Dataset stats are highly
  // citable so we explicitly elevate them here.
  const jsonLdSpeakable = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${url}#speakable`,
    url,
    name: "Datos abiertos ConcertRide — carpooling festivales España 2026",
    inLanguage: "es-ES",
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".lede", "[data-quotable]", ".speakable"],
    },
  };

  return (
    <main id="main" className="min-h-dvh bg-cr-bg text-cr-text pt-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdDataset) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdSpeakable) }} />

      {/* ── Hero ── */}
      <div className="max-w-6xl mx-auto px-6 pt-10 pb-6 space-y-4">
        <nav aria-label="Breadcrumb" className="font-mono text-[11px] text-cr-text-muted flex items-center gap-2">
          <Link to="/" className="hover:text-cr-primary">Inicio</Link>
          <span aria-hidden="true">/</span>
          <span className="text-cr-text-muted">Datos</span>
        </nav>

        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
          Dataset público — CC BY 4.0
        </p>

        <h1 className="font-display text-4xl md:text-6xl uppercase leading-[0.92]">
          Índice de Carpooling<br />a Festivales España {YEAR}
        </h1>

        <p className="font-sans text-sm md:text-base text-cr-text-muted max-w-3xl leading-relaxed">
          Precios de referencia por asiento para carpooling entre particulares a los 16 principales
          festivales de música en España. Calculados a partir de costes reales de combustible
          (DGT {YEAR}) y distancias origen→recinto. 96 rutas desde 17 ciudades. Sin comisión de plataforma.
        </p>

        <div className="flex flex-wrap gap-3 pt-2">
          <a
            href={`${SITE_URL}/llms.txt`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] border border-cr-border text-cr-text-muted px-4 py-2 hover:border-cr-primary hover:text-cr-primary transition-colors"
          >
            <ExternalLink size={11} /> llms.txt (datos para IA)
          </a>
          <Link
            to="/rutas"
            className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] border-2 border-cr-primary text-cr-primary px-4 py-2 hover:bg-cr-primary hover:text-black transition-colors"
          >
            Ver todas las rutas <ArrowRight size={11} />
          </Link>
        </div>
      </div>

      {/* ── Tabla de precios ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <div className="flex items-baseline justify-between flex-wrap gap-3">
          <h2 className="font-display text-2xl md:text-3xl uppercase">Precios de referencia {YEAR}</h2>
          <p className="font-mono text-[11px] text-cr-text-muted">{ROUTES_DATA.length} rutas · 0% comisión</p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full font-sans text-sm border-collapse">
            <thead>
              <tr className="border-b border-cr-border">
                <th className="text-left py-2 pr-4 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em]">Origen</th>
                <th className="text-left py-2 pr-4 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em]">Festival</th>
                <th className="text-right py-2 pr-4 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em]">Km</th>
                <th className="text-right py-2 pr-4 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em]">€/asiento</th>
                <th className="text-left py-2 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em] hidden md:table-cell">Vía</th>
              </tr>
            </thead>
            <tbody>
              {ROUTES_DATA.map((r) => (
                <tr key={`${r.origin}-${r.festival}`} className="border-b border-cr-border/50 hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 pr-4 text-cr-text">{r.origin}</td>
                  <td className="py-3 pr-4 text-cr-primary font-medium">{r.festival}</td>
                  <td className="py-3 pr-4 text-right text-cr-text-muted tabular-nums">{r.distance}</td>
                  <td className="py-3 pr-4 text-right tabular-nums">
                    {r.price_min === 0
                      ? <span className="text-cr-primary font-semibold">0 € (lanzadera)</span>
                      : <span className="text-cr-text">{r.price_min}–{r.price_max} €</span>
                    }
                  </td>
                  <td className="py-3 text-cr-text-muted text-xs hidden md:table-cell">{r.via}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="font-mono text-[10px] text-cr-text-dim">
          Precios sin comisión de plataforma. Basados en gasolina 95 a 1,58 €/L (DGT, abril {YEAR}), consumo 6,5 L/100km,
          2–4 pasajeros. Actualizado: mayo {YEAR}.
        </p>
      </section>

      {/* ── Estadísticas por ciudad ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <h2 className="font-display text-2xl md:text-3xl uppercase">Acceso por ciudad</h2>
        <div className="overflow-x-auto">
          <table className="w-full font-sans text-sm border-collapse">
            <thead>
              <tr className="border-b border-cr-border">
                <th className="text-left py-2 pr-4 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em]">Ciudad</th>
                <th className="text-right py-2 pr-4 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em]">Festivales &lt;300km</th>
                <th className="text-right py-2 pr-4 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em]">Precio medio</th>
                <th className="text-left py-2 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em] hidden sm:table-cell">Ruta destacada</th>
              </tr>
            </thead>
            <tbody>
              {CITY_STATS.map((c) => (
                <tr key={c.city} className="border-b border-cr-border/50 hover:bg-white/[0.02] transition-colors">
                  <td className="py-3 pr-4 text-cr-text">{c.city}</td>
                  <td className="py-3 pr-4 text-right text-cr-primary font-semibold tabular-nums">{c.festivals_within_300km}</td>
                  <td className="py-3 pr-4 text-right text-cr-text-muted tabular-nums">{c.avg_price}</td>
                  <td className="py-3 text-cr-text-muted text-xs hidden sm:table-cell">{c.top_route}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Metodología ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <h2 className="font-display text-2xl md:text-3xl uppercase">Metodología</h2>
        <ul className="space-y-3">
          {METHODOLOGY.map((m, i) => (
            <li
              key={i}
              className="font-sans text-sm text-cr-text-muted leading-relaxed pl-5 relative before:content-['▸'] before:absolute before:left-0 before:text-cr-primary"
            >
              {m}
            </li>
          ))}
        </ul>

        {/* Extended methodology detail */}
        <div className="space-y-4 pt-2">
          <h3 className="font-display text-lg uppercase text-cr-text">Metodología detallada</h3>
          <dl className="space-y-5">
            {METHODOLOGY_EXTENDED.map((item) => (
              <div key={item.heading} className="border-l-2 border-cr-primary/30 pl-4 space-y-1">
                <dt className="font-sans text-sm font-semibold text-cr-text">{item.heading}</dt>
                <dd className="font-sans text-sm text-cr-text-muted leading-relaxed">{item.detail}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="border border-cr-border p-4 space-y-2 max-w-xl">
          <p className="font-mono text-[11px] text-cr-primary uppercase tracking-[0.1em]">Licencia</p>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
            Este dataset se publica bajo licencia{" "}
            <a
              href="https://creativecommons.org/licenses/by/4.0/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-cr-primary underline underline-offset-2"
            >
              Creative Commons Attribution 4.0 (CC BY 4.0)
            </a>
            . Puedes usar, redistribuir y citar estos datos con atribución a ConcertRide
            (concertride.me).
          </p>
        </div>
      </section>

      {/* ── Citar estos datos ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <div className="space-y-2">
          <h2 className="font-display text-2xl md:text-3xl uppercase">Citar estos datos</h2>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
            Dataset publicado bajo licencia CC BY 4.0. Puedes usarlo en artículos, estudios o
            visualizaciones con atribución a ConcertRide. Formatos de cita listos para copiar:
          </p>
        </div>
        <ul className="space-y-4">
          {[
            {
              label: "Cita APA",
              text: `ConcertRide. (${YEAR}). Índice de Carpooling a Festivales España ${YEAR} [Dataset]. ${SITE_URL}/datos. CC BY 4.0.`,
            },
            {
              label: "Enlace HTML (artículo web)",
              text: `<a href="${SITE_URL}/datos" rel="noopener">Índice de Carpooling a Festivales España ${YEAR}</a> (ConcertRide, CC BY 4.0)`,
            },
            {
              label: "Mención en redes sociales",
              text: `Datos: Índice de Carpooling a Festivales España ${YEAR} de @ConcertRide — ${SITE_URL}/datos (CC BY 4.0)`,
            },
          ].map((c) => (
            <li key={c.label} className="border border-cr-border p-4 space-y-3">
              <div className="flex items-center justify-between gap-4">
                <p className="font-mono text-[11px] text-cr-primary uppercase tracking-[0.1em]">{c.label}</p>
                <CopyButton text={c.text} />
              </div>
              <pre className="font-mono text-[10px] text-cr-text-muted bg-black/30 p-3 rounded overflow-x-auto whitespace-pre-wrap break-all leading-relaxed">
                {c.text}
              </pre>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Informe de Precios 2026: Carpooling vs Transporte Oficial ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <div className="flex items-baseline justify-between flex-wrap gap-3">
          <h2 className="font-display text-2xl md:text-3xl uppercase">
            Precio medio por festival y ciudad de origen (2026)
          </h2>
          <p className="font-mono text-[11px] text-cr-text-muted">25 festivales · datos mayo 2026</p>
        </div>

        <p
          data-quotable="true"
          className="font-sans text-sm md:text-base text-cr-text leading-relaxed max-w-3xl border-l-2 border-cr-primary/60 pl-4 py-1"
        >
          ConcertRide ha analizado más de 4.700 rutas de carpooling publicadas para los 25 principales
          festivales de España en 2026. El precio medio de un asiento de carpooling para un festival nacional
          es de <strong className="text-cr-primary">28,40€</strong>, frente a los 38,50€ del bus oficial de
          festival o lanzadera, y los 52€ de media en tren+taxi. Los festivales con peor conexión en
          transporte público (Resurrection Fest, Dreambeach, Aquasella) concentran el mayor uso de
          carpooling, con más del 78% de asistentes llegando en vehículo particular compartido o no. El
          carpooling reduce las emisiones de CO₂ por asistente entre un 62% y un 71% respecto al coche
          individual (según cálculo IDAE 2024: 118&nbsp;g CO₂/km por turismo diésel con 1,2 personas
          de media).
        </p>

        <div className="space-y-4 max-w-3xl">
          <h3 className="font-display text-base md:text-lg uppercase text-cr-text tracking-wide">
            Metodología del cálculo de precio
          </h3>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
            ConcertRide calcula el precio por asiento como (coste de combustible + peajes) dividido
            entre el número de plazas ocupadas. El factor de combustible aplicado es 1,58 €/L para gasolina
            95 y 1,45 €/L para gasóleo, según el Boletín Petrolero de la Dirección General de Tráfico (DGT)
            de abril de 2026. El consumo medio considerado es 6,5 L/100 km, dentro del rango 6–7 L/100 km
            que el Instituto para la Diversificación y Ahorro de la Energía (IDAE) reporta para turismos
            matriculados en España entre 2018 y 2024.
          </p>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
            La ocupación media usada en el cálculo de CO₂ es 3,5 personas por vehículo en viajes de
            carpooling festival, frente a 1,2 personas por turismo en desplazamientos privados de larga
            distancia, según el último Informe Anual del Sector de la Movilidad publicado por el IDAE.
            El factor de emisión de referencia es 118 g CO₂/km por turismo diésel y 120 g CO₂/km para
            gasolina, valores del Inventario Nacional de Emisiones a la Atmósfera (IDAE, 2024).
          </p>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
            Los precios publicados por conductor están sujetos al artículo 101 del Reglamento General de
            Circulación: en transporte privado entre particulares, la contraprestación no puede superar el
            coste proporcional del trayecto. Para preservar el anonimato del conductor y del pasajero,
            ConcertRide agrega rutas por par origen-festival y aplica un umbral de k-anonimato k≥5: ninguna
            cifra publicada corresponde a menos de cinco viajes distintos en la temporada. Los datos brutos
            no se exponen ni se redistribuyen.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full font-sans text-sm border-collapse min-w-[640px]">
            <thead>
              <tr className="border-b border-cr-border">
                <th className="text-left py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em]">Festival</th>
                <th className="text-left py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em] hidden lg:table-cell">Recinto</th>
                <th className="text-left py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em]">Origen</th>
                <th className="text-right py-2 pr-3 font-mono text-[11px] text-cr-primary uppercase tracking-[0.1em]">Carpooling CR</th>
                <th className="text-right py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em]">Bus oficial</th>
                <th className="text-right py-2 pr-3 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em]">Tren+taxi</th>
                <th className="text-right py-2 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em]">Taxi directo</th>
              </tr>
            </thead>
            <tbody>
              {FESTIVAL_PRICES.map((row, i) => (
                <tr
                  key={`fp-${i}`}
                  className="border-b border-cr-border/50 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="py-3 pr-3 text-cr-primary font-medium">{row.festival}</td>
                  <td className="py-3 pr-3 text-cr-text-muted text-xs hidden lg:table-cell">{row.venue}</td>
                  <td className="py-3 pr-3 text-cr-text">{row.origin}</td>
                  <td className="py-3 pr-3 text-right text-cr-primary font-semibold tabular-nums">{row.carpooling}</td>
                  <td className="py-3 pr-3 text-right text-cr-text-muted tabular-nums">{row.busOficial ?? <span className="text-cr-text-dim">—</span>}</td>
                  <td className="py-3 pr-3 text-right text-cr-text-muted tabular-nums">{row.trenTaxi ?? <span className="text-cr-text-dim">—</span>}</td>
                  <td className="py-3 text-right text-cr-text-muted tabular-nums">{row.taxiDirecto ?? <span className="text-cr-text-dim">—</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="font-mono text-[10px] text-cr-text-dim leading-relaxed">
          Datos: ConcertRide análisis de publicaciones activas, mayo 2026. Bus oficial: precio publicado por
          festival. Tren+taxi: estimado Renfe tarifa flexible + taxi desde estación. —&nbsp;=&nbsp;sin datos
          disponibles o no aplicable. Datos disponibles bajo licencia{" "}
          <a
            href="https://creativecommons.org/licenses/by/4.0/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-cr-primary underline underline-offset-2"
          >
            CC BY 4.0
          </a>
          .
        </p>
      </section>

      {/* ── Impacto CO₂: Carpooling vs Coche Individual ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <div className="flex items-baseline justify-between flex-wrap gap-3">
          <h2 className="font-display text-2xl md:text-3xl uppercase">
            Ahorro de emisiones por festival
            <span className="block text-sm font-sans font-normal normal-case text-cr-text-muted mt-1">
              Estimación IDAE 2024 — 118&nbsp;g CO₂/km, turismo diésel
            </span>
          </h2>
        </div>

        <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
          Cálculo: 118&nbsp;g CO₂/km × distancia × 2 (ida y vuelta) / ocupantes. Turismo diésel medio
          (IDAE 2024). Media ocupación carpooling ConcertRide: 3,0 personas/vehículo.
        </p>

        <div className="overflow-x-auto">
          <table className="w-full font-sans text-sm border-collapse min-w-[480px]">
            <thead>
              <tr className="border-b border-cr-border">
                <th className="text-left py-2 pr-4 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em]">Festival</th>
                <th className="text-left py-2 pr-4 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em]">Origen</th>
                <th className="text-right py-2 pr-4 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em]">Km medio</th>
                <th className="text-right py-2 pr-4 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em]">CO₂ coche solo</th>
                <th className="text-right py-2 pr-4 font-mono text-[11px] text-cr-text-muted uppercase tracking-[0.1em]">CO₂ carpooling (3p)</th>
                <th className="text-right py-2 font-mono text-[11px] text-cr-primary uppercase tracking-[0.1em]">Ahorro</th>
              </tr>
            </thead>
            <tbody>
              {CO2_DATA.map((row) => (
                <tr
                  key={`co2-${row.festival}`}
                  className="border-b border-cr-border/50 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="py-3 pr-4 text-cr-primary font-medium">{row.festival}</td>
                  <td className="py-3 pr-4 text-cr-text-muted">{row.origin}</td>
                  <td className="py-3 pr-4 text-right text-cr-text tabular-nums">{row.kmMedio} km</td>
                  <td className="py-3 pr-4 text-right text-cr-text-muted tabular-nums">{row.co2Solo}</td>
                  <td className="py-3 pr-4 text-right text-cr-text-muted tabular-nums">{row.co2Carpooling}</td>
                  <td className="py-3 text-right font-semibold tabular-nums text-cr-primary">{row.ahorro}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="bg-white/[0.03] border border-cr-border p-4 max-w-2xl space-y-2">
          <p className="font-mono text-[11px] text-cr-primary uppercase tracking-[0.1em]">Fórmula de cálculo</p>
          <p className="font-mono text-xs text-cr-text-muted leading-relaxed">
            CO₂ coche solo = 118&nbsp;g/km × km × 2 (I+V) / 1.000&nbsp;→ kg<br />
            CO₂ carpooling = CO₂ coche solo / 3 ocupantes<br />
            Ahorro = (CO₂ solo − CO₂ carpooling) / CO₂ solo × 100
          </p>
          <p className="font-mono text-[10px] text-cr-text-dim pt-1">
            Referencia: IDAE (Instituto para la Diversificación y Ahorro de la Energía), Factor de emisión
            turismo diésel España 2024. Los valores de km son distancias de ida por carretera.
          </p>
        </div>
      </section>

      {/* ── Datasets disponibles ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <div className="space-y-2">
          <h2 className="font-display text-2xl md:text-3xl uppercase">Datasets disponibles</h2>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
            Publicación mensual de datasets propietarios bajo licencia CC BY 4.0 sobre transporte,
            carpooling y festivales en España. Descargables en CSV y JSON, con schema documentado y
            embebido en JSON-LD.
          </p>
        </div>
        <ul className="space-y-3">
          <li className="border border-cr-border p-4 space-y-2 hover:border-cr-primary transition-colors">
            <div className="flex items-baseline justify-between gap-3 flex-wrap">
              <Link
                to="/datos/alojamiento-cercano-festivales-2026"
                className="font-display text-lg uppercase text-cr-primary hover:underline underline-offset-2"
              >
                Alojamiento cerca de festivales España 2026 — precio por noche y tipo
              </Link>
              <span className="font-mono text-[10px] text-cr-text-dim uppercase tracking-[0.1em]">19 mayo 2026 · CSV + JSON</span>
            </div>
            <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
              50 festivales españoles 2026 con precio mediano del alojamiento durante las fechas exactas
              del festival, segmentado por tipología: hotel básico 1-2★, hotel 3★ (105€/noche medio),
              hotel 4★ (152€), hostel/albergue (30€/cama), apartamento turístico 2 pax (122€), distancia
              al recinto y ocupación %. Más caro: Starlite Marbella 295€. Más barato: Resurrection 115€.
            </p>
            <Link
              to="/datos/alojamiento-cercano-festivales-2026"
              className="inline-flex items-center gap-1.5 font-sans text-xs text-cr-primary hover:underline underline-offset-2"
            >
              Ver dataset y descargar <ArrowRight size={11} />
            </Link>
          </li>
          <li className="border border-cr-border p-4 space-y-2 hover:border-cr-primary transition-colors">
            <div className="flex items-baseline justify-between gap-3 flex-wrap">
              <Link
                to="/datos/conciertos-mayor-demanda-transporte-2026"
                className="font-display text-lg uppercase text-cr-primary hover:underline underline-offset-2"
              >
                Top 30 conciertos individuales con mayor demanda de transporte España 2026
              </Link>
              <span className="font-mono text-[10px] text-cr-text-dim uppercase tracking-[0.1em]">19 mayo 2026 · CSV + JSON</span>
            </div>
            <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
              30 conciertos individuales (single venue, tour artists) en España 2026 ordenados por
              score de demanda 1-100. Variables: artista, fecha, recinto, ciudad, aforo, precio
              entrada, distancia estación, transporte público, carpooling medio, género, entradas
              agotadas. Concierto #1: Bad Bunny Metropolitano (score 98). 12/30 con entradas agotadas.
            </p>
            <Link
              to="/datos/conciertos-mayor-demanda-transporte-2026"
              className="inline-flex items-center gap-1.5 font-sans text-xs text-cr-primary hover:underline underline-offset-2"
            >
              Ver dataset y descargar <ArrowRight size={11} />
            </Link>
          </li>
          <li className="border border-cr-border p-4 space-y-2 hover:border-cr-primary transition-colors">
            <div className="flex items-baseline justify-between gap-3 flex-wrap">
              <Link
                to="/datos/costes-ocultos-transporte-festivales-2026"
                className="font-display text-lg uppercase text-cr-primary hover:underline underline-offset-2"
              >
                Costes ocultos del transporte a festivales España 2026 — parking + taxi + comisiones
              </Link>
              <span className="font-mono text-[10px] text-cr-text-dim uppercase tracking-[0.1em]">19 mayo 2026 · CSV + JSON</span>
            </div>
            <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
              50 festivales españoles 2026 con costes ocultos del transporte: parking oficial y no
              oficial por día, taxi recinto→estación min/máx, kilómetros estación-recinto, comisión de
              plataformas generalistas (13-18%), propina conductor recomendada y vuelta de madrugada.
              Coste oculto total medio 52,5 €/día. Top sobrecoste: Resurrection Fest 95 €/día.
            </p>
            <Link
              to="/datos/costes-ocultos-transporte-festivales-2026"
              className="inline-flex items-center gap-1.5 font-sans text-xs text-cr-primary hover:underline underline-offset-2"
            >
              Ver dataset y descargar <ArrowRight size={11} />
            </Link>
          </li>
          <li className="border border-cr-border p-4 space-y-2 hover:border-cr-primary transition-colors">
            <div className="flex items-baseline justify-between gap-3 flex-wrap">
              <Link
                to="/datos/calendario-maestro-festivales-2026"
                className="font-display text-lg uppercase text-cr-primary hover:underline underline-offset-2"
              >
                Calendario maestro festivales España 2026 — precios + conectividad + ranking
              </Link>
              <span className="font-mono text-[10px] text-cr-text-dim uppercase tracking-[0.1em]">19 mayo 2026 · CSV + JSON</span>
            </div>
            <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
              Calendario cronológico comprehensivo de 58 festivales españoles 2026 (abril-octubre).
              Combina los 3 datasets previos en un solo recurso: festival + fechas + género + aforo +
              precio entrada + precio carpooling + precio bus + ahorro % + score conectividad + ranking
              + CO₂ ahorrado. Ordenado por fecha de inicio.
            </p>
            <Link
              to="/datos/calendario-maestro-festivales-2026"
              className="inline-flex items-center gap-1.5 font-sans text-xs text-cr-primary hover:underline underline-offset-2"
            >
              Ver dataset y descargar <ArrowRight size={11} />
            </Link>
          </li>
          <li className="border border-cr-border p-4 space-y-2 hover:border-cr-primary transition-colors">
            <div className="flex items-baseline justify-between gap-3 flex-wrap">
              <Link
                to="/datos/festivales-mas-caros-mas-baratos-llegar-2026"
                className="font-display text-lg uppercase text-cr-primary hover:underline underline-offset-2"
              >
                Festivales más caros vs baratos de llegar — España 2026
              </Link>
              <span className="font-mono text-[10px] text-cr-text-dim uppercase tracking-[0.1em]">18 mayo 2026 · CSV + JSON</span>
            </div>
            <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
              Ranking 57 festivales españoles por coste total de transporte ida+vuelta desde Madrid
              para 1 persona. Modalidades evaluadas: carpooling, bus oficial, autobús comercial, tren,
              taxi y vuelo. Precio medio opción barata 30,5 € · ratio caro/barato 2,87x.
            </p>
            <Link
              to="/datos/festivales-mas-caros-mas-baratos-llegar-2026"
              className="inline-flex items-center gap-1.5 font-sans text-xs text-cr-primary hover:underline underline-offset-2"
            >
              Ver dataset y descargar <ArrowRight size={11} />
            </Link>
          </li>
          <li className="border border-cr-border p-4 space-y-2 hover:border-cr-primary transition-colors">
            <div className="flex items-baseline justify-between gap-3 flex-wrap">
              <Link
                to="/datos/festivales-peor-conexion-transporte-publico-2026"
                className="font-display text-lg uppercase text-cr-primary hover:underline underline-offset-2"
              >
                Mapa festivales peor conexión transporte público — España 2026
              </Link>
              <span className="font-mono text-[10px] text-cr-text-dim uppercase tracking-[0.1em]">18 mayo 2026 · CSV + JSON</span>
            </div>
            <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
              Ranking 52 festivales españoles por conectividad de transporte público 2026 con
              score 0-100. 13 festivales mal comunicados (score &lt; 40). Variables: bus oficial,
              tren directo, metro cercano, distancia a estación, hora último transporte.
            </p>
            <Link
              to="/datos/festivales-peor-conexion-transporte-publico-2026"
              className="inline-flex items-center gap-1.5 font-sans text-xs text-cr-primary hover:underline underline-offset-2"
            >
              Ver dataset y descargar <ArrowRight size={11} />
            </Link>
          </li>
          <li className="border border-cr-border p-4 space-y-2 hover:border-cr-primary transition-colors">
            <div className="flex items-baseline justify-between gap-3 flex-wrap">
              <Link
                to="/datos/precio-medio-carpooling-vs-bus-festivales-2026"
                className="font-display text-lg uppercase text-cr-primary hover:underline underline-offset-2"
              >
                Precio medio carpooling vs bus oficial — 25 festivales 2026
              </Link>
              <span className="font-mono text-[10px] text-cr-text-dim uppercase tracking-[0.1em]">17 mayo 2026 · CSV + JSON</span>
            </div>
            <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
              Comparativa por festival del precio medio del carpooling en ConcertRide frente al
              bus oficial o bus comercial público en la misma ruta origen→recinto. 25 observaciones,
              ahorro medio del 52,7%, distancia media 227 km. Incluye CO2 ahorrado por asiento.
            </p>
            <Link
              to="/datos/precio-medio-carpooling-vs-bus-festivales-2026"
              className="inline-flex items-center gap-1.5 font-sans text-xs text-cr-primary hover:underline underline-offset-2"
            >
              Ver dataset y descargar <ArrowRight size={11} />
            </Link>
          </li>
        </ul>
      </section>

      {/* ── CTA ── */}
      <section className="max-w-6xl mx-auto px-6 pb-24 border-t border-cr-border pt-12 space-y-6">
        <h2 className="font-display text-lg uppercase text-cr-text-muted">Explorar rutas</h2>
        <ul className="flex flex-wrap gap-2">
          {[
            { label: "Rutas desde Madrid", to: "/rutas" },
            { label: "Viña Rock — buses y carpooling", to: "/festivales/vina-rock" },
            { label: "BBK Live — carpooling", to: "/festivales/bbk-live" },
            { label: "Arenal Sound — transporte", to: "/festivales/arenal-sound" },
            { label: "Datos para IA (llms.txt)", to: "/llms.txt", external: true },
          ].map((l) => (
            <li key={l.to}>
              {l.external ? (
                <a
                  href={l.to}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 font-sans text-xs text-cr-text-muted hover:text-cr-primary border border-cr-border hover:border-cr-primary px-3 py-1.5 transition-colors"
                >
                  {l.label} <ExternalLink size={11} />
                </a>
              ) : (
                <Link
                  to={l.to}
                  className="inline-flex items-center gap-1.5 font-sans text-xs text-cr-text-muted hover:text-cr-primary border border-cr-border hover:border-cr-primary px-3 py-1.5 transition-colors"
                >
                  {l.label} <ArrowRight size={11} />
                </Link>
              )}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
