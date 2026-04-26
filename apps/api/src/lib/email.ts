// Transactional email infrastructure. Every outbound mail goes through
// `sendEmail()`, which is a single entry point wrapping the Resend REST API.
// Each feature (password reset, welcome, ride reminder, etc.) is a thin
// wrapper that builds the subject + HTML body and delegates here.
//
// When RESEND_API_KEY is absent, sends are no-ops that log to stdout — so
// local dev still works without a Resend account, and failures in prod
// don't break request paths.
import type { Env } from "../env";
import { getSiteUrl } from "./siteUrl";

export interface SendResult {
  sent: boolean;
  id?: string;
  error?: string;
}

// Sender address. The local-part `no-reply@` is fine; the domain must be a
// verified Resend sending domain. Update when you switch sending domains.
const FROM_ADDRESS = "ConcertRide <no-reply@concertride.me>";
const REPLY_TO = "alejandrolalaguna@gmail.com";

// ── Low-level send ────────────────────────────────────────────────────────
export async function sendEmail(
  env: Env,
  params: { to: string; subject: string; html: string },
): Promise<SendResult> {
  if (!env.RESEND_API_KEY) {
    console.log(`[email:dev] → ${params.to} · ${params.subject}`);
    return { sent: false, error: "no_resend_key" };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${env.RESEND_API_KEY}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_ADDRESS,
        to: params.to,
        reply_to: REPLY_TO,
        subject: params.subject,
        html: params.html,
      }),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error(`[email] resend ${res.status}:`, text);
      return { sent: false, error: `resend_${res.status}` };
    }
    const data = (await res.json().catch(() => null)) as { id?: string } | null;
    return { sent: true, id: data?.id };
  } catch (err) {
    console.error("[email] exception:", err);
    return { sent: false, error: "network" };
  }
}

// ── Shared template helpers ──────────────────────────────────────────────

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Outer shell: brand header + body slot + branded footer.
 * All emails must go through this wrapper for visual consistency.
 */
