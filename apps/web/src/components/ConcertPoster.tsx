import type { Concert } from "@concertride/types";

// Procedural concert/festival poster — deterministic SVG generated from
// artist + genre + venue. Every concert gets a unique-but-coherent visual
// without relying on third-party image hosts.
//
// Design language:
//   • Hue derives from the genre FAMILY (rock = red, indie = pink,
//     electrónica = cyan, urbano = yellow, jazz = teal, default = violet)
//     with a ±25° variation per artist hash.
//   • Each genre family has its own subtle pattern (slashes, dots, halos…).
//   • Big artist initials anchor the composition; festivals get a "FESTIVAL"
//     tag in the corner.
//   • A faint city + date watermark at the bottom keeps it informational.

type Family = "rock" | "indie" | "electronic" | "urban" | "jazz" | "default";

const FAMILY_HUE: Record<Family, number> = {
  rock: 10,        // red-orange
  indie: 295,      // pink-purple
  electronic: 195, // cyan-blue
  urban: 45,       // yellow-amber
  jazz: 165,       // teal-green
  default: 245,    // blue-violet
};

function genreFamily(genre: string | null | undefined): Family {
  if (!genre) return "default";
  const g = genre.toLowerCase();
  if (/(metal|punk|hardcore|rock)/.test(g)) return "rock";
  if (/(electr|edm|techno|house|trance)/.test(g)) return "electronic";
  if (/(urban|reggaet|trap|hip-?hop)/.test(g)) return "urban";
  if (/(jazz|world|mestizaje|celta|flamenco)/.test(g)) return "jazz";
  if (/(indie|pop)/.test(g)) return "indie";
  return "default";
}

function hashStr(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return Math.abs(h);
}

function posterHue(artist: string, genre: string | null | undefined): number {
  const base = FAMILY_HUE[genreFamily(genre)];
  // ±25° variation within family for variety while staying on-palette
  const offset = (hashStr(artist) % 50) - 25;
  return (base + offset + 360) % 360;
}

function initialsFor(artist: string): string {
  const words = artist.trim().split(/\s+/);
  // All-caps acronym as first word? Use it directly (FIB, WAM, RBF…).
  if (words[0] && /^[A-Z]{2,4}$/.test(words[0])) return words[0];
  // Otherwise: first letter of each non-noise word, max 3.
  const noise = /^(festival|fest|de|del|do|da|la|el|los|las|un|una|the|of)$/i;
  const meaningful = words.filter((w) => w && !noise.test(w));
  const letters = meaningful.slice(0, 3).map((w) => w[0]?.toUpperCase() ?? "").join("");
  return letters || artist[0]?.toUpperCase() || "?";
}

function isFestival(genre: string | null | undefined): boolean {
  return !!genre && /festival/i.test(genre);
}

interface Props {
  concert: Concert;
  className?: string;
}

