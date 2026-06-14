import { useEffect, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { AlertTriangle, Ban, Check, X, Eye, ShieldCheck, FileText, Users, Car, CalendarCheck, MapPin } from "lucide-react";
import type { AdminStats, LicenseReview, Report, ReportStatus, User } from "@concertride/types";
import { toast } from "sonner";
import { api, ApiError } from "@/lib/api";
import { useSession } from "@/lib/session";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { useI18n } from "@/lib/i18n";
import { SITE_URL } from "@/lib/siteUrl";
import { driverPath } from "@/lib/format";
import { LoadingSpinner } from "@/components/ui";
import { AdminOverviewTab, AdminUsersTab } from "@/components/AdminDashboardPanel";

type AdminView = "resumen" | "usuarios" | "moderacion";
const VIEW_TABS: { value: AdminView; labelKey: string }[] = [
  { value: "resumen", labelKey: "admin.tabResumen" },
  { value: "usuarios", labelKey: "admin.tabUsuarios" },
  { value: "moderacion", labelKey: "admin.tabModeracion" },
];

type HydratedReport = Report & { reporter: User | null; target_user: User | null };
type HydratedLicenseReview = LicenseReview & { user: User | null };

const REASON_LABEL_KEY: Record<string, string> = {
  spam: "admin.reasonSpam",
  scam: "admin.reasonScam",
  harassment: "admin.reasonHarassment",
  no_show: "admin.reasonNoShow",
  unsafe: "admin.reasonUnsafe",
  other: "admin.reasonOther",
};

const STATUS_LABEL_KEY: Record<ReportStatus, string> = {
  pending: "admin.statusPending",
  reviewed: "admin.statusReviewed",
  resolved: "admin.statusResolved",
  dismissed: "admin.statusDismissed",
};

const TABS: { value: ReportStatus | "all"; labelKey: string }[] = [
  { value: "pending", labelKey: "admin.filterPending" },
  { value: "reviewed", labelKey: "admin.filterReviewed" },
  { value: "resolved", labelKey: "admin.filterResolved" },
  { value: "dismissed", labelKey: "admin.filterDismissed" },
  { value: "all", labelKey: "admin.filterAll" },
];

export default function AdminReportsPage() {
  const { t } = useI18n();
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
  const [view, setView] = useState<AdminView>("resumen");

  useSeoMeta({
    title: "Admin · Reportes",
    canonical: `${SITE_URL}/admin/reports`,
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

  // Moderation data is fetched lazily — only when the "Moderación" tab is open.
  // The Resumen/Usuarios tabs fetch their own data inside their components.
  useEffect(() => {
    if (allowed !== "yes" || view !== "moderacion") return;
    setLoading(true);
    api.admin
      .listReports(tab === "all" ? undefined : tab)
      .then((r) => setReports(r.reports))
      .catch(() => setReports([]))
      .finally(() => setLoading(false));
  }, [allowed, tab, view]);

  useEffect(() => {
    if (allowed !== "yes" || view !== "moderacion") return;
    api.admin.stats().then(setStats).catch(() => {});
  }, [allowed, view]);

  useEffect(() => {
    if (allowed !== "yes" || view !== "moderacion") return;
    setLicenseLoading(true);
    api.admin
      .listLicenseReviews("pending")
      .then((r) => setLicenseReviews(r.reviews))
      .catch(() => setLicenseReviews([]))
      .finally(() => setLicenseLoading(false));
  }, [allowed, view]);

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

  const [docLoadingId, setDocLoadingId] = useState<string | null>(null);

  // Fetch the document through the authenticated API client (cookie via
  // credentials:"include") and open the resulting blob in a new tab. A plain
  // <a href> would do a top-level navigation that can land on a different host
  // (apex vs www) where the host-only session cookie isn't sent → 401/404.
  async function viewDocument(review: HydratedLicenseReview) {
    setDocLoadingId(review.id);
    try {
      const blob = await api.admin.fetchLicenseDoc(review.file_kv_key);
      const url = URL.createObjectURL(blob);
      const ext = review.file_kv_key.split(".").pop() || "jpg";
      const filename = `carnet-${review.user_id}.${ext}`;
      const opened = window.open(url, "_blank", "noopener");
      if (!opened) {
        // Popup blocked → fall back to a direct download of the blob.
        const a = document.createElement("a");
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        a.remove();
      }
      setTimeout(() => URL.revokeObjectURL(url), 60_000);
    } catch (e) {
      const status = e instanceof ApiError ? ` (${e.status})` : "";
      toast.error(t("admin.docOpenError", { status }));
    } finally {
      setDocLoadingId(null);
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
    return <LoadingSpinner text={t("admin.checkingAccess")} />;
  }
  if (allowed === "no") return <Navigate to="/" replace />;

  return (
    <main id="main" className="min-h-dvh bg-cr-bg text-cr-text pt-14">
      <div className="max-w-6xl mx-auto px-6 py-10 space-y-6">
        <header className="space-y-2">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-secondary inline-flex items-center gap-2">
            <ShieldCheck size={12} /> {t("admin.badge")}
          </p>
          <h1 className="font-display text-3xl md:text-4xl uppercase">{t("admin.title")}</h1>
          <p className="font-mono text-xs text-cr-text-muted">
            {t("admin.accessNotePrefix")} <code className="text-cr-primary">ADMIN_USER_IDS</code>. {t("admin.accessNoteSuffix")}
          </p>
        </header>

        {/* ── Tabs principales (cada una carga sus datos al activarse) ───── */}
        <div className="flex gap-0 border-b border-cr-border" role="tablist">
          {VIEW_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              role="tab"
              aria-selected={view === tab.value}
              data-testid={`tab-${tab.value}`}
              onClick={() => setView(tab.value)}
              className={`px-5 py-2.5 font-sans text-xs font-semibold uppercase tracking-[0.12em] border-b-2 transition-colors ${
                view === tab.value
                  ? "border-cr-primary text-cr-primary"
                  : "border-transparent text-cr-text-muted hover:text-cr-text"
              }`}
            >
              {t(tab.labelKey)}
            </button>
          ))}
        </div>

        {view === "resumen" && <AdminOverviewTab />}
        {view === "usuarios" && <AdminUsersTab />}

        {/* ── Moderación: stats clásicas + reportes + carnets ───────────── */}
        {view === "moderacion" && (
        <div className="space-y-6">
        {/* ── Stats ────────────────────────────────────────────────────── */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { icon: <Users size={14} />, label: t("admin.statUsers"), value: stats.users.total, sub: t("admin.statUsersSub", { count: stats.users.new_last_7d }) },
              { icon: <Car size={14} />, label: t("admin.statActiveRides"), value: stats.rides.total_active, sub: t("admin.statActiveRidesSub", { count: stats.rides.seats_available }) },
              { icon: <CalendarCheck size={14} />, label: t("admin.statConfirmedBookings"), value: stats.bookings.confirmed_all_time, sub: t("admin.statConfirmedBookingsSub", { count: stats.bookings.pending }) },
              { icon: <ShieldCheck size={14} />, label: t("admin.statVerifiedDrivers"), value: stats.users.license_verified, sub: t("admin.statVerifiedDriversSub", { count: stats.concerts.with_active_rides }) },
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
              <span className="font-sans text-[10px] uppercase tracking-[0.12em] font-semibold">{t("admin.topOriginCities")}</span>
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
          {TABS.map((tabItem) => (
            <button
              key={tabItem.value}
              type="button"
              onClick={() => setTab(tabItem.value)}
              className={`px-4 py-2 font-sans text-[11px] font-semibold uppercase tracking-[0.12em] border-b-2 transition-colors ${
                tab === tabItem.value
                  ? "border-cr-secondary text-cr-secondary"
                  : "border-transparent text-cr-text-muted hover:text-cr-text"
              }`}
            >
              {t(tabItem.labelKey)}
            </button>
          ))}
        </div>

        {loading ? (
          <LoadingSpinner text={t("admin.loadingReports")} />
        ) : reports.length === 0 ? (
          <div className="border border-dashed border-cr-border p-12 text-center">
            <AlertTriangle size={28} className="mx-auto text-cr-text-dim mb-3" strokeWidth={1.5} />
            <p className="font-display text-xl uppercase text-cr-text-muted">
              {t("admin.emptyTitle")}
            </p>
            <p className="font-sans text-sm text-cr-text-dim mt-1">
              {t("admin.emptyReports")}
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
                        {t(REASON_LABEL_KEY[r.reason] ?? r.reason)}
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
                        {t(STATUS_LABEL_KEY[r.status])}
                      </span>
                      <span className="font-mono text-[10px] text-cr-text-dim">
                        {new Date(r.created_at).toLocaleString("es-ES", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </span>
                    </div>

                    <div className="font-sans text-sm text-cr-text">
                      <span className="text-cr-text-muted">{t("admin.reportedBy")}</span>{" "}
                      <span className="font-semibold">
                        {r.reporter?.name ?? t("admin.unknownUser")}
                      </span>{" "}
                      <span className="font-mono text-xs text-cr-text-dim">
                        ({r.reporter?.email ?? "?"})
                      </span>
                    </div>

                    {r.target_user && (
                      <div className="font-sans text-sm text-cr-text">
                        <span className="text-cr-text-muted">{t("admin.against")}</span>{" "}
                        <Link
                          to={driverPath(r.target_user.id)}
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
                        {t("admin.rideLabel")}{" "}
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
                          <Eye size={11} /> {t("admin.actionReviewed")}
                        </button>
                      )}
                      {r.status !== "resolved" && (
                        <button
                          type="button"
                          onClick={() => changeStatus(r.id, "resolved")}
                          className="inline-flex items-center gap-1 font-sans text-[11px] font-semibold uppercase tracking-[0.1em] bg-cr-primary text-black px-2.5 py-1.5 hover:bg-cr-primary/90 transition-colors"
                        >
                          <Check size={11} /> {t("admin.actionResolved")}
                        </button>
                      )}
                      {r.status !== "dismissed" && (
                        <button
                          type="button"
                          onClick={() => changeStatus(r.id, "dismissed")}
                          className="inline-flex items-center gap-1 font-sans text-[11px] font-semibold uppercase tracking-[0.1em] border border-cr-border text-cr-text-dim hover:border-cr-secondary hover:text-cr-secondary px-2.5 py-1.5 transition-colors"
                        >
                          <X size={11} /> {t("admin.actionDismiss")}
                        </button>
                      )}
                    </div>
                    {r.target_user && !r.target_user.banned_at && (
                      <button
                        type="button"
                        onClick={() => { setBanUserId(r.target_user!.id); setBanReason(""); }}
                        className="inline-flex items-center gap-1 font-sans text-[11px] font-semibold uppercase tracking-[0.1em] border border-cr-secondary text-cr-secondary hover:bg-cr-secondary/10 px-2.5 py-1.5 transition-colors"
                      >
                        <Ban size={11} /> {t("admin.banUser")}
                      </button>
                    )}
                    {r.target_user?.banned_at && (
                      <span className="font-sans text-[10px] text-cr-secondary border border-cr-secondary/40 px-2 py-1">{t("admin.banned")}</span>
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
            <h2 className="font-display text-xl uppercase">{t("admin.pendingLicenses")}</h2>
          </header>

          {licenseLoading ? (
            <LoadingSpinner text={t("admin.loadingLicenses")} />
          ) : licenseReviews.length === 0 ? (
            <div className="border border-dashed border-cr-border p-8 text-center">
              <p className="font-sans text-sm text-cr-text-muted">{t("admin.noPendingLicenses")}</p>
            </div>
          ) : (
            <ul className="space-y-3">
              {licenseReviews.map((r) => (
                <li key={r.id} className="border border-cr-border bg-cr-surface p-4 space-y-3">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="space-y-1">
                      <p className="font-sans text-sm font-semibold text-cr-text">
                        {r.user?.name ?? t("admin.unknownUser")}
                        <span className="font-mono text-xs text-cr-text-dim ml-2">({r.user?.email ?? "?"})</span>
                      </p>
                      <p className="font-mono text-[10px] text-cr-text-dim">
                        {new Date(r.submitted_at).toLocaleString("es-ES", { dateStyle: "short", timeStyle: "short" })}
                        {" · "}{r.id}
                      </p>
                      <button
                        type="button"
                        onClick={() => viewDocument(r)}
                        disabled={docLoadingId === r.id}
                        className="inline-flex items-center gap-1 font-sans text-xs text-cr-primary hover:underline disabled:opacity-50"
                      >
                        <FileText size={11} /> {docLoadingId === r.id ? t("admin.opening") : t("admin.viewDocument")}
                      </button>
                    </div>

                    <div className="flex flex-wrap gap-2 items-start">
                      <button
                        type="button"
                        onClick={() => approveLicense(r.id)}
                        className="inline-flex items-center gap-1 font-sans text-[11px] font-semibold uppercase tracking-[0.1em] bg-cr-primary text-black px-2.5 py-1.5 hover:bg-cr-primary/90 transition-colors"
                      >
                        <Check size={11} /> {t("admin.approve")}
                      </button>
                      <button
                        type="button"
                        onClick={() => { setRejectId(r.id); setRejectReason(""); }}
                        className="inline-flex items-center gap-1 font-sans text-[11px] font-semibold uppercase tracking-[0.1em] border border-cr-border text-cr-text-dim hover:border-cr-secondary hover:text-cr-secondary px-2.5 py-1.5 transition-colors"
                      >
                        <X size={11} /> {t("admin.reject")}
                      </button>
                    </div>
                  </div>

                  {rejectId === r.id && (
                    <div className="flex gap-2 items-end pt-1">
                      <input
                        type="text"
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder={t("admin.rejectReasonPlaceholder")}
                        className="flex-1 bg-cr-bg border border-cr-border font-sans text-xs px-3 py-2 text-cr-text placeholder:text-cr-text-dim focus:outline-none focus:border-cr-secondary"
                      />
                      <button
                        type="button"
                        onClick={() => rejectLicense(r.id)}
                        disabled={!rejectReason.trim()}
                        className="font-sans text-[11px] font-semibold uppercase tracking-[0.1em] bg-cr-secondary text-white px-3 py-2 disabled:opacity-40"
                      >
                        {t("admin.confirm")}
                      </button>
                      <button
                        type="button"
                        onClick={() => setRejectId(null)}
                        className="font-sans text-[11px] text-cr-text-dim px-2 py-2"
                      >
                        {t("admin.cancel")}
                      </button>
                    </div>
                  )}
                </li>
              ))}
            </ul>
          )}
        </section>
        </div>
        )}
      </div>

      {/* ── Ban modal ────────────────────────────────────────────────────── */}
      {banUserId && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-cr-surface border-2 border-cr-secondary w-full max-w-md p-6 space-y-4">
            <h2 className="font-display text-xl uppercase text-cr-secondary">{t("admin.banUser")}</h2>
            <p className="font-sans text-sm text-cr-text-muted">
              {t("admin.banModalText")}
            </p>
            <textarea
              value={banReason}
              onChange={(e) => setBanReason(e.target.value)}
              placeholder={t("admin.banReasonPlaceholder")}
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
                {t("admin.confirmBan")}
              </button>
              <button
                type="button"
                onClick={() => { setBanUserId(null); setBanReason(""); }}
                className="font-sans text-sm text-cr-text-muted border border-cr-border px-4 py-2.5 hover:border-cr-primary hover:text-cr-primary transition-colors"
              >
                {t("admin.cancel")}
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
