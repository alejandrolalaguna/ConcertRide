import { Navigate, Route, Routes } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ConcertDetailPage from "./pages/ConcertDetailPage";
import ConcertsPage from "./pages/ConcertsPage";
import RideDetailPage from "./pages/RideDetailPage";
import PublishRidePage from "./pages/PublishRidePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import DevShowcase from "./pages/DevShowcase";
import { TopNav } from "./components/TopNav";

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
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/concerts" element={<ConcertsPage />} />
        <Route path="/concerts/:id" element={<ConcertDetailPage />} />
        <Route path="/rides/:id" element={<RideDetailPage />} />
        <Route path="/publish" element={<PublishRidePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/_dev" element={<DevShowcase />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
