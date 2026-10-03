import React from "react";
import { act } from "react";
import { createRoot, type Root } from "react-dom/client";
import { I18nProvider } from "@/lib/i18n";

// Habilita act() en el entorno de test de React.
(globalThis as unknown as { IS_REACT_ACT_ENVIRONMENT: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

export async function mount(
  node: React.ReactNode,
): Promise<{ container: HTMLElement; unmount: () => void }> {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root: Root = createRoot(container);
  await act(async () => {
    root.render(<I18nProvider>{node}</I18nProvider>);
  });
  return {
    container,
    unmount: () => {
      act(() => root.unmount());
      container.remove();
    },
  };
}

export { act };