export function ConcertPoster({ concert, className = "" }: Props) {
  const hue = posterHue(concert.artist, concert.genre);
  const family = genreFamily(concert.genre);
  const initials = initialsFor(concert.artist);
  const festival = isFestival(concert.genre);

  // Stable suffix for SVG ids so multiple posters on the same page don't clash
  const uid = concert.id.replace(/[^a-z0-9]/gi, "");

  // Initials font size scales down as length grows
  const initialsSize = initials.length === 1 ? 220 : initials.length === 2 ? 160 : 110;
  const initialsX = initials.length === 1 ? 200 : 28;
  const initialsAnchor = initials.length === 1 ? "middle" : "start";

  return (
    <svg
      viewBox="0 0 400 300"
      preserveAspectRatio="xMidYMid slice"
      className={`absolute inset-0 w-full h-full ${className}`}
      role="img"
      aria-label={`Cartel para ${concert.artist}`}
    >
      <defs>
        <linearGradient id={`bg-${uid}`} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={`hsl(${hue}, 70%, 28%)`} />
          <stop offset="55%" stopColor={`hsl(${(hue + 18) % 360}, 55%, 16%)`} />
          <stop offset="100%" stopColor="#080808" />
        </linearGradient>
        <radialGradient id={`glow-${uid}`} cx="22%" cy="28%" r="55%">
          <stop offset="0%" stopColor={`hsl(${hue}, 95%, 60%)`} stopOpacity="0.42" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>
        <radialGradient id={`shadow-${uid}`} cx="50%" cy="100%" r="80%">
          <stop offset="0%" stopColor="#000" stopOpacity="0.55" />
          <stop offset="100%" stopColor="transparent" />
        </radialGradient>

        {/* Per-family pattern */}
        {family === "rock" && (
          <pattern id={`pat-${uid}`} x="0" y="0" width="22" height="22" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
            <rect width="22" height="22" fill="transparent" />
            <line x1="0" y1="0" x2="0" y2="22" stroke="#fff" strokeWidth="1" opacity="0.06" />
          </pattern>
        )}
        {family === "electronic" && (
          <pattern id={`pat-${uid}`} x="0" y="0" width="14" height="14" patternUnits="userSpaceOnUse">
            <circle cx="7" cy="7" r="1" fill="#fff" opacity="0.1" />
          </pattern>
        )}
        {family === "urban" && (
          <pattern id={`pat-${uid}`} x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
            <circle cx="24" cy="24" r="14" stroke="#fff" strokeWidth="1.5" fill="none" opacity="0.07" />
          </pattern>
        )}
        {family === "jazz" && (
          <pattern id={`pat-${uid}`} x="0" y="0" width="60" height="20" patternUnits="userSpaceOnUse">
            <path d="M0 10 Q15 0 30 10 T60 10" stroke="#fff" strokeWidth="1" fill="none" opacity="0.07" />
          </pattern>
        )}
        {family === "indie" && (
          <pattern id={`pat-${uid}`} x="0" y="0" width="36" height="36" patternUnits="userSpaceOnUse">
            <circle cx="18" cy="18" r="2" fill="#fff" opacity="0.06" />
          </pattern>
        )}
        {family === "default" && (
          <pattern id={`pat-${uid}`} x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
            <rect x="0" y="0" width="1" height="30" fill="#fff" opacity="0.04" />
            <rect x="0" y="0" width="30" height="1" fill="#fff" opacity="0.04" />
          </pattern>
        )}
      </defs>

      {/* Layered background */}
      <rect width="400" height="300" fill={`url(#bg-${uid})`} />
      <rect width="400" height="300" fill={`url(#glow-${uid})`} />
      <rect width="400" height="300" fill={`url(#pat-${uid})`} />

      {/* Big initials anchoring the composition */}
      <text
        x={initialsX}
        y="200"
        fill="#FFFFFF"
        opacity="0.92"
        fontFamily="'Archivo Black', 'Inter', sans-serif"
        fontWeight="900"
        fontSize={initialsSize}
        letterSpacing="-6"
        textAnchor={initialsAnchor}
        dominantBaseline="middle"
      >
        {initials}
      </text>

      {/* Volt-Yellow accent stripe — vertical bar offset by hash */}
      <rect
        x={28 + (hashStr(concert.id) % 8) * 30}
        y="0"
        width="3"
        height="30"
        fill="#DBFF00"
      />

      {/* Top tag: FESTIVAL or CONCIERTO */}
      <rect x="20" y="22" width={festival ? 78 : 90} height="20" fill="#DBFF00" />
      <text
        x={20 + (festival ? 78 : 90) / 2}
        y="32"
        fill="#000"
        fontFamily="'Inter', sans-serif"
        fontWeight="700"
        fontSize="10"
        letterSpacing="2"
        textAnchor="middle"
        dominantBaseline="middle"
      >
        {festival ? "FESTIVAL" : "CONCIERTO"}
      </text>

      {/* Bottom darkening for contrast with overlaid card text */}
      <rect width="400" height="300" fill={`url(#shadow-${uid})`} />

      {/* City watermark */}
      <text
        x="380"
        y="284"
        fill="#FFFFFF"
        opacity="0.45"
        textAnchor="end"
        fontFamily="'JetBrains Mono', monospace"
        fontSize="11"
        letterSpacing="1"
      >
        {concert.venue.city.toUpperCase()}
      </text>
    </svg>
  );
}
