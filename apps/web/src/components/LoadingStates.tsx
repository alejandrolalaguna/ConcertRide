import { useEffect, useState } from "react";

const MESSAGES = [
  "Soundchecking...",
  "Afinando la guitarra...",
  "Calentando motores...",
  "Revisando el setlist...",
  "Buscando tu crew...",
  "Amplificando resultados...",
];

function useRotatingMessage(intervalMs = 1600) {
  const [i, setI] = useState(0);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = setInterval(() => setI((v) => (v + 1) % MESSAGES.length), intervalMs);
    return () => clearInterval(id);
  }, [intervalMs]);
  return MESSAGES[i] ?? MESSAGES[0]!;
}

export function PulsingDot({ label = "Cargando" }: { label?: string }) {
  const message = useRotatingMessage();
  return (
    <div className="flex items-center gap-3" role="status" aria-live="polite">
      <span aria-hidden="true" className="relative flex w-2 h-2">
        <span className="absolute inset-0 rounded-full bg-cr-primary opacity-60 animate-ping" />
        <span className="relative rounded-full w-2 h-2 bg-cr-primary shadow-[0_0_6px_rgb(212_247_0/0.7)]" />
      </span>
      <span className="font-mono text-xs text-cr-text-muted tracking-wide">
        {message}
        <span className="sr-only"> — {label}</span>
      </span>
    </div>
  );
}

export function TicketCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="relative flex bg-cr-surface border border-cr-border overflow-hidden"
    >
      {/* left accent bar placeholder */}
      <div className="w-1 flex-shrink-0 bg-cr-surface-3 cr-shimmer" />

      <div className="flex-1 p-5 space-y-3.5">
        <div className="h-2.5 w-24 bg-cr-surface-3 cr-shimmer" />
        <div className="h-5 w-3/4 bg-cr-surface-3 cr-shimmer" />
        <div className="h-3 w-1/2 bg-cr-surface-3 cr-shimmer" />
        <div className="flex items-center gap-3 pt-2">
          <div className="w-9 h-9 bg-cr-surface-3 cr-shimmer flex-shrink-0" />
          <div className="space-y-2 flex-1">
            <div className="h-2.5 w-28 bg-cr-surface-3 cr-shimmer" />
            <div className="h-2.5 w-20 bg-cr-surface-3 cr-shimmer" />
          </div>
        </div>
      </div>

      <div className="w-px border-l border-dashed border-cr-border my-0" />

      <div className="w-[130px] p-5 flex flex-col justify-between gap-4">
        <div className="space-y-2">
          <div className="h-10 w-16 bg-cr-surface-3 cr-shimmer" />
          <div className="h-2.5 w-12 bg-cr-surface-3 cr-shimmer" />
        </div>
        <div className="space-y-2">
          <div className="h-3 w-16 bg-cr-surface-3 cr-shimmer" />
          <div className="h-5 w-14 bg-cr-surface-3 cr-shimmer" />
        </div>
      </div>
    </div>
  );
}

export function ConcertCardSkeleton() {
  return (
    <div
      aria-hidden="true"
      className="bg-cr-surface border border-cr-border overflow-hidden"
    >
      <div className="aspect-[3/4] bg-cr-surface-2 cr-shimmer" />
      <div className="flex items-center justify-between px-4 py-3 border-t border-cr-border">
        <div className="space-y-1.5">
          <div className="h-2 w-16 bg-cr-surface-3 cr-shimmer" />
          <div className="h-3 w-24 bg-cr-surface-3 cr-shimmer" />
        </div>
        <div className="h-3 w-12 bg-cr-surface-3 cr-shimmer" />
      </div>
    </div>
  );
}
