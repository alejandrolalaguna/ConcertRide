import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

const TRUST_BADGES = [
  "Sin tarjeta de crédito",
  "100% gratuito",
  "Sin comisiones",
  "Cancela cuando quieras",
];

export function FinalCTA() {
  return (
    <section
      aria-labelledby="final-cta"
      className="relative overflow-hidden min-h-[70vh]"
    >
      {/* Background festival crowd photo */}
      <img
        aria-hidden="true"
        src="https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=1800&q=80&auto=format&fit=crop"
        alt=""
        width={1800}
        height={1200}
        loading="lazy"
        decoding="async"
        className="absolute inset-0 w-full h-full object-cover object-center pointer-events-none"
      />
      {/* Dark overlay — lighter to show more image */}
      <div aria-hidden="true" className="absolute inset-0 bg-[#080808]/60 pointer-events-none" />
      {/* Bottom darkening */}
      <div aria-hidden="true" className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-[#080808] to-transparent pointer-events-none" />

      {/* Lime bloom centered above headline */}
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] pointer-events-none"
        style={{
          background: "radial-gradient(ellipse 60% 80% at 50% 0%, rgba(219,255,0,0.16) 0%, transparent 65%)",
          filter: "blur(30px)",
        }}
      />
      {/* Floating orange orb */}
      <div
        aria-hidden="true"
        className="cr-float-slow absolute bottom-1/4 right-[10%] w-[300px] h-[300px] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(255,79,0,0.08) 0%, transparent 70%)", filter: "blur(40px)" }}
      />

      {/* Pulsing rings */}
      <div aria-hidden="true" className="cr-ring-pulse absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full pointer-events-none border border-[#dbff00]/15" />
      <div aria-hidden="true" className="cr-ring-pulse absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[450px] h-[450px] rounded-full pointer-events-none border border-[#dbff00]/20" style={{ animationDelay: "1.5s" }} />
      <div aria-hidden="true" className="cr-ring-pulse absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] h-[250px] rounded-full pointer-events-none border border-[#dbff00]/25" style={{ animationDelay: "0.75s" }} />

      <CornerAccents />

      <div className="relative z-10 max-w-5xl mx-auto px-6 lg:px-8 py-28 lg:py-40 text-center">

        {/* Eyebrow */}
        <motion.span
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="font-mono text-xs tracking-[0.3em] text-[#dbff00] uppercase"
        >
          Únete al movimiento
        </motion.span>

        {/* Headline */}
        <motion.h2
          id="final-cta"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-display uppercase tracking-tight mt-6 leading-[0.84]"
          style={{ fontSize: "clamp(2.8rem, 8vw, 7rem)" }}
        >
          Tu próximo
          <br />
          <span className="text-[#dbff00]">concierto te espera.</span>
        </motion.h2>

        {/* Body */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-white/45 font-light leading-relaxed max-w-lg mx-auto mt-8 text-lg font-sans"
        >
          Únete a la comunidad que ya viaja diferente. Regístrate en 30 segundos y encuentra
          asiento a tu próximo festival — sin comisiones, sin rollos.
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.4, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row gap-4 justify-center mt-12"
        >
          <a
            href="/register"
            className="cr-btn-shine inline-flex items-center justify-center gap-3 px-10 py-5 bg-[#dbff00] text-[#080808] font-semibold text-sm uppercase tracking-wider group hover:bg-[#c8ec00] transition-colors duration-150"
          >
            Crear cuenta gratis — 30 segundos
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
          </a>
          <a
            href="/concerts"
            className="inline-flex items-center justify-center px-10 py-5 border border-white/20 text-white/70 font-semibold text-sm uppercase tracking-wider hover:border-white/40 hover:text-white transition-all font-sans"
          >
            Buscar viajes sin registrarme →
          </a>
        </motion.div>

        {/* Trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.45 }}
          className="flex flex-wrap items-center justify-center gap-6 mt-10"
        >
          {TRUST_BADGES.map((badge) => (
            <span key={badge} className="flex items-center gap-2 font-mono text-[11px] text-white/30 tracking-widest uppercase">
              <span className="w-1 h-1 rounded-full bg-[#dbff00]/40" aria-hidden="true" />
              {badge}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function CornerAccents() {
  return (
    <>
      <span aria-hidden="true" className="absolute top-10 left-10 w-16 h-px bg-[#dbff00]" />
      <span aria-hidden="true" className="absolute top-10 left-10 w-px h-16 bg-[#dbff00]" />
      <span aria-hidden="true" className="absolute top-10 right-10 w-16 h-px bg-[#dbff00]" />
      <span aria-hidden="true" className="absolute top-10 right-10 w-px h-16 bg-[#dbff00]" />
      <span aria-hidden="true" className="absolute bottom-10 left-10 w-16 h-px bg-[#dbff00]" />
      <span aria-hidden="true" className="absolute bottom-10 left-10 w-px h-16 bg-[#dbff00]" />
      <span aria-hidden="true" className="absolute bottom-10 right-10 w-16 h-px bg-[#dbff00]" />
      <span aria-hidden="true" className="absolute bottom-10 right-10 w-px h-16 bg-[#dbff00]" />
    </>
  );
}
