import { Link } from "react-router-dom";
import { useSeoMeta } from "@/lib/useSeoMeta";

export default function PrivacidadPage() {
  useSeoMeta({
    title: "Política de privacidad",
    description: "Cómo ConcertRide ES trata tus datos personales (RGPD): qué recopilamos, para qué, tus derechos y cómo ejercerlos.",
    canonical: "https://concertride.es/privacidad",
  });

  return (
    <main id="main" className="min-h-dvh bg-cr-bg text-cr-text pt-14">
      <div className="max-w-3xl mx-auto px-6 py-12">
        <header className="mb-10 border-b border-cr-border pb-8 space-y-2">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
            Legal
          </p>
          <h1 className="font-display text-4xl uppercase">Política de privacidad</h1>
          <p className="font-mono text-xs text-cr-text-muted">
            Última actualización: abril de 2026 · Aplicable desde el 25 de mayo de 2018 (RGPD)
          </p>
        </header>

        <div className="space-y-10 font-sans text-sm text-cr-text leading-relaxed">

          <section className="space-y-3">
            <h2 className="font-display text-xl uppercase text-cr-primary">1. Datos que recogemos y para qué</h2>

            <div className="overflow-x-auto">
              <table className="w-full font-mono text-xs border-collapse">
                <thead>
                  <tr className="border-b border-cr-border text-left">
                    <th className="py-2 pr-4 font-semibold text-cr-text-muted uppercase tracking-[0.08em]">Dato</th>
                    <th className="py-2 pr-4 font-semibold text-cr-text-muted uppercase tracking-[0.08em]">Finalidad</th>
                    <th className="py-2 font-semibold text-cr-text-muted uppercase tracking-[0.08em]">Base legal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cr-border/40">
                  <tr>
                    <td className="py-2 pr-4 text-cr-text">Nombre y correo</td>
                    <td className="py-2 pr-4 text-cr-text-muted">Crear y gestionar la cuenta</td>
                    <td className="py-2 text-cr-text-muted">Art. 6.1.b RGPD (contrato)</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 text-cr-text">Contraseña (hash)</td>
                    <td className="py-2 pr-4 text-cr-text-muted">Autenticación segura</td>
                    <td className="py-2 text-cr-text-muted">Art. 6.1.b RGPD (contrato)</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 text-cr-text">Teléfono (opcional)</td>
                    <td className="py-2 pr-4 text-cr-text-muted">Contacto entre usuario y conductor</td>
                    <td className="py-2 text-cr-text-muted">Art. 6.1.a RGPD (consentimiento)</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 text-cr-text">Ciudad, modelo de coche, color, fumador, carnet</td>
                    <td className="py-2 pr-4 text-cr-text-muted">Mostrar perfil público del conductor</td>
                    <td className="py-2 text-cr-text-muted">Art. 6.1.a RGPD (consentimiento)</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 text-cr-text">Dirección y coordenadas de origen del viaje</td>
                    <td className="py-2 pr-4 text-cr-text-muted">Mostrar punto de recogida en el mapa</td>
                    <td className="py-2 text-cr-text-muted">Art. 6.1.b RGPD (contrato)</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 text-cr-text">Valoraciones y reseñas</td>
                    <td className="py-2 pr-4 text-cr-text-muted">Sistema de confianza entre usuarios</td>
                    <td className="py-2 text-cr-text-muted">Art. 6.1.f RGPD (interés legítimo)</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 text-cr-text">Historial de viajes</td>
                    <td className="py-2 pr-4 text-cr-text-muted">Gestión de reservas y cumplimiento</td>
                    <td className="py-2 text-cr-text-muted">Art. 6.1.b RGPD (contrato)</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 text-cr-text">Suscripción a notificaciones push (Web Push)</td>
                    <td className="py-2 pr-4 text-cr-text-muted">Avisos de solicitudes, confirmaciones y recordatorios</td>
                    <td className="py-2 text-cr-text-muted">Art. 6.1.a RGPD (consentimiento del navegador)</td>
                  </tr>
                  <tr>
                    <td className="py-2 pr-4 text-cr-text">Eventos anónimos de uso (páginas vistas, clics)</td>
                    <td className="py-2 pr-4 text-cr-text-muted">Analítica de producto si aceptas en el banner</td>
                    <td className="py-2 text-cr-text-muted">Art. 6.1.a RGPD (consentimiento)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-cr-text-muted text-xs">
              No tratamos datos de categorías especiales (Art. 9 RGPD). No tomamos decisiones
              automatizadas ni elaboramos perfiles con efectos jurídicos.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl uppercase text-cr-primary">2. Conservación de los datos</h2>
            <ul className="space-y-2 pl-4 list-disc text-cr-text-muted">
              <li>
                <strong className="text-cr-text">Cuenta y perfil</strong> — mientras la cuenta esté
                activa. Si ejercitas tu derecho de supresión desde <em>Mi perfil → Eliminar cuenta</em>,
                anonimizamos tus datos personales (nombre, correo, teléfono, foto y datos de vehículo)
                <strong> de forma inmediata</strong>. Tus reseñas permanecen asociadas al identificador
                anónimo para no alterar la reputación de terceros, sin referencia a tu identidad.
              </li>
              <li>
                <strong className="text-cr-text">Datos de viajes pasados</strong> — conservados 2
                años desde la fecha del viaje para posibles reclamaciones, disociados de tus datos
                personales si te has dado de baja.
              </li>
              <li>
                <strong className="text-cr-text">Cookie de sesión</strong> — expira a los 30 días
                desde el último inicio de sesión.
              </li>
              <li>
                <strong className="text-cr-text">Suscripciones push</strong> — se eliminan al darte
                de baja o al deshabilitar las notificaciones en el perfil.
              </li>
              <li>
                <strong className="text-cr-text">Eventos de analítica</strong> — PostHog los conserva
                como máximo 12 meses. Puedes revocar el consentimiento en cualquier momento.
              </li>
              <li>
                <strong className="text-cr-text">Documentos de verificación de licencia</strong> —
                las imágenes del carnet de conducir aportadas para la verificación se eliminan
                automáticamente transcurridos 90 días desde su carga, o antes si la verificación
                se completa. El acceso durante ese período está restringido exclusivamente al
                administrador de la plataforma. Los documentos se transmiten y almacenan cifrados
                (HTTPS en tránsito, cifrado en reposo por Cloudflare KV).
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl uppercase text-cr-primary">3. Destinatarios</h2>
            <p>
              No cedemos tus datos a terceros con fines comerciales. Compartimos datos mínimos con
              los siguientes prestadores de servicios en calidad de encargados del tratamiento:
            </p>
            <ul className="space-y-1 pl-4 list-disc text-cr-text-muted">
              <li>
                <strong className="text-cr-text">Turso / ChiselStrike Inc.</strong> — base de datos
                en la nube (región UE, Frankfurt). Contrato de encargado del tratamiento suscrito.
              </li>
              <li>
                <strong className="text-cr-text">Cloudflare Inc.</strong> — infraestructura de red
                y CDN. Cloudflare puede procesar datos en EE. UU. bajo cláusulas contractuales tipo
                aprobadas por la Comisión Europea.
              </li>
              <li>
                <strong className="text-cr-text">Resend Inc.</strong> — envío de correos
                transaccionales (bienvenida, recordatorios, solicitudes y confirmaciones de viaje).
                Solo recibe el nombre y correo del destinatario + el texto del correo. Los datos
                se transfieren a EE. UU. bajo las Cláusulas Contractuales Tipo aprobadas por la
                Comisión Europea (Art. 46 RGPD).
              </li>
              <li>
                <strong className="text-cr-text">PostHog EU</strong> — analítica anónima de producto.
                Sólo se activa si aceptas en el banner de cookies. Alojamiento en la UE (Frankfurt).
              </li>
              <li>
                <strong className="text-cr-text">Sentry.io</strong> — registro de errores para
                corregir fallos. Recibe metadatos técnicos (URL, mensaje de error, navegador); los
                correos electrónicos y cabeceras de autenticación se filtran antes del envío. Los
                datos se transfieren a EE. UU. bajo las Cláusulas Contractuales Tipo aprobadas
                por la Comisión Europea (Art. 46 RGPD).
              </li>
              <li>
                <strong className="text-cr-text">Proveedor de servicios de push del navegador</strong>{" "}
                (Google FCM, Apple APNS, Mozilla Autopush, Microsoft WNS) — recibe el endpoint de tu
                navegador y el contenido cifrado del aviso push. No ve tu identidad real.
              </li>
            </ul>
            <p>
              La información de perfil público del conductor (nombre, ciudad, valoración, modelo de
              coche, reseñas) es visible para otros usuarios registrados en la plataforma.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl uppercase text-cr-primary">4. Tus derechos</h2>
            <p>
              Puedes ejercer en cualquier momento los siguientes derechos. La supresión de la cuenta
              está disponible directamente en <em>Mi perfil → Eliminar cuenta</em>. Para el resto
              puedes escribirnos a{" "}
              <a
                href="mailto:alejandrolalaguna@gmail.com"
                className="font-mono text-cr-primary underline underline-offset-2"
              >
                alejandrolalaguna@gmail.com
              </a>
              , indicando el derecho que deseas ejercitar y acreditando tu identidad:
            </p>
            <ul className="space-y-1 pl-4 list-disc text-cr-text-muted">
              <li><strong className="text-cr-text">Acceso</strong> — conocer qué datos tratamos sobre ti.</li>
              <li><strong className="text-cr-text">Rectificación</strong> — corregir datos inexactos desde tu perfil o por correo.</li>
              <li><strong className="text-cr-text">Supresión</strong> — eliminación inmediata desde <em>Mi perfil → Eliminar cuenta</em>.</li>
              <li><strong className="text-cr-text">Oposición</strong> — oponerte al tratamiento basado en interés legítimo.</li>
              <li><strong className="text-cr-text">Limitación</strong> — solicitar que se restrinja el tratamiento.</li>
              <li><strong className="text-cr-text">Portabilidad</strong> — recibir tus datos en formato estructurado.</li>
              <li>
                <strong className="text-cr-text">Retirada del consentimiento</strong> — en analítica
                (banner de cookies) o notificaciones push (perfil), en cualquier momento sin que
                afecte a lo anterior.
              </li>
            </ul>
            <p>
              Si consideras que el tratamiento no es conforme al RGPD, tienes derecho a presentar
              una reclamación ante la{" "}
              <a
                href="https://www.aepd.es"
                target="_blank"
                rel="noopener noreferrer"
                className="text-cr-primary underline underline-offset-2"
              >
                Agencia Española de Protección de Datos (AEPD)
              </a>
              .
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl uppercase text-cr-primary">5. Seguridad</h2>
            <p>
              Las contraseñas se almacenan como hash PBKDF2-SHA256 (100 000 iteraciones, sal
              aleatoria de 16 bytes) y nunca en texto plano. Las sesiones se gestionan mediante
              tokens JWT firmados con HS256, transmitidos exclusivamente en cookies HTTP-only con
              atributo Secure en producción.
            </p>
            <p>
              El acceso a la base de datos está restringido mediante autenticación por token. La
              comunicación entre cliente y servidor se realiza siempre sobre HTTPS.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl uppercase text-cr-primary">6. Cambios en esta política</h2>
            <p>
              Podemos actualizar esta política para adaptarla a cambios normativos o del servicio.
              Cuando los cambios sean significativos, te lo notificaremos por correo electrónico o
              mediante un aviso destacado en la plataforma.
            </p>
          </section>

        </div>

        <div className="mt-12 pt-8 border-t border-cr-border flex flex-wrap gap-4">
          <Link to="/aviso-legal" className="font-sans text-xs text-cr-text-muted hover:text-cr-primary transition-colors">
            Aviso legal →
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
