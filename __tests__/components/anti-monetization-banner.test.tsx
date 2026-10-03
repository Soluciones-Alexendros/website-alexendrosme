import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { AntiMonetizationBanner } from "@/components/anti-monetization-banner";
import { act, mount } from "./helpers";

beforeEach(() => {
  localStorage.clear();
  vi.stubGlobal(
    "matchMedia",
    vi.fn().mockImplementation((q: string) => ({
      matches: false,
      media: q,
      addEventListener: () => {},
      removeEventListener: () => {},
    })),
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.useRealTimers();
  document.documentElement.removeAttribute("data-ax-banner");
  document.documentElement.style.removeProperty("--ax-banner-offset");
  vi.restoreAllMocks();
});

describe("AntiMonetizationBanner v2", () => {
  it("renderiza la frase con <strong>, los chips y el CTA sin innerHTML", async () => {
    const { container, unmount } = await mount(<AntiMonetizationBanner />);
    const text = container.querySelector(".anti-monetization-banner__text");
    expect(text?.textContent).toBe("Este espacio es libre de monetización.");
    expect(text?.querySelector("strong")?.textContent).toBe("monetización");
    const chips = [...container.querySelectorAll(".anti-monetization-banner__chip")].map(
      (c) => c.textContent,
    );
    expect(chips).toEqual(["0 anuncios", "0 afiliados", "0 ventas"]);
    const link = container.querySelector<HTMLAnchorElement>(".anti-monetization-banner__link");
    expect(link?.getAttribute("href")).toBe("https://alexendros.dev");
    expect(link?.getAttribute("rel")).toBe("noopener noreferrer");
    expect(container.querySelector("svg.lucide-shield")).not.toBeNull();
    unmount();
  });

  it("cerrar persiste al instante, colapsa y luego desmonta", async () => {
    vi.useFakeTimers();
    const { container, unmount } = await mount(<AntiMonetizationBanner />);
    const btn = container.querySelector<HTMLButtonElement>(".anti-monetization-banner__dismiss");
    await act(async () => {
      btn?.click();
    });
    expect(localStorage.getItem("anti-monetization-dismissed")).toBe("true");
    expect(container.querySelector(".anti-monetization-banner")?.getAttribute("data-state")).toBe(
      "closing",
    );
    await act(async () => {
      vi.advanceTimersByTime(500);
    });
    expect(container.querySelector(".anti-monetization-banner")).toBeNull();
    expect(document.documentElement.getAttribute("data-ax-banner")).toBe("0");
    unmount();
  });

  it("Escape cierra el aviso", async () => {
    vi.useFakeTimers();
    const { container, unmount } = await mount(<AntiMonetizationBanner />);
    const banner = container.querySelector(".anti-monetization-banner");
    await act(async () => {
      banner?.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape", bubbles: true }));
    });
    expect(localStorage.getItem("anti-monetization-dismissed")).toBe("true");
    unmount();
  });

  it("no se muestra si ya se descartó", async () => {
    localStorage.setItem("anti-monetization-dismissed", "true");
    const { container, unmount } = await mount(<AntiMonetizationBanner />);
    expect(container.querySelector(".anti-monetization-banner")).toBeNull();
    unmount();
  });

  it("no rompe si localStorage lanza", async () => {
    vi.spyOn(Storage.prototype, "getItem").mockImplementation(() => {
      throw new Error("denied");
    });
    vi.spyOn(Storage.prototype, "setItem").mockImplementation(() => {
      throw new Error("denied");
    });
    vi.useFakeTimers();
    const { container, unmount } = await mount(<AntiMonetizationBanner />);
    expect(container.querySelector(".anti-monetization-banner")).not.toBeNull();
    await act(async () => {
      container.querySelector<HTMLButtonElement>(".anti-monetization-banner__dismiss")?.click();
      vi.advanceTimersByTime(500);
    });
    expect(container.querySelector(".anti-monetization-banner")).toBeNull();
    unmount();
  });
});
