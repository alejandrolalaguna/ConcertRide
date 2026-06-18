/**
 * LiveDemandPulse — social proof chip showing demand for a festival/event.
 *
 * The count is generated deterministically from the festivalName string so it
 * is stable across SSR prerender and client hydration (no Math.random(), no
 * hydration mismatch, no real-time API call required).
 *
 * Formula: sum of char codes of festivalName, remapped to 45–320 range.
 */

import { useI18n } from "@/lib/i18n";

interface LiveDemandPulseProps {
  /** Name of the festival shown in the text (e.g. "Mad Cool"). */
  festivalName: string;
  /**
   * Override the auto-generated count.
   * When omitted the count is derived deterministically from festivalName.
   */
  count?: number;
  className?: string;
}

function deterministicCount(name: string): number {
  let h = 0;
  for (let i = 0; i < name.length; i++) h = (h * 31 + name.charCodeAt(i)) | 0;
  // Map to [45, 320] — realistic weekly search volume
  return 45 + (Math.abs(h) % 276);
}

export function LiveDemandPulse({ festivalName, count, className = "" }: LiveDemandPulseProps) {
  const { locale } = useI18n();
  const isEn = locale === "en";
  const displayCount = count ?? deterministicCount(festivalName);

  return (
    <div
      className={`inline-flex items-center gap-2 bg-white/[0.04] border border-white/[0.10] px-3 py-1.5 ${className}`}
      aria-live="polite"
      aria-atomic="true"
    >
      {/* Pulsing dot */}
      <span className="relative flex-shrink-0 w-2 h-2" aria-hidden="true">
        <span className="absolute inset-0 rounded-full bg-[#ff4f00] animate-ping opacity-60" />
        <span className="relative block w-2 h-2 rounded-full bg-[#ff4f00]" />
      </span>

      <span className="font-mono text-[11px] text-white/60 leading-none">
        <span className="sr-only">
          {isEn
            ? <>{displayCount} people looking for a ride to {festivalName} this week</>
            : <>{displayCount} personas buscan viaje a {festivalName} esta semana</>}
        </span>
        <span aria-hidden="true">
          <span className="text-white font-semibold">{displayCount}</span>
          {isEn ? " people looking for a ride to " : " personas buscan viaje a "}
          <span className="text-[#dbff00]">{festivalName}</span>
          {isEn ? " this week" : " esta semana"}
        </span>
      </span>
    </div>
  );
}
