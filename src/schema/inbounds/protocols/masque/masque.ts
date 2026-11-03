import z from "zod";
import { generalInboundSchema } from "../../baseInbound/baseInbound.ts";
import masqueDescription from "./masque.md?raw";
import masqueSettingsDescription from "./masqueSettings.md?raw";
import usersDescription from "./users.md?raw";
import addressDescription from "./address.md?raw";
import mtuDescription from "./mtu.md?raw";
import userEmailDescription from "./userEmail.md?raw";
import userPassDescription from "./userPass.md?raw";
import userLevelDescription from "./userLevel.md?raw";

const masqueUser = z.object({
  email: z.string().min(1).meta({
    markdownDescription: userEmailDescription,
  }),
  pass: z.string().min(1).meta({
    markdownDescription: userPassDescription,
  }),
  level: z.number().int().default(0).optional().meta({
    markdownDescription: userLevelDescription,
  }),
});

export const masqueInboundSchema = generalInboundSchema
  .extend({
    protocol: z.literal("masque"),
    settings: z
      .object({
        users: z.array(masqueUser).default([]).optional().meta({
          markdownDescription: usersDescription,
        }),
        clients: z.array(masqueUser).optional().meta({
          markdownDescription: usersDescription,
        }),
        address: z.array(z.string()).min(1).meta({
          markdownDescription: addressDescription,
        }),
        mtu: z.number().int().min(1280).max(65535).default(1280).optional().meta({
          markdownDescription: mtuDescription,
        }),
      })
      .meta({
        markdownDescription: masqueSettingsDescription,
      }),
  })
  .meta({
    markdownDescription: masqueDescription,
  });
