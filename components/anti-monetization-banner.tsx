"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Shield, ArrowUpRight, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/lib/i18n";

const DISMISS_KEY = "anti-monetization-dismissed";

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
  const [reduceMotion, setReduceMotion] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const bannerRef = useRef<HTMLDivElement | null>(null);
  const { t } = useI18n();

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

  // El offset CSS (3.25rem/3.5rem) es solo una estimación inicial anti-CLS. Si el texto
  // salta a 2–3 líneas (móvil, zoom, idioma EN) el banner mide más y tapaba la nav sticky:
  // aquí se publica la altura real. Se usa CSSOM (no atributo style) → compatible con la CSP.
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

  if (dismissed) {
    return null;
  }

  const bannerClass = cn(
    "anti-monetization-banner",
    reduceMotion && "anti-monetization-banner--reduced-motion",
    isHovered && "anti-monetization-banner--hovered",
  );

  const handleDismiss = () => {
    setDismissed(true);
    writeDismissed();
    document.documentElement.setAttribute("data-ax-banner", "0");
  };

  const textParts = t("antiMonetization.text").split("{strong}");

  return (
    <div
      ref={bannerRef}
      className={bannerClass}
      role="region"
      aria-label={t("antiMonetization.regionLabel")}
      data-reduced-motion={reduceMotion ? "true" : "false"}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="anti-monetization-banner__content">
        <Shield className="anti-monetization-banner__icon" aria-hidden="true" />
        <p className="anti-monetization-banner__text">
          {textParts[0]}
          <strong>{t("antiMonetization.strong")}</strong>
          {textParts.slice(1).join("{strong}")}
        </p>
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
