/**
 * Link auto-detection router.
 *
 * Detects the protocol from the link prefix and delegates to the
 * appropriate parser. Each parser is lazy-loaded via dynamic import()
 * so only the matched protocol module is fetched at runtime.
 */

import type z from "zod";
import type { outbound } from "../schema/outbounds/outbounds.ts";

// Eagerly import the shared mapping chunk so it loads at import time
// rather than on the first dynamic import() call.
import { protocolMap } from "./linkMap.ts";
void protocolMap;

type Outbound = z.infer<typeof outbound>;

/** Parse a sharing link into a typed Xray outbound. */
export async function parseLink(link: string): Promise<Outbound> {
  const lower = link.toLowerCase();

  if (lower.startsWith("vmess://")) {
    const { parseVmess } = await import("./vmess.ts");
    return parseVmess(link);
  }
  if (lower.startsWith("vless://")) {
    const { parseVless } = await import("./vless.ts");
    return parseVless(link);
  }
  if (lower.startsWith("trojan://")) {
    const { parseTrojan } = await import("./trojan.ts");
    return parseTrojan(link);
  }
  if (lower.startsWith("ss://")) {
    const { parseShadowsocks } = await import("./shadowsocks.ts");
    return parseShadowsocks(link);
  }
  if (
    lower.startsWith("socks://") ||
    lower.startsWith("socks4://") ||
    lower.startsWith("socks5://")
  ) {
    const { parseSocks } = await import("./socks.ts");
    return parseSocks(link);
  }
  if (lower.startsWith("wireguard://")) {
    const { parseWireguard } = await import("./wireguard.ts");
    return parseWireguard(link);
  }
  if (lower.startsWith("hysteria2://") || lower.startsWith("hy2://")) {
    const { parseHysteria2 } = await import("./hysteria2.ts");
    return parseHysteria2(link);
  }

  throw new Error(`Unsupported link protocol: ${link.slice(0, 30)}...`);
}
