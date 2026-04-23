import { Link } from "react-router-dom";
import { useSeoMeta } from "@/lib/useSeoMeta";

export default function CookiesPage() {
  useSeoMeta({
    title: "Política de cookies",
    description: "Política de cookies de ConcertRide ES: qué cookies usamos, para qué y cómo puedes gestionar tus preferencias.",
    canonical: "https://concertride.es/cookies",
  });

  return (
    <main id="main" className="min-h-dvh bg-cr-bg text-cr-text pt-14">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <header className="mb-10 border-b border-cr-border pb-8 space-y-2">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
            Legal
          </p>
          <h1 className="font-display text-4xl uppercase">Política de cookies</h1>
          <p className="font-mono text-xs text-cr-text-muted">Última actualización: abril de 2026</p>
        </header>

        <div className="space-y-10 font-sans text-sm text-cr-text leading-relaxed">

          <section className="space-y-3">
            <h2 className="font-display text-xl uppercase text-cr-primary">¿Qué es una cookie?</h2>
            <p>
              Una cookie es un pequeño archivo de texto que un sitio web deposita en tu dispositivo
              cuando lo visitas. Sirve para que el sitio recuerde información de tu visita, como
              si has iniciado sesión, preferencias, etc.
            </p>
          </section>

          <section className="space-y-4">
            <h2 className="font-display text-xl uppercase text-cr-primary">Cookies y almacenamiento que usa este sitio</h2>
            <p>
              ConcertRide ES usa una sola cookie estrictamente necesaria. De manera opcional (solo si
              lo aceptas en el banner) activamos analítica anónima de producto alojada en la UE. No
              hay cookies publicitarias.
            </p>

            <div className="overflow-x-auto">
              <table className="w-full font-mono text-xs border-collapse">
                <thead>
                  <tr className="border-b border-cr-border text-left">
                    <th className="py-2 pr-4 font-semibold text-cr-text-muted uppercase tracking-[0.08em]">Nombre</th>
                    <th className="py-2 pr-4 font-semibold text-cr-text-muted uppercase tracking-[0.08em]">Tipo</th>
                    <th className="py-2 pr-4 font-semibold text-cr-text-muted uppercase tracking-[0.08em]">Duración</th>
                    <th className="py-2 font-semibold text-cr-text-muted uppercase tracking-[0.08em]">Finalidad</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-cr-border/30">
                    <td className="py-3 pr-4 text-cr-primary">cr_session</td>
                    <td className="py-3 pr-4 text-cr-text">Propia · Necesaria</td>
                    <td className="py-3 pr-4 text-cr-text">30 días</td>
                    <td className="py-3 text-cr-text-muted">
                      Mantiene la sesión iniciada. Contiene un token JWT firmado.
                      HTTP-only; no accesible desde JavaScript.
                    </td>
                  </tr>
                  <tr className="border-b border-cr-border/30">
                    <td className="py-3 pr-4 text-cr-primary">cr_cookie_notice_v1</td>
                    <td className="py-3 pr-4 text-cr-text">Propia · Necesaria (localStorage)</td>
                    <td className="py-3 pr-4 text-cr-text">Permanente</td>
                    <td className="py-3 text-cr-text-muted">
                      Guarda tu elección en el banner de cookies para no volver a mostrártelo.
                    </td>
                  </tr>
                  <tr className="border-b border-cr-border/30">
                    <td className="py-3 pr-4 text-cr-primary">cr_analytics_consent_v1</td>
                    <td className="py-3 pr-4 text-cr-text">Propia · Consentimiento (localStorage)</td>
                    <td className="py-3 pr-4 text-cr-text">Permanente</td>
                    <td className="py-3 text-cr-text-muted">
                      Registra si has concedido o denegado la analítica anónima. Sin este flag en
                      <code className="text-cr-primary"> granted</code>, PostHog no se carga.
                    </td>
                  </tr>
                  <tr className="border-b border-cr-border/30">
                    <td className="py-3 pr-4 text-cr-primary">ph_* (PostHog)</td>
                    <td className="py-3 pr-4 text-cr-text">Terceros · Analítica opcional</td>
                    <td className="py-3 pr-4 text-cr-text">12 meses</td>
                    <td className="py-3 text-cr-text-muted">
                      Identificador aleatorio anónimo + estado de sesión para agregar métricas de
                      uso. Solo se crea si aceptas "Aceptar todo" en el banner. Servidor en la UE
                      (Frankfurt). No se comparte con terceros.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="bg-cr-surface border border-cr-border p-4 space-y-1">
              <p className="font-sans text-xs font-semibold uppercase tracking-[0.1em] text-cr-primary">
                Sin publicidad ni seguimiento entre sitios
              </p>
              <p className="font-mono text-xs text-cr-text-muted">
                No usamos Google Analytics, píxeles de Facebook, cookies de remarketing ni ninguna
                otra tecnología de cross-site tracking. No compartimos datos de navegación con
                anunciantes. La analítica opcional es agregada y anónima.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl uppercase text-cr-primary">Solicitudes de terceros</h2>
            <p>
              El mapa interactivo realiza solicitudes de imágenes de teselas (tiles) a los servidores
              de <strong>CARTO</strong> y <strong>OpenStreetMap</strong>. Estas solicitudes pueden
              registrar tu dirección IP en los servidores de esos proveedores, como cualquier
              petición HTTP normal, pero <strong>no depositan cookies</strong> en tu dispositivo.
            </p>
            <p>
              Para más información sobre cómo CARTO trata los datos de acceso a sus teselas,
              consulta su{" "}
              <a
                href="https://carto.com/privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cr-primary underline underline-offset-2"
              >
                política de privacidad
              </a>
              .
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl uppercase text-cr-primary">¿Necesito dar mi consentimiento?</h2>
            <p>
              Las cookies y el almacenamiento local estrictamente necesarios
              (<code className="font-mono">cr_session</code>, <code className="font-mono">cr_cookie_notice_v1</code>) no requieren consentimiento previo,
              conforme al artículo 22.2 de la LSSI-CE y la Directiva ePrivacy.
            </p>
            <p>
              La <strong>analítica de producto (PostHog EU)</strong> sí requiere tu consentimiento
              explícito: solo se carga cuando pulsas <em>"Aceptar todo"</em> en el banner. Si pulsas
              <em> "Solo esenciales"</em>, PostHog no se inicializa y no se almacenan ni se envían
              eventos.
            </p>
            <p>
              Puedes revocar tu consentimiento en cualquier momento borrando el valor
              <code className="font-mono"> cr_analytics_consent_v1</code> del localStorage o
              escribiéndonos a{" "}
              <a
                href="mailto:alejandrolalaguna@gmail.com"
                className="text-cr-primary underline underline-offset-2"
              >
                alejandrolalaguna@gmail.com
              </a>
              .
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl uppercase text-cr-primary">Cómo eliminar las cookies</h2>
            <p>
              Puedes eliminar o bloquear cookies desde la configuración de tu navegador:
            </p>
            <ul className="space-y-1 pl-4 list-disc text-cr-text-muted">
              <li>
                <strong className="text-cr-text">Chrome:</strong> Configuración → Privacidad y seguridad → Cookies y otros datos de sitios
              </li>
              <li>
                <strong className="text-cr-text">Firefox:</strong> Opciones → Privacidad y seguridad → Cookies y datos del sitio
              </li>
              <li>
                <strong className="text-cr-text">Safari:</strong> Preferencias → Privacidad → Gestionar datos del sitio web
              </li>
              <li>
                <strong className="text-cr-text">Edge:</strong> Configuración → Cookies y permisos del sitio
              </li>
            </ul>
            <p>
              Ten en cuenta que si eliminas <code className="font-mono">cr_session</code>, tu sesión
              se cerrará y tendrás que volver a iniciarla.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl uppercase text-cr-primary">Cambios en esta política</h2>
            <p>
              Si en el futuro incorporamos nuevas cookies, actualizaremos esta página y, si son
              cookies no necesarias, solicitaremos tu consentimiento previamente.
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
