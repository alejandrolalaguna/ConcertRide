import { Suspense, lazy, useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";
import type { Concert, Ride } from "@concertride/types";
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics-events";
import { useI18n } from "@/lib/i18n";
import { formatDay } from "@/lib/format";
import { ClientOnly } from "@/components/ClientOnly";
import { ProgressRail } from "@/components/system";

const MapView = lazy(() => import("@/components/MapView"));

/** Precio mínimo del catálogo de rutas (seatPrice() por defecto). */
const MIN_SEAT_PRICE = 3;

interface Props {
  /** Conciertos próximos (≤90 días) para el mapa. */
  mapConcerts: Concert[];
  /** Viajes activos asociados a esos conciertos. */
  mapRides: Ride[];
  /** Concierto destacado para el ticket: el más próximo con viajes, o el más próximo. */
  featured: Concert | null;
  /** null mientras carga; [] si no hay datos. */
  loaded: boolean;
}

/**
 * El cartel que se abre.
 *
 * Estado inicial (y estado SSR / reduced-motion / móvil): titular como cartel a
 * la izquierda, una ventana enmarcada a la derecha con el ticket encima. En
 * escritorio con movimiento, al hacer scroll la ventana se abre a sangre y
 * descubre el mapa real de conciertos y viajes activos (A1 del banco: pin,
 * clip-path, contra-zoom, titular que se retira, raíl de avance). Una sola vez
 * en todo el sitio.
 *
 * Todo el texto indexable está en el DOM desde el servidor. El mapa es
 * decorativo y se monta sólo en cliente.
 */
export function Hero({ mapConcerts, mapRides, featured, loaded }: Props) {
  const { t } = useI18n();
  const stageRef = useRef<HTMLElement | null>(null);
  const slotRef = useRef<HTMLDivElement | null>(null);
  const clipRef = useRef<HTMLDivElement | null>(null);

  // La capa del mapa ocupa todo el escenario y se recorta a la ventana. El
  // recorte inicial se calcula midiendo la ventana (también con reduced-motion,
  // donde no hay GSAP). La coreografía de apertura lo lee de `--hero-clip`.
  useEffect(() => {
    const stage = stageRef.current;
    const slot = slotRef.current;
    const clip = clipRef.current;
    if (!stage || !slot || !clip) return;
    const measure = () => {
      const s = stage.getBoundingClientRect();
      const r = slot.getBoundingClientRect();
      if (s.width === 0 || s.height === 0) return;
      const top = ((r.top - s.top) / s.height) * 100;
      const left = ((r.left - s.left) / s.width) * 100;
      const bottom = ((s.bottom - r.bottom) / s.height) * 100;
      const right = ((s.right - r.right) / s.width) * 100;
      const v = `inset(${top.toFixed(2)}% ${right.toFixed(2)}% ${bottom.toFixed(2)}% ${left.toFixed(2)}%)`;
      stage.style.setProperty("--hero-clip", v);
      if (!stage.hasAttribute("data-hero-open")) {
        clip.style.clipPath = v;
        // Sin coreografía (móvil, reduced-motion): centrar el mapa en la ventana.
        const plate = clip.firstElementChild as HTMLElement | null;
        if (plate) {
          const dx = r.left + r.width / 2 - (s.left + s.width / 2);
          const dy = r.top + r.height / 2 - (s.top + s.height / 2);
          plate.style.transform = `translate(${dx.toFixed(1)}px, ${dy.toFixed(1)}px)`;
        }
      }
    };
    measure();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(measure) : null;
    ro?.observe(stage);
    window.addEventListener("resize", measure);
    return () => {
      ro?.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  const activeRides = mapRides.length;

  return (
    <section
      ref={stageRef}
      data-hero-stage
      aria-labelledby="hero-title"
      className="cr-noise relative overflow-hidden bg-cr-bg lg:min-h-[100svh] flex items-center"
    >
      {/* Capa B · el mapa, recortado a la ventana hasta que el scroll lo abre */}
      <div
        ref={clipRef}
        data-hero-clip
        aria-hidden="true"
        className="absolute inset-0 z-[1] pointer-events-none bg-cr-surface"
        style={{ clipPath: "inset(0 0 0 100%)" }}
      >
        <div data-hero-plate className="absolute inset-0 will-change-transform">
          <ClientOnly fallback={<FramePlaceholder />}>
            <Suspense fallback={<FramePlaceholder />}>
              <MapView concerts={mapConcerts} rides={mapRides} />
            </Suspense>
          </ClientOnly>
        </div>
        {/* Velo lateral: sostiene el titular mientras la ventana crece */}
        <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-cr-bg via-cr-bg/70 to-transparent" />
      </div>

      {/* Raíl de avance de la apertura (sólo escritorio) */}
      <div className="hidden lg:block absolute left-6 top-[var(--nav-h)] bottom-8 z-[3]" aria-hidden="true">
        <ProgressRail className="h-full" />
      </div>

      {/* Capa A · el cartel */}
      <div
        data-hero-fade
        className="relative z-[2] w-full max-w-7xl mx-auto px-6 md:px-10 lg:px-16 pt-[calc(var(--nav-h)+var(--rhythm-1))] pb-[var(--rhythm-2)] grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-end pointer-events-none [&_a]:pointer-events-auto [&_button]:pointer-events-auto"
      >
        {/* Titular y CTA */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          <p className="cr-eyebrow">
            {loaded && mapConcerts.length > 0
              ? `${mapConcerts.length} ${t("nav.concerts").toLowerCase()} · ${activeRides} ${activeRides === 1 ? "viaje activo" : "viajes activos"}`
              : t("home.heroBadgeBase")}
          </p>

          <h1 id="hero-title" data-scan="entrance" className="font-display text-display-xl max-w-[14ch]">
            {t("home.heroTitleLine1a")}
            <br />
            <span className="text-cr-primary">{t("home.heroTitleLine2a")}</span>
          </h1>

          {/* Ancla de palabras clave para buscadores y lectores (no visual) */}
          <p className="sr-only">{t("home.heroSrKeyword", { price: MIN_SEAT_PRICE })}</p>

          <p className="cr-prose text-lead text-cr-text-muted max-w-[34rem]">
            {t("home.heroSubheadlinePrefix")}{" "}
            <span className="text-cr-text font-medium cr-tabular">{t("home.heroSubheadlinePrice", { price: MIN_SEAT_PRICE })}</span>{" "}
            {t("home.heroSubheadlineMiddle")}{" "}
            <span className="text-cr-text font-medium">{t("home.heroSubheadlineTrust")}</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-3 pt-1">
            <a
              href="/concerts"
              onClick={() => trackEvent(ANALYTICS_EVENTS.HERO_CTA_CLICKED, { variant: "search_rides", target: "concerts" })}
              className="cr-btn-primary cr-btn-shine group"
            >
              {t("home.heroCtaSearch")}
              <ArrowRight size={14} className="transition-transform duration-150 group-hover:translate-x-1" aria-hidden="true" />
            </a>
            <a
              href="/publish"
              onClick={() => trackEvent(ANALYTICS_EVENTS.HERO_CTA_CLICKED, { variant: "publish_ride" })}
              className="cr-btn-ghost"
            >
              {t("home.heroCtaPublish")}
            </a>
          </div>

          <ul className="flex flex-wrap gap-x-6 gap-y-2 pt-2" aria-label="Condiciones">
            {[t("home.heroBadgeNoCard"), t("home.heroBadgeVerifiedLicense"), t("home.heroBadgeReturn")].map((b) => (
              <li key={b} className="cr-label text-cr-text-muted flex items-center gap-2">
                <span className="w-1.5 h-px bg-cr-primary" aria-hidden="true" />
                {b}
              </li>
            ))}
          </ul>
        </div>

        {/* La ventana (vacía: deja ver el mapa de la capa B) con el ticket encima */}
        <div className="lg:col-span-5 relative pb-16 lg:pb-20">
          <div
            ref={slotRef}
            data-hero-slot
            className="cr-corners relative aspect-[4/5] sm:aspect-[5/4] lg:aspect-[4/3] w-full border border-cr-border"
            aria-hidden="true"
          >
            <span className="absolute top-3 left-3 cr-label text-cr-text-muted bg-cr-bg px-1.5 py-0.5">
              {loaded && mapConcerts.length > 0 ? "Mapa · viajes activos" : "Mapa de viajes"}
            </span>
          </div>
          <div className="absolute bottom-0 -left-4 sm:-left-8 lg:-left-12 w-[min(92%,22rem)] lg:w-[min(96%,24rem)] rotate-[-4deg]">
            <Ticket featured={featured} loaded={loaded} t={t} />
          </div>
        </div>
      </div>

      {/* Estado final de la apertura: el dato aterriza sobre el mapa (A2) */}
      <div
        data-hero-end
        className="hidden lg:flex absolute z-[4] left-16 right-16 bottom-10 items-end justify-between gap-8 opacity-0 pointer-events-none [&_a]:pointer-events-auto"
        aria-hidden="true"
      >
        <div className="bg-cr-bg border border-cr-border px-6 py-5 max-w-md">
          <p className="cr-label text-cr-primary mb-2">Ahora mismo</p>
          <p className="font-display text-display-m text-cr-text">
            {loaded ? `${mapConcerts.length} conciertos · ${activeRides} ${activeRides === 1 ? "viaje" : "viajes"}` : "Conciertos y viajes"}
          </p>
          <p className="text-sm text-cr-text-muted mt-2">
            {activeRides === 0 && loaded
              ? "Aún no hay viajes publicados. Publica el tuyo y ponte en el mapa."
              : "Cada punto es un concierto con gente que va. Elige el tuyo."}
          </p>
        </div>
        <div className="flex gap-3">
          <a href="/publish" className="cr-btn-primary">Publicar mi viaje</a>
          <a href="/concerts" className="cr-btn-ghost bg-cr-bg">Ver conciertos</a>
        </div>
      </div>
    </section>
  );
}

function FramePlaceholder() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 bg-cr-surface"
      style={{
        backgroundImage:
          "linear-gradient(to right, rgb(255 255 255 / 0.04) 1px, transparent 1px), linear-gradient(to bottom, rgb(255 255 255 / 0.04) 1px, transparent 1px)",
        backgroundSize: "48px 48px",
      }}
    />
  );
}

/**
 * El ticket. Sin datos inventados: hasta que llegan los conciertos es una
 * plantilla con los campos vacíos; después muestra el concierto real más
 * próximo y su número de viajes. Si no hay viajes, dice "publica el primero":
 * ese es el objetivo de negocio.
 */
function Ticket({
  featured,
  loaded,
  t,
}: {
  featured: Concert | null;
  loaded: boolean;
  t: (key: string, params?: Record<string, string | number>) => string;
}) {
  const rides = featured?.active_rides_count ?? 0;
  const artist = featured?.artist ?? (loaded ? "Tu próximo concierto" : "—");
  const venue = featured ? `${featured.venue.name} · ${featured.venue.city}` : "Recinto · Ciudad";
  const date = featured ? formatDay(featured.date) : "Fecha";

  return (
    <div className="relative bg-cr-surface border border-cr-border text-cr-text shadow-float">
      {/* Filete lima superior */}
      <div className="h-[3px] bg-cr-primary" aria-hidden="true" />
      <div className="grid grid-cols-[1fr_auto]">
        <div className="p-4 sm:p-5 flex flex-col gap-3 min-w-0">
          <div className="flex items-center justify-between gap-3">
            <span className="cr-label text-cr-primary">{t("home.heroStubBoardingPass")}</span>
          </div>
          <p className="font-display text-display-s sm:text-[1.75rem] leading-[0.95] truncate">{artist}</p>
          <dl className="grid grid-cols-1 gap-1 text-[12px] text-cr-text-muted">
            <div className="flex gap-2 min-w-0">
              <dt className="cr-label text-cr-text-muted w-14 flex-shrink-0">Dónde</dt>
              <dd className="truncate">{venue}</dd>
            </div>
            <div className="flex gap-2">
              <dt className="cr-label text-cr-text-muted w-14 flex-shrink-0">Cuándo</dt>
              <dd className="cr-tabular">{date}</dd>
            </div>
          </dl>
        </div>
        {/* Talón perforado */}
        <div className="relative border-l border-dashed border-cr-border-mid p-4 sm:p-5 flex flex-col items-center justify-center gap-1 min-w-[6.5rem]">
          <span className="absolute -top-[6px] -left-[6px] w-3 h-3 rounded-full bg-cr-bg border border-cr-border" aria-hidden="true" />
          <span className="absolute -bottom-[6px] -left-[6px] w-3 h-3 rounded-full bg-cr-bg border border-cr-border" aria-hidden="true" />
          <span className="cr-label text-cr-text-muted">{rides > 0 ? "Viajes" : "Plazas"}</span>
          <span className="font-display text-[2.25rem] leading-none cr-tabular text-cr-primary">{rides > 0 ? rides : "0"}</span>
          <span className="cr-label text-cr-text-muted text-center">{rides > 0 ? (rides === 1 ? "activo" : "activos") : "publica el 1º"}</span>
        </div>
      </div>
      {/* Código de barras tipográfico */}
      <div className="flex items-end gap-[3px] px-4 sm:px-5 pb-4 h-8" aria-hidden="true">
        {BARS.map((w, i) => (
          <span key={i} className="bg-cr-text/80 block h-full" style={{ width: w }} />
        ))}
      </div>
    </div>
  );
}

const BARS = [2, 1, 3, 1, 2, 2, 1, 4, 1, 2, 1, 3, 2, 1, 1, 3, 2, 4, 1, 2, 1, 1, 3, 2, 1, 2, 4, 1, 3, 1, 2, 2];
