import z from "zod";
import { generalInboundSchema } from "../../baseInbound/baseInbound.ts";
import hysteriaDescription from "./hysteria.md?raw";
import hysteriaSettingsDescription from "./hysteriaSettings.md?raw";
import hysteriaVersionDescription from "./hysteriaVersion.md?raw";
import hysteriaUsersDescription from "./hysteriaUsers.md?raw";
import hysteriaUserAuthDescription from "./hysteriaUserAuth.md?raw";
import hysteriaUserLevelDescription from "./hysteriaUserLevel.md?raw";
import hysteriaUserEmailDescription from "./hysteriaUserEmail.md?raw";

const hysteriaUser = z.object({
  auth: z.string().min(1).meta({
    markdownDescription: hysteriaUserAuthDescription,
  }),
  email: z.string().min(1).meta({
    markdownDescription: hysteriaUserEmailDescription,
  }),
  level: z.number().int().default(0).optional().meta({
    markdownDescription: hysteriaUserLevelDescription,
  }),
});

export const hysteriaInboundSchema = generalInboundSchema
  .extend({
    protocol: z.literal("hysteria"),
    settings: z
      .object({
        version: z.literal(2).meta({
          markdownDescription: hysteriaVersionDescription,
        }),
        users: z.array(hysteriaUser).default([]).optional().meta({
          markdownDescription: hysteriaUsersDescription,
        }),
      })
      .meta({
        markdownDescription: hysteriaSettingsDescription,
      }),
  })
  .meta({
    markdownDescription: hysteriaDescription,
  });
