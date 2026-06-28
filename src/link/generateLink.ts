/**
 * Inbound → link router.
 *
 * Routes by inbound protocol to the appropriate link generator.
 * Each generator is lazy-loaded via dynamic import() so only the
 * matched protocol module is fetched at runtime.
 */

import type z from "zod";
import type { inbound } from "../schema/inbounds/inbounds.ts";

// Eagerly import the shared mapping chunk so it loads at import time
// rather than on the first dynamic import() call.
import { protocolMap } from "./linkMap.ts";
void protocolMap;

type Inbound = z.infer<typeof inbound>;

/** Generate a sharing link from a typed Xray inbound. */
export async function generateLink(inbound: Inbound): Promise<string> {
  const proto = inbound.protocol;

  switch (proto) {
    case "vless": {
      const { generateVless } = await import("./vless.ts");
      return generateVless(inbound);
    }
    case "vmess": {
      const { generateVmess } = await import("./vmess.ts");
      return generateVmess(inbound);
    }
    case "trojan": {
      const { generateTrojan } = await import("./trojan.ts");
      return generateTrojan(inbound);
    }
    case "shadowsocks": {
      const { generateShadowsocks } = await import("./shadowsocks.ts");
      return generateShadowsocks(inbound);
    }
    case "socks":
    case "mixed": {
      const { generateSocks } = await import("./socks.ts");
      return generateSocks(inbound);
    }
    case "wireguard": {
      const { generateWireguard } = await import("./wireguard.ts");
      return generateWireguard(inbound);
    }
    case "hysteria": {
      const { generateHysteria2 } = await import("./hysteria2.ts");
      return generateHysteria2(inbound);
    }
    default:
      throw new Error(`Cannot generate link for protocol: ${proto}`);
  }
}
