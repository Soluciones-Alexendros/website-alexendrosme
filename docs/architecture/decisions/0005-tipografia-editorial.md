# 0005 — Tipografía editorial Source Serif 4 / Source Sans 3 / IBM Plex Mono

## Estado

Aceptada · 2026-09-30

## Contexto

El sitio mezclaba Geist Sans (default de Vercel), Geist Mono e Inter (Google) para el hero. Tres familias poco alineadas con un espacio de ensayos (Ideas / Acciones) y con la doctrina de privacidad (menos “look de plantilla”).

## Decisión

- **Display / h1–h2:** Source Serif 4 — carácter editorial.
- **Body / UI:** Source Sans 3 — pareja Adobe, lectura larga.
- **Código / labels:** IBM Plex Mono.
- Carga con `next/font/google` (descarga en build, sirve desde el origen). Visitante sin petición a Google.
- Máximo tres familias y tres pesos (400 / 600 / 700).

## Consecuencias

- Hay que invalidar la caché del service worker (`CACHE_VERSION` v3).
- Los snapshots visuales cambian.
- Los woff2 locales Geist en `public/fonts/` quedan obsoletos; se pueden retirar en un PR de higiene.
