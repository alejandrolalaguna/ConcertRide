import { useEffect, useState } from "react";
import type { Concert, Ride, User, Vibe } from "@concertride/types";
import { api } from "@/lib/api";
import { ConcertCard } from "@/components/ConcertCard";
import { TicketCard } from "@/components/TicketCard";
import { SearchBar } from "@/components/SearchBar";
import { VibeSelector } from "@/components/VibeSelector";
import { TrustBadge } from "@/components/TrustBadge";
import { StatsBar } from "@/components/StatsBar";
import { HowItWorks } from "@/components/HowItWorks";
import {
  ConcertCardSkeleton,
  PulsingDot,
  TicketCardSkeleton,
} from "@/components/LoadingStates";
import { VibeBadge } from "@/components/VibeBadge";

function Section({
  title,
  code,
  children,
}: {
  title: string;
  code: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-5 py-12 border-t border-cr-border first:border-t-0">
      <header className="flex items-baseline justify-between gap-4">
        <h2 className="font-display text-lg uppercase tracking-wide">{title}</h2>
        <code className="font-mono text-[11px] text-cr-text-dim">{code}</code>
      </header>
      {children}
    </section>
  );
}

function Swatch({ name, hex, token }: { name: string; hex: string; token: string }) {
  return (
    <div className="space-y-2">
      <div
        className="h-16 w-full border border-cr-border"
        style={{ backgroundColor: hex }}
        aria-hidden="true"
      />
      <div className="font-mono text-[11px] leading-tight">
        <p className="text-cr-text">{name}</p>
        <p className="text-cr-text-dim">{token}</p>
        <p className="text-cr-text-muted">{hex}</p>
      </div>
    </div>
  );
}

