// Sends one test email per template to alejandrolalaguna@gmail.com using Resend.
// Usage: RESEND_API_KEY=re_xxx node scripts/test-emails.mjs
// Or:    node scripts/test-emails.mjs  (reads from ../.env.local or root .env)

import { readFileSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dir = dirname(fileURLToPath(import.meta.url));

// Load RESEND_API_KEY from env or root .env file
let RESEND_API_KEY = process.env.RESEND_API_KEY;
if (!RESEND_API_KEY) {
  try {
    const envFile = readFileSync(resolve(__dir, "../../../.env"), "utf8");
    const match = envFile.match(/^RESEND_API_KEY=(.+)$/m);
    if (match) RESEND_API_KEY = match[1].trim();
  } catch {}
}
if (!RESEND_API_KEY) {
  console.error("❌  RESEND_API_KEY not found");
  process.exit(1);
}

const FROM = "ConcertRide <no-reply@concertride.me>";
const REPLY_TO = "alejandrolalaguna@gmail.com";
const TO = "alejandrolalaguna@gmail.com";
const BASE = "https://concertride.me";

// ── Template helpers (mirrors email.ts) ─────────────────────────────────────

function esc(s) {
  return String(s)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

function shell(headline, preheader, body) {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${esc(headline)}</title>
</head>
<body style="margin:0;padding:40px 20px;background:#080808;color:#f5f5f5;font-family:-apple-system,'Inter',sans-serif;-webkit-text-size-adjust:100%;">
  <span style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${esc(preheader)}</span>
  <div style="max-width:520px;margin:0 auto;">
    <p style="font-size:11px;font-weight:700;letter-spacing:4px;text-transform:uppercase;color:#DBFF00;margin:0 0 8px 0;">CONCERTRIDE · ES</p>
    <div style="height:2px;background:linear-gradient(to right,#DBFF00,#ff4f00,transparent);margin:0 0 32px 0;"></div>
    ${body}
    <hr style="border:none;border-top:1px solid #1e1e1e;margin:48px 0 20px 0;" />
    <table style="width:100%;border-collapse:collapse;">
      <tr>
        <td style="vertical-align:top;">
          <p style="color:#3a3a3a;font-size:11px;line-height:1.7;margin:0;">
            <strong style="color:#444;letter-spacing:1px;text-transform:uppercase;font-size:10px;">ConcertRide</strong><br/>
            Madrid, España<br/>
            <a href="mailto:${REPLY_TO}" style="color:#555;text-decoration:underline;">${REPLY_TO}</a>
          </p>
        </td>
        <td style="vertical-align:top;text-align:right;">
          <p style="color:#3a3a3a;font-size:11px;line-height:1.7;margin:0;">
            Recibes este correo porque<br/>tienes una cuenta en concertride.me.<br/>
            <a href="${BASE}/profile" style="color:#555;text-decoration:underline;">Gestiona tus notificaciones</a>
          </p>
        </td>
      </tr>
    </table>
  </div>
</body>
</html>`;
}

function cta(url, text) {
  return `<a href="${url}" style="display:inline-block;background:#DBFF00;color:#000;padding:14px 28px;font-weight:700;text-transform:uppercase;letter-spacing:2px;text-decoration:none;font-size:12px;margin-bottom:4px;">${esc(text)}</a>`;
}
function ctaSec(url, text) {
  return `<a href="${url}" style="display:inline-block;background:transparent;color:#aaa;padding:12px 24px;font-weight:600;text-transform:uppercase;letter-spacing:2px;text-decoration:none;border:1px solid #333;font-size:11px;">${esc(text)}</a>`;
}
function alert(msg, type = "info") {
  const c = { success:["#DBFF00","#0f1500","#DBFF00"], warning:["#ff4f00","#150800","#ff4f00"], info:["#333","#111","#aaa"], danger:["#cc3333","#150000","#ff6666"] }[type];
  return `<div style="border-left:3px solid ${c[0]};background:${c[1]};padding:14px 18px;margin:0 0 28px 0;"><p style="color:${c[2]};font-size:13px;line-height:1.6;margin:0;">${msg}</p></div>`;
}
function table(rows) {
  return `<div style="background:#101010;border:1px solid #1e1e1e;padding:4px 20px;margin:0 0 28px 0;"><table style="border-collapse:collapse;width:100%;">${rows.map(([l,v])=>`<tr><td style="padding:8px 20px 8px 0;color:#555;font-size:13px;white-space:nowrap;">${esc(l)}</td><td style="padding:8px 0;color:#e0e0e0;font-size:13px;font-weight:500;">${esc(v)}</td></tr>`).join("")}</table></div>`;
}
function badge(label, type = "neutral") {
  const c = { success:["#DBFF00","#000"], warning:["#ff4f00","#fff"], danger:["#cc3333","#fff"], neutral:["#222","#aaa"] }[type];
  return `<span style="display:inline-block;background:${c[0]};color:${c[1]};font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;padding:3px 8px;">${esc(label)}</span>`;
}

// ── All email templates ──────────────────────────────────────────────────────

const EMAILS = [
  {
    subject: "[TEST] Bienvenid@ a ConcertRide 🎶 — verifica tu email",
    html: shell("Bienvenid@ a ConcertRide", "Verifica tu email para empezar",
      `<h1 style="font-family:Georgia,serif;font-size:32px;line-height:1.1;margin:0 0 12px 0;letter-spacing:-0.5px;">Hola, Alejandro. 👋</h1>
      <p style="color:#ccc;margin:0 0 16px 0;line-height:1.6;font-size:15px;">Gracias por unirte a ConcertRide. Antes de nada, <strong style="color:#DBFF00;">verifica tu email</strong> para poder publicar viajes y reservar plazas:</p>
      ${cta(`${BASE}/verify-email?token=TEST_TOKEN_WELCOME`, "Verificar mi email")}
      <p style="color:#444;font-size:12px;margin:0 0 36px 0;">El enlace expira en 7 días.</p>
      <p style="color:#666;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin:0 0 16px 0;">¿Qué puedes hacer en ConcertRide?</p>
      <table style="width:100%;border-collapse:collapse;margin:0 0 28px 0;">
        <tr>
          <td style="padding:12px 16px;background:#0d0d0d;border:1px solid #1a1a1a;vertical-align:top;width:33%;">
            <p style="color:#DBFF00;font-size:18px;margin:0 0 6px 0;">🚗</p>
            <p style="color:#fff;font-size:13px;font-weight:700;margin:0 0 4px 0;">Publicar un viaje</p>
            <p style="color:#666;font-size:12px;margin:0;">Comparte gastos si vas en coche a un concierto.</p>
          </td>
          <td style="padding:12px 16px;background:#0d0d0d;border:1px solid #1a1a1a;border-left:none;vertical-align:top;width:33%;">
            <p style="color:#DBFF00;font-size:18px;margin:0 0 6px 0;">🎟️</p>
            <p style="color:#fff;font-size:13px;font-weight:700;margin:0 0 4px 0;">Reservar plaza</p>
            <p style="color:#666;font-size:12px;margin:0;">Únete al viaje de otro fan al mismo concierto.</p>
          </td>
          <td style="padding:12px 16px;background:#0d0d0d;border:1px solid #1a1a1a;border-left:none;vertical-align:top;width:33%;">
            <p style="color:#DBFF00;font-size:18px;margin:0 0 6px 0;">🔔</p>
            <p style="color:#fff;font-size:13px;font-weight:700;margin:0 0 4px 0;">Seguir artistas</p>
            <p style="color:#666;font-size:12px;margin:0;">Recibe avisos cuando haya viajes para tus conciertos.</p>
          </td>
        </tr>
      </table>
      ${ctaSec(`${BASE}/concerts`, "Ver conciertos disponibles")}`
    ),
  },
  {
    subject: "[TEST] Restablece tu contraseña en ConcertRide",
    html: shell("Restablece tu contraseña", "El enlace expira en 30 minutos",
      `<h1 style="font-family:Georgia,serif;font-size:32px;line-height:1.1;margin:0 0 12px 0;letter-spacing:-0.5px;">Restablece tu contraseña.</h1>
      <p style="color:#888;margin:0 0 28px 0;line-height:1.6;font-size:15px;">Hemos recibido una solicitud para cambiar la contraseña de tu cuenta en ConcertRide.</p>
      ${alert(`⏱ Este enlace expira en <strong>30 minutos</strong> y solo puede usarse una vez.`, "warning")}
      <p style="margin:0 0 8px 0;">${cta(`${BASE}/reset-password?token=TEST_TOKEN`, "Cambiar contraseña")}</p>
      <p style="color:#444;font-size:12px;margin:20px 0 0 0;">¿El botón no funciona? Copia y pega esta URL en tu navegador:<br/><span style="color:#666;">${BASE}/reset-password?token=TEST_TOKEN</span></p>
      ${alert(`🔒 Si <strong>no</strong> has solicitado restablecer tu contraseña, no necesitas hacer nada. Tu cuenta sigue siendo segura.`, "info")}`
    ),
  },
  {
    subject: "[TEST] Tu enlace de acceso a ConcertRide",
    html: shell("Tu enlace de acceso", "Accede sin contraseña — expira en 15 minutos",
      `<h1 style="font-family:Georgia,serif;font-size:32px;line-height:1.1;margin:0 0 12px 0;letter-spacing:-0.5px;">Tu acceso de un clic.</h1>
      <p style="color:#888;margin:0 0 28px 0;line-height:1.6;font-size:15px;">Pulsa el botón para entrar a ConcertRide directamente, sin necesidad de contraseña.</p>
      ${alert(`⏱ Este enlace es de uso único y expira en <strong>15 minutos</strong>. No lo compartas con nadie.`, "warning")}
      <p style="margin:0 0 8px 0;">${cta(`${BASE}/verify-email?token=MAGIC_TOKEN`, "Acceder a mi cuenta")}</p>
      ${alert(`🔒 Si <strong>no</strong> has solicitado este enlace, ignora este email. Tu cuenta no se verá afectada.`, "info")}`
    ),
  },
  {
    subject: "[TEST] Solicitud de plaza para Coldplay — 2 plazas",
    html: shell("Solicitud de plaza", "Alejandro quiere 2 plazas · Coldplay",
      `<h1 style="font-family:Georgia,serif;font-size:28px;line-height:1.15;margin:0 0 12px 0;">Hola, Carlos.</h1>
      <p style="margin:0 0 6px 0;">${badge("Requiere confirmación", "warning")}</p>
      <p style="color:#ccc;margin:12px 0 24px 0;line-height:1.6;font-size:15px;"><strong style="color:#DBFF00;">Alejandro Lalaguna</strong> quiere 2 plazas en tu viaje. Confírmala o recházala cuanto antes.</p>
      ${table([["Concierto","Coldplay · Music of the Spheres"],["Salida desde","Madrid (Atocha)"],["Plazas","2 plazas"],["Pasajero","Alejandro Lalaguna"]])}
      ${alert(`⚡ Los conductores que responden en menos de 2 horas reciben mejores valoraciones. ¡No dejes esperando a Alejandro!`, "warning")}
      <p style="margin:0 0 8px 0;">${cta(`${BASE}/rides/123`, "Revisar y responder")}</p>`
    ),
  },
  {
    subject: "[TEST] ¡Plaza confirmada para Coldplay! 🎉",
    html: shell("¡Plaza confirmada!", "Coldplay · Madrid → Cornellà",
      `<h1 style="font-family:Georgia,serif;font-size:28px;line-height:1.15;margin:0 0 12px 0;">Hola, Alejandro. ¡Plaza confirmada! 🎉</h1>
      <p style="margin:0 0 4px 0;">${badge("Confirmado", "success")}</p>
      <p style="color:#ccc;margin:12px 0 24px 0;line-height:1.6;font-size:15px;"><strong style="color:#DBFF00;">Carlos García</strong> ha confirmado tu plaza en el viaje a <strong style="color:#fff;">Coldplay</strong>. ¡Todo listo!</p>
      ${table([["Concierto","Coldplay · Music of the Spheres"],["Salida desde","Madrid (Atocha)"],["Conductor","Carlos García"]])}
      ${alert(`📅 Recibirás un recordatorio <strong>24 horas antes</strong> y otro <strong>1 hora antes</strong> de la salida. Coordina el punto de encuentro con el conductor desde el chat del viaje.`, "info")}
      <p style="margin:0 0 8px 0;">${cta(`${BASE}/rides/123`, "Ver el viaje")}</p>`
    ),
  },
  {
    subject: "[TEST] Tu solicitud para Coldplay no fue aceptada",
    html: shell("Solicitud no aceptada", "Coldplay · Madrid → Cornellà",
      `<h1 style="font-family:Georgia,serif;font-size:28px;line-height:1.15;margin:0 0 12px 0;">Hola, Alejandro. No hay plaza esta vez.</h1>
      <p style="margin:0 0 4px 0;">${badge("No aceptado", "danger")}</p>
      <p style="color:#ccc;margin:12px 0 24px 0;line-height:1.6;font-size:15px;">Carlos García no ha podido aceptar tu solicitud para el viaje a <strong style="color:#fff;">Coldplay</strong> desde Madrid. No te preocupes — hay más opciones.</p>
      ${alert(`🔍 Sigue buscando: puede haber otros viajes publicados para este concierto. También puedes marcar interés para recibir un aviso cuando aparezca uno nuevo.`, "info")}
      <p style="margin:0 0 12px 0;">${cta(`${BASE}/concerts`, "Buscar otro viaje")}</p>
      <p style="margin:0;">${ctaSec(`${BASE}/rides/123`, "Ver el viaje original")}</p>`
    ),
  },
  {
    subject: "[TEST] Mañana: Coldplay · salida desde Madrid (Atocha)",
    html: shell("Recordatorio 24h", "Salida mañana desde Madrid — 18:30",
      `<h1 style="font-family:Georgia,serif;font-size:28px;line-height:1.15;margin:0 0 12px 0;">Mañana es el día. 🎶</h1>
      <p style="color:#ccc;margin:0 0 24px 0;line-height:1.7;font-size:15px;">Hola, Alejandro. Tu viaje a <strong style="color:#DBFF00;">Coldplay</strong> en Cornellà sale mañana.</p>
      ${table([["Concierto","Coldplay · Music of the Spheres"],["Ciudad del concierto","Cornellà de Llobregat"],["Salida desde","Madrid (Atocha)"],["Hora de salida","18:30"],["Tu rol","Pasajero"]])}
      ${alert(`🎟️ Recuerda coordinar con el conductor el punto exacto de encuentro. Si algo cambia en el último momento, contáctale directamente desde el chat del viaje.`, "info")}
      <p style="color:#666;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin:28px 0 12px 0;">Checklist para mañana</p>
      <ul style="color:#888;font-size:13px;line-height:2;margin:0 0 24px 0;padding-left:20px;">
        <li>Confirma el punto de recogida con el conductor</li>
        <li>Prepara el método de pago acordado</li>
        <li>Lleva el número del conductor por si necesitas contactarle</li>
        <li>Llega al punto de encuentro con 5 minutos de antelación</li>
      </ul>
      <p style="margin:0 0 8px 0;">${cta(`${BASE}/rides/123`, "Ver el viaje")}</p>`
    ),
  },
  {
    subject: "[TEST] En 1 hora: Coldplay · salida desde Madrid (Atocha)",
    html: shell("¡Ya casi llega la hora!", "Salida en 1 hora desde Madrid",
      `<h1 style="font-family:Georgia,serif;font-size:28px;line-height:1.15;margin:0 0 12px 0;">¡Ya casi llega la hora! 🚗</h1>
      <p style="color:#ccc;margin:0 0 24px 0;line-height:1.7;font-size:15px;">Hola, Alejandro. Tu viaje a <strong style="color:#DBFF00;">Coldplay</strong> sale en <strong style="color:#ff4f00;">1 hora</strong>.</p>
      ${table([["Concierto","Coldplay · Music of the Spheres"],["Ciudad","Cornellà de Llobregat"],["Salida desde","Madrid (Atocha)"],["Hora de salida","18:30"]])}
      ${alert(`💳 Recuerda llevar el pago preparado: <strong>Bizum</strong>. Consúltalo con el conductor si tienes dudas.`, "warning")}
      <p style="color:#ccc;margin:0 0 24px 0;line-height:1.6;font-size:14px;">¡Asegúrate de estar ya en camino al punto de recogida! El conductor cuenta contigo.</p>
      <p style="margin:0 0 8px 0;">${cta(`${BASE}/rides/123`, "Ver el viaje")}</p>`
    ),
  },
  {
    subject: "[TEST] ¿Cómo fue el viaje a Coldplay?",
    html: shell("Deja una reseña", "Deja una reseña a Carlos García — solo te lleva 1 minuto",
      `<h1 style="font-family:Georgia,serif;font-size:28px;line-height:1.15;margin:0 0 12px 0;">Gracias por viajar con ConcertRide. 🎶</h1>
      <p style="color:#ccc;margin:0 0 24px 0;line-height:1.6;font-size:15px;">Hola, Alejandro. ¿Qué tal fue el viaje a <strong style="color:#DBFF00;">Coldplay</strong> con <strong style="color:#fff;">Carlos García</strong>?</p>
      ${alert(`⭐ Las reseñas honestas son lo que hace que esta comunidad funcione. Solo te lleva un minuto y ayuda a que otros usuarios tomen mejores decisiones.`, "info")}
      <p style="color:#888;font-size:13px;line-height:1.8;margin:0 0 28px 0;">Tu opinión sobre <strong style="color:#ccc;">Carlos García</strong> será visible en su perfil público. Cuéntanos si fue puntual, cómodo, amable, o si hubo algún problema.</p>
      <p style="margin:0 0 8px 0;">${cta(`${BASE}/rides/123`, "Dejar una reseña")}</p>
      <p style="color:#444;font-size:12px;margin-top:16px;">Las reseñas se pueden escribir hasta 7 días después del viaje.</p>`
    ),
  },
  {
    subject: "[TEST] Hay nuevo viaje a Coldplay 🎶",
    html: shell("Tu concierto tiene viaje", "Desde Madrid · €15/plaza — reserva antes de que se llene",
      `<h1 style="font-family:Georgia,serif;font-size:28px;line-height:1.15;margin:0 0 12px 0;">Tu concierto tiene viaje. 🚗</h1>
      <p style="color:#ccc;margin:0 0 24px 0;line-height:1.6;font-size:15px;">Hola, Alejandro. Alguien acaba de publicar un viaje a <strong style="color:#DBFF00;">Coldplay</strong> desde Madrid.</p>
      ${table([["Concierto","Coldplay · Music of the Spheres"],["Salida desde","Madrid (Atocha)"],["Precio por plaza","€15"]])}
      ${alert(`⚡ Las plazas se llenan rápido. Reserva cuanto antes para no quedarte sin sitio.`, "warning")}
      <p style="margin:0 0 8px 0;">${cta(`${BASE}/rides/123`, "Reservar plaza")}</p>
      <p style="color:#3a3a3a;font-size:11px;margin-top:28px;line-height:1.6;">Recibes este correo porque marcaste interés en este concierto. Puedes deshabilitar estos avisos en tu <a href="${BASE}/profile" style="color:#555;text-decoration:underline;">perfil</a>.</p>`
    ),
  },
  {
    subject: "[TEST] [Admin] Nuevo carnet para verificar — Alejandro Lalaguna",
    html: shell("[Admin] Carnet pendiente", "Acción requerida: revisar carnet de Alejandro Lalaguna",
      `<h1 style="font-family:Georgia,serif;font-size:24px;line-height:1.15;margin:0 0 12px 0;">Nuevo carnet pendiente de revisión.</h1>
      <p style="color:#ccc;margin:0 0 24px 0;line-height:1.6;font-size:15px;">Un usuario ha enviado su carnet de conducir para verificación. Revísalo en el panel de administración.</p>
      ${table([["Usuario","Alejandro Lalaguna"],["User ID","usr_abc123"],["Review ID","rev_xyz789"]])}
      ${alert(`🔍 Comprueba que el documento es legible, pertenece al usuario y está vigente. Aprueba o rechaza desde el panel admin indicando el motivo si procede.`, "info")}
      <p style="margin:0 0 12px 0;">${cta(`${BASE}/api/license-file/TEST`, "Ver documento")}</p>
      <p style="margin:0;">${ctaSec(`${BASE}/admin`, "Ir al panel admin")}</p>`
    ),
  },
  {
    subject: "[TEST] Tu carnet ha sido verificado ✓",
    html: shell("Carnet verificado", "¡Ya puedes publicar viajes como conductor!",
      `<h1 style="font-family:Georgia,serif;font-size:28px;line-height:1.15;margin:0 0 12px 0;">Carnet verificado. ✅</h1>
      <p style="margin:0 0 4px 0;">${badge("Verificado", "success")}</p>
      <p style="color:#ccc;margin:16px 0 24px 0;line-height:1.6;font-size:15px;">Hola, Alejandro. Hemos revisado tu carnet de conducir y todo está en orden. Ya puedes publicar viajes como conductor en ConcertRide.</p>
      ${alert(`🚗 Ya tienes acceso completo como conductor. Publica tu primer viaje en menos de 2 minutos y empieza a compartir gastos con otros fans.`, "success")}
      <p style="color:#666;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin:0 0 12px 0;">Próximos pasos</p>
      <ul style="color:#888;font-size:13px;line-height:2;margin:0 0 28px 0;padding-left:20px;">
        <li>Ve a <strong style="color:#ccc;">Publicar viaje</strong> e introduce los detalles del concierto</li>
        <li>Elige si prefieres reserva instantánea o aprobación manual</li>
        <li>Establece el precio por plaza y el método de pago</li>
        <li>¡Listo! Los fans interesados te contactarán</li>
      </ul>
      <p style="margin:0 0 8px 0;">${cta(`${BASE}/publish`, "Publicar mi primer viaje")}</p>`
    ),
  },
  {
    subject: "[TEST] Tu carnet no ha podido ser verificado",
    html: shell("Carnet no verificado", "Puedes reintentar la verificación",
      `<h1 style="font-family:Georgia,serif;font-size:28px;line-height:1.15;margin:0 0 12px 0;">No hemos podido verificar tu carnet.</h1>
      <p style="margin:0 0 4px 0;">${badge("No verificado", "danger")}</p>
      <p style="color:#ccc;margin:16px 0 24px 0;line-height:1.6;font-size:15px;">Hola, Alejandro. Lamentablemente no hemos podido verificar tu carnet de conducir.</p>
      ${alert(`<strong>Motivo:</strong> La imagen está borrosa y los datos no son legibles. Por favor sube una foto más clara.`, "danger")}
      <p style="color:#ccc;margin:0 0 24px 0;line-height:1.6;font-size:15px;">Puedes volver a intentarlo subiendo una imagen más clara del documento desde tu perfil. Asegúrate de que:</p>
      <ul style="color:#888;font-size:13px;line-height:2;margin:0 0 28px 0;padding-left:20px;">
        <li>La imagen está bien iluminada y sin reflejos</li>
        <li>Todos los datos son legibles (nombre, fecha, número)</li>
        <li>El carnet está vigente y no caducado</li>
        <li>Subes el anverso completo del documento</li>
      </ul>
      <p style="margin:0 0 8px 0;">${cta(`${BASE}/profile`, "Volver a intentarlo")}</p>
      <p style="color:#444;font-size:12px;margin-top:16px;">Si crees que es un error, responde a este correo y lo revisamos.</p>`
    ),
  },
  {
    subject: "[TEST] Tu cuenta en ConcertRide ha sido suspendida",
    html: shell("Cuenta suspendida", "Información sobre la suspensión de tu cuenta",
      `<h1 style="font-family:Georgia,serif;font-size:28px;line-height:1.15;margin:0 0 12px 0;">Cuenta suspendida.</h1>
      <p style="margin:0 0 4px 0;">${badge("Suspendida", "danger")}</p>
      <p style="color:#ccc;margin:16px 0 24px 0;line-height:1.6;font-size:15px;">Hola, Alejandro. Tu cuenta en ConcertRide ha sido suspendida por incumplimiento de nuestras <a href="${BASE}/terms" style="color:#888;text-decoration:underline;">normas de comunidad</a>.</p>
      ${alert(`<strong>Motivo de la suspensión:</strong><br/>Comportamiento inapropiado hacia otros usuarios de la plataforma durante un viaje.`, "danger")}
      <p style="color:#888;font-size:13px;margin:0 0 12px 0;line-height:1.7;">Mientras tu cuenta esté suspendida, no podrás publicar viajes, realizar reservas ni acceder a los chats de los viajes activos.</p>
      ${alert(`📬 ¿Crees que se trata de un error? Responde a este correo con el asunto <strong>"Apelación de suspensión"</strong> y revisaremos tu caso en un plazo de 48–72 horas.`, "info")}
      <p style="color:#3a3a3a;font-size:12px;margin-top:24px;line-height:1.6;">ConcertRide se reserva el derecho de suspender o eliminar cuentas que incumplan los términos de servicio. Para más información consulta nuestras <a href="${BASE}/terms" style="color:#555;text-decoration:underline;">condiciones de uso</a>.</p>`
    ),
  },
];

// ── Send via Resend ──────────────────────────────────────────────────────────

async function send(email, index) {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      authorization: `Bearer ${RESEND_API_KEY}`,
      "content-type": "application/json",
    },
    body: JSON.stringify({ from: FROM, to: TO, reply_to: REPLY_TO, subject: email.subject, html: email.html }),
  });
  const data = await res.json().catch(() => null);
  const num = String(index + 1).padStart(2, " ");
  if (res.ok) {
    console.log(`  ✅ [${num}/${EMAILS.length}] ${email.subject.replace("[TEST] ", "")}  →  id:${data?.id}`);
  } else {
    console.error(`  ❌ [${num}/${EMAILS.length}] ${email.subject}  →  ${res.status} ${JSON.stringify(data)}`);
  }
}

console.log(`\n📧  Enviando ${EMAILS.length} emails de prueba a ${TO}…\n`);
for (let i = 0; i < EMAILS.length; i++) {
  await send(EMAILS[i], i);
  // Small delay to avoid Resend rate limits
  if (i < EMAILS.length - 1) await new Promise(r => setTimeout(r, 350));
}
console.log("\n✔  Listo. Revisa tu bandeja de entrada.\n");
