import { Link } from "react-router-dom";
import { useSeoMeta } from "@/lib/useSeoMeta";

export default function TerminosPage() {
  useSeoMeta({
    title: "Términos y condiciones",
    description: "Términos y condiciones de uso de ConcertRide ES: obligaciones de usuarios, política de cancelación, resolución de disputas y normativa aplicable.",
    canonical: "https://concertride.es/terminos",
  });

  return (
    <main id="main" className="min-h-dvh bg-cr-bg text-cr-text pt-14">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <header className="mb-10 border-b border-cr-border pb-8 space-y-2">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
            Legal
          </p>
          <h1 className="font-display text-4xl uppercase">Términos y condiciones</h1>
          <p className="font-mono text-xs text-cr-text-muted">Última actualización: abril de 2026</p>
        </header>

        <div className="space-y-10 font-sans text-sm text-cr-text leading-relaxed">

          <section className="space-y-3">
            <h2 className="font-display text-xl uppercase text-cr-primary">1. Objeto y aceptación</h2>
            <p>
              Los presentes términos regulan el acceso y uso de la plataforma ConcertRide ES
              (en adelante, "la plataforma") y de sus servicios de intermediación para la
              organización de viajes compartidos a conciertos y eventos musicales en España.
            </p>
            <p>
              El uso de la plataforma implica la aceptación plena de estos términos. Si no estás
              de acuerdo, no uses el servicio.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl uppercase text-cr-primary">2. Descripción del servicio</h2>
            <p>
              ConcertRide ES es una plataforma de intermediación que conecta a conductores
              particulares que ofrecen plazas en su vehículo propio con pasajeros que desean
              llegar al mismo concierto.
            </p>
            <p>
              <strong>La plataforma no es una empresa de transporte ni actúa como transportista.</strong>{" "}
              No somos parte del contrato de viaje entre conductor y pasajero, ni intervenimos
              en el pago entre ellos. No cobramos comisión ni intermediamos en transacciones
              económicas.
            </p>
            <p>
              La información sobre conciertos procede de datos curados manualmente (con enlace a la
              web oficial del festival u organizador) y de la Ticketmaster Discovery API v2. Toda
              ella puede estar sujeta a cambios, aplazamientos o cancelaciones fuera de nuestro
              control; la compra de entradas se realiza siempre en las webs oficiales enlazadas.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl uppercase text-cr-primary">3. Requisitos para usar la plataforma</h2>
            <ul className="space-y-2 pl-4 list-disc text-cr-text-muted">
              <li>Ser persona física mayor de 18 años.</li>
              <li>Disponer de una dirección de correo electrónico válida.</li>
              <li>
                Si publicas viajes como conductor: poseer carnet de conducir vigente, seguro del
                vehículo en vigor y el vehículo en condiciones legales de circulación.
              </li>
              <li>Proporcionar información veraz y actualizada en tu perfil.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl uppercase text-cr-primary">4. Obligaciones del conductor</h2>
            <ul className="space-y-2 pl-4 list-disc text-cr-text-muted">
              <li>Publicar únicamente viajes que tengas intención real de realizar.</li>
              <li>Cumplir los límites de velocidad y la normativa de tráfico vigente.</li>
              <li>No ofrecer más plazas de las que el vehículo tiene homologadas.</li>
              <li>
                No cobrar a los pasajeros más de lo que corresponde al reparto proporcional de los
                gastos del viaje. Los únicos conceptos recuperables son: combustible, peajes y un
                componente razonable de desgaste del vehículo. La plataforma está diseñada para la
                compartición de costes, no para la obtención de lucro. Cualquier importe que supere
                los gastos reales constituye transporte retribuido no autorizado y queda
                expresamente prohibido (Ley 16/1987, LOTT).
              </li>
              <li>Confirmar o rechazar las solicitudes de plaza en un plazo razonable.</li>
              <li>Notificar con antelación cualquier cancelación del viaje.</li>
              <li>
                Disponer de un seguro de vehículo en vigor que cubra el uso del vehículo durante el
                viaje. Los pasajeros viajan bajo la cobertura de la póliza del conductor; ConcertRide
                no proporciona ninguna cobertura adicional.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl uppercase text-cr-primary">5. Obligaciones del pasajero</h2>
            <ul className="space-y-2 pl-4 list-disc text-cr-text-muted">
              <li>Estar en el punto de recogida acordado a la hora pactada.</li>
              <li>Respetar las condiciones del viaje publicadas por el conductor (fumar, equipaje, etc.).</li>
              <li>Abonar al conductor la contribución a gastos acordada.</li>
              <li>Notificar con antelación si no vas a poder realizar el viaje.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl uppercase text-cr-primary">6. Conductas prohibidas</h2>
            <p>Queda expresamente prohibido:</p>
            <ul className="space-y-1 pl-4 list-disc text-cr-text-muted">
              <li>Publicar viajes falsos o sin intención real de realizarlos.</li>
              <li>Usar la plataforma con fines comerciales o de transporte profesional.</li>
              <li>Acosar, amenazar o discriminar a otros usuarios.</li>
              <li>Publicar información falsa en el perfil (carnet, vehículo, valoraciones).</li>
              <li>Intentar acceder a las cuentas de otros usuarios o a sistemas de la plataforma.</li>
              <li>Usar scripts, bots o medios automatizados para interactuar con la plataforma.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl uppercase text-cr-primary">7. Valoraciones y reseñas</h2>
            <p>
              El sistema de valoraciones tiene como objetivo fomentar la confianza entre usuarios.
              Las valoraciones deben ser honestas y basarse en experiencias reales del viaje.
            </p>
            <p>Queda prohibido:</p>
            <ul className="space-y-1 pl-4 list-disc text-cr-text-muted">
              <li>Publicar reseñas falsas o sobre viajes no realizados.</li>
              <li>Incluir insultos, amenazas o contenido discriminatorio.</li>
              <li>Manipular la valoración de otro usuario con cuentas falsas o múltiples.</li>
            </ul>
            <p>
              ConcertRide ES se reserva el derecho a eliminar valoraciones que incumplan esta
              política, así como a suspender las cuentas involucradas. Las decisiones de eliminación
              pueden apelarse escribiendo a{" "}
              <a
                href="mailto:alejandrolalaguna@gmail.com"
                className="font-mono text-cr-primary underline underline-offset-2"
              >
                alejandrolalaguna@gmail.com
              </a>
              .
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl uppercase text-cr-primary">8. Limitación de responsabilidad y seguros</h2>
            <p>
              ConcertRide ES actúa únicamente como intermediario y no asume responsabilidad por:
            </p>
            <ul className="space-y-1 pl-4 list-disc text-cr-text-muted">
              <li>Accidentes, daños personales o materiales ocurridos durante el viaje.</li>
              <li>Incumplimientos entre conductor y pasajero.</li>
              <li>Cancelaciones de conciertos o cambios en la información de los eventos.</li>
              <li>Daños derivados del uso de la plataforma o de la imposibilidad de acceder a ella.</li>
              <li>Exactitud de la información de perfil aportada por otros usuarios.</li>
            </ul>
            <p>
              <strong>Seguros:</strong> ConcertRide ES no proporciona ningún seguro de accidentes
              ni de responsabilidad civil para los viajes acordados entre usuarios. Los pasajeros
              viajan exclusivamente bajo la cobertura de la póliza de seguro del conductor. Se
              recomienda a los pasajeros verificar con el conductor que su póliza cubre el
              transporte de personas en régimen de compartición de costes, antes de realizar el
              viaje.
            </p>
            <p>
              La responsabilidad de ConcertRide ES, en los casos en que sea aplicable, se
              limitará al máximo permitido por la legislación española de consumo.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl uppercase text-cr-primary">9. Propiedad intelectual</h2>
            <p>
              El código, diseño, marca y contenidos originales de ConcertRide ES son propiedad
              del titular o están debidamente licenciados. Los usuarios conservan la propiedad
              de los contenidos que publican (textos, imágenes de perfil) y otorgan a la
              plataforma una licencia no exclusiva para mostrarlos dentro del servicio.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl uppercase text-cr-primary">10. Suspensión y baja de cuenta</h2>
            <p>
              ConcertRide ES puede suspender o eliminar cuentas que incumplan estos términos, previa
              notificación salvo en casos de conducta gravemente perjudicial para otros usuarios.
            </p>
            <p>
              Los usuarios pueden solicitar la baja de su cuenta en cualquier momento desde{" "}
              <em>Mi perfil → Zona peligro → Eliminar cuenta</em>. La baja es inmediata: se anonimiza
              el perfil, se cancelan los viajes activos que publicaste como conductor y las
              solicitudes pendientes, y se eliminan las suscripciones a notificaciones y los
              favoritos. Las reseñas se conservan de forma anónima para mantener la integridad del
              sistema de confianza.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl uppercase text-cr-primary">11. Modificaciones</h2>
            <p>
              Podemos modificar estos términos para adaptarlos a cambios normativos, del servicio
              o del mercado. Los cambios sustanciales se notificarán con al menos 15 días de
              antelación. El uso continuado de la plataforma tras el aviso implica aceptación de
              los nuevos términos.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl uppercase text-cr-primary">12. Resolución de litigios en línea (ODR)</h2>
            <p>
              Conforme al Reglamento (UE) n.º 524/2013 sobre resolución de litigios en línea en
              materia de consumo, los usuarios residentes en la Unión Europea pueden acudir a la
              plataforma de resolución de litigios en línea de la Comisión Europea:{" "}
              <a
                href="https://ec.europa.eu/consumers/odr"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cr-primary underline underline-offset-2"
              >
                https://ec.europa.eu/consumers/odr
              </a>
              .
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl uppercase text-cr-primary">13. Legislación y fuero</h2>
            <p>
              Estos términos se rigen por la legislación española. Para la resolución de cualquier
              controversia derivada del uso de la plataforma, serán competentes los juzgados y
              tribunales del domicilio del usuario, de conformidad con lo establecido en el Real
              Decreto Legislativo 1/2007 (TRLGDCU) en materia de protección de consumidores.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl uppercase text-cr-primary">14. Contacto</h2>
            <p>
              Para cualquier consulta sobre estos términos:{" "}
              <a
                href="mailto:alejandrolalaguna@gmail.com"
                className="font-mono text-cr-primary underline underline-offset-2"
              >
                alejandrolalaguna@gmail.com
              </a>
            </p>
          </section>

        </div>

        <div className="mt-12 pt-8 border-t border-cr-border flex flex-wrap gap-4">
          <Link to="/aviso-legal" className="font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors">
            Aviso legal →
          </Link>
          <Link to="/privacidad" className="font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors">
            Política de privacidad →
          </Link>
          <Link to="/cookies" className="font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors">
            Política de cookies →
          </Link>
          <Link to="/" className="font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors ml-auto">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}
