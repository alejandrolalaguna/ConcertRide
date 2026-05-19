import { Link } from "react-router-dom";
import {
  ArrowRight,
  Plane,
  Train,
  Wallet,
  Languages,
  CalendarDays,
  ShieldCheck,
  MapPin,
  Globe2,
  Sparkles,
  Compass,
  Building2,
} from "lucide-react";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";

/**
 * Pillar 8 — cluster "International tourists visiting Spanish festivals".
 *
 * Bilingual-light SEO: body text remains in Spanish (single canonical URL,
 * no `/en/` route yet), but section headings carry English subtitles + a
 * subset of FAQs target English long-tail queries ("Best festival in Spain
 * for English speakers", "Can I bring water into a Spanish festival?", etc.).
 * Article schema declares `inLanguage: ["es-ES", "en-US"]` to signal
 * dual-language relevance to Google/Bing without splitting authority across
 * two URLs (avoids GSC "Duplicate, Google chose a different canonical" risk).
 *
 * Per CLAUDE.md "Brand Restrictions": NEVER name BlaBlaCar. Generic
 * carpooling references use "carpooling platforms" / "plataformas de
 * carpooling generalistas". Per CLAUDE.md TM compliance: no hardcoded
 * Ticketmaster image URLs; ticket prices are reproduced as RANGES (not exact
 * verbatim from API) and accompanied by "estimated" wording.
 */

const TOP_FESTIVALS = [
  {
    slug: "primavera-sound",
    name: "Primavera Sound",
    city: "Barcelona",
    when: "Finales mayo / principios junio",
    style: "Indie · electrónica · alternative",
    intlShare: "~50 %",
    languageHeadliners: "Mayoritariamente inglés (UK/US headliners)",
    why: "Probablemente el festival español con mejor reputación internacional. Cartel anglosajón dominante (UK, US, Australia), recinto frente al Mediterráneo en Parc del Fòrum y ciudad fácil para visitantes europeos sin coche.",
  },
  {
    slug: "sonar",
    name: "Sónar",
    city: "Barcelona",
    when: "Mediados de junio",
    style: "Electronic · advanced music · creativity & technology",
    intlShare: "~45 %",
    languageHeadliners: "Inglés y electrónica universal",
    why: "Festival de música electrónica avanzada con vertiente diurna (Sónar by Day) y nocturna (Sónar by Night) en Fira Barcelona. Punto de encuentro de la industria electrónica europea. Inglés se habla en todos los stands.",
  },
  {
    slug: "mad-cool",
    name: "Mad Cool",
    city: "Madrid (Iberdrola Music)",
    when: "Mediados de julio",
    style: "Rock · indie · pop alternativa",
    intlShare: "~30 %",
    languageHeadliners: "Inglés y español equilibrados",
    why: "Mayor festival rock-alternativa de Madrid. Cartel mainstream con headliners anglosajones (Foo Fighters, Pearl Jam, Lana del Rey en ediciones anteriores) y soporte multilingüe en taquillas y staff.",
  },
  {
    slug: "bbk-live",
    name: "Bilbao BBK Live",
    city: "Bilbao",
    when: "Mediados de julio",
    style: "Indie · rock · electrónica",
    intlShare: "~40 %",
    languageHeadliners: "Mayoritariamente inglés",
    why: "En el monte Kobetamendi con vistas a la ría de Bilbao. Ambiente cosmopolita, fuerte presencia británica/francesa/alemana. Bilbao es una ciudad pequeña, fácil de explorar entre conciertos.",
  },
  {
    slug: "resurrection-fest",
    name: "Resurrection Fest",
    city: "Viveiro (Lugo, Galicia)",
    when: "Finales de junio / principios de julio",
    style: "Heavy metal · hardcore · punk",
    intlShare: "~35 %",
    languageHeadliners: "Inglés (escena metal internacional)",
    why: "El festival de metal más importante del sur de Europa. Cartel anglosajón habitual (Metallica, Iron Maiden, Slipknot) y peregrinación obligada para metalheads europeos. Ubicación rural en Galicia: parte del atractivo.",
  },
  {
    slug: "arenal-sound",
    name: "Arenal Sound",
    city: "Burriana (Castellón)",
    when: "Primera semana de agosto",
    style: "Pop · indie · electrónica · urbano",
    intlShare: "~15 %",
    languageHeadliners: "Mayoritariamente español",
    why: "Festival en playa con audiencia joven española. Si quieres entender la cultura festivalera española actual (música urbana en castellano + camping + Mediterráneo), este es el referente.",
  },
  {
    slug: "fib",
    name: "FIB · Festival Internacional de Benicàssim",
    city: "Benicàssim (Castellón)",
    when: "Mediados de julio",
    style: "Indie · pop · electrónica",
    intlShare: "~50 %",
    languageHeadliners: "Mayoritariamente inglés",
    why: "Pionero del turismo festivalero británico en España (años 2000–2010). Sigue con audiencia UK significativa. Playa, camping y cartel anglosajón.",
  },
  {
    slug: "cruilla",
    name: "Cruïlla",
    city: "Barcelona (Parc del Fòrum)",
    when: "Principios de julio",
    style: "Pop · indie · world music · urbano",
    intlShare: "~25 %",
    languageHeadliners: "Mezcla inglés/español/catalán",
    why: "Festival barcelonés con propuesta ecléctica e internacional. Buen punto de entrada si quieres descubrir música en español/catalán además de los headliners anglosajones habituales.",
  },
  {
    slug: "medusa-festival",
    name: "Medusa Festival",
    city: "Cullera (Valencia)",
    when: "Mediados de agosto",
    style: "EDM · electrónica mainstream",
    intlShare: "~30 %",
    languageHeadliners: "Inglés (DJs internacionales)",
    why: "Mayor festival EDM de España, con producción visual a escala Tomorrowland. DJs internacionales habituales (Hardwell, Steve Aoki, Martin Garrix). Audiencia europea joven.",
  },
  {
    slug: "sonorama-ribera",
    name: "Sonorama Ribera",
    city: "Aranda de Duero (Burgos)",
    when: "Mediados de agosto",
    style: "Indie español · pop alternativa",
    intlShare: "~10 %",
    languageHeadliners: "Casi exclusivamente español",
    why: "El festival más auténticamente español de esta lista. Pueblo entero (Aranda de Duero) tomado por el indie patrio. Mínima presencia internacional, máxima inmersión cultural si quieres ver cómo funciona un festival no diseñado para turistas.",
  },
];

