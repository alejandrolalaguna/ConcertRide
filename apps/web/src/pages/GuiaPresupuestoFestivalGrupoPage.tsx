import { Link } from "react-router-dom";
import { ArrowRight, Wallet, Tent, Beer, UtensilsCrossed, Ticket, Bus, Backpack, Calculator, Users, TrendingDown } from "lucide-react";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";
import { ANALYTICS_EVENTS, trackEvent } from "@/lib/analytics-events";
import EeatTrustBlock from "@/components/EeatTrustBlock";
import AiDisclosureNote from "@/components/AiDisclosureNote";
import { aiLevelForPageType } from "@/lib/aiContentPolicy";

const PILLAR_SLUG = "guia-presupuesto-festival-grupo";

/**
 * Pillar SEO page — cluster "Decision: presupuesto festival fin de semana".
 *
 * Targets: "presupuesto festival fin de semana", "cuánto cuesta ir a festival",
 * "presupuesto festival amigos", "cuánto cuesta un festival de música",
 * "presupuesto festival grupo 4 personas". Decision-stage cluster, número-first,
 * citable por AI Overviews.
 *
 * NOTE: Per CLAUDE.md "Brand Restrictions" — NEVER name competing carpooling
 * brands. Use "plataformas generalistas de carpooling" if needed.
 */

const FAQS = [
  {
    q: "¿Cuánto cuesta un festival de fin de semana en España 2026?",
    a: "Para un grupo de 4 amigos, el coste medio por persona en un festival de fin de semana español ronda los 380–450 € en perfil medio. El desglose habitual es: abono 3 días 130–180 €, transporte 15–30 € (carpooling como pasajero), comida y bebida dentro del recinto 100–140 €, acampada o alojamiento compartido 30–80 €, kit festivalero (silla, neceser, ropa, protección solar) 20–40 €. En perfil low-budget ese mismo plan puede salir por 200–250 € por persona si optas por acampada, carpooling y comida fuera del recinto. En perfil premium con hotel 3 estrellas y comida dentro puede irse a 700–900 €.",
  },
  {
    q: "¿Cuál es el mayor gasto al ir a un festival?",
    a: "La entrada o abono es el gasto principal en casi todos los festivales españoles de tier-1: 130–180 € un abono de 3 días en Mad Cool, Primavera Sound o Sónar, hasta 220 € en Cala Mijas o Resurrection Fest con extras. El segundo gasto suele ser comida + bebida dentro del recinto: 35–55 €/día por persona si bebes alcohol y comes 2 menús. La acampada incluida en el abono o el carpooling como pasajero (3–22 €) son los gastos más fáciles de optimizar — el alquiler de coche y el taxi son los más caros y los más fáciles de eliminar.",
  },
  {
    q: "¿Cómo se reparte el gasto de un festival en un grupo de amigos?",
    a: "El reparto óptimo es: cada persona paga su entrada por separado (porque algunos quieren VIP y otros entrada general) y se hace bote común para los gastos compartidos: gasolina o carpooling, parking, supermercado pre-festival, hielo, agua, gas para camping. Lo más limpio es usar una app de gastos compartidos (estilo Splitwise) o un Excel con quien adelanta qué. Al final del fin de semana se hace la cuenta y se reparte por Bizum. Para 4 personas en un fin de semana medio, los gastos compartidos suelen rondar los 120–180 € en total (30–45 €/persona).",
  },
  {
    q: "¿Cuánto presupuesto necesito para Mad Cool 2026 desde Madrid?",
    a: "Para 4 amigos desde Madrid, presupuesto medio por persona en Mad Cool 2026: abono 3 días 165–185 €, carpooling al recinto Iberdrola Music 4–7 € por trayecto (8–14 € ida+vuelta los 3 días), comida y bebida dentro 90–130 € (3 días), kit y básicos 20–35 €. Total estimado: 290–365 €/persona en perfil medio. Si optas por hotel barato cerca de Villaverde añade 60–90 €/persona para las 3 noches en una habitación doble compartida. Si vuelves cada noche a tu casa de Madrid en carpooling vuelta de madrugada, ahorras el alojamiento entero.",
  },
  {
    q: "¿Cómo reducir el presupuesto de un festival hasta un 40 %?",
    a: "Cinco palancas con impacto real: (1) abono temprano (early bird) ahorra 20–40 € sobre el precio final, (2) carpooling como pasajero en lugar de coche propio o tren ahorra 30–80 €/persona en el viaje, (3) acampada en lugar de hotel ahorra 100–200 €/persona en un fin de semana, (4) comer fuera del recinto y bebida en supermercado antes de entrar ahorra 50–90 €/persona en 3 días, (5) llevar tu propio kit festivalero (silla, neceser, vasos reutilizables, protección solar) en lugar de comprarlo en el recinto ahorra 25–45 €. Aplicando las cinco a la vez, un festival de 450 €/persona puede bajar a 270–290 € — un recorte real del 35–40 %.",
  },
];

