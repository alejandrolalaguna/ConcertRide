import { Link } from "react-router-dom";
import { useI18n } from "@/lib/i18n";

// Click delegation: when any in-app link inside the footer is clicked, scroll
// the new page to the top after navigation. React Router preserves scroll
// position by default and that's awful UX when jumping from the footer (which
// lives at the bottom) into a fresh page.
function scrollTopOnInternalLink(e: React.MouseEvent<HTMLElement>) {
  const target = (e.target as HTMLElement).closest("a");
  if (!target) return;
  // Only intercept same-origin, plain left-clicks. Modified clicks (cmd/ctrl/
  // shift/middle) open in a new tab and shouldn't trigger our scroll.
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  if ((e as unknown as { button?: number }).button && (e as unknown as { button?: number }).button !== 0) return;
  const href = target.getAttribute("href");
  if (!href || href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
  // Schedule after React Router's navigation flush — top of the new page.
  requestAnimationFrame(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  });
}

export function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  return (
    <footer
      className="border-t border-cr-border bg-cr-bg text-cr-text"
      onClick={scrollTopOnInternalLink}
    >
      <div className="max-w-6xl mx-auto px-6 py-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10">
        <div className="space-y-4">
          <p className="font-display text-lg uppercase tracking-[0.06em]">
            Concert<span className="text-cr-primary">Ride</span>
          </p>
          <p className="font-mono text-xs text-cr-text-muted leading-relaxed max-w-xs">
            {t("footer.tagline")}
          </p>
          <p className="font-mono text-xs text-cr-text-muted">
            {t("footer.helpPrompt")}{" "}
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
            {t("footer.platform")}
          </p>
          <nav aria-label={t("footer.navMain")} className="flex flex-col gap-2">
            <Link
              to="/concerts"
              className="font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors"
            >
              {t("footer.exploreConcerts")}
            </Link>
            <Link
              to="/publish"
              className="font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors"
            >
              {t("footer.publishRide")}
            </Link>
            <Link
              to="/register"
              rel="nofollow"
              className="font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors"
            >
              {t("footer.createAccount")}
            </Link>
            <Link
              to="/como-funciona"
              className="font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors"
            >
              {t("footer.howItWorks")}
            </Link>
            <Link
              to="/rutas"
              className="font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors"
            >
              {t("footer.carpoolingRoutes")}
            </Link>
            <Link
              to="/mejor-carpooling-festivales-2026"
              className="font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors"
            >
              {t("footer.bestCarpooling2026")}
            </Link>
            <Link
              to="/viaje-compartido"
              className="font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors"
            >
              {t("footer.sharedRide")}
            </Link>
            <Link
              to="/compartir-coche-festival"
              className="font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors"
            >
              {t("footer.shareCarFestival")}
            </Link>
            <Link
              to="/compartir-gastos-festival"
              className="font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors"
            >
              {t("footer.shareCostsFestival")}
            </Link>
            <Link
              to="/guia-transporte-festivales"
              className="font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors"
            >
              {t("footer.transportGuide")}
            </Link>
            <Link
              to="/guia/festival-sin-coche"
              className="font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors"
            >
              {t("footer.festivalNoCar")}
            </Link>
            <Link
              to="/guia/presupuesto-festival-grupo"
              className="font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors"
            >
              {t("footer.groupBudget")}
            </Link>
            <Link
              to="/guia/seguridad-carpooling-festival"
              className="font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors"
            >
              {t("footer.carpoolingSafety")}
            </Link>
            <Link
              to="/guia/festival-primera-vez"
              className="font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors"
            >
              {t("footer.firstFestival")}
            </Link>
            <Link
              to="/guia/carpooling-conductor-festival"
              className="font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors"
            >
              {t("footer.driveCarpooling")}
            </Link>
            <Link
              to="/guia/festival-accesibilidad-movilidad-reducida"
              className="font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors"
            >
              {t("footer.accessibility")}
            </Link>
            <Link
              to="/guia/festival-veterano-aficionados-mayores-2026"
              className="font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors"
            >
              {t("footer.festivalGoers35")}
            </Link>
            <Link
              to="/faq"
              className="font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors"
            >
              {t("footer.faq")}
            </Link>
            <Link
              to="/blog"
              className="font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors"
            >
              {t("footer.blog")}
            </Link>
            <Link
              to="/prensa"
              className="font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors"
            >
              {t("footer.press")}
            </Link>
            <Link
              to="/datos"
              className="font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors"
            >
              {t("footer.data")}
            </Link>
            <Link
              to="/glosario"
              className="font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors"
              title="Glosario de carpooling y festivales — 100 términos definidos"
            >
              {t("footer.glossary")}
            </Link>
            <Link
              to="/acerca-de"
              className="font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors"
            >
              {t("footer.about")}
            </Link>
            <Link
              to="/autor/equipo-concertride"
              className="font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors"
              title="Sobre el autor — Equipo ConcertRide, founder de ConcertRide"
            >
              {t("footer.aboutAuthor")}
            </Link>
            <Link
              to="/contacto"
              className="font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors"
            >
              {t("footer.contact")}
            </Link>
          </nav>
        </div>

        <div>
          <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-cr-text-muted mb-4">
            {t("footer.festivals")}
          </p>
          <nav aria-label={t("footer.navFestivals")} className="flex flex-col gap-2">
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
            {t("footer.legal")}
          </p>
          <nav aria-label={t("footer.navLegal")} className="flex flex-col gap-2">
            <Link
              to="/privacidad"
              className="font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors"
              title="Política de privacidad GDPR"
            >
              {t("footer.privacyPolicy")}
            </Link>
            <Link
              to="/terminos"
              className="font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors"
              title="Términos y condiciones de uso"
            >
              {t("footer.terms")}
            </Link>
            <Link
              to="/aviso-legal"
              className="font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors"
              title="Aviso legal e información adicional"
            >
              {t("footer.legalNotice")}
            </Link>
            <Link
              to="/cookies"
              className="font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors"
              title="Política de cookies y seguimiento"
            >
              {t("footer.cookiesPolicy")}
            </Link>
          </nav>
        </div>
      </div>

      <div className="border-t border-cr-border">
        <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <p className="font-mono text-[10px] text-cr-text-muted">
              {t("footer.rightsReserved", { year })}
            </p>
            <p className="font-mono text-[10px] text-cr-text-muted mt-1">
              {t("footer.gdprData")}{" "}
              <a
                href="mailto:help@concertride.me?subject=SOLICITUD%20GDPR"
                className="hover:text-cr-primary transition-colors underline underline-offset-2"
              >
                help@concertride.me
              </a>
            </p>
          </div>
          <p className="font-mono text-[10px] text-cr-text-muted flex flex-wrap gap-x-2 gap-y-1">
            <span>{t("footer.concertData")}</span>
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
            <span>{t("footer.maps")}</span>
            <a
              href="https://www.openstreetmap.org/copyright"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-cr-primary transition-colors"
            >
              OpenStreetMap
            </a>
            <span>{t("footer.mapContributors")}</span>
            <span>·</span>
            <span>{t("footer.photos")}</span>
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
