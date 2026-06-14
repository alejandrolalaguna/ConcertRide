import { motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, Fuel, Users, Star } from "lucide-react";
import { Link } from "react-router-dom";
import { useRef } from "react";
import { useI18n } from "@/lib/i18n";

export function DriverCTA() {
  const { locale } = useI18n();
  const BENEFITS = locale === "en"
    ? [
        {
          icon: Fuel,
          title: "Get your fuel back",
          body: "Split the cost between passengers. The trip ends up free for you.",
          color: "#dbff00",
        },
        {
          icon: Users,
          title: "Good company",
          body: "Fans heading to the same show. The conversation just happens.",
          color: "#ff4f00",
        },
        {
          icon: Star,
          title: "Build your reputation",
          body: "Real ratings that unlock more trips and more seats.",
          color: "#dbff00",
        },
      ]
    : [
        {
          icon: Fuel,
          title: "Recupera la gasolina",
          body: "Divide el coste entre los pasajeros. El viaje te sale gratis.",
          color: "#dbff00",
        },
        {
          icon: Users,
          title: "Compañía del buena",
          body: "Fans que van al mismo show. La charla sola se da.",
          color: "#ff4f00",
        },
        {
          icon: Star,
          title: "Construye tu reputación",
          body: "Valoraciones reales que te abren más viajes y más plazas.",
          color: "#dbff00",
        },
      ];
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start end", "end start"] });
  const imgY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);

  return (
    <section
      ref={sectionRef}
      aria-labelledby="driver-cta-title"
      id="conductores"
      className="relative py-24 lg:py-32 px-6 overflow-hidden bg-[#0a0a0a]"
    >
      {/* Parallax background */}
      <motion.div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ y: imgY }}
      >
        <img
          src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1400&q=80&auto=format&fit=crop"
          alt=""
          width={1400}
          height={800}
          loading="lazy"
          decoding="async"
          className="w-full h-[115%] object-cover object-center opacity-30"
        />
      </motion.div>
      {/* Gradient overlays — directional, not full cover */}
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-r from-[#0a0a0a] via-[#0a0a0a]/80 to-[#0a0a0a]/20 pointer-events-none" />
      <div aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-transparent to-[#0a0a0a]/50 pointer-events-none" />
      {/* Orange fire bloom */}
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 w-[600px] h-[400px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 100% 0%, rgba(255,79,0,0.10) 0%, transparent 55%)" }}
      />

      <div className="relative max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left — copy */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="space-y-4"
            >
              <p className="font-mono text-xs tracking-[0.3em] uppercase text-[#ff4f00]">
                {locale === "en" ? "For drivers" : "Para conductores"}
              </p>
              <h2
                id="driver-cta-title"
                className="font-display text-4xl lg:text-6xl uppercase tracking-tight leading-[0.88]"
              >
                {locale === "en" ? "Your car." : "Tu coche."}
                <br />
                <span className="text-[#dbff00]">{locale === "en" ? "Your trip." : "Tu viaje."}</span>
                <br />
                {locale === "en" ? "Your rules." : "Tus reglas."}
              </h2>
              {/* Animated orange underline */}
              <motion.div
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
                className="origin-left h-[2px] bg-[#ff4f00] w-16"
                aria-hidden="true"
              />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="font-sans text-base text-white/45 font-light leading-relaxed max-w-lg"
            >
              {locale === "en"
                ? "Post your trip to the show in 2 minutes. Choose how many passengers, the price per seat and whether you want stops. You're in full control."
                : "Publica tu viaje al concierto en 2 minutos. Elige cuántos pasajeros, el precio del asiento y si quieres paradas. Tú tienes el control total."}
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <Link
                to="/register"
                className="cr-btn-shine inline-flex items-center justify-center gap-2 bg-[#dbff00] text-black font-sans font-semibold uppercase tracking-[0.12em] text-sm px-8 py-4 hover:bg-[#c8ec00] transition-colors duration-150 group"
              >
                {locale === "en" ? "Create account & publish" : "Crear cuenta y publicar"}
                <ArrowRight size={14} className="transition-transform duration-150 group-hover:translate-x-1" aria-hidden="true" />
              </Link>
              <Link
                to="/publish"
                className="inline-flex items-center justify-center font-mono text-xs text-white/45 uppercase tracking-[0.15em] hover:text-white transition-colors duration-150"
              >
                {locale === "en" ? "I already have an account → publish a trip" : "Ya tengo cuenta → publicar viaje"}
              </Link>
            </motion.div>
          </div>

          {/* Right — benefit cards */}
          <div className="space-y-0">
            {BENEFITS.map((benefit, i) => (
              <motion.div
                key={benefit.title}
                initial={{ opacity: 0, x: 32 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ x: 4, transition: { duration: 0.2 } }}
                className="group flex items-start gap-5 p-7 border border-white/[0.06] hover:border-[#dbff00]/25 hover:bg-[#dbff00]/[0.025] transition-all duration-250 -mt-px first:mt-0 relative overflow-hidden"
              >
                {/* Hover left accent */}
                <div
                  aria-hidden="true"
                  className="absolute left-0 top-0 bottom-0 w-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: `linear-gradient(to bottom, transparent, ${benefit.color}, transparent)` }}
                />
                {/* Icon */}
                <div
                  className="w-10 h-10 flex-shrink-0 flex items-center justify-center transition-all duration-300 group-hover:scale-110 mt-0.5"
                  style={{ border: `1px solid ${benefit.color}40`, color: benefit.color }}
                >
                  <benefit.icon size={16} aria-hidden="true" />
                </div>
                <div className="space-y-1">
                  <h3 className="font-display text-base uppercase tracking-tight text-white group-hover:text-[#f5f5f5] transition-colors">
                    {benefit.title}
                  </h3>
                  <p className="font-sans text-sm text-white/40 font-light leading-relaxed group-hover:text-white/55 transition-colors">
                    {benefit.body}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
