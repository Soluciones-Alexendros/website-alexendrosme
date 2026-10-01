import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/breadcrumb-json-ld";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Licencia",
  description:
    "Licencias de los contenidos y del código fuente de alexendros.me: CC BY-NC-SA 4.0 y MIT.",
  alternates: { canonical: "/legal/licencia" },
};

export default function LicenciaPage() {
  return (
    <>
      <BreadcrumbJsonLd items={[{ name: "Licencia", href: `${siteConfig.url}/legal/licencia` }]} />
      <h1>Licencia</h1>

      <p>
        En este sitio conviven dos tipos de obra con licencias distintas: los contenidos editoriales
        y el código fuente. Cada una tiene sus propias condiciones.
      </p>

      <section aria-labelledby="lic-contenido">
        <h2 id="lic-contenido">Contenidos editoriales — CC BY-NC-SA 4.0</h2>
        <p>
          Los artículos, textos e ilustraciones originales se publican bajo la licencia{" "}
          <a
            href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es"
            target="_blank"
            rel="noopener noreferrer license"
          >
            Creative Commons Atribución-NoComercial-CompartirIgual 4.0 Internacional
          </a>
          .
        </p>
        <ul>
          <li>
            <strong>Atribución</strong> — cita a Alejandro Domingo Agustí (Alexendros), enlaza a la
            licencia e indica si has hecho cambios.
          </li>
          <li>
            <strong>NoComercial</strong> — no puedes usar el material con fines comerciales.
          </li>
          <li>
            <strong>CompartirIgual</strong> — si transformas el material, debes distribuir tu
            contribución bajo la misma licencia.
          </li>
        </ul>
        <p>
          Texto legal completo:{" "}
          <a
            href="https://creativecommons.org/licenses/by-nc-sa/4.0/legalcode.es"
            target="_blank"
            rel="noopener noreferrer"
          >
            creativecommons.org/licenses/by-nc-sa/4.0/legalcode.es
          </a>
          .
        </p>
      </section>

      <section aria-labelledby="lic-codigo">
        <h2 id="lic-codigo">Código fuente — MIT</h2>
        <p>
          El código fuente de este sitio se publica bajo la licencia{" "}
          <a href="https://opensource.org/license/mit" target="_blank" rel="noopener noreferrer">
            MIT
          </a>
          , que permite usar, copiar, modificar y distribuir el software, incluso con fines
          comerciales, siempre que se conserve el aviso de copyright y de licencia.
        </p>
        <p>
          Texto de la licencia:{" "}
          <a href="https://opensource.org/license/mit" target="_blank" rel="noopener noreferrer">
            opensource.org/license/mit
          </a>
          .
        </p>
      </section>

      <section aria-labelledby="lic-exclusiones">
        <h2 id="lic-exclusiones">Qué queda fuera</h2>
        <p>
          Ninguna de las dos licencias cubre el nombre, el logotipo ni los signos distintivos del
          titular. Tampoco cubren los materiales de terceros —tipografías, librerías de software y
          recursos gráficos—, que se rigen por sus propias licencias.
        </p>
      </section>

      <section aria-labelledby="lic-contacto">
        <h2 id="lic-contacto">Contacto</h2>
        <p>
          Si tienes dudas sobre el uso de estos materiales, escríbeme a{" "}
          <a href="mailto:contacto@alexendros.me">contacto@alexendros.me</a>.
        </p>
        <p>
          <em>Última actualización: septiembre de 2026.</em>
        </p>
      </section>
    </>
  );
}
