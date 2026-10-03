# Plan · Ronda 2 · alexendros.me

**Repo:** `Soluciones-Alexendros/website-alexendrosme` · **Base:** `main` (ya incluye la ronda 1: PR #148 y release #149) · **Fecha:** 2026-10-03

## 0. Entregables

| Archivo                     | Qué es                                                                                                               |
| --------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| `alexendrosme-round2.patch` | Parche único contra `main` actual (28 archivos, +1695 / −205). Comprobado: aplica limpio en un clon nuevo y compila. |
| `new-files/`                | Copia suelta de los 8 componentes/libs nuevos o reescritos, para leerlos sin abrir el parche.                        |
| Este plan                   | Qué se hizo, por qué, cómo aplicarlo y qué falta.                                                                    |

```bash
git checkout -b feat/ronda-2
git apply --check alexendrosme-round2.patch && git apply alexendrosme-round2.patch
npm ci && npm run typecheck && npm run lint && npm test && npm run build
```

## 1. Estado de verificación

| Check                                 | Resultado                                                                                                      |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------------- |
| Prettier                              | OK                                                                                                             |
| `typecheck`                           | OK                                                                                                             |
| `lint`                                | OK                                                                                                             |
| `npm test`                            | OK · **355 tests** (+22 nuevos de esta ronda)                                                                  |
| `build` (export estático, 82 páginas) | OK, en clon limpio con fuentes de Google sustituidas por stubs (el sandbox no las alcanza; el repo no se toca) |
| HTML generado                         | Chips del banner renderizados en SSR; **cero `style=""` inline** (CSP intacta)                                 |
| **Render visual / Playwright**        | ❌ **No ejecutado** (no hay navegador en el sandbox). Ver §8.                                                  |

---

## 2. Fondo: ahora está vivo

Antes (ronda 1) la malla quedaba **estática por debajo de 768 px** y con movimiento reducido. Ahora anima en todos los dispositivos y gana capas de profundidad.

### 2.1 `components/mesh-bg.tsx` (v2)

| Mejora                        | Detalle                                                                                                  |
| ----------------------------- | -------------------------------------------------------------------------------------------------------- |
| **3 capas de profundidad**    | Lejos / medio / cerca, con distinta velocidad, tamaño y opacidad. Solo se enlazan capas contiguas.       |
| **Parallax con el scroll**    | Cada capa se desplaza a distinto ritmo (0,03 / 0,07 / 0,13 px por px de scroll).                         |
| **Hubs que respiran**         | 6 nodos (3 en móvil) con halo pulsante = «protocolos». El resto titila con fase propia.                  |
| **Paquetes con estela**       | Mensajes entre pares viajando por los enlaces.                                                           |
| **Interacción**               | El ratón atrae nodos y se une a la red. **Clic/toque → onda + paquetes** desde los enlaces más cercanos. |
| **Móvil**                     | 34 nodos, ~30 fps. Antes: estático.                                                                      |
| **Gobernador de rendimiento** | Si el coste medio de fotograma supera el presupuesto durante 1,5 s, retira un 15 % de nodos (mínimo 20). |
| **Pausa en pestaña oculta**   | Sin consumo en segundo plano.                                                                            |

### 2.2 `components/atmosphere.tsx` + CSS

Nueva capa `.atm__aurora`: un degradado cónico enmascarado que **gira lentamente (110 s por vuelta)** bajo la malla, en latón y violeta. Atenuada en tema claro.

### 2.3 Control de pausa (WCAG 2.2.2)

Una animación decorativa de más de 5 s necesita un control para pausarla.

- `components/motion-toggle.tsx`: botón Pausa/Play en el pie, junto a los iconos sociales (`aria-pressed`, etiqueta cambiante).
- `lib/motion.ts`: preferencia `auto | on | off` en `localStorage` (con `try/catch`), publicada en `<html data-motion>`.
- **Orden de decisión:** elección explícita del visitante > `prefers-reduced-motion` > pista `data-reduce`.

> **Decisión que debes validar.** Pediste que el fondo no sea estático. Lo es para todos **salvo** quien tiene `prefers-reduced-motion` activo en su sistema: esa persona ve un único fotograma y puede reanudar con el botón. Quitar ese respeto sería un problema de accesibilidad (vestibular) y de cumplimiento (EN 301 549 / WCAG). Si aun así lo quieres siempre animado, cambia `motionAllowed()` en `lib/motion.ts`; **no lo recomiendo**.

---

## 3. Banner superior v2

`components/anti-monetization-banner.tsx` + CSS (reescrito completo).

| Antes                                          | Ahora                                                                                                                              |
| ---------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| 2–3 líneas de texto largo, sobre todo en móvil | Frase corta + **chips** `0 anuncios · 0 afiliados · 0 ventas` (mono, entrada escalonada)                                           |
| Enlace subrayado                               | **Botón píldora** «Ir a alexendros.dev ↗» con hover (flecha se desplaza, elevación) y estado `:active`                             |
| Cierre instantáneo → salto de layout           | **Colapso animado** (`grid-template-rows 1fr→0fr`); la altura real se publica en `--ax-banner-offset`, así el contenido sube suave |
| `×` plano                                      | `×` que **gira 90°** al pasar el ratón; objetivo táctil de 44 px                                                                   |
| Sin atajo de teclado                           | **Esc** cierra el aviso                                                                                                            |
| `dangerouslySetInnerHTML`                      | JSX puro (`<strong>` por partición del texto)                                                                                      |
| Fondo plano                                    | Degradado con tinte latón, `backdrop-filter`, **línea de latón que barre el borde inferior** (8 s) e icono escudo que respira      |
| —                                              | **Cerrar** persiste al instante (aunque la animación no llegue a acabar) y sobrevive a `localStorage` bloqueado                    |

**Compatibilidad con `main`:** el script de medición pre-pintado que ya añadiste (PR #149) sigue funcionando; los chips van en SSR, así que la altura medida es la real. En reducción de movimiento se omiten todas las animaciones y el colapso es inmediato.

---

## 4. Botones

| Componente                     | Cambio                                                                                                                                                                   |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **`Button`** (`ui/button.tsx`) | **Bug:** `size="lg"` medía 40 px, _menos_ que `default` (44 px). Ahora `h-12 px-6 text-base`. Añadidas transiciones de `box-shadow` y `transform`.                       |
| `Button` primario              | **Brillo (sheen)** que cruza el botón al hover, sombra de latón, pulsación `translateY(1px) scale(.985)`. Solo con `(hover: hover)`.                                     |
| **CTAs del hero**              | «Escríbeme» con icono sobre (se inclina al hover); «Conóceme» con flecha ↓ que baja.                                                                                     |
| **`.fab-btn`**                 | **Bug:** el hover era idéntico al estado normal (mismo fondo). Ahora tiñe el fondo, eleva 2 px, añade sombra y gira el icono.                                            |
| **Nuevo `CopyEmail`**          | «Copiar correo» con estado `copiado/error`, icono que cambia y **anuncio `aria-live`** para lectores de pantalla. Falla con elegancia si el portapapeles está bloqueado. |
| Todos                          | `prefers-reduced-motion`: sin sheen, sin giros, sin desplazamientos.                                                                                                     |

---

## 5. Textos y contenidos

### 5.1 Microcopy (ES + EN, paridad comprobada por test)

| Clave                          | Antes                                                                | Ahora                                                                       |
| ------------------------------ | -------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| `antiMonetization.text`        | «…libre de monetización. Sin anuncios, sin afiliados, sin tracking.» | «Este espacio es libre de **monetización**.» (el resto pasa a chips)        |
| `antiMonetization.link`        | «Lo comercial vive en alexendros.dev»                                | «Ir a alexendros.dev»                                                       |
| `sections.publicaciones.desc`  | «Lo último en Opinión.»                                              | «Textos breves, sin relleno. Lo último en Opinión.»                         |
| `sections.publicaciones.empty` | «No hay publicaciones aún.»                                          | «Todavía no hay piezas publicadas. Vuelve pronto.»                          |
| `errors.notFoundDesc`          | «Esta página no existe o fue movida.»                                | «Este enlace no lleva a ninguna parte: la página no existe o se ha mudado.» |
| `errors.errorTitle/Desc`       | «Algo salió mal… Intenta de nuevo.»                                  | «Algo ha fallado… Vuelve a intentarlo o regresa al inicio.»                 |

Claves nuevas: `sections.principios.*`, `motion.*`, `backToTop`, `article.related`, `contact.copy/copied/copyError`.

### 5.2 Nueva sección «Lo que defiendo» (home)

Tres tarjetas (Atención · Soberanía · Protocolos), cada una enlaza al artículo que la desarrolla. Los enlaces están en `lib/principles.ts` y **un test verifica que los slugs existen**: si renombras un artículo, el test falla en vez de dejar un 404.

### 5.3 Artículos (retoques mínimos, tu voz intacta)

| Artículo                       | Cambio                                                                                                        |
| ------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| `soberania-digital`            | «Empieza por lo importante» pasa de lista de deseos a **3 acciones concretas** (correo, copias, publicación). |
| `protocolos-vs-plataformas`    | Una frase con **ActivityPub/Mastodon** como ejemplo real de protocolo social.                                 |
| `escape-del-feudo-algoritmico` | **Experimento de 7 días** con una regla («ninguna app sin propósito»).                                        |

> Son edición sugerida; revísalas con tu criterio de autor. Los otros dos artículos no se han tocado.

### 5.4 Contenido no tocado (observación)

El banner antes decía «sin tracking», y el sitio sí carga **Vercel Web Analytics** (la política de privacidad lo explica y dice que no usa cookies). Ahora el banner dice «0 anuncios · 0 afiliados · 0 ventas», que es **exacto**. Mantener «sin tracking» habría sido discutible; no lo reintroduzcas sin matizarlo.

---

## 6. Más diseño y componentes (criterio propio)

| Pieza                                                | Descripción                                                                                                                                                       |
| ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Tarjetas `spot-card`**                             | Foco de luz de latón que sigue al puntero (`--mx/--my` vía CSSOM, compatible con CSP), borde que se tiñe, elevación. Desactivado en táctiles.                     |
| **«Sigue leyendo»**                                  | Al final de cada artículo, 2 piezas afines por etiquetas (`getRelatedContent`, que ya existía sin usarse). Cierra el recorrido de lectura.                        |
| **Volver arriba con anillo**                         | Botón con anillo SVG que se rellena con el progreso de lectura (CSS `animation-timeline: scroll()`); aparece tras 640 px. Oculto a lectores cuando no es visible. |
| **`::selection`, `accent-color`, `scrollbar-color`** | Selección y controles nativos en latón.                                                                                                                           |
| **Aurora de atmósfera**                              | Ver §2.2.                                                                                                                                                         |

Todo con CSS puro o CSSOM, sin dependencias nuevas, sin red, sin `style=""`.

---

## 7. Archivos tocados (resumen)

**Nuevos:** `components/{motion-toggle,copy-email,back-to-top,related-articles}.tsx`, `lib/{motion,principles}.ts`, y 6 archivos de test.
**Reescritos:** `components/mesh-bg.tsx`, `components/anti-monetization-banner.tsx`, bloque del banner en `components.css`.
**Editados:** `home-content.tsx`, `footer.tsx`, `atmosphere.tsx`, `ui/button.tsx`, `app/layout.tsx`, `app/opinion/[slug]/page.tsx`, diccionarios ES/EN, 3 `.mdx`, specs de Playwright (banner y máscara visual).

**Tests nuevos (22):** `motion` (decisión de movimiento, persistencia, `localStorage` bloqueado), banner (texto, chips, colapso, Esc, descartado, storage roto), `CopyEmail` (éxito, error, aria-live), `MotionToggle` (por defecto y con reducción de movimiento), principios (slugs reales + diccionarios).

---

## 8. Pendiente antes de producción

1. **Revisión visual real** (no hecha): `npm run dev`.
   - Contraste de la malla + aurora sobre el halo dorado, en claro y oscuro.
   - Banner a 375 px (2 filas) y a 768 px (¿una o dos líneas?).
   - Que el foco de luz de las tarjetas no resulte pesado.
2. **Playwright:** regenerar snapshots (`npx playwright test --update-snapshots`). La home cambia (principios, botones con icono, cierre) y el fondo también. El spec del banner ya está actualizado.
3. **Lighthouse móvil** sobre la home: TBT/INP con la malla animada a 34 nodos. Si empeora, bajar `count` en `populate()` o subir `frameInterval` a 40 ms.
4. **Batería/Android gama baja:** el gobernador debería adelgazar la red solo; confirmar en un dispositivo real.
5. **Decisión de producto:** §2.3 (reducción de movimiento).
6. **Decidir** si el banner debe reaparecer pasado un tiempo (hoy el descarte es permanente).

## 9. Ajustes rápidos (si algo no te convence)

| Quiero…                  | Toco…                                                               |
| ------------------------ | ------------------------------------------------------------------- |
| Menos/más nodos          | `populate()` en `mesh-bg.tsx`                                       |
| Fondo menos presente     | `.mesh-canvas { opacity }` en `components.css`                      |
| Aurora más lenta o fuera | `animation: atm-spin 110s` / quitar `<div className="atm__aurora">` |
| Banner sin chips         | Vaciar `antiMonetization.chips` (el componente los omite)           |
| Quitar «Lo que defiendo» | Borrar la `<section id="principios">` de `home-content.tsx`         |
| Quitar volver arriba     | Quitar `<BackToTop />` de `layout.tsx`                              |

## 10. Siguientes ideas (no aplicadas)

- Malla que reacciona a la sección activa (más densa en `/opinion`, más sobria en `/legal`).
- Transiciones entre páginas con View Transitions API, con fallback.
- Modo lectura en artículos (ancho y tamaño de fuente persistidos con el mismo patrón seguro).
- OG image generada con la misma malla para coherencia de marca.
- Los dos artículos restantes con el mismo tratamiento de «acciones concretas».
