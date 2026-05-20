import { Link } from "react-router-dom";
import { ArrowRight, Car, CreditCard, ShieldCheck, Users } from "lucide-react";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";
import { TerminologyAside } from "@/components/TerminologyAside";

const PASSENGER_STEPS = [
  {
    title: "Busca el festival o concierto",
    body:
      "Abre ConcertRide y busca el festival al que quieres ir. Puedes filtrar por ciudad, fecha o nombre del evento. La idea es simple: encuentras un viaje con gente que va al mismo sitio que tú y no tienes que improvisar transporte a última hora.",
  },
  {
    title: "Compara precio, ciudad y horario",
    body:
      "Cada viaje muestra precio por asiento, ciudad de salida, hora prevista y valoración del conductor. Así eliges la opción que mejor encaja con tu plan, no solo la más barata. Para festivales con vuelta de madrugada, el horario es especialmente importante.",
  },
  {
    title: "Reserva tu plaza",
    body:
      "Envías la solicitud al conductor, confirmas las plazas disponibles y acuerdas el punto de encuentro. Si el conductor tiene confirmación inmediata, el asiento queda reservado al instante. Si no, responde en pocas horas como máximo.",
  },
  {
    title: "Viaja, paga y vuelve tranquilo",
    body:
      "El día del evento te encuentras con el conductor, pagas en efectivo o Bizum y compartes el viaje hasta el recinto. A la vuelta, el horario se coordina entre todos para evitar colas, taxis caros o depender del último metro.",
  },
];

const DRIVER_STEPS = [
  {
    title: "Verifica tu carnet",
    body:
      "Antes de publicar viajes, sube una foto de tu carnet de conducir para verificar tu perfil. Es una comprobación básica que aporta confianza al resto de usuarios y evita perfiles anónimos.",
  },
  {
    title: "Publica tu viaje",
    body:
      "Selecciona el evento, la ciudad de salida, la hora y el precio por asiento. ConcertRide está pensado para conciertos y festivales, así que publicar un viaje es rápido y no tienes que hacer una descripción larga.",
  },
  {
    title: "Gestiona solicitudes",
    body:
      "Recibirás solicitudes de personas que van al mismo concierto o festival. Puedes aceptar, rechazar o hablar por chat para cerrar el punto exacto de recogida y cualquier detalle del trayecto.",
  },
  {
    title: "Cobra sin comisión",
    body:
      "ConcertRide aplica una comisión del 0 % al conductor y al pasajero sobre cada viaje. Si el precio publicado del asiento es 12 €, el conductor recibe 12 € y el pasajero paga 12 €. El pago ocurre fuera de la plataforma: efectivo o Bizum directo al conductor el día del trayecto. ConcertRide no procesa cobros ni custodia importes. El conductor fija el precio del asiento para cubrir gasolina (95 a ~1,58 €/L según boletín DGT abril 2026), peajes y desgaste, dividido entre 2 a 4 pasajeros. Las plataformas de carpooling generalistas cobran entre el 10 % y el 18 % de comisión; en una ruta a 6 €, equivaldría a 0,60–1,08 € descontados al conductor.",
  },
];

const FAQS = [
  {
    q: "¿Qué es el carpooling para conciertos?",
    a: "Es compartir coche con otras personas que van al mismo concierto o festival, repartiendo gastos de gasolina y peajes. ConcertRide lo organiza por evento, no por simple origen-destino.",
  },
  {
    q: "¿Cuánto cuesta usar ConcertRide?",
    a: "Buscar, reservar y publicar es gratis. El conductor fija el precio del asiento para cubrir costes reales del viaje y el pago se hace en persona. No hay comisión de plataforma.",
  },
  {
    q: "¿Es mejor que el taxi o el autobús?",
    a: "Para la vuelta de madrugada y para festivales alejados suele ser más flexible y más barato. El taxi puede ser útil para trayectos muy cortos, pero el carpooling sale mejor cuando tienes que volver con muchas personas a la vez.",
  },
  {
    q: "¿Puedo volver de madrugada?",
    a: "Sí. Esa es una de las ventajas principales: el conductor también va al evento y la vuelta se acuerda antes del viaje, no dependes de horarios cerrados de autobús o del último metro.",
  },
  {
    q: "¿Qué seguridad tengo como pasajero?",
    a: "Los conductores verifican su carnet antes de publicar y puedes revisar su perfil y valoraciones. Además, el pago no se adelanta por la app, sino que se hace al subir al coche.",
  },
  {
    q: "¿Sirve para festivales grandes y pequeños?",
    a: "Sí. Funciona tanto para grandes festivales nacionales como para conciertos concretos en recintos urbanos, porque lo importante es que haya gente con la misma dirección y la misma fecha.",
  },
  {
    q: "¿Puedo publicar si llevo material de camping?",
    a: "Sí, siempre que lo indiques en el anuncio. Para festivales con camping conviene dejar claro cuánto equipaje cabe en el maletero para evitar sorpresas.",
  },
  {
    q: "¿Qué pasa si cancelan?",
    a: "Conviene avisar cuanto antes por chat. Como todo el viaje gira alrededor de un evento, la antelación ayuda mucho a recolocar plazas o buscar otro conductor.",
  },
];

