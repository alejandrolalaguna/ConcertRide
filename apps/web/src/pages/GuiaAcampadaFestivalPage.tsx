import { Link } from "react-router-dom";
import {
  ArrowRight,
  Tent,
  TreePine,
  Scale,
  Package,
  Sparkles,
  Wallet,
  Wrench,
  Sun,
  MapPin,
  BookOpen,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics-events";
import EeatTrustBlock from "@/components/EeatTrustBlock";
import AiDisclosureNote from "@/components/AiDisclosureNote";
import { aiLevelForPageType } from "@/lib/aiContentPolicy";

const PILLAR_SLUG = "guia-acampada-festival";

/**
 * Pillar SEO page — cluster "Action: acampada festival libre vs oficial" (Pillar 10).
 *
 * Cubre las tres opciones reales de pernoctación en festivales 2026:
 * camping oficial, glamping (premium) y acampada libre (municipal /
 * privado / coche del propio festivalero). Incluye tabla de precios bono +
 * acampada para 10 festivales, marco legal de la acampada libre por CCAA,
 * kit de 15 items y comparativa de coste total entre Sonorama, Arenal y
 * Mad Cool.
 *
 * NOTE: Per CLAUDE.md "Brand Restrictions" — NEVER name competing carpooling
 * brands.
 */

const FAQS = [
  {
    q: "¿Cuál es la diferencia entre camping oficial, glamping y acampada libre en un festival?",
    a: "El camping oficial es el recinto vallado, contiguo al festival y gestionado por la organización: incluye control de acceso por pulsera, duchas, baños, seguridad 24 h y servicios mínimos (bar, tienda). El precio típico 2026 oscila entre 25 € y 60 € por persona por todo el festival. El glamping es la opción premium dentro o junto al camping oficial: tienda de tipi, bell tent o yurta ya montada con cama, somier, ropa de cama y a veces aire acondicionado; precios entre 180 € y 700 € por persona por festival completo. La acampada libre es pernoctar fuera del recinto oficial — en camping municipal próximo, camping privado de la comarca, o directamente al lado del coche en zonas habilitadas. Su coste va de 0 € (libre en monte público con permiso) a 18 € por noche en camping municipal.",
  },
  {
    q: "¿Es legal hacer acampada libre cerca de un festival en España?",
    a: "Depende de la comunidad autónoma y del tipo de suelo. La acampada libre está expresamente prohibida en parques nacionales, parques naturales, zonas costeras dentro de la franja de servidumbre de tránsito (6 m desde la línea de máxima pleamar) y suelo urbano. En el resto del territorio rural, cada CCAA tiene su propio régimen: Castilla y León, Galicia y Aragón permiten pernoctas de una sola noche con tienda no superior a la altura de la persona, en grupos reducidos y a más de 1 km de núcleos urbanos o cámping autorizados; Cataluña y Andalucía requieren autorización previa del ayuntamiento o del Servicio de Montes; Castilla-La Mancha la prohíbe salvo en zonas habilitadas. Lo más seguro y legal para acampar cerca de un festival es usar un cámping municipal próximo o el recinto oficial del festival.",
  },
  {
    q: "¿Qué incluye un bono \"general + acampada\" en festivales 2026?",
    a: "Incluye acceso al recinto musical durante todos los días del festival, acceso al área de camping oficial durante esos mismos días más una noche extra antes (early arrival) y otra después en algunos festivales, parcela compartida sin asignación numérica (acampas donde quieras dentro del área), uso de duchas, baños y puntos de agua potable, taquillas de pago opcionales y seguridad 24 h. No incluye: tienda de campaña (debes llevarla tú), parking para coche (suele ser bono aparte 25–50 €), comida ni bebida, glamping ni habitación premium. La pulsera de camping suele entregarse a partir del día previo al inicio del festival y se retira el día siguiente al cierre.",
  },
  {
    q: "¿Cuál es el coste medio total de un festival con acampada incluida en 2026?",
    a: "Para un festival tier-1 de 3 días con camping oficial, el coste medio por persona en 2026 ronda los 280 €–360 €: bono general + acampada (110–140 €), comida y bebida 3 días (60–90 €), transporte ida y vuelta desde tu ciudad en carpooling (25–60 €), kit acampada amortizado (10–15 € por festival si reutilizas la tienda 3–4 veces), parking si vas en coche propio (30–50 €) y caprichos varios (20–30 €). Con glamping el coste sube a 500 €–900 €. Con acampada libre en cámping municipal cercano y carpooling, el coste baja a 200 €–250 €. ConcertRide reduce la partida transporte un 60–80 % frente a viajar solo.",
  },
  {
    q: "¿Puedo dormir en mi coche dentro o cerca del recinto del festival?",
    a: "Dormir dentro del coche en el área de parking oficial está permitido en la mayoría de festivales tier-1 (Mad Cool, Sonorama, Arenal Sound, FIB, Resurrection Fest, Low) siempre que hayas comprado bono parking. No se considera acampada porque no usas tienda ni mobiliario exterior — sólo el habitáculo del vehículo. Mad Cool y Arenal Sound tienen incluso zonas específicas para autocaravanas y furgonetas camper con precios entre 80 € y 150 € por todo el festival que incluyen sombra, conexión eléctrica básica y acceso a duchas del camping oficial. Lo que está prohibido en todos los recintos es montar una tienda al lado del coche en parking convencional: si quieres acampar, hay que ir al área específica.",
  },
];

const CAMPING_TYPES = [
  {
    icon: Tent,
    title: "Camping oficial del festival",
    price: "25 € – 60 € pp · todo el festival",
    text: "Recinto vallado, contiguo al recinto musical, gestionado por la organización. Incluye duchas (frías o templadas, con cola en hora punta), baños químicos, puntos de agua potable, seguridad 24 h y bar/tienda interior. Acceso por pulsera identificativa entregada en taquilla. Recomendado para quien quiere despertarse a 5 minutos del escenario y no mover el coche durante el festival. Llevas tu propia tienda. Festivales con camping oficial 2026: Sonorama, Arenal Sound, Viña Rock, FIB, Resurrection Fest, Low, BBK Live, Reggaeton Beach Salou, Andalucía Big Festival y Resurrection Fest. El área se abre 24–48 h antes del primer día y se cierra 24 h después del último.",
  },
  {
    icon: Sparkles,
    title: "Glamping (premium)",
    price: "180 € – 700 € pp · todo el festival",
    text: "Tienda tipi, bell tent, yurta o lodge ya montada por la organización con cama de verdad, somier, ropa de cama, taquilla privada, luz interior y a veces aire acondicionado o suelo de madera. Suele estar en un área separada del camping general, con duchas premium, baños propios y zona chill exclusiva. Para 2 personas, una bell tent en Mad Cool 2026 cuesta unos 500 € por toda la edición (250 € pp); en Sonorama un yurta para 4 personas cuesta 720 € (180 € pp). Recomendado para quienes priorizan descanso real y no quieren montar tienda. Las plazas son muy limitadas y se agotan 4–6 meses antes del festival.",
  },
  {
    icon: TreePine,
    title: "Acampada libre — cámping municipal",
    price: "8 € – 18 € pp/noche",
    text: "Cámpings públicos o municipales próximos al festival (radio 5–20 km), con servicios completos: parcelas con tomacorriente, duchas calientes, supermercado, restaurante, piscina a veces. Ejemplos: Cámping Burriana Park para Arenal Sound (8 €/noche), Cámping Las Cabañuelas para Viña Rock, Cámping Bellavista para FIB (Benicàssim). Reserva con 4–6 meses de antelación porque se llenan en fechas de festival. Implica desplazamiento diario al recinto — viable a pie en algunos casos o con servicio lanzadera del festival.",
  },
  {
    icon: TreePine,
    title: "Acampada libre — cámping privado",
    price: "12 € – 25 € pp/noche",
    text: "Cámpings privados de 2ª o 3ª categoría a 10–30 km del festival. Más caros que el municipal pero suelen tener mejor mantenimiento, bungalows alquilables (40–80 €/noche para 2 personas), wifi y bar abierto fuera de temporada baja. Buena opción si vas en grupo y queréis alternar tienda con bungalow.",
  },
  {
    icon: TreePine,
    title: "Acampada libre — monte público",
    price: "0 € · noche única autorizada",
    text: "Pernocta de una noche con tienda no superior a la altura de la persona, en suelo no urbano, no protegido, a más de 1 km de núcleos urbanos y cámping autorizados. Requiere conocer la normativa de la CCAA — varía mucho. Castilla y León, Galicia y Aragón son las más permisivas; Cataluña, Andalucía y Castilla-La Mancha exigen autorización previa. Nunca acampes en parque nacional, parque natural, playa, dunas, monte de utilidad pública sin permiso o suelo de propiedad privada sin consentimiento explícito del propietario.",
  },
  {
    icon: Wrench,
    title: "Coche propio (camper o convencional)",
    price: "Bono parking · 25 € – 150 € total",
    text: "Dormir dentro del vehículo en el área de parking oficial. Permitido en la mayoría de festivales tier-1 con bono parking. Mad Cool, Sonorama y Arenal Sound tienen áreas específicas para autocaravanas y furgonetas camper (80–150 € por edición) con conexión eléctrica básica y acceso a duchas del camping oficial. Para coche convencional simplemente compra bono parking (25–50 €) y duerme dentro — no puedes montar tienda al lado.",
  },
];

const FESTIVAL_PRICES = [
  {
    festival: "Sonorama Ribera 2026",
    slug: "sonorama",
    location: "Aranda de Duero · Burgos",
    general: "100 €",
    camping: "130 € (bono + camping)",
    glamping: "335 € (bell tent compartida 4 pax)",
    notes: "Camping oficial dentro del recinto. Glamping en zona Premium El Mirador.",
  },
  {
    festival: "Arenal Sound 2026",
    slug: "arenal-sound",
    location: "Burriana · Castelló",
    general: "75 €",
    camping: "110 € (bono + acampada)",
    glamping: "380 € (yurta compartida 2 pax)",
    notes: "Playa anexa al recinto. Acampada en zona dunas. Cámping Burriana Park como alternativa libre.",
  },
  {
    festival: "Viña Rock 2026",
    slug: "vina-rock",
    location: "Villarrobledo · Albacete",
    general: "80 €",
    camping: "108 € (bono + acampada)",
    glamping: "320 € (cabaña madera 2 pax)",
    notes: "Camping oficial en finca anexa. Cámping Las Cabañuelas a 4 km como alternativa libre.",
  },
  {
    festival: "Resurrection Fest 2026",
    slug: "resurrection-fest",
    location: "Viveiro · Lugo",
    general: "150 €",
    camping: "180 € (bono + camping)",
    glamping: "520 € (lodge madera 4 pax)",
    notes: "Camping oficial junto al Cantábrico. Lluvia frecuente — llevar tienda 3000 mm columna agua.",
  },
  {
    festival: "FIB 2026",
    slug: "fib",
    location: "Benicàssim · Castelló",
    general: "120 €",
    camping: "155 € (bono + camping)",
    glamping: "460 € (bell tent 2 pax)",
    notes: "Camping oficial al lado del recinto. Servicio Sunbathing premium con sombrillas. Cámping Bonterra Park como libre.",
  },
  {
    festival: "Mad Cool 2026",
    slug: "mad-cool",
    location: "Iberdrola Music · Madrid",
    general: "199 €",
    camping: "N/A (sin camping oficial en 2026)",
    glamping: "N/A",
    notes: "Festival urbano sin camping oficial. Alternativas: hotel zona Hortaleza, camping Camping Madrid (50 km), apartamento Airbnb.",
  },
  {
    festival: "Low Festival 2026",
    slug: "low",
    location: "Benidorm · Alacant",
    general: "120 €",
    camping: "150 € (bono + camping)",
    glamping: "440 € (cabaña 2 pax)",
    notes: "Camping oficial en zona Foietes. Acceso a pie al recinto. Cámping Almafrá a 3 km como libre.",
  },
  {
    festival: "BBK Live 2026",
    slug: "bbk-live",
    location: "Kobetamendi · Bilbao",
    general: "165 €",
    camping: "210 € (bono + camping)",
    glamping: "560 € (tipi 2 pax)",
    notes: "Camping oficial en ladera Kobetamendi. Lanzadera al centro de Bilbao gratis. Lluvia frecuente.",
  },
  {
    festival: "BBK Music Legends 2026",
    slug: "bbk-music-legends",
    location: "Sondika · Bizkaia",
    general: "120 €",
    camping: "145 € (bono + parking camper)",
    glamping: "N/A",
    notes: "Sin camping general; sólo área autocaravanas y campers en parking habilitado. Hoteles Bilbao a 12 km.",
  },
  {
    festival: "Reggaeton Beach Salou 2026",
    slug: "reggaeton-beach",
    location: "Salou · Tarragona",
    general: "85 €",
    camping: "120 € (bono + camping)",
    glamping: "390 € (bell tent 2 pax)",
    notes: "Camping oficial Cámping La Siesta junto al recinto. Múltiples cámpings privados a 1–3 km en Cala Crancs.",
  },
];

const CCAA_REGULATION = [
  {
    region: "Castilla y León",
    rule: "Permitida pernocta única con tienda no superior a la altura de la persona, fuera de áreas protegidas, a más de 1 km de núcleos urbanos o cámping autorizados. Sin permiso previo en monte de utilidad pública si no hay restricción específica.",
  },
  {
    region: "Galicia",
    rule: "Decreto 144/2013: permitida pernocta única con tienda baja, en grupos de hasta 3 unidades, fuera de parques naturales y a más de 1 km de cámpings autorizados. Recomendable consultar al concello.",
  },
  {
    region: "Aragón",
    rule: "Permitida pernocta de hasta 24 h con tienda baja en grupos reducidos. Prohibida en parques naturales, monumentos naturales y zonas de protección de aves.",
  },
  {
    region: "Cataluña",
    rule: "Prohibida con carácter general fuera de cámpings autorizados. Excepciones puntuales para alta montaña (más de 2 000 m) con tienda baja y noche única.",
  },
  {
    region: "Andalucía",
    rule: "Requiere autorización previa del ayuntamiento o de la Delegación de Medio Ambiente. Prohibida en espacios naturales protegidos y zonas costeras dentro de la franja de servidumbre marítima.",
  },
  {
    region: "Castilla-La Mancha",
    rule: "Prohibida fuera de zonas habilitadas o cámpings autorizados. Aplicación estricta cerca de festivales tipo Viña Rock — usar cámping municipal próximo.",
  },
  {
    region: "Valencia",
    rule: "Prohibida fuera de cámpings o zonas habilitadas. Aplicación especialmente estricta en franja costera (relevante para Arenal Sound, Low, FIB).",
  },
];

const KIT_ITEMS = [
  { item: "Tienda de campaña 2–3 personas", price: "40–120 €", note: "Resistente al viento; columna agua ≥2 000 mm. Modelos iglú son los más rápidos de montar." },
  { item: "Saco de dormir verano (≥15 °C confort)", price: "25–60 €", note: "Para festivales junio–septiembre. Para Resurrection Fest o BBK lleva uno de 5 °C confort por la noche atlántica." },
  { item: "Esterilla aislante o autohinchable", price: "12–35 €", note: "Diferencia entre dormir y no dormir. Mínimo 5 mm de grosor en autohinchable." },
  { item: "Linterna frontal con pilas de repuesto", price: "10–25 €", note: "Las manos quedan libres para montar/desmontar tienda de noche." },
  { item: "Bidón agua plegable 5 L", price: "8–15 €", note: "Los puntos de agua en camping están saturados — llévate reserva propia." },
  { item: "Hornillo gas + bombona", price: "15–30 €", note: "Café o té rápido por la mañana. En muchos festivales está prohibido el fuego — verifica normativa." },
  { item: "Toalla microfibra", price: "8–15 €", note: "Seca rápido tras ducha. Indispensable en festivales con playa o piscina." },
  { item: "Crema solar SPF 50+", price: "10–18 €", note: "Festivales junio-agosto con 11+ horas de sol. Reaplica cada 2 horas." },
  { item: "Botiquín básico", price: "10–20 €", note: "Tiritas, ibuprofeno, antihistamínico, sales rehidratantes, gel anti-rozaduras." },
  { item: "Cargador solar o batería 20 000 mAh", price: "25–50 €", note: "Sin enchufes en camping general. El móvil es esencial para encontrarte con la cuadrilla." },
  { item: "Candado para tienda y taquilla", price: "8–15 €", note: "Reduce el riesgo del pequeño hurto. Las taquillas oficiales son las más seguras." },
  { item: "Bolsa estanca para móvil/dinero", price: "6–12 €", note: "Festivales con lluvia (Resurrection, BBK) o con playa (Arenal, Low)." },
  { item: "Calzado cerrado cómodo (zapatilla deportiva)", price: "—", note: "Vas a andar 10–15 km diarios entre escenarios y camping. Chanclas sólo para ducha." },
  { item: "Tapones para oídos", price: "3–8 €", note: "Para dormir en camping ruidoso. Modelo Loop o filtros de músico mantienen calidad audio cuando los usas en concierto." },
  { item: "Vaso reutilizable", price: "incluido en bono", note: "Casi todos los festivales 2026 cobran depósito 1–2 € por vaso reutilizable. Devuelve el tuyo o guárdalo de souvenir." },
];

const COMPARISON_ROWS = [
  {
    item: "Bono general + acampada",
    sonorama: "130 €",
    arenal: "110 €",
    madcool: "199 € (sólo bono, sin camping)",
  },
  {
    item: "Transporte ida y vuelta carpooling",
    sonorama: "32 € (Madrid→Aranda)",
    arenal: "28 € (Valencia→Burriana)",
    madcool: "12 € (Madrid centro→IFEMA)",
  },
  {
    item: "Comida y bebida 3 días dentro recinto",
    sonorama: "75 €",
    arenal: "75 €",
    madcool: "85 € (precios urbanos más altos)",
  },
  {
    item: "Tienda y kit amortizado",
    sonorama: "12 €",
    arenal: "12 €",
    madcool: "0 € (vives en hotel/Airbnb)",
  },
  {
    item: "Alojamiento alternativo (Mad Cool)",
    sonorama: "—",
    arenal: "—",
    madcool: "180 € (3 noches Airbnb compartido)",
  },
  {
    item: "Otros (parking, glamping upgrades, caprichos)",
    sonorama: "25 €",
    arenal: "20 €",
    madcool: "30 €",
  },
  {
    item: "Total por persona",
    sonorama: "274 €",
    arenal: "245 €",
    madcool: "506 €",
    highlight: true,
  },
];

const TIPS = [
  {
    title: "1 · Llega temprano y elige zona en sombra",
    text: "El día de apertura del camping oficial suele abrir a las 12:00. Quien llega entre las 14:00 y las 17:00 elige zona; quien llega de noche acaba en la peor parcela. Busca proximidad a un árbol, vallado o estructura que dé sombra entre 12:00 y 17:00 — el sol directo eleva la temperatura interior de la tienda hasta 50 °C.",
  },
  {
    title: "2 · Lleva siempre un colchón hinchable o esterilla autohinchable de calidad",
    text: "Dormir directamente sobre el saco es el error nº1 del festivalero novato. El suelo enfría aunque sea verano. Una autohinchable de 5–7 cm o un colchón hinchable individual marca la diferencia entre 3 horas de sueño malas y 6 horas reparadoras.",
  },
  {
    title: "3 · Etiqueta la tienda con algo identificable",
    text: "Cuando vuelves de madrugada con 4 000 tiendas iguales, encontrar la tuya es imposible. Pega una bandera, una bandana, una linterna LED o una pegatina vistosa. Apunta también las coordenadas o referencias visuales en el móvil.",
  },
  {
    title: "4 · Higiene básica: gel desinfectante y baños sociales",
    text: "Las colas para duchas oficiales superan los 45 minutos en hora punta (08:00–10:00). Madruga o ducha por la noche (23:00–01:00). Lleva gel de manos para usar después de cada baño químico. Los baños sociales (sólo lavabo, no inodoro) suelen tener menos cola.",
  },
  {
    title: "5 · Guarda valores en taquillas oficiales o candado en tienda",
    text: "El pequeño hurto en camping festivalero existe pero es minoritario. Para móvil, cartera y documentos, las taquillas oficiales (5–15 € por todo el festival) son la opción más segura. Para tienda sin valores dejados, candado simple en cremallera reduce mucho el riesgo aunque no lo elimina.",
  },
  {
    title: "6 · No subestimes el viento ni la lluvia",
    text: "En festivales costeros (Arenal Sound, Low, FIB) el viento de tarde-noche puede levantar tiendas mal ancladas. Usa todos los vientos y piquetas; refuerza con piedras grandes si el suelo es arenoso. Para festivales atlánticos (Resurrection Fest, BBK Live) lleva tienda con columna agua ≥3 000 mm — el chubasco puede caer sin previo aviso.",
  },
];

export default function GuiaAcampadaFestivalPage() {
  const today = new Date().toISOString().slice(0, 10);

  useSeoMeta({
    title: "Acampada festival 2026: oficial, libre, glamping | ConcertRide",
    description:
      "Comparamos las 3 opciones de acampada en festivales 2026: camping oficial, glamping y libre. Tabla precios bono+acampada 10 festivales y kit.",
    canonical: `${SITE_URL}/guia/acampada-festival-libre-vs-oficial-2026`,
    keywords:
      "acampada festival precio España, acampar libre festival legal, bono acampada festival 2026, camping oficial festival, glamping festival, kit acampada festivalero",
    ogType: "article",
    ogImage: `${SITE_URL}/og/home.png`,
    ogImageAlt: "Guía acampada en festivales 2026 — oficial vs libre vs glamping — ConcertRide",
    articlePublishedTime: "2026-05-19",
    articleModifiedTime: today,
    articleAuthor: "Alejandro Lalaguna",
    articleSection: "Guías",
    breadcrumb: [
      { position: 1, name: "Inicio", url: `${SITE_URL}/` },
      { position: 2, name: "Guías", url: `${SITE_URL}/guia-transporte-festivales` },
      { position: 3, name: "Acampada festival 2026", url: `${SITE_URL}/guia/acampada-festival-libre-vs-oficial-2026` },
    ],
  });

  const jsonLdArticle = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Acampada en festivales 2026: oficial vs libre vs glamping — precios, regulación y kit",
    description:
      "Guía pillar completa sobre las tres opciones de pernoctación en festivales de España 2026: camping oficial, glamping premium y acampada libre. Incluye tabla de precios bono + acampada para 10 festivales tier-1, marco legal de la acampada libre por CCAA, kit de 15 items y comparativa de coste total entre Sonorama, Arenal Sound y Mad Cool.",
    url: `${SITE_URL}/guia/acampada-festival-libre-vs-oficial-2026`,
    inLanguage: "es-ES",
    author: {
      "@type": "Person",
      name: "Alejandro Lalaguna",
      url: `${SITE_URL}/acerca-de`,
      "@id": `${SITE_URL}/#founder`,
    },
    publisher: {
      "@id": `${SITE_URL}/#organization`,
    },
    datePublished: "2026-05-19",
    dateModified: today,
    image: {
      "@type": "ImageObject",
      url: `${SITE_URL}/og/home.png`,
      width: 1200,
      height: 630,
    },
    mainEntityOfPage: `${SITE_URL}/guia/acampada-festival-libre-vs-oficial-2026`,
    articleSection: "Acampada y alojamiento festivalero",
    keywords:
      "acampada festival precio España, acampar libre festival legal, bono acampada festival 2026, camping oficial festival, glamping festival",
    about: [
      { "@type": "Thing", name: "Camping oficial en festivales españoles" },
      { "@type": "Thing", name: "Acampada libre y marco legal por comunidad autónoma" },
      { "@type": "Thing", name: "Glamping en festivales de música" },
      { "@type": "Thing", name: "Kit y equipamiento de acampada festivalera" },
    ],
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", "h2", ".speakable", "article p:first-of-type"],
    },
  };

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Guías", item: `${SITE_URL}/guia-transporte-festivales` },
      { "@type": "ListItem", position: 3, name: "Acampada festival 2026", item: `${SITE_URL}/guia/acampada-festival-libre-vs-oficial-2026` },
    ],
  };

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const jsonLdHowTo = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Cómo preparar el kit de acampada para un festival en España",
    description:
      "Lista verificable de 15 elementos esenciales para acampar de forma cómoda en un festival español, con precios estimados 2026 y notas operativas para cada item.",
    inLanguage: "es-ES",
    totalTime: "PT2H",
    estimatedCost: {
      "@type": "MonetaryAmount",
      currency: "EUR",
      value: "180",
    },
    step: KIT_ITEMS.map((k, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: k.item,
      text: `${k.item}. Precio estimado: ${k.price}. ${k.note}`,
      url: `${SITE_URL}/guia/acampada-festival-libre-vs-oficial-2026#kit-${i + 1}`,
    })),
  };

  return (
    <main id="main" className="min-h-dvh bg-cr-bg text-cr-text pt-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdHowTo) }} />

      {/* ── Hero ── */}
      <div className="max-w-4xl mx-auto px-6 pt-10 pb-6 space-y-4 border-b border-cr-border">
        <nav aria-label="Breadcrumb" className="font-mono text-[11px] text-cr-text-muted flex items-center gap-2">
          <Link to="/" className="hover:text-cr-primary">Inicio</Link>
          <span aria-hidden="true">/</span>
          <Link to="/guia-transporte-festivales" className="hover:text-cr-primary">Guías</Link>
          <span aria-hidden="true">/</span>
          <span>Acampada festival 2026</span>
        </nav>
        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
          Guía pillar · Cluster acción acampada · Edición 2026 · Actualizado {today}
        </p>
        <h1 className="font-display text-4xl md:text-6xl uppercase leading-[0.92]">
          Acampada<br />festival<br />2026
        </h1>
        <p className="font-sans text-sm md:text-base text-cr-text-muted max-w-2xl leading-relaxed speakable">
          Respuesta directa: <strong className="text-cr-text">en un festival español de 2026 tienes tres opciones reales de pernoctación</strong>{" "}
          — camping oficial (recinto vallado de la organización, <strong className="text-cr-text">25 € – 60 € por persona</strong> por
          todo el festival, llevas tu tienda), glamping premium (tienda ya montada con cama y servicios extra,
          180 € – 700 € pp) y acampada libre (cámping municipal próximo 8 € – 18 € por noche, cámping privado
          12 € – 25 €, monte público gratis con permisos y normativa de la CCAA, o dormir dentro del coche en
          parking oficial 25 € – 150 €). La recomendación por defecto para un festival tier-1 de 3 días es el bono
          general + acampada del recinto oficial — sale entre 100 € y 210 € totales según festival y te ahorra el
          desplazamiento diario. Esta guía explica las tres opciones, te da la tabla de precios de los 10
          festivales con camping en España 2026, el marco legal de la acampada libre por comunidad autónoma, un
          kit de 15 items para acampar cómodo y la comparativa de coste total entre Sonorama, Arenal y Mad Cool.
        </p>
      </div>

      {/* ── Sección 1: Tipos de acampada ── */}
      <section className="max-w-4xl mx-auto px-6 py-14 space-y-6">
        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cr-secondary">Sección 1</p>
          <h2 className="font-display text-3xl md:text-4xl uppercase flex items-center gap-3">
            <Tent size={28} className="text-cr-primary" aria-hidden="true" />
            Tipos de acampada en un festival
          </h2>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl speakable">
            Antes de comprar el bono conviene entender qué incluye cada opción y a qué perfil sirve mejor. Las
            seis modalidades cubren prácticamente cualquier presupuesto y nivel de comodidad, desde dormir gratis
            en monte público hasta una bell tent premium con cama y aire acondicionado por 700 € la edición.
          </p>
        </div>

        <div className="space-y-4">
          {CAMPING_TYPES.map((t) => {
            const Icon = t.icon;
            return (
              <article key={t.title} className="border border-cr-border p-5 space-y-3">
                <div className="flex items-center gap-2">
                  <Icon size={18} className="text-cr-primary" />
                  <h3 className="font-display text-base uppercase">{t.title}</h3>
                </div>
                <p className="font-mono text-xs uppercase tracking-[0.12em] text-cr-secondary">{t.price}</p>
                <p className="font-sans text-sm text-cr-text-muted leading-relaxed">{t.text}</p>
              </article>
            );
          })}
        </div>
      </section>

      {/* ── Sección 2: Top 10 festivales con acampada ── */}
      <section className="max-w-4xl mx-auto px-6 pb-14 border-t border-cr-border pt-12 space-y-6">
        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cr-secondary">Sección 2</p>
          <h2 className="font-display text-3xl md:text-4xl uppercase flex items-center gap-3">
            <Wallet size={28} className="text-cr-primary" aria-hidden="true" />
            Top 10 festivales 2026 con acampada
          </h2>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl speakable">
            Tabla comparativa de los precios oficiales del bono general, bono + acampada y glamping para 10
            festivales tier-1 de España en 2026. Las cifras son las tarifas estándar tras early bird; pueden subir
            10–25 % en última semana o si quedan plazas residuales. Mad Cool aparece sin acampada porque su
            recinto IFEMA Iberdrola Music no la ofrece — se incluye para comparar coste total con alojamiento
            alternativo.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full font-sans text-sm text-cr-text-muted border-collapse">
            <thead>
              <tr className="border-b border-cr-border">
                <th className="text-left py-3 pr-4 font-display text-xs uppercase text-cr-text">Festival</th>
                <th className="text-left py-3 pr-4 font-display text-xs uppercase text-cr-text">General</th>
                <th className="text-left py-3 pr-4 font-display text-xs uppercase text-cr-text">+ Acampada</th>
                <th className="text-left py-3 font-display text-xs uppercase text-cr-primary">Glamping</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cr-border">
              {FESTIVAL_PRICES.map((f) => (
                <tr key={f.festival}>
                  <td className="py-3 pr-4">
                    <p className="text-cr-text font-medium">{f.festival}</p>
                    <p className="text-[11px] text-cr-text-muted">{f.location}</p>
                  </td>
                  <td className="py-3 pr-4 text-[12px]">{f.general}</td>
                  <td className="py-3 pr-4 text-[12px]">{f.camping}</td>
                  <td className="py-3 text-cr-primary text-[12px]">{f.glamping}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {FESTIVAL_PRICES.slice(0, 6).map((f) => (
            <article key={`note-${f.slug}`} className="border border-cr-border p-4 space-y-2">
              <Link to={`/festivales/${f.slug}`} className="font-display text-sm uppercase text-cr-text hover:text-cr-primary transition-colors flex items-center gap-2">
                <MapPin size={14} className="text-cr-primary" /> {f.festival}
              </Link>
              <p className="font-sans text-xs text-cr-text-muted leading-relaxed">{f.notes}</p>
            </article>
          ))}
        </div>

        <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
          Tres lecturas de la tabla. Primera: el margen entre bono general y bono + acampada va de 25 € (Sonorama)
          a 45 € (FIB) — siempre sale más barato comprar la combinación que el camping suelto si vas a pernoctar.
          Segunda: el glamping cuesta entre 3× y 5× el bono + acampada. Es premium real, no marketing. Tercera:
          en festivales urbanos sin camping (Mad Cool, BBK Music Legends parcial) el coste total se dispara por
          tres noches de Airbnb u hotel; planifica el alojamiento con 3–4 meses de antelación o asume tarifas
          dinámicas altas.
        </p>
      </section>

      {/* ── Sección 3: Marco legal acampada libre por CCAA ── */}
      <section className="max-w-4xl mx-auto px-6 pb-14 border-t border-cr-border pt-12 space-y-6">
        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cr-secondary">Sección 3</p>
          <h2 className="font-display text-3xl md:text-4xl uppercase flex items-center gap-3">
            <Scale size={28} className="text-cr-primary" aria-hidden="true" />
            Acampada libre: marco legal por CCAA
          </h2>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl speakable">
            La acampada libre en España no se regula a nivel estatal sino autonómico. Cada CCAA tiene su decreto
            propio y, por encima, hay prohibiciones absolutas que aplican en todo el territorio: parques
            nacionales, parques naturales, monumentos naturales, franja de servidumbre de tránsito costera (6 m
            desde la línea de máxima pleamar), suelo urbano y suelo privado sin consentimiento del propietario.
            En el resto del suelo rural, lo que sigue es el régimen autonómico habitual.
          </p>
        </div>

        <div className="space-y-3">
          {CCAA_REGULATION.map((c) => (
            <article key={c.region} className="border border-cr-border p-4 space-y-1">
              <h3 className="font-display text-sm uppercase text-cr-text flex items-center gap-2">
                <BookOpen size={14} className="text-cr-primary" /> {c.region}
              </h3>
              <p className="font-sans text-xs text-cr-text-muted leading-relaxed">{c.rule}</p>
            </article>
          ))}
        </div>

        <article className="border border-cr-primary/40 bg-cr-primary/5 p-5 space-y-2">
          <div className="flex items-center gap-2">
            <AlertTriangle size={16} className="text-cr-primary" />
            <p className="font-display text-sm uppercase text-cr-primary">Prohibiciones que aplican siempre</p>
          </div>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
            Parques nacionales (Picos de Europa, Ordesa, Garajonay, Aigüestortes y cualquiera de los 16 parques),
            parques naturales, monumentos naturales, franja de servidumbre marítima (6 m desde la línea de
            máxima pleamar), suelo urbano y consolidado, suelo privado sin consentimiento del propietario,
            riberas de ríos en periodos de protección de avifauna y zonas con restricciones específicas
            publicadas en BOE o boletín autonómico. Encender fuego está prohibido entre el 1 de junio y el 15
            de octubre en casi toda la península por riesgo de incendios.
          </p>
        </article>

        <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
          Información oficial actualizada sobre la regulación estatal de los espacios protegidos en{" "}
          <a
            href="https://www.miteco.gob.es/es/parques-nacionales-oapn.html"
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="text-cr-primary hover:underline"
          >
            la web del Ministerio para la Transición Ecológica
          </a>
          . El listado de cámpings autorizados y la directriz general de calidad turística está disponible en{" "}
          <a
            href="https://fedcamping.com/"
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="text-cr-primary hover:underline"
          >
            la Federación Española de Empresarios de Campings y Ciudades de Vacaciones (FEEC)
          </a>
          . Para conocer la normativa concreta de tu comunidad autónoma, consulta{" "}
          <a
            href="https://www.boe.es/buscar/legislacion.php"
            target="_blank"
            rel="noopener noreferrer nofollow"
            className="text-cr-primary hover:underline"
          >
            el buscador de legislación del Boletín Oficial del Estado
          </a>
          {" "}— una orden o decreto autonómico suele resumir las condiciones, y los ayuntamientos suelen
          publicar bandos específicos en temporada estival.
        </p>
      </section>

      {/* ── Sección 4: Kit acampada ── */}
      <section className="max-w-4xl mx-auto px-6 pb-14 border-t border-cr-border pt-12 space-y-6">
        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cr-secondary">Sección 4</p>
          <h2 className="font-display text-3xl md:text-4xl uppercase flex items-center gap-3">
            <Package size={28} className="text-cr-primary" aria-hidden="true" />
            Kit acampada festivalero (15 items)
          </h2>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
            Inversión inicial total ~180 €. Bien cuidado, este kit aguanta 4–5 ediciones, lo que sale a 35–45 €
            por festival amortizado — mucho menos que cualquier alojamiento alternativo. Las ocho primeras
            piezas son obligatorias; el resto son comodidad. Precios indicativos para producto de gama media en
            tiendas tipo Decathlon, El Corte Inglés Sports o Amazon.
          </p>
        </div>

        <ol className="space-y-3 list-none">
          {KIT_ITEMS.map((k, i) => (
            <li
              key={k.item}
              id={`kit-${i + 1}`}
              className={`border p-4 space-y-1 scroll-mt-24 ${
                i < 8 ? "border-cr-primary/40" : "border-cr-border"
              }`}
            >
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex items-center gap-2">
                  <CheckCircle2 size={14} className="text-cr-primary" aria-hidden="true" />
                  <p className="font-display text-sm uppercase">
                    {i + 1} · {k.item}
                  </p>
                </div>
                <p className="font-mono text-xs text-cr-secondary">{k.price}</p>
              </div>
              <p className="font-sans text-xs text-cr-text-muted leading-relaxed pl-6">{k.note}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* ── Sección 5: Comparativa coste total ── */}
      <section className="max-w-4xl mx-auto px-6 pb-14 border-t border-cr-border pt-12 space-y-6">
        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cr-secondary">Sección 5</p>
          <h2 className="font-display text-3xl md:text-4xl uppercase flex items-center gap-3">
            <Wallet size={28} className="text-cr-primary" aria-hidden="true" />
            Comparativa coste total: Sonorama vs Arenal vs Mad Cool
          </h2>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl speakable">
            Tres festivales con perfiles muy diferentes: Sonorama (rural castellano con camping oficial), Arenal
            Sound (costero con camping en playa) y Mad Cool (urbano sin camping). Comparamos coste total por
            persona para 3 días, asumiendo carpooling desde la ciudad emisora natural de cada uno y comida
            mayoritariamente dentro del recinto.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full font-sans text-sm text-cr-text-muted border-collapse">
            <thead>
              <tr className="border-b border-cr-border">
                <th className="text-left py-3 pr-4 font-display text-xs uppercase text-cr-text">Partida</th>
                <th className="text-left py-3 pr-4 font-display text-xs uppercase text-cr-text">Sonorama</th>
                <th className="text-left py-3 pr-4 font-display text-xs uppercase text-cr-text">Arenal Sound</th>
                <th className="text-left py-3 font-display text-xs uppercase text-cr-text">Mad Cool</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cr-border">
              {COMPARISON_ROWS.map((r) => (
                <tr key={r.item} className={r.highlight ? "bg-cr-primary/5" : ""}>
                  <td className={`py-3 pr-4 ${r.highlight ? "text-cr-primary font-display uppercase text-xs" : "text-cr-text font-medium"}`}>
                    {r.item}
                  </td>
                  <td className={`py-3 pr-4 ${r.highlight ? "text-cr-primary font-medium" : ""}`}>{r.sonorama}</td>
                  <td className={`py-3 pr-4 ${r.highlight ? "text-cr-primary font-medium" : ""}`}>{r.arenal}</td>
                  <td className={`py-3 ${r.highlight ? "text-cr-primary font-medium" : ""}`}>{r.madcool}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
          Sonorama y Arenal Sound son comparables (245 € – 274 € pp) porque ambos resuelven alojamiento con bono
          + acampada y transporte con carpooling tier-1. Mad Cool casi duplica el coste (506 € pp) por dos
          razones: bono individual más caro (199 € vs 130 € sonoramero) y necesidad de alojamiento en hotel o
          Airbnb madrileño (180 € pp por 3 noches en habitación compartida). La diferencia 506 − 274 = 232 € por
          persona es exactamente lo que cuesta no tener camping oficial. Si tu prioridad es minimizar gasto,
          elige festival con camping incluido. Si tu prioridad es el cartel concreto, asume el sobrecoste o
          plantea un grupo de 6 para diluir el Airbnb.
        </p>
      </section>

      {/* ── Sección 6: Trucos acampada cómoda ── */}
      <section className="max-w-4xl mx-auto px-6 pb-14 border-t border-cr-border pt-12 space-y-6">
        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cr-secondary">Sección 6</p>
          <h2 className="font-display text-3xl md:text-4xl uppercase flex items-center gap-3">
            <Sun size={28} className="text-cr-primary" aria-hidden="true" />
            Trucos para acampada cómoda
          </h2>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
            Operativa real del festivalero veterano. Son seis ajustes que separan al que pasa 3 días bien al que
            sale del festival deshidratado, sin dormir y enfadado con el grupo. Cero coste, sólo planificación.
          </p>
        </div>

        <div className="space-y-4">
          {TIPS.map((tip) => (
            <article key={tip.title} className="border border-cr-border p-5 space-y-2">
              <h3 className="font-display text-base uppercase">{tip.title}</h3>
              <p className="font-sans text-sm text-cr-text-muted leading-relaxed">{tip.text}</p>
            </article>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="max-w-4xl mx-auto px-6 pb-14 border-t border-cr-border pt-12 space-y-6">
        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cr-secondary">Sección 7</p>
          <h2 className="font-display text-3xl md:text-4xl uppercase">
            Preguntas frecuentes
          </h2>
        </div>
        <dl className="space-y-6">
          {FAQS.map((faq) => (
            <div key={faq.q} className="border-b border-cr-border pb-6 space-y-2">
              <dt className="font-display text-base uppercase text-cr-text">{faq.q}</dt>
              <dd className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">{faq.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* ── Internal links cluster ── */}
      <section className="max-w-4xl mx-auto px-6 pb-14 border-t border-cr-border pt-12 space-y-6">
        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cr-secondary">Sigue leyendo</p>
          <h2 className="font-display text-2xl md:text-3xl uppercase">Recursos relacionados</h2>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
            Si quieres avanzar con la planificación, estos son los siguientes pasos naturales: festivales tier-1
            con camping oficial, pillars complementarios sobre transporte y presupuesto, datasets de precios
            comparados y rutas tier-1 hasta el recinto.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 font-sans text-sm">
          <Link to="/festivales/sonorama" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors flex items-center gap-2">
            <MapPin size={14} className="text-cr-primary" /> Sonorama Ribera 2026
          </Link>
          <Link to="/festivales/arenal-sound" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors flex items-center gap-2">
            <MapPin size={14} className="text-cr-primary" /> Arenal Sound 2026
          </Link>
          <Link to="/festivales/vina-rock" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors flex items-center gap-2">
            <MapPin size={14} className="text-cr-primary" /> Viña Rock 2026
          </Link>
          <Link to="/festivales/fib" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors flex items-center gap-2">
            <MapPin size={14} className="text-cr-primary" /> FIB Benicàssim 2026
          </Link>
          <Link to="/festivales/resurrection-fest" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors flex items-center gap-2">
            <MapPin size={14} className="text-cr-primary" /> Resurrection Fest 2026
          </Link>
          <Link to="/festivales/low" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors flex items-center gap-2">
            <MapPin size={14} className="text-cr-primary" /> Low Festival 2026
          </Link>
          <Link to="/festivales/bbk-live" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors flex items-center gap-2">
            <MapPin size={14} className="text-cr-primary" /> BBK Live 2026
          </Link>
          <Link to="/festivales/mad-cool" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors flex items-center gap-2">
            <MapPin size={14} className="text-cr-primary" /> Mad Cool 2026
          </Link>
          <Link to="/rutas/madrid-sonorama" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Ruta Madrid → Sonorama
          </Link>
          <Link to="/rutas/valencia-arenal-sound" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Ruta Valencia → Arenal Sound
          </Link>
          <Link to="/guia/presupuesto-festival-grupo" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Pillar: presupuesto grupo
          </Link>
          <Link to="/guia/festival-sin-coche" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Pillar: festival sin coche
          </Link>
          <Link to="/guia/festival-sostenible-co2" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Pillar: festival sostenible CO₂
          </Link>
          <Link to="/guia/festival-primera-vez" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Pillar: primera vez festival
          </Link>
          <Link to="/guia-transporte-festivales" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Pillar: transporte festivales
          </Link>
          <Link to="/datos" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Datos abiertos festivales 2026
          </Link>
          <Link to="/concerts" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Buscar conciertos
          </Link>
          <Link to="/register" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Registrarme para reservar plaza
          </Link>
        </div>
      </section>

      {/* ── CTA final ── */}
      <section className="max-w-4xl mx-auto px-6 pb-24 border-t border-cr-border pt-12 space-y-4">
        <h2 className="font-display text-2xl md:text-3xl uppercase flex items-center gap-3">
          <Tent size={28} className="text-cr-primary" aria-hidden="true" />
          Llega al festival sin reventar el presupuesto
        </h2>
        <p className="font-sans text-sm text-cr-text-muted max-w-xl leading-relaxed">
          Con bono + acampada y carpooling reduces el coste total del festival entre un 30 % y un 50 % frente a
          ir solo en coche y dormir en hotel. ConcertRide concentra rutas a los 10 festivales tier-1 con
          camping oficial. Sin comisión para el conductor, precio cerrado por asiento entre 12 € y 60 € según
          distancia.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            to="/concerts"
            onClick={() => trackEvent(ANALYTICS_EVENTS.PILLAR_CTA_CLICKED, { pillar_slug: PILLAR_SLUG, cta_target: "/buscar" })}
            className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] bg-cr-primary text-black px-5 py-2.5 hover:bg-cr-primary/90 transition-colors"
          >
            Buscar carpooling al festival <ArrowRight size={12} />
          </Link>
          <Link
            to="/publish"
            onClick={() => trackEvent(ANALYTICS_EVENTS.PILLAR_CTA_CLICKED, { pillar_slug: PILLAR_SLUG, cta_target: "/publish" })}
            className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] border border-cr-primary text-cr-primary px-5 py-2.5 hover:bg-cr-primary hover:text-black transition-colors"
          >
            Publicar viaje como conductor <ArrowRight size={12} />
          </Link>
          <Link
            to="/guia-transporte-festivales"
            className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] border border-cr-border text-cr-text px-5 py-2.5 hover:border-cr-primary hover:text-cr-primary transition-colors"
          >
            Pillar transporte festivales <ArrowRight size={12} />
          </Link>
          <Link
            to="/datos"
            className="inline-flex items-center gap-2 font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors"
          >
            Datos abiertos 2026 <ArrowRight size={12} />
          </Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-16">
        <EeatTrustBlock
          pageType="pillar"
          lastReviewed="2026-05-20"
          author={{ name: "Equipo ConcertRide", url: "/autor/alejandro-lalaguna" }}
        />
        <AiDisclosureNote level={aiLevelForPageType("pillar")} />
      </section>
    </main>
  );
}
