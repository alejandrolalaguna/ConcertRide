import { useEffect, useState } from "react";
import { AnimatePresence, motion, useScroll, useTransform } from "motion/react";
import { ChevronDown } from "lucide-react";

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
  const reducedMotion = usePrefersReducedMotion();
  const [ticketIdx, setTicketIdx] = useState(0);

  useEffect(() => {
    if (reducedMotion) return;
    const id = setInterval(() => {
      setTicketIdx((i) => (i + 1) % TICKETS.length);
    }, 6000);
    return () => clearInterval(id);
  }, [reducedMotion]);

  const currentTicket = TICKETS[ticketIdx]!;

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

// Deterministic pseudo-random barcode per ticket id so each artist has its own
// pattern — preserves the illusion that every ticket is its own printed pass.
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
        {/* Main ticket body gradient */}
        <linearGradient id="stubGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#0E0E0E" />
          <stop offset="100%" stopColor="#1A1A1A" />
        </linearGradient>

        {/* Volt Yellow shimmer gradient for the price block */}
        <linearGradient id="voltShine" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#DBFF00" stopOpacity="1" />
          <stop offset="50%" stopColor="#FFFFFF" stopOpacity="1" />
          <stop offset="100%" stopColor="#DBFF00" stopOpacity="1" />
        </linearGradient>

        {/* Radial glow behind the artist name */}
        <radialGradient id="artistGlow" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="#DBFF00" stopOpacity="0.18" />
          <stop offset="100%" stopColor="#DBFF00" stopOpacity="0" />
        </radialGradient>

        {/* Clip path for the shimmer */}
        <clipPath id="priceClip">
          <rect x="270" y="60" width="100" height="120" />
        </clipPath>
      </defs>

      {/* Ticket body */}
      <rect x="0" y="0" width="380" height="260" fill="url(#stubGrad)" stroke="#2A2A2A" strokeWidth="1" />

      {/* Volt border highlight on the top + left edges */}
      <rect x="0" y="0" width="380" height="3" fill="#DBFF00" />
      <rect x="0" y="0" width="3" height="260" fill="#DBFF00" opacity="0.6" />

      {/* Subtle artist glow halo */}
      <ellipse cx="140" cy="110" rx="130" ry="50" fill="url(#artistGlow)" />

      {/* Header strip */}
      <rect x="14" y="18" width="6" height="6" fill="#DBFF00" />
      <text
        x="28"
        y="24"
        fill="#DBFF00"
        fontFamily="'Inter', sans-serif"
        fontWeight="700"
        fontSize="9"
        letterSpacing="2"
        dominantBaseline="middle"
      >
        CONCERTRIDE · BOARDING PASS
      </text>
      <text
        x="360"
        y="24"
        fill="#888"
        fontFamily="'JetBrains Mono', monospace"
        fontSize="8"
        textAnchor="end"
        dominantBaseline="middle"
      >
        {ticket.ticketNum}
      </text>

      {/* Live pulsing dot + status */}
      <circle cx="26" cy="52" r="4" fill="#DBFF00">
        <animate attributeName="opacity" values="1;0.25;1" dur="1.4s" repeatCount="indefinite" />
      </circle>
      <circle cx="26" cy="52" r="4" fill="none" stroke="#DBFF00" strokeWidth="1">
        <animate attributeName="r" values="4;10;4" dur="1.4s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.8;0;0.8" dur="1.4s" repeatCount="indefinite" />
      </circle>
      <text
        x="38"
        y="52"
        fill="#F5F5F5"
        fontFamily="'Inter', sans-serif"
        fontWeight="700"
        fontSize="9"
        letterSpacing="1.6"
        dominantBaseline="middle"
      >
        CARPOOLING · CONCIERTOS · FESTIVALES
      </text>

      {/* Artist name — big with subtle offset shadow for depth */}
      <text
        x="24"
        y="108"
        fill="#DBFF00"
        fontFamily="'Archivo Black', 'Inter', sans-serif"
        fontWeight="900"
        fontSize={artistFontSize}
        letterSpacing="-1.5"
        opacity="0.18"
      >
        {ticket.artist}
      </text>
      <text
        x="22"
        y="106"
        fill="#F5F5F5"
        fontFamily="'Archivo Black', 'Inter', sans-serif"
        fontWeight="900"
        fontSize={artistFontSize}
        letterSpacing="-1.5"
      >
        {ticket.artist}
      </text>

      {/* Tour subtitle */}
      <text
        x="24"
        y="128"
        fill="#DBFF00"
        fontFamily="'Inter', sans-serif"
        fontWeight="600"
        fontSize="11"
        letterSpacing="2.5"
      >
        {ticket.tour}
      </text>

      {/* Divider */}
      <rect x="24" y="142" width="220" height="1" fill="#2A2A2A" />

      {/* Venue + date with small icon-dots */}
      <circle cx="27" cy="159" r="2" fill="#DBFF00" />
      <text x="34" y="162" fill="#F5F5F5" fontFamily="'JetBrains Mono', monospace" fontSize="11">
        {ticket.venue}
      </text>

      <circle cx="27" cy="179" r="2" fill="#DBFF00" />
      <text x="34" y="182" fill="#F5F5F5" fontFamily="'JetBrains Mono', monospace" fontSize="11">
        {ticket.date}
      </text>

      {/* Origin → destination arrow row */}
      <text x="24" y="212" fill="#888" fontFamily="'Inter', sans-serif" fontWeight="700" fontSize="9" letterSpacing="1.6">
        DESDE
      </text>
      <text x="24" y="228" fill="#F5F5F5" fontFamily="'Archivo Black', 'Inter', sans-serif" fontWeight="900" fontSize="14" letterSpacing="0.5">
        {ticket.from}
      </text>
      <text x="108" y="222" fill="#DBFF00" fontFamily="'JetBrains Mono', monospace" fontSize="14" letterSpacing="1.5">
        ──▶
      </text>
      <text x="150" y="212" fill="#888" fontFamily="'Inter', sans-serif" fontWeight="700" fontSize="9" letterSpacing="1.6">
        HASTA
      </text>
      <text x="150" y="228" fill="#F5F5F5" fontFamily="'Archivo Black', 'Inter', sans-serif" fontWeight="900" fontSize="14" letterSpacing="0.5">
        {ticket.to}
      </text>

      {/* Driver chip */}
      <rect x="24" y="240" width="108" height="14" rx="1" fill="#111" stroke="#2A2A2A" strokeWidth="1" />
      <circle cx="31" cy="247" r="4" fill="#DBFF00" />
      <text x="31" y="247" fill="#000" fontFamily="'Archivo Black', sans-serif" fontSize="6" textAnchor="middle" dominantBaseline="middle">{ticket.driverInitial}</text>
      <text x="40" y="248" fill="#F5F5F5" fontFamily="'JetBrains Mono', monospace" fontSize="8" dominantBaseline="middle">
        {ticket.driverName}
      </text>
      <text x="94" y="248" fill="#DBFF00" fontFamily="'Inter', sans-serif" fontWeight="700" fontSize="8" dominantBaseline="middle">
        ★ {ticket.rating.toFixed(1)}
      </text>

      {/* Perforation line */}
      <line x1="260" y1="10" x2="260" y2="250" stroke="#2A2A2A" strokeDasharray="4 3" />
      <circle cx="260" cy="0" r="10" fill="#080808" stroke="#2A2A2A" />
      <circle cx="260" cy="260" r="10" fill="#080808" stroke="#2A2A2A" />

      {/* Right stub — price block */}
      <g clipPath="url(#priceClip)">
        <rect x="270" y="60" width="100" height="120" fill="#0A0A0A" />
        {/* Animated shine sweep across the stub */}
        <rect x="-40" y="60" width="30" height="120" fill="url(#voltShine)" opacity="0.18">
          <animate attributeName="x" from="270" to="370" dur="2.8s" repeatCount="indefinite" />
        </rect>
      </g>

      <text
        x="320"
        y="72"
        fill="#888"
        fontFamily="'Inter', sans-serif"
        fontWeight="700"
        fontSize="8"
        letterSpacing="1.6"
        textAnchor="middle"
      >
        PRECIO
      </text>
      <text
        x="320"
        y="116"
        fill="#DBFF00"
        fontFamily="'Archivo Black', 'Inter', sans-serif"
        fontWeight="900"
        fontSize="44"
        letterSpacing="-2"
        textAnchor="middle"
      >
        €{ticket.price}
      </text>
      <text
        x="320"
        y="132"
        fill="#888"
        fontFamily="'Inter', sans-serif"
        fontWeight="600"
        fontSize="8"
        letterSpacing="2"
        textAnchor="middle"
      >
        POR ASIENTO
      </text>

      {/* Seats chip */}
      <rect x="282" y="144" width="76" height="22" fill="#DBFF00" />
      <text
        x="320"
        y="158"
        fill="#000"
        fontFamily="'Archivo Black', 'Inter', sans-serif"
        fontWeight="900"
        fontSize="10"
        letterSpacing="1.5"
        textAnchor="middle"
      >
        {ticket.seats} {ticket.seats === 1 ? "PLAZA" : "PLAZAS"}
      </text>

      {/* Barcode */}
      <g transform="translate(278, 192)">
        {barcode.map((w, i) => {
          const x = barcode.slice(0, i).reduce((sum, n) => sum + n + 1, 0);
          return <rect key={i} x={x} y={0} width={w} height={28} fill="#F5F5F5" />;
        })}
      </g>

      <text
        x="320"
        y="238"
        fill="#888"
        fontFamily="'JetBrains Mono', monospace"
        fontSize="7"
        letterSpacing="1.2"
        textAnchor="middle"
      >
        {ticket.ridCode}
      </text>
    </svg>
  );
}