export default function ComoFuncionaCarpoolingPage() {
  useSeoMeta({
    title: "¿Qué es el carpooling para conciertos? · ConcertRide",
    description:
      "Cómo funciona el carpooling en conciertos y festivales: reservar plaza, publicar viajes, pagar sin comisiones y volver de madrugada sin metro.",
    canonical: `${SITE_URL}/como-funciona-carpooling`,
    keywords:
      "qué es el carpooling para conciertos, cómo funciona carpooling festivales, reservar viaje compartido concierto, publicar viaje festival, volver festival madrugada, carpooling sin comisión, concert ride cómo funciona",
    ogType: "article",
    articlePublishedTime: "2026-05-04",
    articleModifiedTime: new Date().toISOString().slice(0, 10),
    articleAuthor: "Equipo ConcertRide",
  });

  const jsonLdBreadcrumb = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
      { "@type": "ListItem", position: 2, name: "Cómo funciona", item: `${SITE_URL}/como-funciona-carpooling` },
    ],
  };

  const jsonLdHowToPassenger = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Cómo encontrar un viaje compartido a un concierto",
    description:
      "Proceso simple para reservar una plaza en ConcertRide y llegar al concierto o festival compartiendo coche.",
    totalTime: "PT5M",
    supply: [{ "@type": "HowToSupply", name: "Cuenta gratuita en ConcertRide" }],
    step: PASSENGER_STEPS.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.title,
      text: step.body,
      url: `${SITE_URL}/como-funciona-carpooling#pasajero-${index + 1}`,
    })),
  };

  const jsonLdHowToDriver = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "Cómo publicar un viaje a un concierto como conductor",
    description:
      "Pasos para crear un viaje compartido, verificar el carnet, aceptar solicitudes y cobrar sin comisiones.",
    totalTime: "PT10M",
    step: DRIVER_STEPS.map((step, index) => ({
      "@type": "HowToStep",
      position: index + 1,
      name: step.title,
      text: step.body,
      url: `${SITE_URL}/como-funciona-carpooling#conductor-${index + 1}`,
    })),
  };

  const jsonLdFaq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: "es-ES",
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: { "@type": "Answer", text: faq.a },
    })),
  };

  const jsonLdWebPage = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${SITE_URL}/como-funciona-carpooling#webpage`,
    url: `${SITE_URL}/como-funciona-carpooling`,
    name: "¿Qué es el carpooling para conciertos? Guía completa",
    description:
      "Guía clara sobre cómo funciona ConcertRide para reservar o publicar viajes compartidos a conciertos y festivales en España.",
    inLanguage: "es-ES",
    isPartOf: { "@id": `${SITE_URL}/#website` },
    about: { "@id": `${SITE_URL}/#service` },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".speakable", ".intro-summary", "article p:first-of-type"],
    },
  };

  return (
    <main id="main" className="min-h-dvh bg-cr-bg text-cr-text pt-14">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdHowToPassenger) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdHowToDriver) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdFaq) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebPage) }} />

      <div className="max-w-4xl mx-auto px-6 py-12 md:py-16 space-y-16">
        <header className="space-y-4 border-b border-cr-border pb-8">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary">Guía</p>
          <h1 className="font-display text-4xl md:text-6xl uppercase leading-[0.92]">
            Cómo funciona el carpooling para festivales y conciertos
          </h1>
          <p className="intro-summary font-sans text-base text-cr-text-muted max-w-3xl leading-relaxed speakable">
            ConcertRide es carpooling pensado para conciertos y festivales: personas que van al mismo evento comparten coche, dividen gastos y coordinan la vuelta de madrugada sin comisiones de plataforma.
          </p>
          <p className="font-sans text-sm text-cr-text-muted max-w-3xl leading-relaxed">
            La clave es sencilla: buscas un viaje, o publicas el tuyo, y todo gira alrededor del mismo concierto. Eso hace que el horario de salida y el regreso tengan sentido para quien realmente va al evento, no para una ruta genérica entre ciudades.
          </p>
        </header>

        <section className="space-y-8">
          <div className="flex items-center gap-3">
            <Users size={22} className="text-cr-primary" aria-hidden="true" />
            <h2 className="font-display text-2xl md:text-3xl uppercase">Cómo funciona</h2>
          </div>
          <div className="grid gap-4">
            {PASSENGER_STEPS.map((step, index) => (
              <article key={step.title} id={`pasajero-${index + 1}`} className="border border-cr-border p-5 space-y-2">
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-cr-primary">Paso {index + 1}</p>
                <h3 className="font-display text-xl uppercase">{step.title}</h3>
                <p className="font-sans text-sm text-cr-text-muted leading-relaxed">{step.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="space-y-8 border-t border-cr-border pt-12">
          <div className="flex items-center gap-3">
            <Car size={22} className="text-cr-secondary" aria-hidden="true" />
            <h2 className="font-display text-2xl md:text-3xl uppercase">Si tienes coche, también puedes publicar</h2>
          </div>
          <div className="grid gap-4">
            {DRIVER_STEPS.map((step, index) => (
              <article key={step.title} id={`conductor-${index + 1}`} className="border border-cr-border p-5 space-y-2">
                <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-cr-secondary">Conductor {index + 1}</p>
                <h3 className="font-display text-xl uppercase">{step.title}</h3>
                <p className="font-sans text-sm text-cr-text-muted leading-relaxed">{step.body}</p>
              </article>
            ))}
          </div>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              to="/concerts"
              className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] border-2 border-cr-primary text-cr-primary px-4 py-2 hover:bg-cr-primary hover:text-black transition-colors"
            >
              Buscar viaje <ArrowRight size={12} />
            </Link>
            <Link
              to="/publish"
              className="inline-flex items-center gap-2 font-sans text-xs font-semibold uppercase tracking-[0.12em] border-2 border-cr-border text-cr-text-muted px-4 py-2 hover:border-cr-primary hover:text-cr-primary transition-colors"
            >
              Publicar viaje <ArrowRight size={12} />
            </Link>
          </div>
        </section>

        <section className="space-y-8 border-t border-cr-border pt-12">
          <div className="flex items-center gap-3">
            <ShieldCheck size={22} className="text-cr-primary" aria-hidden="true" />
            <h2 className="font-display text-2xl md:text-3xl uppercase">Preguntas frecuentes</h2>
          </div>
          <dl className="space-y-5">
            {FAQS.map((faq) => (
              <div key={faq.q} className="border-b border-cr-border pb-5 space-y-2">
                <dt className="font-display text-base uppercase">{faq.q}</dt>
                <dd className="faq-answer font-sans text-sm text-cr-text-muted leading-relaxed">{faq.a}</dd>
              </div>
            ))}
          </dl>
        </section>

        <section className="space-y-4 border-t border-cr-border pt-12">
          <div className="flex items-center gap-3">
            <CreditCard size={22} className="text-cr-primary" aria-hidden="true" />
            <h2 className="font-display text-2xl md:text-3xl uppercase">Lo esencial en una frase</h2>
          </div>
          <p className="font-sans text-sm text-cr-text-muted max-w-3xl leading-relaxed">
            El carpooling para conciertos es una forma de viajar al mismo evento con otras personas, pagar solo lo justo por gasolina y peajes, y volver sin depender de taxis caros ni del último transporte público.
          </p>
        </section>
      </div>

      <TerminologyAside />
    </main>
  );
}
