import z from "zod";
import { generalInboundSchema } from "../../baseInbound/baseInbound.ts";
import vmessDescription from "./vmess.md?raw";
import vmessSettingsDescription from "./vmessSettings.md?raw";
import vmessUsersDescription from "./vmessUsers.md?raw";
import vmessDefaultDescription from "./vmessDefault.md?raw";
import vmessUserIdDescription from "./vmessUserId.md?raw";
import vmessUserLevelDescription from "./vmessUserLevel.md?raw";
import vmessUserEmailDescription from "./vmessUserEmail.md?raw";

const vmessClients = z.object({
  id: z.string().min(1).meta({
    markdownDescription: vmessUserIdDescription,
  }),
  level: z.number().optional().meta({
    markdownDescription: vmessUserLevelDescription,
  }),
  email: z.string().optional().meta({
    markdownDescription: vmessUserEmailDescription,
  }),
});

const baseVmessSettings = z.object({
  default: z
    .object({
      level: z.number().meta({
        markdownDescription: vmessUserLevelDescription,
      }),
    })
    .optional()
    .meta({
      markdownDescription: vmessDefaultDescription,
    }),
});

export const vmessInboundSchema = generalInboundSchema
  .extend({
    protocol: z.literal("vmess"),
    settings: baseVmessSettings
      .extend({
        clients: z.array(vmessClients).default([]).optional().meta({
          markdownDescription: vmessUsersDescription,
        }),
      })
      .or(
        baseVmessSettings.extend({
          users: z.array(vmessClients).default([]).optional().meta({
            markdownDescription: vmessUsersDescription,
          }),
        }),
      )
      .meta({
        markdownDescription: vmessSettingsDescription,
      }),
  })
  .meta({
    markdownDescription: vmessDescription,
  });
