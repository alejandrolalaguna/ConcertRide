import React from "react";
import { Loader2, Star, Shield, CheckCircle, AlertCircle, Zap, Music2 } from "lucide-react";
import type { User } from "@concertride/types";

// ── LoadingSpinner ─────────────────────────────────────────────────────────────
export function LoadingSpinner({ text = "Cargando..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <div className="relative">
        <div className="w-10 h-10 border-2 border-cr-border rounded-full" />
        <div className="absolute inset-0 w-10 h-10 border-2 border-transparent border-t-cr-primary rounded-full animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Music2 size={13} className="text-cr-primary" strokeWidth={2.5} />
        </div>
      </div>
      <p className="cr-overline text-cr-text-muted animate-pulse">{text}</p>
    </div>
  );
}

// ── SkeletonCard ───────────────────────────────────────────────────────────────
export function SkeletonCard() {
  return (
    <div className="bg-cr-surface border border-cr-border overflow-hidden cr-shimmer">
      <div className="h-52 w-full bg-cr-surface-2" />
      <div className="p-4 space-y-3">
        <div className="h-4 w-2/3 bg-cr-surface-3 rounded-sm" />
        <div className="h-3 w-1/2 bg-cr-surface-3 rounded-sm" />
        <div className="flex gap-2 pt-1">
          <div className="h-5 w-14 bg-cr-surface-3 rounded-sm" />
          <div className="h-5 w-10 bg-cr-surface-3 rounded-sm" />
        </div>
      </div>
    </div>
  );
}

// ── Badge ──────────────────────────────────────────────────────────────────────
type BadgeVariant = "primary" | "secondary" | "muted" | "violet" | "teal" | "fire";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
  dot?: boolean;
}

export function Badge({ children, variant = "primary", dot }: BadgeProps) {
  const variantMap: Record<BadgeVariant, string> = {
    primary:
      "bg-cr-primary/[0.12] text-cr-primary border border-cr-primary/25",
    secondary:
      "bg-cr-secondary/[0.12] text-cr-secondary border border-cr-secondary/25",
    muted:
      "bg-cr-surface-3 text-cr-text-muted border border-cr-border",
    violet:
      "bg-[rgb(155_89_247/0.12)] text-cr-accent-violet border border-[rgb(155_89_247/0.25)]",
    teal:
      "bg-[rgb(0_229_200/0.12)] text-cr-accent-teal border border-[rgb(0_229_200/0.25)]",
    fire:
      "bg-cr-secondary text-white border border-cr-secondary-dim",
  };

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-[0.1em] ${variantMap[variant]}`}
    >
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80 flex-shrink-0" />}
      {children}
    </span>
  );
}

// ── DriverCard ─────────────────────────────────────────────────────────────────
export function DriverCard({ driver }: { driver: User }) {
  const initials = driver.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex items-center gap-3">
      {/* Avatar */}
      <div className="relative flex-shrink-0">
        <div className="w-11 h-11 bg-cr-surface-3 border border-cr-border-mid flex items-center justify-center overflow-hidden">
          {driver.avatar_url ? (
            <img
              src={driver.avatar_url}
              alt={`Avatar del conductor ${driver.name}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <span className="text-cr-primary font-display font-black text-sm">
              {initials}
            </span>
          )}
        </div>
        {driver.verified && (
          <span
            className="absolute -bottom-1 -right-1 w-4 h-4 bg-cr-primary flex items-center justify-center"
            aria-label="Verificado"
          >
            <Shield size={9} strokeWidth={3} className="text-black" />
          </span>
        )}
      </div>

      <div className="min-w-0">
        <span className="text-cr-text font-sans font-semibold text-sm truncate block">
          {driver.name}
        </span>
        <div className="flex items-center gap-2 mt-0.5">
          <span className="flex items-center gap-0.5">
            <Star
              size={11}
              className="text-cr-primary fill-cr-primary"
              strokeWidth={0}
            />
            <span className="text-cr-primary text-xs font-mono font-semibold">
              {driver.rating.toFixed(1)}
            </span>
          </span>
          <span className="text-cr-text-dim text-xs font-mono">·</span>
          <span className="text-cr-text-muted text-xs font-mono">
            {driver.rides_given} viajes
          </span>
        </div>
      </div>
    </div>
  );
}

// ── SectionTitle ───────────────────────────────────────────────────────────────
export function SectionTitle({
  label,
  title,
  subtitle,
}: {
  label?: string;
  title: React.ReactNode;
  subtitle?: string;
}) {
  return (
    <div className="mb-10">
      {label && (
        <span className="cr-overline block mb-3">
          <span className="inline-flex items-center gap-2">
            <span className="w-4 h-px bg-cr-primary inline-block" />
            {label}
          </span>
        </span>
      )}
      <h2 className="font-display uppercase text-3xl md:text-4xl lg:text-5xl leading-[0.92] tracking-tight">
        {title}
      </h2>
      {subtitle && (
        <p className="text-cr-text-muted mt-4 text-base font-sans leading-relaxed max-w-xl">
          {subtitle}
        </p>
      )}
    </div>
  );
}

