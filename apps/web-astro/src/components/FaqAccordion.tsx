import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS: Array<{ q: string; a: string }> = [
  { q: "¿Qué es ConcertRide?", a: "ConcertRide es una plataforma española de carpooling exclusiva para conciertos y festivales. Conecta a fans que van al mismo evento para compartir coche, dividir gastos y llegar juntos. Es gratis, sin comisiones y sin publicidad." },
  { q: "¿Cuánto cuesta usar ConcertRide?", a: "El uso de la plataforma es 100 % gratis tanto para conductores como para pasajeros. No cobramos comisión. Cada viaje tiene un precio por asiento que fija el conductor (típicamente €8–15/plaza) para cubrir combustible y peajes. Otros servicios como taxi suelen costar €30–60 por la misma distancia." },
  { q: "¿Es seguro viajar con ConcertRide?", a: "Sí. Todos los conductores verifican su carnet de conducir antes de publicar un viaje. Puedes ver la valoración media, el número de viajes realizados y las reseñas de otros pasajeros en el perfil público del conductor." },
  { q: "¿Cómo funciona para un pasajero?", a: "1) Busca el concierto al que vas. 2) Elige un viaje publicado desde tu ciudad. 3) Envía una solicitud o reserva al instante. 4) Paga al conductor en efectivo o Bizum cuando te recoja." },
  { q: "¿Cómo funciona para un conductor?", a: "1) Verifica tu carnet en Mi perfil. 2) Pulsa Publicar un viaje, selecciona el concierto, tu origen y hora de salida. 3) Fija el precio por asiento y el número de plazas. 4) Acepta o rechaza las solicitudes." },
  { q: "¿A qué conciertos y festivales puedo ir?", a: "Tenemos datos de 50+ festivales españoles: Mad Cool, Primavera Sound, Sónar, FIB, BBK Live, Resurrection Fest, Arenal Sound, Viña Rock, Cala Mijas, Zevra y más, además de miles de conciertos individuales vía Ticketmaster." },
  { q: "¿En qué ciudades está disponible?", a: "Cobertura nacional en España. Madrid, Barcelona, Valencia, Sevilla, Bilbao, Málaga, Zaragoza, Alicante, Benidorm, Granada, Murcia, A Coruña, Santiago, Benicàssim, Villarrobledo, Aranda de Duero, entre otros." },
  { q: "¿Qué pasa si el conductor cancela el viaje?", a: "Te enviamos un email y una notificación push inmediatamente. La reserva se cancela automáticamente y tu plaza queda liberada. No has pagado nada (el pago es en persona) así que no hay reembolsos que gestionar." },
  { q: "¿Puedo cancelar mi reserva?", a: "Sí, en cualquier momento antes de la salida. Ve a Mis viajes → selecciona la reserva → pulsa Cancelar reserva. Notificamos al conductor y la plaza vuelve a estar disponible." },
  { q: "¿Pagáis a los conductores?", a: "No. ConcertRide no intermedia ningún pago. El conductor cobra a los pasajeros directamente en efectivo o Bizum el día del viaje. El precio cubre gastos compartidos, no lucro." },
  { q: "¿Qué ventajas tiene ConcertRide frente a otras opciones?", a: "ConcertRide es la única plataforma diseñada exclusivamente para conciertos y festivales, con el viaje sincronizado al evento, vibe matching, chat del concierto y sin comisión de ningún tipo." },
  { q: "¿Qué datos personales guardáis?", a: "Email, nombre y contraseña (hasheada con PBKDF2-SHA256). Opcionalmente: teléfono, ciudad base, modelo de coche. Foto de carnet solo para verificación. No vendemos datos a terceros. Puedes eliminar tu cuenta desde Mi perfil." },
  { q: "¿Qué pasa si tengo un problema con otro usuario?", a: "Reporta desde el perfil del conductor o la ficha del viaje → botón Reportar. Revisamos cada reporte manualmente y podemos suspender cuentas por incumplimientos graves." },
  { q: "¿Tengo que crear cuenta para usar la plataforma?", a: "No para explorar conciertos y ver viajes. Sí para publicar o reservar. El registro es gratis: solo nombre + email + contraseña. Sin tarjeta de crédito." },
  { q: "¿Puedo ir a un festival sin coche propio?", a: "Sí, ese es el uso principal. Busca el festival, elige un viaje publicado desde tu ciudad y reserva una plaza. El conductor te recoge en el punto acordado." },
  { q: "¿Cuál es la alternativa al taxi para volver de noche?", a: "El carpooling de ConcertRide. Los conciertos terminan entre 23:00–02:00, cuando los taxis cuestan 30–60 €. Con ConcertRide, varios fans comparten el viaje de vuelta — precio habitual 8–15 €/asiento." },
  { q: "¿Cómo compartir los gastos del viaje a un concierto?", a: "Publica un viaje indicando ruta, hora y precio por asiento. Los pasajeros te pagan en efectivo o Bizum. 3 pasajeros a 10 € cada uno cubren la gasolina de un trayecto de 200 km." },
  { q: "¿Hay autobuses directos a los festivales?", a: "Pocos y muy limitados. Desde ciudades distantes no existe transporte público directo a Resurrection Fest (Viveiro), Arenal Sound (Burriana) o Viña Rock (Villarrobledo). ConcertRide cubre específicamente estos trayectos." },
  { q: "¿ConcertRide funciona para conciertos individuales?", a: "Sí. Funciona para cualquier concierto en recintos con difícil acceso nocturno: WiZink Center, Palau Sant Jordi, Kobetamendi, etc." },
  { q: "¿Cómo sé que el conductor es de confianza?", a: "Tres capas: (1) email verificado obligatorio; (2) carnet de conducir verificado manualmente; (3) valoraciones 1–5 estrellas con reseñas públicas de pasajeros anteriores." },
  { q: "¿Cómo volver del festival de madrugada?", a: "Publica o busca viaje de vuelta con antelación. Acuerda la hora de salida con el conductor y te recoge en el punto pactado — sin depender de metro ni taxis." },
  { q: "¿ConcertRide es más sostenible que ir solo en coche?", a: "Sí. Un coche compartido con 4 personas emite un 75 % menos CO₂ por pasajero. El transporte supone el 80 % de la huella de un festival (Julie's Bicycle)." },
  { q: "¿Qué es la ZBE de Madrid y cómo afecta?", a: "La ZBE restringe el acceso a coches sin etiqueta. IFEMA (Mad Cool, Tomavistas) está fuera de la ZBE. Sin embargo, muchos fans prefieren ConcertRide para evitar el parking saturado de IFEMA (12–18 €/día)." },
  { q: "¿Puedo ir al festival en furgoneta compartida?", a: "Sí. Muchos conductores publican viajes en furgoneta de 7–9 plazas. Dividir la gasolina entre 7 personas sale a 3–8 € por persona incluso desde 300 km." },
  { q: "¿Qué hago si no encuentro ningún viaje?", a: "Activa 'Me interesa un viaje' en la ficha del concierto. Registra tu demanda y notifica a posibles conductores. Recibirás un email y push en cuanto alguien publique." },
];

export default function FaqAccordion() {
  const [open, setOpen] = useState<number | null>(0);

  return (
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
              <h2 itemProp="name" className="font-sans text-sm md:text-base font-semibold text-cr-text flex-1">{item.q}</h2>
              <ChevronDown size={18} className={`shrink-0 text-cr-text-muted transition-transform ${isOpen ? "rotate-180" : ""}`} aria-hidden="true" />
            </button>
            {isOpen && (
              <div itemScope itemProp="acceptedAnswer" itemType="https://schema.org/Answer" className="pb-5">
                <p itemProp="text" className="font-sans text-sm text-cr-text-muted leading-relaxed">{item.a}</p>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
