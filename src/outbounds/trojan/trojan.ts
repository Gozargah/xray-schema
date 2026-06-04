import z from "zod";
import { outboundSchemaBase } from "../baseOutbound/baseOutbound";
import { portLikeSchema } from "../../inbounds/baseInbound/baseInbound";
import trojanDescription from "./trojan.md?raw";
import trojanSettingsDescription from "./trojanSettings.md?raw";
import trojanAddressDescription from "./trojanAddress.md?raw";
import trojanPortDescription from "./trojanPort.md?raw";
import trojanPasswordDescription from "./trojanPassword.md?raw";
import trojanEmailDescription from "./trojanEmail.md?raw";
import trojanLevelDescription from "./trojanLevel.md?raw";
import trojanServersDescription from "./trojanServers.md?raw";

const trojanServerSettings = z.object({
  address: z.string().meta({
    markdownDescription: trojanAddressDescription,
  }),
  port: portLikeSchema.optional().meta({
    markdownDescription: trojanPortDescription,
  }),
  email: z.string().optional().meta({
    markdownDescription: trojanEmailDescription,
  }),
  password: z.string().meta({
    markdownDescription: trojanPasswordDescription,
  }),
  level: z.int().default(0).optional().meta({
    markdownDescription: trojanLevelDescription,
  }),
});

export const trojan = outboundSchemaBase
  .extend({
    protocol: z.literal("trojan"),
    settings: trojanServerSettings
      .or(
        z.object({
          servers: z.array(trojanServerSettings).meta({
            markdownDescription: trojanServersDescription,
          }),
        }),
      )
      .meta({
        markdownDescription: trojanSettingsDescription,
      }),
  })
  .meta({
    markdownDescription: trojanDescription,
  });
