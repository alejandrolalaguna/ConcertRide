import React from "react";
import { Loader2, Star, Shield, CheckCircle } from "lucide-react";
import type { User } from "@concertride/types";

// ── LoadingSpinner ─────────────────────────────
export function LoadingSpinner({ text = "Cargando..." }: { text?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-12">
      <Loader2
        className="animate-spin text-cr-primary"
        size={32}
        strokeWidth={1.75}
      />
      <p className="text-cr-text-muted font-sans text-sm animate-pulse">{text}</p>
    </div>
  );
}

// ── SkeletonCard ───────────────────────────────
export function SkeletonCard() {
  return (
    <div className="bg-cr-surface border border-cr-border overflow-hidden cr-shimmer">
      <div className="h-48 w-full bg-cr-surface-2" />
      <div className="p-4 space-y-3">
        <div className="h-4 w-3/4 bg-cr-surface-2 rounded-sm" />
        <div className="h-3 w-1/2 bg-cr-surface-2 rounded-sm" />
        <div className="h-3 w-full bg-cr-surface-2 rounded-sm" />
      </div>
    </div>
  );
}

// ── Badge ──────────────────────────────────────
type BadgeVariant = "primary" | "secondary" | "muted";

interface BadgeProps {
  children: React.ReactNode;
  variant?: BadgeVariant;
}

export function Badge({ children, variant = "primary" }: BadgeProps) {
  const variantMap: Record<BadgeVariant, string> = {
    primary:
      "bg-cr-primary/10 text-cr-primary border border-cr-primary/30",
    secondary:
      "bg-cr-secondary/10 text-cr-secondary border border-cr-secondary/30",
    muted:
      "bg-cr-surface-2 text-cr-text-muted border border-cr-border",
  };

  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 text-[11px] font-sans font-semibold uppercase tracking-[0.08em] ${variantMap[variant]}`}
    >
      {children}
    </span>
  );
}

// ── DriverCard ─────────────────────────────────
export function DriverCard({ driver }: { driver: User }) {
  const initials = driver.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 bg-cr-surface-2 border border-cr-border flex items-center justify-center flex-shrink-0">
        {driver.avatar_url ? (
          <img
            src={driver.avatar_url}
            alt={driver.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <span className="text-cr-primary font-display font-bold text-sm">
            {initials}
          </span>
        )}
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-1.5">
          <span className="text-cr-text font-sans font-medium text-sm truncate">
            {driver.name}
          </span>
          {driver.verified && (
            <Shield
              size={13}
              strokeWidth={1.75}
              className="text-cr-primary flex-shrink-0"
            />
          )}
        </div>
        <div className="flex items-center gap-2 mt-0.5">
          <div className="flex items-center gap-0.5">
            <Star
              size={11}
              strokeWidth={1.75}
              className="text-cr-primary fill-cr-primary"
            />
            <span className="text-cr-primary text-xs font-mono">
              {driver.rating.toFixed(1)}
            </span>
          </div>
          <span className="text-cr-text-muted text-xs font-mono">
            {driver.rides_given} viajes
          </span>
        </div>
      </div>
    </div>
  );
}

// ── SectionTitle ───────────────────────────────
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
    <div className="mb-8">
      {label && (
        <span className="text-cr-primary font-sans text-[11px] font-semibold tracking-[0.16em] uppercase mb-2 block">
          ◆ {label}
        </span>
      )}
      <h2 className="font-display uppercase text-3xl md:text-4xl leading-[0.95]">
        {title}
      </h2>
      {subtitle && (
        <p className="text-cr-text-muted mt-3 text-base font-sans">{subtitle}</p>
      )}
    </div>
  );
}

// ── EmptyState ─────────────────────────────────
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
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 bg-cr-surface-2 border border-cr-border flex items-center justify-center mb-4 text-cr-primary shadow-[4px_4px_0px_0px_#DBFF00]">
        {icon}
      </div>
      <h3 className="font-display uppercase text-xl mb-2">{title}</h3>
      <p className="text-cr-text-muted text-sm font-sans max-w-sm">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

// ── SuccessBanner ──────────────────────────────
export function SuccessBanner({ message }: { message: string }) {
  return (
    <div className="flex items-center gap-3 bg-cr-primary/[0.08] border border-cr-primary/30 px-4 py-3">
      <CheckCircle size={18} strokeWidth={1.75} className="text-cr-primary flex-shrink-0" />
      <p className="text-cr-primary text-sm font-sans font-medium">{message}</p>
    </div>
  );
}
