import z from "zod";
import { outboundSchemaBase } from "../baseOutbound/baseOutbound";
import { sniffingSchema } from "../../inbounds/sniffing/sniffing";
import loopbackDescription from "./loopback.md?raw";
import loopbackSettingsDescription from "./loopbackSettings.md?raw";
import loopbackInboundTagDescription from "./loopbackInboundTag.md?raw";
import loopbackSniffingDescription from "./loopbackSniffing.md?raw";

export const loopback = outboundSchemaBase
  .extend({
    protocol: z.literal("loopback"),
    settings: z
      .object({
        inboundTag: z.string().meta({
          markdownDescription: loopbackInboundTagDescription,
        }),
        sniffing: sniffingSchema.optional().meta({
          markdownDescription: loopbackSniffingDescription,
        }),
      })
      .meta({
        markdownDescription: loopbackSettingsDescription,
      }),
  })
  .meta({
    markdownDescription: loopbackDescription,
  });
