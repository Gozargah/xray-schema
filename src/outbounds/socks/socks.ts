import z from "zod";
import { outboundSchemaBase } from "../baseOutbound/baseOutbound";
import { portLikeSchema } from "../../inbounds/baseInbound/baseInbound";
import socksDescription from "./socks.md?raw";
import socksSettingsDescription from "./socksSettings.md?raw";
import socksAddressDescription from "./socksAddress.md?raw";
import socksPortDescription from "./socksPort.md?raw";
import socksUserDescription from "./socksUser.md?raw";
import socksPassDescription from "./socksPass.md?raw";
import socksLevelDescription from "./socksLevel.md?raw";
import socksEmailDescription from "./socksEmail.md?raw";

const socksServerSettings = z
  .object({
    address: z.string().meta({
      markdownDescription: socksAddressDescription,
    }),
    port: portLikeSchema.meta({
      markdownDescription: socksPortDescription,
    }),
    user: z.string().optional().meta({
      markdownDescription: socksUserDescription,
    }),
    pass: z.string().optional().meta({
      markdownDescription: socksPassDescription,
    }),
    level: z.int().default(0).optional().meta({
      markdownDescription: socksLevelDescription,
    }),
    email: z.string().optional().meta({
      markdownDescription: socksEmailDescription,
    }),
  })
  .meta({
    markdownDescription: socksSettingsDescription,
  });

export const socks = outboundSchemaBase
  .extend({
    protocol: z.literal("socks"),
    settings: socksServerSettings
      .or(
        z.object({
          servers: z.array(socksServerSettings),
        }),
      )
      .optional(),
  })
  .meta({
    markdownDescription: socksDescription,
  });
