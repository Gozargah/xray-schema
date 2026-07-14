/**
 * Thin interpreter that walks the `linkMap.ts` tree.
 *
 * `buildStreamSettings`   → query params → nested streamSettings (parse direction)
 * `flattenStreamSettings` → nested streamSettings → query params (serialize direction)
 *
 * All mapping logic lives in `linkMap.ts`. This file just walks the tree
 * and applies transforms/fallbacks/conditions.
 */

import {
  transportMap,
  securityMap,
  DEPRECATED_NETWORKS,
  isDomainName,
  type FieldNode,
  type ParseCtx,
} from "./linkMap.ts";

export type StreamSettings = Record<string, any>;
export type QueryParams = Record<string, string>;

/* ------------------------------------------------------------------ *
 * buildStreamSettings — query params → nested streamSettings
 * ------------------------------------------------------------------ */

export function buildStreamSettings(
  q: QueryParams,
  server?: string,
  extra?: { authPassword?: string },
): StreamSettings | undefined {
  const network = (q["type"] || "tcp").toLowerCase();

  if (DEPRECATED_NETWORKS.has(network)) {
    throw new Error(
      `Unsupported transport: "${network}" has been removed from Xray core. ` +
        `Please switch to xhttp. (link param type=${network})`,
    );
  }

  const ss: StreamSettings = {};
  const ctx: ParseCtx = { server, authPassword: extra?.authPassword };

  // 1. Transport -------------------------------------------------------
  const transportSni = applyTransport(ss, network, q, ctx);

  // 2. Security --------------------------------------------------------
  const security = q["security"];
  if (security === "tls" || security === "reality") {
    applySecurity(ss, security, q, server, transportSni);
  }

  // 3. finalmask override (fm param replaces generated finalmask) ----
  const fm = q["fm"];
  if (fm) {
    try {
      ss.finalmask = JSON.parse(fm);
    } catch {
      // keep generated finalmask
    }
  }

  return Object.keys(ss).length > 0 ? ss : undefined;
}

/** Walk a transport node. Returns transport-derived SNI hint. */
function applyTransport(
  ss: StreamSettings,
  network: string,
  q: QueryParams,
  ctx: ParseCtx,
): string | undefined {
  const node = transportMap[network] ?? transportMap["tcp"]!;
  ss.method = node.method || network;

  // If the node has a transform, use it (tcp, raw, hysteria)
  if (node.transform) {
    const result = node.transform.parse(q, ctx);
    if (node.settingsKey && result.settings) {
      ss[node.settingsKey] = result.settings;
    }
    if (result.finalmask) {
      ss.finalmask = result.finalmask;
    }
    return result.sniHint;
  }

  // Walk declarative fields
  let sniHint: string | undefined;
  if (node.fields) {
    const settings: Record<string, any> = {};
    for (const [param, fieldNode] of Object.entries(node.fields)) {
      const resolved = resolveFieldNode(fieldNode);
      const raw = q[param];
      if (raw === undefined || raw === "") {
        if (resolved.default !== undefined) {
          setPath(settings, resolved.path, resolved.default);
        }
        continue;
      }
      if (resolved.skipIf && q[resolved.skipIf]) continue;
      const value = resolved.parse ? resolved.parse(raw, ctx) : raw;
      setPath(settings, resolved.path, value);
      if (node.sniHint === param && value) sniHint = String(value);
    }
    if (node.settingsKey && Object.keys(settings).length > 0) {
      ss[node.settingsKey] = settings;
    }
  }

  // Extra transform (kcp finalmask)
  if (node.extraTransform) {
    const extra = node.extraTransform.parse(q, ctx);
    for (const [k, v] of Object.entries(extra)) {
      ss[k] = v;
    }
  }

  return sniHint;
}

