import z from "zod";
import masqueDescription from "./masque.md?raw";
import hostDescription from "./host.md?raw";
import pathDescription from "./path.md?raw";
import userDescription from "./user.md?raw";
import passDescription from "./pass.md?raw";
import headersDescription from "./headers.md?raw";
import warpDescription from "./warp.md?raw";
import warpPrivateKeyDescription from "./warpPrivateKey.md?raw";
import warpPublicKeyDescription from "./warpPublicKey.md?raw";
import warpAddressDescription from "./warpAddress.md?raw";
import networkDescription from "../methodField.md?raw";
import masqueSettingsFieldDescription from "../masqueSettingsField.md?raw";
import { transportBase } from "../base";

const warp = z
  .object({
    privateKey: z.string().meta({
      markdownDescription: warpPrivateKeyDescription,
    }),
    publicKey: z.string().meta({
      markdownDescription: warpPublicKeyDescription,
    }),
    address: z.array(z.string()).min(1).meta({
      markdownDescription: warpAddressDescription,
    }),
  })
  .meta({
    markdownDescription: warpDescription,
  });

export const masqueStream = transportBase
  .extend({
    method: z.literal("masque").meta({
      markdownDescription: networkDescription,
    }),
    masqueSettings: z
      .object({
        host: z.string().optional().meta({
          markdownDescription: hostDescription,
        }),
        path: z.string().default("/.well-known/masque/ip/{target}/{ipproto}/").optional().meta({
          markdownDescription: pathDescription,
        }),
        user: z
          .string()
          .regex(/^[^:]+$/)
          .optional()
          .meta({
            markdownDescription: userDescription,
          }),
        pass: z.string().optional().meta({
          markdownDescription: passDescription,
        }),
        headers: z.record(z.string(), z.string()).optional().meta({
          markdownDescription: headersDescription,
        }),
        warp: warp.optional(),
      })
      .optional()
      .meta({
        markdownDescription: masqueSettingsFieldDescription,
      }),
  })
  .meta({
    markdownDescription: masqueDescription,
  });
