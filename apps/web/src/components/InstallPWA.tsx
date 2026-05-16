import { useEffect, useState } from "react";
import { X } from "lucide-react";

type Platform = "android" | "ios" | "other";

function detectPlatform(): Platform {
  const ua = navigator.userAgent;
  if (/iphone|ipad|ipod/i.test(ua)) return "ios";
  if (/android/i.test(ua)) return "android";
  return "other";
}

function isStandalone(): boolean {
  return (
    window.matchMedia("(display-mode: standalone)").matches ||
    ("standalone" in window.navigator && (window.navigator as { standalone?: boolean }).standalone === true)
  );
}

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  readonly userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISSED_KEY = "cr_pwa_banner_dismissed";

export function InstallPWA() {
  const [platform, setPlatform] = useState<Platform>("other");
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState(false);
  const [showIosHint, setShowIosHint] = useState(false);

  useEffect(() => {
    // Never show if already installed
    if (isStandalone()) return;
    // Never show if user permanently dismissed
    const dismissed = localStorage.getItem(DISMISSED_KEY);
    if (dismissed) return;

    const plat = detectPlatform();
    setPlatform(plat);

    if (plat === "android") {
      const handler = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e as BeforeInstallPromptEvent);
        // Delay so it doesn't flash immediately on page load
        setTimeout(() => setShowBanner(true), 4000);
      };
      window.addEventListener("beforeinstallprompt", handler);
      return () => window.removeEventListener("beforeinstallprompt", handler);
    }

    if (plat === "ios") {
      // Show iOS instructions after a short delay so it doesn't flash on load
      const t = setTimeout(() => setShowIosHint(true), 4000);
      return () => clearTimeout(t);
    }
  }, []);

  function dismiss() {
    localStorage.setItem(DISMISSED_KEY, "1");
    setShowBanner(false);
    setShowIosHint(false);
  }

  async function handleInstall() {
    if (!deferredPrompt) return;
    await deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === "accepted") {
      setShowBanner(false);
      setDeferredPrompt(null);
    }
  }

  if (showBanner && platform === "android") {
    return (
      <div
        role="banner"
        aria-label="Instalar ConcertRide"
        className="fixed bottom-0 left-0 right-0 z-[55] sm:hidden bg-[#0e0e0e] border-t border-white/[0.08] px-4 py-3 flex items-center gap-3 shadow-2xl"
      >
        <div className="w-9 h-9 shrink-0 bg-[#dbff00] flex items-center justify-center">
          <span className="font-display text-black text-sm font-bold">CR</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-sans text-xs font-semibold text-white leading-tight">
            Instala ConcertRide: recibe alertas de viajes a festivales
          </p>
          <p className="font-sans text-[11px] text-white/50 leading-tight mt-0.5">
            Gratis · Sin internet · Notificaciones de nuevos viajes
          </p>
        </div>
        <button
          type="button"
          onClick={handleInstall}
          className="shrink-0 bg-[#dbff00] text-black font-sans text-[11px] font-semibold uppercase tracking-[0.12em] px-3 py-1.5 hover:opacity-90 transition-opacity"
        >
          Instalar gratis
        </button>
        <button
          type="button"
          onClick={dismiss}
          aria-label="Cerrar"
          className="shrink-0 text-white/30 hover:text-white/70 transition-colors"
        >
          <X size={16} />
        </button>
      </div>
    );
  }

  if (showIosHint && platform === "ios") {
    return (
      <div
        role="banner"
        aria-label="Instalar ConcertRide en iOS"
        className="fixed bottom-0 left-0 right-0 z-[55] sm:hidden bg-[#0e0e0e] border-t border-white/[0.08] px-4 py-4 shadow-2xl"
      >
        <div className="flex items-start justify-between gap-3 mb-2">
          <p className="font-sans text-xs font-semibold text-white">
            Instala ConcertRide: recibe alertas de nuevos viajes
          </p>
          <button
            type="button"
            onClick={dismiss}
            aria-label="Cerrar"
            className="shrink-0 text-white/30 hover:text-white/70 transition-colors mt-0.5"
          >
            <X size={16} />
          </button>
        </div>
        <ol className="font-sans text-[11px] text-white/50 space-y-1 list-none pl-0">
          <li>
            <span className="text-[#dbff00] font-semibold">1.</span>{" "}
            Pulsa el botón <strong className="text-white/80">Compartir</strong>{" "}
            <span aria-label="ícono compartir">⎙</span> en la barra del navegador
          </li>
          <li>
            <span className="text-[#dbff00] font-semibold">2.</span>{" "}
            Elige <strong className="text-white/80">«Añadir a pantalla de inicio»</strong>
          </li>
          <li>
            <span className="text-[#dbff00] font-semibold">3.</span>{" "}
            Pulsa <strong className="text-white/80">«Añadir»</strong>
          </li>
        </ol>
      </div>
    );
  }

  return null;
}
