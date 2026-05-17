import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import { TopNav } from "./components/TopNav";
import { Footer } from "./components/Footer";
import { CookieBanner } from "./components/CookieBanner";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { VerifyEmailBanner } from "./components/VerifyEmailBanner";
import { LoadingSpinner } from "./components/ui";
import { ExitIntentModal } from "./components/ExitIntentModal";

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
const CityLandingPage = lazy(() => import("./pages/CityLandingPage"));
const CityYearPage = lazy(() => import("./pages/CityYearPage"));
const FestivalLandingPage = lazy(() => import("./pages/FestivalLandingPage"));
const FestivalGuidePage = lazy(() => import("./pages/FestivalGuidePage"));
const FestivalesPage = lazy(() => import("./pages/FestivalesPage"));
const ArtistLandingPage = lazy(() => import("./pages/ArtistLandingPage"));
const VenueLandingPage = lazy(() => import("./pages/VenueLandingPage"));
const RegionLandingPage = lazy(() => import("./pages/RegionLandingPage"));
const GuiaTransporteFestivalesPage = lazy(() => import("./pages/GuiaTransporteFestivalesPage"));
const PillarGuiaPage = lazy(() => import("./pages/PillarGuiaPage"));
const BlogIndexPage = lazy(() => import("./pages/BlogIndexPage"));
const BlogPostPage = lazy(() => import("./pages/BlogPostPage"));
const RouteLandingPage = lazy(() => import("./pages/RouteLandingPage"));
const RutasIndexPage = lazy(() => import("./pages/RutasIndexPage"));
const PrensaPage = lazy(() => import("./pages/PrensaPage"));
const SalaPrensaPage = lazy(() => import("./pages/SalaPrensaPage"));
const DatosPage = lazy(() => import("./pages/DatosPage"));
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
            <Route path="/guia-ir-festivales-2026" element={<PillarGuiaPage />} />
            <Route path="/blog" element={<BlogIndexPage />} />
            <Route path="/blog/:slug" element={<BlogPostPage />} />
            <Route path="/rutas" element={<RutasIndexPage />} />
            <Route path="/rutas/:route" element={<RouteLandingPage />} />
            <Route path="/como-llegar/:festival" element={<HowToGetTherePage />} />
            <Route path="/prensa" element={<PrensaPage />} />
            <Route path="/sala-de-prensa" element={<SalaPrensaPage />} />
            <Route path="/datos" element={<DatosPage />} />
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
            <Route path="/contacto" element={<ContactoPage />} />
            <Route path="/acerca-de" element={<AcercaDePage />} />
            <Route path="/glosario" element={<GlosarioPage />} />
            <Route path="/bienvenida" element={<BienvenidaPage />} />
            <Route path="/_dev" element={<DevShowcase />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
      <Footer />
      <CookieBanner />
      <ExitIntentModal />
    </>
        }
      />
    </Routes>
  );
}
