import z from "zod";
import { tls } from "../security/tls/tls.ts";
import { reality } from "../security/reality/reality.ts";
import { sockopt } from "../sockopt/sockopt.ts";
import xhttpDescription from "./xhttp.md?raw";
import xhttpSettingsDescription from "./xhttpSettings.md?raw";
import hostDescription from "./host.md?raw";
import pathDescription from "./path.md?raw";
import modeDescription from "./mode.md?raw";
import extraDescription from "./extra.md?raw";
import extraHeadersDescription from "./extraHeaders.md?raw";
import xPaddingBytesDescription from "./xPaddingBytes.md?raw";
import noGRPCHeaderDescription from "./noGRPCHeader.md?raw";
import noSSEHeaderDescription from "./noSSEHeader.md?raw";
import scMaxEachPostBytesDescription from "./scMaxEachPostBytes.md?raw";
import scMinPostsIntervalMsDescription from "./scMinPostsIntervalMs.md?raw";
import scMaxBufferedPostsDescription from "./scMaxBufferedPosts.md?raw";
import scStreamUpServerSecsDescription from "./scStreamUpServerSecs.md?raw";
import xmuxDescription from "./xmux.md?raw";
import maxConcurrencyDescription from "./maxConcurrency.md?raw";
import maxConnectionsDescription from "./maxConnections.md?raw";
import cMaxReuseTimesDescription from "./cMaxReuseTimes.md?raw";
import hMaxRequestTimesDescription from "./hMaxRequestTimes.md?raw";
import hMaxReusableSecsDescription from "./hMaxReusableSecs.md?raw";
import hKeepAlivePeriodDescription from "./hKeepAlivePeriod.md?raw";
import downloadSettingsDescription from "./downloadSettings.md?raw";
import downloadHostDescription from "./downloadHost.md?raw";
import downloadPathDescription from "./downloadPath.md?raw";
import downloadModeDescription from "./downloadMode.md?raw";
import downloadAddressDescription from "./downloadAddress.md?raw";
import downloadPortDescription from "./downloadPort.md?raw";
import downloadNetworkDescription from "./downloadNetwork.md?raw";
import downloadXhttpSettingsDescription from "./downloadXhttpSettings.md?raw";
import downloadSockoptDescription from "./downloadSockopt.md?raw";
import networkDescription from "../networkField.md?raw";
import xhttpSettingsFieldDescription from "../xhttpSettingsField.md?raw";
import { transportBase } from "../base.ts";

const intOrRange = z.union([z.number().int(), z.string().regex(/^-?\d+-\d+$/)]);

const xmux = z
  .object({
    maxConcurrency: intOrRange.default("16-32").optional().meta({
      markdownDescription: maxConcurrencyDescription,
    }),
    maxConnections: intOrRange.default(0).optional().meta({
      markdownDescription: maxConnectionsDescription,
    }),
    cMaxReuseTimes: intOrRange.default(0).optional().meta({
      markdownDescription: cMaxReuseTimesDescription,
    }),
    hMaxRequestTimes: intOrRange.optional().meta({
      markdownDescription: hMaxRequestTimesDescription,
    }),
    hMaxReusableSecs: intOrRange.optional().meta({
      markdownDescription: hMaxReusableSecsDescription,
    }),
    hKeepAlivePeriod: z.number().int().default(0).optional().meta({
      markdownDescription: hKeepAlivePeriodDescription,
    }),
  })
  .meta({
    markdownDescription: xmuxDescription,
  });

const downloadXhttpSettings = z
  .object({
    host: z.string().default("").optional().meta({
      markdownDescription: downloadHostDescription,
    }),
    path: z.string().default("/").optional().meta({
      markdownDescription: downloadPathDescription,
    }),
    mode: z.enum(["auto", "packet-up", "stream-up", "stream-one"]).default("auto").optional().meta({
      markdownDescription: downloadModeDescription,
    }),
  })
  .meta({
    markdownDescription: downloadXhttpSettingsDescription,
  });

const xhttpSettingsCommonFields = z.object({
  address: z.string().meta({
    markdownDescription: downloadAddressDescription,
  }),
  port: z.number().int().nonnegative().meta({
    markdownDescription: downloadPortDescription,
  }),
  network: z.literal("xhttp").meta({
    markdownDescription: downloadNetworkDescription,
  }),
  xhttpSettings: downloadXhttpSettings.optional().meta({
    markdownDescription: downloadXhttpSettingsDescription,
  }),
  sockopt: sockopt.optional().meta({
    markdownDescription: downloadSockoptDescription,
  }),
});

const downloadSettings = z
  .discriminatedUnion("security", [
    tls.merge(xhttpSettingsCommonFields),
    reality.merge(xhttpSettingsCommonFields),
  ])
  .optional();

const extra = z
  .object({
    headers: z.record(z.string(), z.string()).optional().meta({
      markdownDescription: extraHeadersDescription,
    }),
    xPaddingBytes: intOrRange.default("100-1000").optional().meta({
      markdownDescription: xPaddingBytesDescription,
    }),
    noGRPCHeader: z.boolean().default(false).optional().meta({
      markdownDescription: noGRPCHeaderDescription,
    }),
    noSSEHeader: z.boolean().default(false).optional().meta({
      markdownDescription: noSSEHeaderDescription,
    }),
    scMaxEachPostBytes: intOrRange.optional().meta({
      markdownDescription: scMaxEachPostBytesDescription,
    }),
    scMinPostsIntervalMs: intOrRange.optional().meta({
      markdownDescription: scMinPostsIntervalMsDescription,
    }),
    scMaxBufferedPosts: z.number().int().optional().meta({
      markdownDescription: scMaxBufferedPostsDescription,
    }),
    scStreamUpServerSecs: intOrRange.optional().meta({
      markdownDescription: scStreamUpServerSecsDescription,
    }),
    xmux: xmux.optional().meta({
      markdownDescription: xmuxDescription,
    }),
    downloadSettings: downloadSettings.optional().meta({
      markdownDescription: downloadSettingsDescription,
    }),
  })
  .passthrough()
  .optional()
  .meta({
    markdownDescription: extraDescription,
  });

const xhttpSettings = z
  .object({
    host: z.string().default("").optional().meta({
      markdownDescription: hostDescription,
    }),
    path: z.string().default("/").optional().meta({
      markdownDescription: pathDescription,
    }),
    mode: z.enum(["auto", "packet-up", "stream-up", "stream-one"]).default("auto").optional().meta({
      markdownDescription: modeDescription,
    }),
    extra,
  })
  .meta({
    markdownDescription: xhttpSettingsDescription,
  });

// TODO: distinguish server client settings
export const xhttpStream = transportBase
  .extend({
    network: z.literal("xhttp").meta({
      markdownDescription: networkDescription,
    }),
    xhttpSettings: xhttpSettings.optional().meta({
      markdownDescription: xhttpSettingsFieldDescription,
    }),
  })
  .meta({
    markdownDescription: xhttpDescription,
  });

export const splithttpStream = transportBase
  .extend({
    network: z.literal("splithttp").meta({
      markdownDescription: networkDescription,
    }),
    xhttpSettings: xhttpSettings.optional().meta({
      markdownDescription: xhttpSettingsFieldDescription,
    }),
  })
  .meta({
    markdownDescription: xhttpDescription,
  });
