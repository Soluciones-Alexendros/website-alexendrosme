#!/usr/bin/env node
/**
 * Exit 1 if OSV-Scanner JSON reports any vulnerability with severity
 * high or critical. Medium/low are printed and ignored for the gate.
 *
 * Usage: node scripts/osv-fail-on-high.mjs osv-results.json
 */
import { readFileSync } from "node:fs";

const path = process.argv[2];
if (!path) {
  console.error("Usage: node scripts/osv-fail-on-high.mjs <osv-results.json>");
  process.exit(2);
}

/** @param {unknown} v */
function severityOf(v) {
  if (!v || typeof v !== "object") return "";
  const obj = /** @type {Record<string, unknown>} */ (v);
  const db = obj.database_specific;
  if (db && typeof db === "object") {
    const sev = /** @type {Record<string, unknown>} */ (db).severity;
    if (typeof sev === "string") return sev.toUpperCase();
  }
  if (typeof obj.severity === "string") return obj.severity.toUpperCase();
  return "";
}

const raw = readFileSync(path, "utf8");
/** @type {{ results?: Array<{ packages?: Array<{ package?: { name?: string }, vulnerabilities?: unknown[] }> }> }} */
let data;
try {
  data = JSON.parse(raw);
} catch (err) {
  console.error("osv-fail-on-high: JSON inválido:", err /** @type {Error} */.message);
  process.exit(2);
}

/** @type {Array<{ id: string, pkg: string, severity: string }>} */
const highs = [];
/** @type {Array<{ id: string, pkg: string, severity: string }>} */
const others = [];

for (const result of data.results ?? []) {
  for (const pkgEntry of result.packages ?? []) {
    const pkgName = pkgEntry.package?.name ?? "(unknown)";
    for (const vuln of pkgEntry.vulnerabilities ?? []) {
      if (!vuln || typeof vuln !== "object") continue;
      const v = /** @type {Record<string, unknown>} */ (vuln);
      const id = typeof v.id === "string" ? v.id : "(no-id)";
      const severity = severityOf(vuln) || "UNKNOWN";
      const row = { id, pkg: pkgName, severity };
      if (severity === "HIGH" || severity === "CRITICAL") highs.push(row);
      else others.push(row);
    }
  }
}

if (others.length) {
  console.log(`OSV medium/low/unknown (${others.length}):`);
  for (const r of others) console.log(`  - ${r.severity} ${r.id} (${r.pkg})`);
}

if (highs.length) {
  console.error(`OSV high/critical (${highs.length}):`);
  for (const r of highs) console.error(`  - ${r.severity} ${r.id} (${r.pkg})`);
  process.exit(1);
}

console.log("OSV gate: 0 high/critical");
