import z from "zod";
import { generalInboundSchema } from "../../baseInbound/baseInbound.ts";
import httpDescription from "./http.md?raw";
import httpSettingsDescription from "./httpSettings.md?raw";
import usersDescription from "./users.md?raw";
import allowTransparentDescription from "./allowTransparent.md?raw";
import userLevelDescription from "./userLevel.md?raw";
import userDescription from "./user.md?raw";
import passDescription from "./pass.md?raw";

const httpUserSchema = z.object({
  user: z.string().min(1).meta({
    markdownDescription: userDescription,
  }),
  pass: z.string().min(1).meta({
    markdownDescription: passDescription,
  }),
});

const httpSettingsSchema = z
  .object({
    users: z.array(httpUserSchema).default([]).optional().meta({
      markdownDescription: usersDescription,
    }),
    allowTransparent: z.boolean().default(false).optional().meta({
      markdownDescription: allowTransparentDescription,
    }),
    userLevel: z.number().default(0).optional().meta({
      markdownDescription: userLevelDescription,
    }),
  })
  .meta({
    markdownDescription: httpSettingsDescription,
  });

export const httpInboundSchema = generalInboundSchema
  .extend({
    protocol: z.literal("http"),
    settings: httpSettingsSchema.optional(),
  })
  .meta({
    markdownDescription: httpDescription,
  });
