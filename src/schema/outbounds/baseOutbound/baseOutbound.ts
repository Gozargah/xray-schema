import z from "zod";
import { streamSettings } from "../../transport/transport";
import sendThroughDescription from "./sendThrough.md?raw";
import tagDescription from "./tag.md?raw";
import streamSettingsDescription from "./streamSettings.md?raw";
import targetStrategyDescription from "./targetStrategy.md?raw";
import proxySettingsDescription from "./proxySettings.md?raw";
import proxySettingsTagDescription from "./proxySettingsTag.md?raw";
import proxySettingsTransportLayerDescription from "./proxySettingsTransportLayer.md?raw";
import muxDescription from "./mux.md?raw";
import muxEnabledDescription from "./muxEnabled.md?raw";
import muxConcurrencyDescription from "./muxConcurrency.md?raw";
import muxXudpConcurrencyDescription from "./muxXudpConcurrency.md?raw";
import muxXudpProxyUdp443Description from "./muxXudpProxyUdp443.md?raw";

export const outboundSchemaBase = z.object({
  sendThrough: z
    .string()
    .or(z.enum(["origin", "srcip"]))
    .optional()
    .meta({
      markdownDescription: sendThroughDescription,
    }),
  tag: z.string().optional().meta({
    markdownDescription: tagDescription,
  }),
  streamSettings: streamSettings.optional().meta({
    markdownDescription: streamSettingsDescription,
  }),
  targetStrategy: z
    .enum([
      "AsIs",
      "UseIP",
      "UseIPv6v4",
      "UseIPv6",
      "UseIPv4v6",
      "UseIPv4",
      "ForceIP",
      "ForceIPv6v4",
      "ForceIPv6",
      "ForceIPv4v6",
      "ForceIPv4",
    ])
    .default("AsIs")
    .optional()
    .meta({
      markdownDescription: targetStrategyDescription,
    }),
  proxySettings: z
    .object({
      tag: z.string().min(1).meta({
        markdownDescription: proxySettingsTagDescription,
      }),
      transportLayer: z.boolean().default(false).optional().meta({
        markdownDescription: proxySettingsTransportLayerDescription,
      }),
    })
    .optional()
    .meta({
      markdownDescription: proxySettingsDescription,
    }),
  mux: z
    .object({
      enabled: z.boolean().default(false).optional().meta({
        markdownDescription: muxEnabledDescription,
      }),
      concurrency: z.int().optional().meta({
        markdownDescription: muxConcurrencyDescription,
      }),
      xudpConcurrency: z.int().optional().meta({
        markdownDescription: muxXudpConcurrencyDescription,
      }),
      xudpProxyUDP443: z.enum(["reject", "allow", "skip"]).default("reject").optional().meta({
        markdownDescription: muxXudpProxyUdp443Description,
      }),
    })
    .optional()
    .meta({
      markdownDescription: muxDescription,
    }),
});
