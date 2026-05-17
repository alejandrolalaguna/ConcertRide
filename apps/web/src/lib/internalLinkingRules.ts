/**
 * Internal linking rules — SEO-driven link topology for ConcertRide
 * Defines which page types should link to which, and in what context.
 *
 * This enables systematic link-juice distribution and cross-discovery
 * while keeping links contextually relevant.
 */

export type PageType = "festival" | "route" | "city" | "artist" | "blog" | "venue" | "region";

export interface LinkingRule {
  sourceType: PageType;
  targetTypes: Array<{ type: PageType; context: string; maxLinks?: number }>;
  priority: "critical" | "high" | "medium";
  example?: string;
}

export const INTERNAL_LINKING_MATRIX: LinkingRule[] = [
  // Festival pages: link to routes, cities, blogs, related festivals
  {
    sourceType: "festival",
    targetTypes: [
      {
        // Rule: festival page MUST link to top-volume carpooling routes.
        // For each festival, the top routes are the origin cities with highest km²
        // demand (capitals + nearby cities). Use /rutas/:originSlug-:festivalSlug.
        // Minimum: link the 3 most distant cities (highest ticket price = most savings).
        // These links go in the "Cómo llegar desde tu ciudad" table or section.
        type: "route",
        context: "Top carpooling routes to this festival: /rutas/:origin-:festival for each city in originCities[]. Prioritize the 3 highest-demand cities (Madrid, Barcelona, Valencia for south festivals; Bilbao, Madrid, Zaragoza for north ones)",
        maxLinks: 12,
      },
      {
        type: "city",
        context: "Origin cities linked in transport section — /conciertos/:citySlug",
        maxLinks: 8,
      },
      {
        type: "blog",
        context: "Related transport guides + festival prep guides in relatedBlogs[]",
        maxLinks: 4,
      },
      {
        type: "venue",
        context: "Venue details section — /recintos/:venueSlug",
        maxLinks: 1,
      },
      {
        type: "artist",
        context: "Lineup artists that have a landing page — /artistas/:slug",
        maxLinks: 3,
      },
      {
        type: "region",
        context: "Festival region landing — /festivales-en/:region",
        maxLinks: 1,
      },
    ],
    priority: "critical",
    example: "Mad Cool (Madrid) → /rutas/madrid-mad-cool + /rutas/barcelona-mad-cool + /rutas/valencia-mad-cool → /conciertos/madrid + /conciertos/barcelona → transport blogs",
  },

  // Route pages: link to festival, cities, related routes, blogs
  {
    sourceType: "route",
    targetTypes: [
      {
        type: "festival",
        context: "Festival detail (hero CTA + sidebar)",
        maxLinks: 1,
      },
      {
        type: "city",
        context: "Origin and destination cities",
        maxLinks: 2,
      },
      {
        type: "blog",
        context: "Transport guides for this route + festival prep",
        maxLinks: 3,
      },
      {
        type: "venue",
        context: "Festival venue (parking, access)",
        maxLinks: 1,
      },
    ],
    priority: "critical",
    example: "Madrid → Mad Cool route → Mad Cool festival detail + Madrid city + transport blogs",
  },

  // City pages: link to festivals, routes, transport blogs, region
  {
    sourceType: "city",
    targetTypes: [
      {
        type: "festival",
        context: "Upcoming festivals accessible from this city",
        maxLinks: 8,
      },
      {
        type: "route",
        context: "Routes departing from this city",
        maxLinks: 12,
      },
      {
        type: "blog",
        context: "Regional transport guides + city travel guides",
        maxLinks: 3,
      },
      {
        type: "region",
        context: "City's region landing page",
        maxLinks: 1,
      },
    ],
    priority: "high",
    example: "Barcelona → Primavera Sound + Sónar festivals + routes to 8 festivals + regional blogs",
  },

  // Artist pages: link to festival appearances, city landings, blogs
  {
    sourceType: "artist",
    targetTypes: [
      {
        // Rule: artist page MUST link to every festival where that artist performs.
        // Concretely: for each slug in ArtistLanding.relatedFestivals[], render a
        // <Link to={`/festivales/${slug}`}> in the "Próximas actuaciones" section.
        // This creates topical authority edges: artist node → festival nodes.
        type: "festival",
        context: "Festivals where artist performs — link to /festivales/:slug for each entry in ArtistLanding.relatedFestivals[]",
        maxLinks: 8,
      },
      {
        type: "city",
        context: "Cities where artist concerts are located — link to /conciertos/:citySlug for each city in upcomingConcerts[]",
        maxLinks: 4,
      },
      {
        type: "blog",
        context: "Artist concert guides, tour transport blogs",
        maxLinks: 2,
      },
      {
        // Rule: artist page should link to the top carpooling routes for that artist's festivals.
        // E.g., artist plays Mad Cool → link /rutas/madrid-mad-cool, /rutas/barcelona-mad-cool, /rutas/valencia-mad-cool.
        type: "route",
        context: "Top carpooling routes to festivals where artist performs — link /rutas/:city-:festival for top 3 origin cities per festival",
        maxLinks: 6,
      },
    ],
    priority: "high",
    example: "Coldplay → Mad Cool (/festivales/mad-cool) + Primavera (/festivales/primavera-sound) → /rutas/madrid-mad-cool + /rutas/barcelona-primavera-sound + /rutas/valencia-mad-cool → city blogs",
  },

  // Blog pages: internal contextual links + related posts
  {
    sourceType: "blog",
    targetTypes: [
      {
        type: "festival",
        context: "In-body festival mentions (linked first mention)",
        maxLinks: 5,
      },
      {
        type: "route",
        context: "In-body route examples from blog content",
        maxLinks: 3,
      },
      {
        type: "city",
        context: "In-body city mentions",
        maxLinks: 2,
      },
      {
        type: "blog",
        context: "Related posts (end-of-post section + sidebar)",
        maxLinks: 3,
      },
      {
        type: "artist",
        context: "Artist mentions in content",
        maxLinks: 2,
      },
    ],
    priority: "high",
    example: "Blog: \"Autobuses a festivales\" → Viña Rock + Arenal + routes from cities + related blogs",
  },

  // Venue pages: link to festivals hosted, routes, city
  {
    sourceType: "venue",
    targetTypes: [
      {
        type: "festival",
        context: "All festivals at this venue",
        maxLinks: 10,
      },
      {
        type: "route",
        context: "Routes leading to this venue",
        maxLinks: 6,
      },
      {
        type: "city",
        context: "City where venue is located",
        maxLinks: 1,
      },
    ],
    priority: "medium",
    example: "Kobetamendi (BBK Live venue) → BBK, previous editions → routes → Bilbao",
  },

  // Region pages: link to festivals, cities, blogs
  {
    sourceType: "region",
    targetTypes: [
      {
        type: "festival",
        context: "Festivals in this region",
        maxLinks: 8,
      },
      {
        type: "city",
        context: "Cities in this region",
        maxLinks: 5,
      },
      {
        type: "blog",
        context: "Regional transport guides",
        maxLinks: 2,
      },
    ],
    priority: "medium",
    example: "Cataluña region → Primavera + Sónar + others → Barcelona + Madrid → Catalan blogs",
  },
];

