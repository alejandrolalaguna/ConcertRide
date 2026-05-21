import { useState } from "react";
import { Link } from "react-router-dom";
import { Check, Copy, ExternalLink } from "lucide-react";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";

const YEAR = new Date().getFullYear();

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

const STATS_FOR_MEDIA = [
  { value: "4.200+", label: "Viajeros registrados en ConcertRide" },
  { value: "12.000+", label: "Viajes publicados (temporada 2024–2026)" },
  { value: "51", label: "Festivales cubiertos en España" },
  { value: "400+", label: "Rutas ciudad → festival activas" },
  { value: "72+", label: "Ciudades de origen con datos de transporte" },
  { value: "0 %", label: "Comisión de plataforma (única en España)" },
  { value: "3–22 €", label: "Precio por asiento (rango típico)" },
  { value: "450 t", label: "CO₂ estimadas evitadas (temporada 2024–2026)" },
];

const EMBED_WIDGET = `<!-- Widget ConcertRide — carpooling a festivales -->
<iframe
  src="${SITE_URL}/widget/concert/featured"
  width="320"
  height="480"
  frameborder="0"
  scrolling="no"
  title="Carpooling a festivales — ConcertRide"
  loading="lazy"
></iframe>`;

const OFFICIAL_DESCRIPTION_SHORT = `ConcertRide (concertride.me) es la plataforma española de carpooling exclusiva para conciertos y festivales de música. Conecta conductores con plazas libres y pasajeros que van al mismo evento, sin comisión de plataforma. Opera en toda España y cubre más de 51 festivales y miles de conciertos. Lanzada en 2024 desde Zaragoza.`;

const OFFICIAL_DESCRIPTION_LONG = `ConcertRide (concertride.me) es la plataforma española de carpooling especializada en conciertos y festivales de música. Fundada en 2024 por Equipo ConcertRide (Zaragoza), nace para resolver un problema real: el transporte a festivales en España es caro, impredecible y raramente cubre la vuelta de madrugada. Con más de 4.200 viajeros registrados y 12.000+ viajes publicados, ConcertRide opera bajo un modelo único en el mercado español: 0% de comisión de plataforma, verificación obligatoria del carnet de conducir para todos los conductores, y búsqueda por festival en lugar de por ruta genérica. El precio por asiento (3–22 € según distancia) cubre únicamente combustible y peajes, conforme al modelo legal de carpooling ratificado por el Tribunal Supremo español en 2017. ConcertRide cubre 51 festivales, 400+ rutas y 72+ ciudades de origen con datos de transporte.`;

