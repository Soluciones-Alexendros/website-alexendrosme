/**
 * Preferencia de movimiento del visitante para las animaciones decorativas (fondo, atmósfera).
 *
 * - "auto"  → se respeta `prefers-reduced-motion` del sistema (comportamiento por defecto).
 * - "on"    → el visitante pide movimiento aunque su sistema pida reducirlo.
 * - "off"   → el visitante pausa las animaciones aunque su sistema las permita.
 *
 * Se publica en `<html data-motion="on|off">` (sin atributo = auto). WCAG 2.2.2 (Pause, Stop,
 * Hide): todo movimiento que dura >5 s necesita un control para pausarlo.
 */
export type MotionPref = "auto" | "on" | "off";

export const MOTION_KEY = "motion";
export const MOTION_EVENT = "ax:motion";

export function isMotionPref(value: unknown): value is MotionPref {
  return value === "auto" || value === "on" || value === "off";
}

/** localStorage puede lanzar (modo privado, cookies bloqueadas): nunca debe romper la UI. */
export function readMotionPref(): MotionPref {
  try {
    const raw = localStorage.getItem(MOTION_KEY);
    return isMotionPref(raw) ? raw : "auto";
  } catch {
    return "auto";
  }
}

export function writeMotionPref(pref: MotionPref): void {
  try {
    if (pref === "auto") localStorage.removeItem(MOTION_KEY);
    else localStorage.setItem(MOTION_KEY, pref);
  } catch {
    // sin almacenamiento: la preferencia dura solo la sesión
  }
}

/** Aplica la preferencia al <html> y avisa a quien escuche (el canvas del fondo). */
export function applyMotionPref(pref: MotionPref): void {
  const root = document.documentElement;
  if (pref === "auto") root.removeAttribute("data-motion");
  else root.setAttribute("data-motion", pref);
  window.dispatchEvent(new CustomEvent(MOTION_EVENT, { detail: pref }));
}

/**
 * ¿Debe animarse ahora el fondo?
 * Orden: elección explícita del visitante > preferencia del sistema > pista `data-reduce`.
 */
export function motionAllowed(opts: {
  attr: string | null;
  systemReduce: boolean;
  dataReduce: boolean;
}): boolean {
  if (opts.attr === "off") return false;
  if (opts.attr === "on") return true;
  return !(opts.systemReduce || opts.dataReduce);
}
