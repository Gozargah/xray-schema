/**
 * VLESS link parser and generator.
 *
 * Link format (standard URI):
 *   vless://{uuid}@{host}:{port}?type={network}&security={tls|reality|none}
 *     &sni=...&fp=...&flow=...&encryption=none&pbk=...&sid=...#{remarks}
 *
 * All field mappings are defined in `linkMap.ts` → `protocolMap.vless`.
 */

import type z from "zod";
import type { outbound } from "../schema/outbounds/outbounds.ts";
import type { inbound } from "../schema/inbounds/inbounds.ts";

import { fixUrl, parseQueryString, decodeComponent } from "./base.ts";
import { buildStreamSettings } from "./streamSettings.ts";
import { protocolMap } from "./linkMap.ts";
import { applyProtocolFields, buildProtocolLink } from "./protocolUtils.ts";

type Outbound = z.infer<typeof outbound>;
type Inbound = z.infer<typeof inbound>;

const proto = protocolMap.vless!;

/* ------------------------------------------------------------------ *
 * parseVless
 * ------------------------------------------------------------------ */

export function parseVless(link: string): Outbound {
  const url = new URL(fixUrl(link));

  if (!url.username) throw new Error("VLESS link is missing UUID (username)");
  const address = url.hostname;
  const port = Number(url.port);
  if (!address) throw new Error("VLESS link is missing server address");
  if (!port) throw new Error("VLESS link is missing server port");

  const q = parseQueryString(url.search.slice(1));

  // Build outbound from protocol mapping (credential + extra fields)
  const outbound = applyProtocolFields(proto, {
    address,
    port,
    credential: decodeComponent(url.username),
    queryParams: q,
  });

  // Stream settings
  const streamSettings = buildStreamSettings(q, address);
  if (streamSettings) (outbound as any).streamSettings = streamSettings;

  // Remarks → tag
  const remarks = decodeComponent(url.hash.slice(1));
  if (remarks) (outbound as any).tag = remarks;

  return outbound as Outbound;
}

/* ------------------------------------------------------------------ *
 * generateVless
 * ------------------------------------------------------------------ */

export function generateVless(inbound: Inbound): string {
  if (inbound.protocol !== "vless")
    throw new Error(`Expected vless inbound, got ${inbound.protocol}`);

  return buildProtocolLink(proto, inbound);
}
