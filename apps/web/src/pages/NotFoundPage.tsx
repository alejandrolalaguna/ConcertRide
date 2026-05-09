import { Link } from "react-router-dom";
import { ArrowRight, Music2, MapPin, Route, BookOpen } from "lucide-react";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";

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
  useSeoMeta({
    title: "404 · Página no encontrada | ConcertRide",
    description: "Esta URL no existe en ConcertRide. Explora conciertos, festivales y rutas de carpooling disponibles.",
    canonical: `${SITE_URL}/404`,
    noindex: true,
  });

  return (
    <main
      id="main"
      role="alert"
      className="min-h-dvh bg-cr-bg text-cr-text px-6 py-16"
    >
      <div className="max-w-3xl mx-auto">
        {/* Hero */}
        <div className="text-center space-y-4 mb-14">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.24em] text-cr-secondary">
            Error 404
          </p>
          <h1 className="font-display text-5xl md:text-7xl uppercase leading-[0.9]">
            Página no encontrada.
          </h1>
          <p className="font-sans text-sm md:text-base text-cr-text-muted max-w-md mx-auto">
            Esta URL no existe, o el viaje que buscas ya no está disponible. Prueba desde el inicio o explora los eventos activos.
          </p>
          <div className="flex flex-wrap justify-center gap-3 pt-2">
            <Link
              to="/"
              className="bg-cr-primary text-black font-sans font-semibold uppercase tracking-[0.12em] text-sm border-2 border-black px-6 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-100 inline-flex items-center gap-2"
            >
              Volver al inicio
            </Link>
            <Link
              to="/concerts"
              className="bg-transparent text-cr-text font-sans font-semibold uppercase tracking-[0.12em] text-sm border-2 border-cr-border hover:border-cr-primary hover:text-cr-primary px-6 py-3 transition-colors duration-150 inline-flex items-center gap-2"
            >
              Explorar conciertos <ArrowRight size={14} />
            </Link>
          </div>
        </div>

        {/* Internal links grid */}
        <div className="grid md:grid-cols-2 gap-8">

          {/* Festivales */}
          <section>
            <h2 className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary mb-3 flex items-center gap-2">
              <Music2 size={11} /> Festivales con carpooling
            </h2>
            <ul className="space-y-1.5">
              {TOP_FESTIVALS.map((f) => (
                <li key={f.slug}>
                  <Link
                    to={`/festivales/${f.slug}`}
                    className="font-sans text-sm text-cr-text-muted hover:text-cr-primary transition-colors inline-flex items-center gap-1.5"
                  >
                    <ArrowRight size={11} className="text-cr-primary/50 flex-shrink-0" />
                    Carpooling al {f.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/festivales" className="font-sans text-xs text-cr-primary hover:underline">
                  Ver todos los festivales →
                </Link>
              </li>
            </ul>
          </section>

          {/* Ciudades */}
          <section>
            <h2 className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary mb-3 flex items-center gap-2">
              <MapPin size={11} /> Conciertos por ciudad
            </h2>
            <ul className="space-y-1.5">
              {TOP_CITIES.map((c) => (
                <li key={c.slug}>
                  <Link
                    to={`/conciertos/${c.slug}`}
                    className="font-sans text-sm text-cr-text-muted hover:text-cr-primary transition-colors inline-flex items-center gap-1.5"
                  >
                    <ArrowRight size={11} className="text-cr-primary/50 flex-shrink-0" />
                    Conciertos en {c.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/concerts" className="font-sans text-xs text-cr-primary hover:underline">
                  Ver todos los conciertos →
                </Link>
              </li>
            </ul>
          </section>

          {/* Rutas */}
          <section>
            <h2 className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary mb-3 flex items-center gap-2">
              <Route size={11} /> Rutas de carpooling populares
            </h2>
            <ul className="space-y-1.5">
              {TOP_ROUTES.map((r) => (
                <li key={r.slug}>
                  <Link
                    to={`/rutas/${r.slug}`}
                    className="font-sans text-sm text-cr-text-muted hover:text-cr-primary transition-colors inline-flex items-center gap-1.5"
                  >
                    <ArrowRight size={11} className="text-cr-primary/50 flex-shrink-0" />
                    {r.label}
                  </Link>
                </li>
              ))}
              <li>
                <Link to="/rutas" className="font-sans text-xs text-cr-primary hover:underline">
                  Ver todas las rutas →
                </Link>
              </li>
            </ul>
          </section>

          {/* Guías */}
          <section>
            <h2 className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary mb-3 flex items-center gap-2">
              <BookOpen size={11} /> Guías y recursos
            </h2>
            <ul className="space-y-1.5">
              {[
                { to: "/guia-transporte-festivales", label: "Guía de transporte a festivales" },
                { to: "/blog/autobuses-festivales-espana-2026", label: "Autobuses a festivales 2026" },
                { to: "/blog/como-volver-festival-madrugada", label: "Cómo volver de madrugada" },
                { to: "/blog/festivales-musica-espana-2026", label: "Festivales de España 2026" },
                { to: "/como-funciona", label: "Cómo funciona ConcertRide" },
              ].map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    className="font-sans text-sm text-cr-text-muted hover:text-cr-primary transition-colors inline-flex items-center gap-1.5"
                  >
                    <ArrowRight size={11} className="text-cr-primary/50 flex-shrink-0" />
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </main>
  );
}
