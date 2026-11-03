import z from "zod";
import allowedSourceIPsDescription from "./allowedSourceIPs.md?raw";
import blockedSourceIPsDescription from "./blockedSourceIPs.md?raw";

export const filterSettings = z.object({
  allowedSourceIPs: z.array(z.string()).optional().meta({
    markdownDescription: allowedSourceIPsDescription,
  }),
  blockedSourceIPs: z.array(z.string()).optional().meta({
    markdownDescription: blockedSourceIPsDescription,
  }),
});
