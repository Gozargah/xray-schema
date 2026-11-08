import z from "zod";
import filterDescription from "./filter.md?raw";
import filterUdpDescription from "./filterUdp.md?raw";
import allowedSourceIPsDescription from "./allowedSourceIPs.md?raw";
import blockedSourceIPsDescription from "./blockedSourceIPs.md?raw";

const filterSettings = z.object({
  allowedSourceIPs: z.array(z.string()).optional().meta({
    markdownDescription: allowedSourceIPsDescription,
  }),
  blockedSourceIPs: z.array(z.string()).optional().meta({
    markdownDescription: blockedSourceIPsDescription,
  }),
});

const createFilter = (description: string) =>
  z
    .object({
      type: z.literal("filter").meta({
        markdownDescription: description,
      }),
      settings: filterSettings.optional().meta({
        markdownDescription: description,
      }),
    })
    .meta({
      markdownDescription: description,
    });

export const tcpFilter = createFilter(filterDescription);
export const udpFilter = createFilter(filterUdpDescription);
