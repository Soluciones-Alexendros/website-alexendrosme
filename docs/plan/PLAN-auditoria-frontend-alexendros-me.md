# Plan · Auditoría frontend de alexendros.me

**Repo:** `Soluciones-Alexendros/website-alexendrosme` · **Stack:** Next.js (export estático) + Tailwind v4 + tokens oklch · **Fecha:** 2026-10-03

**Entregables**

- `alexendrosme-frontend-fixes.patch` — 19 archivos, +852 / −499. Aplicable con `git apply`.
- Este plan.

**Estado de verificación (en el sandbox)**

| Check                      | Resultado                                                                                                                   |
| -------------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| `npm run typecheck`        | OK                                                                                                                          |
| `npm run lint`             | OK                                                                                                                          |
| `npm test`                 | OK (323 tests)                                                                                                              |
| `npm run build`            | OK en copia temporal (el sandbox no alcanza Google Fonts; se sustituyeron por stubs _solo_ en la copia, el repo no se toca) |
| Playwright / render visual | **No ejecutado** (no hay navegador en el sandbox) → ver §7                                                                  |

---

## 1. Resumen ejecutivo

El diseño base es sólido (tokens oklch, tema claro/oscuro/sistema, tipografía serif editorial, CSP estricta con hashes). Los problemas reales eran de **integridad del CSS** y **robustez del JS**, no de estética:

1. Todo el CSS de las páginas `/legal/*` estaba **anidado dentro de `.section-below-fold`** y nunca se aplicaba.
2. Los títulos `h1–h6` de los artículos salían sin tamaño (preflight de Tailwind los deja en `inherit`).
3. El banner superior podía **tapar la nav sticky y los anclas** al saltar de línea.
4. `localStorage` sin `try/catch` en tema y banner → rompe en Safari privado / cookies bloqueadas.
5. ~600 líneas de **CSS muerto** heredado de alexendros.dev (marquee, tarjetas misión, utilidades).
6. Fondo genérico de partículas sin relación con el contenido.

---

## 2. Hallazgos y estado

Severidad: 🔴 alta · 🟠 media · 🟡 baja

| #   | Sev. | Hallazgo                                                                                          | Archivo                                                      | Estado                                                                                                           |
| --- | ---- | ------------------------------------------------------------------------------------------------- | ------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------- |
| 1   | 🔴   | CSS legal anidado en `.section-below-fold`: `/legal/*` sin estilo                                 | `components.css`                                             | ✅ Corregido (desanidado)                                                                                        |
| 2   | 🔴   | Títulos de `.prose` sin tamaño/peso/familia                                                       | `prose.css`                                                  | ✅ Corregido                                                                                                     |
| 3   | 🔴   | `localStorage` sin protección (tema y banner)                                                     | `theme-provider.tsx`, `anti-monetization-banner.tsx`         | ✅ Corregido                                                                                                     |
| 4   | 🟠   | Banner mide >3.25rem con 2–3 líneas y tapa nav/anclas                                             | banner + CSS                                                 | ✅ Altura real publicada en `--ax-banner-offset` (ResizeObserver, vía CSSOM → compatible con CSP)                |
| 5   | 🟠   | `scroll-margin-top` y TOC sticky ignoraban banner                                                 | `components.css`, `prose.css`                                | ✅ Usan `--ax-banner-offset`                                                                                     |
| 6   | 🟠   | `useScrollSpy`: array nuevo por render recreaba observers                                         | `useScrollSpy.ts`, `nav.tsx`                                 | ✅ Deps primitivas + `NAV_SECTION_IDS` a nivel de módulo; contrato del test respetado                            |
| 7   | 🟠   | Selector de tema con roles ARIA inválidos / variable `t` sombreada                                | `theme-toggle.tsx`                                           | ✅ `radiogroup`/`radio` + `aria-checked`                                                                         |
| 8   | 🟠   | Hero a 52rem vs nav/footer a 48rem: 3 bordes izquierdos distintos                                 | CSS                                                          | ✅ Alineados (override sin capa)                                                                                 |
| 9   | 🟠   | `.mesh-canvas`/`.particle-canvas` con `100vw/100vh` → overflow por scrollbar y salto en móvil     | `components.css`                                             | ✅ `100%` + `100dvh` en body                                                                                     |
| 10  | 🟠   | Capas z-index del fondo sin orden documentado                                                     | `components.css`                                             | ✅ Documentado (−20 halo · −19 grano · −11 atmósfera · −10 malla)                                                |
| 11  | 🟠   | Efecto `shimmer` del hero anulado por `h1.display` (código muerto)                                | `components.css`, `home-content.tsx`                         | ✅ Sustituido por nombre en latón                                                                                |
| 12  | 🟡   | `backdrop-filter` del token glass sin usar en la nav                                              | `components.css`                                             | ✅ Blur + fallback `prefers-reduced-transparency`                                                                |
| 13  | 🟡   | CSS muerto: `marquee-*`, `card-*`, `stack-xl-gap`, `animate-marquee`                              | `components.css`, `motion.css`, `index.css`, `utilities.css` | ✅ Eliminado                                                                                                     |
| 14  | 🟡   | `.prose`: `ol` sin números, imágenes sin límite, `pre code` con fondo doble, blockquote sin serif | `prose.css`                                                  | ✅ Corregido                                                                                                     |
| 15  | 🟡   | `FAB` de contacto huérfano flotando sin contexto                                                  | `home-content.tsx`                                           | ✅ Convertido en sección de cierre                                                                               |
| 16  | 🟡   | Clases `ds-*`, `formal-*`, `icn-*`, `toc-level-3/4`, `tabular` sin uso en TSX                     | CSS                                                          | ⏸ **No tocado** (pueden ser API del design system; decidir)                                                      |
| 17  | 🟡   | `dangerouslySetInnerHTML` en el banner                                                            | banner                                                       | ⏸ Riesgo bajo (texto viene del diccionario propio). Alternativa: partir el string y renderizar `<strong>` en JSX |

