"use client";

import { useEffect, useState } from "react";
import { Pause, Play } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import {
  applyMotionPref,
  motionAllowed,
  readMotionPref,
  writeMotionPref,
  type MotionPref,
} from "@/lib/motion";

/**
 * Control para pausar/reanudar las animaciones decorativas del fondo.
 * Estado derivado de lo que realmente ocurre (preferencia guardada + sistema), no solo de lo guardado.
 */
export function MotionToggle() {
  const { t } = useI18n();
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    const stored = readMotionPref();
    if (stored !== "auto") applyMotionPref(stored);
    const root = document.documentElement;
    setPlaying(
      motionAllowed({
        attr: root.getAttribute("data-motion"),
        systemReduce: window.matchMedia("(prefers-reduced-motion: reduce)").matches,
        dataReduce: root.getAttribute("data-reduce") === "true",
      }),
    );
  }, []);

  const toggle = () => {
    const next: MotionPref = playing ? "off" : "on";
    writeMotionPref(next);
    applyMotionPref(next);
    setPlaying(!playing);
  };

  return (
    <button
      type="button"
      className="icon-link motion-toggle"
      onClick={toggle}
      aria-pressed={!playing}
      aria-label={playing ? t("motion.pause") : t("motion.play")}
      title={playing ? t("motion.pause") : t("motion.play")}
    >
      {playing ? (
        <Pause className="icn-md" aria-hidden="true" />
      ) : (
        <Play className="icn-md" aria-hidden="true" />
      )}
    </button>
  );
}
