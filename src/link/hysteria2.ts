/**
 * Hysteria2 link parser and generator.
 *
 * Link format:
 *   hysteria2://{password}@{host}:{port}?sni=...&obfs-password=...&mport=...
 *     &mportHopInt=...&pinSHA256=...&insecure=...#{remarks}
 *   hy2://  (alias)
 *
 * Hysteria2 always forces network=hysteria, security=tls, alpn=h3.
 * The auth password lives in streamSettings.hysteriaSettings.auth (not settings).
 *
 * All field mappings are defined in `linkMap.ts` → `protocolMap.hysteria2`.
 */

import type z from "zod";
import type { outbound } from "../schema/outbounds/outbounds.ts";
import type { inbound } from "../schema/inbounds/inbounds.ts";

import {
  fixUrl,
  parseQueryString,
  decodeComponent,
  encodeComponent,
  buildQueryString,
} from "./base.ts";
import { buildStreamSettings, flattenStreamSettings, type QueryParams } from "./streamSettings.ts";
import { protocolMap } from "./linkMap.ts";
import { applyProtocolFields, prepareQueryParams } from "./protocolUtils.ts";

type Outbound = z.infer<typeof outbound>;
type Inbound = z.infer<typeof inbound>;

const proto = protocolMap.hysteria2!;

/* ------------------------------------------------------------------ *
 * parseHysteria2
 * ------------------------------------------------------------------ */

export function parseHysteria2(link: string): Outbound {
  // hy2:// alias → swap scheme for uniform handling
  const normLink = link.replace(/^hy2:/i, "hysteria2:");
  const url = new URL(fixUrl(normLink));

  const password = decodeComponent(url.username);
  if (!password) throw new Error("Hysteria2 link is missing password (username)");

  const address = url.hostname;
  const port = Number(url.port);
  if (!address) throw new Error("Hysteria2 link is missing server address");
  if (!port) throw new Error("Hysteria2 link is missing server port");

  const q = parseQueryString(url.search.slice(1));

  // Hysteria2-specific aliases — pinSHA256 → pcs (standard query param)
  if (q["pinSHA256"]) {
    q["pcs"] = q["pinSHA256"];
    delete q["pinSHA256"];
  }

  // Build outbound settings (version is always 2)
  const outbound = applyProtocolFields(proto, {
    address,
    port,
    credential: undefined, // credential goes to streamSettings, not settings
    queryParams: {},
  });
  (outbound as any).settings.version = 2;

  // Stream settings: forced values + hysteria transport handler
  const preparedQ = prepareQueryParams(proto, q);
  const streamSettings = buildStreamSettings(preparedQ, address, {
    authPassword: password,
  });
  if (streamSettings) (outbound as any).streamSettings = streamSettings;

  const remarks = decodeComponent(url.hash.slice(1));
  if (remarks) (outbound as any).tag = remarks;

  return outbound as Outbound;
}

/* ------------------------------------------------------------------ *
 * generateHysteria2
 * ------------------------------------------------------------------ */

export function generateHysteria2(inbound: Inbound): string {
  if (inbound.protocol !== "hysteria")
    throw new Error(`Expected hysteria inbound, got ${inbound.protocol}`);

  const settings = inbound.settings as any;
  const address = settings?.address || inbound.listen || "0.0.0.0";
  const port = settings?.port || inbound.port;
  if (!port) throw new Error("Hysteria inbound is missing port");

  // Read auth from streamSettings
  const auth = (inbound.streamSettings as any)?.hysteriaSettings?.auth;
  if (!auth) throw new Error("Hysteria inbound has no auth password");

  // Flatten streamSettings → query params
  let q: QueryParams = flattenStreamSettings(inbound.streamSettings as any);

  // Remap pcs → pinSHA256 (hysteria2-specific query param name)
  if (q["pcs"]) {
    q["pinSHA256"] = q["pcs"];
    delete q["pcs"];
  }

  const userInfo = encodeComponent(auth);
  const host = address.includes(":") ? `[${address}]` : address;
  const query = buildQueryString(q);
  const remarks = inbound.tag || "";

  return `hysteria2://${userInfo}@${host}:${port}${query ? `?${query}` : ""}#${encodeComponent(remarks)}`;
}
