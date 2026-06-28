import z from "zod";
import sniffingEnabledDescription from "./enabled.md?raw";
import sniffingDestOverrideDescription from "./destOverride.md?raw";
import sniffingMetadataOnlyDescription from "./metadataOnly.md?raw";
import sniffingDomainsExcludedDescription from "./domainsExcluded.md?raw";
import sniffingIpsExcludedDescription from "./ipsExcluded.md?raw";
import sniffingRouteOnlyDescription from "./routeOnly.md?raw";

export const sniffingSchema = z.object({
  enabled: z.boolean().default(true).optional().meta({
    markdownDescription: sniffingEnabledDescription,
  }),
  destOverride: z
    .array(z.enum(["http", "tls", "quic", "fakedns"]))
    .default(["http", "tls", "fakedns"])
    .meta({
      markdownDescription: sniffingDestOverrideDescription,
    }),
  metadataOnly: z.boolean().default(false).optional().meta({
    markdownDescription: sniffingMetadataOnlyDescription,
  }),
  domainsExcluded: z.array(z.string()).default([]).optional().meta({
    markdownDescription: sniffingDomainsExcludedDescription,
  }),
  ipsExcluded: z.array(z.string()).default([]).optional().meta({
    markdownDescription: sniffingIpsExcludedDescription,
  }),
  routeOnly: z.boolean().default(false).optional().meta({
    markdownDescription: sniffingRouteOnlyDescription,
  }),
});
