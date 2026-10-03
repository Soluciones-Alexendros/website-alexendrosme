#!/usr/bin/env tsx
/**
 * prepare-release — prepara en local el versionado de una release.
 *
 * Contexto: el workflow `release.yml` commitea el bump de `package.json` y el
 * snippet del README solo en el runner y pushea únicamente el tag. Resultado:
 * tags que cuelgan fuera de `main` (`v0.8.1…v0.13.0`), `package.json` anclado
 * en `0.8.0` y secciones `## [Unreleased]` que nunca se finalizan.
 *
 * Este script invierte la responsabilidad: el versionado vive en `main` vía
 * PR normal y el workflow se limita a taggear (su bump local pasa a ser
 * no-op y el tag cae sobre el HEAD de `main`).
 *
 * Uso:
 *   tsx scripts/prepare-release.ts [--write] [--check] [--dry-run]
 *     [--version X.Y.Z] [--date YYYY-MM-DD] [--allow-dirty]
 *
 *   Sin flags imprime el plan (dry-run). `--write` aplica los cambios:
 *     1. `package.json` → próxima versión (misma fuente que CI:
 *        `scripts/get-next-version.sh`).
 *     2. `CHANGELOG.md` → bloques `## [Unreleased]` superiores fusionados en
 *        un único `## [X.Y.Z] — FECHA · sufijos`.
 *     3. `README.md` → bloque entre `<!-- RELEASE_SECTION_* -->` regenerado
 *        con `scripts/extract-changelog.sh` (solo si existen los marcadores).
 *   `--check` verifica que el árbol ya refleja la release esperada
 *   (exit 2 si hay deriva). Pensado como guarda programático.
 */
import { execFileSync } from "node:child_process";
import { readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const PKG_PATH = join(ROOT, "package.json");
const CHANGELOG_PATH = join(ROOT, "CHANGELOG.md");
const README_PATH = join(ROOT, "README.md");
const NEXT_VERSION_SCRIPT = join(ROOT, "scripts", "get-next-version.sh");
const EXTRACT_SCRIPT = join(ROOT, "scripts", "extract-changelog.sh");

const SEMVER_RE = /^(\d+)\.(\d+)\.(\d+)(-[0-9A-Za-z.-]+)?(\+[0-9A-Za-z.-]+)?$/;
const UNRELEASED_RE = /^## \[Unreleased\](?:\s*·\s*(.*?))?\s*$/;
const VERSIONED_RE = /^## \[(\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?)\]/;

export type Semver = { major: number; minor: number; patch: number };

export function parseVersion(v: string): Semver {
  const m = SEMVER_RE.exec(v.trim().replace(/^v/, ""));
  if (!m) throw new Error(`Versión semver inválida: ${v}`);
  return { major: Number(m[1]), minor: Number(m[2]), patch: Number(m[3]) };
}

/** -1 | 0 | 1 comparando solo major.minor.patch. */
export function compareSemver(a: string, b: string): number {
  const pa = parseVersion(a);
  const pb = parseVersion(b);
  for (const k of ["major", "minor", "patch"] as const) {
    if (pa[k] !== pb[k]) return pa[k] < pb[k] ? -1 : 1;
  }
  return 0;
}

export function bumpPackageJson(pkgText: string, version: string): string {
  parseVersion(version); // valida
  const pkg = JSON.parse(pkgText) as { version?: string };
  pkg.version = version;
  return `${JSON.stringify(pkg, null, 2)}\n`;
}

export type FinalizeResult = { changelog: string; suffix: string; blocks: number };

export class NothingToRelease extends Error {}

/**
 * Fusiona los bloques `## [Unreleased]` superiores en un único
 * `## [X.Y.Z] — FECHA · sufijos`. Lanza si no hay nada que releasear.
 * Todo lo demás se preserva byte a byte.
 */
export function finalizeChangelog(md: string, version: string, date: string): FinalizeResult {
  parseVersion(version);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error(`Fecha inválida: ${date}`);
  const lines = md.split("\n");
  const blocks: { suffix: string; body: string[] }[] = [];
  let restStart = 0;
  let current: { suffix: string; body: string[] } | null = null;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i] as string;
    const un = UNRELEASED_RE.exec(line);
    if (un && blocks.length === 0 && current === null) {
      current = { suffix: (un[1] ?? "").trim(), body: [] };
      continue;
    }
    if (un && current) {
      blocks.push(current);
      current = { suffix: (un[1] ?? "").trim(), body: [] };
      continue;
    }
    if (VERSIONED_RE.exec(line)) {
      if (current) {
        blocks.push(current);
        current = null;
      }
      restStart = i;
      break;
    }
    if (current) current.body.push(line);
    if (i === lines.length - 1) restStart = lines.length;
  }
  if (current) blocks.push(current);
  if (blocks.length === 0)
    throw new NothingToRelease("CHANGELOG.md no tiene bloques ## [Unreleased] que releasear");

  const suffix = blocks
    .map((b) => b.suffix)
    .filter(Boolean)
    .join(" + ");
  const header = suffix ? `## [${version}] — ${date} · ${suffix}` : `## [${version}] — ${date}`;
  const mergedBody = blocks.flatMap((b) => b.body);
  // Recorta líneas en blanco iniciales del cuerpo fusionado, conserva el resto.
  while (mergedBody.length > 0 && mergedBody[0]?.trim() === "") mergedBody.shift();
  const rest = lines.slice(restStart).join("\n");
  const changelog = `${header}\n\n${mergedBody.join("\n").trimEnd()}\n\n${rest.trimStart()}`;
  return { changelog, suffix, blocks: blocks.length };
}

