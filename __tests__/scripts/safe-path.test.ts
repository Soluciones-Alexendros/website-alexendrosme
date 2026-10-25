// @vitest-environment node
import { describe, expect, it } from "vitest";
import { resolve, join } from "node:path";
import { resolveSafePath } from "../../scripts/safe-path.mjs";

const BASE = resolve("/tmp/audit-out-fixture");

describe("resolveSafePath", () => {
  it("resuelve una ruta interna bajo el base", () => {
    const got = resolveSafePath(BASE, "/opinion/critica-tecnologica.html");
    expect(got).toBe(join(BASE, "opinion/critica-tecnologica.html"));
  });

  it("resuelve el índice raíz", () => {
    expect(resolveSafePath(BASE, "/")).toBe(BASE);
    expect(resolveSafePath(BASE, "")).toBe(BASE);
  });

  it("trata /etc/passwd como ruta bajo el base (no FS absoluto)", () => {
    // Without the strip, path.join(base, "/etc/passwd") would escape to /etc/passwd.
    expect(resolveSafePath(BASE, "/etc/passwd")).toBe(join(BASE, "etc/passwd"));
  });

  it("rechaza path traversal con ../", () => {
    expect(resolveSafePath(BASE, "/../etc/passwd")).toBeNull();
    expect(resolveSafePath(BASE, "/opinion/../../etc/passwd")).toBeNull();
    expect(resolveSafePath(BASE, "../secret")).toBeNull();
  });

  it("rechaza rutas absolutas de Windows", () => {
    expect(resolveSafePath(BASE, "C:\\Windows\\System32")).toBeNull();
    expect(resolveSafePath(BASE, "D:/secret")).toBeNull();
  });

  it("rechaza traversal URL-encoded (%2e%2e%2f)", () => {
    expect(resolveSafePath(BASE, "/%2e%2e/%2e%2e/etc/passwd")).toBeNull();
    expect(resolveSafePath(BASE, "/%2e%2e%2fetc%2fpasswd")).toBeNull();
  });

  it("rechaza null bytes", () => {
    expect(resolveSafePath(BASE, "/index.html\0.png")).toBeNull();
    expect(resolveSafePath(BASE, "/index%00.html")).toBeNull();
  });

  it("ignora query string", () => {
    const got = resolveSafePath(BASE, "/index.html?q=1");
    expect(got).toBe(join(BASE, "index.html"));
  });

  it("rechaza decodeURIComponent inválido", () => {
    expect(resolveSafePath(BASE, "/%E0%A4%A")).toBeNull();
  });
});