export default function GuiaPresupuestoFestivalGrupoPage() {
  const today = new Date().toISOString().slice(0, 10);

  useSeoMeta({
    title: "Presupuesto festival grupo 2026 [Cálculo + 3 casos] | ConcertRide",
    description:
      "Cuánto cuesta un festival fin de semana para 4 amigos 2026. Desglose en 6 partidas, calculadora 3 perfiles y casos reales Mad Cool + Primavera.",
    canonical: `${SITE_URL}/guia/presupuesto-festival-grupo`,
    keywords:
      "presupuesto festival fin de semana, cuánto cuesta ir a festival, presupuesto festival amigos, cuánto cuesta un festival de música, presupuesto festival grupo, Mad Cool presupuesto, Primavera Sound presupuesto, Sonorama presupuesto",
    ogType: "article",
    ogImage: `${SITE_URL}/og/home.png`,
    ogImageAlt: "Presupuesto festival fin de semana grupo 4 amigos España 2026",
    articlePublishedTime: "2026-05-18",
    articleModifiedTime: today,
    articleAuthor: "Alejandro Lalaguna",
    articleSection: "Guías",
    breadcrumb: [
      { position: 1, name: "Inicio", url: `${SITE_URL}/` },
      { position: 2, name: "Guías", url: `${SITE_URL}/guia-transporte-festivales` },
      { position: 3, name: "Presupuesto festival grupo", url: `${SITE_URL}/guia/presupuesto-festival-grupo` },
    ],
  });

  const jsonLdArticle = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Presupuesto festival fin de semana para un grupo de 4 amigos en España 2026",
    description:
      "Guía con desglose en 6 partidas, calculadora con 3 perfiles de presupuesto y 3 casos reales detallados (Mad Cool, Primavera Sound, Sonorama) para coordinar el gasto del fin de semana en festival con tu grupo de amigos.",
    url: `${SITE_URL}/guia/presupuesto-festival-grupo`,
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
    datePublished: "2026-05-18",
    dateModified: today,
    image: {
      "@type": "ImageObject",
      url: `${SITE_URL}/og/home.png`,
      width: 1200,
      height: 630,
    },
    mainEntityOfPage: `${SITE_URL}/guia/presupuesto-festival-grupo`,
    articleSection: "Presupuesto y planificación",
    keywords:
      "presupuesto festival, cuánto cuesta ir a festival, festival amigos presupuesto, Mad Cool precio, Primavera Sound precio, Sonorama presupuesto",
    about: {
      "@type": "Thing",
      name: "Presupuesto y reparto de gastos para festivales de música en España",
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
      { "@type": "ListItem", position: 3, name: "Presupuesto festival grupo", item: `${SITE_URL}/guia/presupuesto-festival-grupo` },
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
    name: "Cómo reducir hasta un 40 % el presupuesto de un festival en grupo",
    description:
      "Cinco palancas concretas para bajar el coste de un fin de semana de festival de 450 €/persona a unos 270 €/persona sin perder experiencia: abono temprano, carpooling como pasajero, acampada, comida y bebida fuera del recinto, y kit festivalero propio.",
    totalTime: "PT2H",
    estimatedCost: {
      "@type": "MonetaryAmount",
      currency: "EUR",
      value: "180",
    },
    supply: [
      { "@type": "HowToSupply", name: "Abono festival en preventa (early bird)" },
      { "@type": "HowToSupply", name: "Cuenta en ConcertRide para reservar carpooling como pasajero" },
      { "@type": "HowToSupply", name: "Tienda de campaña, esterilla y saco de dormir" },
      { "@type": "HowToSupply", name: "Comida y bebida comprada en supermercado antes de entrar" },
      { "@type": "HowToSupply", name: "Kit festivalero personal (silla plegable, neceser, vasos reutilizables, crema solar)" },
    ],
    step: [
      {
        "@type": "HowToStep",
        position: 1,
        name: "Compra el abono en preventa o early bird",
        text: "El abono más barato suele venderse en preventa entre 3 y 6 meses antes del festival. Ahorro frente al precio final: 20–40 € por persona. En Mad Cool y Primavera Sound, los primeros lotes salen normalmente en septiembre–octubre del año anterior.",
      },
      {
        "@type": "HowToStep",
        position: 2,
        name: "Reserva carpooling como pasajero en lugar de coche propio o tren",
        text: "Ir como pasajero en ConcertRide cuesta 3–22 € por trayecto según distancia. Frente a alquiler de coche (180–250 €/día + gasolina + parking) o AVE + lanzadera (40–100 €), el ahorro por persona ronda los 30–80 € en el viaje completo ida+vuelta.",
      },
      {
        "@type": "HowToStep",
        position: 3,
        name: "Acampada incluida en lugar de hotel",
        text: "La mayoría de festivales rurales (Sonorama, Resurrection Fest, Viña Rock, FIB, Arenal Sound) incluyen acampada en el abono o por un suplemento de 10–25 €. Un hotel 3 estrellas en zona festivalera ronda los 80–140 €/noche en compartida. Ahorro en 2–3 noches: 100–200 €/persona.",
      },
      {
        "@type": "HowToStep",
        position: 4,
        name: "Comida fuera del recinto y bebida en supermercado",
        text: "Dentro del recinto, una caña ronda los 6–8 €, un combinado 10–14 € y un menú 12–18 €. Comprando la cerveza en supermercado (0,80–1,20 €/lata) y comiendo en restaurantes del pueblo (menú 12–18 € con primer + segundo + bebida) ahorras 50–90 €/persona en 3 días.",
      },
      {
        "@type": "HowToStep",
        position: 5,
        name: "Lleva tu kit festivalero desde casa",
        text: "Silla plegable, neceser, toalla microfibra, vasos reutilizables, protección solar y power bank ya los tienes en casa. Comprándolos en el recinto o en el supermercado de última hora pagas 25–45 € extra. Llevarlos contigo en el carpooling no ocupa más que una mochila grande.",
      },
    ],
  };

  // Calculadora — 3 perfiles para un fin de semana de 3 días en grupo de 4
  const LOW = {
    label: "Low-budget",
    total: "200–280 €",
    ticket: "120–140 €",
    transport: "8–16 € (carpooling pasajero)",
    food: "30–50 € (super + comida fuera)",
    drink: "20–35 € (bebida en super pre-festival)",
    sleep: "10–25 € (acampada incluida o +supl.)",
    kit: "10–20 € (lo que ya tienes en casa)",
    color: "border-cr-text-muted/40",
  };
  const MEDIUM = {
    label: "Medio",
    total: "380–450 €",
    ticket: "150–180 €",
    transport: "20–35 € (carpooling pasajero ida+vuelta)",
    food: "60–90 € (mitad fuera, mitad recinto)",
    drink: "40–65 € (super pre + caña/combinado en recinto)",
    sleep: "40–80 € (acampada premium o albergue compartido)",
    kit: "25–40 € (algún extra como silla nueva)",
    color: "border-cr-primary",
  };
  const PREMIUM = {
    label: "Premium",
    total: "700–900 €",
    ticket: "180–250 € (abono + extra día/VIP)",
    transport: "30–60 € (carpooling o AVE)",
    food: "120–180 € (3 días dentro del recinto)",
    drink: "80–130 € (todo dentro del recinto)",
    sleep: "180–280 € (hotel 3* compartido 2 noches)",
    kit: "40–80 € (todo nuevo + merchandising)",
    color: "border-cr-secondary",
  };
  const PROFILES = [LOW, MEDIUM, PREMIUM];

  // Casos reales — grupo de 4 amigos, presupuesto por persona en perfil medio
  const FESTIVAL_CASES = [
    {
      festival: "Mad Cool",
      slug: "mad-cool",
      city: "Madrid",
      route: "/rutas/madrid-mad-cool",
      duration: "3 días",
      ticket: "165 €",
      transport: "14 € (carpooling Madrid → Iberdrola Music ida+vuelta los 3 días)",
      food: "110 €",
      drink: "75 €",
      sleep: "0 € (vuelta a casa cada noche)",
      kit: "30 €",
      perPerson: "394 €",
      perGroup: "1.576 €",
      notes: "Vuelves cada noche a Madrid en carpooling de madrugada (4–7 €), te ahorras alojamiento entero. Si prefieres hotel cerca de Villaverde para los 3 días, añade ~75 €/persona.",
    },
    {
      festival: "Primavera Sound",
      slug: "primavera-sound",
      city: "Barcelona (desde Madrid)",
      route: "/rutas/madrid-primavera-sound",
      duration: "3 días",
      ticket: "295 €",
      transport: "32 € (carpooling Madrid → Barcelona ida+vuelta)",
      food: "95 €",
      drink: "70 €",
      sleep: "120 € (albergue / Airbnb compartido 3 noches)",
      kit: "30 €",
      perPerson: "642 €",
      perGroup: "2.568 €",
      notes: "El abono Primavera Sound es uno de los más caros de España. Si te alojas con anfitrión local o sofá de un amigo, restas los 120 € de sleep. Carpooling Madrid → BCN es la opción más barata por persona vs AVE (50–110 €/asiento).",
    },
    {
      festival: "Sonorama Ribera",
      slug: "sonorama-ribera",
      city: "Aranda de Duero (desde Madrid)",
      route: "/rutas/madrid-sonorama-ribera",
      duration: "4 días (mié–sáb)",
      ticket: "110 €",
      transport: "24 € (carpooling Madrid → Aranda ida+vuelta)",
      food: "85 €",
      drink: "55 €",
      sleep: "55 € (acampada incluida con suplemento)",
      kit: "30 €",
      perPerson: "359 €",
      perGroup: "1.436 €",
      notes: "Sonorama es el festival tier-1 más asequible. Abono entre los más baratos (~110 €) por su modelo más íntimo, acampada barata y comida en bares del casco histórico de Aranda (12–15 € menú). Carpooling 10–14 €/asiento al ser ruta de 160 km.",
    },
  ];

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
          <span>Presupuesto festival grupo</span>
        </nav>
        <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
          Guía pillar · Edición 2026 · Actualizado {today}
        </p>
        <h1 className="font-display text-4xl md:text-6xl uppercase leading-[0.92]">
          Presupuesto festival<br />fin de semana<br />para un grupo de 4.
        </h1>
        <p className="font-sans text-sm md:text-base text-cr-text-muted max-w-2xl leading-relaxed speakable">
          Para un grupo de 4 amigos, un festival de fin de semana español ronda los{" "}
          <strong className="text-cr-text">380–450 €/persona en perfil medio</strong> (3 días, acampada o albergue
          compartido, comida mixta dentro y fuera). Bajando a perfil low-budget puedes hacerlo por{" "}
          <strong className="text-cr-text">200–280 €/persona</strong>; subiendo a premium con hotel 3* y todo dentro del
          recinto se va a <strong className="text-cr-text">700–900 €/persona</strong>. El abono es el gasto principal
          (130–250 €), seguido de comida + bebida dentro (100–180 €), alojamiento (0–280 €), kit + extras (20–80 €) y
          transporte (8–60 €). En esta guía: desglose en 6 partidas, calculadora con 3 perfiles, casos reales por
          festival y 5 trucos para recortar hasta un 40 %.
        </p>
      </div>

      {/* ── Sección 1 — Desglose por partida ── */}
      <section className="max-w-4xl mx-auto px-6 py-14 space-y-8">
        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cr-secondary">Sección 1</p>
          <h2 className="font-display text-3xl md:text-4xl uppercase">
            Las 6 partidas de gasto de un festival
          </h2>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
            Cada festival se descompone siempre en las mismas 6 categorías. Conociéndolas por separado puedes negociar
            con tu grupo qué partidas optimizáis y cuáles no. Los rangos de precio son reales para festivales tier-1
            españoles en 2026.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          <article className="border border-cr-border p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Ticket size={18} className="text-cr-primary" />
              <h3 className="font-display text-lg uppercase">1 · Entrada / abono</h3>
            </div>
            <p className="font-sans text-[11px] text-cr-text-muted italic">El gasto más grande y el más fijo.</p>
            <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
              Abono 3 días en festival tier-1 español: <strong className="text-cr-text">130–250 €</strong> en preventa,
              hasta 300 € los últimos días. Día suelto: 60–110 €. Sonorama y festivales medianos pueden estar en
              90–130 €. Primavera Sound y Cala Mijas son los más caros (260–320 €).
            </p>
            <p className="font-mono text-[11px] text-cr-text-muted border-t border-cr-border pt-3">
              Optimización: comprar early bird ahorra <strong className="text-cr-text">20–40 €</strong>.
            </p>
          </article>

          <article className="border border-cr-border p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Bus size={18} className="text-cr-primary" />
              <h3 className="font-display text-lg uppercase">2 · Transporte</h3>
            </div>
            <p className="font-sans text-[11px] text-cr-text-muted italic">La partida más fácil de optimizar.</p>
            <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
              Carpooling como pasajero: <strong className="text-cr-text">3–22 €/asiento por trayecto</strong> (8–44 €
              ida+vuelta). Bus oficial: 15–35 €/asiento ida. AVE + lanzadera: 40–110 €. Coche propio: 60–110 € de
              gasolina + 0–30 € de parking diario en festivales urbanos.
            </p>
            <p className="font-mono text-[11px] text-cr-text-muted border-t border-cr-border pt-3">
              Optimización: pasajero en carpooling baja <strong className="text-cr-text">30–80 €/persona</strong>.
            </p>
          </article>

          <article className="border border-cr-border p-5 space-y-3">
            <div className="flex items-center gap-2">
              <UtensilsCrossed size={18} className="text-cr-primary" />
              <h3 className="font-display text-lg uppercase">3 · Comida</h3>
            </div>
            <p className="font-sans text-[11px] text-cr-text-muted italic">Más cara dentro del recinto.</p>
            <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
              Menú food truck dentro del recinto: <strong className="text-cr-text">12–18 €/comida</strong> (3 días = 70–110 €
              si haces 2 comidas/día). Fuera del recinto, menú del día en bar local: 12–15 €. Supermercado para
              desayuno + algún picoteo: 15–25 €/persona los 3 días.
            </p>
            <p className="font-mono text-[11px] text-cr-text-muted border-t border-cr-border pt-3">
              Optimización: una comida fuera ahorra <strong className="text-cr-text">5–8 €/día/persona</strong>.
            </p>
          </article>

          <article className="border border-cr-border p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Beer size={18} className="text-cr-primary" />
              <h3 className="font-display text-lg uppercase">4 · Bebida</h3>
            </div>
            <p className="font-sans text-[11px] text-cr-text-muted italic">Dentro 6× más cara que fuera.</p>
            <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
              Caña dentro del recinto: <strong className="text-cr-text">6–8 €</strong>. Combinado: 10–14 €. Botellín en
              supermercado pre-festival: 0,80–1,20 €. Botella de licor en super: 12–18 €. 3 días de bebida sólo dentro
              del recinto: 70–120 €/persona. Mixto (super pre + alguna caña dentro): 35–60 €.
            </p>
            <p className="font-mono text-[11px] text-cr-text-muted border-t border-cr-border pt-3">
              Optimización: pre-festival en super baja <strong className="text-cr-text">35–60 €/persona</strong>.
            </p>
          </article>

          <article className="border border-cr-border p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Tent size={18} className="text-cr-primary" />
              <h3 className="font-display text-lg uppercase">5 · Alojamiento</h3>
            </div>
            <p className="font-sans text-[11px] text-cr-text-muted italic">De gratis a 280 €/persona.</p>
            <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
              Acampada incluida en abono (Sonorama, Resurrection, Viña Rock, FIB, Arenal Sound):{" "}
              <strong className="text-cr-text">0–25 €/persona</strong>. Acampada premium con servicios: 40–80 €. Hotel
              3* compartido: 80–140 €/noche (40–70 €/persona en doble) = 80–140 €/persona los 2–3 días. Hotel 4* o
              Airbnb privado: 200–280 €/persona.
            </p>
            <p className="font-mono text-[11px] text-cr-text-muted border-t border-cr-border pt-3">
              Optimización: acampada vs hotel ahorra <strong className="text-cr-text">100–200 €/persona</strong>.
            </p>
          </article>

          <article className="border border-cr-border p-5 space-y-3">
            <div className="flex items-center gap-2">
              <Backpack size={18} className="text-cr-primary" />
              <h3 className="font-display text-lg uppercase">6 · Kit festivalero</h3>
            </div>
            <p className="font-sans text-[11px] text-cr-text-muted italic">Lo que olvidas y compras a precio premium.</p>
            <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
              Riñonera, vasos reutilizables, silla plegable, protección solar, power bank, neceser, toalla microfibra,
              tapones para oídos. Comprado en el supermercado de última hora o dentro del recinto:{" "}
              <strong className="text-cr-text">25–50 €</strong>. Llevado de casa: 0 €.
            </p>
            <p className="font-mono text-[11px] text-cr-text-muted border-t border-cr-border pt-3">
              Optimización: kit propio ahorra <strong className="text-cr-text">25–45 €/persona</strong>.
            </p>
          </article>
        </div>

        <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
          Resumen práctico: el abono está dado (poco margen), pero las cuatro partidas siguientes (transporte, comida,
          bebida, alojamiento, kit) son donde se decide el 100 % de la diferencia entre un fin de semana de 250 € y uno
          de 800 €. Consulta los datos abiertos en{" "}
          <Link to="/datos" className="text-cr-primary hover:underline">/datos</Link> y la guía pillar{" "}
          <Link to="/guia/festival-sin-coche" className="text-cr-primary hover:underline">Festival sin coche</Link> para
          afinar transporte.
        </p>
      </section>

      {/* ── Sección 2 — Calculadora rápida 3 perfiles ── */}
      <section className="max-w-4xl mx-auto px-6 pb-14 border-t border-cr-border pt-12 space-y-6">
        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cr-secondary">Sección 2</p>
          <h2 className="font-display text-3xl md:text-4xl uppercase">
            Calculadora rápida · 3 perfiles
          </h2>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl speakable">
            Tres presupuestos tipo para un festival de 3 días en España 2026, calculados por persona dentro de un grupo
            de 4 amigos. Elige el perfil más parecido al tuyo y ajusta las partidas individuales según tu festival concreto.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full font-sans text-sm text-cr-text-muted border-collapse">
            <thead>
              <tr className="border-b border-cr-border">
                <th className="text-left py-3 pr-4 font-display text-xs uppercase text-cr-text">Partida</th>
                <th className="text-left py-3 pr-4 font-display text-xs uppercase text-cr-text-muted">Low-budget</th>
                <th className="text-left py-3 pr-4 font-display text-xs uppercase text-cr-primary">Medio</th>
                <th className="text-left py-3 font-display text-xs uppercase text-cr-secondary">Premium</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cr-border">
              <tr>
                <td className="py-3 pr-4 font-medium text-cr-text">Abono 3 días</td>
                <td className="py-3 pr-4">{LOW.ticket}</td>
                <td className="py-3 pr-4 text-cr-primary">{MEDIUM.ticket}</td>
                <td className="py-3">{PREMIUM.ticket}</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-medium text-cr-text">Transporte</td>
                <td className="py-3 pr-4">{LOW.transport}</td>
                <td className="py-3 pr-4 text-cr-primary">{MEDIUM.transport}</td>
                <td className="py-3">{PREMIUM.transport}</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-medium text-cr-text">Comida</td>
                <td className="py-3 pr-4">{LOW.food}</td>
                <td className="py-3 pr-4 text-cr-primary">{MEDIUM.food}</td>
                <td className="py-3">{PREMIUM.food}</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-medium text-cr-text">Bebida</td>
                <td className="py-3 pr-4">{LOW.drink}</td>
                <td className="py-3 pr-4 text-cr-primary">{MEDIUM.drink}</td>
                <td className="py-3">{PREMIUM.drink}</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-medium text-cr-text">Alojamiento</td>
                <td className="py-3 pr-4">{LOW.sleep}</td>
                <td className="py-3 pr-4 text-cr-primary">{MEDIUM.sleep}</td>
                <td className="py-3">{PREMIUM.sleep}</td>
              </tr>
              <tr>
                <td className="py-3 pr-4 font-medium text-cr-text">Kit festivalero</td>
                <td className="py-3 pr-4">{LOW.kit}</td>
                <td className="py-3 pr-4 text-cr-primary">{MEDIUM.kit}</td>
                <td className="py-3">{PREMIUM.kit}</td>
              </tr>
              <tr className="border-t-2 border-cr-border bg-cr-card/30">
                <td className="py-3 pr-4 font-display uppercase text-cr-text">Total / persona</td>
                <td className="py-3 pr-4 font-display text-cr-text">{LOW.total}</td>
                <td className="py-3 pr-4 font-display text-cr-primary">{MEDIUM.total}</td>
                <td className="py-3 font-display text-cr-secondary">{PREMIUM.total}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="grid md:grid-cols-3 gap-5 pt-2">
          {PROFILES.map((p) => (
            <div key={p.label} className={`border ${p.color} p-5 space-y-2`}>
              <div className="flex items-center gap-2">
                <Calculator size={16} className={p.label === "Medio" ? "text-cr-primary" : p.label === "Premium" ? "text-cr-secondary" : "text-cr-text-muted"} />
                <p className="font-display text-base uppercase text-cr-text">{p.label}</p>
              </div>
              <p className="font-display text-2xl text-cr-text">{p.total}</p>
              <p className="font-sans text-xs text-cr-text-muted">por persona · grupo de 4 · 3 días</p>
            </div>
          ))}
        </div>

        <p className="font-mono text-[11px] text-cr-text-dim">
          Fuente: precios públicos de abonos 2026, datos internos ConcertRide sobre carpooling y datos de festivalLandings
          para alojamiento y lanzaderas. Tabla extendida con precios actualizados:{" "}
          <Link to="/datos/precio-medio-carpooling-vs-bus-festivales-2026" className="hover:text-cr-primary">
            /datos/precio-medio-carpooling-vs-bus-festivales-2026
          </Link>. Ranking 57 festivales por coste total transporte ida+vuelta desde Madrid:{" "}
          <Link to="/datos/festivales-mas-caros-mas-baratos-llegar-2026" className="hover:text-cr-primary">
            /datos/festivales-mas-caros-mas-baratos-llegar-2026
          </Link>. Calendario maestro cronológico de los 58 festivales 2026 con presupuesto, conectividad y ranking:{" "}
          <Link to="/datos/calendario-maestro-festivales-2026" className="hover:text-cr-primary">
            /datos/calendario-maestro-festivales-2026
          </Link>. Costes ocultos del transporte (parking, taxi vuelta de madrugada, comisiones plataformas
          generalistas, propinas): 52,5 €/día de media adicional por persona, desglose en{" "}
          <Link to="/datos/costes-ocultos-transporte-festivales-2026" className="hover:text-cr-primary">
            /datos/costes-ocultos-transporte-festivales-2026
          </Link>. Si tu plan no es un festival sino un concierto individual (Bad Bunny, Coldplay, Taylor Swift,
          Rosalía…), el Top 30 single-venue con mayor demanda 2026 está en{" "}
          <Link to="/datos/conciertos-mayor-demanda-transporte-2026" className="hover:text-cr-primary">
            /datos/conciertos-mayor-demanda-transporte-2026
          </Link>{" "}(aforo + precio entrada medio + carpooling medio + género dominante). Y para el
          presupuesto de cama y noches, el alojamiento mediano por tipología (hotel 4★ 152 €, 3★ 105 €,
          hostel 30 €/cama, apartamento 2 pax 122 €) por festival está en{" "}
          <Link to="/datos/alojamiento-cercano-festivales-2026" className="hover:text-cr-primary">
            /datos/alojamiento-cercano-festivales-2026
          </Link>.
        </p>
      </section>

      {/* ── Sección 3 — Coordinar gastos en grupo ── */}
      <section className="max-w-4xl mx-auto px-6 pb-14 border-t border-cr-border pt-12 space-y-6">
        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cr-secondary">Sección 3</p>
          <h2 className="font-display text-3xl md:text-4xl uppercase">
            Cómo coordinar gastos en grupo sin liarte
          </h2>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
            La parte más incómoda de un fin de semana de festival no es el sueño, ni el calor, ni la cola del bar: es
            quién pagó qué y a quién hay que devolverle dinero. Estas cinco reglas prácticas evitan el 90 % de los
            problemas de reparto en grupo.
          </p>
        </div>

        <ol className="space-y-5 list-none">
          <li className="border border-cr-border p-5 space-y-2">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-cr-primary" />
              <p className="font-display text-base uppercase text-cr-text">Regla 1 · Cada uno su abono</p>
            </div>
            <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
              Las entradas las compra cada persona por su cuenta. Alguien querrá VIP, otro abono general, otro sólo día
              suelto. Mezclar entradas en bote es la receta perfecta para una pelea. Que cada persona pague la suya y
              guarde el justificante por si hay control de acceso.
            </p>
          </li>

          <li className="border border-cr-border p-5 space-y-2">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-cr-primary" />
              <p className="font-display text-base uppercase text-cr-text">Regla 2 · Bote común sólo para lo compartido</p>
            </div>
            <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
              Gastos compartidos típicos: gasolina si vais en coche propio, parking, supermercado pre-festival (agua,
              cervezas, comida camping), hielo, gas para el camping gas. Estos sí van a bote común. Cada persona aporta
              30–45 € al inicio del fin de semana y se gasta de ahí. Lo que sobre se devuelve por Bizum el lunes.
            </p>
          </li>

          <li className="border border-cr-border p-5 space-y-2">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-cr-primary" />
              <p className="font-display text-base uppercase text-cr-text">Regla 3 · Lo individual va en una app de gastos compartidos</p>
            </div>
            <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
              Para gastos individuales que se reparten (rondas de cañas, una pizza para 3, un Uber compartido), abre una
              cuenta común en una app de gastos compartidos (las hay gratuitas y muy conocidas). Apunta cada gasto y al
              final del fin de semana la app calcula automáticamente quién debe qué y a quién. Cero discusiones,
              transparencia total.
            </p>
          </li>

          <li className="border border-cr-border p-5 space-y-2">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-cr-primary" />
              <p className="font-display text-base uppercase text-cr-text">Regla 4 · El carpooling se paga al conductor en persona</p>
            </div>
            <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
              Si vais como pasajeros en ConcertRide, el pago al conductor lo hace cada persona en efectivo o Bizum al
              subir o bajar del coche. No se mete en bote común porque es un gasto fijo personal y no proporcional al
              uso compartido. Si reserváis 2 coches en paralelo (típico en grupos de 4), cada subgrupo paga a su
              conductor.
            </p>
          </li>

          <li className="border border-cr-border p-5 space-y-2">
            <div className="flex items-center gap-2">
              <Users size={16} className="text-cr-primary" />
              <p className="font-display text-base uppercase text-cr-text">Regla 5 · Cierra cuentas el lunes, no el domingo</p>
            </div>
            <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
              El domingo del festival nadie tiene cabeza para cerrar cuentas. Acordad que el lunes (o martes) por la
              noche cada persona revisa la app de gastos, confirma totales y se hacen los Bizum pendientes. Si esperas
              más de una semana, la mitad del grupo olvidará detalles y aparecen los problemas.
            </p>
          </li>
        </ol>

        <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
          Lectura recomendada:{" "}
          <Link to="/blog/como-organizar-viaje-grupo-festival-amigos" className="text-cr-primary hover:underline">
            Cómo organizar un viaje en grupo a un festival con amigos
          </Link>
          {" "}— guía paso a paso de coordinación del grupo desde el chat inicial hasta el día del bolo.
        </p>
      </section>

      {/* ── Sección 4 — Casos reales por festival ── */}
      <section className="max-w-4xl mx-auto px-6 pb-14 border-t border-cr-border pt-12 space-y-8">
        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cr-secondary">Sección 4</p>
          <h2 className="font-display text-3xl md:text-4xl uppercase">
            Casos reales · 3 festivales detallados
          </h2>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl speakable">
            Desglose completo partida a partida para un grupo de 4 amigos desde Madrid en perfil medio (acampada o
            albergue compartido + carpooling como pasajero + comida mixta). Datos calculados con precios públicos de
            abonos 2026 y rangos reales de carpooling ConcertRide.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full font-sans text-sm text-cr-text-muted border-collapse">
            <thead>
              <tr className="border-b border-cr-border">
                <th className="text-left py-3 pr-4 font-display text-xs uppercase text-cr-text">Festival</th>
                <th className="text-left py-3 pr-4 font-display text-xs uppercase text-cr-text">Ciudad / Días</th>
                <th className="text-left py-3 pr-4 font-display text-xs uppercase text-cr-primary">Por persona</th>
                <th className="text-left py-3 font-display text-xs uppercase text-cr-secondary">Grupo de 4</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cr-border">
              {FESTIVAL_CASES.map((f) => (
                <tr key={f.slug}>
                  <td className="py-3 pr-4 font-medium text-cr-text">
                    <Link to={`/festivales/${f.slug}`} className="hover:text-cr-primary">{f.festival}</Link>
                  </td>
                  <td className="py-3 pr-4 text-cr-text-dim">{f.city} · {f.duration}</td>
                  <td className="py-3 pr-4 text-cr-primary font-medium">{f.perPerson}</td>
                  <td className="py-3 text-cr-secondary font-medium">{f.perGroup}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {FESTIVAL_CASES.map((f) => (
          <article key={`${f.slug}-detail`} className="border border-cr-border p-5 space-y-3">
            <div className="flex items-center justify-between gap-3 flex-wrap">
              <h3 className="font-display text-xl uppercase">
                <Link to={`/festivales/${f.slug}`} className="hover:text-cr-primary">{f.festival}</Link>
                {" "}<span className="text-cr-text-muted text-sm font-mono normal-case">({f.city})</span>
              </h3>
              <p className="font-display text-lg text-cr-primary">{f.perPerson} <span className="text-xs text-cr-text-muted font-mono">/persona</span></p>
            </div>
            <ul className="font-sans text-sm text-cr-text-muted space-y-1.5 leading-relaxed">
              <li><strong className="text-cr-text">Abono:</strong> {f.ticket}</li>
              <li><strong className="text-cr-text">Transporte:</strong> {f.transport}</li>
              <li><strong className="text-cr-text">Comida:</strong> {f.food}</li>
              <li><strong className="text-cr-text">Bebida:</strong> {f.drink}</li>
              <li><strong className="text-cr-text">Alojamiento:</strong> {f.sleep}</li>
              <li><strong className="text-cr-text">Kit:</strong> {f.kit}</li>
            </ul>
            <p className="font-sans text-xs text-cr-text-dim border-t border-cr-border pt-3">
              <strong className="text-cr-text">Nota:</strong> {f.notes}
            </p>
            <Link
              to={f.route}
              className="inline-flex items-center gap-1 font-sans text-xs font-semibold uppercase tracking-[0.12em] text-cr-primary hover:underline"
            >
              Ver ruta de carpooling <ArrowRight size={11} />
            </Link>
          </article>
        ))}

        <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl">
          Más casos por ciudad de origen:{" "}
          <Link to="/conciertos/madrid" className="text-cr-primary hover:underline">festivales desde Madrid</Link>,{" "}
          <Link to="/conciertos/barcelona" className="text-cr-primary hover:underline">festivales desde Barcelona</Link>.
        </p>
      </section>

      {/* ── Sección 5 — Trucos para reducir 40 % ── */}
      <section className="max-w-4xl mx-auto px-6 pb-14 border-t border-cr-border pt-12 space-y-6">
        <div className="space-y-3">
          <p className="font-mono text-[11px] uppercase tracking-[0.16em] text-cr-secondary">Sección 5</p>
          <h2 className="font-display text-3xl md:text-4xl uppercase">
            5 trucos para recortar hasta un 40 %
          </h2>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-2xl speakable">
            Cinco palancas concretas con impacto medible. Aplicando las cinco a la vez, un festival de 450 €/persona en
            perfil medio puede bajar a unos 270 €/persona, un recorte real del 35–40 % sin perder experiencia esencial.
          </p>
        </div>

        <div className="space-y-4">
          <div className="border border-cr-border p-5 space-y-2">
            <div className="flex items-center gap-2">
              <TrendingDown size={16} className="text-cr-primary" />
              <p className="font-display text-base uppercase text-cr-text">Truco 1 · Abono temprano (early bird)</p>
            </div>
            <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
              Los primeros lotes salen 4–6 meses antes y suelen costar <strong className="text-cr-text">20–40 € menos</strong>{" "}
              que el precio final. Mad Cool, Primavera Sound, Sónar y FIB lanzan early birds en septiembre–octubre del
              año anterior. Inconveniente: el cartel completo aún no está confirmado, asumes el riesgo de que algún
              cabeza de cartel no convenza.
            </p>
          </div>

          <div className="border border-cr-border p-5 space-y-2">
            <div className="flex items-center gap-2">
              <TrendingDown size={16} className="text-cr-primary" />
              <p className="font-display text-base uppercase text-cr-text">Truco 2 · Carpooling como pasajero (no conducir)</p>
            </div>
            <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
              Ir como pasajero en{" "}
              <Link to="/" className="text-cr-primary hover:underline">ConcertRide</Link>{" "}
              cuesta 3–22 € por trayecto según distancia. Comparativa real: Madrid → Mad Cool ida+vuelta 8–14 €/persona;
              alquiler de coche + gasolina + parking 3 días = 250–340 € (62–85 €/persona en grupo de 4). El{" "}
              <strong className="text-cr-text">ahorro por persona ronda los 50–75 €</strong> en festivales cercanos y
              80–120 € en rutas largas. Sin comisión para ConcertRide — pagas al conductor en persona.
            </p>
          </div>

          <div className="border border-cr-border p-5 space-y-2">
            <div className="flex items-center gap-2">
              <TrendingDown size={16} className="text-cr-primary" />
              <p className="font-display text-base uppercase text-cr-text">Truco 3 · Acampada en lugar de hotel</p>
            </div>
            <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
              La acampada está incluida en el abono o cuesta 10–25 € de suplemento en Sonorama, Resurrection Fest, Viña
              Rock, FIB y Arenal Sound. Un hotel 3 estrellas en zona festivalera cuesta 80–140 €/noche en habitación
              doble (40–70 €/persona). Ahorro en 2–3 noches:{" "}
              <strong className="text-cr-text">100–200 €/persona</strong>. Si nunca has acampado, esta es la decisión
              con mayor impacto en el presupuesto total.
            </p>
          </div>

          <div className="border border-cr-border p-5 space-y-2">
            <div className="flex items-center gap-2">
              <TrendingDown size={16} className="text-cr-primary" />
              <p className="font-display text-base uppercase text-cr-text">Truco 4 · Bebida en super pre-festival</p>
            </div>
            <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
              Caña dentro del recinto: 6–8 €. Botellín en supermercado del pueblo: 0,80–1,20 €. Comprar bebida en el
              super el primer día y consumirla en el camping antes de entrar al recinto cada noche ahorra fácilmente{" "}
              <strong className="text-cr-text">35–60 €/persona</strong> en un fin de semana. Algunas comunidades de
              vecinos del pueblo organizan «cargas» colectivas — apuntarse al chat del festival ayuda.
            </p>
          </div>

          <div className="border border-cr-border p-5 space-y-2">
            <div className="flex items-center gap-2">
              <TrendingDown size={16} className="text-cr-primary" />
              <p className="font-display text-base uppercase text-cr-text">Truco 5 · Kit festivalero desde casa</p>
            </div>
            <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
              Silla plegable, neceser, toalla, vasos reutilizables, crema solar, tapones, power bank, riñonera y ropa
              cómoda los tienes en casa. Comprándolos en el bazar del pueblo el día antes pagas 25–45 € extra. Si vas
              como pasajero en carpooling, una mochila grande cabe sin problema — los conductores cuentan con que cada
              pasajero lleva equipaje de fin de semana.
            </p>
          </div>
        </div>

        <div className="p-5 border border-cr-primary/30 bg-cr-primary/5 space-y-2">
          <p className="font-display text-base uppercase text-cr-primary">Cálculo final aplicando los 5 trucos</p>
          <p className="font-sans text-sm text-cr-text-muted leading-relaxed">
            Festival 3 días, grupo de 4 amigos, perfil medio inicial: <strong className="text-cr-text">450 €/persona</strong>.
            Aplicando los 5 trucos a la vez: −30 € abono early bird, −55 € transporte pasajero, −150 € acampada vs hotel,
            −50 € bebida pre-festival, −35 € kit propio = <strong className="text-cr-text">−320 €</strong>. Coste final:{" "}
            <strong className="text-cr-primary">270–290 €/persona</strong>. Ahorro del 35–40 % manteniendo el plan completo.
          </p>
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
        <div className="flex items-center gap-2">
          <Wallet size={18} className="text-cr-primary" />
          <h2 className="font-display text-2xl md:text-3xl uppercase">Empieza a recortar tu presupuesto</h2>
        </div>
        <p className="font-sans text-sm text-cr-text-muted max-w-xl">
          El primer paso para bajar el coste de tu fin de semana es ir como pasajero en carpooling: sin gasolina, sin
          parking, sin alquiler. Mira los viajes publicados desde tu ciudad al festival y pacta la vuelta de madrugada
          con el conductor antes de salir.
        </p>
        <div className="flex flex-wrap gap-3 pt-2">
          <Link
            to="/concerts"
            onClick={() => trackEvent(ANALYTICS_EVENTS.PILLAR_CTA_CLICKED, { pillar_slug: PILLAR_SLUG, cta_target: "/buscar" })}
            className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] bg-cr-primary text-black px-5 py-2.5 hover:bg-cr-primary/90 transition-colors"
          >
            Buscar viaje <ArrowRight size={12} />
          </Link>
          <Link
            to="/guia/festival-sin-coche"
            className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] border border-cr-primary text-cr-primary px-5 py-2.5 hover:bg-cr-primary hover:text-black transition-colors"
          >
            Festival sin coche <ArrowRight size={12} />
          </Link>
          <Link
            to="/blog/carpooling-vs-taxi-festival-espana"
            className="inline-flex items-center gap-2 font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors"
          >
            Carpooling vs taxi <ArrowRight size={12} />
          </Link>
          <Link
            to="/datos"
            className="inline-flex items-center gap-2 font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors"
          >
            Ver datos abiertos <ArrowRight size={12} />
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
