import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { AlertTriangle, Ban, Check, X, Eye, ShieldCheck, FileText, Users, Car, CalendarCheck, MapPin } from "lucide-react";
import type { AdminStats, LicenseReview, Report, ReportStatus, User } from "@concertride/types";
import { api, ApiError } from "@/lib/api";
import { useSession } from "@/lib/session";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { LoadingSpinner } from "@/components/ui";

type HydratedReport = Report & { reporter: User | null; target_user: User | null };
type HydratedLicenseReview = LicenseReview & { user: User | null };

const REASON_LABEL: Record<string, string> = {
  spam: "Spam",
  scam: "Estafa",
  harassment: "Acoso",
  no_show: "No-show",
  unsafe: "Inseguridad",
  other: "Otro",
};

const STATUS_LABEL: Record<ReportStatus, string> = {
  pending: "Pendiente",
  reviewed: "Revisado",
  resolved: "Resuelto",
  dismissed: "Descartado",
};

const TABS: { value: ReportStatus | "all"; label: string }[] = [
  { value: "pending", label: "Pendientes" },
  { value: "reviewed", label: "Revisados" },
  { value: "resolved", label: "Resueltos" },
  { value: "dismissed", label: "Descartados" },
  { value: "all", label: "Todos" },
];

export default function AdminReportsPage() {
  const { user, loading: sessionLoading } = useSession();
  const [allowed, setAllowed] = useState<"checking" | "yes" | "no">("checking");
  const [tab, setTab] = useState<ReportStatus | "all">("pending");
  const [reports, setReports] = useState<HydratedReport[]>([]);
  const [loading, setLoading] = useState(true);
  const [licenseReviews, setLicenseReviews] = useState<HydratedLicenseReview[]>([]);
  const [licenseLoading, setLicenseLoading] = useState(true);
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [banUserId, setBanUserId] = useState<string | null>(null);
  const [banReason, setBanReason] = useState("");
  const [stats, setStats] = useState<AdminStats | null>(null);

  useSeoMeta({
    title: "Admin · Reportes",
    canonical: "https://concertride.es/admin/reports",
    noindex: true,
  });

  // Server-side gate: only users in ADMIN_USER_IDS pass /api/admin/me.
  // We also check here client-side to avoid rendering anything while we wait.
  useEffect(() => {
    if (sessionLoading) return;
    if (!user) {
      setAllowed("no");
      return;
    }
    api.admin
      .me()
      .then(() => setAllowed("yes"))
      .catch((err) => {
        if (err instanceof ApiError && (err.status === 404 || err.status === 401)) {
          setAllowed("no");
        } else {
          setAllowed("no");
        }
      });
  }, [user, sessionLoading]);

  useEffect(() => {
    if (allowed !== "yes") return;
    setLoading(true);
    api.admin
      .listReports(tab === "all" ? undefined : tab)
      .then((r) => setReports(r.reports))
      .catch(() => setReports([]))
      .finally(() => setLoading(false));
  }, [allowed, tab]);

  useEffect(() => {
    if (allowed !== "yes") return;
    api.admin.stats().then(setStats).catch(() => {});
  }, [allowed]);

  useEffect(() => {
    if (allowed !== "yes") return;
    setLicenseLoading(true);
    api.admin
      .listLicenseReviews("pending")
      .then((r) => setLicenseReviews(r.reviews))
      .catch(() => setLicenseReviews([]))
      .finally(() => setLicenseLoading(false));
  }, [allowed]);

  async function approveLicense(id: string) {
    setLicenseReviews((prev) => prev.map((r) => r.id === id ? { ...r, status: "approved" as const } : r));
    try {
      await api.admin.approveLicenseReview(id);
      setLicenseReviews((prev) => prev.filter((r) => r.id !== id));
    } catch {
      const r = await api.admin.listLicenseReviews("pending").catch(() => ({ reviews: [] }));
      setLicenseReviews(r.reviews);
    }
  }

  async function rejectLicense(id: string) {
    if (!rejectReason.trim()) return;
    try {
      await api.admin.rejectLicenseReview(id, rejectReason.trim());
      setLicenseReviews((prev) => prev.filter((r) => r.id !== id));
      setRejectId(null);
      setRejectReason("");
    } catch {
      // keep state
    }
  }

  async function banUser(userId: string) {
    if (!banReason.trim()) return;
    try {
      await api.admin.banUser(userId, banReason.trim());
      setBanUserId(null);
      setBanReason("");
    } catch {
      // keep state
    }
  }

  async function changeStatus(id: string, status: ReportStatus) {
    const prev = reports;
    setReports((list) => list.map((r) => (r.id === id ? { ...r, status } : r)));
    try {
      await api.admin.updateReport(id, status);
      // If the current tab is filtered and this report no longer matches, drop it
      if (tab !== "all" && status !== tab) {
        setReports((list) => list.filter((r) => r.id !== id));
      }
    } catch {
      setReports(prev);
    }
  }

  if (sessionLoading || allowed === "checking") {
    return <LoadingSpinner text="Comprobando acceso…" />;
  }
  if (allowed === "no") return <Navigate to="/" replace />;

  return (
    <main id="main" className="min-h-dvh bg-cr-bg text-cr-text pt-14">
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
        <header className="space-y-2">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-secondary inline-flex items-center gap-2">
            <ShieldCheck size={12} /> Admin
          </p>
          <h1 className="font-display text-3xl md:text-4xl uppercase">Reportes de abuso</h1>
          <p className="font-mono text-xs text-cr-text-muted">
            Solo usuarios en <code className="text-cr-primary">ADMIN_USER_IDS</code>. Acciones auditadas por Cloudflare logs + Sentry.
          </p>
        </header>

        {/* ── Stats ────────────────────────────────────────────────────── */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: <Users size={14} />, label: "Usuarios", value: stats.users.total, sub: `+${stats.users.new_last_7d} esta semana` },
              { icon: <Car size={14} />, label: "Viajes activos", value: stats.rides.total_active, sub: `${stats.rides.seats_available} plazas libres` },
              { icon: <CalendarCheck size={14} />, label: "Reservas confirmadas", value: stats.bookings.confirmed_all_time, sub: `${stats.bookings.pending} pendientes` },
              { icon: <ShieldCheck size={14} />, label: "Conductores verificados", value: stats.users.license_verified, sub: `${stats.concerts.with_active_rides} conciertos con viaje` },
            ].map(({ icon, label, value, sub }) => (
              <div key={label} className="border border-cr-border bg-cr-surface p-4 space-y-1">
                <div className="flex items-center gap-1.5 text-cr-text-muted">
                  {icon}
                  <span className="font-sans text-[10px] uppercase tracking-[0.12em] font-semibold">{label}</span>
                </div>
                <p className="font-display text-3xl text-cr-primary">{value}</p>
                <p className="font-mono text-[10px] text-cr-text-dim">{sub}</p>
              </div>
            ))}
          </div>
        )}

        {stats && stats.top_cities.length > 0 && (
          <div className="border border-cr-border bg-cr-surface p-4 space-y-2">
            <div className="flex items-center gap-1.5 text-cr-text-muted mb-3">
              <MapPin size={13} />
              <span className="font-sans text-[10px] uppercase tracking-[0.12em] font-semibold">Top ciudades de origen</span>
            </div>
            <div className="flex flex-wrap gap-2">
              {stats.top_cities.map(({ city, ride_count }) => (
                <span key={city} className="font-sans text-xs border border-cr-border px-3 py-1 text-cr-text-muted">
                  {city} <span className="text-cr-primary font-semibold">{ride_count}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex gap-0 border-b border-cr-border">
          {TABS.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setTab(t.value)}
              className={`px-4 py-2 font-sans text-[11px] font-semibold uppercase tracking-[0.12em] border-b-2 transition-colors ${
                tab === t.value
                  ? "border-cr-secondary text-cr-secondary"
                  : "border-transparent text-cr-text-muted hover:text-cr-text"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>

        {loading ? (
          <LoadingSpinner text="Cargando reportes…" />
        ) : reports.length === 0 ? (
          <div className="border border-dashed border-cr-border p-12 text-center">
            <AlertTriangle size={28} className="mx-auto text-cr-text-dim mb-3" strokeWidth={1.5} />
            <p className="font-display text-xl uppercase text-cr-text-muted">
              Nada por aquí
            </p>
            <p className="font-sans text-sm text-cr-text-dim mt-1">
              No hay reportes con este filtro.
            </p>
          </div>
        ) : (
          <ul className="space-y-3">
            {reports.map((r) => (
              <li key={r.id} className="border border-cr-border bg-cr-surface p-4 space-y-3">
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-sans text-[10px] font-semibold uppercase tracking-[0.12em] bg-cr-secondary text-white px-2 py-0.5">
                        {REASON_LABEL[r.reason] ?? r.reason}
                      </span>
                      <span
                        className={`font-sans text-[10px] font-semibold uppercase tracking-[0.12em] border px-2 py-0.5 ${
                          r.status === "pending"
                            ? "border-cr-primary text-cr-primary"
                            : r.status === "resolved"
                              ? "border-cr-text-muted text-cr-text-muted"
                              : "border-cr-border text-cr-text-dim"
                        }`}
                      >
                        {STATUS_LABEL[r.status]}
                      </span>
                      <span className="font-mono text-[10px] text-cr-text-dim">
                        {new Date(r.created_at).toLocaleString("es-ES", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </span>
                    </div>

                    <div className="font-sans text-sm text-cr-text">
                      <span className="text-cr-text-muted">Reportado por</span>{" "}
                      <span className="font-semibold">
                        {r.reporter?.name ?? "Usuario desconocido"}
                      </span>{" "}
                      <span className="font-mono text-xs text-cr-text-dim">
                        ({r.reporter?.email ?? "?"})
                      </span>
                    </div>

                    {r.target_user && (
                      <div className="font-sans text-sm text-cr-text">
                        <span className="text-cr-text-muted">Contra</span>{" "}
                        <Link
                          to={`/drivers/${r.target_user.id}`}
                          className="font-semibold text-cr-primary hover:underline"
                        >
                          {r.target_user.name}
                        </Link>{" "}
                        <span className="font-mono text-xs text-cr-text-dim">
                          ({r.target_user.email})
                        </span>
                      </div>
                    )}

                    {r.ride_id && (
                      <div className="font-mono text-xs text-cr-text-muted">
                        Ride:{" "}
                        <Link to={`/rides/${r.ride_id}`} className="text-cr-primary hover:underline">
                          {r.ride_id}
                        </Link>
                      </div>
                    )}

                    {r.body && (
                      <p className="font-sans text-sm text-cr-text-muted bg-cr-bg border border-cr-border p-3 whitespace-pre-wrap break-words">
                        {r.body}
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 items-end">
                    <div className="flex flex-wrap gap-2">
                      {r.status !== "reviewed" && (
                        <button
                          type="button"
                          onClick={() => changeStatus(r.id, "reviewed")}
                          className="inline-flex items-center gap-1 font-sans text-[11px] font-semibold uppercase tracking-[0.1em] border border-cr-border text-cr-text-muted hover:border-cr-primary hover:text-cr-primary px-2.5 py-1.5 transition-colors"
                        >
                          <Eye size={11} /> Revisado
                        </button>
                      )}
                      {r.status !== "resolved" && (
                        <button
                          type="button"
                          onClick={() => changeStatus(r.id, "resolved")}
                          className="inline-flex items-center gap-1 font-sans text-[11px] font-semibold uppercase tracking-[0.1em] bg-cr-primary text-black px-2.5 py-1.5 hover:bg-cr-primary/90 transition-colors"
                        >
                          <Check size={11} /> Resuelto
                        </button>
                      )}
                      {r.status !== "dismissed" && (
                        <button
                          type="button"
                          onClick={() => changeStatus(r.id, "dismissed")}
                          className="inline-flex items-center gap-1 font-sans text-[11px] font-semibold uppercase tracking-[0.1em] border border-cr-border text-cr-text-dim hover:border-cr-secondary hover:text-cr-secondary px-2.5 py-1.5 transition-colors"
                        >
                          <X size={11} /> Descartar
                        </button>
                      )}
                    </div>
                    {r.target_user && !r.target_user.banned_at && (
                      <button
                        type="button"
                        onClick={() => { setBanUserId(r.target_user!.id); setBanReason(""); }}
                        className="inline-flex items-center gap-1 font-sans text-[11px] font-semibold uppercase tracking-[0.1em] border border-cr-secondary text-cr-secondary hover:bg-cr-secondary/10 px-2.5 py-1.5 transition-colors"
                      >
                        <Ban size={11} /> Banear usuario
                      </button>
                    )}
                    {r.target_user?.banned_at && (
                      <span className="font-sans text-[10px] text-cr-secondary border border-cr-secondary/40 px-2 py-1">Baneado</span>
                    )}
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
        {/* ── License reviews ─────────────────────────────────────────── */}
        <section className="space-y-4 pt-6 border-t border-cr-border">
          <header className="flex items-center gap-2">
            <FileText size={14} className="text-cr-primary" />
            <h2 className="font-display text-xl uppercase">Carnets pendientes</h2>
          </header>

          {licenseLoading ? (
            <LoadingSpinner text="Cargando carnets…" />
          ) : licenseReviews.length === 0 ? (
            <div className="border border-dashed border-cr-border p-8 text-center">
              <p className="font-sans text-sm text-cr-text-muted">No hay carnets pendientes.</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {licenseReviews.map((r) => (
                <li key={r.id} className="border border-cr-border bg-cr-surface p-4 space-y-3">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="space-y-1">
                      <p className="font-sans text-sm font-semibold text-cr-text">
                        {r.user?.name ?? "Usuario desconocido"}
                        <span className="font-mono text-xs text-cr-text-dim ml-2">({r.user?.email ?? "?"})</span>
                      </p>
                      <p className="font-mono text-[10px] text-cr-text-dim">
                        {new Date(r.submitted_at).toLocaleString("es-ES", { dateStyle: "short", timeStyle: "short" })}
                        {" · "}{r.id}
                      </p>
                      <a
                        href={`/api/auth/license-doc/${encodeURIComponent(r.file_kv_key)}`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 font-sans text-xs text-cr-primary hover:underline"
                      >
                        <FileText size={11} /> Ver documento
                      </a>
                    </div>

                    <div className="flex flex-wrap gap-2 items-start">
                      <button
                        type="button"
                        onClick={() => approveLicense(r.id)}
                        className="inline-flex items-center gap-1 font-sans text-[11px] font-semibold uppercase tracking-[0.1em] bg-cr-primary text-black px-2.5 py-1.5 hover:bg-cr-primary/90 transition-colors"
                      >
                        <Check size={11} /> Aprobar
                      </button>
                      <button
                        type="button"
                        onClick={() => { setRejectId(r.id); setRejectReason(""); }}
                        className="inline-flex items-center gap-1 font-sans text-[11px] font-semibold uppercase tracking-[0.1em] border border-cr-border text-cr-text-dim hover:border-cr-secondary hover:text-cr-secondary px-2.5 py-1.5 transition-colors"
                      >
                        <X size={11} /> Rechazar
                      </button>
                    </div>
                  </div>

                  {rejectId === r.id && (
                    <div className="flex gap-2 items-end pt-1">
                      <input
                        type="text"
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="Motivo del rechazo…"
                        className="flex-1 bg-cr-bg border border-cr-border font-sans text-xs px-3 py-2 text-cr-text placeholder:text-cr-text-dim focus:outline-none focus:border-cr-secondary"
                      />
                      <button
                        type="button"
                        onClick={() => rejectLicense(r.id)}
                        disabled={!rejectReason.trim()}
                        className="font-sans text-[11px] font-semibold uppercase tracking-[0.1em] bg-cr-secondary text-white px-3 py-2 disabled:opacity-40"
                      >
                        Confirmar
                      </button>
                      <button
                        type="button"
                        onClick={() => setRejectId(null)}
                        className="font-sans text-[11px] text-cr-text-dim px-2 py-2"
                      >
                        Cancelar
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {/* ── Ban modal ────────────────────────────────────────────────────── */}
      {banUserId && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-cr-surface border-2 border-cr-secondary w-full max-w-md p-6 space-y-4">
            <h2 className="font-display text-xl uppercase text-cr-secondary">Banear usuario</h2>
            <p className="font-sans text-sm text-cr-text-muted">
              El usuario recibirá un email de notificación y no podrá volver a iniciar sesión ni registrarse con el mismo email.
            </p>
            <textarea
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              placeholder="Motivo del ban (visible en el email al usuario)…"
              rows={3}
              className="w-full bg-cr-bg border border-cr-border font-sans text-xs px-3 py-2 text-cr-text placeholder:text-cr-text-dim focus:outline-none focus:border-cr-secondary resize-none"
            />
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => banUser(banUserId)}
                disabled={!banReason.trim()}
                className="flex-1 font-sans text-sm font-semibold uppercase tracking-[0.1em] bg-cr-secondary text-white py-2.5 disabled:opacity-40 transition-opacity"
              >
                Confirmar ban
              </button>
              <button
                type="button"
                onClick={() => { setBanUserId(null); setBanReason(""); }}
                className="font-sans text-sm text-cr-text-muted border border-cr-border px-4 py-2.5 hover:border-cr-primary hover:text-cr-primary transition-colors"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
