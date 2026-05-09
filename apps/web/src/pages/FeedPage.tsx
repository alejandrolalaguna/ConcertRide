import { useState } from "react";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";
import { useSession } from "@/lib/session";
import type { ActivityScope } from "@concertride/types";
import { LiveActivityFeed } from "@/components/LiveActivityFeed";

const TABS: Array<{ value: ActivityScope; label: string; description: string }> = [
  { value: "all", label: "Todo", description: "Lo que se cuece en ConcertRide" },
  { value: "city", label: "Mi ciudad", description: "Quién organiza viajes desde tu ciudad" },
  { value: "crew", label: "Mi crew", description: "Solo gente de tu crew" },
];

export default function FeedPage() {
  const { user } = useSession();
  const [scope, setScope] = useState<ActivityScope>("all");

  useSeoMeta({
    title: "En directo · ConcertRide",
    description: "Quién está organizando viajes a festivales y conciertos en España ahora mismo.",
    canonical: `${SITE_URL}/feed`,
    // User-personalised activity feed — never index. Indexable counterparts
    // (festival pages, route pages) carry the SEO weight.
    noindex: true,
  });

  const tabs = user ? TABS : TABS.filter((t) => t.value !== "crew");
  const activeTab = tabs.find((t) => t.value === scope) ?? tabs[0];

  return (
    <main id="main" className="min-h-dvh bg-cr-bg pt-14 text-cr-text">
      <header className="border-b border-cr-border px-4 py-8 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-cr-text-muted">
            Live feed
          </p>
          <h1 className="mt-2 font-display text-4xl uppercase leading-tight">
            En directo
          </h1>
          <p className="mt-2 max-w-prose text-sm text-cr-text-muted">
            {activeTab?.description}
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        <div className="mb-4 flex flex-wrap gap-2 border-b border-cr-border pb-3">
          {tabs.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => setScope(t.value)}
              className={`px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.14em] transition ${
                scope === t.value
                  ? "border-2 border-cr-primary bg-cr-primary text-cr-text-inverse"
                  : "border-2 border-cr-border text-cr-text-muted hover:border-cr-primary"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <LiveActivityFeed
          scope={scope}
          city={scope === "city" ? user?.home_city ?? undefined : undefined}
          limit={40}
          layout="card"
          emptyMessage="Aún no hay actividad en este ámbito."
        />
      </div>
    </main>
  );
}
