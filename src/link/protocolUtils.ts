/**
 * Shared protocol helpers that read from `protocolMap` in `linkMap.ts`.
 *
 * These functions handle the common logic shared by all URI-based protocol
 * parsers and generators:
 *   - Credential extraction (URI username → outbound path)
 *   - Extra field mapping (encryption, flow, etc.)
 *   - Address/port extraction from inbounds (clients[]/users[] arrays)
 *   - URI assembly
 *   - Forced values and default security
 */

import type { ProtocolNode } from "./linkMap.ts";
import { flattenStreamSettings, type QueryParams } from "./streamSettings.ts";
import { buildQueryString, encodeComponent, encodeBase64 } from "./base.ts";

/* ------------------------------------------------------------------ *
 * Parse direction: link → outbound
 * ------------------------------------------------------------------ */

interface ParseArgs {
  address: string;
  port: number;
  /** Single credential (for username-based protocols). */
  credential?: string;
  /** Composite credential parts (for userinfo-based protocols like ss, socks). */
  credentialParts?: string[];
  queryParams: QueryParams;
}

/**
 * Build an outbound object from protocol mapping fields.
 * Reads `proto.credential`/`proto.compositeCredential` and `proto.extra`.
 */
export function applyProtocolFields(proto: ProtocolNode, args: ParseArgs): Record<string, any> {
  const outbound: Record<string, any> = {
    protocol: proto.protocolName || proto.scheme,
    settings: {
      address: args.address,
      port: args.port,
    },
  };

  // Single credential → outbound path
  if (proto.credential && args.credential !== undefined) {
    setPath(outbound, proto.credential.to, args.credential);
  }

  // Composite credential → multiple outbound paths
  if (proto.compositeCredential && args.credentialParts) {
    const { fields } = proto.compositeCredential;
    for (let i = 0; i < fields.length; i++) {
      if (args.credentialParts[i] !== undefined) {
        setPath(outbound, fields[i]!, args.credentialParts[i]);
      }
    }
  }

  // Extra fields (encryption, flow, etc.)
  if (proto.extra) {
    for (const [param, spec] of Object.entries(proto.extra)) {
      const raw = args.queryParams[param];
      if (raw !== undefined && raw !== "") {
        setPath(outbound, spec.to, raw);
      } else if (spec.default !== undefined) {
        setPath(outbound, spec.to, spec.default);
      }
    }
  }

  return outbound;
}

/**
 * Apply forced values and default security to query params before
 * building stream settings.
 *
 * - `proto.forced`: set specific query params (hysteria2: type=hysteria, security=tls, alpn=h3)
 * - `proto.defaultSecurity`: set security if absent (trojan: tls)
 */
export function prepareQueryParams(proto: ProtocolNode, q: QueryParams): QueryParams {
  const prepared = { ...q };

  if (proto.forced) {
    for (const [k, v] of Object.entries(proto.forced)) {
      prepared[k] = v;
    }
  }

  if (proto.defaultSecurity && !prepared["security"]) {
    prepared["security"] = proto.defaultSecurity;
  }

  return prepared;
}

/* ------------------------------------------------------------------ *
 * Generate direction: inbound → link
 * ------------------------------------------------------------------ */

/**
 * Extract the credential from an inbound (or outbound-like) object.
 *
 * For single-credential protocols: reads from `proto.credential.to` path,
 * with clients[]/users[] fallback.
 * For composite-credential protocols: reads from `proto.compositeCredential.fields`.
 * Returns a string for single credential, or `method:password` format for composite.
 */
