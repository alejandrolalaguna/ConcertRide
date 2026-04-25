import React from "react";
import { renderToString } from "react-dom/server";
import { StaticRouter } from "react-router-dom/server";
import { Route, Routes } from "react-router-dom";
import { TopNav } from "./components/TopNav";
import { Footer } from "./components/Footer";
import { SessionProvider } from "./lib/session";
import { FavoritesProvider } from "./lib/favorites";
import type { ResolvedSeo } from "./lib/useSeoMeta";

// Eager imports for routes we prerender. Avoids React.lazy which doesn't
// resolve under renderToString (sync-only, no Suspense awaiting).
import LandingPage from "./pages/LandingPage";
import ConcertsPage from "./pages/ConcertsPage";
import ConcertDetailPage from "./pages/ConcertDetailPage";
import CityLandingPage from "./pages/CityLandingPage";
import FestivalLandingPage from "./pages/FestivalLandingPage";
import FestivalesPage from "./pages/FestivalesPage";
import GuiaTransporteFestivalesPage from "./pages/GuiaTransporteFestivalesPage";
import BlogIndexPage from "./pages/BlogIndexPage";
import BlogPostPage from "./pages/BlogPostPage";
import RouteLandingPage from "./pages/RouteLandingPage";
import RutasIndexPage from "./pages/RutasIndexPage";
import PrensaPage from "./pages/PrensaPage";
import HowItWorksPage from "./pages/HowItWorksPage";
import FaqPage from "./pages/FaqPage";
import ContactoPage from "./pages/ContactoPage";
import AcercaDePage from "./pages/AcercaDePage";
import AvisoLegalPage from "./pages/AvisoLegalPage";
import PrivacidadPage from "./pages/PrivacidadPage";
import CookiesPage from "./pages/CookiesPage";
import TerminosPage from "./pages/TerminosPage";
import NotFoundPage from "./pages/NotFoundPage";
import { FESTIVAL_LANDINGS } from "./lib/festivalLandings";
import { CITY_LANDINGS } from "./lib/cityLandings";
import { BLOG_SLUGS as BLOG_POST_SLUGS } from "./lib/blogPosts";
import { ROUTE_SLUGS as ALL_ROUTE_SLUGS } from "./lib/routeLandings";

export const FESTIVAL_SLUGS = FESTIVAL_LANDINGS.map((f) => f.slug);
export const CITY_SLUGS = CITY_LANDINGS.map((c) => c.slug);
export const BLOG_SLUGS = BLOG_POST_SLUGS;
export const ROUTE_SLUGS = ALL_ROUTE_SLUGS;

function ServerApp() {
  return (
    <>
      <TopNav />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/concerts" element={<ConcertsPage />} />
        <Route path="/concerts/:id" element={<ConcertDetailPage />} />
        <Route path="/conciertos/:city" element={<CityLandingPage />} />
        <Route path="/festivales" element={<FestivalesPage />} />
        <Route path="/festivales/:festival" element={<FestivalLandingPage />} />
        <Route path="/guia-transporte-festivales" element={<GuiaTransporteFestivalesPage />} />
        <Route path="/blog" element={<BlogIndexPage />} />
        <Route path="/blog/:slug" element={<BlogPostPage />} />
        <Route path="/rutas" element={<RutasIndexPage />} />
        <Route path="/rutas/:route" element={<RouteLandingPage />} />
        <Route path="/prensa" element={<PrensaPage />} />
        <Route path="/como-funciona" element={<HowItWorksPage />} />
        <Route path="/faq" element={<FaqPage />} />
        <Route path="/contacto" element={<ContactoPage />} />
        <Route path="/acerca-de" element={<AcercaDePage />} />
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
          <ServerApp />
        </FavoritesProvider>
      </SessionProvider>
    </StaticRouter>,
  );
  const seo = globalThis.__concertrideSsrSeo ?? null;
  return { html, seo };
}
