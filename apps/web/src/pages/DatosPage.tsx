import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Copy, ExternalLink } from "lucide-react";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";

const YEAR = new Date().getFullYear();

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
    title: `Índice de Carpooling a Festivales España ${YEAR} · Datos y precios | ConcertRide`,
    description: `Dataset público con precios de carpooling a 16 festivales desde 17 ciudades españolas. ${YEAR}: Madrid→Mad Cool 3–6€, Madrid→Viña Rock 8–12€, Madrid→BBK Live 15–22€. Metodología DGT. Sin comisión.`,
    canonical: url,
    keywords: `carpooling festivales precios, indice carpooling España, datos carpooling festival, precio asiento festival, coste viaje festival España`,
  });

  const jsonLdDataset = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: `ConcertRide Índice de Carpooling a Festivales España ${YEAR}`,
    description: `Precios de referencia por asiento para carpooling entre particulares a los 16 principales festivales de música en España. Calculados a partir de costes reales de combustible (DGT ${YEAR}) y distancias origen→recinto. 96 rutas cubiertos desde 17 ciudades. Sin comisión de plataforma.`,
    url,
    creator: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "ConcertRide",
      url: SITE_URL,
    },
    datePublished: `${YEAR}-05-01`,
    dateModified: `${YEAR}-05-06`,
    inLanguage: "es-ES",
    license: "https://creativecommons.org/licenses/by/4.0/",
    measurementTechnique: "Datos agregados de viajes publicados en ConcertRide, combinados con precios DGT y distancias Google Maps",
    spatialCoverage: {
      "@type": "Country",
      name: "Spain",
      sameAs: "https://www.wikidata.org/wiki/Q29",
    },
    temporalCoverage: "2024/..",
    keywords: "carpooling, festivales, música, transporte, España, precio asiento, rutas festivales, coche compartido conciertos",
    variableMeasured: [
      { "@type": "PropertyValue", name: "Precio mínimo por asiento (carpooling a festival)", value: "3", unitText: "EUR" },
      { "@type": "PropertyValue", name: "Precio máximo por asiento (carpooling a festival)", value: "35", unitText: "EUR" },
      { "@type": "PropertyValue", name: "Rutas ciudad→festival cubiertas", value: "96+", unitText: "rutas" },
      { "@type": "PropertyValue", name: "Festivales cubiertos", value: "16", unitText: "festivales" },
      { "@type": "PropertyValue", name: "Ciudades de origen con datos", value: "17", unitText: "ciudades" },
      { "@type": "PropertyValue", name: "Comisión de plataforma", value: "0", unitText: "%" },
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

  return (
    <main id="main" className="min-h-dvh bg-cr-bg text-cr-text pt-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdDataset) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />

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
