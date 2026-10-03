import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MotionToggle } from "@/components/motion-toggle";
import { act, mount } from "./helpers";

function stubMedia(reduce: boolean) {
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockImplementation((q: string) => ({
      matches: q.includes("reduce") ? reduce : false,
      media: q,
      addEventListener: () => {},
      removeEventListener: () => {},
    })),
  );
}

beforeEach(() => {
  localStorage.clear();
  document.documentElement.removeAttribute("data-motion");
  document.documentElement.removeAttribute("data-reduce");
});
afterEach(() => {
  vi.unstubAllGlobals();
});

describe("MotionToggle", () => {
  it("por defecto ofrece pausar y alterna data-motion + persistencia", async () => {
    stubMedia(false);
    const { container, unmount } = await mount(<MotionToggle />);
    const btn = container.querySelector<HTMLButtonElement>("button");
    expect(btn?.getAttribute("aria-label")).toBe("Pausar animaciones del fondo");
    expect(btn?.getAttribute("aria-pressed")).toBe("false");

    await act(async () => {
      btn?.click();
    });
    expect(document.documentElement.getAttribute("data-motion")).toBe("off");
    expect(localStorage.getItem("motion")).toBe("off");
    expect(btn?.getAttribute("aria-label")).toBe("Reanudar animaciones del fondo");
    expect(btn?.getAttribute("aria-pressed")).toBe("true");

    await act(async () => {
      btn?.click();
    });
    expect(document.documentElement.getAttribute("data-motion")).toBe("on");
    unmount();
  });

  it("con prefers-reduced-motion arranca en pausa y deja reanudar", async () => {
    stubMedia(true);
    const { container, unmount } = await mount(<MotionToggle />);
    const btn = container.querySelector<HTMLButtonElement>("button");
    expect(btn?.getAttribute("aria-label")).toBe("Reanudar animaciones del fondo");
    await act(async () => {
      btn?.click();
    });
    expect(document.documentElement.getAttribute("data-motion")).toBe("on");
    unmount();
  });
});
