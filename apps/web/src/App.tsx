import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { TopNav } from "./components/TopNav";
import { Footer } from "./components/Footer";
import { CookieBanner } from "./components/CookieBanner";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { VerifyEmailBanner } from "./components/VerifyEmailBanner";
import { LoadingSpinner } from "./components/ui";
// ExitIntentModal lazy-loaded — it renders null until the user moves the
// mouse out the top of the viewport / scrolls back up on mobile, so it has
// no first-paint cost. Suspense fallback is null because the modal is
// strictly non-essential UI.
const ExitIntentModal = lazy(() =>
  import("./components/ExitIntentModal").then((m) => ({ default: m.ExitIntentModal })),
);

const LandingPage = lazy(() => import("./pages/LandingPage"));
const FavoritesPage = lazy(() => import("./pages/FavoritesPage"));
const CrewPage = lazy(() => import("./pages/CrewPage"));
const FeedPage = lazy(() => import("./pages/FeedPage"));
const SquadDetailPage = lazy(() => import("./pages/SquadDetailPage"));
const SquadJoinPage = lazy(() => import("./pages/SquadJoinPage"));
const SquadCreatePage = lazy(() => import("./pages/SquadCreatePage"));
const MemoriasPage = lazy(() => import("./pages/MemoriasPage"));
const MemoryDetailPage = lazy(() => import("./pages/MemoryDetailPage"));
const MyRidesPage = lazy(() => import("./pages/MyRidesPage"));
const AdminReportsPage = lazy(() => import("./pages/AdminReportsPage"));
const ForgotPasswordPage = lazy(() => import("./pages/ForgotPasswordPage"));
const ResetPasswordPage = lazy(() => import("./pages/ResetPasswordPage"));
const ConcertsPage = lazy(() => import("./pages/ConcertsPage"));
const ConcertDetailPage = lazy(() => import("./pages/ConcertDetailPage"));
const RideDetailPage = lazy(() => import("./pages/RideDetailPage"));
const PublishRidePage = lazy(() => import("./pages/PublishRidePage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const AvisoLegalPage = lazy(() => import("./pages/AvisoLegalPage"));
const PrivacidadPage = lazy(() => import("./pages/PrivacidadPage"));
const CookiesPage = lazy(() => import("./pages/CookiesPage"));
const TerminosPage = lazy(() => import("./pages/TerminosPage"));
const DriverProfilePage = lazy(() => import("./pages/DriverProfilePage"));
const FaqPage = lazy(() => import("./pages/FaqPage"));
const HowItWorksPage = lazy(() => import("./pages/HowItWorksPage"));
const ComoFuncionaCarpoolingPage = lazy(() => import("./pages/ComoFuncionaCarpoolingPage"));
const ContactoPage = lazy(() => import("./pages/ContactoPage"));
const AcercaDePage = lazy(() => import("./pages/AcercaDePage"));
// NOTE: ComparativaBlaBlaCar page removed (file deleted) — route is 301-redirected
// at the Worker level (apps/api/src/index.ts LEGACY_REDIRECTS). Never re-add per
// CLAUDE.md "Brand Restrictions". Generic replacement lives at
// /blog/alternativa-carpooling-festivales-espana.
const ComparativaTaxi = lazy(() => import("./pages/ComparativaTaxi"));
const AlternativasCarpoolingFestivalesPage = lazy(() => import("./pages/AlternativasCarpoolingFestivalesPage"));
const MejorCarpoolingFestivales2026Page = lazy(() => import("./pages/MejorCarpoolingFestivales2026Page"));
const ViajeCompartidoPage = lazy(() => import("./pages/ViajeCompartidoPage"));
const CompartirCocheFestivalPage = lazy(() => import("./pages/CompartirCocheFestivalPage"));
const IrJuntosAlFestivalPage = lazy(() => import("./pages/IrJuntosAlFestivalPage"));
const CocheCompartidoConciertosPage = lazy(() => import("./pages/CocheCompartidoConciertosPage"));
const CompartirGastosFestivalPage = lazy(() => import("./pages/CompartirGastosFestivalPage"));
const ViajeEnGrupoFestivalPage = lazy(() => import("./pages/ViajeEnGrupoFestivalPage"));
const HacerPinaFestivalPage = lazy(() => import("./pages/HacerPinaFestivalPage"));
const CityLandingPage = lazy(() => import("./pages/CityLandingPage"));
const CityYearPage = lazy(() => import("./pages/CityYearPage"));
const FestivalLandingPage = lazy(() => import("./pages/FestivalLandingPage"));
const FestivalGuidePage = lazy(() => import("./pages/FestivalGuidePage"));
const FestivalesPage = lazy(() => import("./pages/FestivalesPage"));
const ArtistLandingPage = lazy(() => import("./pages/ArtistLandingPage"));
const VenueLandingPage = lazy(() => import("./pages/VenueLandingPage"));
const RegionLandingPage = lazy(() => import("./pages/RegionLandingPage"));
const GuiaTransporteFestivalesPage = lazy(() => import("./pages/GuiaTransporteFestivalesPage"));
const GuiaFestivalSinCochePage = lazy(() => import("./pages/GuiaFestivalSinCochePage"));
const GuiaPresupuestoFestivalGrupoPage = lazy(() => import("./pages/GuiaPresupuestoFestivalGrupoPage"));
const GuiaFestivalSostenibleCO2Page = lazy(() => import("./pages/GuiaFestivalSostenibleCO2Page"));
const GuiaSeguridadCarpoolingFestivalPage = lazy(() => import("./pages/GuiaSeguridadCarpoolingFestivalPage"));
const GuiaFestivalPrimeraVezPage = lazy(() => import("./pages/GuiaFestivalPrimeraVezPage"));
const GuiaCarpoolingConductorFestivalPage = lazy(() => import("./pages/GuiaCarpoolingConductorFestivalPage"));
const GuiaFestivalInternacionalEspanaPage = lazy(() => import("./pages/GuiaFestivalInternacionalEspanaPage"));
const GuiaFestivalAccesibilidadPage = lazy(() => import("./pages/GuiaFestivalAccesibilidadPage"));
const GuiaAcampadaFestivalPage = lazy(() => import("./pages/GuiaAcampadaFestivalPage"));
const GuiaFestivalVeteranoPage = lazy(() => import("./pages/GuiaFestivalVeteranoPage"));
const PillarGuiaPage = lazy(() => import("./pages/PillarGuiaPage"));
const BlogIndexPage = lazy(() => import("./pages/BlogIndexPage"));
const BlogPostPage = lazy(() => import("./pages/BlogPostPage"));
const RouteLandingPage = lazy(() => import("./pages/RouteLandingPage"));
const RutasIndexPage = lazy(() => import("./pages/RutasIndexPage"));
const PrensaPage = lazy(() => import("./pages/PrensaPage"));
const SalaPrensaPage = lazy(() => import("./pages/SalaPrensaPage"));
const DatosPage = lazy(() => import("./pages/DatosPage"));
const DatasetPrecioMedio2026Page = lazy(() => import("./pages/DatasetPrecioMedio2026Page"));
const DatasetMapaConexion2026Page = lazy(() => import("./pages/DatasetMapaConexion2026Page"));
const DatasetRankingPreciosFestivales2026Page = lazy(() => import("./pages/DatasetRankingPreciosFestivales2026Page"));
const DatasetCalendarioMaestro2026Page = lazy(() => import("./pages/DatasetCalendarioMaestro2026Page"));
const DatasetCostesOcultos2026Page = lazy(() => import("./pages/DatasetCostesOcultos2026Page"));
const DatasetConciertosDemanda2026Page = lazy(() => import("./pages/DatasetConciertosDemanda2026Page"));
const DatasetAlojamiento2026Page = lazy(() => import("./pages/DatasetAlojamiento2026Page"));
const DatasetCancelaciones2026Page = lazy(() => import("./pages/DatasetCancelaciones2026Page"));
const DatasetHeatmapCcaa2026Page = lazy(() => import("./pages/DatasetHeatmapCcaa2026Page"));
const VerifyEmailPage = lazy(() => import("./pages/VerifyEmailPage"));
const MessagesPage = lazy(() => import("./pages/MessagesPage"));
const DirectMessagePage = lazy(() => import("./pages/DirectMessagePage"));
const BienvenidaPage = lazy(() => import("./pages/BienvenidaPage"));
const NotFoundPage = lazy(() => import("./pages/NotFoundPage"));
const DevShowcase = lazy(() => import("./pages/DevShowcase"));
const ConcertWidgetPage = lazy(() => import("./pages/ConcertWidgetPage"));
const HowToGetTherePage = lazy(() => import("./pages/HowToGetTherePage"));
const GenreLandingPage = lazy(() => import("./pages/GenreLandingPage"));
const CalendarLandingPage = lazy(() => import("./pages/CalendarLandingPage"));
const GlosarioPage = lazy(() => import("./pages/GlosarioPage"));
const AutorAlejandroLalagunaPage = lazy(() => import("./pages/AutorAlejandroLalagunaPage"));

export default function App() {
  return (
    <Routes>
      {/* Widget embed routes — no nav/footer/banner */}
      <Route
        path="/widget/concert/:id"
        element={
          <Suspense fallback={null}>
            <ConcertWidgetPage />
          </Suspense>
        }
      />

      {/* Main app layout */}
      <Route
        path="*"
        element={
      <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:bg-[#dbff00] focus:text-black focus:px-4 focus:py-2 focus:font-sans focus:font-semibold focus:rounded focus:uppercase focus:tracking-[0.12em] focus:text-sm"
      >
        Ir al contenido principal
      </a>
      <TopNav />
      <VerifyEmailBanner />
      <ErrorBoundary>
        <Suspense fallback={<div id="main" role="main" aria-busy="true" aria-label="Cargando página"><LoadingSpinner text="Cargando…" /></div>}>
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
            <Route path="/rides/:id" element={<RideDetailPage />} />
            <Route path="/publish" element={<PublishRidePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/verify-email" element={<VerifyEmailPage />} />
            <Route path="/favoritos" element={<FavoritesPage />} />
            <Route path="/crew" element={<CrewPage />} />
            <Route path="/feed" element={<FeedPage />} />
            <Route path="/squads/new" element={<SquadCreatePage />} />
            <Route path="/squads/join/:code" element={<SquadJoinPage />} />
            <Route path="/squads/:id" element={<SquadDetailPage />} />
            <Route path="/memorias" element={<MemoriasPage />} />
            <Route path="/memorias/:id" element={<MemoryDetailPage />} />
            <Route path="/mis-viajes" element={<MyRidesPage />} />
            <Route path="/mensajes" element={<MessagesPage />} />
            <Route path="/mensajes/:userId" element={<DirectMessagePage />} />
            <Route path="/admin/reports" element={<AdminReportsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/drivers/:id" element={<DriverProfilePage />} />
            <Route path="/aviso-legal" element={<AvisoLegalPage />} />
            <Route path="/privacidad" element={<PrivacidadPage />} />
            <Route path="/cookies" element={<CookiesPage />} />
            <Route path="/terminos" element={<TerminosPage />} />
            <Route path="/faq" element={<FaqPage />} />
            <Route path="/como-funciona" element={<HowItWorksPage />} />
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
            <Route path="/contacto" element={<ContactoPage />} />
            <Route path="/acerca-de" element={<AcercaDePage />} />
            <Route path="/glosario" element={<GlosarioPage />} />
            <Route path="/autor/alejandro-lalaguna" element={<AutorAlejandroLalagunaPage />} />
            <Route path="/bienvenida" element={<BienvenidaPage />} />
            <Route path="/_dev" element={<DevShowcase />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
      <Footer />
      <CookieBanner />
      <Suspense fallback={null}>
        <ExitIntentModal />
      </Suspense>
    </>
        }
      />
    </Routes>
  );
}
