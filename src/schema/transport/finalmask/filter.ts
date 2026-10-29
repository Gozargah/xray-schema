import z from "zod";
import allowedSourceIPsDescription from "./allowedSourceIPs.md?raw";
import blockedSourceIPsDescription from "./blockedSourceIPs.md?raw";

export const createFilterSettings = (description: string) =>
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
