import { Link } from "react-router-dom";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-cr-border bg-cr-bg text-cr-text">
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        <div className="space-y-4">
          <p className="font-display text-lg uppercase tracking-[0.06em]">
            Concert<span className="text-cr-primary">Ride</span>
          </p>
          <p className="font-mono text-xs text-cr-text-muted leading-relaxed max-w-xs">
            La plataforma de viajes compartidos a conciertos en España. Sin intermediarios, sin comisiones.
          </p>
          <p className="font-mono text-xs text-cr-text-muted">
            ¿Dudas o incidencias?{" "}
            <a
              href="mailto:alejandrolalaguna@gmail.com"
              className="text-cr-primary hover:text-cr-primary/80 underline underline-offset-2"
            >
              alejandrolalaguna@gmail.com
            </a>
          </p>
        </div>

        <div>
          <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-cr-text-dim mb-4">
            Plataforma
          </p>
          <nav className="flex flex-col gap-2">
            <Link
              to="/concerts"
              className="font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors"
            >
              Explorar conciertos
            </Link>
            <Link
              to="/publish"
              className="font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors"
            >
              Publicar un viaje
            </Link>
            <Link
              to="/register"
              className="font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors"
            >
              Crear cuenta
            </Link>
          </nav>
        </div>

        <div>
          <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-cr-text-dim mb-4">
            Legal
          </p>
          <nav className="flex flex-col gap-2">
            <Link
              to="/aviso-legal"
              className="font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors"
            >
              Aviso legal
            </Link>
            <Link
              to="/privacidad"
              className="font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors"
            >
              Política de privacidad
            </Link>
            <Link
              to="/cookies"
              className="font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors"
            >
              Política de cookies
            </Link>
            <Link
              to="/terminos"
              className="font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors"
            >
              Términos y condiciones
            </Link>
          </nav>
        </div>
      </div>

      <div className="border-t border-cr-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <p className="font-mono text-[10px] text-cr-text-dim">
            © {year} ConcertRide ES. Todos los derechos reservados.
          </p>
          <p className="font-mono text-[10px] text-cr-text-dim flex flex-wrap gap-x-2 gap-y-1">
            <span>Datos:</span>
            <a
              href="https://developer.ticketmaster.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cr-primary transition-colors"
            >
              Ticketmaster
            </a>
            <span>·</span>
            <span>Mapas:</span>
            <a
              href="https://www.openstreetmap.org/copyright"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cr-primary transition-colors"
            >
              OpenStreetMap contributors
            </a>
            <span>·</span>
            <a
              href="https://carto.com/attributions"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cr-primary transition-colors"
            >
              CARTO
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