export default function SalaPrensaPage() {
  const url = `${SITE_URL}/sala-de-prensa`;

  useSeoMeta({
    title: `Sala de prensa — ConcertRide | Datos y kit de medios ${YEAR}`,
    description: `Datos oficiales ConcertRide: 4.200+ viajeros, 12.000+ viajes, 51 festivales, 0% comisión. Kit de prensa y embed codes para periodistas.`,
    canonical: url,
    keywords: `ConcertRide prensa, kit de prensa carpooling, datos ConcertRide, estadísticas carpooling festivales España, información medios ConcertRide`,
  });

  // Organization schema removida en Sprint 10 dedup — la versión canónica se
  // emite en apps/web/index.html (SPA shell). El WebPage de abajo referencia
  // a la Organization vía @id (about) para mantener conexión semántica sin
  // duplicar la entidad.

  const jsonLdWebPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: `Sala de prensa — ConcertRide ${YEAR}`,
    url,
    inLanguage: "es-ES",
    dateModified: "2026-05-17",
    about: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "ConcertRide",
    },
    description: `Sala de prensa oficial de ConcertRide. Estadísticas, embed codes y descripción oficial para periodistas, bloggers y creadores de contenido.`,
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".lede", "[data-quotable]", ".speakable"],
    },
  };

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Sala de prensa", item: url },
    ],
  };

  return (
    <main id="main" className="min-h-dvh bg-cr-bg text-cr-text pt-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebPage) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />

      <div className="max-w-4xl mx-auto px-6 py-12 md:py-16 space-y-16">

        {/* ── Header ── */}
        <header className="border-b border-cr-border pb-8 space-y-3">
          <nav aria-label="Breadcrumb" className="font-mono text-[11px] text-cr-text-muted flex items-center gap-2">
            <Link to="/" className="hover:text-cr-primary">Inicio</Link>
            <span aria-hidden="true">/</span>
            <span className="text-cr-text-muted">Sala de prensa</span>
          </nav>
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
            Para medios y prensa
          </p>
          <h1 className="font-display text-4xl md:text-6xl uppercase leading-[0.92]">
            ConcertRide en los medios
          </h1>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
            Datos verificados, embed codes y textos oficiales para periodistas, bloggers y creadores de contenido que quieran cubrir ConcertRide, el carpooling a festivales o el transporte sostenible a conciertos en España.
          </p>
          <p className="font-sans text-xs text-cr-text-muted">
            Contacto para medios:{" "}
            <a href="mailto:help@concertride.me" className="text-cr-primary hover:underline">
              help@concertride.me
            </a>
          </p>
        </header>

        {/* ── Datos para medios ── */}
        <section className="space-y-6">
          <div className="space-y-1">
            <h2 className="font-display text-2xl md:text-3xl uppercase">Datos para medios</h2>
            <p className="font-sans text-sm text-cr-text-muted">
              Cifras verificadas a mayo {YEAR}. Citables con atribución a ConcertRide (concertride.me).
            </p>
          </div>

          <dl className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {STATS_FOR_MEDIA.map(({ value, label }) => (
              <div key={label} className="border border-cr-border p-4 space-y-1">
                <dd className="font-display text-3xl text-cr-primary">{value}</dd>
                <dt className="font-sans text-xs text-cr-text-muted leading-relaxed">{label}</dt>
              </div>
            ))}
          </dl>

          <div className="flex gap-3">
            <CopyButton
              text={STATS_FOR_MEDIA.map((s) => `${s.value} — ${s.label}`).join("\n")}
              label="Copiar todas las cifras"
            />
            <Link
              to="/datos"
              className="inline-flex items-center gap-1.5 font-sans text-xs text-cr-text-muted hover:text-cr-primary border border-cr-border hover:border-cr-primary px-3 py-1.5 transition-colors"
            >
              Dataset completo CC BY 4.0 <ExternalLink size={10} />
            </Link>
          </div>

          <div className="border border-cr-border/50 p-4 space-y-1 bg-white/[0.02]">
            <p className="font-mono text-[10px] text-cr-text-dim leading-relaxed">
              <strong className="text-cr-text-muted">Metodología:</strong> Viajeros y viajes: datos de registro y publicaciones en la plataforma ConcertRide, temporada 2024–2026. CO₂: cálculo teórico basado en 3,5 pasajeros/coche de media, 120 g CO₂/km (IDAE 2024), vs. viaje individual en coche. Dataset completo disponible bajo licencia CC BY 4.0 en{" "}
              <Link to="/datos" className="text-cr-primary hover:underline">concertride.me/datos</Link>.
            </p>
          </div>
        </section>

        {/* ── Sobre ConcertRide ── */}
        <section className="space-y-6 border-t border-cr-border pt-8">
          <h2 className="font-display text-2xl md:text-3xl uppercase">Sobre ConcertRide</h2>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
            Textos oficiales para usar en artículos, notas de prensa o menciones. Copiables directamente.
          </p>

          <div className="space-y-4">
            <div className="border border-cr-border p-4 space-y-3">
              <div className="flex items-center justify-between gap-4">
                <p className="font-mono text-[11px] text-cr-primary uppercase tracking-[0.1em]">Descripción corta (1 párrafo)</p>
                <CopyButton text={OFFICIAL_DESCRIPTION_SHORT} />
              </div>
              <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
                {OFFICIAL_DESCRIPTION_SHORT}
              </p>
            </div>

            <div className="border border-cr-border p-4 space-y-3">
              <div className="flex items-center justify-between gap-4">
                <p className="font-mono text-[11px] text-cr-primary uppercase tracking-[0.1em]">Descripción extendida (para artículos)</p>
                <CopyButton text={OFFICIAL_DESCRIPTION_LONG} />
              </div>
              <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
                {OFFICIAL_DESCRIPTION_LONG}
              </p>
            </div>
          </div>
        </section>

        {/* ── Embed codes ── */}
        <section className="space-y-6 border-t border-cr-border pt-8">
          <div className="space-y-1">
            <h2 className="font-display text-2xl md:text-3xl uppercase">Embed codes</h2>
            <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
              Inserta un widget de ConcertRide en tu artículo o blog con el siguiente código HTML.
            </p>
          </div>

          <div className="border border-cr-border p-4 space-y-3">
            <div className="flex items-center justify-between gap-4">
              <p className="font-mono text-[11px] text-cr-primary uppercase tracking-[0.1em]">Widget HTML</p>
              <CopyButton text={EMBED_WIDGET} label="Copiar código" />
            </div>
            <pre className="font-mono text-[10px] text-cr-text-muted bg-black/30 p-3 rounded overflow-x-auto whitespace-pre-wrap break-all leading-relaxed">
              {EMBED_WIDGET}
            </pre>
          </div>

          <div className="border border-cr-border p-4 space-y-3">
            <div className="flex items-center justify-between gap-4">
              <p className="font-mono text-[11px] text-cr-primary uppercase tracking-[0.1em]">Enlace HTML (para artículos web)</p>
              <CopyButton text={`<a href="${SITE_URL}" rel="noopener">ConcertRide — carpooling para festivales en España (0% comisión)</a>`} label="Copiar" />
            </div>
            <pre className="font-mono text-[10px] text-cr-text-muted bg-black/30 p-3 rounded overflow-x-auto whitespace-pre-wrap break-all leading-relaxed">
              {`<a href="${SITE_URL}" rel="noopener">ConcertRide — carpooling para festivales en España (0% comisión)</a>`}
            </pre>
          </div>
        </section>

        {/* ── Contacto y recursos ── */}
        <section className="space-y-4 border-t border-cr-border pt-8">
          <h2 className="font-display text-2xl md:text-3xl uppercase">Contacto y recursos</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            <a
              href="mailto:help@concertride.me"
              className="border border-cr-border p-5 hover:border-cr-primary transition-colors group space-y-2"
            >
              <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-cr-primary">Prensa</p>
              <p className="font-display text-lg uppercase leading-tight group-hover:text-cr-primary transition-colors">
                help@concertride.me →
              </p>
            </a>
            <Link
              to="/datos"
              className="border border-cr-border p-5 hover:border-cr-primary transition-colors group space-y-2"
            >
              <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-cr-primary">Dataset</p>
              <p className="font-display text-lg uppercase leading-tight group-hover:text-cr-primary transition-colors">
                Datos CC BY 4.0 →
              </p>
            </Link>
            <Link
              to="/acerca-de"
              className="border border-cr-border p-5 hover:border-cr-primary transition-colors group space-y-2"
            >
              <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-cr-primary">Empresa</p>
              <p className="font-display text-lg uppercase leading-tight group-hover:text-cr-primary transition-colors">
                Acerca de ConcertRide →
              </p>
            </Link>
            <a
              href={`${SITE_URL}/llms.txt`}
              target="_blank"
              rel="noopener noreferrer"
              className="border border-cr-border p-5 hover:border-cr-primary transition-colors group space-y-2"
            >
              <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.12em] text-cr-primary">Para IA</p>
              <p className="font-display text-lg uppercase leading-tight group-hover:text-cr-primary transition-colors flex items-center gap-2">
                llms.txt <ExternalLink size={14} />
              </p>
            </a>
          </div>
        </section>

      </div>
    </main>
  );
}
