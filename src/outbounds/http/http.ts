import z from "zod";
import { outboundSchemaBase } from "../baseOutbound/baseOutbound";
import { portLikeSchema } from "../../inbounds/baseInbound/baseInbound";
import httpDescription from "./http.md?raw";
import httpSettingsDescription from "./httpSettings.md?raw";
import httpAddressDescription from "./httpAddress.md?raw";
import httpPortDescription from "./httpPort.md?raw";
import httpUserDescription from "./httpUser.md?raw";
import httpPassDescription from "./httpPass.md?raw";
import httpLevelDescription from "./httpLevel.md?raw";
import httpEmailDescription from "./httpEmail.md?raw";
import httpHeadersDescription from "./httpHeaders.md?raw";

export const http = outboundSchemaBase
  .extend({
    protocol: z.literal("http"),
    settings: z
      .object({
        address: z.string().meta({
          markdownDescription: httpAddressDescription,
        }),
        port: portLikeSchema.meta({
          markdownDescription: httpPortDescription,
        }),
        user: z.string().optional().meta({
          markdownDescription: httpUserDescription,
        }),
        pass: z.string().optional().meta({
          markdownDescription: httpPassDescription,
        }),
        level: z.int().default(0).optional().meta({
          markdownDescription: httpLevelDescription,
        }),
        email: z.string().optional().meta({
          markdownDescription: httpEmailDescription,
        }),
        headers: z.record(z.string(), z.string()).optional().meta({
          markdownDescription: httpHeadersDescription,
        }),
      })
      .optional()
      .meta({
        markdownDescription: httpSettingsDescription,
      }),
  })
  .meta({
    markdownDescription: httpDescription,
  });
