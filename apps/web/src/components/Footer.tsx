import { Link } from "react-router-dom";
import { useI18n } from "@/lib/i18n";

// Al pulsar un enlace interno del pie, la nueva página arranca arriba. React
// Router conserva la posición de scroll por defecto y eso, desde el pie, es
// aterrizar al final de una página que no has leído.
function scrollTopOnInternalLink(e: React.MouseEvent<HTMLElement>) {
  const target = (e.target as HTMLElement).closest("a");
  if (!target) return;
  if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  if ((e as unknown as { button?: number }).button && (e as unknown as { button?: number }).button !== 0) return;
  const href = target.getAttribute("href");
  if (!href || href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:")) return;
  requestAnimationFrame(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });
  });
}

// Todos los enlaces internos del pie se conservan: son enlazado interno para
// SEO. Sólo cambia la forma. `key` es la clave i18n; `label` es texto fijo
// (nombres propios de festivales).
type FooterLink = { to: string; key?: string; label?: string; rel?: string; title?: string };

const PLATFORM_LINKS: FooterLink[] = [
  { to: "/concerts", key: "footer.exploreConcerts" },
  { to: "/publish", key: "footer.publishRide" },
  { to: "/register", key: "footer.createAccount", rel: "nofollow" },
  { to: "/como-funciona", key: "footer.howItWorks" },
  { to: "/rutas", key: "footer.carpoolingRoutes" },
  { to: "/mejor-carpooling-festivales-2026", key: "footer.bestCarpooling2026" },
  { to: "/viaje-compartido", key: "footer.sharedRide" },
  { to: "/compartir-coche-festival", key: "footer.shareCarFestival" },
  { to: "/compartir-gastos-festival", key: "footer.shareCostsFestival" },
  { to: "/guia-transporte-festivales", key: "footer.transportGuide" },
  { to: "/guia/festival-sin-coche", key: "footer.festivalNoCar" },
  { to: "/guia/presupuesto-festival-grupo", key: "footer.groupBudget" },
  { to: "/guia/seguridad-carpooling-festival", key: "footer.carpoolingSafety" },
  { to: "/guia/festival-primera-vez", key: "footer.firstFestival" },
  { to: "/guia/carpooling-conductor-festival", key: "footer.driveCarpooling" },
  { to: "/guia/festival-accesibilidad-movilidad-reducida", key: "footer.accessibility" },
  { to: "/guia/festival-veterano-aficionados-mayores-2026", key: "footer.festivalGoers35" },
  { to: "/faq", key: "footer.faq" },
  { to: "/blog", key: "footer.blog" },
  { to: "/prensa", key: "footer.press" },
  { to: "/datos", key: "footer.data" },
  { to: "/glosario", key: "footer.glossary", title: "Glosario de carpooling y festivales — 100 términos definidos" },
  { to: "/acerca-de", key: "footer.about" },
  { to: "/autor/equipo-concertride", key: "footer.aboutAuthor", title: "Sobre el autor — Equipo ConcertRide, founder de ConcertRide" },
  { to: "/contacto", key: "footer.contact" },
];

const FESTIVAL_LINKS: FooterLink[] = [
  { to: "/festivales/mad-cool", label: "Mad Cool" },
  { to: "/festivales/primavera-sound", label: "Primavera Sound" },
  { to: "/festivales/sonar", label: "Sónar" },
  { to: "/festivales/fib", label: "FIB Benicàssim" },
  { to: "/festivales/bbk-live", label: "BBK Live" },
  { to: "/festivales/resurrection-fest", label: "Resurrection Fest" },
  { to: "/festivales/vina-rock", label: "Viña Rock" },
  { to: "/festivales/arenal-sound", label: "Arenal Sound" },
];

const LEGAL_LINKS: FooterLink[] = [
  { to: "/privacidad", key: "footer.privacyPolicy", title: "Política de privacidad GDPR" },
  { to: "/terminos", key: "footer.terms", title: "Términos y condiciones de uso" },
  { to: "/aviso-legal", key: "footer.legalNotice", title: "Aviso legal e información adicional" },
  { to: "/cookies", key: "footer.cookiesPolicy", title: "Política de cookies y seguimiento" },
];