function extractCredential(proto: ProtocolNode, obj: Record<string, any>): string | undefined {
  // Composite credential (ss, socks)
  if (proto.compositeCredential) {
    const { fields, separator } = proto.compositeCredential;
    const parts: string[] = [];
    for (const fieldPath of fields) {
      const fieldName = fieldPath.split(".")[1];
      if (!fieldName) continue;
      const settings = obj.settings;
      let value: any;
      if (settings?.clients?.[0]?.[fieldName]) {
        value = settings.clients[0][fieldName];
      } else if (settings?.users?.[0]?.[fieldName]) {
        value = settings.users[0][fieldName];
      } else if (settings?.[fieldName]) {
        value = settings[fieldName];
      }
      parts.push(value || "");
    }
    if (parts.every((p) => !p)) return undefined;
    return parts.join(separator);
  }

  // Single credential
  if (!proto.credential) return undefined;
  const toPath = proto.credential.to;

  // If credential lives in streamSettings (hysteria2), read directly
  if (toPath.startsWith("streamSettings.")) {
    return getPath(obj, toPath);
  }

  // Extract field name from "settings.<field>" path
  const fieldName = toPath.split(".")[1];
  if (!fieldName) return undefined;

  const settings = obj.settings;
  if (!settings) return undefined;

  if (settings.clients?.[0]?.[fieldName]) {
    return settings.clients[0][fieldName];
  }
  if (settings.users?.[0]?.[fieldName]) {
    return settings.users[0][fieldName];
  }
  if (settings[fieldName]) {
    return settings[fieldName];
  }

  return undefined;
}

/**
 * Extract extra field values from an inbound for link generation.
 * Same clients[]/users[]/flat fallback as credential extraction.
 */
function extractExtraFields(proto: ProtocolNode, obj: Record<string, any>): QueryParams {
  const q: QueryParams = {};
  if (!proto.extra) return q;

  const settings = obj.settings;

  for (const [param, spec] of Object.entries(proto.extra)) {
    const fieldName = spec.to.split(".")[1];
    if (!fieldName) continue;

    let value: any;
    if (settings?.clients?.[0]?.[fieldName]) {
      value = settings.clients[0][fieldName];
    } else if (settings?.users?.[0]?.[fieldName]) {
      value = settings.users[0][fieldName];
    } else if (settings?.[fieldName]) {
      value = settings[fieldName];
    }

    if (value !== undefined && value !== "") {
      q[param] = String(value);
    }
  }

  return q;
}

/**
 * Build a complete protocol link from an inbound.
 *
 * This is the shared implementation used by all URI-based protocol generators
 * (vless, trojan, hysteria2). VMess has its own legacy JSON format and
 * doesn't use this function.
 */
export function buildProtocolLink(proto: ProtocolNode, inbound: Record<string, any>): string {
  const credential = extractCredential(proto, inbound);
  if (!credential) throw new Error(`${proto.scheme} inbound has no credential`);

  const settings = inbound.settings;
  const address = settings?.address || inbound.listen || "0.0.0.0";
  const port = settings?.port || inbound.port;
  if (!port) throw new Error(`${proto.scheme} inbound is missing port`);

  // Flatten stream settings → query params
  let q: QueryParams = flattenStreamSettings(inbound.streamSettings);

  // Add extra fields (encryption, flow, etc.)
  const extraQ = extractExtraFields(proto, inbound);
  Object.assign(q, extraQ);

  // Build userinfo — composite credentials are base64-encoded
  let userInfo: string;
  if (proto.compositeCredential?.mayBeBase64) {
    userInfo = encodeBase64(credential);
  } else {
    userInfo = encodeComponent(credential);
  }

  const host = address.includes(":") ? `[${address}]` : address;
  const query = buildQueryString(q);
  const remarks = inbound.tag || "";

  return `${proto.scheme}://${userInfo}@${host}:${port}${query ? `?${query}` : ""}#${encodeComponent(remarks)}`;
}

/* ------------------------------------------------------------------ *
 * Path helpers (same as in streamSettings.ts — kept local for tree-shaking)
 * ------------------------------------------------------------------ */

function setPath(obj: Record<string, any>, path: string, value: any): void {
  const parts = path.split(".");
  let cur = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const key = parts[i]!;
    if (!cur[key]) cur[key] = {};
    cur = cur[key];
  }
  cur[parts[parts.length - 1]!] = value;
}

function getPath(obj: Record<string, any>, path: string): any {
  const parts = path.split(".");
  let cur = obj;
  for (const p of parts) {
    if (cur == null) return undefined;
    cur = cur[p];
  }
  return cur;
}
