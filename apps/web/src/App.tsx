import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { TopNav } from "./components/TopNav";
import { Footer } from "./components/Footer";
import { CookieBanner } from "./components/CookieBanner";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { VerifyEmailBanner } from "./components/VerifyEmailBanner";
import { LoadingSpinner } from "./components/ui";

const LandingPage = lazy(() => import("./pages/LandingPage"));
const FavoritesPage = lazy(() => import("./pages/FavoritesPage"));
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
const DevShowcase = lazy(() => import("./pages/DevShowcase"));

export default function App() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-[100] focus:bg-cr-primary focus:text-black focus:px-4 focus:py-2 focus:font-sans focus:font-semibold focus:uppercase focus:tracking-[0.12em] focus:text-sm"
      >
        Saltar al contenido principal
      </a>
      <TopNav />
      <VerifyEmailBanner />
      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner text="Cargando…" />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/concerts" element={<ConcertsPage />} />
            <Route path="/concerts/:id" element={<ConcertDetailPage />} />
            <Route path="/rides/:id" element={<RideDetailPage />} />
            <Route path="/publish" element={<PublishRidePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/favoritos" element={<FavoritesPage />} />
            <Route path="/mis-viajes" element={<MyRidesPage />} />
            <Route path="/admin/reports" element={<AdminReportsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/drivers/:id" element={<DriverProfilePage />} />
            <Route path="/aviso-legal" element={<AvisoLegalPage />} />
            <Route path="/privacidad" element={<PrivacidadPage />} />
            <Route path="/cookies" element={<CookiesPage />} />
            <Route path="/terminos" element={<TerminosPage />} />
            <Route path="/_dev" element={<DevShowcase />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
      <Footer />
      <CookieBanner />
    </>
  );
}
