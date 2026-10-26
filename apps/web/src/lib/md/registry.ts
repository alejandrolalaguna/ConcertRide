// Markdown-for-agents — route registry (single source of truth).
//
// Every public route in App.tsx must appear in exactly one of the two lists
// below; `registry.test.ts` fails otherwise. Adding a page therefore takes one
// step: add its React Router path to MD_ROUTES with a section. The prerender
// step, /llms.txt, /llms-full.txt and /api/md/_catalog all pick it up.
//
// Import-free on purpose: the Worker imports this module on every markdown
// request (CPU budget, see apps/api/src/index.ts §AJ).
//
// Which pages actually get a markdown version is decided at build time, not
// here: a route only lands in the packs when its prerendered HTML is indexable
// and self-canonical (prerender.mjs → markdownArtifacts). A registered pattern
// whose concrete URL is not in the packs answers a markdown 404.

export type MdSection =
  | "core"
  | "guias"
  | "datos"
  | "festivales"
  | "ciudades"
  | "rutas"
  | "artistas"
  | "blog"
  | "conciertos"
  | "legal";

/** Order = order in /llms.txt and /llms-full.txt. */
export const MD_SECTIONS: ReadonlyArray<{ key: MdSection; label: string }> = [
  { key: "core", label: "Páginas principales" },
  { key: "guias", label: "Guías" },
  { key: "datos", label: "Datos abiertos (CC BY 4.0)" },
  { key: "festivales", label: "Festivales" },
  { key: "ciudades", label: "Conciertos por ciudad" },
  { key: "rutas", label: "Rutas de carpooling" },
  { key: "artistas", label: "Artistas y recintos" },
  { key: "blog", label: "Blog" },
  { key: "conciertos", label: "Conciertos" },
  { key: "legal", label: "Legal" },
];

export interface MdRoute {
  /** React Router path, exactly as written in App.tsx. */
  path: string;
  section: MdSection;
  /**
   * `prerender` — markdown generated at build time from the SSR output.
   * `concert-db` — rendered on request from Turso (concert ids are dynamic).
   */
  source?: "prerender" | "concert-db";
}

export const MD_ROUTES: ReadonlyArray<MdRoute> = [
  // Core
  { path: "/", section: "core" },
  { path: "/como-funciona", section: "core" },
  { path: "/faq", section: "core" },
  { path: "/acerca-de", section: "core" },
  { path: "/contacto", section: "core" },
  { path: "/prensa", section: "core" },
  { path: "/sala-de-prensa", section: "core" },
  { path: "/glosario", section: "core" },
  { path: "/autor/equipo-concertride", section: "core" },

  // Guides and evergreen pillars
  { path: "/guia-transporte-festivales", section: "guias" },
  { path: "/guia-ir-festivales-2026", section: "guias" },
  { path: "/guia/festival-sin-coche", section: "guias" },
  { path: "/guia/presupuesto-festival-grupo", section: "guias" },
  { path: "/guia/festival-sostenible-co2", section: "guias" },
  { path: "/guia/seguridad-carpooling-festival", section: "guias" },
  { path: "/guia/festival-primera-vez", section: "guias" },
  { path: "/guia/carpooling-conductor-festival", section: "guias" },
  { path: "/guia/festival-internacional-espana", section: "guias" },
  { path: "/guia/festival-accesibilidad-movilidad-reducida", section: "guias" },
  { path: "/guia/acampada-festival-libre-vs-oficial-2026", section: "guias" },
  { path: "/guia/festival-veterano-aficionados-mayores-2026", section: "guias" },
  { path: "/como-funciona-carpooling", section: "guias" },
  { path: "/comparativa/carpooling-vs-taxi-festival", section: "guias" },
  { path: "/alternativas-carpooling-festivales", section: "guias" },
  { path: "/mejor-carpooling-festivales-2026", section: "guias" },
  { path: "/viaje-compartido", section: "guias" },
  { path: "/compartir-coche-festival", section: "guias" },
  { path: "/ir-juntos-al-festival", section: "guias" },
  { path: "/coche-compartido-conciertos", section: "guias" },
  { path: "/compartir-gastos-festival", section: "guias" },
  { path: "/viaje-en-grupo-festival", section: "guias" },
  { path: "/hacer-pina-festival", section: "guias" },

  // Open data
  { path: "/datos", section: "datos" },
  { path: "/datos/precio-medio-carpooling-vs-bus-festivales-2026", section: "datos" },
  { path: "/datos/festivales-peor-conexion-transporte-publico-2026", section: "datos" },
  { path: "/datos/festivales-mas-caros-mas-baratos-llegar-2026", section: "datos" },
  { path: "/datos/calendario-maestro-festivales-2026", section: "datos" },
  { path: "/datos/costes-ocultos-transporte-festivales-2026", section: "datos" },
  { path: "/datos/conciertos-mayor-demanda-transporte-2026", section: "datos" },
  { path: "/datos/alojamiento-cercano-festivales-2026", section: "datos" },
  { path: "/datos/cancelaciones-festivales-espana-2020-2026", section: "datos" },
  { path: "/datos/heatmap-demanda-festivales-ccaa-2026", section: "datos" },

  // Festivals
  { path: "/festivales", section: "festivales" },
  { path: "/festivales/:festival", section: "festivales" },
  { path: "/festivales/:festival/guia", section: "festivales" },
  { path: "/como-llegar/:festival", section: "festivales" },
  { path: "/festivales-en/:slug", section: "festivales" },
  { path: "/festivales-genero/:slug", section: "festivales" },
  { path: "/calendario-festivales/:slug", section: "festivales" },

  // Cities
  { path: "/conciertos/:city", section: "ciudades" },
  { path: "/conciertos/:city/:year", section: "ciudades" },

  // Routes
  { path: "/rutas", section: "rutas" },
  { path: "/rutas/:route", section: "rutas" },

  // Artists and venues
  { path: "/artistas", section: "artistas" },
  { path: "/artistas/:slug", section: "artistas" },
  { path: "/recintos", section: "artistas" },
  { path: "/recintos/:slug", section: "artistas" },

  // Blog
  { path: "/blog", section: "blog" },
  { path: "/blog/:slug", section: "blog" },

  // Concerts (TM-sourced). Never bulk-listed in llms-full.txt or the catalog:
  // Ticketmaster ToS rule 5 forbids wholesale redistribution (CLAUDE.md).
  { path: "/concerts", section: "conciertos" },
  { path: "/concerts/:id", section: "conciertos", source: "concert-db" },

  // Legal
  { path: "/aviso-legal", section: "legal" },
  { path: "/privacidad", section: "legal" },
  { path: "/cookies", section: "legal" },
  { path: "/terminos", section: "legal" },
];

