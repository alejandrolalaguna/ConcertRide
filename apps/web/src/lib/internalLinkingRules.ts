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
        type: "route",
        context: "\"Cómo llegar desde tu ciudad\" section",
        maxLinks: 12,
      },
      {
        type: "city",
        context: "Origin cities linked in transport section",
        maxLinks: 8,
      },
      {
        type: "blog",
        context: "Related transport guides + festival prep guides",
        maxLinks: 4,
      },
      {
        type: "venue",
        context: "Venue details section",
        maxLinks: 1,
      },
      {
        type: "artist",
        context: "Lineup artists (if implemented)",
        maxLinks: 3,
      },
      {
        type: "region",
        context: "Festival region landing",
        maxLinks: 1,
      },
    ],
    priority: "critical",
    example: "Mad Cool (Madrid) → routes from Barcelona, Bilbao, Valencia + cities → transport blogs",
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
        type: "festival",
        context: "Festivals where artist performs",
        maxLinks: 5,
      },
      {
        type: "city",
        context: "Cities where festivals are located",
        maxLinks: 3,
      },
      {
        type: "blog",
        context: "Artist interviews, concert guides, tour blogs",
        maxLinks: 2,
      },
    ],
    priority: "high",
    example: "Coldplay → Mad Cool + Primavera + Sónar → Madrid + Barcelona + city blogs",
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
