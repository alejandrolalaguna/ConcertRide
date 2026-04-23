import { Link } from "react-router-dom";
import { useSeoMeta } from "@/lib/useSeoMeta";

export default function AvisoLegalPage() {
  useSeoMeta({
    title: "Aviso legal",
    description: "Aviso legal de ConcertRide ES: datos del titular, actividad, propiedad intelectual y condiciones de uso de la plataforma de carpooling para conciertos en España.",
    canonical: "https://concertride.es/aviso-legal",
  });

  return (
    <main id="main" className="min-h-dvh bg-cr-bg text-cr-text pt-14">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <header className="mb-10 border-b border-cr-border pb-8 space-y-2">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
            Legal
          </p>
          <h1 className="font-display text-4xl uppercase">Aviso legal</h1>
          <p className="font-mono text-xs text-cr-text-muted">Última actualización: abril de 2026</p>
        </header>

        <div className="space-y-10 font-sans text-sm text-cr-text leading-relaxed">

          <section className="space-y-3">
            <h2 className="font-display text-xl uppercase text-cr-primary">1. Objeto y actividad</h2>
            <p>
              ConcertRide ES es una plataforma digital de intermediación que facilita la puesta en
              contacto entre personas que desean compartir vehículo particular para desplazarse a
              conciertos y otros eventos musicales celebrados en territorio español.
            </p>
            <p>
              La plataforma no presta servicios de transporte ni actúa como transportista. Los
              conductores que publican viajes son particulares que ofrecen plazas en su vehículo
              propio. ConcertRide ES no es parte en los acuerdos de viaje entre usuarios.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl uppercase text-cr-primary">2. Propiedad intelectual e industrial</h2>
            <p>
              El nombre, logotipo, diseño, código fuente y demás elementos distintivos de ConcertRide
              ES son titularidad exclusiva del responsable del sitio o están debidamente licenciados.
              Queda prohibida su reproducción, distribución o uso sin autorización expresa.
            </p>
            <p>
              La información sobre conciertos y festivales procede de dos fuentes:
            </p>
            <ul className="space-y-1 pl-4 list-disc text-cr-text-muted">
              <li>
                Datos curados manualmente (nombre del evento, fecha aproximada, recinto y{" "}
                <strong className="text-cr-text">enlace a la web oficial</strong> del festival u organizador).
                Estos datos son factuales y públicos, y cada ficha enlaza al origen oficial para la compra
                de entradas. No reproducimos carteles, logos, ni contenido promocional con derechos de terceros.
              </li>
              <li>
                Datos obtenidos mediante la{" "}
                <a
                  href="https://developer.ticketmaster.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cr-primary underline underline-offset-2"
                >
                  Ticketmaster Discovery API v2
                </a>
                , utilizada de conformidad con sus términos de uso para desarrolladores. Cuando procede,
                la ficha del concierto incluye el enlace oficial a Ticketmaster para la compra.
              </li>
            </ul>
            <p>
              Los mapas se muestran con datos de{" "}
              <a
                href="https://www.openstreetmap.org/copyright"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cr-primary underline underline-offset-2"
              >
                OpenStreetMap contributors
              </a>{" "}
              (licencia ODbL) y tiles proporcionados por{" "}
              <a
                href="https://carto.com/attributions"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cr-primary underline underline-offset-2"
              >
                CARTO
              </a>
              .
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl uppercase text-cr-primary">3. Exclusión de responsabilidad</h2>
            <p>
              ConcertRide ES no garantiza la exactitud, integridad o actualidad de la información
              sobre conciertos procedente de terceros. El titular no se responsabiliza de los daños
              derivados del uso de la plataforma, de la información publicada por los usuarios ni
              del resultado de los viajes acordados entre particulares.
            </p>
            <p>
              El titular se reserva el derecho a modificar, suspender o interrumpir el servicio en
              cualquier momento sin previo aviso.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl uppercase text-cr-primary">4. Legislación aplicable y jurisdicción</h2>
            <p>
              Las presentes condiciones se rigen por la legislación española. Para la resolución de
              cualquier controversia derivada del uso de este sitio web, las partes se someten a los
              juzgados y tribunales del domicilio del titular, salvo que la normativa de consumo
              aplicable disponga otro fuero.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl uppercase text-cr-primary">5. Contacto</h2>
            <p>
              Para cualquier consulta relacionada con este aviso legal, puede contactar con nosotros
              en:{" "}
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
          <Link to="/privacidad" className="font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors">
            Política de privacidad →
          </Link>
          <Link to="/cookies" className="font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors">
            Política de cookies →
          </Link>
          <Link to="/terminos" className="font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors">
            Términos y condiciones →
          </Link>
          <Link to="/" className="font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors ml-auto">
            ← Volver al inicio
          </Link>
        </div>
      </div>
    </main>
  );
}
