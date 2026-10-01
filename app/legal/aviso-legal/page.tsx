import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/breadcrumb-json-ld";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Aviso legal",
  description: "Aviso legal de alexendros.me conforme al artículo 10 de la LSSI-CE.",
  alternates: { canonical: "/legal/aviso-legal" },
};

export default function AvisoLegalPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[{ name: "Aviso legal", href: `${siteConfig.url}/legal/aviso-legal` }]}
      />
      <h1>Aviso legal</h1>

      <p>
        Este documento identifica al titular del sitio, describe su actividad y fija las condiciones
        de uso. Se publica en cumplimiento del artículo 10 de la Ley 34/2002, de 11 de julio, de
        Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI-CE).
      </p>

      <section aria-labelledby="al-titular">
        <h2 id="al-titular">Identificación del titular</h2>
        <table className="legal-table">
          <thead>
            <tr>
              <th scope="col">Campo</th>
              <th scope="col">Valor</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="Campo">Titular</td>
              <td data-label="Valor">Alejandro Domingo Agustí</td>
            </tr>
            <tr>
              <td data-label="Campo">NIF</td>
              <td data-label="Valor">21002968N</td>
            </tr>
            <tr>
              <td data-label="Campo">Domicilio</td>
              <td data-label="Valor">C/ Puebla de Farnals 51-18, Valencia, España</td>
            </tr>
            <tr>
              <td data-label="Campo">Correo electrónico</td>
              <td data-label="Valor">
                <a href="mailto:contacto@alexendros.me">contacto@alexendros.me</a>
              </td>
            </tr>
            <tr>
              <td data-label="Campo">Dominio</td>
              <td data-label="Valor">alexendros.me</td>
            </tr>
            <tr>
              <td data-label="Campo">Actividad</td>
              <td data-label="Valor">Desarrollo de software y creación de contenido digital</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section aria-labelledby="al-actividad">
        <h2 id="al-actividad">Actividad del sitio</h2>
        <p>
          alexendros.me es un sitio personal de carácter informativo y editorial. Publica artículos
          de opinión y reflexión. No vende productos ni servicios a través del sitio, no aloja
          formularios de recogida de datos y no incorpora publicidad ni enlaces de afiliación.
        </p>
      </section>

      <section aria-labelledby="al-propiedad">
        <h2 id="al-propiedad">Propiedad intelectual e industrial</h2>
        <p>
          Los contenidos editoriales originales (textos, imágenes propias y diseño) se publican bajo
          la licencia{" "}
          <a
            href="https://creativecommons.org/licenses/by-nc-sa/4.0/deed.es"
            target="_blank"
            rel="noopener noreferrer license"
          >
            Creative Commons Atribución-NoComercial-CompartirIgual 4.0 Internacional (CC BY-NC-SA
            4.0)
          </a>
          . Se permite copiar, distribuir y transformar la obra con atribución, sin fines
          comerciales y manteniendo la misma licencia en las obras derivadas.
        </p>
        <p>
          El código fuente del sitio se publica bajo la licencia{" "}
          <a href="https://opensource.org/license/mit" target="_blank" rel="noopener noreferrer">
            MIT
          </a>
          . El detalle de ambas licencias está en la{" "}
          <a href="/legal/licencia">página de licencia</a>.
        </p>
        <p>
          Quedan excluidos de estas licencias el nombre, el logotipo y los signos distintivos del
          titular, así como cualquier contenido de terceros (tipografías, librerías de software y
          recursos gráficos), que se rige por sus propias licencias.
        </p>
      </section>

      <section aria-labelledby="al-enlaces">
        <h2 id="al-enlaces">Enlaces externos</h2>
        <p>
          El sitio puede incluir enlaces a páginas de terceros. El titular no controla esos
          contenidos ni responde de ellos; cada sitio externo se rige por sus propias condiciones y
          políticas.
        </p>
      </section>

      <section aria-labelledby="al-responsabilidad">
        <h2 id="al-responsabilidad">Responsabilidad</h2>
        <p>
          El titular adopta medidas razonables para que la información publicada sea correcta y el
          sitio permanezca disponible, pero no garantiza la ausencia de errores, interrupciones o
          incidencias ajenas a su control. El uso del sitio y de sus contenidos es responsabilidad
          de quien lo realiza.
        </p>
      </section>

      <section aria-labelledby="al-legislacion">
        <h2 id="al-legislacion">Legislación aplicable</h2>
        <p>
          Este Aviso Legal se rige por la legislación española. Para cualquier controversia derivada
          del uso del sitio serán competentes los juzgados y tribunales que correspondan conforme a
          la normativa aplicable.
        </p>
        <p>
          <em>Última actualización: septiembre de 2026.</em>
        </p>
      </section>
    </>
  );
}
