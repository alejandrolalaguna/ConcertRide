import { Link } from "react-router-dom";
import { ArrowRight, Bus, Car, Train, Users, Moon, MapPin } from "lucide-react";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";
import { generateHowToSchema } from "@/lib/schemaGenerators";

/**
 * Pillar SEO page — cluster "festival sin coche".
 *
 * Targets: "ir a festival sin coche", "festival sin coche propio", "cómo
 * llegar a festival sin coche", "festival sin conducir". Awareness-stage
 * cluster, answer-first format, AIO/Perplexity citable.
 *
 * NOTE: Per CLAUDE.md "Brand Restrictions" — NEVER name competing carpooling
 * brands. Use "otras plataformas de carpooling" if needed.
 */

const FAQS = [
  {
    q: "¿Se puede ir a un festival de música en España sin coche propio?",
    a: "Sí, sin problema. Hay tres formas reales de llegar a casi cualquier festival español sin coche: carpooling como pasajero (3–22 €/asiento según distancia), autobús oficial del festival (15–35 €) y tren + lanzadera o taxi desde la estación más cercana (15–60 €). El carpooling es la más flexible porque sale puerta a puerta, no depende de horarios fijos y permite pactar la vuelta de madrugada con el conductor. Para festivales rurales como Resurrection Fest (Viveiro), Arenal Sound (Burriana) o Sonorama (Aranda de Duero) el carpooling es prácticamente la única opción sin coche.",
  },
  {
    q: "¿Cuánto cuesta ir a un festival sin coche desde Madrid?",
    a: "Desde Madrid, el carpooling como pasajero cuesta entre 4 y 20 € por asiento según el destino: 4–7 € a Mad Cool (15 km), 12–17 € al FIB de Benicàssim (465 km), 15–20 € a Primavera Sound y Sónar (Barcelona, 620 km), 17–23 € a Resurrection Fest (Viveiro). El autobús oficial suele costar 20–40 € (cuando existe), y combinar AVE + lanzadera ronda los 50–110 € para destinos largos. Sólo en festivales muy cercanos a Madrid (Mad Cool, Tomavistas, Download Madrid) el metro o cercanías son competitivos en precio, aunque no en horario de vuelta.",
  },
  {
    q: "¿Qué festivales españoles son los más accesibles sin coche?",
    a: "Los festivales urbanos con buena conexión de metro son los más accesibles: Primavera Sound (Parc del Fòrum, metro L4 Besòs Mar), Sónar (Fira Montjuïc / Fira Gran Via L'Hospitalet, metro L9 Sur), Cruïlla (Parc del Fòrum, mismo metro), Mad Cool (Iberdrola Music, metro L3 Villaverde Alto) y Tomavistas (IFEMA, metro L8). Para todos ellos puedes llegar en transporte público, pero la vuelta de madrugada (después de las 2:00) ya no la cubre el metro: ahí el carpooling vuelve a ser la opción más práctica.",
  },
  {
    q: "¿Cómo volver de un festival rural sin coche?",
    a: "Para festivales rurales (Resurrection Fest en Viveiro, Arenal Sound en Burriana, BBK Live en Kobetamendi, Sonorama en Aranda de Duero) no hay transporte público de madrugada. Las únicas opciones reales son: (1) carpooling de vuelta pactado con el conductor antes del festival — sale al precio de la ida, (2) taxi compartido al pueblo más cercano y dormir allí, o (3) acampar dentro del recinto si lo permite. Con ConcertRide, lo habitual es buscar un viaje redondo (ida + vuelta) con el mismo conductor y pactar la hora exacta antes de salir.",
  },
  {
    q: "¿Es seguro ir a un festival con carpooling siendo pasajero?",
    a: "Sí. ConcertRide exige carnet de conducir verificado antes de publicar un viaje, perfil con foto, valoraciones públicas y un sistema de reseñas tras el trayecto. Antes de reservar puedes ver el coche, leer reseñas de otros pasajeros y chatear con el conductor. Recomendaciones prácticas: compartir el itinerario con un amigo, confirmar matrícula al subir, no llevar todo el efectivo encima y pagar al conductor solo al llegar (efectivo o Bizum). El 92% de los viajes recibe 5 estrellas según datos internos de ConcertRide 2025.",
  },
];