---

## 3. El fondo: «malla de nodos»

**Concepto.** El sitio defiende _protocolos abiertos frente a plataformas_ y soberanía digital. El fondo lo dibuja literalmente: una red de nodos latón sin centro, donde cada punto es soberano y los enlaces solo aparecen cuando dos nodos se encuentran.

**Archivo:** `components/mesh-bg.tsx` (reemplaza `particle-bg.tsx`).

| Aspecto        | Decisión                                                                                                                         |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| Identidad      | Nodos y enlaces en `--ax-accent` (latón); paquetes en `--ax-accent-bright` viajando entre pares                                  |
| Interacción    | El cursor se une a la red como un nodo más (solo puntero fino + ratón)                                                           |
| Tema           | Re-lee tokens con `MutationObserver` al cambiar `data-theme`; fallback si el color no es válido para canvas                      |
| Accesibilidad  | `prefers-reduced-motion`, `data-reduce="true"` o viewport < 768px → **un frame estático** (conserva personalidad sin movimiento) |
| Rendimiento    | Sin dependencias, DPR ≤ 2, n ≤ 90 nodos (O(n²) acotado), pausa con pestaña oculta, ignora resize por barra de URL móvil          |
| Legibilidad    | Máscara radial: más tenue tras la columna de lectura                                                                             |
| Compatibilidad | Mantiene `data-testid="particle-bg"`; selector de tests visuales actualizado a `.mesh-canvas`                                    |
| CSP            | Sin estilos inline ni scripts nuevos                                                                                             |

---

## 4. Añadidos y efectos

Todos son CSS puro o CSSOM (la CSP prohíbe `style=""`), degradan sin soporte y respetan `prefers-reduced-motion`.

| Pieza                            | Dónde                | Detalle                                                                                  |
| -------------------------------- | -------------------- | ---------------------------------------------------------------------------------------- |
| **Nombre en latón**              | Hero                 | «Alexendros.» resaltado; mismo texto accesible                                           |
| **Punto de pulso**               | Eyebrow del hero     | Reutiliza `@keyframes pulse-dot`                                                         |
| **Foco de luz en tarjetas**      | Lista de piezas      | `--mx/--my` vía `pointermove`; desactivado en táctiles                                   |
| **Revelado al scroll**           | Cabeceras y tarjetas | `animation-timeline: view()` bajo `@supports`                                            |
| **Barra de progreso de lectura** | Artículos            | `animation-timeline: scroll(root)` en `.read-progress`                                   |
| **Nav esmerilada**               | Global               | `backdrop-filter` + fallback sólido                                                      |
| **Sección de cierre**            | Home                 | Título «¿Hablamos?» + FAB integrado + filete latón; textos ES/EN añadidos al diccionario |

---

## 5. Cómo aplicar

```bash
cd website-alexendrosme
git checkout -b fix/frontend-audit
git apply --check alexendrosme-frontend-fixes.patch && git apply alexendrosme-frontend-fixes.patch
npm ci
npm run typecheck && npm run lint && npm test
npm run build
```

> El parche **excluye** `public/` (feeds y sitemaps que el build regenera).

---

## 6. Restricciones respetadas

- **No se editan** los `<style>`/`<script>` inline de `layout.tsx`: están fijados por hash en la CSP (`vercel.json`). Las correcciones sobre ellos se hacen por especificidad, con reglas sin capa al final de `components.css`.
- Sin dependencias nuevas.
- Sin tracking ni peticiones de red nuevas.

---

## 7. Pendiente (en este orden)

1. **Revisión visual real** (no hecha): `npm run dev`, comprobar en claro/oscuro, móvil 375px y con `prefers-reduced-motion`.
   - Contraste de la malla sobre el halo dorado.
   - Que el nombre en latón del hero cumple AA en tema claro.
   - Foco de luz de tarjetas y revelado al scroll.
2. **Playwright:** `tests/visual-regression.spec.ts` fallará hasta regenerar snapshots (`npx playwright test --update-snapshots`) por el cambio de fondo y tarjetas.
3. **Lighthouse** (móvil): confirmar que la malla no empeora TBT/INP; si lo hiciera, bajar `count` o el umbral `MOBILE_MAX`.
4. **Decidir hallazgo #16** (clases `ds-*` etc.): borrar o documentar como API.
5. **Decidir hallazgo #17** (banner sin `dangerouslySetInnerHTML`).
6. **Desplegar en preview de Vercel** y revisar contra https://alexendros.me antes de promover.

---

## 8. Ideas siguientes (no aplicadas)

- Variante de la malla por sección (más densa en `/opinion`, más sobria en `/legal`).
- Transiciones entre páginas con View Transitions API (con fallback).
- Modo lectura en artículos (ancho/tamaño de fuente) persistido con el mismo `try/catch` seguro.
- Imagen Open Graph generada con la misma malla para coherencia de marca.
