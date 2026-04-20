import { motion, useScroll, useTransform } from "motion/react";
import { ChevronDown } from "lucide-react";

export function Hero() {
  const { scrollY } = useScroll();
  const indicatorOpacity = useTransform(scrollY, [0, 120], [1, 0]);
  const stubY = useTransform(scrollY, [0, 600], [0, 160]);

  return (
    <section
      aria-labelledby="hero-title"
      className="relative min-h-dvh flex items-center overflow-hidden bg-cr-bg"
    >
      <NoiseOverlay />
      <CornerTicks />

      <motion.div
        aria-hidden="true"
        style={{ y: stubY }}
        className="absolute top-[14%] right-[-40px] md:right-[6%] w-[220px] md:w-[320px] rotate-[12deg] pointer-events-none opacity-70 md:opacity-95"
      >
        <TicketStub />
      </motion.div>

      <div className="relative w-full max-w-6xl mx-auto px-6 md:px-10 py-24 md:py-32 space-y-10">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="font-sans text-[11px] font-semibold uppercase tracking-[0.24em] text-cr-primary"
        >
          ConcertRide · España · Temporada 2026
        </motion.p>

        <motion.h1
          id="hero-title"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="font-display uppercase leading-[0.88] tracking-tight text-[56px] sm:text-[88px] md:text-[120px] lg:text-[144px]"
        >
          Al concierto
          <br />
          <span className="text-cr-primary">juntos.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.15 }}
          className="font-sans text-base md:text-xl text-cr-text-muted max-w-xl leading-relaxed"
        >
          Comparte el viaje. Divide el coste. Llega al show.
          <br className="hidden md:block" />
          La plataforma de viajes compartidos a conciertos en España.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.25 }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <a
            href="/concerts"
            className="inline-flex items-center justify-center bg-cr-primary text-black font-sans font-semibold uppercase tracking-[0.12em] text-sm border-2 border-black px-6 py-4 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all duration-100"
          >
            Buscar un viaje
          </a>
          <a
            href="/publish"
            className="inline-flex items-center justify-center bg-transparent text-cr-text font-sans font-semibold uppercase tracking-[0.12em] text-sm border-2 border-cr-border hover:border-cr-primary hover:text-cr-primary px-6 py-4 transition-colors duration-150"
          >
            Ofrecer mi coche
          </a>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="font-mono text-xs text-cr-text-muted"
        >
          <span aria-hidden="true">🎸</span> 12,000+ viajeros nos avalan ·{" "}
          <span className="text-cr-primary">★ 4.9</span>
        </motion.p>
      </div>

      <motion.div
        style={{ opacity: indicatorOpacity }}
        aria-hidden="true"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-cr-text-dim"
      >
        <span className="font-mono text-[10px] uppercase tracking-[0.24em]">Scroll</span>
        <ChevronDown size={16} className="animate-bounce" />
      </motion.div>
    </section>
  );
}

function NoiseOverlay() {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-0 pointer-events-none opacity-[0.035] mix-blend-screen"
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='180' height='180'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 1 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>\")",
      }}
    />
  );
}

function CornerTicks() {
  return (
    <>
      <span aria-hidden="true" className="absolute top-6 left-6 w-6 h-px bg-cr-primary" />
      <span aria-hidden="true" className="absolute top-6 left-6 w-px h-6 bg-cr-primary" />
      <span aria-hidden="true" className="absolute top-6 right-6 w-6 h-px bg-cr-primary" />
      <span aria-hidden="true" className="absolute top-6 right-6 w-px h-6 bg-cr-primary" />
      <span aria-hidden="true" className="absolute bottom-6 left-6 w-6 h-px bg-cr-primary" />
      <span aria-hidden="true" className="absolute bottom-6 left-6 w-px h-6 bg-cr-primary" />
      <span aria-hidden="true" className="absolute bottom-6 right-6 w-6 h-px bg-cr-primary" />
      <span aria-hidden="true" className="absolute bottom-6 right-6 w-px h-6 bg-cr-primary" />
    </>
  );
}

function TicketStub() {
  return (
    <svg viewBox="0 0 320 200" className="w-full h-auto drop-shadow-[0_0_40px_rgba(219,255,0,0.25)]">
      <defs>
        <linearGradient id="stubGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#111" />
          <stop offset="100%" stopColor="#1A1A1A" />
        </linearGradient>
      </defs>
      <rect x="0" y="0" width="320" height="200" fill="url(#stubGrad)" stroke="#2A2A2A" strokeWidth="1" />
      <rect x="220" y="0" width="1" height="200" stroke="#2A2A2A" strokeDasharray="6 4" />
      <circle cx="220" cy="0" r="8" fill="#080808" stroke="#2A2A2A" />
      <circle cx="220" cy="200" r="8" fill="#080808" stroke="#2A2A2A" />

      <text x="24" y="42" fill="#DBFF00" fontFamily="'Inter', sans-serif" fontWeight="700" fontSize="10" letterSpacing="2">
        ADMIT ONE · BOARDING
      </text>
      <text x="24" y="86" fill="#F5F5F5" fontFamily="'Archivo Black', sans-serif" fontSize="32" letterSpacing="-1">
        ROSALÍA
      </text>
      <text x="24" y="118" fill="#888" fontFamily="'JetBrains Mono', monospace" fontSize="11">
        WiZink Center · Madrid
      </text>
      <text x="24" y="140" fill="#888" fontFamily="'JetBrains Mono', monospace" fontSize="11">
        22 MAY · 21:00 CEST
      </text>

      <text x="24" y="178" fill="#DBFF00" fontFamily="'Inter', sans-serif" fontWeight="700" fontSize="9" letterSpacing="2">
        DE · VALENCIA
      </text>
      <text x="130" y="178" fill="#F5F5F5" fontFamily="'JetBrains Mono', monospace" fontSize="10">
        3 PLAZAS
      </text>

      <text x="244" y="92" fill="#DBFF00" fontFamily="'JetBrains Mono', monospace" fontSize="36">
        €18
      </text>
      <text x="244" y="112" fill="#888" fontFamily="'Inter', sans-serif" fontWeight="600" fontSize="8" letterSpacing="2">
        /ASIENTO
      </text>
      <rect x="244" y="134" width="56" height="22" fill="#DBFF00" />
      <text x="250" y="149" fill="#000" fontFamily="'Inter', sans-serif" fontWeight="700" fontSize="9" letterSpacing="1.5">
        PARTY 🎉
      </text>
    </svg>
  );
}
