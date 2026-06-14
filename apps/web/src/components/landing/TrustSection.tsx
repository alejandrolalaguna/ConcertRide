import { Check, TrendingUp, Leaf, Users, MapPin, Music2, Zap, ShieldCheck } from "lucide-react";
import { useI18n } from "@/lib/i18n";

const PLATFORM_STATS = [
  { icon: MapPin, value: "+30", labelKey: "home.trustPlatformStat1Label", sublabelKey: "home.trustPlatformStat1Sublabel" },
  { icon: Music2, value: "0%", labelKey: "home.trustPlatformStat2Label", sublabelKey: "home.trustPlatformStat2Sublabel" },
  { icon: ShieldCheck, value: "100%", labelKey: "home.trustPlatformStat3Label", sublabelKey: "home.trustPlatformStat3Sublabel" },
  { icon: Zap, value: "<2 min", labelKey: "home.trustPlatformStat4Label", sublabelKey: "home.trustPlatformStat4Sublabel" },
] as const;

const TRUST_POINTS = [
  "home.trustPoint1",
  "home.trustPoint2",
  "home.trustPoint3",
] as const;

const SECTOR_STATS = [
  {
    icon: Users,
    figure: "+25M",
    labelKey: "home.trustSectorStat1Label",
    source: "APM 2024",
    sourceUrl: "https://www.apmusicales.com/",
  },
  {
    icon: TrendingUp,
    figure: "1.000+",
    labelKey: "home.trustSectorStat2Label",
    source: "APM 2024",
    sourceUrl: "https://www.apmusicales.com/",
  },
  {
    icon: Leaf,
    figure: "80%",
    labelKey: "home.trustSectorStat3Label",
    source: "Julie's Bicycle",
    sourceUrl: "https://juliesbicycle.com/",
  },
] as const;

const FAQ_ITEMS = [
  { questionKey: "home.trustFaq1Q", answerKey: "home.trustFaq1A" },
  { questionKey: "home.trustFaq2Q", answerKey: "home.trustFaq2A" },
  { questionKey: "home.trustFaq3Q", answerKey: "home.trustFaq3A" },
  { questionKey: "home.trustFaq4Q", answerKey: "home.trustFaq4A" },
  { questionKey: "home.trustFaq5Q", answerKey: "home.trustFaq5A" },
  { questionKey: "home.trustFaq6Q", answerKey: "home.trustFaq6A" },
  { questionKey: "home.trustFaq7Q", answerKey: "home.trustFaq7A" },
  { questionKey: "home.trustFaq8Q", answerKey: "home.trustFaq8A" },
  { questionKey: "home.trustFaq9Q", answerKey: "home.trustFaq9A" },
  { questionKey: "home.trustFaq10Q", answerKey: "home.trustFaq10A" },
  { questionKey: "home.trustFaq11Q", answerKey: "home.trustFaq11A" },
  { questionKey: "home.trustFaq12Q", answerKey: "home.trustFaq12A" },
] as const;

