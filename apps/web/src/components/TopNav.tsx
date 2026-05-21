import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Activity,
  Camera,
  Heart,
  LogOut,
  MessageSquare,
  Settings,
  TicketCheck,
  User as UserIcon,
  Users,
  ChevronDown,
} from "lucide-react";
import { useSession } from "@/lib/session";
import { initials } from "@/lib/format";

function useHideOnScrollDown() {
  const [hidden, setHidden] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    let lastY = window.scrollY;
    let raf = 0;
    function onScroll() {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        // Desktop (md+) always visible
        if (window.innerWidth >= 768) {
          setHidden(false);
        } else if (y > 80) {
          // Hide when scrolling DOWN past 80px, show when scrolling UP
          setHidden(y > lastY);
        } else {
          setHidden(false);
        }
        lastY = y;
        raf = 0;
      });
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return hidden;
}

export function TopNav() {
  const { user, loading, logout } = useSession();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLElement | null>(null);
  const hidden = useHideOnScrollDown();

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  if (loading) return null;

  const rawNext = location.pathname + location.search;
  const isOnAuthPage =
    location.pathname === "/login" ||
    location.pathname === "/register" ||
    location.pathname === "/forgot-password" ||
    location.pathname === "/reset-password";
  let safeNext = "/";
  if (!isOnAuthPage) {
    safeNext = rawNext;
  } else {
    try {
      const sp = new URLSearchParams(location.search);
      const existing = sp.get("next");
      if (
        existing &&
        existing.startsWith("/") &&
        !existing.startsWith("/login") &&
        !existing.startsWith("/register") &&
        !existing.startsWith("/forgot-password") &&
        !existing.startsWith("/reset-password")
      ) {
        safeNext = existing;
      }
    } catch { /* fallthrough to "/" */ }
  }
  const next = encodeURIComponent(safeNext);

  return (
    <nav
      ref={ref}
      aria-label="Navegación principal"
      aria-hidden={hidden ? "true" : undefined}
      // WCAG 2.4.7 / 4.1.2 — when translated off-screen, also remove the nav from
      // the tab/AT tree so keyboard users can't focus invisible items. `inert`
      // is the broadest fix (no descendants are reachable until the bar returns).
      {...(hidden ? { inert: "" as unknown as undefined } : {})}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 md:px-6 h-14 bg-cr-bg/85 backdrop-blur-md border-b border-cr-border font-sans text-xs transition-transform duration-200"
      style={{
        transform: hidden ? "translateY(-100%)" : "translateY(0)",
        transition: prefersReducedMotion ? "none" : undefined,
      }}
    >
      {/* Wordmark */}
      <Link
        to="/"
        aria-label="ConcertRide — inicio"
        className="font-display text-[13px] uppercase tracking-[0.06em] hover:opacity-90 transition-opacity"
      >
        Concert<span className="text-cr-primary">Ride</span>
      </Link>

      {/* Centre nav links */}
      <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
        <NavLink to="/concerts">Conciertos</NavLink>
        <NavLink to="/festivales">Festivales</NavLink>
        <NavLink to="/rutas">Rutas</NavLink>
        <NavLink to="/feed">Live</NavLink>
      </div>

      {/* Right side */}
      {user ? (
        <div className="relative">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={open}
            aria-controls="user-menu"
            aria-label={`Menú de usuario: ${user.name}`}
            className="inline-flex items-center gap-2 h-9 bg-cr-surface-2 border border-cr-border hover:border-cr-primary/50 text-cr-text hover:text-cr-primary pl-1.5 pr-2.5 transition-[border-color,color] duration-150"
          >
            {/* Avatar */}
            <span
              aria-hidden="true"
              className="w-6 h-6 bg-cr-primary text-black font-display font-black text-[10px] flex items-center justify-center flex-shrink-0"
            >
              {initials(user.name)}
            </span>
            <span className="font-semibold uppercase tracking-[0.1em] text-[11px] hidden sm:inline">
              {user.name.split(" ")[0]}
            </span>
            <ChevronDown
              size={11}
              className={`text-cr-text-muted transition-transform duration-150 ${open ? "rotate-180" : ""}`}
            />
          </button>

          {open && (
            <div
              id="user-menu"
              role="menu"
              className="absolute right-0 mt-2 min-w-[220px] bg-cr-surface border border-cr-border shadow-[var(--shadow-float)] overflow-hidden"
            >
              {/* User info header */}
              <div className="px-4 py-3.5 bg-cr-surface-2 border-b border-cr-border">
                <p className="font-mono text-[11px] text-cr-text truncate">{user.email}</p>
                <p className="font-mono text-[10px] text-cr-text-muted mt-0.5 flex items-center gap-1.5">
                  <span className="text-cr-primary">★ {user.rating.toFixed(1)}</span>
                  <span className="text-cr-text-dim">·</span>
                  <span>{user.rides_given} viajes</span>
                </p>
              </div>

              <div className="py-1">
                <MenuLink to="/publish" icon={<UserIcon size={12} />} onClick={() => setOpen(false)}>
                  Publicar un viaje
                </MenuLink>
                <MenuLink to="/mis-viajes" icon={<TicketCheck size={12} />} onClick={() => setOpen(false)}>
                  Mis viajes
                </MenuLink>
                <MenuLink to="/crew" icon={<Users size={12} />} onClick={() => setOpen(false)}>
                  Mi crew
                </MenuLink>
                <MenuLink to="/feed" icon={<Activity size={12} />} onClick={() => setOpen(false)}>
                  En directo
                </MenuLink>
                <MenuLink to="/memorias" icon={<Camera size={12} />} onClick={() => setOpen(false)}>
                  Mis recuerdos
                </MenuLink>
                <MenuLink to="/mensajes" icon={<MessageSquare size={12} />} onClick={() => setOpen(false)}>
                  Mensajes
                </MenuLink>
                <MenuLink to="/favoritos" icon={<Heart size={12} />} onClick={() => setOpen(false)}>
                  Favoritos
                </MenuLink>
                <MenuLink to="/profile" icon={<Settings size={12} />} onClick={() => setOpen(false)}>
                  Mi perfil
                </MenuLink>
              </div>

              <div className="border-t border-cr-border py-1">
                <button
                  type="button"
                  role="menuitem"
                  onClick={async () => {
                    setOpen(false);
                    await logout();
                  }}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-[12px] font-sans font-medium text-cr-text-muted hover:bg-cr-secondary/[0.06] hover:text-cr-secondary transition-colors"
                >
                  <LogOut size={12} aria-hidden="true" />
                  Cerrar sesión
                </button>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Link
            to={`/register${next !== "%2F" ? `?next=${next}` : ""}`}
            rel="nofollow"
            className="hidden sm:inline-flex items-center gap-1.5 h-9 bg-[#dbff00] text-[#080808] px-3.5 font-semibold uppercase tracking-[0.12em] text-[11px] hover:bg-[#c8ec00] transition-colors duration-150"
          >
            Registro gratis
          </Link>
          <Link
            to={`/login${next !== "%2F" ? `?next=${next}` : ""}`}
            rel="nofollow"
            className="inline-flex items-center gap-1.5 h-9 bg-cr-surface-2 border border-cr-border hover:border-cr-primary/50 hover:text-cr-primary text-cr-text px-3.5 font-semibold uppercase tracking-[0.12em] text-[11px] transition-[border-color,color] duration-150"
          >
            Entrar
          </Link>
        </div>
      )}
    </nav>
  );
}

// ── Sub-components ────────────────────────────────────────────────────────────

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  const location = useLocation();
  const isActive = location.pathname.startsWith(to);

  return (
    <Link
      to={to}
      aria-current={isActive ? "page" : undefined}
      className={`group relative px-3 py-1.5 font-sans text-[12px] font-semibold uppercase tracking-[0.12em] transition-colors duration-150 ${
        isActive
          ? "text-cr-primary"
          : "text-cr-text hover:text-cr-primary"
      }`}
    >
      {children}
      <span
        aria-hidden="true"
        className={`absolute bottom-0 left-1/2 -translate-x-1/2 h-px bg-cr-primary transition-all duration-200 ${
          isActive ? "w-6 opacity-100" : "w-0 opacity-0 group-hover:w-6 group-hover:opacity-100"
        }`}
      />
    </Link>
  );
}

function MenuLink({
  to,
  icon,
  children,
  onClick,
}: {
  to: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <Link
      to={to}
      onClick={onClick}
      role="menuitem"
      className="flex items-center gap-2.5 px-4 py-2.5 text-[12px] font-sans font-medium text-cr-text-muted hover:bg-cr-surface-2 hover:text-cr-primary transition-colors duration-100"
    >
      <span className="text-cr-text-dim" aria-hidden="true">{icon}</span>
      {children}
    </Link>
  );
}
