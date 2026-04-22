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
            <h2 className="font-display text-xl uppercase text-cr-primary">1. Responsable del tratamiento</h2>
            <ul className="font-mono text-xs text-cr-text-muted space-y-1 pl-4 border-l-2 border-cr-border">
              <li><span className="text-cr-text">Responsable:</span> [NOMBRE O RAZÓN SOCIAL]</li>
              <li><span className="text-cr-text">CIF/NIF:</span> [CIF/NIF]</li>
              <li><span className="text-cr-text">Domicilio:</span> [DIRECCIÓN COMPLETA], España</li>
              <li><span className="text-cr-text">Contacto privacidad:</span> [CORREO DE PRIVACIDAD]</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl uppercase text-cr-primary">2. Datos que recogemos y para qué</h2>

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
                </tbody>
              </table>
            </div>

            <p className="text-cr-text-muted text-xs">
              No tratamos datos de categorías especiales (Art. 9 RGPD). No tomamos decisiones
              automatizadas ni elaboramos perfiles con efectos jurídicos.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl uppercase text-cr-primary">3. Conservación de los datos</h2>
            <ul className="space-y-2 pl-4 list-disc text-cr-text-muted">
              <li>
                <strong className="text-cr-text">Cuenta y perfil</strong> — mientras la cuenta esté
                activa. Si solicitas la baja, los datos se eliminan en un plazo máximo de 30 días,
                salvo obligación legal de conservación.
              </li>
              <li>
                <strong className="text-cr-text">Datos de viajes pasados</strong> — conservados 2
                años desde la fecha del viaje para posibles reclamaciones.
              </li>
              <li>
                <strong className="text-cr-text">Cookie de sesión</strong> — expira a los 30 días
                desde el último inicio de sesión.
              </li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl uppercase text-cr-primary">4. Destinatarios</h2>
            <p>
              No cedemos tus datos a terceros con fines comerciales. Podemos compartir datos
              mínimos con los siguientes prestadores de servicios en calidad de encargados del
              tratamiento:
            </p>
            <ul className="space-y-1 pl-4 list-disc text-cr-text-muted">
              <li>
                <strong className="text-cr-text">Turso / ChiselStrike Inc.</strong> — base de datos
                en la nube (alojamiento en la UE o EEE).
              </li>
              <li>
                <strong className="text-cr-text">Cloudflare Inc.</strong> — infraestructura de red
                y CDN. Cloudflare puede procesar datos en EE. UU. bajo salvaguardas adecuadas
                (cláusulas contractuales tipo).
              </li>
              <li>
                <strong className="text-cr-text">Resend Inc.</strong> — envío de correos
                transaccionales (solo si existe cuenta y es necesario un correo de verificación).
              </li>
            </ul>
            <p>
              La información de perfil público del conductor (nombre, ciudad, valoración, modelo de
              coche) es visible para otros usuarios registrados en la plataforma.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="font-display text-xl uppercase text-cr-primary">5. Tus derechos</h2>
            <p>
              Puedes ejercer en cualquier momento los siguientes derechos dirigiéndote por escrito
              a <span className="font-mono text-cr-primary">[CORREO DE PRIVACIDAD]</span>, indicando
              el derecho que deseas ejercitar y acreditando tu identidad:
            </p>
            <ul className="space-y-1 pl-4 list-disc text-cr-text-muted">
              <li><strong className="text-cr-text">Acceso</strong> — conocer qué datos tratamos sobre ti.</li>
              <li><strong className="text-cr-text">Rectificación</strong> — corregir datos inexactos.</li>
              <li><strong className="text-cr-text">Supresión</strong> — solicitar la eliminación de tu cuenta y datos.</li>
              <li><strong className="text-cr-text">Oposición</strong> — oponerte al tratamiento basado en interés legítimo.</li>
              <li><strong className="text-cr-text">Limitación</strong> — solicitar que se restrinja el tratamiento.</li>
              <li><strong className="text-cr-text">Portabilidad</strong> — recibir tus datos en formato estructurado.</li>
              <li>
                <strong className="text-cr-text">Retirada del consentimiento</strong> — para los
                datos opcionales de perfil, en cualquier momento sin que afecte a lo anterior.
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
            <h2 className="font-display text-xl uppercase text-cr-primary">6. Seguridad</h2>
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
            <h2 className="font-display text-xl uppercase text-cr-primary">7. Cambios en esta política</h2>
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
