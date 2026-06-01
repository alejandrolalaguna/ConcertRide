import { Fragment, useEffect, useMemo, useState } from "react";
import {
  Users, Car, MessageSquare, ShieldAlert, Database, RefreshCw, ChevronDown, ChevronRight, Search, X,
} from "lucide-react";
import type { AdminBreakdown, AdminDashboard, AdminUserDetail, AdminUserListItem } from "@concertride/types";
import { api } from "@/lib/api";
import { LoadingSpinner } from "@/components/ui";

const LIME = "#dbff00";
const ORANGE = "#ff4f00";

function StatCard({ label, value, sub, accent, metric, onOpen }: {
  label: string; value: number | string; sub?: string; accent?: boolean;
  metric?: string; onOpen?: (m: string) => void;
}) {
  const clickable = !!(metric && onOpen);
  return (
    <button
      type="button"
      disabled={!clickable}
      onClick={() => clickable && onOpen!(metric!)}
      title={clickable ? "Ver desglose" : undefined}
      className={`text-left w-full border ${accent ? "border-cr-primary" : "border-cr-border"} bg-cr-surface p-3 transition-colors ${clickable ? "cursor-pointer hover:border-cr-primary hover:bg-cr-primary/5" : "cursor-default"}`}
    >
      <p className="font-mono text-[10px] uppercase tracking-wider text-cr-text-dim flex items-center gap-1">
        {label}{clickable && <span className="text-cr-primary/50">↗</span>}
      </p>
      <p className={`font-display text-2xl leading-tight ${accent ? "text-cr-primary" : "text-cr-text"}`}>
        {typeof value === "number" ? value.toLocaleString("es-ES") : value}
      </p>
      {sub && <p className="font-sans text-[11px] text-cr-text-muted mt-0.5">{sub}</p>}
    </button>
  );
}

function fmtCell(v: string | number | null, key: string): string {
  if (v == null || v === "") return "—";
  if (typeof v === "string" && /(_at|date|departure_time|expires|joined|submitted|reviewed)/i.test(key) && /^\d{4}-\d{2}-\d{2}/.test(v)) {
    return fmtDate(v);
  }
  return String(v);
}

