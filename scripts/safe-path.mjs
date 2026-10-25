/**
 * Resolve a user-controlled path segment against a fixed base directory.
 * Rejects null bytes, Windows absolute paths and any resolution that escapes the base.
 *
 * Leading `/` is treated as site-root relative (static export), never as a
 * filesystem absolute path — that avoids path.join(base, "/etc/passwd") → "/etc/passwd".
 *
 * @param {string} baseDir Absolute or relative base (resolved with path.resolve)
 * @param {string} requestPath Raw request path (may include query / encoding)
 * @returns {string | null} Resolved absolute path inside base, or null if rejected
 */
import { resolve, relative, sep, isAbsolute } from "node:path";

/**
 * @param {string} baseDir
 * @param {string} requestPath
 * @returns {string | null}
 */
export function resolveSafePath(baseDir, requestPath) {
  if (typeof requestPath !== "string" || requestPath.includes("\0")) {
    return null;
  }

  const withoutQuery = requestPath.split("?")[0];
  let decoded;
  try {
    decoded = decodeURIComponent(withoutQuery);
  } catch {
    return null;
  }

  if (decoded.includes("\0")) {
    return null;
  }

  // Reject Windows drive / UNC paths (not URL site paths).
  if (/^[A-Za-z]:[\\/]/.test(decoded) || decoded.startsWith("\\\\")) {
    return null;
  }

  const base = resolve(baseDir);
  // Strip leading slashes so resolve never treats the input as FS-absolute.
  const relativeInput = decoded.replace(/^[/\\]+/, "");
  const resolved = resolve(base, relativeInput);
  const rel = relative(base, resolved);

  if (rel.startsWith("..") || isAbsolute(rel)) {
    return null;
  }

  // Allow the base itself (empty relative) and any descendant under base + sep.
  if (resolved !== base && !resolved.startsWith(base + sep)) {
    return null;
  }

  return resolved;
}
