import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Copy, Download, ExternalLink, FileText, Quote } from "lucide-react";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";

const STATS = [
  { label: "Festivales cubiertos", value: "50+" },
  { label: "Datasets abiertos CC BY 4.0", value: "4" },
  { label: "Comisión de plataforma", value: "0 %" },
  { label: "Asistentes/año al mercado", value: "25 M" },
  { label: "Reducción CO₂ por asiento", value: "−67 %" },
  { label: "Cobertura", value: "España" },
];

// Las 5 cifras "quick stats" destacadas para titulares periodísticos
const QUICK_STATS = [
  {
    headline: "50+ festivales",
    sub: "España, agenda 2026 cubierta — Mad Cool, Primavera Sound, BBK Live, FIB, Resurrection Fest, Arenal Sound y +44 más con landing y rutas dedicadas.",
  },
  {
    headline: "4 datasets abiertos CC BY 4.0",
    sub: "Precios, mapa de conexión, ranking caros/baratos y calendario maestro. CSV + JSON descargables. Reutilizables con atribución.",
  },
  {
    headline: "0 % de comisión",
    sub: "El conductor recibe el 100 % del precio del asiento. Pago en persona (efectivo o Bizum) el día del viaje. Sin procesadores de pago intermediarios.",
  },
  {
    headline: "Conductores verificados",
    sub: "Carnet de conducir validado antes de publicar el primer viaje. Modelo de cost-sharing reconocido por la DGT (no requiere licencia VTC).",
  },
  {
    headline: "−67 % CO₂ por asistente",
    sub: "Compartir coche con 3 pasajeros reduce la huella de carbono del transporte del festival hasta un 67 % frente al coche en solitario (fuente: Julie's Bicycle / cálculo propio).",
  },
];

// Datasets activos publicados en /datos (todos CC BY 4.0)
const DATASETS = [
  {
    slug: "precio-medio-carpooling-vs-bus-festivales-2026",
    title: "Precio medio carpooling vs. bus a festivales 2026",
    desc: "Comparativa de precio por asiento (carpooling) frente al bus oficial para los 12 festivales más concurridos de España.",
    rows: "12 festivales",
  },
  {
    slug: "festivales-peor-conexion-transporte-publico-2026",
    title: "Festivales con peor conexión de transporte público 2026",
    desc: "Ranking de festivales con menos opciones de tren/bus oficial — donde el carpooling es la alternativa más eficiente.",
    rows: "15 festivales",
  },
  {
    slug: "festivales-mas-caros-mas-baratos-llegar-2026",
    title: "Festivales más caros y más baratos a los que llegar 2026",
    desc: "Coste total promedio (transporte + parking) para llegar a cada festival desde las 5 grandes capitales españolas.",
    rows: "20 festivales",
  },
  {
    slug: "calendario-maestro-festivales-2026",
    title: "Calendario maestro de festivales en España 2026",
    desc: "Agenda completa con fechas, recinto, ciudad y comunidad autónoma de los principales festivales musicales de 2026.",
    rows: "50+ festivales",
  },
];

// Quotes ready-to-use del founder, listos para citar en pieza periodística
const FOUNDER_QUOTES = [
  {
    quote: "El 80 % de la huella de carbono de un festival viene del transporte de los asistentes. Si conseguimos que cada coche lleve a tres personas más en lugar de viajar vacío, hemos resuelto el mayor problema medioambiental del sector.",
    context: "Sobre sostenibilidad y festivales",
  },
  {
    quote: "Cobrar comisión por conectar a un conductor con tres pasajeros que ya iban al mismo concierto nunca tuvo sentido para nosotros. El precio que ve el pasajero es el precio que recibe el conductor. Punto.",
    context: "Sobre el modelo 0 % comisión",
  },
  {
    quote: "Volver de un festival a las 4 de la mañana es donde el sistema de transporte público falla. No hay AVE, no hay bus, y un taxi cuesta 90 €. El carpooling es la única respuesta razonable para la madrugada.",
    context: "Sobre el problema de la vuelta nocturna",
  },
  {
    quote: "España celebra más de 1.000 festivales al año con 25 millones de asistentes. Es un mercado enorme que ninguna plataforma de carpooling generalista entiende: necesitas saber a qué hora termina el último concierto y dónde está el punto de recogida real, no solo la ciudad.",
    context: "Sobre el foco festival-first vs. carpooling generalista",
  },
];

