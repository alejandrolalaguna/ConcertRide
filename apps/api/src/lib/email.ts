import type { Env } from "../env";

interface SendResult {
  sent: boolean;
  dev_link?: string;
  error?: string;
}

export async function sendMagicLinkEmail(
  env: Env,
  email: string,
  url: string,
): Promise<SendResult> {
  if (!env.RESEND_API_KEY) {
    console.log(`[dev] magic link for ${email} → ${url}`);
    return { sent: false, dev_link: url };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        authorization: `Bearer ${env.RESEND_API_KEY}`,
        "content-type": "application/json",
      },
      body: JSON.stringify({
        from: "ConcertRide <no-reply@concertride.es>",
        to: email,
        subject: "Tu acceso a ConcertRide",
        html: renderEmail(url),
      }),
    });
    if (!res.ok) {
      const text = await res.text().catch(() => "");
      console.error("resend error", res.status, text);
      return { sent: false, error: `resend_${res.status}` };
    }
    return { sent: true };
  } catch (err) {
    console.error("resend exception", err);
    return { sent: false, error: "network" };
  }
}

function renderEmail(url: string): string {
  return `<!DOCTYPE html>
<html><body style="margin:0;padding:40px;background:#080808;color:#f5f5f5;font-family:-apple-system,'Inter',sans-serif;">
  <div style="max-width:480px;margin:0 auto;">
    <p style="font-size:11px;font-weight:700;letter-spacing:4px;text-transform:uppercase;color:#DBFF00;">CONCERTRIDE · ES</p>
    <h1 style="font-family:Georgia,serif;font-size:36px;line-height:1.05;margin:16px 0 8px 0;letter-spacing:-1px;">Tu acceso al show.</h1>
    <p style="color:#888;margin:0 0 32px 0;">Pulsa el botón para entrar. El enlace expira en 15 minutos y solo funciona una vez.</p>
    <a href="${url}" style="display:inline-block;background:#DBFF00;color:#000;padding:16px 28px;font-weight:700;text-transform:uppercase;letter-spacing:2px;text-decoration:none;border:2px solid #000;font-size:13px;">Entrar</a>
    <p style="color:#666;font-size:12px;margin-top:40px;word-break:break-all;">o copia esta URL: ${url}</p>
    <p style="color:#444;font-size:11px;margin-top:32px;">Si no pediste este acceso, ignora este correo.</p>
  </div>
</body></html>`;
}
