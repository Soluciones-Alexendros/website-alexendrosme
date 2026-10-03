"use client";

import Link from "next/link";
import { ArrowDown, ArrowUpRight, Eye, KeyRound, Mail, Network } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ContactFab } from "@/components/contact-fab";
import { CopyEmail } from "@/components/copy-email";
import { useI18n } from "@/lib/i18n";
import { useLocalePrefix, withLocalePrefix } from "@/lib/i18n/locale-path";
import { siteConfig } from "@/lib/site";
import { PRINCIPLE_LINKS } from "@/lib/principles";
import type { getContentCollection } from "@/lib/content/loader";
import type { CollectionType } from "@/lib/content/types";

type ArticleSummary = Omit<Awaited<ReturnType<typeof getContentCollection>>[number], "content"> & {
  type: CollectionType;
};

interface HomeContentProps {
  latestArticles: ArticleSummary[];
}

function formatDate(dateStr: string, locale: string) {
  return new Date(dateStr).toLocaleDateString(locale === "en" ? "en-US" : "es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const PRINCIPLE_ICONS = { atencion: Eye, soberania: KeyRound, protocolos: Network } as const;

/** Publica la posición del puntero en --mx/--my para el foco de luz de la tarjeta (CSS puro). */
function trackPointer(e: React.PointerEvent<HTMLElement>) {
  const el = e.currentTarget;
  const rect = el.getBoundingClientRect();
  el.style.setProperty("--mx", `${e.clientX - rect.left}px`);
  el.style.setProperty("--my", `${e.clientY - rect.top}px`);
}

export function HomeContent({ latestArticles }: HomeContentProps) {
  const { t, locale } = useI18n();
  const prefix = useLocalePrefix();

  // «Alexendros.» se resalta en latón; el resto de la firma queda en tinta. Mismo texto accesible.
  const signature = t("hero.signature");
  const splitAt = signature.indexOf(". ");
  const heroName = splitAt > 0 ? signature.slice(0, splitAt + 1) : null;
  const heroRest = splitAt > 0 ? signature.slice(splitAt + 2) : signature;

  return (
    <>
      <section className="site-shell hero-section">
        <div className="cluster-center">
          <p className="hero-eyebrow">
            <span className="hero-eyebrow__dot" aria-hidden="true" />
            {t("hero.eyebrow")}
          </p>
        </div>
        <h1 className="hero-signature hero-animate display">
          {heroName ? (
            <>
              <span className="hero-name">{heroName}</span> {heroRest}
            </>
          ) : (
            signature
          )}
        </h1>
        <p
          className="prose-lead"
          dangerouslySetInnerHTML={{
            __html: t("hero.lead").replace(
              "{link}",
              `<a href="https://alexendros.dev" target="_blank" rel="noopener noreferrer" class="brand-link">${t("hero.leadLink")}</a>`,
            ),
          }}
        />
        <p className="hero-tagline">{t("hero.tagline")}</p>
        <div className="cluster">
          <Button asChild>
            <a href={`mailto:${siteConfig.contact.email}`}>
              <Mail
                data-icon="inline-start"
                className="btn-arrow btn-arrow--mail"
                aria-hidden="true"
              />
              {t("hero.ctaContact")}
            </a>
          </Button>
          <Button variant="outline" asChild>
            <a href="#biografia">
              {t("hero.ctaAbout")}
              <ArrowDown
                data-icon="inline-end"
                className="btn-arrow btn-arrow--down"
                aria-hidden="true"
              />
            </a>
          </Button>
        </div>
      </section>

      <hr className="site-shell shrink-0 bg-border h-px w-full border-0" />

      <section
        id="biografia"
        className="site-shell section section-below-fold scroll-section"
        aria-labelledby="h2-biografia"
      >
        <div className="content-container stack-lg">
          <h2 id="h2-biografia" className="headline reveal">
            {t("sections.biografia.title")}
          </h2>
          <div className="stack-md prose reveal">
            <p>{t("sections.biografia.p1")}</p>
            <p
              dangerouslySetInnerHTML={{
                __html: t("sections.biografia.p2").replace(
                  "{link}",
                  `<a href="https://alexendros.dev" target="_blank" rel="noopener noreferrer" class="brand-link">${t("sections.biografia.p2Link")}</a>`,
                ),
              }}
            />
            <p>{t("sections.biografia.p3")}</p>
          </div>
        </div>
      </section>

      <hr className="site-shell shrink-0 bg-border h-px w-full border-0" />

      <section
        id="principios"
        className="site-shell section section-below-fold scroll-section"
        aria-labelledby="h2-principios"
      >
        <div className="content-container stack-lg">
          <div className="section-head reveal">
            <h2 id="h2-principios" className="headline">
              {t("sections.principios.title")}
            </h2>
            <p className="section-desc">{t("sections.principios.desc")}</p>
          </div>
          <div className="principles-grid">
            {PRINCIPLE_LINKS.map(({ key, slug }, i) => {
              const Icon = PRINCIPLE_ICONS[key];
              return (
                <Link
                  key={key}
                  href={withLocalePrefix(prefix, `/opinion/${slug}`)}
                  className="spot-card reveal"
                  onPointerMove={trackPointer}
                >
                  <span className="spot-card__meta">0{i + 1}</span>
                  <Icon className="spot-card__icon" aria-hidden="true" />
                  <span className="spot-card__title">{t(`sections.principios.${key}.title`)}</span>
                  <span className="spot-card__body">{t(`sections.principios.${key}.body`)}</span>
                  <span className="spot-card__cta">
                    {t(`sections.principios.${key}.cta`)}
                    <ArrowUpRight size={14} aria-hidden="true" />
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <hr className="site-shell shrink-0 bg-border h-px w-full border-0" />

      <section
        id="publicaciones"
        className="site-shell section section-below-fold scroll-section"
        aria-labelledby="h2-publicaciones"
      >
        <div className="content-container stack-lg">
          <div className="section-head reveal">
            <h2 id="h2-publicaciones" className="headline">
              {t("sections.publicaciones.title")}
            </h2>
            <p
              className="section-desc"
              dangerouslySetInnerHTML={{
                __html: t("sections.publicaciones.desc").replace(
                  "{opinionLink}",
                  `<a href="${withLocalePrefix(prefix, "/opinion")}" class="brand-link">${t("sections.publicaciones.opinionLabel")}</a>`,
                ),
              }}
            />
          </div>

          {latestArticles.length === 0 ? (
            <p className="empty-state">{t("sections.publicaciones.empty")}</p>
          ) : (
            <div className="stack-lg">
              {latestArticles.map((article) => (
                <article key={`${article.type}-${article.slug}`} className="reveal">
                  <Link
                    href={withLocalePrefix(prefix, `/${article.type}/${article.slug}`)}
                    className="article-item"
                    onPointerMove={trackPointer}
                  >
                    <time dateTime={article.frontmatter.date} className="ds-caption">
                      {formatDate(article.frontmatter.date, locale)}
                    </time>
                    <h3 className="article-item__title">{article.frontmatter.title}</h3>
                    {article.frontmatter.description && (
                      <p className="article-item__desc">{article.frontmatter.description}</p>
                    )}
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="site-shell section closing" aria-labelledby="h2-contacto">
        <div className="content-container stack-md closing__inner reveal">
          <h2 id="h2-contacto" className="headline">
            {t("sections.contacto.title")}
          </h2>
          <p className="section-desc">{t("sections.contacto.desc")}</p>
          <div className="cluster" role="group" aria-label={t("contact.fabLabel")}>
            <ContactFab />
            <CopyEmail />
          </div>
        </div>
      </section>
    </>
  );
}
