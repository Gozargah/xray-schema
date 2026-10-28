import z from "zod";
import filterDescription from "./filter.md?raw";
import filterUdpDescription from "./filterUdp.md?raw";
import allowedSourceIPsDescription from "./allowedSourceIPs.md?raw";
import blockedSourceIPsDescription from "./blockedSourceIPs.md?raw";

const createSettings = (description: string) =>
  z
    .object({
      allowedSourceIPs: z.array(z.string()).optional().meta({
        markdownDescription: allowedSourceIPsDescription,
      }),
      blockedSourceIPs: z.array(z.string()).optional().meta({
        markdownDescription: blockedSourceIPsDescription,
      }),
    })
    .meta({
      markdownDescription: description,
    });

export const tcpFilter = z
  .object({
    type: z.literal("filter").meta({
      markdownDescription: filterDescription,
    }),
    settings: createSettings(filterDescription),
  })
  .meta({
    markdownDescription: filterDescription,
  });

export const udpFilter = z
  .object({
    type: z.literal("filter").meta({
      markdownDescription: filterUdpDescription,
    }),
    settings: createSettings(filterUdpDescription),
  })
  .meta({
    markdownDescription: filterUdpDescription,
  });
