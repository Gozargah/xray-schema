import z from "zod";
import httpupgradeDescription from "./httpupgrade.md?raw";
import acceptProxyProtocolDescription from "./acceptProxyProtocol.md?raw";
import pathDescription from "./path.md?raw";
import hostDescription from "./host.md?raw";
import headersDescription from "./headers.md?raw";
import methodDescription from "../methodField.md?raw";
import networkDescription from "../networkField.md?raw";
import httpupgradeSettingsFieldDescription from "../httpupgradeSettingsField.md?raw";
import { transportBase } from "../base";

export const httpUpgradeStream = transportBase
  .extend({
    network: z.literal("httpupgrade").optional().meta({
      markdownDescription: networkDescription,
      deprecated: true,
      deprecationMessage: "Use 'method' instead of 'network'.",
    }),
    method: z.literal("httpupgrade").meta({
      markdownDescription: methodDescription,
    }),
    httpSettings: z
      .object({
        acceptProxyProtocol: z.boolean().default(false).optional().meta({
          markdownDescription: acceptProxyProtocolDescription,
        }),
        path: z.string().default("/").optional().meta({
          markdownDescription: pathDescription,
        }),
        host: z.string().default("").optional().meta({
          markdownDescription: hostDescription,
        }),
        headers: z.record(z.string(), z.string()).default({}).optional().meta({
          markdownDescription: headersDescription,
        }),
      })
      .optional()
      .meta({
        markdownDescription: httpupgradeSettingsFieldDescription,
      }),
  })
  .meta({
    markdownDescription: httpupgradeDescription,
    deprecated: true,
    deprecationMessage: `It is recommended to switch to XHTTP to avoid significant traffic fingerprints such as HTTPUpgrade's "ALPN is http/1.1".`,
  });
