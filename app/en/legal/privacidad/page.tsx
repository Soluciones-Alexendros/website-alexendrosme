import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/breadcrumb-json-ld";
import { siteConfig } from "@/lib/site";
import { hreflangAlternates } from "@/lib/seo/hreflang";
import { rootOgImageUrl } from "@/lib/seo/og";

const alts = hreflangAlternates("/legal/privacidad");

export const metadata: Metadata = {
  title: "Privacy policy",
  description: "Privacy policy for alexendros.me under the GDPR and Spain's LOPDGDD.",
  alternates: { canonical: "/en/legal/privacidad", languages: alts.languages },
  openGraph: {
    title: "Privacy policy · Alexendros",
    description: "Privacy policy for alexendros.me under the GDPR and Spain's LOPDGDD.",
    type: "website",
    url: `${siteConfig.url}/en/legal/privacidad`,
    images: [rootOgImageUrl()],
    locale: "en_US",
    siteName: siteConfig.name,
  },
  twitter: { card: "summary_large_image", images: [rootOgImageUrl()] },
};

export default function PrivacyPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[{ name: "Privacy policy", href: `${siteConfig.url}/en/legal/privacidad` }]}
      />
      <h1>Privacy policy</h1>

      <p>
        This policy explains what personal data is processed when you visit alexendros.me, for what
        purpose and on what legal basis, in accordance with Regulation (EU) 2016/679 (GDPR) and
        Spanish Organic Law 3/2018 (LOPDGDD).
      </p>

      <section aria-labelledby="priv-responsable">
        <h2 id="priv-responsable">Data controller</h2>
        <p>
          Alejandro Domingo Agustí, NIF 21002968N, C/ Puebla de Farnals 51-18, Valencia, Spain.{" "}
          <a href="mailto:contacto@alexendros.me">contacto@alexendros.me</a>.
        </p>
      </section>

      <section aria-labelledby="priv-datos">
        <h2 id="priv-datos">What data we process and why</h2>
        <table className="legal-table">
          <thead>
            <tr>
              <th scope="col">Source</th>
              <th scope="col">Data</th>
              <th scope="col">Purpose</th>
              <th scope="col">Legal basis</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="Source">Email you send</td>
              <td data-label="Data">
                Email address, message content and, where applicable, attachments
              </td>
              <td data-label="Purpose">Handle and reply to your enquiry</td>
              <td data-label="Legal basis">Consent (Art. 6.1.a GDPR)</td>
            </tr>
            <tr>
              <td data-label="Source">Deployment and hosting provider (Vercel)</td>
              <td data-label="Data">IP address, user agent, requested URL and timestamp</td>
              <td data-label="Purpose">Serve the site, keep it secure and prevent abuse</td>
              <td data-label="Legal basis">Legitimate interest (Art. 6.1.f GDPR)</td>
            </tr>
            <tr>
              <td data-label="Source">Web analytics (Vercel Web Analytics)</td>
              <td data-label="Data">
                Page URL, referrer, approximate country, operating system, browser and device type
              </td>
              <td data-label="Purpose">Measure aggregate use of the site</td>
              <td data-label="Legal basis">Legitimate interest (Art. 6.1.f GDPR)</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section aria-labelledby="priv-analitica">
        <h2 id="priv-analitica">About web analytics</h2>
        <p>
          The site uses Vercel Web Analytics to obtain aggregated visit statistics. This system does
          not set third-party cookies or track users across sites: it identifies each visit with an
          anonymous derived value, not with data that could identify you directly. No profiles are
          created, no advertising is shown, and the data is neither sold nor shared for commercial
          purposes.
        </p>
      </section>

      <section aria-labelledby="priv-conservacion">
        <h2 id="priv-conservacion">How long we keep data</h2>
        <p>
          Emails you send are kept for as long as necessary to handle the conversation and, where
          applicable, for the statutory limitation periods of legal liabilities. Technical hosting
          and analytics information is kept according to the retention periods of the respective
          providers.
        </p>
      </section>

      <section aria-labelledby="priv-destinatarios">
        <h2 id="priv-destinatarios">Recipients and data processors</h2>
        <p>
          We do not share data with third parties for commercial purposes. The following providers
          access technical data as data processors, under contracts compliant with the GDPR:
        </p>
        <ul>
          <li>
            <strong>Vercel Inc.</strong> — deployment and hosting of the site, and the web analytics
            service.
          </li>
          <li>
            <strong>Hostinger</strong> — domain registration and DNS service.
          </li>
          <li>
            <strong>Proton AG (Proton Mail)</strong> — email service based in Switzerland, with
            end-to-end encryption between Proton users.
          </li>
        </ul>
      </section>

      <section aria-labelledby="priv-transferencias">
        <h2 id="priv-transferencias">International transfers</h2>
        <p>
          Vercel Inc. is established in the United States. Data transfers arising from its service
          rely on the standard contractual clauses approved by the European Commission and on the
          safeguards provided in its data processing agreement. Proton AG is based in Switzerland, a
          country with an adequacy decision from the European Commission.
        </p>
      </section>

      <section aria-labelledby="priv-derechos">
        <h2 id="priv-derechos">Your rights</h2>
        <p>You may exercise the following rights:</p>
        <ul>
          <li>
            <strong>Access</strong> — know what personal data we process about you.
          </li>
          <li>
            <strong>Rectification</strong> — correct inaccurate or incomplete data.
          </li>
          <li>
            <strong>Erasure</strong> — request the deletion of your data.
          </li>
          <li>
            <strong>Restriction</strong> — restrict processing in certain circumstances.
          </li>
          <li>
            <strong>Objection</strong> — object to processing based on legitimate interest.
          </li>
          <li>
            <strong>Portability</strong> — receive your data in a structured, commonly used format.
          </li>
          <li>
            <strong>Not to be subject to automated individual decisions</strong> — this site does
            not make such decisions.
          </li>
        </ul>
        <p>
          You can exercise any of them by writing to{" "}
          <a href="mailto:contacto@alexendros.me">contacto@alexendros.me</a>. We will reply within
          one month, extendable by a further two months where the request is complex. You may also
          lodge a complaint with the{" "}
          <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">
            Spanish Data Protection Agency (AEPD)
          </a>
          , whose electronic office allows complaints to be filed free of charge.
        </p>
      </section>

      <section aria-labelledby="priv-seguridad">
        <h2 id="priv-seguridad">Security</h2>
        <p>
          We apply technical and organisational measures appropriate to the risk to protect personal
          data (Art. 32 GDPR). If a security breach likely to result in a risk to people's rights
          and freedoms occurred, it would be notified to the competent supervisory authority under
          Articles 33 and 34 GDPR.
        </p>
        <p>
          <em>Last updated: September 2026.</em>
        </p>
      </section>
    </>
  );
}
