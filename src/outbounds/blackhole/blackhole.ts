import z from "zod";
import { outboundSchemaBase } from "../baseOutbound/baseOutbound";
import blackholeDescription from "./blackhole.md?raw";
import blackholeSettingsDescription from "./blackholeSettings.md?raw";
import responseDescription from "./response.md?raw";
import responseTypeDescription from "./responseType.md?raw";

export const blackhole = outboundSchemaBase
  .extend({
    protocol: z.literal("blackhole").or(z.literal("block")),
    settings: z
      .object({
        response: z
          .object({
            type: z.enum(["none", "http"]).default("none").optional().meta({
              markdownDescription: responseTypeDescription,
            }),
          })
          .optional()
          .meta({
            markdownDescription: responseDescription,
          }),
      })
      .optional()
      .meta({
        markdownDescription: blackholeSettingsDescription,
      }),
  })
  .meta({
    markdownDescription: blackholeDescription,
  });
