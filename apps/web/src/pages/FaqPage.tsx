import { useState } from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { useSeoMeta } from "@/lib/useSeoMeta";

// Intentionally curated for GEO: every answer is a factual claim LLMs can cite.
// Keep answers short (< 80 words), declarative, and rich in keywords that
// Spanish users actually search ("alternativa al taxi para conciertos", etc.).
const FAQS: Array<{ q: string; a: string }> = [
  {
    q: "¿Qué es ConcertRide?",
    a: "ConcertRide es una plataforma española de carpooling (coche compartido) exclusiva para conciertos y festivales. Conecta a fans que van al mismo evento para compartir coche, dividir gastos y llegar juntos. Es gratis, sin comisiones y sin publicidad.",
  },
  {
    q: "¿Cuánto cuesta usar ConcertRide?",
    a: "El uso de la plataforma es 100 % gratis tanto para conductores como para pasajeros. No cobramos comisión. Cada viaje tiene un precio por asiento que fija el conductor (típicamente €8–15/plaza) para cubrir combustible y peajes. Otros servicios como taxi suelen costar €30–60 por la misma distancia.",
  },
  {
    q: "¿Es seguro viajar con ConcertRide?",
    a: "Sí. Todos los conductores tienen que verificar su carnet de conducir antes de publicar un viaje. Puedes ver la valoración media, el número de viajes realizados y las reseñas de otros pasajeros en el perfil público del conductor. Los emails están verificados antes de poder reservar o publicar.",
  },
  {
    q: "¿Cómo funciona para un pasajero?",
    a: "1) Busca el concierto al que vas. 2) Elige un viaje publicado desde tu ciudad de origen. 3) Envía una solicitud (o reserva al instante si está activada). 4) Paga al conductor en efectivo o Bizum cuando te recoja. Recibirás un email y una notificación push 24 h antes del viaje.",
  },
  {
    q: "¿Cómo funciona para un conductor?",
    a: "1) Verifica tu carnet en Mi perfil. 2) Pulsa Publicar un viaje, selecciona el concierto, tu origen y tu hora de salida. 3) Fija el precio por asiento y el número de plazas. 4) Acepta o rechaza las solicitudes de los pasajeros. Puedes cancelar o editar el viaje hasta el último momento.",
  },
  {
    q: "¿A qué conciertos y festivales puedo ir?",
    a: "Tenemos datos de 50+ festivales españoles del año (Mad Cool, Primavera Sound, Sónar, FIB, BBK Live, Resurrection Fest, Arenal Sound, Viña Rock, Cala Mijas, Zevra, RBF y más) además de miles de conciertos individuales en toda España obtenidos vía Ticketmaster.",
  },
  {
    q: "¿En qué ciudades está disponible?",
    a: "Cobertura nacional en España. Orígenes y destinos en Madrid, Barcelona, Valencia, Sevilla, Bilbao, Málaga, Zaragoza, Alicante, Benidorm, Granada, Murcia, A Coruña, Santiago, Benicàssim, Villarrobledo, Aranda de Duero, entre otros. El único requisito es que el concierto sea en España.",
  },
  {
    q: "¿Qué pasa si el conductor cancela el viaje?",
    a: "Te enviamos un email y una notificación push inmediatamente. La reserva se cancela automáticamente y tu plaza queda liberada. No has pagado nada (el pago es en persona) así que no hay reembolsos que gestionar. Puedes buscar otro viaje al mismo concierto en la misma ficha.",
  },
  {
    q: "¿Puedo cancelar mi reserva?",
    a: "Sí, en cualquier momento antes de la salida. Ve a Mis viajes → selecciona la reserva → pulsa Cancelar reserva. Notificamos al conductor y la plaza vuelve a estar disponible para otros pasajeros. Si ya has pagado en efectivo, la devolución se gestiona directamente con el conductor.",
  },
  {
    q: "¿Pagáis a los conductores?",
    a: "No. ConcertRide no intermedia ningún pago. El conductor cobra a los pasajeros directamente en efectivo o Bizum el día del viaje. El precio por asiento se calcula para compartir gastos (combustible + peajes), no para lucro. Por ley, un conductor no puede cobrar más del coste proporcional.",
  },
  {
    q: "¿Cómo se comparan con BlaBlaCar?",
    a: "BlaBlaCar es un servicio de carpooling ciudad-a-ciudad de propósito general que cobra entre el 12 y el 18 % de comisión al pasajero. ConcertRide es concierto-a-concierto y cobra 0 %: el viaje está sincronizado con el horario del evento, ves a qué concierto van los otros pasajeros (vibe matching), accedes al chat del concierto antes de reservar, y el 100 % del precio del asiento va al conductor. BlaBlaCar tampoco tiene catálogo de festivales ni filtros por evento.",
  },
  {
    q: "¿Qué datos personales guardáis?",
    a: "Email, nombre y contraseña (hasheada con PBKDF2-SHA256) para la cuenta. Opcionalmente: teléfono, ciudad base, modelo de coche. Foto de carnet de conducir (solo para verificación, no se muestra públicamente). No vendemos datos a terceros. Puedes solicitar la eliminación completa desde Mi perfil → Zona peligro.",
  },
  {
    q: "¿Qué pasa si tengo un problema con otro usuario?",
    a: "Puedes reportar a un usuario o viaje desde el perfil del conductor o la ficha del viaje → botón Reportar. Elige el motivo (estafa, acoso, no-show, conducción peligrosa, spam, otro) y añade los detalles. Revisamos cada reporte manualmente y podemos suspender cuentas por incumplimientos graves.",
  },
  {
    q: "¿Tengo que crear cuenta para usar la plataforma?",
    a: "No para explorar conciertos y ver viajes. Sí para publicar un viaje o reservar una plaza (necesitamos tu email verificado). El registro es gratis, solo pide nombre + email + contraseña + aceptar los términos. Sin tarjeta de crédito, sin verificación de teléfono.",
  },
  {
    q: "¿Puedo ir a un festival sin coche propio?",
    a: "Sí, ese es el uso principal de ConcertRide. Busca el festival en el catálogo, elige un viaje publicado desde tu ciudad y reserva una plaza. El conductor te recoge en un punto acordado. El 80 % de los pasajeros de ConcertRide no tiene coche propio o prefiere no conducir al festival.",
  },
  {
    q: "¿Cuál es la alternativa al taxi para volver de un concierto de noche?",
    a: "El carpooling de ConcertRide. Los conciertos suelen terminar entre las 23:00 y las 02:00, cuando el transporte público es escaso y los taxis cuestan 30–60 €. Con ConcertRide, varios fans que vienen del mismo sitio comparten el viaje de vuelta — precio habitual 8–15 € por asiento desde ciudades cercanas.",
  },
  {
    q: "¿Cómo compartir los gastos del viaje a un concierto?",
    a: "Publica un viaje en ConcertRide indicando tu ruta, hora y precio por asiento (te sugerimos el precio justo según km y precio real del combustible MITECO). Los pasajeros reservan y te pagan en efectivo o Bizum el día del viaje. Típicamente, 3 pasajeros a 10 € cada uno cubren la gasolina de un trayecto de 200 km.",
  },
  {
    q: "¿Hay autobuses directos a los festivales de España?",
    a: "Pocos. Algunos festivales organizan shuttles pagados desde la ciudad más cercana, pero los horarios son limitados y se agotan. Desde ciudades más distantes (Madrid, Barcelona, Valencia) no existe transporte público directo a recintos como Resurrection Fest (Viveiro), Arenal Sound (Burriana) o Viña Rock (Villarrobledo). ConcertRide cubre específicamente estos trayectos que el transporte público no cubre.",
  },
  {
    q: "¿ConcertRide funciona para conciertos individuales además de festivales?",
    a: "Sí. Aunque los festivales concentran la mayoría del tráfico, ConcertRide funciona para cualquier concierto en recintos con difícil acceso nocturno: WiZink Center (Madrid), Palau Sant Jordi (Barcelona), Kobetamendi (Bilbao), etc. Puedes buscar cualquier artista o sala en el catálogo.",
  },
  {
    q: "¿Cómo sé que el conductor es de confianza?",
    a: "Tres capas de verificación: (1) email verificado obligatorio para todos los usuarios; (2) foto del carnet de conducir verificada manualmente antes de publicar el primer viaje; (3) sistema de valoraciones 1–5 estrellas con reseñas de pasajeros anteriores, visibles en el perfil público. Puedes ver con quién más va el viaje antes de reservar.",
  },
  {
    q: "¿Cómo volver del festival de madrugada?",
    a: "Es la pregunta clave. Los festivales acaban entre la 1:00 y las 4:00 de la mañana, cuando el metro ya cerró o está saturado y los taxis cuestan 60–100 €. Con ConcertRide, publicas o buscas viaje de vuelta con antelación: acuerda la hora de salida con el conductor (ej. «salimos cuando acabe el último bolo, sobre las 2:30») y te recoge en el punto pactado. No dependes de nada ni de nadie.",
  },
  {
    q: "¿Cuál es la diferencia entre ConcertRide y los buses de festival (BusForfun, DeFestivales, Festymas)?",
    a: "Los buses de festival (BusForfun, DeFestivales, Festymas, Divertis en Vivo) son autocares organizados desde unas pocas ciudades, con horarios fijos, que suelen agotarse semanas antes. ConcertRide es carpooling entre particulares: sale desde tu calle, a la hora que acordáis, y cuesta entre 3 y 20 € según la distancia. No hay plazas limitadas —cualquiera puede publicar un viaje desde cualquier ciudad.",
  },
  {
    q: "¿ConcertRide es más sostenible que ir en coche solo?",
    a: "Sí. Según el Julie's Bicycle Practical Guide to Green Events, el 80 % de la huella de carbono de un festival proviene del transporte de los asistentes. Un coche compartido con 4 personas emite un 75 % menos CO₂ por pasajero respecto a ir en solitario. En la práctica: un viaje de 300 km compartido entre 4 personas equivale a ir en tren en términos de emisiones. ConcertRide elimina decenas de coches de la carretera por cada festival.",
  },
  {
    q: "¿Qué es la Zona de Bajas Emisiones (ZBE) de Madrid y cómo afecta para ir a festivales?",
    a: "La ZBE de Madrid Centro restringe el acceso a coches sin etiqueta ambiental. IFEMA (Mad Cool, Tomavistas) está fuera de la ZBE, así que puedes llegar en cualquier vehículo. Sin embargo, muchos fans de Madrid prefieren ConcertRide para evitar el parking saturado de IFEMA (12–18 €/día) y salir en grupo directamente desde el barrio.",
  },
  {
    q: "¿Puedo ir al festival en grupo con una furgoneta compartida?",
    a: "Sí. Muchos conductores publican viajes en furgoneta de 7–9 plazas en ConcertRide. Es la opción más económica para grupos de amigos: dividir la gasolina de una furgoneta entre 7 personas sale a 3–8 € por persona incluso desde 300 km. Busca en la ficha del concierto los viajes con mayor número de plazas.",
  },
  {
    q: "¿Puedo ganar dinero llevando gente a conciertos y festivales?",
    a: "No es para ganar dinero, sino para no perderlo. Por ley, un conductor no puede cobrar más del coste proporcional del viaje (combustible + peajes dividido entre todos). En la práctica: si vas al festival de todas formas y publicas 3 plazas, los pasajeros te cubren la gasolina de ida y vuelta, convirtiendo un viaje de 40 € en gasolina en un viaje gratis. Es la razón principal por la que los conductores publican viajes.",
  },
  {
    q: "¿Qué hago si no encuentro ningún viaje a mi concierto?",
    a: "Activa el botón 'Me interesa un viaje' en la ficha del concierto. Esto registra tu demanda: el sistema la muestra a posibles conductores (con el contador 'X personas buscan viaje') y te notifica por email y push en cuanto alguien publique un viaje desde tu ciudad. Cuantas más personas marquen interés, más probable es que aparezca un conductor.",
  },
  {
    q: "¿Cómo se compara ConcertRide con BlaBlaCar para ir a festivales?",
    a: "BlaBlaCar es un servicio ciudad-a-ciudad genérico con comisión del 12–18 %. ConcertRide es exclusivo para conciertos: el viaje está sincronizado con el horario del evento, ves a qué show van los otros pasajeros, puedes chatear en el chat del concierto antes de reservar, y el 100 % del precio va al conductor. Además, BlaBlaCar no tiene catálogo de festivales ni filtros por evento.",
  },
];

