import { motion } from "motion/react";

export function FinalCTA() {
  return (
    <section
      aria-labelledby="final-cta"
      className="relative min-h-dvh flex items-center justify-center overflow-hidden bg-cr-bg"
    >
      <CornerAccents />

      <div className="relative text-center px-6 max-w-4xl mx-auto space-y-10">
        <motion.h2
          id="final-cta"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="font-display uppercase leading-[0.9] text-[52px] sm:text-[88px] md:text-[132px]"
        >
          ¿Listo <br />
          <span className="text-cr-primary">para el show?</span>
        </motion.h2>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <a
            href="/concerts"
            className="inline-flex items-center justify-center bg-cr-primary text-black font-sans font-semibold uppercase tracking-[0.12em] text-sm border-2 border-black px-8 py-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all duration-100"
          >
            Buscar un viaje
          </a>
          <a
            href="/publish"
            className="inline-flex items-center justify-center bg-transparent text-cr-text font-sans font-semibold uppercase tracking-[0.12em] text-sm border-2 border-cr-border hover:border-cr-primary hover:text-cr-primary px-8 py-4 transition-colors duration-150"
          >
            Ofrecer mi coche
          </a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="font-mono text-xs text-cr-text-muted"
        >
          Madrid · Barcelona · Valencia · Sevilla · Bilbao · Zaragoza · y más
        </motion.p>
      </div>
    </section>
  );
}

function CornerAccents() {
  return (
    <>
      <span aria-hidden="true" className="absolute top-10 left-10 w-16 h-px bg-cr-primary" />
      <span aria-hidden="true" className="absolute top-10 left-10 w-px h-16 bg-cr-primary" />
      <span aria-hidden="true" className="absolute top-10 right-10 w-16 h-px bg-cr-primary" />
      <span aria-hidden="true" className="absolute top-10 right-10 w-px h-16 bg-cr-primary" />
      <span aria-hidden="true" className="absolute bottom-10 left-10 w-16 h-px bg-cr-primary" />
      <span aria-hidden="true" className="absolute bottom-10 left-10 w-px h-16 bg-cr-primary" />
      <span aria-hidden="true" className="absolute bottom-10 right-10 w-16 h-px bg-cr-primary" />
      <span aria-hidden="true" className="absolute bottom-10 right-10 w-px h-16 bg-cr-primary" />
    </>
  );
}