export function Footer() {
  const { t } = useI18n();
  const year = new Date().getFullYear();

  const renderLink = (l: FooterLink) => (
    <li key={l.to}>
      <Link
        to={l.to}
        rel={l.rel}
        title={l.title}
        className="cr-link inline-block text-[13px] leading-snug text-cr-text-muted hover:text-cr-text"
      >
        {l.key ? t(l.key) : l.label}
      </Link>
    </li>
  );

  return (
    <footer className="border-t border-cr-border bg-cr-bg text-cr-text" onClick={scrollTopOnInternalLink}>
      {/* Cierre: el nombre como cartel, y una sola frase */}
      <div className="max-w-6xl mx-auto px-6 pt-[var(--rhythm-2)] pb-[var(--rhythm-1)] grid grid-cols-1 md:grid-cols-12 gap-8 items-end">
        <p className="md:col-span-7 font-display text-display-l leading-[0.9]">
          Concert<span className="text-cr-primary">Ride</span>
        </p>
        <div className="md:col-span-5 space-y-3 md:pb-2">
          <p className="cr-prose text-sm leading-relaxed text-cr-text-muted max-w-sm">{t("footer.tagline")}</p>
          <p className="text-sm text-cr-text-muted">
            {t("footer.helpPrompt")}{" "}
            <a href="mailto:help@concertride.me" className="cr-link text-cr-primary">
              help@concertride.me
            </a>
          </p>
        </div>
      </div>

      {/* Columnas de enlaces sobre filetes */}
      <div className="max-w-6xl mx-auto px-6 pb-[var(--rhythm-2)] grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-x-8 gap-y-10 border-t border-cr-border pt-10">
        <div className="md:col-span-6">
          <p className="cr-label text-cr-text-muted mb-5">{t("footer.platform")}</p>
          <nav aria-label={t("footer.navMain")}>
            <ul className="columns-1 sm:columns-2 gap-x-8 space-y-2.5 [&>li]:break-inside-avoid">
              {PLATFORM_LINKS.map(renderLink)}
            </ul>
          </nav>
        </div>

        <div className="md:col-span-3">
          <p className="cr-label text-cr-text-muted mb-5">{t("footer.festivals")}</p>
          <nav aria-label={t("footer.navFestivals")}>
            <ul className="space-y-2.5">{FESTIVAL_LINKS.map(renderLink)}</ul>
          </nav>
        </div>

        <div className="md:col-span-3">
          <p className="cr-label text-cr-text-muted mb-5">{t("footer.legal")}</p>
          <nav aria-label={t("footer.navLegal")}>
            <ul className="space-y-2.5">{LEGAL_LINKS.map(renderLink)}</ul>
          </nav>
        </div>
      </div>

      {/* Pie del pie: derechos, GDPR y créditos obligatorios */}
      <div className="border-t border-cr-border">
        <div className="max-w-6xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-[11px] leading-relaxed text-cr-text-muted">
          <div>
            <p className="cr-tabular">{t("footer.rightsReserved", { year })}</p>
            <p className="mt-1">
              {t("footer.gdprData")}{" "}
              <a href="mailto:help@concertride.me?subject=SOLICITUD%20GDPR" className="cr-link text-cr-text">
                help@concertride.me
              </a>
            </p>
          </div>
          <p className="flex flex-wrap gap-x-2 gap-y-1">
            <span>{t("footer.concertData")}</span>
            <a
              href="https://www.ticketmaster.es"
              target="_blank"
              rel="noopener noreferrer"
              className="cr-link text-cr-text"
              title="Datos de eventos proporcionados por Ticketmaster via Discovery API v2"
            >
              Ticketmaster®
            </a>
            <span aria-hidden="true">·</span>
            <span>{t("footer.maps")}</span>
            <a
              href="https://www.openstreetmap.org/copyright"
              target="_blank"
              rel="noopener noreferrer"
              className="cr-link text-cr-text"
            >
              OpenStreetMap
            </a>
            <span>{t("footer.mapContributors")}</span>
            <span aria-hidden="true">·</span>
            <span>{t("footer.photos")}</span>
            <a href="https://unsplash.com" target="_blank" rel="noopener noreferrer" className="cr-link text-cr-text">
              Unsplash
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