function shell(env: Env, headline: string, preheader: string, body: string): string {
  const base = getSiteUrl(env);
  const host = base.replace(/^https?:\/\//, "");
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${escapeHtml(headline)}</title>
</head>
<body style="margin:0;padding:40px 20px;background:#080808;color:#f5f5f5;font-family:-apple-system,'Inter',sans-serif;-webkit-text-size-adjust:100%;">
  <!-- preheader (hidden preview text) -->
  <span style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(preheader)}</span>
  <div style="max-width:520px;margin:0 auto;">

    <!-- Brand header -->
    <p style="font-size:11px;font-weight:700;letter-spacing:4px;text-transform:uppercase;color:#DBFF00;margin:0 0 8px 0;">CONCERTRIDE · ES</p>
    <div style="height:2px;background:linear-gradient(to right,#DBFF00,#ff4f00,transparent);margin:0 0 32px 0;"></div>

    ${body}

    <!-- Footer -->
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
            Recibes este correo porque<br/>tienes una cuenta en ${escapeHtml(host)}.<br/>
            <a href="${base}/profile" style="color:#555;text-decoration:underline;">Gestiona tus notificaciones</a>
          </p>
        </td>
      </tr>
    </table>

  </div>
</body>
</html>`;
}

/**
 * Primary CTA button — lime background, bold, uppercase.
 */
function cta(url: string, text: string): string {
  return `<a href="${url}" style="display:inline-block;background:#DBFF00;color:#000;padding:14px 28px;font-weight:700;text-transform:uppercase;letter-spacing:2px;text-decoration:none;font-size:12px;margin-bottom:4px;">${escapeHtml(text)}</a>`;
}

/**
 * Secondary ghost button — dark border, no fill.
 */
function ctaSecondary(url: string, text: string): string {
  return `<a href="${url}" style="display:inline-block;background:transparent;color:#aaa;padding:12px 24px;font-weight:600;text-transform:uppercase;letter-spacing:2px;text-decoration:none;border:1px solid #333;font-size:11px;">${escapeHtml(text)}</a>`;
}

/**
 * Info table: array of [label, value] rows rendered as a clean key-value block.
 */
function infoTable(rows: Array<[string, string]>): string {
  const rowsHtml = rows
    .map(
      ([label, value]) => `
      <tr>
        <td style="padding:8px 20px 8px 0;color:#555;font-size:13px;white-space:nowrap;vertical-align:top;">${escapeHtml(label)}</td>
        <td style="padding:8px 0;color:#e0e0e0;font-size:13px;font-weight:500;vertical-align:top;">${escapeHtml(value)}</td>
      </tr>`,
    )
    .join("");
  return `
  <div style="background:#101010;border:1px solid #1e1e1e;padding:4px 20px;margin:0 0 28px 0;">
    <table style="border-collapse:collapse;width:100%;">
      ${rowsHtml}
    </table>
  </div>`;
}

/**
 * Highlight box for important notices.
 * type: 'success' (lime) | 'warning' (orange) | 'info' (neutral) | 'danger' (red)
 */
function alertBox(message: string, type: "success" | "warning" | "info" | "danger" = "info"): string {
  const colors: Record<"success" | "warning" | "info" | "danger", { border: string; bg: string; text: string }> = {
    success: { border: "#DBFF00", bg: "#0f1500", text: "#DBFF00" },
    warning: { border: "#ff4f00", bg: "#150800", text: "#ff4f00" },
    info:    { border: "#333",    bg: "#111",    text: "#aaa"    },
    danger:  { border: "#cc3333", bg: "#150000", text: "#ff6666" },
  };
  const c = colors[type];
  return `
  <div style="border-left:3px solid ${c.border};background:${c.bg};padding:14px 18px;margin:0 0 28px 0;">
    <p style="color:${c.text};font-size:13px;line-height:1.6;margin:0;">${message}</p>
  </div>`;
}

/**
 * Small inline badge for status labels.
 */
function badge(label: string, type: "success" | "warning" | "danger" | "neutral" = "neutral"): string {
  const colors: Record<"success" | "warning" | "danger" | "neutral", { bg: string; color: string }> = {
    success: { bg: "#DBFF00", color: "#000" },
    warning: { bg: "#ff4f00", color: "#fff" },
    danger:  { bg: "#cc3333", color: "#fff" },
    neutral: { bg: "#222",    color: "#aaa" },
  };
  const c = colors[type];
  return `<span style="display:inline-block;background:${c.bg};color:${c.color};font-size:10px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;padding:3px 8px;">${escapeHtml(label)}</span>`;
}

// ── Password reset ───────────────────────────────────────────────────────
export function sendPasswordResetEmail(
  env: Env,
  email: string,
  url: string,
): Promise<SendResult> {
  const subject = "Restablece tu contraseña en ConcertRide";
  const html = shell(
    env,
    "Restablece tu contraseña",
    "El enlace expira en 30 minutos — si no lo pediste, ignora este email",
    `
    <h1 style="font-family:Georgia,serif;font-size:32px;line-height:1.1;margin:0 0 12px 0;letter-spacing:-0.5px;">Restablece tu contraseña.</h1>
    <p style="color:#888;margin:0 0 28px 0;line-height:1.6;font-size:15px;">Hemos recibido una solicitud para cambiar la contraseña de tu cuenta en ConcertRide.</p>

    ${alertBox(`⏱ Este enlace expira en <strong>30 minutos</strong> y solo puede usarse una vez. Si caduca, solicita uno nuevo desde la pantalla de inicio de sesión.`, "warning")}

    <p style="margin:0 0 8px 0;">${cta(url, "Cambiar contraseña")}</p>

    <p style="color:#444;font-size:12px;margin:20px 0 0 0;word-break:break-all;">¿El botón no funciona? Copia y pega esta URL en tu navegador:<br/><span style="color:#666;">${escapeHtml(url)}</span></p>

    ${alertBox(`🔒 Si <strong>no</strong> has solicitado restablecer tu contraseña, no necesitas hacer nada. Tu cuenta sigue siendo segura. Si tienes dudas, escríbenos a <a href="mailto:${REPLY_TO}" style="color:#aaa;">${REPLY_TO}</a>.`, "info")}
    `,
  );
  return sendEmail(env, { to: email, subject, html });
}

// ── Magic link (inicio de sesión sin contraseña) ─────────────────────────
export function sendMagicLinkEmail(
  env: Env,
  email: string,
  url: string,
): Promise<SendResult> {
  const subject = "Tu enlace de acceso a ConcertRide";
  const html = shell(
    env,
    "Tu enlace de acceso",
    "Accede a ConcertRide sin contraseña — el enlace expira en 15 minutos",
    `
    <h1 style="font-family:Georgia,serif;font-size:32px;line-height:1.1;margin:0 0 12px 0;letter-spacing:-0.5px;">Tu acceso de un clic.</h1>
    <p style="color:#888;margin:0 0 28px 0;line-height:1.6;font-size:15px;">Pulsa el botón para entrar a ConcertRide directamente, sin necesidad de contraseña.</p>

    ${alertBox(`⏱ Este enlace es de uso único y expira en <strong>15 minutos</strong>. No lo compartas con nadie.`, "warning")}

    <p style="margin:0 0 8px 0;">${cta(url, "Acceder a mi cuenta")}</p>

    <p style="color:#444;font-size:12px;margin:20px 0 0 0;word-break:break-all;">¿El botón no funciona? Copia esta URL en tu navegador:<br/><span style="color:#666;">${escapeHtml(url)}</span></p>

    ${alertBox(`🔒 Si <strong>no</strong> has solicitado este enlace, ignora este email. Tu cuenta no se verá afectada.`, "info")}
    `,
  );
  return sendEmail(env, { to: email, subject, html });
}

// ── Welcome + email verification (post-register) ─────────────────────────
export function sendWelcomeEmail(
  env: Env,
  email: string,
  name: string,
  verifyUrl: string,
): Promise<SendResult> {
  const base = getSiteUrl(env);
  const subject = "Bienvenid@ a ConcertRide 🎶 — verifica tu email";
  const html = shell(
    env,
    "Bienvenid@ a ConcertRide",
    "Verifica tu email para empezar a reservar y publicar viajes",
    `
    <h1 style="font-family:Georgia,serif;font-size:32px;line-height:1.1;margin:0 0 12px 0;letter-spacing:-0.5px;">Hola, ${escapeHtml(name)}. 👋</h1>
    <p style="color:#ccc;margin:0 0 16px 0;line-height:1.6;font-size:15px;">Gracias por unirte a ConcertRide. Antes de nada, <strong style="color:#DBFF00;">verifica tu email</strong> para poder publicar viajes y reservar plazas:</p>

    <p style="margin:0 0 8px 0;">${cta(verifyUrl, "Verificar mi email")}</p>
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

    <p style="margin:0 0 8px 0;">${ctaSecondary(`${base}/concerts`, "Ver conciertos disponibles")}</p>

    <p style="color:#444;font-size:12px;margin-top:32px;line-height:1.7;">¿Tienes alguna duda? Responde directamente a este correo y te ayudamos.</p>
    `,
  );
  return sendEmail(env, { to: email, subject, html });
}

// ── Seat requested (→ driver) ────────────────────────────────────────────
export function sendSeatRequestedEmail(
  env: Env,
  driverEmail: string,
  args: {
    driverName: string;
    passengerName: string;
    seats: number;
    artist: string;
    origin: string;
    rideUrl: string;
    instantBooking: boolean;
  },
): Promise<SendResult> {
  const seatsLabel = `${args.seats} plaza${args.seats === 1 ? "" : "s"}`;
  const subject = args.instantBooking
    ? `Nueva reserva para ${args.artist} — ${seatsLabel}`
    : `Solicitud de plaza para ${args.artist} — ${seatsLabel}`;

  const statusBadge = args.instantBooking
    ? badge("Reserva automática", "success")
    : badge("Requiere confirmación", "warning");

  const actionText = args.instantBooking
    ? `<strong style="color:#DBFF00;">${escapeHtml(args.passengerName)}</strong> ha reservado ${seatsLabel} en tu viaje. La plaza queda confirmada automáticamente.`
    : `<strong style="color:#DBFF00;">${escapeHtml(args.passengerName)}</strong> quiere ${seatsLabel} en tu viaje. Confírmala o recházala cuanto antes para que no pierda la oportunidad.`;

  const ctaLabel = args.instantBooking ? "Ver detalles del viaje" : "Revisar y responder";

  const tip = args.instantBooking
    ? alertBox(`✅ No necesitas hacer nada más. El pasajero ha sido notificado. Recibirás un recordatorio 24h antes de la salida.`, "success")
    : alertBox(`⚡ Los conductores que responden en menos de 2 horas reciben mejores valoraciones. ¡No dejes esperando a ${escapeHtml(args.passengerName)}!`, "warning");

  const html = shell(
    env,
    subject,
    `${args.passengerName} · ${seatsLabel} · ${args.artist}`,
    `
    <h1 style="font-family:Georgia,serif;font-size:28px;line-height:1.15;margin:0 0 12px 0;">Hola, ${escapeHtml(args.driverName)}.</h1>
    <p style="margin:0 0 6px 0;">${statusBadge}</p>
    <p style="color:#ccc;margin:12px 0 24px 0;line-height:1.6;font-size:15px;">${actionText}</p>

    ${infoTable([
      ["Concierto", args.artist],
      ["Salida desde", args.origin],
      ["Plazas", seatsLabel],
      ["Pasajero", args.passengerName],
    ])}

    ${tip}

    <p style="margin:0 0 8px 0;">${cta(args.rideUrl, ctaLabel)}</p>
    `,
  );
  return sendEmail(env, { to: driverEmail, subject, html });
}

// ── Seat accepted / rejected (→ passenger) ───────────────────────────────
export function sendSeatDecisionEmail(
  env: Env,
  passengerEmail: string,
  args: {
    passengerName: string;
    driverName: string;
    artist: string;
    origin: string;
    rideUrl: string;
    status: "confirmed" | "rejected";
  },
): Promise<SendResult> {
  const base = getSiteUrl(env);
  const confirmed = args.status === "confirmed";

  const subject = confirmed
    ? `¡Plaza confirmada para ${args.artist}! 🎉`
    : `Tu solicitud para ${args.artist} no fue aceptada`;

  const headline = confirmed
    ? "¡Plaza confirmada! 🎉"
    : "No hay plaza esta vez.";

  const statusBadge = confirmed
    ? badge("Confirmado", "success")
    : badge("No aceptado", "danger");

  const body = confirmed
    ? `
    <p style="color:#ccc;margin:12px 0 24px 0;line-height:1.6;font-size:15px;"><strong style="color:#DBFF00;">${escapeHtml(args.driverName)}</strong> ha confirmado tu plaza en el viaje a <strong style="color:#fff;">${escapeHtml(args.artist)}</strong>. ¡Todo listo!</p>

    ${infoTable([
      ["Concierto", args.artist],
      ["Salida desde", args.origin],
      ["Conductor", args.driverName],
    ])}

    ${alertBox(`📅 Recibirás un recordatorio <strong>24 horas antes</strong> y otro <strong>1 hora antes</strong> de la salida. Coordina el punto de encuentro con el conductor desde el chat del viaje.`, "info")}

    <p style="margin:0 0 8px 0;">${cta(args.rideUrl, "Ver el viaje")}</p>
    `
    : `
    <p style="color:#ccc;margin:12px 0 24px 0;line-height:1.6;font-size:15px;">${escapeHtml(args.driverName)} no ha podido aceptar tu solicitud para el viaje a <strong style="color:#fff;">${escapeHtml(args.artist)}</strong> desde ${escapeHtml(args.origin)}. No te preocupes — hay más opciones.</p>

    ${alertBox(`🔍 Sigue buscando: puede haber otros viajes publicados para este concierto. También puedes marcar interés para recibir un aviso cuando aparezca uno nuevo.`, "info")}

    <p style="margin:0 0 12px 0;">${cta(`${base}/concerts`, "Buscar otro viaje")}</p>
    <p style="margin:0;">${ctaSecondary(args.rideUrl, "Ver el viaje original")}</p>
    `;

  const html = shell(
    env,
    subject,
    `${args.artist} · ${args.origin} · ${confirmed ? "Plaza confirmada" : "Solicitud no aceptada"}`,
    `
    <h1 style="font-family:Georgia,serif;font-size:28px;line-height:1.15;margin:0 0 12px 0;">Hola, ${escapeHtml(args.passengerName)}. ${headline}</h1>
    <p style="margin:0 0 4px 0;">${statusBadge}</p>
    ${body}
    `,
  );
  return sendEmail(env, { to: passengerEmail, subject, html });
}

// ── Ride reminder 24h (→ driver + confirmed passengers) ──────────────────
export function sendRideReminderEmail(
  env: Env,
  email: string,
  args: {
    name: string;
    role: "driver" | "passenger";
    artist: string;
    departureLocal: string;
    origin: string;
    venueCity: string;
    rideUrl: string;
  },
): Promise<SendResult> {
  const subject = `Mañana: ${args.artist} · salida desde ${args.origin}`;
  const isDriver = args.role === "driver";

  const roleTip = isDriver
    ? alertBox(`🚗 Como conductor, recuerda contactar con tus pasajeros para afinar el punto de recogida y confirmar que todos estarán listos a tiempo.`, "info")
    : alertBox(`🎟️ Recuerda coordinar con el conductor el punto exacto de encuentro. Si algo cambia en el último momento, contáctale directamente desde el chat del viaje.`, "info");

  const checklist = isDriver
    ? `
    <p style="color:#666;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin:28px 0 12px 0;">Checklist para mañana</p>
    <ul style="color:#888;font-size:13px;line-height:2;margin:0 0 24px 0;padding-left:20px;">
      <li>Confirma el punto de recogida con todos tus pasajeros</li>
      <li>Revisa que tu vehículo tiene plazas libres y combustible suficiente</li>
      <li>Ten a mano el método de pago acordado</li>
      <li>Lleva el número de teléfono de los pasajeros</li>
    </ul>`
    : `
    <p style="color:#666;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin:28px 0 12px 0;">Checklist para mañana</p>
    <ul style="color:#888;font-size:13px;line-height:2;margin:0 0 24px 0;padding-left:20px;">
      <li>Confirma el punto de recogida con el conductor</li>
      <li>Prepara el método de pago acordado</li>
      <li>Lleva el número del conductor por si necesitas contactarle</li>
      <li>Llega al punto de encuentro con 5 minutos de antelación</li>
    </ul>`;

  const html = shell(
    env,
    subject,
    `Salida mañana desde ${args.origin} — ${args.departureLocal}`,
    `
    <h1 style="font-family:Georgia,serif;font-size:28px;line-height:1.15;margin:0 0 12px 0;">Mañana es el día. 🎶</h1>
    <p style="color:#ccc;margin:0 0 24px 0;line-height:1.7;font-size:15px;">Hola, ${escapeHtml(args.name)}. Tu viaje a <strong style="color:#DBFF00;">${escapeHtml(args.artist)}</strong> en ${escapeHtml(args.venueCity)} sale mañana.</p>

    ${infoTable([
      ["Concierto", args.artist],
      ["Ciudad del concierto", args.venueCity],
      ["Salida desde", args.origin],
      ["Hora de salida", args.departureLocal],
      ["Tu rol", isDriver ? "Conductor" : "Pasajero"],
    ])}

    ${roleTip}
    ${checklist}

    <p style="margin:0 0 8px 0;">${cta(args.rideUrl, "Ver el viaje")}</p>
    `,
  );
  return sendEmail(env, { to: email, subject, html });
}

// ── Ride payment reminder (→ driver + passengers, 1h before) ──────────────
export function sendPaymentReminderEmail(
  env: Env,
  email: string,
  args: {
    name: string;
    role: "driver" | "passenger";
    artist: string;
    departureLocal: string;
    origin: string;
    venueCity: string;
    passengerCount: number;
    paymentMethod: string;
    rideUrl: string;
  },
): Promise<SendResult> {
  const subject = `En 1 hora: ${args.artist} · salida desde ${args.origin}`;
  const isDriver = args.role === "driver";

  const roleLine = isDriver
    ? `Verifica que todos tus pasajeros están en camino. Si alguien no se presenta, puedes cancelar su plaza desde el viaje.`
    : `¡Asegúrate de estar ya en camino al punto de recogida! El conductor cuenta contigo.`;

  const paymentNote = isDriver
    ? alertBox(`💳 Método de pago acordado: <strong>${escapeHtml(args.paymentMethod)}</strong>. Recuerda cobrarlo al llegar al destino o antes de subir al coche, según lo pactado.`, "warning")
    : alertBox(`💳 Recuerda llevar el pago preparado: <strong>${escapeHtml(args.paymentMethod)}</strong>. Consúltalo con el conductor si tienes dudas.`, "warning");

  const driverRow: Array<[string, string]> = isDriver
    ? [["Pasajeros", `${args.passengerCount} confirmado${args.passengerCount === 1 ? "" : "s"}`]]
    : [];

  const html = shell(
    env,
    subject,
    `¡Ya casi! Salida en 1 hora desde ${args.origin}`,
    `
    <h1 style="font-family:Georgia,serif;font-size:28px;line-height:1.15;margin:0 0 12px 0;">¡Ya casi llega la hora! 🚗</h1>
    <p style="color:#ccc;margin:0 0 24px 0;line-height:1.7;font-size:15px;">Hola, ${escapeHtml(args.name)}. Tu viaje a <strong style="color:#DBFF00;">${escapeHtml(args.artist)}</strong> sale en <strong style="color:#ff4f00;">1 hora</strong>.</p>

    ${infoTable([
      ["Concierto", args.artist],
      ["Ciudad", args.venueCity],
      ["Salida desde", args.origin],
      ["Hora de salida", args.departureLocal],
      ...driverRow,
    ])}

    ${paymentNote}

    <p style="color:#ccc;margin:0 0 24px 0;line-height:1.6;font-size:14px;">${roleLine}</p>

    <p style="margin:0 0 8px 0;">${cta(args.rideUrl, "Ver el viaje")}</p>
    `,
  );
  return sendEmail(env, { to: email, subject, html });
}

// ── Ride completed → review prompt (→ passenger + driver) ───────────────
export function sendReviewPromptEmail(
  env: Env,
  email: string,
  args: {
    name: string;
    otherPartyName: string;
    artist: string;
    rideUrl: string;
  },
): Promise<SendResult> {
  const subject = `¿Cómo fue el viaje a ${args.artist}?`;
  const html = shell(
    env,
    subject,
    `Deja una reseña a ${args.otherPartyName} — solo te lleva 1 minuto`,
    `
    <h1 style="font-family:Georgia,serif;font-size:28px;line-height:1.15;margin:0 0 12px 0;">Gracias por viajar con ConcertRide. 🎶</h1>
    <p style="color:#ccc;margin:0 0 24px 0;line-height:1.6;font-size:15px;">Hola, ${escapeHtml(args.name)}. ¿Qué tal fue el viaje a <strong style="color:#DBFF00;">${escapeHtml(args.artist)}</strong> con <strong style="color:#fff;">${escapeHtml(args.otherPartyName)}</strong>?</p>

    ${alertBox(`⭐ Las reseñas honestas son lo que hace que esta comunidad funcione. Solo te lleva un minuto y ayuda a que otros usuarios tomen mejores decisiones.`, "info")}

    <p style="color:#888;font-size:13px;line-height:1.8;margin:0 0 28px 0;">
      Tu opinión sobre <strong style="color:#ccc;">${escapeHtml(args.otherPartyName)}</strong> será visible en su perfil público.
      Cuéntanos si fue puntual, cómodo, amable, o si hubo algún problema.
    </p>

    <p style="margin:0 0 8px 0;">${cta(args.rideUrl, "Dejar una reseña")}</p>
    <p style="color:#444;font-size:12px;margin-top:16px;">Las reseñas se pueden escribir hasta 7 días después del viaje.</p>
    `,
  );
  return sendEmail(env, { to: email, subject, html });
}

// ── Demand match (→ user who signalled interest) ─────────────────────────
export function sendDemandMatchEmail(
  env: Env,
  email: string,
  args: {
    name: string;
    artist: string;
    origin: string;
    price: number;
    rideUrl: string;
  },
): Promise<SendResult> {
  const subject = `Hay nuevo viaje a ${args.artist} 🎶`;
  const html = shell(
    env,
    subject,
    `Desde ${args.origin} · €${args.price}/plaza — reserva antes de que se llene`,
    `
    <h1 style="font-family:Georgia,serif;font-size:28px;line-height:1.15;margin:0 0 12px 0;">Tu concierto tiene viaje. 🚗</h1>
    <p style="color:#ccc;margin:0 0 24px 0;line-height:1.6;font-size:15px;">Hola, ${escapeHtml(args.name)}. Alguien acaba de publicar un viaje a <strong style="color:#DBFF00;">${escapeHtml(args.artist)}</strong> desde ${escapeHtml(args.origin)}.</p>

    ${infoTable([
      ["Concierto", args.artist],
      ["Salida desde", args.origin],
      ["Precio por plaza", `€${args.price}`],
    ])}

    ${alertBox(`⚡ Las plazas se llenan rápido. Reserva cuanto antes para no quedarte sin sitio.`, "warning")}

    <p style="margin:0 0 8px 0;">${cta(args.rideUrl, "Reservar plaza")}</p>

    <p style="color:#3a3a3a;font-size:11px;margin-top:28px;line-height:1.6;">Recibes este correo porque marcaste interés en este concierto. Puedes deshabilitar estos avisos en tu <a href="${getSiteUrl(env)}/profile" style="color:#555;text-decoration:underline;">perfil</a>.</p>
    `,
  );
  return sendEmail(env, { to: email, subject, html });
}

// ── License review submitted → admin notification ────────────────────────
export function sendLicenseReviewAdminEmail(
  env: Env,
  args: {
    userName: string;
    userId: string;
    reviewId: string;
    fileUrl: string;
  },
): Promise<SendResult> {
  const subject = `[Admin] Nuevo carnet para verificar — ${args.userName}`;
  const adminUrl = `${getSiteUrl(env)}/admin`;
  const html = shell(
    env,
    subject,
    `Acción requerida: revisar carnet de ${args.userName}`,
    `
    <h1 style="font-family:Georgia,serif;font-size:24px;line-height:1.15;margin:0 0 12px 0;">Nuevo carnet pendiente de revisión.</h1>
    <p style="color:#ccc;margin:0 0 24px 0;line-height:1.6;font-size:15px;">Un usuario ha enviado su carnet de conducir para verificación. Revísalo en el panel de administración.</p>

    ${infoTable([
      ["Usuario", args.userName],
      ["User ID", args.userId],
      ["Review ID", args.reviewId],
    ])}

    ${alertBox(`🔍 Comprueba que el documento es legible, pertenece al usuario y está vigente. Aprueba o rechaza desde el panel admin indicando el motivo si procede.`, "info")}

    <p style="margin:0 0 12px 0;">${cta(args.fileUrl, "Ver documento")}</p>
    <p style="margin:0;">${ctaSecondary(adminUrl, "Ir al panel admin")}</p>
    `,
  );
  return sendEmail(env, { to: env.SUPPORT_EMAIL, subject, html });
}

// ── License review result → conductor ────────────────────────────────────
export function sendLicenseReviewResultEmail(
  env: Env,
  email: string,
  args: {
    name: string;
    approved: boolean;
    reason?: string;
  },
): Promise<SendResult> {
  const base = getSiteUrl(env);
  const subject = args.approved
    ? "Tu carnet ha sido verificado ✓"
    : "Tu carnet no ha podido ser verificado";

  const body = args.approved
    ? `
    <h1 style="font-family:Georgia,serif;font-size:28px;line-height:1.15;margin:0 0 12px 0;">Carnet verificado. ✅</h1>
    <p style="margin:0 0 4px 0;">${badge("Verificado", "success")}</p>
    <p style="color:#ccc;margin:16px 0 24px 0;line-height:1.6;font-size:15px;">Hola, ${escapeHtml(args.name)}. Hemos revisado tu carnet de conducir y todo está en orden. Ya puedes publicar viajes como conductor en ConcertRide.</p>

    ${alertBox(`🚗 Ya tienes acceso completo como conductor. Publica tu primer viaje en menos de 2 minutos y empieza a compartir gastos con otros fans.`, "success")}

    <p style="color:#666;font-size:11px;font-weight:700;letter-spacing:3px;text-transform:uppercase;margin:0 0 12px 0;">Próximos pasos</p>
    <ul style="color:#888;font-size:13px;line-height:2;margin:0 0 28px 0;padding-left:20px;">
      <li>Ve a <strong style="color:#ccc;">Publicar viaje</strong> e introduce los detalles del concierto</li>
      <li>Elige si prefieres reserva instantánea o aprobación manual</li>
      <li>Establece el precio por plaza y el método de pago</li>
      <li>¡Listo! Los fans interesados te contactarán</li>
    </ul>

    <p style="margin:0 0 8px 0;">${cta(`${base}/publish`, "Publicar mi primer viaje")}</p>
    `
    : `
    <h1 style="font-family:Georgia,serif;font-size:28px;line-height:1.15;margin:0 0 12px 0;">No hemos podido verificar tu carnet.</h1>
    <p style="margin:0 0 4px 0;">${badge("No verificado", "danger")}</p>
    <p style="color:#ccc;margin:16px 0 24px 0;line-height:1.6;font-size:15px;">Hola, ${escapeHtml(args.name)}. Lamentablemente no hemos podido verificar tu carnet de conducir.</p>

    ${args.reason ? alertBox(`<strong>Motivo:</strong> ${escapeHtml(args.reason)}`, "danger") : ""}

    <p style="color:#ccc;margin:0 0 24px 0;line-height:1.6;font-size:15px;">Puedes volver a intentarlo subiendo una imagen más clara del documento desde tu perfil. Asegúrate de que:</p>
    <ul style="color:#888;font-size:13px;line-height:2;margin:0 0 28px 0;padding-left:20px;">
      <li>La imagen está bien iluminada y sin reflejos</li>
      <li>Todos los datos son legibles (nombre, fecha, número)</li>
      <li>El carnet está vigente y no caducado</li>
      <li>Subes el anverso completo del documento</li>
    </ul>

    <p style="margin:0 0 8px 0;">${cta(`${base}/profile`, "Volver a intentarlo")}</p>
    <p style="color:#444;font-size:12px;margin-top:16px;">Si crees que es un error, responde a este correo y lo revisamos.</p>
    `;

  const html = shell(
    env,
    subject,
    args.approved ? "¡Ya puedes publicar viajes como conductor!" : "Puedes reintentar la verificación",
    body,
  );
  return sendEmail(env, { to: email, subject, html });
}

// ── Account ban notification → user ──────────────────────────────────────
export function sendBanNotificationEmail(
  env: Env,
  email: string,
  args: { name: string; reason: string },
): Promise<SendResult> {
  const subject = "Tu cuenta en ConcertRide ha sido suspendida";
  const html = shell(
    env,
    subject,
    "Información sobre la suspensión de tu cuenta en ConcertRide",
    `
    <h1 style="font-family:Georgia,serif;font-size:28px;line-height:1.15;margin:0 0 12px 0;">Cuenta suspendida.</h1>
    <p style="margin:0 0 4px 0;">${badge("Suspendida", "danger")}</p>
    <p style="color:#ccc;margin:16px 0 24px 0;line-height:1.6;font-size:15px;">Hola, ${escapeHtml(args.name)}. Tu cuenta en ConcertRide ha sido suspendida por incumplimiento de nuestras <a href="${getSiteUrl(env)}/terms" style="color:#888;text-decoration:underline;">normas de comunidad</a>.</p>

    ${alertBox(`<strong>Motivo de la suspensión:</strong><br/>${escapeHtml(args.reason)}`, "danger")}

    <p style="color:#888;font-size:13px;margin:0 0 12px 0;line-height:1.7;">Mientras tu cuenta esté suspendida, no podrás publicar viajes, realizar reservas ni acceder a los chats de los viajes activos.</p>

    ${alertBox(`📬 ¿Crees que se trata de un error? Responde a este correo con el asunto <strong>"Apelación de suspensión"</strong> y revisaremos tu caso en un plazo de 48–72 horas.`, "info")}

    <p style="color:#3a3a3a;font-size:12px;margin-top:24px;line-height:1.6;">ConcertRide se reserva el derecho de suspender o eliminar cuentas que incumplan los términos de servicio. Para más información consulta nuestras <a href="${getSiteUrl(env)}/terms" style="color:#555;text-decoration:underline;">condiciones de uso</a>.</p>
    `,
  );
  return sendEmail(env, { to: email, subject, html });
}
