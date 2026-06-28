/**
 * VMess link parser and generator.
 *
 * Dual format (matching v2rayNG `fmt/VmessFmt.kt`):
 *
 * 1. Standard URI (when link contains both `?` and `&`):
 *    vmess://{uuid}@{host}:{port}?type={network}&security=...&encryption=auto#{remarks}
 *
 * 2. Legacy Base64 JSON (default):
 *    vmess://{base64(JSON)}
 *
 * Legacy JSON uses field aliases and per-network remapping defined in
 * `linkMap.ts` → `protocolMap.vmess.legacy`.
 */

import type z from "zod";
import type { outbound } from "../schema/outbounds/outbounds.ts";
import type { inbound } from "../schema/inbounds/inbounds.ts";

import { fixUrl, parseQueryString, decodeBase64, encodeBase64, decodeComponent } from "./base.ts";
import { buildStreamSettings, flattenStreamSettings, type QueryParams } from "./streamSettings.ts";
import { protocolMap } from "./linkMap.ts";
import { applyProtocolFields } from "./protocolUtils.ts";

type Outbound = z.infer<typeof outbound>;
type Inbound = z.infer<typeof inbound>;

const proto = protocolMap.vmess!;
const DEFAULT_SECURITY = "auto";

/* ------------------------------------------------------------------ *
 * parseVmess
 * ------------------------------------------------------------------ */

export function parseVmess(link: string): Outbound {
  if (link.includes("?") && link.includes("&")) {
    return parseVmessStd(link);
  }
  return parseVmessLegacy(link);
}

/** Parse standard URI format */
function parseVmessStd(link: string): Outbound {
  const url = new URL(fixUrl(link));

  if (!url.username) throw new Error("VMess link is missing UUID (username)");
  const address = url.hostname;
  const port = Number(url.port);
  if (!address) throw new Error("VMess link is missing server address");
  if (!port) throw new Error("VMess link is missing server port");

  const q = parseQueryString(url.search.slice(1));

  const outbound = applyProtocolFields(proto, {
    address,
    port,
    credential: decodeComponent(url.username),
    queryParams: q,
  });

  const streamSettings = buildStreamSettings(q, address);
  if (streamSettings) (outbound as any).streamSettings = streamSettings;

  const remarks = decodeComponent(url.hash.slice(1));
  if (remarks) (outbound as any).tag = remarks;

  return outbound as Outbound;
}

/** Parse legacy Base64 JSON format */
function parseVmessLegacy(link: string): Outbound {
  const stripped = link.replace(/^vmess:\/\//i, "");
  let json: string;
  try {
    json = decodeBase64(stripped);
  } catch {
    throw new Error("VMess legacy link: Base64 decode failed");
  }

  let obj: Record<string, any>;
  try {
    obj = JSON.parse(json);
  } catch {
    throw new Error("VMess legacy link: JSON parse failed");
  }

  const aliases = proto.legacy!.aliases;
  const networkRemap = proto.legacy!.networkRemap;

  // Translate legacy JSON fields to query params using aliases + remapping
  const net = (obj[reverseAlias(aliases, "type")] || "tcp").toLowerCase();
  const remap = networkRemap[net] || {};

  const q: QueryParams = { type: net };

  // Map all aliased fields, applying per-network remapping
  for (const [legacyKey, linkParam] of Object.entries(aliases)) {
    if (!(legacyKey in obj)) continue;
    // Apply network remapping: e.g. for kcp, "path" → "seed"
    const targetParam = remap[legacyKey] || linkParam;
    let value = obj[legacyKey];
    // extra might be an object, stringify it
    if (typeof value === "object") value = JSON.stringify(value);
    q[targetParam] = String(value);
  }

  // Validate required fields
  const address = q["address"] || obj["add"];
  const portRaw = q["port"] || obj["port"];
  const id = q["id"] || obj["id"];
  if (!address) throw new Error("VMess legacy link: missing 'add' (server address)");
  if (!portRaw) throw new Error("VMess legacy link: missing 'port'");
  if (!id) throw new Error("VMess legacy link: missing 'id' (UUID)");

  // Remove non-query fields from q before building streamSettings
  const port = Number(portRaw);
  const scy = q["encryption"] || DEFAULT_SECURITY;
  const remarks = q["remarks"] || obj["ps"];

  // Clean q: remove fields that are not link query params
  delete q["address"];
  delete q["port"];
  delete q["id"];
  delete q["encryption"];
  delete q["remarks"];

  // Build outbound using protocol mapping
  const outbound = applyProtocolFields(proto, {
    address,
    port,
    credential: id,
    queryParams: { encryption: scy },
  });

  // Build stream settings from the remapped query params
  const streamSettings = buildStreamSettings(q, address);
  if (streamSettings) (outbound as any).streamSettings = streamSettings;

  if (remarks) (outbound as any).tag = remarks;

  return outbound as Outbound;
}

/** Find the legacy key that maps to a given link param. */
function reverseAlias(aliases: Record<string, string>, linkParam: string): string {
  for (const [k, v] of Object.entries(aliases)) {
    if (v === linkParam) return k;
  }
  return linkParam;
}

/* ------------------------------------------------------------------ *
 * generateVmess
 * ------------------------------------------------------------------ */

export function generateVmess(inbound: Inbound): string {
  if (inbound.protocol !== "vmess")
    throw new Error(`Expected vmess inbound, got ${inbound.protocol}`);

  const settings = inbound.settings as any;

  // Extract credential (same logic as protocolUtils.extractCredential)
  let id: string;
  let security = DEFAULT_SECURITY;

  if (settings.clients?.[0]) {
    id = settings.clients[0].id;
  } else if (settings.users?.[0]) {
    id = settings.users[0].id;
  } else if (settings.id) {
    id = settings.id;
    security = settings.security || DEFAULT_SECURITY;
  } else {
    throw new Error("VMess inbound has no client/user id");
  }

  const address = settings.address || inbound.listen || "0.0.0.0";
  const port = settings.port || inbound.port;
  if (!port) throw new Error("VMess inbound is missing port");

  // Flatten streamSettings to query params
  const q: QueryParams = flattenStreamSettings(inbound.streamSettings as any);
  const network = (q["type"] || "tcp").toLowerCase();

  // Build VmessQRCode using legacy aliases + per-network remapping (reverse)
  const aliases = proto.legacy!.aliases;
  const networkRemap = proto.legacy!.networkRemap;
  const remap = networkRemap[network] || {};

  const vmessQRCode: Record<string, any> = {
    v: "2",
    ps: inbound.tag || "",
    add: address,
    port: String(port),
    id,
    scy: security,
    aid: "0",
  };

  // Set net from query type
  const netLegacyKey = reverseAlias(aliases, "type");
  vmessQRCode[netLegacyKey] = network;

  // Map query params back to legacy fields, applying reverse remapping
  for (const [legacyKey, linkParam] of Object.entries(aliases)) {
    if (["add", "port", "id", "scy", "net", "ps"].includes(legacyKey)) continue;

    // Reverse remap: if this legacyKey was remapped during parse (e.g. kcp:
    // path→seed), read from the remapped link param instead.
    const paramToRead = remap[legacyKey] || linkParam;

    if (q[paramToRead]) {
      vmessQRCode[legacyKey] = q[paramToRead];
    }
  }

  // Security
  const sec = q["security"];
  const tlsKey = reverseAlias(aliases, "security");
  vmessQRCode[tlsKey] = sec || "";

  const json = JSON.stringify(vmessQRCode);
  return `vmess://${encodeBase64(json)}`;
}
