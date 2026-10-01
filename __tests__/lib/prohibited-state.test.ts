// @vitest-environment node
import { describe, it, expect } from "vitest";
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(__dirname, "../..");

const SCAN_DIRS = ["app", "components", "lib", "scripts", "public"];
const SCAN_FILES = ["vercel.json", "package.json"];

const EXCLUDE = [
  "node_modules",
  `${path.sep}out${path.sep}`,
  `${path.sep}.next${path.sep}`,
  `${path.sep}coverage${path.sep}`,
  `${path.sep}test-results${path.sep}`,
  `${path.sep}playwright-report${path.sep}`,
  "prohibited-state.test.ts",
];

const TEXT_EXT = /\.(ts|tsx|js|jsx|mjs|cjs|json|css|md|mdx|xml|atom|txt|webmanifest)$/;

function collectFiles(): string[] {
  const files: string[] = [];
  const walk = (dir: string) => {
    if (!fs.existsSync(dir)) return;
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (EXCLUDE.some((ex) => full.includes(ex))) continue;
      if (entry.isDirectory()) walk(full);
      else if (TEXT_EXT.test(entry.name)) files.push(full);
    }
  };
  for (const d of SCAN_DIRS) walk(path.join(ROOT, d));
  for (const f of SCAN_FILES) {
    const full = path.join(ROOT, f);
    if (fs.existsSync(full)) files.push(full);
  }
  return files;
}

const FORBIDDEN: { label: string; pattern: RegExp }[] = [
  { label: "colección Proyectos", pattern: /\bproyectos\b/i },
  { label: "ruta /projects o palabra projects", pattern: /\bprojects\b/i },
  { label: "identificador project-card/project-grid", pattern: /project-(card|grid)/i },
  {
    label: "clave sectionProyectos/backProyectos/proyectosLink",
    pattern: /(section|back)Proyectos|proyectos(Link|Label)|PROYECTOS_THEME/,
  },
  { label: "Telegram", pattern: /telegram/i },
  { label: "Matrix", pattern: /\bmatrix\b/i },
  { label: "sello €Ç", pattern: /€Ç/ },
  { label: "F.A.F.O.", pattern: /F\.A\.F\.O\./ },
  { label: "texto anticomercial informal", pattern: /anticomercial/i },
  { label: "cita retirada del pie", pattern: /de qué sirve el dinero/i },
];

describe("estado prohibido (contrato de producto)", () => {
  const files = collectFiles();

  it("encuentra archivos a analizar", () => {
    expect(files.length).toBeGreaterThan(50);
  });

  for (const { label, pattern } of FORBIDDEN) {
    it(`no queda ningún rastro funcional de: ${label}`, () => {
      const offenders = files.filter((f) => pattern.test(fs.readFileSync(f, "utf8")));
      expect(offenders, `Coincidencias en:\n${offenders.join("\n")}`).toEqual([]);
    });
  }

  it("el pie tiene exactamente un mailto canónico", () => {
    const footer = fs.readFileSync(path.join(ROOT, "components/footer.tsx"), "utf8");
    const mailtos = footer.match(/mailto:/g) ?? [];
    expect(mailtos).toHaveLength(1);
  });

  it("la configuración del sitio no expone canales retirados", () => {
    const site = fs.readFileSync(path.join(ROOT, "lib/site.ts"), "utf8");
    expect(site).not.toMatch(/telegram|matrix/i);
    expect(site).toMatch(/contact:\s*\{\s*email:/);
  });
});
