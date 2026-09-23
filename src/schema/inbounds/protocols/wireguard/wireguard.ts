import z from "zod";
import { generalInboundSchema } from "../../baseInbound/baseInbound.ts";
import wireguardDescription from "./wireguard.md?raw";
import wireguardSettingsDescription from "./wireguardSettings.md?raw";
import wireguardSecretKeyDescription from "./wireguardSecretKey.md?raw";
import wireguardPeersDescription from "./wireguardPeers.md?raw";
import wireguardPeerPublicKeyDescription from "./wireguardPeerPublicKey.md?raw";
import wireguardPeerAllowedIPsDescription from "./wireguardPeerAllowedIPs.md?raw";
import wireguardMtuDescription from "./wireguardMtu.md?raw";

import wireguardPeerPreSharedKeyDescription from "./wireguardPeerPreSharedKey.md?raw";
import wireguardPeerKeepAliveDescription from "./wireguardPeerKeepAlive.md?raw";
import wireguardPeerEmailDescription from "./wireguardPeerEmail.md?raw";
import wireguardPeerLevelDescription from "./wireguardPeerLevel.md?raw";

const wireguardPeerSchema = z.object({
  publicKey: z.string().min(1).meta({
    markdownDescription: wireguardPeerPublicKeyDescription,
  }),
  preSharedKey: z.string().optional().meta({
    markdownDescription: wireguardPeerPreSharedKeyDescription,
  }),
  keepAlive: z.int().default(0).optional().meta({
    markdownDescription: wireguardPeerKeepAliveDescription,
  }),
  allowedIPs: z.array(z.string().min(1)).default(["0.0.0.0/0", "::/0"]).optional().meta({
    markdownDescription: wireguardPeerAllowedIPsDescription,
  }),
  email: z.string().optional().meta({
    markdownDescription: wireguardPeerEmailDescription,
  }),
  level: z.int().default(0).optional().meta({
    markdownDescription: wireguardPeerLevelDescription,
  }),
});

export const wireguardInboundSchema = generalInboundSchema
  .extend({
    protocol: z.literal("wireguard"),
    settings: z
      .object({
        secretKey: z.string().meta({
          markdownDescription: wireguardSecretKeyDescription,
        }),
        peers: z.array(wireguardPeerSchema).default([]).optional().meta({
          markdownDescription: wireguardPeersDescription,
        }),
        mtu: z.number().default(1420).optional().meta({
          markdownDescription: wireguardMtuDescription,
        }),
      })
      .meta({
        markdownDescription: wireguardSettingsDescription,
      }),
  })
  .meta({
    markdownDescription: wireguardDescription,
  });
