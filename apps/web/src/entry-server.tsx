import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { Route, Routes } from "react-router-dom";
import { TopNav } from "./components/TopNav";
import { Footer } from "./components/Footer";
import { SessionProvider } from "./lib/session";
import { FavoritesProvider } from "./lib/favorites";
import { CrewProvider } from "./lib/crew";
import type { ResolvedSeo } from "./lib/useSeoMeta";

// Eager imports for routes we prerender. Avoids React.lazy which doesn't
// resolve under renderToString (sync-only, no Suspense awaiting).
import LandingPage from "./pages/LandingPage";
import ConcertsPage from "./pages/ConcertsPage";
import ConcertDetailPage from "./pages/ConcertDetailPage";
import CityLandingPage from "./pages/CityLandingPage";
import CityYearPage from "./pages/CityYearPage";
import FestivalLandingPage from "./pages/FestivalLandingPage";
import FestivalesPage from "./pages/FestivalesPage";
import GuiaTransporteFestivalesPage from "./pages/GuiaTransporteFestivalesPage";
import GuiaFestivalSinCochePage from "./pages/GuiaFestivalSinCochePage";
import GuiaPresupuestoFestivalGrupoPage from "./pages/GuiaPresupuestoFestivalGrupoPage";
import GuiaFestivalSostenibleCO2Page from "./pages/GuiaFestivalSostenibleCO2Page";
import GuiaSeguridadCarpoolingFestivalPage from "./pages/GuiaSeguridadCarpoolingFestivalPage";
import GuiaFestivalPrimeraVezPage from "./pages/GuiaFestivalPrimeraVezPage";
import GuiaCarpoolingConductorFestivalPage from "./pages/GuiaCarpoolingConductorFestivalPage";
import GuiaFestivalInternacionalEspanaPage from "./pages/GuiaFestivalInternacionalEspanaPage";
import GuiaFestivalAccesibilidadPage from "./pages/GuiaFestivalAccesibilidadPage";
import GuiaAcampadaFestivalPage from "./pages/GuiaAcampadaFestivalPage";
import GuiaFestivalVeteranoPage from "./pages/GuiaFestivalVeteranoPage";
import PillarGuiaPage from "./pages/PillarGuiaPage";
import BlogIndexPage from "./pages/BlogIndexPage";
import BlogPostPage from "./pages/BlogPostPage";
import RouteLandingPage from "./pages/RouteLandingPage";
import RutasIndexPage from "./pages/RutasIndexPage";
import PrensaPage from "./pages/PrensaPage";
import SalaPrensaPage from "./pages/SalaPrensaPage";
import DatosPage from "./pages/DatosPage";
import DatasetPrecioMedio2026Page from "./pages/DatasetPrecioMedio2026Page";
import DatasetMapaConexion2026Page from "./pages/DatasetMapaConexion2026Page";
import DatasetRankingPreciosFestivales2026Page from "./pages/DatasetRankingPreciosFestivales2026Page";
import DatasetCalendarioMaestro2026Page from "./pages/DatasetCalendarioMaestro2026Page";
import DatasetCostesOcultos2026Page from "./pages/DatasetCostesOcultos2026Page";
import DatasetConciertosDemanda2026Page from "./pages/DatasetConciertosDemanda2026Page";
import DatasetAlojamiento2026Page from "./pages/DatasetAlojamiento2026Page";
import DatasetCancelaciones2026Page from "./pages/DatasetCancelaciones2026Page";
import DatasetHeatmapCcaa2026Page from "./pages/DatasetHeatmapCcaa2026Page";
import HowItWorksPage from "./pages/HowItWorksPage";
import FaqPage from "./pages/FaqPage";
import ContactoPage from "./pages/ContactoPage";
import AcercaDePage from "./pages/AcercaDePage";
import ArtistLandingPage from "./pages/ArtistLandingPage";
import VenueLandingPage from "./pages/VenueLandingPage";
import RegionLandingPage from "./pages/RegionLandingPage";
import AvisoLegalPage from "./pages/AvisoLegalPage";
import PrivacidadPage from "./pages/PrivacidadPage";
import CookiesPage from "./pages/CookiesPage";
import TerminosPage from "./pages/TerminosPage";
import NotFoundPage from "./pages/NotFoundPage";
import HowToGetTherePage from "./pages/HowToGetTherePage";
import FestivalGuidePage from "./pages/FestivalGuidePage";
import ComoFuncionaCarpoolingPage from "./pages/ComoFuncionaCarpoolingPage";
// Legacy comparison page removed — Worker 301-redirects the URL to a generic
// replacement post. See CLAUDE.md "Brand Restrictions". Never re-enable.
import ComparativaTaxi from "./pages/ComparativaTaxi";
import AlternativasCarpoolingFestivalesPage from "./pages/AlternativasCarpoolingFestivalesPage";
import MejorCarpoolingFestivales2026Page from "./pages/MejorCarpoolingFestivales2026Page";
import ViajeCompartidoPage from "./pages/ViajeCompartidoPage";
import CompartirCocheFestivalPage from "./pages/CompartirCocheFestivalPage";
import IrJuntosAlFestivalPage from "./pages/IrJuntosAlFestivalPage";
import CocheCompartidoConciertosPage from "./pages/CocheCompartidoConciertosPage";
import CompartirGastosFestivalPage from "./pages/CompartirGastosFestivalPage";
import ViajeEnGrupoFestivalPage from "./pages/ViajeEnGrupoFestivalPage";
import HacerPinaFestivalPage from "./pages/HacerPinaFestivalPage";
import GenreLandingPage from "./pages/GenreLandingPage";
import CalendarLandingPage from "./pages/CalendarLandingPage";
import AutorAlejandroLalagunaPage from "./pages/AutorAlejandroLalagunaPage";
import GlosarioPage from "./pages/GlosarioPage";
import { FESTIVAL_LANDINGS, FESTIVAL_LANDINGS_LAST_UPDATED } from "./lib/festivalLandings";
import { CITY_LANDINGS } from "./lib/cityLandings";
import { BLOG_SLUGS as BLOG_POST_SLUGS, DISABLED_BLOG_SLUGS as ALL_DISABLED_BLOG_SLUGS } from "./lib/blogPosts";
import { ROUTE_SLUGS as ALL_ROUTE_SLUGS } from "./lib/routeLandings";
import { ARTIST_SLUGS as ALL_ARTIST_SLUGS } from "./lib/artistLandings";
import { VENUE_SLUGS as ALL_VENUE_SLUGS } from "./lib/venueLandings";
import { REGION_SLUGS as ALL_REGION_SLUGS } from "./lib/regionLandings";
import { HOW_TO_GET_THERE_SLUGS } from "./lib/howToGetThereSlugs";
import { GENRE_SLUGS as ALL_GENRE_SLUGS } from "./lib/genreLandings";
import { CALENDAR_SLUGS as ALL_CALENDAR_SLUGS } from "./lib/calendarLandings";