// Brand colors (sincronizado con src/index.css)
const BRAND_COLORS = [
  { name: "Primary lime",     hex: "#D4F700", role: "Color principal — CTAs, links, badges" },
  { name: "Secondary orange", hex: "#FF4F00", role: "Acentos, gradientes, énfasis" },
  { name: "Background",       hex: "#080808", role: "Fondo base oscuro" },
  { name: "Surface",          hex: "#1A1A1A", role: "Cards, paneles, contenedores" },
  { name: "Text primary",     hex: "#F5F5F5", role: "Texto sobre fondo oscuro" },
  { name: "Text muted",       hex: "#888888", role: "Texto secundario, captions" },
];

const BRAND_FONTS = [
  { name: "Archivo Black", role: "Display / títulos", source: "Google Fonts (open-source)" },
  { name: "Inter",         role: "Body / UI",          source: "Google Fonts (open-source)" },
  { name: "JetBrains Mono", role: "Monoespaciada / código y datos", source: "Google Fonts (open-source)" },
];

// Cobertura previa — placeholder hasta que tengamos piezas publicadas reales
const PRESS_COVERAGE: Array<{ outlet: string; headline: string; url: string; date: string }> = [];

const KEY_FACTS = [
  "Plataforma española de carpooling exclusiva para conciertos y festivales de música.",
  "El conductor recibe el 100 % del precio del asiento — ConcertRide no cobra comisión.",
  "Pago en persona (efectivo o Bizum) el día del viaje. Sin procesamiento de pagos.",
  "Conductores verificados: carnet de conducir validado antes de publicar el primer viaje.",
  "Modelo legal: compartición de gastos (cost-sharing), reconocido por la DGT. No requiere licencia VTC.",
  "El carpooling reduce la huella de CO₂ por asistente hasta un 75 % frente al coche en solitario (fuente: Julie's Bicycle).",
  "España celebró 1.000+ festivales con 25 millones de asistentes en 2024 (fuente: APM).",
];

const LINKS = [
  { label: "Logo SVG (vectorial, escalable)",      href: `${SITE_URL}/favicon.svg`, ext: true },
  { label: "Logo PNG 512×512 (alta resolución)",   href: `${SITE_URL}/android-chrome-512x512.png`, ext: true },
  { label: "Logo PNG 192×192 (publicación web)",   href: `${SITE_URL}/android-chrome-192x192.png`, ext: true },
  { label: "Apple touch icon 180×180",             href: `${SITE_URL}/apple-touch-icon.png`, ext: true },
  { label: "OG Image 1200×630 (Open Graph)",       href: `${SITE_URL}/og/home.png`, ext: true },
  { label: "Plantillas OG SVG (festival/ruta/dataset/pillar/blog)", href: `${SITE_URL}/og/templates/festival-template.svg`, ext: true },
  { label: "llms.txt (datos estructurados para IA)", href: `${SITE_URL}/llms.txt`, ext: true },
  { label: "llms-full.txt (contexto extendido para IA)", href: `${SITE_URL}/llms-full.txt`, ext: true },
];

