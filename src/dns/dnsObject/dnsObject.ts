import z from "zod";
import addressDescription from "./address.md?raw";
import portDescription from "./port.md?raw";
import domainsDescription from "./domains.md?raw";
import expectedIPsDescription from "./expectedIPs.md?raw";
import unexpectedIPsDescription from "./unexpectedIPs.md?raw";
import skipFallbackDescription from "./skipFallback.md?raw";
import finalQueryDescription from "./finalQuery.md?raw";
import queryStrategyDescription from "./queryStrategy.md?raw";
import timeoutMsDescription from "./timeoutMs.md?raw";

export const dnsObject = z.object({
  address: z.string().meta({ markdownDescription: addressDescription }),
  port: z.number().optional().meta({ markdownDescription: portDescription }),
  domains: z.array(z.string()).optional().meta({ markdownDescription: domainsDescription }),
  expectedIPs: z.array(z.string()).optional().meta({ markdownDescription: expectedIPsDescription }),
  unexpectedIPs: z
    .array(z.string())
    .optional()
    .meta({ markdownDescription: unexpectedIPsDescription }),
  skipFallback: z
    .boolean()
    .default(false)
    .optional()
    .meta({ markdownDescription: skipFallbackDescription }),
  timeoutMs: z
    .number()
    .optional()
    .default(4000)
    .meta({ markdownDescription: timeoutMsDescription }),
  finalQuery: z
    .boolean()
    .default(false)
    .optional()
    .meta({ markdownDescription: finalQueryDescription }),
  tag: z.string().optional(),
  clientIP: z.string().optional(),
  queryStrategy: z
    .enum(["UseIP", "UseIPv4", "UseIPv6", "UseSystem"])
    .default("UseIP")
    .optional()
    .meta({ markdownDescription: queryStrategyDescription }),
  disableCache: z.boolean().default(false).optional(),
});
