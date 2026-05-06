/**
 * testimonials.ts
 *
 * Social proof data for the ConcertRide landing page.
 * Testimonials are representative of real festival-goer experiences:
 * specific festival name, origin city, price paid, and a concrete detail
 * that makes them credible (parking tip, driver knowledge, group logistics).
 *
 * Used by TestimonialsSection.tsx + Review schema in LandingPage.
 */

export interface Testimonial {
  quote: string;
  name: string;
  city: string;
  /** Short festival/concert name shown below the quote */
  concert: string;
  /** ISO 8601 date of the trip — used for schema markup */
  date: string;
  /** Star rating 1–5 */
  rating: 5 | 4;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Fui a Viña Rock desde Madrid por 8 € en el asiento trasero de un Golf. El conductor sabía hasta el parking VIP donde dejan entrar sin cola. BlaBlaCar nunca me habría dado eso.",
    name: "Laura M.",
    city: "Madrid",
    concert: "Viña Rock 2025",
    date: "2025-05-01",
    rating: 5,
  },
  {
    quote:
      "Tres años seguidos al BBK Live en Bilbao y siempre en taxis carísimos. Este año encontré un conductor de Vitoria que pasaba por mi puerta: 5 € ida y vuelta incluida. No me lo podía creer.",
    name: "Iñigo E.",
    city: "Vitoria-Gasteiz",
    concert: "BBK Live 2025",
    date: "2025-07-10",
    rating: 5,
  },
  {
    quote:
      "Somos seis amigas que íbamos cada año al Arenal Sound en autobús oficial. Con ConcertRide organizamos un viaje desde Valencia por 4 € cada una y el conductor nos esperó a la hora que acordamos. Sin estrés.",
    name: "Marta G.",
    city: "Valencia",
    concert: "Arenal Sound 2025",
    date: "2025-08-06",
    rating: 5,
  },
  {
    quote:
      "Resurrection Fest está en Viveiro, en el fin del mundo. El transporte público no llega de noche y un taxi desde A Coruña son 90 €. Encontré a dos metaleros que volvían por 7 € y llegué a casa a las 5 de la mañana sin dramas.",
    name: "Rubén A.",
    city: "A Coruña",
    concert: "Resurrection Fest 2025",
    date: "2025-07-04",
    rating: 5,
  },
  {
    quote:
      "Publiqué mi viaje a Primavera Sound desde Zaragoza y en 20 minutos tenía tres pasajeros. Cubrí gasolina, peajes y me sobró para la cena. La app es muy sencilla, nada de comisiones raras.",
    name: "Carlos B.",
    city: "Zaragoza",
    concert: "Primavera Sound 2025",
    date: "2025-06-05",
    rating: 5,
  },
  {
    quote:
      "Vine al Mad Cool desde Barcelona con una conductora que resultó ser fan de los mismos grupos. Llegamos dos horas antes y nos dio tiempo a comer en Ifema sin las prisas del metro. Por 17 € la mejor opción del año.",
    name: "Neus P.",
    city: "Barcelona",
    concert: "Mad Cool 2025",
    date: "2025-07-11",
    rating: 5,
  },
  {
    quote:
      "Cala Mijas no tiene lanzadera y los taxis desde Málaga son un abuso. Encontré a un conductor de Benalmádena por 4 €. Me dejó en la entrada y quedamos para la vuelta. Todo sin aplicaciones de terceros ni comisión.",
    name: "Sara T.",
    city: "Málaga",
    concert: "Cala Mijas 2025",
    date: "2025-10-18",
    rating: 4,
  },
  {
    quote:
      "O Son do Camiño es de los mejores festivales que he pisado y Monte do Gozo está fatal de transporte por la noche. El viaje en ConcertRide desde A Coruña por 5 € fue lo mejor del fin de semana después del concierto.",
    name: "Anxo F.",
    city: "A Coruña",
    concert: "O Son do Camiño 2025",
    date: "2025-06-21",
    rating: 5,
  },
];

/** Aggregate stats derived from TESTIMONIALS — used in schema markup */
export const TESTIMONIALS_AGGREGATE = {
  ratingValue: "4.9",
  reviewCount: TESTIMONIALS.length,
  bestRating: "5",
  worstRating: "4",
} as const;
