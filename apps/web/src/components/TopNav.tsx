import React, { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Camera,
  Heart,
  LogOut,
  MessageSquare,
  Settings,
  TicketCheck,
  User as UserIcon,
  Users,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";
import { useSession } from "@/lib/session";
import { useI18n } from "@/lib/i18n";
import { initials } from "@/lib/format";
import { LanguageSwitcher } from "./LanguageSwitcher";

// Cabecera adaptativa (D2 del banco): transparente sobre el hero; a 24 px de
// scroll gana fondo, filete y encoge. Umbral bajo para que no titile.
const SCROLL_THRESHOLD_PX = 24;

function useScrollState() {
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    if (typeof window === "undefined") return;
    let lastY = window.scrollY;
    let raf = 0;
    function onScroll() {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > SCROLL_THRESHOLD_PX);
        if (window.innerWidth >= 768) {
          setHidden(false);
        } else if (y > 80) {
          // Móvil: se esconde al bajar, vuelve al subir
          setHidden(y > lastY);
        } else {
          setHidden(false);
        }
        lastY = y;
        raf = 0;
      });
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
  return { hidden, scrolled };
}

export function TopNav() {
  const { user, loading, logout } = useSession();
  const { t } = useI18n();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const ref = useRef<HTMLElement | null>(null);
  const menuBtnRef = useRef<HTMLButtonElement | null>(null);
  const burgerRef = useRef<HTMLButtonElement | null>(null);
  const { hidden, scrolled } = useScrollState();

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    !!window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!ref.current?.contains(e.target as Node)) {
        setOpen(false);
        setMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  // WCAG 2.1.2 / 3.2.1 — Escape cierra menús y devuelve el foco al disparador.
  useEffect(() => {
    if (!open && !menuOpen) return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (open) {
          setOpen(false);
          menuBtnRef.current?.focus();
        }
        if (menuOpen) {
          setMenuOpen(false);
          burgerRef.current?.focus();
        }
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [open, menuOpen]);

  // Cambio de ruta: cerrar el menú móvil.
  useEffect(() => {
    setMenuOpen(false);
    setOpen(false);
  }, [location.pathname]);

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
  const registerTo = `/register${next !== "%2F" ? `?next=${next}` : ""}`;
  const loginTo = `/login${next !== "%2F" ? `?next=${next}` : ""}`;

  return (
    <nav
      ref={ref}
      aria-label={t("nav.mainNav")}
      aria-hidden={hidden ? "true" : undefined}
      // WCAG 2.4.7 / 4.1.2 — fuera de pantalla, también fuera del árbol de foco.
      {...(hidden ? { inert: "" as unknown as undefined } : {})}
      className={`cr-topnav fixed top-0 left-0 right-0 z-50 font-sans ${scrolled ? "is-scrolled" : ""} ${menuOpen ? "is-open" : ""}`}
      style={{
        transform: hidden ? "translateY(-100%)" : "translateY(0)",
        transition: prefersReducedMotion ? "none" : undefined,
      }}
    >
      <div className="h-full flex items-center justify-between px-4 md:px-6">
        {/* Wordmark */}
        <Link
          to="/"
          aria-label={t("nav.homeAria")}
          className="font-display text-[13px] uppercase tracking-[0.06em] text-cr-text"
        >
          Concert<span className="text-cr-primary">Ride</span>
        </Link>

        {/* Destinos · escritorio */}
        <div className="hidden md:flex items-center gap-6 absolute left-1/2 -translate-x-1/2">
          <NavLink to="/concerts">{t("nav.concerts")}</NavLink>
          <NavLink to="/festivales">{t("nav.festivals")}</NavLink>
          <NavLink to="/rutas">{t("nav.routes")}</NavLink>
        </div>

        {/* Derecha */}
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          {loading ? (
            // Reserva el hueco para que la cabecera no salte al resolver la sesión.
            <span aria-hidden="true" className="hidden sm:block h-9 w-[160px]" />
          ) : user ? (
            <div className="relative">
              <button
                type="button"
                ref={menuBtnRef}
                onClick={() => setOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={open}
                aria-controls="user-menu"
                aria-label={t("nav.userMenu", { name: user.name })}
                className="inline-flex items-center gap-2 h-9 bg-cr-surface-2 border border-cr-border hover:border-cr-border-mid text-cr-text pl-1.5 pr-2.5 transition-[border-color] duration-150"
              >
                <span
                  aria-hidden="true"
                  className="w-6 h-6 bg-cr-primary text-cr-text-inverse font-display text-[10px] flex items-center justify-center flex-shrink-0"
                >
                  {initials(user.name)}
                </span>
                <span className="cr-label hidden sm:inline">{user.name.split(" ")[0]}</span>
                <ChevronDown
                  size={11}
                  className={`text-cr-text-muted transition-transform duration-150 ${open ? "rotate-180" : ""}`}
                />
              </button>

              {open && (
                <div
                  id="user-menu"
                  role="menu"
                  className="absolute right-0 mt-2 min-w-[220px] bg-cr-surface border border-cr-border shadow-float overflow-hidden"
                >
                  <div className="px-4 py-3.5 bg-cr-surface-2 border-b border-cr-border">
                    <p className="text-[12px] text-cr-text truncate">{user.email}</p>
                    <p className="cr-label text-cr-text-muted mt-1 flex items-center gap-1.5 normal-case tracking-normal font-medium">
                      <span className="text-cr-primary">★ {user.rating.toFixed(1)}</span>
                      <span className="text-cr-text-dim">·</span>
                      <span>{t("nav.trips", { count: user.rides_given })}</span>
                    </p>
                  </div>

                  <div className="py-1">
                    <MenuLink to="/publish" icon={<UserIcon size={12} />} onClick={() => setOpen(false)}>
                      {t("nav.publishRide")}
                    </MenuLink>
                    <MenuLink to="/mis-viajes" icon={<TicketCheck size={12} />} onClick={() => setOpen(false)}>
                      {t("nav.myRides")}
                    </MenuLink>
                    <MenuLink to="/crew" icon={<Users size={12} />} onClick={() => setOpen(false)}>
                      {t("nav.myCrew")}
                    </MenuLink>
                    <MenuLink to="/memorias" icon={<Camera size={12} />} onClick={() => setOpen(false)}>
                      {t("nav.myMemories")}
                    </MenuLink>
                    <MenuLink to="/mensajes" icon={<MessageSquare size={12} />} onClick={() => setOpen(false)}>
                      {t("nav.messages")}
                    </MenuLink>
                    <MenuLink to="/favoritos" icon={<Heart size={12} />} onClick={() => setOpen(false)}>
                      {t("nav.favorites")}
                    </MenuLink>
                    <MenuLink to="/profile" icon={<Settings size={12} />} onClick={() => setOpen(false)}>
                      {t("nav.myProfile")}
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
                      className="w-full flex items-center gap-2.5 px-4 py-2.5 text-left text-[12px] font-medium text-cr-text-muted hover:bg-cr-surface-2 hover:text-cr-secondary transition-colors"
                    >
                      <LogOut size={12} aria-hidden="true" />
                      {t("nav.logout")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="hidden sm:flex items-center gap-2">
              <Link
                to={registerTo}
                rel="nofollow"
                className="inline-flex items-center h-9 bg-cr-primary text-cr-text-inverse px-3.5 cr-label hover:bg-cr-primary-dim transition-colors duration-150"
              >
                {t("nav.register")}
              </Link>
              <Link
                to={loginTo}
                rel="nofollow"
                className="inline-flex items-center h-9 border border-cr-border-mid hover:border-cr-text text-cr-text px-3.5 cr-label transition-[border-color] duration-150"
              >
                {t("nav.login")}
              </Link>
            </div>
          )}

          {/* Menú móvil */}
          <button
            type="button"
            ref={burgerRef}
            onClick={() => setMenuOpen((v) => !v)}
            aria-expanded={menuOpen}
            aria-controls="mobile-menu"
            aria-label={menuOpen ? t("common.close") : t("nav.mainNav")}
            className="md:hidden inline-flex items-center justify-center h-9 w-9 border border-cr-border-mid text-cr-text"
          >
            {menuOpen ? <X size={16} aria-hidden="true" /> : <Menu size={16} aria-hidden="true" />}
          </button>
        </div>
      </div>

      {/* Panel móvil: los tres destinos + publicar + acceso */}
      {menuOpen && (
        <div
          id="mobile-menu"
          className="md:hidden absolute top-full left-0 right-0 bg-cr-bg border-b border-cr-border shadow-float"
        >
          <ul className="cr-register">
            <MobileRow to="/concerts" n="01">{t("nav.concerts")}</MobileRow>
            <MobileRow to="/festivales" n="02">{t("nav.festivals")}</MobileRow>
            <MobileRow to="/rutas" n="03">{t("nav.routes")}</MobileRow>
            <MobileRow to="/publish" n="04" accent>{t("nav.publishRide")}</MobileRow>
          </ul>
          {!loading && !user && (
            <div className="grid grid-cols-2 gap-2 p-4">
              <Link to={registerTo} rel="nofollow" className="cr-btn-primary !px-3 !py-3 !text-[11px] whitespace-nowrap text-center">
                {t("nav.register")}
              </Link>
              <Link to={loginTo} rel="nofollow" className="cr-btn-ghost !px-3 !py-3 !text-[11px] whitespace-nowrap text-center">
                {t("nav.login")}
              </Link>
            </div>
          )}
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
      className={`cr-link cr-label py-1.5 ${isActive ? "text-cr-primary" : "text-cr-text hover:text-cr-primary"}`}
    >
      {children}
    </Link>
  );
}

function MobileRow({ to, n, children, accent = false }: { to: string; n: string; children: React.ReactNode; accent?: boolean }) {
  return (
    <li>
      <Link to={to} className="cr-register__row !grid-cols-[2.5rem_1fr_auto] !gap-4 px-4 !py-4 items-center">
        <span className="cr-label text-cr-text-muted">{n}</span>
        <span className={`font-display text-display-s ${accent ? "text-cr-primary" : "text-cr-text"}`}>{children}</span>
        <span aria-hidden="true" className="text-cr-text-muted">→</span>
      </Link>
    </li>
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
      className="flex items-center gap-2.5 px-4 py-2.5 text-[12px] font-medium text-cr-text-muted hover:bg-cr-surface-2 hover:text-cr-primary transition-colors duration-100"
    >
      <span className="text-cr-text-dim" aria-hidden="true">{icon}</span>
      {children}
    </Link>
  );
}
