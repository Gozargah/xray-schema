/**
 * SOCKS link parser and generator.
 *
 * Link format (standard URI):
 *   socks://base64(user:pass)@host:port#name
 *   socks://user:pass@host:port#name
 *   socks://host:port#name  (no auth)
 *
 * All field mappings are defined in `linkMap.ts` → `protocolMap.socks`.
 */

import type z from "zod";
import type { outbound } from "../schema/outbounds/outbounds.ts";
import type { inbound } from "../schema/inbounds/inbounds.ts";

import { fixUrl, decodeBase64, decodeComponent } from "./base.ts";
import { protocolMap } from "./linkMap.ts";
import { applyProtocolFields, buildProtocolLink } from "./protocolUtils.ts";

type Outbound = z.infer<typeof outbound>;
type Inbound = z.infer<typeof inbound>;

const proto = protocolMap.socks!;

/* ------------------------------------------------------------------ *
 * parseSocks
 * ------------------------------------------------------------------ */

export function parseSocks(link: string): Outbound {
  const url = new URL(fixUrl(link));

  const address = url.hostname;
  const port = Number(url.port);
  if (!address) throw new Error("SOCKS link is missing server address");
  if (!port) throw new Error("SOCKS link is missing server port");

  // Reconstruct full userinfo — URL splits on ":" into username/password
  let rawUserinfo: string;
  if (url.password) {
    rawUserinfo = `${decodeComponent(url.username)}:${decodeComponent(url.password)}`;
  } else {
    rawUserinfo = decodeComponent(url.username);
  }

  let credentialParts: string[] | undefined;

  if (rawUserinfo) {
    // Decode user:pass — may be base64 or plain
    let decoded: string;
    if (rawUserinfo.includes(":")) {
      decoded = rawUserinfo;
    } else {
      try {
        decoded = decodeBase64(rawUserinfo);
      } catch {
        decoded = rawUserinfo;
      }
    }

    const colonIdx = decoded.indexOf(":");
    if (colonIdx !== -1) {
      credentialParts = [decoded.slice(0, colonIdx), decoded.slice(colonIdx + 1)];
    } else {
      credentialParts = [decoded, ""];
    }
  }

  const outbound = applyProtocolFields(proto, {
    address,
    port,
    credentialParts,
    queryParams: {},
  });

  const remarks = decodeComponent(url.hash.slice(1));
  if (remarks) (outbound as any).tag = remarks;

  return outbound as Outbound;
}

/* ------------------------------------------------------------------ *
 * generateSocks
 * ------------------------------------------------------------------ */

export function generateSocks(inbound: Inbound): string {
  if (inbound.protocol !== "socks" && inbound.protocol !== "mixed")
    throw new Error(`Expected socks inbound, got ${inbound.protocol}`);

  return buildProtocolLink(proto, inbound as Record<string, any>);
}