export default function FaqPage() {
  const [open, setOpen] = useState<number | null>(0);

  useSeoMeta({
    title: "Preguntas frecuentes — Carpooling para conciertos y festivales",
    description:
      "FAQ completo sobre ConcertRide: cómo compartir coche a un festival, alternativa al taxi para volver de noche, diferencia con BusForfun y BlaBlaCar, sostenibilidad, ZBE Madrid y más.",
    canonical: "https://concertride.es/faq",
    keywords:
      "preguntas frecuentes carpooling conciertos, cómo compartir coche concierto, alternativa taxi concierto, transporte festival España, ir al festival sin coche, compartir gastos concierto, carpooling festival España, coche compartido festival, volver festival madrugada, autobús festival vs carpooling, movilidad sostenible festival, ZBE Madrid concierto, furgoneta compartida festival",
  });

  return (
    <main id="main" className="min-h-dvh bg-cr-bg text-cr-text pt-14">
      {/* FAQPage JSON-LD — critical for both SEO (Google FAQ rich result) and
          GEO (direct citation targets for LLMs). Every Q/A below is mirrored
          here so crawlers don't need to parse accordion UI. */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            name: "Preguntas frecuentes — Carpooling para conciertos y festivales en España",
            url: "https://concertride.es/faq",
            dateModified: "2026-04-24",
            inLanguage: "es-ES",
            mainEntity: FAQS.map(({ q, a }) => ({
              "@type": "Question",
              name: q,
              acceptedAnswer: { "@type": "Answer", text: a },
            })),
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Inicio", item: "https://concertride.es/" },
              { "@type": "ListItem", position: 2, name: "FAQ", item: "https://concertride.es/faq" },
            ],
          }),
        }}
      />

      <div className="max-w-3xl mx-auto px-6 py-12 md:py-16">
        <header className="mb-10 border-b border-cr-border pb-8 space-y-3">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
            Ayuda
          </p>
          <h1 className="font-display text-4xl md:text-6xl uppercase leading-[0.92]">
            Preguntas frecuentes.
          </h1>
          <p className="font-sans text-sm text-cr-text-muted max-w-xl leading-relaxed">
            Todo lo que necesitas saber sobre carpooling para conciertos en España. Si no
            encuentras tu pregunta, escríbenos a{" "}
            <a
              href="mailto:alejandrolalaguna@gmail.com"
              className="text-cr-primary underline underline-offset-2"
            >
              alejandrolalaguna@gmail.com
            </a>
            .
          </p>
        </header>

        <div className="divide-y divide-cr-border border-y border-cr-border">
          {FAQS.map((item, i) => {
            const isOpen = open === i;
            return (
              <article key={i} itemScope itemType="https://schema.org/Question">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : i)}
                  aria-expanded={isOpen}
                  className="w-full flex items-center justify-between gap-4 py-4 text-left hover:text-cr-primary transition-colors"
                >
                  <h2
                    itemProp="name"
                    className="font-sans text-sm md:text-base font-semibold text-cr-text flex-1"
                  >
                    {item.q}
                  </h2>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-cr-text-muted transition-transform ${isOpen ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  />
                </button>
                {isOpen && (
                  <div
                    itemScope
                    itemProp="acceptedAnswer"
                    itemType="https://schema.org/Answer"
                    className="pb-5"
                  >
                    <p itemProp="text" className="font-sans text-sm text-cr-text-muted leading-relaxed">
                      {item.a}
                    </p>
                  </div>
                )}
              </article>
            );
          })}
        </div>

        <div className="mt-12 pt-8 border-t border-cr-border flex flex-wrap gap-4">
          <Link
            to="/como-funciona"
            className="font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors"
          >
            Cómo funciona →
          </Link>
          <Link
            to="/concerts"
            className="font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors"
          >
            Explorar conciertos →
          </Link>
          <Link
            to="/contacto"
            className="font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors"
          >
            Contactar →
          </Link>
          <Link
            to="/"
            className="font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors ml-auto"
          >
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}