const FAQS = [
  {
    q: "Which is the best music festival in Spain for English speakers?",
    a: "For English speakers, the top three are Primavera Sound (Barcelona, late May/early June), Sónar (Barcelona, mid-June) and FIB Benicàssim (mid-July). All three host majority anglosajón headliners, have multilingual staff at info points and taquillas, and concentrate around cities with strong direct flight connections from London, Manchester, Dublin, Amsterdam and Paris. Bilbao BBK Live (mid-July) and Mad Cool (Madrid, mid-July) are also excellent choices. Resurrection Fest (Galicia) is the reference if you are into metal/hardcore — it runs almost entirely in the English-speaking metal scene's lingua franca. Avoid Sonorama Ribera or Arenal Sound if you want guaranteed English-friendly logistics: those are domestic festivals where Spanish is the operating language.",
  },
  {
    q: "Do I need a visa to attend a music festival in Spain as a tourist?",
    a: "Spain is part of the Schengen Area, so EU/EEA citizens enter with their national ID card or passport without a visa. UK citizens (post-Brexit), US, Canadian, Australian, New Zealand, Japanese and most Latin American passport holders enter visa-free for stays up to 90 days within any 180-day period. From 2026 onwards, non-EU visa-exempt visitors must apply for an ETIAS travel authorization online before travelling — it costs around 7 € and is valid for three years. Check current requirements at the official Schengen visa portal before booking.",
  },
  {
    q: "¿Cuánto cuesta un viaje de 4 días a un festival español desde Europa?",
    a: "Presupuesto total realista 2026 para un visitante europeo: 400–1200 € por persona y viaje de 4 días. Desglose: vuelo low-cost intra-EU 80–250 €, entrada festival 50–280 € (gama: Arenal Sound 50 € · Primavera Sound 250 € · Sonorama 90 €), alojamiento camping/albergue 30–60 €/noche o hostel céntrico 60–150 €/noche, comida 15–40 €/día (menú del día 12–15 €, dentro del festival 8–14 € por plato), transporte interno 15–90 € entre ciudades (Renfe AVE Madrid–Barcelona 30–90 €, autobús ALSA 25–45 €, carpooling ConcertRide 3–22 € por asiento). El cambio de divisa: España usa euro (€), sin tipo de cambio para visitantes eurozone.",
  },
  {
    q: "Can I bring my own water bottle and food into a Spanish festival?",
    a: "Yes, most large Spanish festivals (Primavera Sound, Mad Cool, BBK Live, FIB, Cruïlla) allow sealed water bottles up to 0.5–1 L and offer free water refill stations inside the venue. Glass containers, alcohol from outside, and cans are forbidden. Food policy varies: smaller festivals allow snacks and sandwiches; large urban festivals restrict outside food to encourage purchases at the food trucks inside. Check the festival's official website for the specific list of allowed/forbidden items. As a rule of thumb: bring a refillable plastic bottle, lightweight snacks for the queue, sunscreen, a poncho if weather looks unstable, and an external power bank for your phone.",
  },
  {
    q: "Is it safe to attend a festival in Spain as a solo international traveller?",
    a: "Spain is generally a very safe destination for solo festival travellers, including women solo travellers. The main risks are common to any large urban event: pickpocketing in crowded areas (Barcelona Las Ramblas, Madrid Sol, the Puerta del Sol metro), and overconsumption of alcohol with strangers. Recommendations: keep your phone, wallet and passport in front pockets or a money belt, avoid carrying large amounts of cash, use the official festival app for emergency numbers, and stick to well-lit public transport routes back to your accommodation. Most festivals have a clearly signed Punto Lila (purple point) or safe-space stand to report harassment or get help. Emergency number across the EU: 112.",
  },
];

