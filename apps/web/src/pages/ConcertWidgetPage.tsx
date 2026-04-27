import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import type { Concert, Ride } from "@concertride/types";
import { api } from "@/lib/api";
import { SITE_URL } from "@/lib/siteUrl";
import { formatDate, formatTime } from "@/lib/format";

export default function ConcertWidgetPage() {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const accentColor = searchParams.get("color") ?? "#dbff00";
  const maxRides = Math.min(10, Number(searchParams.get("max") ?? "5"));

  const [concert, setConcert] = useState<Concert | null>(null);
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    Promise.all([
      api.concerts.get(id),
      api.rides.list({ concert_id: id }),
    ])
      .then(([c, r]) => {
        setConcert(c);
        setRides(r.rides.filter((ride) => ride.seats_left > 0).slice(0, maxRides));
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id, maxRides]);

  if (loading) {
    return (
      <div style={{ fontFamily: "system-ui, sans-serif", padding: "16px", color: "#888", fontSize: "13px" }}>
        Cargando viajes…
      </div>
    );
  }

  if (!concert) {
    return (
      <div style={{ fontFamily: "system-ui, sans-serif", padding: "16px", color: "#888", fontSize: "13px" }}>
        Concierto no encontrado.
      </div>
    );
  }

  return (
    <div style={{
      fontFamily: "system-ui, -apple-system, sans-serif",
      background: "#0a0a0a",
      color: "#f5f5f5",
      padding: "16px",
      minHeight: "100vh",
      boxSizing: "border-box",
    }}>
      {/* Header */}
      <div style={{ marginBottom: "16px", borderBottom: "1px solid #222", paddingBottom: "12px" }}>
        <p style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "3px", textTransform: "uppercase", color: accentColor, margin: "0 0 4px 0" }}>
          Viajes compartidos
        </p>
        <p style={{ fontSize: "18px", fontWeight: 900, margin: "0 0 2px 0", textTransform: "uppercase", letterSpacing: "-0.02em" }}>
          {concert.artist}
        </p>
        <p style={{ fontSize: "12px", color: "#888", margin: 0 }}>
          {concert.venue.name} · {formatDate(concert.date)}
        </p>
      </div>

      {/* Rides */}
      {rides.length === 0 ? (
        <div style={{ textAlign: "center", padding: "24px 0" }}>
          <p style={{ color: "#666", fontSize: "13px", margin: "0 0 12px 0" }}>
            Aún no hay viajes publicados para este concierto.
          </p>
          <a
            href={`${SITE_URL}/publish?concert=${concert.id}`}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: "inline-block",
              background: accentColor,
              color: "#000",
              fontWeight: 700,
              fontSize: "11px",
              letterSpacing: "2px",
              textTransform: "uppercase",
              padding: "8px 16px",
              textDecoration: "none",
            }}
          >
            Publicar viaje
          </a>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {rides.map((ride) => (
            <a
              key={ride.id}
              href={`${SITE_URL}/rides/${ride.id}`}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "12px",
                padding: "10px 12px",
                background: "#111",
                border: "1px solid #222",
                textDecoration: "none",
                color: "inherit",
                transition: "border-color 0.15s",
              }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = accentColor; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLAnchorElement).style.borderColor = "#222"; }}
            >
              <div style={{ minWidth: 0 }}>
                <p style={{ fontSize: "13px", fontWeight: 600, margin: "0 0 2px 0", color: "#f5f5f5" }}>
                  {ride.origin_city} → {ride.concert.venue.city}
                </p>
                <p style={{ fontSize: "11px", color: "#888", margin: 0 }}>
                  {formatDate(ride.departure_time)} · {formatTime(ride.departure_time)} · {ride.seats_left} plaza{ride.seats_left === 1 ? "" : "s"}
                </p>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <p style={{ fontSize: "16px", fontWeight: 900, color: accentColor, margin: "0 0 2px 0", fontVariantNumeric: "tabular-nums" }}>
                  €{ride.price_per_seat}
                </p>
                <p style={{ fontSize: "10px", color: "#666", margin: 0 }}>/asiento</p>
              </div>
            </a>
          ))}
        </div>
      )}

      {/* Footer CTA */}
      <div style={{ marginTop: "16px", paddingTop: "12px", borderTop: "1px solid #1a1a1a", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        <a
          href={`${SITE_URL}/concerts/${concert.id}`}
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: "11px", color: "#555", textDecoration: "none", letterSpacing: "1px", textTransform: "uppercase" }}
        >
          Ver todos los viajes →
        </a>
        <a
          href={SITE_URL}
          target="_blank"
          rel="noopener noreferrer"
          style={{ fontSize: "10px", color: "#333", textDecoration: "none", letterSpacing: "2px", textTransform: "uppercase" }}
        >
          ConcertRide
        </a>
      </div>
    </div>
  );
}
