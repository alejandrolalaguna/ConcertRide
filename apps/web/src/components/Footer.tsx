import { Link } from "react-router-dom";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-cr-border bg-cr-bg text-cr-text">
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
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
              href="mailto:help@concertride.me"
              className="text-cr-primary hover:text-cr-primary/80 underline underline-offset-2"
            >
              help@concertride.me
            </a>
          </p>
        </div>

        <div>
          <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-cr-text-muted mb-4">
            Plataforma
          </p>
          <nav aria-label="Navegación principal" className="flex flex-col gap-2">
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
              rel="nofollow"
              className="font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors"
            >
              Crear cuenta
            </Link>
            <Link
              to="/como-funciona"
              className="font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors"
            >
              Cómo funciona
            </Link>
            <Link
              to="/rutas"
              className="font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors"
            >
              Rutas de carpooling
            </Link>
            <Link
              to="/guia-transporte-festivales"
              className="font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors"
            >
              Guía de transporte
            </Link>
            <Link
              to="/guia/festival-sin-coche"
              className="font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors"
            >
              Festival sin coche
            </Link>
            <Link
              to="/guia/presupuesto-festival-grupo"
              className="font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors"
            >
              Presupuesto festival grupo
            </Link>
            <Link
              to="/guia/seguridad-carpooling-festival"
              className="font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors"
            >
              Seguridad carpooling
            </Link>
            <Link
              to="/faq"
              className="font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors"
            >
              Preguntas frecuentes
            </Link>
            <Link
              to="/blog"
              className="font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors"
            >
              Blog
            </Link>
            <Link
              to="/prensa"
              className="font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors"
            >
              Prensa
            </Link>
            <Link
              to="/datos"
              className="font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors"
            >
              Datos
            </Link>
            <Link
              to="/acerca-de"
              className="font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors"
            >
              Acerca de
            </Link>
            <Link
              to="/autor/alejandro-lalaguna"
              className="font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors"
              title="Sobre el autor — Alejandro Lalaguna, founder de ConcertRide"
            >
              Sobre el autor
            </Link>
            <Link
              to="/contacto"
              className="font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors"
            >
              Contacto
            </Link>
          </nav>
        </div>

        <div>
          <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-cr-text-muted mb-4">
            Festivales
          </p>
          <nav aria-label="Festivales" className="flex flex-col gap-2">
            <Link
              to="/festivales/mad-cool"
              className="font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors"
            >
              Mad Cool
            </Link>
            <Link
              to="/festivales/primavera-sound"
              className="font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors"
            >
              Primavera Sound
            </Link>
            <Link
              to="/festivales/sonar"
              className="font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors"
            >
              Sónar
            </Link>
            <Link
              to="/festivales/fib"
              className="font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors"
            >
              FIB Benicàssim
            </Link>
            <Link
              to="/festivales/bbk-live"
              className="font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors"
            >
              BBK Live
            </Link>
            <Link
              to="/festivales/resurrection-fest"
              className="font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors"
            >
              Resurrection Fest
            </Link>
            <Link
              to="/festivales/vina-rock"
              className="font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors"
            >
              Viña Rock
            </Link>
            <Link
              to="/festivales/arenal-sound"
              className="font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors"
            >
              Arenal Sound
            </Link>
          </nav>
        </div>

        <div>
          <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-cr-text-muted mb-4">
            Legal
          </p>
          <nav aria-label="Legal y privacidad" className="flex flex-col gap-2">
            <Link
              to="/privacidad"
              className="font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors"
              title="Política de privacidad GDPR"
            >
              Política de privacidad
            </Link>
            <Link
              to="/terminos"
              className="font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors"
              title="Términos y condiciones de uso"
            >
              Términos y condiciones
            </Link>
            <Link
              to="/aviso-legal"
              className="font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors"
              title="Aviso legal e información adicional"
            >
              Aviso legal
            </Link>
            <Link
              to="/cookies"
              className="font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors"
              title="Política de cookies y seguimiento"
            >
              Política de cookies
            </Link>
          </nav>
        </div>
      </div>

      <div className="border-t border-cr-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] text-cr-text-muted">
              © {year} ConcertRide ES. Todos los derechos reservados.
            </p>
            <p className="font-mono text-[10px] text-cr-text-muted mt-1">
              GDPR/Datos:{" "}
              <a
                href="mailto:help@concertride.me?subject=SOLICITUD%20GDPR"
                className="hover:text-cr-primary transition-colors underline underline-offset-2"
              >
                help@concertride.me
              </a>
            </p>
          </div>
          <p className="font-mono text-[10px] text-cr-text-muted flex flex-wrap gap-x-2 gap-y-1">
            <span>Datos de conciertos:</span>
            <a
              href="https://www.ticketmaster.es"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cr-primary transition-colors"
              title="Datos de eventos proporcionados por Ticketmaster via Discovery API v2"
            >
              Ticketmaster®
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
            <span>·</span>
            <span>Fotografías:</span>
            <a
              href="https://unsplash.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cr-primary transition-colors"
            >
              Unsplash
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