export const FESTIVAL_SLUGS = FESTIVAL_LANDINGS.map((f) => f.slug);
export const CITY_SLUGS = CITY_LANDINGS.map((c) => c.slug);
// Year-specific city pages: only the current year self-canonicals. 2025 (past)
// and 2027 (unconfirmed) variants canonical to the parent `/conciertos/:city`
// (see CityYearPage.tsx). They still render as pages for direct navigation but
// are excluded from prerender + sitemap to avoid GSC "Duplicate, Google chose
// a different canonical" warnings on signals that consolidate to the parent.
const CITY_YEARS_FOR_SITEMAP = ["2026"] as const;
export const CITY_YEAR_SLUGS: string[] = CITY_LANDINGS.flatMap((c) =>
  CITY_YEARS_FOR_SITEMAP.map((y) => `${c.slug}/${y}`),
);
export const BLOG_SLUGS = BLOG_POST_SLUGS;
export const DISABLED_BLOG_SLUGS = Array.from(ALL_DISABLED_BLOG_SLUGS);
export const ROUTE_SLUGS = ALL_ROUTE_SLUGS;
export const ARTIST_SLUGS = ALL_ARTIST_SLUGS;
export const VENUE_SLUGS = ALL_VENUE_SLUGS;
export const REGION_SLUGS = ALL_REGION_SLUGS;
export const HOW_TO_GET_THERE_PAGE_SLUGS = HOW_TO_GET_THERE_SLUGS;
export const GENRE_SLUGS = ALL_GENRE_SLUGS;
export const CALENDAR_SLUGS = ALL_CALENDAR_SLUGS;
export const CONTENT_LAST_UPDATED = FESTIVAL_LANDINGS_LAST_UPDATED;