const START_MARKER = "<!-- RELEASE_SECTION_START -->";
const END_MARKER = "<!-- RELEASE_SECTION_END -->";

/**
 * Sustituye la región completa entre marcadores (incluidos) por el snippet.
 * El snippet canónico (`extract-changelog.sh --readme`) ya trae sus propios
 * marcadores; conservar además los externos los duplicaría.
 * Sin marcadores, no-op.
 */
export function refreshReadmeSection(
  readme: string,
  snippet: string,
): { readme: string; updated: boolean } {
  const start = readme.indexOf(START_MARKER);
  const end = readme.indexOf(END_MARKER);
  if (start === -1 || end === -1 || end < start) return { readme, updated: false };
  const before = readme.slice(0, start);
  const after = readme.slice(end + END_MARKER.length);
  return { readme: `${before}${snippet.trim()}\n${after}`, updated: true };
}

function sh(cmd: string, args: string[], quiet = false): string {
  if (quiet) {
    return execFileSync(cmd, args, {
      cwd: ROOT,
      encoding: "utf8",
      stdio: ["ignore", "pipe", "ignore"],
    }).trim();
  }
  return execFileSync(cmd, args, { cwd: ROOT, encoding: "utf8" }).trim();
}

function git(args: string[]): string {
  return execFileSync("git", args, { cwd: ROOT, encoding: "utf8" }).trim();
}

export function lastTagVersion(): string {
  const tag = git(["tag", "--list", "v*", "--sort=-v:refname"])
    .split("\n")[0]
    ?.trim()
    .replace(/^v/, "");
  if (!tag) throw new Error("No hay tags v* en el historial (¿clone shallow sin tags?)");
  return tag;
}

/** true si hay bloques ## [Unreleased] antes de la primera sección versionada. */
export function hasPendingUnreleased(md: string): boolean {
  for (const line of md.split("\n")) {
    if (UNRELEASED_RE.exec(line)) return true;
    if (VERSIONED_RE.exec(line)) return false;
  }
  return false;
}

export class NoBumpNeeded extends Error {}

