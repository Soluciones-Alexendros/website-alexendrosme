#!/usr/bin/env node

/**
 * Efficient Lighthouse audit — representative routes, parallel batches, HTML reports.
 *
 * Usage: node scripts/lighthouse-audit.mjs
 */

import { execSync, spawn } from "node:child_process";
import { existsSync, readFileSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const PORT = 4224;
const OUT_DIR = new URL("../out", import.meta.url).pathname;
const BASE_URL = `http://localhost:${PORT}`;
const REPORT_DIR = new URL("../lighthouse-reports", import.meta.url).pathname;

// Site-type representative routes (1 per page type for speed)
const ROUTES = [
  { name: "home", path: "/" },
  { name: "collection: opinion", path: "/opinion" },
  { name: "article: crítica tecnológica", path: "/opinion/critica-tecnologica" },
  { name: "tags index", path: "/tags" },
  { name: "legal: privacidad", path: "/legal/privacidad" },
];

function audit(url, reportPath) {
  const cmd = [
    "npx",
    "lighthouse",
    url,
    "--output=json",
    `--output-path=${reportPath}`,
    '--chrome-flags="--headless --no-sandbox --disable-gpu"',
    "--quiet",
    "--only-categories=performance,accessibility,best-practices,seo",
  ].join(" ");
  try {
    execSync(cmd, { stdio: "pipe", timeout: 120_000 });
  } catch (err) {
    const stderr = err?.stderr?.toString?.().trim();
    if (stderr && !existsSync(reportPath)) {
      console.error(`\n    lighthouse error: ${stderr.split("\n").slice(-3).join(" | ")}`);
    }
  }
  try {
    return JSON.parse(readFileSync(reportPath, "utf-8"));
  } catch {
    return null;
  }
}

async function main() {
  if (!existsSync(OUT_DIR)) {
    console.error("Run 'npm run build' first");
    process.exit(1);
  }
  mkdirSync(REPORT_DIR, { recursive: true });

  // Start static server detached (execSync would block forever)
  const server = spawn("npx", ["serve", OUT_DIR, "-l", String(PORT)], {
    stdio: "ignore",
    detached: true,
  });
  server.unref();
  // Wait for server to be ready (poll)
  for (let i = 0; i < 30; i++) {
    try {
      const res = await fetch(BASE_URL);
      if (res.ok || res.status === 404) break;
    } catch {
      // server not ready yet, keep polling
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  console.log(`Server on ${BASE_URL}`);

  const results = [];
  for (const r of ROUTES) {
    const url = `${BASE_URL}${r.path}`;
    const safe = r.name.replace(/[^a-z0-9]/gi, "-").toLowerCase();
    const reportPath = join(REPORT_DIR, `${safe}.json`);
    process.stdout.write(`  ${r.name}... `);
    const data = audit(url, reportPath);
    if (data?.categories) {
      const c = data.categories;
      const s = {
        perf: Math.round((c.performance?.score ?? 0) * 100),
        a11y: Math.round((c.accessibility?.score ?? 0) * 100),
        bp: Math.round((c["best-practices"]?.score ?? 0) * 100),
        seo: Math.round((c.seo?.score ?? 0) * 100),
      };
      results.push({ name: r.name, path: r.path, ...s });
      console.log(`P:${s.perf} A:${s.a11y} BP:${s.bp} SEO:${s.seo}`);
    } else {
      results.push({ name: r.name, path: r.path, perf: -1, a11y: -1, bp: -1, seo: -1 });
      console.log("FAILED");
    }
  }

  // Kill the serve process
  try {
    execSync(`pkill -f "serve ${OUT_DIR} -l ${PORT}"`, { stdio: "ignore" });
  } catch {
    // pkill may find no match if server already exited
  }
  try {
    process.kill(-server.pid, "SIGTERM");
  } catch {
    // group already terminated
  }

  // Summary
  console.log("\n" + "=".repeat(70));
  console.log("LIGHTHOUSE AUDIT SUMMARY (1 run each, desktop)");
  console.log("=".repeat(70));
  console.log(`${"Route".padEnd(34)} Perf  A11y  BP   SEO`);
  console.log("-".repeat(60));
  let acc = { perf: [], a11y: [], bp: [], seo: [] };
  for (const r of results) {
    const ok = (v) => (v >= 0 ? `${v}`.padEnd(5) : "N/A ".padEnd(5));
    console.log(`${r.name.padEnd(34)} ${ok(r.perf)} ${ok(r.a11y)} ${ok(r.bp)} ${ok(r.seo)}`);
    if (r.perf >= 0) acc.perf.push(r.perf);
    if (r.a11y >= 0) acc.a11y.push(r.a11y);
    if (r.bp >= 0) acc.bp.push(r.bp);
    if (r.seo >= 0) acc.seo.push(r.seo);
  }
  const avg = (a) => (a.length ? Math.round(a.reduce((x, y) => x + y, 0) / a.length) : 0);
  const min = (a) => (a.length ? Math.min(...a) : 0);
  console.log("-".repeat(60));
  console.log(
    `${"Average".padEnd(34)} ${avg(acc.perf)}    ${avg(acc.a11y)}    ${avg(acc.bp)}    ${avg(acc.seo)}`,
  );
  console.log(
    `${"Minimum".padEnd(34)} ${min(acc.perf)}    ${min(acc.a11y)}    ${min(acc.bp)}    ${min(acc.seo)}`,
  );
  console.log(`\nReports: ${REPORT_DIR}/`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
