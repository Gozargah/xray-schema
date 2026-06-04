import z from "zod";
import { outboundSchemaBase } from "../baseOutbound/baseOutbound";
import loopbackDescription from "./loopback.md?raw";
import loopbackSettingsDescription from "./loopbackSettings.md?raw";
import loopbackInboundTagDescription from "./loopbackInboundTag.md?raw";

export const loopback = outboundSchemaBase
  .extend({
    protocol: z.literal("loopback"),
    settings: z
      .object({
        inboundTag: z.string().meta({
          markdownDescription: loopbackInboundTagDescription,
        }),
      })
      .meta({
        markdownDescription: loopbackSettingsDescription,
      }),
  })
  .meta({
    markdownDescription: loopbackDescription,
  });
