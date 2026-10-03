"use client";

import { useEffect, useState } from "react";

interface ScrollSpyOptions {
  rootMargin?: string;
  threshold?: number[];
}

const DEFAULT_THRESHOLD = [0, 0.25, 0.5, 0.75, 1];

/**
 * Devuelve el `#id` de la sección más visible (se conserva la última activa mientras
 * ninguna intersecta). Las deps se derivan de valores primitivos (`ids.join`), así que un
 * array nuevo en cada render ya no recrea los observers.
 */
export function useScrollSpy(ids: string[], options: ScrollSpyOptions = {}): string {
  const [activeId, setActiveId] = useState("");
  const idsKey = ids.join("|");
  const { rootMargin = "-20% 0px -60% 0px", threshold = DEFAULT_THRESHOLD } = options;
  const thresholdKey = threshold.join(",");

  useEffect(() => {
    const list = idsKey ? idsKey.split("|") : [];
    const ratios = new Map<string, number>();

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          ratios.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
        }
        const best = [...ratios.entries()].sort((a, b) => b[1] - a[1])[0];
        // Contrato: si ninguna sección intersecta (hueco entre ellas), se conserva la última activa.
        if (best && best[1] > 0) setActiveId(`#${best[0]}`);
      },
      { rootMargin, threshold: thresholdKey.split(",").map(Number) },
    );

    for (const id of list) {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    }

    return () => observer.disconnect();
  }, [idsKey, rootMargin, thresholdKey]);

  return activeId;
}
