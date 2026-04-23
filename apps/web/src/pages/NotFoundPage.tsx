import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useSeoMeta } from "@/lib/useSeoMeta";

export default function NotFoundPage() {
  useSeoMeta({
    title: "404 — Página no encontrada",
    description:
      "Esta URL no existe en ConcertRide ES. Vuelve al inicio, explora conciertos o consulta nuestra sección de ayuda.",
    noindex: true,
  });

  return (
    <main
      id="main"
      role="alert"
      className="min-h-dvh bg-cr-bg text-cr-text flex items-center justify-center px-6 py-16"
    >
      <div className="max-w-xl text-center space-y-6">
        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.24em] text-cr-secondary">
          Error 404
        </p>
        <h1 className="font-display text-6xl md:text-8xl uppercase leading-[0.9]">
          Página no encontrada.
        </h1>
        <p className="font-sans text-sm md:text-base text-cr-text-muted">
          Esta URL no existe, o el concierto / viaje que buscas ya no está disponible. Prueba
          desde el inicio o explora los eventos activos.
        </p>

        <div className="flex flex-wrap justify-center gap-3 pt-4">
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

        <div className="pt-8 flex flex-wrap justify-center gap-x-6 gap-y-2 font-sans text-xs text-cr-text-muted">
          <Link to="/como-funciona" className="hover:text-cr-primary transition-colors">
            Cómo funciona
          </Link>
          <Link to="/faq" className="hover:text-cr-primary transition-colors">
            FAQ
          </Link>
          <Link to="/contacto" className="hover:text-cr-primary transition-colors">
            Contacto
          </Link>
        </div>
      </div>
    </main>
  );
}
