import { Link } from "react-router-dom";
import { ArrowRight, Calculator, Smartphone, Receipt, Users } from "lucide-react";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";
import { BRAND } from "@/lib/brandEntity";
import { ContentProvenance } from "@/components/ContentProvenance";

/**
 * Landing — /compartir-gastos-festival
 *
 * Targets the economic-intent query "compartir gastos festival" + Spanish
 * Gen Z payment vocabulary (Bizum / Splitwise / Tricount). Distinct angle
 * vs sibling pages: focus on money flow, splitting tools, no comisión.
 * Avoids the loan word "carpooling" in H1 — uses "compartir gastos de coche".
 */

const SPLIT_TOOLS = [
  {
    name: "Bizum",
    use: "Para enviar/recibir el dinero al instante",
    body:
      "Lo que casi todo el mundo usa en España para pagar al conductor al final del viaje. Gratis entre la mayoría de bancos, sin tarjetas guardadas en ninguna app.",
  },
  {
    name: "Splitwise",
    use: "Para llevar la cuenta del fin de semana entero",
    body:
      "App de referencia para repartir gastos del grupo: cubatas, súper, gasolina, peajes, supermercado del camping. Cada uno apunta lo que paga y al final salda con Bizum.",
  },
  {
    name: "Tricount",
    use: "Alternativa europea a Splitwise",
    body:
      "Misma idea que Splitwise pero con servidores europeos. Funciona offline, útil cuando hay poca cobertura en el camping del festival.",
  },
  {
    name: "Efectivo",
    use: "Para gente sin Bizum",
    body:
      "Sigue siendo válido: el conductor cobra en mano el día del viaje. Sin comisión bancaria ni app intermedia.",
  },
];

const COSTS_BREAKDOWN = [
  {
    item: "Gasolina ida + vuelta (450 km)",
    total: "≈ 60 €",
    perPerson: "15 €",
    note: "Coche medio europeo, 6 L/100 km, ≈1,58 €/L (DGT abril 2026).",
  },
  {
    item: "Peajes (si la ruta tiene)",
    total: "0–25 €",
    perPerson: "0–6 €",
    note: "Muchas rutas Madrid–Levante son gratis. Vías AP1/AP6 sí cobran.",
  },
  {
    item: "Aparcamiento del recinto",
    total: "0–20 €",
    perPerson: "0–5 €",
    note: "Mad Cool y BBK Live incluyen aparcamiento. Festivales urbanos suelen cobrar.",
  },
  {
    item: "Total estimado",
    total: "60–105 €",
    perPerson: "15–26 €",
    note: "Con 4 personas en el coche. Con 3 personas sale ≈ 20–35 € por cabeza.",
    bold: true,
  },
];

const FAQS = [
  {
    q: "¿Cómo se reparten los gastos del coche en un festival?",
    a: `La forma habitual: el conductor estima gasolina + peajes + aparcamiento del recinto, lo divide entre el número de plazas (incluyéndose) y publica ese precio por asiento en ${BRAND.legalName}. Cuando llega el día del viaje, cada pasajero paga su parte por Bizum o efectivo. Sin comisión de plataforma — ${BRAND.legalName} no se queda con nada.`,
  },
  {
    q: "¿Es legal cobrar a los pasajeros por compartir coche?",
    a: "Sí, siempre que el precio cubra costes reales del viaje (gasolina, peajes, desgaste) y no haya ánimo de lucro. La Ley de Ordenación de Transportes (LOTT) considera lícito el carpooling 'a coste compartido' — el conductor no genera beneficio, solo recupera parte de lo que gasta. ConcertRide aplica un precio máximo orientativo por kilómetro para mantenerse dentro de este marco.",
  },
  {
    q: "¿Cuánto se ahorra cada persona compartiendo coche?",
    a: "En un grupo de 4, cada persona paga aproximadamente el 25 % del coste total del viaje. Para una ruta Valencia–Primavera Sound (350 km cada vía), el coche con peajes ronda los 90-110 € — sale a 22-28 € por persona ida + vuelta. La misma ruta en AVE cuesta 50-90 € sin traslado al recinto.",
  },
  {
    q: "¿Y si alguien cancela a última hora?",
    a: "Si cancela 24h+ antes, el conductor reabre la plaza en la app. Si cancela el mismo día, depende del acuerdo del grupo — algunos conductores devuelven la parte de Bizum si encuentran sustituto, otros no. Como el pago se hace en mano y no por adelantado, no hay dinero atrapado en la plataforma.",
  },
  {
    q: "¿Cuánto cobra ConcertRide por gestionar el reparto?",
    a: `Cero. ${BRAND.legalName} no procesa pagos ni aplica comisión: el dinero va directo del pasajero al conductor (Bizum o efectivo) el día del viaje. Las plataformas de carpooling generalistas cobran 10-18 % de comisión sobre el viaje; aquí ese 10-18 % se queda en el bolsillo del conductor o se traduce en precio más bajo para el pasajero.`,
  },
  {
    q: "¿Qué pasa con multas o accidentes durante el trayecto?",
    a: "Las multas las paga quien conduce — no se reparten. El seguro del coche cubre el viaje normalmente porque no es transporte profesional (no hay ánimo de lucro). Conviene avisar al seguro si el coche se usa habitualmente para viajes compartidos, aunque en la práctica la mayoría de pólizas españolas no lo restringen mientras el precio cubra solo costes reales.",
  },
];

