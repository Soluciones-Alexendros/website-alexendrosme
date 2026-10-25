#!/usr/bin/env node

/**
 * Accessibility audit runner — serves the static export and runs axe-core
 * on every route, reporting violations in a structured format.
 *
 * Usage: node scripts/a11y-audit.mjs
 */

import { createServer } from "node:http";
import { readFileSync, existsSync, statSync } from "node:fs";
import { join, extname } from "node:path";
import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { resolveSafePath } from "./safe-path.mjs";

const PORT = 3444;
const OUT_DIR = new URL("../out", import.meta.url).pathname;
const BASE_URL = `http://localhost:${PORT}`;

/**
 * @param {string} candidate Relative path under OUT_DIR (no leading user URL)
 * @returns {string | null}
 */
function safeUnderOut(candidate) {
  return resolveSafePath(OUT_DIR, candidate);
}

// ── MIME types ──
const MIME = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
  ".xml": "application/xml",
  ".atom": "application/atom+xml",
  ".txt": "text/plain",
};

/**
 * Resolve a request path to a Next.js static export file.
 * Next.js export produces e.g.:
 *   / → /index.html
 *   /opinion → /opinion.html
 *   /opinion/ejemplo → /opinion/ejemplo.html
 *   /opinion/ejemplo/ → directory with extracted assets
 */
function resolvePath(urlPath) {
  const path = (urlPath ?? "").split("?")[0];

  /** @param {string} rel */
  const tryFile = (rel) => {
    const safe = safeUnderOut(rel);
    if (!safe) return null;
    if (existsSync(safe) && statSync(safe).isFile()) return safe;
    return null;
  };

  // Direct match under OUT_DIR
  const direct = tryFile(path);
  if (direct) return direct;

  // Try with .html extension (Next.js static export pattern)
  const asHtml = tryFile(`${path.replace(/\/$/, "")}.html`);
  if (asHtml) return asHtml;

  // Try as directory with index.html
  const asIndex = tryFile(join(path, "index.html"));
  if (asIndex) return asIndex;

  // For root, serve index.html
  if (path === "/" || path === "") {
    const rootIndex = tryFile("index.html");
    if (rootIndex) return rootIndex;
  }

  // Fallback: 404 page (still constrained to OUT_DIR)
  return tryFile("404.html");
}

// ── Static server ──
function startServer() {
  return new Promise((resolve) => {
    const server = createServer((req, res) => {
      const filePath = resolvePath(req.url);
      if (!filePath) {
        res.writeHead(404);
        res.end("Not found");
        return;
      }
      try {
        const content = readFileSync(filePath);
        const ext = extname(filePath).toLowerCase();
        res.writeHead(200, {
          "Content-Type": MIME[ext] ?? "application/octet-stream",
          "Cache-Control": "no-cache",
        });
        res.end(content);
      } catch {
        res.writeHead(404);
        res.end("Not found");
      }
    });
    server.listen(PORT, () => {
      console.log(`Static server at ${BASE_URL}`);
      resolve(server);
    });
  });
}

// ── Routes to audit — covers all site pages ──
const ROUTES = [
  { name: "home", path: "/" },
  { name: "opinion (collection)", path: "/opinion" },
  { name: "opinion: crítica tecnológica", path: "/opinion/critica-tecnologica" },
  { name: "opinion: manifiesto elígete a ti", path: "/opinion/manifiesto-eligete-a-ti" },
  { name: "opinion: soberanía digital", path: "/opinion/soberania-digital" },
  { name: "opinion: escape del feudo", path: "/opinion/escape-del-feudo-algoritmico" },
  { name: "opinion: protocolos vs plataformas", path: "/opinion/protocolos-vs-plataformas" },
  { name: "tags (index)", path: "/tags" },
  { name: "tags: Alexendros", path: "/tags/alexendros" },
  { name: "legal: aviso legal", path: "/legal/aviso-legal" },
  { name: "legal: privacidad", path: "/legal/privacidad" },
  { name: "legal: cookies", path: "/legal/cookies" },
  { name: "legal: licencia", path: "/legal/licencia" },
  { name: "error 404", path: "/nonexistent-page" },
];

// ── Main ──
async function main() {
  const server = await startServer();
  let browser;
  let allViolations = [];

  try {
    browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });

    for (const route of ROUTES) {
      const page = await context.newPage();
      const url = `${BASE_URL}${route.path}`;

      try {
        await page.goto(url, { waitUntil: "networkidle", timeout: 20000 });
        // Wait for React hydration to complete
        await page.waitForTimeout(1000);

        const results = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
          .analyze();

        if (results.violations.length > 0) {
          allViolations.push({
            route: route.name,
            path: route.path,
            violations: results.violations.map((v) => ({
              id: v.id,
              impact: v.impact,
              description: v.description,
              help: v.help,
              helpUrl: v.helpUrl,
              nodes: v.nodes.map((n) => ({
                target: n.target.join(", "),
                html: n.html.slice(0, 200),
                failureSummary: n.failureSummary,
                allRelatedNodes: n.all.map((rn) => rn.html).slice(0, 3),
              })),
            })),
          });

          console.error(
            `\n❌ ${route.name} (${route.path}) — ${results.violations.length} violations`,
          );
          for (const v of results.violations) {
            console.error(`  [${v.impact}] WCAG:${v.id}: ${v.description}`);
            for (const n of v.nodes) {
              console.error(`    → ${n.target.join(", ")}`);
              console.error(`      ${n.html.slice(0, 150)}`);
            }
          }
        } else {
          console.log(`✅ ${route.name} — 0 violations`);
        }
      } catch (err) {
        console.error(`⚠️  ${route.name} (${route.path}) — Error: ${err.message}`);
      } finally {
        await page.close();
      }
    }
  } finally {
    if (browser) await browser.close();
    server.close();
  }

  // ── Summary ──
  const totalViolations = allViolations.reduce((sum, r) => sum + r.violations.length, 0);
  const routesWithIssues = allViolations.length;

  console.log(`\n${"=".repeat(60)}`);
  console.log("ACCESIBILITY AUDIT SUMMARY — WCAG 2.1 AA (axe-core)");
  console.log(`${"=".repeat(60)}`);
  console.log(`Routes audited: ${ROUTES.length}`);
  console.log(`Routes with violations: ${routesWithIssues}`);
  console.log(`Total violations: ${totalViolations}`);

  if (totalViolations > 0) {
    console.log(`\n### VIOLATIONS BY ROUTE ###`);
    for (const route of allViolations) {
      console.log(`\n**${route.route}** (${route.path})`);
      for (const v of route.violations) {
        console.log(`- [${v.impact}] ${v.id}: ${v.help}`);
        console.log(`  ${v.helpUrl}`);
        for (const n of v.nodes) {
          console.log(`  Fix: ${n.failureSummary?.split("\n")[0] ?? "See help link"}`);
          console.log(`  Element: ${n.html.slice(0, 120)}`);
        }
      }
    }
    console.log(
      `\n❌ FAIL — ${totalViolations} violations found across ${routesWithIssues} routes`,
    );
    process.exit(1);
  } else {
    console.log(`\n✅ PASS — All routes clean, no WCAG 2.1 AA violations`);
  }
}

main().catch((err) => {
  console.error("Fatal:", err);
  process.exit(1);
});
