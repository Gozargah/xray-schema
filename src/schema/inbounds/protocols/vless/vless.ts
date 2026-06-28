import z from "zod";
import { generalInboundSchema } from "../../baseInbound/baseInbound.ts";
import vlessDescription from "./vless.md?raw";
import vlessSettingsDescription from "./vlessSettings.md?raw";
import vlessUsersDescription from "./vlessUsers.md?raw";
import vlessDecryptionDescription from "./vlessDecryption.md?raw";
import vlessFallbacksDescription from "./vlessFallbacks.md?raw";
import vlessUserIdDescription from "./vlessUserId.md?raw";
import vlessUserLevelDescription from "./vlessUserLevel.md?raw";
import vlessUserEmailDescription from "./vlessUserEmail.md?raw";
import vlessUserFlowDescription from "./vlessUserFlow.md?raw";
import vlessUserReverseDescription from "./vlessUserReverse.md?raw";
import vlessUserReverseTagDescription from "./vlessUserReverseTag.md?raw";

const vlessClient = z.object({
  id: z.string().min(1).meta({
    markdownDescription: vlessUserIdDescription,
  }),
  level: z.number().default(0).optional().meta({
    markdownDescription: vlessUserLevelDescription,
  }),
  email: z.string().optional().meta({
    markdownDescription: vlessUserEmailDescription,
  }),
  flow: z.enum(["", "xtls-rprx-vision"]).default("").optional().meta({
    markdownDescription: vlessUserFlowDescription,
  }),
  reverse: z
    .object({
      tag: z.string().min(1).optional().meta({
        markdownDescription: vlessUserReverseTagDescription,
      }),
    })
    .default({})
    .optional()
    .meta({
      markdownDescription: vlessUserReverseDescription,
    }),
});

const vlessFallbackSchema = z.object({
  name: z.string().default("").optional(),
  alpn: z.string().default("").optional(),
  path: z.string().default("").optional(),
  dest: z.string().or(z.number()).optional(),
  xver: z.number().default(0).optional(),
});

const baseVlessSettings = z.object({
  decryption: z.literal("none").or(z.string()).meta({
    markdownDescription: vlessDecryptionDescription,
  }),
  fallbacks: z.array(vlessFallbackSchema).optional().meta({
    markdownDescription: vlessFallbacksDescription,
  }),
});

export const vlessInboundSchema = generalInboundSchema
  .extend({
    protocol: z.literal("vless"),
    settings: baseVlessSettings
      .extend({
        users: z.array(vlessClient).default([]).optional().meta({
          markdownDescription: vlessUsersDescription,
        }),
      })
      .or(
        baseVlessSettings.extend({
          clients: z.array(vlessClient).default([]).optional().meta({
            markdownDescription: vlessUsersDescription,
          }),
        }),
      )
      .meta({
        markdownDescription: vlessSettingsDescription,
      }),
  })
  .meta({
    markdownDescription: vlessDescription,
  });