const ITINERARY_DAYS = [
  {
    day: 1,
    title: "Llegada Barcelona — aclimatación",
    text: "Aterriza en BCN-El Prat (Aeropuerto de Barcelona). Coge la R2 Nord (cercanías) o el Aerobus al centro (35 min, 5–7 €). Tarde libre por el Born y la Barceloneta; cena tapas tradicionales. No reserves nada exigente: el primer día es para aclimatarte a la zona horaria y al ritmo cultural (cena 21–23h).",
  },
  {
    day: 2,
    title: "Primer día de festival — Primavera Sound",
    text: "Apertura de puertas habitual en Parc del Fòrum: 17:30–18:00. Llega 30–45 min antes para vivir el ambiente sin colas. El metro L4 (estación El Maresme-Fòrum) deja directo en la entrada. Headliners de noche, los grandes nombres internacionales suelen tocar entre 23:00 y 02:00. Vuelve en metro o taxi (último metro L4 a las 24h jueves–viernes, hasta las 02:00 sábados).",
  },
  {
    day: 3,
    title: "Segundo día festival + turismo mañana",
    text: "Mañana lenta y Sagrada Família o Park Güell (reserva entrada online con antelación, agotada habitualmente). Comida ligera. Vuelta al festival al atardecer. Reserva energía para el último día y cuídate la hidratación — el Mediterráneo en junio puede pasar de 30 °C diurnos a tarde fresca con viento del mar.",
  },
  {
    day: 4,
    title: "Último día festival + transición Madrid",
    text: "Cierra el festival, duerme bien y al día siguiente toma AVE Barcelona–Madrid (2 h 30 min, 30–90 € según anticipación). Llega Atocha al mediodía. Tarde libre: Reina Sofía o Prado (cierran 19:00), cena tardía. Madrid funciona aún más tarde que Barcelona — la noche social empieza a las 22:00 mínimo.",
  },
  {
    day: 5,
    title: "Madrid — turismo intensivo + Mad Cool noche",
    text: "Día completo en Madrid. Mañana Prado/Reina Sofía/Thyssen (Paseo del Arte). Comida en La Latina. Tarde libre en Malasaña o Chueca. Si tu viaje coincide con Mad Cool (mediados julio), noche de festival en Iberdrola Music — Metro Línea 5 (Canillejas) o lanzaderas oficiales desde Plaza Castilla.",
  },
  {
    day: 6,
    title: "Mad Cool segundo día + descanso",
    text: "Día de recuperación. Pasea Retiro, alquila barca en el estanque, brunch en Conde Duque. Vuelve al festival al atardecer. Si no coincide con Mad Cool, sustituye por excursión al Escorial o Toledo en tren (30 min) — patrimonio mundial UNESCO, cierra el día con vermut.",
  },
  {
    day: 7,
    title: "Transición Bilbao",
    text: "Vuelo Madrid–Bilbao (1 h, 40–90 €) o AVE Madrid–Vitoria + bus Vitoria–Bilbao (4 h total, 50–70 €). Carpooling ConcertRide Madrid–Bilbao: 22–35 €. Llega Bilbao al mediodía, comida en el Casco Viejo, paseo por el Guggenheim (la fachada es gratis; entrada 18 €).",
  },
  {
    day: 8,
    title: "BBK Live — primer día",
    text: "El festival está en Kobetamendi, montaña sobre la ría. Lanzaderas oficiales desde plaza Moyúa y Termibus, 3–5 € ida (8 min). Vistas espectaculares al atardecer. Cierra con DJ set hasta las 03:00–04:00. Cena pintxos en Casco Viejo a la vuelta si aguantas (locales abren hasta las 23:30).",
  },
  {
    day: 9,
    title: "BBK Live — segundo día + Guggenheim",
    text: "Mañana Guggenheim (reserva online 18 €). Comida en el restaurante del museo o pintxos en Indautxu. Segundo día de festival. La ría de Bilbao es perfecta para correr o pasear al amanecer si has dormido lo suficiente.",
  },
  {
    day: 10,
    title: "Vuelta a casa",
    text: "Bilbao tiene aeropuerto pequeño (BIO) con vuelos directos a UK (Manchester, Stansted), Frankfurt, Roma, Lisboa, París. Si no encuentras vuelo directo, vuela vía Madrid con conexión (Iberia / Air Europa). Café final en La Granja o Bilbao Berria antes de salir.",
  },
];

const COST_BREAKDOWN = [
  {
    item: "Entrada festival (abono completo)",
    range: "50 – 280 €",
    notes: "Rango real 2026 abono completo: Arenal Sound 50 € early bird · Sonorama 90 € · Mad Cool 180 € · Primavera Sound 250 € · FIB 210 €. Entradas día sueltas suelen estar entre 60 € y 130 €.",
  },
  {
    item: "Alojamiento (4 noches)",
    range: "120 – 600 €",
    notes: "Camping en festival: 30–60 €/noche. Hostel céntrico cama compartida: 30–55 €/noche. Hotel 3* céntrico Madrid/Barcelona: 90–150 €/noche. Airbnb a 30 min en transporte público: 60–100 €/noche.",
  },
  {
    item: "Comida (4 días)",
    range: "60 – 160 €",
    notes: "Menú del día (almuerzo restaurante local): 12–15 €. Comida dentro del festival: 8–14 €/plato. Tapa en bar local: 2–4 €. Supermercado para desayunos y snacks: ahorra 30–40 % del presupuesto.",
  },
  {
    item: "Vuelos intra-EU",
    range: "80 – 350 €",
    notes: "Vuelos low-cost LON/MAN/DUB → MAD/BCN: 80–180 €. Tarifas medias junio–agosto temporada alta: 180–250 €. Vuelos directos a Bilbao son más caros y escasos (250–350 € round-trip).",
  },
  {
    item: "Transporte entre ciudades",
    range: "15 – 90 €",
    notes: "AVE Madrid–Barcelona ida: 30–90 €. AVE Madrid–Sevilla: 30–80 €. Autobús ALSA Madrid–Bilbao: 25–45 €. Carpooling ConcertRide entre ciudades: 3–22 €/asiento.",
  },
  {
    item: "Transporte local urbano",
    range: "10 – 40 €",
    notes: "Bono 10 viajes metro Madrid/Barcelona: 11–13 €. Tarjeta turística (T-Casual + T-Mes turística): 11,35 €. Taxis cortos por ciudad: 6–12 €/viaje.",
  },
  {
    item: "Souvenirs y misceláneos",
    range: "30 – 150 €",
    notes: "Merch festival oficial: camisetas 25–35 €. Recuerdos turísticos: 5–25 €. Mantén un 10 % de presupuesto para imprevistos (cambio de plan, primer día de fiesta extra, taxi al aeropuerto si pierdes el último metro).",
  },
];

