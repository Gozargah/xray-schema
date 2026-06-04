import z from "zod";
import { generalInboundSchema } from "../../baseInbound/baseInbound.ts";
import tunnelDescription from "./tunnel.md?raw";
import tunnelSettingsDescription from "./tunnelSettings.md?raw";
import allowedNetworkDescription from "./allowedNetwork.md?raw";
import rewriteAddressDescription from "./rewriteAddress.md?raw";
import rewritePortDescription from "./rewritePort.md?raw";
import portMapDescription from "./portMap.md?raw";
import followRedirectDescription from "./followRedirect.md?raw";
import userLevelDescription from "./userLevel.md?raw";
import usageDescription from "./usage.md?raw";
import transparentProxyDescription from "./transparentProxy.md?raw";

const tunnelSettingsSchema = z
  .object({
    allowedNetwork: z.enum(["tcp", "udp", "tcp,udp"]).default("tcp").optional().meta({
      markdownDescription: allowedNetworkDescription,
    }),
    rewriteAddress: z.string().default("localhost").optional().meta({
      markdownDescription: rewriteAddressDescription,
    }),
    rewritePort: z.number().int().min(0).max(65535).optional().meta({
      markdownDescription: rewritePortDescription,
    }),
    portMap: z.record(z.string(), z.string()).optional().meta({
      markdownDescription: portMapDescription,
    }),
    followRedirect: z.boolean().default(false).optional().meta({
      markdownDescription: followRedirectDescription,
    }),
    userLevel: z.number().default(0).optional().meta({
      markdownDescription: userLevelDescription,
    }),
  })
  .meta({
    markdownDescription: tunnelSettingsDescription,
  });

export const dokodemoDoorInboundSchema = generalInboundSchema
  .extend({
    protocol: z.literal("dokodemo-door").or(z.literal("tunnel")),
    settings: tunnelSettingsSchema,
  })
  .meta({
    markdownDescription: [
      tunnelDescription,
      "\n",
      usageDescription,
      "\n",
      transparentProxyDescription,
    ].join("\n"),
  });
