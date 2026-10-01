import type { Metadata } from "next";
import { BreadcrumbJsonLd } from "@/components/breadcrumb-json-ld";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = {
  title: "Política de privacidad",
  description: "Política de privacidad de alexendros.me conforme al RGPD y la LOPDGDD.",
  alternates: { canonical: "/legal/privacidad" },
};

export default function PrivacidadPage() {
  return (
    <>
      <BreadcrumbJsonLd
        items={[{ name: "Política de privacidad", href: `${siteConfig.url}/legal/privacidad` }]}
      />
      <h1>Política de privacidad</h1>

      <p>
        Esta política explica qué datos personales se tratan al visitar alexendros.me, con qué
        finalidad y sobre qué base jurídica, conforme al Reglamento (UE) 2016/679 (RGPD) y a la Ley
        Orgánica 3/2018 (LOPDGDD).
      </p>

      <section aria-labelledby="priv-responsable">
        <h2 id="priv-responsable">Responsable del tratamiento</h2>
        <p>
          Alejandro Domingo Agustí, NIF 21002968N, C/ Puebla de Farnals 51-18, Valencia, España.{" "}
          <a href="mailto:contacto@alexendros.me">contacto@alexendros.me</a>.
        </p>
      </section>

      <section aria-labelledby="priv-datos">
        <h2 id="priv-datos">Qué datos tratamos y para qué</h2>
        <table className="legal-table">
          <thead>
            <tr>
              <th scope="col">Origen</th>
              <th scope="col">Datos</th>
              <th scope="col">Finalidad</th>
              <th scope="col">Base jurídica</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td data-label="Origen">Correo electrónico que tú envías</td>
              <td data-label="Datos">
                Dirección de correo, contenido del mensaje y, en su caso, archivos adjuntos
              </td>
              <td data-label="Finalidad">Atender y responder tu consulta</td>
              <td data-label="Base jurídica">Consentimiento (art. 6.1.a RGPD)</td>
            </tr>
            <tr>
              <td data-label="Origen">Proveedor de despliegue y hosting (Vercel)</td>
              <td data-label="Datos">
                Dirección IP, agente de usuario, URL solicitada y marca temporal
              </td>
              <td data-label="Finalidad">
                Servir el sitio, garantizar su seguridad y prevenir abusos
              </td>
              <td data-label="Base jurídica">Interés legítimo (art. 6.1.f RGPD)</td>
            </tr>
            <tr>
              <td data-label="Origen">Analítica web (Vercel Web Analytics)</td>
              <td data-label="Datos">
                URL de la página, referente, país aproximado, sistema operativo, navegador y tipo de
                dispositivo
              </td>
              <td data-label="Finalidad">Medir de forma agregada el uso del sitio</td>
              <td data-label="Base jurídica">Interés legítimo (art. 6.1.f RGPD)</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section aria-labelledby="priv-analitica">
        <h2 id="priv-analitica">Sobre la analítica web</h2>
        <p>
          El sitio utiliza Vercel Web Analytics para obtener estadísticas agregadas de visitas. Este
          sistema no instala cookies de terceros ni rastrea a las personas usuarias entre sitios:
          identifica cada visita con un valor derivado y anónimo, no con datos que permitan
          identificarte directamente. No se elaboran perfiles ni se muestra publicidad, y los datos
          no se venden ni se ceden con fines comerciales.
        </p>
      </section>

      <section aria-labelledby="priv-conservacion">
        <h2 id="priv-conservacion">Cuánto tiempo conservamos los datos</h2>
        <p>
          Los correos que envíes se conservan mientras sea necesario para gestionar la conversación
          y después, si procede, durante los plazos de prescripción de responsabilidades legales. La
          información técnica de hosting y analítica se conserva según los periodos de retención de
          los proveedores correspondientes.
        </p>
      </section>

      <section aria-labelledby="priv-destinatarios">
        <h2 id="priv-destinatarios">Destinatarios y encargados del tratamiento</h2>
        <p>
          No cedemos datos a terceros con fines comerciales. Acceden a datos técnicos, como
          encargados del tratamiento y con contratos conformes al RGPD, los siguientes proveedores:
        </p>
        <ul>
          <li>
            <strong>Vercel Inc.</strong> — despliegue y hosting del sitio, y servicio de analítica
            web.
          </li>
          <li>
            <strong>Hostinger</strong> — registro del dominio y servicio de nombres DNS.
          </li>
          <li>
            <strong>Proton AG (Proton Mail)</strong> — servicio de correo electrónico con sede en
            Suiza y cifrado de extremo a extremo entre usuarios Proton.
          </li>
        </ul>
      </section>

      <section aria-labelledby="priv-transferencias">
        <h2 id="priv-transferencias">Transferencias internacionales</h2>
        <p>
          Vercel Inc. está establecida en Estados Unidos. Las transferencias de datos derivadas de
          su servicio se amparan en las cláusulas contractuales tipo aprobadas por la Comisión
          Europea y en las garantías previstas en su contrato de encargo del tratamiento. Proton AG
          tiene su sede en Suiza, país con decisión de adecuación de la Comisión Europea.
        </p>
      </section>

      <section aria-labelledby="priv-derechos">
        <h2 id="priv-derechos">Tus derechos</h2>
        <p>Puedes ejercer los siguientes derechos:</p>
        <ul>
          <li>
            <strong>Acceso</strong> — saber qué datos personales tratamos sobre ti.
          </li>
          <li>
            <strong>Rectificación</strong> — corregir datos inexactos o incompletos.
          </li>
          <li>
            <strong>Supresión</strong> — solicitar la eliminación de tus datos.
          </li>
          <li>
            <strong>Limitación</strong> — restringir el tratamiento en determinadas circunstancias.
          </li>
          <li>
            <strong>Oposición</strong> — oponerte al tratamiento basado en interés legítimo.
          </li>
          <li>
            <strong>Portabilidad</strong> — recibir tus datos en un formato estructurado y de uso
            común.
          </li>
          <li>
            <strong>No ser objeto de decisiones individuales automatizadas</strong> — este sitio no
            adopta ese tipo de decisiones.
          </li>
        </ul>
        <p>
          Ejerce cualquiera de ellos escribiendo a{" "}
          <a href="mailto:contacto@alexendros.me">contacto@alexendros.me</a>. Responderemos en el
          plazo de un mes, prorrogable otros dos meses cuando la solicitud sea compleja. También
          puedes reclamar ante la{" "}
          <a href="https://www.aepd.es" target="_blank" rel="noopener noreferrer">
            Agencia Española de Protección de Datos (AEPD)
          </a>
          , cuya sede electrónica permite presentar reclamaciones de forma gratuita.
        </p>
      </section>

      <section aria-labelledby="priv-seguridad">
        <h2 id="priv-seguridad">Seguridad</h2>
        <p>
          Aplicamos medidas técnicas y organizativas adecuadas al riesgo para proteger los datos
          personales (art. 32 RGPD). Si se produjera una violación de seguridad que entrañara un
          riesgo para los derechos y libertades de las personas, se notificaría a la autoridad de
          control competente conforme a los artículos 33 y 34 del RGPD.
        </p>
        <p>
          <em>Última actualización: septiembre de 2026.</em>
        </p>
      </section>
    </>
  );
}
