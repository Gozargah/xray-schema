import z from "zod";
import logAccess from "./access.md?raw";
import logError from "./error.md?raw";
import logLogLevel from "./logLevel.md?raw";
import logDnsLog from "./dnsLog.md?raw";
import logMaskAddress from "./maskAddress.md?raw";
import logDescription from "./log.md?raw";

export const logSchema = z
  .object({
    access: z
      .union([z.string(), z.literal("none")])
      .default("")
      .optional()
      .meta({
        markdownDescription: logAccess,
      }),
    error: z
      .union([z.string(), z.literal("none")])
      .optional()
      .default("")
      .optional()
      .meta({
        markdownDescription: logError,
      }),
    loglevel: z
      .enum(["debug", "info", "warning", "error", "none"])
      .default("warning")
      .optional()
      .meta({
        markdownDescription: logLogLevel,
      }),
    dnsLog: z
      .boolean()
      .optional()
      .default(false)
      .meta({
        markdownDescription: logDnsLog,
      })
      .optional(),
    maskAddress: z
      .union([
        z.literal(""),
        z.enum(["quarter", "half", "full"]),
        z.string().regex(/^\/(?:0|8|16|24|32)\+\/(?:12[0-8]|1[01][0-9]|[0-9]{1,2})$/),
      ])
      .default("")
      .optional()
      .meta({
        markdownDescription: logMaskAddress,
      }),
  })
  .meta({
    markdownDescription: logDescription,
  });
