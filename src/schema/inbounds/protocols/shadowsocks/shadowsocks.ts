import z from "zod";
import { generalInboundSchema } from "../../baseInbound/baseInbound.ts";
import shadowsocksDescription from "./shadowsocks.md?raw";
import shadowsocksSettingsDescription from "./shadowsocksSettings.md?raw";
import networkDescription from "./network.md?raw";
import methodDescription from "./method.md?raw";
import passwordDescription from "./password.md?raw";
import levelDescription from "./level.md?raw";
import emailDescription from "./email.md?raw";
import usersDescription from "./users.md?raw";
import userMethodDescription from "./userMethod.md?raw";
import userPasswordDescription from "./userPassword.md?raw";
import userLevelDescription from "./userLevel.md?raw";
import userEmailDescription from "./userEmail.md?raw";

export const ss22Methods = z
  .literal("2022-blake3-aes-128-gcm")
  .or(z.literal("2022-blake3-aes-256-gcm").or(z.literal("2022-blake3-chacha20-poly1305")));

const ss22UserSchema = z.object({
  password: z.string().optional().meta({
    markdownDescription: userPasswordDescription,
  }),
  level: z.number().default(0).optional().meta({
    markdownDescription: userLevelDescription,
  }),
  email: z.string().min(1).meta({
    markdownDescription: userEmailDescription,
  }),
});

export const ssMethods = z
  .literal("aes-256-gcm")
  .or(
    z
      .literal("aes-128-gcm")
      .or(
        z
          .literal("chacha20-poly1305")
          .or(
            z
              .literal("chacha20-ietf-poly1305")
              .or(z.literal("xchacha20-poly1305").or(z.literal("xchacha20-ietf-poly1305"))),
          ),
      ),
  );

const ssUserSchema = z.object({
  password: z.string().optional().meta({
    markdownDescription: userPasswordDescription,
  }),
  level: z.number().default(0).optional().meta({
    markdownDescription: userLevelDescription,
  }),
  email: z.string().min(1).meta({
    markdownDescription: userEmailDescription,
  }),
  method: ssMethods.optional().meta({
    markdownDescription: userMethodDescription,
  }),
});

const ssSettingsBaseSchema = z.object({
  network: z.enum(["tcp", "udp", "tcp,udp"]).default("tcp").optional().meta({
    markdownDescription: networkDescription,
  }),
  level: z.number().int().default(0).optional().meta({
    markdownDescription: levelDescription,
  }),
  password: z
    .string()
    .min(1)
    .meta({
      markdownDescription: passwordDescription,
    })
    .optional(),
  email: z
    .string()
    .meta({
      markdownDescription: emailDescription,
    })
    .optional(),
});
const ssUsers = z.array(ssUserSchema).optional().meta({
  markdownDescription: usersDescription,
});
const ssSettings = ssSettingsBaseSchema.extend({
  method: ssMethods.meta({
    markdownDescription: methodDescription,
  }),
  users: ssUsers,
  clients: ssUsers,
});
const ss22Users = z.array(ss22UserSchema).optional().meta({
  markdownDescription: usersDescription,
});
const ss22Settings = ssSettingsBaseSchema.extend({
  method: ss22Methods.meta({
    markdownDescription: methodDescription,
  }),
  password: z.string().min(1).meta({
    markdownDescription: passwordDescription,
  }),
  users: ss22Users,
  clients: ss22Users,
});
const shadowsocksSettingsSchema = z.discriminatedUnion("method", [ss22Settings, ssSettings]).meta({
  ifThenLogic: true,
  markdownDescription: shadowsocksSettingsDescription,
});

export const shadowsocksInboundSchema = generalInboundSchema
  .extend({
    protocol: z.literal("shadowsocks"),
    settings: shadowsocksSettingsSchema,
  })
  .meta({
    markdownDescription: shadowsocksDescription,
  });