/**
 * Blog-to-festival linking map.
 * For each blog post slug, define the festival slugs it should link to.
 * Used by BlogPostPage to inject contextual "festival" links in the relatedLinks section.
 * Rule: every post mentioning a festival by name MUST link to /festivales/:slug.
 */
export const BLOG_TO_FESTIVAL_LINKS: Record<string, string[]> = {
  // Transport guides for specific festivals
  "transporte-resurrection-fest-2026": ["resurrection-fest"],
  "como-llegar-resurrection-fest-2026": ["resurrection-fest"],
  "carpooling-resurrection-fest-desde-vigo-2026": ["resurrection-fest"],
  "carpooling-descarga-festival-2026": ["download-madrid"],
  "como-ir-dcode-2026-madrid": ["dcode-festival"],
  "mad-cool-2026-guia-completa-transporte": ["mad-cool"],
  "como-ir-mad-cool-desde-barcelona-2026": ["mad-cool"],
  "como-ir-mad-cool-desde-valencia-2026": ["mad-cool"],
  "como-volver-mad-cool-madrugada-2026": ["mad-cool"],
  "gasolina-mad-cool-2026-cuanto-cuesta-ir-en-coche": ["mad-cool"],
  "primavera-sound-2026-como-llegar": ["primavera-sound"],
  "como-ir-primavera-sound-barcelona-2026": ["primavera-sound"],
  "sonar-2026-guia-transporte-barcelona": ["sonar"],
  "como-ir-sonar-barcelona-2026": ["sonar"],
  "carpooling-fib-2026-como-llegar-benicassim": ["fib"],
  "carpooling-fib-benicassim-2026": ["fib"],
  "guia-transporte-vina-rock-2026": ["vina-rock"],
  "autobuses-vina-rock-2026": ["vina-rock"],
  "son-do-camino-2026-guia-transporte": ["o-son-do-camino"],
  "carpooling-grupal-arenal-sound-2026": ["arenal-sound"],
  "grupos-amigos-festival-carpooling": ["arenal-sound", "fib", "bbk-live", "resurrection-fest"],
  "carpooling-sostenible-festivales-co2": ["primavera-sound", "resurrection-fest", "download-madrid"],
};

