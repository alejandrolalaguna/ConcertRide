const FESTIVALS = [
  "MAD COOL 2026",
  "PRIMAVERA SOUND",
  "SÓNAR",
  "BBK LIVE",
  "ARENAL SOUND",
  "RESURRECTION FEST",
  "VIÑA ROCK",
  "FIB BENICÀSSIM",
  "MEDUSA FESTIVAL",
  "O SON DO CAMIÑO",
  "CRUÏLLA BARCELONA",
  "TOMAVISTAS",
  "SONORAMA RIBERA",
  "ZEVRA FESTIVAL",
  "LOW FESTIVAL",
  "CALA MIJAS",
  "PIRINEOS SUR",
  "STARLITE FESTIVAL",
  "REGGAETON BEACH",
  "MALLORCA LIVE",
] as const;

// Accent colors cycling — lime, orange, teal, white, repeat
const DOT_COLORS = ["#dbff00", "#ff4f00", "rgba(255,255,255,0.18)", "#dbff00", "#00e5c8", "#ff4f00"];

const ITEMS = [...FESTIVALS, ...FESTIVALS];

export function FestivalMarquee() {
  return (
    <div
      aria-hidden="true"
      className="overflow-hidden select-none relative border-y border-white/[0.06]"
      style={{ backgroundColor: "#080808" }}
    >
      {/* Side fade gradients */}
      <div
        className="absolute inset-0 pointer-events-none z-10"
        style={{
          background: "linear-gradient(to right, #080808 0%, transparent 8%, transparent 92%, #080808 100%)",
        }}
      />

      {/* Row 1 — left to right, faster */}
      <div className="flex gap-0 whitespace-nowrap py-3 [animation:cr-marquee-left_28s_linear_infinite] hover:[animation-play-state:paused]">
        {ITEMS.map((name, i) => (
          <MarqueeItem
            key={`a-${i}`}
            name={name}
            dotColor={DOT_COLORS[i % DOT_COLORS.length]!}
            highlight={i % 5 === 0}
            size="sm"
          />
        ))}
      </div>

      {/* Row 2 — right to left, bigger text */}
      <div className="flex gap-0 whitespace-nowrap pb-3 [animation:cr-marquee-right_40s_linear_infinite] hover:[animation-play-state:paused]">
        {[...ITEMS].reverse().map((name, i) => (
          <MarqueeItem
            key={`b-${i}`}
            name={name}
            dotColor={DOT_COLORS[(i + 2) % DOT_COLORS.length]!}
            highlight={i % 7 === 0}
            size="base"
          />
        ))}
      </div>
    </div>
  );
}

function MarqueeItem({
  name,
  dotColor,
  highlight,
  size,
}: {
  name: string;
  dotColor: string;
  highlight: boolean;
  size: "sm" | "base";
}) {
  return (
    <span
      className={`inline-flex items-center gap-3 px-5 font-display uppercase tracking-[0.18em] transition-colors ${
        size === "base" ? "text-xs" : "text-[10px]"
      }`}
    >
      <span
        className="transition-colors"
        style={{
          color: highlight ? "#dbff00" : "rgba(255,255,255,0.22)",
          textShadow: highlight ? "0 0 18px rgba(219,255,0,0.4)" : "none",
        }}
      >
        {name}
      </span>
      <span
        className="w-1.5 h-1.5 rounded-full flex-shrink-0"
        style={{ backgroundColor: dotColor, boxShadow: `0 0 6px ${dotColor}` }}
      />
    </span>
  );
}