const EMBED_SNIPPETS = [
  {
    id: "badge-text",
    label: "Enlace de texto (recomendado para artículos)",
    anchor: "carpooling a festivales en España",
    code: `<a href="${SITE_URL}" rel="noopener">carpooling a festivales en España</a>`,
  },
  {
    id: "badge-brand",
    label: "Enlace de marca",
    anchor: "ConcertRide",
    code: `<a href="${SITE_URL}" rel="noopener">ConcertRide</a> — carpooling para conciertos y festivales`,
  },
  {
    id: "badge-datos",
    label: "Citar el índice de precios",
    anchor: "Índice de Carpooling a Festivales España 2026",
    code: `Fuente: <a href="${SITE_URL}/datos" rel="noopener">Índice de Carpooling a Festivales España 2026</a> (ConcertRide, CC BY 4.0)`,
  },
  {
    id: "badge-ruta",
    label: "Enlazar una ruta específica (ejemplo: Madrid → Mad Cool)",
    anchor: "Madrid → Mad Cool carpooling",
    code: `<a href="${SITE_URL}/rutas/madrid-mad-cool" rel="noopener">Madrid → Mad Cool carpooling</a>`,
  },
];

const ANCHOR_TEXTS = [
  { text: "carpooling a festivales España", intent: "Búsqueda de servicio" },
  { text: "compartir coche a conciertos", intent: "Alternativa a taxi" },
  { text: "coche compartido a festival sin comisión", intent: "Diferenciador clave" },
  { text: "ConcertRide", intent: "Marca" },
  { text: "transporte barato a festivales", intent: "Precio" },
  { text: "precio carpooling festival", intent: "Comparativa de costes" },
  { text: "cómo ir a [festival] sin coche propio", intent: "Intent informacional" },
];

function CopyButton({ text }: { text: string }) {
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
      className="inline-flex items-center gap-1.5 font-mono text-[10px] text-cr-text-muted hover:text-cr-primary border border-cr-border hover:border-cr-primary px-2 py-1 transition-colors"
      aria-label="Copiar código"
    >
      {copied ? <Check size={11} /> : <Copy size={11} />}
      {copied ? "Copiado" : "Copiar"}
    </button>
  );
}

