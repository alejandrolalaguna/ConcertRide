import { motion } from "motion/react";
import { Quote } from "lucide-react";
import { TESTIMONIALS } from "@/lib/testimonials";
import { useI18n } from "@/lib/i18n";

function Stars({ rating }: { rating: number }) {
  const { t } = useI18n();
  return (
    <span className="flex gap-0.5" aria-label={t("home.testimonialsStarsAria", { rating })}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          className={`text-[12px] transition-colors ${n <= Math.round(rating) ? "text-[#dbff00]" : "text-white/10"}`}
          aria-hidden="true"
        >
          ★
        </span>
      ))}
    </span>
  );
}

export function TestimonialsSection() {
  const { t } = useI18n();
  return (
    <section
      aria-labelledby="testimonials-title"
      aria-label={t("home.testimonialsSectionAria")}
      className="relative py-24 lg:py-32 px-6 overflow-hidden"
      style={{ backgroundColor: "#080808" }}
      id="testimonials"
    >
      {/* Subtle concert bg */}
      <img
        aria-hidden="true"
        src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1400&q=40&auto=format&fit=crop"
        alt=""
        width={1400}
        height={800}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover object-center opacity-[0.04] pointer-events-none"
      />
      {/* Orange bloom top-right */}
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 w-[700px] h-[400px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 100% 0%, rgba(255,79,0,0.06) 0%, transparent 55%)" }}
      />
      {/* Lime bloom bottom-left */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 w-[600px] h-[300px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 0% 100%, rgba(219,255,0,0.05) 0%, transparent 55%)" }}
      />

      <div className="relative max-w-6xl mx-auto space-y-14">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col md:flex-row md:items-end md:justify-between gap-6"
        >
          <div className="space-y-4">
            <p className="font-mono text-xs tracking-[0.3em] uppercase text-[#ff4f00]">
              {t("home.testimonialsEyebrow")}
            </p>
            <h2
              id="testimonials-title"
              className="font-display text-4xl lg:text-6xl uppercase tracking-tight leading-[0.88]"
            >
              {t("home.testimonialsTitleLine1")}
              <br />
              <span className="text-white/25">{t("home.testimonialsTitleLine2")}</span>
            </h2>
          </div>
          {/* Live count badge */}
          <div className="hidden md:flex items-center gap-3 mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#dbff00] animate-pulse flex-shrink-0" aria-hidden="true" />
            <span className="font-mono text-[10px] text-white/30 uppercase tracking-[0.15em]">
              {t("home.testimonialsLiveCount")}
            </span>
          </div>
        </motion.div>

        {/* 4-column masonry-feel grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px bg-white/[0.05]">
          {TESTIMONIALS.map((t, i) => (
            <motion.article
              key={t.id}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.5, delay: i * 0.07, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className="relative bg-[#080808] p-7 flex flex-col gap-5 group cursor-default overflow-hidden"
            >
              {/* Hover glow */}
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-400 pointer-events-none"
                style={{ background: `radial-gradient(ellipse at 0% 0%, ${t.avatarColor === "#dbff00" ? "rgba(219,255,0,0.04)" : "rgba(255,79,0,0.04)"} 0%, transparent 60%)` }}
              />
              {/* Thin top accent line */}
              <div
                aria-hidden="true"
                className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `linear-gradient(to right, ${t.avatarColor}, transparent)` }}
              />

              {/* Stars + savings */}
              <div className="flex items-center justify-between gap-2 relative">
                <Stars rating={t.rating} />
                <span
                  className="font-mono text-[9px] border px-1.5 py-0.5 uppercase tracking-[0.08em] flex-shrink-0"
                  style={{ color: t.avatarColor, borderColor: `${t.avatarColor}30`, backgroundColor: `${t.avatarColor}08` }}
                >
                  {t.savings}
                </span>
              </div>

              {/* Quote icon + text */}
              <blockquote className="flex-1 relative space-y-2">
                <Quote
                  size={16}
                  className="opacity-20 -mt-1"
                  style={{ color: t.avatarColor }}
                  aria-hidden="true"
                />
                <p className="font-sans text-sm text-white/60 font-light leading-relaxed group-hover:text-white/75 transition-colors duration-200">
                  {t.quote}
                </p>
              </blockquote>

              {/* Author */}
              <figcaption className="flex items-center gap-3 pt-3 border-t border-white/[0.06] relative">
                <div
                  className="w-9 h-9 flex-shrink-0 flex items-center justify-center font-display font-black text-black text-xs transition-transform duration-200 group-hover:scale-110"
                  style={{ backgroundColor: t.avatarColor }}
                  aria-hidden="true"
                >
                  {t.initial}
                </div>
                <div className="min-w-0">
                  <cite className="not-italic font-sans text-sm font-semibold text-white truncate block">{t.author}</cite>
                  <p className="font-mono text-[9px] text-white/30 uppercase tracking-[0.08em] truncate flex items-center gap-1">
                    <span aria-hidden="true">🚗</span> <span>{t.route}</span>
                  </p>
                </div>
                {/* Festival badge */}
                <span className="ml-auto flex-shrink-0 font-mono text-[8px] text-white/20 uppercase tracking-[0.06em] text-right leading-tight">
                  {t.festival}
                </span>
              </figcaption>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