export default function GuiaFestivalSinCochePage() {
  const today = new Date().toISOString().slice(0, 10);

  useSeoMeta({
    title: "Cómo ir a un festival sin coche 2026 [Guía 3 vías] | ConcertRide",
    description:
      "Cómo llegar a un festival de música sin coche propio: carpooling como pasajero, bus oficial y tren+lanzadera. Precios reales y top rutas 2026.",
    canonical: `${SITE_URL}/guia/festival-sin-coche`,
    keywords:
      "festival sin coche, ir a festival sin coche propio, cómo llegar a festival sin coche, festival sin conducir, carpooling festival pasajero, bus festival España, tren festival, transporte festival España 2026",
    ogType: "article",
    ogImage: `${SITE_URL}/og/home.png`,
    ogImageAlt: "Guía cómo ir a un festival sin coche en España 2026",
    articlePublishedTime: "2026-05-17",
    articleModifiedTime: today,
    articleAuthor: "Alejandro Lalaguna",
    articleSection: "Guías",
    breadcrumb: [
      { position: 1, name: "Inicio", url: `${SITE_URL}/` },
      { position: 2, name: "Guías", url: `${SITE_URL}/guia-transporte-festivales` },
      { position: 3, name: "Festival sin coche", url: `${SITE_URL}/guia/festival-sin-coche` },
    ],
  });

  const jsonLdArticle = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Cómo ir a un festival sin coche en España 2026: carpooling, bus y tren comparados",
    description:
      "Guía completa para llegar a un festival de música sin coche propio en España: carpooling como pasajero, autobús oficial y tren+lanzadera con precios reales por festival y casos por ciudad de origen.",
    url: `${SITE_URL}/guia/festival-sin-coche`,
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
    datePublished: "2026-05-17",
    dateModified: today,
    image: {
      "@type": "ImageObject",
      url: `${SITE_URL}/og/home.png`,
      width: 1200,
      height: 630,
    },
    mainEntityOfPage: `${SITE_URL}/guia/festival-sin-coche`,
    articleSection: "Guía de viaje",
    keywords:
      "festival sin coche, festival sin coche propio, cómo ir a festival sin coche, carpooling festival pasajero, autobús festival España, tren festival",
    about: {
      "@type": "Thing",
      name: "Asistir a festivales de música sin coche propio en España",
    },
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
      { "@type": "ListItem", position: 3, name: "Festival sin coche", item: `${SITE_URL}/guia/festival-sin-coche` },
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

  // HowTo schema for "Sección 4 · Cómo coordinar un grupo de amigos sin coche".
  // The 5 steps below are *literally* the same Pasos 1–5 rendered in the page DOM;
  // do not invent or paraphrase steps that aren't visible in the article body.
  const jsonLdHowTo = generateHowToSchema({
    name: "Cómo coordinar un grupo de amigos para ir a un festival sin coche",
    description:
      "Cinco pasos para que un grupo de 3–6 personas sin coche propio organice ida y vuelta a un festival de música en España.",
    totalTime: "PT1H",
    estimatedCost: { currency: "EUR", value: "15" },
    pageUrl: `${SITE_URL}/guia/festival-sin-coche`,
    steps: [
      {
        name: "Confirmar quién conduce o si vais todos como pasajeros",
        text: "Si nadie del grupo tiene coche o nadie quiere conducir 5 horas, todos vais como pasajeros. Eso descarta el alquiler de coche (180–250 €/día + gasolina + parking) y os deja con carpooling, autobús o tren. Decidirlo el día uno evita falsas expectativas.",
        url: `${SITE_URL}/guia/festival-sin-coche#paso-1`,
      },
      {
        name: "Buscar viajes con plazas suficientes para el grupo entero",
        text: "En ConcertRide filtras por número de plazas libres (1, 2, 3 o 4). Para un grupo de 4, busca conductores con 4 plazas o reserva 2 viajes paralelos con conductores distintos. Reservar dos coches con 2 plazas cada uno también funciona si el grupo no necesita ir junto en el mismo vehículo.",
        url: `${SITE_URL}/guia/festival-sin-coche#paso-2`,
      },
      {
        name: "Pactar punto de recogida común",
        text: "Si el grupo vive disperso, elegid un punto único (estación de tren, gran avenida con parking, gasolinera de salida) para evitar 4 recogidas y 1 hora extra de coordinación. Los conductores agradecen un único punto cerca de la salida de la ciudad.",
        url: `${SITE_URL}/guia/festival-sin-coche#paso-3`,
      },
      {
        name: "Cerrar la vuelta antes del festival",
        text: "El mismo conductor de la ida suele ofrecer vuelta. Pactar la hora aproximada antes de salir («cuando acabe el último bolo, sobre las 2:30 AM») evita el caos de buscar transporte de madrugada con cobertura saturada. Reserva ambos tramos a la vez si la app lo permite.",
        url: `${SITE_URL}/guia/festival-sin-coche#paso-4`,
      },
      {
        name: "Reparto del coste y plan B",
        text: "Coste por persona = (carpooling × asientos) + (entradas opcionales de transbordo) + (parking si el conductor lo cobra aparte). Pagad por Bizum al conductor el día del trayecto. Tened siempre un plan B acordado (un taxi compartido por si el coche se cancela) anotado en el chat del grupo.",
        url: `${SITE_URL}/guia/festival-sin-coche#paso-5`,
      },
    ],
  });

  const jsonLdTable = {
    "@context": "https://schema.org",
    "@type": "Dataset",
    name: "Comparativa de precios para llegar a festivales sin coche en España 2026",
    description:
      "Precio por asiento como pasajero en carpooling, en autobús oficial y combinando tren + lanzadera para 10 festivales tier-1 de España en 2026.",
    license: "https://creativecommons.org/licenses/by/4.0/",
    creator: {
      "@type": "Organization",
      "@id": `${SITE_URL}/#organization`,
      name: "ConcertRide",
    },
    datePublished: "2026-05-17",
    isAccessibleForFree: true,
    url: `${SITE_URL}/guia/festival-sin-coche`,
  };

  // Real data extracted from festivalLandings.ts (priceFromCity ranges + bus operators)
  // for the tier-1 comparison table.
  const FESTIVAL_COMPARISON = [
    { festival: "Mad Cool", slug: "mad-cool", city: "Madrid", carpool: "4–7 €", bus: "0 € (metro L3)", trainTaxi: "20–30 € (taxi nocturno)" },
    { festival: "Primavera Sound", slug: "primavera-sound", city: "Barcelona", carpool: "4–7 €", bus: "2,40 € (metro L4)", trainTaxi: "15 € (AVE + metro)" },
    { festival: "Sónar", slug: "sonar", city: "Barcelona", carpool: "4–7 €", bus: "2,40 € (metro L9 Sur)", trainTaxi: "15 € (AVE + metro)" },
    { festival: "FIB", slug: "fib", city: "Valencia", carpool: "3–6 €", bus: "5–8 € (lanzadera oficial)", trainTaxi: "10–15 € (Cercanías C6 + lanzadera)" },
    { festival: "BBK Live", slug: "bbk-live", city: "Bilbao", carpool: "3–5 €", bus: "1,50 € (Bizkaibus + lanzadera oficial)", trainTaxi: "8–12 € (metro + taxi a Kobetamendi)" },
    { festival: "Arenal Sound", slug: "arenal-sound", city: "Burriana", carpool: "5–8 € (desde Castellón)", bus: "12–18 € (autobús oficial Castellón)", trainTaxi: "10–15 € (Cercanías + taxi)" },
    { festival: "Resurrection Fest", slug: "resurrection-fest", city: "Viveiro", carpool: "17–23 € (desde Madrid)", bus: "25–35 € (autobús oficial)", trainTaxi: "60–90 € (Renfe + taxi Viveiro)" },
    { festival: "Viña Rock", slug: "vina-rock", city: "Villarrobledo", carpool: "8–14 € (desde Madrid)", bus: "15–25 € (autobús oficial)", trainTaxi: "25–40 € (Renfe + taxi)" },
    { festival: "Sonorama Ribera", slug: "sonorama-ribera", city: "Aranda de Duero", carpool: "10–14 € (desde Madrid)", bus: "18–28 € (autobús oficial)", trainTaxi: "30–45 € (Avant + taxi)" },
    { festival: "Cala Mijas", slug: "cala-mijas", city: "Mijas (Málaga)", carpool: "3–6 € (desde Málaga)", bus: "5–9 € (lanzadera oficial)", trainTaxi: "12–18 € (Cercanías + taxi)" },
  ];

  return (
    <main id="main" className="min-h-dvh bg-cr-bg text-cr-text pt-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdArticle) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdHowTo) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdTable) }} />

      {/* ── Hero ── */}
      <div className="max-w-4xl mx-auto px-6 pt-10 pb-6 space-y-4 border-b border-cr-border">
        <nav aria-label="Breadcrumb" className="font-mono text-[11px] text-cr-text-muted flex items-center gap-2">
          <Link to="/" className="hover:text-cr-primary">Inicio</Link>
          <span aria-hidden="true">/</span>
          <Link to="/guia-transporte-festivales" className="hover:text-cr-primary">Guías</Link>
          <span aria-hidden="true">/</span>
          <span>Festival sin coche</span>
        </nav>
        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
          Guía pillar · Edición 2026 · Actualizado {today}
        </p>
        <h1 className="font-display text-4xl md:text-6xl uppercase leading-[0.92]">
          Cómo ir a un<br />festival sin coche<br />en España 2026.
        </h1>
        <p className="font-sans text-sm md:text-base text-cr-text-muted max-w-2xl leading-relaxed speakable">
          Hay tres vías reales para llegar a casi cualquier festival español sin coche propio:
          {" "}<strong className="text-cr-text">carpooling como pasajero (3–22 €/asiento), autobús oficial del festival (15–35 €)
          y tren + lanzadera (15–60 €)</strong>. La opción más flexible es el carpooling porque sale puerta a puerta,
          permite pactar la vuelta de madrugada con el conductor y funciona también para festivales rurales como
          Resurrection Fest, Arenal Sound o Sonorama, donde no llegan ni metro ni tren. Esta guía compara las tres
          opciones por precio, horario y disponibilidad, con datos reales de 10 festivales tier-1 y casos prácticos
          desde Madrid, Barcelona, Valencia, Sevilla y Bilbao. Si vas con amigos, también verás cómo coordinar el grupo
          y cómo gestionar la vuelta de madrugada sin pagar 90 € de taxi.
        </p>
      </div>

      {/* ── Sección 1: Tres formas ── */}
      <section className="max-w-4xl mx-auto px-6 py-14 space-y-8">
        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cr-secondary">Sección 1</p>
          <h2 className="font-display text-3xl md:text-4xl uppercase">
            Las tres formas de llegar a un festival sin coche propio
          </h2>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
            Cada opción tiene un perfil de uso distinto. La elección depende del festival, la distancia desde tu ciudad
            y, sobre todo, de cómo pienses volver de madrugada. Esta es la comparativa funcional, no comercial.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-5">

          {/* Carpooling */}
          <article className="border border-cr-primary p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Car size={18} className="text-cr-primary" />
              <h3 className="font-display text-lg uppercase text-cr-primary">Carpooling pasajero</h3>
            </div>
            <p className="font-sans text-[11px] text-cr-text-muted italic">
              Te subes al coche de otro asistente que ya iba al festival.
            </p>
            <ul className="font-sans text-sm text-cr-text-muted space-y-1.5 leading-relaxed">
              <li>✓ Puerta a puerta (origen acordado)</li>
              <li>✓ Vuelta de madrugada pactada con el conductor</li>
              <li>✓ Funciona también para festivales rurales</li>
              <li>✓ Sin comisión — pago al conductor en persona</li>
              <li>✗ Hay que registrarse y reservar con antelación</li>
              <li>✗ Dependes de la oferta de viajes publicados</li>
            </ul>
            <p className="font-mono text-[11px] text-cr-text-muted border-t border-cr-border pt-3">
              Precio medio: <strong className="text-cr-text">3–22 €/asiento</strong><br />
              Ejemplos reales: <strong className="text-cr-text">Madrid → Mad Cool 4–7 €</strong>,
              {" "}<strong className="text-cr-text">Madrid → Primavera Sound 15–20 €</strong>,
              {" "}<strong className="text-cr-text">Valencia → FIB 3–6 €</strong>.
            </p>
          </article>

          {/* Bus oficial */}
          <article className="border border-cr-border p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Bus size={18} className="text-cr-text-muted" />
              <h3 className="font-display text-lg uppercase">Autobús oficial</h3>
            </div>
            <p className="font-sans text-[11px] text-cr-text-muted italic">
              Lanzaderas y autocares organizados por el festival u operadora.
            </p>
            <ul className="font-sans text-sm text-cr-text-muted space-y-1.5 leading-relaxed">
              <li>✓ Salida garantizada desde tu ciudad si hay ruta</li>
              <li>✓ Cómodo: no necesitas registrarte en ninguna app</li>
              <li>✗ Solo desde ciudades grandes (Madrid, BCN, Valencia)</li>
              <li>✗ Horario de vuelta fijo, normalmente antes del cierre</li>
              <li>✗ Se agota semanas antes de eventos populares</li>
              <li>✗ Precio más alto que el carpooling</li>
            </ul>
            <p className="font-mono text-[11px] text-cr-text-muted border-t border-cr-border pt-3">
              Precio medio: <strong className="text-cr-text">15–35 €/asiento</strong><br />
              Ejemplos: <strong className="text-cr-text">FIB lanzadera Castellón 5–8 €</strong>,
              {" "}<strong className="text-cr-text">Resurrection Fest bus oficial 25–35 €</strong>.
            </p>
          </article>

          {/* Tren + lanzadera */}
          <article className="border border-cr-border p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Train size={18} className="text-cr-text-muted" />
              <h3 className="font-display text-lg uppercase">Tren + lanzadera</h3>
            </div>
            <p className="font-sans text-[11px] text-cr-text-muted italic">
              AVE/Avant/Cercanías hasta la ciudad más cercana + taxi o lanzadera al recinto.
            </p>
            <ul className="font-sans text-sm text-cr-text-muted space-y-1.5 leading-relaxed">
              <li>✓ Fiable en grandes distancias (Madrid–BCN, Madrid–Valencia)</li>
              <li>✓ Estaciones bien comunicadas con el centro</li>
              <li>✗ Caro: AVE Madrid–BCN 40–110 € + 5–15 € extra al recinto</li>
              <li>✗ Combinación de 2–3 transportes con tiempos muertos</li>
              <li>✗ Renfe no llega de madrugada a los pueblos del festival</li>
              <li>✗ Equipaje de camping incómodo en tren</li>
            </ul>
            <p className="font-mono text-[11px] text-cr-text-muted border-t border-cr-border pt-3">
              Precio medio: <strong className="text-cr-text">15–60 €/asiento</strong><br />
              Ejemplos: <strong className="text-cr-text">AVE Madrid–BCN 40–100 € + metro</strong>,
              {" "}<strong className="text-cr-text">Renfe + taxi a Viveiro 60–90 €</strong>.
            </p>
          </article>
        </div>

        <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
          Resumen práctico: si tu festival está a más de 100 km y vuelves de madrugada, el carpooling
          gana en precio y horario. Si vives en la misma provincia del festival (Madrid → Mad Cool, Barcelona → Primavera Sound),
          el transporte público es competitivo en la ida pero no en la vuelta. El tren + lanzadera solo es razonable
          para Madrid–Barcelona y otros corredores AVE muy directos.
        </p>
      </section>

      {/* ── Sección 2: Comparativa por festival ── */}
      <section className="max-w-4xl mx-auto px-6 pb-14 border-t border-cr-border pt-12 space-y-6">
        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cr-secondary">Sección 2</p>
          <h2 className="font-display text-3xl md:text-4xl uppercase">
            Comparativa de precio por festival (tier-1)
          </h2>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl speakable">
            Precio por asiento como pasajero, autobús oficial (cuando existe) y combinación tren + taxi para los 10
            festivales más buscados de España. Datos extraídos de ConcertRide, web oficial del festival y Renfe a fecha
            de mayo 2026. Distancias y tiempos calculados desde la ciudad principal de origen para cada festival.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full font-sans text-sm text-cr-text-muted border-collapse">
            <thead>
              <tr className="border-b border-cr-border">
                <th className="text-left py-3 pr-4 font-display text-xs uppercase text-cr-text">Festival</th>
                <th className="text-left py-3 pr-4 font-display text-xs uppercase text-cr-text">Origen</th>
                <th className="text-left py-3 pr-4 font-display text-xs uppercase text-cr-primary">Carpooling</th>
                <th className="text-left py-3 pr-4 font-display text-xs uppercase text-cr-text-muted">Bus oficial</th>
                <th className="text-left py-3 font-display text-xs uppercase text-cr-text-muted">Tren + taxi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cr-border">
              {FESTIVAL_COMPARISON.map((row) => (
                <tr key={row.slug}>
                  <td className="py-3 pr-4 font-medium text-cr-text">
                    <Link to={`/festivales/${row.slug}`} className="hover:text-cr-primary">{row.festival}</Link>
                  </td>
                  <td className="py-3 pr-4 text-cr-text-dim">{row.city}</td>
                  <td className="py-3 pr-4 text-cr-primary font-medium">{row.carpool}</td>
                  <td className="py-3 pr-4 text-cr-text-dim">{row.bus}</td>
                  <td className="py-3 text-cr-text-dim">{row.trainTaxi}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="font-mono text-[11px] text-cr-text-dim">
          Fuente: precios publicados en ConcertRide, web oficial del festival y Renfe.es, mayo 2026.
          {" "}<Link to="/datos" className="hover:text-cr-primary">Acceso al dataset abierto en /datos (CC BY 4.0)</Link>.
          Tabla extendida con precios carpooling vs bus oficial:{" "}
          <Link to="/datos/precio-medio-carpooling-vs-bus-festivales-2026" className="hover:text-cr-primary">
            /datos/precio-medio-carpooling-vs-bus-festivales-2026
          </Link>.
          Para saber qué festivales tienen peor conexión pública:{" "}
          <Link to="/datos/festivales-peor-conexion-transporte-publico-2026" className="hover:text-cr-primary">
            /datos/festivales-peor-conexion-transporte-publico-2026
          </Link>{" "}
          (52 festivales con score 0-100). Para comparar el coste total ida+vuelta desde Madrid:{" "}
          <Link to="/datos/festivales-mas-caros-mas-baratos-llegar-2026" className="hover:text-cr-primary">
            /datos/festivales-mas-caros-mas-baratos-llegar-2026
          </Link>{" "}
          (ranking 57 festivales). Calendario cronológico maestro 2026 (abril-octubre) con todos los campos combinados:{" "}
          <Link to="/datos/calendario-maestro-festivales-2026" className="hover:text-cr-primary">
            /datos/calendario-maestro-festivales-2026
          </Link>. Costes ocultos del transporte (parking, taxi vuelta madrugada, comisiones, propinas) que no aparecen en los anuncios principales:{" "}
          <Link to="/datos/costes-ocultos-transporte-festivales-2026" className="hover:text-cr-primary">
            /datos/costes-ocultos-transporte-festivales-2026
          </Link>{" "}
          (50 festivales, coste oculto medio 52,5 €/día).
        </p>
      </section>

      {/* ── Sección 3: Casos por origen ── */}
      <section className="max-w-4xl mx-auto px-6 pb-14 border-t border-cr-border pt-12 space-y-8">
        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cr-secondary">Sección 3</p>
          <h2 className="font-display text-3xl md:text-4xl uppercase">
            Casos por ciudad de origen
          </h2>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
            Top-3 festivales accesibles sin coche desde cada gran ciudad española, con el modo de transporte más usado
            por los asistentes y la franja de precio real.
          </p>
        </div>

        {/* Madrid */}
        <article className="border border-cr-border p-5 space-y-3">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-cr-primary" />
            <h3 className="font-display text-xl uppercase">
              <Link to="/conciertos/madrid" className="hover:text-cr-primary">Desde Madrid</Link>
            </h3>
          </div>
          <ol className="font-sans text-sm text-cr-text-muted space-y-2 leading-relaxed list-decimal pl-5">
            <li>
              <strong className="text-cr-text">
                <Link to="/festivales/mad-cool" className="hover:text-cr-primary">Mad Cool</Link>
              </strong>{" "}— recinto Iberdrola Music (Villaverde), 15 km del centro. Modo más usado: metro L3 a la ida
              (2–3 €, 35 min) y carpooling vuelta de madrugada (4–7 €) porque el metro cierra a la 1:30 ampliado a 2:30.
              Ver{" "}
              <Link to="/rutas/madrid-mad-cool" className="hover:text-cr-primary">ruta Madrid → Mad Cool</Link>.
            </li>
            <li>
              <strong className="text-cr-text">
                <Link to="/festivales/primavera-sound" className="hover:text-cr-primary">Primavera Sound</Link>
              </strong>{" "}— 620 km a Barcelona (5h 30 min). Modo más usado: carpooling 15–20 €/asiento (vs AVE 50–100 €
              + metro adicional). Salida puerta a puerta hasta el Parc del Fòrum.
            </li>
            <li>
              <strong className="text-cr-text">
                <Link to="/festivales/fib" className="hover:text-cr-primary">FIB</Link>
              </strong>{" "}— 465 km a Benicàssim (4h). Modo más usado: carpooling 12–17 €/asiento porque no hay autobús
              oficial directo Madrid–Benicàssim. AVE Madrid–Castellón ronda los 35–60 € + lanzadera FIB extra.
            </li>
          </ol>
        </article>

        {/* Barcelona */}
        <article className="border border-cr-border p-5 space-y-3">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-cr-primary" />
            <h3 className="font-display text-xl uppercase">
              <Link to="/conciertos/barcelona" className="hover:text-cr-primary">Desde Barcelona</Link>
            </h3>
          </div>
          <ol className="font-sans text-sm text-cr-text-muted space-y-2 leading-relaxed list-decimal pl-5">
            <li>
              <strong className="text-cr-text">Primavera Sound</strong> y{" "}
              <strong className="text-cr-text">Sónar</strong> son metro directo (L4 Besòs Mar y L9 Sur Fira respectivamente):
              2,40 € de billete sencillo TMB, vuelta nocturna con NitBus o carpooling local 3–6 €.
            </li>
            <li>
              <strong className="text-cr-text">
                <Link to="/festivales/cruilla" className="hover:text-cr-primary">Cruïlla</Link>
              </strong>{" "}— mismo Parc del Fòrum, metro L4 funciona hasta la medianoche. Vuelta de madrugada: carpooling
              o nitbus.
            </li>
            <li>
              <strong className="text-cr-text">FIB</strong> — 300 km a Benicàssim (2h 45 min). Modo más usado: carpooling
              8–12 €/asiento. Algunas operadoras privadas ofrecen autocar charter desde Barcelona a 25–40 €.
            </li>
          </ol>
        </article>

        {/* Valencia */}
        <article className="border border-cr-border p-5 space-y-3">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-cr-primary" />
            <h3 className="font-display text-xl uppercase">Desde Valencia</h3>
          </div>
          <ol className="font-sans text-sm text-cr-text-muted space-y-2 leading-relaxed list-decimal pl-5">
            <li>
              <strong className="text-cr-text">FIB</strong> — 70 km a Benicàssim (50 min). Modo más usado: carpooling
              3–6 €/asiento porque el tren Cercanías C6 + lanzadera FIB suma 10–15 € y 1h 30 min con espera.
            </li>
            <li>
              <strong className="text-cr-text">
                <Link to="/festivales/arenal-sound" className="hover:text-cr-primary">Arenal Sound</Link>
              </strong>{" "}— 70 km a Burriana (1h). Modo más usado: carpooling 4–7 €/asiento. No hay transporte público
              nocturno desde la playa hasta Valencia.
            </li>
            <li>
              <strong className="text-cr-text">Festival de Les Arts</strong> y{" "}
              <strong className="text-cr-text">Medusa</strong> (Cullera) — recintos cercanos a Valencia con buena
              conexión de cercanías diurna, pero carpooling 4–8 € para la vuelta de madrugada.
            </li>
          </ol>
        </article>

        {/* Sevilla */}
        <article className="border border-cr-border p-5 space-y-3">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-cr-primary" />
            <h3 className="font-display text-xl uppercase">Desde Sevilla</h3>
          </div>
          <ol className="font-sans text-sm text-cr-text-muted space-y-2 leading-relaxed list-decimal pl-5">
            <li>
              <strong className="text-cr-text">Cala Mijas</strong> — 220 km a Mijas (2h 15 min). Modo más usado:
              carpooling 6–10 €/asiento porque el AVE Sevilla–Málaga + cercanías + lanzadera suma 35–50 €.
            </li>
            <li>
              <strong className="text-cr-text">Andalucía Big Festival</strong> y eventos en Málaga (Marenostrum,
              Starlite Marbella) — entre 175 y 215 km, carpooling 5–10 €/asiento.
            </li>
            <li>
              <strong className="text-cr-text">Mad Cool y Primavera Sound</strong> — son destinos largos (525 km y
              1.000 km). Aquí gana el avión low cost en la ida (30–80 € a Madrid o BCN) y el carpooling de vuelta puerta
              a puerta es minoritario por la distancia.
            </li>
          </ol>
        </article>

        {/* Bilbao */}
        <article className="border border-cr-border p-5 space-y-3">
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-cr-primary" />
            <h3 className="font-display text-xl uppercase">Desde Bilbao</h3>
          </div>
          <ol className="font-sans text-sm text-cr-text-muted space-y-2 leading-relaxed list-decimal pl-5">
            <li>
              <strong className="text-cr-text">
                <Link to="/festivales/bbk-live" className="hover:text-cr-primary">BBK Live</Link>
              </strong>{" "}— 7 km a Kobetamendi. Modo más usado: lanzadera oficial Bizkaibus 1,50 € (ida y vuelta hasta
              la madrugada). Carpooling 3–5 € para los que vienen de fuera de Bilbao.
            </li>
            <li>
              <strong className="text-cr-text">Resurrection Fest</strong> — 320 km a Viveiro (3h 30 min). Modo más
              usado: carpooling 10–14 €/asiento porque Renfe no llega de madrugada a Viveiro y el bus oficial Bilbao
              cuesta 25–35 €.
            </li>
            <li>
              <strong className="text-cr-text">Primavera Sound y Sónar</strong> — 615 km a Barcelona (5h). Carpooling
              15–20 €/asiento, alternativa al AVE indirecto (necesita transbordo en Madrid o Zaragoza).
            </li>
          </ol>
        </article>
      </section>

      {/* ── Sección 4: Coordinar grupo ── */}
      <section className="max-w-4xl mx-auto px-6 pb-14 border-t border-cr-border pt-12 space-y-6">
        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cr-secondary">Sección 4</p>
          <h2 className="font-display text-3xl md:text-4xl uppercase">
            Cómo coordinar un grupo de amigos sin coche
          </h2>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
            La mayoría de los planes de festival empiezan con un grupo de 3 a 6 personas. Ningún taxi cabe entero, los
            buses oficiales no permiten reserva en bloque y el AVE multiplica el coste por cabeza. Estos son los cinco
            pasos que aplican los grupos que mejor coordinan su transporte sin coche propio.
          </p>
        </div>

        <ol className="space-y-5 list-none">
          <li className="border border-cr-border p-5 space-y-2">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-cr-primary" />
              <p className="font-display text-base uppercase text-cr-text">Paso 1 · Confirmar quién conduce o si vais todos como pasajeros</p>
            </div>
            <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
              Si nadie del grupo tiene coche o nadie quiere conducir 5 horas, todos vais como pasajeros. Eso descarta el
              alquiler de coche (que sale a 180–250 €/día + gasolina + parking) y os deja con carpooling, autobús o tren.
              Decidirlo el día uno evita falsas expectativas.
            </p>
          </li>

          <li className="border border-cr-border p-5 space-y-2">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-cr-primary" />
              <p className="font-display text-base uppercase text-cr-text">Paso 2 · Buscar viajes con plazas suficientes para el grupo entero</p>
            </div>
            <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
              En ConcertRide filtras por número de plazas libres (normalmente 1, 2, 3 o 4). Para un grupo de 4, busca
              conductores con 4 plazas o reserva 2 viajes paralelos con conductores distintos. Reservar dos coches con 2
              plazas cada uno también funciona si el grupo no necesita ir junto en el mismo vehículo.
            </p>
          </li>

          <li className="border border-cr-border p-5 space-y-2">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-cr-primary" />
              <p className="font-display text-base uppercase text-cr-text">Paso 3 · Pactar punto de recogida común</p>
            </div>
            <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
              Si el grupo vive disperso, elegid un punto único (estación de tren, gran avenida con parking, gasolinera
              de salida) para evitar 4 recogidas y 1 hora extra de coordinación. Los conductores agradecen un único
              punto cerca de la salida de la ciudad.
            </p>
          </li>

          <li className="border border-cr-border p-5 space-y-2">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-cr-primary" />
              <p className="font-display text-base uppercase text-cr-text">Paso 4 · Cerrar la vuelta antes del festival</p>
            </div>
            <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
              El mismo conductor de la ida suele ofrecer vuelta. Pactar la hora aproximada antes de salir («cuando acabe
              el último bolo, sobre las 2:30 AM») evita el caos de buscar transporte de madrugada con cobertura
              saturada. Reserva ambos tramos a la vez si la app lo permite.
            </p>
          </li>

          <li className="border border-cr-border p-5 space-y-2">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-cr-primary" />
              <p className="font-display text-base uppercase text-cr-text">Paso 5 · Reparto del coste y plan B</p>
            </div>
            <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
              Coste por persona = (carpooling × asientos) + (entradas opcionales de transbordo) + (parking si el
              conductor lo cobra aparte). Pagad por Bizum al conductor el día del trayecto. Tened siempre un plan B
              acordado (un taxi compartido por si el coche se cancela) anotado en el chat del grupo.
            </p>
          </li>
        </ol>

        <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
          Guía completa de coordinación grupal:{" "}
          <Link to="/blog/como-organizar-viaje-grupo-festival-amigos" className="text-cr-primary hover:underline">
            Cómo organizar un viaje en grupo a un festival
          </Link>.
        </p>
      </section>

      {/* ── Sección 5: Volver de madrugada ── */}
      <section className="max-w-4xl mx-auto px-6 pb-14 border-t border-cr-border pt-12 space-y-6">
        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cr-secondary">Sección 5</p>
          <h2 className="font-display text-3xl md:text-4xl uppercase">
            Volver del festival de madrugada sin coche
          </h2>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl speakable">
            La vuelta es el punto crítico de cualquier festival sin coche propio. La mayoría de los conciertos terminan
            entre la 1:30 y las 4:00 de la madrugada, exactamente cuando el metro ya ha cerrado, los autobuses oficiales
            han salido (porque tienen horario fijo) y los taxis multiplican x2 o x3 su precio. Estas son las opciones
            reales por festival.
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Moon size={16} className="text-cr-secondary" />
            <h3 className="font-display text-base uppercase text-cr-text">Mad Cool · Iberdrola Music</h3>
          </div>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
            Último metro L3 ampliado hasta las 2:30 en días de festival. Después: taxi 20–30 € al centro de Madrid, o
            carpooling de vuelta 4–7 €/asiento pactado con conductor en ConcertRide. Las colas de taxi son de 30–45 min.
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Moon size={16} className="text-cr-secondary" />
            <h3 className="font-display text-base uppercase text-cr-text">Primavera Sound · Parc del Fòrum</h3>
          </div>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
            Metro L4 funciona hasta las 5:00 los días viernes y sábado del festival (servicio nocturno). Para los demás
            días: NitBus N7/N8 cada 20 min hasta el centro. Taxi 12–20 € al centro de Barcelona. Carpooling local 3–6 €.
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Moon size={16} className="text-cr-secondary" />
            <h3 className="font-display text-base uppercase text-cr-text">Sónar by Night · Fira Gran Via L'Hospitalet</h3>
          </div>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
            El festival cierra a las 7:00–8:00 AM, cuando el metro L9 Sur ya ha reanudado el servicio. Si sales antes:
            taxi 15–25 € al centro de Barcelona. NitBus N16 disponible toda la noche desde la Fira.
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Moon size={16} className="text-cr-secondary" />
            <h3 className="font-display text-base uppercase text-cr-text">FIB · Benicàssim</h3>
          </div>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
            La lanzadera oficial FIB funciona hasta la madrugada (Castellón ↔ recinto, 5–8 €), pero el último Cercanías
            C6 desde Castellón a Valencia sale antes de las 23:00. Para volver a Valencia después de medianoche: taxi
            70–90 € o carpooling 3–6 €/asiento.
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Moon size={16} className="text-cr-secondary" />
            <h3 className="font-display text-base uppercase text-cr-text">BBK Live · Kobetamendi</h3>
          </div>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
            Lanzadera oficial Bizkaibus 1,50 € ida y vuelta funciona hasta el cierre del festival (sobre las 4:00 AM).
            Es la mejor opción para asistentes que se alojan en Bilbao. Si vuelves a otra ciudad: carpooling 10–20 €.
          </p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Moon size={16} className="text-cr-secondary" />
            <h3 className="font-display text-base uppercase text-cr-text">Resurrection Fest · Viveiro</h3>
          </div>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
            No hay transporte público nocturno a Viveiro. Las opciones son: (1) acampar en el recinto (incluido en el
            abono), (2) dormir en hotel/apartamento en Viveiro y volver al día siguiente, o (3) carpooling de vuelta
            pactado al precio de ida (17–23 € a Madrid, 10–14 € a Bilbao).
          </p>
        </div>

        <div className="p-5 border border-cr-primary/30 bg-cr-primary/5 space-y-2">
          <p className="font-display text-base uppercase text-cr-primary">Patrón general</p>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
            Si el festival es urbano y bien comunicado, el metro o nitbus cubre la vuelta. Si es rural o muy alejado
            del centro, sólo carpooling de vuelta pactado o alojamiento local funcionan. Reservar siempre el carpooling
            de vuelta el mismo día que el de ida — los viajes de madrugada se agotan primero.
          </p>
          <Link
            to="/blog/transporte-nocturno-vuelta-festival"
            className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-cr-primary hover:underline pt-2"
          >
            Guía completa de vuelta nocturna <ArrowRight size={12} />
          </Link>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="max-w-4xl mx-auto px-6 pb-14 border-t border-cr-border pt-12 space-y-6">
        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cr-secondary">Sección 6</p>
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

      {/* ── CTA final ── */}
      <section className="max-w-4xl mx-auto px-6 pb-24 border-t border-cr-border pt-12 space-y-4">
        <h2 className="font-display text-2xl md:text-3xl uppercase">Empieza a buscar tu carpooling</h2>
        <p className="font-sans text-sm text-cr-text-muted max-w-xl">
          Busca el concierto o festival al que vas, mira los viajes publicados desde tu ciudad y pacta la vuelta con el
          conductor antes de salir. Sin comisión, sin tarjeta, sin sorpresas.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            to="/concerts"
            className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] bg-cr-primary text-black px-5 py-2.5 hover:bg-cr-primary/90 transition-colors"
          >
            Buscar viaje <ArrowRight size={12} />
          </Link>
          <Link
            to="/guia-transporte-festivales"
            className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] border border-cr-primary text-cr-primary px-5 py-2.5 hover:bg-cr-primary hover:text-black transition-colors"
          >
            Guía general de transporte <ArrowRight size={12} />
          </Link>
          <Link
            to="/datos"
            className="inline-flex items-center gap-2 font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors"
          >
            Ver datos abiertos <ArrowRight size={12} />
          </Link>
          <Link
            to="/glosario"
            className="inline-flex items-center gap-2 font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors"
            title="Glosario carpooling y festivales — 100 términos"
          >
            Glosario carpooling <ArrowRight size={12} />
          </Link>
        </div>
      </section>
    </main>
  );
}
