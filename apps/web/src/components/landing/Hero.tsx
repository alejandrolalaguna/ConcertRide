import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { ArrowRight, ChevronDown } from "lucide-react";

interface TicketData {
  id: string;
  artist: string;
  tour: string;
  venue: string;
  date: string;
  from: string;
  to: string;
  price: number;
  seats: number;
  driverInitial: string;
  driverName: string;
  rating: number;
  ridCode: string;
  ticketNum: string;
}

const ROTATING_WORDS = ["conciertos.", "festivales.", "experiencias.", "momentos."];

const LIVE_ACTIVITY = [
  "María desde Córdoba · reservó asiento → Sevilla (Bad Bunny) · hace 2 min",
  "Carlos desde Valencia · publicó viaje → FIB Benicàssim · hace 5 min",
  "Lucía desde Bilbao · se unió a ConcertRide · hace 7 min",
  "Rafa desde Málaga · reservó asiento → Madrid (Primavera Sound) · hace 11 min",
  "Ana desde Zaragoza · publicó viaje → Mad Cool Madrid · hace 15 min",
];

const TICKETS: TicketData[] = [
  {
    id: "rosalia",
    artist: "ROSALÍA",
    tour: "LUX TOUR · 2026",
    venue: "WiZink Center · Madrid",
    date: "JUE 22 MAY · 21:00 CEST",
    from: "VALENCIA",
    to: "MADRID",
    price: 18,
    seats: 3,
    driverInitial: "L",
    driverName: "Laura M.",
    rating: 4.9,
    ridCode: "RID-2026-VAL-MAD",
    ticketNum: "#CR-00842",
  },
  {
    id: "badbunny",
    artist: "BAD BUNNY",
    tour: "MOST WANTED · 2026",
    venue: "Estadio La Cartuja · Sevilla",
    date: "LUN 8 JUN · 22:00 CEST",
    from: "CÓRDOBA",
    to: "SEVILLA",
    price: 22,
    seats: 2,
    driverInitial: "D",
    driverName: "Dani R.",
    rating: 4.8,
    ridCode: "RID-2026-COR-SEV",
    ticketNum: "#CR-00921",
  },
  {
    id: "madcool",
    artist: "MAD COOL",
    tour: "FESTIVAL · DAY 1",
    venue: "IFEMA · Madrid",
    date: "JUE 9 JUL · 16:00 CEST",
    from: "BILBAO",
    to: "MADRID",
    price: 35,
    seats: 4,
    driverInitial: "I",
    driverName: "Irene S.",
    rating: 4.9,
    ridCode: "RID-2026-BIL-MAD",
    ticketNum: "#CR-01034",
  },
  {
    id: "primavera",
    artist: "PRIMAVERA",
    tour: "SOUND 2026 · FRI",
    venue: "Parc del Fòrum · Barcelona",
    date: "VIE 5 JUN · 18:00 CEST",
    from: "ZARAGOZA",
    to: "BARCELONA",
    price: 28,
    seats: 3,
    driverInitial: "J",
    driverName: "Jorge B.",
    rating: 4.7,
    ridCode: "RID-2026-ZGZ-BCN",
    ticketNum: "#CR-00887",
  },
  {
    id: "quevedo",
    artist: "QUEVEDO",
    tour: "BUENAS NOCHES TOUR",
    venue: "Bilbao Arena · Bilbao",
    date: "MIE 29 ABR · 21:30 CEST",
    from: "VITORIA",
    to: "BILBAO",
    price: 12,
    seats: 1,
    driverInitial: "P",
    driverName: "Paula G.",
    rating: 5.0,
    ridCode: "RID-2026-VIT-BIL",
    ticketNum: "#CR-00763",
  },
];

function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);
  return reduced;
}

