import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/breadcrumb-json-ld";
import { siteConfig } from "@/lib/site";
import { hreflangAlternates } from "@/lib/seo/hreflang";
import { rootOgImageUrl } from "@/lib/seo/og";

const alts = hreflangAlternates("/legal/aviso-legal");

export const metadata: Metadata = {
  title: "Legal notice",
  description: "Legal notice for alexendros.me under Article 10 of Spain's LSSI-CE.",
  alternates: { canonical: "/en/legal/aviso-legal", languages: alts.languages },
  openGraph: {
    title: "Legal notice · Alexendros",
    description: "Legal notice for alexendros.me under Article 10 of Spain's LSSI-CE.",
    type: "website",
    url: `${siteConfig.url}/en/legal/aviso-legal`,
    images: [rootOgImageUrl()],
    locale: "en_US",
    siteName: siteConfig.name,
  },
  twitter: { card: "summary_large_image", images: [rootOgImageUrl()] },
};

export default function LegalNoticePage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[{ name: "Legal notice", href: `${siteConfig.url}/en/legal/aviso-legal` }]}
      />
      <h1>Legal notice</h1>

      <p>
        This document identifies the owner of the site, describes its activity and sets the
        conditions of use. It is published in compliance with Article 10 of Spanish Law 34/2002 of
        11 July on Information Society Services and Electronic Commerce (LSSI-CE).
      </p>

      <section aria-labelledby="al-titular">
        <h2 id="al-titular">Owner identification</h2>
        <table className="legal-table">
          <thead>
            <tr>
              <th scope="col">Field</th>
              <th scope="col">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="Field">Owner</td>
              <td data-label="Value">Alejandro Domingo Agustí</td>
            </tr>
            <tr>
              <td data-label="Field">Tax ID (NIF)</td>
              <td data-label="Value">21002968N</td>
            </tr>
            <tr>
              <td data-label="Field">Address</td>
              <td data-label="Value">C/ Puebla de Farnals 51-18, Valencia, Spain</td>
            </tr>
            <tr>
              <td data-label="Field">Email</td>
              <td data-label="Value">
                <a href="mailto:contacto@alexendros.me">contacto@alexendros.me</a>
              </td>
            </tr>
            <tr>
              <td data-label="Field">Domain</td>
              <td data-label="Value">alexendros.me</td>
            </tr>
            <tr>
              <td data-label="Field">Activity</td>
              <td data-label="Value">Software development and digital content creation</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section aria-labelledby="al-actividad">
        <h2 id="al-actividad">Activity of the site</h2>
        <p>
          alexendros.me is a personal site of an informative and editorial nature. It publishes
          opinion and reflection articles. It does not sell products or services through the site,
          does not host data-collection forms and contains no advertising or affiliate links.
        </p>
      </section>

      <section aria-labelledby="al-propiedad">
        <h2 id="al-propiedad">Intellectual and industrial property</h2>
        <p>
          Original editorial content (texts, own images and design) is published under the{" "}
          <a
            href="https://creativecommons.org/licenses/by-nc-sa/4.0/"
            target="_blank"
            rel="noopener noreferrer license"
          >
            Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA
            4.0)
          </a>{" "}
          licence. You may copy, distribute and adapt the work with attribution, for non-commercial
          purposes and keeping the same licence on derivative works.
        </p>
        <p>
          The source code of the site is published under the{" "}
          <a href="https://opensource.org/license/mit" target="_blank" rel="noopener noreferrer">
            MIT
          </a>{" "}
          licence. The details of both licences are on the{" "}
          <a href="/en/legal/licencia">licence page</a>.
        </p>
        <p>
          The owner's name, logo and distinctive signs are excluded from these licences, as is any
          third-party material (fonts, software libraries and graphic resources), which is governed
          by its own licences.
        </p>
      </section>

      <section aria-labelledby="al-enlaces">
        <h2 id="al-enlaces">External links</h2>
        <p>
          The site may include links to third-party pages. The owner does not control those contents
          and is not responsible for them; each external site is governed by its own terms and
          policies.
        </p>
      </section>

      <section aria-labelledby="al-responsabilidad">
        <h2 id="al-responsabilidad">Liability</h2>
        <p>
          The owner takes reasonable measures to keep the published information accurate and the
          site available, but does not guarantee the absence of errors, interruptions or incidents
          beyond its control. Use of the site and its contents is the responsibility of the user.
        </p>
      </section>

      <section aria-labelledby="al-legislacion">
        <h2 id="al-legislacion">Applicable law</h2>
        <p>
          This Legal notice is governed by Spanish law. Any dispute arising from the use of the site
          shall be subject to the courts and tribunals competent under applicable regulations.
        </p>
        <p>
          <em>Last updated: September 2026.</em>
        </p>
      </section>
    </>
  );
}
