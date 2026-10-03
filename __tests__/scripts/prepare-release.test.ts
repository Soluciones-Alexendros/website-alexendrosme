import { describe, expect, it } from "vitest";
import {
  bumpPackageJson,
  compareSemver,
  finalizeChangelog,
  hasPendingUnreleased,
  parseVersion,
  refreshReadmeSection,
} from "../../scripts/prepare-release";

describe("parseVersion", () => {
  it("acepta semver limpio y con v", () => {
    expect(parseVersion("0.13.1")).toEqual({ major: 0, minor: 13, patch: 1 });
    expect(parseVersion("v1.2.3")).toEqual({ major: 1, minor: 2, patch: 3 });
  });

  it("rechaza no-semver", () => {
    expect(() => parseVersion("1.2")).toThrow();
    expect(() => parseVersion("abc")).toThrow();
  });
});

describe("compareSemver", () => {
  it("ordena por major.minor.patch", () => {
    expect(compareSemver("0.13.1", "0.13.0")).toBe(1);
    expect(compareSemver("0.9.0", "0.10.0")).toBe(-1);
    expect(compareSemver("1.0.0", "1.0.0")).toBe(0);
  });
});

describe("bumpPackageJson", () => {
  it("cambia solo la versión preservando formato 2-espacios + newline", () => {
    const before = '{\n  "name": "x",\n  "version": "0.8.0"\n}\n';
    const after = bumpPackageJson(before, "0.13.1");
    expect(after).toBe('{\n  "name": "x",\n  "version": "0.13.1"\n}\n');
  });

  it("rechaza versión inválida", () => {
    expect(() => bumpPackageJson('{"version":"0.8.0"}', "nope")).toThrow();
  });
});

const UNRELEASED_MD = `# Changelog

Texto introductorio.

## [Unreleased] · Primera parte

### Añadido

- Algo nuevo.

## [Unreleased] · Segunda parte

### Corregido

- Un fix.

## [0.13.0] — 2026-10-01 · Anterior

- Histórico.
`;

describe("finalizeChangelog", () => {
  it("fusiona bloques Unreleased en una sección versionada", () => {
    const { changelog, suffix, blocks } = finalizeChangelog(UNRELEASED_MD, "0.13.1", "2026-10-03");
    expect(blocks).toBe(2);
    expect(suffix).toBe("Primera parte + Segunda parte");
    expect(changelog).toContain("## [0.13.1] — 2026-10-03 · Primera parte + Segunda parte");
    expect(changelog.startsWith("# Changelog\n\nTexto introductorio.\n\n## [0.13.1]")).toBe(true);
    expect(changelog).toContain("- Algo nuevo.");
    expect(changelog).toContain("- Un fix.");
    expect(changelog).toContain("## [0.13.0] — 2026-10-01 · Anterior");
    expect(changelog).not.toContain("[Unreleased]");
  });

  it("lanza si no hay Unreleased", () => {
    expect(() =>
      finalizeChangelog("# Changelog\n\n## [1.0.0] — 2026-01-01\n", "1.0.1", "2026-10-03"),
    ).toThrow();
  });

  it("lanza con fecha inválida", () => {
    expect(() => finalizeChangelog(UNRELEASED_MD, "0.13.1", "ayer")).toThrow();
  });
});

describe("hasPendingUnreleased", () => {
  it("detecta bloques pendientes antes de la primera sección versionada", () => {
    expect(hasPendingUnreleased(UNRELEASED_MD)).toBe(true);
    expect(hasPendingUnreleased("# C\n\n## [1.0.0] — 2026-01-01\n")).toBe(false);
    expect(hasPendingUnreleased("# C\n")).toBe(false);
  });
});

describe("refreshReadmeSection", () => {
  const SNIPPET =
    "<!-- RELEASE_SECTION_START -->\n<details>\n</details>\n<!-- RELEASE_SECTION_END -->";

  it("sustituye la región con marcadores sin duplicarlos", () => {
    const readme =
      "# T\n\n<!-- RELEASE_SECTION_START -->\nantiguo\n<!-- RELEASE_SECTION_END -->\n\nFin\n";
    const { readme: out, updated } = refreshReadmeSection(readme, SNIPPET);
    expect(updated).toBe(true);
    expect(out).toContain(SNIPPET.trim());
    expect(out).toContain("Fin");
    expect(out).not.toContain("antiguo");
    expect(out.match(/<!-- RELEASE_SECTION_START -->/g)).toHaveLength(1);
    expect(out.match(/<!-- RELEASE_SECTION_END -->/g)).toHaveLength(1);
  });

  it("es byte-idéntico al reescribir una región ya canónica (idempotente)", () => {
    const canon = [
      "# T",
      "",
      "<!-- RELEASE_SECTION_START -->",
      "<details>",
      "</details>",
      "<!-- RELEASE_SECTION_END -->",
      "",
      "Fin",
      "",
    ].join("\n");
    const snippet = [
      "<!-- RELEASE_SECTION_START -->",
      "<details>",
      "</details>",
      "<!-- RELEASE_SECTION_END -->",
    ].join("\n");
    const { readme: out, updated } = refreshReadmeSection(canon, snippet);
    expect(updated).toBe(true);
    expect(out).toBe(canon);
  });

  it("no-op sin marcadores", () => {
    const { readme: out, updated } = refreshReadmeSection("# Sin marcas\n", SNIPPET);
    expect(updated).toBe(false);
    expect(out).toBe("# Sin marcas\n");
  });
});
