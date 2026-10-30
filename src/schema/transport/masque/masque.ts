import z from "zod";
import { transportBase } from "../base";
import masqueDescription from "./masque.md?raw";
import masqueSettingsDescription from "./masqueSettings.md?raw";
import hostDescription from "./host.md?raw";
import pathDescription from "./path.md?raw";
import userDescription from "./user.md?raw";
import passDescription from "./pass.md?raw";
import headersDescription from "./headers.md?raw";
import warpDescription from "./warp.md?raw";
import privateKeyDescription from "./privateKey.md?raw";
import publicKeyDescription from "./publicKey.md?raw";
import addressDescription from "./address.md?raw";
import methodDescription from "../methodField.md?raw";
import masqueSettingsFieldDescription from "../masqueSettingsField.md?raw";

const warp = z.object({
  privateKey: z.string().meta({
    markdownDescription: privateKeyDescription,
  }),
  publicKey: z.string().meta({
    markdownDescription: publicKeyDescription,
  }),
  address: z.array(z.string()).min(1).meta({
    markdownDescription: addressDescription,
  }),
});

export const masqueStream = transportBase
  .extend({
    method: z.literal("masque").meta({
      markdownDescription: methodDescription,
    }),
    masqueSettings: z
      .object({
        host: z.string().optional().meta({
          markdownDescription: hostDescription,
        }),
        path: z.string().default("/.well-known/masque/ip/{target}/{ipproto}/").optional().meta({
          markdownDescription: pathDescription,
        }),
        user: z.string().optional().meta({
          markdownDescription: userDescription,
        }),
        pass: z.string().optional().meta({
          markdownDescription: passDescription,
        }),
        headers: z.record(z.string(), z.string()).optional().meta({
          markdownDescription: headersDescription,
        }),
        warp: warp.optional().meta({
          markdownDescription: warpDescription,
        }),
      })
      .meta({
        markdownDescription: masqueSettingsDescription,
      })
      .optional()
      .meta({
        markdownDescription: masqueSettingsFieldDescription,
      }),
  })
  .meta({
    markdownDescription: masqueDescription,
  });
