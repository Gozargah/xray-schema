import z from "zod";
import { generalInboundSchema } from "../../baseInbound/baseInbound.ts";
import wireguardDescription from "./wireguard.md?raw";
import wireguardSettingsDescription from "./wireguardSettings.md?raw";
import wireguardSecretKeyDescription from "./wireguardSecretKey.md?raw";
import wireguardPeersDescription from "./wireguardPeers.md?raw";
import wireguardPeerPublicKeyDescription from "./wireguardPeerPublicKey.md?raw";
import wireguardPeerAllowedIPsDescription from "./wireguardPeerAllowedIPs.md?raw";
import wireguardMtuDescription from "./wireguardMtu.md?raw";

const wireguardPeerSchema = z.object({
  publicKey: z.string().min(1).meta({
    markdownDescription: wireguardPeerPublicKeyDescription,
  }),
  allowedIPs: z.array(z.string().min(1)).meta({
    markdownDescription: wireguardPeerAllowedIPsDescription,
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
