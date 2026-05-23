import { Link } from "react-router-dom";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";

export default function AvisoLegalPage() {
  useSeoMeta({
    title: "Aviso legal · Condiciones de uso | ConcertRide",
    description: "Aviso legal de ConcertRide: datos del titular, actividad, propiedad intelectual y condiciones de uso de la plataforma de carpooling para conciertos en España.",
    canonical: `${SITE_URL}/aviso-legal`,
  });

  return (
    <main id="main" className="min-h-dvh bg-cr-bg text-cr-text pt-14">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Inicio", item: `${SITE_URL}/` },
              { "@type": "ListItem", position: 2, name: "Legal", item: `${SITE_URL}/aviso-legal` },
              { "@type": "ListItem", position: 3, name: "Aviso legal", item: `${SITE_URL}/aviso-legal` },
            ],
          }),
        }}
      />
      <div className="max-w-3xl mx-auto px-6 py-12">
        <header className="mb-10 border-b border-cr-border pb-8 space-y-2">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
            Legal
          </p>
          <h1 className="font-display text-4xl uppercase">Aviso legal</h1>
          <p className="font-mono text-xs text-cr-text-muted">Última actualización: mayo de 2026</p>
        </header>

        <div className="space-y-10 font-sans text-sm text-cr-text leading-relaxed">

          <section className="space-y-3">
            <h2 className="font-display text-xl uppercase text-cr-primary">1. Datos del titular</h2>
            <p>
              En cumplimiento del artículo 10 de la Ley 34/2002, de Servicios de la Sociedad de la
              Información y Comercio Electrónico (LSSI-CE), se informa que el responsable de este
              sitio web es:
            </p>
            <ul className="space-y-1 pl-4 list-disc text-cr-text-muted">
              <li><strong className="text-cr-text">Titular:</strong> Equipo ConcertRide</li>
              <li><strong className="text-cr-text">Correo electrónico de contacto:</strong>{" "}
                <a href="mailto:help@concertride.me" className="font-mono text-cr-primary underline underline-offset-2">
                  help@concertride.me
                </a>
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl uppercase text-cr-primary">2. Objeto y actividad del sitio</h2>
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
            <h2 className="font-display text-xl uppercase text-cr-primary">3. Propiedad intelectual e industrial</h2>
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
                la ficha del concierto incluye el enlace oficial de compra de entradas en Ticketmaster.
                Las imágenes de los eventos proceden igualmente de esta API y son propiedad de Ticketmaster
                o de sus licenciatarios. ConcertRide no aloja dichas imágenes en sus propios servidores.
              </li>
            </ul>
            <p>
              Los nombres de festivales y eventos musicales (Mad Cool, Primavera Sound, Sónar, FIB,
              BBK Live, Resurrection Fest, Viña Rock, Arenal Sound y otros) se utilizan
              exclusivamente con carácter descriptivo para identificar el destino de los viajes
              compartidos. ConcertRide ES no está afiliada, no está patrocinada ni representa a
              ninguno de estos festivales ni a sus organizadores. El uso de dichos nombres
              constituye un uso nominativo protegido por el derecho de referencia. Todos los
              derechos sobre los nombres, marcas y logotipos de los festivales pertenecen a sus
              respectivos titulares.
            </p>
            <p>
              Los mapas se renderizan con datos cartográficos de{" "}
              <a
                href="https://www.openstreetmap.org/copyright"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cr-primary underline underline-offset-2"
              >
                OpenStreetMap contributors
              </a>
              , cuyos datos se distribuyen bajo la{" "}
              <a
                href="https://opendatacommons.org/licenses/odbl/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cr-primary underline underline-offset-2"
              >
                Open Database License (ODbL)
              </a>
              . La licencia ODbL aplica exclusivamente a los <strong className="text-cr-text">datos</strong>{" "}
              cartográficos (geometrías, nombres, atributos) y no a este sitio web ni a su código fuente.
              ConcertRide cumple las{" "}
              <a
                href="https://osmfoundation.org/wiki/Licence/Attribution_Guidelines"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cr-primary underline underline-offset-2"
              >
                Attribution Guidelines de OpenStreetMap Foundation
              </a>{" "}
              mostrando la atribución visible y enlazable en cada mapa.
            </p>
            <p>
              La librería de renderizado utilizada es{" "}
              <a
                href="https://leafletjs.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cr-primary underline underline-offset-2"
              >
                Leaflet
              </a>
              , distribuida bajo licencia BSD 2-Clause (software libre). Los teselados (tiles) los
              sirve{" "}
              <a
                href="https://carto.com/attributions"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cr-primary underline underline-offset-2"
              >
                CARTO
              </a>{" "}
              a partir de datos de OpenStreetMap.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl uppercase text-cr-primary">4. Uso de la API de Ticketmaster</h2>
            <p>
              ConcertRide ES utiliza la{" "}
              <a
                href="https://developer.ticketmaster.com/products-and-docs/apis/discovery-api/v2/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cr-primary underline underline-offset-2"
              >
                Ticketmaster Discovery API v2
              </a>{" "}
              para mostrar información pública de eventos musicales en España. El uso de esta API está
              sujeto a los{" "}
              <a
                href="https://developer.ticketmaster.com/support/terms-of-use/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cr-primary underline underline-offset-2"
              >
                términos de uso para desarrolladores de Ticketmaster
              </a>
              , que ConcertRide cumple íntegramente.
            </p>
            <p className="text-cr-text-muted">
              En concreto, ConcertRide:
            </p>
            <ul className="space-y-2 pl-4 list-disc text-cr-text-muted">
              <li>
                <strong className="text-cr-text">Incluye el enlace de compra de entradas en Ticketmaster</strong>{" "}
                en cada ficha de concierto obtenida a través de su API, para que el usuario pueda
                adquirir entradas directamente en{" "}
                <a
                  href="https://www.ticketmaster.es"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cr-primary underline underline-offset-2"
                >
                  ticketmaster.es
                </a>
                .
              </li>
              <li>
                <strong className="text-cr-text">No vende entradas ni compite con Ticketmaster.</strong>{" "}
                ConcertRide es exclusivamente una plataforma de organización de viajes compartidos
                (carpooling) para llegar a los eventos. La compra de entradas siempre se realiza
                directamente en Ticketmaster u otros canales oficiales del organizador.
              </li>
              <li>
                <strong className="text-cr-text">Muestra imágenes de eventos</strong> obtenidas de
                la API de Ticketmaster, que son propiedad de Ticketmaster LLC o de sus licenciatarios.
                Dichas imágenes se emplean exclusivamente para identificar el evento en el contexto
                de la organización de viajes, y no como recurso gráfico independiente ni con fines
                publicitarios propios.
              </li>
              <li>
                <strong className="text-cr-text">Atribuye los datos</strong> a Ticketmaster® en el
                pie de página del sitio y en este aviso legal.
              </li>
              <li>
                <strong className="text-cr-text">No almacena los datos indefinidamente.</strong>{" "}
                Los registros de eventos sin viajes asociados se eliminan automáticamente una vez
                transcurridos dos meses desde la fecha del evento.
              </li>
              <li>
                <strong className="text-cr-text">No replica la experiencia de Ticketmaster.</strong>{" "}
                ConcertRide no permite la búsqueda, filtrado ni compra de entradas. La función de
                búsqueda de ConcertRide opera exclusivamente sobre los viajes disponibles.
              </li>
            </ul>
            <p>
              Ticketmaster® es una marca registrada de Ticketmaster LLC. ConcertRide ES no está
              afiliada, patrocinada ni avalada por Ticketmaster LLC.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl uppercase text-cr-primary">6. Exclusión de responsabilidad</h2>
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
            <h2 className="font-display text-xl uppercase text-cr-primary">7. Legislación aplicable y jurisdicción</h2>
            <p>
              Las presentes condiciones se rigen por la legislación española. Para la resolución de
              cualquier controversia derivada del uso de este sitio web, las partes se someten a los
              juzgados y tribunales del domicilio del titular, salvo que la normativa de consumo
              aplicable disponga otro fuero.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl uppercase text-cr-primary">8. Contacto</h2>
            <p>
              Para cualquier consulta relacionada con este aviso legal, puede contactar con nosotros
              en:{" "}
              <a
                href="mailto:help@concertride.me"
                className="font-mono text-cr-primary underline underline-offset-2"
              >
                help@concertride.me
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
