# Mi propio portal de contenido personal con código abierto accesible desde internet.

### Propósito de este documento

- **Objetivos:** Presentar alexendros.me, el stack estático y los contratos
  públicos (arranque, colecciones, CI) para humanos, CI y agentes.
- **Estructura:** Identidad y badges → qué es → stack → desarrollo local →
  estructura → design system → comunidad.
- **Contenido a integrar según contexto:** Adapta nombre, badges y rutas de
  este sitio. No copies stack/devops de alexendros.dev ni un README de CLI.
  La colección es `opinion`. No reescribas el copy editorial
  en un PR de plataforma.

> Espacio personal libre de monetización: opinión y pensamiento.

[![Deployed on Vercel](https://img.shields.io/badge/vercel-%23000000?logo=vercel&logoColor=white)](https://alexendros.me)
[![CI: build · e2e · lhci · a11y · perf](https://img.shields.io/github/actions/workflow/status/Soluciones-Alexendros/website-alexendrosme/ci.yml?branch=main&logo=github&label=CI&style=flat-square)](https://github.com/Soluciones-Alexendros/website-alexendrosme/actions/workflows/ci.yml)
[![Lighthouse](https://img.shields.io/endpoint?url=https%3A%2F%2Fgist.githubusercontent.com%2FAlexendros%2Fff3b2a0e0c6ea0a662af759b1fc5de14%2Fraw%2Flighthouse.json&logo=lighthouse&style=flat)](https://googlechrome.github.io/lighthouse/viewer/?psiurl=https%3A%2F%2Falexendros.me)
[![Release: v0.8.0](https://img.shields.io/github/v/release/Soluciones-Alexendros/website-alexendrosme?logo=github&label=Release&style=flat-square)](https://github.com/Soluciones-Alexendros/website-alexendrosme/releases)
[![Next.js](https://img.shields.io/badge/next.js-16-black?logo=next.js)](https://nextjs.org)
[![Tailwind CSS](https://img.shields.io/badge/tailwind-4-06b6d4?logo=tailwindcss)](https://tailwindcss.com)
[![TypeScript](https://img.shields.io/badge/typescript-strict-3178c6?logo=typescript)](https://www.typescriptlang.org)
[![Tests: 323 passed](https://img.shields.io/badge/tests-323%20passed-44cc11?logo=vitest)](https://github.com/Soluciones-Alexendros/website-alexendrosme/actions)
[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/license-CC%20BY--NC--SA%204.0-orange.svg)](LICENSE)

## Qué es

Sitio web personal estático para [alexendros.me](https://alexendros.me). Contenido editorial sobre soberanía digital, crítica tecnológica y alternativas al modelo de plataformas.

- **[Opinión](https://alexendros.me/opinion)** — ensayos y crítica en voz humana

## Stack

| Capa      | Tecnología                                                                                                                                           |
| --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| Framework | [Next.js 16](https://nextjs.org) (App Router, Turbopack)                                                                                             |
| Estilos   | [Tailwind CSS v4](https://tailwindcss.com) + design system `--ax-*`                                                                                  |
| Tipado    | [TypeScript](https://www.typescriptlang.org) strict                                                                                                  |
| Contenido | Markdown (`.mdx`) + [gray-matter](https://github.com/jonschlinkert/gray-matter) + Zod + [react-markdown](https://github.com/remarkjs/react-markdown) |
| UI        | [shadcn/ui](https://ui.shadcn.com) + [Radix UI](https://www.radix-ui.com) + [Lucide](https://lucide.dev)                                             |
| Deploy    | [Vercel](https://vercel.com) (export estático)                                                                                                       |
| Testing   | [Vitest](https://vitest.dev) + [Playwright](https://playwright.dev)                                                                                  |

**Ref:** [CHANGELOG](CHANGELOG.md) · [DECISIONS](DECISIONS.md) ·
[ARCHITECTURE](ARCHITECTURE.md) · [AGENTS](AGENTS.md) · [docs/](docs/) ·
[CONTRIBUTING](CONTRIBUTING.md) · [SECURITY](SECURITY.md)

## Desarrollo local

```bash
# Clonar
git clone git@github.com:Soluciones-Alexendros/website-alexendrosme.git
cd website-alexendrosme

# Instalar
npm install

# Desarrollo
npm run dev          # localhost:3000 (Turbopack)

# Build
npm run build        # export estático en ./out

# Tests
npm run test         # unit (Vitest)
npm run test:e2e     # e2e (Playwright)
npm run smoke        # rutas canónicas del export (`out/` previo)

# Lint + tipos
npm run lint
npm run typecheck
```

## Estructura

```
├── app/                  # App Router (rutas + layouts)
│   ├── styles/           # CSS: tokens, base, components, prose
│   ├── opinion/          # Colección: ensayos (blog)
│   ├── en/               # Árbol EN (SSG + hreflang)
│   └── legal/            # Páginas legales
├── components/           # Componentes React (shadcn/ui base)
├── content/              # MDX (opinion)
├── lib/                  # Utilidades (cn, content loader, schemas)
├── public/               # Assets estáticos
├── DESIGN.md             # Sistema de diseño v1
├── ARCHITECTURE.md       # Decisiones técnicas
└── docs/                 # ADRs, guías y runbooks
```

## Sistema de diseño

Ver [DESIGN.md](DESIGN.md) para documentación completa de tokens, componentes y principios.

Tokens con prefijo `--ax-*` para colores, motion, spacing y layout. Triple cadena de aliases compatible con shadcn/ui.

## Licencia y comunidad

Contenido editorial: [CC BY-NC-SA 4.0](LICENSE). Código fuente: MIT (ver
[licencia](app/legal/licencia/page.tsx)). Contribuciones: [CONTRIBUTING.md](CONTRIBUTING.md).
Conducta: [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md). Vulnerabilidades:
[SECURITY.md](SECURITY.md). Soporte: [SUPPORT.md](SUPPORT.md).

<!-- RELEASE_SECTION_START -->
<details>
<summary><strong>v0.15.0</strong> (2026-10-03)</summary>

## [0.15.0] — 2026-10-03 · Ronda 2: fondo interactivo, movimiento, banner, principios

### Añadido

- **components/mesh-bg.tsx v2**: malla 3 capas con parallax (0.03/0.07/0.13), 6 hubs pulsantes (3 móvil), paquetes con estela, ratón atrae nodos, clic/toque→onda, 34 nodos móvil (~30fps), gobernador rendimiento (reduce 15% nodos si coste >1.5s, mín 20), pausa pestaña oculta.
- **components/atmosphere.tsx**: capa `.atm__aurora` degradado cónico rotando 110s latón+violeta, atenuado en tema claro.
- **components/motion-toggle.tsx + lib/motion.ts**: botón Pausa/Play en footer (`aria-pressed`), preferencia `auto|on|off` en localStorage con try/catch, publicada en `<html data-motion>`, respeta `prefers-reduced-motion` (elección explícita > media query > `data-reduce`).
- **components/anti-monetization-banner.tsx v2**: frase corta + chips `0 anuncios · 0 afiliados · 0 ventas`, botón píldora, colapso animado `grid-template-rows 1fr→0fr`, `×` gira 90°, Esc cierra, JSX puro (sin `dangerouslySetInnerHTML`), línea latón barre borde, cierre persiste al instante, sobrevive localStorage bloqueado, **descarte permanente**.
- **Nueva sección "Lo que defiendo"** (home): 3 tarjetas Atención·Soberanía·Protocolos, enlaces en `lib/principles.ts`, test verifica slugs existen.
- **components/back-to-top.tsx**: botón flotante con anillo de progreso circular.
- **components/related-articles.tsx**: sección "Sigue leyendo" en artículos de opinión.
- **components/copy-email.tsx**: copia email con feedback `aria-live`.
- Tokens visuales: `::selection`, `accent-color`, `scrollbar-color` en latón.

### Cambiado

- **components/ui/button.tsx**: `size="lg"` ahora `h-12 px-6 text-base` (era 40px < default 44px), sheen al hover, CTAs hero con iconos, `.fab-btn` hover corregido.
- **Artículos retocados**: `soberania-digital`, `protocolos-vs-plataformas`, `escape-del-feudo-algoritmico` (microcopy, accesibilidad).
- **components/spot-card.tsx**: foco luz puntero via CSSOM (`--mx/--my`).

### Eliminado

- `dangerouslySetInnerHTML` del banner (ahora JSX puro).
- `100vw`/`100vh` residuales → `100%`/`100dvh`.

### Test

- 356 tests (baseline 355 + 22 nuevos: banner, motion-toggle, copy-email, principles, motion, helpers).
- Snapshots Playwright actualizados (home light/dark mobile/tablet/desktop, aviso-legal variantes).

### Decisiones de producto

- Respeto a `prefers-reduced-motion` (§2.3): animaciones detenidas por defecto si usuario lo solicita, botón Play para activar.
- Banner anti-monetización: descarte permanente (no reaparece).

</details>
<!-- RELEASE_SECTION_END -->

# trigger ci
