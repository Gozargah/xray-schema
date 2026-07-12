import z from "zod";
import websocketDescription from "./websocket.md?raw";
import acceptProxyProtocolDescription from "./acceptProxyProtocol.md?raw";
import pathDescription from "./path.md?raw";
import hostDescription from "./host.md?raw";
import headersDescription from "./headers.md?raw";
import heartbeatPeriodDescription from "./heartbeatPeriod.md?raw";
import methodDescription from "../methodField.md?raw";
import networkDescription from "../networkField.md?raw";
import wsSettingsFieldDescription from "../wsSettingsField.md?raw";
import { transportBase } from "../base";

export const websocketStream = transportBase
  .extend({
    network: z.literal("websocket").or(z.literal("ws")).optional().meta({
      markdownDescription: networkDescription,
      deprecated: true,
      deprecationMessage: "Use 'method' instead of 'network'.",
    }),
    method: z.literal("websocket").or(z.literal("ws")).meta({
      markdownDescription: methodDescription,
    }),
    wsSettings: z
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
        heartbeatPeriod: z.number().int().nonnegative().default(0).optional().meta({
          markdownDescription: heartbeatPeriodDescription,
        }),
      })
      .optional()
      .meta({
        markdownDescription: wsSettingsFieldDescription,
      }),
  })
  .meta({
    markdownDescription: websocketDescription,
    deprecated: true,
    deprecationMessage: `It is recommended to switch to XHTTP to avoid significant traffic characteristics like WebSocket "ALPN is http/1.1".`,
  });