/** Walk a security node (tls or reality). */
function applySecurity(
  ss: StreamSettings,
  security: string,
  q: QueryParams,
  server: string | undefined,
  transportSni: string | undefined,
): void {
  const node = securityMap[security as keyof typeof securityMap];
  if (!node) return;

  ss.security = security;
  const settings: Record<string, any> = {};

  // Resolve SNI with fallback chain
  let sni: string | undefined;
  const sniParam = q["sni"];
  if (sniParam) {
    sni = sniParam;
  } else if (transportSni && isDomainName(transportSni)) {
    sni = transportSni;
  } else if (server && isDomainName(server)) {
    sni = server;
  } else {
    sni = transportSni;
  }

  if (node.fields) {
    for (const [param, fieldNode] of Object.entries(node.fields)) {
      const resolved = resolveFieldNode(fieldNode);

      // SNI fallback: use resolved sni if param absent
      if (resolved.sniFallback) {
        if (sni) setPath(settings, resolved.path, sni);
        continue;
      }

      const raw = q[param];
      if (raw === undefined || raw === "") {
        if (resolved.default !== undefined) {
          setPath(settings, resolved.path, resolved.default);
        }
        continue;
      }
      if (resolved.skipIf && q[resolved.skipIf]) continue;
      const value = resolved.parse ? resolved.parse(raw, { server }) : raw;
      setPath(settings, resolved.path, value);
    }
  }

  if (node.settingsKey) {
    ss[node.settingsKey] = settings;
  }
}

/* ------------------------------------------------------------------ *
 * flattenStreamSettings — nested streamSettings → query params
 * ------------------------------------------------------------------ */

export function flattenStreamSettings(ss: StreamSettings | undefined): QueryParams {
  if (!ss) return {};
  const q: QueryParams = {};

  // 1. Transport -------------------------------------------------------
  const network = (ss.method || "tcp").toLowerCase();
  const node = transportMap[network] ?? transportMap["tcp"]!;

  if (node.transform) {
    const settings = node.settingsKey ? ss[node.settingsKey] : {};
    const transportQ = node.transform.serialize(settings || {}, ss);
    Object.assign(q, transportQ);
  } else if (node.fields) {
    const settings = node.settingsKey ? ss[node.settingsKey] : {};
    for (const [param, fieldNode] of Object.entries(node.fields)) {
      const resolved = resolveFieldNode(fieldNode);
      const value = getPath(settings, resolved.path);
      if (value === undefined) {
        // Don't emit default values on serialize
        continue;
      }
      const serialized = resolved.serialize ? resolved.serialize(value, { ss }) : String(value);
      if (serialized !== undefined && serialized !== "") {
        q[param] = serialized;
      }
    }
  }

  if (node.extraTransform) {
    const extraQ = node.extraTransform.serialize(ss);
    Object.assign(q, extraQ);
  }

  // Emit type only if not default tcp
  if (network !== "tcp") {
    q["type"] = node.method || network;
  }

  // 2. Security --------------------------------------------------------
  const security = ss.security;
  if (security === "tls" || security === "reality") {
    const secNode = securityMap[security as keyof typeof securityMap];
    if (secNode?.fields) {
      q["security"] = security;
      const settings = secNode.settingsKey ? ss[secNode.settingsKey] : {};
      for (const [param, fieldNode] of Object.entries(secNode.fields)) {
        const resolved = resolveFieldNode(fieldNode);
        const value = getPath(settings, resolved.path);
        if (value === undefined) continue;
        const serialized = resolved.serialize ? resolved.serialize(value, { ss }) : String(value);
        if (serialized !== undefined && serialized !== "") {
          q[param] = serialized;
        }
      }
    }
  }

  // 3. finalmask override ----------------------------------------------
  if (ss.finalmask) {
    try {
      q["fm"] = JSON.stringify(ss.finalmask);
    } catch {
      // skip non-serializable finalmask
    }
  }

  return q;
}

/* ------------------------------------------------------------------ *
 * Interpreter helpers
 * ------------------------------------------------------------------ */

/** Normalize a FieldNode (string shorthand → full object). */
function resolveFieldNode(node: FieldNode | string): FieldNode {
  return typeof node === "string" ? { path: node } : node;
}

/** Set a value at a dot-path inside an object. */
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

/** Get a value from a dot-path inside an object. */
function getPath(obj: Record<string, any>, path: string): any {
  const parts = path.split(".");
  let cur = obj;
  for (const p of parts) {
    if (cur == null) return undefined;
    cur = cur[p];
  }
  return cur;
}
