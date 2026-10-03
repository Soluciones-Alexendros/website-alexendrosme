"use client";

import { ArrowUpRight } from "lucide-react";
import { LocaleLink } from "@/components/locale-link";
import { useI18n } from "@/lib/i18n";

export interface RelatedItem {
  slug: string;
  title: string;
  description?: string;
  readingTime: number;
}

function trackPointer(e: React.PointerEvent<HTMLElement>) {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
  el.style.setProperty("--my", `${e.clientY - rect.top}px`);
}

/** «Sigue leyendo»: cierra el artículo con dos piezas afines (por etiquetas, luego recientes). */
export function RelatedArticles({ items }: { items: RelatedItem[] }) {
  const { t } = useI18n();
  if (items.length === 0) return null;

  return (
    <aside className="related" aria-labelledby="related-title">
      <h2 id="related-title" className="related__title">
        {t("article.related")}
      </h2>
      <div className="related__grid">
        {items.map((item) => (
          <LocaleLink
            key={item.slug}
            href={`/opinion/${item.slug}`}
            className="spot-card"
            onPointerMove={trackPointer}
          >
            <span className="spot-card__meta">
              {item.readingTime} {t("article.minutesShort")}
            </span>
            <span className="spot-card__title">{item.title}</span>
            {item.description ? <span className="spot-card__body">{item.description}</span> : null}
            <span className="spot-card__cta" aria-hidden="true">
              <ArrowUpRight size={16} />
            </span>
          </LocaleLink>
        ))}
      </div>
    </aside>
  );
}
