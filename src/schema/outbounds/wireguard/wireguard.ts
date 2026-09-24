import z from "zod";
import { outboundSchemaBase } from "../baseOutbound/baseOutbound";
import wireguardDescription from "./wireguard.md?raw";
import wireguardSettingsDescription from "./wireguardSettings.md?raw";
import wireguardSecretKeyDescription from "./wireguardSecretKey.md?raw";
import wireguardAddressDescription from "./wireguardAddress.md?raw";
import wireguardNoKernelTunDescription from "./wireguardNoKernelTun.md?raw";
import wireguardMtuDescription from "./wireguardMtu.md?raw";
import wireguardReservedDescription from "./wireguardReserved.md?raw";
import wireguardWorkersDescription from "./wireguardWorkers.md?raw";
import wireguardPeersDescription from "./wireguardPeers.md?raw";
import wireguardDomainStrategyDescription from "./wireguardDomainStrategy.md?raw";
import wireguardRemoteDNSDescription from "./wireguardRemoteDNS.md?raw";
import wireguardPeerEndpointDescription from "./wireguardPeerEndpoint.md?raw";
import wireguardPeerPublicKeyDescription from "./wireguardPeerPublicKey.md?raw";
import wireguardPeerPreSharedKeyDescription from "./wireguardPeerPreSharedKey.md?raw";
import wireguardPeerKeepAliveDescription from "./wireguardPeerKeepAlive.md?raw";
import wireguardPeerAllowedIPsDescription from "./wireguardPeerAllowedIPs.md?raw";

const peer = z.object({
  endpoint: z.string().meta({
    markdownDescription: wireguardPeerEndpointDescription,
  }),
  publicKey: z.string().meta({
    markdownDescription: wireguardPeerPublicKeyDescription,
  }),
  preSharedKey: z.string().optional().meta({
    markdownDescription: wireguardPeerPreSharedKeyDescription,
  }),
  keepAlive: z.int().default(0).optional().meta({
    markdownDescription: wireguardPeerKeepAliveDescription,
  }),
  allowedIPs: z.array(z.string()).default(["0.0.0.0/0", "::/0"]).optional().meta({
    markdownDescription: wireguardPeerAllowedIPsDescription,
  }),
});

export const wireguard = outboundSchemaBase
  .extend({
    protocol: z.literal("wireguard"),
    settings: z
      .object({
        secretKey: z.string().meta({
          markdownDescription: wireguardSecretKeyDescription,
        }),
        address: z
          .array(z.string())
          .min(1)
          .default(["10.0.0.1", "fd59:7153:2388:b5fd:0000:0000:0000:0001"])
          .optional()
          .meta({
            markdownDescription: wireguardAddressDescription,
          }),
        peers: z.array(peer).min(1).meta({
          markdownDescription: wireguardPeersDescription,
        }),
        noKernelTun: z.boolean().default(false).optional().meta({
          markdownDescription: wireguardNoKernelTunDescription,
        }),
        mtu: z.int().default(1420).meta({
          markdownDescription: wireguardMtuDescription,
        }),
        reserved: z.array(z.int()).default([]).optional().meta({
          markdownDescription: wireguardReservedDescription,
        }),
        workers: z.int().optional().meta({
          deprecated: true,
          markdownDescription: wireguardWorkersDescription,
        }),
        domainStrategy: z
          .enum(["ForceIPv6v4", "ForceIPv6", "ForceIPv4v6", "ForceIPv4", "ForceIP"])
          .default("ForceIP")
          .optional()
          .meta({
            deprecated: true,
            markdownDescription: wireguardDomainStrategyDescription,
          }),
        remoteDNS: z
          .array(z.string())
          .default(["1.1.1.1", "1.0.0.1", "2606:4700:4700::1111", "2606:4700:4700::1001"])
          .optional()
          .meta({
            markdownDescription: wireguardRemoteDNSDescription,
          }),
      })
      .meta({
        markdownDescription: wireguardSettingsDescription,
      }),
  })
  .meta({
    markdownDescription: wireguardDescription,
  });
