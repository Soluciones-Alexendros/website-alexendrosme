# 0006. Consolidación de contenido y rutas legales

- Estado: accepted
- Fecha: 2026-09-30
- Decisores: Alexendros
- Etiquetas: arquitectura, contenido, ruteo, legal

> Texto en formato MADR 4.0.0 · https://adr.github.io/madr/

## Contexto y planteamiento del problema

El sitio arrastraba una arquitectura de contenido incoherente: el código
declaraba las colecciones `proyectos` y `opinion`, con rutas, tarjetas,
sitemaps, feeds, imágenes OG y tipos propios de `proyectos`, mientras la
documentación y el changelog describían taxonomías antiguas (`ideas`,
`acciones`). Existían además URLs históricas de `proyectos` que ya no tenían
contenido y una página `/legal/seguridad` fuera del conjunto legal canónico.

Se necesita una única fuente de verdad para rutas, colecciones, navegación,
búsqueda, etiquetas, feeds, sitemaps, imágenes OG y tipos, y un conjunto legal
que describa la implementación real.

## Drivers de la decisión

- Coherencia entre lo publicado y lo documentado (una sola arquitectura).
- Evitar residuos funcionales de secciones retiradas.
- No mantener redirecciones hacia rutas eliminadas.
- Alinear las páginas legales con el contenido y los proveedores reales.

## Opciones consideradas

- Mantener `proyectos` junto a `opinion` y corregir solo la documentación.
- Eliminar `proyectos`, quedarse con `opinion` y retirar sus URLs históricas.
- Reescribir `proyectos` como nueva taxonomía (`ideas`/`acciones`).

Para las rutas legales:

- Conservar `/legal/seguridad` dentro de la navegación legal.
- Retirar `/legal/seguridad` y publicar `/legal/licencia`.

## Resultado de la decisión

Opción elegida: "eliminar `proyectos`, quedarse con `opinion` y retirar sus
URLs históricas" + "retirar `/legal/seguridad` y publicar `/legal/licencia`".

- `CollectionType` pasa a `"opinion"` como única colección.
- Se eliminan `app/proyectos/`, `app/en/proyectos/`, `content/proyectos/`,
  `components/project-card.tsx`, los tipos/OG/feeds/sitemaps de `proyectos` y
  toda referencia funcional residual en componentes, scripts, tests y
  diccionarios.
- Las URLs históricas de `proyectos` (`/proyectos`, `/proyectos/:slug`,
  `/projects`, `/projects/:slug`) se retiran sin redirección. `vercel.json`
  elimina la redirección `/projects → /proyectos`.
- La navegación legal pasa a: Aviso legal, Privacidad, Cookies y **Licencia**
  (`/legal/licencia`). Se retiran `app/legal/seguridad/` y
  `app/en/legal/seguridad/`.
- La licencia separa ámbitos: contenido editorial bajo CC BY-NC-SA 4.0 y
  código fuente bajo MIT.

### Consecuencias positivas

- Una sola arquitectura de contenido, con una única fuente de verdad.
- Sitemaps, feeds, índice de búsqueda e imágenes OG sin URLs retiradas.
- Conjunto legal mínimo, formal y verificable.

### Consecuencias negativas

- Las URLs antiguas de `proyectos` devuelven 404 (no hay redirección).
- `/legal/seguridad` deja de existir; su contenido se retira del sitio.

## Validación

- Búsqueda de residuos: cero referencias funcionales a `proyectos`/`projects`.
- `build` estático (82 páginas) y `smoke` verde sobre las rutas finales.
- Sitemap, feeds y `search-index` regenerados sin `proyectos` ni `seguridad`.
- Auditorías Playwright de a11y usando `/legal/licencia`.

## Pros y contras de las opciones

### Mantener `proyectos`

- Bueno, porque conserva contenido publicado.
- Malo, porque perpetúa la incoherencia y el residuo funcional.

### Eliminar `proyectos` (elegida)

- Bueno, porque simplifica a una colección y a una sola fuente de verdad.
- Malo, porque pierde dos piezas y sus URLs.

## Más información

- `lib/content/types.ts`, `lib/content/loader.ts`, `lib/site.ts`.
- `scripts/generate-sitemap.ts`, `scripts/generate-feeds.ts`.
- `app/legal/licencia/page.tsx`, `app/en/legal/licencia/page.tsx`.
