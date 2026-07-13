import z from "zod";
import hysteriaDescription from "./hysteria.md?raw";
import versionDescription from "./version.md?raw";
import authDescription from "./auth.md?raw";
import udpIdleTimeoutDescription from "./udpIdleTimeout.md?raw";
import masqueradeDescription from "./masquerade.md?raw";
import typeDescription from "./type.md?raw";
import dirDescription from "./dir.md?raw";
import urlDescription from "./url.md?raw";
import rewriteHostDescription from "./rewriteHost.md?raw";
import insecureDescription from "./insecure.md?raw";
import contentDescription from "./content.md?raw";
import headersDescription from "./headers.md?raw";
import statusCodeDescription from "./statusCode.md?raw";
import methodDescription from "../methodField.md?raw";
import hysteriaSettingsFieldDescription from "../hysteriaSettingsField.md?raw";
import { transportBase } from "../base";

const masquerade = z
  .object({
    type: z.enum(["file", "proxy", "string", ""]).default("").optional().meta({
      markdownDescription: typeDescription,
    }),
    dir: z.string().default("").optional().meta({
      markdownDescription: dirDescription,
    }),
    url: z.string().default("").optional().meta({
      markdownDescription: urlDescription,
    }),
    rewriteHost: z.boolean().default(false).optional().meta({
      markdownDescription: rewriteHostDescription,
    }),
    insecure: z.boolean().default(false).optional().meta({
      markdownDescription: insecureDescription,
    }),
    content: z.string().default("").optional().meta({
      markdownDescription: contentDescription,
    }),
    headers: z.record(z.string(), z.string()).default({}).optional().meta({
      markdownDescription: headersDescription,
    }),
    statusCode: z.number().int().default(0).optional().meta({
      markdownDescription: statusCodeDescription,
    }),
  })
  .meta({
    markdownDescription: masqueradeDescription,
  });

export const hysteriaStream = transportBase
  .extend({
    method: z.literal("hysteria").meta({
      markdownDescription: methodDescription,
    }),
    hysteriaSettings: z
      .object({
        version: z.literal(2).default(2).meta({
          markdownDescription: versionDescription,
        }),
        auth: z.string().meta({
          markdownDescription: authDescription,
        }),
        udpIdleTimeout: z.number().int().nonnegative().default(60).optional().meta({
          markdownDescription: udpIdleTimeoutDescription,
        }),
        masquerade: masquerade.optional(),
      })
      .optional()
      .meta({
        markdownDescription: hysteriaSettingsFieldDescription,
      }),
  })
  .meta({
    markdownDescription: hysteriaDescription,
  });
