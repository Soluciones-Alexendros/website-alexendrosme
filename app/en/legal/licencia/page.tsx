import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/breadcrumb-json-ld";
import { siteConfig } from "@/lib/site";
import { hreflangAlternates } from "@/lib/seo/hreflang";
import { rootOgImageUrl } from "@/lib/seo/og";

const alts = hreflangAlternates("/legal/licencia");

export const metadata: Metadata = {
  title: "Licence",
  description:
    "Licences for the content and source code of alexendros.me: CC BY-NC-SA 4.0 and MIT.",
  alternates: { canonical: "/en/legal/licencia", languages: alts.languages },
  openGraph: {
    title: "Licence · Alexendros",
    description:
      "Licences for the content and source code of alexendros.me: CC BY-NC-SA 4.0 and MIT.",
    type: "website",
    url: `${siteConfig.url}/en/legal/licencia`,
    images: [rootOgImageUrl()],
    locale: "en_US",
    siteName: siteConfig.name,
  },
  twitter: { card: "summary_large_image", images: [rootOgImageUrl()] },
};

export default function LicencePage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[{ name: "Licence", href: `${siteConfig.url}/en/legal/licencia` }]}
      />
      <h1>Licence</h1>

      <p>
        Two kinds of work coexist on this site with different licences: the editorial content and
        the source code. Each has its own terms.
      </p>

      <section aria-labelledby="lic-contenido">
        <h2 id="lic-contenido">Editorial content — CC BY-NC-SA 4.0</h2>
        <p>
          Original articles, texts and illustrations are published under the{" "}
          <a
            href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
            target="_blank"
            rel="noopener noreferrer license"
          >
            Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International
          </a>{" "}
          licence.
        </p>
        <ul>
          <li>
            <strong>Attribution</strong> — credit Alejandro Domingo Agustí (Alexendros), link to the
            licence and indicate whether you made changes.
          </li>
          <li>
            <strong>NonCommercial</strong> — you may not use the material for commercial purposes.
          </li>
          <li>
            <strong>ShareAlike</strong> — if you adapt the material, you must distribute your
            contribution under the same licence.
          </li>
        </ul>
        <p>
          Full legal text:{" "}
          <a
            href="https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode.en"
            target="_blank"
            rel="noopener noreferrer"
          >
            creativecommons.org/licenses/by-nc-sa/4.0/legalcode.en
          </a>
          .
        </p>
      </section>

      <section aria-labelledby="lic-codigo">
        <h2 id="lic-codigo">Source code — MIT</h2>
        <p>
          The source code of this site is published under the{" "}
          <a href="https://opensource.org/license/mit" target="_blank" rel="noopener noreferrer">
            MIT
          </a>{" "}
          licence, which allows using, copying, modifying and distributing the software, including
          for commercial purposes, provided the copyright and licence notice is retained.
        </p>
        <p>
          Licence text:{" "}
          <a href="https://opensource.org/license/mit" target="_blank" rel="noopener noreferrer">
            opensource.org/license/mit
          </a>
          .
        </p>
      </section>

      <section aria-labelledby="lic-exclusiones">
        <h2 id="lic-exclusiones">What is not covered</h2>
        <p>
          Neither licence covers the owner's name, logo or distinctive signs. Nor do they cover
          third-party materials — fonts, software libraries and graphic resources — which are
          governed by their own licences.
        </p>
      </section>

      <section aria-labelledby="lic-contacto">
        <h2 id="lic-contacto">Contact</h2>
        <p>
          If you have any questions about the use of these materials, write to me at{" "}
          <a href="mailto:contacto@alexendros.me">contacto@alexendros.me</a>.
        </p>
        <p>
          <em>Last updated: September 2026.</em>
        </p>
      </section>
    </>
  );
}
