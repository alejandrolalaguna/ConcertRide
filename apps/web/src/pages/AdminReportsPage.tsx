import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { AlertTriangle, Check, X, Eye, ShieldCheck } from "lucide-react";
import type { Report, ReportStatus, User } from "@concertride/types";
import { api, ApiError } from "@/lib/api";
import { useSession } from "@/lib/session";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { LoadingSpinner } from "@/components/ui";

type HydratedReport = Report & { reporter: User | null; target_user: User | null };

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
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
