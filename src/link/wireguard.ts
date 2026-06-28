/**
 * WireGuard link parser and generator.
 *
 * Link format:
 *   wireguard://{secretKey}@{host}:{port}?publickey={pk}&address={addr}
 *     &mtu={mtu}&reserved={r1,r2,r3}&presharedkey={psk}#{remarks}
 *
 * WireGuard has no `streamSettings` — its encryption is built-in.
 * The `address` query param maps to `settings.address[]` (local tunnel IPs).
 * The `reserved` query param maps to `settings.reserved[]` (comma-split ints).
 *
 * All field mappings are defined in `linkMap.ts` → `protocolMap.wireguard`.
 */

import type z from "zod";
import type { outbound } from "../schema/outbounds/outbounds.ts";
import type { inbound } from "../schema/inbounds/inbounds.ts";

import {
  fixUrl,
  parseQueryString,
  buildQueryString,
  decodeComponent,
  encodeComponent,
} from "./base.ts";

type Outbound = z.infer<typeof outbound>;
type Inbound = z.infer<typeof inbound>;

const DEFAULT_ADDRESS = "172.16.0.2/32";
const DEFAULT_MTU = 1420;
const DEFAULT_RESERVED = "0,0,0";

/* ------------------------------------------------------------------ *
 * parseWireguard
 * ------------------------------------------------------------------ */

export function parseWireguard(link: string): Outbound {
  const url = new URL(fixUrl(link));

  const secretKey = decodeComponent(url.username);
  if (!secretKey) throw new Error("WireGuard link is missing secretKey (username)");

  const address = url.hostname;
  const port = Number(url.port);
  if (!address) throw new Error("WireGuard link is missing server address");
  if (!port) throw new Error("WireGuard link is missing server port");

  // Strip IPv6 brackets for the endpoint string
  const endpointHost = address.startsWith("[") ? address.slice(1, -1) : address;

  const q = parseQueryString(url.search.slice(1));
  if (!q["publickey"]) throw new Error("WireGuard link is missing publickey");

  // Parse reserved: comma-separated ints, default "0,0,0"
  const reservedRaw = q["reserved"] || DEFAULT_RESERVED;
  const reserved = reservedRaw
    .split(",")
    .map((s) => parseInt(s.trim(), 10))
    .filter((n) => !isNaN(n));

  const outbound: Record<string, any> = {
    protocol: "wireguard",
    settings: {
      secretKey,
      address: (q["address"] || DEFAULT_ADDRESS)
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      peers: [
        {
          endpoint: `${endpointHost}:${port}`,
          publicKey: q["publickey"],
        },
      ],
      mtu: Number(q["mtu"] || DEFAULT_MTU),
      reserved,
    },
  };

  // Optional: preSharedKey
  if (q["presharedkey"]) {
    outbound.settings.peers[0].preSharedKey = q["presharedkey"];
  }

  const remarks = decodeComponent(url.hash.slice(1));
  if (remarks) outbound.tag = remarks;

  return outbound as Outbound;
}

/* ------------------------------------------------------------------ *
 * generateWireguard
 * ------------------------------------------------------------------ */

export function generateWireguard(inbound: Inbound): string {
  if (inbound.protocol !== "wireguard")
    throw new Error(`Expected wireguard inbound, got ${inbound.protocol}`);

  const settings = inbound.settings as any;
  const secretKey = settings.secretKey;
  if (!secretKey) throw new Error("WireGuard inbound has no secretKey");

  const peer = settings.peers?.[0];
  if (!peer) throw new Error("WireGuard inbound has no peers");

  // endpoint is "host:port" — split into address and port
  const endpoint = peer.endpoint || "";
  const colonIdx = endpoint.lastIndexOf(":");
  let address: string;
  let port: string;
  if (colonIdx > 0) {
    address = endpoint.slice(0, colonIdx);
    port = endpoint.slice(colonIdx + 1);
  } else {
    address = endpoint;
    port = String(inbound.port || 51820);
  }

  const q: Record<string, string> = {};

  q["publickey"] = peer.publicKey || "";
  if (Array.isArray(settings.address)) {
    q["address"] = settings.address.join(",");
  }
  if (settings.mtu != null && settings.mtu !== DEFAULT_MTU) {
    q["mtu"] = String(settings.mtu);
  }
  if (Array.isArray(settings.reserved) && settings.reserved.length) {
    q["reserved"] = settings.reserved.join(",");
  }
  if (peer.preSharedKey) {
    q["presharedkey"] = peer.preSharedKey;
  }

  const userInfo = encodeComponent(secretKey);
  const host = address.includes(":") ? `[${address}]` : address;
  const query = buildQueryString(q);
  const remarks = inbound.tag || "";

  return `wireguard://${userInfo}@${host}:${port}${query ? `?${query}` : ""}#${encodeComponent(remarks)}`;
}
