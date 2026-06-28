/**
 * Shared utilities for link parsing and generation.
 *
 * These mirror the helpers used by v2rayNG's `fmt/FmtBase.kt` and
 * `util/Utils.kt` (Base64 URL-safe decode/encode, query-string split/join,
 * URI fix-up) but rely on native Web/Node APIs so the module stays
 * zero-dependency and tree-shakeable.
 */

/**
 * Decode a Base64 (standard or URL-safe) string to UTF-8 text.
 *
 * v2rayNG links occasionally use URL-safe base64 (`-`/`_` instead of `+`/`/`)
 * and frequently omit padding. We normalize both before decoding.
 */
export function decodeBase64(input: string): string {
  let s = input.trim().replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4 !== 0) s += "=";
  const bytes =
    typeof Buffer !== "undefined"
      ? Buffer.from(s, "base64")
      : Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

/**
 * Encode a UTF-8 string to standard Base64 without padding.
 *
 * v2rayNG uses `Utils.encode` (Base64.encodeToString with NO_WRAP) which
 * emits unpadded standard base64; the legacy vmess/ss links follow the same
 * convention.
 */
export function encodeBase64(input: string): string {
  const bytes = new TextEncoder().encode(input);
  const s =
    typeof Buffer !== "undefined"
      ? Buffer.from(bytes).toString("base64")
      : btoa(String.fromCharCode(...bytes));
  return s.replace(/=+$/, "");
}

/**
 * Parse a raw query string (`a=1&b=2`) into a record, URL-decoding values.
 *
 * Mirrors `FmtBase.getQueryParam` which splits on `&` then `=`.
 * Returns an empty object for an empty/undefined input.
 */
export function parseQueryString(raw: string | null | undefined): Record<string, string> {
  const out: Record<string, string> = {};
  if (!raw) return out;
  for (const pair of raw.split("&")) {
    if (!pair) continue;
    const eq = pair.indexOf("=");
    const k = eq === -1 ? pair : pair.slice(0, eq);
    const v = eq === -1 ? "" : pair.slice(eq + 1);
    out[decodeURIComponent(k)] = decodeURIComponent(v.replace(/\+/g, "%20"));
  }
  return out;
}

/**
 * Build a query string from a record, URL-encoding values.
 *
 * Mirrors `FmtBase.toUri` which joins with `&` and encodes each value via
 * `Utils.encodeURIComponent`. Empty-string values are still emitted so that
 * `type=tcp&headerType=none` round-trips faithfully (v2rayNG relies on this).
 */
export function buildQueryString(params: Record<string, string>): string {
  return Object.entries(params)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");
}

/**
 * Fix common URI malformations before passing to `new URL()`.
 *
 * v2rayNG calls `Utils.fixIllegalUrl` which wraps `URI()`; the main issue we
 * hit in JS is IPv6 hosts needing brackets and some clients omitting the `//`
 * after the scheme. We do not replicate Android's IDN rewrite here — `URL`
 * already punycode-encodes unicode hosts.
 */
export function fixUrl(link: string): string {
  let s = link.trim();
  // Ensure `scheme://` form (some ss legacy links use `ss://` already, but
  // `socks5://` without `//` has been seen in the wild).
  const schemeMatch = s.match(/^([a-zA-Z0-9]+):/);
  if (schemeMatch && !s.startsWith(`${schemeMatch[1]}://`)) {
    s = s.replace(/^([a-zA-Z0-9]+):/, `$1://`);
  }
  return s;
}

/**
 * Encode a single URI component, matching `Utils.encodeURIComponent`.
 *
 * `URLSearchParams` plus `encodeURIComponent` cover the same character set
 * v2rayNG targets (everything except `A-Za-z0-9-_.!~*'()`).
 */
export function encodeComponent(s: string): string {
  return encodeURIComponent(s);
}

/**
 * Decode a URI component, matching `Utils.decodeURIComponent`.
 */
export function decodeComponent(s: string): string {
  try {
    return decodeURIComponent(s.replace(/\+/g, "%20"));
  } catch {
    return s;
  }
}