function computeNextVersion(explicit?: string): string {
  if (explicit) {
    const clean = explicit.trim().replace(/^v/, "");
    parseVersion(clean);
    const last = lastTagVersion();
    if (compareSemver(clean, last) <= 0) {
      throw new Error(`${clean} no es mayor que el último tag v${last}`);
    }
    return clean;
  }
  let out: string;
  try {
    out = sh("bash", [NEXT_VERSION_SCRIPT], true);
  } catch (err) {
    throw new NoBumpNeeded(
      "get-next-version.sh no propone versión (¿solo chore/docs desde el último tag?)",
      { cause: err },
    );
  }
  const m = out.match(/v?(\d+\.\d+\.\d+(?:-[0-9A-Za-z.-]+)?(?:\+[0-9A-Za-z.-]+)?)\s*$/);
  if (!m?.[1])
    throw new NoBumpNeeded(
      "get-next-version.sh no propone versión (¿solo chore/docs desde el último tag?)",
    );
  return m[1];
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

type Args = {
  write: boolean;
  check: boolean;
  dryRun: boolean;
  version?: string;
  date?: string;
  allowDirty: boolean;
};

function parseArgs(argv: string[]): Args {
  const a: Args = { write: false, check: false, dryRun: false, allowDirty: false };
  for (let i = 0; i < argv.length; i++) {
    const t = argv[i];
    if (t === "--write") a.write = true;
    else if (t === "--check") a.check = true;
    else if (t === "--dry-run") a.dryRun = true;
    else if (t === "--allow-dirty") a.allowDirty = true;
    else if (t === "--version") a.version = argv[++i];
    else if (t === "--date") a.date = argv[++i];
    else throw new Error(`Flag desconocido: ${t}`);
  }
  if (a.write && a.check) throw new Error("--write y --check son excluyentes");
  return a;
}

function main(): void {
  const args = parseArgs(process.argv.slice(2));
  const mode = args.check ? "check" : args.write && !args.dryRun ? "write" : "dry-run";

  const status = git(["status", "--porcelain"]).trim();
  if (status && !args.allowDirty && mode !== "check") {
    throw new Error(`Árbol sucio (usa --allow-dirty para forzar):\n${status}`);
  }

  const pkgText = readFileSync(PKG_PATH, "utf8");
  const mdText = readFileSync(CHANGELOG_PATH, "utf8");
  const currentPkg = (JSON.parse(pkgText) as { version: string }).version;

  let version: string;
  try {
    version = computeNextVersion(args.version);
  } catch (err) {
    if (!(err instanceof NoBumpNeeded) || args.version) throw err;
    // Sin bump computable (solo chore/docs): coherente si no hay nada pendiente.
    const last = lastTagVersion();
    const pending = hasPendingUnreleased(mdText);
    if (currentPkg === last && !pending) {
      console.log(`OK: nada que releasear (package.json ${currentPkg} = último tag v${last})`);
      return;
    }
    if (mode === "check") {
      console.error(
        `Deriva de versionado detectada (sin bump computable):\n` +
          `- package.json: ${currentPkg} (último tag: v${last})${pending ? "\n- CHANGELOG.md: bloques [Unreleased] pendientes" : ""}`,
      );
      process.exit(2);
    }
    throw new Error(
      "Hay contenido [Unreleased] o desfase de versión pero los commits no justifican bump (revisa los mensajes conventional).",
      { cause: err },
    );
  }
  const date = args.date ?? today();

  const nextPkg = bumpPackageJson(pkgText, version);
  let nextMd = mdText;
  let suffix = "";
  let blocks = 0;
  try {
    const finalized = finalizeChangelog(mdText, version, date);
    nextMd = finalized.changelog;
    suffix = finalized.suffix;
    blocks = finalized.blocks;
  } catch (err) {
    if (!(err instanceof NothingToRelease)) throw err;
    // Árbol ya finalizado (p. ej. --check tras --write): no hay diff de CHANGELOG.
  }

  // La sección aún no existe en disco (modo dry-run/check): si la extracción
  // falla se deriva el snippet del contenido finalizado en memoria.
  let snippet: string;
  try {
    snippet = sh("bash", [EXTRACT_SCRIPT, version, "--readme"], true);
  } catch {
    snippet = "";
  }

  // Para --check/--dry-run del README se compara contra el snippet esperado;
  // si extract-changelog.sh no lo produce (sección sin persistir), se deriva
  // del header finalizado.
  const expectedSnippet =
    snippet ||
    [
      START_MARKER,
      "<details>",
      `<summary><strong>v${version}</strong> (${date})</summary>`,
      "",
      `## [${version}] — ${date}${suffix ? ` · ${suffix}` : ""}`,
      "",
      "</details>",
      END_MARKER,
    ].join("\n");
  const readmeText = readFileSync(README_PATH, "utf8");
  const { readme: nextReadme, updated: readmeApplies } = refreshReadmeSection(
    readmeText,
    expectedSnippet,
  );

  const pkgDiffers = nextPkg !== pkgText;
  const mdDiffers = nextMd !== mdText;
  const readmeDiffers = readmeApplies && nextReadme !== readmeText;

  if (mode === "check") {
    const drift: string[] = [];
    if (currentPkg !== version) drift.push(`package.json: ${currentPkg} ≠ ${version} esperada`);
    if (mdDiffers) drift.push(`CHANGELOG.md: bloques [Unreleased] sin finalizar para v${version}`);
    if (readmeDiffers)
      drift.push(`README.md: bloque RELEASE_SECTION desactualizado para v${version}`);
    if (drift.length > 0) {
      console.error(`Deriva de versionado detectada:\n- ${drift.join("\n- ")}`);
      process.exit(2);
    }
    console.log(`OK: versionado coherente con v${version}`);
    return;
  }

  console.log(`Release v${version} (${date}) · ${blocks} bloque(s) Unreleased → CHANGELOG`);
  console.log(`- package.json: ${currentPkg} → ${version}${pkgDiffers ? "" : " (sin cambios)"}`);
  console.log(`- CHANGELOG.md: ${mdDiffers ? "finaliza Unreleased" : "sin cambios"}`);
  console.log(
    `- README.md: ${readmeApplies ? (readmeDiffers ? "actualiza RELEASE_SECTION" : "sin cambios") : "sin marcadores, se omite"}`,
  );

  if (mode === "dry-run") {
    console.log("\n(dry-run: sin escrituras — usa --write para aplicar)");
    return;
  }

  if (pkgDiffers) writeFileSync(PKG_PATH, nextPkg);
  if (mdDiffers) writeFileSync(CHANGELOG_PATH, nextMd);
  if (readmeDiffers) writeFileSync(README_PATH, nextReadme);
  // Tras persistir el CHANGELOG, el snippet canónico ya es extraíble: si el
  // README aplica, se reescribe con el snippet exacto del workflow.
  if (readmeApplies) {
    const canonical = sh("bash", [EXTRACT_SCRIPT, version, "--readme"]);
    const { readme: finalReadme } = refreshReadmeSection(
      readFileSync(README_PATH, "utf8"),
      canonical,
    );
    writeFileSync(README_PATH, finalReadme);
  }
  console.log(
    "\nAplicado. Siguiente paso: abrir PR, mergear y el workflow `release.yml` taggeará.",
  );
}

const invokedAsMain =
  process.argv[1] !== undefined && import.meta.url === pathToFileURL(process.argv[1]).href;
if (invokedAsMain) {
  try {
    main();
  } catch (err) {
    console.error(`prepare-release: ${(err as Error).message}`);
    process.exit(1);
  }
}