/**
 * Blog-to-route linking map.
 * For each blog post slug, define the route slugs it should link to via /rutas/:origin-:festival.
 * Rule: every post about "going from X to Y" MUST link to the corresponding /rutas/ page.
 */
export const BLOG_TO_ROUTE_LINKS: Record<string, string[]> = {
  "transporte-resurrection-fest-2026": [
    "/rutas/madrid-resurrection-fest",
    "/rutas/a-coruna-resurrection-fest",
    "/rutas/vigo-resurrection-fest",
    "/rutas/bilbao-resurrection-fest",
  ],
  "carpooling-descarga-festival-2026": [
    "/rutas/barcelona-download-madrid",
    "/rutas/valencia-download-madrid",
    "/rutas/zaragoza-download-madrid",
  ],
  "como-ir-dcode-2026-madrid": [
    "/rutas/valencia-dcode-festival",
    "/rutas/barcelona-dcode-festival",
    "/rutas/zaragoza-dcode-festival",
  ],
  "mad-cool-2026-guia-completa-transporte": [
    "/rutas/barcelona-mad-cool",
    "/rutas/valencia-mad-cool",
    "/rutas/zaragoza-mad-cool",
  ],
  "como-ir-primavera-sound-barcelona-2026": [
    "/rutas/madrid-primavera-sound",
    "/rutas/valencia-primavera-sound",
    "/rutas/zaragoza-primavera-sound",
  ],
  "grupos-amigos-festival-carpooling": [
    "/rutas/madrid-arenal-sound",
    "/rutas/barcelona-fib",
    "/rutas/madrid-bbk-live",
  ],
  "carpooling-sostenible-festivales-co2": [
    "/rutas/madrid-primavera-sound",
    "/rutas/madrid-resurrection-fest",
    "/rutas/barcelona-download-madrid",
  ],
};

/**
 * Helper: get linking rules for a source page type
 */
export function getLinkingRules(sourceType: PageType): LinkingRule | undefined {
  return INTERNAL_LINKING_MATRIX.find((r) => r.sourceType === sourceType);
}

/**
 * Helper: generate link recommendations for a page
 * Returns { targetType, maxCount, context } for UI implementation
 */
export function generateLinkRecommendations(
  sourceType: PageType,
): Array<{ targetType: PageType; maxCount: number; context: string }> {
  const rule = getLinkingRules(sourceType);
  if (!rule) return [];
  return rule.targetTypes.map(({ type, context, maxLinks }) => ({
    targetType: type,
    maxCount: maxLinks ?? 3,
    context,
  }));
}

/**
 * generateArtistFestivalLinks
 * Given an artist's relatedFestivals slugs and their top origin cities,
 * returns the /rutas/:city-:festival paths that the artist page should link to.
 * Implements the Rule: artist → festival → top routes from main cities.
 *
 * @param festivalSlugs - array of festival slugs from ArtistLanding.relatedFestivals
 * @param topOriginCitySlugs - city slugs to use as origins (e.g. ["madrid", "barcelona", "valencia"])
 * @returns array of route paths like "/rutas/madrid-mad-cool"
 */
export function generateArtistFestivalLinks(
  festivalSlugs: string[],
  topOriginCitySlugs: string[] = ["madrid", "barcelona", "valencia"],
): Array<{ festivalPath: string; routePaths: string[] }> {
  return festivalSlugs.map((slug) => ({
    festivalPath: `/festivales/${slug}`,
    routePaths: topOriginCitySlugs.map((city) => `/rutas/${city}-${slug}`),
  }));
}

/**
 * generateFestivalTopRoutePaths
 * For a festival page, returns the /rutas/:city-:festival paths
 * for the highest-demand origin cities (longest distance = most savings).
 * These are the links that should appear in the "Cómo llegar desde tu ciudad" section.
 *
 * @param festivalSlug - the festival slug (e.g. "mad-cool")
 * @param originCitySlugs - city slugs sorted by priority (highest-demand first)
 * @param maxLinks - maximum number of route links to return (default 6)
 * @returns array of route paths like "/rutas/barcelona-mad-cool"
 */
export function generateFestivalTopRoutePaths(
  festivalSlug: string,
  originCitySlugs: string[],
  maxLinks = 6,
): string[] {
  return originCitySlugs.slice(0, maxLinks).map((city) => `/rutas/${city}-${festivalSlug}`);
}