/** Public App.tsx routes deliberately without a markdown version. */
export const MD_SKIPPED: ReadonlyArray<{ path: string; reason: string }> = [
  { path: "*", reason: "404 catch-all" },
  { path: "/_dev", reason: "dev showcase, not public" },
  { path: "/admin/reports", reason: "admin" },
  { path: "/login", reason: "auth (noindex)" },
  { path: "/register", reason: "auth (noindex)" },
  { path: "/forgot-password", reason: "auth (noindex)" },
  { path: "/reset-password", reason: "auth (noindex)" },
  { path: "/verify-email", reason: "auth (noindex)" },
  { path: "/bienvenida", reason: "post-signup onboarding, logged-in only" },
  { path: "/profile", reason: "logged-in only" },
  { path: "/mis-viajes", reason: "logged-in only" },
  { path: "/favoritos", reason: "logged-in only" },
  { path: "/mensajes", reason: "private messages" },
  { path: "/mensajes/:userId", reason: "private messages" },
  { path: "/crew", reason: "logged-in social surface (robots Disallow)" },
  { path: "/squads/new", reason: "logged-in social surface (robots Disallow)" },
  { path: "/squads/join/:code", reason: "private invite link" },
  { path: "/squads/:id", reason: "logged-in social surface (robots Disallow)" },
  { path: "/memorias", reason: "noindex index of user-generated content" },
  { path: "/memorias/:id", reason: "user-generated content" },
  { path: "/rides/:id", reason: "noindex (X-Robots-Tag in _headers), user-generated" },
  { path: "/drivers/:id", reason: "noindex (X-Robots-Tag in _headers), personal profile" },
  { path: "/widget/concert/:id", reason: "embeddable iframe widget, robots Disallow" },
  { path: "/publish", reason: "interactive form; not prerendered" },
];

interface CompiledRoute extends MdRoute {
  re: RegExp;
}

let compiled: CompiledRoute[] | null = null;

function compile(path: string): RegExp {
  const pattern = path
    .split("/")
    .map((seg) => (seg.startsWith(":") ? "[^/]+" : seg.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")))
    .join("/");
  return new RegExp(`^${pattern}$`);
}

/** Returns the registry entry serving `path` (an HTML path, no `.md`), or null. */
export function resolveMdRoute(path: string): MdRoute | null {
  if (!compiled) compiled = MD_ROUTES.map((r) => ({ ...r, re: compile(r.path) }));
  for (const r of compiled) if (r.re.test(path)) return r;
  return null;
}
