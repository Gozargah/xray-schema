import z from "zod";
import dnsDescription from "./dns.md?raw";
import hostsDescription from "./hosts.md?raw";
import serversDescription from "./servers.md?raw";
import clientIpDescription from "./clientIp.md?raw";
import queryStrategyDescription from "./queryStrategy.md?raw";
import tagDescription from "./tag.md?raw";
import disableCacheDescritpion from "./disableCache.md?raw";
import disableFallbackDescription from "./disableFallback.md?raw";
import disableFallbackIfMatchDescription from "./disableFallbackIfMatch.md?raw";
import useSystemHostsDescription from "./useSystemHosts.md?raw";
import enableParallelQueryDescription from "./enableParallelQuery.md?raw";
import serveStaleDescription from "./serveStale.md?raw";
import serveExpiredTTLDescription from "./serveExpiredTTL.md?raw";
import { dnsObject } from "./dnsObject/dnsObject.ts";

export const dnsSchema = z
  .object({
    hosts: z
      .record(z.string(), z.union([z.string(), z.array(z.string())]))
      .optional()
      .meta({
        markdownDescription: hostsDescription,
      }),
    servers: z
      .array(z.union([z.string(), dnsObject]))
      .optional()
      .meta({
        markdownDescription: serversDescription,
      }),
    tag: z.string().optional().meta({
      markdownDescription: tagDescription,
    }),
    clientIP: z.string().optional().meta({
      markdownDescription: clientIpDescription,
    }),
    queryStrategy: z
      .enum(["UseIP", "UseIPv4", "UseIPv6", "UseSystem"])
      .default("UseIP")
      .optional()
      .meta({
        markdownDescription: queryStrategyDescription,
      }),
    disableCache: z
      .boolean()
      .default(false)
      .optional()
      .meta({ markdownDescription: disableCacheDescritpion }),
    disableFallback: z
      .boolean()
      .default(false)
      .optional()
      .meta({ markdownDescription: disableFallbackDescription }),
    disableFallbackIfMatch: z
      .boolean()
      .default(false)
      .optional()
      .meta({ markdownDescription: disableFallbackIfMatchDescription }),
    useSystemHosts: z
      .boolean()
      .default(false)
      .optional()
      .meta({ markdownDescription: useSystemHostsDescription }),
    enableParallelQuery: z
      .boolean()
      .default(false)
      .optional()
      .meta({ markdownDescription: enableParallelQueryDescription }),
    serveStale: z
      .boolean()
      .default(false)
      .optional()
      .meta({ markdownDescription: serveStaleDescription }),
    serveExpiredTTL: z
      .number()
      .default(0)
      .optional()
      .meta({ markdownDescription: serveExpiredTTLDescription }),
  })
  .meta({
    markdownDescription: dnsDescription,
  });
