import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { Register, RegisterRow, SectionHead } from "@/components/system";

const STEPS = [
  { n: "01", titleKey: "home.hiwStep1Title", bodyKey: "home.hiwStep1Body" },
  { n: "02", titleKey: "home.hiwStep2Title", bodyKey: "home.hiwStep2Body" },
  { n: "03", titleKey: "home.hiwStep3Title", bodyKey: "home.hiwStep3Body" },
] as const;

/**
 * Cómo funciona: tres pasos en registro de 12 columnas. Sin iconos, sin fotos,
 * sin tarjetas. El número grande y el filete hacen la jerarquía.
 */
export function HowItWorks() {
  const { t } = useI18n();
  return (
    <section aria-label={t("home.hiwSectionAria")} id="como-funciona" className="px-6 py-[var(--rhythm-2)]">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
        <div className="lg:col-span-4">
          <SectionHead
            id="hiw-title"
            eyebrow={t("home.hiwEyebrow")}
            title={
              <>
                {t("home.hiwTitleLine1")}
                <br />
                <span className="text-cr-text-muted">{t("home.hiwTitleLine2")}</span>
              </>
            }
            scan="words"
          />
          <Link to="/como-funciona-carpooling" className="cr-link cr-label text-cr-text-muted hover:text-cr-text inline-flex items-center gap-2 mt-8">
            {t("home.faqGuideLink")} <ArrowRight size={14} aria-hidden="true" />
          </Link>
        </div>
        <Register as="ol" className="lg:col-span-8" data-scan="rise" data-scan-children="">
          {STEPS.map((s) => (
            <li key={s.n}>
              <RegisterRow n={s.n} title={t(s.titleKey)} description={t(s.bodyKey)} />
            </li>
          ))}
        </Register>
      </div>
    </section>
  );
}
