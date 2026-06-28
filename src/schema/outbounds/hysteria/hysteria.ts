import z from "zod";
import { outboundSchemaBase } from "../baseOutbound/baseOutbound";
import { portLikeSchema } from "../../inbounds/baseInbound/baseInbound";
import hysteriaDescription from "./hysteria.md?raw";
import hysteriaSettingsDescription from "./hysteriaSettings.md?raw";
import hysteriaVersionDescription from "./hysteriaVersion.md?raw";
import hysteriaAddressDescription from "./hysteriaAddress.md?raw";
import hysteriaPortDescription from "./hysteriaPort.md?raw";

export const hysteria = outboundSchemaBase
  .extend({
    protocol: z.literal("hysteria"),
    settings: z
      .object({
        version: z.literal(2).meta({
          markdownDescription: hysteriaVersionDescription,
        }),
        address: z.string().meta({
          markdownDescription: hysteriaAddressDescription,
        }),
        port: portLikeSchema.meta({
          markdownDescription: hysteriaPortDescription,
        }),
      })
      .meta({
        markdownDescription: hysteriaSettingsDescription,
      }),
  })
  .meta({
    markdownDescription: hysteriaDescription,
  });