export function Hero() {
  const { scrollY } = useScroll();
  const indicatorOpacity = useTransform(scrollY, [0, 120], [1, 0]);
  const stubY = useTransform(scrollY, [0, 600], [0, 160]);
  const bgY = useTransform(scrollY, [0, 600], [0, 80]);
  const reducedMotion = usePrefersReducedMotion();

  const [ticketIdx, setTicketIdx] = useState(0);
  const [wordIdx, setWordIdx] = useState(0);
  const [activityIdx, setActivityIdx] = useState(0);

  useEffect(() => {
    if (reducedMotion) return;
    const ticketTimer = setInterval(() => {
      setTicketIdx((i) => (i + 1) % TICKETS.length);
    }, 6000);
    return () => clearInterval(ticketTimer);
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;
    const wordTimer = setInterval(() => {
      setWordIdx((i) => (i + 1) % ROTATING_WORDS.length);
    }, 2800);
    return () => clearInterval(wordTimer);
  }, [reducedMotion]);

  useEffect(() => {
    if (reducedMotion) return;
    const actTimer = setInterval(() => {
      setActivityIdx((i) => (i + 1) % LIVE_ACTIVITY.length);
    }, 3500);
    return () => clearInterval(actTimer);
  }, [reducedMotion]);

  const currentTicket = TICKETS[ticketIdx]!;

  return (
    <section
      aria-labelledby="hero-title"
      className="relative min-h-dvh flex items-center overflow-hidden bg-cr-bg"
    >
      {/* Background concert crowd photo */}
      <motion.div
        aria-hidden="true"
        style={{ y: bgY }}
        className="absolute inset-0 pointer-events-none"
      >
        <img
          src="https://images.unsplash.com/photo-1459749411175-04bf5292ceea?w=1800&q=80&auto=format&fit=crop"
          alt=""
          className="w-full h-full object-cover object-center"
          loading="eager"
          // @ts-expect-error — fetchpriority (lowercase) needed for SSR, React types use fetchPriority
          fetchpriority="high"
        />
        {/* Multi-layer overlay system */}
        <div className="absolute inset-0 bg-[#080808]/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#080808] via-[#080808]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#080808] via-transparent to-[#080808]/60" />
      </motion.div>

      {/* Atmospheric color orbs */}
      <div
        aria-hidden="true"
        className="absolute bottom-[-10%] left-[-5%] w-[50vw] h-[50vw] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(219,255,0,0.08) 0%, transparent 65%)", filter: "blur(60px)" }}
      />
      <div
        aria-hidden="true"
        className="absolute top-[-10%] right-[-5%] w-[40vw] h-[40vw] rounded-full pointer-events-none"
        style={{ background: "radial-gradient(circle, rgba(255,79,0,0.05) 0%, transparent 65%)", filter: "blur(60px)" }}
      />

      <NoiseOverlay />
      <CornerTicks />

      {/* Ticket stub — floating right */}
      <motion.div
        aria-hidden="true"
        style={{ y: stubY }}
        className="absolute top-[10%] right-[-50px] md:right-[5%] w-[260px] md:w-[380px] rotate-[8deg] pointer-events-none opacity-80 md:opacity-100"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={currentTicket.id}
            initial={{ opacity: 0, y: 20, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.96 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <TicketStub ticket={currentTicket} />
          </motion.div>
        </AnimatePresence>
      </motion.div>

      {/* Hero content */}
      <div className="relative w-full max-w-6xl mx-auto px-6 md:px-10 py-24 md:py-32 space-y-8">

        {/* Live event badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center gap-2 border border-[#dbff00]/20 bg-[#dbff00]/[0.06] px-3 py-1.5"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#dbff00] animate-pulse flex-shrink-0" />
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#dbff00]">
            Mad Cool · 9–12 Jul · Quedan plazas
          </span>
        </motion.div>

        {/* H1 with rotating word */}
        <motion.h1
          id="hero-title"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="font-display uppercase leading-[0.88] tracking-tight text-[clamp(3.2rem,9vw,8rem)]"
        >
          <span className="cr-heading-gradient">Viaja a los</span>
          <br />
          <span className="inline-flex items-end gap-3">
            <span className="inline-block overflow-hidden h-[1.1em] leading-[1.1]">
              <AnimatePresence mode="wait">
                <motion.span
                  key={wordIdx}
                  initial={{ y: "100%" }}
                  animate={{ y: "0%" }}
                  exit={{ y: "-100%" }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                  className="block text-[#dbff00]"
                >
                  {ROTATING_WORDS[wordIdx]}
                </motion.span>
              </AnimatePresence>
            </span>
          </span>
        </motion.h1>

        {/* Lime underline rule */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="origin-left h-[2px] bg-[#dbff00] w-20"
          aria-hidden="true"
        />

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="font-sans text-base md:text-xl text-white/45 max-w-xl leading-relaxed font-light"
        >
          Comparte el viaje. Divide el coste.{" "}
          <span className="text-white/70 font-medium">Carpooling exclusivo para fans de la música en vivo.</span>
        </motion.p>

        {/* CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 1.0, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row gap-3"
        >
          <a
            href="/register"
            className="cr-btn-shine inline-flex items-center justify-center gap-2 bg-[#dbff00] text-black font-sans font-semibold uppercase tracking-[0.12em] text-sm px-8 py-4 hover:bg-[#c8ec00] transition-colors duration-150 group"
          >
            Crear cuenta gratis
            <ArrowRight size={14} className="transition-transform duration-150 group-hover:translate-x-1" aria-hidden="true" />
          </a>
          <a
            href="/concerts"
            className="inline-flex items-center justify-center gap-2 bg-transparent text-white/70 font-sans font-semibold uppercase tracking-[0.12em] text-sm border border-white/20 px-8 py-4 hover:border-white/40 hover:text-white transition-colors duration-150"
          >
            Buscar viajes →
          </a>
        </motion.div>

        {/* Social proof + trust badges */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.3 }}
          className="flex flex-col gap-3"
        >
          <div className="flex items-center gap-3">
            {/* Avatar stack */}
            <div className="flex -space-x-2" aria-hidden="true">
              {["S","D","I","J"].map((initial, i) => (
                <div
                  key={i}
                  className="w-7 h-7 rounded-full bg-[#dbff00] border-2 border-[#080808] flex items-center justify-center font-display font-black text-black text-[10px]"
                >
                  {initial}
                </div>
              ))}
              <div className="w-7 h-7 rounded-full bg-white/10 border-2 border-[#080808] flex items-center justify-center font-mono text-[9px] text-[#dbff00] font-bold">
                +2k
              </div>
            </div>
            <span className="font-mono text-[11px] text-white/35">fans ya en la comunidad</span>
          </div>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            {["Sin tarjeta de crédito", "100% gratuito", "0€ comisiones"].map((badge) => (
              <span key={badge} className="flex items-center gap-1.5 font-mono text-[10px] text-white/25 uppercase tracking-[0.1em]">
                <span className="w-1 h-1 rounded-full bg-white/20" aria-hidden="true" />
                {badge}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Live activity ticker */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 1.5 }}
          className="flex items-center gap-2 mt-2"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#ff4f00] animate-pulse flex-shrink-0" aria-hidden="true" />
          <div className="overflow-hidden h-4">
            <AnimatePresence mode="wait">
              <motion.p
                key={activityIdx}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="font-mono text-[10px] text-white/30 truncate"
              >
                {LIVE_ACTIVITY[activityIdx]}
              </motion.p>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        style={{ opacity: indicatorOpacity }}
        aria-hidden="true"
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
      >
        <div className="w-5 h-8 rounded-full border border-white/15 flex items-start justify-center pt-1.5">
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, ease: "easeInOut" }}
            className="w-1 h-1 rounded-full bg-white/40"
          />
        </div>
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

function barcodeFor(seed: string): number[] {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) | 0;
  const out: number[] = [];
  for (let i = 0; i < 24; i++) {
    h = (h * 1103515245 + 12345) | 0;
    out.push(((Math.abs(h) >> (i % 8)) % 4) + 1);
  }
  return out;
}

function TicketStub({ ticket }: { ticket: TicketData }) {
  const barcode = barcodeFor(ticket.id);
  const artistFontSize = ticket.artist.length > 9 ? 30 : ticket.artist.length > 7 ? 36 : 40;

  return (
    <svg
      viewBox="0 0 380 260"
      className="w-full h-auto drop-shadow-[0_0_50px_rgba(219,255,0,0.35)]"
    >
      <defs>
        <linearGradient id="stubGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0E0E0E" />
          <stop offset="100%" stopColor="#1A1A1A" />
        </linearGradient>
        <linearGradient id="voltShine" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#DBFF00" stopOpacity="1" />
          <stop offset="50%" stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="100%" stopColor="#DBFF00" stopOpacity="1" />
        </linearGradient>
        <radialGradient id="artistGlow" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#DBFF00" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#DBFF00" stopOpacity="0" />
        </radialGradient>
        <clipPath id="priceClip">
          <rect x="270" y="60" width="100" height="120" />
        </clipPath>
      </defs>
      <rect x="0" y="0" width="380" height="260" fill="url(#stubGrad)" stroke="#2A2A2A" strokeWidth="1" />
      <rect x="0" y="0" width="380" height="3" fill="#DBFF00" />
      <rect x="0" y="0" width="3" height="260" fill="#DBFF00" opacity="0.6" />
      <ellipse cx="140" cy="110" rx="130" ry="50" fill="url(#artistGlow)" />
      <rect x="14" y="18" width="6" height="6" fill="#DBFF00" />
      <text x="28" y="24" fill="#DBFF00" fontFamily="'Inter', sans-serif" fontWeight="700" fontSize="9" letterSpacing="2" dominantBaseline="middle">
        CONCERTRIDE · BOARDING PASS
      </text>
      <text x="360" y="24" fill="#888" fontFamily="'JetBrains Mono', monospace" fontSize="8" textAnchor="end" dominantBaseline="middle">
        {ticket.ticketNum}
      </text>
      <circle cx="26" cy="52" r="4" fill="#DBFF00">
        <animate attributeName="opacity" values="1;0.25;1" dur="1.4s" repeatCount="indefinite" />
      </circle>
      <circle cx="26" cy="52" r="4" fill="none" stroke="#DBFF00" strokeWidth="1">
        <animate attributeName="r" values="4;10;4" dur="1.4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.8;0;0.8" dur="1.4s" repeatCount="indefinite" />
      </circle>
      <text x="38" y="52" fill="#F5F5F5" fontFamily="'Inter', sans-serif" fontWeight="700" fontSize="9" letterSpacing="1.6" dominantBaseline="middle">
        CARPOOLING · CONCIERTOS · FESTIVALES
      </text>
      <text x="24" y="108" fill="#DBFF00" fontFamily="'Archivo Black', 'Inter', sans-serif" fontWeight="900" fontSize={artistFontSize} letterSpacing="-1.5" opacity="0.18">
        {ticket.artist}
      </text>
      <text x="22" y="106" fill="#F5F5F5" fontFamily="'Archivo Black', 'Inter', sans-serif" fontWeight="900" fontSize={artistFontSize} letterSpacing="-1.5">
        {ticket.artist}
      </text>
      <text x="24" y="128" fill="#DBFF00" fontFamily="'Inter', sans-serif" fontWeight="600" fontSize="11" letterSpacing="2.5">
        {ticket.tour}
      </text>
      <rect x="24" y="142" width="220" height="1" fill="#2A2A2A" />
      <circle cx="27" cy="159" r="2" fill="#DBFF00" />
      <text x="34" y="162" fill="#F5F5F5" fontFamily="'JetBrains Mono', monospace" fontSize="11">{ticket.venue}</text>
      <circle cx="27" cy="179" r="2" fill="#DBFF00" />
      <text x="34" y="182" fill="#F5F5F5" fontFamily="'JetBrains Mono', monospace" fontSize="11">{ticket.date}</text>
      <text x="24" y="212" fill="#888" fontFamily="'Inter', sans-serif" fontWeight="700" fontSize="9" letterSpacing="1.6">DESDE</text>
      <text x="24" y="228" fill="#F5F5F5" fontFamily="'Archivo Black', 'Inter', sans-serif" fontWeight="900" fontSize="14" letterSpacing="0.5">{ticket.from}</text>
      <text x="108" y="222" fill="#DBFF00" fontFamily="'JetBrains Mono', monospace" fontSize="14" letterSpacing="1.5">──▶</text>
      <text x="150" y="212" fill="#888" fontFamily="'Inter', sans-serif" fontWeight="700" fontSize="9" letterSpacing="1.6">HASTA</text>
      <text x="150" y="228" fill="#F5F5F5" fontFamily="'Archivo Black', 'Inter', sans-serif" fontWeight="900" fontSize="14" letterSpacing="0.5">{ticket.to}</text>
      <rect x="24" y="240" width="108" height="14" rx="1" fill="#111" stroke="#2A2A2A" strokeWidth="1" />
      <circle cx="31" cy="247" r="4" fill="#DBFF00" />
      <text x="31" y="247" fill="#000" fontFamily="'Archivo Black', sans-serif" fontSize="6" textAnchor="middle" dominantBaseline="middle">{ticket.driverInitial}</text>
      <text x="40" y="248" fill="#F5F5F5" fontFamily="'JetBrains Mono', monospace" fontSize="8" dominantBaseline="middle">{ticket.driverName}</text>
      <text x="94" y="248" fill="#DBFF00" fontFamily="'Inter', sans-serif" fontWeight="700" fontSize="8" dominantBaseline="middle">★ {ticket.rating.toFixed(1)}</text>
      <line x1="260" y1="10" x2="260" y2="250" stroke="#2A2A2A" strokeDasharray="4 3" />
      <circle cx="260" cy="0" r="10" fill="#080808" stroke="#2A2A2A" />
      <circle cx="260" cy="260" r="10" fill="#080808" stroke="#2A2A2A" />
      <g clipPath="url(#priceClip)">
        <rect x="270" y="60" width="100" height="120" fill="#0A0A0A" />
        <rect x="-40" y="60" width="30" height="120" fill="url(#voltShine)" opacity="0.18">
          <animate attributeName="x" from="270" to="370" dur="2.8s" repeatCount="indefinite" />
        </rect>
      </g>
      <text x="320" y="72" fill="#888" fontFamily="'Inter', sans-serif" fontWeight="700" fontSize="8" letterSpacing="1.6" textAnchor="middle">PRECIO</text>
      <text x="320" y="116" fill="#DBFF00" fontFamily="'Archivo Black', 'Inter', sans-serif" fontWeight="900" fontSize="44" letterSpacing="-2" textAnchor="middle">€{ticket.price}</text>
      <text x="320" y="132" fill="#888" fontFamily="'Inter', sans-serif" fontWeight="600" fontSize="8" letterSpacing="2" textAnchor="middle">POR ASIENTO</text>
      <rect x="282" y="144" width="76" height="22" fill="#DBFF00" />
      <text x="320" y="158" fill="#000" fontFamily="'Archivo Black', 'Inter', sans-serif" fontWeight="900" fontSize="10" letterSpacing="1.5" textAnchor="middle">
        {ticket.seats} {ticket.seats === 1 ? "PLAZA" : "PLAZAS"}
      </text>
      <g transform="translate(278, 192)">
        {barcode.map((w, i) => {
          const x = barcode.slice(0, i).reduce((sum, n) => sum + n + 1, 0);
          return <rect key={i} x={x} y={0} width={w} height={28} fill="#F5F5F5" />;
        })}
      </g>
      <text x="320" y="238" fill="#888" fontFamily="'JetBrains Mono', monospace" fontSize="7" letterSpacing="1.2" textAnchor="middle">{ticket.ridCode}</text>
    </svg>
  );
}
