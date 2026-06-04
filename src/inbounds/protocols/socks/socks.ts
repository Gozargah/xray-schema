import z from "zod";
import { generalInboundSchema } from "../../baseInbound/baseInbound.ts";
import socksDescription from "./socks.md?raw";
import socksSettingsDescription from "./socksSettings.md?raw";
import authDescription from "./auth.md?raw";
import usersDescription from "./users.md?raw";
import udpDescription from "./udp.md?raw";
import ipDescription from "./ip.md?raw";
import userLevelDescription from "./userLevel.md?raw";
import userDescription from "./user.md?raw";
import passDescription from "./pass.md?raw";

const socksSettingsBaseSchema = z.object({
  udp: z.boolean().default(false).optional().meta({
    markdownDescription: udpDescription,
  }),
  ip: z.string().optional().meta({
    markdownDescription: ipDescription,
  }),
  userLevel: z.number().default(0).optional().meta({
    markdownDescription: userLevelDescription,
  }),
});

const socksAccount = z.object({
  user: z.string().min(1).meta({
    markdownDescription: userDescription,
  }),
  pass: z.string().min(1).meta({
    markdownDescription: passDescription,
  }),
});

const socksSettingsSchema = z
  .discriminatedUnion("auth", [
    socksSettingsBaseSchema
      .extend({
        auth: z
          .literal("noauth")
          .meta({
            markdownDescription: authDescription,
          })
          .optional(),
      })
      .loose(),
    socksSettingsBaseSchema
      .extend({
        auth: z.literal("password").meta({
          markdownDescription: authDescription,
        }),
        users: z.array(socksAccount).default([]).optional().meta({
          markdownDescription: usersDescription,
        }),
      })
      .loose(),
  ])
  .meta({
    markdownDescription: socksSettingsDescription,
  });

export const socksInboundSchema = generalInboundSchema
  .extend({
    protocol: z.literal("socks").or(z.literal("mixed")),
    settings: socksSettingsSchema.optional(),
  })
  .meta({
    markdownDescription: socksDescription,
  });
