import z from "zod";
import { outboundSchemaBase } from "../baseOutbound/baseOutbound";
import { portLikeSchema } from "../../inbounds/baseInbound/baseInbound";
import masqueDescription from "./masque.md?raw";
import masqueSettingsDescription from "./masqueSettings.md?raw";
import masqueAddressDescription from "./masqueAddress.md?raw";
import masquePortDescription from "./masquePort.md?raw";
import masqueRemoteDNSDescription from "./masqueRemoteDNS.md?raw";

export const masque = outboundSchemaBase
  .extend({
    protocol: z.literal("masque"),
    settings: z
      .object({
        address: z.string().meta({
          markdownDescription: masqueAddressDescription,
        }),
        port: portLikeSchema.meta({
          markdownDescription: masquePortDescription,
        }),
        remoteDNS: z
          .array(z.string())
          .default(["1.1.1.1", "1.0.0.1", "2606:4700:4700::1111", "2606:4700:4700::1001"])
          .optional()
          .meta({
            markdownDescription: masqueRemoteDNSDescription,
          }),
      })
      .meta({
        markdownDescription: masqueSettingsDescription,
      }),
  })
  .meta({
    markdownDescription: masqueDescription,
  });
