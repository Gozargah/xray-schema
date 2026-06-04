import z from "zod";
import { generalInboundSchema } from "../../baseInbound/baseInbound.ts";
import tunDescription from "./tun.md?raw";
import tunSettingsDescription from "./tunSettings.md?raw";
import tunNameDescription from "./tunName.md?raw";
import tunMtuDescription from "./tunMtu.md?raw";
import tunGatewayDescription from "./tunGateway.md?raw";
import tunDnsDescription from "./tunDns.md?raw";
import tunUserLevelDescription from "./tunUserLevel.md?raw";
import tunAutoSystemRoutingTableDescription from "./tunAutoSystemRoutingTable.md?raw";
import tunAutoOutboundsInterfaceDescription from "./tunAutoOutboundsInterface.md?raw";
import tunUsageTipsDescription from "./tunUsageTips.md?raw";

export const tunInboundSchema = generalInboundSchema
  .extend({
    protocol: z.literal("tun"),
    settings: z
      .object({
        name: z.string().default("xray0").optional().meta({
          markdownDescription: tunNameDescription,
        }),
        mtu: z.number().int().default(1500).optional().meta({
          markdownDescription: tunMtuDescription,
        }),
        userLevel: z.number().int().default(0).optional().meta({
          markdownDescription: tunUserLevelDescription,
        }),
        gateway: z.array(z.string()).meta({
          markdownDescription: tunGatewayDescription,
        }),
        dns: z.array(z.string()).default(["1.1.1.1", "8.8.8.8"]).meta({
          markdownDescription: tunDnsDescription,
        }),
        autoSystemRoutingTable: z.array(z.string()).optional().meta({
          markdownDescription: tunAutoSystemRoutingTableDescription,
        }),
        autoOutboundsInterface: z
          .string()
          .or(z.literal("auto"))
          .nullable()
          .default(null)
          .optional()
          .meta({
            markdownDescription: tunAutoOutboundsInterfaceDescription,
          }),
      })
      .meta({
        markdownDescription: tunSettingsDescription,
      }),
  })
  .meta({
    markdownDescription: [tunDescription, "\n", tunUsageTipsDescription].join("\n"),
  });