export default function DevShowcase() {
  const [concerts, setConcerts] = useState<Concert[] | null>(null);
  const [rides, setRides] = useState<Ride[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [vibe, setVibe] = useState<Vibe | null>("party");

  useEffect(() => {
    Promise.all([api.concerts.list({ limit: 6 }), api.rides.list({})])
      .then(([c, r]) => {
        setConcerts(c.concerts);
        setRides(r.rides);
      })
      .catch((err: unknown) => setError(err instanceof Error ? err.message : "fetch failed"));
  }, []);

  const featuredRide = rides?.[0];
  const fullRide = rides?.find((r) => r.seats_left === 0);
  const chillRide = rides?.find((r) => r.vibe === "chill");

  const sampleUser: User = {
    id: "u_demo",
    email: "demo@example.es",
    name: "Laura Martínez",
    avatar_url: null,
    verified: true,
    rating: 4.9,
    rating_count: 87,
    car_model: "SEAT León",
    car_color: "Negro",
    rides_given: 32,
    phone: null,
    home_city: "Madrid",
    smoker: false,
    has_license: true,
    license_verified: true,
    identity_verified: false,
    referral_code: "DEMO0001",
    referral_count: 0,
    tos_accepted_at: "2025-06-14T10:00:00.000Z",
    email_verified_at: "2025-06-14T10:00:00.000Z",
    phone_verified_at: null,
    deleted_at: null,
    banned_at: null,
    ban_reason: null,
    created_at: "2025-06-14T10:00:00.000Z",
  };

  return (
    <main className="min-h-dvh bg-cr-bg text-cr-text">
      <header className="px-6 py-8 border-b border-cr-border">
        <div className="max-w-6xl mx-auto space-y-3">
          <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
            /_dev · component showcase
          </p>
          <h1 className="font-display text-3xl md:text-5xl uppercase leading-[0.95]">
            Dark Stage system.
          </h1>
          <p className="font-sans text-sm text-cr-text-muted max-w-xl">
            Every signature component rendered against live M1 fixtures. Resize the window to
            375px to check mobile.
          </p>
          {error && (
            <p className="font-mono text-xs text-cr-secondary">API error: {error}</p>
          )}
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-6">
        <Section title="Palette" code="--cr-*">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <Swatch name="Stage" hex="#080808" token="--cr-bg" />
            <Swatch name="Surface" hex="#111111" token="--cr-surface" />
            <Swatch name="Surface 2" hex="#1A1A1A" token="--cr-surface-2" />
            <Swatch name="Border" hex="#2A2A2A" token="--cr-border" />
            <Swatch name="Text" hex="#F5F5F5" token="--cr-text" />
            <Swatch name="Volt" hex="#DBFF00" token="--cr-primary" />
            <Swatch name="Orange" hex="#FF4F00" token="--cr-secondary" />
            <Swatch name="Muted" hex="#888888" token="--cr-text-muted" />
            <Swatch name="Dim" hex="#444444" token="--cr-text-dim" />
            <Swatch name="Hard" hex="#FFFFFF" token="--cr-border-hard" />
          </div>
        </Section>

        <Section title="Typography" code="Archivo · Inter · JetBrains">
          <div className="space-y-4">
            <p className="font-display text-5xl md:text-7xl uppercase leading-[0.95]">
              Get to the show.
            </p>
            <p className="font-sans text-base text-cr-text-muted max-w-xl">
              Body copy in Inter. Comparte el viaje. Divide el coste. Llega al show. Este párrafo
              prueba interlineado, ancho cómodo y color sobre fondo oscuro.
            </p>
            <p className="font-mono text-sm text-cr-primary">
              €18 · 3 plazas · 2026-05-22 21:00 CEST
            </p>
            <p className="font-sans text-[10px] font-semibold uppercase tracking-[0.16em] text-cr-text-muted">
              Label · Uppercase · Wide Tracking
            </p>
          </div>
        </Section>

        <Section title="Buttons" code="primary / secondary / ghost">
          <div className="flex flex-wrap items-center gap-3">
            <button className="bg-cr-primary text-black font-sans font-semibold uppercase tracking-[0.12em] text-sm border-2 border-black px-6 py-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all duration-100">
              Buscar un viaje
            </button>
            <button className="bg-transparent text-cr-text font-sans font-semibold uppercase tracking-[0.12em] text-sm border-2 border-cr-border hover:border-cr-primary hover:text-cr-primary px-6 py-3 transition-colors duration-150">
              Ofrecer mi coche
            </button>
            <button className="bg-transparent text-cr-text-muted font-sans font-medium text-sm hover:text-cr-text transition-colors duration-150">
              Cancelar
            </button>
          </div>
        </Section>

        <Section title="Vibe badges" code="<VibeBadge />">
          <div className="flex flex-wrap gap-3">
            <VibeBadge vibe="party" />
            <VibeBadge vibe="chill" />
            <VibeBadge vibe="mixed" />
          </div>
        </Section>

        <Section title="Trust badge" code="<TrustBadge />">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <TrustBadge user={sampleUser} />
            <TrustBadge
              user={{
                ...sampleUser,
                verified: false,
                rating: 4.5,
                rides_given: 6,
                name: "Marcos Villanueva",
              }}
            />
          </div>
        </Section>

        <Section title="SearchBar" code="<SearchBar /> — sticky within section">
          <div className="border border-cr-border max-h-[260px] overflow-auto bg-cr-bg">
            <SearchBar
              onSubmit={(v) => console.log("search", v)}
              sticky
            />
            <div className="p-6 font-mono text-xs text-cr-text-dim space-y-2">
              <p>Scroll this box to see the search bar stick to the top.</p>
              <p>· Volt Yellow focus ring on inputs.</p>
              <p>· Press the button to see the 3D brutalist tap.</p>
              <p>· On mobile it stacks vertically.</p>
              {Array.from({ length: 6 }).map((_, i) => (
                <p key={i}>Filler line {i + 1}.</p>
              ))}
            </div>
          </div>
        </Section>

        <Section title="VibeSelector" code="<VibeSelector />">
          <VibeSelector value={vibe} onChange={setVibe} />
          <p className="font-mono text-xs text-cr-text-dim">
            selected: <span className="text-cr-primary">{vibe ?? "null"}</span>
          </p>
        </Section>

        <Section title="ConcertCard" code="<ConcertCard /> — 4:3 editorial">
          {concerts ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {concerts.slice(0, 6).map((c) => (
                <ConcertCard key={c.id} concert={c} />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <ConcertCardSkeleton key={i} />
              ))}
            </div>
          )}
        </Section>

        <Section title="TicketCard" code="<TicketCard /> — signature component">
          {rides ? (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              {featuredRide && <TicketCard ride={featuredRide} />}
              {chillRide && <TicketCard ride={chillRide} />}
              {fullRide && <TicketCard ride={fullRide} />}
              {rides[3] && <TicketCard ride={rides[3]} />}
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
              <TicketCardSkeleton />
              <TicketCardSkeleton />
            </div>
          )}
        </Section>

        <Section title="Loading states" code="<PulsingDot /> + *Skeleton">
          <div className="space-y-6">
            <PulsingDot />
            <TicketCardSkeleton />
          </div>
        </Section>
      </div>

      <StatsBar />
      <HowItWorks />

      <footer className="px-6 py-16 border-t border-cr-border">
        <div className="max-w-6xl mx-auto font-mono text-xs text-cr-text-dim">
          <p>
            /_dev → this page. All components render against fixtures from{" "}
            <a className="underline decoration-dashed hover:text-cr-primary" href="/api/rides">
              /api/rides
            </a>{" "}
            and{" "}
            <a className="underline decoration-dashed hover:text-cr-primary" href="/api/concerts">
              /api/concerts
            </a>
            .
          </p>
        </div>
      </footer>
    </main>
  );
}
