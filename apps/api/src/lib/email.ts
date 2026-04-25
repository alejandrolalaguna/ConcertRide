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
  <!-- preheader -->
  <span style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${escapeHtml(preheader)}</span>
  <div style="max-width:520px;margin:0 auto;">
    <p style="font-size:11px;font-weight:700;letter-spacing:4px;text-transform:uppercase;color:#DBFF00;margin:0 0 24px 0;">CONCERTRIDE · ES</p>
    ${body}
    <hr style="border:none;border-top:1px solid #222;margin:40px 0 16px 0;" />
    <p style="color:#555;font-size:11px;line-height:1.6;margin:0;">
      ConcertRide · Madrid, España · <a href="mailto:alejandrolalaguna@gmail.com" style="color:#888;text-decoration:underline;">alejandrolalaguna@gmail.com</a><br/>
      Recibes este correo porque tienes una cuenta en ${escapeHtml(host)}.
      <a href="${base}/profile" style="color:#888;text-decoration:underline;">Gestiona tus notificaciones</a>.
    </p>
  </div>
</body>
</html>`;
}

function cta(url: string, text: string): string {
  return `<a href="${url}" style="display:inline-block;background:#DBFF00;color:#000;padding:14px 28px;font-weight:700;text-transform:uppercase;letter-spacing:2px;text-decoration:none;border:2px solid #000;font-size:12px;">${escapeHtml(text)}</a>`;
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
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
    "El enlace expira en 30 minutos",
    `
    <h1 style="font-family:Georgia,serif;font-size:32px;line-height:1.1;margin:0 0 12px 0;letter-spacing:-0.5px;">Restablece tu contraseña.</h1>
    <p style="color:#888;margin:0 0 32px 0;line-height:1.6;">Pulsa el botón para crear una nueva contraseña. El enlace expira en 30 minutos y solo funciona una vez.</p>
    ${cta(url, "Cambiar contraseña")}
    <p style="color:#666;font-size:12px;margin-top:32px;word-break:break-all;">¿No puedes pulsar? Copia esta URL: ${escapeHtml(url)}</p>
    <p style="color:#555;font-size:12px;margin-top:24px;">Si no pediste restablecer tu contraseña, ignora este correo.</p>
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
  const subject = "Bienvenid@ a ConcertRide 🎶 — verifica tu email";
  const html = shell(
    env,
    "Bienvenid@ a ConcertRide",
    "Verifica tu email para empezar",
    `
    <h1 style="font-family:Georgia,serif;font-size:32px;line-height:1.1;margin:0 0 12px 0;letter-spacing:-0.5px;">Hola, ${escapeHtml(name)}. 👋</h1>
    <p style="color:#ccc;margin:0 0 16px 0;line-height:1.6;font-size:15px;">Gracias por unirte a ConcertRide. Antes de nada, <strong style="color:#DBFF00;">verifica tu email</strong> para poder publicar viajes y reservar plazas:</p>
    ${cta(verifyUrl, "Verificar mi email")}
    <p style="color:#666;font-size:12px;margin-top:16px;">El enlace expira en 7 días.</p>
    <p style="color:#ccc;margin:24px 0 12px 0;line-height:1.6;font-size:15px;">Mientras tanto, lo que puedes hacer en la plataforma:</p>
    <ul style="color:#ccc;margin:0 0 24px 0;padding-left:20px;line-height:1.8;">
      <li><strong style="color:#DBFF00;">Publicar un viaje</strong> si vas en coche a un concierto y quieres compartir gastos.</li>
      <li><strong style="color:#DBFF00;">Reservar plaza</strong> en un viaje publicado por otros fans.</li>
      <li><strong style="color:#DBFF00;">Seguir</strong> artistas, conciertos o ciudades para recibir avisos.</li>
    </ul>
    <p style="color:#666;font-size:12px;margin-top:24px;">Si tienes cualquier duda, responde a este correo o escríbenos a alejandrolalaguna@gmail.com.</p>
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
  const subject = args.instantBooking
    ? `Nueva reserva para ${args.artist}`
    : `Solicitud de plaza para ${args.artist}`;
  const action = args.instantBooking
    ? `${escapeHtml(args.passengerName)} ha <strong style="color:#DBFF00;">reservado ${args.seats} plaza${args.seats === 1 ? "" : "s"}</strong> en tu viaje a ${escapeHtml(args.artist)} desde ${escapeHtml(args.origin)}.`
    : `${escapeHtml(args.passengerName)} quiere <strong style="color:#DBFF00;">${args.seats} plaza${args.seats === 1 ? "" : "s"}</strong> en tu viaje a ${escapeHtml(args.artist)} desde ${escapeHtml(args.origin)}. Confírmala o recházala cuanto antes.`;
  const html = shell(
    env,
    subject,
    `${args.passengerName} — ${args.seats} plaza${args.seats === 1 ? "" : "s"}`,
    `
    <h1 style="font-family:Georgia,serif;font-size:28px;line-height:1.15;margin:0 0 12px 0;">Hola, ${escapeHtml(args.driverName)}.</h1>
    <p style="color:#ccc;margin:0 0 32px 0;line-height:1.6;font-size:15px;">${action}</p>
    ${cta(args.rideUrl, args.instantBooking ? "Ver detalles del viaje" : "Revisar solicitud")}
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
  const confirmed = args.status === "confirmed";
  const subject = confirmed
    ? `¡Plaza confirmada para ${args.artist}! 🎉`
    : `Tu solicitud para ${args.artist} no fue aceptada`;
  const body = confirmed
    ? `<p style="color:#ccc;margin:0 0 24px 0;line-height:1.6;font-size:15px;"><strong style="color:#DBFF00;">${escapeHtml(args.driverName)}</strong> ha aceptado tu solicitud de plaza en el viaje a ${escapeHtml(args.artist)} desde ${escapeHtml(args.origin)}. Te enviaremos un recordatorio 24h antes.</p>
       ${cta(args.rideUrl, "Ver el viaje")}`
    : `<p style="color:#ccc;margin:0 0 24px 0;line-height:1.6;font-size:15px;">${escapeHtml(args.driverName)} no ha podido aceptar tu solicitud de plaza en el viaje a ${escapeHtml(args.artist)} desde ${escapeHtml(args.origin)}. No te preocupes: hay más viajes publicados para este concierto.</p>
       ${cta(`${getSiteUrl(env)}/concerts`, "Buscar otro viaje")}`;
  const html = shell(env, subject, `${args.artist} · ${args.origin}`, `
    <h1 style="font-family:Georgia,serif;font-size:28px;line-height:1.15;margin:0 0 12px 0;">Hola, ${escapeHtml(args.passengerName)}.</h1>
    ${body}
    `);
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
  const roleLine = args.role === "driver"
    ? "Recuerda contactar con tus pasajeros para afinar el punto de encuentro."
    : "Recuerda contactar con el conductor si aún no habéis acordado el punto exacto de encuentro.";
  const html = shell(
    env,
    subject,
    `Salida ${args.departureLocal}`,
    `
    <h1 style="font-family:Georgia,serif;font-size:28px;line-height:1.15;margin:0 0 12px 0;">Mañana es el día. 🎶</h1>
    <p style="color:#ccc;margin:0 0 20px 0;line-height:1.7;font-size:15px;">Hola, ${escapeHtml(args.name)}. Tu viaje a <strong style="color:#DBFF00;">${escapeHtml(args.artist)}</strong> en ${escapeHtml(args.venueCity)} sale mañana.</p>
    <table style="border-collapse:collapse;margin:0 0 24px 0;color:#aaa;font-size:14px;">
      <tr><td style="padding:4px 16px 4px 0;color:#666;">Salida</td><td style="padding:4px 0;color:#fff;">${escapeHtml(args.departureLocal)}</td></tr>
      <tr><td style="padding:4px 16px 4px 0;color:#666;">Origen</td><td style="padding:4px 0;color:#fff;">${escapeHtml(args.origin)}</td></tr>
    </table>
    <p style="color:#ccc;margin:0 0 24px 0;line-height:1.6;font-size:14px;">${roleLine}</p>
    ${cta(args.rideUrl, "Ver el viaje")}
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
  const driverDetails = args.role === "driver"
    ? `<tr><td style="padding:4px 16px 4px 0;color:#666;">Pasajeros</td><td style="padding:4px 0;color:#fff;">${args.passengerCount} confirmados</td></tr>`
    : "";
  const roleLine = args.role === "driver"
    ? "Verifica que todos tus pasajeros están listos. Si alguien no se presenta, puedes cancelar desde la app."
    : "Asegúrate de que estés listo en el punto de recogida. Contacta al conductor si tienes dudas.";
  const html = shell(
    env,
    subject,
    `¡Ya casi! Salida en 1 hora`,
    `
    <h1 style="font-family:Georgia,serif;font-size:28px;line-height:1.15;margin:0 0 12px 0;">¡Ya casi llega la hora! 🎶</h1>
    <p style="color:#ccc;margin:0 0 20px 0;line-height:1.7;font-size:15px;">Hola, ${escapeHtml(args.name)}. Tu viaje a <strong style="color:#DBFF00;">${escapeHtml(args.artist)}</strong> sale en <strong style="color:#ff4f00;">1 hora</strong>.</p>
    <table style="border-collapse:collapse;margin:0 0 24px 0;color:#aaa;font-size:14px;">
      <tr><td style="padding:4px 16px 4px 0;color:#666;">Salida</td><td style="padding:4px 0;color:#fff;">${escapeHtml(args.departureLocal)}</td></tr>
      <tr><td style="padding:4px 16px 4px 0;color:#666;">Origen</td><td style="padding:4px 0;color:#fff;">${escapeHtml(args.origin)}</td></tr>
      <tr><td style="padding:4px 16px 4px 0;color:#666;">Pago</td><td style="padding:4px 0;color:#fff;">${escapeHtml(args.paymentMethod)}</td></tr>
      ${driverDetails}
    </table>
    <p style="color:#ccc;margin:0 0 24px 0;line-height:1.6;font-size:14px;">${roleLine}</p>
    ${cta(args.rideUrl, "Ver el viaje")}
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
    `Deja una reseña a ${args.otherPartyName}`,
    `
    <h1 style="font-family:Georgia,serif;font-size:28px;line-height:1.15;margin:0 0 12px 0;">Gracias por viajar con ConcertRide.</h1>
    <p style="color:#ccc;margin:0 0 24px 0;line-height:1.6;font-size:15px;">Hola, ${escapeHtml(args.name)}. ¿Qué tal fue el viaje a ${escapeHtml(args.artist)} con <strong style="color:#DBFF00;">${escapeHtml(args.otherPartyName)}</strong>? Las reseñas honestas son lo que hace que esta comunidad funcione.</p>
    ${cta(args.rideUrl, "Dejar una reseña")}
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
    `Desde ${args.origin} · €${args.price}/plaza`,
    `
    <h1 style="font-family:Georgia,serif;font-size:28px;line-height:1.15;margin:0 0 12px 0;">Tu concierto tiene viaje. 🚗</h1>
    <p style="color:#ccc;margin:0 0 20px 0;line-height:1.6;font-size:15px;">Hola, ${escapeHtml(args.name)}. Alguien acaba de publicar un viaje a <strong style="color:#DBFF00;">${escapeHtml(args.artist)}</strong> desde ${escapeHtml(args.origin)}, a €${args.price}/plaza.</p>
    ${cta(args.rideUrl, "Reservar plaza")}
    <p style="color:#666;font-size:12px;margin-top:24px;">Recibes este correo porque marcaste interés en este concierto. Puedes deshabilitar estos avisos en tu perfil.</p>
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
    `Acción requerida: revisar carnet`,
    `
    <h1 style="font-family:Georgia,serif;font-size:24px;line-height:1.15;margin:0 0 12px 0;">Nuevo carnet de conducir pendiente.</h1>
    <p style="color:#ccc;margin:0 0 8px 0;line-height:1.6;font-size:15px;"><strong style="color:#DBFF00;">${escapeHtml(args.userName)}</strong> (ID: ${escapeHtml(args.userId)}) ha enviado su carnet para verificación.</p>
    <p style="color:#ccc;margin:0 0 24px 0;line-height:1.6;font-size:15px;">Review ID: <code style="color:#DBFF00;">${escapeHtml(args.reviewId)}</code></p>
    <p style="margin:0 0 12px 0;">${cta(args.fileUrl, "Ver documento")}</p>
    <p style="margin:0 0 24px 0;">${cta(adminUrl, "Ir al panel admin")}</p>
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
  const subject = args.approved
    ? "Tu carnet ha sido verificado ✓"
    : "Tu carnet no ha podido ser verificado";
  const html = shell(
    env,
    subject,
    args.approved ? "¡Ya puedes publicar viajes!" : "Puedes intentarlo de nuevo",
    args.approved
      ? `
    <h1 style="font-family:Georgia,serif;font-size:28px;line-height:1.15;margin:0 0 12px 0;">Carnet verificado. 🎉</h1>
    <p style="color:#ccc;margin:0 0 24px 0;line-height:1.6;font-size:15px;">Hola, ${escapeHtml(args.name)}. Hemos revisado tu carnet de conducir y todo está en orden. Ya puedes publicar viajes como conductor en ConcertRide.</p>
    ${cta(`${getSiteUrl(env)}/publish`, "Publicar mi primer viaje")}
    `
      : `
    <h1 style="font-family:Georgia,serif;font-size:28px;line-height:1.15;margin:0 0 12px 0;">No hemos podido verificar tu carnet.</h1>
    <p style="color:#ccc;margin:0 0 16px 0;line-height:1.6;font-size:15px;">Hola, ${escapeHtml(args.name)}. Lamentablemente no hemos podido verificar tu carnet de conducir.</p>
    ${args.reason ? `<p style="color:#ccc;margin:0 0 24px 0;line-height:1.6;font-size:15px;"><strong>Motivo:</strong> ${escapeHtml(args.reason)}</p>` : ""}
    <p style="color:#ccc;margin:0 0 24px 0;line-height:1.6;font-size:15px;">Puedes volver a intentarlo desde tu perfil subiendo una imagen más clara del documento.</p>
    ${cta(`${getSiteUrl(env)}/profile`, "Volver a intentarlo")}
    `,
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
    "Información sobre tu cuenta",
    `
    <h1 style="font-family:Georgia,serif;font-size:28px;line-height:1.15;margin:0 0 12px 0;">Cuenta suspendida.</h1>
    <p style="color:#ccc;margin:0 0 16px 0;line-height:1.6;font-size:15px;">Hola, ${escapeHtml(args.name)}. Tu cuenta en ConcertRide ha sido suspendida por incumplimiento de nuestras normas de comunidad.</p>
    <p style="color:#ccc;margin:0 0 24px 0;line-height:1.6;font-size:15px;"><strong>Motivo:</strong> ${escapeHtml(args.reason)}</p>
    <p style="color:#888;font-size:13px;margin-top:24px;line-height:1.6;">Si crees que se trata de un error, responde a este correo con el asunto "Apelación de suspensión" y lo revisaremos.</p>
    `,
  );
  return sendEmail(env, { to: email, subject, html });
}

// Legacy stub kept for backwards-compat with any old callers. Not wired.
export function sendMagicLinkEmail(
  _env: Env,
  email: string,
  _url: string,
): Promise<SendResult> {
  console.warn(`[email] sendMagicLinkEmail called for ${email} — magic-link flow is disabled`);
  return Promise.resolve({ sent: false, error: "disabled" });
}