export function TrustSection() {
  const { t } = useI18n();

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map(({ questionKey, answerKey }) => ({
      "@type": "Question",
      name: t(questionKey),
      acceptedAnswer: {
        "@type": "Answer",
        text: t(answerKey),
      },
    })),
  };

  return (
    <section
      aria-labelledby="trust-title"
      className="relative py-20 md:py-28 px-6 border-t border-white/[0.06] overflow-hidden"
      style={{ backgroundColor: "#0a0a0a" }}
    >
      {/* Subtle background image */}
      <img
        aria-hidden="true"
        src="https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1400&q=50&auto=format&fit=crop"
        alt=""
        width={1400}
        height={800}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover object-center opacity-[0.04] pointer-events-none"
      />
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[400px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 50% 0%, rgba(219,255,0,0.05) 0%, transparent 60%)" }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      <div className="relative max-w-6xl mx-auto space-y-16">

        {/* ── Platform metrics — números de ConcertRide ── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-px bg-white/[0.04]">
          {PLATFORM_STATS.map(({ icon: Icon, value, labelKey, sublabelKey }) => (
            <div key={labelKey} className="bg-[#0a0a0a] px-6 py-8 flex flex-col gap-3 group hover:bg-[#0f0f0f] transition-colors duration-200">
              <Icon size={16} className="text-cr-primary" aria-hidden="true" />
              <p
                className="font-display text-3xl md:text-5xl text-cr-primary leading-none"
                style={{ textShadow: "0 0 24px rgba(219,255,0,0.3)" }}
              >
                {value}
              </p>
              <p className="font-sans text-sm font-semibold text-cr-text leading-tight">{t(labelKey)}</p>
              <p className="font-mono text-[10px] text-cr-text-dim uppercase tracking-[0.14em]">{t(sublabelKey)}</p>
            </div>
          ))}
        </div>

        {/* ── Sector stats ── */}
        <div className="space-y-8">
          <header className="space-y-3 max-w-2xl">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
              {t("home.trustSectorEyebrow")}
            </p>
            <h2
              id="trust-title"
              className="font-display text-3xl md:text-5xl uppercase leading-[0.95]"
            >
              {t("home.trustSectorTitleLine1")}<br />{t("home.trustSectorTitleLine2")}
            </h2>
            <p className="font-sans text-sm text-cr-text-muted leading-relaxed max-w-xl">
              {t("home.trustSectorIntro")}
            </p>
          </header>

          <dl className="grid sm:grid-cols-3 gap-px bg-white/[0.04]">
            {SECTOR_STATS.map(({ icon: Icon, figure, labelKey, source, sourceUrl }) => (
              <div
                key={figure}
                className="bg-[#0a0a0a] p-8 space-y-3 flex flex-col justify-between group hover:bg-[#0f0f0f] transition-colors duration-200 relative overflow-hidden"
              >
                {/* Subtle hover glow */}
                <div
                  aria-hidden="true"
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: "radial-gradient(ellipse at 0% 0%, rgba(219,255,0,0.04) 0%, transparent 60%)" }}
                />
                <div className="space-y-2 relative">
                  <Icon size={18} className="text-cr-primary" aria-hidden="true" />
                  <dt
                    className="font-display text-4xl md:text-5xl text-cr-text leading-none"
                    style={{ textShadow: "0 0 40px rgba(219,255,0,0.15)" }}
                  >
                    {figure}
                  </dt>
                  <dd className="font-sans text-sm text-cr-text-muted leading-relaxed">
                    {t(labelKey)}
                  </dd>
                </div>
                <a
                  href={sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-[10px] text-cr-text-dim hover:text-cr-primary transition-colors relative"
                >
                  {t("home.trustSectorSource", { source })}
                </a>
              </div>
            ))}
          </dl>
        </div>

        {/* ── FAQ — FAQPage schema + GEO ── */}
        <div className="space-y-6">
          <header className="space-y-2">
            <p className="font-sans text-[11px] font-semibold uppercase tracking-[0.16em] text-cr-primary">
              {t("home.trustFaqEyebrow")}
            </p>
            <h3 className="font-display text-2xl md:text-3xl uppercase leading-tight">
              {t("home.trustFaqTitle")}
            </h3>
          </header>

          <div className="divide-y divide-cr-border border border-cr-border">
            {FAQ_ITEMS.map(({ questionKey, answerKey }) => (
              <details key={questionKey} className="group">
                <summary className="flex items-center justify-between gap-4 px-6 py-4 cursor-pointer list-none select-none hover:bg-white/[0.02] transition-colors">
                  <span className="font-sans text-sm font-medium text-cr-text leading-snug">
                    {t(questionKey)}
                  </span>
                  <span
                    className="flex-shrink-0 w-5 h-5 border border-cr-border flex items-center justify-center text-cr-text-dim group-open:rotate-45 transition-transform duration-200"
                    aria-hidden="true"
                  >
                    +
                  </span>
                </summary>
                <p className="px-6 pb-5 pt-1 font-sans text-sm text-cr-text-muted leading-relaxed">
                  {t(answerKey)}
                </p>
              </details>
            ))}
          </div>
        </div>

        {/* ── Trust badges ── */}
        <ul className="flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-dashed border-cr-border pt-8">
          {TRUST_POINTS.map((pointKey) => (
            <li
              key={pointKey}
              className="flex items-center gap-2 font-sans text-xs text-cr-text-muted"
            >
              <span className="inline-flex items-center justify-center w-4 h-4 rounded-full bg-cr-primary/15 text-cr-primary">
                <Check size={10} strokeWidth={3} aria-hidden="true" />
              </span>
              {t(pointKey)}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
