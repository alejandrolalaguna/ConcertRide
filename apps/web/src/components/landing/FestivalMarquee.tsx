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

// Double the array for seamless infinite loop
const ITEMS = [...FESTIVALS, ...FESTIVALS];

export function FestivalMarquee() {
  return (
    <div
      aria-hidden="true"
      className="overflow-hidden border-y border-cr-border bg-cr-surface py-3 select-none"
    >
      {/* Row 1 — left to right */}
      <div className="flex gap-0 whitespace-nowrap [animation:cr-marquee-left_30s_linear_infinite] hover:[animation-play-state:paused]">
        {ITEMS.map((name, i) => (
          <MarqueeItem key={`a-${i}`} name={name} accent={i % 5 === 0} />
        ))}
      </div>
      {/* Row 2 — right to left (offset for visual rhythm) */}
      <div className="flex gap-0 whitespace-nowrap mt-1 [animation:cr-marquee-right_38s_linear_infinite] hover:[animation-play-state:paused]">
        {[...ITEMS].reverse().map((name, i) => (
          <MarqueeItem key={`b-${i}`} name={name} accent={i % 7 === 0} />
        ))}
      </div>
    </div>
  );
}

function MarqueeItem({ name, accent }: { name: string; accent: boolean }) {
  return (
    <span className="inline-flex items-center gap-3 px-5 font-mono text-[11px] font-medium uppercase tracking-[0.18em]">
      <span className={accent ? "text-cr-primary" : "text-cr-text-dim"}>{name}</span>
      <span className="text-cr-border">·</span>
    </span>
  );
}
