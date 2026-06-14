import { Link } from "react-router-dom";
import { motion } from "motion/react";
import { ArrowRight, Music2, MapPin, Route, BookOpen } from "lucide-react";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";
import { useI18n } from "@/lib/i18n";

const TOP_FESTIVALS = [
  { slug: "mad-cool", label: "Mad Cool Festival" },
  { slug: "primavera-sound", label: "Primavera Sound" },
  { slug: "sonar", label: "Sónar Barcelona" },
  { slug: "fib", label: "FIB Benicàssim" },
  { slug: "bbk-live", label: "BBK Live Bilbao" },
  { slug: "arenal-sound", label: "Arenal Sound" },
];

const TOP_CITIES = [
  { slug: "madrid", label: "Madrid" },
  { slug: "barcelona", label: "Barcelona" },
  { slug: "valencia", label: "Valencia" },
  { slug: "sevilla", label: "Sevilla" },
  { slug: "bilbao", label: "Bilbao" },
  { slug: "malaga", label: "Málaga" },
];

const TOP_ROUTES = [
  { slug: "madrid-mad-cool", label: "Madrid → Mad Cool" },
  { slug: "madrid-primavera-sound", label: "Madrid → Primavera Sound" },
  { slug: "valencia-arenal-sound", label: "Valencia → Arenal Sound" },
  { slug: "madrid-bbk-live", label: "Madrid → BBK Live" },
];

