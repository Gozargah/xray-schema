import z from "zod";
import { outboundSchemaBase } from "../baseOutbound/baseOutbound";
import { portLikeSchema } from "../../inbounds/baseInbound/baseInbound";
import vmessDescription from "./vmess.md?raw";
import vmessSettingsDescription from "./vmessSettings.md?raw";
import vmessAddressDescription from "./vmessAddress.md?raw";
import vmessPortDescription from "./vmessPort.md?raw";
import vmessIdDescription from "./vmessId.md?raw";
import vmessSecurityDescription from "./vmessSecurity.md?raw";
import vmessLevelDescription from "./vmessLevel.md?raw";
import vmessExperimentsDescription from "./vmessExperiments.md?raw";

export const vmess = outboundSchemaBase
  .extend({
    protocol: z.literal("vmess"),
    settings: z
      .object({
        address: z.string().meta({
          markdownDescription: vmessAddressDescription,
        }),
        port: portLikeSchema.meta({
          markdownDescription: vmessPortDescription,
        }),
        id: z.string().meta({
          markdownDescription: vmessIdDescription,
        }),
        security: z
          .enum(["aes-128-gcm", "chacha20-poly1305", "auto", "none", "zero"])
          .optional()
          .meta({
            markdownDescription: vmessSecurityDescription,
          }),
        level: z.int().default(0).optional().meta({
          markdownDescription: vmessLevelDescription,
        }),
        experiments: z
          .enum([
            "AuthenticatedLength",
            "NoTerminationSignal",
            "AuthenticatedLength|NoTerminationSignal",
          ])
          .optional()
          .meta({
            markdownDescription: vmessExperimentsDescription,
          }),
      })
      .meta({
        markdownDescription: vmessSettingsDescription,
      }),
  })
  .meta({
    markdownDescription: vmessDescription,
  });
