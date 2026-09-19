import { useI18n } from "@/lib/i18n";
import { Eyebrow, SectionHead } from "@/components/system";

const TRUST_POINTS = ["home.trustPoint1", "home.trustPoint2", "home.trustPoint3"] as const;

// Cifras del sector con fuente externa. Las cifras propias de la plataforma
// (que no podíamos demostrar) se han retirado: el argumento está en el texto.
const SECTOR_STATS = [
  { figure: "+25M", labelKey: "home.trustSectorStat1Label", source: "APM 2024", sourceUrl: "https://www.apmusicales.com/" },
  { figure: "1.000+", labelKey: "home.trustSectorStat2Label", source: "APM 2024", sourceUrl: "https://www.apmusicales.com/" },
  { figure: "80%", labelKey: "home.trustSectorStat3Label", source: "Julie's Bicycle", sourceUrl: "https://juliesbicycle.com/" },
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

/**
 * Sector en cifras + FAQ larga (con schema FAQPage) + condiciones. El
 * contenido indexable es idéntico al anterior; sólo cambia la forma.
 */
export function TrustSection() {
  const { t } = useI18n();

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map(({ questionKey, answerKey }) => ({
      "@type": "Question",
      name: t(questionKey),
      acceptedAnswer: { "@type": "Answer", text: t(answerKey) },
    })),
  };

  return (
    <section aria-labelledby="trust-title" className="px-6 py-[var(--rhythm-2)] border-t border-cr-border">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />

      <div className="max-w-6xl mx-auto flex flex-col gap-[var(--rhythm-2)]">
        {/* ── El sector en cifras ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHead
              id="trust-title"
              eyebrow={t("home.trustSectorEyebrow")}
              title={
                <>
                  {t("home.trustSectorTitleLine1")}
                  <br />
                  {t("home.trustSectorTitleLine2")}
                </>
              }
              lede={t("home.trustSectorIntro")}
              scan="words"
            />
          </div>
          <dl className="lg:col-span-7 cr-register" data-scan="rise" data-scan-children="">
            {SECTOR_STATS.map(({ figure, labelKey, source, sourceUrl }) => (
              <div key={figure} className="cr-register__row !items-baseline">
                <dt className="cr-register__title !col-span-4 font-display text-display-m cr-tabular text-cr-text !transform-none">{figure}</dt>
                <dd className="cr-register__desc !col-span-6 text-sm text-cr-text-muted leading-relaxed">{t(labelKey)}</dd>
                <dd className="cr-register__action">
                  <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="cr-link cr-label text-cr-text-muted hover:text-cr-text">
                    {t("home.trustSectorSource", { source })}
                  </a>
                </dd>
              </div>
            ))}
          </dl>
        </div>

        {/* ── FAQ larga (FAQPage) ── */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
          <div className="lg:col-span-4">
            <Eyebrow>{t("home.trustFaqEyebrow")}</Eyebrow>
            <h3 className="font-display text-display-m mt-4 max-w-[16ch]">{t("home.trustFaqTitle")}</h3>
          </div>
          <div className="lg:col-span-8 cr-register">
            {FAQ_ITEMS.map(({ questionKey, answerKey }) => (
              <details key={questionKey} className="group border-b border-cr-border">
                <summary className="flex items-center justify-between gap-6 py-4 cursor-pointer list-none select-none text-left">
                  <span className="text-base font-medium text-cr-text leading-snug">{t(questionKey)}</span>
                  <span
                    className="flex-shrink-0 w-6 h-6 border border-cr-border-mid flex items-center justify-center text-cr-text-muted group-open:rotate-45 transition-transform duration-[var(--dur-2)]"
                    aria-hidden="true"
                  >
                    +
                  </span>
                </summary>
                <p className="cr-prose pb-5 text-sm text-cr-text-muted leading-relaxed">{t(answerKey)}</p>
              </details>
            ))}
          </div>
        </div>

        {/* ── Condiciones ── */}
        <ul className="flex flex-wrap items-center gap-x-8 gap-y-3 border-t border-cr-border pt-6">
          {TRUST_POINTS.map((pointKey) => (
            <li key={pointKey} className="cr-label text-cr-text-muted flex items-center gap-2">
              <span className="w-1.5 h-px bg-cr-primary" aria-hidden="true" />
              {t(pointKey)}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
