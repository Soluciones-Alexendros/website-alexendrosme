import { afterEach, describe, expect, it, vi } from "vitest";
import {
  MOTION_EVENT,
  applyMotionPref,
  isMotionPref,
  motionAllowed,
  readMotionPref,
  writeMotionPref,
} from "@/lib/motion";

describe("motionAllowed (orden: elección del visitante > sistema > data-reduce)", () => {
  it("permite movimiento por defecto", () => {
    expect(motionAllowed({ attr: null, systemReduce: false, dataReduce: false })).toBe(true);
  });
  it("respeta prefers-reduced-motion del sistema", () => {
    expect(motionAllowed({ attr: null, systemReduce: true, dataReduce: false })).toBe(false);
  });
  it("respeta la pista data-reduce", () => {
    expect(motionAllowed({ attr: null, systemReduce: false, dataReduce: true })).toBe(false);
  });
  it('"off" pausa aunque el sistema permita movimiento', () => {
    expect(motionAllowed({ attr: "off", systemReduce: false, dataReduce: false })).toBe(false);
  });
  it('"on" reactiva aunque el sistema pida reducirlo (decisión explícita)', () => {
    expect(motionAllowed({ attr: "on", systemReduce: true, dataReduce: true })).toBe(true);
  });
});

describe("preferencia persistida", () => {
  afterEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-motion");
    vi.restoreAllMocks();
  });

  it("isMotionPref valida los tres valores", () => {
    expect(isMotionPref("auto")).toBe(true);
    expect(isMotionPref("on")).toBe(true);
    expect(isMotionPref("off")).toBe(true);
    expect(isMotionPref("sí")).toBe(false);
    expect(isMotionPref(null)).toBe(false);
  });

  it("lee 'auto' sin valor o con basura guardada", () => {
    expect(readMotionPref()).toBe("auto");
    localStorage.setItem("motion", "zzz");
    expect(readMotionPref()).toBe("auto");
  });

  it("guarda y lee 'off'; 'auto' borra la clave", () => {
    writeMotionPref("off");
    expect(readMotionPref()).toBe("off");
    writeMotionPref("auto");
    expect(localStorage.getItem("motion")).toBeNull();
  });

  it("no lanza si localStorage falla (Safari privado)", () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("denied");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("denied");
    });
    expect(readMotionPref()).toBe("auto");
    expect(() => writeMotionPref("off")).not.toThrow();
  });

  it("applyMotionPref escribe data-motion y emite el evento", () => {
    const listener = vi.fn();
    window.addEventListener(MOTION_EVENT, listener);
    applyMotionPref("off");
    expect(document.documentElement.getAttribute("data-motion")).toBe("off");
    applyMotionPref("auto");
    expect(document.documentElement.hasAttribute("data-motion")).toBe(false);
    expect(listener).toHaveBeenCalledTimes(2);
    window.removeEventListener(MOTION_EVENT, listener);
  });
});
