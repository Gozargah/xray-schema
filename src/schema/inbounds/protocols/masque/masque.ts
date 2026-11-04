import z from "zod";
import { generalInboundSchema } from "../../baseInbound/baseInbound.ts";
import masqueDescription from "./masque.md?raw";
import masqueSettingsDescription from "./masqueSettings.md?raw";
import masqueUsersDescription from "./users.md?raw";
import masqueAddressDescription from "./address.md?raw";
import masqueMtuDescription from "./mtu.md?raw";
import masqueUserEmailDescription from "./userEmail.md?raw";
import masqueUserPassDescription from "./userPass.md?raw";
import masqueUserLevelDescription from "./userLevel.md?raw";

const masqueUser = z.object({
  email: z.string().min(1).meta({
    markdownDescription: masqueUserEmailDescription,
  }),
  pass: z.string().min(1).meta({
    markdownDescription: masqueUserPassDescription,
  }),
  level: z.number().int().default(0).optional().meta({
    markdownDescription: masqueUserLevelDescription,
  }),
});

const baseMasqueSettings = z.object({
  address: z.array(z.string().min(1)).min(1).max(2).meta({
    markdownDescription: masqueAddressDescription,
  }),
  mtu: z.number().int().min(1280).max(65535).default(1280).optional().meta({
    markdownDescription: masqueMtuDescription,
  }),
});

export const masqueInboundSchema = generalInboundSchema
  .extend({
    protocol: z.literal("masque"),
    settings: baseMasqueSettings
      .extend({
        users: z.array(masqueUser).default([]).optional().meta({
          markdownDescription: masqueUsersDescription,
        }),
      })
      .or(
        baseMasqueSettings.extend({
          clients: z.array(masqueUser).default([]).optional().meta({
            markdownDescription: masqueUsersDescription,
          }),
        }),
      )
      .meta({
        markdownDescription: masqueSettingsDescription,
      }),
  })
  .meta({
    markdownDescription: masqueDescription,
  });
