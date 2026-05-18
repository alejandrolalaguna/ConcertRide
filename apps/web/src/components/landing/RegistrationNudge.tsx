import { motion } from "motion/react";
import { ArrowRight, Users, Zap, Shield } from "lucide-react";

const JOINING_MESSAGES = [
  "María · Sevilla · hace 3 min",
  "Carlos · Valencia · hace 7 min",
  "Lucía · Bilbao · hace 12 min",
  "Rafa · Málaga · hace 18 min",
];

const BADGES = [
  { icon: Zap, text: "30 segundos para empezar" },
  { icon: Users, text: "Sin tarjeta de crédito" },
  { icon: Shield, text: "0€ comisión siempre" },
];

export function RegistrationNudge() {
  return (
    <section
      aria-label="Únete a ConcertRide"
      className="relative overflow-hidden border-y border-[#dbff00]/15"
      style={{ backgroundColor: "#09100a" }}
    >
      {/* Background texture */}
      <img
        aria-hidden="true"
        src="https://images.unsplash.com/photo-1506157786151-b8491531f063?w=1400&q=40&auto=format&fit=crop"
        alt=""
        width={1400}
        height={800}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover object-top opacity-[0.06] pointer-events-none"
      />
      {/* Lime bloom center */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none"
        style={{ background: "radial-gradient(ellipse 70% 80% at 50% 50%, rgba(219,255,0,0.08) 0%, transparent 65%)" }}
      />
      {/* Animated scan divider at top */}
      <div aria-hidden="true" className="absolute top-0 left-0 right-0 h-px" style={{ background: "linear-gradient(to right, transparent, rgba(219,255,0,0.5) 50%, transparent)" }} />

      <div className="relative max-w-6xl mx-auto px-6 py-10 md:py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-8 md:gap-12">

          {/* Left — urgency copy */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col gap-4 text-center md:text-left"
          >
            {/* Live indicator */}
            <div className="flex items-center justify-center md:justify-start gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#dbff00] opacity-50" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#dbff00]" />
              </span>
              <span className="font-mono text-[10px] text-[#dbff00]/70 uppercase tracking-[0.2em]">
                Usuarios uniéndose ahora
              </span>
            </div>

            <div>
              <p className="font-display text-2xl md:text-3xl uppercase tracking-tight leading-tight text-white">
                +2.000 fans registrados.
              </p>
              <p className="font-display text-2xl md:text-3xl uppercase tracking-tight leading-tight text-[#dbff00]">
                Únete gratis hoy.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-5 gap-y-2">
              {BADGES.map(({ icon: Icon, text }) => (
                <span key={text} className="flex items-center gap-1.5 font-mono text-[10px] text-white/30 uppercase tracking-[0.1em]">
                  <Icon size={10} className="text-[#dbff00]/50" aria-hidden="true" />
                  {text}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Right — CTA */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="flex-shrink-0 flex flex-col items-center gap-3"
          >
            <a
              href="/register"
              className="cr-btn-shine inline-flex items-center gap-3 bg-[#dbff00] text-[#080808] font-semibold text-sm uppercase tracking-wider px-10 py-4 hover:bg-[#c8ec00] transition-colors duration-150 group"
            >
              Crear cuenta gratis
              <ArrowRight size={14} className="transition-transform duration-150 group-hover:translate-x-1" aria-hidden="true" />
            </a>
            <p className="font-mono text-[9px] text-white/20 uppercase tracking-[0.12em]">
              Sin tarjeta · Sin comisión · Cancela cuando quieras
            </p>
          </motion.div>
        </div>

        {/* Live join ticker */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 pt-5 border-t border-[#dbff00]/[0.08] grid grid-cols-2 md:grid-cols-4 gap-3"
          aria-hidden="true"
        >
          {JOINING_MESSAGES.map((msg, i) => (
            <motion.div
              key={msg}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.4 + i * 0.06 }}
              className="flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-[#dbff00]/35 flex-shrink-0" />
              <span className="font-mono text-[9px] text-white/22 uppercase tracking-[0.1em] truncate">
                {msg}
              </span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
