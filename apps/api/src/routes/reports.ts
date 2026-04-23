import { Hono } from "hono";
import { z } from "zod";
import type { HonoEnv } from "../types";
import { requireUser } from "../lib/identity";
import { sendEmail } from "../lib/email";

const route = new Hono<HonoEnv>();

const createSchema = z
  .object({
    target_user_id: z.string().min(1).max(80).optional(),
    ride_id: z.string().min(1).max(80).optional(),
    reason: z.enum(["spam", "scam", "harassment", "no_show", "unsafe", "other"]),
    body: z.string().max(2000).optional(),
  })
  .refine((v) => !!v.target_user_id || !!v.ride_id, {
    message: "At least one of target_user_id or ride_id is required",
    path: ["target_user_id"],
  });

const REASON_LABEL: Record<string, string> = {
  spam: "Spam / contenido no deseado",
  scam: "Estafa / fraude",
  harassment: "Acoso / abuso",
  no_show: "No se presentó al viaje",
  unsafe: "Conducción peligrosa / inseguridad",
  other: "Otro",
};

// Soft cap to stop a single user reporting 100 people in a minute.
const DAILY_REPORT_CAP = 10;

route.post("/", async (c) => {
  const userOrResp = await requireUser(c);
  if (userOrResp instanceof Response) return userOrResp;

  const body = await c.req.json().catch(() => null);
  const parsed = createSchema.safeParse(body);
  if (!parsed.success) return c.json({ error: "bad_request", issues: parsed.error.issues }, 400);

  const dayAgo = new Date(Date.now() - 24 * 3600_000).toISOString();
  const recent = await c.var.store.countReportsByReporterSince(userOrResp.id, dayAgo);
  if (recent >= DAILY_REPORT_CAP) {
    return c.json(
      { error: "daily_limit", message: "Has alcanzado el límite diario de reportes." },
      429,
    );
  }

  // Catch FK violations (invalid target_user_id / ride_id) as 400 instead of
  // leaking a raw SQL error to the client.
  let report;
  try {
    report = await c.var.store.createReport(userOrResp.id, parsed.data);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (/FOREIGN KEY|foreign key/i.test(msg)) {
      return c.json(
        { error: "bad_request", message: "Usuario o viaje reportado no existe." },
        400,
      );
    }
    throw err;
  }

  // Fire-and-forget admin notification. Silently drops when SUPPORT_EMAIL /
  // RESEND_API_KEY aren't configured.
  if (c.env.SUPPORT_EMAIL) {
    c.executionCtx.waitUntil(
      sendEmail(c.env, {
        to: c.env.SUPPORT_EMAIL,
        subject: `[ConcertRide] Nuevo reporte: ${REASON_LABEL[report.reason] ?? report.reason}`,
        html: `<p>Reportado por <code>${userOrResp.id}</code> (${userOrResp.email})</p>
<p><strong>Motivo:</strong> ${REASON_LABEL[report.reason] ?? report.reason}</p>
<p><strong>Target user:</strong> ${report.target_user_id ?? "—"}<br/>
<strong>Ride:</strong> ${report.ride_id ?? "—"}</p>
<p><strong>Detalle:</strong><br/>${(report.body ?? "(sin detalles)").replace(/</g, "&lt;")}</p>
<p><em>ID: ${report.id}</em></p>`,
      }).then(() => undefined),
    );
  }

  return c.json(report, 201);
});

export default route;
