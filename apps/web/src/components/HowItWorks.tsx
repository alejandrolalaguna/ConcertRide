import { Calendar, Car, Music } from "lucide-react";
import { motion } from "motion/react";

const STEPS = [
  {
    n: "01",
    color: "#dbff00",
    glowColor: "rgba(219,255,0,0.35)",
    bgGlow: "rgba(219,255,0,0.05)",
    icon: Calendar,
    title: "Elige el concierto",
    body: "Busca por artista, festival o ciudad. Ve los viajes activos al instante en nuestro catálogo de +120 eventos.",
    img: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?w=600&q=70&auto=format&fit=crop",
  },
  {
    n: "02",
    color: "#ff4f00",
    glowColor: "rgba(255,79,0,0.35)",
    bgGlow: "rgba(255,79,0,0.05)",
    icon: Car,
    title: "Reserva o publica",
    body: "Ocupa un asiento libre o abre tu coche. Tú decides el precio para cubrir gasolina y peajes, nada más.",
    img: "https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&q=70&auto=format&fit=crop",
  },
  {
    n: "03",
    color: "#dbff00",
    glowColor: "rgba(219,255,0,0.35)",
    bgGlow: "rgba(219,255,0,0.05)",
    icon: Music,
    title: "A rockear juntos",
    body: "Playlist compartida, buena compañía y al recinto a tiempo. Así empieza la noche perfecta.",
    img: "https://images.unsplash.com/photo-1470229538611-16ba8c7ffbd7?w=600&q=70&auto=format&fit=crop",
  },
];

export function HowItWorks() {
  return (
    <section
      aria-label="Cómo funciona"
      id="como-funciona"
      className="relative py-24 md:py-32 px-6 overflow-hidden"
      style={{ backgroundColor: "#0a0a0a" }}
    >
      {/* Dot grid */}
      <div
        aria-hidden="true"
        className="absolute inset-0 pointer-events-none opacity-[0.3]"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.10) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
          maskImage: "radial-gradient(ellipse 85% 85% at 50% 50%, black 40%, transparent 100%)",
          WebkitMaskImage: "radial-gradient(ellipse 85% 85% at 50% 50%, black 40%, transparent 100%)",
        }}
      />
      {/* Orange glow top-right */}
      <div
        aria-hidden="true"
        className="absolute top-0 right-0 w-[600px] h-[350px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 100% 0%, rgba(255,79,0,0.08) 0%, transparent 60%)" }}
      />
      {/* Lime glow bottom-left */}
      <div
        aria-hidden="true"
        className="absolute bottom-0 left-0 w-[600px] h-[350px] pointer-events-none"
        style={{ background: "radial-gradient(ellipse at 0% 100%, rgba(219,255,0,0.08) 0%, transparent 60%)" }}
      />

      <div className="relative max-w-6xl mx-auto">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mb-16 space-y-4"
        >
          <p className="font-mono text-xs tracking-[0.3em] uppercase text-[#dbff00]">
            Cómo funciona
          </p>
          <h2 className="font-display text-4xl lg:text-6xl uppercase tracking-tight leading-[0.88]">
            Tres pasos.{" "}
            <span className="text-white/25">Cero rollos.</span>
          </h2>
        </motion.header>

        <ol className="grid grid-cols-1 md:grid-cols-3 gap-px bg-white/[0.04]">
          {STEPS.map((step, i) => {
            const Icon = step.icon;
            return (
              <motion.li
                key={step.n}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, delay: i * 0.12, ease: [0.16, 1, 0.3, 1] }}
                className="relative bg-[#0a0a0a] flex flex-col overflow-hidden group"
              >
                {/* Photo strip — top of card */}
                <div className="relative h-44 overflow-hidden flex-shrink-0">
                  <motion.img
                    src={step.img}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    className="w-full h-full object-cover object-center"
                    whileHover={{ scale: 1.06 }}
                    transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                  />
                  {/* Dark overlay fading to card bg */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-[#0a0a0a]" />
                  {/* Step number badge on photo */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: i * 0.12 + 0.3 }}
                    className="absolute top-4 left-4 font-mono text-5xl leading-none font-semibold"
                    style={{
                      color: step.color,
                      textShadow: `0 0 30px ${step.glowColor}, 0 0 60px ${step.glowColor.replace("0.35", "0.15")}`,
                    }}
                  >
                    {step.n}
                  </motion.p>
                </div>

                {/* Card body */}
                <div className="flex flex-col gap-5 p-8 md:p-10 flex-1">
                  {/* Hover atmospheric glow */}
                  <div
                    aria-hidden="true"
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                    style={{ background: `radial-gradient(ellipse at 30% 60%, ${step.bgGlow} 0%, transparent 65%)` }}
                  />

                  {/* Icon box */}
                  <div
                    className="w-10 h-10 flex items-center justify-center transition-all duration-300 group-hover:scale-110 group-hover:shadow-[0_0_16px_currentColor] relative"
                    style={{ border: `1px solid ${step.color}40`, color: step.color }}
                  >
                    <Icon size={18} aria-hidden="true" />
                  </div>

                  <div className="space-y-3 flex-1 relative">
                    <h3 className="font-display text-lg uppercase tracking-tight text-white group-hover:text-[#f5f5f5] transition-colors">
                      {step.title}
                    </h3>
                    <p className="font-sans text-sm text-white/40 leading-relaxed font-light group-hover:text-white/55 transition-colors">
                      {step.body}
                    </p>
                  </div>

                  {/* Animated bottom line */}
                  <div className="h-[2px] bg-white/[0.04] relative overflow-hidden">
                    <motion.div
                      className="absolute inset-y-0 left-0"
                      initial={{ width: "0%" }}
                      whileInView={{ width: "100%" }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.9, delay: i * 0.12 + 0.5, ease: [0.16, 1, 0.3, 1] }}
                      style={{ background: `linear-gradient(to right, ${step.color}, ${step.color}40)` }}
                    />
                  </div>
                </div>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
