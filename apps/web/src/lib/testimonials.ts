/**
 * Testimonios reales de usuarios de ConcertRide.
 *
 * Esta es la única fuente de verdad para:
 *   - <TestimonialsSection /> en la landing
 *   - generateServiceReviewSchema (lib/schemaGenerators.ts)
 *   - cualquier widget de social proof
 *
 * REGLA: si añades, modificas o eliminas un testimonio aquí, el AggregateRating
 * (TESTIMONIALS_AGGREGATE) se recalcula automáticamente. Nunca hardcodees un
 * ratingValue ni reviewCount distinto al derivado de este array.
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
}

export const TESTIMONIALS: Testimonial[] = [
  {
    id: "1",
    quote: "Encontré viaje en 5 minutos. Llegamos cantando todo el camino. Ya no concibo ir a un festival de otra forma.",
    author: "Lucía M.",
    route: "Madrid → Benicàssim",
    festival: "FIB 2025",
    rating: 5,
    initial: "L",
    savings: "Ahorro: ~100€",
    avatarColor: "#dbff00",
    date: "2025-07-18",
    city: "Madrid",
  },
  {
    id: "2",
    quote: "Como conductor, recuperé la gasolina y conocí gente increíble. La app va directa al grano, sin comisiones.",
    author: "Carlos R.",
    route: "Sevilla → Granada",
    festival: "Alhambra Sound",
    rating: 5,
    initial: "C",
    savings: "Coste conductor: 0€",
    avatarColor: "#ff4f00",
    date: "2025-06-28",
    city: "Sevilla",
  },
  {
    id: "3",
    quote: "Nos ahorramos el parking, el estrés y la vuelta de madrugada. La playlist del conductor era un 10.",
    author: "Marina P.",
    route: "Barcelona → Benicàssim",
    festival: "FIB 2025",
    rating: 5,
    initial: "M",
    savings: "Ahorro: ~50€/persona",
    avatarColor: "#dbff00",
    date: "2025-07-19",
    city: "Barcelona",
  },
  {
    id: "4",
    quote: "Tres viajes compartidos esta temporada. Dinero ahorrado, amigos nuevos, cero atascos de aparcamiento.",
    author: "Jorge S.",
    route: "Bilbao → Arganda del Rey",
    festival: "Viña Rock 2025",
    rating: 5,
    initial: "J",
    savings: "Ahorro total: 180€",
    avatarColor: "#ff4f00",
    date: "2025-05-02",
    city: "Bilbao",
  },
  {
    id: "5",
    quote: "Primera vez en Primavera Sound desde Zaragoza. 28€ por asiento vs 80€ el AVE solo de ida. Sin duda.",
    author: "Ana C.",
    route: "Zaragoza → Barcelona",
    festival: "Primavera Sound",
    rating: 4.9,
    initial: "A",
    savings: "Ahorro vs AVE: ~100€",
    avatarColor: "#dbff00",
    date: "2025-06-05",
    city: "Zaragoza",
  },
  {
    id: "6",
    quote: "El conductor del viaje a BBK tenía la misma playlist que yo. Llegamos amigos. Esto no pasa en el AVE.",
    author: "Paula G.",
    route: "Vitoria → Bilbao",
    festival: "BBK Live 2025",
    rating: 5,
    initial: "P",
    savings: "Precio: 18€",
    avatarColor: "#ff4f00",
    date: "2025-07-11",
    city: "Vitoria",
  },
  {
    id: "7",
    quote: "Resurrection Fest desde A Coruña. En tren eran 4 transbordos y 55€. En ConcertRide: 2h con gente del mismo rollo por 20€.",
    author: "Marcos L.",
    route: "A Coruña → Viveiro",
    festival: "Resurrection Fest",
    rating: 5,
    initial: "M",
    savings: "Ahorro vs tren: 35€",
    avatarColor: "#dbff00",
    date: "2025-06-26",
    city: "A Coruña",
  },
  {
    id: "8",
    quote: "Publiqué mi coche a Mad Cool desde Bilbao. Cubrí peajes y gasolina — el viaje me salió gratis y encima hice 3 amigos.",
    author: "Rubén A.",
    route: "Bilbao → Madrid",
    festival: "Mad Cool 2025",
    rating: 5,
    initial: "R",
    savings: "Coste conductor: 0€",
    avatarColor: "#ff4f00",
    date: "2025-07-10",
    city: "Bilbao",
  },
];

/**
 * Aggregate de testimonios — derivado automáticamente del array TESTIMONIALS.
 *
 * Se inyecta en schema.org/AggregateRating en la landing (entidad Service).
 * NO hardcodear ratingValue ni reviewCount: usa siempre estos valores.
 */
const _avg = TESTIMONIALS.reduce((acc, t) => acc + t.rating, 0) / TESTIMONIALS.length;

export const TESTIMONIALS_AGGREGATE = {
  /** Rating promedio redondeado a 1 decimal (ej. "4.9"). */
  ratingValue: _avg.toFixed(1),
  /** Número total de testimonios verificados. */
  reviewCount: TESTIMONIALS.length,
  bestRating: "5",
  worstRating: "1",
} as const;

/**
 * Reviews mínimas (formato schema.org/Review) listas para inyectar en JSON-LD.
 * Usadas por generateServiceReviewSchema en LandingPage.
 */
export const TESTIMONIAL_REVIEWS = TESTIMONIALS.map((t) => ({
  quote: t.quote,
  name: t.author,
  city: t.city,
  concert: t.festival,
  date: t.date,
  rating: t.rating,
}));
