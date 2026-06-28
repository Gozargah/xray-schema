/**
 * Trojan link parser and generator.
 *
 * Link format (standard URI):
 *   trojan://{password}@{host}:{port}?type={network}&security={tls|reality|none}
 *     &sni=...&fp=...&flow=...#{remarks}
 *
 * Trojan defaults to TLS + TCP when no query params are present.
 *
 * All field mappings are defined in `linkMap.ts` → `protocolMap.trojan`.
 */

import type z from "zod";
import type { outbound } from "../schema/outbounds/outbounds.ts";
import type { inbound } from "../schema/inbounds/inbounds.ts";

import { fixUrl, parseQueryString, decodeComponent } from "./base.ts";
import { buildStreamSettings } from "./streamSettings.ts";
import { protocolMap } from "./linkMap.ts";
import { applyProtocolFields, prepareQueryParams, buildProtocolLink } from "./protocolUtils.ts";

type Outbound = z.infer<typeof outbound>;
type Inbound = z.infer<typeof inbound>;

const proto = protocolMap.trojan!;

/* ------------------------------------------------------------------ *
 * parseTrojan
 * ------------------------------------------------------------------ */

export function parseTrojan(link: string): Outbound {
  const url = new URL(fixUrl(link));

  if (!url.username) throw new Error("Trojan link is missing password (username)");
  const address = url.hostname;
  const port = Number(url.port);
  if (!address) throw new Error("Trojan link is missing server address");
  if (!port) throw new Error("Trojan link is missing server port");

  const rawQuery = url.search.slice(1);
  const outbound = applyProtocolFields(proto, {
    address,
    port,
    credential: decodeComponent(url.username),
    queryParams: rawQuery ? parseQueryString(rawQuery) : {},
  });

  // Stream settings — trojan defaults to TLS + TCP when no query
  if (!rawQuery) {
    (outbound as any).streamSettings = {
      network: "tcp",
      tcpSettings: { header: { type: "none" } },
      security: "tls",
      tlsSettings: {},
    };
  } else {
    const q = prepareQueryParams(proto, parseQueryString(rawQuery));
    const streamSettings = buildStreamSettings(q, address);
    if (streamSettings) (outbound as any).streamSettings = streamSettings;
  }

  // Remarks → tag
  const remarks = decodeComponent(url.hash.slice(1));
  if (remarks) (outbound as any).tag = remarks;

  return outbound as Outbound;
}

/* ------------------------------------------------------------------ *
 * generateTrojan
 * ------------------------------------------------------------------ */

export function generateTrojan(inbound: Inbound): string {
  if (inbound.protocol !== "trojan")
    throw new Error(`Expected trojan inbound, got ${inbound.protocol}`);

  return buildProtocolLink(proto, inbound as Record<string, any>);
}
