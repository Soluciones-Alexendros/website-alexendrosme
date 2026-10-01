import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/breadcrumb-json-ld";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Política de cookies",
  description:
    "Política de cookies de alexendros.me conforme al artículo 22.2 de la LSSI-CE y la Guía de la AEPD.",
  alternates: { canonical: "/legal/cookies" },
};

export default function CookiesPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[{ name: "Política de cookies", href: `${siteConfig.url}/legal/cookies` }]}
      />
      <h1>Política de cookies</h1>

      <p>
        alexendros.me <strong>no utiliza cookies de análisis, publicidad ni de terceros</strong>. La
        única información que se guarda en tu navegador es la necesaria para recordar tus
        preferencias de visualización. Por ese motivo no se muestra un banner de consentimiento:
        ninguna de las cookies empleadas requiere autorización previa según el artículo 22.2 de la
        LSSI-CE.
      </p>

      <section aria-labelledby="ck-que">
        <h2 id="ck-que">¿Qué es una cookie?</h2>
        <p>
          Una cookie es un pequeño archivo que un sitio web almacena en tu dispositivo para recordar
          información entre visitas. Las cookies que no sean estrictamente necesarias para prestar
          el servicio solicitado requieren consentimiento previo e informado.
        </p>
      </section>

      <section aria-labelledby="ck-inventario">
        <h2 id="ck-inventario">Cookies que utiliza este sitio</h2>
        <table className="legal-table">
          <thead>
            <tr>
              <th scope="col">Nombre</th>
              <th scope="col">Titularidad</th>
              <th scope="col">Tipo</th>
              <th scope="col">Finalidad</th>
              <th scope="col">Duración</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="Nombre">ax-th</td>
              <td data-label="Titularidad">Propia</td>
              <td data-label="Tipo">Técnica necesaria</td>
              <td data-label="Finalidad">
                Recordar el tema visual elegido (claro, oscuro o sistema)
              </td>
              <td data-label="Duración">1 año</td>
            </tr>
            <tr>
              <td data-label="Nombre">ax-rd</td>
              <td data-label="Titularidad">Propia</td>
              <td data-label="Tipo">Técnica necesaria</td>
              <td data-label="Finalidad">Recordar la preferencia de movimiento reducido</td>
              <td data-label="Duración">1 año</td>
            </tr>
          </tbody>
        </table>
        <p>
          Ambas son propias, técnicas y estrictamente necesarias para conservar preferencias que la
          persona usuaria ha elegido expresamente. No identifican ni perfilan al visitante y no se
          comparten con terceros.
        </p>
      </section>

      <section aria-labelledby="ck-almacenamiento">
        <h2 id="ck-almacenamiento">Otro almacenamiento local</h2>
        <p>
          Además de las cookies anteriores, el sitio usa el almacenamiento local del navegador (
          <code>localStorage</code>) con la misma finalidad funcional: preferencia de idioma,
          preferencia de tema y el cierre del aviso informativo. Este almacenamiento no se transmite
          a ningún servidor.
        </p>
        <p>
          El sitio ofrece una versión instalable (PWA) que guarda en caché los archivos necesarios
          para funcionar sin conexión. Esta caché contiene únicamente contenido del propio sitio.
        </p>
      </section>

      <section aria-labelledby="ck-analitica">
        <h2 id="ck-analitica">Analítica sin cookies</h2>
        <p>
          Las estadísticas de visitas se obtienen con Vercel Web Analytics, un sistema que{" "}
          <strong>no instala cookies</strong> ni rastrea a las personas usuarias entre sitios. No se
          emplea Google Analytics, Meta Pixel ni ninguna otra plataforma publicitaria. Puedes
          consultar el detalle del tratamiento en la{" "}
          <a href="/legal/privacidad">Política de privacidad</a>.
        </p>
      </section>

      <section aria-labelledby="ck-gestion">
        <h2 id="ck-gestion">Cómo gestionar las cookies</h2>
        <p>
          Puedes bloquear o eliminar las cookies desde la configuración de tu navegador:{" "}
          <a
            href="https://support.google.com/chrome/answer/95647"
            target="_blank"
            rel="noopener noreferrer"
          >
            Chrome
          </a>
          {" · "}
          <a
            href="https://support.mozilla.org/es/kb/habilitar-y-deshabilitar-cookies-sitios-web-rastrear-preferencias"
            target="_blank"
            rel="noopener noreferrer"
          >
            Firefox
          </a>
          {" · "}
          <a
            href="https://support.apple.com/es-es/guide/safari/sfri11471/mac"
            target="_blank"
            rel="noopener noreferrer"
          >
            Safari
          </a>
          . Si las eliminas, el sitio seguirá funcionando, pero perderá tus preferencias de tema e
          idioma.
        </p>
      </section>

      <section aria-labelledby="ck-derechos">
        <h2 id="ck-derechos">Tus derechos</h2>
        <p>
          Puedes ejercer tus derechos de acceso, rectificación, supresión, limitación, oposición y
          portabilidad escribiendo a{" "}
          <a href="mailto:contacto@alexendros.me">contacto@alexendros.me</a>. Tienes el detalle
          completo en la <a href="/legal/privacidad">Política de privacidad</a> y puedes reclamar
          ante la{" "}
          <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">
            Agencia Española de Protección de Datos
          </a>
          .
        </p>
      </section>

      <section aria-labelledby="ck-formal">
        <h2 id="ck-formal">Marco normativo</h2>
        <p>
          Esta política se elabora conforme al artículo 22.2 de la Ley 34/2002 (LSSI-CE), al
          Reglamento (UE) 2016/679 (RGPD) y a la Guía sobre el uso de las cookies publicada por la
          AEPD en mayo de 2024.
        </p>
        <p>
          <em>Última actualización: septiembre de 2026.</em>
        </p>
      </section>
    </>
  );
}