export default function NotFoundPage() {
  const { t } = useI18n();
  useSeoMeta({
    title: "Página no encontrada — ¿Buscabas algo? · ConcertRide",
    description:
      "Esta URL no existe en ConcertRide. Te dejamos sugerencias: festivales con carpooling, conciertos por ciudad, rutas populares y guías de transporte.",
    canonical: `${SITE_URL}/404`,
    noindex: true,
    // 404 should be discoverable for outbound link follow (SEO best practice
    // for soft-404 recovery): noindex, FOLLOW lets Googlebot crawl through
    // to indexable destinations even though this URL itself isn't indexed.
    noindexFollow: true,
  });

  return (
    <main
      id="main"
      role="alert"
      className="relative min-h-dvh bg-cr-bg text-cr-text px-6 py-24 overflow-hidden"
    >
      {/* Atmospheric glows */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(255,79,0,0.07) 0%, transparent 70%)" }}
      />
      <div
        aria-hidden="true"
        className="absolute bottom-0 right-0 w-[400px] h-[300px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 100% 100%, rgba(219,255,0,0.04) 0%, transparent 70%)" }}
      />

      <div className="relative max-w-3xl mx-auto">
        {/* Hero */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="text-center space-y-5 mb-16"
        >
          <p className="font-mono text-[10px] font-semibold uppercase tracking-[0.24em] text-cr-secondary">
            {t("notFound.errorLabel")}
          </p>
          <h1 className="font-display text-5xl md:text-7xl uppercase leading-[0.9] tracking-tight">
            {t("notFound.titleLine1")}
            <br />
            {t("notFound.titleLine2")}
          </h1>
          <p className="font-sans text-sm md:text-base text-white/40 max-w-md mx-auto leading-relaxed">
            {t("notFound.subtitle")}
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link
              to="/"
              className="cr-btn-shine inline-flex items-center gap-2 bg-cr-primary text-black font-sans font-semibold uppercase tracking-[0.14em] text-sm px-6 py-4 hover:bg-[#c8ec00] transition-colors duration-150"
            >
              {t("notFound.backHome")}
            </Link>
            <Link
              to="/concerts"
              className="inline-flex items-center gap-2 bg-transparent text-cr-text-muted font-sans font-semibold uppercase tracking-[0.12em] text-sm border border-white/[0.1] hover:border-cr-primary hover:text-cr-primary px-6 py-4 transition-all duration-150"
            >
              {t("notFound.exploreConcerts")} <ArrowRight size={13} aria-hidden="true" />
            </Link>
          </div>
        </motion.div>

        {/* Divider */}
        <div aria-hidden="true" className="mb-12 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(255,255,255,0.06), transparent)" }} />

        {/* Internal links grid */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="grid md:grid-cols-2 gap-8"
        >
          {/* Festivales */}
          <section>
            <h2 className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-cr-primary mb-4 flex items-center gap-2">
              <Music2 size={10} aria-hidden="true" /> {t("notFound.festivalsHeading")}
            </h2>
            <ul className="space-y-2">
              {TOP_FESTIVALS.map((f) => (
                <li key={f.slug}>
                  <Link
                    to={`/festivales/${f.slug}`}
                    className="font-sans text-sm text-white/40 hover:text-cr-primary transition-colors inline-flex items-center gap-1.5 group"
                  >
                    <ArrowRight size={10} className="text-cr-primary/40 group-hover:text-cr-primary flex-shrink-0 transition-colors" aria-hidden="true" />
                    {t("notFound.festivalLinkPrefix")} {f.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/festivales" className="font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-cr-primary hover:text-white transition-colors">
                  {t("notFound.seeAllMasc")}
                </Link>
              </li>
            </ul>
          </section>

          {/* Ciudades */}
          <section>
            <h2 className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-cr-primary mb-4 flex items-center gap-2">
              <MapPin size={10} aria-hidden="true" /> {t("notFound.citiesHeading")}
            </h2>
            <ul className="space-y-2">
              {TOP_CITIES.map((c) => (
                <li key={c.slug}>
                  <Link
                    to={`/conciertos/${c.slug}`}
                    className="font-sans text-sm text-white/40 hover:text-cr-primary transition-colors inline-flex items-center gap-1.5 group"
                  >
                    <ArrowRight size={10} className="text-cr-primary/40 group-hover:text-cr-primary flex-shrink-0 transition-colors" aria-hidden="true" />
                    {t("notFound.cityLinkPrefix")} {c.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/concerts" className="font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-cr-primary hover:text-white transition-colors">
                  {t("notFound.seeAllMasc")}
                </Link>
              </li>
            </ul>
          </section>

          {/* Rutas */}
          <section>
            <h2 className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-cr-primary mb-4 flex items-center gap-2">
              <Route size={10} aria-hidden="true" /> {t("notFound.routesHeading")}
            </h2>
            <ul className="space-y-2">
              {TOP_ROUTES.map((r) => (
                <li key={r.slug}>
                  <Link
                    to={`/rutas/${r.slug}`}
                    className="font-sans text-sm text-white/40 hover:text-cr-primary transition-colors inline-flex items-center gap-1.5 group"
                  >
                    <ArrowRight size={10} className="text-cr-primary/40 group-hover:text-cr-primary flex-shrink-0 transition-colors" aria-hidden="true" />
                    {r.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/rutas" className="font-mono text-[10px] font-semibold uppercase tracking-[0.1em] text-cr-primary hover:text-white transition-colors">
                  {t("notFound.seeAllFem")}
                </Link>
              </li>
            </ul>
          </section>

          {/* Guías */}
          <section>
            <h2 className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-cr-primary mb-4 flex items-center gap-2">
              <BookOpen size={10} aria-hidden="true" /> {t("notFound.guidesHeading")}
            </h2>
            <ul className="space-y-2">
              {[
                { to: "/guia-transporte-festivales", labelKey: "notFound.guideTransport" },
                { to: "/blog/autobuses-festivales-espana-2026", labelKey: "notFound.guideBuses" },
                { to: "/blog/como-volver-festival-madrugada", labelKey: "notFound.guideReturn" },
                { to: "/blog/festivales-musica-espana-2026", labelKey: "notFound.guideFestivals2026" },
                { to: "/como-funciona", labelKey: "notFound.guideHowItWorks" },
              ].map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="font-sans text-sm text-white/40 hover:text-cr-primary transition-colors inline-flex items-center gap-1.5 group"
                  >
                    <ArrowRight size={10} className="text-cr-primary/40 group-hover:text-cr-primary flex-shrink-0 transition-colors" aria-hidden="true" />
                    {t(item.labelKey)}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </motion.div>
      </div>
    </main>
  );
}
