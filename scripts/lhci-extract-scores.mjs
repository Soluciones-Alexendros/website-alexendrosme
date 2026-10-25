#!/usr/bin/env node
/**
 * Read Lighthouse JSON (lhr-*.json or a full LHR) and print
 * perf/a11y/bp/seo as GitHub Actions outputs (score * 100, integer).
 *
 * Usage: node scripts/lhci-extract-scores.mjs <report.json>
 */
import { readFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

function findReport(explicit) {
  if (explicit && existsSync(explicit)) return explicit;
  const dir = ".lighthouseci";
  if (!existsSync(dir)) return null;
  const files = readdirSync(dir)
    .filter((f) => /^lhr-\d+\.json$/.test(f) || (f.startsWith("lhr-") && f.endsWith(".json")))
    .sort();
  if (files.length) return join(dir, files[files.length - 1]);
  return null;
}

const reportPath = findReport(process.argv[2]);
if (!reportPath) {
  console.error("lhci-extract-scores: no LHR JSON found under .lighthouseci/");
  process.exit(1);
}

const data = JSON.parse(readFileSync(reportPath, "utf8"));
const cats = data.categories;
if (!cats?.performance || !cats?.accessibility || !cats?.["best-practices"] || !cats?.seo) {
  console.error(`lhci-extract-scores: missing categories in ${reportPath}`);
  process.exit(1);
}

const score = (key) => Math.round((cats[key].score ?? 0) * 100);
const perf = score("performance");
const a11y = score("accessibility");
const bp = score("best-practices");
const seo = score("seo");

console.log(`Using report: ${reportPath}`);
console.log(`perf=${perf}`);
console.log(`a11y=${a11y}`);
console.log(`bp=${bp}`);
console.log(`seo=${seo}`);

if (process.env.GITHUB_OUTPUT) {
  const { appendFileSync } = await import("node:fs");
  appendFileSync(process.env.GITHUB_OUTPUT, `perf=${perf}\na11y=${a11y}\nbp=${bp}\nseo=${seo}\n`);
}
