import z from "zod";
import { outboundSchemaBase } from "../baseOutbound/baseOutbound";
import masqueDescription from "./masque.md?raw";
import masqueSettingsDescription from "./masqueSettings.md?raw";
import masqueAddressDescription from "./address.md?raw";
import masquePortDescription from "./port.md?raw";
import masqueRemoteDNSDescription from "./remoteDNS.md?raw";

export const masque = outboundSchemaBase
  .extend({
    protocol: z.literal("masque"),
    settings: z
      .object({
        address: z.string().min(1).meta({
          markdownDescription: masqueAddressDescription,
        }),
        port: z.number().int().min(1).max(65535).meta({
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
