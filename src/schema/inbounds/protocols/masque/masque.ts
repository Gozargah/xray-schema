import z from "zod";
import { generalInboundSchema } from "../../baseInbound/baseInbound.ts";
import masqueDescription from "./masque.md?raw";
import masqueSettingsDescription from "./masqueSettings.md?raw";
import masqueUsersDescription from "./masqueUsers.md?raw";
import masqueAddressDescription from "./masqueAddress.md?raw";
import masqueMtuDescription from "./masqueMtu.md?raw";
import masqueUserEmailDescription from "./masqueUserEmail.md?raw";
import masqueUserPassDescription from "./masqueUserPass.md?raw";
import masqueUserLevelDescription from "./masqueUserLevel.md?raw";

const masqueUser = z.object({
  email: z
    .string()
    .min(1)
    .regex(/^[^:]+$/)
    .meta({
      markdownDescription: masqueUserEmailDescription,
    }),
  pass: z.string().min(1).meta({
    markdownDescription: masqueUserPassDescription,
  }),
  level: z.number().int().default(0).optional().meta({
    markdownDescription: masqueUserLevelDescription,
  }),
});

export const masqueInboundSchema = generalInboundSchema
  .extend({
    protocol: z.literal("masque"),
    settings: z
      .object({
        users: z.array(masqueUser).optional().meta({
          markdownDescription: masqueUsersDescription,
        }),
        clients: z.array(masqueUser).optional().meta({
          markdownDescription: masqueUsersDescription,
        }),
        address: z.array(z.string()).min(1).meta({
          markdownDescription: masqueAddressDescription,
        }),
        mtu: z.number().int().min(1280).max(65535).default(1280).optional().meta({
          markdownDescription: masqueMtuDescription,
        }),
      })
      .meta({
        markdownDescription: masqueSettingsDescription,
      }),
  })
  .meta({
    markdownDescription: masqueDescription,
  });
