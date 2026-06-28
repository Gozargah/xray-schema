import z from "zod";
import { generalInboundSchema } from "../../baseInbound/baseInbound.ts";
import trojanDescription from "./trojan.md?raw";
import trojanSettingsDescription from "./trojanSettings.md?raw";
import usersDescription from "./users.md?raw";
import fallbacksDescription from "./fallbacks.md?raw";
import userPasswordDescription from "./userPassword.md?raw";
import userEmailDescription from "./userEmail.md?raw";
import userLevelDescription from "./userLevel.md?raw";

const trojanUser = z.object({
  email: z.string().min(1).meta({
    markdownDescription: userEmailDescription,
  }),
  password: z.string().min(1).meta({
    markdownDescription: userPasswordDescription,
  }),
  level: z.number().int().default(0).optional().meta({
    markdownDescription: userLevelDescription,
  }),
});

const trojanFallback = z.object({
  name: z.string().default("").optional(),
  alpn: z.string().default("").optional(),
  path: z.string().default("").optional(),
  dest: z.string().or(z.number()).optional(),
  xver: z.number().default(0).optional(),
});

export const trojanInboundSchema = generalInboundSchema
  .extend({
    protocol: z.literal("trojan"),
    settings: z
      .object({
        users: z.array(trojanUser).default([]).optional().meta({
          markdownDescription: usersDescription,
        }),
        fallbacks: z.array(trojanFallback).optional().meta({
          markdownDescription: fallbacksDescription,
        }),
      })
      .meta({
        markdownDescription: trojanSettingsDescription,
      }),
  })
  .meta({
    markdownDescription: trojanDescription,
  });
