import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/breadcrumb-json-ld";
import { siteConfig } from "@/lib/site";
import { hreflangAlternates } from "@/lib/seo/hreflang";
import { rootOgImageUrl } from "@/lib/seo/og";

const alts = hreflangAlternates("/legal/cookies");

export const metadata: Metadata = {
  title: "Cookie policy",
  description:
    "Cookie policy for alexendros.me under Article 22.2 of Spain's LSSI-CE and the AEPD guide.",
  alternates: { canonical: "/en/legal/cookies", languages: alts.languages },
  openGraph: {
    title: "Cookie policy · Alexendros",
    description:
      "Cookie policy for alexendros.me under Article 22.2 of Spain's LSSI-CE and the AEPD guide.",
    type: "website",
    url: `${siteConfig.url}/en/legal/cookies`,
    images: [rootOgImageUrl()],
    locale: "en_US",
    siteName: siteConfig.name,
  },
  twitter: { card: "summary_large_image", images: [rootOgImageUrl()] },
};

export default function CookiePolicyPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[{ name: "Cookie policy", href: `${siteConfig.url}/en/legal/cookies` }]}
      />
      <h1>Cookie policy</h1>

      <p>
        alexendros.me <strong>uses no analytics, advertising or third-party cookies</strong>. The
        only information stored in your browser is what is needed to remember your display
        preferences. For that reason no consent banner is shown: none of the cookies used requires
        prior authorisation under Article 22.2 of the LSSI-CE.
      </p>

      <section aria-labelledby="ck-que">
        <h2 id="ck-que">What is a cookie?</h2>
        <p>
          A cookie is a small file that a website stores on your device to remember information
          between visits. Cookies that are not strictly necessary to provide the requested service
          require prior, informed consent.
        </p>
      </section>

      <section aria-labelledby="ck-inventario">
        <h2 id="ck-inventario">Cookies used by this site</h2>
        <table className="legal-table">
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Ownership</th>
              <th scope="col">Type</th>
              <th scope="col">Purpose</th>
              <th scope="col">Duration</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="Name">ax-th</td>
              <td data-label="Ownership">First-party</td>
              <td data-label="Type">Strictly necessary</td>
              <td data-label="Purpose">Remember the chosen visual theme (light, dark or system)</td>
              <td data-label="Duration">1 year</td>
            </tr>
            <tr>
              <td data-label="Name">ax-rd</td>
              <td data-label="Ownership">First-party</td>
              <td data-label="Type">Strictly necessary</td>
              <td data-label="Purpose">Remember the reduced-motion preference</td>
              <td data-label="Duration">1 year</td>
            </tr>
          </tbody>
        </table>
        <p>
          Both are first-party, technical and strictly necessary to keep preferences that the user
          has expressly chosen. They do not identify or profile the visitor and are not shared with
          third parties.
        </p>
      </section>

      <section aria-labelledby="ck-almacenamiento">
        <h2 id="ck-almacenamiento">Other local storage</h2>
        <p>
          In addition to the cookies above, the site uses browser local storage (
          <code>localStorage</code>) for the same functional purpose: language preference, theme
          preference and dismissal of the informational notice. This storage is not transmitted to
          any server.
        </p>
        <p>
          The site offers an installable version (PWA) that caches the files needed to work offline.
          This cache contains only the site's own content.
        </p>
      </section>

      <section aria-labelledby="ck-analitica">
        <h2 id="ck-analitica">Analytics without cookies</h2>
        <p>
          Visit statistics are obtained with Vercel Web Analytics, a system that{" "}
          <strong>sets no cookies</strong> and does not track users across sites. Neither Google
          Analytics nor Meta Pixel nor any other advertising platform is used. See the{" "}
          <a href="/en/legal/privacidad">Privacy policy</a> for details of the processing.
        </p>
      </section>

      <section aria-labelledby="ck-gestion">
        <h2 id="ck-gestion">How to manage cookies</h2>
        <p>
          You can block or delete cookies from your browser settings:{" "}
          <a
            href="https://support.google.com/chrome/answer/95647"
            target="_blank"
            rel="noopener noreferrer"
          >
            Chrome
          </a>
          {" · "}
          <a
            href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop"
            target="_blank"
            rel="noopener noreferrer"
          >
            Firefox
          </a>
          {" · "}
          <a
            href="https://support.apple.com/guide/safari/sfri11471/mac"
            target="_blank"
            rel="noopener noreferrer"
          >
            Safari
          </a>
          . If you delete them, the site will keep working, but your theme and language preferences
          will be lost.
        </p>
      </section>

      <section aria-labelledby="ck-derechos">
        <h2 id="ck-derechos">Your rights</h2>
        <p>
          You may exercise your rights of access, rectification, erasure, restriction, objection and
          portability by writing to{" "}
          <a href="mailto:contacto@alexendros.me">contacto@alexendros.me</a>. Full details are in
          the <a href="/en/legal/privacidad">Privacy policy</a>, and you may lodge a complaint with
          the{" "}
          <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">
            Spanish Data Protection Agency
          </a>
          .
        </p>
      </section>

      <section aria-labelledby="ck-formal">
        <h2 id="ck-formal">Legal framework</h2>
        <p>
          This policy is drawn up under Article 22.2 of Law 34/2002 (LSSI-CE), Regulation (EU)
          2016/679 (GDPR) and the guide on the use of cookies published by the AEPD in May 2024.
        </p>
        <p>
          <em>Last updated: September 2026.</em>
        </p>
      </section>
    </>
  );
}