// ── EmptyState ─────────────────────────────────────────────────────────────────
export function EmptyState({
  icon,
  title,
  description,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="relative flex flex-col items-center justify-center py-20 px-6 text-center overflow-hidden">
      {/* Atmospheric glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-cr-primary/[0.03] blur-3xl" />
      </div>

      {/* Icon box */}
      <div className="relative mb-6">
        <div className="w-20 h-20 bg-cr-surface-2 border border-cr-border-mid flex items-center justify-center text-cr-primary shadow-[var(--shadow-hard)]">
          {icon}
        </div>
        {/* Corner ticks */}
        <span className="absolute -top-1.5 -left-1.5 w-3 h-px bg-cr-primary" />
        <span className="absolute -top-1.5 -left-1.5 w-px h-3 bg-cr-primary" />
        <span className="absolute -top-1.5 -right-1.5 w-3 h-px bg-cr-primary" />
        <span className="absolute -top-1.5 -right-1.5 w-px h-3 bg-cr-primary" />
        <span className="absolute -bottom-1.5 -left-1.5 w-3 h-px bg-cr-primary" />
        <span className="absolute -bottom-1.5 -left-1.5 w-px h-3 bg-cr-primary" />
        <span className="absolute -bottom-1.5 -right-1.5 w-3 h-px bg-cr-primary" />
        <span className="absolute -bottom-1.5 -right-1.5 w-px h-3 bg-cr-primary" />
      </div>

      <h3 className="font-display uppercase text-2xl mb-3 tracking-tight leading-tight">
        {title}
      </h3>
      <p className="text-cr-text-muted text-sm font-sans max-w-sm leading-relaxed">
        {description}
      </p>
      {action && <div className="mt-8">{action}</div>}
    </div>
  );
}

// ── SuccessBanner ──────────────────────────────────────────────────────────────
export function SuccessBanner({ message }: { message: string }) {
  return (
    <div role="status" aria-live="polite" className="flex items-center gap-3 bg-cr-primary/[0.07] border border-cr-primary/20 px-4 py-3.5">
      <div className="flex-shrink-0 w-7 h-7 bg-cr-primary/10 flex items-center justify-center">
        <CheckCircle size={14} strokeWidth={2} className="text-cr-primary" />
      </div>
      <p className="text-cr-primary text-sm font-sans font-semibold">{message}</p>
    </div>
  );
}

// ── ErrorBanner ────────────────────────────────────────────────────────────────
export function ErrorBanner({ message }: { message: string }) {
  return (
    <div role="alert" aria-live="assertive" className="flex items-center gap-3 bg-cr-secondary/[0.07] border border-cr-secondary/20 px-4 py-3.5">
      <div className="flex-shrink-0 w-7 h-7 bg-cr-secondary/10 flex items-center justify-center">
        <AlertCircle size={14} strokeWidth={2} className="text-cr-secondary" />
      </div>
      <p className="text-cr-secondary text-sm font-sans font-semibold">{message}</p>
    </div>
  );
}

// ── AlertBanner ────────────────────────────────────────────────────────────────
export function AlertBanner({
  icon,
  children,
  variant = "primary",
}: {
  icon?: React.ReactNode;
  children: React.ReactNode;
  variant?: "primary" | "fire" | "muted";
}) {
  const styles = {
    primary: "bg-cr-primary/[0.07] border-cr-primary/20 text-cr-primary",
    fire: "bg-cr-secondary/[0.07] border-cr-secondary/20 text-cr-secondary",
    muted: "bg-cr-surface-2 border-cr-border text-cr-text-muted",
  };
  return (
    <div className={`flex items-start gap-3 border px-4 py-3.5 ${styles[variant]}`}>
      {icon && (
        <div className="flex-shrink-0 mt-0.5">{icon}</div>
      )}
      <div className="text-sm font-sans leading-snug">{children}</div>
    </div>
  );
}

// ── LiveRideBadge ─────────────────────────────────────────────────────────────
export function LiveRideBadge({ count }: { count: number }) {
  return (
    <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-cr-surface-2 border border-cr-border-mid font-mono text-[11px]">
      <span className="cr-live-dot" />
      <span className="text-cr-text-muted">{count} viaje{count !== 1 ? "s" : ""} en vivo</span>
    </span>
  );
}

// ── InstantBadge ──────────────────────────────────────────────────────────────
export function InstantBadge() {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-cr-primary text-black font-mono text-[10px] font-bold uppercase tracking-[0.1em]">
      <Zap size={8} strokeWidth={3} className="fill-black" />
      Instante
    </span>
  );
}
