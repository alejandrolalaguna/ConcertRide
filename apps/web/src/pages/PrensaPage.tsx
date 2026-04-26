import { Link } from "react-router-dom";
import { ArrowRight, Download, ExternalLink } from "lucide-react";
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

export default function PrensaPage() {
  useSeoMeta({
    title: "Prensa y medios — ConcertRide ES",
    description:
      "Datos clave, cifras, recursos gráficos y contacto para medios. ConcertRide ES es la plataforma española de carpooling para conciertos y festivales de música. Sin comisiones, conductores verificados.",
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
    name: "ConcertRide ES",
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
      email: "alejandrolalaguna@gmail.com",
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
              stat: "0–30 min",
              body: "tiempo máximo de espera de taxi en la salida de un festival grande (vs 45–90 min real en pico).",
              source: "Estimación interna ConcertRide basada en datos de usuarios 2026",
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
            href="mailto:alejandrolalaguna@gmail.com"
            className="font-sans text-sm text-cr-primary border-b border-cr-primary/40 hover:border-cr-primary transition-colors"
          >
            alejandrolalaguna@gmail.com
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
