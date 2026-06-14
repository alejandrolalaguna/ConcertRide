import { useState } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { RefreshCw } from "lucide-react";
import { useSeoMeta } from "@/lib/useSeoMeta";
import { SITE_URL } from "@/lib/siteUrl";
import { useSession } from "@/lib/session";
import { useI18n } from "@/lib/i18n";
import type { ActivityScope } from "@concertride/types";
import { LiveActivityFeed } from "@/components/LiveActivityFeed";

const TABS: Array<{ value: ActivityScope; labelKey: string; descriptionKey: string }> = [
  { value: "all", labelKey: "feed.tabAll", descriptionKey: "feed.tabAllDesc" },
  { value: "city", labelKey: "feed.tabCity", descriptionKey: "feed.tabCityDesc" },
  { value: "crew", labelKey: "feed.tabCrew", descriptionKey: "feed.tabCrewDesc" },
];

export default function FeedPage() {
  const { user } = useSession();
  const { t } = useI18n();
  const [scope, setScope] = useState<ActivityScope>("all");
  const [refreshKey, setRefreshKey] = useState(0);

  function handleRefresh() {
    setRefreshKey((k) => k + 1);
    toast.success(t("feed.toastRefreshed"));
  }

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
            {t("feed.eyebrow")}
          </p>
          <h1 className="mt-2 font-display text-4xl uppercase leading-tight">
            {t("feed.title")}
          </h1>
          <p className="mt-2 max-w-prose text-sm text-cr-text-muted">
            {activeTab ? t(activeTab.descriptionKey) : ""}
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-6 sm:px-6">
        <div className="mb-4 flex flex-wrap items-center gap-2 border-b border-cr-border pb-3">
          {tabs.map((tab) => (
            <button
              key={tab.value}
              type="button"
              onClick={() => setScope(tab.value)}
              className={`px-3 py-1.5 font-mono text-[11px] font-bold uppercase tracking-[0.14em] transition ${
                scope === tab.value
                  ? "border-2 border-cr-primary bg-cr-primary text-cr-text-inverse"
                  : "border-2 border-cr-border text-cr-text-muted hover:border-cr-primary"
              }`}
            >
              {t(tab.labelKey)}
            </button>
          ))}
          <button
            type="button"
            onClick={handleRefresh}
            aria-label={t("feed.refreshAria")}
            className="ml-auto font-mono text-[10px] uppercase text-cr-text-muted hover:text-cr-primary transition-colors flex items-center gap-1"
          >
            <RefreshCw className="w-3 h-3" /> {t("feed.refresh")}
          </button>
        </div>
        <motion.div
          key={`${scope}-${refreshKey}`}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <LiveActivityFeed
            scope={scope}
            city={scope === "city" ? user?.home_city ?? undefined : undefined}
            limit={40}
            layout="card"
            emptyMessage={t("feed.emptyMessage")}
          />
        </motion.div>
      </div>
    </main>
  );
}
