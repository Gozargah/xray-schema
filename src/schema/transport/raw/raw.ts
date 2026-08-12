import z from "zod";
import rawDescription from "./raw.md?raw";
import rawSettingsDescription from "./rawSettings.md?raw";
import acceptProxyProtocolDescription from "./acceptProxyProtocol.md?raw";
import headerDescription from "./header.md?raw";
import noneHeaderDescription from "./noneHeader.md?raw";
import httpHeaderDescription from "./httpHeader.md?raw";
import requestDescription from "./request.md?raw";
import responseDescription from "./response.md?raw";
import versionDescription from "./version.md?raw";
import methodDescription from "./method.md?raw";
import pathDescription from "./path.md?raw";
import headersDescription from "./headers.md?raw";
import statusDescription from "./status.md?raw";
import reasonDescription from "./reason.md?raw";
import networkDescription from "../methodField.md?raw";
import rawSettingsFieldDescription from "../rawSettingsField.md?raw";
import tcpSettingsFieldDescription from "../tcpSettingsField.md?raw";
import { transportBase } from "../base";

const nonHeaderSchema = z.object({
  type: z.literal("none").meta({
    markdownDescription: noneHeaderDescription,
  }),
});

const httpHeaderRequestSchema = z
  .object({
    version: z.string().default("1.1").optional().meta({
      markdownDescription: versionDescription,
    }),
    method: z.string().default("GET").optional().meta({
      markdownDescription: methodDescription,
    }),
    path: z.array(z.string()).default(["/"]).optional().meta({
      markdownDescription: pathDescription,
    }),
    headers: z
      .record(z.string(), z.union([z.string(), z.array(z.string())]))
      .default({})
      .optional()
      .meta({
        markdownDescription: headersDescription,
      }),
  })
  .meta({
    markdownDescription: requestDescription,
  });

const httpHeaderResponseSchema = z
  .object({
    version: z.string().default("1.1").optional().meta({
      markdownDescription: versionDescription,
    }),
    status: z.string().default("200").optional().meta({
      markdownDescription: statusDescription,
    }),
    reason: z.string().default("OK").optional().meta({
      markdownDescription: reasonDescription,
    }),
    headers: z
      .record(z.string(), z.union([z.string(), z.array(z.string())]))
      .default({})
      .optional()
      .meta({
        markdownDescription: headersDescription,
      }),
  })
  .meta({
    markdownDescription: responseDescription,
  });

const httpHeaderSchema = z.object({
  type: z.literal("http").meta({
    markdownDescription: httpHeaderDescription,
  }),
  request: httpHeaderRequestSchema.default({}).optional().meta({
    markdownDescription: requestDescription,
  }),
  response: httpHeaderResponseSchema.default({}).optional().meta({
    markdownDescription: responseDescription,
  }),
});

const rawSettingsHeaderSchema = z.discriminatedUnion("type", [nonHeaderSchema, httpHeaderSchema]);

const rawSettings = z
  .object({
    acceptProxyProtocol: z.boolean().default(false).optional().meta({
      markdownDescription: acceptProxyProtocolDescription,
    }),
    header: rawSettingsHeaderSchema.default({ type: "none" }).optional().meta({
      markdownDescription: headerDescription,
    }),
  })
  .optional()
  .meta({
    markdownDescription: rawSettingsDescription,
  });

export const rawStream = transportBase
  .extend({
    method: z.literal("raw").meta({
      markdownDescription: networkDescription,
    }),
    rawSettings: rawSettings.meta({
      markdownDescription: rawSettingsFieldDescription,
    }),
  })
  .meta({
    markdownDescription: rawDescription,
  });

export const tcpStream = transportBase
  .extend({
    method: z.literal("tcp").optional().meta({
      markdownDescription: networkDescription,
    }),
    tcpSettings: rawSettings.meta({
      markdownDescription: tcpSettingsFieldDescription,
    }),
  })
  .meta({
    markdownDescription: rawDescription,
  });
