import { afterEach, describe, expect, it, vi } from "vitest";
import { CopyEmail } from "@/components/copy-email";
import { siteConfig } from "@/lib/site";
import { act, mount } from "./helpers";

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

function stubClipboard(impl: () => Promise<void>) {
  const writeText = vi.fn(impl);
  Object.defineProperty(navigator, "clipboard", { value: { writeText }, configurable: true });
  return writeText;
}

describe("CopyEmail", () => {
  it("copia el correo, confirma y vuelve al estado inicial", async () => {
    vi.useFakeTimers();
    const writeText = stubClipboard(() => Promise.resolve());
    const { container, unmount } = await mount(<CopyEmail />);
    const btn = container.querySelector<HTMLButtonElement>("button");
    expect(btn?.textContent).toContain("Copiar correo");

    await act(async () => {
      btn?.click();
    });
    expect(writeText).toHaveBeenCalledWith(siteConfig.contact.email);
    expect(btn?.textContent).toContain("Correo copiado");
    expect(container.querySelector('[role="status"]')?.textContent).toBe("Correo copiado");

    await act(async () => {
      vi.advanceTimersByTime(3000);
    });
    expect(btn?.textContent).toContain("Copiar correo");
    expect(container.querySelector('[role="status"]')?.textContent).toBe("");
    unmount();
  });

  it("anuncia el error si el portapapeles falla", async () => {
    stubClipboard(() => Promise.reject(new Error("denied")));
    const { container, unmount } = await mount(<CopyEmail />);
    await act(async () => {
      container.querySelector<HTMLButtonElement>("button")?.click();
    });
    expect(container.querySelector('[role="status"]')?.textContent).toBe(
      "No se pudo copiar el correo",
    );
    unmount();
  });
});
