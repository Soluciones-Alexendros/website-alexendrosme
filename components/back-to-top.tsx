"use client";

import { useEffect, useState } from "react";
import { ArrowUp } from "lucide-react";
import { useI18n } from "@/lib/i18n";

/** Distancia de scroll a partir de la cual aparece el botón. */
const SHOW_AFTER = 640;

/**
 * Botón «volver arriba» con anillo de progreso de lectura.
 * El anillo se rellena con CSS puro (animation-timeline: scroll()); el JS solo decide la
 * visibilidad (listener pasivo + rAF) y hace el scroll respetando prefers-reduced-motion.
 */
export function BackToTop() {
  const { t } = useI18n();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      raf = 0;
      setVisible(window.scrollY > SHOW_AFTER);
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  const goTop = () => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
  };

  return (
    <button
      type="button"
      className="back-to-top"
      data-visible={visible}
      onClick={goTop}
      aria-label={t("backToTop")}
      title={t("backToTop")}
      tabIndex={visible ? 0 : -1}
      aria-hidden={!visible}
    >
      <svg className="back-to-top__ring" viewBox="0 0 48 48" aria-hidden="true">
        <circle className="back-to-top__track" cx="24" cy="24" r="22" pathLength="1" />
        <circle className="back-to-top__bar" cx="24" cy="24" r="22" pathLength="1" />
      </svg>
      <ArrowUp className="back-to-top__icon" aria-hidden="true" size={18} />
    </button>
  );
}
