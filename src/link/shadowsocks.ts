/**
 * Shadowsocks link parser and generator.
 *
 * Dual format (matching v2rayNG `fmt/ShadowsocksFmt.kt`):
 *
 * 1. SIP002:  ss://base64(method:password)@host:port?plugin=...#name
 * 2. Legacy:  ss://base64(method:password@host:port)#name
 *
 * Plugin support: `plugin=obfs=http;obfs-host=...;path=...` → tcp http header.
 *
 * All field mappings are defined in `linkMap.ts` → `protocolMap.shadowsocks`.
 */

import type z from "zod";
import type { outbound } from "../schema/outbounds/outbounds.ts";
import type { inbound } from "../schema/inbounds/inbounds.ts";

import { fixUrl, parseQueryString, decodeBase64, decodeComponent } from "./base.ts";
import { buildStreamSettings, type QueryParams } from "./streamSettings.ts";
import { protocolMap } from "./linkMap.ts";
import { applyProtocolFields, buildProtocolLink } from "./protocolUtils.ts";

type Outbound = z.infer<typeof outbound>;
type Inbound = z.infer<typeof inbound>;

const proto = protocolMap.shadowsocks!;

/* ------------------------------------------------------------------ *
 * parseShadowsocks
 * ------------------------------------------------------------------ */

export function parseShadowsocks(link: string): Outbound {
  return (parseSip002(link) || parseLegacy(link)) as Outbound;
}

/** Parse SIP002 format: ss://base64(method:password)@host:port?plugin=...#name */
function parseSip002(link: string): Outbound | null {
  let url: URL;
  try {
    url = new URL(fixUrl(link));
  } catch {
    return null;
  }

  const address = url.hostname;
  const port = Number(url.port);
  if (!address || port <= 0) return null;

  // Reconstruct full userinfo — URL splits on ":" into username/password
  let rawUserinfo: string;
  if (url.password) {
    rawUserinfo = `${decodeComponent(url.username)}:${decodeComponent(url.password)}`;
  } else {
    rawUserinfo = decodeComponent(url.username);
  }
  if (!rawUserinfo) return null;

  // Decode method:password — may be base64 or plain
  let decoded: string;
  if (rawUserinfo.includes(":")) {
    decoded = rawUserinfo;
  } else {
    try {
      decoded = decodeBase64(rawUserinfo);
    } catch {
      return null;
    }
  }

  const colonIdx = decoded.indexOf(":");
  if (colonIdx === -1) return null;

  const method = decoded.slice(0, colonIdx);
  const password = decoded.slice(colonIdx + 1);

  // Build query params from plugin if present
  let q: QueryParams = {};
  const rawQuery = url.search.slice(1);
  if (rawQuery) {
    q = parseQueryString(rawQuery);
    // Parse plugin string: obfs=http;obfs-host=...;path=...
    const plugin = q["plugin"];
    if (plugin && plugin.includes("obfs=http")) {
      const pluginParams: Record<string, string> = {};
      for (const pair of plugin.split(";")) {
        const idx = pair.indexOf("=");
        if (idx !== -1) {
          pluginParams[pair.slice(0, idx)] = pair.slice(idx + 1);
        }
      }
      // Map to tcp http header transport
      q = { type: "tcp", headerType: "http" };
      if (pluginParams["obfs-host"]) q["host"] = pluginParams["obfs-host"];
      if (pluginParams["path"]) q["path"] = pluginParams["path"];
    }
  }

  const outbound = applyProtocolFields(proto, {
    address,
    port,
    credentialParts: [method, password],
    queryParams: {},
  });

  // Stream settings (from plugin if present)
  if (Object.keys(q).length > 0) {
    const streamSettings = buildStreamSettings(q, address);
    if (streamSettings) (outbound as any).streamSettings = streamSettings;
  }

  const remarks = decodeComponent(url.hash.slice(1));
  if (remarks) (outbound as any).tag = remarks;

  return outbound as Outbound;
}

/** Parse legacy format: ss://base64(method:password@host:port)#name */
function parseLegacy(link: string): Outbound | null {
  let result = link.replace(/^ss:\/\//i, "");

  // Split off remarks
  let remarks = "";
  const hashIdx = result.indexOf("#");
  if (hashIdx > 0) {
    try {
      remarks = decodeComponent(result.slice(hashIdx + 1));
    } catch {
      // ignore decode error
    }
    result = result.slice(0, hashIdx);
  }

  // Partial decode: if @ present, decode only the part before @
  const atIdx = result.indexOf("@");
  if (atIdx > 0) {
    result = decodeBase64(result.slice(0, atIdx)) + result.slice(atIdx);
  } else {
    result = decodeBase64(result);
  }

  // Regex: method:password@host:port
  const match = /^(.+?):(.*)@(.+?):(\d+?)\/?$/.exec(result);
  if (!match) return null;

  const method = match[1]!.toLowerCase();
  const password = match[2]!;
  const address = match[3]!.replace(/^\[/, "").replace(/\]$/, ""); // strip IPv6 brackets
  const port = Number(match[4]);

  const outbound = applyProtocolFields(proto, {
    address,
    port,
    credentialParts: [method, password],
    queryParams: {},
  });

  if (remarks) (outbound as any).tag = remarks;

  return outbound as Outbound;
}

/* ------------------------------------------------------------------ *
 * generateShadowsocks
 * ------------------------------------------------------------------ */

export function generateShadowsocks(inbound: Inbound): string {
  if (inbound.protocol !== "shadowsocks")
    throw new Error(`Expected shadowsocks inbound, got ${inbound.protocol}`);
  return buildProtocolLink(proto, inbound as Record<string, any>);
}