export default function PrensaPage() {
  // SEO meta: title ≤ 65 chars; description 135–155 chars.
  useSeoMeta({
    title: "Press kit ConcertRide · Datos, cifras y contacto prensa",
    description:
      "Press kit ConcertRide: 5 cifras clave, 4 datasets CC BY 4.0 descargables, citas del fundador, logos y contacto de prensa para medios españoles.",
    canonical: `${SITE_URL}/prensa`,
    keywords: "press kit ConcertRide, medios ConcertRide, datos ConcertRide, carpooling festivales España prensa, datasets festivales",
  });

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Prensa", item: `${SITE_URL}/prensa` },
    ],
  };

  // NewsMediaOrganization is a distinct sub-entity of the canonical
  // Organization (emitted globally in index.html with @id #organization).
  // Using a different @id (#press-newsroom) avoids the in-page collision
  // detected by audit-schema-integrity.mjs while preserving the
  // NewsMediaOrganization typing for press/media discovery.
  const jsonLdOrg = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    "@id": `${SITE_URL}/#press-newsroom`,
    name: "ConcertRide · Sala de prensa",
    alternateName: "ConcertRide Press",
    parentOrganization: { "@id": `${SITE_URL}/#organization` },
    url: `${SITE_URL}/prensa`,
    logo: `${SITE_URL}/favicon.svg`,
    image: `${SITE_URL}/og/home.png`,
    description:
      "Sala de prensa de ConcertRide: datasets abiertos CC BY 4.0, descripciones oficiales, cifras verificadas y contacto para medios sobre carpooling para conciertos y festivales en España.",
    foundingDate: "2026",
    areaServed: { "@type": "Country", name: "Spain" },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "Press",
        email: "help@concertride.me",
        availableLanguage: ["Spanish", "English"],
        areaServed: "ES",
      },
    ],
    sameAs: [`${SITE_URL}/datos`, `${SITE_URL}/blog`],
  };

  // Itemized list of the 4 active CC BY 4.0 datasets — helps Google Dataset Search
  // index this page as a comprehensive press resource.
  const jsonLdDatasets = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Datasets abiertos ConcertRide (CC BY 4.0)",
    numberOfItems: DATASETS.length,
    itemListElement: DATASETS.map((d, idx) => ({
      "@type": "ListItem",
      position: idx + 1,
      url: `${SITE_URL}/datos/${d.slug}`,
      name: d.title,
    })),
  };

  // WebPage with Speakable — signals to AI Overviews / voice assistants the
  // quotable sections of the press page (h1, lede paragraph, .speakable blocks).
  const jsonLdWebPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE_URL}/prensa#webpage`,
    url: `${SITE_URL}/prensa`,
    name: "Press kit ConcertRide",
    inLanguage: "es-ES",
    about: { "@id": `${SITE_URL}/#press-newsroom` },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".lede", "[data-quotable]", ".speakable"],
    },
  };

  return (
    <main id="main" className="min-h-dvh bg-cr-bg text-cr-text pt-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdDatasets) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebPage) }} />

      {/* ── Hero ── */}
      <div className="max-w-6xl mx-auto px-6 pt-10 pb-6 space-y-4">
        <nav aria-label="Breadcrumb" className="font-mono text-[11px] text-cr-text-muted flex items-center gap-2">
          <Link to="/" className="hover:text-cr-primary">Inicio</Link>
          <span aria-hidden="true">/</span>
          <span className="text-cr-text-muted">Prensa</span>
        </nav>

        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
          Medios y prensa
        </p>

        <h1 className="font-display text-4xl md:text-6xl uppercase leading-[0.92]">
          Press kit<br />ConcertRide.
        </h1>

        <p className="font-sans text-sm md:text-base text-cr-text-muted max-w-2xl leading-relaxed">
          Todo lo que necesitas para cubrir ConcertRide: datos clave, cifras verificadas,
          recursos gráficos y contacto de prensa.
        </p>
      </div>

      {/* ── Descripción de una línea ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-4">
        <h2 className="font-display text-2xl md:text-3xl uppercase">Descripción para medios</h2>
        <div className="space-y-3">
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-3xl">
            <strong className="text-cr-text">Una línea:</strong>{" "}
            ConcertRide ES es la plataforma española de carpooling exclusiva para conciertos y festivales de música — sin comisiones, con conductores verificados.
          </p>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-3xl">
            <strong className="text-cr-text">Un párrafo:</strong>{" "}
            ConcertRide conecta fans que van al mismo concierto o festival para compartir coche y dividir los gastos de combustible y peajes. El conductor recibe el 100&nbsp;% del precio del asiento; la plataforma no cobra comisión. El pago se realiza en efectivo o Bizum el día del viaje. Todos los conductores verifican su carnet antes de publicar. Cubre los 16 principales festivales de España y cuenta con landing pages para 10 ciudades y 93 rutas origen→festival.
          </p>
        </div>
      </section>

      {/* ── Cifras clave ── */}
      <section id="cifras-clave" className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <h2 className="font-display text-2xl md:text-3xl uppercase">Cifras clave</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {STATS.map((s) => (
            <div key={s.label} className="border border-cr-border p-4 space-y-1">
              <p className="font-display text-2xl md:text-3xl uppercase text-cr-primary">{s.value}</p>
              <p className="font-mono text-[11px] text-cr-text-muted">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Quick stats (titulares periodísticos) ── */}
      <section id="quick-stats" className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <div className="space-y-2">
          <h2 className="font-display text-2xl md:text-3xl uppercase">Quick stats para titulares</h2>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
            5 cifras listas para usar en titulares, leads de artículo o gráficos. Todas verificables en
            las páginas enlazadas y en los datasets abiertos.
          </p>
        </div>
        <ol className="space-y-3">
          {QUICK_STATS.map((q, idx) => (
            <li key={q.headline} className="border border-cr-border p-4 flex gap-4 items-start">
              <span className="font-mono text-[11px] text-cr-primary mt-1 shrink-0">0{idx + 1}</span>
              <div className="space-y-1">
                <p className="font-display text-lg md:text-xl uppercase text-cr-text leading-tight">{q.headline}</p>
                <p className="font-sans text-sm text-cr-text-muted leading-relaxed">{q.sub}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      {/* ── Datasets abiertos CC BY 4.0 ── */}
      <section id="datasets" className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <div className="space-y-2">
          <h2 className="font-display text-2xl md:text-3xl uppercase">Datasets abiertos</h2>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
            Cuatro datasets publicados bajo licencia <strong className="text-cr-text">Creative Commons Attribution 4.0</strong>
            {" "}— libre uso editorial, comercial y académico con cita a ConcertRide. Descarga directa en CSV y JSON.
          </p>
        </div>
        <ul className="grid sm:grid-cols-2 gap-3">
          {DATASETS.map((d) => (
            <li key={d.slug} className="border border-cr-border p-4 space-y-3">
              {/* Dataset thumbnail */}
              <div className="aspect-[1200/630] bg-gradient-to-br from-cr-bg to-black border border-cr-border/60 flex items-center justify-center relative overflow-hidden">
                <FileText size={42} className="text-cr-primary opacity-80" />
                <span className="absolute top-2 left-2 font-mono text-[9px] uppercase tracking-widest text-cr-primary bg-cr-bg/80 px-2 py-1 border border-cr-primary/40">
                  CC BY 4.0
                </span>
                <span className="absolute bottom-2 right-2 font-mono text-[9px] text-cr-text-muted">
                  {d.rows}
                </span>
              </div>
              <div className="space-y-1">
                <Link
                  to={`/datos/${d.slug}`}
                  className="font-display text-base uppercase text-cr-text hover:text-cr-primary transition-colors leading-tight block"
                >
                  {d.title}
                </Link>
                <p className="font-sans text-xs text-cr-text-muted leading-relaxed">{d.desc}</p>
              </div>
              <div className="flex flex-wrap gap-2 pt-1">
                <a
                  href={`${SITE_URL}/datos/${d.slug}.csv`}
                  download
                  className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-cr-primary border border-cr-primary/40 hover:border-cr-primary px-2.5 py-1.5 transition-colors"
                >
                  <Download size={11} /> CSV
                </a>
                <a
                  href={`${SITE_URL}/datos/${d.slug}.json`}
                  download
                  className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-cr-primary border border-cr-primary/40 hover:border-cr-primary px-2.5 py-1.5 transition-colors"
                >
                  <Download size={11} /> JSON
                </a>
                <Link
                  to={`/datos/${d.slug}`}
                  className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-cr-text-muted hover:text-cr-text border border-cr-border hover:border-cr-text px-2.5 py-1.5 transition-colors"
                >
                  Detalle <ArrowRight size={11} />
                </Link>
              </div>
            </li>
          ))}
        </ul>
        <p className="font-mono text-[11px] text-cr-text-dim">
          Cita sugerida: <span className="text-cr-text-muted">«ConcertRide (2026). {`{Nombre del dataset}`}. CC BY 4.0. concertride.me/datos.»</span>
        </p>
      </section>

      {/* ── Quotes ready-to-use del founder ── */}
      <section id="quotes" className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <div className="space-y-2">
          <h2 className="font-display text-2xl md:text-3xl uppercase">Citas del fundador</h2>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
            4 citas autorizadas de Equipo ConcertRide (Fundador, ConcertRide ES) — listas para reproducir
            en piezas periodísticas sin necesidad de entrevista previa. Atribución requerida.
          </p>
        </div>
        <ul className="space-y-4">
          {FOUNDER_QUOTES.map((q) => (
            <li key={q.quote.slice(0, 40)} className="border border-cr-border p-5 space-y-3 relative">
              <Quote size={20} className="text-cr-primary opacity-60 absolute top-4 right-4" aria-hidden="true" />
              <blockquote className="font-sans text-base text-cr-text leading-relaxed italic max-w-3xl">
                «{q.quote}»
              </blockquote>
              <footer className="flex items-center justify-between gap-4 flex-wrap pt-2">
                <p className="font-mono text-[11px] text-cr-text-muted">
                  — Equipo ConcertRide, Fundador ConcertRide ES
                </p>
                <p className="font-mono text-[10px] text-cr-text-dim uppercase tracking-wider">{q.context}</p>
              </footer>
              <div className="pt-1">
                <CopyButton text={`«${q.quote}» — Equipo ConcertRide, Fundador ConcertRide ES`} />
              </div>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Brand assets ── */}
      <section id="brand-assets" className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-8">
        <div className="space-y-2">
          <h2 className="font-display text-2xl md:text-3xl uppercase">Brand assets</h2>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
            Identidad visual ConcertRide — logos, paleta cromática y tipografías. Uso libre en contexto
            editorial. Para campañas comerciales o adaptaciones del logo, contacta con prensa.
          </p>
        </div>

        {/* Colores */}
        <div className="space-y-3">
          <h3 className="font-display text-lg uppercase text-cr-text">Paleta cromática</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {BRAND_COLORS.map((c) => (
              <div key={c.hex} className="border border-cr-border overflow-hidden">
                <div className="h-20" style={{ backgroundColor: c.hex }} aria-label={`Muestra del color ${c.name}`} />
                <div className="p-3 space-y-1">
                  <p className="font-display text-xs uppercase text-cr-text">{c.name}</p>
                  <p className="font-mono text-[11px] text-cr-primary">{c.hex}</p>
                  <p className="font-sans text-[11px] text-cr-text-muted leading-snug">{c.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Tipografías */}
        <div className="space-y-3">
          <h3 className="font-display text-lg uppercase text-cr-text">Tipografías</h3>
          <ul className="space-y-2">
            {BRAND_FONTS.map((f) => (
              <li
                key={f.name}
                className="border border-cr-border p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2"
              >
                <div>
                  <p className="font-display text-base uppercase text-cr-text">{f.name}</p>
                  <p className="font-mono text-[11px] text-cr-text-muted">{f.role}</p>
                </div>
                <p className="font-mono text-[10px] text-cr-text-dim">{f.source}</p>
              </li>
            ))}
          </ul>
        </div>

        {/* Descargas */}
        <div className="space-y-3">
          <h3 className="font-display text-lg uppercase text-cr-text">Descargas</h3>
          <ul className="space-y-2">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  target={l.ext ? "_blank" : undefined}
                  rel={l.ext ? "noopener noreferrer" : undefined}
                  className="inline-flex items-center gap-2 font-sans text-sm text-cr-primary border-b border-cr-primary/40 hover:border-cr-primary transition-colors"
                >
                  {l.ext ? <ExternalLink size={12} /> : <Download size={12} />}
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <p className="font-sans text-xs text-cr-text-muted leading-relaxed max-w-2xl pt-2">
            El logotipo y los activos gráficos de ConcertRide pueden usarse en contexto editorial
            (artículos, reseñas, comparativas) sin autorización previa. Para campañas publicitarias
            o usos comerciales, contacta con nosotros.
          </p>
        </div>
      </section>

      {/* ── Datos verificables ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <h2 className="font-display text-2xl md:text-3xl uppercase">Datos verificables</h2>
        <ul className="space-y-3">
          {KEY_FACTS.map((f) => (
            <li
              key={f}
              className="font-sans text-sm text-cr-text-muted leading-relaxed pl-5 relative before:content-['▸'] before:absolute before:left-0 before:text-cr-primary"
            >
              {f}
            </li>
          ))}
        </ul>
        <p className="font-mono text-[11px] text-cr-text-dim mt-2">
          Fuentes:{" "}
          <a href="https://juliesbicycle.com/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-cr-primary">
            Julie's Bicycle
          </a>
          {" · "}
          <a href="https://www.apmusicales.com/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-cr-primary">
            Asociación de Promotores Musicales (APM)
          </a>
          {" · "}
          <a href="https://www.miteco.gob.es/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-cr-primary">
            MITECO
          </a>
        </p>
      </section>

      {/* ── Contexto sectorial ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <h2 className="font-display text-2xl md:text-3xl uppercase">Contexto sectorial</h2>
        <div className="grid sm:grid-cols-2 gap-4">
          {[
            {
              stat: "80 %",
              body: "de la huella de carbono de un festival proviene del transporte de los asistentes.",
              source: "Julie's Bicycle Green Events Guide",
              href: "https://juliesbicycle.com/",
            },
            {
              stat: "25 M",
              body: "de asistentes a festivales y conciertos en España en 2024 (600 M€ de facturación).",
              source: "APM Informe 2024",
              href: "https://www.apmusicales.com/",
            },
            {
              stat: "45–90 min",
              body: "de espera de taxi en la salida de un festival grande en hora pico, según conductores y asistentes.",
              source: "Relatos de usuarios y conductores, 2024–2025",
              href: undefined,
            },
            {
              stat: "0 %",
              body: "de comisión cobra ConcertRide. El precio que ves es el precio que pagas, sin intermediarios.",
              source: "Tarifas públicas de cada plataforma, abril 2026",
              href: undefined,
            },
          ].map((item) => (
            <div key={item.stat} className="border border-cr-border p-4 space-y-2">
              <p className="font-display text-3xl uppercase text-cr-primary">{item.stat}</p>
              <p className="font-sans text-sm text-cr-text-muted leading-relaxed">{item.body}</p>
              <p className="font-mono text-[10px] text-cr-text-dim">
                {item.href ? (
                  <a href={item.href} target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-cr-primary">
                    {item.source}
                  </a>
                ) : item.source}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Enlaza ConcertRide ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <div className="space-y-2">
          <h2 className="font-display text-2xl md:text-3xl uppercase">Enlaza ConcertRide desde tu web</h2>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
            Si escribes sobre transporte a festivales, carpooling o movilidad sostenible, puedes enlazar
            ConcertRide libremente. Copia el fragmento HTML que mejor encaje con tu artículo.
          </p>
        </div>
        <ul className="space-y-4">
          {EMBED_SNIPPETS.map((s) => (
            <li key={s.id} className="border border-cr-border p-4 space-y-3">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-0.5">
                  <p className="font-sans text-sm text-cr-text">{s.label}</p>
                  <p className="font-mono text-[11px] text-cr-primary">Anchor text: «{s.anchor}»</p>
                </div>
                <CopyButton text={s.code} />
              </div>
              <pre className="font-mono text-[10px] text-cr-text-muted bg-black/30 p-3 rounded overflow-x-auto whitespace-pre-wrap break-all leading-relaxed">
                {s.code}
              </pre>
            </li>
          ))}
        </ul>
      </section>

      {/* ── Anchor text sugerido ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <h2 className="font-display text-2xl md:text-3xl uppercase">Anchor text recomendado</h2>
        <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
          Para artículos en español sobre festivales o transporte, estos textos de enlace son los más
          relevantes semánticamente. Usar variedad de anchor texts ayuda a Google a entender el contexto.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full font-sans text-sm border-collapse">
            <thead>
              <tr className="border-b border-cr-border">
                <th className="text-left py-2 pr-6 font-mono text-[11px] text-cr-primary uppercase tracking-wider">Texto del enlace</th>
                <th className="text-left py-2 font-mono text-[11px] text-cr-text-muted uppercase tracking-wider">Intención de búsqueda</th>
              </tr>
            </thead>
            <tbody>
              {ANCHOR_TEXTS.map((a) => (
                <tr key={a.text} className="border-b border-cr-border/50">
                  <td className="py-2 pr-6 text-cr-text font-mono text-xs">{a.text}</td>
                  <td className="py-2 text-cr-text-muted text-xs">{a.intent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ── Contacto de prensa ── */}
      <section id="contacto-prensa" className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-4">
        <h2 className="font-display text-2xl md:text-3xl uppercase">Contacto de prensa</h2>
        <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-xl">
          Para entrevistas, datos adicionales, imágenes en alta resolución, declaraciones específicas
          o colaboraciones editoriales, contacta directamente con el fundador.
        </p>
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="border border-cr-border p-5 space-y-2">
            <p className="font-mono text-[11px] uppercase tracking-wider text-cr-primary">Email principal</p>
            <p className="font-display text-base uppercase">Equipo ConcertRide</p>
            <p className="font-mono text-xs text-cr-text-muted">Fundador, ConcertRide ES</p>
            <a
              href="mailto:founder@concertride.me"
              className="font-sans text-sm text-cr-primary border-b border-cr-primary/40 hover:border-cr-primary transition-colors block"
            >
              founder@concertride.me
            </a>
            <a
              href="mailto:help@concertride.me"
              className="font-sans text-xs text-cr-text-muted border-b border-cr-border hover:border-cr-text hover:text-cr-text transition-colors block"
            >
              help@concertride.me (alternativo)
            </a>
          </div>
          <div className="border border-cr-border p-5 space-y-2">
            <p className="font-mono text-[11px] uppercase tracking-wider text-cr-primary">Reservar entrevista</p>
            <p className="font-sans text-sm text-cr-text leading-relaxed">
              Disponibilidad de lunes a viernes, 10:00–18:00 (CET). Entrevistas en castellano o inglés,
              presenciales en Madrid o videollamada.
            </p>
            <p className="font-mono text-xs text-cr-text-muted">
              Teléfono: <span className="text-cr-text">disponible bajo petición</span> (solicitar por email)
            </p>
            <p className="font-mono text-[11px] text-cr-text-dim pt-1">
              Tiempo de respuesta habitual: &lt; 24 h laborables.
            </p>
          </div>
        </div>
      </section>

      {/* ── Cobertura previa ── */}
      <section id="cobertura" className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-4">
        <div className="space-y-2">
          <h2 className="font-display text-2xl md:text-3xl uppercase">Cobertura previa</h2>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
            Apariciones de ConcertRide en medios, podcasts y publicaciones del sector. Si publicas
            una pieza sobre ConcertRide, escríbenos y la añadiremos.
          </p>
        </div>
        {PRESS_COVERAGE.length === 0 ? (
          <div className="border border-cr-border border-dashed p-6 max-w-2xl">
            <p className="font-mono text-xs uppercase tracking-wider text-cr-text-dim">Próximamente</p>
            <p className="font-sans text-sm text-cr-text-muted leading-relaxed mt-1">
              ConcertRide está en fase de lanzamiento. Aún no contamos con cobertura pública;
              esta sección se actualizará a medida que aparezcan piezas en medios.
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {PRESS_COVERAGE.map((c) => (
              <li key={c.url} className="border border-cr-border p-4">
                <a
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-display text-base uppercase text-cr-text hover:text-cr-primary transition-colors"
                >
                  {c.headline}
                </a>
                <p className="font-mono text-[11px] text-cr-text-muted mt-1">
                  {c.outlet} · {c.date}
                </p>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ── Cobertura recomendada ── */}
      <section className="max-w-6xl mx-auto px-6 pb-24 border-t border-cr-border pt-10 space-y-4">
        <h2 className="font-display text-lg uppercase text-cr-text-muted">Ángulos de cobertura sugeridos</h2>
        <ul className="flex flex-wrap gap-2">
          {[
            { label: "Sostenibilidad en festivales", to: "/blog/huella-carbono-festivales-carpooling" },
            { label: "Guía transporte festivales", to: "/guia-transporte-festivales" },
            { label: "Volver de madrugada", to: "/blog/como-volver-festival-madrugada" },
            { label: "Acerca de ConcertRide", to: "/acerca-de" },
          ].map((l) => (
            <li key={l.to}>
              <Link
                to={l.to}
                className="inline-flex items-center gap-1.5 font-sans text-xs text-cr-text-muted hover:text-cr-primary border border-cr-border hover:border-cr-primary px-3 py-1.5 transition-colors"
              >
                {l.label} <ArrowRight size={11} />
              </Link>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