// Drill-down modal: fetches the breakdown for a metric and renders it as a table.
function BreakdownModal({ metric, onClose }: { metric: string; onClose: () => void }) {
  const [data, setData] = useState<AdminBreakdown | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [q, setQ] = useState("");

  useEffect(() => {
    setLoading(true); setError(false); setData(null); setQ("");
    api.admin.breakdown(metric).then(setData).catch(() => setError(true)).finally(() => setLoading(false));
  }, [metric]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const filtered = useMemo(() => {
    if (!data) return [];
    const term = q.trim().toLowerCase();
    if (!term) return data.rows;
    return data.rows.filter((row) => Object.values(row).some((v) => String(v ?? "").toLowerCase().includes(term)));
  }, [data, q]);

  return (
    <div className="fixed inset-0 z-50 bg-black/70 flex items-start justify-center p-4 overflow-y-auto" onClick={onClose} data-testid="breakdown-modal">
      <div className="bg-cr-bg border-2 border-cr-primary w-full max-w-4xl my-8" onClick={(e) => e.stopPropagation()}>
        <header className="flex items-center justify-between gap-4 border-b border-cr-border p-4">
          <div>
            <h3 className="font-display text-xl uppercase">{data?.title ?? "Detalle"}</h3>
            {data && (
              <p className="font-mono text-[10px] text-cr-text-dim">
                {data.total.toLocaleString("es-ES")} registro(s){data.truncated ? ` · mostrando ${data.rows.length}` : ""}
              </p>
            )}
          </div>
          <button type="button" onClick={onClose} className="text-cr-text-dim hover:text-cr-primary" aria-label="Cerrar"><X size={18} /></button>
        </header>
        <div className="p-4 space-y-3">
          {loading ? (
            <LoadingSpinner text="Cargando desglose…" />
          ) : error ? (
            <p className="font-sans text-sm text-cr-text-muted">No se pudo cargar el desglose.</p>
          ) : data && data.rows.length === 0 ? (
            <p className="font-sans text-sm text-cr-text-muted">Sin registros para esta métrica.</p>
          ) : data ? (
            <>
              {data.rows.length > 8 && (
                <div className="relative">
                  <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-cr-text-dim" />
                  <input
                    type="text" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Filtrar…"
                    className="bg-cr-surface border border-cr-border font-sans text-xs pl-8 pr-3 py-2 text-cr-text placeholder:text-cr-text-dim focus:outline-none focus:border-cr-primary w-64 max-w-full"
                  />
                </div>
              )}
              <div className="overflow-auto border border-cr-border max-h-[60vh]">
                <table className="w-full border-collapse text-left">
                  <thead className="sticky top-0 bg-cr-surface">
                    <tr className="border-b border-cr-border">
                      {data.columns.map((c) => (
                        <th key={c.key} className="font-mono text-[10px] uppercase tracking-wider text-cr-text-dim px-2 py-2 whitespace-nowrap">{c.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map((row, i) => (
                      <tr key={i} className="border-b border-cr-border hover:bg-cr-surface">
                        {data.columns.map((c) => (
                          <td key={c.key} className="font-sans text-xs text-cr-text px-2 py-1.5 align-top max-w-[280px] truncate" title={String(row[c.key] ?? "")}>
                            {fmtCell(row[c.key] ?? null, c.key)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="font-mono text-[10px] text-cr-text-dim">{filtered.length} fila(s){q ? ` (filtradas de ${data.rows.length})` : ""}</p>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function SectionTitle({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <header className="flex items-center gap-2 pt-2">
      <span className="text-cr-primary">{icon}</span>
      <h3 className="font-display text-lg uppercase">{children}</h3>
    </header>
  );
}

function BarList({ title, items, color = LIME }: { title: string; items: Array<{ label: string; value: number }>; color?: string }) {
  const max = Math.max(1, ...items.map((i) => i.value));
  return (
    <div className="border border-cr-border bg-cr-surface p-4">
      <p className="font-mono text-[10px] uppercase tracking-wider text-cr-text-dim mb-3">{title}</p>
      {items.length === 0 ? (
        <p className="font-sans text-xs text-cr-text-muted">Sin datos</p>
      ) : (
        <ul className="space-y-1.5">
          {items.map((i) => (
            <li key={i.label} className="flex items-center gap-2">
              <span className="font-sans text-xs text-cr-text w-32 truncate" title={i.label}>{i.label}</span>
              <span className="flex-1 h-3 bg-cr-bg relative overflow-hidden">
                <span className="absolute inset-y-0 left-0" style={{ width: `${(i.value / max) * 100}%`, background: color }} />
              </span>
              <span className="font-mono text-xs text-cr-text-dim w-12 text-right">{i.value.toLocaleString("es-ES")}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function TimeBars({ title, items, color = LIME }: { title: string; items: Array<{ date: string; count: number }>; color?: string }) {
  const max = Math.max(1, ...items.map((i) => i.count));
  return (
    <div className="border border-cr-border bg-cr-surface p-4">
      <p className="font-mono text-[10px] uppercase tracking-wider text-cr-text-dim mb-3">{title}</p>
      {items.length === 0 ? (
        <p className="font-sans text-xs text-cr-text-muted">Sin datos en los últimos 30 días</p>
      ) : (
        <div className="flex items-end gap-1 h-24">
          {items.map((i) => (
            <div
              key={i.date}
              className="flex-1 min-w-[3px] transition-opacity hover:opacity-100 opacity-80"
              style={{ height: `${Math.max(4, (i.count / max) * 100)}%`, background: color }}
              title={`${i.date}: ${i.count}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function flag(on: boolean, labelOn: string, labelOff = "—") {
  return on ? (
    <span className="inline-block bg-cr-primary/15 text-cr-primary font-mono text-[10px] px-1.5 py-0.5">{labelOn}</span>
  ) : (
    <span className="font-mono text-[10px] text-cr-text-dim">{labelOff}</span>
  );
}

function fmtDate(s: string) {
  const d = new Date(s.includes("T") ? s : s.replace(" ", "T") + "Z");
  return isNaN(d.getTime()) ? s : d.toLocaleDateString("es-ES", { day: "2-digit", month: "short", year: "2-digit" });
}

// ───────────────────────── Tab 1: Resumen (dashboard) ─────────────────────────
export function AdminOverviewTab() {
  const [data, setData] = useState<AdminDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [openMetric, setOpenMetric] = useState<string | null>(null);

  async function load() {
    setRefreshing(true);
    try {
      setData(await api.admin.dashboard());
    } catch {
      // keep previous
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }
  useEffect(() => { load(); }, []);

  if (loading) return <LoadingSpinner text="Cargando dashboard…" />;
  if (!data) return <p className="font-sans text-sm text-cr-text-muted">No se pudo cargar el dashboard.</p>;

  return (
    <div className="space-y-6" data-testid="admin-overview">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <SectionTitle icon={<Database size={16} />}>Resumen general</SectionTitle>
        <button
          type="button"
          onClick={load}
          disabled={refreshing}
          className="inline-flex items-center gap-1.5 font-sans text-[11px] font-semibold uppercase tracking-[0.1em] border border-cr-border text-cr-text-dim hover:text-cr-primary hover:border-cr-primary px-2.5 py-1.5 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={12} className={refreshing ? "animate-spin" : ""} /> Actualizar
        </button>
      </div>

      <SectionTitle icon={<Users size={15} />}>Usuarios</SectionTitle>
      <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard label="Total" value={data.users.total} accent metric="users_total" onOpen={setOpenMetric} />
        <StatCard label="Email verificado" value={data.users.verified_email} sub={`${data.users.unverified_email} sin verificar`} metric="users_verified_email" onOpen={setOpenMetric} />
        <StatCard label="Sin verificar" value={data.users.unverified_email} metric="users_unverified_email" onOpen={setOpenMetric} />
        <StatCard label="Carné verificado" value={data.users.license_verified} metric="users_license_verified" onOpen={setOpenMetric} />
        <StatCard label="Identidad verif." value={data.users.identity_verified} metric="users_identity_verified" onOpen={setOpenMetric} />
        <StatCard label="Teléfono verif." value={data.users.phone_verified} metric="users_phone_verified" onOpen={setOpenMetric} />
        <StatCard label="Con ciudad" value={data.users.with_home_city} metric="users_with_home_city" onOpen={setOpenMetric} />
        <StatCard label="Baneados" value={data.users.banned} metric="users_banned" onOpen={setOpenMetric} />
        <StatCard label="Nuevos 7d" value={data.users.new_7d} metric="users_new_7d" onOpen={setOpenMetric} />
        <StatCard label="Nuevos 30d" value={data.users.new_30d} metric="users_new_30d" onOpen={setOpenMetric} />
      </div>

      <SectionTitle icon={<Car size={15} />}>Viajes y reservas</SectionTitle>
      <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-5">
        <StatCard label="Viajes total" value={data.rides.total} accent metric="rides_total" onOpen={setOpenMetric} />
        <StatCard label="Activos" value={data.rides.active} metric="rides_active" onOpen={setOpenMetric} />
        <StatCard label="Completados" value={data.rides.completed} metric="rides_completed" onOpen={setOpenMetric} />
        <StatCard label="Cancelados" value={data.rides.cancelled} metric="rides_cancelled" onOpen={setOpenMetric} />
        <StatCard label="Ida y vuelta" value={data.rides.round_trip} metric="rides_round_trip" onOpen={setOpenMetric} />
        <StatCard label="Plazas libres" value={data.rides.seats_available} metric="rides_seats_available" onOpen={setOpenMetric} />
        <StatCard label="Precio medio" value={`${data.rides.avg_price}€`} metric="rides_avg_price" onOpen={setOpenMetric} />
        <StatCard label="Publicados 7d" value={data.rides.published_7d} metric="rides_published_7d" onOpen={setOpenMetric} />
        <StatCard label="Reservas total" value={data.bookings.total} metric="bookings_total" onOpen={setOpenMetric} />
        <StatCard label="Reservas confirm." value={data.bookings.confirmed} sub={`${data.bookings.pending} pendientes`} metric="bookings_confirmed" onOpen={setOpenMetric} />
      </div>

      <SectionTitle icon={<MessageSquare size={15} />}>Engagement</SectionTitle>
      <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard label="Reseñas" value={data.reviews.total} sub={`★ ${data.reviews.avg_rating} media`} metric="reviews_total" onOpen={setOpenMetric} />
        <StatCard label="Favoritos" value={data.favorites.total} sub={`${data.favorites.concert}c · ${data.favorites.artist}a · ${data.favorites.city}ci`} metric="favorites_total" onOpen={setOpenMetric} />
        <StatCard label="Mensajes chat" value={data.engagement.chat_messages} metric="chat_messages" onOpen={setOpenMetric} />
        <StatCard label="Mensajes directos" value={data.engagement.direct_messages} metric="direct_messages" onOpen={setOpenMetric} />
        <StatCard label="Interés (signals)" value={data.engagement.demand_signals} metric="demand_signals" onOpen={setOpenMetric} />
        <StatCard label="Waitlist festival" value={data.engagement.festival_demand} metric="festival_demand" onOpen={setOpenMetric} />
        <StatCard label="Alertas festival" value={data.engagement.festival_alerts} metric="festival_alerts" onOpen={setOpenMetric} />
        <StatCard label="Asistencias" value={data.engagement.event_anticipations} metric="event_anticipations" onOpen={setOpenMetric} />
        <StatCard label="Conexiones crew" value={data.engagement.crew_connections} metric="crew_connections" onOpen={setOpenMetric} />
        <StatCard label="Squads" value={data.engagement.squads} sub={`${data.engagement.squad_members} miembros`} metric="squads" onOpen={setOpenMetric} />
        <StatCard label="Trip memories" value={data.engagement.trip_memories} metric="trip_memories" onOpen={setOpenMetric} />
        <StatCard label="Eventos actividad" value={data.engagement.activity_events} metric="activity_events" onOpen={setOpenMetric} />
      </div>

      <SectionTitle icon={<ShieldAlert size={15} />}>Catálogo y moderación</SectionTitle>
      <div className="grid gap-2 grid-cols-2 sm:grid-cols-3 lg:grid-cols-6">
        <StatCard label="Conciertos" value={data.catalog.concerts} sub={`${data.catalog.upcoming_concerts} próximos`} metric="concerts" onOpen={setOpenMetric} />
        <StatCard label="Recintos" value={data.catalog.venues} metric="venues" onOpen={setOpenMetric} />
        <StatCard label="Reportes pend." value={data.moderation.reports_pending} sub={`${data.moderation.reports_total} total`} metric="reports_pending" onOpen={setOpenMetric} />
        <StatCard label="Carnés pend." value={data.moderation.license_pending} accent={data.moderation.license_pending > 0} metric="license_pending" onOpen={setOpenMetric} />
        <StatCard label="Carnés aprob." value={data.moderation.license_approved} metric="license_approved" onOpen={setOpenMetric} />
        <StatCard label="Carnés rechaz." value={data.moderation.license_rejected} metric="license_rejected" onOpen={setOpenMetric} />
        <StatCard label="Identidad pend." value={data.moderation.identity_pending} metric="identity_pending" onOpen={setOpenMetric} />
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        <TimeBars title="Altas de usuarios · 30 días" items={data.signups_by_day} />
        <TimeBars title="Viajes publicados · 30 días" items={data.rides_by_day} color={ORANGE} />
      </div>
      <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
        <BarList title="Top ciudades de origen" items={data.top_cities.map((c) => ({ label: c.city, value: c.ride_count }))} />
        <BarList title="Top conciertos (viajes)" items={data.top_concerts.map((c) => ({ label: c.name, value: c.ride_count }))} />
        <BarList title="Actividad por tipo" items={data.activity_by_kind.map((a) => ({ label: a.kind, value: a.count }))} color={ORANGE} />
        <BarList
          title="Viajes por estado"
          items={[
            { label: "activos", value: data.rides.active },
            { label: "completados", value: data.rides.completed },
            { label: "llenos", value: data.rides.full },
            { label: "cancelados", value: data.rides.cancelled },
          ]}
        />
        <BarList
          title="Reservas por estado"
          items={[
            { label: "confirmadas", value: data.bookings.confirmed },
            { label: "pendientes", value: data.bookings.pending },
            { label: "rechazadas", value: data.bookings.rejected },
            { label: "canceladas", value: data.bookings.cancelled },
          ]}
          color={ORANGE}
        />
        <BarList
          title="Favoritos por tipo"
          items={[
            { label: "conciertos", value: data.favorites.concert },
            { label: "artistas", value: data.favorites.artist },
            { label: "ciudades", value: data.favorites.city },
          ]}
        />
      </div>

      <p className="font-mono text-[10px] text-cr-text-dim">Generado: {new Date(data.generated_at).toLocaleString("es-ES")}</p>

      {openMetric && <BreakdownModal metric={openMetric} onClose={() => setOpenMetric(null)} />}
    </div>
  );
}

// ───────────────────── Per-user drill-down (used by Usuarios tab) ─────────────────────
function UserDetailPanel({ detail }: { detail: AdminUserDetail }) {
  const block = (title: string, count: number, body: React.ReactNode) => (
    <div className="border border-cr-border bg-cr-bg p-3">
      <p className="font-mono text-[10px] uppercase tracking-wider text-cr-text-dim mb-2">{title} ({count})</p>
      {count === 0 ? <p className="font-sans text-xs text-cr-text-dim">Nada</p> : body}
    </div>
  );
  return (
    <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3 mt-3">
      {block("Viajes publicados", detail.rides.length,
        <ul className="space-y-1">
          {detail.rides.map((r) => (
            <li key={r.id} className="font-sans text-xs text-cr-text">
              <span className="text-cr-primary">{r.concert_name ?? r.concert_id}</span> · {r.origin_city} · {r.status} · {r.price_per_seat}€ · {r.seats_left}/{r.seats_total} plazas · {fmtDate(r.departure_time)}
            </li>
          ))}
        </ul>)}
      {block("Reservas solicitadas", detail.requests.length,
        <ul className="space-y-1">
          {detail.requests.map((r) => (
            <li key={r.id} className="font-mono text-[11px] text-cr-text">{r.ride_id} · {r.status} · {r.seats} plaza(s) · {fmtDate(r.created_at)}</li>
          ))}
        </ul>)}
      {block("Favoritos", detail.favorites.length,
        <ul className="space-y-1">
          {detail.favorites.map((f) => (
            <li key={f.id} className="font-sans text-xs text-cr-text"><span className="text-cr-text-dim">[{f.kind}]</span> {f.label}</li>
          ))}
        </ul>)}
      {block("Mensajes de chat", detail.messages.length,
        <ul className="space-y-1">
          {detail.messages.map((m) => (
            <li key={m.id} className="font-sans text-xs text-cr-text truncate" title={m.body}>
              <span className="text-cr-text-dim">{fmtDate(m.created_at)}:</span> {m.body}
            </li>
          ))}
        </ul>)}
      {block("Reseñas recibidas", detail.reviews_received.length,
        <ul className="space-y-1">
          {detail.reviews_received.map((r) => (
            <li key={r.id} className="font-sans text-xs text-cr-text">★ {r.rating} — {r.comment ?? "(sin comentario)"}</li>
          ))}
        </ul>)}
      {block("Asistencias (going/maybe)", detail.anticipations.length,
        <ul className="space-y-1">
          {detail.anticipations.map((a) => (
            <li key={a.id} className="font-mono text-[11px] text-cr-text">{a.concert_id} · {a.status} · {fmtDate(a.created_at)}</li>
          ))}
        </ul>)}
    </div>
  );
}

// ───────────────────────── Tab 2: Usuarios ─────────────────────────
export function AdminUsersTab() {
  const [users, setUsers] = useState<AdminUserListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [openUser, setOpenUser] = useState<string | null>(null);
  const [detail, setDetail] = useState<AdminUserDetail | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  useEffect(() => {
    api.admin.usersList()
      .then((r) => setUsers(r.users))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, []);

  async function toggleUser(id: string) {
    if (openUser === id) { setOpenUser(null); setDetail(null); return; }
    setOpenUser(id);
    setDetail(null);
    setDetailLoading(true);
    try { setDetail(await api.admin.userDetail(id)); }
    catch { setDetail(null); }
    finally { setDetailLoading(false); }
  }

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return users;
    return users.filter((u) => u.name.toLowerCase().includes(term) || u.email.toLowerCase().includes(term) || (u.home_city ?? "").toLowerCase().includes(term));
  }, [users, q]);

  if (loading) return <LoadingSpinner text="Cargando usuarios…" />;

  return (
    <div className="space-y-3" data-testid="admin-users">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <SectionTitle icon={<Users size={15} />}>Usuarios ({filtered.length})</SectionTitle>
        <div className="relative">
          <Search size={13} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-cr-text-dim" />
          <input
            type="text"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar nombre, email o ciudad…"
            className="bg-cr-bg border border-cr-border font-sans text-xs pl-8 pr-3 py-2 text-cr-text placeholder:text-cr-text-dim focus:outline-none focus:border-cr-primary w-64 max-w-full"
          />
        </div>
      </div>

      <div className="overflow-x-auto border border-cr-border">
        <table className="w-full border-collapse text-left">
          <thead>
            <tr className="bg-cr-surface border-b border-cr-border">
              {["", "Usuario", "Verif.", "Ciudad", "Alta", "Viajes", "Reservas", "Favs", "Msgs", "★"].map((h, idx) => (
                <th key={idx} className="font-mono text-[10px] uppercase tracking-wider text-cr-text-dim px-2 py-2 whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((u) => (
              <Fragment key={u.id}>
                <tr
                  onClick={() => toggleUser(u.id)}
                  className={`border-b border-cr-border cursor-pointer hover:bg-cr-surface ${openUser === u.id ? "bg-cr-surface" : ""}`}
                >
                  <td className="px-2 py-2 text-cr-text-dim">{openUser === u.id ? <ChevronDown size={13} /> : <ChevronRight size={13} />}</td>
                  <td className="px-2 py-2">
                    <p className="font-sans text-xs font-semibold text-cr-text">{u.name}{u.banned && <span className="ml-1.5 text-cr-secondary font-mono text-[10px]">BAN</span>}</p>
                    <p className="font-mono text-[10px] text-cr-text-dim">{u.email}</p>
                  </td>
                  <td className="px-2 py-2 space-x-1 whitespace-nowrap">
                    {flag(u.email_verified, "✉")}
                    {flag(u.license_verified, "🚗")}
                    {flag(u.identity_verified, "ID")}
                    {flag(u.phone_verified, "☎")}
                  </td>
                  <td className="px-2 py-2 font-sans text-xs text-cr-text-muted whitespace-nowrap">{u.home_city ?? "—"}</td>
                  <td className="px-2 py-2 font-mono text-[10px] text-cr-text-dim whitespace-nowrap">{fmtDate(u.created_at)}</td>
                  <td className="px-2 py-2 font-mono text-xs text-cr-text text-center">{u.rides_published}</td>
                  <td className="px-2 py-2 font-mono text-xs text-cr-text text-center">{u.requests_made}</td>
                  <td className="px-2 py-2 font-mono text-xs text-cr-text text-center">{u.favorites_count}</td>
                  <td className="px-2 py-2 font-mono text-xs text-cr-text text-center">{u.messages_sent}</td>
                  <td className="px-2 py-2 font-mono text-xs text-cr-text text-center">{u.reviews_received}</td>
                </tr>
                {openUser === u.id && (
                  <tr className="bg-cr-bg border-b border-cr-border">
                    <td colSpan={10} className="px-3 py-3">
                      {detailLoading ? (
                        <LoadingSpinner text="Cargando detalle…" />
                      ) : detail ? (
                        <UserDetailPanel detail={detail} />
                      ) : (
                        <p className="font-sans text-xs text-cr-text-muted">No se pudo cargar el detalle.</p>
                      )}
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