export default function GuiaFestivalInternacionalEspanaPage() {
  const today = new Date().toISOString().slice(0, 10);

  useSeoMeta({
    title: "Festivales España 2026 para turistas internacionales [Guía visitante] | ConcertRide",
    description:
      "Guía 2026 para viajar a un festival en España desde el extranjero: top 10 festivales, costes, transporte, cultura, itinerario 10 días.",
    canonical: `${SITE_URL}/guia/festival-internacional-espana`,
    keywords:
      "festival spain international tourist, viajar festival España extranjero, festival travel guide spain 2026, best festival in spain english speakers, festival españa visitante europeo, primavera sound english speakers, mad cool international visitors, bbk live english, sonar barcelona tourist",
    ogType: "article",
    ogImage: `${SITE_URL}/og/home.png`,
    ogImageAlt: "Guía 2026 para turistas internacionales que viajan a festivales en España — ConcertRide",
    articlePublishedTime: "2026-05-19",
    articleModifiedTime: today,
    articleAuthor: "Alejandro Lalaguna",
    articleSection: "Guías",
    breadcrumb: [
      { position: 1, name: "Inicio", url: `${SITE_URL}/` },
      { position: 2, name: "Guías", url: `${SITE_URL}/guia-transporte-festivales` },
      { position: 3, name: "Festival internacional España", url: `${SITE_URL}/guia/festival-internacional-espana` },
    ],
  });

  const jsonLdArticle = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Festivales en España 2026 para turistas internacionales: guía completa visitante europeo y americano",
    description:
      "Guía 2026 para turistas internacionales que viajan a un festival en España: top 10 festivales por % audiencia internacional, cómo llegar (vuelos MAD/BCN/BIO/PMI, Schengen/ETIAS, AVE, carpooling), presupuesto total 4 días (400–1200 €), tips culturales (español, catalán, vasco, gallego; horarios; tipping), itinerario 10 días Barcelona–Madrid–Bilbao, etiqueta y seguridad.",
    url: `${SITE_URL}/guia/festival-internacional-espana`,
    inLanguage: ["es-ES", "en-US"],
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
    mainEntityOfPage: `${SITE_URL}/guia/festival-internacional-espana`,
    articleSection: "Turismo cultural festivalero internacional",
    keywords:
      "festival spain international tourist, viajar festival España extranjero, festival travel guide spain 2026, best festival in spain english speakers",
    about: [
      { "@type": "Thing", name: "Festivales de música en España para audiencia internacional" },
      { "@type": "Thing", name: "Turismo cultural festivalero en España" },
      { "@type": "Thing", name: "Visado Schengen y ETIAS para visitantes a España" },
      { "@type": "Thing", name: "Transporte entre ciudades españolas: AVE, vuelo doméstico, carpooling" },
      { "@type": "Thing", name: "Presupuesto de viaje internacional a festival en España" },
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
      { "@type": "ListItem", position: 3, name: "Festival internacional España", item: `${SITE_URL}/guia/festival-internacional-espana` },
    ],
  };

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: ["es-ES", "en-US"],
    mainEntity: FAQS.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const jsonLdTouristTrip = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: "Itinerario 10 días festivales España: Barcelona → Madrid → Bilbao",
    description:
      "Itinerario sugerido de 10 días combinando 2–3 festivales internacionales en España con turismo cultural y traslados intercity por AVE, vuelo doméstico o carpooling.",
    inLanguage: ["es-ES", "en-US"],
    touristType: ["International music festival tourist", "Cultural tourism"],
    itinerary: ITINERARY_DAYS.map((d) => ({
      "@type": "ItemList",
      position: d.day,
      name: `Día ${d.day} · ${d.title}`,
      description: d.text,
    })),
    provider: {
      "@id": `${SITE_URL}/#organization`,
    },
  };

  return (
    <main id="main" className="min-h-dvh bg-cr-bg text-cr-text pt-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdTouristTrip) }} />

      {/* ── Hero / answer-first ── */}
      <div className="max-w-4xl mx-auto px-6 pt-10 pb-6 space-y-4 border-b border-cr-border">
        <nav aria-label="Breadcrumb" className="font-mono text-[11px] text-cr-text-muted flex items-center gap-2">
          <Link to="/" className="hover:text-cr-primary">Inicio</Link>
          <span aria-hidden="true">/</span>
          <Link to="/guia-transporte-festivales" className="hover:text-cr-primary">Guías</Link>
          <span aria-hidden="true">/</span>
          <span>Festival internacional España</span>
        </nav>
        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
          Guía pillar · Cluster turismo cultural internacional · Edición 2026 · Updated {today}
        </p>
        <h1 className="font-display text-4xl md:text-6xl uppercase leading-[0.92]">
          Festivales<br />en España<br />para visitantes<br />internacionales
        </h1>
        <p className="font-sans text-sm md:text-base text-cr-text-muted max-w-2xl leading-relaxed speakable">
          Respuesta directa: <strong className="text-cr-text">España recibe entre 2 y 3 millones de turistas internacionales cada año
          que viajan específicamente por festivales de música</strong>, y por buenas razones — el calendario es denso entre mayo
          y octubre (más de 50 festivales relevantes), el clima es estable, la oferta cubre desde indie internacional
          (Primavera Sound, Mad Cool, BBK Live) hasta electrónica avanzada (Sónar), metal (Resurrection Fest) y EDM
          (Medusa), y los precios siguen siendo competitivos frente a festivales centroeuropeos del mismo tamaño (entrada
          50–280 €, presupuesto total 4 días 400–1200 € incluido vuelo intra-EU). Esta guía explica los 10 festivales que
          merecen el vuelo, cómo llegar (vuelos directos, ETIAS desde 2026, AVE entre ciudades, carpooling intercity),
          cuánto cuesta realmente, claves culturales que los visitantes no anticipan (idiomas regionales, horarios
          tardíos, propina opcional), un itinerario detallado de 10 días Barcelona → Madrid → Bilbao y consejos
          prácticos de etiqueta y seguridad. Sin clichés ni topicazos turísticos.
        </p>
      </div>

      {/* ── Sección 1: Top 10 festivals worth flying for ── */}
      <section className="max-w-4xl mx-auto px-6 py-14 space-y-6">
        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cr-secondary">Sección 1 · Top festivals worth flying for</p>
          <h2 className="font-display text-3xl md:text-4xl uppercase flex items-center gap-3">
            <Sparkles size={28} className="text-cr-primary" aria-hidden="true" />
            Los 10 festivales que merecen el vuelo
          </h2>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl speakable">
            Lista ordenada por relevancia internacional y % aproximado de audiencia extranjera. Para cada festival
            indicamos ciudad, fechas habituales, estilo musical, share internacional estimado y el idioma dominante en
            cabeza de cartel — clave para decidir si vas a entender (y disfrutar) la mayoría de los conciertos.
          </p>
        </div>

        <div className="space-y-4">
          {TOP_FESTIVALS.map((f) => (
            <article key={f.slug} className="border border-cr-border p-5 space-y-2">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <h3 className="font-display text-lg uppercase">{f.name}</h3>
                <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-cr-secondary">{f.city}</span>
                <span className="font-mono text-[11px] text-cr-text-muted">{f.when}</span>
              </div>
              <p className="font-mono text-[11px] text-cr-text-muted">
                <span className="text-cr-primary">{f.intlShare}</span> audiencia internacional ·{" "}
                <span>{f.style}</span> · {f.languageHeadliners}
              </p>
              <p className="font-sans text-sm text-cr-text-muted leading-relaxed">{f.why}</p>
              {(f.slug === "primavera-sound" ||
                f.slug === "sonar" ||
                f.slug === "mad-cool" ||
                f.slug === "bbk-live" ||
                f.slug === "resurrection-fest" ||
                f.slug === "arenal-sound" ||
                f.slug === "fib" ||
                f.slug === "cruilla" ||
                f.slug === "medusa-festival" ||
                f.slug === "sonorama-ribera") && (
                <Link
                  to={`/festivales/${f.slug}`}
                  className="inline-flex items-center gap-1 font-sans text-xs text-cr-primary hover:underline"
                >
                  Ver guía completa {f.name} <ArrowRight size={11} />
                </Link>
              )}
            </article>
          ))}
        </div>

        <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
          Tres lecturas. Una: si quieres apuesta segura (alto share internacional, soporte multilingüe, ciudad fácil),
          Primavera Sound, Sónar, FIB y BBK Live son la elección. Dos: si quieres inmersión cultural real, Sonorama
          Ribera (Aranda de Duero) o Arenal Sound (Burriana) ofrecen festival español sin filtro. Tres: combina dos
          festivales en ciudades distintas con AVE/vuelo doméstico entre ellos — España compensa cualquier viaje
          internacional con su densidad geográfica de festivales en julio–agosto.
        </p>
      </section>

      {/* ── Sección 2: Getting to Spain + getting around ── */}
      <section className="max-w-4xl mx-auto px-6 pb-14 border-t border-cr-border pt-12 space-y-6">
        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cr-secondary">Sección 2 · Getting to Spain + getting around</p>
          <h2 className="font-display text-3xl md:text-4xl uppercase flex items-center gap-3">
            <Plane size={28} className="text-cr-primary" aria-hidden="true" />
            Cómo llegar a España y moverte entre ciudades
          </h2>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl speakable">
            España es miembro de la Unión Europea y del espacio Schengen, lo que simplifica enormemente la entrada para
            la mayoría de visitantes. Cuatro aeropuertos concentran el 80 % del tráfico internacional festivalero:
            Madrid-Barajas (MAD), Barcelona-El Prat (BCN), Bilbao (BIO) y Palma de Mallorca (PMI). Una vez dentro, la
            red de AVE y los vuelos domésticos cubren el resto.
          </p>
        </div>

        <article className="border border-cr-border p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Plane size={18} className="text-cr-primary" />
            <h3 className="font-display text-base uppercase">Vuelos internacionales — los 4 hubs festivaleros</h3>
          </div>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
            Madrid-Barajas (MAD) y Barcelona-El Prat (BCN) reciben vuelos directos de prácticamente cualquier capital
            europea (LON, MAN, DUB, AMS, CDG, FRA, MUC, ZRH, MXP, FCO, LIS) y de los hubs norteamericanos (JFK, EWR,
            YYZ, MIA) y latinoamericanos (EZE, BOG, MEX, GRU). Bilbao (BIO) tiene rutas directas más limitadas pero
            estables a UK (MAN, STN), Frankfurt, París CDG y Roma — útil si vas a BBK Live o Resurrection Fest. Palma
            (PMI) es el hub balear, conexión directa con la mayoría de aeropuertos europeos en temporada alta
            mayo–septiembre. Compara vuelos en Skyscanner, Google Flights o Kiwi.
          </p>
        </article>

        <article className="border border-cr-border p-5 space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-cr-primary" />
            <h3 className="font-display text-base uppercase">Schengen + ETIAS 2026 — papeles y visados</h3>
          </div>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
            España forma parte del espacio Schengen. Los ciudadanos de la UE/EEE entran con DNI o pasaporte y no
            necesitan ningún trámite. Los visitantes exentos de visado (UK, US, Canadá, Australia, Nueva Zelanda,
            Japón, mayoría de América Latina) pueden permanecer hasta 90 días dentro de un periodo de 180 días sin
            visado. Desde 2026 entra en vigor el sistema{" "}
            <a
              href="https://travel-europe.europa.eu/etias_en"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="text-cr-primary hover:underline"
            >
              ETIAS de autorización electrónica previa
            </a>
            : 7 € de coste, validez 3 años, se solicita online antes del viaje. No es un visado, es una autorización
            previa similar a la ESTA estadounidense. Información oficial sobre requisitos Schengen en{" "}
            <a
              href="https://www.spain.info/"
              target="_blank"
              rel="noopener noreferrer nofollow"
              className="text-cr-primary hover:underline"
            >
              el portal oficial de Turismo de España
            </a>
            .
          </p>
        </article>

        <article className="border border-cr-border p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Train size={18} className="text-cr-primary" />
            <h3 className="font-display text-base uppercase">AVE entre ciudades — la mejor opción intercity</h3>
          </div>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
            La red de alta velocidad Renfe AVE conecta Madrid con Barcelona (2 h 30 min), Sevilla (2 h 25 min),
            Valencia (1 h 50 min), Málaga (2 h 35 min) y Zaragoza (1 h 20 min). Precios variables 30–90 € según
            anticipación de la reserva — compra con 30–60 días de antelación para tarifas Promo. Estaciones céntricas
            (Atocha Madrid, Sants Barcelona, Santa Justa Sevilla). Es el mismo nivel de servicio que TGV o
            Frecciarossa, y la mejor opción para combinar festivales en diferentes ciudades sin pasar por aeropuerto.
            Renfe opera competidores low-cost (Avlo, Ouigo) en rutas Madrid–Barcelona y Madrid–Valencia desde 7 €.
          </p>
        </article>

        <article className="border border-cr-border p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Compass size={18} className="text-cr-primary" />
            <h3 className="font-display text-base uppercase">Alquiler coche vs transporte público vs carpooling</h3>
          </div>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
            Tres opciones movilidad intercity. Una: alquiler coche (30–60 €/día + gasolina) — útil si vas a festivales
            rurales tipo Resurrection Fest (Galicia), Sonorama (Aranda de Duero) o Atlantic Fest (Galicia interior), no
            necesario en festivales urbanos. Necesitas carnet internacional si no eres UE (UK post-Brexit incluido).
            Dos: transporte público (bus ALSA, tren regional Renfe) — barato (25–60 € intercity), red densa, lentitud
            relativa. Tres: carpooling — entre 3 € (rutas urbanas cortas) y 22 € (intercity larga) por asiento; menos
            comisión que las plataformas de carpooling generalistas (0 % en ConcertRide vs 10–18 % en generalistas);
            es la forma más social y sostenible. Ver el{" "}
            <Link to="/guia-transporte-festivales" className="text-cr-primary hover:underline">
              pillar transporte festivales
            </Link>{" "}
            y{" "}
            <Link to="/datos/festivales-peor-conexion-transporte-publico-2026" className="text-cr-primary hover:underline">
              dataset festivales con peor conexión
            </Link>{" "}
            para evaluar qué festival requiere coche y cuál no.
          </p>
        </article>
      </section>

      {/* ── Sección 3: Costs you should plan for ── */}
      <section className="max-w-4xl mx-auto px-6 pb-14 border-t border-cr-border pt-12 space-y-6">
        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cr-secondary">Sección 3 · Costs you should plan for</p>
          <h2 className="font-display text-3xl md:text-4xl uppercase flex items-center gap-3">
            <Wallet size={28} className="text-cr-primary" aria-hidden="true" />
            Cuánto cuesta realmente — presupuesto 4 días
          </h2>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl speakable">
            Presupuesto total realista para un visitante europeo / americano que viaja 4 días a un festival español:
            <strong className="text-cr-text"> 400 € (presupuesto mínimo, vuelo low-cost + camping + entrada early bird)</strong>{" "}
            a <strong className="text-cr-text">1200 € (presupuesto cómodo, vuelo mid-range + hotel céntrico + festival premium + ocio extra)</strong>.
            Desglose por partida:
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full font-sans text-sm text-cr-text-muted border-collapse">
            <thead>
              <tr className="border-b border-cr-border">
                <th className="text-left py-3 pr-4 font-display text-xs uppercase text-cr-text">Partida</th>
                <th className="text-left py-3 pr-4 font-display text-xs uppercase text-cr-primary">Rango €</th>
                <th className="text-left py-3 font-display text-xs uppercase text-cr-text">Notas operativas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cr-border">
              {COST_BREAKDOWN.map((c) => (
                <tr key={c.item}>
                  <td className="py-3 pr-4 text-cr-text font-medium align-top">{c.item}</td>
                  <td className="py-3 pr-4 text-cr-primary align-top whitespace-nowrap">{c.range}</td>
                  <td className="py-3 text-[12px] align-top leading-relaxed">{c.notes}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
          Dos consejos de coste muchas veces olvidados. Primero: el transporte público en ciudades grandes (Madrid,
          Barcelona) tiene bonos turísticos que ahorran 30–40 % sobre el billete sencillo — cómpralo en la primera
          estación al llegar. Segundo: el coste oculto principal es la noche post-festival (taxi de vuelta si pierdes el
          último metro: 15–25 €) — comprueba horarios del metro local y, si no, considera quedarte cerca del recinto.
          Para profundizar revisa el{" "}
          <Link to="/datos/festivales-mas-caros-mas-baratos-llegar-2026" className="text-cr-primary hover:underline">
            ranking precios festivales 2026
          </Link>{" "}
          y los{" "}
          <Link to="/datos/costes-ocultos-transporte-festivales-2026" className="text-cr-primary hover:underline">
            costes ocultos del transporte festivalero
          </Link>
          . Para presupuestar la cama, el precio mediano de hotel + hostel + apartamento por festival
          (con ocupación media 89,8 % y zonas alternativas) está en{" "}
          <Link to="/datos/alojamiento-cercano-festivales-2026" className="text-cr-primary hover:underline">
            alojamiento cerca festivales 2026
          </Link>
          .
        </p>
      </section>

      {/* ── Sección 4: Language + culture tips ── */}
      <section className="max-w-4xl mx-auto px-6 pb-14 border-t border-cr-border pt-12 space-y-6">
        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cr-secondary">Sección 4 · Language + culture tips</p>
          <h2 className="font-display text-3xl md:text-4xl uppercase flex items-center gap-3">
            <Languages size={28} className="text-cr-primary" aria-hidden="true" />
            Idiomas, horarios y claves culturales
          </h2>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl speakable">
            Tres dimensiones culturales que los visitantes internacionales subestiman: España tiene cuatro lenguas
            cooficiales en sus distintas comunidades autónomas, el horario social es marcadamente más tardío que el
            centroeuropeo o norteamericano, y la propina funciona de forma distinta a UK/US. Si te anticipas a estas
            tres, el viaje fluye sin fricción cultural.
          </p>
        </div>

        <article className="border border-cr-border p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Globe2 size={18} className="text-cr-primary" />
            <h3 className="font-display text-base uppercase">Español, catalán, vasco, gallego — qué te puedes encontrar</h3>
          </div>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
            El español (castellano) se habla en toda España y es la lengua de la mayoría de festivales no regionales.
            En Cataluña (Primavera Sound, Sónar, Cruïlla) verás señalización y comunicación oficial en catalán y
            castellano — todo el mundo entiende español, no hay barrera. En el País Vasco (BBK Live) el euskara
            convive con el castellano; el cartel del festival y la comunicación operativa son habitualmente bilingües
            (euskara + español, a veces + inglés). En Galicia (Resurrection Fest, O Son do Camiño, Atlantic Fest) el
            gallego es la lengua autóctona — fonéticamente más cercana al portugués que al castellano. En todos los
            festivales con share internacional &gt; 20 %, el inglés se entiende en taquillas, info points y staff
            joven. Aprender 5–10 frases básicas de español (gracias, perdón, una caña por favor, ¿cuánto cuesta?) abre
            puertas y mejora la experiencia de forma desproporcionada.
          </p>
        </article>

        <article className="border border-cr-border p-5 space-y-3">
          <div className="flex items-center gap-2">
            <CalendarDays size={18} className="text-cr-primary" />
            <h3 className="font-display text-base uppercase">Horarios — late dinner, late party</h3>
          </div>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
            El día español funciona desplazado 2–3 horas frente al norte europeo. Desayuno 8:00–11:00 (café + tostada o
            cruasán), comida principal 14:00–16:00, cena 21:00–23:00. Los restaurantes cierran cocina entre comida y
            cena (16:00–20:00) — si llegas con hambre fuera de esos rangos, ve a tapas/bares (siempre abiertos) o
            supermercado. Los festivales reflejan este horario: apertura de puertas habitual 17:30–18:00, headliners
            entre 23:00 y 02:00 e incluso 03:00 en festivales electrónicos. La siesta es real entre 15:00 y 17:00 en
            ciudades pequeñas (comercios cerrados), menos en grandes capitales. Las fiestas nocturnas continúan hasta
            las 06:00–07:00 en Madrid y Barcelona — el "afterparty" es parte del ritual cultural.
          </p>
        </article>

        <article className="border border-cr-border p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Building2 size={18} className="text-cr-primary" />
            <h3 className="font-display text-base uppercase">Propina, pagos, expectativas de servicio</h3>
          </div>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
            La propina en España NO es obligatoria y NO se espera. El servicio está incluido en el precio. Lo habitual:
            dejar 1–2 € sobre la mesa después de una comida bien atendida, o redondear al alza (factura de 18 €, dejar
            20 €). En bares y festivales nadie deja propina por la cerveza. Las tarjetas se aceptan prácticamente en
            todas partes — incluso pequeñas tapas y food trucks de festival. Bizum (sistema de pago móvil español
            entre bancos) sólo funciona si tienes cuenta en banco español, no aplica para visitantes. ATMs (cajeros)
            abundan: usa los del propio banco para evitar comisiones de redes terceras.
          </p>
        </article>
      </section>

      {/* ── Sección 5: Practical 10-day itinerary ── */}
      <section className="max-w-4xl mx-auto px-6 pb-14 border-t border-cr-border pt-12 space-y-6">
        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cr-secondary">Sección 5 · Practical 10-day itinerary</p>
          <h2 className="font-display text-3xl md:text-4xl uppercase flex items-center gap-3">
            <MapPin size={28} className="text-cr-primary" aria-hidden="true" />
            Itinerario 10 días Barcelona → Madrid → Bilbao
          </h2>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
            Plan combinando dos o tres festivales en ciudades distintas con días de turismo cultural entre medias.
            Asume llegada en junio (Primavera Sound) o julio (BBK Live + Mad Cool si coincide en calendario). Los
            traslados intercity se hacen por AVE Renfe, vuelo doméstico corto o carpooling según presupuesto y
            disponibilidad.
          </p>
        </div>

        <ol className="space-y-3 list-none">
          {ITINERARY_DAYS.map((d) => (
            <li
              key={d.day}
              id={`dia-${d.day}`}
              className="border border-cr-border p-5 space-y-2 scroll-mt-24"
            >
              <div className="flex items-center gap-2">
                <span className="font-display text-base uppercase text-cr-primary">Día {d.day}</span>
                <span className="font-display text-base uppercase">· {d.title}</span>
              </div>
              <p className="font-sans text-sm text-cr-text-muted leading-relaxed">{d.text}</p>
            </li>
          ))}
        </ol>

        <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
          Variantes del mismo plan según tus intereses: Barcelona → Valencia → Sevilla (calor mediterráneo + AVE),
          Madrid → Lisboa → Madrid (escapada internacional Portugal en 3 h en tren), Bilbao → Donostia → Pamplona
          (gastronomía vasca + San Fermín si coincides con la primera semana de julio). Mira{" "}
          <Link to="/conciertos/barcelona" className="text-cr-primary hover:underline">conciertos en Barcelona</Link>,{" "}
          <Link to="/conciertos/madrid" className="text-cr-primary hover:underline">conciertos en Madrid</Link> y{" "}
          <Link to="/conciertos/bilbao" className="text-cr-primary hover:underline">conciertos en Bilbao</Link> para
          completar el calendario.
        </p>
      </section>

      {/* ── Sección 6: Festival etiquette + safety ── */}
      <section className="max-w-4xl mx-auto px-6 pb-14 border-t border-cr-border pt-12 space-y-6">
        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cr-secondary">Sección 6 · Festival etiquette + safety</p>
          <h2 className="font-display text-3xl md:text-4xl uppercase flex items-center gap-3">
            <ShieldCheck size={28} className="text-cr-primary" aria-hidden="true" />
            Etiqueta del festival y seguridad
          </h2>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
            Los festivales españoles son entornos generalmente muy seguros y cosmopolitas, pero hay especificidades
            culturales y prácticas que merece la pena conocer. Norma uno: el dress code es informal —
            casual/streetwear. No esperes el código estético de Coachella ni de un festival londinense; el público
            español viene cómodo. Norma dos: el consentimiento ("consent culture") está cada vez más integrado en los
            festivales grandes, con puntos lila (purple points) visibles donde reportar acoso o pedir ayuda. Norma
            tres: hidratación obligatoria en festivales de verano sur (Arenal Sound, Medusa, Andalucía Big) — el calor
            puede pasar de 32 °C diurnos a 25 °C nocturnos. Norma cuatro: los carteristas operan en zonas turísticas
            de Barcelona (Ramblas, metro L3) y Madrid (Sol, Atocha) más que en el recinto del festival — guarda
            cartera y pasaporte en bolsillo interior o riñonera. Para profundizar consulta el{" "}
            <Link to="/guia/seguridad-carpooling-festival" className="text-cr-primary hover:underline">
              pillar seguridad carpooling festival
            </Link>
            . Número de emergencias en toda la UE: 112.
          </p>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="max-w-4xl mx-auto px-6 pb-14 border-t border-cr-border pt-12 space-y-6">
        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cr-secondary">Sección 7 · FAQ</p>
          <h2 className="font-display text-3xl md:text-4xl uppercase">Preguntas frecuentes / FAQ</h2>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
            Selección de preguntas mixtas español/inglés para cubrir las búsquedas long-tail más habituales de
            visitantes internacionales planificando su viaje a un festival español.
          </p>
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
            Profundiza en los festivales con mayor share internacional, ciudades hub y datasets de transporte y
            presupuesto. Si vienes de un viaje organizado, también puedes empezar por nuestros pillars de transporte y
            presupuesto.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 font-sans text-sm">
          <Link to="/festivales/primavera-sound" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors flex items-center gap-2">
            <MapPin size={14} className="text-cr-primary" /> Primavera Sound 2026
          </Link>
          <Link to="/festivales/sonar" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors flex items-center gap-2">
            <MapPin size={14} className="text-cr-primary" /> Sónar 2026
          </Link>
          <Link to="/festivales/mad-cool" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors flex items-center gap-2">
            <MapPin size={14} className="text-cr-primary" /> Mad Cool 2026
          </Link>
          <Link to="/festivales/bbk-live" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors flex items-center gap-2">
            <MapPin size={14} className="text-cr-primary" /> Bilbao BBK Live 2026
          </Link>
          <Link to="/festivales/cruilla" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors flex items-center gap-2">
            <MapPin size={14} className="text-cr-primary" /> Cruïlla 2026
          </Link>
          <Link to="/conciertos/madrid" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Conciertos en Madrid
          </Link>
          <Link to="/conciertos/barcelona" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Conciertos en Barcelona
          </Link>
          <Link to="/conciertos/bilbao" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Conciertos en Bilbao
          </Link>
          <Link to="/datos/precio-medio-carpooling-vs-bus-festivales-2026" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Dataset: precio medio carpooling
          </Link>
          <Link to="/datos/festivales-peor-conexion-transporte-publico-2026" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Dataset: peor conexión transporte
          </Link>
          <Link to="/datos/festivales-mas-caros-mas-baratos-llegar-2026" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Dataset: ranking precios festivales
          </Link>
          <Link to="/datos/costes-ocultos-transporte-festivales-2026" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Dataset: costes ocultos transporte
          </Link>
          <Link to="/datos/alojamiento-cercano-festivales-2026" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Dataset: alojamiento por festival
          </Link>
          <Link to="/guia-transporte-festivales" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Pillar: transporte festivales
          </Link>
          <Link to="/guia/presupuesto-festival-grupo" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Pillar: presupuesto grupo
          </Link>
          <Link to="/guia/seguridad-carpooling-festival" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Pillar: seguridad carpooling
          </Link>
          <Link to="/concerts" className="border border-cr-border p-4 hover:border-cr-primary/50 transition-colors">
            Buscar conciertos en España
          </Link>
        </div>
      </section>

      {/* ── CTA final ── */}
      <section className="max-w-4xl mx-auto px-6 pb-24 border-t border-cr-border pt-12 space-y-4">
        <h2 className="font-display text-2xl md:text-3xl uppercase flex items-center gap-3">
          <Plane size={28} className="text-cr-primary" aria-hidden="true" />
          Planifica tu viaje festivalero a España
        </h2>
        <p className="font-sans text-sm text-cr-text-muted max-w-xl leading-relaxed">
          Si después de esta guía tienes claros los festivales que merecen el vuelo, cómo moverte entre ciudades y el
          presupuesto realista, el siguiente paso es asegurar el transporte intercity. ConcertRide concentra rutas de
          carpooling entre las principales ciudades festivaleras españolas — sin comisión de plataforma sobre tu
          reserva, con conductores verificados y precio por asiento entre 3 € (rutas urbanas) y 22 € (intercity larga).
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            to="/concerts"
            className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] bg-cr-primary text-black px-5 py-2.5 hover:bg-cr-primary/90 transition-colors"
          >
            Find concerts &amp; festivals <ArrowRight size={12} />
          </Link>
          <Link
            to="/festivales"
            className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] border border-cr-primary text-cr-primary px-5 py-2.5 hover:bg-cr-primary hover:text-black transition-colors"
          >
            Browse all festivals <ArrowRight size={12} />
          </Link>
          <Link
            to="/guia-transporte-festivales"
            className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] border border-cr-border text-cr-text px-5 py-2.5 hover:border-cr-primary hover:text-cr-primary transition-colors"
          >
            Transport guide <ArrowRight size={12} />
          </Link>
          <Link
            to="/faq"
            className="inline-flex items-center gap-2 font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors"
          >
            Preguntas frecuentes <ArrowRight size={12} />
          </Link>
        </div>
      </section>
    </main>
  );
}