export default function CompartirGastosFestivalPage() {
  useSeoMeta({
    title: "Compartir gastos de coche al festival 2026 · ConcertRide",
    description:
      "Cómo compartir gastos de coche para ir a un festival: reparto entre 3-4 personas (15-25 €/persona), pago en Bizum o efectivo, apps como Splitwise o Tricount. Sin comisión ni intermediarios. Guía 2026.",
    canonical: `${SITE_URL}/compartir-gastos-festival`,
    keywords:
      "compartir gastos festival, compartir gastos coche festival, dividir gastos coche festival, splitwise festival, tricount festival, bizum festival coche",
    ogType: "article",
    articlePublishedTime: "2026-05-20",
    articleModifiedTime: new Date().toISOString().slice(0, 10),
    articleAuthor: BRAND.founder.name,
  });

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Compartir gastos festival", item: `${SITE_URL}/compartir-gastos-festival` },
    ],
  };

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: "Compartir gastos de coche al festival — Reparto, apps y precio real",
    description: BRAND.shortDescription,
    inLanguage: "es-ES",
    datePublished: "2026-05-20",
    dateModified: new Date().toISOString().slice(0, 10),
    author: { "@type": "Person", name: BRAND.founder.name, url: BRAND.founder.url },
    publisher: { "@type": "Organization", "@id": `${SITE_URL}/#organization`, name: BRAND.legalName },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/compartir-gastos-festival` },
  };

  return (
    <main id="main" className="min-h-dvh bg-cr-bg text-cr-text pt-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <ContentProvenance
        pageId="/compartir-gastos-festival"
        headline="Compartir gastos de coche al festival — Reparto, apps y precio real"
        datePublished="2026-05-20"
        dateModified={new Date().toISOString().slice(0, 10)}
        author={{ name: BRAND.founder.name, url: BRAND.founder.url }}
        reviewedBy={{ name: BRAND.founder.name, url: BRAND.founder.url }}
        aiInvolvement="research-assist"
        purpose="Explicar cómo se reparten los gastos del coche para ir a un festival en grupo, qué apps usar (Splitwise, Tricount, Bizum) y por qué ConcertRide no cobra comisión sobre el reparto."
      />

      <section className="mx-auto max-w-4xl px-4 md:px-6 py-8 md:py-12">
        <nav aria-label="Breadcrumb" className="font-sans text-xs uppercase tracking-[0.18em] text-cr-text/60 mb-4">
          <Link to="/" className="hover:text-cr-primary">Inicio</Link>
          <span className="mx-2">/</span>
          <span>Compartir gastos festival</span>
        </nav>

        <h1 className="font-display text-3xl md:text-5xl uppercase leading-[0.95] tracking-tight">
          Compartir gastos de coche
          <br />
          <span className="text-[#dbff00]">al festival, sin comisión</span>
        </h1>

        <p data-quotable className="mt-5 max-w-3xl font-sans text-base md:text-lg leading-relaxed text-cr-text/90">
          Compartir gastos del coche con quien también va al festival es lo más eficiente: gasolina,
          peajes y aparcamiento divididos entre 3-4 personas suelen quedar en 15-25 € por cabeza
          (ida y vuelta). En {BRAND.legalName} todo el dinero va directo del pasajero al conductor
          por Bizum o efectivo — sin comisión, sin tarjeta guardada, sin que la app se quede con
          nada. Aquí explicamos cómo se reparte, qué apps complementarias se usan (Splitwise,
          Tricount, Bizum) y cuánto sale en rutas reales.
        </p>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Link
            to="/festivales"
            className="inline-flex items-center justify-center gap-2 bg-[#dbff00] text-black font-sans font-semibold uppercase tracking-[0.12em] text-sm px-6 py-3 hover:bg-[#c8ec00] transition-colors"
          >
            Festivales con viajes
            <ArrowRight size={14} aria-hidden="true" />
          </Link>
          <Link
            to="/publish"
            className="inline-flex items-center justify-center gap-2 bg-transparent text-white/80 font-sans font-semibold uppercase tracking-[0.12em] text-sm border border-white/25 px-6 py-3 hover:border-[#dbff00]/60 hover:text-white transition-colors"
          >
            Publicar mi coche →
          </Link>
        </div>
      </section>

      {/* Cost breakdown */}
      <section className="mx-auto max-w-5xl px-4 md:px-6 py-10" aria-labelledby="reparto">
        <h2 id="reparto" className="font-display text-2xl md:text-3xl uppercase">
          Cómo se reparte un viaje de 450 km a un festival (ejemplo real)
        </h2>
        <p className="mt-3 max-w-3xl font-sans text-sm text-cr-text/70 leading-relaxed">
          Asumimos un grupo de 4 personas en un coche medio (≈6 L/100 km de gasolina 95), ida y
          vuelta. El conductor también va al festival, así que se incluye él/ella en el reparto.
        </p>

        <div className="mt-6 overflow-x-auto border border-cr-border">
          <table className="w-full min-w-[560px] text-left text-sm">
            <thead className="bg-white/[0.04] uppercase font-mono text-[10px] tracking-[0.14em] text-cr-text/70">
              <tr>
                <th scope="col" className="px-3 py-3">Concepto</th>
                <th scope="col" className="px-3 py-3">Coste total</th>
                <th scope="col" className="px-3 py-3">Por persona (÷4)</th>
                <th scope="col" className="px-3 py-3">Nota</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cr-border">
              {COSTS_BREAKDOWN.map((row) => (
                <tr key={row.item} className={row.bold ? "bg-[#dbff00]/[0.04]" : ""}>
                  <th scope="row" className={`px-3 py-3 ${row.bold ? "font-display uppercase text-[#dbff00]" : "text-cr-text/90"}`}>
                    {row.item}
                  </th>
                  <td className={`px-3 py-3 ${row.bold ? "text-[#dbff00] font-display" : "text-cr-text/80"}`}>{row.total}</td>
                  <td className={`px-3 py-3 ${row.bold ? "text-[#dbff00] font-display" : "text-cr-text/80"}`}>{row.perPerson}</td>
                  <td className="px-3 py-3 text-cr-text/60 text-xs">{row.note}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p className="mt-4 font-mono text-[11px] text-cr-text/50">
          Cálculo orientativo basado en precio medio gasolina 95 según el boletín DGT de abril 2026
          (≈ 1,58 €/L). El precio real varía con la estación de servicio, el tipo de coche y la ruta
          exacta.
        </p>
      </section>

      {/* Tools */}
      <section className="mx-auto max-w-5xl px-4 md:px-6 py-10" aria-labelledby="apps">
        <h2 id="apps" className="font-display text-2xl md:text-3xl uppercase">
          Apps que la gente usa para liquidar el reparto
        </h2>
        <p className="mt-3 max-w-3xl font-sans text-sm text-cr-text/70 leading-relaxed">
          ConcertRide solo gestiona el viaje. Para repartir el resto del fin de semana (cubatas,
          súper, comida en el camping), conviene una app de cuentas compartidas.
        </p>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {SPLIT_TOOLS.map((tool) => (
            <article key={tool.name} className="border border-cr-border p-5">
              <div className="flex items-center gap-2">
                {tool.name === "Bizum" && <Smartphone size={20} className="text-cr-primary" aria-hidden="true" />}
                {tool.name === "Splitwise" && <Calculator size={20} className="text-cr-primary" aria-hidden="true" />}
                {tool.name === "Tricount" && <Receipt size={20} className="text-cr-primary" aria-hidden="true" />}
                {tool.name === "Efectivo" && <Users size={20} className="text-cr-primary" aria-hidden="true" />}
                <h3 className="font-display text-lg uppercase">{tool.name}</h3>
              </div>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.16em] text-cr-primary">{tool.use}</p>
              <p className="mt-2 font-sans text-sm text-cr-text/80 leading-relaxed">{tool.body}</p>
            </article>
          ))}
        </div>
      </section>

      {/* Vocabulary aside — useful for SEO semantic coverage */}
      <section className="mx-auto max-w-4xl px-4 md:px-6 py-6" aria-labelledby="vocabulario">
        <aside className="border-l-2 border-cr-primary bg-white/[0.02] px-5 py-4">
          <h2 id="vocabulario" className="font-display text-base uppercase tracking-[0.14em] text-cr-primary">
            Cómo llamamos a esto, sin tecnicismos
          </h2>
          <p className="mt-2 font-sans text-sm text-cr-text/80 leading-relaxed">
            Llámalo como quieras: <strong>compartir coche</strong>, <strong>carpooling</strong>,
            <strong> viaje compartido</strong>, <strong>compartir gastos del coche</strong>,
            <strong> ir juntos al festival</strong> o, en plan castizo,{" "}
            <strong>hacer piña</strong> para llegar al recinto. Todos los términos describen lo
            mismo: varias personas que van al mismo festival viajan en el mismo coche y dividen el
            coste real del trayecto. Lo que cambia es la jerga, no el plan.
          </p>
        </aside>
      </section>

      {/* FAQ */}
      <section className="mx-auto max-w-4xl px-4 md:px-6 py-10" aria-labelledby="faq">
        <h2 id="faq" className="font-display text-2xl md:text-3xl uppercase">Preguntas frecuentes sobre el reparto</h2>
        <dl className="mt-6 divide-y divide-cr-border border-y border-cr-border">
          {FAQS.map((item) => (
            <div key={item.q} className="py-5">
              <dt className="font-display text-lg uppercase">{item.q}</dt>
              <dd className="mt-2 font-sans text-sm md:text-base leading-relaxed text-cr-text/85">{item.a}</dd>
            </div>
          ))}
        </dl>
      </section>

      {/* Related */}
      <section className="mx-auto max-w-4xl px-4 md:px-6 pb-16">
        <h2 className="font-display text-xl md:text-2xl uppercase">Sigue por aquí</h2>
        <ul className="mt-4 grid gap-3 md:grid-cols-2">
          <li>
            <Link to="/viaje-en-grupo-festival" className="block border border-cr-border p-4 hover:border-cr-primary/60 transition-colors">
              <p className="font-display text-sm uppercase">Viaje en grupo al festival →</p>
              <p className="mt-1 text-xs text-cr-text/60">Logística completa: coche, alojamiento, entradas y app del grupo.</p>
            </Link>
          </li>
          <li>
            <Link to="/hacer-pina-festival" className="block border border-cr-border p-4 hover:border-cr-primary/60 transition-colors">
              <p className="font-display text-sm uppercase">Hacer piña en el festival →</p>
              <p className="mt-1 text-xs text-cr-text/60">El término castizo para llegar y vivir el festival como grupo unido.</p>
            </Link>
          </li>
          <li>
            <Link to="/compartir-coche-festival" className="block border border-cr-border p-4 hover:border-cr-primary/60 transition-colors">
              <p className="font-display text-sm uppercase">Compartir coche al festival →</p>
              <p className="mt-1 text-xs text-cr-text/60">Cómo funciona y cuánto cuesta, paso a paso.</p>
            </Link>
          </li>
          <li>
            <Link to="/blog/como-organizar-viaje-grupo-festival-amigos" className="block border border-cr-border p-4 hover:border-cr-primary/60 transition-colors">
              <p className="font-display text-sm uppercase">Guía 8 pasos viaje en grupo →</p>
              <p className="mt-1 text-xs text-cr-text/60">Roles, presupuesto, normas y plantillas para organizarse sin pelearse.</p>
            </Link>
          </li>
        </ul>
      </section>
    </main>
  );
}
