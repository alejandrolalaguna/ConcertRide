/**
 * Testimonios de usuarios de ConcertRide — SOLO reseñas reales.
 *
 * Fuente única de verdad para:
 *   - <TestimonialsSection /> en la landing (no se pinta si está vacío)
 *   - los Review / AggregateRating JSON-LD de home, festivales, artistas y recintos
 *
 * REGLA (CLAUDE.md "Traction Claims"): cada entrada debe proceder de una reseña
 * real de un usuario identificable (p. ej. la tabla `reviews` de producción),
 * con fecha posterior al lanzamiento. Nunca redactar testimonios "plausibles".
 *
 * 2026-10-26: se retiraron las 8 entradas anteriores. Eran inventadas — viajes
 * fechados en 2025, antes de que existiera la plataforma (lanzamiento 2026), y
 * rutas imposibles ("Bilbao → Arganda del Rey" para Viña Rock, que se celebra
 * en Villarrobledo). Alimentaban un AggregateRating 4,9/8 copiado en ~500
 * páginas: reseñas falsas en datos estructurados = riesgo de acción manual de
 * Google y publicidad engañosa (RD 444/2024). Ver SKILL gsc-indexing §AM.7.
 *
 * Con el array vacío no se emite ninguna valoración en todo el sitio; al añadir
 * ≥3 reseñas reales, AggregateRating y Review vuelven solos.
 */

export interface Testimonial {
  id: string;
  quote: string;
  /** Nombre + inicial (sin apellido completo, GDPR-friendly). */
  author: string;
  route: string;
  festival: string;
  /** Rating individual del usuario en escala 1-5. Los reales caen entre 4.9 y 5.0. */
  rating: number;
  initial: string;
  savings: string;
  avatarColor: string;
  /** Fecha aproximada del viaje (yyyy-mm-dd). Usada por review schema. */
  date: string;
  /** Ciudad de origen — usada por Review schema (no la ruta completa). */
  city: string;
  /**
   * Entidades a las que aplica este testimonio (opcional, source-of-truth para
   * filtrado por slug en Festival/Artist/Venue landings). Cada slug debe coincidir
   * con el slug usado en festivalLandings/artistLandings/venueLandings.
   *
   * Si no se especifica, se usa el matching por substring del campo `festival`.
   */
  applicableTo?: {
    festivalSlugs?: string[];
    artistSlugs?: string[];
    venueSlugs?: string[];
    citySlugs?: string[];
  };
}

export const TESTIMONIALS: Testimonial[] = [];

/**
 * Aggregate derivado de TESTIMONIALS, o null con menos de 3 reseñas (Google
 * trata un AggregateRating con 1–2 reseñas como señal débil/spam). NO
 * hardcodear ratingValue ni reviewCount.
 */
export const TESTIMONIALS_AGGREGATE: {
  ratingValue: string;
  reviewCount: number;
  bestRating: string;
  worstRating: string;
} | null =
  TESTIMONIALS.length >= 3
    ? {
        ratingValue: (TESTIMONIALS.reduce((acc, t) => acc + t.rating, 0) / TESTIMONIALS.length).toFixed(1),
        reviewCount: TESTIMONIALS.length,
        bestRating: "5",
        worstRating: "1",
      }
    : null;

/** Reviews mínimas (formato schema.org/Review) listas para inyectar en JSON-LD. */
export const TESTIMONIAL_REVIEWS = TESTIMONIALS.map((t) => ({
  quote: t.quote,
  name: t.author,
  city: t.city,
  concert: t.festival,
  date: t.date,
  rating: t.rating,
}));

/**
 * Selecciona testimonios aplicables a una entidad (festival, artist, venue o city).
 *
 * Estrategia:
 *   1. Match exacto vía `applicableTo` (source of truth, sin substring matching).
 *   2. Fallback de substring en `t.festival` si pasas un `festivalNameSubstring`
 *      (legacy compat con el mapa FESTIVAL_TESTIMONIAL_MAP).
 *
 * Devuelve `null` cuando hay menos de `minCount` matches reales — Google penaliza
 * AggregateRating con pocas reviews (UCG spam flag), así que NUNCA forzamos un
 * rating si no hay base real.
 */
export function selectTestimonialsFor(opts: {
  festivalSlug?: string;
  artistSlug?: string;
  venueSlug?: string;
  citySlug?: string;
  festivalNameSubstring?: string;
  minCount?: number;
}): Testimonial[] | null {
  const minCount = opts.minCount ?? 3;
  const matched = TESTIMONIALS.filter((t) => {
    const a = t.applicableTo;
    if (opts.festivalSlug && a?.festivalSlugs?.includes(opts.festivalSlug)) return true;
    if (opts.artistSlug && a?.artistSlugs?.includes(opts.artistSlug)) return true;
    if (opts.venueSlug && a?.venueSlugs?.includes(opts.venueSlug)) return true;
    if (opts.citySlug && a?.citySlugs?.includes(opts.citySlug)) return true;
    if (
      opts.festivalNameSubstring &&
      t.festival.toLowerCase().includes(opts.festivalNameSubstring.toLowerCase())
    )
      return true;
    return false;
  });
  if (matched.length >= minCount) return matched;
  return null;
}

