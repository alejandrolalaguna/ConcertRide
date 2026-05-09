import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Copy, Download, ExternalLink } from "lucide-react";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";

const STATS = [
  { label: "Festivales cubiertos", value: "16" },
  { label: "Ciudades con landing page", value: "10" },
  { label: "Rutas programáticas", value: "93" },
  { label: "Cobertura", value: "España" },
  { label: "Comisión de plataforma", value: "0 %" },
  { label: "Fondada", value: "2026" },
];

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
  { label: "Logo SVG (alta resolución)", href: `${SITE_URL}/favicon.svg`, ext: true },
  { label: "OG Image 1200×630 PNG", href: `${SITE_URL}/og/home.png`, ext: true },
  { label: "llms.txt (datos estructurados para IA)", href: `${SITE_URL}/llms.txt`, ext: true },
  { label: "llms-full.txt (contexto extendido)", href: `${SITE_URL}/llms-full.txt`, ext: true },
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
  useSeoMeta({
    title: "Prensa y medios — Kit de prensa ConcertRide | Carpooling festivales",
    description:
      "Datos clave, cifras, recursos gráficos y contacto para medios. ConcertRide es la plataforma española de carpooling para conciertos y festivales de música. Sin comisiones, conductores verificados.",
    canonical: `${SITE_URL}/prensa`,
    keywords: "press kit ConcertRide, medios ConcertRide, datos ConcertRide, carpooling festivales España prensa",
  });

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Prensa", item: `${SITE_URL}/prensa` },
    ],
  };

  const jsonLdOrg = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${SITE_URL}/#organization`,
    name: "ConcertRide",
    url: SITE_URL,
    logo: `${SITE_URL}/favicon.svg`,
    image: `${SITE_URL}/og/home.png`,
    description:
      "Plataforma española de carpooling exclusiva para conciertos y festivales. Conecta conductores y pasajeros que van al mismo evento para compartir gastos de desplazamiento. Sin comisiones.",
    foundingDate: "2026",
    areaServed: { "@type": "Country", name: "Spain" },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "Press",
      email: "help@concertride.me",
    },
  };

  return (
    <main id="main" className="min-h-dvh bg-cr-bg text-cr-text pt-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }} />

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
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
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

      {/* ── Recursos gráficos ── */}
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-6">
        <h2 className="font-display text-2xl md:text-3xl uppercase">Recursos gráficos</h2>
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
        <p className="font-sans text-xs text-cr-text-muted leading-relaxed max-w-2xl">
          El logotipo y los activos gráficos de ConcertRide pueden usarse en contexto editorial
          (artículos, reseñas, comparativas) sin autorización previa. Para campañas publicitarias
          o usos comerciales, contacta con nosotros.
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
      <section className="max-w-6xl mx-auto px-6 pb-16 border-t border-cr-border pt-12 space-y-4">
        <h2 className="font-display text-2xl md:text-3xl uppercase">Contacto de prensa</h2>
        <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-xl">
          Para entrevistas, datos adicionales, imágenes en alta resolución o colaboraciones
          editoriales, contacta directamente:
        </p>
        <div className="border border-cr-border p-5 space-y-2 max-w-sm">
          <p className="font-display text-base uppercase">Alejandro Lalaguna</p>
          <p className="font-mono text-xs text-cr-text-muted">Fundador, ConcertRide ES</p>
          <a
            href="mailto:help@concertride.me"
            className="font-sans text-sm text-cr-primary border-b border-cr-primary/40 hover:border-cr-primary transition-colors"
          >
            help@concertride.me
          </a>
        </div>
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
