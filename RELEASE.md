# Procedimiento de release de website-alexendrosme

Las releases siguen [SemVer 2.0.0](https://semver.org/lang/es/) y se
publican a través de tags firmados.

## Antes de la release

- Todos los cambios relevantes están en `CHANGELOG.md` bajo `[Unreleased]`.
- El CI está verde en `main`.
- La documentación está actualizada (README, ARCHITECTURE, docs/).
- Se han verificado las dependencias con `npm audit` o herramienta
  equivalente.

## Pasos

> El versionado vive en `main` y viaja en PRs normales — nunca se commitea
> directamente. El workflow `release.yml` solo taggea sobre el HEAD de
> `main` (su bump local es no-op cuando la preparación ya está mergeada).

1. En una rama, ejecutar `npm run release:prepare` (equivale a
   `tsx scripts/prepare-release.ts --write`). El script calcula la próxima
   versión con `scripts/get-next-version.sh` (la misma fuente que CI),
   actualiza `package.json`, fusiona los bloques `## [Unreleased]` en
   `## [X.Y.Z] — FECHA` y regenera el bloque `RELEASE_SECTION` del README.
   Previsualizar antes con `tsx scripts/prepare-release.ts --dry-run`.
   Forzar una versión exacta con `-- --version X.Y.Z` (debe ser mayor que el
   último tag).
2. Abrir PR con la preparación, mergear a `main` tras CI verde.
3. El workflow `release.yml` (disparado por el CI en `main`) crea el tag
   firmado `vX.Y.Z` sobre ese HEAD, sube el artefacto de `out/` y publica la
   GitHub Release con la sección del CHANGELOG.
4. Verificar: `npm run release:check` (exit 2 si `package.json`, CHANGELOG o
   README derivan de la versión esperada) y tag accesible desde `main`
   (`git merge-base --is-ancestor vX.Y.Z HEAD`). El job `quality` de CI
   ejecuta este check: un PR con cambios releaseables sin preparación falla
   hasta incluirla.

## Versionado

## Versionado

- `MAJOR` para cambios incompatibles.
- `MINOR` para nuevas funcionalidades retrocompatibles.
- `PATCH` para correcciones retrocompatibles.

## Hotfix

Para correcciones críticas en una versión publicada:

1. Rama `hotfix/vX.Y.Z+1` desde el tag.
2. Aplicar la corrección y bumpear `PATCH`.
3. Seguir los pasos estándar.
4. Mergear de vuelta a `main` para no perder la corrección.