function ServerApp() {
  return (
    <>
      <TopNav />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/concerts" element={<ConcertsPage />} />
        <Route path="/concerts/:id" element={<ConcertDetailPage />} />
        <Route path="/conciertos/:city/:year" element={<CityYearPage />} />
        <Route path="/conciertos/:city" element={<CityLandingPage />} />
        <Route path="/festivales" element={<FestivalesPage />} />
        <Route path="/festivales/:festival/guia" element={<FestivalGuidePage />} />
        <Route path="/festivales/:festival" element={<FestivalLandingPage />} />
        <Route path="/artistas/:slug" element={<ArtistLandingPage />} />
        <Route path="/recintos/:slug" element={<VenueLandingPage />} />
        <Route path="/festivales-en/:slug" element={<RegionLandingPage />} />
        <Route path="/festivales-genero/:slug" element={<GenreLandingPage />} />
        <Route path="/calendario-festivales/:slug" element={<CalendarLandingPage />} />
        <Route path="/guia-transporte-festivales" element={<GuiaTransporteFestivalesPage />} />
        <Route path="/guia/festival-sin-coche" element={<GuiaFestivalSinCochePage />} />
        <Route path="/guia/presupuesto-festival-grupo" element={<GuiaPresupuestoFestivalGrupoPage />} />
        <Route path="/guia/festival-sostenible-co2" element={<GuiaFestivalSostenibleCO2Page />} />
        <Route path="/guia/seguridad-carpooling-festival" element={<GuiaSeguridadCarpoolingFestivalPage />} />
        <Route path="/guia/festival-primera-vez" element={<GuiaFestivalPrimeraVezPage />} />
        <Route path="/guia/carpooling-conductor-festival" element={<GuiaCarpoolingConductorFestivalPage />} />
        <Route path="/guia/festival-internacional-espana" element={<GuiaFestivalInternacionalEspanaPage />} />
        <Route path="/guia/festival-accesibilidad-movilidad-reducida" element={<GuiaFestivalAccesibilidadPage />} />
        <Route path="/guia/acampada-festival-libre-vs-oficial-2026" element={<GuiaAcampadaFestivalPage />} />
        <Route path="/guia/festival-veterano-aficionados-mayores-2026" element={<GuiaFestivalVeteranoPage />} />
        <Route path="/guia-ir-festivales-2026" element={<PillarGuiaPage />} />
        <Route path="/blog" element={<BlogIndexPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/rutas" element={<RutasIndexPage />} />
        <Route path="/rutas/:route" element={<RouteLandingPage />} />
        <Route path="/como-llegar/:festival" element={<HowToGetTherePage />} />
        <Route path="/como-funciona-carpooling" element={<ComoFuncionaCarpoolingPage />} />
        {/* Legacy comparison route removed — 301 redirect handled by Worker. See CLAUDE.md. */}
        <Route path="/comparativa/carpooling-vs-taxi-festival" element={<ComparativaTaxi />} />
        <Route path="/alternativas-carpooling-festivales" element={<AlternativasCarpoolingFestivalesPage />} />
        <Route path="/mejor-carpooling-festivales-2026" element={<MejorCarpoolingFestivales2026Page />} />
        <Route path="/viaje-compartido" element={<ViajeCompartidoPage />} />
        <Route path="/compartir-coche-festival" element={<CompartirCocheFestivalPage />} />
        <Route path="/ir-juntos-al-festival" element={<IrJuntosAlFestivalPage />} />
        <Route path="/coche-compartido-conciertos" element={<CocheCompartidoConciertosPage />} />
        <Route path="/compartir-gastos-festival" element={<CompartirGastosFestivalPage />} />
        <Route path="/viaje-en-grupo-festival" element={<ViajeEnGrupoFestivalPage />} />
        <Route path="/hacer-pina-festival" element={<HacerPinaFestivalPage />} />
        <Route path="/prensa" element={<PrensaPage />} />
        <Route path="/sala-de-prensa" element={<SalaPrensaPage />} />
        <Route path="/datos" element={<DatosPage />} />
        <Route path="/datos/precio-medio-carpooling-vs-bus-festivales-2026" element={<DatasetPrecioMedio2026Page />} />
        <Route path="/datos/festivales-peor-conexion-transporte-publico-2026" element={<DatasetMapaConexion2026Page />} />
        <Route path="/datos/festivales-mas-caros-mas-baratos-llegar-2026" element={<DatasetRankingPreciosFestivales2026Page />} />
        <Route path="/datos/calendario-maestro-festivales-2026" element={<DatasetCalendarioMaestro2026Page />} />
        <Route path="/datos/costes-ocultos-transporte-festivales-2026" element={<DatasetCostesOcultos2026Page />} />
        <Route path="/datos/conciertos-mayor-demanda-transporte-2026" element={<DatasetConciertosDemanda2026Page />} />
        <Route path="/datos/alojamiento-cercano-festivales-2026" element={<DatasetAlojamiento2026Page />} />
        <Route path="/datos/cancelaciones-festivales-espana-2020-2026" element={<DatasetCancelaciones2026Page />} />
        <Route path="/datos/heatmap-demanda-festivales-ccaa-2026" element={<DatasetHeatmapCcaa2026Page />} />
        <Route path="/como-funciona" element={<HowItWorksPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/contacto" element={<ContactoPage />} />
        <Route path="/acerca-de" element={<AcercaDePage />} />
        <Route path="/glosario" element={<GlosarioPage />} />
        <Route path="/autor/alejandro-lalaguna" element={<AutorAlejandroLalagunaPage />} />
        <Route path="/aviso-legal" element={<AvisoLegalPage />} />
        <Route path="/privacidad" element={<PrivacidadPage />} />
        <Route path="/cookies" element={<CookiesPage />} />
        <Route path="/terminos" element={<TerminosPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export interface RenderResult {
  html: string;
  seo: ResolvedSeo | null;
}

export function render(url: string): RenderResult {
  globalThis.__concertrideSsrSeo = null;
  const html = renderToString(
    <StaticRouter location={url}>
      <SessionProvider>
        <FavoritesProvider>
          <CrewProvider>
            <ServerApp />
          </CrewProvider>
        </FavoritesProvider>
      </SessionProvider>
    </StaticRouter>,
  );
  const seo = globalThis.__concertrideSsrSeo ?? null;
  return { html, seo };
}
