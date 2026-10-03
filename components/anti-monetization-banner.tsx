"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Shield, ArrowUpRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

const DISMISS_KEY = "anti-monetization-dismissed";
/** Debe coincidir con --ax-duration-slow (colapso animado antes de desmontar). */
const COLLAPSE_MS = 360;

/** localStorage puede lanzar (Safari privado, cookies bloqueadas): nunca debe romper la UI. */
function readDismissed(): boolean {
  try {
    return localStorage.getItem(DISMISS_KEY) === "true";
  } catch {
    return false;
  }
}

function writeDismissed(): void {
  try {
    localStorage.setItem(DISMISS_KEY, "true");
  } catch {
    // almacenamiento no disponible: el aviso reaparecerá en la próxima visita
  }
}

export function AntiMonetizationBanner() {
  // SSR + first client paint assume visible (matches pre-paint data-ax-banner=1) to avoid CLS.
  const [dismissed, setDismissed] = useState(false);
  const [closing, setClosing] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const bannerRef = useRef<HTMLDivElement | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { t, tArray } = useI18n();

  useLayoutEffect(() => {
    const isDismissed = readDismissed();
    setDismissed(isDismissed);
    document.documentElement.setAttribute("data-ax-banner", isDismissed ? "0" : "1");

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setReduceMotion(e.matches);
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // El offset CSS (3.25rem/3.5rem) es solo una estimación inicial anti-CLS. Se publica la altura
  // real (también durante el colapso animado, así el contenido sube suavemente). Se usa CSSOM
  // (no atributo style) → compatible con la CSP.
  useEffect(() => {
    const root = document.documentElement;
    const el = bannerRef.current;
    if (dismissed || !el) {
      root.style.removeProperty("--ax-banner-offset");
      return;
    }
    const publish = () => root.style.setProperty("--ax-banner-offset", `${el.offsetHeight}px`);
    publish();
    if (typeof ResizeObserver === "undefined") return;
    const observer = new ResizeObserver(publish);
    observer.observe(el);
    return () => {
      observer.disconnect();
      root.style.removeProperty("--ax-banner-offset");
    };
  }, [dismissed]);

  useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    },
    [],
  );

  if (dismissed) {
    return null;
  }

  const finish = () => {
    setDismissed(true);
    document.documentElement.setAttribute("data-ax-banner", "0");
  };

  const handleDismiss = () => {
    if (closing) return;
    writeDismissed(); // se persiste al instante, aunque la animación no llegue a terminar
    if (reduceMotion) {
      finish();
      return;
    }
    setClosing(true);
    closeTimer.current = setTimeout(finish, COLLAPSE_MS);
  };

  const [before = "", after = ""] = t("antiMonetization.text").split("{strong}");
  const chips = tArray("antiMonetization.chips");

  return (
    <div
      ref={bannerRef}
      className={cn(
        "anti-monetization-banner",
        reduceMotion && "anti-monetization-banner--reduced-motion",
        isHovered && "anti-monetization-banner--hovered",
      )}
      role="region"
      aria-label={t("antiMonetization.regionLabel")}
      data-reduced-motion={reduceMotion ? "true" : "false"}
      data-state={closing ? "closing" : "open"}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onKeyDown={(e) => {
        if (e.key === "Escape") handleDismiss();
      }}
    >
      <div className="anti-monetization-banner__inner">
        <div className="anti-monetization-banner__content">
          <Shield className="anti-monetization-banner__icon" aria-hidden="true" />
          <p className="anti-monetization-banner__text">
            {before}
            <strong>{t("antiMonetization.strong")}</strong>
            {after}
          </p>
          {chips.length > 0 ? (
            <ul
              className="anti-monetization-banner__chips"
              aria-label={t("antiMonetization.chipsLabel")}
            >
              {chips.map((chip) => (
                <li key={chip} className="anti-monetization-banner__chip">
                  {chip}
                </li>
              ))}
            </ul>
          ) : null}
          <a
            href="https://alexendros.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="anti-monetization-banner__link"
          >
            {t("antiMonetization.link")}
            <ArrowUpRight
              className="anti-monetization-banner__link-icon"
              aria-hidden="true"
              size={14}
            />
          </a>
        </div>
      </div>
      <button
        type="button"
        className="anti-monetization-banner__dismiss"
        onClick={handleDismiss}
        aria-label={t("antiMonetization.dismissLabel")}
      >
        <X className="anti-monetization-banner__dismiss-icon" aria-hidden="true" size={16} />
      </button>
    </div>
  );
}
